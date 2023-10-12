const Projects = require("../models/projectModel");
const Task = require("../models/taskModel");
const Employee = require("../models/empModel");
const { IncomingForm } = require("formidable");
const path = require("path");
const _ = require("lodash");
const { getAuthDetails } = require("../middleware/auth");
const User = require("../models/userModels");
const { unlink, access } = require("fs/promises");
// const e = require("express");

const deleteFileFromDisk = async (filePath) => {
  try {
    await unlink(filePath);
  } catch (error) {}
};

const ProjectCtrl = {
  getProjects: async (req, res) => {
    try {
      const authInfo = getAuthDetails(req);

      const foundUser = await User.findById(authInfo.user_id).populate(
        "projects"
      );

      res.json({ projects: foundUser.projects });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "ISE",
      });
    }
  },
  getProjectById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(500).json({ msg: "TF" });
    }
    try {
      const project = await Projects.findById(id).populate("employees");
      return res.status(200).json(project);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "ISE" });
    }
  },
  updateStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
      return res.status(500).json({ msg: "TF" });
    }
    try {
      const okUpdate = await Projects.findByIdAndUpdate(id, {
        status: status ? "Completed" : "Ongoing",
      });
      return res.status(200).json({ msg: "Update ok!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "TF" });
    }
  },
  updateTaskStatus: async (req, res) => {
    const { status, task_id } = req.body;

    try {
      await Task.findByIdAndUpdate(task_id, {
        status: status ? "Completed" : "Ongoing",
      });
      return res.status(200).json({ msg: "Update ok!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "TF" });
    }
  },
  addAttachment: async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(500).json({ msg: "TF" });
    const options = {
      uploadDir: path.join(__dirname, "..", "file-store"),
      keepExtensions: true,
      maxFileSize: 15 * 1024 * 1024,
    };
    const form = new IncomingForm(options);
    try {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          if (err.code === 1009)
            return res
              .status(500)
              .json({ msg: "Maximum supported file is 15mb" });
          else return res.status(500).json({ msg: "Somethings went wrong!" });
        }
        if (!_.isEmpty(files)) {
          const attachment = {
            download_url: `http://localhost:5000/${files.file.newFilename}`,
            file_name: files.file.newFilename,
          };
          const updateSuccess = await Projects.findByIdAndUpdate(
            id,
            {
              attachment: attachment,
            },
            {
              new: true,
            }
          );
          if (updateSuccess) return res.status(200).json(updateSuccess);
        }
        return res.status(400).json({ msg: "No file was selected!" });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "TF" });
    }
  },
  addTaskAttachment: async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(500).json({ msg: "TF" });
    const options = {
      uploadDir: path.join(__dirname, "..", "file-store"),
      keepExtensions: true,
      maxFileSize: 15 * 1024 * 1024,
    };
    const form = new IncomingForm(options);
    try {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          if (err.code === 1009)
            return res
              .status(500)
              .json({ msg: "Maximum supported file is 15mb" });
          else return res.status(500).json({ msg: "Somethings went wrong!" });
        }
        if (!_.isEmpty(files)) {
          const attachment = {
            download_url: `http://localhost:5000/${files.file.newFilename}`,
            file_name: files.file.newFilename,
          };
          const updateSuccess = await Task.findByIdAndUpdate(
            id,
            {
              attachment: attachment,
            },
            {
              new: true,
            }
          );
          if (updateSuccess) return res.status(200).json(updateSuccess);
        }
        return res.status(400).json({ msg: "No file was selected!" });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "TF" });
    }
  },

  createProject: async (req, res) => {
    const options = {
      uploadDir: path.join(__dirname, "..", "file-store"),
      keepExtensions: true,
      maxFileSize: 15 * 1024 * 1024,
    };
    const form = new IncomingForm(options);
    let newProject = null;
    try {
      const authInfo = getAuthDetails(req);
      form.parse(req, async (err, fields, files) => {
        const { project_id, title, description, startDate, endDate } = fields;

        if (err) {
          if (err.code === 1009)
            return res
              .status(500)
              .json({ msg: "Maximum supported file is 15mb" });
          else return res.status(500).json({ msg: "Somethings went wrong!" });
        }
        const alreadyExist = await Projects.findOne({ project_id: project_id });
        if (alreadyExist)
          return res.status(400).json({
            msg: "Project already exist!",
          });
        console.log(files);
        if (_.isEmpty(files)) {
          //✅  empty
          newProject = await Projects.create({
            project_id,
            title,
            description,
            startDate,
            endDate,
          });
        } else {
          // ❌ files are present
          console.log(files);
          const newDoc = {
            download_url: `http://localhost:5000/${files.docs.newFilename}`,
            file_name: files.docs.newFilename,
          };
          newProject = await Projects.create({
            project_id,
            title,
            description,
            startDate,
            endDate,
            attachment: newDoc,
          });
        }
        await User.findByIdAndUpdate(authInfo.user_id, {
          $addToSet: { projects: newProject._id },
        });
        res.json({ msg: "Projects created" });
      });
    } catch (err) {
      console.l(err);
      res.status(500).json({ message: "YOU BITCH!" });
    }
  },

  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, startDate, endDate } = req.body;
      const updateSuccess = await Projects.findByIdAndUpdate(
        id,
        {
          title,
          description,
          startDate,
          endDate,
        },
        {
          new: true,
        }
      );
      if (updateSuccess) return res.status(200).json(updateSuccess);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "ISE" });
    }
  },

  deleteProject: async (req, res) => {
    try {
      //ALOT TODO HERE
      const { id } = req.params;
      const project = await Projects.findById(id);
      if (!project) return res.status(404).json({ msg: "Project not found" });
      const fileName = project.attachment.file_name;
      const deleteFilePath = path.join(__dirname, "..", "file-store", fileName);
      await deleteFileFromDisk(deleteFilePath);

      await Projects.findByIdAndDelete(id);
      return res.status(200).json({ msg: "Delete was a success" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { project_id } = req.query;
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ msg: "Task not found" });
      const fileName = task.attachment.file_name;
      const deleteFilePath = path.join(__dirname, "..", "file-store", fileName);
      await deleteFileFromDisk(deleteFilePath);
      await Task.findByIdAndDelete(id);
      await Projects.findByIdAndUpdate(project_id, {
        $pull: { tasks: id },
      });
      return res.status(200).json({ msg: "Delete was a success" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "ISE" });
    }
  },
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { task_name, description, startDate, endDate } = req.body;
      //employees must be an array
      const updateSuccess = await Task.findByIdAndUpdate(
        id,
        {
          task_name,
          description,
          startDate,
          endDate,
        },
        {
          new: true,
        }
      );
      if (updateSuccess) return res.status(200).json(updateSuccess);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "ISE" });
    }
  },
  // getTask: async (res,req)=>{
  //              Request Response
  // },              ||    ||
  createTask: async (req, res) => {
    const options = {
      uploadDir: path.join(__dirname, "..", "file-store"),
      keepExtensions: true,
      maxFileSize: 15 * 1024 * 1024,
    };
    // const project_id = req.params.id;
    const form = new IncomingForm(options);
    let newTask = null;
    try {
      const project_id = req.params.id; //response
      form.parse(req, async (err, fields, files) => {
        const { task_name, description, startDate, endDate, employees } =
          fields;

        if (err) {
          if (err.code === 1009)
            return res
              .status(500)
              .json({ msg: "Maximum supported file is 15mb" });
          else {
            console.log(err);
            return res.status(500).json({ msg: "Somethings went wrong!" });
          }
        }

        const updatedEmp = employees.split(",").map((emp) => {
          return { user_info: emp };
        });
        console.log(updatedEmp);

        if (_.isEmpty(files)) {
          //✅  empty
          newTask = await Task.create({
            task_name,
            description,
            startDate,
            endDate,
            employees: updatedEmp,
          });
        } else {
          // ❌ files are present

          const newDoc = {
            download_url: `http://localhost:5000/${files.docs.newFilename}`,
            file_name: files.docs.newFilename,
          };
          newTask = await Task.create({
            task_name,
            employees: updatedEmp,
            description,
            startDate,
            endDate,
            attachment: newDoc,
          });
        }
        await Projects.findByIdAndUpdate(
          { _id: project_id },
          {
            $addToSet: { tasks: newTask._id },
          }
        );
        res.json({ msg: "Task created" });
      });
    } catch (err) {
      console.log(err);
      // res.status(500).json({ message: "YOU BITCH!" });
    }
  },

  getTask: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(500).json({ msg: "TF" });
      }
      const foundUser = await Projects.findById(id).populate({
        path: "tasks ",
        populate: {
          path: "employees",
          populate: {
            path: "user_info",
          },
        },
        strictPopulate: false,
      });
      res.json({ tasks: foundUser.tasks });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "ISE",
      });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      console.log(task, id);
      res.json({ task });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  enrollEmployee: async (req, res) => {
    const { id } = req.params;
    const { employees } = req.body;
    if (!id) {
      return res.status(400).json({ msg: "TF" });
    }

    try {
      await Projects.findByIdAndUpdate(id, {
        employees: employees,
      });

      for (let i = 0; i < employees.length; ++i) {
        let emp_id = employees[i];
        await Employee.findByIdAndUpdate(emp_id, {
          $addToSet: { projects: id },
        });
      }

      return res.status(200).json({ msg: "Update was success" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server error" });
    }
  },
};
module.exports = ProjectCtrl;
