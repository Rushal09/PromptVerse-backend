import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// import routes
import userRoute from "./routes/user.routes.js";
import promtRoute from "./routes/promt.routes.js";
import creditRoute from "./routes/credit.routes.js";

// db connection
import { connectDB } from "./db/db.js";

dotenv.config();

const app = express();

/* ---------------- CORS CONFIG ---------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://aifule.aadi01.me",
  "https://promptverse.aadi01.me",
  "https://prompt-verse-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin like Postman / server-to-server
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// optional preflight support
app.options("*", cors());

/* ---------------- MIDDLEWARE ---------------- */

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ---------------- ROUTES ---------------- */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    response: "Welcome to PromptVerse backend",
    ref: "Use /health to check server status",
  });
});

app.use("/api/user", userRoute);

// support both old typo route and corrected route
app.use("/api/promt", promtRoute);
app.use("/api/prompt", promtRoute);

app.use("/api/credit", creditRoute);

/* --------------- 404 HANDLER -------------- */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

/* --------------- ERROR HANDLER -------------- */

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

  if (error.message && error.message.includes("CORS")) {
    return res.status(403).json({ message: error.message });
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ message: "Internal server error" });
});

/* ---------------- SERVER ---------------- */

const port = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

/* -------- GRACEFUL SHUTDOWN -------- */

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  process.exit(0);
});