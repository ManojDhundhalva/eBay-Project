import "./App.css";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
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
        {!isHiddenPath && (
          <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        )}
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/aboutus" element={<AboutUS />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/account" element={<Account />} />
          <Route exact path="/list-product" element={<ListProduct />} />
          <Route exact path="/product-details" element={<ProductDetails />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/wish-list" element={<WishList />} />
          <Route exact path="/order" element={<Order />} />
          <Route exact path="/order-details" element={<OrderDetails />} />
          <Route exact path="/category" element={<Category />} />
        </Routes>
      </ThemeProvider>
      {/* {!isHiddenPath && <Footer />} */}
    </>
  );
}

export default App;
