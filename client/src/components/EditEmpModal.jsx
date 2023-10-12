import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Avatar,
  Checkbox,
} from "@mui/material";
import "./styles.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
export default function EditEmpModal({ onClose, open, employees, task }) {
  const [selected, setSelected] = useState(null);
  const [updated, setUpdated] = useState({});

  useEffect(() => {
    const inTask = {};
    const initial = {};
    employees.forEach((emp) => {
      initial[emp._id] = false;
    });
    task.employees.forEach((t) => {
      inTask[t.user_info._id] = {
        status: true,
        employee: t,
      };
      initial[t.user_info._id] = true;
    });
    setSelected(inTask);
    setUpdated(initial);
  }, []);
  const makeUpdatedList = (id) => {
    console.log(updated);
    setUpdated({ ...updated, [id]: !updated[id] });
  };

  const handleUpdate = async () => {
    const task_id = task._id;
    const updatedEmployees = [];
    for (var key of Object.keys(updated)) {
      if (updated[key]) {
        //include this employee
        //check is has any progress attached
        if (selected[key]) {
          updatedEmployees.push(selected[key].employee);
        } else {
          updatedEmployees.push({
            user_info: key,
          });
        }
      }
    }
    try {
      const taskRes = await axios.patch(
        `http://localhost:5000/api/emp/task/${task_id}`,
        updatedEmployees
      );
      if (taskRes.status === 200) {
        toast.success("Update was ok!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    console.log(updatedEmployees);
  };

  // console.log(updated);
  return (
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
      <Toaster />
      <Box>
        {employees.map((user) => (
          <Box
            sx={{
              display: "flex",

              padding: "10px",
              border: "1px solid #1e293b",
            }}
          >
            <Checkbox
              onChange={(e) => {
                if (updated[user._id] && selected[user._id]?.status)
                  if (
                    !confirm(
                      "By removing the employee you will loose all his progress!"
                    )
                  )
                    return;
                makeUpdatedList(user._id);
              }}
              checked={updated[user._id]}
            />
            <Avatar
              sx={{
                height: 50,
                width: 50,
                mr: 5,
                "@media (max-width: 780px)": {
                  height: 30,
                  width: 30,
                  marginRight: "20px",
                },
              }}
              src={user.avatar.download_url}
            />
            <Box
              sx={{
                display: "flex",

                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                color="#7f7f7f"
                fontSize={12}
                fontWeight={"bold"}
                fontFamily={"Roboto"}
                sx={{
                  width: "100px",
                  "@media (max-width: 780px)": {
                    width: "70px",
                  },
                }}
              >
                {user.emp_name}
              </Typography>

              <Typography
                color="#7f7f7f"
                fontSize={12}
                fontWeight={"bold"}
                fontFamily={"Roboto"}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent={"center"} mt={2}>
        <Button onClick={handleUpdate} variant="outlined" color="success">
          {" "}
          Update{" "}
        </Button>
      </Box>
    </Modal>
  );
}
