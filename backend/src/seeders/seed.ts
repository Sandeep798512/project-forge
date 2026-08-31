import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';
import { hashPassword } from '../utils/passwords';
import { connectDB } from '../config/db';
import { ensureProtectedStorageDirectories } from '../utils/createMockZipFiles';

dotenv.config();

const sampleCategories = [
  { name: 'AI / ML', slug: 'ai-ml', description: 'Artificial Intelligence, LLM & Machine Learning projects', icon: 'Bot' },
  { name: 'MERN Stack', slug: 'mern-stack', description: 'Full-stack MongoDB, Express, React, Node applications', icon: 'Layers' },
  { name: 'Web Development', slug: 'web-development', description: 'Modern Web, Next.js, React & TypeScript applications', icon: 'Globe' },
  { name: 'Management Systems', slug: 'management-systems', description: 'Enterprise CRUD & ERP portal software', icon: 'Database' },
  { name: 'Real-Time Apps', slug: 'real-time', description: 'WebSockets, Chat & Video stream applications', icon: 'Zap' },
];

const sampleProducts = [
  {
    title: 'AI Resume Analyzer & ATS Optimizer',
    slug: 'ai-resume-analyzer',
    shortDescription: 'Production-ready AI resume analyzer that parses PDF/Word resumes, computes ATS compatibility scores, and provides intelligent career suggestions.',
    fullDescription: `The AI Resume Analyzer is a production-grade full-stack web application engineered for college students and job seekers.

It leverages Google Gemini AI API to extract structural data from uploaded resumes (PDF & DOCX), evaluates ATS keyword density against specific job descriptions, detects formatting deficiencies, and generates real-time AI-powered improvement suggestions.

### Key Highlights:
- **Parser Engine**: Extracts structured JSON from complex multi-column resumes.
- **ATS Compatibility Scorer**: Calculates 0-100 score based on hard skills, soft skills, and experience matching.
- **Interactive PDF Viewer**: Real-time side-by-side comparison of resume vs AI feedback.
- **Student Dashboard**: History tracking, version management, and exportable PDF audit reports.
- **Production Architecture**: Decoupled React frontend and Node.js micro-service backend.`,
    categorySlug: 'ai-ml',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Tailwind CSS', 'TypeScript'],
    tags: ['AI', 'Resume', 'ATS', 'Gemini', 'MERN', 'Career'],
    price: 1499,
    originalPrice: 2999,
    discountPercentage: 50,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    liveDemoUrl: 'https://ai-resume-analyzer-demo.vercel.app',
    features: [
      'PDF & DOCX Resume Parsing with Gemini AI',
      'ATS Match Score Calculation & Gap Analysis',
      'Keyword Optimization Suggestions for Target Role',
      'JWT Authentication & Protected User History',
      'Exportable PDF Evaluation Reports',
      'Responsive Glassmorphism UI',
    ],
    architectureDetails: 'Decoupled Client-Server architecture. React SPA communicates with Express REST API. Gemini API handles LLM extraction; MongoDB stores user profiles and parsed resume metadata.',
    databaseDetails: 'MongoDB collections for Users, Resumes, AnalysisHistory, and SystemLogs.',
    requirements: ['Node.js v18+', 'MongoDB v6+', 'Gemini API Key (Free tier supported)'],
    deliverables: [
      { name: 'Complete Source Code (Frontend & Backend)', included: true, fileKey: 'packages/ai-resume-analyzer-v1.zip' },
      { name: 'System Architecture & Data Flow Diagrams', included: true },
      { name: 'MongoDB Database Seed Script', included: true },
      { name: 'Comprehensive Setup & Deployment Guide (.md & PDF)', included: true },
      { name: 'Presentation Deck (.PPTX - 25 Slides)', included: true },
      { name: 'Project Documentation Report (.PDF - 45 Pages)', included: true },
      { name: 'Viva Voce Questions & Technical Answers', included: true },
    ],
    difficulty: 'Intermediate',
    freePreview: true,
    isPublished: true,
    currentVersion: '1.0.0',
    downloadCount: 142,
    ratingAverage: 4.9,
    ratingCount: 28,
  },
  {
    title: 'AI Interview Preparation & Mock System',
    slug: 'ai-interview-prep-system',
    shortDescription: 'Interactive AI-powered mock interview simulator with speech-to-text voice analysis, technical questions generator, and performance scoring.',
    fullDescription: `A comprehensive AI-driven interview rehearsal platform. Supports role-specific mock interviews (Software Engineer, Full Stack, Data Scientist, Product Manager) with real-time vocal feedback, audio transcription, and instant grading.`,
    categorySlug: 'ai-ml',
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'OpenAI / Gemini', 'SpeechRecognition API'],
    tags: ['AI', 'Interview', 'Mock', 'SpeechToText', 'WebSockets', 'MERN'],
    price: 1899,
    originalPrice: 3499,
    discountPercentage: 45,
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    ],
    liveDemoUrl: 'https://ai-interview-prep-demo.vercel.app',
    features: [
      'Dynamic Technical Question Generation based on Tech Stack',
      'Real-Time Vocal Answer Transcription',
      'AI Feedback on Confidence, Grammar & Technical Accuracy',
      'Comprehensive Radar Chart Score Report',
      'Downloadable Performance Transcript',
    ],
    architectureDetails: 'React frontend uses Web Speech API for voice capture. Node Express API handles AI question synthesis and semantic answer evaluation using LLM endpoints.',
    databaseDetails: 'MongoDB schema storing InterviewSessions, Questions, AudioTranscripts, and FeedbackMetrics.',
    requirements: ['Node.js v18+', 'MongoDB v6+', 'Google Speech API / Web browser microphone'],
    deliverables: [
      { name: 'Complete Source Code', included: true, fileKey: 'packages/ai-interview-prep-v1.zip' },
      { name: 'Architecture & DB Schema Diagram', included: true },
      { name: 'Detailed Installation & Local Host Guide', included: true },
      { name: 'Project Presentation (.PPTX)', included: true },
      { name: 'Full IEEE-Format Synopsis & Project Report', included: true },
      { name: '50 Viva Exam Question & Answer Bank', included: true },
    ],
    difficulty: 'Advanced',
    freePreview: true,
    isPublished: true,
    currentVersion: '1.1.0',
    downloadCount: 98,
    ratingAverage: 4.8,
    ratingCount: 19,
  },
  {
    title: 'MERN Stack Production E-Commerce Platform',
    slug: 'mern-ecommerce-platform',
    shortDescription: 'Industrial-grade e-commerce application featuring Redux Toolkit state management, Razorpay payment gateway, admin product management, and order tracking.',
    fullDescription: `Full-featured online storefront built on the MERN stack with enterprise security, discount coupons, stock management, and admin operational tools.`,
    categorySlug: 'mern-stack',
    techStack: ['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'Razorpay API', 'Tailwind CSS'],
    tags: ['MERN', 'E-Commerce', 'Razorpay', 'Redux', 'Shopping', 'Admin'],
    price: 1299,
    originalPrice: 2499,
    discountPercentage: 48,
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67daf4005a?w=800&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0a67daf4005a?w=800&auto=format&fit=crop&q=80',
    ],
    liveDemoUrl: 'https://mern-shop-demo.vercel.app',
    features: [
      'Product Search, Multi-Filter & Sorting',
      'Cart & Persistent Wishlist Management',
      'Server-Side Razorpay Payment Order & Webhook',
      'Admin Dashboard with Sales Analytics & Inventory Control',
      'Order Status Timeline (Processing, Shipped, Delivered)',
    ],
    architectureDetails: 'REST API design with Express. React client manages global shopping state via Redux Toolkit. Secure server-side signature verification for Razorpay checkout.',
    databaseDetails: 'MongoDB collections for Users, Products, Categories, Orders, and Payments.',
    requirements: ['Node.js v18+', 'MongoDB v6+'],
    deliverables: [
      { name: 'Complete Source Code', included: true, fileKey: 'packages/mern-ecommerce-v1.zip' },
      { name: 'Architecture & E-R Diagrams', included: true },
      { name: 'Deployment Manual (Vercel + Render)', included: true },
      { name: 'Project Presentation (.PPTX)', included: true },
      { name: 'Documentation Report (.PDF)', included: true },
      { name: 'Viva Guide for Web Development', included: true },
    ],
    difficulty: 'Intermediate',
    freePreview: true,
    isPublished: true,
    currentVersion: '1.0.0',
    downloadCount: 215,
    ratingAverage: 5.0,
    ratingCount: 42,
  },
  {
    title: 'Hospital & Healthcare Management System',
    slug: 'hospital-management-system',
    shortDescription: 'Role-based healthcare portal for patient appointments, doctor scheduling, electronic health records (EHR), and billing management.',
    fullDescription: `Multi-tenant style healthcare management portal supporting Doctor, Patient, and Receptionist roles with appointment booking, prescription generators, and billing invoices.`,
    categorySlug: 'management-systems',
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
    tags: ['Hospital', 'Healthcare', 'Management', 'EHR', 'MERN', 'TypeScript'],
    price: 999,
    originalPrice: 1999,
    discountPercentage: 50,
    thumbnail: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    ],
    liveDemoUrl: 'https://hospital-mgmt-demo.vercel.app',
    features: [
      'Role-Based Access Control (Patient, Doctor, Admin)',
      'Doctor Slot Availability & Appointment Booking',
      'Electronic Health Record (EHR) & Prescription Generator',
      'Invoice & Billing PDF Generation',
      'Doctor Schedule Analytics Dashboard',
    ],
    architectureDetails: 'Express API with middleware role authorization. TypeScript React client with modular views per user persona.',
    databaseDetails: 'MongoDB collections for Users, Doctors, Patients, Appointments, Prescriptions, and Invoices.',
    requirements: ['Node.js v18+', 'MongoDB v6+'],
    deliverables: [
      { name: 'Complete Source Code', included: true, fileKey: 'packages/hospital-mgmt-v1.zip' },
      { name: 'ER & Data Flow Diagrams', included: true },
      { name: 'Step-by-Step Setup Guide', included: true },
      { name: 'PPT Slides Deck', included: true },
      { name: 'Full Academic Project Report', included: true },
      { name: 'Viva Questions Guide', included: true },
    ],
    difficulty: 'Beginner',
    freePreview: true,
    isPublished: true,
    currentVersion: '1.0.0',
    downloadCount: 178,
    ratingAverage: 4.7,
    ratingCount: 31,
  },
  {
    title: 'Job Portal & Career Opportunities Hub',
    slug: 'job-portal-career-hub',
    shortDescription: 'Full-featured job portal allowing recruiters to post jobs & review applicants while job seekers apply, manage profile resumes, and track application statuses.',
    fullDescription: `Dual-portal recruitment system connecting job seekers with employer recruiters. Supports job search filters, application tracking, resume uploading, and candidate shortlisting.`,
    categorySlug: 'web-development',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Multer', 'Tailwind CSS'],
    tags: ['JobPortal', 'Career', 'Recruitment', 'MERN', 'FullStack'],
    price: 1199,
    originalPrice: 2299,
    discountPercentage: 47,
    thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80',
    ],
    liveDemoUrl: 'https://job-portal-demo.vercel.app',
    features: [
      'Employer Job Posting & Applicant Pipeline Dashboard',
      'Job Seeker One-Click Application & Resume Uploader',
      'Advanced Keyword, Location & Category Filters',
      'Application Status Updates (Applied, Shortlisted, Rejected)',
      'Saved Jobs & Email Notification System',
    ],
    architectureDetails: 'Express backend servicing two client workflows (Recruiter dashboard vs Candidate portal). MongoDB handles relational links between Jobs and Applications.',
    databaseDetails: 'MongoDB collections for Users, Jobs, Applications, Companies, and SavedJobs.',
    requirements: ['Node.js v18+', 'MongoDB v6+'],
    deliverables: [
      { name: 'Complete Source Code', included: true, fileKey: 'packages/job-portal-v1.zip' },
      { name: 'System Diagrams', included: true },
      { name: 'Comprehensive Readme & Setup Guide', included: true },
      { name: 'PPT Slides Deck', included: true },
      { name: 'Project Report Documentation', included: true },
      { name: 'Viva Guide', included: true },
    ],
    difficulty: 'Intermediate',
    freePreview: true,
    isPublished: true,
    currentVersion: '1.0.0',
    downloadCount: 164,
    ratingAverage: 4.9,
    ratingCount: 25,
  },
];

