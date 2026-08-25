import mongoose from 'mongoose';
import env from './env.js';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    // Attempt connecting to configured URI
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to primary URI (${env.mongoUri}): ${err.message}`);
    console.log(`[MongoDB] Falling back to local MongoMemoryServer for development...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to local in-memory instance: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB] Memory server fallback error: ${memErr.message}`);
      return null;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

export default connectDB;
