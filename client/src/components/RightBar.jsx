import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import axios from "axios";
export default function RightBar() {
  const [allEmp, setAllEmp] = useState([]);
  const getAllEmployee = async () => {

  try{

    const empRes = await axios.get("http://localhost:5000/api/employee",{
      withCredentials: true,
    });
    console.log(empRes)
    if (empRes.status === 200) setAllEmp(empRes.data.employees);
  }catch(error){
    console.log(error)
  }
   
  };

  useEffect(() => {
    getAllEmployee();
  }, []);
  const verifyAdmin = () => {
    const role = localStorage.getItem("role");
    return role === "admin" ? true : false;
  };
  return (
    <>
     {
       verifyAdmin() ? (
        <Box
        flex={1.3}
        sx={{
          display: { xs: "none", md: "block" },
          maxHeight: "89vh",
          overflow: "scroll",
          position: "relative",
        }}
      >
        <Typography
          color="#0c4a6e"
          variant="h6"
          sx={{
            textAlign: "center",
            paddingY: 1,
            borderBottom: 2,
            borderColor: "#1e293b",
            fontWeight: "bold",
            position: "fixed",
            width: "21%",
            backdropFilter: blur(16),
            backgroundColor: "#0B1829",
            zIndex: 20,
          }}
        >
          Employees
        </Typography>
        <Box
          sx={{
            mt: 5,
          }}
        >
          {allEmp.map((emp) => (
            <Box
              sx={{
                gap: 1,
                paddingX: 1,
                paddingY: 2,
                flexDirection: "row",
                alignItems: "start",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#164e63",
                },
                display: { xs: "none", md: "flex" },
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src={
                  emp.avatar.download_url
                    ? emp.avatar.download_url
                    : "/static/images/avatar/1.jpg"
                }
              />
              <Box>
                <Typography variant="h6" color="#94a3b8" sx={{ fontSize: 15 }}>
                  {emp.emp_name || emp.name}
                </Typography>
                <Typography variant="h6" color="#fff" sx={{ fontSize: 15 }}>
                  {emp.emp_id}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

       ):null
     }
    </>
    
  );
}
