import Forum from "../models/Forum.js";
import Post from "../models/Post.js";
import {
  calculateMatch,
  getAccessLevel,
  getMissingSkills,
} from "../utils/forumAccess.js";

const DEFAULT_FORUMS = [
  {
    name: "Frontend Development",
    description:
      "Discuss React, JavaScript, CSS, UI architecture, and modern frontend workflows.",
    skillsRequired: ["react", "javascript", "css", "typescript"],
  },
  {
    name: "Backend Systems",
    description:
      "Talk APIs, databases, scaling patterns, and clean backend architecture.",
    skillsRequired: ["node.js", "express", "mongodb", "system design"],
  },
  {
    name: "AI and Machine Learning",
    description:
      "Share ideas on ML pipelines, model serving, Python tooling, and applied AI.",
    skillsRequired: ["python", "machine learning", "statistics", "pytorch"],
  },
  {
    name: "DevOps and Cloud",
    description:
      "Exchange best practices around CI/CD, containers, infra automation, and cloud ops.",
    skillsRequired: ["docker", "kubernetes", "ci/cd", "linux"],
  },
];

const ensureSeedForums = async () => {
  const count = await Forum.countDocuments();

  if (count === 0) {
    await Forum.insertMany(DEFAULT_FORUMS);
  }
};

const buildForumResponse = async (forum, user) => {
  const userSkills = user?.skills || [];
  const matchPercent = calculateMatch(userSkills, forum.skillsRequired);
  const postsCount = await Post.countDocuments({ forum: forum._id });
  const access = getAccessLevel(matchPercent);

  return {
    id: forum._id,
    name: forum.name,
    description: forum.description,
    skillsRequired: forum.skillsRequired,
    membersCount: forum.members.length,
    postsCount,
    joined: Boolean(
      user?._id &&
        forum.members.some((memberId) => memberId.toString() === user._id.toString())
    ),
    matchPercent,
    missingSkills: getMissingSkills(userSkills, forum.skillsRequired),
    permissions: {
      canView: true,
      canComment: access.canComment,
      canPost: access.canPost,
      level: access.level,
    },
    createdAt: forum.createdAt,
  };
};

export const getForums = async (req, res, next) => {
  try {
    await ensureSeedForums();

    const forums = await Forum.find().sort({ createdAt: 1 });
    const payload = await Promise.all(
      forums.map((forum) => buildForumResponse(forum, req.user))
    );

    res.status(200).json({
      success: true,
      forums: payload,
    });
  } catch (err) {
    next(err);
  }
};

export const joinForum = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      res.status(404);
      throw new Error("Forum not found");
    }

    const alreadyJoined = forum.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!alreadyJoined) {
      forum.members.push(req.user._id);
      await forum.save();
    }

    res.status(200).json({
      success: true,
      message: alreadyJoined ? "Already joined forum" : "Forum joined successfully",
      forum: await buildForumResponse(forum, req.user),
    });
  } catch (err) {
    next(err);
  }
};

export const getForumPosts = async (req, res, next) => {
  try {
    const forum = await Forum.findById(req.params.id);

    if (!forum) {
      res.status(404);
      throw new Error("Forum not found");
    }

    const posts = await Post.find({ forum: forum._id })
      .sort({ createdAt: -1 })
      .populate("author", "name username avatar role verified")
      .populate("forum", "name");

    const currentUserId = req.user?._id?.toString();

    res.status(200).json({
      success: true,
      forum: await buildForumResponse(forum, req.user),
      posts: posts.map((post) => ({
        id: post._id,
        content: post.content,
        codeSnippet: post.codeSnippet,
        tags: post.tags,
        type: post.type,
        forum: post.forum
          ? {
              id: post.forum._id,
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
      })),
    });
  } catch (err) {
    next(err);
  }
};
