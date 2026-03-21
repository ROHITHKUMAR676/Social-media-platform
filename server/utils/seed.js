import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Post from "../models/Post.js";
import connectDB from "../config/db.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    // साफ existing (optional)
    await User.deleteMany();
    await Post.deleteMany();

    // 👤 demo users
    const users = await User.insertMany([
      {
        name: "John Developer",
        username: "johndev",
        email: "john@example.com",
        password: "123456",
        isVerified: true,
        profileCompleted: true,
        role: "Frontend Developer",
        company: "Google",
        avatar: "",
      },
      {
        name: "Sara Backend",
        username: "saraback",
        email: "sara@example.com",
        password: "123456",
        isVerified: true,
        profileCompleted: true,
        role: "Backend Engineer",
        company: "Amazon",
        avatar: "",
      },
    ]);

    // 📝 demo posts
    await Post.insertMany([
      {
        author: users[0]._id,
        content: "Just built a React + Tailwind dashboard 🚀",
        tags: ["react", "tailwind"],
        likes: [],
        commentsCount: 2,
      },
      {
        author: users[1]._id,
        content: "Understanding Node.js event loop is 🔥",
        tags: ["nodejs", "backend"],
        likes: [],
        commentsCount: 1,
      },
    ]);

    console.log("✅ Seed data inserted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();