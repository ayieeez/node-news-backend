import axios from 'axios';
import Article from '../models/Article.js';
import dotenv from 'dotenv';
dotenv.config();

export const fetchAndStoreNews = async () => {
  try {
    console.log('🔄 Fetching Malaysia-related news...');
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'Malaysia',
        sortBy: 'publishedAt',
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const rawArticles = response.data.articles || [];
    const processedArticles = rawArticles.map(article => ({
      source: article.source?.name || 'Unknown',
      author: article.author || 'Anonymous',
      title: article.title || 'Untitled',
      description: article.description || '',
      url: article.url || '',
      urlToImage: article.urlToImage || 'https://via.placeholder.com/150',
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      content: article.content || ''
    })).filter(article => article.url);

    if (processedArticles.length > 0) {
      const bulkOps = processedArticles.map(article => ({
        updateOne: {
          filter: { url: article.url },
          update: { $set: article },
          upsert: true
        }
      }));
      
      const result = await Article.bulkWrite(bulkOps, { ordered: false });
      console.log(`✅ Processed ${result.upsertedCount + result.modifiedCount} articles`);
      return result;
    }
    
    console.log('ℹ️ No new articles found');
    return null;

  } catch (error) {
    console.error('❌ News fetch failed:', error.message);
    throw error;
  }
};