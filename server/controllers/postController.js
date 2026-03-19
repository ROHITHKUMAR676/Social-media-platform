import Post from "../models/Post.js";
import User from "../models/User.js";

// 📝 Create Post
export const createPost = async (req, res, next) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      res.status(400);
      throw new Error("Post content is required");
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      image: image || null,
    });

    const populatedPost = await post.populate("user", "name username avatar");

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (err) {
    next(err);
  }
};

// 📄 Get Feed (SMART FEED 🔥)
export const getPosts = async (req, res, next) => {
  try {
    let posts = [];

    // 🔐 If logged in → personalized feed
    if (req.user?._id) {
      const user = await User.findById(req.user._id);

      const followingIds = user.following || [];

      // 🔥 1. Following posts
      const followingPosts = await Post.find({
        user: { $in: followingIds },
      })
        .sort({ createdAt: -1 })
        .populate("user", "name username avatar");

      // 🔥 2. Other posts
      const otherPosts = await Post.find({
        user: { $nin: followingIds },
      })
        .sort({ createdAt: -1 })
        .populate("user", "name username avatar");

      posts = [...followingPosts, ...otherPosts];
    } else {
      // 🌍 Public feed (not logged in)
      posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "name username avatar");
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    next(err);
  }
};
// ❤️ Like / Unlike Post
export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // 🔥 Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // 🔥 Like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      likes: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    next(err);
  }
};