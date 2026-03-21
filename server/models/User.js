import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔐 BASIC AUTH
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false, // OTP verification
    },

    // 👤 PROFILE (from CreateProfile)
    bio: {
      type: String,
      default: "",
      maxlength: 250,
    },

    role: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    // 🧠 SKILLS
    skills: [
      {
        type: String,
      },
    ],

    // 🖼️ AVATAR + RESUME
    avatar: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    // ⭐ BADGE SYSTEM (from PostCard)
    verified: {
      type: Boolean,
      default: false, // blue tick (NOT OTP)
    },

    // 👥 SOCIAL SYSTEM
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 📊 PROFILE STATUS
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);