import mongoose from "mongoose";

<<<<<<< HEAD
=======

// 🔥 REPLY SCHEMA (LEVEL 1)
>>>>>>> 2310d38 (doneee)
const replySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true }
)

<<<<<<< HEAD
=======

// 🔥 COMMENT SCHEMA (LEVEL 2)
>>>>>>> 2310d38 (doneee)
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
<<<<<<< HEAD

    // 🔥 NEW
    replies: [replySchema],
  },
  { timestamps: true }
)
=======
    replies: [replySchema],
  },
  { timestamps: true }
);


// 🔥 POST SCHEMA (MAIN)
>>>>>>> 2310d38 (doneee)
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    image: {
      type: String,
      default: null,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],

    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


// 🔥 INDEX
postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);