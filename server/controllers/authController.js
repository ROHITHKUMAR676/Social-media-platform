import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../config/mailer.js";
import generateToken from "../utils/generateToken.js";


// 📝 REGISTER (OTP ONLY)
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      name,
      username,
      password: hashedPassword,
    });

    await sendEmail(
  email,
  "Welcome to DevConnect 🚀 - Verify your email",
  `
  <div style="font-family: Arial, sans-serif; padding: 24px; color: #333;">
    
    <h2 style="color: #4F46E5; margin-bottom: 10px;">
      Welcome to DevConnect 🚀
    </h2>

    <p>Hi <strong>${name}</strong>,</p>

    <p>
      We're excited to have you join our developer community!
      Please use the OTP below to verify your email address:
    </p>

    <div style="
      margin: 24px 0;
      padding: 16px;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 6px;
      text-align: center;
      background: #f4f4f5;
      border-radius: 10px;
    ">
      ${otp}
    </div>

    <p>This OTP is valid for <strong>5 minutes</strong>.</p>

    <p style="color: #666; font-size: 13px;">
      If you didn’t request this, you can safely ignore this email.
    </p>

    <br />

    <p style="margin-top: 20px;">
      — <strong>DevConnect Team 💙</strong>
    </p>

  </div>
  `
)

    res.status(200).json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔢 VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already verified" });
    }

    const user = await User.create({
      name: record.name,
      username: record.username,
      email,
      password: record.password,
      isVerified: true,
    });

    await Otp.deleteMany({ email });

    res.json({
      message: "Verified successfully",
      token: generateToken(user._id),
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔐 LOGIN (🔥 THIS WAS MISSING)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔁 RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp) {
      return res.status(400).json({ message: "No pending registration found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      name: existingOtp.name,
      username: existingOtp.username,
      password: existingOtp.password,
    });

    await sendEmail(email, "Welcome to our DevConnect Platform.We are excited to have you on board! To verify your email, please use the following OTP:", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "OTP resent successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};