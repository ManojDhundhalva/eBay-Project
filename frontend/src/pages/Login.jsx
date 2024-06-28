import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import {
  Box,
  Grid,
  Zoom,
  Avatar,
  Button,
  Tooltip,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import axios from "axios";
import image1 from "../images/image1.jpg";
import OtpInput from "react-otp-input";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [validNewPassword, setValidNewPassword] = useState("");
  const [justNewVerify, setJustNewVerify] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [time, setTime] = useState(120); // 2 minutes = 120 seconds

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [time]);

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

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

  const handlePasswordofForgot = (e) => {
    const input = e.target.value;
    setNewPassword(input);
    if (input.length < 8) {
      setValidNewPassword(false);
      return;
    } else {
      setValidNewPassword(true);
    }
  };

  const getOtp = async (username, emailid) => {
    if (username == "" || emailid === "") {
      return;
    }
    try {
      const results = await axios.post(
        "http://localhost:8000/api/v1/verify-email",
        { username, emailid }
      );
      setOtp(String(results.data.code));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setJustVerify(true);
    if (
      emailUsername === "" ||
      password === "" ||
      !validPassword ||
      emailUsername.length >= 255 ||
      password.length > 255
    ) {
      return;
    }
    setLoading(true);

    try {
      const results = await axios.post("http://localhost:8000/api/v1/login", {
        username: emailUsername,
        password,
      });

      if (results.status === 200) {
        window.localStorage.setItem("token", results.data.token);
        window.localStorage.setItem("username", results.data.username);
        window.localStorage.setItem("role", results.data.role);
        setIsLoggedIn(true);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (err) {
      console.log("error -> ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (window.localStorage.getItem("token") === null) {
      validateUser();
    } else {
      navigate(-1);
    }
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        paddingX: { xs: 2, sm: 4 },
        paddingY: { xs: 4, sm: 6 },
        background: `url(${image1}) no-repeat bottom center fixed`,
        backgroundSize: "cover",
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          backdropFilter: "blur(10px)",
          backgroundColor: "transparent",
        }}
      >
        {step == 0 ? (
          <>
            <Avatar sx={{ backgroundColor: "#25396F", mb: 2 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Sign in
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    value={emailUsername}
                    onChange={(e) => {
                      setEmailUsername(e.target.value);
                    }}
                    id="username"
                    label="Username"
                    placeholder="username"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    autoComplete="off"
                    error={
                      justVerify &&
                      (emailUsername === "" || emailUsername.length >= 255)
                    }
                    helperText={
                      justVerify &&
                      (emailUsername === ""
                        ? "This field cannot be empty."
                        : "")
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#02294F" }} />
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
                    value={password}
                    onChange={handlePasswordofLogin}
                    id="password"
                    label="Password"
                    placeholder="password"
                    variant="outlined"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    size="small"
                    autoComplete="off"
                    error={
                      justVerify &&
                      (!validPassword ||
                        password === "" ||
                        password.length >= 255)
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyRoundedIcon sx={{ color: "#02294F" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <Visibility sx={{ color: "#02294F" }} />
                            ) : (
                              <VisibilityOff sx={{ color: "#02294F" }} />
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
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
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
                    {!loading ? "Sign In" : "Signing In"}
                    {loading && (
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    )}
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
                <Grid item container justifyContent="space-between" xs={12}>
                  <Button
                    color="secondary"
                    variant="text"
                    onClick={() => {
                      navigate("/register");
                    }}
                    sx={{
                      fontWeight: "bold",
                      color: "#03045e",
                      textDecoration: "underline",
                    }}
                  >
                    Don't have an account? Sign Up
                  </Button>
                  <Button
                    color="secondary"
                    variant="text"
                    onClick={() => {
                      if (emailUsername === "") {
                        toast("Please, Enter username!", {
                          icon: "👏",
                        });
                      }
                      //  else if (!isValidUserName(emailUsername)) {
                      //   toast("User doesn't exist!", {
                      //     icon: "👏",
                      //   });
                      // }
                      else {
                        setStep(1);
                        setTime(120);
                        setShowPassword(false);
                      }
                    }}
                    sx={{
                      fontWeight: "bold",
                      color: "#03045e",
                      textDecoration: "underline",
                    }}
                  >
                    Fogot Password?
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        ) : step == 1 ? (
          <>
            <Avatar sx={{ backgroundColor: "#25396F", mb: 2 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Forgot Password
            </Typography>
            <Box sx={{ position: "absolute", top: 0, left: 0, m: 4 }}>
              <Tooltip
                arrow
                placement="top"
                title="Back"
                TransitionComponent={Zoom}
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
                  aria-label="Back"
                  onClick={() => {
                    setStep(0);
                    setShowPassword(false);
                  }}
                  sx={{
                    backgroundColor: "lavender",
                    color: "#023E8A",
                  }}
                >
                  <ArrowBackRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography fontWeight="bold" sx={{ p: 2 }}>
              Enter the 4-digit code sent to your email:
            </Typography>
            <OtpInput
              inputStyle={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "40px",
                height: "40px",
                textAlign: "center",
                fontSize: "18px",
                margin: "0 5px",
                fontWeight: "bold",
              }}
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderSeparator={<span>&nbsp;&nbsp;&nbsp;</span>}
              renderInput={(props) => <input {...props} />}
            />
            <Grid
              item
              container
              justifyContent="flex-start"
              xs={12}
              padding={4}
            >
              {time > 0 ? (
                <Typography
                  fontWeight="bold"
                  sx={{ textDecoration: "underline" }}
                >
                  {formatTime(time)}
                </Typography>
              ) : (
                <Button
                  color="secondary"
                  variant="text"
                  onClick={() => {
                    navigate("/register");
                  }}
                  sx={{
                    fontWeight: "bold",
                    color: "#03045e",
                    textDecoration: "underline",
                  }}
                >
                  Resend code
                </Button>
              )}
            </Grid>
            <Grid item container justifyContent="flex-end" xs={12}>
              <Button
                variant="contained"
                onClick={() => {
                  setStep(2);
                  setShowPassword(false);
                }}
                sx={{
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
                Verify
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Avatar sx={{ backgroundColor: "#25396F", mb: 2 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Enter New Password
            </Typography>
            <Box sx={{ position: "absolute", top: 0, left: 0, m: 4 }}>
              <Tooltip
                arrow
                placement="top"
                title="Back"
                TransitionComponent={Zoom}
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
                  aria-label="Back"
                  onClick={() => {
                    setStep(1);
                    setShowPassword(false);
                  }}
                  sx={{
                    backgroundColor: "lavender",
                    color: "#023E8A",
                  }}
                >
                  <ArrowBackRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid item xs={12}>
              <TextField
                value={newPassword}
                onChange={handlePasswordofForgot}
                id="new-password"
                label="New Password"
                placeholder="new password"
                variant="outlined"
                name="newpassword"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                size="small"
                error={
                  justNewVerify &&
                  (!validNewPassword ||
                    newPassword === "" ||
                    newPassword.length >= 255)
                }
                helperText={
                  justNewVerify &&
                  (newPassword === ""
                    ? "This field cannot be empty."
                    : !validNewPassword
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
                        {showPassword ? (
                          <Visibility sx={{ color: "#02294F" }} />
                        ) : (
                          <VisibilityOff sx={{ color: "#02294F" }} />
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
            <Grid item container justifyContent="flex-end" xs={12}>
              <Button
                variant="contained"
                onClick={(e) => {
                  setPassword(newPassword);
                  // handleSubmit(e);
                }}
                sx={{
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
                Reset Password
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
          </>
        )}
      </Grid>
    </Grid>
  );
}
