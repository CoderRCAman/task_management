import React, { useState, useRef,useEffect }  from 'react'
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";




export default function AttachTaskModal({onClose, open,task_id }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const [task,setTasks] =useState("")
 
 

 useEffect(()=>{
  console.log(task_id)
 })
  

  const handleAttachmentUpload = async (event) => {
    if (!file) {
      toast.error("Please select a file!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios({
        method: "post",
        url: `http://localhost:5000/api/task/attachment/${task_id}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.status === 200) {
        toast.success("Successfully attached");
        
        setTasks((task) => {
          return { ...task, attachment: response.data.attachment };
        });
      }
    } catch (error) {
      console.log(error);
    }
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
        closeIcon={<CloseIcon sx={{ color: "white" }} />}
       >
        <Box><Box padding={5}>
          <Button
            startIcon={<AttachFileIcon />}
            variant="outlined"
            color="warning"
            onClick={() => fileRef.current.click()}
          >
            Select a file!
          </Button>
          {file && (
            <Box display={"flex"} gap={2} alignItems="center" mt={2}>
              <Typography color="#0e7490">{file.name}</Typography>
              <Button
                variant={"outlined"}
                color="success"
                onClick={handleAttachmentUpload}
              >
                Update!
              </Button>
            </Box>
          )}
          <input
            style={{ display: "none" }}
            ref={fileRef}
            type="file"
            select="application/pdf"
            onChange={(event) => setFile(event.target.files[0])}
          />
        </Box></Box>

       </Modal>
    </div>
  )
}
