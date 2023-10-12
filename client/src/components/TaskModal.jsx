import React, { useRef, useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./styles.css";
import CloseIcon from "@mui/icons-material/Close";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import DownloadIcon from "@mui/icons-material/Download";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";


const initialState = {
  task_name: "",
  description: "",
  employees: "",
};

export default function TaskModal({ open, onClose ,employees}) {
  const params =useParams()
  const [task, setTask] = useState(initialState);

  const [selected, setSelected] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [attachment, setAttachment] = useState(null);



  //   const handleChangeInput = e =>{
  //     const {name, value} = e.target
  //     setAllEmp({...allEmp, [name]:value})

  // }
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "attachment") {
      setAttachment(e.target.files[0]);
    }
    setTask({ ...task, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(bookData);
      const formData = new FormData();
      console.log(params)
      formData.append("docs", attachment);
      formData.append("task_name", task.task_name);
      formData.append("description", task.description);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("employees", selected); 
    
      const res = await axios({
        method: "POST",
        url: `http://localhost:5000/api/task/${params.id}`,
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res) 
      if (res.status === 200) {
        toast.success("Successfully created!");
      } else {
        toast.error("Failed to create an task!");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const fileRef = useRef(null);
  return (
    <div>
      <Toaster />
      <Modal
        open={open}
        onClose={onClose}
        center
        classNames={{
          overlay: "customOverlayEnroll",
          modal: "customModalEnroll",
        }}
        closeIcon={<CloseIcon sx={{ color: "white" }} />}
      >
        <form onSubmit={handleFormSubmit}>
          <Box
            sx={{
              padding: 4,
            }}
          >
            <Typography
              color="#7f7f7f"
              fontSize={16}
              fontWeight={"bold"}
              fontFamily={"Roboto"}
            >
              Add Task
            </Typography>
            <Box
              sx={{
                display: "flex",
                marginTop: 2,
                alignItems: "center",
              }}
            >
              <TextField
                type="text"
                label="Task Name"
                name="task_name"
                onChange={handleChangeInput}
                size="small"
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
              <Box
                sx={{
                  marginLeft: "20px",
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => fileRef.current.click()}
                >
                  <FilePresentIcon
                    sx={{
                      color: "#565656",
                      "&:hover": {
                        color: "#5eead4",
                      },
                    }}
                  />
                  <span></span>
                  <input
                    name="attachment"
                    style={{ display: "none" }}
                    onChange={handleChangeInput}
                    ref={fileRef}
                    type="file"
                  />
                </div>
              </Box>
            </Box>

            <TextField
              margin="normal"
              type="text"
              multiline
              name="description"
              onChange={handleChangeInput}
              id="standard-multiline-flexible"
              label="Describe your Task!"
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
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </Box>

            <FormControl
              fullWidth
              size="small"
              sx={{
                marginTop: "10px",
                label: { color: "#94a3b8" },
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "#64748b" },
                  "&:hover fieldset": {
                    borderColor: "#1876D2",
                  },
                },
              }}
            >
              <InputLabel id="demo-multiple-name-label">
                Employee Select
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-chip"
                input={<OutlinedInput label="Employee Select" />}
                multiple={true}
                name="employees"
                onChange={(event) => setSelected(event.target.value)}
                value={selected}
                sx={{
                  color: "#afafaf", 
                  
                }}
                MenuProps={{
                  sx: {
                    "&& .Mui-selected": {
                      backgroundColor: "#14b8a6"
                    }
                  }
                }}
              >
                {employees.map((emp) => (
                  <MenuItem
                    value={emp._id}
                    key={emp._id}
                    inputProps={{ style: { color: "#fff" } }} 
                   
                    sx={{
                      color: "white",
                      backgroundColor: "#11243d",
                      "&:hover ": {
                        color: "black",
                        bgcolor: "#99f6e4",
                      },
                     
                    }}
                  >
                    {emp.emp_name || emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              sx={{
                marginTop: "20px",
              }}
              variant="outlined"
            >
              {" "}
              Submit
            </Button>
          </Box>
        </form>
      </Modal>
    </div>
  );
}
