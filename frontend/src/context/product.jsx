import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getAccordionSummaryUtilityClass } from "@mui/material";

const productContext = createContext();

export const ProductProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const [cartList, setCartList] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [orderedProductIds, setOrderedProductIds] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoriesSort, setCategoriesSort] = useState("Most Watched");
  const [sellerId, setSellerId] = useState("");

  const [selectedCategoryHome, setSelectedCategoryHome] = useState("");

  const { LogOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const getAllCategories = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/category?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setCategories(results.data);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  const getCountOfOrders = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/order/count-of-orders?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setNumberOfOrders(results.data.orders);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  const getOrderedProductIds = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/order/ordered-product-ids?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setOrderedProductIds(results.data.product_ids);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  const getCart = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/cart?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      console.log("cartList", results.data);
      setCartList(results.data);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };
  const addToCart = async (product_id) => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      await toast.promise(
        axios.post(
          (process.env.REACT_APP_BACKEND_API ||
            "http://localhost:8000/api/v1") +
            `/cart?username=${window.localStorage.getItem(
              "username"
            )}&role=${window.localStorage.getItem("role")}`,
          { product_id },
          {
            headers,
          }
        ),
        {
          loading: "Adding to cart...", // Message shown during loading
          success: <b>Product added to cart successfully!</b>, // Success message
          error: <b>Failed to add product to cart.</b>, // Error message
        }
      );
      getCart(); // Call getCart function after successfully adding to cart
    } catch (err) {
      // LogOut();
      console.error("Error adding product to cart:", err);
    }
  };

  const deleteFromCart = async (product_id) => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      await toast.promise(
        axios.delete(
          (process.env.REACT_APP_BACKEND_API ||
            "http://localhost:8000/api/v1") +
            `/cart?username=${window.localStorage.getItem(
              "username"
            )}&role=${window.localStorage.getItem(
              "role"
            )}&product_id=${product_id}`,
          {
            headers,
          }
        ),
        {
          loading: "Removing from cart...", // Message shown during loading
          success: <b>Product removed from cart successfully!</b>, // Success message
          error: <b>Failed to remove product from cart.</b>, // Error message
        }
      );
      getCart();
    } catch (err) {
      // LogOut();
      console.log("Error deleting product from cart:", err);
    }
  };

  const addToWishList = async (product_id) => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      await toast.promise(
        axios.post(
          (process.env.REACT_APP_BACKEND_API ||
            "http://localhost:8000/api/v1") +
            `/wish-list?username=${window.localStorage.getItem(
              "username"
            )}&role=${window.localStorage.getItem("role")}`,
          { product_id },
          {
            headers,
          }
        ),
        {
          loading: "Adding to wishlist...", // Message shown during loading
          success: <b>Product added to wishlist successfully!</b>, // Success message
          error: <b>Failed to add product to wishlist.</b>, // Error message
        }
      );
      getWishList();
    } catch (err) {
      // LogOut();
      console.error("Error adding product to wishlist:", err);
    }
  };

  const getWishList = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/wish-list?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setWishList(results.data);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  const deleteFromWishList = async (product_id) => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      await toast.promise(
        axios.delete(
          (process.env.REACT_APP_BACKEND_API ||
            "http://localhost:8000/api/v1") +
            `/wish-list?username=${window.localStorage.getItem(
              "username"
            )}&role=${window.localStorage.getItem(
              "role"
            )}&product_id=${product_id}`,
          {
            headers,
          }
        ),
        {
          loading: "Removing from wishlist...", // Message shown during loading
          success: <b>Product removed from wishlist successfully!</b>, // Success message
          error: <b>Failed to remove product from wishlist.</b>, // Error message
        }
      );
      getWishList();
    } catch (err) {
      // LogOut();
      console.error("Error deleting product from wishlist:", err);
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("role") === "user") {
      getAllCategories();
      getCart();
      getWishList();
      getCountOfOrders();
      getOrderedProductIds();
    }
  }, [isLoggedIn]);

  return (
    <productContext.Provider
      value={{
        cartList,
        setCartList,
        addToCart,
        deleteFromCart,
        wishList,
        setWishList,
        addToWishList,
        deleteFromWishList,
        getCountOfOrders,
        numberOfOrders,
        orderedProductIds,
        categories,
        selectedCategoryHome,
        setSelectedCategoryHome,
        categoriesSort,
        setCategoriesSort,
        sellerId,
        setSellerId,
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(productContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
