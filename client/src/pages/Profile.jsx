import { Stack, Box, Typography } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import RightBar from "../components/RightBar";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { TextField, Avatar, Button, Tooltip } from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import AddOutlined from "@mui/icons-material/AddOutlined";

const initialState = {
  name: "",
  avatar: null,
};

export default function Profile() {
  const [user, setUser] = useState(initialState);

  const fileRef = useRef(null);

  const { name, avatar } = user;

  const getUser = async () => {
    try {
      const userResponse = await axios.get("http://localhost:5000/user/infor", {
        withCredentials: true,
      });
      console.log(userResponse);
      setUser(userResponse.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const updateInfor = () => {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (avatar) formData.append("avatar", user.avatar);
    try {
      axios.patch("http://localhost:5000/user/update", formData, {
        withCredentials: true,
      });
      console.log(user);
      toast.success("Update successfully", { autoClose: 1500 });
    } catch (err) {
      setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "avatar") {
      setUser({ ...user, [name]: e.target.files[0] });
      return;
    }
    setUser({ ...user, [name]: value });
  };
  const handleUpdate = () => {
    if (name) updateInfor();
  };
  return (
    <div>
      <Toaster />
      <Navbar />
      <Stack direction={"row"} height={"90vh"}>
        <Sidebar />
        <Box
          flex={4}
          sx={{
            borderLeft: 2,
            borderRight: 2,
            borderColor: "#182638",
            overflow: "scroll",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#0d1723",
              padding: "30px",
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                color="#67e8f9"
                fontWeight={"bold"}
                height={24}
                width={50}
                p={"2px"}
                bgcolor={"#155e75"}
                textAlign={"center"}
                borderRadius={1}
              >
                Admin
              </Typography>
              <Box>
                <Typography
                  color="#7f7f7f"
                  fontSize={16}
                  fontWeight={"bold"}
                  fontFamily={"Roboto"}
                >
                  {user?.email}
                </Typography>
                <Typography
                  color="#7f7f7f"
                  fontSize={16}
                  fontWeight={"bold"}
                  fontFamily={"Roboto"}
                  sx={{
                    display: "flex",

                    justifyContent: "flex-end",
                  }}
                >
                  
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                mt={1}
                sx={{
                  display: "flex",
                }}
               
              >
                <Avatar
                  sx={{ height: 100, width: 100, marginRight: "5px", ml: 5 }}
                  src={
                    user.avatar?.download_url
                      ? user.avatar?.download_url
                      : user.avatar
                      ? URL.createObjectURL(user.avatar)
                      : "/static/images/avatar/1.jpg"
                  }
                  
                />
                <input
                  onChange={handleChange}
                  name="avatar"
                  ref={fileRef}
                  type="file"
                  style={{ display: "none" }}
                />
                <ModeEditIcon
                  sx={{
                    color: "white",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#2dd4bf",
                    },
                  }}
                  onClick={() => fileRef.current.click()}
                />
              </Box>
              <TextField
                margin="normal"
                type="text"
                label="Name"
                size="small"
                value={user?.name}
                onChange={handleChange}
                name="name"
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

              <Button
                variant="outlined"
                onClick={handleUpdate}
                sx={{
                  marginTop: "10px",
                }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>
        <RightBar />
      </Stack>
    </div>
  );
}
