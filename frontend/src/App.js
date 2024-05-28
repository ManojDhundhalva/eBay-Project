import "./App.css";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUS from "./pages/AboutUs";
import Profile from "./pages/Profile";
import LandingPage from "./LandingPage";
import Account from "./pages/Account";
import AppAppBar from "./components/AppAppBar";
import { useAuth } from "./context/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "./getLPTheme";
import CssBaseline from "@mui/material/CssBaseline";
import ListProduct from "./pages/ListProduct";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import WishList from "./pages/WishList";
import Order from "./pages/Order";
import OrderDetails from "./pages/OrderDetails";
import Category from "./pages/Category";
import Home from "./manager/Home";
import ShipperHomePage from "./shipper/ShipperHomePage";
import NotFound from "./pages/NotFound";
import Database from "./pages/Database";
import ScrollToTop from "./scrollToTop";

function App() {
  const { mode, setMode, toggleColorMode } = useAuth();
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const location = useLocation();
  const hiddenPaths = ["/login", "/register", "/account"];
  const isHiddenPath = hiddenPaths.includes(location.pathname);

  return (
    <>
      {/* {!isHiddenPath && <Navbar />} */}
      <ThemeProvider theme={LPtheme}>
        <CssBaseline />
        {(window.localStorage.getItem("role") === "user" ||
          window.localStorage.getItem("role") === null) &&
          !isHiddenPath && <Navbar />}
        <ScrollToTop />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          {/* {window.localStorage.getItem("role") === null} */}
          {window.localStorage.getItem("role") === "user" ||
          window.localStorage.getItem("role") === null ? (
            <>
              <Route exact path="/" element={<LandingPage />} />
              <Route exact path="/aboutus" element={<AboutUS />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/account" element={<Account />} />
              <Route exact path="/list-product" element={<ListProduct />} />
              <Route
                exact
                path="/product-details"
                element={<ProductDetails />}
              />
              <Route exact path="/cart" element={<Cart />} />
              <Route exact path="/wish-list" element={<WishList />} />
              <Route exact path="/order" element={<Order />} />
              <Route exact path="/order-details" element={<OrderDetails />} />
              <Route exact path="/category" element={<Category />} />
              <Route exact path="/database" element={<Database />} />
            </>
          ) : window.localStorage.getItem("role") === "manager" ? (
            <Route exact path="/" element={<Home />} />
          ) : (
            <Route exact path="/" element={<ShipperHomePage />} />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {(window.localStorage.getItem("role") === "user" ||
          window.localStorage.getItem("role") === null) &&
          !isHiddenPath && <Footer />}
      </ThemeProvider>
      {/* {!isHiddenPath && <Footer />} */}
    </>
  );
}

export default App;
