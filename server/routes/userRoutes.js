import express from "express";
import {
  getProfile,
  createOrUpdateProfile,
  getUserByUsername,
  toggleFollow,
  getFollowStats,
  getFollowers,
  getFollowing,
  searchUsers,
} from "../controllers/userController.js";
import { optionalProtect, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 REQUIRED ROUTES
router.get("/search", optionalProtect, searchUsers)
router.get("/:id/follow-stats", getFollowStats)
router.get("/me", protect, getProfile);
router.get("/profile/:username/followers", protect, getFollowers);
router.get("/profile/:username/following", protect, getFollowing);
router.put("/profile", protect, createOrUpdateProfile);

router.get("/:username", getUserByUsername);
router.put("/follow/:id", protect, toggleFollow);

export default router;
