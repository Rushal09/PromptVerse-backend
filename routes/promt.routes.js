import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import upload from "../middleware/multer.js";
import {
  createPromt,
  deletePromt,
  updatePromt,
  getMyPrompts,
  getPromptById,
  getAllPrompts,
  likeDisLikePromt,
  commentOnPromt,
  migrateLikesToNewFormat,
} from "../controllers/promt.controller.js";

const router = express.Router();

router.post("/create", verifyToken, upload, createPromt);
router.delete("/:id", verifyToken, deletePromt);
router.put("/update/:id", verifyToken, upload, updatePromt);

router.get("/my-prompts", verifyToken, getMyPrompts);
router.get("/all", verifyToken, getAllPrompts);
router.get("/:id", getPromptById);
router.put("/like/:id", verifyToken, likeDisLikePromt);
router.post("/comment/:id", verifyToken, commentOnPromt);
router.post("/migrate-likes", migrateLikesToNewFormat);

export default router;