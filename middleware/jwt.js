import Jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to verify JWT token get the token from the cookies
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.Aifule; // Assuming the token is stored in a cookie named 'Aifule'

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};
export default verifyToken;
