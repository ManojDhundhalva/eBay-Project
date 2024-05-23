import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [mode, setMode] = React.useState("light");

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const LogOut = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  const validateUser = () => {
    if (
      isLoggedIn &&
      !(
        window.localStorage.getItem("token") !== null &&
        window.localStorage.getItem("username") !== null &&
        window.localStorage.getItem("role") !== null
      )
    ) {
      LogOut();
    }
  };

  useEffect(() => {
    setIsLoggedIn(window.localStorage.getItem("token") !== null);
  }, []);

  return (
    <authContext.Provider
      value={{
        mode,
        setMode,
        toggleColorMode,
        isLoggedIn,
        setIsLoggedIn,
        LogOut,
        validateUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
