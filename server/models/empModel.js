const mongoose = require("mongoose");

const empSchema = new mongoose.Schema(
  {  
    emp_id: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    emp_name: {
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
      default: "user",
    },
    avatar: {
      type: {},
      default:{
        download_url :"https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
        file_name : ''
      }
    },
    projects : [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("employee", empSchema);
