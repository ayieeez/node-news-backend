import cron from 'node-cron';
import { fetchAndStoreNews } from '../services/newsFetcher.js';
import dotenv from 'dotenv';
dotenv.config();

cron.schedule(process.env.FETCH_INTERVAL, () => {
  console.log('⏰ Scheduled fetch started at', new Date().toISOString());
  fetchAndStoreNews().catch(console.error);
});

console.log('🔄 News scheduler initialized');