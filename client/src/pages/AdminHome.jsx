import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RightBar from "../components/RightBar";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function AdminHome() {
  const [projects, setProjects] = useState([]);
  const renderDescription = (fullText, length) => {
    let toRender = "";
    for (let i = 0; i < fullText.length; ++i) {
      if (i > length) {
        toRender += "......";
        break;
      }
      toRender += fullText[i];
    }
    return toRender;
  };
  const getAllProjects = async () => {
    try {
      const projectRes = await axios.get("http://localhost:5000/api/project", {
        withCredentials: true,
      });
      console.log(projectRes.data);
      if (projectRes.status === 200) setProjects(projectRes.data.projects);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllProjects();
  }, []);

  const deleteProject = async (id) => {
    try {
      const deleteResponse = await axios.delete(
        `http://localhost:5000/api/project/${id}`
      );
      if (deleteResponse.status === 200) {
        alert("😍 Successfully Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert("😭 Unable to delete!");
    }
  };
  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );
  const card = (project) => (
    <React.Fragment >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="white" gutterBottom>
          {project.project_id}
        </Typography>
        <Typography variant="h5" color="#d6d6d6" component="div">
          {project.title}
        </Typography>
        <Box sx={{ display: "flex" }} gap={1}>
          <Typography
            sx={{ mb: 1.5, fontWeight: "bold", fontSize: 15 }}
            color={project?.status ==="Ongoing" ? 'orange' : 'green'}
          >
            {project.status}
          </Typography>
          {/* <Typography
            sx={{ mb: 1.5, fontWeight: "bold", fontSize: 15 }}
            color="green"
          >
            DONE
          </Typography>
          <Typography
            sx={{ mb: 1.5, fontWeight: "bold", fontSize: 15 }}
            color="#eab308"
          >
            ON GOING
          </Typography> */}
        </Box>
        <Typography variant="body2" color="#a1a1aa" sx={{
          height: "50px",
        }}>
          {renderDescription(project.description, 80)}
          <br />
        </Typography>
      </CardContent>
      <CardActions sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
       

      }}>
      
       <Link
          to={`/manageproject/${project._id}`}
          style={{
            textDecoration: "none",
          }}
        >
          <Button
            startIcon={<SettingsIcon />}
            variant={"outlined"}
            size="small"
          >
            Manage
          </Button>
        </Link>
        <DeleteIcon
          sx={{
            cursor: "pointer",
            color: "#c46d6d",
            "&:hover": {
              color: "red",
            },
          }}
          onClick={() => {
            if (confirm("Are you sure to delete this Project?")) {
              deleteProject(project._id);
            }
          }}
        />
      
      </CardActions>
    </React.Fragment>
  );
  return (
    <div>
      <NavBar />

      <Stack height={"90vh"} direction={"row"}>
        <Sidebar />
        <Box
          flex={4}
          sx={{
            borderLeft: 2,
            borderRight: 2,
            borderColor: "#182638",
            maxHeight: "88vh",
            overflow: "scroll",
            padding: "5px",
          }}
        >
          <Box
            gap={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {projects.map((project) => (
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  width: "250px",
                }}
                variant="outlined"
              >
                {card(project)}
              </Card>
            ))}
          </Box>
        </Box>
        <RightBar />
      </Stack>
    </div>
  );
}
