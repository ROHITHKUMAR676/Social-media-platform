import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";
import { toggleLike } from "../controllers/postController.js";


const router = express.Router();
router.put("/:id/like", protect, toggleLike);
// 📝 Create Post (Protected)
router.post("/", protect, createPost);

// 📄 Feed (Optional Auth 🔥)
router.get("/", optionalProtect, getPosts);

export default router;