export const seedDatabase = async () => {
  try {
    ensureProtectedStorageDirectories();
    await connectDB();

    // Create Admin User if none exists
    const adminEmail = 'admin@projectforge.dev';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const adminPass = await hashPassword('Admin@123456');
      admin = await User.create({
        name: 'ProjectForge Admin',
        email: adminEmail,
        password: adminPass,
        role: 'admin',
        isVerified: true,
        referralCode: 'FORGE-ADMIN',
      });
      console.log('[SEED] Created default admin account: admin@projectforge.dev / Admin@123456');
    }

    // Seed Categories
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    for (const cat of sampleCategories) {
      let existingCat = await Category.findOne({ slug: cat.slug });
      if (!existingCat) {
        existingCat = await Category.create(cat);
        console.log(`[SEED] Created Category: ${cat.name}`);
      }
      categoryMap.set(cat.slug, existingCat._id as mongoose.Types.ObjectId);
    }

    // Seed Products
    for (const prodData of sampleProducts) {
      const { categorySlug, ...rest } = prodData;
      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) continue;

      let existingProd = await Product.findOne({ slug: rest.slug });
      if (!existingProd) {
        await Product.create({
          ...rest,
          category: categoryId,
          versions: [
            {
              versionNumber: rest.currentVersion,
              releaseNotes: 'Initial production release package',
              fileKey: rest.deliverables[0]?.fileKey || 'packages/sample-project.zip',
              releasedAt: new Date(),
            },
          ],
        });
        console.log(`[SEED] Created Product: ${rest.title}`);
      }
    }

    console.log('[SEED] Database seeding finished successfully!');
  } catch (error) {
    console.error('[SEED ERROR]', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
