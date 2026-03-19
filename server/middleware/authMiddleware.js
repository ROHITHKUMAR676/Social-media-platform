import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 Protect routes
export const protect = async (req, res, next) => {
  let token;

  try {
    // ✅ Get token from header (Bearer)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Get user (without password)
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401);
    next(err);
  }
};