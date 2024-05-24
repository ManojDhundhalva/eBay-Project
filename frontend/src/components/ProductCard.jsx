import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/product";
import axios from "axios";
import { useAuth } from "../context/auth";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Chip from "@mui/material/Chip";

function ProductCard({ product }) {
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
        `http://localhost:8000/api/v1/product/watch-product?username=${window.localStorage.getItem(
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
    <Box
      onClick={() => {
        addWatchCount();
        navigate(`/product-details?id=${product_id}`);
      }}
      sx={{
        cursor: "pointer",
        mt: { xs: 4, sm: 6 },
        alignSelf: "center",
        width: "34vh", // Adjust width for responsiveness
        height: "42vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        backgroundSize: "cover",
        borderRadius: "10px",
        transition: "all 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
        "&:hover img": {
          transform: "scale(1.01)",
        },
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: "10px",
          width: "34vh",
          height: "38vh",
          position: "relative",
          transition: "all 0.2s ease",
        }}
      >
        <img
          src={product_images[0]}
          alt={product_title}
          style={{
            width: "34vh",
            height: "38vh",
            borderRadius: "10px",
            objectFit: "cover",
            position: "relative",
          }}
        />
      </Box>
      {isHovering && (
        <Chip
          label={
            <>
              <RemoveRedEyeOutlinedIcon fontSize="small" />{" "}
              <span style={{ fontWeight: "bold" }}>{product_watch_count}</span>
            </>
          }
          sx={{
            position: "absolute",
            top: "7px",
            right: "7px",
            zIndex: 1,
            backgroundColor: "white",
            transition: "all 0.10s",
          }}
        />
      )}
      {isHovering && (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "10px",
            position: "absolute",
            paddingX: "5px",
            paddingY: "9px",
            top: "13vh",
            right: "7px",
            transition: "all 0.2s ease", // Add transition for smooth sliding effect
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            sx={{
              color: isAddedToWishList ? "red" : "black",
              backgroundColor: "white",
              borderRadius: "50%",
              "&:hover": {
                color: isAddedToWishList ? "red" : "black",
              },
            }}
            onClick={(event) => {
              event.stopPropagation();
              handleFavoriteToggle();
            }}
          >
            {isAddedToWishList ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton
            sx={{
              color: isAddedToCartList ? "#023e8a" : "black",
              backgroundColor: "white",
              borderRadius: "50%",
              "&:hover": {
                color: isAddedToCartList ? "#023e8a" : "black",
              },
            }}
            onClick={(event) => {
              event.stopPropagation();
              handleCartToggle();
            }}
          >
            {isAddedToCartList ? (
              <ShoppingCartIcon />
            ) : (
              <ShoppingCartOutlinedIcon />
            )}
          </IconButton>
        </Box>
      )}
      <Box
        p={2}
        flexGrow={1}
        bgcolor="background.paper"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom noWrap>
            {product_title}
          </Typography>
          <Typography variant="body1" gutterBottom fontWeight="bold">
            ₹{product_price}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
          <Rating
            name="product-rating"
            value={parseFloat(product_avg_rating)}
            precision={0.1} // Set precision to 0.1 to allow fractional part
            readOnly
            emptyIcon={<StarBorderRoundedIcon />}
            icon={<StarRateRoundedIcon />}
            style={{
              "& .MuiSvgIcon-root": {
                borderRadius: "50%", // This will make only the star icons rounded
              },
            }}
          />
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            &nbsp; &nbsp;
            {parseFloat(product_avg_rating)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;
