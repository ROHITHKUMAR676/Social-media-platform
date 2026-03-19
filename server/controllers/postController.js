import Post from "../models/Post.js";

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

    // Populate user info
    const populatedPost = await post.populate("user", "name avatar");

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (err) {
    next(err);
  }
};

// 📄 Get All Posts (Feed)
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name avatar");

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    next(err);
  }
};