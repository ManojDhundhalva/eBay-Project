import React, { useState } from "react";
import { Box, Grid, Paper, Typography, IconButton } from "@mui/material";
import SideBar from "../components/SideBar";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ProfileDetails from "../components/DashBoardComponents/ProfileDetails";
import BankDetails from "../components/DashBoardComponents/BankDetails";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

function DashBoard() {
  const [selectedComponent, setSelectedComponent] = useState("ProfileDetails");
  const navigate = useNavigate();

  return (
    <Grid
      container
      margin={0}
      padding={1}
      sx={{ width: "100%", height: "100vh" }}
    >
      <Grid
        xs={2}
        padding={1}
        margin={0}
        sx={{ width: "100%", height: "100%" }}
      >
        <SideBar
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
        />
      </Grid>
      <Grid
        item
        xs={10}
        padding={1}
        margin={0}
        sx={{ width: "100%", height: "100%" }}
      >
        <Grid
          id="style-1"
          sx={{
            backgroundColor: "lavender",
            width: "100%",
            borderRadius: "16px",
            height: "100%",
          }}
        >
          {selectedComponent === "BankDetails" && <BankDetails />}
          {selectedComponent === "ProfileDetails" && <ProfileDetails />}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DashBoard;
