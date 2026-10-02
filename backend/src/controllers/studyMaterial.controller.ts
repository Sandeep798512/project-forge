import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import StudyMaterial, { MaterialType } from '../models/StudyMaterial';
import { storageService } from '../utils/storage.service';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Public: Get published study materials with search & filter
 */
export const getPublicStudyMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      university,
      branch,
      semester,
      subject,
      materialType,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = { isPublished: true };

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { subject: searchRegex },
        { description: searchRegex },
        { university: searchRegex },
        { branch: searchRegex },
      ];
    }

    if (university && typeof university === 'string' && university !== 'ALL') {
      query.university = { $regex: new RegExp(`^${university.trim()}$`, 'i') };
    }

    if (branch && typeof branch === 'string' && branch !== 'ALL') {
      query.branch = { $regex: new RegExp(`^${branch.trim()}$`, 'i') };
    }

    if (semester && typeof semester === 'string' && semester !== 'ALL') {
      query.semester = semester.trim();
    }

    if (subject && typeof subject === 'string' && subject.trim()) {
      query.subject = { $regex: new RegExp(subject.trim(), 'i') };
    }

    if (materialType && typeof materialType === 'string' && materialType !== 'ALL') {
      query.materialType = materialType.trim().toUpperCase();
    }

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(String(limit), 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [materials, total] = await Promise.all([
      StudyMaterial.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      StudyMaterial.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      materials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('[GET PUBLIC STUDY MATERIALS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch study materials' });
  }
};

/**
 * Public: Stream / Download free study material without creating DB logs or requiring authentication
 */
export const downloadFreeStudyMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id);
    if (!material || !material.isPublished) {
      res.status(404).json({ success: false, message: 'Study material not found or unavailable' });
      return;
    }

    const filePath = storageService.getAbsolutePath(material.storageKey);

    // Fallback if file missing on disk (for sample data)
    if (!fs.existsSync(filePath)) {
      console.warn(`[STORAGE WARNING] Free material file missing on disk: ${filePath}. Generating fallback deliverable.`);
      const storageDir = path.dirname(filePath);
      if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

      const sampleContent = material.fileName.endsWith('.pdf')
        ? `%PDF-1.4\n% CampusGet Free Study Material: ${material.title}\nUniversity: ${material.university} | Branch: ${material.branch}`
        : `CampusGet Free Study Material Deliverable: ${material.title}\nUniversity: ${material.university}`;

      fs.writeFileSync(filePath, sampleContent);
    }

    const mimeType = material.mimeType || storageService.detectMimeType(material.fileName);

    res.setHeader('Content-Type', mimeType);

    if (mimeType === 'application/pdf') {
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(material.fileName)}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(material.fileName)}"`);
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error('[FREE MATERIAL DOWNLOAD ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to download study material' });
  }
};

/**
 * Admin: Get all study materials (paginated & searchable)
 */
export const getAdminStudyMaterials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, university, branch, materialType, isPublished, page = 1, limit = 20 } = req.query;

    const query: any = {};

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { subject: searchRegex },
        { university: searchRegex },
        { branch: searchRegex },
      ];
    }

    if (university && typeof university === 'string' && university !== 'ALL') {
      query.university = university.trim();
    }

    if (branch && typeof branch === 'string' && branch !== 'ALL') {
      query.branch = branch.trim();
    }

    if (materialType && typeof materialType === 'string' && materialType !== 'ALL') {
      query.materialType = materialType.trim();
    }

    if (isPublished !== undefined && isPublished !== 'ALL') {
      query.isPublished = isPublished === 'true';
    }

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [materials, total] = await Promise.all([
      StudyMaterial.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      StudyMaterial.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      materials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('[ADMIN STUDY MATERIALS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin study materials' });
  }
};

/**
 * Admin: Create / Upload new study material
 */
export const createStudyMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      university,
      branch,
      semester,
      subject,
      materialType,
      fileName,
      fileBase64,
      mimeType,
      isPublished = true,
    } = req.body;

    if (!title || !university || !branch || !semester || !subject || !materialType || !fileName || !fileBase64) {
      res.status(400).json({
        success: false,
        message: 'Missing required parameters: title, university, branch, semester, subject, materialType, fileName, and fileBase64 are required.',
      });
      return;
    }

    // Decode base64 buffer
    const buffer = Buffer.from(fileBase64, 'base64');
    const storageKey = storageService.generateKey('study-materials', materialType, fileName);

    const meta = await storageService.uploadAsset(storageKey, buffer);

    const material = await StudyMaterial.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      university: university.trim().toUpperCase(),
      branch: branch.trim().toUpperCase(),
      semester: semester.trim(),
      subject: subject.trim(),
      materialType: (materialType.trim().toUpperCase() as MaterialType) || 'NOTES',
      fileName: fileName.trim(),
      storageKey,
      fileSize: meta.size,
      mimeType: mimeType || meta.mimeType,
      isPublished: Boolean(isPublished),
    });

    res.status(201).json({ success: true, material });
  } catch (error: any) {
    console.error('[CREATE STUDY MATERIAL ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create study material' });
  }
};

/**
 * Admin: Update study material metadata or toggle published
 */
export const updateStudyMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      university,
      branch,
      semester,
      subject,
      materialType,
      fileName,
      fileBase64,
      mimeType,
      isPublished,
    } = req.body;

    const material = await StudyMaterial.findById(id);
    if (!material) {
      res.status(404).json({ success: false, message: 'Study material not found' });
      return;
    }

    if (title) material.title = title.trim();
    if (description !== undefined) material.description = description.trim();
    if (university) material.university = university.trim().toUpperCase();
    if (branch) material.branch = branch.trim().toUpperCase();
    if (semester) material.semester = semester.trim();
    if (subject) material.subject = subject.trim();
    if (materialType) material.materialType = materialType.trim().toUpperCase() as MaterialType;
    if (isPublished !== undefined) material.isPublished = Boolean(isPublished);

    // Handle replacement file if base64 provided
    if (fileBase64 && fileName) {
      // Delete old file
      await storageService.deleteAsset(material.storageKey);

      const buffer = Buffer.from(fileBase64, 'base64');
      const newStorageKey = storageService.generateKey('study-materials', material.materialType, fileName);
      const meta = await storageService.uploadAsset(newStorageKey, buffer);

      material.fileName = fileName.trim();
      material.storageKey = newStorageKey;
      material.fileSize = meta.size;
      material.mimeType = mimeType || meta.mimeType;
    }

    await material.save();

    res.status(200).json({ success: true, material });
  } catch (error: any) {
    console.error('[UPDATE STUDY MATERIAL ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update study material' });
  }
};

/**
 * Admin: Delete study material permanently
 */
export const deleteStudyMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id);
    if (!material) {
      res.status(404).json({ success: false, message: 'Study material not found' });
      return;
    }

    // Delete asset file from disk/storage
    await storageService.deleteAsset(material.storageKey);

    // Remove DB document
    await StudyMaterial.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Study material deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE STUDY MATERIAL ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to delete study material' });
  }
};
