// Service for generating user feed
const Post = require('../models/Post');

const getFeed = async (userId) => {
  // Logic to get posts from followed users
  const posts = await Post.find().sort({ createdAt: -1 });
  return posts;
};

module.exports = { getFeed };