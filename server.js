import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

//import routes
import userRoute from "./routes/user.routes.js";
import promtRoute from "./routes/promt.routes.js";
import creditRoute from "./routes/credit.routes.js";

dotenv.config(); // Load environment variables from .env file

//db cconnection import
import { connectDB } from "./db/db.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Frontend (Vite dev server)
      "http://localhost:5173", // Alternative Vite port
      "https://aifule.aadi01.me",
      "https://promptverse.aadi01.me",
    ], // Allow your frontend URLs
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Middleware
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies
app.use(express.json({ limit: "10mb" })); // Middleware to parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Middleware to parse URL-encoded bodies

// Middleware to ensure database connection for each request (important for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  //return a json with three thing one is name, second is age and third is city
  res.json({
    response: "Welcome to aifule backend",
    ref: "for api reference use /ref",
  });
});

app.use("/api/user", userRoute); // Use user routes
app.use("/api/promt", promtRoute); // Use prompt routes
app.use("/api/credit", creditRoute); // Use credit routes

// Global error handler for multer and other errors
app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large" });
  }
  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ message: "Invalid file field" });
  }
  if (error.message && error.message.includes("Invalid file type")) {
    return res.status(400).json({ message: error.message });
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, async () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

  try {
    await connectDB(); // Connect to MongoDB when the server starts
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});
