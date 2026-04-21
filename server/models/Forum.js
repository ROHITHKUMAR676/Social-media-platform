import mongoose from "mongoose";

const forumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

forumSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Forum", forumSchema);
