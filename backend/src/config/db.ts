import mongoose from 'mongoose';

let mongoMemoryServer: any = null;

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/projectforge';
    console.log(`[DB] Attempting connection to MongoDB Atlas at ${connStr.replace(/:([^@]+)@/, ':****@')}...`);

    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[DB SUCCESS] Connected to MongoDB Atlas host: ${mongoose.connection.host}`);
  } catch (error: any) {
    console.warn(`[DB WARNING] Could not connect to primary MongoDB instance (${error.message}).`);
    console.log(`[DB] Launching automatic MongoDB In-Memory Server fallback for local testing...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      await mongoose.connect(memoryUri);
      console.log(`[DB SUCCESS] Connected to MongoMemoryServer at ${memoryUri}`);
    } catch (memErr: any) {
      console.error(`[DB FATAL] In-memory MongoDB failed to initialize: ${memErr.message}`);
    }
  }
};
