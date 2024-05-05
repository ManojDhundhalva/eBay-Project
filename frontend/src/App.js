import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUS from "./pages/AboutUs";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  const hiddenPaths = ["/login", "/register"];
  const isHiddenPath = hiddenPaths.includes(location.pathname);

  return (
    <>
      {!isHiddenPath && <Navbar />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/aboutus" element={<AboutUS />} />
        <Route exact path="/profile" element={<Profile />} />
        {/* <Route exact path="/cart" element={<Cart />} />  */}
      </Routes>
      {!isHiddenPath && <Footer />}
    </>
  );
}

export default App;
