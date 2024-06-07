import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

function ProfileDetails() {
  const ImgUrl =
    "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=626&ext=jpg&ga=GA1.1.61947746.1703400710&semt=ais_user";

  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumber = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input) && input.length <= 10) {
      setPhoneNumber(input);
    }
  };

  return (
    <>
      <Grid container padding={2} margin={0}>
        <Grid xs={12} item padding={2} margin={0}>
          <Box sx={{ backgroundColor: "white", borderRadius: "16px", p: 2 }}>
            <Grid container padding={0} margin={0}>
              <Grid xs={3} padding={3} margin={0}>
                <Avatar
                  alt="user"
                  src={ImgUrl}
                  sx={{
                    width: 180,
                    height: 180,
                    borderRadius: "30px",
                    border: "1px solid gray",
                  }}
                />
              </Grid>
              <Grid
                xs={8}
                padding={0}
                margin={0}
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Grid>
                  <Grid>
                    <Typography
                      variant="h5"
                      noWrap
                      component="div"
                      fontWeight="bold"
                      sx={{ width: "100%" }}
                    >
                      Username
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{ width: "100%" }}
                    >
                      abc@gmail.com
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                xs={1}
                padding={2}
                margin={0}
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                }}
              >
                <Button variant="contained" sx={{ width: "100%" }}>
                  Edit
                </Button>
              </Grid>
            </Grid>
            <Grid container margin={0} padding={0}>
              <Grid xs={6} margin={0} padding={2} paddingX={4}>
                <TextField
                  id="first-name"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 25,
                      fontWeight: "bold",
                    },
                  }}
                />
              </Grid>
              <Grid xs={6} margin={0} padding={2} paddingX={4}>
                <TextField
                  id="last-name"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 25,
                      fontWeight: "bold",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid xs={6} item padding={2} margin={0}>
          <Box sx={{ backgroundColor: "white", borderRadius: "16px", p: 2 }}>
            <Typography variant="h6" noWrap component="div">
              Contact Info
            </Typography>
            <hr />
            <Grid container padding={3} margin={0} alignItems="center">
              <Grid>
                <Avatar
                  sx={{ backgroundColor: "lightblue", width: 60, height: 60 }}
                >
                  <PhoneIcon fontSize="large" sx={{ color: "#023e8a" }} />
                </Avatar>
              </Grid>
              <Grid padding={3}>
                <Typography variant="h6" noWrap component="div">
                  +91 1234567890
                </Typography>
              </Grid>
            </Grid>
            <Grid padding={2} margin={0}>
              <TextField
                value={"+91 | " + phoneNumber}
                onChange={handlePhoneNumber}
                id="phone-nunber"
                label="Phone Number"
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 25,
                    fontWeight: "bold",
                  },
                }}
              />
            </Grid>
          </Box>
        </Grid>
        <Grid xs={6} item padding={2} margin={0}>
          <Box sx={{ backgroundColor: "white", borderRadius: "16px" }}>
            <Typography variant="h6" noWrap component="div" p={2}>
              Address
              <hr />
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ProfileDetails;
