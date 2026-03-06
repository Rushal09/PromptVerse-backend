import Promt from "../models/promt.model.js";
import User from "../models/user.model.js";

// Migration function to update existing likes and comments with user details
export const migratePromptData = async (req, res) => {
  try {
    console.log("Starting migration of prompt data...");

    const prompts = await Promt.find({});
    let updatedCount = 0;

    for (const prompt of prompts) {
      let hasChanges = false;

      // Migrate likes
      if (prompt.likes && prompt.likes.length > 0) {
        const newLikes = [];

        for (const like of prompt.likes) {
          // Check if like is already in new format (has username property)
          if (like.username) {
            newLikes.push(like);
            continue;
          }

          // If like is in old format (just ObjectId), fetch user details
          const userId = like.user || like; // Handle both old and current formats
          const user = await User.findById(userId);

          if (user) {
            newLikes.push({
              user: userId,
              username: user.username,
              profilePicture: user.profilePicture || "",
              createdAt: like.createdAt || new Date(),
            });
            hasChanges = true;
          }
        }

        if (hasChanges) {
          prompt.likes = newLikes;
        }
      }

      // Migrate comments
      if (prompt.comments && prompt.comments.length > 0) {
        const newComments = [];

        for (const comment of prompt.comments) {
          // Check if comment is already in new format (has username property)
          if (comment.username) {
            newComments.push(comment);
            continue;
          }

          // If comment is in old format, fetch user details
          const user = await User.findById(comment.user);

          if (user) {
            newComments.push({
              user: comment.user,
              username: user.username,
              profilePicture: user.profilePicture || "",
              comment: comment.comment,
              createdAt: comment.createdAt || new Date(),
            });
            hasChanges = true;
          }
        }

        if (hasChanges) {
          prompt.comments = newComments;
        }
      }

      // Save the prompt if there were changes
      if (hasChanges) {
        await prompt.save();
        updatedCount++;
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} prompts.`);

    if (res) {
      res.status(200).json({
        message: "Migration completed successfully",
        updatedPrompts: updatedCount,
        totalPrompts: prompts.length,
      });
    }
  } catch (error) {
    console.error("Error in migration:", error);
    if (res) {
      res
        .status(500)
        .json({ message: "Migration failed", error: error.message });
    }
  }
};

// Helper function to run migration on server start
export const runMigrationOnStart = async () => {
  try {
    await migratePromptData();
  } catch (error) {
    console.error("Auto-migration failed:", error);
  }
};
