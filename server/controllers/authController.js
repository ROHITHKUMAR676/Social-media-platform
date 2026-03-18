import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/mailer.js";

// 🔐 TEMP OTP STORE (dev only)
const otpStore = new Map();

// 🔐 REGISTER → SEND OTP
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "User already exists" });

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔥 Store temporarily
    otpStore.set(email, { name, password, otp });

    // 🔥 Send email
    await sendEmail(
      email,
      "SkillSphere OTP Verification 🔐",
      `
        <div style="font-family:sans-serif">
          <h2>Welcome to SkillSphere 🚀</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire soon.</p>
        </div>
      `
    );

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🔐 VERIFY OTP → CREATE USER
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);

    if (!stored || stored.otp != otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    // 🔥 Hash password now
    const hashedPassword = await bcrypt.hash(stored.password, 10);

    const user = await User.create({
      name: stored.name,
      email,
      password: hashedPassword,
    });

    // 🔥 Remove OTP after use
    otpStore.delete(email);

    // 🔥 Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      msg: "User verified & created",
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🔐 LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      msg: "Login success",
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};