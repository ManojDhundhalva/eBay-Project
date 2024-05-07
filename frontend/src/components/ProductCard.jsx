import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/product";

function ProductCard({ product }) {
  const {
    product_id,
    product_title,
    product_price,
    product_avg_rating,
    product_images,
  } = product;

  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { setProductId } = useProduct();

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  // Convert product_avg_rating to a number
  const avgRating = parseFloat(product_avg_rating);

  return (
    <Box
      onClick={() => {
        window.localStorage.setItem("product-id", product_id);
        navigate("/product-details");
      }}
      id="image"
      sx={(theme) => ({
        mt: { xs: 4, sm: 6 },
        alignSelf: "center",
        height: { xs: 300, sm: 500 },
        width: "100%",
        position: "relative", // Set position to relative
        backgroundSize: "cover",
        borderRadius: "10px",
        outline: "1px solid",
        outlineColor:
          theme.palette.mode === "light"
            ? alpha("#BFCCD9", 0.5)
            : alpha("#9CCCFC", 0.1),
        boxShadow:
          theme.palette.mode === "light"
            ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
            : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
      })}
    >
      <Box
        position="relative"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <img
          src={product_images[0]}
          alt={product_title}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />
        {/* Heart button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1, // Ensure it's above the image
            color: isFavorite ? "red" : "inherit", // Change color if favorite
            backgroundColor: "white", // Make background transparent
            borderRadius: "50%", // Make it circular
          }}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Box
          p={2}
          flexGrow={1}
          bgcolor="background.paper"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom noWrap>
              {product_title}
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              ₹{product_price}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <Rating
              name="product-rating"
              value={avgRating} // Use avgRating instead of product_avg_rating
              precision={0.1}
              readOnly
            />
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              &nbsp; &nbsp;
              {avgRating}
            </Typography>
          </Box>
          {/* Add more content or features */}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;
