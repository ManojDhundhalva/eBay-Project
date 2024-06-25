import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import {
  Grid,
  Avatar,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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

  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      margin={0}
      paddingX={4}
      paddingY={6}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "auto",
        maxWidth: "sm",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "lavender",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <Grid
        item
        container
        padding={0}
        margin={0}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar sx={{ backgroundColor: "#25396F" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" fontWeight="bold">
          Sign in
        </Typography>
      </Grid>
      <Grid
        item
        container
        margin={0}
        padding={2}
        component="form"
        onSubmit={handleSubmit}
      >
        <Grid item xs={12} padding={2} margin={0}>
          <TextField
            value={emailUsername}
            onChange={(e) => {
              setEmailUsername(e.target.value);
            }}
            id="username"
            label="Username"
            placeholder="e.g. Manoj"
            variant="outlined"
            fullWidth
            required
            size="small"
            error={
              justVerify &&
              (emailUsername === "" || emailUsername.length >= 255)
            }
            helperText={
              justVerify &&
              (emailUsername == "" ? "This field cannot be empty." : "")
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} padding={2} margin={0}>
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
        <Grid item xs={12} padding={2} margin={0}>
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
            {!loading ? "Sign In" : "Signing In"}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
        <Grid item xs={12} paddingY={0} paddingX={2} margin={0}>
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
        </Grid>
      </Grid>
    </Grid>
  );
}
