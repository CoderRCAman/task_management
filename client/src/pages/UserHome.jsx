import React ,{useEffect,useState}from 'react'
import NavBar from '../components/NavBar'
import { Box, Stack,} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import SettingsIcon from '@mui/icons-material/Settings';
import SideBar from '../components/Sidebar'
import {Link} from 'react-router-dom'
import axios from 'axios';

export default function UserHome() {
  const [projects, setProjects] = useState([]);
  const id  = localStorage.getItem("user_id")
  const getProject = async () => {
    try {
      const employeeRes = await axios.get(`http://localhost:5000/api/employee/${id}`) ; 
      if(employeeRes.status === 200) {
        console.log(employeeRes.data)  
        setProjects(employeeRes.data.projects)
      }
    } catch (error) {
      console.log(error) ;

    }
  } 

  useEffect(()=>{ 
    
    getProject() ;
  },[])


  const renderDescription = (fullText,length) => {
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
  const card = (project) => (
    <React.Fragment>
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
      <CardActions>
        <Link to={`/manageuser/${project._id}`} style={{
          textDecoration:"none"
        }}>
        <Button startIcon={<SettingsIcon/>} variant={'outlined'} size="small" >Manage</Button>
        </Link>
      </CardActions>
    </React.Fragment>
  );
  return (
    <div>
        <NavBar/>
        <Stack direction={"row"} height={"91vh"}
        
        >
          <SideBar/>
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
        </Stack>

    </div>
  )
}
