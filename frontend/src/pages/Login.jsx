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
import { toast } from "react-hot-toast";
import getLPTheme from "../getLPTheme";
import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/system";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();

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
  const { mode } = useAuth();
  const LPtheme = createTheme(getLPTheme(mode));

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
      await toast.promise(
        axios.post("http://localhost:8000/api/v1/login", {
          username: emailUsername,
          password,
        }),
        {
          loading: "Logging in...", // Message shown during loading
          success: (results) => {
            window.localStorage.setItem("token", results.data.token);
            window.localStorage.setItem("username", results.data.username);
            window.localStorage.setItem("role", results.data.role);

            setIsLoggedIn(true);
            navigate("/");
            // navigate("/auth?username=a&role=user");
            return <b>Login successful!</b>; // Success message
          },
          error: () => {
            return <b>Invalid Credentials</b>; // Error message
          },
        }
      );
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
    <div className="my-glass-effect">
      <ThemeProvider theme={LPtheme}>
        <Container
          component="main"
          maxWidth="sm"
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <CssBaseline />
          <Box
            style={{
              backgroundColor: LPtheme.palette.background.paper,
              boxShadow: LPtheme.shadows[4],
            }}
            sx={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: LPtheme.palette.background.paper,
              borderRadius: LPtheme.shape.borderRadius * 2,
              padding: "3em",
              height: "auto",
            }}
          >
            <Avatar
              sx={{ m: 1 }}
              style={{ backgroundColor: LPtheme.palette.secondary.main }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontFamily: LPtheme.typography.fontFamily,
                fontWeight: "bold",
              }}
            >
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <FormGrid item xs={12} md={6} className="mt-2">
                <FormLabel htmlFor="username" required>
                  Username
                </FormLabel>
                <TextField
                  id="standard-basic-1"
                  margin="normal"
                  required
                  fullWidth
                  name="username"
                  autoFocus
                  value={emailUsername}
                  onChange={(e) => {
                    setEmailUsername(e.target.value);
                  }}
                  InputProps={{
                    style: {
                      fontFamily: LPtheme.typography.fontFamily,
                      fontWeight: "bold",
                      color: LPtheme.palette.text.primary,
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
              </FormGrid>
              <FormGrid item xs={12} md={6} className="mt-2">
                <FormLabel htmlFor="password" required>
                  Password
                </FormLabel>
                <TextField
                  id="standard-basic-2"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  type="password"
                  onChange={handlePasswordofLogin}
                  value={password}
                  InputProps={{
                    style: {
                      fontFamily: LPtheme.typography.fontFamily,
                      fontWeight: "bold",
                    },
                  }}
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
                      ? "The password must contain at least 8 digits."
                      : "")
                  }
                  autoComplete="off"
                />
              </FormGrid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{
                  fontFamily: LPtheme.typography.fontFamily,
                  fontWeight: "bold",
                  backgroundColor: LPtheme.palette.primary.main,
                }}
              >
                {!loading ? "Sign In" : "Signing In...."}
              </Button>
              <Grid container>
                <Grid item xs={12}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      navigate("/register");
                    }}
                    variant="text"
                    style={{
                      fontFamily: LPtheme.typography.fontFamily,
                      fontWeight: "bold",
                      color: LPtheme.palette.text.secondary,
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
