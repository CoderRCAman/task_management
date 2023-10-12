import React, { useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import Sidebar from "../components/Sidebar";
import RightBar from "../components/RightBar";
import AddOutlined from "@mui/icons-material/AddOutlined";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const initialState = {
  project_id: "",
  title: "",
  description: "",
};

export default function AddProject() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const fileRef = useRef(null);
  const [project, setProject] = useState(initialState);
  const [attachment, setAttachment] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(startDate, endDate);
  };
  
 

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "attachment") {
      setAttachment(e.target.files[0]);
    }
    setProject({ ...project, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // console.log(bookData);
      const formData = new FormData();

      formData.append("docs", attachment);
      formData.append("project_id", project.project_id);
      formData.append("title", project.title);
      formData.append("description", project.description);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      const res = await axios({
        method: "POST",
        url: "http://localhost:5000/api/project",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        toast.success("Successfully created!");
      } else {
        toast.error("Failed to create an employee!");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

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
            maxHeight: "89vh",
            overflow: "scroll",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* MAIN CONTENT  */}
          <Typography color={"#475569"} fontWeight="bold" fontSize={19}>
            Create a new project!
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <Box display={"flex"} flexDirection={"row"} mt={2} gap={2}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => fileRef.current.click()}
              >
                <FilePresentIcon sx={{ color: "#0891b2" }} />
                <input
                  onChange={handleChangeInput}
                  name="attachment"
                  ref={fileRef}
                  type="file"
                  style={{ display: "none" }}
                />
              </div>
              <Typography color="#a8a29e" fontSize={17}>
                Attach a file
              </Typography>
            </Box>{" "}
            <Box
              gap={2}
              display={"flex"}
              justifyContent="space-between"
              flexDirection="row"
            >
              <TextField
                margin="normal"
                type="text"
                label="Project ID"
                onChange={handleChangeInput}
                name="project_id"
                fullWidth
                required
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
                label="Title"
                onChange={handleChangeInput}
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
              id="standard-multiline-flexible"
              label="Description"
              rows={3}
              maxRows={4}
              required
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
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  c
                  omponents={{
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
                CREATE
              </Button>
            </Box>
          </form>{" "}
        </Box>
        <RightBar />
      </Stack>
    </div>
  );
}
