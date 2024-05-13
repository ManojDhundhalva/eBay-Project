import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AboutUS from "../pages/AboutUs";
import { useAuth } from "../context/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "../getLPTheme";
import CssBaseline from "@mui/material/CssBaseline";
import ShipperHomePage from "./ShipperHomePage";

function AppM() {
  const { mode, setMode, toggleColorMode } = useAuth();
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const location = useLocation();
  const hiddenPaths = ["/login", "/register"];
  const isHiddenPath = hiddenPaths.includes(location.pathname);

  return (
    <>
      {/* {!isHiddenPath && <Navbar />} */}
      <ThemeProvider theme={LPtheme}>
        <CssBaseline />

        <Routes>
          <Route exact path="/" element={<ShipperHomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/aboutus" element={<AboutUS />} />
        </Routes>
      </ThemeProvider>
      {/* {!isHiddenPath && <Footer />} */}
    </>
  );
}

export default AppM;
