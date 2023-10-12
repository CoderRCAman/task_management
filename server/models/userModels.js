const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      default: "",
      trim: true,
    },
    email: {
      type: String, 
      trim: true,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "admin",
    },
    organisation_name: {
      type: String,
      trim: true,
    },
    avatar: {
      type: {},
      default: {
        download_url:
          "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
        file_name: "",
      },
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
