const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    task_name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String, //[ongoing , completed]
      trim: true,
      default: "ongoing",
    },
    attachment: {
      type: {},
      default: {
        download_url: "",
        file_name: "",
      },
    },

    employees: [
      {
        user_info: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "employee",
        },
        uploads: {},
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("task", taskSchema);
