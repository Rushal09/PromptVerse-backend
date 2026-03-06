import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to generate JWT tokenexport
export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "15d", // Token valid for 1 day
  });
};

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, mobileNumber, password, profilePicture } = req.body;
  try {
    // Check if all required fields are provided
    if (!username || !email || !mobileNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //check if the mobile number is already registered
    const existingMobileUser = await User.findOne({ mobileNumber });
    if (existingMobileUser) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }
    // Hash the password
    const hashedpassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      mobileNumber,
      password: hashedpassword,
      profilePicture:
        profilePicture ||
        `https://ui-avatars.com/api/?name=${username}&background=random`, // Default profile picture if not provided
    });

    // Save the new user to the database FIRST
    await newUser.save();

    //generate jwt token AFTER saving user so we have the ID
    const token = generateToken(newUser);

    //set token in cookies
    res.cookie("Aifule", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the token
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use 'lax' for localhost development
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio || "",
        following: newUser.following || [],
        followers: newUser.followers || [],
        followingCount: newUser.following ? newUser.following.length : 0,
        followersCount: newUser.followers ? newUser.followers.length : 0,
        createdAt: newUser.createdAt,
      },
      token, // Return the generated token
    });
  } catch (error) {
    console.log("Erron in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Login a user˚
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const token = generateToken(user);
    // Set token in cookies
    res.cookie("Aifule", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the token
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use 'lax' for localhost development
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profilePicture: user.profilePicture,
        bio: user.bio || "",
        following: user.following || [],
        followers: user.followers || [],
        followingCount: user.following ? user.following.length : 0,
        followersCount: user.followers ? user.followers.length : 0,
        createdAt: user.createdAt,
      },
      token, // Return the generated token
    });
  } catch (error) {
    console.log("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get user who is logged in
export const getme = async (req, res) => {
  try {
    const userId = req.user && req.user._id; // Get user ID from the request object
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profilePicture: user.profilePicture,
        bio: user.bio,
        following: user.following, // Return the actual array
        followers: user.followers, // Return the actual array
        followingCount: user.following.length,
        followersCount: user.followers.length,
      },
    });
  } catch (error) {
    console.log("Error in getme:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Update user profile
export const updateprofile = async (req, res) => {
  const { username, bio, profilePicture } = req.body;
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized Please login" });
    }
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //update user details
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    // Save the updated user
    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.log("Error in updateprofile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all users
export const getAllUsers = async (req, res) => {
  try {
    res.status(200).json({
      message: "All users retrieved successfully",
      users: await User.find().select("-password"), // Exclude password from the response
    });
  } catch (error) {
    console.log("Error in getAllUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//follow and unfollow a user
export const followunfollowUser = async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters this is the user to be followed or unfollowed
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const currentUserId = req.user && req.user._id; // Get the current user's ID from the request object
    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized Please login" });
    }
    // Check if the user to be followed exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }
    // Check if the current user is already following the user to follow if yes then unfollow
    const isFollowing = userToFollow.followers.includes(currentUserId);
    if (isFollowing) {
      // Unfollow the user
      userToFollow.followers = userToFollow.followers.filter(
        (follower) => follower.toString() !== currentUserId.toString()
      );
      await userToFollow.save();
      // Remove the user from the current user's following list
      const currentUser = await User.findById(currentUserId);
      currentUser.following = currentUser.following.filter(
        (following) => following.toString() !== userId.toString()
      );
      await currentUser.save();
      return res.status(200).json({
        message: "Unfollowed successfully",
        user: {
          id: userToFollow._id,
          username: userToFollow.username,
          followers: userToFollow.followers.length,
          following: userToFollow.following.length,
        },
      });
    }
    // Follow the user
    userToFollow.followers.push(currentUserId);
    await userToFollow.save();
    // Add the user to the current user's following list
    const currentUser = await User.findById(currentUserId);
    currentUser.following.push(userId);
    await currentUser.save();
    res.status(200).json({
      message: "Followed successfully",
      user: {
        id: userToFollow._id,
        username: userToFollow.username,
        followers: userToFollow.followers.length,
        following: userToFollow.following.length,
      },
    });
  } catch (error) {
    console.log("Error in followUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout user - clear the cookie
export const logoutUser = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("Aifule", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use 'lax' for localhost development
    });

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("Error in logoutUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in getUserById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
