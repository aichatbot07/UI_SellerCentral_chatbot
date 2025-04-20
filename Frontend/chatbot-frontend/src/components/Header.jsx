import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("seller");
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/");
  };

  // Handle Navigation to Home
  const goHome = () => {
    navigate("/home");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Seller Dashboard
        </Typography>
        <Button color="inherit" onClick={goHome}>
          Home
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
