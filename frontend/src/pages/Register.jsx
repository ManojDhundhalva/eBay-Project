import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Select, MenuItem } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
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
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();
  const { mode, validateUser } = useAuth();
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
    validateUser();
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
              marginBottom: 12,
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
              Create A New Account
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <FormGrid item xs={12} md={6} className="mt-2">
                <FormLabel htmlFor="Firstname" required>
                  Firstname
                </FormLabel>
                <TextField
                  className="mt-2"
                  id="standard-basic-1"
                  required
                  fullWidth
                  name="firstname"
                  autoFocus
                  onChange={(e) => {
                    SetFirstname(e.target.value);
                  }}
                  value={firstname}
                  InputProps={{
                    style: {
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                    },
                  }}
                  error={
                    justVerify && (firstname === "" || firstname.length >= 255)
                  }
                  helperText={
                    justVerify &&
                    (firstname === "" ? "This field cannot be empty." : "")
                  }
                  autoComplete="off"
                />
              </FormGrid>
              <FormGrid item xs={12} md={6} className="mt-3">
                <FormLabel htmlFor="lastname" required>
                  Lastname
                </FormLabel>
                <TextField
                  className="mt-1"
                  id="standard-basic-1"
                  required
                  fullWidth
                  name="lastname"
                  autoFocus
                  onChange={(e) => {
                    SetLastname(e.target.value);
                  }}
                  value={lastname}
                  InputProps={{
                    style: {
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                    },
                  }}
                  error={
                    justVerify && (lastname === "" || lastname.length >= 255)
                  }
                  helperText={
                    justVerify &&
                    (lastname === "" ? "This field cannot be empty." : "")
                  }
                  autoComplete="off"
                />
              </FormGrid>
              <FormGrid item xs={12} md={6} className="mt-3">
                <FormLabel htmlFor="username" required>
                  Username
                </FormLabel>
                <TextField
                  className="mt-1"
                  id="standard-basic-1"
                  required
                  fullWidth
                  name="username"
                  autoFocus
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  value={username}
                  InputProps={{
                    style: {
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                    },
                  }}
                  error={
                    justVerify && (username === "" || username.length >= 255)
                  }
                  helperText={
                    justVerify &&
                    (username === "" ? "This field cannot be empty." : "")
                  }
                  autoComplete="off"
                />
              </FormGrid>
              <FormGrid item xs={12} md={6} className="mt-3">
                <FormLabel htmlFor="email" required>
                  Email Address
                </FormLabel>
                <TextField
                  className="mt-1"
                  id="standard-basic-3"
                  required
                  fullWidth
                  name="email"
                  autoFocus
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  InputProps={{
                    style: {
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                    },
                  }}
                  error={justVerify && (email === "" || email.length >= 255)}
                  helperText={
                    justVerify &&
                    (email === "" ? "This field cannot be empty." : "")
                  }
                  autoComplete="off"
                />
              </FormGrid>
              <FormGrid item xs={12} md={6} className="mt-3">
                <FormLabel htmlFor="password" required>
                  Password
                </FormLabel>
                <TextField
                  className="mt-1"
                  id="standard-basic-4"
                  required
                  fullWidth
                  name="password"
                  type="password"
                  onChange={handlePasswordofLogin}
                  value={password}
                  InputProps={{
                    style: {
                      fontFamily: "Quicksand",
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
              <FormGrid item xs={12} md={6} className="mt-3">
                <FormLabel htmlFor="role" required>
                  Role
                </FormLabel>
                <Select
                  className="mt-1"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                  style={{ fontWeight: "bold", fontFamily: "Quicksand" }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  fullWidth
                  error={justVerify && role === ""}
                >
                  <MenuItem
                    style={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                    value="user"
                  >
                    User
                  </MenuItem>
                  {/* <MenuItem
                    style={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                    value="manager"
                  >
                    Manager
                  </MenuItem>
                  <MenuItem
                    style={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                    value="shipper"
                  >
                    Shipper
                  </MenuItem> */}
                </Select>
              </FormGrid>
              <FormGrid item xs={12} md={6} className="mt-3">
                <FormLabel htmlFor="phoneNumber" required>
                  Phone Number
                </FormLabel>
                <TextField
                  className="mt-1"
                  id="standard-basic-2"
                  required
                  fullWidth
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
              </FormGrid>
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
                {!loading ? "Sign Up" : "Signing Up...."}
              </Button>
              <Grid container>
                <Grid item xs={12}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      navigate("/login");
                    }}
                    variant="text"
                    style={{
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                      color: "#03045e",
                      textDecoration: "underline",
                    }}
                  >
                    Already have an account? Sign In
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
