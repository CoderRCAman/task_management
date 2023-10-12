import React, { useState, useRef } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "./styles.css";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
export default function AttachModal({ open, onClose, project, setProject }) {
  const [file, setFile] = useState();
  const fileRef = useRef(null);
  const project_id = useParams().id;
  /***********************************************************************/

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
        url: `http://localhost:5000/api/project/attachment/${project_id}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        toast.success("Successfully attached");
        console.log(response.data);
        setProject((project) => {
          return { ...project, attachment: response.data.attachment };
        });
      }
    } catch (error) {
      console.log(error);
    }
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
        </Box>
      </Modal>
    </div>
  );
}