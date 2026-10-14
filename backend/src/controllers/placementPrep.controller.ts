import { Request, Response } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product';
import ProductAsset from '../models/ProductAsset';
import Category from '../models/Category';
import Entitlement from '../models/Entitlement';
import { storageService } from '../utils/storage.service';
import { AuthRequest } from '../middlewares/auth.middleware';

// Helper: Ensure default Category exists for Career & Placements
const getOrCreatePlacementCategory = async () => {
  let cat = await Category.findOne({ slug: 'career-placements' });
  if (!cat) {
    cat = await Category.create({
      name: 'Career & Placements',
      slug: 'career-placements',
      description: 'Placement preparation guides, DSA sheets, career roadmaps, and tech interview handbooks.',
      order: 7,
    });
  }
  return cat;
};

/**
 * Public: Get published placement prep materials with filters & pagination
 */
export const getPublicPlacementPrep = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      track,
      difficulty,
      role,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = {
      productType: 'placement_prep',
      isPublished: true,
    };

    if (track && typeof track === 'string' && track !== 'ALL') {
      query.careerTrack = { $regex: new RegExp(`^${track.trim()}$`, 'i') };
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'ALL') {
      query.difficulty = difficulty.trim();
    }

    if (role && typeof role === 'string' && role !== 'ALL') {
      query.targetRole = { $regex: new RegExp(role.trim(), 'i') };
    }

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { fullDescription: searchRegex },
        { careerTrack: searchRegex },
        { targetRole: searchRegex },
        { features: searchRegex },
      ];
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'popular') sortOptions = { downloadCount: -1 };

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(String(limit), 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [materials, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('assets', 'title assetType originalName size mimeType')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
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
    console.error('[GET PUBLIC PLACEMENT PREP ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch placement materials' });
  }
};

/**
 * Public: Get single placement prep material by slug or ID
 */
export const getPlacementPrepBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const isId = mongoose.isValidObjectId(slug);

    const material = await Product.findOne({
      $or: [{ slug }, ...(isId ? [{ _id: slug }] : [])],
      productType: 'placement_prep',
      isPublished: true,
    })
      .populate('category', 'name slug')
      .populate('assets', 'title assetType originalName size mimeType');

    if (!material) {
      res.status(404).json({ success: false, message: 'Placement guide or roadmap not found' });
      return;
    }

    // Check if authenticated user already owns an entitlement for this material
    let isOwned = false;
    let entitlementId: string | null = null;

    if (req.user && req.user.id) {
      const entitlement = await Entitlement.findOne({
        user: req.user.id,
        product: material._id,
        isRevoked: false,
      });

      if (entitlement) {
        isOwned = true;
        entitlementId = String(entitlement._id);
      }
    }

    // Related materials in the same track
    const relatedMaterials = await Product.find({
      productType: 'placement_prep',
      careerTrack: material.careerTrack,
      _id: { $ne: material._id },
      isPublished: true,
    })
      .select('title slug shortDescription price originalPrice thumbnail careerTrack targetRole pageCount difficulty')
      .limit(3);

    res.status(200).json({
      success: true,
      material,
      isOwned,
      entitlementId,
      relatedMaterials,
    });
  } catch (error: any) {
    console.error('[GET PLACEMENT PREP BY SLUG ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch placement guide details' });
  }
};

/**
 * Admin: Get all placement prep items (paginated & searchable, includes drafts)
 */
export const getAdminPlacementPrep = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, track, isPublished, page = 1, limit = 20 } = req.query;

    const query: any = { productType: 'placement_prep' };

    if (track && typeof track === 'string' && track !== 'ALL') {
      query.careerTrack = track.trim();
    }

    if (isPublished !== undefined && isPublished !== 'ALL') {
      query.isPublished = isPublished === 'true';
    }

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { targetRole: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [materials, total] = await Promise.all([
      Product.find(query)
        .populate('assets', 'title originalName size mimeType storageKey')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
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
    console.error('[ADMIN GET PLACEMENT PREP ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin placement materials' });
  }
};

