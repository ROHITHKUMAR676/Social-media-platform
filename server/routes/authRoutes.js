import express from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Auth Routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

// 👤 Get current logged-in user
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;