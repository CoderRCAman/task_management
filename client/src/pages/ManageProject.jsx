import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import RightBar from "../components/RightBar";
import { useParams } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Avatar,
  alertClasses,
} from "@mui/material";
import Button from "@mui/material/Button";
import AddOutlined from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReplyIcon from "@mui/icons-material/Reply";
import Checkbox from "@mui/material/Checkbox";
// import "react-responsive-modal/styles.css";
// import { Modal } from "react-responsive-modal";
import ReplyModal from "../components/ReplyModal";
import EnrollModal from "../components/EnrollModal";
import TaskModal from "../components/TaskModal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AttachModal from "../components/AttachModal";
import { useDebouncedCallback } from "use-debounce";
import { ClipLoader } from "react-spinners";
import ProjectUpdateModal from "../components/ProjectUpdateModal";
import EditTaskModal from "../components/EditTaskModal";
import EditEmpModal from "../components/EditEmpModal";
import AttachTaskModal from "../components/AttachTaskModal";
export default function ManageProject() {
  const [open, setOpen] = useState(false);
  const [openEnroll, setOpenEnroll] = useState(false);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(false);
  const [openTaskAttachment, setOpenTaskAttachment] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [openEditEmp, setOpenEditEmp] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [task_id, setTask_id] = useState("");
  const [project, setProject] = useState({});
  const project_id = useParams().id;
  const [reply, setReply] = useState({
    task_id: "",
    user_id: "",
  });
  const [tasks, setTasks] = useState([]);
  const params = useParams();

  /********************************************************************** */
  const getProject = async () => {
    try {
      const projectResponse = await axios.get(
        `http://localhost:5000/api/project/${project_id}`
      );
      console.log(projectResponse.data);
      if (projectResponse.status === 200) setProject(projectResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getTask = async () => {
    try {
      const taskResponse = await axios.get(
        `http://localhost:5000/api/task/${project_id}`
      );
      console.log(taskResponse.data.tasks);
      if (taskResponse.status === 200) setTasks(taskResponse.data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProject();
    getTask();
  }, []);

  /********************************************************************** */
  const updateStatus = useDebouncedCallback(async (value) => {
    console.log(value);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/project/status/${params.id}`,
        { status: value }
      );
      if (res.status === 200) {
        toast.success("Status Updated!");
        setProject({ ...project, status: value ? "Completed" : "Ongoing" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the status!!");
    }
    setLoading(false);
  }, 1000); 

  const updateTaskStatus = useDebouncedCallback(async (value,task_id) => {
    console.log(value,task_id);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/task/status/`,
        { status: value , task_id : task_id }
      );
      if (res.status === 200) {
        toast.success("Status Updated!");
        window.location.reload() ; 
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the status!!");
    }
    setLoading(false);
  }, 1000);

  const deleteTask = async (id) => {
    try {
      const deleteResponse = await axios.delete(
        `http://localhost:5000/api/task/${id}?project_id=${project_id}`
      );
      if (deleteResponse.status === 200) {
        setTasks((tasks) => tasks.filter((task) => task._id !== id));
        alert("😍 Task was deleted!");
        return;
      } else {
        alert("😭 Unable to delete!");
      }
    } catch (error) {
      console.log(error);
      alert("😭 Unable to delete!");
    }
  };

  /*********************************************************************** */

  const onOpenModal = (theDamFankson) => theDamFankson(true); // theDamFankson is variable
  const onCloseModal = (theDamFankson) => theDamFankson(false);

  return (
    <div>
      <Toaster />
      {open && (
        <ReplyModal
          user_id={reply.user_id}
          task_id={reply.task_id}
          open={open}
          onClose={() => onCloseModal(setOpen)}
          center
        />
      )}
      {openAttachment && (
        <AttachModal
          open={openAttachment}
          setProject={setProject}
          onClose={() => onCloseModal(setOpenAttachment)}
        />
      )}
      {update && (
        <ProjectUpdateModal
          open={update}
          onClose={() => onCloseModal(setUpdate)}
        />
      )}
      {openEditEmp && (
        <EditEmpModal
          open={openEditEmp}
          task={task_id}
          setTasks={setTasks}
          onClose={() => onCloseModal(setOpenEditEmp)}
          employees={project.employees}
        />
      )}

      <NavBar />
      <Stack direction={"row"} height={"90vh"}>
        <Sidebar />
        <Box
          flex={4}
          sx={{
            borderLeft: 2,
            borderRight: 2,
            borderColor: "#182638",
            maxHeight: "85vh",
            overflow: "scroll",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 2,
            }}
          >
            <Typography
              color={"#475569"}
              display="flex"
              ml={"13%"}
              justifyContent={"end"}
              width="50%"
              fontWeight="bold"
              fontSize={19}
            >
              Project Details!
            </Typography>
            <Box width={"50%"} display="flex" justifyContent={"end"}>
              {loading && <ClipLoader color="#facc15" />}
            </Box>
          </Box>

          <Box
            display={"flex"}
            mb={2}
            flexDirection="column"
            sx={{
              textTransform: "capitalize",
            }}
          >
            {/* <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "15px",
                backgroundColor: "#10233d",
                marginTop: "10px",
              }}
            > */}
            <Typography color={"#475569"} fontWeight="bold" fontSize={14}>
              {project?.project_id}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography color={"#c9d6dd"} fontWeight="bold" fontSize={22}>
                {project?.title}
              </Typography>
              <Button
                startIcon={<EditIcon />}
                color={"success"}
                onClick={() => onOpenModal(setUpdate)}
              >
                Update
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  fontWeight="bold"
                  color={project.status === "Completed" ? "#2dcc22" : "yellow"}
                  fontSize={16}
                >
                  {project?.status}
                </Typography>

                <Typography
                  color={"#52525b"} ///hellloooo
                  fontWeight="bold"
                  mb={1}
                  fontSize={14}
                >
                  <span style={{ color: "#3f3f46", marginRight: "5px" }}>
                    {project?.employees?.length}
                  </span>
                  Enrrolled
                </Typography>
              </Box>
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
            </Box>

            {/* </Box> */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginLeft: -1.5,
                alignItems: "center",
                color: "#334155",
              }}
            >
              <Checkbox
                sx={{ color: "#848484" }}
                color="success"
                checked={project?.status === "Completed" ? true : false}
                onChange={(e) => {
                  setLoading(true);
                  updateStatus(e.target.checked);
                }}
              />
              <Typography
                sx={{
                  color: "#848484",
                }}
              >
                Mark as Completed
              </Typography>
            </Box>
            <Typography color={"#475569"} fontWeight="bold" fontSize={14}>
              {project?.description}
            </Typography>
            <Box display={"flex"} alignItems="center">
              <Typography color="#0d9488" fontWeight={"bold"}>
                {project?.attachment?.file_name}
              </Typography>
              <Box>
                {project?.attachment?.file_name ? (
                  <Box display={"flex"} alignItems="center" gap={2}>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => {
                        onOpenModal(setOpenAttachment);
                      }}
                    ></Button>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={() =>
                        window.open(project.attachment.download_url)
                      }
                    ></Button>
                  </Box>
                ) : (
                  <Box display="flex" alignItems={"center"} gap={2}>
                    <Typography color="#6b7280" fontWeight={"bold"}>
                      Add attachment to the project!
                    </Typography>

                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => {
                        onOpenModal(setOpenAttachment);
                      }}
                    ></Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box>
            <Button
              startIcon={<AddOutlined />}
              variant={"outlined"}
              color={"success"}
              onClick={() => onOpenModal(setOpenEnroll)}
            >
              Enroll
            </Button>
            {openEnroll && (
              <EnrollModal
                employees={project.employees}
                open={openEnroll}
                onClose={() => onCloseModal(setOpenEnroll)}
              />
            )}

            <Box
              maxHeight={150}
              overflow="scroll"
              display="flex"
              flexDirection={"column"}
              mt={2}
              gap={2}
              borderRadius={1}
              border={2}
              borderColor={"#1f2937"}
              padding={1}
            >
              {project?.employees?.map((emp) => (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  paddingBottom={1}
                  justifyContent="space-between"
                >
                  <Box display={"flex"} gap={2} alignItems={"center"}>
                    <Avatar
                      src={
                        emp.avatar.download_url
                          ? emp.avatar.download_url
                          : "/static/images/avatar/1.jpg"
                      }
                    />
                    <Typography fontWeight={"bold"} color={"#475569"}>
                      {emp.emp_name}
                    </Typography>
                  </Box>

                  {/* <Box mr={3}>
                    <DeleteIcon
                      sx={{
                        cursor: "pointer",
                        color: "#f87171",
                        "&:hover": {
                          color: "red",
                        },
                      }}
                    />
                  </Box> */}
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: "30px",
            }}
          >
            <Button
              startIcon={<AddOutlinedIcon />}
              variant={"outlined"}
              color={"success"}
              onClick={() => onOpenModal(setOpenAddTask)}
            >
              Add Task
            </Button>
            {openAddTask && (
              <TaskModal
                open={openAddTask}
                employees={project.employees}
                onClose={() => onCloseModal(setOpenAddTask)}
              />
            )}
            {openEditTask && (
              <EditTaskModal
                task_id={task_id._id}
                open={openEditTask}
                onClose={() => onCloseModal(setOpenEditTask)}
              />
            )}
            {openTaskAttachment && (
              <AttachTaskModal
                open={openTaskAttachment}
                // task={task_id}

                task_id={task_id._id}
                onClose={() => onCloseModal(setOpenTaskAttachment)}
              />
            )}
            {tasks.slice(0).reverse().map((task) => (
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
                  textTransform: "capitalize",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="#adadad" fontWeight={"bold"}>
                      {task?.task_name}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        onOpenModal(setOpenEditTask);
                        setTask_id(task);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<PersonIcon />}
                      onClick={() => {
                        onOpenModal(setOpenEditEmp);
                        setTask_id(task);
                      }}
                    >
                      Employee
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (confirm("Are you sure to delete the task!")) {
                          deleteTask(task._id);
                        }
                      }}
                    >
                      delete
                    </Button>
                  </Box>
                </Box>
                <Typography  color={task.status === "Completed" ? "#2dcc22" : "yellow"} fontWeight="bold" mb={2}>
                  {task?.status}
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

                <Typography color='#2dd4bf'> {task?.attachment?.file_name}  </Typography>

                <Box display={"flex"} gap={2} mb={2}>
                  <FilePresentIcon
                    onClick={() => {
                      onOpenModal(setOpenTaskAttachment);
                      setTask_id(task);
                    }}
                    cursor="pointer"
                    sx={{
                      "&:hover": {
                        color: "#5eead4",
                      },
                    }}
                  />
                  <DownloadIcon
                    cursor="pointer"
                    sx={{
                      "&:hover": {
                        color: "#0e7490",
                      },
                    }}
                    onClick={() => window.open(task?.attachment.download_url)}
                  />
                </Box>
                <Typography>{task?.description}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: -1.5,
                    alignItems: "center",
                  }}
                >
              <Checkbox
                sx={{ color: "#848484" }}
                color="success"
                checked={task?.status === "Completed" ? true : false}
                onChange={(e) => {
                  setLoading(true);
                  updateTaskStatus(e.target.checked,task._id);
                }}
              />
                  <Typography
                    sx={{
                      color: "#848484",
                    }}
                  >
                    Mark as Completed
                  </Typography>
                </Box>
                <Box gap={2} display="flex" flexDirection={"column"}>
                  {task.employees.map((user) => (
                    <>
                      <Box bgcolor={"#1f2937"} padding={1} borderRadius={1}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box display="flex" alignItems={"center"}>
                            <Avatar src={user.user_info?.avatar.download_url} />
                            <Typography
                              fontSize={15}
                              sx={{
                                marginLeft: "20px",
                                color: "#9b9b9b",
                              }}
                            >
                              {user.user_info?.emp_name || user.user_info?.name}
                            </Typography>
                          </Box>
                        </Box>
                        {user?.uploads?.user_response?.slice(0).reverse().map((ups) => (
                          <Box borderBottom={1}>
                            <Typography fontWeight={"bold"} mt={1}>
                              {new Date(ups?.date).toLocaleDateString()}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                mt: 2,
                                gap: 1,
                              }}
                            >
                              <Typography
                                fontSize={15}
                                sx={{
                                  color: "#9b9b9b",
                                  bgcolor: "#0c4a6e",
                                  p: 1,
                                  borderRadius: 1,
                                  textTransform: "none",
                                }}
                              >
                                {ups?.file?.file_name}
                              </Typography>
                              <DownloadIcon
                                onClick={() =>
                                  window.open(ups?.file?.download_url)
                                }
                                cursor="pointer"
                                sx={{
                                  "&:hover": {
                                    color: "#0e7490",
                                  },
                                }}
                              />
                            </Box>
                            <Typography
                              p={1}
                              color={"#4b5563"}
                              sx={{
                                textTransform: "none",
                              }}
                            >
                              {ups?.response_text}
                            </Typography>
                          </Box>
                        ))}

                        <Button
                          onClick={() => {
                            setReply({
                              user_id: user.user_info._id,
                              task_id: task._id,
                            });
                            onOpenModal(setOpen);
                          }} //:setOpen
                          startIcon={<ReplyIcon sx={{ mt: -0.4 }} />}
                          variant="outlined"
                          sx={{
                            marginTop: 2,
                          }}
                        >
                          Reply
                        </Button>
                      </Box>
                      <Box bgcolor={'#334155'} borderRadius={1} padding={2}>
                        <Typography color='#18181b' fontWeight={'bold'}>Your Response</Typography>
                        {user?.uploads?.admin_response?.slice(0).reverse().map((res) => (
                          <Box borderBottom={1} marginLeft={2} padding={2} display='flex' justifyContent={'space-between'}> 
                            <Typography color='#cbd5e1'>{res.reply}</Typography> 
                            <Typography color='white'>{new Date(res.date).toLocaleDateString()}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <RightBar />
      </Stack>
    </div>
  );
}
