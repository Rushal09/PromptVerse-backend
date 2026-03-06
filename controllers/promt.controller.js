import Promt from "../models/promt.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

// Function to create a new prompt
export const createPromt = async (req, res) => {
  const { title, description, category, tags } = req.body;
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Handle image upload if provided
    let imageUrl = "";
    if (req.files && req.files.image && req.files.image[0]) {
      try {
        // Upload from buffer (memory storage) to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:${
            req.files.image[0].mimetype
          };base64,${req.files.image[0].buffer.toString("base64")}`,
          {
            folder: "prompts_images",
            resource_type: "auto",
          }
        );
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(400).json({ message: "Failed to upload image" });
      }
    }
    //handle file upload if provided
    let fileUrl = "";
    if (req.files && req.files.file && req.files.file[0]) {
      try {
        // Upload from buffer (memory storage) to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:${
            req.files.file[0].mimetype
          };base64,${req.files.file[0].buffer.toString("base64")}`,
          {
            folder: "prompts_files",
            resource_type: "raw", // Use 'raw' for PDFs and other documents
            flags: "attachment", // Force download instead of inline display
          }
        );
        fileUrl = result.secure_url;
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        return res.status(400).json({ message: "Failed to upload file" });
      }
    }
    // Create a new prompt
    const newPromt = new Promt({
      title,
      description,
      image: imageUrl,
      category,
      createdBy: userId,
      createdByUsername: user.username,
      createdByProfilePicture: user.profilePicture || "",
      tags: tags || [],
      file: fileUrl,
    });
    // Save the prompt to the database
    await newPromt.save();
    res.status(201).json({
      message: "Prompt created successfully",
      promt: {
        id: newPromt._id,
        title: newPromt.title,
        description: newPromt.description,
        image: newPromt.image,
        category: newPromt.category,
        createdBy: {
          id: user._id,
          username: newPromt.createdByUsername,
          profilePicture: newPromt.createdByProfilePicture,
        },
        tags: newPromt.tags,
        file: newPromt.file,
        createdAt: newPromt.createdAt,
        updatedAt: newPromt.updatedAt,
      },
    });
  } catch (error) {
    console.log("Error in createPromt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete a prompt
export const deletePromt = async (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    //check if promt exists or not
    const promt = await Promt.findById(id);
    if (!promt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    //check if user is the owner of the promt
    if (promt.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this prompt" });
    }
    // If the prompt has an image and file, delete it from Cloudinary
    if (promt.image) {
      await cloudinary.uploader.destroy(
        promt.image.split("/").pop().split(".")[0],
        {
          folder: "prompts_images",
        }
      );
    }
    if (promt.file) {
      await cloudinary.uploader.destroy(
        promt.file.split("/").pop().split(".")[0],
        {
          folder: "prompts_files",
        }
      );
    }
    // Finally, delete the prompt from the database
    await Promt.findByIdAndDelete(id);
    res.status(200).json({ message: "Prompt deleted successfully" });
  } catch (error) {
    console.log("Error in deletePromt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update a prompt
export const updatePromt = async (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // Check if the prompt exists
    const promt = await Promt.findById(id);
    if (!promt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    // Check if the user is the owner of the prompt
    if (promt.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this prompt" });
    }
    // Handle image upload if provided
    let imageUrl = promt.image; // Keep the existing image if not updated
    if (req.files && req.files.image && req.files.image[0]) {
      // Upload from buffer (memory storage) to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${
          req.files.image[0].mimetype
        };base64,${req.files.image[0].buffer.toString("base64")}`,
        {
          folder: "prompts_images",
          resource_type: "auto",
        }
      );
      imageUrl = result.secure_url; // Update with new image URL
    }
    // Handle file upload if provided
    let fileUrl = promt.file; // Keep the existing file if not updated
    if (req.files && req.files.file && req.files.file[0]) {
      // Upload from buffer (memory storage) to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${
          req.files.file[0].mimetype
        };base64,${req.files.file[0].buffer.toString("base64")}`,
        {
          folder: "prompts_files",
          resource_type: "raw", // Use 'raw' for PDFs and other documents
          flags: "attachment", // Force download instead of inline display
        }
      );
      fileUrl = result.secure_url; // Update with new file URL
    }
    // Get fresh user data in case profile was updated
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the prompt with new data
    const updatedPromt = await Promt.findByIdAndUpdate(
      id,
      {
        title: req.body.title || promt.title,
        description: req.body.description || promt.description,
        image: imageUrl,
        category: req.body.category || promt.category,
        tags: req.body.tags || promt.tags,
        file: fileUrl,
        createdByUsername: user.username, // Update with current user data
        createdByProfilePicture: user.profilePicture || "",
      },
      { new: true }
    );
    res.status(200).json({
      message: "Prompt updated successfully",
      promt: {
        id: updatedPromt._id,
        title: updatedPromt.title,
        description: updatedPromt.description,
        image: updatedPromt.image,
        category: updatedPromt.category,
        createdBy: {
          id: updatedPromt.createdBy,
          username: updatedPromt.createdByUsername,
          profilePicture: updatedPromt.createdByProfilePicture,
        },
        tags: updatedPromt.tags,
        file: updatedPromt.file,
        createdAt: updatedPromt.createdAt,
        updatedAt: updatedPromt.updatedAt,
      },
    });
  } catch (error) {
    console.log("Error in updatePromt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all prompts that the login user has created
export const getMyPrompts = async (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const prompts = await Promt.find({ createdBy: userId }).lean();

    // Transform the data to match the expected frontend format
    const transformedPrompts = prompts.map((prompt) => ({
      ...prompt,
      createdBy: {
        _id: prompt.createdBy,
        username: prompt.createdByUsername,
        profilePicture: prompt.createdByProfilePicture,
      },
    }));

    res.status(200).json(transformedPrompts);
  } catch (error) {
    console.log("Error in getMyPrompts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single prompt by ID
export const getPromptById = async (req, res) => {
  const { id } = req.params;
  try {
    const promt = await Promt.findById(id);
    if (!promt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Transform the data to match the expected frontend format
    const transformedPrompt = {
      ...promt.toObject(),
      createdBy: {
        _id: promt.createdBy,
        username: promt.createdByUsername,
        profilePicture: promt.createdByProfilePicture,
      },
    };

    res.status(200).json(transformedPrompt);
  } catch (error) {
    console.log("Error in getPromptById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all prompts
export const getAllPrompts = async (req, res) => {
  //get all prompts from the database with pagination
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const prompts = await Promt.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance since we're not using populate

    // Transform the data to match the expected frontend format
    const transformedPrompts = prompts.map((prompt) => ({
      ...prompt,
      createdBy: {
        _id: prompt.createdBy,
        username: prompt.createdByUsername,
        profilePicture: prompt.createdByProfilePicture,
      },
    }));

    const totalPrompts = await Promt.countDocuments();
    const totalPages = Math.ceil(totalPrompts / limit);
    const hasMore = parseInt(page) < totalPages;

    res.status(200).json({
      prompts: transformedPrompts,
      totalPages,
      currentPage: parseInt(page),
      hasMore,
      total: totalPrompts,
    });
  } catch (error) {
    console.log("Error in getAllPrompts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//add like in prompt
export const likeDisLikePromt = async (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // Check if the prompt exists
    const promt = await Promt.findById(id);
    if (!promt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already liked the prompt then remove the like
    const existingLikeIndex = promt.likes.findIndex((like) => {
      // Handle both old format (just userID) and new format (object with user property)
      if (typeof like === "string" || like instanceof mongoose.Types.ObjectId) {
        // Old format: like is just the user ID
        return like.toString() === userId.toString();
      } else if (like.user) {
        // New format: like is an object with user property
        return like.user.toString() === userId.toString();
      }
      return false;
    });

    if (existingLikeIndex !== -1) {
      // Remove the like
      promt.likes.splice(existingLikeIndex, 1);
      await promt.save();
      return res.status(200).json({
        message: "Prompt unliked successfully",
        likes: promt.likes,
        isLiked: false,
      });
    }

    // Add the like with user details
    promt.likes.push({
      user: userId,
      username: user.username,
      profilePicture: user.profilePicture || "",
      createdAt: new Date(),
    });

    await promt.save();
    res.status(200).json({
      message: "Prompt liked successfully",
      likes: promt.likes,
      isLiked: true,
    });
  } catch (error) {
    console.log("Error in likePromt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// add comment in prompt
export const commentOnPromt = async (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user._id;
  const { comment } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  try {
    // Check if the prompt exists
    const promt = await Promt.findById(id);
    if (!promt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the comment with user details to the prompt's comments array
    const newComment = {
      user: userId,
      username: user.username,
      profilePicture: user.profilePicture || "",
      comment: comment.trim(),
      createdAt: new Date(),
    };

    promt.comments.push(newComment);
    await promt.save();

    res.status(200).json({
      message: "Comment added successfully",
      comment: newComment,
      totalComments: promt.comments.length,
    });
  } catch (error) {
    console.log("Error in commentOnPromt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Migration function to update old likes to new format
export const migrateLikesToNewFormat = async (req, res) => {
  try {
    console.log("Starting migration of likes to new format...");

    // Get all prompts
    const prompts = await Promt.find({});
    let updatedCount = 0;

    for (const prompt of prompts) {
      let needsUpdate = false;
      const updatedLikes = [];

      for (const like of prompt.likes) {
        if (typeof like === "string" || (like._id && !like.user)) {
          // This is an old format like (just user ID)
          const userId = typeof like === "string" ? like : like._id;
          const user = await User.findById(userId);

          if (user) {
            updatedLikes.push({
              user: userId,
              username: user.username,
              profilePicture: user.profilePicture || "",
              createdAt: new Date(),
            });
            needsUpdate = true;
          }
        } else {
          // This is already in new format
          updatedLikes.push(like);
        }
      }

      if (needsUpdate) {
        prompt.likes = updatedLikes;
        await prompt.save();
        updatedCount++;
        console.log(`Updated prompt ${prompt._id}`);
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} prompts.`);
    res.status(200).json({
      message: "Migration completed successfully",
      updatedCount,
    });
  } catch (error) {
    console.log("Error in migration:", error);
    res.status(500).json({ message: "Migration failed", error: error.message });
  }
};
