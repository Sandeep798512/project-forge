import mongoose from 'mongoose';
import Category from '../models/Category';

let mongoMemoryServer: any = null;

export const ensureDefaultCategories = async () => {
  try {
    const defaultCats = [
      { name: 'Full Stack', slug: 'full-stack', description: 'Complete Full-Stack Web & Mobile Applications', order: 1 },
      { name: 'AI / ML', slug: 'ai-ml', description: 'Artificial Intelligence & Machine Learning projects', order: 2 },
      { name: 'MERN Stack', slug: 'mern-stack', description: 'Full-stack MongoDB, Express, React, Node projects', order: 3 },
      { name: 'Web Development', slug: 'web-dev', description: 'Frontend and Backend web applications', order: 4 },
      { name: 'Management Systems', slug: 'management', description: 'Enterprise & Hospital management tools', order: 5 },
      { name: 'Real-Time Apps', slug: 'real-time', description: 'WebSockets & WebRTC real-time systems', order: 6 },
    ];

    for (const cat of defaultCats) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`[DB SUCCESS] Auto-created "${cat.name}" category in MongoDB.`);
      }
    }
  } catch (err: any) {
    console.error('[DB Category Sync]', err.message);
  }
};

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/projectforge';
    console.log(`[DB] Attempting connection to MongoDB Atlas at ${connStr.replace(/:([^@]+)@/, ':****@')}...`);

    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[DB SUCCESS] Connected to MongoDB Atlas host: ${mongoose.connection.host}`);
    await ensureDefaultCategories();
  } catch (error: any) {
    console.warn(`[DB WARNING] Could not connect to primary MongoDB instance (${error.message}).`);
    console.log(`[DB] Launching automatic MongoDB In-Memory Server fallback for local testing...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      await mongoose.connect(memoryUri);
      console.log(`[DB SUCCESS] Connected to MongoMemoryServer at ${memoryUri}`);
      await ensureDefaultCategories();
    } catch (memErr: any) {
      console.error(`[DB FATAL] In-memory MongoDB failed to initialize: ${memErr.message}`);
    }
  }
};
