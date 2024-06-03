import React, { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import SideBar from "../components/SideBar";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Profile from "../pages/Profile";

function DashBoard() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const handleOpen = () => {
    setIsOpenSidebar(true);
  };
  const handleClose = () => {
    setIsOpenSidebar(false);
  };

  return (
    <Grid container margin={0} padding={0}>
      <Grid
        item
        xs={isOpenSidebar ? 3 : 1}
        sx={{
          height: "100vh",
          transition: "all 0.2s ease",
        }}
      >
        <SideBar
          isOpenSidebar={isOpenSidebar}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
      </Grid>
      <Grid
        item
        xs={isOpenSidebar ? 9 : 11}
        sx={{
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Grid container margin={0} padding={1}>
          <Paper
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "16px",
              margin: 0,
              padding: 0,
            }}
          >
            <Grid container margin={0} padding={0}>
              <Grid item xs={12} margin={0} padding={2}>
                <Paper
                  sx={{
                    display: "flex",
                    width: "100%",
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    margin: 0,
                    paddingX: 2,
                    paddingY: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {isOpenSidebar ? (
                      "Dashboard"
                    ) : (
                      <>
                        <ShoppingBagOutlinedIcon fontSize="large" /> eBay
                      </>
                    )}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} margin={0} padding={2}>
                <Paper
                  id="style-1"
                  sx={{
                    display: "flex",
                    width: "100%",
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    margin: 0,
                    paddingX: 2,
                    paddingY: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    overflowY: "scroll",
                  }}
                >
                  <Profile />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DashBoard;
