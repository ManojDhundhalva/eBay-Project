import React from "react";
import { Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

function SideBar({ isOpenSidebar, handleOpen, handleClose }) {
  return (
    <>
      <Grid container margin={0} padding={1} sx={{ height: "100vh" }}>
        <Paper
          id="style-1"
          sx={{
            width: "100%",
            height: "100%",
            overflowY: "scroll",
            borderRadius: "16px",
            margin: 0,
            padding: 0,
          }}
        >
          {!isOpenSidebar ? (
            <>
              <Grid container margin={0} padding={2}>
                <Paper
                  sx={{
                    display: "flex",
                    width: "100%",
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    margin: 0,
                    padding: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingX: 2,
                      paddingY: 1,
                    }}
                  >
                    <IconButton
                      aria-label="back"
                      color="primary"
                      onClick={handleOpen}
                    >
                      <ArrowForwardIosRoundedIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
              <Grid container margin={0} padding={2}>
                <Grid container margin={0} padding={0} paddingY={1}>
                  <Paper
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      margin: 0,
                      paddingX: 2,
                      paddingY: 1,
                    }}
                    onClick={handleOpen}
                  >
                    <AccountCircleOutlinedIcon fontSize="large" />
                  </Paper>
                </Grid>
                <Grid container margin={0} padding={0} paddingY={1}>
                  <Paper
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      margin: 0,
                      paddingX: 2,
                      paddingY: 1,
                    }}
                    onClick={handleOpen}
                  >
                    <AccountCircleOutlinedIcon fontSize="large" />
                  </Paper>
                </Grid>
                <Grid container margin={0} padding={0} paddingY={1}>
                  <Paper
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      margin: 0,
                      paddingX: 2,
                      paddingY: 1,
                    }}
                    onClick={handleOpen}
                  >
                    <AccountCircleOutlinedIcon fontSize="large" />
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid container margin={0} padding={2}>
                <Paper
                  sx={{
                    width: "100%",
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingX: 2,
                      paddingY: 1,
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="h5" fontWeight="bold">
                        <ShoppingBagOutlinedIcon fontSize="large" />
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        EBay
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        aria-label="back"
                        color="primary"
                        onClick={handleClose}
                      >
                        <ArrowBackIosNewRoundedIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid container margin={0} padding={2}>
                <Grid container margin={0} padding={0} paddingY={1}>
                  <Paper
                    sx={{
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      paddingX: 2,
                      paddingY: 1,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      <AccountBalanceWalletOutlinedIcon fontSize="large" />
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      Account
                    </Typography>
                  </Paper>
                </Grid>
                <Grid container margin={0} padding={0} paddingY={1}>
                  <Paper
                    sx={{
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      paddingX: 2,
                      paddingY: 1,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      <ShoppingBagOutlinedIcon fontSize="large" />
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      EBay
                    </Typography>
                  </Paper>
                </Grid>
                <Grid container margin={0} padding={0} paddingY={1}>
                  <Paper
                    sx={{
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      paddingX: 2,
                      paddingY: 1,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      <ShoppingBagOutlinedIcon fontSize="large" />
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      EBay
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Grid>
    </>
  );
}

export default SideBar;
