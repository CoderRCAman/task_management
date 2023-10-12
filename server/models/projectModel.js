const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    project_id: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String, //[ongoing , completed,closed]
      trim: true,
      default: 'ongoing'
    },
 
    attachment: {
      type: {},
      default:{
        download_url :"",
        file_name : '',
      }
    },

    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],

    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
