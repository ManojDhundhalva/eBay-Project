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
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Chip from "@mui/material/Chip";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Stack from "@mui/material/Stack";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CircleIcon from "@mui/icons-material/Circle";

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Grid container className="mt-5" padding={0}>
        <Grid xs={12} sm={12} md={7} lg={7} xl={7}>
          {product.product_images && (
            <DisplayImages images={product.product_images} />
          )}
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          marginTop={4}
          padding={0}
          paddingBottom={2}
          paddingRight={4}
        >
          <Grid
            paddingLeft={5}
            paddingTop={2}
            marginLeft={{ xs: 2, sm: 2, md: 0, xl: 0, lg: 0 }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "ghostwhite",
              borderRadius: "16px",
            }}
          >
            <Grid container paddingRight={4} style={{ marginTop: "1em" }}>
              <Grid item xs={8}>
                <h3
                  style={{
                    fontWeight: "bold",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    width: "12em",
                    textTransform: "uppercase",
                  }}
                >
                  {product.product_title}
                </h3>
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  fontWeight: "bold",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                }}
              >
                <Chip
                  style={{
                    backgroundColor: "lightgrey",
                    color: "black",
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  label={
                    <>
                      <RemoveRedEyeOutlinedIcon /> {product.product_watch_count}
                    </>
                  }
                />
                <Typography variant="subtitle2" style={{ fontWeight: "bold" }}>
                  {formatTimestamp(product.product_timestamp)}
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid>ID : {window.localStorage.getItem("product-id")}</Grid> */}
            {/* <Grid>Listed On : {formatDate(product.product_timestamp)}</Grid> */}

            <Grid item style={{ display: "flex" }}>
              <div>
                <Rating
                  name="product-rating"
                  value={parseFloat(product.product_avg_rating)}
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
              </div>
              <div>
                <Typography variant="subtitle2" fontWeight="bold">
                  &nbsp;&nbsp;&nbsp;{parseFloat(product.product_avg_rating)}
                </Typography>
              </div>
            </Grid>
            <Grid
              item
              style={{
                marginTop: "2em",
                marginBottom: "2em",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <Typography variant="h2" style={{ fontWeight: "bold" }}>
                <span style={{ fontWeight: 500 }}>&#8377;</span>
                {String(product.product_price).split(".")[0]}
              </Typography>
              <Typography variant="subtitle1" style={{ marginLeft: "0.1em" }}>
                . {String(product.product_price).split(".")[1]}
              </Typography>
            </Grid>
            <Grid item style={{ marginTop: "1em" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Quantity :{" "}
                <Chip
                  label={
                    product.product_available_quantity
                      ? product.product_available_quantity
                      : "Sold Out"
                  }
                  variant="outlined"
                  color={
                    product.product_available_quantity ? "primary" : "error"
                  }
                />
              </Typography>
            </Grid>
            <Grid
              marginRight={5}
              padding={2}
              style={{
                backgroundColor: "#e9ecef",
                borderRadius: "16px",
                marginTop: "1em",
              }}
            >
              <Grid>
                <Typography variant="h5" fontWeight="bold">
                  Category
                </Typography>
              </Grid>
              <Grid style={{ marginTop: "0.5em" }}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    separator={<NavigateNextIcon fontSize="small" />}
                    to="/"
                    style={{
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    {product.product_category_name}
                  </Link>
                  <Link
                    separator={<NavigateNextIcon fontSize="small" />}
                    to="/"
                    style={{ color: "black", cursor: "pointer" }}
                  >
                    {product.product_sub_category_name}
                  </Link>
                  <Link
                    separator={<NavigateNextIcon fontSize="small" />}
                    to="/"
                    style={{ color: "black", cursor: "pointer" }}
                  >
                    {product.product_sub_sub_category_name}
                  </Link>
                </Breadcrumbs>
              </Grid>
            </Grid>
            <Grid
              marginRight={5}
              padding={2}
              style={{
                backgroundColor: "#e9ecef",
                borderRadius: "16px",
                marginTop: "1em",
              }}
            >
              <Grid item>
                <Typography variant="h5" fontWeight="bold">
                  Shipping
                </Typography>
              </Grid>
              <Grid container item>
                <Typography variant="subtitle2">
                  {product.seller_city}, {product.seller_state},{" "}
                  {product.seller_country}, {product.seller_pincode}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              marginRight={5}
              paddingBottom={2}
              style={{ marginTop: "1em" }}
            >
              <Stack
                spacing={1}
                direction="row"
                style={{ marginTop: 20, justifyContent: "space-evenly" }}
              >
                <Grid xs={6} style={{ padding: 4 }}>
                  {product.product_available_quantity ? (
                    !isAddedToCart ? (
                      <Button
                        style={{
                          width: "100%",
                          height: "3em",
                          borderRadius: "14px",
                          fontSize: 16,
                          backgroundColor: "#02294F",
                        }}
                        variant="contained"
                        onClick={() => {
                          addToCart(window.localStorage.getItem("product-id"));
                          setIsAddedToCart(true);
                        }}
                      >
                        <ShoppingCartIcon />
                        &nbsp;&nbsp;&nbsp;Add To Cart
                      </Button>
                    ) : (
                      <Button
                        style={{
                          width: "100%",
                          height: "3em",
                          borderRadius: "14px",
                          fontSize: 16,
                          backgroundColor: "#02294F",
                        }}
                        variant="contained"
                        onClick={() => {
                          deleteFromCart(
                            window.localStorage.getItem("product-id")
                          );
                          setIsAddedToCart(false);
                        }}
                      >
                        <RemoveShoppingCartIcon />
                        &nbsp;&nbsp;&nbsp;Remove From The Cart
                      </Button>
                    )
                  ) : (
                    <></>
                  )}
                </Grid>
                <Grid xs={6} style={{ padding: 4 }}>
                  {!isAddedToWishList ? (
                    <Button
                      style={{
                        width: "100%",
                        height: "3em",
                        borderRadius: "14px",
                        fontSize: 16,
                      }}
                      variant="outlined"
                      onClick={() => {
                        addToWishList(
                          window.localStorage.getItem("product-id")
                        );
                        setIsAddedToWishList(true);
                      }}
                    >
                      <FavoriteBorderIcon />
                      &nbsp;&nbsp;&nbsp;Add To WishList
                    </Button>
                  ) : (
                    <Button
                      style={{
                        width: "100%",
                        height: "3em",
                        borderRadius: "14px",
                        fontSize: 16,
                      }}
                      variant="outlined"
                      onClick={() => {
                        deleteFromWishList(
                          window.localStorage.getItem("product-id")
                        );
                        setIsAddedToWishList(false);
                      }}
                    >
                      <FavoriteIcon sx={{ color: "red" }} />
                      &nbsp;&nbsp;&nbsp;ADDED ON WishList
                    </Button>
                  )}
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          margin={4}
          padding={4}
          style={{ backgroundColor: "ghostwhite", borderRadius: "16px" }}
        >
          <Grid xs={12} sm={12} md={12} lg={12} xl={12} marginBottom={2}>
            <Typography variant="h4" fontWeight="bold">
              Product Description
            </Typography>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
            {product.product_description &&
              product.product_description.map((item, index) => (
                <Grid container key={index} paddingX={4}>
                  <Grid xs={3} sm={3} md={3} lg={3} xl={3} padding={1}>
                    <Typography variant="h6" fontWeight="bold">
                      <CircleIcon fontSize="small" /> {item.key}
                    </Typography>
                  </Grid>
                  <Grid
                    xs={9}
                    sm={9}
                    md={9}
                    lg={9}
                    xl={9}
                    padding={2}
                    style={{ backgroundColor: "#E9ECEF", borderRadius: "10px" }}
                  >
                    <Typography>{item.value}</Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Grid>
        <Grid
          container
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          margin={4}
          padding={4}
          style={{ backgroundColor: "ghostwhite", borderRadius: "16px" }}
        >
          <Grid xs={12} sm={12} md={12} lg={12} xl={12} marginBottom={2}>
            <Typography variant="h4" fontWeight="bold">
              Buyer's Rating & Reviews
            </Typography>
          </Grid>
          <Grid container xs={12} sm={12} md={12} lg={12} xl={12}>
            {product?.ratings?.total_user_response ? (
              <ProductRatingGraph productRatings={product.ratings} />
            ) : (
              <></>
            )}
          </Grid>
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
