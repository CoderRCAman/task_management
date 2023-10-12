const Users = require("../models/userModels");

const bcrypt = require("bcrypt");
const { getAuthDetails } = require("../middleware/auth");
const { IncomingForm } = require("formidable");
const path = require("path");
const _ = require("lodash");


const userCtrl = {
  
  register: async (req, res) => {
    try {
      const { name, email, password, organisation_name } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists." });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        organisation_name,
        password: passwordHash,
      });

      // Save mongodb
      await newUser.save();
      res.json({
        msg: "User created successfully.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  }
 ,
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      // If login success , create access token and refresh token

      res.cookie("role", user.role, {
        httpOnly: true,
        
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
      res.cookie("user_id", user._id, {
        httpOnly: true,

        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });
      res.cookie("isLoggedIn", true, {
        httpOnly: true,

        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res
        .status(200)
        .json({ status: true, role: user.role, user_id: user._id });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("role");
      res.clearCookie("user_id");
      res.clearCookie("isLoggedIn");
      res.json({ msg: "Logout successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    const userDetail = getAuthDetails(req);
    console.log(userDetail) 
    console.log(userDetail);
    try {
      const user = await Users.findById(userDetail.user_id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
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
      const user = await Users.findById(userDetail.user_id); 
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      form.parse(req, async(err, fields, files) => {
       
        if (err) {
          if (err.code === 1009)
            return res
              .status(500)
              .json({ msg: "Maximum supported file is 5mb" });
          else return res.status(500).json({ msg: "Somethings went wrong!" });
        } 
        console.log(fields)
        if(_.isEmpty(files)){
         const updatedUser =  await Users.findByIdAndUpdate(userDetail.user_id, {
            name : fields.name
          }); 
          console.log(updatedUser)
          return res.status(200).json({msg:'UPDATE WAS OK!'})
        }
        const newAvatar = {
          download_url : `http://localhost:5000/${files.avatar.newFilename}` ,
          file_name : files.avatar.newFilename 
        }
        await Users.findByIdAndUpdate(userDetail.user_id,{
          avatar : newAvatar , 
          name : fields.name
        }); 
        return res.status(200).json({msg:'UPDATE WAS OK!'})

      });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
