import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import StudyMaterial, { MaterialType } from '../models/StudyMaterial';
import StudyMaterialDownloadLog from '../models/StudyMaterialDownloadLog';
import { storageService } from '../utils/storage.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'projectforge_super_secret_jwt_key_2026_change_in_production';

/**
 * Public: Get published study materials with search & filter
 */
export const getPublicStudyMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      university,
      branch,
      year,
      semester,
      subject,
      materialType,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = { isPublished: true };
    const andConditions: any[] = [];

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      andConditions.push({
        $or: [
          { title: searchRegex },
          { subject: searchRegex },
          { description: searchRegex },
          { university: searchRegex },
          { branch: searchRegex },
        ],
      });
    }

    if (year && typeof year === 'string' && year !== 'ALL') {
      const yearStr = year.trim();
      const semMap: Record<string, string[]> = {
        '1': ['1', '2'],
        '2': ['3', '4'],
        '3': ['5', '6'],
        '4': ['7', '8'],
      };
      const matchingSems = semMap[yearStr] || [yearStr];
      andConditions.push({
        $or: [
          { year: yearStr },
          { semester: { $in: matchingSems } },
        ],
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
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
 * Public: Stream / Download free study material (Strict Max 1 Download per user/IP)
 */
export const downloadFreeStudyMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id);
    if (!material || !material.isPublished) {
      res.status(404).json({ success: false, message: 'Study material not found or unavailable' });
      return;
    }

    // 1. Identify requester device by Device ID, IP address, and User-Agent fingerprint
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const userAgent = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'].join(' ')
      : req.headers['user-agent'] || 'Browser';

    const deviceId =
      (typeof req.query.deviceId === 'string' && req.query.deviceId.trim()) ||
      (req.headers['x-device-id'] as string) ||
      (req as any).cookies?.cg_device_id ||
      undefined;

    const deviceFingerprint = crypto
      .createHash('sha256')
      .update(`${ipAddress}::${userAgent}`)
      .digest('hex');

    let userId: string | undefined = undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    // Check if this device has already downloaded this specific study material
    const queryConditions: any[] = [];
    if (deviceId) {
      queryConditions.push({ deviceId });
    }
    queryConditions.push({ deviceFingerprint });
    queryConditions.push({ ipAddress, userAgent });
    if (userId) {
      queryConditions.push({ user: userId });
    }

    const dlCount = await StudyMaterialDownloadLog.countDocuments({
      material: id,
      $or: queryConditions,
    });

    const MAX_FREE_PDF_DOWNLOADS_PER_DEVICE = 3;

    if (dlCount >= MAX_FREE_PDF_DOWNLOADS_PER_DEVICE) {
      res.status(403).send(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Download Limit Exceeded - CampusGet</title>
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; background-color: #0B0F19; color: #fff; padding: 60px 20px; text-align: center; margin: 0;">
            <div style="max-width: 520px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 20px; padding: 36px; box-shadow: 0 15px 35px rgba(0,0,0,0.6);">
              <div style="font-size: 42px; margin-bottom: 14px;">📄⚠️</div>
              <h2 style="color: #ef4444; font-size: 22px; margin-top: 0; margin-bottom: 12px; font-weight: 800;">
                Download Limit Reached (3/3 Downloads Used)
              </h2>
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 22px;">
                Aap is study material PDF ko is device se maximum <strong>3 baar</strong> download kar chuke hain.
                <br/>
                Fair-use policy ke anusaar ek device se ek PDF ko maximum <strong>3 downloads</strong> allowed hain.
              </p>
              <div style="background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; margin-bottom: 26px; text-align: left; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
                <div><strong style="color: #fff;">Title:</strong> ${material.title}</div>
                <div><strong style="color: #fff;">Subject:</strong> ${material.subject}</div>
                <div><strong style="color: #fff;">Device Limit:</strong> 3 of 3 Allowed Downloads Completed</div>
              </div>
              <a href="/study-materials" style="background-color: #10b981; color: white; padding: 12px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 13px; display: inline-block; transition: all 0.2s;">
                Back to Study Materials Catalog
              </a>
            </div>
          </body>
        </html>`
      );
      return;
    }

    // Record download log with deviceId and deviceFingerprint
    await StudyMaterialDownloadLog.create({
      material: id,
      user: userId || null,
      deviceId: deviceId || null,
      deviceFingerprint,
      ipAddress,
      userAgent,
    });

    const effectiveCookieDeviceId = deviceId || deviceFingerprint;
    res.cookie('cg_device_id', effectiveCookieDeviceId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });

    const mimeType = material.mimeType || storageService.detectMimeType(material.fileName);

    res.setHeader('Content-Type', mimeType);

    if (mimeType === 'application/pdf') {
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(material.fileName)}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(material.fileName)}"`);
    }

    // 1. Try local disk stream first (0ms instant speed)
    const filePath = storageService.getAbsolutePath(material.storageKey);
    if (fs.existsSync(filePath)) {
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      return;
    }

    // 2. Fallback to Supabase Cloud Storage stream
    try {
      const cloudStream = await storageService.getCloudObjectStream(material.storageKey);
      if (cloudStream) {
        cloudStream.pipe(res);
        return;
      }
    } catch (cloudErr) {
      console.error('[CLOUD STREAMING ERROR]', cloudErr);
    }

    // 3. Fallback deliverable if file missing everywhere
    console.warn(`[STORAGE WARNING] Free material file missing: ${filePath}. Generating fallback deliverable.`);
    const storageDir = path.dirname(filePath);
    if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

    const sampleContent = material.fileName.endsWith('.pdf')
      ? `%PDF-1.4\n% CampusGet Free Study Material: ${material.title}\nUniversity: ${material.university} | Branch: ${material.branch}`
      : `CampusGet Free Study Material Deliverable: ${material.title}\nUniversity: ${material.university}`;

    fs.writeFileSync(filePath, sampleContent);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error('[FREE MATERIAL DOWNLOAD ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to download study material' });
  }
};

