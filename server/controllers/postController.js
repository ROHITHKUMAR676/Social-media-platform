import Post from "../models/Post.js";
import User from "../models/User.js";
import Forum from "../models/Forum.js";
import { calculateMatch, getAccessLevel } from "../utils/forumAccess.js";

const formatPost = (post, currentUserId) => ({
  id: post._id,
  content: post.content,
  codeSnippet: post.codeSnippet,
  tags: post.tags,
  type: post.type,
  forum: post.forum
    ? {
        id: post.forum._id || post.forum,
        name: post.forum.name,
      }
    : null,
  likes: post.likes.length,
  comments: post.comments?.length || 0,
  createdAt: post.createdAt,
  liked: post.likes.some((id) => id.toString() === currentUserId),
  bookmarked: false,
  author: {
    _id: post.author._id,
    name: post.author.name,
    username: post.author.username,
    avatar: post.author.avatar,
    role: post.author.role,
    verified: post.author.verified,
  },
});

const assertForumPermission = async (user, forumId, action) => {
  if (!forumId) {
    return null;
  }

  const forum = await Forum.findById(forumId);

  if (!forum) {
    const error = new Error("Forum not found");
    error.statusCode = 404;
    throw error;
  }

  const matchPercent = calculateMatch(user.skills || [], forum.skillsRequired);
  const access = getAccessLevel(matchPercent);

  if (action === "post" && !access.canPost) {
    const error = new Error(
      "You need more than 70% skill match to create a post in this forum"
    );
    error.statusCode = 403;
    throw error;
  }

  if (action === "comment" && !access.canComment) {
    const error = new Error(
      "You need at least 40% skill match to comment in this forum"
    );
    error.statusCode = 403;
    throw error;
  }

  return forum;
};

export const createPost = async (req, res, next) => {
  try {
    const { content, codeSnippet, tags, forumId, type = "post" } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const forum = await assertForumPermission(req.user, forumId, "post");

    const post = await Post.create({
      author: req.user._id,
      content,
      codeSnippet,
      tags,
      forum: forum?._id || null,
      type,
    });

    const populated = await post.populate([
      { path: "author", select: "name username avatar role verified" },
      { path: "forum", select: "name" },
    ]);

    res.status(201).json(formatPost(populated, req.user._id.toString()));
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    let posts = [];

    if (req.user?._id) {
      const user = await User.findById(req.user._id);
      const followingIds = user.following || [];

      const followingPosts = await Post.find({
        author: { $in: followingIds },
        forum: null,
      })
        .sort({ createdAt: -1 })
        .populate("author", "name username avatar role verified");

      const otherPosts = await Post.find({
        author: { $nin: followingIds },
        forum: null,
      })
        .sort({ createdAt: -1 })
        .populate("author", "name username avatar role verified");

      posts = [...followingPosts, ...otherPosts];
    } else {
      posts = await Post.find({ forum: null })
        .sort({ createdAt: -1 })
        .populate("author", "name username avatar role verified");
    }

    const currentUserId = req.user?._id?.toString();

    res.status(200).json({
      success: true,
      count: posts.length,
      posts: posts.map((post) => formatPost(post, currentUserId)),
    });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
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

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    await assertForumPermission(req.user, post.forum, "comment");

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    const populatedPost = await post.populate([
      { path: "comments.user", select: "name username avatar" },
      { path: "comments.replies.user", select: "name username avatar" },
    ]);

    res.status(201).json({
      success: true,
      comments: populatedPost.comments,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate([
      { path: "comments.user", select: "name username avatar" },
      { path: "comments.replies.user", select: "name username avatar" },
    ]);

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
      .populate("author", "name username avatar role verified")
      .populate("forum", "name");

    const currentUserId = req.user?._id?.toString();

    res.status(200).json({
      success: true,
      posts: posts.map((post) => formatPost(post, currentUserId)),
    });
  } catch (err) {
    next(err);
  }
};

export const addReply = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { id, commentId } = req.params;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Reply required" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await assertForumPermission(req.user, post.forum, "comment");

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      user: req.user._id,
      text,
    });

    await post.save();

    const populated = await post.populate([
      { path: "comments.user", select: "name username avatar" },
      { path: "comments.replies.user", select: "name username avatar" },
    ]);

    res.status(201).json({
      success: true,
      comments: populated.comments,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};
