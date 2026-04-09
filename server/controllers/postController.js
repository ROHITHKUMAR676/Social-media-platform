import Post from "../models/Post.js";
import User from "../models/User.js";

// 📝 Create Post
export const createPost = async (req, res, next) => {
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
    next(err);
  }
};

// 📄 Get Feed (SMART FEED 🔥)
export const getPosts = async (req, res, next) => {
  try {
    let posts = [];

    if (req.user?._id) {
      const user = await User.findById(req.user._id);

      const followingIds = user.following || [];

      // 🔥 1. Following posts
      const followingPosts = await Post.find({
        author: { $in: followingIds },
      })
        .sort({ createdAt: -1 })
        .populate("author", "name username avatar role verified");

      // 🔥 2. Other posts
      const otherPosts = await Post.find({
        author: { $nin: followingIds },
      })
        .sort({ createdAt: -1 })
        .populate("author", "name username avatar role verified");

      posts = [...followingPosts, ...otherPosts];
    } else {
      // 🌍 Public feed
      posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("author", "name username avatar role verified");
    }

    // 🔥 Normalize response (VERY IMPORTANT)
    const formattedPosts = posts.map((post) => ({
      id: post._id,
      content: post.content,
      codeSnippet: post.codeSnippet,
      tags: post.tags,
      likes: post.likes.length,
      comments: post.comments?.length || 0,
      createdAt: post.createdAt,
      liked: post.likes.some(
        (id) => id.toString() === req.user?._id?.toString()
      ),
      bookmarked: false,

      author: {
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar,
        role: post.author.role,
        verified: post.author.verified,
      },
    }));

    res.status(200).json({
      success: true,
      count: formattedPosts.length,
      posts: formattedPosts,
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

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // ❌ Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // ✅ Like
      post.likes.push(req.user._id);
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
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    // 🔥 IMPORTANT: populate after save
    const populatedPost = await post.populate(
      "comments.user",
      "name username avatar"
    );

    res.status(201).json({
      success: true,
      comments: populatedPost.comments, // ✅ FULL ARRAY
    });

  } catch (err) {
    next(err);
  }
};
// 💬 ADD REPLY
export const addReply = async (req, res, next) => {
  try {
    const { text } = req.body
    const { id, commentId } = req.params

    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const comment = post.comments.id(commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    comment.replies.push({
      user: req.user._id,
      text,
    })

    await post.save()

    const populated = await post.populate([
      { path: "comments.user", select: "name username avatar" },
      { path: "comments.replies.user", select: "name username avatar" }
    ])

    res.status(201).json({
      success: true,
      comments: populated.comments,
    })

  } catch (err) {
    next(err)
  }
}
export const getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("comments.user", "name username avatar");

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    res.status(200).json({
      success: true,
      comments: post.comments,
    });
  } catch (err) {
    next(err);
  }
};
export const getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "name username avatar");

    const formattedPosts = posts.map((post) => ({
      id: post._id,
      content: post.content,
      codeSnippet: post.codeSnippet,
      tags: post.tags,
      likes: post.likes.length,
      comments: post.comments.length,
      createdAt: post.createdAt,
      liked: post.likes.some(
        (id) => id.toString() === req.user?._id?.toString()
      ),
      bookmarked: false,

      author: {
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar,
      },
    }));

    res.status(200).json({
      success: true,
      posts: formattedPosts,
    });
  } catch (err) {
    next(err);
  }
};