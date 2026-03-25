import express from "express";
import {
  getProfile,
  createOrUpdateProfile,
  getUserByUsername,
  toggleFollow
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 REQUIRED ROUTES
router.get("/me", protect, getProfile);
router.put("/profile", protect, createOrUpdateProfile);

router.get("/:username", getUserByUsername);
router.put("/follow/:id", protect, toggleFollow);

export default router;