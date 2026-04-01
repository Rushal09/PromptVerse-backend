import {
  createPromt,
  deletePromt,
  updatePromt,
  getMyPrompts,
  getAllPrompts,
  getPromptById,
  likeDisLikePromt,
  commentOnPromt,
  migrateLikesToNewFormat,
} from "../controllers/promt.controller.js";
import { migratePromptData } from "../utils/migration.js";
import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import uploadFields from "../middleware/upload.js";
const router = express.Router();

// Route to create a new prompt
router.post("/create", uploadFields, verifyToken, createPromt);
router.delete("/delete/:id", verifyToken, deletePromt);
router.put("/update/:id", uploadFields, verifyToken, updatePromt);
router.get("/my-prompts", verifyToken, getMyPrompts);
router.get("/all", verifyToken, getAllPrompts);
router.get("/:id", verifyToken, getPromptById);
router.put("/like-dislike/:id", verifyToken, likeDisLikePromt);
router.post("/comment/:id", verifyToken, commentOnPromt);
// Migration route (for admin use)
router.post("/migrate", verifyToken, migratePromptData);
router.post("/migrate-likes", verifyToken, migrateLikesToNewFormat);
// Export the router
export default router;
