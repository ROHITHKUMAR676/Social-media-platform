import Post from "../models/Post.js";
import User from "../models/User.js";

// 📝 Create Post
export const createPost = async (req, res) => {
  try {
    const { content, codeSnippet, tags } = req.body;

    const post = await Post.create({
      author: req.user._id,
      content,
      codeSnippet,
      tags,
    });

    const populated = await post.populate(
      "author",
      "name username avatar role verified"
    );

    res.status(201).json({
      id: populated._id,
      content: populated.content,
      codeSnippet: populated.codeSnippet,
      tags: populated.tags,
      likes: 0,
      comments: 0,
      createdAt: populated.createdAt,
      liked: false,
      bookmarked: false,
      author: {
        name: populated.author.name,
        username: populated.author.username,
        avatar: populated.author.avatar,
        role: populated.author.role,
        verified: populated.author.verified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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