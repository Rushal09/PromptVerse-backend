import {
  createCredit,
  checkAndCreditPopularPromptsRoute,
  getCreditHistory,
  getUserBalance,
} from "../controllers/credit.controller.js";
import express from "express";
import verifyToken from "../middleware/jwt.js";
const router = express.Router();

// Route to create a new credit
router.post("/create", verifyToken, createCredit);
router.post(
  "/check-credit/:promptId",
  verifyToken,
  checkAndCreditPopularPromptsRoute
);
router.get("/history", verifyToken, getCreditHistory);
router.get("/balance", verifyToken, getUserBalance);

// Export the router
export default router;
