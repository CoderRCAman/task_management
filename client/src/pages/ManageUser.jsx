import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";

import { Box, Stack, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import AddOutlined from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
export default function ManageUser() {
  const fileRef = useRef(null);
  const [project, setProject] = useState(null);
  const [userResponse, setUserResponse] = useState({
    file: null,
    text: "",
  });
  const params = useParams();
  const id = localStorage.getItem("user_id");
  const getProject = async () => {
    try {
      const employeeRes = await axios.get(
        `http://localhost:5000/api/employee/project/${params.id}`,
        {
          withCredentials: true,
        }
      );
      if (employeeRes.status === 200) {
        console.log(employeeRes.data);
        setProject(employeeRes.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "file") {
      setUserResponse({ ...userResponse, file: e.target.files[0] });
      return;
    }
    setUserResponse({ ...userResponse, [name]: value });
  };

  const handleSubmit = async (task_id) => {
    const user_id = localStorage.getItem("user_id");
    const formData = new FormData();
    formData.append("text", userResponse.text);
    formData.append("file", userResponse.file);
    try {
      const postRes = await axios.post(
        `http://localhost:5000/api/upload/${task_id}/${user_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (postRes.status === 201) {
        toast.success(postRes.data.msg);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    console.log("heelo");
    getProject();
  }, []);

  return (
    <div>
      <Toaster />
      <NavBar />
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
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Typography color={"#475569"} fontWeight="bold" fontSize={19}>
              Project Details!
            </Typography>
          </Box>

          <Box
            display={"flex"}
            mb={2}
            flexDirection="column"
            sx={{
              textTransform: "capitalize",
            }}
          >
            <Typography color={"#475569"} fontWeight="bold" fontSize={14}>
              {project?.project_id}
            </Typography>
            <Typography color={"#c9d6dd"} fontWeight="bold" fontSize={22}>
              {project?.title}
              
            </Typography>
            <Box>
                <Typography
                  color={"#475569"}
                  fontWeight={"bold"}
                  sx={{
                    fontSize: "12px",
                  }}
                >
                  Start:{" "}
                  {new Date(project?.startDate).toLocaleDateString("en-IN", {
                    minute: "numeric",
                    hour: "numeric",
                    hour12: true,
                  })}
                </Typography>
                <Typography
                  color={"#475569"}
                  fontWeight={"bold"}
                  sx={{
                    fontSize: "12px",
                  }}
                >
                  End :{" "}
                  {new Date(project?.endDate).toLocaleDateString("en-IN", {
                    minute: "numeric",
                    hour: "numeric",
                    hour12: true,
                  })}
                </Typography>
              </Box>
            
            

            <Typography color={project?.status === "Completed" ? "#2dcc22" : "yellow"} fontWeight="bold" fontSize={16}>
              {project?.status}
            </Typography>

            <Typography color={"#475569"} fontWeight="bold" fontSize={14}>
              {project?.description}
            </Typography>
          </Box>
          <Box>
            {project?.attachment?.file_name ? (
              <Box display={"flex"} alignItems="center">
                <Box color="gray">
                  <Typography color="#a1a1aa" fontWeight={"bold"}>
                    Attachment file
                  </Typography>
                  <Typography>{project.attachment.file_name}</Typography>{" "}
                </Box>
                <Button
                  sx={{
                    marginTop: "10px",
                  }}
                  startIcon={<DownloadIcon />}
                  onClick={() => window.open(project.attachment.download_url)}
                ></Button>
              </Box>
            ) : (
              <Box display="flex" alignItems={"center"} gap={2}></Box>
            )}
          </Box>

          <Box
            sx={{
              marginTop: "30px",
            }}
          >
            {project?.tasks.slice(0).reverse().map((task) => (
              <Box
                sx={{
                  display: "flex",
                  backgroundColor: "#0f172a",
                  flexDirection: "column",
                  borderRadius: 1,
                  border: 2,
                  borderColor: "#122033",
                  padding: 1,
                  marginTop: "15px",
                  color: "#475569",
                }}
              >
                <Box>
                  <Typography color="#adadad" fontWeight={"bold"}>
                    {task.task_name}
                  </Typography>
                </Box>
                <Typography color={task.status === "Completed" ? "#2dcc22" : "yellow"} fontWeight="bold" mb={2}>
                  {task.status}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography color={"#475569"} fontWeight={"bold"}>
                    Start:{" "}
                    {new Date(task?.startDate).toLocaleDateString("en-IN", {
                      minute: "numeric",
                      hour: "numeric",
                      hour12: true,
                    })}
                  </Typography>
                  <Typography color={"#475569"} fontWeight={"bold"}>
                    End:{" "}
                    {new Date(task?.endDate).toLocaleDateString("en-IN", {
                      minute: "numeric",
                      hour: "numeric",
                      hour12: true,
                    })}
                  </Typography>
                </div>

                <Box display={"flex"} gap={2} mb={2}>
                  <DownloadIcon
                    onClick={() => window.open(task.attachment.download_url)}
                    cursor="pointer"
                    sx={{
                      "&:hover": {
                        color: "#0e7490",
                      },
                    }}
                  />
                </Box>
                <Typography>{task.description}</Typography>
                <input
                  ref={fileRef}
                  type="file"
                  name="file"
                  onChange={handleChangeInput}
                  accept="application/pdf"
                  style={{ display: "none" }}
                />

                <Box
                  gap={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",

                    marginTop: "20px",
                    width: 90,
                  }}
                  onClick={() => fileRef.current.click()}
                >
                  {userResponse?.file?.name && (
                    <Typography color="#57534e" fontWeight={"bold"}>
                      {userResponse?.file?.name}
                    </Typography>
                  )}
                  <Button
                    sx={{}}
                    startIcon={<FilePresentIcon sx={{ mb: 0.2 }} />}
                  >
                    Select
                  </Button>
                </Box>

                <Box>
                  <TextField
                    margin="normal"
                    type="text"
                    multiline
                    id="standard-multiline-flexible"
                    label="Describe your progress!"
                    rows={3}
                    maxRows={4}
                    required
                    fullWidth
                    name="text"
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
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleSubmit(task._id)}
                    startIcon={<CheckIcon sx={{ color: "#0891b2" }} />}
                  >
                    Done
                  </Button>
                </Box>
                <Box marginBottom={2}>
                  <Typography color={"#2dd4bf"} fontWeight="bold">
                    Your Updates
                  </Typography>
                  <Box bgcolor={"#374151"} borderRadius={2}>
                    {task.employees[0].uploads?.user_response.slice(0).reverse().map((ups) => (
                      <Box ml={2} paddingY={2} borderBottom={1}>
                        <Box
                          display={"flex"}
                          paddingRight={2}
                          justifyContent={"space-between"}
                        >
                          <Typography color={"#94a3b8"} fontWeight="bold">
                            {" "}
                            {ups.response_text}{" "}
                          </Typography>
                          <Typography color="#111827" fontWeight={"bold"}>
                            {new Date(ups.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        {ups?.file && (
                          <Box
                            display={"flex"}
                            justifyContent="space-between"
                            paddingRight={2}
                          >
                            <Typography color="#38bdf8" fontWeight={"bold"}>
                              {ups.file.file_name}
                            </Typography>
                            <DownloadIcon
                              onClick={() => window.open(ups.file.download_url)}
                              sx={{
                                color: "#111827",
                                fontSize: 30,
                                cursor: "pointer",
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box>
                  {/* All Admin response associated with this task will be shown below */}
                  <Typography
                    // fontFamily={"montserrat"}
                    fontWeight="bold"
                    color="#dc2626"
                  >
                    Manager Response
                  </Typography>
                  <Box gap={2} display='flex' flexDirection={'column'}>
                    {task.employees[0].uploads?.admin_response?.slice(0)?.reverse()?.map((ups) => (
                      <Box display={'flex'} bgcolor={"#1f2937"} padding={1} borderRadius={1} justifyContent={'space-between'} >
                        <Typography fontFamily={"Roboto Mono"} color="#155e75" >
                         {ups.reply}
                        </Typography>
                        <Typography color='#fff'>
                          {new Date(ups.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </div>
  );
}
