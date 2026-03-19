import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📝 Create Post (Protected)
router.post("/", protect, createPost);

// 📄 Get All Posts (Public Feed)
router.get("/", getPosts);

export default router;