/**
 * Admin: Create & Upload new Placement E-Book / Roadmap
 */
export const createPlacementPrep = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      slug,
      careerTrack = 'Placement Prep',
      targetRole = 'Software Engineer',
      difficulty = 'Intermediate',
      price = 99,
      originalPrice = 499,
      pageCount = 100,
      author = 'CampusGet Placement Cell',
      shortDescription,
      fullDescription,
      features = [],
      thumbnail,
      fileBase64,
      fileName,
      isPublished = true,
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ success: false, message: 'Title is required' });
      return;
    }

    const category = await getOrCreatePlacementCategory();

    const cleanTitle = title.trim();
    const generatedSlug = (slug || cleanTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check slug uniqueness
    const existing = await Product.findOne({ slug: generatedSlug });
    const finalSlug = existing ? `${generatedSlug}-${Date.now().toString().slice(-4)}` : generatedSlug;

    const discountPercentage =
      originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    let storageKey = '';
    let assetId: mongoose.Types.ObjectId | null = null;
    let fileSize = 0;

    // Handle PDF upload if base64 provided
    if (fileBase64 && fileName) {
      const buffer = Buffer.from(fileBase64, 'base64');
      fileSize = buffer.length;
      storageKey = storageService.generateKey('placement-prep', careerTrack, fileName);

      await storageService.uploadAsset(storageKey, buffer);
    } else {
      // Fallback deliverable file key
      storageKey = `packages/placement-prep/${finalSlug}.pdf`;
      const fallbackPath = storageService.getAbsolutePath(storageKey);
      const fallbackDir = path.dirname(fallbackPath);
      if (!fs.existsSync(fallbackDir)) fs.mkdirSync(fallbackDir, { recursive: true });
      fs.writeFileSync(
        fallbackPath,
        `%PDF-1.4\n% CampusGet Placement & Roadmap E-Book: ${cleanTitle}\nTrack: ${careerTrack} | Target: ${targetRole}\nPages: ${pageCount}\n`
      );
      fileSize = 1024;
    }

    const defaultCover = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

    const product = await Product.create({
      title: cleanTitle,
      slug: finalSlug,
      shortDescription: shortDescription || `${cleanTitle} - Comprehensive placement preparation guide & roadmap for ${targetRole}.`,
      fullDescription: fullDescription || `${cleanTitle}\n\nKey Highlights:\n- Complete step-by-step career roadmap\n- High-yield interview QA & patterns\n- Printable cheatsheets & revision notes.`,
      category: category._id,
      techStack: [careerTrack, targetRole],
      tags: ['Placement', 'Career', 'Roadmap', 'E-Book', careerTrack],
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price),
      discountPercentage,
      thumbnail: thumbnail || defaultCover,
      features: Array.isArray(features) && features.length > 0 ? features : [
        'Curated Interview Questions & Step-by-Step Solutions',
        'Printable Cheat Sheets & Fast Revision Notes',
        'Company-Specific Interview Patterns',
        'Instant PDF Download Access',
      ],
      deliverables: [
        {
          name: `${cleanTitle} (.PDF E-Book)`,
          included: true,
          fileKey: storageKey,
        },
      ],
      difficulty: difficulty as any,
      productType: 'placement_prep',
      careerTrack,
      targetRole,
      pageCount: Number(pageCount) || 100,
      author: author || 'CampusGet Placement Cell',
      isPublished: isPublished !== false,
      maxDownloadsAllowed: 30,
      downloadCount: 0,
    });

    // Create attached ProductAsset
    const asset = await ProductAsset.create({
      product: product._id,
      assetType: 'DOCUMENTATION',
      title: `${cleanTitle} (.PDF Full E-Book)`,
      originalName: fileName || `${finalSlug}.pdf`,
      storageKey,
      mimeType: 'application/pdf',
      size: fileSize,
      isActive: true,
    });

    product.assets = [asset._id];
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Placement material uploaded successfully!',
      material: product,
    });
  } catch (error: any) {
    console.error('[CREATE PLACEMENT PREP ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create placement material' });
  }
};

