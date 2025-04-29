import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Article from './models/Article.js';
import './schedulers/newsScheduler.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// API Endpoints
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'News API Service' });
});

app.get('/news', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const articles = await Article.find()
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      total: await Article.countDocuments(),
      articles
    });
    
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});