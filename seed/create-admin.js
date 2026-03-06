import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ userType: "admin" });
    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists:");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   ID: ${existingAdmin._id}`);
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create admin user
    const admin = new User({
      username: "admin",
      email: "admin@promptverse.com",
      mobileNumber: "+1234567890",
      password: hashedPassword,
      userType: "admin",
      Email_verification: true,
      bio: "Administrator of PromptVerse - AI Prompt Marketplace",
      balance: 10000,
      isActive: true,
    });

    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("   Username: admin");
    console.log("   Email: admin@promptverse.com");
    console.log("   Password: admin123");
    console.log("   Mobile: +1234567890");
    console.log("   User ID: " + admin._id);
    console.log(
      "\n⚠️  IMPORTANT: Change the admin password after first login!"
    );

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

// Run the script
createAdmin();
