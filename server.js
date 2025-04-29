import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Article from './models/Article.js';
import './schedulers/newsScheduler.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// API Endpoint
app.get('/news', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const articles = await Article.find()
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(process.env.PORT, () => 
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);