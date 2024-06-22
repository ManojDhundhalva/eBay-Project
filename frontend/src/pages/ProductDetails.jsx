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
import Avatar from "@mui/material/Avatar";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";
import EmojiPicker, {
  EmojiClickData,
  Theme,
  EmojiStyle,
  SkinTones,
} from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Icon from "@mui/material/Icon";
import { useLocation } from "react-router-dom";
import { validate as validateUUID } from "uuid";

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
  const [reviewTimeStamp, setReviewTimeStamp] = useState("");
  const [isEditOnPost, setIsEditOnPost] = useState(false);
  const [isEmojiOn, setIsEmojiOn] = useState(false);

  const [originalRating, setOriginalRating] = useState(1);
  const [originalComment, setOriginalComment] = useState(1);

  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const currentURL = window.location.href;
  const queryParams = new URLSearchParams(location.search);
  const productIdParams = queryParams.get("id");

  const [tooltipText, setTooltipText] = useState("Copy To Clipboard");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    cartList,
    addToCart,
    deleteFromCart,
    wishList,
    addToWishList,
    deleteFromWishList,
    orderedProductIds,
    setSellerId,
  } = useProduct();
  const { LogOut } = useAuth();

  useEffect(() => {
    const productId = productIdParams;
    if (!validateUUID(productId)) {
      navigate("/");
    } else {
      setIsInOrderedProductIds(orderedProductIds.includes(productId));
      getProductDetails();
      checkIsAddedToCart();
      checkIsAddedToWishList();
    }
  }, []);

  function formatTimestamp(postgresTimestamp) {
    // Assuming postgresTimestamp is in ISO format (e.g., '2024-05-13T12:34:56Z')
    return moment(postgresTimestamp).format("DD/MM/YYYY hh:mm A");
  }

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
        )}&productId=${productIdParams}`,
        { headers }
      );
      console.log("product", data);
      setValue(
        data.your_reviews !== null ? data.your_reviews.your_rating : value
      );
      setOriginalRating(
        data.your_reviews !== null ? data.your_reviews.your_rating : value
      );
      setProductComment(
        data.your_reviews !== null ? data.your_reviews.your_comment : ""
      );
      setOriginalComment(
        data.your_reviews !== null ? data.your_reviews.your_comment : ""
      );
      setReviewTimeStamp(
        data.your_reviews !== null
          ? formatTimestamp(data.your_reviews.your_review_timestamp)
          : ""
      );
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      // LogOut();
    }
  };

  const checkIsAddedToCart = () => {
    setIsAddedToCart(
      cartList.some(
        (item) => String(item.product_id) === String(productIdParams)
      )
    );
  };

  const checkIsAddedToWishList = () => {
    setIsAddedToWishList(
      wishList.some(
        (item) => String(item.product_id) === String(productIdParams)
      )
    );
  };

  const formatTimestampAgo = (timestamp) => {
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

  const formatDateAfterReview = (date) => {
    const padTo2Digits = (num) => num.toString().padStart(2, "0");

    let day = padTo2Digits(date.getDate());
    let month = padTo2Digits(date.getMonth() + 1); // Months are zero-based
    let year = date.getFullYear();

    let hours = date.getHours();
    let minutes = padTo2Digits(date.getMinutes());
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = padTo2Digits(hours);

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const makeReviewOfProduct = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const { status } = await axios.post(
        `http://localhost:8000/api/v1/product/review-product?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          product_review_rating: value,
          product_comment: productComment,
          product_id: productIdParams,
        },
        { headers }
      );
      if (status === 200) {
        setReviewTimeStamp(formatDateAfterReview(new Date()));
        toast.success("Review submitted successfully!");
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.log("Error review the product:", error);
      toast.error("Failed to submit review.");
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      setTooltipText("Copied");
      setTimeout(() => {
        setTooltipText("Copy To Clipboard");
      }, 2000);
    } catch (error) {
      console.error("Error copying URL to clipboard:", error);
      toast.error("Failed to copy URL to clipboard.");
    }
  };

  return (
    <>
      <Grid container paddingX={2}>
        <Grid xs={12} sm={12} md={12} lg={12} xl={12} paddingX={2}>
          <Grid
            container
            paddingY={1}
            paddingX={2}
            alignItems="center"
            justifyContent="space-between"
            style={{
              backgroundColor: "#e9ecef",
              borderRadius: "16px",
            }}
          >
            <Grid
              container
              alignItems="center"
              item
              padding={0}
              margin={0}
              xs={10}
              sm={10}
              md={10}
              xl={10}
              lg={10}
              style={{
                borderRadius: "16px",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Category &#x2022; &nbsp;
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" />}
              >
                <Typography
                  onClick={() => {
                    navigate(
                      `/category?category=${encodeURIComponent(
                        product.product_category_name
                      )}`
                    );
                  }}
                  style={{ color: "black", cursor: "pointer" }}
                  sx={{
                    textDecoration: "underline",
                    textDecorationColor: "grey",
                    "&:hover": {
                      textDecorationColor: "black",
                    },
                  }}
                >
                  {product.product_category_name}
                </Typography>
                <Typography
                  onClick={() => {
                    navigate(
                      `/category?category=${encodeURIComponent(
                        product.product_category_name
                      )}&sub_category=${encodeURIComponent(
                        product.product_sub_category_name
                      )}`
                    );
                  }}
                  style={{ color: "black", cursor: "pointer" }}
                  sx={{
                    textDecoration: "underline",
                    textDecorationColor: "grey",
                    "&:hover": {
                      textDecorationColor: "black",
                    },
                  }}
                >
                  {product.product_sub_category_name}
                </Typography>
                <Typography
                  onClick={() => {
                    navigate(
                      `/category?category=${encodeURIComponent(
                        product.product_category_name
                      )}&sub_category=${encodeURIComponent(
                        product.product_sub_category_name
                      )}&sub_sub_category=${encodeURIComponent(
                        product.product_sub_sub_category_name
                      )}`
                    );
                  }}
                  style={{ color: "black", cursor: "pointer" }}
                  sx={{
                    textDecoration: "underline",
                    textDecorationColor: "grey",
                    "&:hover": {
                      textDecorationColor: "black",
                    },
                  }}
                >
                  {product.product_sub_sub_category_name}
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              item
              padding={0}
              margin={0}
              xs={2}
              sm={2}
              md={2}
              xl={2}
              lg={2}
              style={{
                borderRadius: "16px",
              }}
            >
              <Grid style={{ backgroundColor: "white", borderRadius: "10px" }}>
                {!isAddedToWishList ? (
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Add To WishList"
                    placement="bottom"
                    arrow
                  >
                    <IconButton
                      aria-label="Add-To-WishList"
                      onClick={() => {
                        addToWishList(productIdParams);
                        setIsAddedToWishList(true);
                      }}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="ADDED ON WishList"
                    placement="bottom"
                    arrow
                  >
                    <IconButton
                      aria-label="ADDED-ON-WishList"
                      onClick={() => {
                        deleteFromWishList(productIdParams);
                        setIsAddedToWishList(false);
                      }}
                    >
                      <FavoriteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Tooltip>
                )}
                {product.product_available_quantity ? (
                  !isAddedToCart ? (
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Add To Cart"
                      placement="bottom"
                      arrow
                    >
                      <IconButton
                        aria-label="Add-To-Cart"
                        onClick={() => {
                          addToCart(productIdParams);
                          setIsAddedToCart(true);
                        }}
                      >
                        <ShoppingCartOutlinedIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Remove From The Cart"
                      placement="bottom"
                      arrow
                    >
                      <IconButton
                        aria-label="Remove-From-The-Cart"
                        onClick={() => {
                          deleteFromCart(productIdParams);
                          setIsAddedToCart(false);
                        }}
                      >
                        <ShoppingCartRoundedIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  )
                ) : (
                  <></>
                )}
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Link <LinkIcon />
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      id="alert-dialog-description"
                      style={{ display: "flex" }}
                    >
                      <Button
                        variant="outlined"
                        sx={{ textTransform: "none" }}
                        style={{
                          borderRadius: "10px",
                          width: "40em",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                        }}
                      >
                        {currentURL}
                      </Button>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title={tooltipText}
                        placement="top"
                        arrow
                      >
                        <IconButton
                          sx={{ marginX: 2 }}
                          aria-label="share"
                          onClick={() => {
                            copyToClipboard();
                            handleClickOpen();
                          }}
                        >
                          <ContentCopyIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
                <Tooltip
                  TransitionComponent={Zoom}
                  title="Share"
                  placement="bottom"
                  arrow
                >
                  <IconButton aria-label="share" onClick={handleClickOpen}>
                    <ShareIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} sm={12} md={7} lg={7} xl={7} paddingX={2}>
          {product.product_images && (
            <DisplayImages images={product.product_images} />
          )}
        </Grid>
        <Grid xs={12} sm={12} md={5} lg={5} xl={5} padding={2} paddingLeft={0}>
          <Grid
            padding={4}
            style={{
              backgroundColor: "ghostwhite",
              borderRadius: "16px",
            }}
          >
            <Grid container>
              <Grid
                container
                item
                margin={0}
                padding={0}
                xs={8}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <Grid
                  item
                  margin={0}
                  padding={0}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ display: "flex" }}
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      width: "100%",
                      textTransform: "uppercase",
                    }}
                  >
                    {product.product_title}
                  </h3>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ display: "flex" }}
                >
                  <div>
                    <Rating
                      name="product-rating"
                      value={parseFloat(product.product_avg_rating)}
                      precision={0.1} // Set precision to 0.1 to allow fractional part
                      readOnly
                      emptyIcon={<StarBorderRoundedIcon />}
                      icon={<StarRoundedIcon />}
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
              </Grid>
              <Grid
                container
                item
                margin={0}
                padding={0}
                xs={4}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                justifyContent="flex-top"
                alignItems="flex-end"
                direction="column"
                style={{
                  fontWeight: "bold",
                }}
              >
                <Chip
                  style={{
                    backgroundColor: "lightgrey",
                    color: "black",
                    width: "fit-content",
                  }}
                  label={
                    <>
                      <RemoveRedEyeOutlinedIcon /> {product.product_watch_count}
                    </>
                  }
                />
                <Typography variant="subtitle2" style={{ fontWeight: "bold" }}>
                  {formatTimestampAgo(product.product_timestamp)}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              item
              marginY={4}
              padding={0}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography variant="h3" style={{ fontWeight: "bold" }}>
                <span style={{ fontWeight: 500 }}>&#8377;</span>{" "}
                {product.product_price}
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
              container
              item
              padding={0}
              marginY={5}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Grid
                container
                item
                paddingX={1}
                margin={0}
                xs={6}
                sm={6}
                md={6}
                lg={6}
                xl={6}
              >
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
                        addToCart(productIdParams);
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
                        deleteFromCart(productIdParams);
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
              <Grid
                container
                item
                paddingX={1}
                margin={0}
                xs={6}
                sm={6}
                md={6}
                lg={6}
                xl={6}
              >
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
                      addToWishList(productIdParams);
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
                      deleteFromWishList(productIdParams);
                      setIsAddedToWishList(false);
                    }}
                  >
                    <FavoriteIcon sx={{ color: "red" }} />
                    &nbsp;&nbsp;&nbsp;ADDED ON WishList
                  </Button>
                )}
              </Grid>
            </Grid>
            <Grid
              container
              item
              marginY={1}
              padding={0}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Grid
                container
                item
                padding={2}
                marginY={1}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                alignItems="center"
                style={{
                  backgroundColor: "#e9ecef",
                  borderRadius: "16px",
                }}
              >
                <Grid container alignItems="center">
                  <Avatar src="/broken-image.jpg" />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Link
                    to="/"
                    style={{
                      fontFamily: "Quicksand",
                      color: "black",
                      fontSize: "large",
                      fontWeight: "bold",
                    }}
                    sx={{
                      textDecorationColor: "black",
                      "&:hover": {
                        textDecorationColor: "black",
                      },
                    }}
                  >
                    {product.username}
                  </Link>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    onClick={() => {
                      setSellerId(product.id);
                      navigate(`/seller-product?seller-id=${product.id}`);
                    }}
                    sx={{
                      textDecorationColor: "black",
                      "&:hover": {
                        textDecorationColor: "black",
                      },
                    }}
                    style={{ fontFamily: "Quicksand", color: "black" }}
                  >
                    see seller's product
                  </Button>
                </Grid>
              </Grid>
              <Grid
                // container
                item
                padding={2}
                marginY={1}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{
                  backgroundColor: "#e9ecef",
                  borderRadius: "16px",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Shipping
                </Typography>
                <Typography variant="subtitle2">
                  {product.seller_city}, {product.seller_state},{" "}
                  {product.seller_country}, {product.seller_pincode}
                </Typography>
                <Typography variant="subtitle2">
                  ID : {productIdParams}{" "}
                </Typography>
                <Typography variant="subtitle2">
                  Listed On : {formatDate(product.product_timestamp)}{" "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          margin={2}
          padding={4}
          style={{ backgroundColor: "ghostwhite", borderRadius: "16px" }}
        >
          <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="h4" fontWeight="bold">
              Product Description
            </Typography>
          </Grid>
          <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
            {product.product_description &&
              product.product_description.map((item, index) => (
                <Grid container key={index} paddingX={4} paddingY={2}>
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
          margin={2}
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
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          margin={2}
          padding={4}
          style={{ backgroundColor: "ghostwhite", borderRadius: "16px" }}
        >
          <Grid xs={12} sm={12} md={12} lg={12} xl={12} marginBottom={2}>
            <Typography variant="h4" fontWeight="bold">
              Comment
            </Typography>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
            {isInOrderedProductIds ? (
              <Grid container paddingX={4} paddingY={2}>
                <Grid
                  container
                  justifyContent="flex-start"
                  alignItems="center"
                  xs={3}
                  padding={1}
                >
                  <Avatar src="/broken-image.jpg" />
                  <Typography variant="h6" fontWeight="bold">
                    &nbsp;&nbsp;&nbsp;YOU
                  </Typography>
                </Grid>
                <Grid
                  container
                  xs={9}
                  padding={2}
                  style={{ backgroundColor: "#E9ECEF", borderRadius: "10px" }}
                >
                  <Grid
                    container
                    alignItems="flex-start"
                    style={{ position: "relative" }}
                  >
                    <Grid container xs={6}>
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
                        readOnly={!isEditOnPost}
                        emptyIcon={<StarRoundedIcon />}
                        icon={<StarRoundedIcon />}
                      />
                      {isEditOnPost ? (
                        <Typography variant="subtitle1" fontWeight="bold">
                          {value !== null && (
                            <Box sx={{ ml: 2 }}>
                              {labels[hover !== -1 ? hover : value]}
                            </Box>
                          )}
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid
                      container
                      xs={6}
                      justifyContent="flex-end"
                      alignItems="flex-start"
                    >
                      {!isEditOnPost ? (
                        <Button
                          onClick={() => {
                            setIsEditOnPost(true);
                            setIsEmojiOn(false);
                          }}
                          variant="contained"
                          style={{ backgroundColor: "#02294F" }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          &nbsp;&nbsp;Edit
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              setIsEditOnPost(false);
                              setIsEmojiOn(false);
                              setProductComment(originalComment);
                              setValue(originalRating);
                            }}
                            variant="outlined"
                            color="error"
                            style={{
                              width: "fit-content",
                              marginRight: 8,
                            }}
                          >
                            <ClearIcon />
                          </Button>
                          <Button
                            onClick={() => {
                              setIsEditOnPost(false);
                              setIsEmojiOn(false);
                              setOriginalComment(productComment);
                              setOriginalRating(value);
                              makeReviewOfProduct();
                            }}
                            variant="contained"
                            style={{
                              backgroundColor: "#02294F",
                              marginLeft: 2,
                              marginRight: 2,
                            }}
                            startIcon={<SendIcon />}
                          >
                            Post
                          </Button>
                        </>
                      )}
                    </Grid>
                    <Grid container margin={0} marginTop={1} padding={0}>
                      {!isEditOnPost ? (
                        <textarea
                          value={originalComment}
                          readOnly={true}
                          style={{
                            border: "none",
                            resize: "none",
                            background: "transparent",
                            outline: "none",
                            width: "100%",
                            overflow: "hidden",
                            fontWeight: "bold",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                          }}
                        />
                      ) : (
                        <TextField
                          value={productComment}
                          id="outlined-basic"
                          variant="outlined"
                          placeholder="Write Comment (Optional)"
                          multiline
                          maxRows={4}
                          fullWidth
                          onChange={(e) => {
                            if (e.target.value.length <= 2000) {
                              setProductComment(e.target.value);
                            }
                          }}
                          InputProps={{
                            readOnly: !isEditOnPost,
                            style: {
                              fontWeight: "bold",
                            },
                          }}
                          style={{ fontWeight: "bold" }}
                          sx={{
                            "& .MuiInputBase-root": {
                              "& .MuiInputBase-input": {
                                "&::-webkit-scrollbar": {
                                  width: "8px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "#02294F",
                                  borderRadius: "10px",
                                },
                                "&::-webkit-scrollbar-track": {
                                  background: "transparent",
                                },
                                "&::-webkit-scrollbar-button": {
                                  display: "none",
                                },
                                "&": {
                                  scrollbarWidth: "thin",
                                  scrollbarColor: "#02294F transparent",
                                },
                              },
                            },
                          }}
                        />
                      )}
                      {!isEditOnPost ? (
                        <Grid container justifyContent="flex-end">
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            textAlign="right"
                          >
                            {reviewTimeStamp}
                          </Typography>
                        </Grid>
                      ) : (
                        <Grid container justifyContent="space-between">
                          <Grid
                            container
                            xs={2}
                            marginY={1}
                            padding={0}
                            style={{ position: "relative" }}
                          >
                            <Button
                              onClick={() => {
                                if (isEditOnPost) {
                                  setIsEmojiOn(!isEmojiOn);
                                }
                              }}
                              variant="outlined"
                              style={{
                                width: "fit-content",
                                position: "relative",
                                color: "#02294F",
                                border: "1px solid #02294F",
                              }}
                            >
                              <SentimentSatisfiedAltIcon />
                            </Button>
                            {/* google, apple, facebook, twitter and native. */}
                            {isEmojiOn && isEditOnPost ? (
                              <EmojiPicker
                                // skinTonePicker={SkinTones}
                                onEmojiClick={(emojiData, event) => {
                                  setProductComment(
                                    (prevComment) =>
                                      prevComment + emojiData.emoji
                                  );
                                }}
                                emojiStyle="facebook"
                                theme={Theme.DARK}
                                style={{
                                  display: "flex",
                                  position: "absolute",
                                  top: "46px",
                                  zIndex: 10,
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </Grid>
                          <Grid container xs={10}>
                            <Grid
                              container
                              justifyContent="flex-end"
                              padding={0}
                              style={{ position: "relative" }}
                            >
                              <Typography variant="body1" fontWeight="bold">
                                {productComment.length}/2000
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              justifyContent="flex-end"
                              padding={0}
                              style={{ position: "relative" }}
                            >
                              <Typography variant="body1" fontWeight="bold">
                                {reviewTimeStamp}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
            {product.product_reviews &&
              product.product_reviews.map((item, index) => (
                <Grid container key={index} paddingX={4} paddingY={2}>
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    xs={3}
                    sm={3}
                    md={3}
                    lg={3}
                    xl={3}
                    padding={1}
                    direction="row"
                    // style={{ backgroundColor: "lightblue" }}
                  >
                    <Avatar src="/broken-image.jpg" />
                    <Typography key={index} variant="h6" fontWeight="bold">
                      &nbsp;&nbsp;&nbsp;
                      {item.username}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    xs={9}
                    sm={9}
                    md={9}
                    lg={9}
                    xl={9}
                    padding={2}
                    style={{ backgroundColor: "#E9ECEF", borderRadius: "10px" }}
                  >
                    <Rating
                      name="product-rating"
                      value={parseFloat(item.rating)}
                      precision={0.1} // Set precision to 0.1 to allow fractional part
                      readOnly
                      emptyIcon={<StarRoundedIcon />}
                      icon={<StarRoundedIcon />}
                    />
                    <textarea
                      value={item.comment}
                      readOnly={true}
                      style={{
                        border: "none",
                        resize: "none",
                        background: "transparent",
                        outline: "none",
                        width: "100%",
                        overflow: "hidden",
                        fontWeight: "bold",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        marginTop: 12,
                      }}
                    />
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      textAlign="right"
                    >
                      {formatTimestamp(item.product_review_timestamp)}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ProductDetails;
