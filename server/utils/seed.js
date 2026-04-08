import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { MOCK_USERS, MOCK_POSTS } from "../data/mockData.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding database...");

    await User.deleteMany();
    await Post.deleteMany();

    // 👤 Insert users
    const users = await User.insertMany(
      MOCK_USERS.map((u) => ({
        name: u.name,
        username: u.username,
        email: `${u.username}@devconnect.com`,
        password: "123456", // ⚠️ ensure hashing middleware exists
        isVerified: true,
        profileCompleted: true,
        role: u.role || "",
        company: u.company || "",
        avatar: u.avatar || "",
      }))
    );

    // 🧠 Map username → ObjectId
    const userMap = {};
    users.forEach((u) => {
      userMap[u.username] = u._id;
    });

    // 📝 Insert posts
    const formattedPosts = MOCK_POSTS.map((post) => {
      const authorId = userMap[post.author.username];

      if (!authorId) {
        console.warn(`⚠️ No user found for ${post.author.username}`);
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
    });

    await Post.insertMany(formattedPosts);

    console.log("✅ Users & Posts seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

seed();