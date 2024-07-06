import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Chip, IconButton, Typography, Rating } from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import { useAuth } from "../context/auth";
import { useProduct } from "../context/product";
import axios from "axios";

const ImgUrl = `https://t3.ftcdn.net/jpg/05/15/95/32/360_F_515953296_4OTDJFNzT9YmriBZwR688gsWzLFSyc1u.webp`;

function ProductCard({ product }) {
  axios.defaults.withCredentials = true;

  const {
    wishList,
    addToWishList,
    deleteFromWishList,
    cartList,
    addToCart,
    deleteFromCart,
  } = useProduct();
  const [isAddedToWishList, setIsAddedToWishList] = useState(false);
  const [isAddedToCartList, setIsAddedToCartList] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const {
    product_id,
    product_title,
    product_price,
    product_avg_rating,
    product_images,
    product_watch_count,
  } = product;

  const navigate = useNavigate();
  const { LogOut } = useAuth();

  const checkIsAddedToWishList = () => {
    const found = wishList.some(
      (item) => String(item.product_id) === String(product_id)
    );
    setIsAddedToWishList(found);
  };

  const checkIsAddedToCartList = () => {
    const found = cartList.some(
      (item) => String(item.product_id) === String(product_id)
    );
    setIsAddedToCartList(found);
  };

  const handleFavoriteToggle = () => {
    if (isAddedToWishList) {
      deleteFromWishList(product_id);
    } else {
      addToWishList(product_id);
    }
    setIsAddedToWishList(!isAddedToWishList);
  };

  const handleCartToggle = () => {
    if (isAddedToCartList) {
      deleteFromCart(product_id);
    } else {
      addToCart(product_id);
    }
    setIsAddedToCartList(!isAddedToCartList);
  };

  const addWatchCount = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      await axios.post(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
        `/product/watch-product?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        { product_id },
        { headers }
      );
    } catch (err) {
      LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    checkIsAddedToWishList();
    checkIsAddedToCartList();
  }, []);

  return (
    <>
      <Grid
        margin={0}
        padding={0}
        onClick={() => {
          addWatchCount();
          navigate(`/product-details?id=${product_id}`);
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        sx={{
          userSelect: "none",
          width: 250,
          backgroundColor: "white",
          borderRadius: "14px",
          transition: "all 0.1s ease",
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <Grid
          container
          margin={0}
          padding={0}
          alignItems="center"
          justifyContent="center"
          sx={{ position: "relative" }}
        >
          <img
            src={product_images[0]}
            alt="product_image"
            onError={(e) => {
              e.target.src = ImgUrl;
            }}
            style={{
              width: "100%",
              height: 250,
              display: "inline-block",
              objectFit: "contain",
              backgroundColor: "#F2F2F2",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              cursor: "pointer",
            }}
          />
          {isHovering && (
            <Grid
              padding={0}
              margin={0}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <Chip
                sx={{
                  p: 1,
                  m: 1,
                  fontWeight: "bold",
                  backgroundColor: "white",
                }}
                icon={
                  <RemoveRedEyeOutlinedIcon
                    color="primary"
                    sx={{ color: "#003554" }}
                  />
                }
                label={product_watch_count}
              />
            </Grid>
          )}
          {isHovering && (
            <Grid
              paddingY={1}
              paddingX={0.5}
              margin={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            >
              <Grid padding={0} margin={0}>
                <IconButton
                  sx={{
                    backgroundColor: "white",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleFavoriteToggle();
                  }}
                >
                  {isAddedToWishList ? (
                    <FavoriteIcon sx={{ color: "#FF0000" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: "#FF0000" }} />
                  )}
                </IconButton>
              </Grid>
              <Grid padding={0} margin={0}>
                <IconButton
                  sx={{
                    backgroundColor: "white",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCartToggle();
                  }}
                >
                  {isAddedToCartList ? (
                    <ShoppingCartIcon sx={{ color: "#03045E" }} />
                  ) : (
                    <ShoppingCartOutlinedIcon sx={{ color: "#03045E" }} />
                  )}
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid margin={0} paddingX={2}>
          <Grid
            container
            margin={0}
            paddingTop={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontSize={17}
              fontWeight="bold"
              sx={{
                width: 250,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product_title}
            </Typography>
          </Grid>
          <Grid container margin={0} padding={0} alignItems="center">
            <Rating
              name="product-rating"
              value={Number(product_avg_rating)}
              precision={0.1}
              readOnly
              emptyIcon={<StarRoundedIcon />}
              icon={<StarRoundedIcon />}
            />
            <Typography sx={{ px: 1 }} fontWeight="bold">
              {product_avg_rating}
            </Typography>
          </Grid>
          <Grid container margin={0} paddingY={1} alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              ₹{product_price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ProductCard;
