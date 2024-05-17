import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Divider from "@mui/material/Divider";

function AppAppBar() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundColor: "white",
        }}
      >
        <Container
          maxWidth="xl"
          style={{
            backdropFilter: "blur(10px)",
          }}
        >
          <Toolbar sx={{ borderRadius: "10px" }}>
            <Box
              sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box style={{ color: "black" }}>
                <LocalMallIcon fontSize="large" /> Shopping
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <MenuItem
                  onClick={() => navigate("/")}
                  sx={{
                    py: "6px",
                    px: "12px",
                    "&:hover": {
                      "& .MuiTypography-root": {
                        fontWeight: "bold",
                        transition: "font-weight 0.2s ease",
                      },
                    },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    Home
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/list-product");
                  }}
                  sx={{
                    py: "6px",
                    px: "12px",
                    "&:hover": {
                      "& .MuiTypography-root": {
                        fontWeight: "bold",
                        transition: "font-weight 0.2s ease",
                      },
                    },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    List Product
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/cart");
                  }}
                  sx={{
                    py: "6px",
                    px: "12px",
                    "&:hover": {
                      "& .MuiTypography-root": {
                        fontWeight: "bold",
                        transition: "font-weight 0.2s ease",
                      },
                    },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    Cart
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/order");
                  }}
                  sx={{
                    py: "6px",
                    px: "12px",
                    "&:hover": {
                      "& .MuiTypography-root": {
                        fontWeight: "bold",
                        transition: "font-weight 0.2s ease",
                      },
                    },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    Order
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/wish-list");
                  }}
                  sx={{
                    py: "6px",
                    px: "12px",
                    "&:hover": {
                      "& .MuiTypography-root": {
                        fontWeight: "bold",
                        transition: "font-weight 0.2s ease",
                      },
                    },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    WishList
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/category");
                  }}
                  sx={{
                    py: "6px",
                    px: "12px",
                    "&:hover": {
                      "& .MuiTypography-root": {
                        fontWeight: "bold",
                        transition: "font-weight 0.2s ease",
                      },
                    },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    Category
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/account")}
                  sx={{
                    py: "6px",
                    px: "12px",
                    "&:hover": {
                      "& .MuiTypography-root": {
                        fontWeight: "bold",
                        transition: "font-weight 0.2s ease",
                      },
                    },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    Account
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
              {isLoggedIn ? (
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
                    component={Link}
                    to="/login"
                  >
                    Sign in
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    component={Link}
                    to="/register"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
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
                  <MenuItem
                    onClick={() => {
                      navigate("/");
                    }}
                    sx={{
                      py: "6px",
                      px: "12px",
                      "&:hover": {
                        "& .MuiTypography-root": {
                          fontWeight: "bold",
                          transition: "font-weight 0.2s ease",
                        },
                      },
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Home
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/list-product");
                    }}
                    sx={{
                      py: "6px",
                      px: "12px",
                      "&:hover": {
                        "& .MuiTypography-root": {
                          fontWeight: "bold",
                          transition: "font-weight 0.2s ease",
                        },
                      },
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      List Product
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/cart");
                    }}
                    sx={{
                      py: "6px",
                      px: "12px",
                      "&:hover": {
                        "& .MuiTypography-root": {
                          fontWeight: "bold",
                          transition: "font-weight 0.2s ease",
                        },
                      },
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Cart
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/order");
                    }}
                    sx={{
                      py: "6px",
                      px: "12px",
                      "&:hover": {
                        "& .MuiTypography-root": {
                          fontWeight: "bold",
                          transition: "font-weight 0.2s ease",
                        },
                      },
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Order
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/wish-list");
                    }}
                    sx={{
                      py: "6px",
                      px: "12px",
                      "&:hover": {
                        "& .MuiTypography-root": {
                          fontWeight: "bold",
                          transition: "font-weight 0.2s ease",
                        },
                      },
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      WishList
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/category");
                    }}
                    sx={{
                      py: "6px",
                      px: "12px",
                      "&:hover": {
                        "& .MuiTypography-root": {
                          fontWeight: "bold",
                          transition: "font-weight 0.2s ease",
                        },
                      },
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Category
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => navigate("/account")}
                    sx={{
                      py: "6px",
                      px: "12px",
                      "&:hover": {
                        "& .MuiTypography-root": {
                          fontWeight: "bold",
                          transition: "font-weight 0.2s ease",
                        },
                      },
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Account
                    </Typography>
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
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

export default AppAppBar;
