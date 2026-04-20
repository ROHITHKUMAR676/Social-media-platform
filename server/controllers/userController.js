import User from "../models/User.js";

const publicUserListFields = [
  "name",
  "username",
  "bio",
  "role",
  "skills",
  "avatar",
  "verified",
].join(" ");

const getUserConnectionList = async (req, res, next, listType) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select(`username ${listType}`)
      .populate(listType, publicUserListFields);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      username: user.username,
      users: user[listType] || [],
    });
  } catch (err) {
    next(err);
  }
};


// 👤 Get Logged-in User Profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};


// 🔥 Create or Update Profile
export const createOrUpdateProfile = async (req, res, next) => {
  try {
    let {
      name,
      username,
      bio,
      skills,
      location,
      github,
      linkedin,
      college,
      school,
      year,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Name
    if (name) user.name = name.trim();

    // ✅ Username (with uniqueness check)
    if (username) {
      const existing = await User.findOne({ username });

      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Username already taken" });
      }

      user.username = username.trim();
    }

    // ✅ Bio
    if (bio) user.bio = bio.trim();

    // ✅ Skills
    if (skills) {
      if (typeof skills === "string") {
        user.skills = skills.split(",").map((s) => s.trim());
      } else {
        user.skills = skills;
      }
    }

    // ✅ Other fields
    if (location) user.location = location.trim();
    if (github) user.github = github.trim();
    if (linkedin) user.linkedin = linkedin.trim();
    if (college) user.college = college.trim();
    if (school) user.school = school.trim();
    if (year) user.year = year.trim();

    // (future image upload support)
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.cover) user.cover = req.body.cover;

    // 🔥 CRITICAL
    user.profileCompleted = true;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};


// 🌍 Get user by username (public)
export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// 👥 GET FOLLOW STATS
export const getFollowStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      followersCount: user.followers.length,
      followingCount: user.following.length,
    })
  } catch (err) {
    next(err)
  }
}
// 🔥 FOLLOW / UNFOLLOW USER
export const getFollowers = async (req, res, next) => {
  await getUserConnectionList(req, res, next, "followers");
};

export const getFollowing = async (req, res, next) => {
  await getUserConnectionList(req, res, next, "following");
};

export const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // ❌ Prevent self-follow
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ FIX: Proper ObjectId comparison
    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId
    );

    if (isFollowing) {
      // ❌ UNFOLLOW
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
    } else {
      // ✅ FOLLOW
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      isFollowing: !isFollowing,
      followingCount: currentUser.following.length,
      followersCount: targetUser.followers.length,
      targetUserId,
    });
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const currentUserId = req.user?._id?.toString();

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { username: searchRegex },
        { role: searchRegex },
        { skills: { $elemMatch: { $regex: searchRegex } } },
      ],
      ...(currentUserId ? { _id: { $ne: req.user._id } } : {}),
      profileCompleted: true,
    })
      .select("-password")
      .limit(10)
      .sort({ verified: -1, followers: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};
