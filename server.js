import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// import routes
import userRoute from "./routes/user.routes.js";
import promtRoute from "./routes/promt.routes.js";
import creditRoute from "./routes/credit.routes.js";

dotenv.config();

// db connection
import { connectDB } from "./db/db.js";

const app = express();

/* ---------------- CORS CONFIG ---------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://aifule.aadi01.me",
  "https://promptverse.aadi01.me",
  "https://prompt-verse-frontend.vercel.app", // ✅ ADD THIS
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------------- MIDDLEWARE ---------------- */

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* -------- DATABASE CONNECTION MIDDLEWARE ----- */

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* ---------------- ROUTES ---------------- */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    response: "Welcome to Aifule backend",
    ref: "for api reference use /ref",
  });
});

app.use("/api/user", userRoute);
app.use("/api/promt", promtRoute);
app.use("/api/credit", creditRoute);

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

  console.error("Unhandled error:", error);
  res.status(500).json({ message: "Internal server error" });
});

/* ---------------- SERVER ---------------- */

const port = process.env.PORT || 3001;

app.listen(port, async () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

  try {
    await connectDB();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});

/* -------- GRACEFUL SHUTDOWN -------- */

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  process.exit(0);
});