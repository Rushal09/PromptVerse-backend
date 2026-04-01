import {
  registerUser,
  loginUser,
  getme,
  updateprofile,
  getAllUsers,
  followunfollowUser,
  logoutUser,
  getUserById,
} from "../controllers/user.controller.js";

import express from "express";
import  verifyToken  from "../middleware/jwt.js";

const router = express.Router();
// Route to register a new user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); // Logout route
router.get("/profile", verifyToken, getme);
router.put("/update", verifyToken, updateprofile);
router.get("/all", verifyToken, getAllUsers);
router.get("/:userId", verifyToken, getUserById); // Get user by ID
router.put("/follow/:id", verifyToken, followunfollowUser); // Follow a user
export default router;
