import React, { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import "./styles.css";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast,{Toaster} from "react-hot-toast";
export default function ReplyModal({ open, onClose ,user_id, task_id}) {
  const [reply, setReply] = useState(""); 
  const sendReply = async () => {  
    if (!reply) return;
    const res = await axios.post("http://localhost:5000/api/reply", {
      user_id: user_id,
      task_id: task_id,
      reply: reply,
    });
    if(res.status===200) {
      toast.success(res.data.msg) ; 
    } 
    else {
      toast.error('Failed to reply!') ;
    }
  };

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
        <Stack>
          <Box>
            <Typography color="#C9D6DD">Send Message </Typography>
            <TextField
              margin="normal"
              type="text"
              multiline 
              onChange={e=>setReply(e.target.value)}
              id="standard-multiline-flexible"
              label="SEND YOUR FEEDBACK!"
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
            <Button onClick={()=>sendReply()} variant="outlined" endIcon={<SendIcon />}>
              Send
            </Button>
          </Box>
        </Stack>
      </Modal>
    </div>
  );
}