/**
 * Admin: Update Placement E-Book / Roadmap
 */
export const updatePlacementPrep = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findOne({ _id: id, productType: 'placement_prep' });
    if (!product) {
      res.status(404).json({ success: false, message: 'Placement material not found' });
      return;
    }

    if (updates.price !== undefined && updates.originalPrice !== undefined) {
      const p = Number(updates.price);
      const op = Number(updates.originalPrice);
      updates.discountPercentage = op > p ? Math.round(((op - p) / op) * 100) : 0;
    }

    // Handle replacement PDF if provided
    if (updates.fileBase64 && updates.fileName) {
      const buffer = Buffer.from(updates.fileBase64, 'base64');
      const storageKey = storageService.generateKey(
        'placement-prep',
        updates.careerTrack || product.careerTrack || 'guides',
        updates.fileName
      );

      await storageService.uploadAsset(storageKey, buffer);

      // Update or create ProductAsset
      let asset = await ProductAsset.findOne({ product: product._id, isActive: true });
      if (asset) {
        asset.storageKey = storageKey;
        asset.originalName = updates.fileName;
        asset.size = buffer.length;
        await asset.save();
      } else {
        asset = await ProductAsset.create({
          product: product._id,
          assetType: 'DOCUMENTATION',
          title: `${updates.title || product.title} (.PDF E-Book)`,
          originalName: updates.fileName,
          storageKey,
          mimeType: 'application/pdf',
          size: buffer.length,
          isActive: true,
        });
        product.assets = [asset._id];
      }

      product.deliverables = [
        {
          name: `${updates.title || product.title} (.PDF E-Book)`,
          included: true,
          fileKey: storageKey,
        },
      ];
    }

    delete updates.fileBase64;
    delete updates.fileName;

    Object.assign(product, updates);
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Placement material updated successfully!',
      material: product,
    });
  } catch (error: any) {
    console.error('[UPDATE PLACEMENT PREP ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to update placement material' });
  }
};

/**
 * Admin: Delete Placement E-Book / Roadmap
 */
export const deletePlacementPrep = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, productType: 'placement_prep' });
    if (!product) {
      res.status(404).json({ success: false, message: 'Placement material not found' });
      return;
    }

    // Soft delete or remove
    await Product.findByIdAndDelete(id);
    await ProductAsset.deleteMany({ product: id });

    res.status(200).json({
      success: true,
      message: 'Placement material deleted successfully',
    });
  } catch (error: any) {
    console.error('[DELETE PLACEMENT PREP ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to delete placement material' });
  }
};

/**
 * Helper: Auto-seed initial placement prep materials if 0 exist in DB
 */
