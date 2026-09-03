import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import ProductAsset, { AssetType } from '../models/ProductAsset';
import { hashPassword } from '../utils/passwords';
import { connectDB } from '../config/db';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[SEED] Connected to Database for seeding...');

    // Clear existing products, categories, users, assets
    await User.deleteMany({ role: 'admin' });
    await Category.deleteMany({});
    await Product.deleteMany({});
    await ProductAsset.deleteMany({});

    // 1. Create Default Admin User
    const adminPasswordHash = await hashPassword('Admin@123456');
    const adminUser = await User.create({
      name: 'ProjectForge Super Admin',
      email: 'admin@projectforge.dev',
      password: adminPasswordHash,
      role: 'admin',
      rbacRole: 'SUPER_ADMIN',
      isVerified: true,
      referralCode: 'FORGE-ADMIN01',
    });
    console.log(`[SEED] Created default admin account: ${adminUser.email} / Admin@123456`);

    // 2. Create Categories
    const categories = await Category.insertMany([
      { name: 'Full Stack', slug: 'full-stack', description: 'Complete Full-Stack Web & Mobile Applications', order: 1 },
      { name: 'AI / ML', slug: 'ai-ml', description: 'Artificial Intelligence & Machine Learning projects', order: 2 },
      { name: 'MERN Stack', slug: 'mern-stack', description: 'Full-stack MongoDB, Express, React, Node projects', order: 3 },
      { name: 'Web Development', slug: 'web-dev', description: 'Frontend and Backend web applications', order: 4 },
      { name: 'Management Systems', slug: 'management', description: 'Enterprise & Hospital management tools', order: 5 },
      { name: 'Real-Time Apps', slug: 'real-time', description: 'WebSockets & WebRTC real-time systems', order: 6 },
    ]);
    categories.forEach((cat) => console.log(`[SEED] Created Category: ${cat.name}`));

    // Ensure storage directories exist
    const storageDir = path.resolve(__dirname, '../../storage/protected/packages');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    // Products Data
    const productsData = [
      {
        title: 'AI Resume Analyzer & ATS Optimizer',
        slug: 'ai-resume-analyzer',
        shortDescription: 'Production-ready AI ATS Resume parser with Google Gemini API & score feedback.',
        fullDescription: 'Comprehensive AI ATS resume scoring engine built with React 18, Node.js, Express, MongoDB, and Gemini 1.5 Flash. Includes PDF parsing, keyword extraction, ATS scoring algorithm, resume version history, and interactive ATS feedback report.',
        category: categories[0]._id,
        price: 999,
        originalPrice: 1999,
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini API', 'Tailwind CSS'],
        difficulty: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        liveDemoUrl: 'https://ai-resume-analyzer-demo.vercel.app',
        githubPreviewUrl: 'https://github.com/Sandeep798512/ai-resume-analyzer-preview',
        features: [
          'AI ATS Scoring Algorithm against job descriptions using Gemini 1.5 Flash',
          'PDF & DOCX Parsing with text extraction',
          'Keyword Match & Gap Analysis',
          'Exportable ATS Optimization Reports',
        ],
        requirements: ['Node.js 18+', 'MongoDB 6.0+', 'Google Gemini API Key', 'NPM 9+'],
        whatsIncluded: [
          'Complete Clean Source Code (.ZIP)',
          'Comprehensive IEEE Style Documentation (.PDF)',
          'Project Presentation Deck (.PPTX)',
          'Step-by-Step Local & Cloud Setup Guide (.PDF)',
          'Viva Voce QA Question Bank (.PDF)',
          'Architecture & ER Diagram (.PNG)',
        ],
        isPublished: true,
        isFeatured: true,
        currentVersion: '1.0.0',
      },
      {
        title: 'AI Interview Preparation & Mock System',
        slug: 'ai-interview-prep',
        shortDescription: 'Real-time AI voice & text interview preparation system with instant feedback.',
        fullDescription: 'Interactive mock technical interview platform built with React, Express, WebSockets, and Gemini API. Conducts role-specific technical interviews, records candidate answers, provides real-time confidence feedback, and outputs a complete viva score card.',
        category: categories[0]._id,
        price: 1299,
        originalPrice: 2499,
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'WebSockets', 'Gemini API'],
        difficulty: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        liveDemoUrl: 'https://ai-interview-prep-demo.vercel.app',
        features: [
          'AI Voice & Speech Interviewer for role-specific questions',
          'Instant Viva Score Card & Clarity Rating',
        ],
        requirements: ['Node.js 18+', 'MongoDB 6.0+', 'Gemini API Key'],
        whatsIncluded: [
          'Complete Clean Source Code (.ZIP)',
          'Comprehensive IEEE Style Documentation (.PDF)',
          'Project Presentation Deck (.PPTX)',
          'Setup Guide (.PDF)',
          'Viva Voce QA Bank (.PDF)',
        ],
        isPublished: true,
        isFeatured: true,
        currentVersion: '1.0.0',
      },
      {
        title: 'MERN Stack Production E-Commerce Platform',
        slug: 'mern-ecommerce-platform',
        shortDescription: 'Full-stack production e-commerce store with Redux Toolkit & Razorpay payments.',
        fullDescription: 'Production-ready e-commerce platform built with React 18, Redux Toolkit, Node.js, Express, MongoDB, and Razorpay payment gateway integration. Features customer shopping cart, order tracking, admin product inventory, coupon code engine, and email order confirmation.',
        category: categories[1]._id,
        price: 899,
        originalPrice: 1799,
        techStack: ['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'Razorpay API'],
        difficulty: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67daf40955?w=800&auto=format&fit=crop&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1556742049-0a67daf40955?w=1200&auto=format&fit=crop&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        liveDemoUrl: 'https://mern-shop-demo.vercel.app',
        features: [
          'Razorpay Payment Gateway Integration with HMAC verification',
          'Admin Inventory Suite & Order Tracking',
        ],
        requirements: ['Node.js 18+', 'MongoDB 6.0+', 'Razorpay Account'],
        whatsIncluded: [
          'Complete Clean Source Code (.ZIP)',
          'Documentation & PPT Package (.PDF/.PPTX)',
          'Setup & Deployment Guide (.PDF)',
          'Viva Voce QA Bank (.PDF)',
        ],
        isPublished: true,
        isFeatured: true,
        currentVersion: '1.0.0',
      },
      {
        title: 'Hospital & Healthcare Management System',
        slug: 'hospital-management-system',
        shortDescription: 'Enterprise healthcare portal with doctor scheduling & patient EMR records.',
        fullDescription: 'Enterprise Hospital Management System built with React, TypeScript, Express, and MongoDB. Features patient appointment booking, doctor schedules, electronic medical records (EMR), prescription generator, and pharmacy inventory manager.',
        category: categories[3]._id,
        price: 799,
        originalPrice: 1599,
        techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        difficulty: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&auto=format&fit=crop&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        liveDemoUrl: 'https://hospital-mgmt-demo.vercel.app',
        features: [
          'Doctor Scheduling Engine & Slot Booking',
          'Prescription PDF Generator for Pharmacy',
        ],
        requirements: ['Node.js 18+', 'MongoDB 6.0+'],
        whatsIncluded: [
          'Complete Clean Source Code (.ZIP)',
          'IEEE Style Documentation (.PDF)',
          'Presentation Deck (.PPTX)',
          'Setup Guide (.PDF)',
          'Viva Voce QA Bank (.PDF)',
        ],
        isPublished: true,
        isFeatured: false,
        currentVersion: '1.0.0',
      },
      {
        title: 'Job Portal & Career Opportunities Hub',
        slug: 'job-portal-platform',
        shortDescription: 'Recruitment portal connecting job seekers with recruiters and application tracking.',
        fullDescription: 'Full-featured job portal platform built with React, Express, Node.js, and MongoDB. Supports candidate resume upload, job filtering by location and CTC, recruiter job post dashboard, applicant tracking system (ATS), and status email notifications.',
        category: categories[2]._id,
        price: 749,
        originalPrice: 1499,
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        difficulty: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
        screenshots: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        liveDemoUrl: 'https://job-portal-demo.vercel.app',
        features: [
          'Recruiter Job Post & Applicant Management Dashboard',
          'Advanced Job Filter by Location & Salary',
        ],
        requirements: ['Node.js 18+', 'MongoDB 6.0+'],
        whatsIncluded: [
          'Complete Clean Source Code (.ZIP)',
          'Documentation (.PDF)',
          'PPT Presentation (.PPTX)',
          'Setup Guide (.PDF)',
          'Viva Voce QA Bank (.PDF)',
        ],
        isPublished: true,
        isFeatured: false,
        currentVersion: '1.0.0',
      },
    ];

    // Asset definitions for seeding
    const assetTemplates: { type: AssetType; ext: string; mime: string; title: string }[] = [
      { type: 'SOURCE_CODE', ext: '.zip', mime: 'application/zip', title: 'Complete Source Code (.ZIP)' },
      { type: 'DOCUMENTATION', ext: '.pdf', mime: 'application/pdf', title: 'IEEE Documentation (.PDF)' },
      { type: 'PPT', ext: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', title: 'Project Presentation (.PPTX)' },
      { type: 'SETUP_GUIDE', ext: '.pdf', mime: 'application/pdf', title: 'Step-by-Step Setup Guide (.PDF)' },
      { type: 'VIVA', ext: '.pdf', mime: 'application/pdf', title: 'Viva Voce QA Question Bank (.PDF)' },
      { type: 'PROJECT_REPORT', ext: '.pdf', mime: 'application/pdf', title: 'Complete Project Report (.PDF)' },
    ];

    for (const pData of productsData) {
      const createdProd = await Product.create(pData);
      console.log(`[SEED] Created Product: ${createdProd.title}`);

      const createdAssetIds: any[] = [];

      for (const tpl of assetTemplates) {
        const fileKey = `packages/${createdProd.slug}_${tpl.type.toLowerCase()}${tpl.ext}`;
        const filePath = path.resolve(storageDir, `${createdProd.slug}_${tpl.type.toLowerCase()}${tpl.ext}`);

        // Write physical sample file to storage
        if (tpl.ext === '.pdf') {
          fs.writeFileSync(filePath, `%PDF-1.4\n% ProjectForge Official Deliverable: ${createdProd.title} (${tpl.title})\nIncludes full technical specifications, architecture diagrams, and viva answers.`);
        } else if (tpl.ext === '.pptx') {
          fs.writeFileSync(filePath, `PK\x03\x04 - ProjectForge Presentation Deck for ${createdProd.title}\nIncludes 15 Project Slides & Demo Screenshots.`);
        } else {
          fs.writeFileSync(filePath, `PK\x03\x04 - ProjectForge Source Code Package for ${createdProd.title}\nIncludes frontend, backend, database scripts, and environment template.`);
        }

        const assetDoc = await ProductAsset.create({
          product: createdProd._id,
          assetType: tpl.type,
          title: tpl.title,
          originalName: `${createdProd.slug}_${tpl.type.toLowerCase()}${tpl.ext}`,
          storageKey: fileKey,
          mimeType: tpl.mime,
          size: fs.statSync(filePath).size,
          isActive: true,
        });

        createdAssetIds.push(assetDoc._id);
        console.log(`  └─ [SEED ASSET] Added ${tpl.type}: ${assetDoc.title}`);
      }

      // Store assets array & deliverables in product
      createdProd.assets = createdAssetIds;
      createdProd.deliverables = [
        { name: 'Complete Source Code', included: true, fileKey: `packages/${createdProd.slug}_source_code.zip` },
        { name: 'IEEE Style Documentation', included: true },
        { name: 'Presentation Deck (PPTX)', included: true },
        { name: 'Viva Voce Question Bank', included: true },
      ];
      await createdProd.save();
    }

    console.log('[SEED] Database seeding finished successfully with clean titles!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[SEED ERROR]', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}
