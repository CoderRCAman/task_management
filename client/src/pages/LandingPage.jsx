import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React from "react";
import NavBar from "../components/NavBar";
import HomeBg from "../assets/home_bggg.svg";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
function LandingPage() {
  return (
    <div>
      <div>
        <Typography
          sx={{
            fontSize: 30,
            marginLeft: 2,
            fontFamily: "Roboto Mono",
            color: "#3f3f46",
            fontWeight: "bold",
            marginTop: 1,
          }}
        >
          Task Management
        </Typography>
      </div>
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={{ xs: 5 }}
        sx={{
          marginX: 3,
          marginTop: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Typography
            color={"white"}
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: 25, sm: 30 },
              fontWeight: "bold",
            }}
          >
            Register your organisation
          </Typography>

          <Typography
            sx={{
              fontSize: 23,
              marginTop: 5,
              marginLeft: { xs: 0, sm: 5 },
              color: "#475569",
              fontWeight: "bold",
              fontFamily: "IBM Plex Serif",
              maxWidth: "80%",
            }}
          >
            Manage your organisation with ease of clicking a button. In general
            managing task of co-workers can be very tidious and time consuming.
            No worries we have got your back! This app enables you to seemingly
            create a project , add new employee , enroll an employee to a
            project. Add deadline to a project, assign necessary task to a
            certain employee! Yes! All in one PLACE.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                marginRight: 10,
              }}
            >
              <Typography
                sx={{
                  color: "#71717a",
                  fontWeight:'bold',
                  marginBottom: "10px",
                }}
              >
                Admin Login
              </Typography>
              <Link to="./register" style={{ textDecoration: "none" }}>
                <Button variant="contained">Register now!</Button>
              </Link>
              <Link
                to="/signin"
                style={{ textDecoration: "none", color: "black" }}
              >
                <Button
                  variant="contained"
                  sx={{ marginTop: 3, marginRight: 8, width: "100%" }}
                >
                  Login
                </Button>
              </Link>
            </Box>
            <Box sx={{
              height:'40vh',
              backgroundColor:'#67e8f9' , 
              width : '1px', 
              marginTop:2 ,
              marginRight:9
            }}></Box>
            <Box
              sx={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <Typography
                sx={{
                  color: "#71717a", 
                  fontWeight:'bold',
                  marginBottom: "10px",
                }}
              >
                Employee Login
              </Typography>
              <Link style={{ textDecoration: "none", color: "black" }}  to="/emp/login">
              <Button variant="contained">Employee Login</Button>
              </Link>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <img src={HomeBg} width={500} />
        </Box>
      </Stack>
    </div>
  );
}
export default LandingPage;
