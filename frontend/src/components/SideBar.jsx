import React from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const Sidebar = ({ selectedComponent, setSelectedComponent }) => {
  const navigate = useNavigate();
  return (
    <Grid
      id="style-1"
      padding={2}
      margin={0}
      sx={{
        backgroundColor: "lavender",
        borderRadius: "16px",
        height: "100%",
      }}
    >
      <Typography variant="h6" noWrap component="div" p={2}>
        eBay
      </Typography>
      <hr />
      <List id="style-1" sx={{ width: "100%" }}>
        <ListItem
          onClick={() => {
            navigate("/");
          }}
          sx={{
            marginY: 1,
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "ghostwhite",
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          onClick={() => {
            setSelectedComponent("ProfileDetails");
          }}
          sx={{
            marginY: 1,
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            cursor: "pointer",
            backgroundColor:
              selectedComponent === "ProfileDetails"
                ? "lightblue"
                : "transparent",
            "&:hover": {
              backgroundColor:
                selectedComponent === "ProfileDetails"
                  ? "lightblue"
                  : "ghostwhite",
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          onClick={() => {
            setSelectedComponent("BankDetails");
          }}
          sx={{
            marginY: 1,
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            cursor: "pointer",
            backgroundColor:
              selectedComponent === "BankDetails" ? "lightblue" : "transparent",
            "&:hover": {
              backgroundColor:
                selectedComponent === "BankDetails"
                  ? "lightblue"
                  : "ghostwhite",
            },
          }}
        >
          <ListItemIcon>
            <AccountBalanceWalletOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
      </List>
    </Grid>
  );
};

export default Sidebar;
