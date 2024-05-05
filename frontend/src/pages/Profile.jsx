import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Grid, Typography, TextField, Button } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/auth";

const Profile = () => {
  const imageURL =
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();
  const { setIsLoggedIn, validateUser, LogOut } = useAuth();

  const toastOptions = {
    style: {
      zIndex: 9999,
      fontFamily: "Quicksand",
      fontWeight: "600",
    },
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Quicksand",
      body1: {
        fontWeight: "600",
      },
    },
  });

  const handlePhoneNumber = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
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
      return;
    }

    setLoading(true);

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
    } catch (err) {
      LogOut();
      console.error("Error updating profile:", err);
    }

    setLoading(false);
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
      setFirstName(results.data.firstname);
      setLastName(results.data.lastname);
      setUserName(results.data.username);
      setEmail(results.data.emailid);
      setRole(results.data.role);
      setPhoneNumber(results.data.phone_number);
    } catch (err) {
      LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    validateUser();
  }, []);

  return (
    <>
      <div
        data-aos="fade-up"
        style={{ margin: "2em", fontFamily: "Quicksand", fontWeight: "600" }}
      >
        <ThemeProvider theme={theme}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <Card
                sx={{
                  maxWidth: "100%",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <CardMedia
                  component="img"
                  alt="profile"
                  height="100"
                  image={imageURL}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    YOU
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {userName}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {email}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    +91 {phoneNumber}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} style={{ marginLeft: "0.1em" }}>
                    <Grid item xs={10} style={{ marginTop: "1em" }}>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        Profile
                      </Typography>
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "1em" }}>
                      <TextField
                        InputProps={{
                          style: {
                            fontFamily: "Quicksand",
                            fontWeight: "bold",
                          },
                        }}
                        required
                        id="standard-helperText-1"
                        label="First Name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        fullWidth
                        autoComplete="off"
                        error={
                          justVerify &&
                          (firstName === "" || firstName.length >= 255)
                        }
                        helperText={
                          firstName === "" &&
                          (justVerify ? "This field cannot be empty" : "")
                        }
                      />
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "1em" }}>
                      <TextField
                        InputProps={{
                          style: {
                            fontFamily: "Quicksand",
                            fontWeight: "bold",
                          },
                        }}
                        required
                        id="standard-helperText-1"
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        fullWidth
                        autoComplete="off"
                        error={
                          justVerify &&
                          (lastName === "" || lastName.length >= 255)
                        }
                        helperText={
                          lastName === "" &&
                          (justVerify ? "This field cannot be empty" : "")
                        }
                      />
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "0.4em" }}>
                      <TextField
                        id="standard-helperText-4"
                        label="Username"
                        value={userName}
                        InputProps={{
                          readOnly: true,
                          style: {
                            fontFamily: "Quicksand",
                            fontWeight: "bold",
                          },
                        }}
                        fullWidth
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        id="standard-helperText-4"
                        label="Email"
                        value={email}
                        InputProps={{
                          readOnly: true,
                          style: {
                            fontFamily: "Quicksand",
                            fontWeight: "bold",
                          },
                        }}
                        fullWidth
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "0.4em" }}>
                      <TextField
                        id="standard-helperText-4"
                        label="Role"
                        value={role}
                        InputProps={{
                          readOnly: true,
                          style: {
                            fontFamily: "Quicksand",
                            fontWeight: "bold",
                          },
                        }}
                        fullWidth
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "0.4em" }}>
                      <TextField
                        id="standard-basic-2"
                        required
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        autoFocus
                        onChange={handlePhoneNumber}
                        value={phoneNumber}
                        InputProps={{
                          style: {
                            fontFamily: "Quicksand",
                            fontWeight: "bold",
                          },
                        }}
                        error={
                          justVerify &&
                          (phoneNumber === "" || phoneNumber.length !== 10)
                        }
                        helperText={
                          justVerify &&
                          (phoneNumber === ""
                            ? "This field cannot be empty."
                            : phoneNumber.length !== 10
                            ? "Phone number must be exactly 10 digits."
                            : "")
                        }
                        autoComplete="off"
                      />
                    </Grid>
                  </Grid>
                  <div style={{ textAlign: "center", marginTop: "1em" }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={UpdateProfile}
                      style={{ marginTop: "1em", backgroundColor: "#2A386B" }}
                      sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                    >
                      {!loading ? "UPDATE" : "Updating..."}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            style={{ marginTop: "5em" }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={4}
              style={{ textAlign: "center" }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  LogOut();
                  toast.success("Logout successful!");
                }}
                style={{ marginTop: "1em" }}
                sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
              >
                Logout &nbsp;
                <LogoutIcon />
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </>
  );
};

export default Profile;
