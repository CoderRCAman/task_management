import React ,{useState,useEffect}from 'react'
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useParams } from "react-router-dom";

const initialState = {
    task_name: "",
   
    description: "",
     
  };

export default function EditTaskModal({ open, onClose,task_id}) {
   const [task,setTask] =useState(initialState)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
    const {task_name,description} = task;

    const getTaskById =async()=>{
        try{
            const taskResponse = await axios.get(
                `http://localhost:5000/api/taskId/${task_id}`
            )
            console.log(taskResponse.data)
            if(taskResponse.status === 200) setTask(taskResponse.data.task)
            setStartDate(new Date (taskResponse.data.task.startDate))
            setEndDate(new Date (taskResponse.data.task.endDate))
        }catch(error){
            console.log(error)
        }
    }
    useEffect(() => {
        getTaskById();
      }, []);

    const updateTask =async(e) =>{ 
      e.preventDefault() ;
        try{
           const response =  await axios.patch(
                `http://localhost:5000/api/task/${task_id}`,
                {
                    task_name,
                    description,
                    startDate,
                    endDate
                },
                {
                    withCredentials:true
                }
                
            ); 
            if(response.status ===200) {

              alert("update") ; 
              
            }
            window.location.reload() ;

            
        }catch(err){
            setTask({...task,err:err.response.data.msg,success:""});
        }
    };
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };
    



  return (
    <div>
        <Modal 
         open={open}
         onClose={onClose}
         center
         classNames={{
           overlay: "customOverlay",
           modal: "customModal",
         }}
         closeIcon={<CloseIcon sx={{ color: "white" }} />}>
           <form onSubmit={updateTask} >
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
              Update Task Details
            </Typography>
            
              <TextField
                type="text"
                label="Task Name"
                name="task_name"
                onChange={handleChangeInput}
                size="small"
                required
                value={task.task_name}
                inputProps={{ style: { color: "#fff" } }}
                sx={{
                  label: { color: "#94a3b8" },
                  marginTop:"10px",

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
              multiline
              name="description"
              onChange={handleChangeInput}
              id="standard-multiline-flexible"
              label="Describe your Task!"
              rows={3}
              value={task.description}
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
  )
}
