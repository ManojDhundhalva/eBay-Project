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
import getLPTheme from "../getLPTheme";
import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/system";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

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

  const LPtheme = createTheme(getLPTheme());

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
      // LogOut();
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
      // LogOut();
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
        className="mt-4"
        data-aos="fade-up"
        style={{ margin: "2em", fontFamily: "Quicksand", fontWeight: "600" }}
      >
        <ThemeProvider theme={LPtheme}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <Box
                id="image"
                sx={(theme) => ({
                  mt: { xs: 8, sm: 10 },
                  alignSelf: "center",
                  height: { xs: 200, sm: 700 },
                  width: "100%",
                  backgroundSize: "cover",
                  borderRadius: "10px",
                  outline: "1px solid",
                  outlineColor:
                    theme.palette.mode === "light"
                      ? alpha("#BFCCD9", 0.5)
                      : alpha("#9CCCFC", 0.1),
                  boxShadow:
                    theme.palette.mode === "light"
                      ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                      : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                  color: theme.palette.mode !== "light" ? "black" : "white",
                })}
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
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Box
                id="image"
                sx={(theme) => ({
                  mt: { xs: 8, sm: 10 },
                  alignSelf: "center",
                  height: { xs: 200, sm: 700 },
                  width: "100%",
                  backgroundImage:
                    theme.palette.mode === "light"
                      ? 'url("/static/images/templates/templates-images/hero-light.png")'
                      : 'url("/static/images/templates/templates-images/hero-dark.png")',
                  backgroundSize: "cover",
                  borderRadius: "10px",
                  outline: "1px solid",
                  outlineColor:
                    theme.palette.mode === "light"
                      ? alpha("#BFCCD9", 0.5)
                      : alpha("#9CCCFC", 0.1),
                  boxShadow:
                    theme.palette.mode === "light"
                      ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                      : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
                })}
              >
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
                    <Grid item xs={10}>
                      <FormGrid item className="mt-3">
                        <FormLabel htmlFor="first-name" required>
                          First Name
                        </FormLabel>
                        <TextField
                          InputProps={{
                            style: {
                              fontFamily: "Quicksand",
                              fontWeight: "bold",
                            },
                          }}
                          required
                          id="standard-helperText-1"
                          name="first-name"
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
                      </FormGrid>
                    </Grid>
                    <Grid item xs={10}>
                      <FormGrid item className="mt-2">
                        <FormLabel htmlFor="last-name" required>
                          Last Name
                        </FormLabel>
                        <TextField
                          InputProps={{
                            style: {
                              fontFamily: "Quicksand",
                              fontWeight: "bold",
                            },
                          }}
                          required
                          id="standard-helperText-1"
                          name="last-name"
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
                      </FormGrid>
                    </Grid>
                    <Grid item xs={10}>
                      <FormGrid item className="mt-2">
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <TextField
                          id="standard-helperText-4"
                          name="username"
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
                      </FormGrid>
                    </Grid>
                    <Grid item xs={10}>
                      <FormGrid item className="mt-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                          id="standard-helperText-4"
                          name="email"
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
                      </FormGrid>
                    </Grid>
                    <Grid item xs={10}>
                      <FormGrid item className="mt-2">
                        <FormLabel htmlFor="role">Role</FormLabel>
                        <TextField
                          id="standard-helperText-4"
                          name="role"
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
                      </FormGrid>
                    </Grid>
                    <Grid item xs={10}>
                      <FormGrid item className="mt-2">
                        <FormLabel htmlFor="phone-number">
                          Phone Number
                        </FormLabel>
                        <TextField
                          id="standard-basic-2"
                          required
                          fullWidth
                          name="phone-number"
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
                      </FormGrid>
                    </Grid>
                  </Grid>
                  <div style={{ textAlign: "center", marginTop: "1em" }}>
                    <Button
                      className="mt-4"
                      variant="contained"
                      onClick={UpdateProfile}
                      sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                    >
                      {!loading ? "UPDATE" : "Updating..."}
                    </Button>
                  </div>
                </CardContent>
              </Box>
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
                onClick={() => {
                  LogOut();
                  toast.success("Logout successful!");
                }}
                style={{ marginTop: "1em" }}
                sx={{
                  backgroundImage:
                    "linear-gradient(to bottom right, #dc2f02, #d00000)",
                  color: "white", // Text color
                  fontWeight: "bold",
                  fontFamily: "Quicksand",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(to bottom right, #c9184a, #d00000)",
                  },
                }}
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
