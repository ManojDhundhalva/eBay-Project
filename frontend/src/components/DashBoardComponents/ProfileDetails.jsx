import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutIcon from "@mui/icons-material/Logout";

function ProfileDetails() {
  const ImgUrl =
    "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=626&ext=jpg&ga=GA1.1.61947746.1703400710&semt=ais_user";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("N/A");
  const { validateUser, LogOut } = useAuth();

  const [originalFirstName, setOriginalFirstName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");

  const [justVerify, setJustVerify] = useState(false);
  const [editOn, setEditOn] = useState(false);

  const handlePhoneNumber = (e) => {
    const input = e.target.value.replace("+91 ", "");
    if (/^\d*$/.test(input) && input.length <= 10) {
      setPhoneNumber(input);
    }
  };

  const UpdateProfile = async () => {
    setJustVerify(true);
    if (
      firstName === "" ||
      lastName === "" ||
      firstName.length >= 255 ||
      lastName.length >= 255 ||
      phoneNumber.length !== 10
    ) {
      toast.error(<b>Please, Complete All required details.</b>);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      await toast.promise(
        axios.post(
          `http://localhost:8000/api/v1/profile?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
          {
            firstname: firstName,
            lastname: lastName,
            phone_number: phoneNumber,
          },
          { headers }
        ),
        {
          loading: "Updating profile...", // Message shown during loading
          success: <b>Profile updated successfully!</b>, // Success message
          error: <b>Failed to update profile.</b>, // Error message
        }
      );
      setOriginalFirstName(firstName);
      setOriginalLastName(lastName);
      setOriginalPhoneNumber(phoneNumber);
      setJustVerify(false);
      setEditOn(false);
    } catch (err) {
      // LogOut();
      console.error("Error updating profile:", err);
    }
  };

  const getProfile = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/profile?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );

      console.log("profile", results.data);

      setFirstName(results.data.firstname);
      setOriginalFirstName(results.data.firstname);

      setLastName(results.data.lastname);
      setOriginalLastName(results.data.lastname);

      setPhoneNumber(results.data.phone_number);
      setOriginalPhoneNumber(results.data.phone_number);

      setLocation(
        results.data.seller_location === null
          ? "N/A"
          : results.data.seller_location
      );
      setUserName(results.data.username);
      setEmail(results.data.emailid);
      setRole(results.data.role);
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    validateUser();
  }, []);

  return (
    <>
      <Grid container padding={2} margin={0}>
        <Grid xs={12} item padding={2} margin={0}>
          <Box sx={{ backgroundColor: "white", borderRadius: "20px", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" noWrap component="div">
                User Info
              </Typography>
              {editOn ? (
                <Grid padding={0} margin={0}>
                  <Tooltip
                    title="Cancel"
                    TransitionComponent={Zoom}
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "common.black",
                          "& .MuiTooltip-arrow": {
                            color: "common.black",
                          },
                        },
                      },
                    }}
                  >
                    <IconButton
                      aria-label="Cancel"
                      color="#ADD8E6"
                      onClick={() => {
                        setEditOn(false);
                        setFirstName(originalFirstName);
                        setLastName(originalLastName);
                        setPhoneNumber(originalPhoneNumber);
                      }}
                      sx={{ backgroundColor: "#fae0e4", color: "red", mx: 1 }}
                    >
                      <CloseRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Save"
                    TransitionComponent={Zoom}
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "common.black",
                          "& .MuiTooltip-arrow": {
                            color: "common.black",
                          },
                        },
                      },
                    }}
                  >
                    <IconButton
                      aria-label="save"
                      color="#ADD8E6"
                      onClick={() => {
                        UpdateProfile();
                      }}
                      sx={{ backgroundColor: "lavender", color: "#023E8A" }}
                    >
                      <SaveRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              ) : (
                <Tooltip
                  title="Edit"
                  TransitionComponent={Zoom}
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "common.black",
                        "& .MuiTooltip-arrow": {
                          color: "common.black",
                        },
                      },
                    },
                  }}
                >
                  <IconButton
                    aria-label="edit"
                    color="#ADD8E6"
                    onClick={() => {
                      setEditOn(true);
                    }}
                    sx={{ backgroundColor: "lavender", color: "#023E8A" }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <hr />
            <Grid container padding={0} margin={0}>
              <Grid xs={3} padding={3} margin={0} sx={{ position: "relative" }}>
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
                {/* <IconButton
                  aria-label="edit"
                  color="#ADD8E6"
                  sx={{
                    backgroundColor: "lavender",
                    color: "#023E8A",
                    position: "absolute",
                    bottom: 25,
                    right: 84,
                    zIndex: 999,
                  }}
                >
                  <EditRoundedIcon />
                </IconButton> */}
              </Grid>
              <Grid container xs={9} padding={0} margin={0} alignItems="center">
                <Grid sx={{ width: "100%" }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ width: "100%" }}
                  >
                    {userName === "" ? "ABC" : userName}
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    sx={{ width: "100%", color: "gray" }}
                  >
                    {email === "" ? "abc@gmail.com" : email}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container xs={6} padding={2} margin={0} alignItems="center">
                <TextField
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  id="first-name"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  error={justVerify && firstName === ""}
                  helperText={
                    justVerify && firstName === ""
                      ? "This field cannot be empty"
                      : ""
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 25,
                      fontWeight: "bold",
                    },
                  }}
                />
              </Grid>
              <Grid container xs={6} padding={2} margin={0} alignItems="center">
                <TextField
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  id="last-name"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  error={justVerify && lastName === ""}
                  helperText={
                    justVerify && lastName === ""
                      ? "This field cannot be empty"
                      : ""
                  }
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
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
              p: 2,
            }}
          >
            <Typography variant="h6" noWrap component="div">
              Contact Info
            </Typography>
            <hr />
            <Grid container padding={0} margin={0} alignItems="center">
              <Grid
                container
                padding={0}
                margin={0}
                alignItems="center"
                direction="row"
              >
                <Grid item xs={2} padding={0} margin={0} direction="row">
                  <Avatar
                    sx={{
                      backgroundColor: "lightblue",
                      width: 60,
                      height: 60,
                      m: 2,
                    }}
                  >
                    <PhoneIcon fontSize="large" sx={{ color: "#023e8a" }} />
                  </Avatar>
                </Grid>
                <Grid item xs={10} padding={0} margin={0} direction="row">
                  <Typography variant="h6">
                    +91 {originalPhoneNumber}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} padding={2} margin={0}>
                <TextField
                  value={`+91 ${phoneNumber}`}
                  onChange={handlePhoneNumber}
                  id="phone-number"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  error={justVerify && phoneNumber === ""}
                  helperText={
                    justVerify && phoneNumber === ""
                      ? "This field cannot be empty"
                      : ""
                  }
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
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
              p: 2,
            }}
          >
            <Typography variant="h6" noWrap component="div">
              Address
            </Typography>
            <hr />
            <Grid
              container
              padding={0}
              margin={0}
              alignItems="center"
              direction="row"
            >
              <Grid item xs={2} padding={0} margin={0} direction="row">
                <Avatar
                  sx={{
                    backgroundColor: "lightblue",
                    width: 60,
                    height: 60,
                    m: 2,
                  }}
                >
                  <HomeWorkRoundedIcon
                    fontSize="large"
                    sx={{ color: "#023e8a" }}
                  />
                </Avatar>
              </Grid>
              <Grid item xs={10} padding={0} margin={0} direction="row">
                <Typography variant="h6">{location}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          container
          xs={12}
          item
          padding={2}
          margin={0}
          justifyContent="center"
        >
          <Button
            variant="contained"
            onClick={LogOut}
            sx={{
              userSelect: "none",
              borderRadius: "16px",
              fontWeight: "bold",
            }}
            startIcon={<LogoutIcon sx={{ color: "white" }} />}
            size="large"
            color="error"
          >
            LogOut
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ProfileDetails;
