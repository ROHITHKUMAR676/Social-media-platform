import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔥 Hide password by default
    },

    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/notionists/svg?seed=user",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },

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
  },
  { timestamps: true }
);

// 🔥 Index for faster queries
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);