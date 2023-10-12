import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "./styles.css";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddOutlined from "@mui/icons-material/AddOutlined";

const initialState = {
  title: "",
 
  description: "",
   
};

export default function AttachModal({ open, onClose }) {
  const project_id = useParams().id;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [project, setProject] = useState(initialState);
  const { title, description  } = project;
  /***********************************************************************/

  const getProject = async () => {
    try {
      const projectResponse = await axios.get(
        `http://localhost:5000/api/project/${project_id}`
      );
      console.log(projectResponse.data);
      if (projectResponse.status === 200) setProject(projectResponse.data); 
      setStartDate(new Date(projectResponse.data.startDate)) ; 
      setEndDate(new Date(projectResponse.data.endDate))
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProject();
  }, []);

  const updateProject = () => {
    try {
      axios.patch(
        `http://localhost:5000/api/project/${project_id}`,
        {
            title,
            description,
            startDate,
            endDate,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Update successfully");
    } catch (err) {
      setProject({ ...project, err: err.response.data.msg, success: "" });
    }
  };

  //   const handleAttachmentUpload = async (event) => {
  //     if (!file) {
  //       toast.error("Please select a file!");
  //       return;
  //     }
  //     try {
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       const response = await axios({
  //         method: "post",
  //         url: `http://localhost:5000/api/project/attachment/${project_id}`,
  //         data: formData,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       if (response.status === 200) {
  //         toast.success("Successfully attached");
  //         console.log(response.data);
  //         setProject((project) => {
  //           return { ...project, attachment: response.data.attachment };
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  /***********************************************************************/
  return (
    <div>
      <Toaster />
      <Modal
        open={open}
        onClose={onClose}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
        closeIcon={<CloseIcon sx={{ color: "white" }} />}
      >
        <Box padding={5}>
        <Typography variant="h5" sx={{
            color: "#c9c9c9",
        }}>Update Project</Typography>
          <form onSubmit={updateProject}>
            <Box
              gap={2}
              display={"flex"}
              justifyContent="space-between"
              flexDirection="row"
            >
               
              <TextField
                eld
                margin="normal"
                type="text"
                label="Title"
                onChange={handleChangeInput}
                value={project.title}
                name="title"
                requ
                ired
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
            <TextField
              margin="normal"
              type="text"
              multiline
              onChange={handleChangeInput}
              name="description"
              value={project.description}
              id="standard-multiline-flexible"
              label="Description"
              rows={3}
              maxRows={4}
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
            <Box
              mt={2}
              gap={2}
              display={"flex"}
              j
              ustifyContent="space-between"
              f
              lexDirection="row"
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  components={{
                    OpenPickerIcon: CalendarMonthIcon,
                  }}
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      OpenPickerButtonProps={{ style: { color: "red" } }}
                      sx={{
                        svg: { color: "white" },
                        label: { color: "#94a3b8" },
                        input: { color: "white" },
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                          "& > fieldset": { borderColor: "#64748b" },
                          "&:hover fieldset": {
                            borderColor: "#1876D2",
                          },
                        },
                      }}
                    />
                  )}
                  name="startDate"
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  
                  components={{
                    OpenPickerIcon: CalendarMonthIcon,
                  }}
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      OpenPickerButtonProps={{ style: { color: "red" } }}
                      sx={{
                        svg: { color: "white" },
                        label: { color: "#94a3b8" },
                        input: { color: "white" },
                        borderRadius: 1,
                        "&  .MuiOutlinedInput-root": {
                          "& > fieldset": { borderColor: "#64748b" },
                          "&:hover fieldset": {
                            borderColor: "#1876D2",
                          },
                        },
                      }}
                    />
                  )}
                  name="end_date"
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box display={"flex"} justifyContent={"center"} mt={5}>
              <Button
                startIcon={<AddOutlined />}
                variant="outlined"
                color="success"
                type="submit"
              >
                {" "}
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
