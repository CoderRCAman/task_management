import React, { useRef, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Avatar,
  Button,
  Tooltip,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import RightBar from "../components/RightBar";
import AddOutlined from "@mui/icons-material/AddOutlined"; 
import axios from 'axios' ;
import toast, {Toaster} from 'react-hot-toast' ;
const initialState = {
  emp_id: "",
  emp_name: "",
  email: "",
  password: "",
};

export default function AddUser() {
  const [user, setUser] = useState(initialState);
  const [images, setImages] = useState(null);
  const imageRef = useRef(null);
  const [callback, setCallback] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "avatar") {
      //console.log(e) ;

      setImages(e.target.files[0]);
    }
    setUser({ ...user, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    console.log(images) 
    try {
      // console.log(bookData);
      const formData = new FormData();

      formData.append("avatar", images);
      formData.append("emp_id", user.emp_id);
      formData.append("emp_name", user.emp_name);
      formData.append("email", user.email);
      formData.append("password", user.password);

      // const res = await fetch("http://localhost:5000/user/", {
      //   method: "POST",
      //   body: formData,
      // });
      // const responseBody = await res.json();
      // if (res.status === 200) {
      //   alert("User Added");
      //   setUser(initialState);
      //   setCallback(!callback);
       
      // } else {
      //   alert("Failed to add!");
      // } 
      const res = await axios({
        method : "POST" ,
        url : 'http://localhost:5000/api/employee' , 
        data : formData , 
        withCredentials : true ,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }) 
      if(res.status === 200) {
        toast.success("Successfully created!") ;
      }
      else {
        toast.error('Failed to create an employee!') ;
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div>
      <NavBar /> 
      <Toaster />
      <Stack direction={"row"} height='90vh'>
        <Sidebar />
        <Box
          flex={4}
          sx={{
            borderLeft: 2,
            borderRight: 2,
            borderColor: "#182638",
            maxHeight: "89vh",
            overflow: "scroll",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* MAIN CONTENT  */}
          <Typography color={"#475569"} fontWeight="bold" fontSize={19}>
            Add a new Employee!
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <Box display={"flex"} flexDirection="column">
              <Box
                display={"flex"}
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
              >
                <Avatar
                  sx={{ width: 120, height: 120 }}
                  src={
                    images
                      ? URL.createObjectURL(images)
                      : "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80"
                  }
                />

                <BorderColorIcon
                  sx={{
                    color: "#1876b3",
                    marginTop: "20px",
                  }}
                />
                <TextField
                  margin="normal"
                  onChange={handleChangeInput}
                  name="avatar"
                  type={'file'}
                  sx={{
                    width: "10px",
                    opacity: "0",
                    position: "relative",
                    top: "-50px",
                    right: "5px",
                    height: "5px",
                  }}
                />
              </Box>

              <Box
                gap={2}
                display={"flex"}
                justifyContent="space-between"
                flexDirection="row"
              >
                <TextField
                  margin="normal"
                  type="text"
                  label="Employee ID"
                  name="emp_id"
                  required
                  fullWidth
                  onChange={handleChangeInput}
                  inputProps={{ style: { color: "#fff" } }}
                  sx={{
                    label: { color: "#94a3b8" },

                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": { borderColor: "#64748b" },
                      "&:hover fieldset": {
                        borderColor: "#1876D2",
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  type="text"
                  label="Name"
                  name="emp_name"
                  required
                  fullWidth
                  onChange={handleChangeInput}
                  inputProps={{ style: { color: "#fff" } }}
                  sx={{
                    label: { color: "#94a3b8" },

                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": { borderColor: "#64748b" },
                      "&:hover fieldset": {
                        borderColor: "#1876D2",
                      },
                    },
                  }}
                />
              </Box>

              <Box
                gap={2}
                display={"flex"}
                justifyContent="space-between"
                flexDirection="row"
              >
                <TextField
                  margin="normal"
                  type="text"
                  name="email"
                  onChange={handleChangeInput}
                  label="email"
                  inputProps={{ style: { color: "#fff" } }}
                  required
                  fullWidth
                  sx={{
                    label: { color: "#94a3b8" },

                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": { borderColor: "#64748b" },
                      "&:hover fieldset": {
                        borderColor: "#1876D2",
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  type="text"
                  label="password"
                  name="password"
                  required
                  onChange={handleChangeInput}
                  fullWidth
                  inputProps={{ style: { color: "#fff" } }}
                  sx={{
                    label: { color: "#94a3b8" },

                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": { borderColor: "#64748b" },
                      "&:hover fieldset": {
                        borderColor: "#1876D2",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            <Box display={"flex"} justifyContent={"center"} mt={5}>
              <Button
                startIcon={<AddOutlined />}
                variant="outlined"
                color="success"
                type="submit"
              >
                {" "}
                ADD
              </Button>
            </Box>
          </form>
        </Box>
        <RightBar />
      </Stack>
    </div>
  );
}
