import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "./ToggleColorMode";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../context/auth";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isLoggedIn, setIsLoggedIn, LogOut } = useAuth();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <img
                src={
                  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg"
                }
                style={logoStyle}
                alt="logo of sitemark"
                onClick={() => {
                  navigate("/");
                }}
              />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <MenuItem
                  onClick={() => {
                    navigate("/");
                  }}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Home
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/list-product");
                  }}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    List Product
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/cart");
                  }}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Cart
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/wish-list");
                  }}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    WishList
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("features")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Features
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("testimonials")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Testimonials
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("highlights")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Highlights
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("pricing")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Pricing
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/account")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Account
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("faq")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    FAQ
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              {window.localStorage.getItem("token") !== null ? (
                <>
                  <Button
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircleIcon
                      fontSize="large"
                      style={{ fontFamily: "Quicksand" }}
                    />
                  </Button>
                  <Menu
                    style={{ fontFamily: "Quicksand" }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={handleClose}
                      style={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                    >
                      <Link className="nav-link" to="/profile">
                        Profile
                      </Link>
                    </MenuItem>
                    <MenuItem
                      style={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                      onClick={() => {
                        handleClose();
                        LogOut();
                        toast.success("Logout successful!");
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    variant="text"
                    size="small"
                    component="a"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    component="a"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode
                      mode={mode}
                      toggleColorMode={toggleColorMode}
                    />
                  </Box>
                  <MenuItem onClick={() => scrollToSection("features")}>
                    Features
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("testimonials")}>
                    Testimonials
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("highlights")}>
                    Highlights
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("pricing")}>
                    Pricing
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("faq")}>
                    FAQ
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      component="a"
                      onClick={() => {
                        navigate("/register");
                      }}
                      sx={{ width: "100%" }}
                    >
                      Sign up
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="a"
                      onClick={() => {
                        navigate("/login");
                      }}
                      sx={{ width: "100%" }}
                    >
                      Sign in
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
