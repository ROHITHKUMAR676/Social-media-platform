import express from "express";
import {
  getForums,
  joinForum,
  getForumPosts,
} from "../controllers/forumController.js";
import { optionalProtect, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, getForums);
router.post("/:id/join", protect, joinForum);
router.get("/:id/posts", optionalProtect, getForumPosts);

export default router;
