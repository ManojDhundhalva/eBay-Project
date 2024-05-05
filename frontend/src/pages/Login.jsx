import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useAuth } from "../context/auth";
import axios from "axios";

const defaultTheme = createTheme();

export default function Login() {
  const [loading, setloading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const { setIsLoggedIn, validateUser } = useAuth();

  const [isAlert, setIsAlert] = useState(false);

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
    setloading(true);

    try {
      const results = await axios.post("http://localhost:8000/api/v1/login", {
        username: emailUsername,
        password,
      });

      window.localStorage.setItem("token", results.data.token);
      window.localStorage.setItem("username", results.data.username);
      window.localStorage.setItem("role", results.data.role);

      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setIsAlert(true);
      console.log("error -> ", err);
    }
    setloading(false);
  };

  useEffect(() => {
    validateUser();
  }, []);

  return (
    <div className="my-glass-effect">
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="sm"
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <CssBaseline />
          <Box
            style={{
              backgroundColor: "#caf0f8",
              boxShadow: "0px 4px 8px #caf0f8",
            }}
            sx={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderRadius: "2em",
              padding: "3em",
              height: "auto",
            }}
          >
            <Avatar sx={{ m: 1 }} style={{ backgroundColor: "#25396F" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
            >
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                id="standard-basic-1"
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="Username"
                name="email"
                autoFocus
                value={emailUsername}
                onChange={(e) => {
                  setEmailUsername(e.target.value);
                }}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                    color: "#25396F",
                  },
                }}
                error={
                  justVerify &&
                  (emailUsername === "" || emailUsername.length >= 255)
                }
                helperText={
                  justVerify &&
                  (emailUsername == "" ? "This field cannot be empty." : "")
                }
                autoComplete="off"
              />
              <TextField
                id="standard-basic-2"
                variant="standard"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={handlePasswordofLogin}
                value={password}
                InputProps={{
                  style: {
                    fontFamily: "Quicksand",
                    fontWeight: "bold",
                    color: !validPassword ? "#f44336" : "#25396F",
                  },
                }}
                error={
                  justVerify &&
                  (!validPassword || password === "" || password.length >= 255)
                }
                helperText={
                  justVerify &&
                  (password === ""
                    ? "This field cannot be empty."
                    : !validPassword
                    ? "The password must contain at least 8 digits."
                    : "")
                }
                autoComplete="off"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{
                  fontFamily: "Quicksand",
                  fontWeight: "bold",
                  backgroundColor: "#25396F",
                }}
              >
                {!loading ? "Sign In" : "Signing In...."}
              </Button>
              <Grid container>
                <Grid item xs={12}>
                  {window.localStorage.getItem("token") === null && isAlert && (
                    <Alert
                      variant="filled"
                      severity="error"
                      style={{ fontFamily: "Quicksand", fontWeight: "600" }}
                    >
                      Invalid Email and/or Password
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      navigate("/register");
                    }}
                    variant="text"
                    style={{
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                      color: "#03045e",
                      textDecoration: "underline",
                    }}
                  >
                    Don't have an account? Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
