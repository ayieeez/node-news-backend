import { fetchAndStoreNews } from './services/newsFetcher.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    // 1. Connect directly to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log('✅ Connected to MongoDB Atlas');

    // 2. Fetch and store news
    await fetchAndStoreNews();

  } catch (err) {
    console.error('❌ Fatal error:', err);
  } finally {
    // 3. Close connection
    await mongoose.disconnect();
    process.exit();
  }
}

run();