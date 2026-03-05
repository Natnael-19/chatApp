import User from "../models/User.js";
import jwt from "jsonwebtoken";

//authentication protect routes
export const protectRoute = async (req, res, next) => {
  //get token from header
  try {
    const token = req.headers.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
//check authenticated user
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};
