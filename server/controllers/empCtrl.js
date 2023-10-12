const Employee = require("../models/empModel");
const bcrypt = require("bcrypt");
const { IncomingForm } = require("formidable");
const path = require("path");
const _ = require("lodash");
const { getAuthDetails } = require("../middleware/auth");
const User = require("../models/userModels");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const crypto = require("crypto");
const EmployeeCtrl = {
  getEmployees: async (req, res) => {
    try {
      const authInfo = getAuthDetails(req);

      const foundUser = await User.findById(authInfo.user_id).populate(
        "employees"
      );

      res.json({ employees: foundUser.employees });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "ISE",
      });
    }
  },
  getEmployee: async (req, res) => {
    try {
      const authInfo = getAuthDetails(req);

      const foundUser = await Employee.findById(authInfo.user_id).select(
        "-password"
      );

      res.status(200).json(foundUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "ISE",
      });
    }
  },

  createEmployee: async (req, res) => {
    const options = {
      uploadDir: path.join(__dirname, "..", "avatars"),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    };
    const form = new IncomingForm(options);
    let newEmp = null;
    try {
      const authInfo = getAuthDetails(req);

      form.parse(req, async (err, fields, files) => {
        const { emp_name, email, address, password, emp_id } = fields;

        if (err) {
          if (err.code === 1009)
            return res
              .status(500)
              .json({ msg: "Maximum supported file is 5mb" });
          else return res.status(500).json({ msg: "Somethings went wrong!" });
        }
        const alreadyExist = await Employee.findOne({
          $or: [{ emp_id: emp_id }, { email: email }],
        });
        if (alreadyExist)
          return res.status(400).json({
            msg: "Employee already exist!",
          });

        if (password.length < 6)
          return res
            .status(400)
            .json({ msg: "Password is at least 6 characters long." });

        // Password Encryption
        const passwordHash = await bcrypt.hash(password, 10);
        if (_.isEmpty(files)) {
          //✅  empty
          newEmp = await Employee.create({
            emp_id,
            emp_name,
            email,
            password,
            address,
            password: passwordHash,
          });
        } else {
          // ❌ files are present
          console.log(files);
          const newAvatar = {
            download_url: `http://localhost:5000/${files.avatar.newFilename}`,
            file_name: files.avatar.newFilename,
          };
          newEmp = await Employee.create({
            emp_id,
            emp_name,
            email,
            password,
            address,
            password: passwordHash,
            avatar: newAvatar,
          });
        }
        await User.findByIdAndUpdate(authInfo.user_id, {
          $addToSet: { employees: newEmp._id },
        });
        res.json({ msg: "Employee created" });
      });
    } catch (err) {
      console.l(err);
      res.status(500).json({ message: "YOU BITCH!" });
    }
  },

  getEmployeeById: async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await Employee.findById(id).populate("projects");
      console.log(employee);
      return res.status(200).json(employee);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "YOU BITCH!" });
    }
  },
  employeeLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const empLogin = await Employee.findOne({ email: email });

      if (!empLogin)
        return res.status(400).json({ msg: "No Such User Exists" });
      const isMatch = await bcrypt.compare(password, empLogin.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });
      res.cookie("role", empLogin.role, {
        httpOnly: true,

        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
      res.cookie("user_id", empLogin._id, {
        httpOnly: true,

        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
      res.cookie("isLoggedIn", true, {
        httpOnly: true,

        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res
        .status(200)
        .json({ status: true, role: empLogin.role, user_id: empLogin._id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error!" });
    }
  },

  getProject: async (req, res) => {
    const { id } = req.params;
    const { user_id } = getAuthDetails(req);

    try {
      const project = await Project.findById(id)
        .select("-employees")
        .populate({
          path: "tasks ",
          populate: {
            path: "employees",
            populate: {
              path: "user_info",
            },
          },
          strictPopulate: false,
        });
      const availTask = [];

      project.tasks.forEach((task) => {
        //check if employee is listed
        if (
          task.employees.find((emp) => emp.user_info._id.toString() === user_id)
        ) {
          newEmployees = [] ; 
          task.employees.forEach(emp => {
             if(emp.user_info._id.toString() === user_id) 
              newEmployees.push(emp) ;
          }) 
          task.employees = newEmployees ; 
          availTask.push(task);
        } 

      });

      project.tasks = availTask; 
      return res.status(200).json(project);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error!" });
    }
  },
  updateUser: async (req, res) => {
    const userDetail = getAuthDetails(req);
    const options = {
      uploadDir: path.join(__dirname, "..", "avatars"),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    };
    const form = new IncomingForm(options);
    console.log(userDetail);
    try {
      const user = await Employee.findById(userDetail.user_id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          if (err.code === 1009)
            return res
              .status(500)
              .json({ msg: "Maximum supported file is 5mb" });
          else return res.status(500).json({ msg: "Somethings went wrong!" });
        }
        console.log(fields);
        if (_.isEmpty(files)) {
          const updatedUser = await Employee.findByIdAndUpdate(
            userDetail.user_id,
            {
              emp_name: fields.emp_name,
            }
          );
          console.log(updatedUser);
          return res.status(200).json({ msg: "UPDATE WAS OK!" });
        }
        const newAvatar = {
          download_url: `http://localhost:5000/${files.avatar.newFilename}`,
          file_name: files.avatar.newFilename,
        };
        await Employee.findByIdAndUpdate(userDetail.user_id, {
          avatar: newAvatar,
          emp_name: fields.emp_name,
        });
        return res.status(200).json({ msg: "UPDATE WAS OK!" });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  userUpdate: async (req, res) => {
    const { task_id, user_id } = req.params;
    const submission_id = crypto.randomBytes(10).toString("hex");
    try {
      const options = {
        uploadDir: path.join(__dirname, "..", "avatars"),
        keepExtensions: true,
        maxFileSize: 15 * 1024 * 1024,
      };
      const task = await Task.findById(task_id);
      const form = new IncomingForm(options);
      form.parse(req, async (err, fields, files) => {
        if (err) {
          if (err.code === 1009)
            return res
              .status(500)
              .json({ msg: "Maximum supported file is 15mb" });
          else return res.status(500).json({ msg: "Somethings went wrong!" });
        }
        console.log(task);
        if (_.isEmpty(files)) {
          const userUploads =
            task?.employees.find((emp) => emp.user_info.toString() === user_id)
              .uploads?.user_response || [];
          const newUpdate = {
            response_text: fields.text,
            date: new Date(),
          };
          userUploads.push(newUpdate);
          task.employees.forEach((emp) => {
            if (emp.user_info.toString() === user_id) {
              if (emp.uploads) {
                emp.uploads.user_response = userUploads;
              } else {
                const uploads = {
                  user_response: userUploads,
                };
                emp.uploads = uploads;
              }
            }
          });
          await Task.findByIdAndUpdate(task_id, task);
          return res.status(201).json({ msg: "Progress Updated!" });
        }

        const userUploads =
          task?.employees.find((emp) => emp.user_info.toString() === user_id)
            .uploads?.user_response || [];
        const newUpdate = {
          response_text: fields.text,
          file: {
            download_url: `http://localhost:5000/${files.file.newFilename}`,
            file_name: files.file.newFilename,
          },
          date: new Date(),
        };
        userUploads.push(newUpdate);
        task.employees.forEach((emp) => {
          if (emp.user_info.toString() === user_id) {
            if (emp.uploads) {
              emp.uploads.user_response = userUploads;
            } else {
              uploads = {
                user_response: userUploads,
              };
              emp.uploads = uploads;
            }
          }
        });
        await Task.findByIdAndUpdate(task_id, task);

        return res.status(201).json({ msg: "Progress Updated!" });
      });
    } catch (error) {}
  },

  managerUpdate: async (req, res) => {
    const body = req.body;
    const { user_id, task_id, reply } = body; 
    try {
      const task = await Task.findById(task_id); 
      const adminUploads =
        task?.employees.find((emp) => emp.user_info.toString() === user_id)
          ?.uploads?.admin_response || [];
      const newUpdate = {
        reply: reply,
        date: new Date(),
      };
      adminUploads.push(newUpdate); 
      console.log(adminUploads);
      task.employees.forEach((emp) => {
        if (emp.user_info.toString() === user_id) {
          if (emp.uploads) {
            emp.uploads.admin_response = adminUploads;
          } else {
           const uploads = {
              admin_response: adminUploads,
            };
            emp.uploads = uploads;
          }
        }
      });
      await Task.findByIdAndUpdate(task_id , task) ;
      return res.status(200).json({msg:'Reply sent successfully!'})
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }, 

  updateEmployeeTask : async (req,res) => {
    const {id} = req.params ; 
    const employees = req.body ; 
    console.log(employees); 
    try {
      await Task.findByIdAndUpdate(id , {employees: employees }) ; 
      return res.status(200).json({msg:'Successfully Update!'}) ;
    } catch (error) {
      console.log(error) ;  
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};
module.exports = EmployeeCtrl;
