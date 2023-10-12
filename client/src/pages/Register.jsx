import React,{useState} from 'react'
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
import axios from 'axios'

export default function Register() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        organisation_name: "",
      });
      const onChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
      };
      const registerSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post("http://localhost:5000/user/register", { ...user });
    
          // localStorage.setItem("firstLogin", true);
          // localStorage.setItem("role","admin")
          // localStorage.setItem("user_id")
          toast.success('Sign Up Succesfully. SignIn Now')
          window.location.href = "/signin";
        } catch (err) {
          toast.error("Not register");
        }
      };
    

    const theme = createTheme();
  return (
    <div>
      
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
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={registerSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Enter Your Name"
              autoComplete="name"
              type="text"
              name="name"
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
              inputProps={{ style: { color: "#fff" } }}
              value={user.name}
              onChange={onChangeInput}
              
            />
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
                    "&:hover fieldset": {
                      borderColor: "#1876D2",
                    },
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
            
              label="Password"
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
              inputProps={{ style: { color: "#fff" } }}
              id="password"
              autoComplete="current-password"
              value={user.password}
              onChange={onChangeInput}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="organisation_name"
              label="Enter Your Organazation Name"
              autoComplete="organazation name"
              type="text"
              name="organisation_name"
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
              inputProps={{ style: { color: "#fff" } }}
              value={user.organisation_name}
              onChange={onChangeInput}
              
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>

    </div>
  )
}

