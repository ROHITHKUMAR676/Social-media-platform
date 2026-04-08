import dotenv from "dotenv";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { MOCK_POSTS } from "../data/mockData.js"; // ✅ backend copy

dotenv.config();

const seedPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🌱 Seeding posts...");

    // ❗ optional: clear posts
    await Post.deleteMany();

    const users = await User.find();

    const userMap = {};
    users.forEach((u) => {
      userMap[u.username] = u._id;
    });

    const formattedPosts = MOCK_POSTS.map((post) => {
      const authorUsername = post.author.username;
      const authorId = userMap[authorUsername];

      if (!authorId) {
        console.warn(`⚠️ Skipping post — user not found: ${authorUsername}`);
        return null;
      }

      return {
        author: authorId,
        content: post.content,
        codeSnippet: post.codeSnippet || "",
        tags: post.tags || [],
        createdAt: new Date(post.createdAt),
        likes: [],
        comments: [],
      };
    }).filter(Boolean); // 🔥 remove nulls

    await Post.insertMany(formattedPosts);

    console.log("✅ Posts seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ SeedPosts failed:", err);
    process.exit(1);
  }
};

seedPosts();