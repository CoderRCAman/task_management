import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadInitial from "./components/LoadInitial";
import NotFound from "./components/NotFound";
import AddUser from "./pages/AddUser";
import Home from "./pages/AdminHome";
import Landing from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import AddProject from "./pages/AddProject";
import UserHome from "./pages/UserHome";
import AdminHome from "./pages/AdminHome";
import ManageProject from "./pages/ManageProject";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ManageUser from './pages/ManageUser'
import UserProfile from './pages/userProfile'
import EmployeeLogin from "./pages/EmployeeLogin"

function App() {
  const verifyAdmin = () => {
    const role = localStorage.getItem("role");
    return role === "admin" ? true : false;
  };
  const isAuthenticated = () => {
    const isLogged = localStorage.getItem("firstLogin");
    return isLogged ? true : false;
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/home" /> : <Landing />}
        />

        <Route
          path="/home"
          element={
            isAuthenticated() ? (
              verifyAdmin() ? (
                <AdminHome />
              ) : (
                <UserHome />
              )
            ) : (
              <Navigate to="/" replace={true} />
            )
          }
        />
        <Route
          path="/signin"
          element={!isAuthenticated() ? <SignIn /> : <Navigate to={"/home"} />}
        />
          <Route
          path="/profile"
          element={!verifyAdmin() ? <Navigate to={"/"} /> : <Profile/>}
        />
         <Route
          path="/profile"
          element={!isAuthenticated() ? <Navigate to={"/"} /> : <UserProfile/>}
        />
        <Route
          path="/userprofile"
          element={!isAuthenticated() ? <Navigate to={"/"} /> : <UserProfile/>}
        />



        <Route
          path="/register"
          element={
            !isAuthenticated() ? <Register /> : <Navigate to={"/home"} />
          }
        />

        <Route
          path="/adduser"
          element={
            verifyAdmin() ? (
              <AddUser />
            ) : (
              <>
                <NotFound />
              </>
            )
          }
        />
        <Route
          path="/addproject"
          element={
            verifyAdmin() ? (
              <AddProject />
            ) : (
              <>
                <NotFound />
              </>
            )
          }
        />
        <Route
          path="/manageproject/:id"
          element={
            verifyAdmin() ? (
              <ManageProject />
            ) : (
              <>
                <NotFound />
              </>
            )
          }
        />
        <Route
          path="/manageuser/:id"
          element={!isAuthenticated() ? <Navigate to={"/signin"} /> : <ManageUser/>}
        />
         <Route
          path="/emp/login"
          element={isAuthenticated() ? <Navigate to={"/home"} /> : <EmployeeLogin/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
