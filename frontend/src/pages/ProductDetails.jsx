import React, { useEffect, useState } from "react";
import { useProduct } from "../context/product";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { Grid } from "@mui/material";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { useAuth } from "../context/auth";
import { Carousel } from "react-bootstrap";
import CardContent from "@mui/material/CardContent";
import ProductRatingGraph from "../components/ProductRatingDetails";
import StarIcon from "@mui/icons-material/Star";
import { toast } from "react-hot-toast";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TextField from "@mui/material/TextField";
// import SimpleImageSlider from "react-simple-image-slider";
import { styled } from "@mui/system";
import DisplayImages from "../components/DisplayImages";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const labels = {
  1: "Useless",
  2: "Poor",
  3: "Ok",
  4: "Good",
  5: "Excellent",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

function ProductDetails() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddedToWishList, setIsAddedToWishList] = useState(false);
  const [value, setValue] = useState(1);
  const [hover, setHover] = useState(-1);
  const [isInOrderedProductIds, setIsInOrderedProductIds] = useState(false);
  const [productComment, setProductComment] = useState("");

  const {
    cartList,
    addToCart,
    deleteFromCart,
    wishList,
    addToWishList,
    deleteFromWishList,
    orderedProductIds,
  } = useProduct();
  const { LogOut } = useAuth();

  useEffect(() => {
    const productId = window.localStorage.getItem("product-id");
    if (!productId) {
      navigate(-1);
    } else {
      setIsInOrderedProductIds(orderedProductIds.includes(productId));
      getProductDetails();
      checkIsAddedToCart();
      checkIsAddedToWishList();
    }
  }, []);

  const getProductDetails = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/product/product-details?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem(
          "role"
        )}&productId=${window.localStorage.getItem("product-id")}`,
        { headers }
      );
      setValue(data.your_rating !== null ? data.your_rating : value);
      setProductComment(data.your_comment);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      // LogOut();
    }
  };

  const checkIsAddedToCart = () => {
    setIsAddedToCart(
      cartList.some(
        (item) =>
          String(item.product_id) ===
          String(window.localStorage.getItem("product-id"))
      )
    );
  };

  const checkIsAddedToWishList = () => {
    setIsAddedToWishList(
      wishList.some(
        (item) =>
          String(item.product_id) ===
          String(window.localStorage.getItem("product-id"))
      )
    );
  };

  const formatTimestamp = (timestamp) => {
    const currentTime = new Date();
    const productTime = new Date(timestamp);
    const timeDifference = currentTime - productTime;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    let formattedTimestamp = "";
    if (days > 0) {
      formattedTimestamp += `${days} days `;
    }
    if (hours > 0) {
      formattedTimestamp += `${hours} hr`;
    }

    return formattedTimestamp ? `${formattedTimestamp} ago` : "Just now";
  };

  const rateTheOrderedProduct = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const { status } = await axios.post(
        `http://localhost:8000/api/v1/product/rate-product?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          product_review_rating: value,
          product_id: window.localStorage.getItem("product-id"),
        },
        { headers }
      );
      if (status === 200) {
        toast.success("Rated Successfully!");
      } else {
        toast.error("Error, NOT Rated");
      }
    } catch (error) {
      console.error("Error rating the product:", error);
      // LogOut();
    }
  };

  const makeCommentOnProduct = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const { status } = await axios.post(
        `http://localhost:8000/api/v1/product/comment-on-product?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          product_comment: productComment,
          product_id: window.localStorage.getItem("product-id"),
        },
        { headers }
      );
      if (status === 200) {
        toast.success("Commented Successfully!");
      } else {
        toast.error("Error, NOT Commented");
      }
    } catch (error) {
      console.error("Error commenting on the product:", error);
      // LogOut();
    }
  };

  return (
    <>
      <Grid container className="mt-5">
        <Grid
          xs={12}
          sm={12}
          md={7}
          lg={7}
          xl={7}
          className="mt-4"
          // style={{ backgroundColor: "lightgreen" }}
        >
          {product.product_images && (
            <DisplayImages images={product.product_images} />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          style={{ backgroundColor: "ghostwhite" }}
          className="mt-4"
        >
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h2" fontWeight="bold">
              Product Details
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Product ID: {window.localStorage.getItem("product-id")}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Product Price: {product.product_price}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Product Title: {product.product_title}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Product Available Quantity: {product.product_available_quantity}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Product Average Rating: {product.product_avg_rating}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Product Watch Count: {product.product_watch_count}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Category: {product.product_category_name}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Sub Category: {product.product_sub_category_name}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Sub Sub Category: {product.product_sub_sub_category_name}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              Product Timestamp:{" "}
              {new Date(product.product_timestamp).toLocaleDateString()}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              Product Timestamp: {formatTimestamp(product.product_timestamp)}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              seller_city
              {product.seller_city}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              seller_state
              {product.seller_state}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              seller_country
              {product.seller_country}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            <Typography variant="h5" fontWeight="bold">
              seller_pincode
              {product.seller_pincode}
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: "1em" }}>
            {product.product_available_quantity ? (
              !isAddedToCart ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    addToCart(window.localStorage.getItem("product-id"));
                    setIsAddedToCart(true);
                  }}
                >
                  <ShoppingCartIcon /> Add To Cart
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    deleteFromCart(window.localStorage.getItem("product-id"));
                    setIsAddedToCart(false);
                  }}
                >
                  <RemoveShoppingCartIcon /> Remove From The Cart
                </Button>
              )
            ) : (
              <></>
            )}
            {!isAddedToWishList ? (
              <Button
                variant="outlined"
                onClick={() => {
                  addToWishList(window.localStorage.getItem("product-id"));
                  setIsAddedToWishList(true);
                }}
              >
                <FavoriteBorderIcon />
                Add To WishList
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  deleteFromWishList(window.localStorage.getItem("product-id"));
                  setIsAddedToWishList(false);
                }}
              >
                <FavoriteIcon sx={{ color: "red" }} />
                ADDED ON WishList
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box
            style={{ backgroundColor: "lightblue" }}
            sx={{
              height: "auto",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Product Description
            </Typography>
            {product.product_description &&
              product.product_description.map((item, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <Typography key={index} variant="h6" fontWeight="bold">
                    {item.key}
                  </Typography>
                  <Typography>{item.value}</Typography>
                </div>
              ))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box
            style={{ backgroundColor: "lightblue" }}
            sx={{
              height: "auto",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            {product?.ratings?.total_user_response ? (
              <ProductRatingGraph productRatings={product.ratings} />
            ) : (
              <></>
            )}
          </Box>
        </Grid>
        {isInOrderedProductIds ? (
          <>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Box
                style={{ backgroundColor: "lightblue" }}
                sx={{
                  height: "auto",
                  width: "100%",
                  borderRadius: "10px",
                }}
              >
                <h3>Rate This Product</h3>
                <Box
                  sx={{
                    width: 200,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Rating
                    name="hover-feedback"
                    value={value}
                    precision={1}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  {value !== null && (
                    <Box sx={{ ml: 2 }}>
                      {labels[hover !== -1 ? hover : value]}
                    </Box>
                  )}
                </Box>
                <Button onClick={rateTheOrderedProduct} variant="contained">
                  Submit Rating
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Box
                style={{ backgroundColor: "lightblue" }}
                sx={{
                  height: "auto",
                  width: "100%",
                  borderRadius: "10px",
                }}
              >
                <h3>ADD Comment</h3>
                <FormGrid item xs={12}>
                  <TextField
                    value={productComment}
                    id="outlined-basic"
                    variant="outlined"
                    multiline
                    maxRows={4}
                    fullWidth
                    onChange={(e) => {
                      setProductComment(e.target.value);
                    }}
                  />
                </FormGrid>
                <Button onClick={makeCommentOnProduct} variant="contained">
                  Submit Comment
                </Button>
              </Box>
            </Grid>
          </>
        ) : (
          <></>
        )}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box
            style={{ backgroundColor: "lightblue" }}
            sx={{
              height: "auto",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            <h3>Comment</h3>
            {product.product_commnet &&
              product.product_commnet.map((item, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <Typography key={index} variant="h6" fontWeight="bold">
                    {item.comment === product.your_comment
                      ? "YOU"
                      : item.username}
                  </Typography>
                  <Typography>{item.comment}</Typography>
                </div>
              ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ProductDetails;
