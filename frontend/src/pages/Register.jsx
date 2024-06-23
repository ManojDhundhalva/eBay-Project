import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import getLPTheme from "../getLPTheme";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function Register() {
  const [loading, setloading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const handlePasswordofLogin = (e) => {
    const input = e.target.value;
    setPassword(input);
    if (input.length < 8) {
      setValidPassword(false);
      return;
    } else {
      setValidPassword(true);
    }
  };
  const [firstname, SetFirstname] = useState("");
  const [lastname, SetLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();
  const { mode, validateUser, isLoggedIn } = useAuth();
  const LPtheme = createTheme(getLPTheme(mode));

  const handlePhoneNumber = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      if (input.length <= 10) {
        setPhoneNumber(input);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setJustVerify(true);

    if (
      firstname === "" ||
      lastname === "" ||
      username === "" ||
      email === "" ||
      !validPassword ||
      role === "" ||
      firstname.length >= 255 ||
      lastname.length >= 255 ||
      username.length >= 255 ||
      email.length >= 255 ||
      password.length >= 255 ||
      phoneNumber.length !== 10
    ) {
      return;
    }

    setloading(true);

    try {
      await toast.promise(
        axios.post("http://localhost:8000/api/v1/register", {
          firstname,
          lastname,
          username,
          emailid: email,
          password,
          role,
          phone_number: phoneNumber,
        }),
        {
          loading: "Registering...", // Message shown during loading
          success: () => {
            navigate("/login");
            return <b>Registration successful!</b>; // Success message
          },
          error: () => {
            return <b>Registration failed.</b>; // Error message
          },
        }
      );
    } catch (err) {
      console.log("Error -> ", err);
    }
    setloading(false);
  };

  useEffect(() => {
    if (window.localStorage.getItem("token") === null) {
      validateUser();
    } else {
      navigate(-1);
    }
  }, []);

  return (
    <>
      <Grid item container padding={0} margin={0}>
        <Grid
          item
          container
          padding={0}
          margin={0}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "lightblue" }}
        >
          <Avatar sx={{ backgroundColor: "#25396F" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Create A New Account
          </Typography>
        </Grid>
        <Grid item container sx={{ backgroundColor: "lavender" }}>
          <Grid item xs={12} padding={0} margin={0}>
            <TextField
              value={firstname}
              onChange={(e) => {
                SetFirstname(e.target.value);
              }}
              id="firstname"
              label="First Name"
              placeholder="e.g. Manoj"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={
                justVerify && (firstname === "" || firstname.length >= 255)
              }
              helperText={
                justVerify &&
                (firstname === "" ? "This field cannot be empty." : "")
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} padding={0} margin={0}>
            <TextField
              value={lastname}
              onChange={(e) => {
                SetLastname(e.target.value);
              }}
              id="lastname"
              label="Last Name"
              placeholder="e.g. Dhundhalva"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={justVerify && (lastname === "" || lastname.length >= 255)}
              helperText={
                justVerify &&
                (lastname === "" ? "This field cannot be empty." : "")
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} padding={0} margin={0}>
            <TextField
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              id="username"
              label="User Name"
              placeholder="e.g. Manoj"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={justVerify && (username === "" || username.length >= 255)}
              helperText={
                justVerify &&
                (username === "" ? "This field cannot be empty." : "")
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} padding={0} margin={0}>
            <TextField
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              id="email"
              label="Email Address"
              placeholder="e.g. manoj@gmail.com"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={justVerify && (email === "" || email.length >= 255)}
              helperText={
                justVerify &&
                (email === "" ? "This field cannot be empty." : "")
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} padding={0} margin={0}>
            <TextField
              value={password}
              onChange={handlePasswordofLogin}
              id="password"
              label="Password"
              placeholder="e.g. 12345678"
              variant="outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              size="small"
              error={
                justVerify &&
                (!validPassword || password === "" || password.length >= 255)
              }
              helperText={
                justVerify &&
                (password === ""
                  ? "This field cannot be empty."
                  : !validPassword
                  ? "The password must contain at least 8 characters."
                  : "")
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} padding={0} margin={0}>
            <TextField
              value={phoneNumber}
              onChange={handlePhoneNumber}
              id="phone-number"
              label="Phone Number"
              placeholder="e.g. 1234567890"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={
                justVerify && (phoneNumber === "" || phoneNumber.length !== 10)
              }
              helperText={
                justVerify &&
                (phoneNumber === ""
                  ? "This field cannot be empty."
                  : phoneNumber.length !== 10
                  ? "Phone number must be exactly 10 digits."
                  : "")
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
        <Grid item container sx={{ backgroundColor: "lightblue" }}>
          <Grid item xs={12} padding={0} margin={0}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                fontWeight: "bold",
                borderRadius: "12px",
                backgroundColor: "#02294F",
                color: "white",
                "&: hover": {
                  color: "white",
                  backgroundColor: "#25396F",
                },
              }}
            >
              {!loading ? "Sign Up" : "Signing Up...."}
            </Button>
          </Grid>
          <Grid item xs={12} padding={0} margin={0}>
            <Button
              color="secondary"
              variant="text"
              onClick={() => {
                navigate("/login");
              }}
              sx={{
                fontWeight: "bold",
                color: "#03045e",
                textDecoration: "underline",
              }}
            >
              Already have an account? Sign In
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
