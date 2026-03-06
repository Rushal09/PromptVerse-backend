import mongoose from "mongoose";

const promtSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdByUsername: {
    type: String,
    required: true,
  },
  createdByProfilePicture: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Made optional for backward compatibility
      },
      username: {
        type: String,
        required: false, // Made optional for backward compatibility
      },
      profilePicture: {
        type: String,
        default: "",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Made optional for backward compatibility
      },
      username: {
        type: String,
        required: false, // Made optional for backward compatibility
      },
      profilePicture: {
        type: String,
        default: "",
      },
      comment: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
  },
  isfree: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    default: 0,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

const Promt = mongoose.model("Promt", promtSchema);
export default Promt;
