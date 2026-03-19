import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../config/mailer.js";
import generateToken from "../utils/generateToken.js";

// 🔐 TEMP OTP STORE (dev only)
const otpStore = new Map();

// 🔐 REGISTER → SEND OTP
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔥 Store with expiry (5 mins)
    otpStore.set(email, {
      name,
      password,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // 🔥 Send email
    await sendEmail(
      email,
      "SkillSphere OTP Verification 🔐",
      `
        <div style="font-family:sans-serif">
          <h2>Welcome to SkillSphere 🚀</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 VERIFY OTP → CREATE USER
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error("Email and OTP are required");
    }

    const stored = otpStore.get(email);

    if (!stored) {
      res.status(400);
      throw new Error("OTP not found or expired");
    }

    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      res.status(400);
      throw new Error("OTP expired");
    }

    if (stored.otp != otp) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    // 🔥 Hash password
    const hashedPassword = await bcrypt.hash(stored.password, 10);

    const user = await User.create({
      name: stored.name,
      email,
      password: hashedPassword,
    });

    otpStore.delete(email);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User verified & created",
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};