import express from "express";
import {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  getComments,
  getUserPosts,
  addReply,
} from "../controllers/postController.js";

import { protect, optionalProtect } from "../middleware/authMiddleware.js";

// 🔥 FIRST define router
const router = express.Router();

// 📝 Create Post
router.post("/", protect, createPost);

// 📄 Feed
router.get("/", optionalProtect, getPosts);

router.get("/user/:username", optionalProtect, getUserPosts);
// ❤️ Like / Unlike
router.put("/:id/like", protect, toggleLike);

// 💬 Add Comment
router.post("/:id/comment", protect, addComment);
router.post("/:id/comment/:commentId/reply", protect, addReply)
// 💬 Get Comments
router.get("/:id/comments", optionalProtect, getComments);

// 👤 Get Posts by Username (VERY IMPORTANT)



// 👤 Get user posts
router.get("/user/:username", optionalProtect, getUserPosts);


// ❤️ Like
router.put("/:id/like", protect, toggleLike);

// 💬 Comment
router.post("/:id/comment", protect, addComment);

// 💬 Replies
router.post("/:id/comment/:commentId/reply", protect, addReply);

// 💬 Get comments
router.get("/:id/comments", optionalProtect, getComments);

export default router;