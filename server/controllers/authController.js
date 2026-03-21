import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../config/mailer.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc Register user + send OTP
 */
export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // check existing email
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    // check username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create or update user
    let user;
    if (!existingUser) {
      user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        isVerified: false,
      });
    } else {
      existingUser.name = name;
      existingUser.username = username;
      existingUser.password = hashedPassword;
      await existingUser.save();
      user = existingUser;
    }

    // delete old OTPs
    await Otp.deleteMany({ email });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // send email
    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.status(201).json({
      message: "OTP sent to email",
      email,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Verify OTP
 */
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

    // mark verified
    await User.updateOne({ email }, { isVerified: true });

    // delete OTPs
    await Otp.deleteMany({ email });

    res.status(200).json({
      message: "Verified successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Login user
 */
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

      // 🔥 frontend-aligned user object
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        company: user.company,
        location: user.location,
        website: user.website,
        skills: user.skills,

        followers: user.followers.length,
        following: user.following.length,

        profileCompleted: user.profileCompleted,
        verified: user.verified,

        joined: user.createdAt,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // delete old OTPs
    await Otp.deleteMany({ email });

    // create new OTP
    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // send email
    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "OTP resent successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};