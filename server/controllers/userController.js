import User from "../models/User.js";

// 👤 Get Logged-in User Profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
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
      res.status(404);
      throw new Error("User not found");
    }

    // ✅ Basic fields
    if (name) user.name = name.trim();
    if (username) user.username = username.trim();
    if (bio) user.bio = bio.trim();

    // ✅ Skills handling (IMPORTANT FIX)
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

    // ⚠️ Future: avatar & cover (when multer added)
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.cover) user.cover = req.body.cover;

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
    const user = await User.findOne({ name: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
// 🔥 FOLLOW / UNFOLLOW USER
export const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

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
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      following: currentUser.following,
      followers: targetUser.followers,
      isFollowing: !isFollowing,
    });
  } catch (err) {
    next(err);
  }
};