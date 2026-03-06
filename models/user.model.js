import mongoose from "mongoose";

// Helper to generate random color
function getRandomColor() {
  const colors = [
    "#FF5733",
    "#33B5FF",
    "#FF33A8",
    "#33FF57",
    "#FFC300",
    "#8E44AD",
    "#16A085",
    "#E67E22",
    "#2C3E50",
    "#E74C3C",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Helper to generate SVG data URL
function generateProfileSVG(username) {
  const bgColor = getRandomColor();
  const initial = username && username[0] ? username[0].toUpperCase() : "?";
  const svg = `<svg width='128' height='128' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='${bgColor}'/><text x='50%' y='50%' font-size='64' font-family='Arial, Helvetica, sans-serif' fill='#fff' text-anchor='middle' alignment-baseline='central' dominant-baseline='central'>${initial}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  userType: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  Email_verification: {
    type: Boolean,
    default: false,
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  profilePicture: {
    type: String,
    default: "", // Will be set in pre-save if not provided
  },
  bio: {
    type: String,
    maxlength: 250,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  balance:{
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to set default profilePicture if not provided
userSchema.pre("save", function (next) {
  if (!this.profilePicture) {
    this.profilePicture = generateProfileSVG(this.username);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;