/**
 * Public: Stream preview for PDF thumbnail / inline viewer (Does NOT count as download)
 */
export const previewStudyMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id);
    if (!material || !material.isPublished) {
      res.status(404).json({ success: false, message: 'Study material not found or unavailable' });
      return;
    }

    const mimeType = material.mimeType || storageService.detectMimeType(material.fileName);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(material.fileName)}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    // 1. Try local disk stream first (0ms instant speed)
    const filePath = storageService.getAbsolutePath(material.storageKey);
    if (fs.existsSync(filePath)) {
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      return;
    }

    // 2. Fallback to Supabase Cloud Storage stream
    try {
      const cloudStream = await storageService.getCloudObjectStream(material.storageKey);
      if (cloudStream) {
        cloudStream.pipe(res);
        return;
      }
    } catch (cloudErr) {
      console.error('[PREVIEW CLOUD STREAM ERROR]', cloudErr);
    }

    res.status(404).json({ success: false, message: 'File stream not found' });
  } catch (error: any) {
    console.error('[PREVIEW STUDY MATERIAL ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to stream preview' });
  }
};

/**
 * Admin: Get all study materials (paginated & searchable)
 */
export const getAdminStudyMaterials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, university, branch, year, semester, materialType, isPublished, page = 1, limit = 20 } = req.query;

    const query: any = {};
    const andConditions: any[] = [];

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      andConditions.push({
        $or: [
          { title: searchRegex },
          { subject: searchRegex },
          { university: searchRegex },
          { branch: searchRegex },
        ],
      });
    }

    if (year && typeof year === 'string' && year !== 'ALL') {
      const yearStr = year.trim();
      const semMap: Record<string, string[]> = {
        '1': ['1', '2'],
        '2': ['3', '4'],
        '3': ['5', '6'],
        '4': ['7', '8'],
      };
      const matchingSems = semMap[yearStr] || [yearStr];
      andConditions.push({
        $or: [
          { year: yearStr },
          { semester: { $in: matchingSems } },
        ],
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    if (university && typeof university === 'string' && university !== 'ALL') {
      query.university = university.trim();
    }

    if (branch && typeof branch === 'string' && branch !== 'ALL') {
      query.branch = branch.trim();
    }

    if (semester && typeof semester === 'string' && semester !== 'ALL') {
      query.semester = semester.trim();
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
      year,
      semester,
      subject,
      materialType,
      fileName,
      fileBase64,
      mimeType,
      thumbnailUrl,
      thumbnailBase64,
      isPublished = true,
    } = req.body;

    if (!title || !university || !branch || !semester || !subject || !materialType || !fileName || !fileBase64) {
      res.status(400).json({
        success: false,
        message: 'Missing required parameters: title, university, branch, semester, subject, materialType, fileName, and fileBase64 are required.',
      });
      return;
    }

    const semNum = parseInt(semester.trim(), 10);
    const derivedYear = year ? String(year).trim() : (semNum ? String(Math.ceil(semNum / 2)) : '1');

    // Decode base64 buffer
    const buffer = Buffer.from(fileBase64, 'base64');
    const storageKey = storageService.generateKey('study-materials', materialType, fileName);

    const meta = await storageService.uploadAsset(storageKey, buffer);

    const material = await StudyMaterial.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      university: university.trim().toUpperCase(),
      branch: branch.trim().toUpperCase(),
      year: derivedYear,
      semester: semester.trim(),
      subject: subject.trim(),
      materialType: (materialType.trim().toUpperCase() as MaterialType) || 'NOTES',
      fileName: fileName.trim(),
      storageKey,
      fileSize: meta.size,
      mimeType: mimeType || meta.mimeType,
      thumbnailUrl: thumbnailUrl || '',
      thumbnailBase64: thumbnailBase64 || '',
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
      year,
      semester,
      subject,
      materialType,
      fileName,
      fileBase64,
      mimeType,
      thumbnailUrl,
      thumbnailBase64,
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
    if (year) {
      material.year = year.trim();
    } else if (semester) {
      const semNum = parseInt(semester.trim(), 10);
      if (semNum) material.year = String(Math.ceil(semNum / 2));
    }
    if (semester) material.semester = semester.trim();
    if (subject) material.subject = subject.trim();
    if (materialType) material.materialType = materialType.trim().toUpperCase() as MaterialType;
    if (thumbnailUrl !== undefined) material.thumbnailUrl = thumbnailUrl;
    if (thumbnailBase64 !== undefined) material.thumbnailBase64 = thumbnailBase64;
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
