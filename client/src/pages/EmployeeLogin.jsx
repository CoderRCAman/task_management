import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const theme = createTheme();

export default function SignIn() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDetails = await axios.post(
        "http://localhost:5000/api/employee/login",
        {
          ...user,
        },
        {
          withCredentials: true,
        }
      );
      if (userDetails.status === 200) {
        localStorage.setItem("firstLogin", true);
        localStorage.setItem("role", userDetails.data.role);
        localStorage.setItem('user_id', userDetails.data.user_id) ;
        toast.success("Login Successfully");
        console.log(userDetails);
      }
    window.location.href = "/";
    } catch (err) {
      toast.error(err.response.data.msg, {
        duration: 1000,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Toaster/>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="white">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={loginSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              type="text"
              name="email"
              sx={{
                label: { color: "#94a3b8" },

                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "#64748b" },
                },
              }}
              inputProps={{ style: { color: "#fff" } }}
              value={user.email}
              onChange={onChangeInput}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              name="password"
              value={user.password}
              onChange={onChangeInput}
              label="Password"
              sx={{
                label: { color: "#94a3b8" },

                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "#64748b" },
                },
              }}
              inputProps={{ style: { color: "#fff" } }}
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
