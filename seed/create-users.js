import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";

// Load environment variables
dotenv.config();

const createDummyUsers = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Hash the common password "123456"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // Define dummy users
    const dummyUsers = [
      {
        username: "user1",
        email: "user1@gmail.com",
        mobileNumber: "+1111111111",
        password: hashedPassword,
        userType: "user",
        Email_verification: true,
        bio: "AI enthusiast and prompt creator. Love exploring new AI technologies!",
        balance: 100,
        isActive: true,
      },
      {
        username: "user2",
        email: "user2@gmail.com",
        mobileNumber: "+2222222222",
        password: hashedPassword,
        userType: "user",
        Email_verification: true,
        bio: "Digital artist specializing in AI-generated art. Creating amazing prompts for Midjourney and DALL-E.",
        balance: 150,
        isActive: true,
      },
      {
        username: "user3",
        email: "user3@gmail.com",
        mobileNumber: "+3333333333",
        password: hashedPassword,
        userType: "user",
        Email_verification: true,
        bio: "Content creator and prompt engineer. Sharing knowledge about ChatGPT and GPT-4.",
        balance: 200,
        isActive: true,
      },
      {
        username: "user4",
        email: "user4@gmail.com",
        mobileNumber: "+4444444444",
        password: hashedPassword,
        userType: "user",
        Email_verification: true,
        bio: "Developer and AI researcher. Building the future with AI prompts.",
        balance: 120,
        isActive: true,
      },
    ];

    console.log("\n🔄 Creating dummy users...\n");

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of dummyUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [
            { username: userData.username },
            { email: userData.email },
            { mobileNumber: userData.mobileNumber },
          ],
        });

        if (existingUser) {
          console.log(`⏭️  User '${userData.username}' already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create new user
        const user = new User(userData);
        await user.save();

        console.log(`✅ Created user: ${userData.username}`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Password: 123456`);
        console.log(`   Balance: ${userData.balance} credits`);
        console.log(`   ID: ${user._id}\n`);

        createdCount++;
      } catch (error) {
        console.error(`❌ Error creating user '${userData.username}':`, error.message);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 Summary:");
    console.log(`   ✅ Created: ${createdCount} users`);
    console.log(`   ⏭️  Skipped: ${skippedCount} users (already exist)`);
    console.log("=".repeat(60));

    if (createdCount > 0) {
      console.log("\n📋 Login Credentials for all users:");
      console.log("   Password: 123456");
      console.log("\n   User Accounts:");
      dummyUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. Username: ${user.username} | Email: ${user.email}`);
      });
    }

    console.log("\n⚠️  NOTE: These are test accounts. Change passwords in production!");

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error in seed script:", error.message);
    process.exit(1);
  }
};

// Run the script
createDummyUsers();
