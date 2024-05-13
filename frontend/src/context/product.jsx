import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import axios from "axios";
import { toast } from "react-hot-toast";

const productContext = createContext();

export const ProductProvider = ({ children }) => {
  const [cartList, setCartList] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [isAddedBankAccount, setIsAddedBankAccount] = useState(false);

  const { LogOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const checkBankAccount = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/bank-details/account-exist?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setIsAddedBankAccount(results.data.isAccount);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  const getOrderList = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/order?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      console.log(results.data);
      setOrderList(results.data);
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
        `http://localhost:8000/api/v1/cart?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
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
          `http://localhost:8000/api/v1/cart?username=${window.localStorage.getItem(
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
          `http://localhost:8000/api/v1/cart?username=${window.localStorage.getItem(
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
          `http://localhost:8000/api/v1/wish-list?username=${window.localStorage.getItem(
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
        `http://localhost:8000/api/v1/wish-list?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      console.log(results.data);
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
          `http://localhost:8000/api/v1/wish-list?username=${window.localStorage.getItem(
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
      checkBankAccount();
      getCart();
      getWishList();
      getOrderList();
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
        isAddedBankAccount,
        setIsAddedBankAccount,
        getOrderList,
        orderList,
        setOrderList,
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
