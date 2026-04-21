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

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", optionalProtect, getPosts);
router.get("/user/:username", optionalProtect, getUserPosts);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.post("/:id/comment/:commentId/reply", protect, addReply);
router.get("/:id/comments", optionalProtect, getComments);

export default router;
