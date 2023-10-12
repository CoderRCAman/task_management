import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
export default function Sidebar() {
  const verifyAdmin = () => {
    const role = localStorage.getItem("role");
    return role === "admin" ? true : false;
  };

  const verifyUser = () => {
    const role = localStorage.getItem("role");
    return role === "user" ? true : false;
  };


  return (
    <Box
      flex={1}
      gap={5}
      sx={{
        display: { xs: "none", md: "flex" },
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "88vh",
      }}
    >
      <Link
        to="/home"
        style={{
          textDecoration: "none",
        }}
      >
        <Button
          startIcon={<HomeOutlinedIcon />}
          variant="outlined"
          sx={{ width: 150 }}
        >
          Home
        </Button>
      </Link>
      {
        verifyAdmin() ? (
          <Link
        to="/addproject"
        style={{
          textDecoration: "none",
        }}
      >
        <Button
          startIcon={<AddOutlinedIcon />}
          variant="outlined"
          sx={{ width: 150 }}
        >
          Project
        </Button>
      </Link>
        ) : null
      }
      {
        verifyAdmin() ? (
          <Link to="/adduser" style={{ textDecoration: "none" }}>
        <Button
          startIcon={<AddOutlinedIcon />}
          variant="outlined"
          sx={{ width: 150 }}
        >
          Employee
        </Button>
      </Link>
        ) : null
      }

      {
        verifyAdmin() ? (
          <Link to='/profile'
        style={{
          textDecoration: "none",
        }}
      >
        

      <Button
       variant="outlined" 
       color = 'secondary'
       sx={{ width: 150 }}
       startIcon={<PermIdentityIcon/>}
      >
        Profile
      </Button>
      </Link>
        ):null
      }


   
      {
        verifyUser() ? (
          <Link to='/userprofile'
          style={{
            textDecoration: "none",
          }}
        >
          
          
  
        <Button
         variant="outlined" 
         color = 'secondary'
         sx={{ width: 150 }}
         startIcon={<PermIdentityIcon/>}
        >
          Profile
        </Button>
        </Link>


        ):null
      }
      

     
     

      
      
      <Button
        startIcon={<LogoutIcon />}
        variant="outlined"
        color="error"
        sx={{ width: 150 }}
        onClick={() => {
          localStorage.removeItem("firstLogin");
          localStorage.removeItem("role");
          localStorage.removeItem("user_id")
          window.location.href = "/";
        }}
      >
        Logout
      </Button>  
      
    </Box>
  );
}
