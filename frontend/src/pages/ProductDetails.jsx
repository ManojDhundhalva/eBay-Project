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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/system";

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

  const [value, setValue] = React.useState(1);
  const [hover, setHover] = React.useState(-1);
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
  const ImgUrl =
    "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg";

  const checkIsAddedToCart = () => {
    for (let i = 0; i < cartList.length; i++) {
      if (
        String(cartList[i].product_id) ===
        String(window.localStorage.getItem("product-id"))
      ) {
        setIsAddedToCart(true);
        break;
      }
    }
  };

  const checkIsAddedToWishList = () => {
    for (let i = 0; i < wishList.length; i++) {
      if (
        String(wishList[i].product_id) ===
        String(window.localStorage.getItem("product-id"))
      ) {
        setIsAddedToWishList(true);
        break;
      }
    }
  };
  // Function to format timestamp
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

  const getProductDetails = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/product/product-details?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem(
          "role"
        )}&productId=${window.localStorage.getItem("product-id")}`,
        {
          headers,
        }
      );
      console.log(results.data);
      setValue(
        results.data.your_rating !== null ? results.data.your_rating : value
      );
      setProductComment(results.data.your_comment);
      setProduct(results.data);
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  const rateTheOrderedProduct = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.post(
        `http://localhost:8000/api/v1/product/rate-product?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          product_review_rating: value,
          product_id: window.localStorage.getItem("product-id"),
        },
        {
          headers,
        }
      );
      if (results.status === 200) {
        toast.success("Rated Successfully!");
      } else {
        toast.error("Error, NOT Rated");
      }
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  const makeCommentOnProduct = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.post(
        `http://localhost:8000/api/v1/product/comment-on-product?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          product_comment: productComment,
          product_id: window.localStorage.getItem("product-id"),
        },
        {
          headers,
        }
      );
      if (results.status === 200) {
        toast.success("Commented Successfully!");
      } else {
        toast.error("Error, NOT Commented");
      }
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(
        (prevIndex) =>
          (prevIndex + 1) %
          (product.product_images ? product.product_images.length : 0)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [product.product_images]);

  useEffect(() => {
    if (window.localStorage.getItem("product-id") === null) {
      navigate(-1);
    } else {
      setIsInOrderedProductIds(
        orderedProductIds.includes(window.localStorage.getItem("product-id"))
      );
      getProductDetails();
      checkIsAddedToCart();
      checkIsAddedToWishList();
    }
  }, []);

  return (
    <>
      <div className="mt-5">1</div>
      <Typography variant="h4" fontWeight="bold">
        Product Details
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box
            id="image"
            sx={(theme) => ({
              mt: { xs: 8, sm: 10 },
              alignSelf: "center",
              // height: { xs: 200, sm: 700 },
              width: "100%",
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
              color: theme.palette.mode !== "light" ? "black" : "white",
            })}
          >
            <Carousel activeIndex={index} onSelect={() => {}}>
              {product.product_images &&
                product.product_images.map((image, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      width="100%"
                      src={image}
                      alt={`Slide ${idx + 1}`}
                      onError={(e) => {
                        e.target.src = ImgUrl;
                        e.target.onerror = null;
                        const caption =
                          e.target.parentElement.querySelector(
                            ".carousel-caption"
                          );
                        if (caption) {
                          const heading = document.createElement("h3");
                          heading.textContent = "Image not found";
                          caption.innerHTML = "";
                          caption.appendChild(heading);
                        }
                      }}
                    />
                    <Carousel.Caption>
                      <h3>Image {idx + 1}</h3>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
            </Carousel>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box
            id="image"
            sx={(theme) => ({
              mt: { xs: 8, sm: 10 },
              alignSelf: "center",
              // height: { xs: 200, sm: 700 },
              width: "100%",
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
              //   color: theme.palette.mode !== "light" ? "black" : "white",
            })}
          >
            <CardContent>
              <Grid container spacing={2} style={{ marginLeft: "0.1em" }}>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h2" fontWeight="bold">
                    Product Details
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Product ID: {window.localStorage.getItem("product-id")}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Product Price: {product.product_price}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Product Title: {product.product_title}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Product Available Quantity:{" "}
                    {product.product_available_quantity}
                  </Typography>
                </Grid>

                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Product Average Rating: {product.product_avg_rating}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Product Watch Count: {product.product_watch_count}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Product Timestamp:{" "}
                    {new Date(product.product_timestamp).toLocaleDateString()}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    Product Timestamp:{" "}
                    {formatTimestamp(product.product_timestamp)}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    seller_city
                    {product.seller_city}
                  </Typography>
                </Grid>

                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    seller_state
                    {product.seller_state}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    seller_country
                    {product.seller_country}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
                  <Typography variant="h5" fontWeight="bold">
                    seller_pincode
                    {product.seller_pincode}
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ marginTop: "1em" }}>
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
                          deleteFromCart(
                            window.localStorage.getItem("product-id")
                          );
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
                        addToWishList(
                          window.localStorage.getItem("product-id")
                        );
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
                        deleteFromWishList(
                          window.localStorage.getItem("product-id")
                        );
                        setIsAddedToWishList(false);
                      }}
                    >
                      <FavoriteIcon sx={{ color: "red" }} />
                      ADDED ON WishList
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box
            id="image"
            sx={(theme) => ({
              mt: { xs: 8, sm: 10 },
              alignSelf: "center",
              // height: { xs: 200, sm: 700 },
              height: "auto",
              width: "100%",
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
              //   color: theme.palette.mode !== "light" ? "black" : "white",
            })}
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
            id="image"
            sx={(theme) => ({
              mb: { xs: 8, sm: 10 },
              alignSelf: "center",
              // height: { xs: 200, sm: 700 },
              height: "auto",
              width: "100%",
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
              //   color: theme.palette.mode !== "light" ? "black" : "white",
            })}
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
                id="image"
                sx={(theme) => ({
                  mb: { xs: 8, sm: 10 },
                  alignSelf: "center",
                  // height: { xs: 200, sm: 700 },
                  height: "auto",
                  width: "100%",
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
                  //   color: theme.palette.mode !== "light" ? "black" : "white",
                })}
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
                id="image"
                sx={(theme) => ({
                  mb: { xs: 8, sm: 10 },
                  alignSelf: "center",
                  // height: { xs: 200, sm: 700 },
                  height: "auto",
                  width: "100%",
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
                  //   color: theme.palette.mode !== "light" ? "black" : "white",
                })}
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
            id="image"
            sx={(theme) => ({
              mb: { xs: 8, sm: 10 },
              alignSelf: "center",
              // height: { xs: 200, sm: 700 },
              height: "auto",
              width: "100%",
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
              //   color: theme.palette.mode !== "light" ? "black" : "white",
            })}
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
