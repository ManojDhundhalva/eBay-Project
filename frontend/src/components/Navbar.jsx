import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import '../CSS/Navbar.css';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { toast } from "react-hot-toast";
import Badge from "@mui/material/Badge";
import { useProduct } from "../context/product";

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isLoggedIn, setIsLoggedIn, LogOut } = useAuth();
  const navigate = useNavigate();
  const { cartList, wishList, orderList } = useProduct();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navbarStyle = {
    position: "sticky",
    top: "0%",
    zIndex: 100,
    backdropFilter: "blur(10px)",
    margin: 0,
    overflowY: "hidden",
    zIndex: 4,
  };

  useEffect(() => {
    console.log("cartList", cartList.length);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg p-2" style={navbarStyle}>
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "xx-large",
            fontFamily: "Quicksand",
          }}
        >
          <LocalMallIcon /> eBay
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/"
                style={{
                  fontFamily: "Quicksand",
                  transition: "all 0.5s ease",
                  fontWeight: "bold",
                }}
              >
                Home
              </Link>
            </Button>
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/dashboard"
                style={{
                  fontFamily: "Quicksand",
                  transition: "all 0.5s ease",
                  fontWeight: "bold",
                }}
              >
                Dashboard
              </Link>
            </Button>
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/list-product"
                style={{
                  fontFamily: "Quicksand",
                  transition: "all 0.5s ease",
                  fontWeight: "bold",
                }}
              >
                List Product
              </Link>
            </Button>
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/order"
                style={{
                  fontFamily: "Quicksand",
                  transition: "all 0.5s ease",
                  fontWeight: "bold",
                }}
              >
                <Badge
                  color="secondary"
                  badgeContent={orderList.length}
                  max={999}
                >
                  Order
                </Badge>
              </Link>
            </Button>
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/wish-list"
                style={{
                  fontFamily: "Quicksand",
                  transition: "all 0.5s ease",
                  fontWeight: "bold",
                }}
              >
                <Badge
                  color="secondary"
                  badgeContent={wishList.length}
                  max={999}
                >
                  WishList
                </Badge>
              </Link>
            </Button>
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/category"
                style={{
                  fontFamily: "Quicksand",
                  transition: "all 0.5s ease",
                  fontWeight: "bold",
                }}
              >
                Category
              </Link>
            </Button>
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/database"
                style={{ fontFamily: "Quicksand", fontWeight: "bold" }}
              >
                Database
              </Link>
            </Button>
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/aboutus"
                style={{ fontFamily: "Quicksand", fontWeight: "bold" }}
              >
                AboutUS
              </Link>
            </Button>
            <Button
              disableRipple
              variant="text"
              style={{ transition: "all 0.5s ease" }}
              sx={{
                "&:hover": {
                  borderBottom: "1px solid #03045e",
                  borderRadius: "5px",
                },
              }}
            >
              <Link
                className="nav-link active"
                to="/cart"
                style={{ fontFamily: "Quicksand" }}
              >
                <Badge
                  color="secondary"
                  badgeContent={cartList.length}
                  max={999}
                >
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </Link>
            </Button>
            {isLoggedIn ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircleOutlinedIcon
                    fontSize="large"
                    style={{ fontFamily: "Quicksand" }}
                  />
                </IconButton>
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
                    <Link className="nav-link" to="/dashboard">
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
                  disableRipple
                  variant="outlined"
                  style={{ transition: "all 0.5s ease" }}
                  sx={{
                    "&:hover": {
                      borderBottom: "1px solid #03045e",
                      borderRadius: "5px",
                    },
                  }}
                >
                  <Link
                    className="nav-link"
                    to="/login"
                    style={{ fontFamily: "Quicksand" }}
                  >
                    LogIn
                  </Link>
                </Button>
                <Button
                  disableRipple
                  variant="outlined"
                  style={{ transition: "all 0.5s ease" }}
                  sx={{
                    "&:hover": {
                      borderBottom: "1px solid #03045e",
                      borderRadius: "5px",
                    },
                  }}
                >
                  <Link
                    className="nav-link"
                    to="/register"
                    style={{ fontFamily: "Quicksand" }}
                  >
                    SignUP
                  </Link>
                </Button>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
