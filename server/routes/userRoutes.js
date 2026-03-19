import express from "express";
import {
  getProfile,
  createOrUpdateProfile,
  getUserByUsername, // 🔥 ADD THIS
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { toggleFollow } from "../controllers/userController.js";


const router = express.Router();

// 👤 Get profile
router.get("/profile", protect, getProfile);
router.put("/follow/:id", protect, toggleFollow);
// 🔥 Create / Update profile
router.post("/profile", protect, createOrUpdateProfile);
router.get("/profile/:username", getUserByUsername);

export default router;