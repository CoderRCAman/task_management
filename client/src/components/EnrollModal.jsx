import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import "./styles.css";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import { DataGrid } from "@mui/x-data-grid";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function EnrollModal({ onClose, open, employees }) {
  const [rows, setRows] = useState([]);
  const [backup, setBackup] = useState([]);
  const [selected, setSelected] = useState([]);
  const project_id = useParams().id;
  /****************************************************************************/
  const getEmployees = async () => {
    const empRes = await axios.get("http://localhost:5000/api/employee", {
      withCredentials: true,
    });
    if (empRes.status === 200) {
      const data = [];
      console.log(empRes);
      empRes.data.employees.map((emp) => {
        data.push({
          id: emp.emp_id,
          name: emp.emp_name || emp.name,
          email: emp.email,
          u_id: emp._id,
        });
      });
      setRows(data);
      setBackup(data);
     
    }
  };

  const searchEmpId = (id) => {
    const searchRegex = new RegExp(id, "i");
    const resultArray = backup.filter((emp) => emp.id.match(searchRegex));
    setRows(resultArray);
  };

  const wasUserSelected = (user_id, users) => {
    console.log(user_id);
    return users.find((id) => id === user_id);
  };

  console.log(selected);

  useEffect(() => {
    getEmployees();
    setSelected(
      employees.map((emp) => {
        return emp.emp_id
      })
    );
  }, []);

  /****************************************************************************/

  const enrollEmployee = async () => {
    let employees = backup.map((emp) => {
      if (wasUserSelected(emp.id, selected)) return emp.u_id;
    });
    employees = employees.filter((e) => e);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/project/enroll/${project_id}`,
        {
          employees: employees,
        }
      );
      if (response.status === 200) {

        toast.success("Enrolled!");
        location.reload() ;
      }
    } catch (error) {
      console.log(error);
      toast.error("Somethings went wrong!");
    }
  };

  /****************************************************************************/

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
      width: 160,
    },
    {
      field: "email",
      headerName: "Email",
      width: 170,
    },
    {
      filed: "u_id",
      hideable: true,
    },
  ];

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
        <Box mt={1}>
          <TextField
            margin="normal"
            type="text"
            id="standard-multiline-flexible"
            label="Search Here!"
            size="small"
            fullWidth
            onChange={(e) => {
              searchEmpId(e.target.value);
            }}
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
          {/* <Box sx={{
                  display:'flex',
                  backgroundColor:'#132235',
                  alignItems:'center'
                }}>
                  <Avatar/>
                  <Typography>hari ram das</Typography>
                  <Checkbox sx={{ color: "#848484" }} color="success" />
                </Box> */}

          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight={true}
            checkboxSelection={true}
            pageSize={8}
            disableSelectionOnClick
            selectionModel={selected}
            onColumnHeaderClick={(e) => {
              console.log(e);
              if (e.field === "__check__") setSelected([]);
            }}
            onCellClick={(value) => { 
          
              setSelected(
                backup.reduce(( result , emp) => {
                  if(wasUserSelected(emp.id, selected) && emp.id === value.id ) return result 
                  else if (wasUserSelected(emp.id, selected) && emp.id !== value.id  ) result.push(emp.id)
                  else if (emp.id === value.id) result.push(emp.id) 
                  return result
                },[])
              );
            }}
            components={{
              Checkbox: Checkbox,
            }}
            sx={{
              borderColor: "#475569",
              color: "white",
              ".MuiDataGrid-checkboxInput": {
                color: "green",
              },

              ".MuiDataGrid-columnHeader": {
                color: "#fff",
              },
              ".MuiDataGrid-row": {
                color: "#64748b",
              },
              ".MuiTablePagination-root": {
                color: "white",
              },
              ".MuiDataGrid-root": {
                borderColor: "blue",
              },
            }}
          />
          <Box display={"flex"} justifyContent={"center"} mt={2}>
            <Button
              variant="outlined"
              startIcon={<AutoFixHighIcon />}
              onClick={enrollEmployee}
            >
              Select
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