export const seedInitialPlacementMaterials = async () => {
  try {
    const count = await Product.countDocuments({ productType: 'placement_prep' });
    if (count > 0) return;

    console.log('[SEED] Initializing 5 curated Placement & Roadmap packages...');
    const category = await getOrCreatePlacementCategory();

    const initialData = [
      {
        title: 'DSA 450 Mastery Guide & LeetCode Pattern Blueprint',
        slug: 'dsa-450-mastery-guide',
        careerTrack: 'DSA & Coding',
        targetRole: 'Software Engineer (SDE I / II)',
        difficulty: 'Intermediate',
        price: 99,
        originalPrice: 499,
        pageCount: 240,
        author: 'CampusGet Placement Cell',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        shortDescription: '450 high-frequency DSA questions categorized by algorithm patterns with optimal C++, Java, & Python solutions and space-time complexity analysis.',
        fullDescription: 'Master data structures & algorithms for campus placements and off-campus technical interviews.\n\nIncluded Modules:\n1. Arrays, Sliding Window & Two Pointers\n2. Binary Search & Bit Manipulation Patterns\n3. Linked List, Stack & Queue Traversal Techniques\n4. Binary Trees, BST & Trie Algorithms\n5. Graph Algorithms (BFS, DFS, Dijkstra, Topo Sort)\n6. Dynamic Programming Patterns (0/1 Knapsack, LCS, LIS)\n7. Printable 1-Page DSA Revision Cheatsheet',
        features: [
          '450 Handpicked Questions with Optimal Approaches',
          'Complete C++, Java, and Python Code Explanations',
          'Time & Space Complexity Visual Comparisons',
          'Printable 1-Page Quick Revision Cheatsheet',
        ],
      },
      {
        title: 'Full-Stack Web Dev Roadmap & Placement Interview Playbook (2026)',
        slug: 'fullstack-roadmap-interview-playbook',
        careerTrack: 'Career Roadmap',
        targetRole: 'Full Stack / MERN Developer',
        difficulty: 'Beginner',
        price: 79,
        originalPrice: 399,
        pageCount: 165,
        author: 'CampusGet Editorial',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        shortDescription: 'Complete 2026 developer blueprint covering HTML/CSS/JS, React 19, Node.js, Express, MongoDB, Docker, Git workflows, and 120+ interview Q&As.',
        fullDescription: 'The step-by-step career transformation blueprint from beginner to hired Full-Stack engineer.\n\nIncluded Modules:\n1. 6-Month Roadmap with Weekly Milestones\n2. Deep Dive: React Hooks, State Management & Vite\n3. Backend REST Architecture, JWT Auth & Security Best Practices\n4. Database Modeling: MongoDB & PostgreSQL Schema Design\n5. System Design Fundamentals for Fresher Interviews\n6. 120+ Real Interview Questions Asked at Top Tech Startups',
        features: [
          'Interactive 6-Month Step-by-Step Milestone Plan',
          'System Design Basics for Junior Developers',
          '120+ Real Technical Interview Questions & Answers',
          'Resume Templates & GitHub Portfolio Guidelines',
        ],
      },
      {
        title: 'Core CS Handbooks: OS, DBMS, Computer Networks & OOPs Cheatsheets',
        slug: 'core-cs-handbook-os-dbms-cn-oops',
        careerTrack: 'Core CS (OS, DBMS, CN)',
        targetRole: 'Campus Placements (All Tech Companies)',
        difficulty: 'Beginner',
        price: 49,
        originalPrice: 299,
        pageCount: 180,
        author: 'CampusGet Academic Team',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        shortDescription: 'Concise, high-impact revision notes and the top 200 viva & interview questions for Operating Systems, DBMS, Computer Networks, and Object-Oriented Programming.',
        fullDescription: 'Never struggle in technical viva or fundamental round interviews again.\n\nIncluded Modules:\n1. Operating Systems: Process vs Thread, Deadlocks, Paging, Virtual Memory\n2. DBMS: ACID Properties, Normalization (1NF to BCNF), Indexing, SQL Queries\n3. Computer Networks: OSI 7-Layer Model, TCP vs UDP, IP Addressing, DNS, HTTP/HTTPS\n4. OOPs Concepts: Polymorphism, Inheritance, Encapsulation, Abstraction with Real Examples\n5. Top 50 Most Repeated Interview Questions Per Subject',
        features: [
          'Top 200 Core CS Interview & Viva Questions with Answers',
          'SQL Query Practice Bank for Technical Rounds',
          'High-Yield Memory & Networking Cheat Diagrams',
          'Clean, Printable Layout for Rapid 48-Hour Exam Revision',
        ],
      },
      {
        title: 'Campus Placement Cracker: TCS, Infosys, Wipro, Accenture & Amazon Guide',
        slug: 'campus-placement-cracker-company-guide',
        careerTrack: 'Placement Prep',
        targetRole: 'Campus Fresher / On-Campus Drives',
        difficulty: 'Intermediate',
        price: 99,
        originalPrice: 599,
        pageCount: 220,
        author: 'CampusGet Placement Cell',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
        shortDescription: 'All-in-one placement preparation handbook covering aptitude shortcuts, reasoning tricks, pseudocode questions, and HR interview answers using the STAR method.',
        fullDescription: 'Comprehensive preparation manual for mass recruitment drives and product-based hiring.\n\nIncluded Modules:\n1. Quantitative Aptitude Shortcuts & Formulas (Speed Math)\n2. Logical & Verbal Reasoning Question Bank\n3. Technical Pseudocode & Coding Round Questions\n4. Behavioral & HR Interview Questions with STAR Method Answers\n5. Salary Negotiation & Email Templates for Freshers',
        features: [
          'Company-Specific Exam Formats & Cut-off Insights',
          '300+ Aptitude & Reasoning Solved Practice Problems',
          'STAR Method Responses for HR & Managerial Rounds',
          'Instant Direct PDF Download & Lifetime Access',
        ],
      },
      {
        title: 'AI & Data Science Career Roadmap & Interview Playbook (2026)',
        slug: 'ai-data-science-roadmap-playbook',
        careerTrack: 'Career Roadmap',
        targetRole: 'AI Engineer / Data Scientist / ML Intern',
        difficulty: 'Advanced',
        price: 129,
        originalPrice: 699,
        pageCount: 195,
        author: 'CampusGet AI Lab',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
        shortDescription: 'The modern roadmap to landing AI & ML roles: Python for data science, machine learning algorithms, deep learning fundamentals, Generative AI, and LLM engineering.',
        fullDescription: 'Fast-track your transition into Artificial Intelligence and Machine Learning.\n\nIncluded Modules:\n1. Complete Math for ML: Linear Algebra, Calculus, Probability\n2. Supervised & Unsupervised Learning Algorithms Explained\n3. PyTorch & TensorFlow Deep Learning Pipelines\n4. Generative AI, RAG Systems, & Prompt Engineering Best Practices\n5. Top 100 AI/ML Technical Interview Questions & Case Studies',
        features: [
          'End-to-End Roadmap from Math Foundations to Production GenAI',
          'Real Machine Learning Case Studies & System Architectures',
          '100+ Applied Machine Learning Interview Questions',
          'Printable Cheat Sheets for Scikit-Learn & PyTorch',
        ],
      },
    ];

    for (const item of initialData) {
      const discountPercentage = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
      const storageKey = `packages/placement-prep/${item.slug}.pdf`;

      // Create fallback deliverable PDF on disk if not exists
      const fallbackPath = storageService.getAbsolutePath(storageKey);
      const fallbackDir = path.dirname(fallbackPath);
      if (!fs.existsSync(fallbackDir)) fs.mkdirSync(fallbackDir, { recursive: true });
      if (!fs.existsSync(fallbackPath)) {
        fs.writeFileSync(
          fallbackPath,
          `%PDF-1.4\n% CampusGet Placement & Roadmap Deliverable: ${item.title}\nCareer Track: ${item.careerTrack}\nTarget Role: ${item.targetRole}\nPages: ${item.pageCount}\n`
        );
      }

      const product = await Product.create({
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription,
        fullDescription: item.fullDescription,
        category: category._id,
        techStack: [item.careerTrack, item.targetRole],
        tags: ['Placement', 'Career', 'Roadmap', 'E-Book', item.careerTrack],
        price: item.price,
        originalPrice: item.originalPrice,
        discountPercentage,
        thumbnail: item.thumbnail,
        features: item.features,
        deliverables: [
          {
            name: `${item.title} (.PDF E-Book)`,
            included: true,
            fileKey: storageKey,
          },
        ],
        difficulty: item.difficulty as any,
        productType: 'placement_prep',
        careerTrack: item.careerTrack,
        targetRole: item.targetRole,
        pageCount: item.pageCount,
        author: item.author,
        isPublished: true,
        maxDownloadsAllowed: 30,
        downloadCount: 0,
      });

      const asset = await ProductAsset.create({
        product: product._id,
        assetType: 'DOCUMENTATION',
        title: `${item.title} (.PDF Full E-Book)`,
        originalName: `${item.slug}.pdf`,
        storageKey,
        mimeType: 'application/pdf',
        size: 2048,
        isActive: true,
      });

      product.assets = [asset._id];
      await product.save();
      console.log(`[SEED] Created Placement Prep: ${item.title}`);
    }
  } catch (err) {
    console.error('[SEED PLACEMENT PREP ERROR]', err);
  }
};
