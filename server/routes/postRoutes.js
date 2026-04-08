import express from "express";
import {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  getComments,
  getUserPosts,
} from "../controllers/postController.js";

import { protect, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📝 Create Post
router.post("/", protect, createPost);

// 📄 Feed
router.get("/", optionalProtect, getPosts);

// ❤️ Like / Unlike
router.put("/:id/like", protect, toggleLike);

// 💬 Add Comment
router.post("/:id/comment", protect, addComment);

// 💬 Get Comments
router.get("/:id/comments", optionalProtect, getComments);

// 👤 Get Posts by Username (VERY IMPORTANT)
router.get("/user/:username", optionalProtect, getUserPosts);

export default router;