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
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoIcon from "@mui/icons-material/Info";
import image1 from "../images/image1.jpg";

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
  const [errorUserName, setErrorUserName] = useState(false);
  const [errorEmailId, setErrorEmailId] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();
  const { validateUser, isLoggedIn } = useAuth();

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
      errorEmailId ||
      errorUserName ||
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
      toast("Please fill out all fields correctly.", {
        icon: <InfoIcon />,
      });
      return;
    }

    setloading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/register",
        {
          firstname,
          lastname,
          username,
          emailid: email,
          password,
          role,
          phone_number: phoneNumber,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("An error occurred during registration.");
    } finally {
      setloading(false);
    }
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
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          backgroundColor: "lavender",
          padding: { xs: 2, sm: 3, md: 5 },
          background: `url(${image1}) no-repeat bottom center fixed`,
          backgroundSize: "cover",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          backdropFilter: "blur(10px)",
          backgroundColor: "transparent",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={4}
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            backdropFilter: "blur(10px)",
            backgroundColor: "transparent",
          }}
        >
          <Grid
            item
            margin={0}
            padding={2}
            container
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar sx={{ backgroundColor: "#25396F", mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Create A New Account
            </Typography>
          </Grid>
          <Grid
            container
            component="form"
            onSubmit={handleSubmit}
            spacing={2}
            padding={2}
          >
            <Grid item xs={12}>
              <TextField
                value={firstname}
                onChange={(e) => SetFirstname(e.target.value)}
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
            <Grid item xs={12}>
              <TextField
                value={lastname}
                onChange={(e) => SetLastname(e.target.value)}
                id="lastname"
                label="Last Name"
                placeholder="e.g. Dhundhalva"
                variant="outlined"
                fullWidth
                required
                size="small"
                error={
                  justVerify && (lastname === "" || lastname.length >= 255)
                }
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
            <Grid item xs={12}>
              <TextField
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  const hasDigit = /\d/.test(value);
                  setUsername(value);
                  setErrorUserName(!hasDigit);
                }}
                id="username"
                label="User Name"
                placeholder="username"
                variant="outlined"
                fullWidth
                required
                size="small"
                error={
                  justVerify &&
                  (username === "" || username.length >= 255 || errorUserName)
                }
                helperText={
                  justVerify &&
                  (username === ""
                    ? "This field cannot be empty."
                    : errorUserName
                    ? "This field must contain at least one digit"
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
            <Grid item xs={12}>
              <TextField
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  setEmail(value);
                  setErrorEmailId(!emailRegex.test(value));
                }}
                id="email"
                label="Email Address"
                placeholder="abc@gmail.com"
                variant="outlined"
                fullWidth
                required
                size="small"
                error={
                  justVerify &&
                  (email === "" || email.length >= 255 || errorEmailId)
                }
                helperText={
                  justVerify &&
                  (email === ""
                    ? "This field cannot be empty."
                    : errorEmailId
                    ? "Please, enter valid email id"
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
            <Grid item xs={12}>
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
                        {!showPassword ? (
                          <VisibilityOff sx={{ color: "#02294F" }} />
                        ) : (
                          <Visibility sx={{ color: "#02294F" }} />
                        )}
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
            <Grid item xs={12}>
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 25,
                    fontWeight: "bold",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  position: "relative",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  backgroundColor: "#02294F",
                  color: "white",
                  "&:hover": {
                    color: "white",
                    backgroundColor: "#25396F",
                  },
                }}
              >
                {!loading ? "Sign Up" : "Signing Up"}
                {loading && <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                {loading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: "white",
                      right: 0,
                    }}
                  />
                )}
              </Button>
            </Grid>
            <Grid item xs={12}>
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
      </Grid>
    </>
  );
}
