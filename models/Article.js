import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  source: String,
  author: String,
  title: String,
  description: String,
  url: { type: String, unique: true },
  urlToImage: String,
  publishedAt: Date,
  content: String
});

export default mongoose.model('Article', articleSchema);