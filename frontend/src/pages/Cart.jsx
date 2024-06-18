import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  InputLabel,
  Button,
  Grid,
  MenuItem,
  Select,
  IconButton,
  Typography,
  FormControl,
  Tooltip,
  Zoom,
} from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useProduct } from "../context/product";
import OrderPlace from "../components/OrderPlaceComponents/OrderPlace";
import ProductionQuantityLimitsRoundedIcon from "@mui/icons-material/ProductionQuantityLimitsRounded";

export default function Cart() {
  const navigate = useNavigate();

  // Product context and functions
  const {
    cartList,
    deleteFromCart,
    wishList,
    addToWishList,
    deleteFromWishList,
  } = useProduct();

  // State for selected quantities of products
  const [selectedQuantities, setSelectedQuantities] = useState({});

  // State for total quantities of products
  const [totalQuantities, setTotalQuantities] = useState(0);

  // State to indicate if the order is placed
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Function to check if a product is in the wishlist
  const isProductInWishList = (productId) => {
    return wishList.some((item) => item.product_id === productId);
  };

  // Function to calculate total quantities
  const calculateTotalQuantities = () => {
    const total = Object.values(selectedQuantities).reduce(
      (acc, curr) => acc + curr,
      0
    );
    setTotalQuantities(total);
  };

  // Function to handle quantity change for a product
  const handleQuantityChange = (productId, quantity, maxValue) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, Math.min(quantity, maxValue)),
    }));
  };

  // Initialize selected quantities when cartList changes
  useEffect(() => {
    const initialQuantities = {};
    cartList.forEach((item) => {
      initialQuantities[item.product_id] = 1;
    });
    setSelectedQuantities(initialQuantities);
  }, [cartList]);

  // Update total quantities whenever selected quantities change
  useEffect(() => {
    calculateTotalQuantities();
  }, [selectedQuantities]);

  // Calculate total amount
  const TotalAmount = cartList
    .reduce((total, item) => {
      const productTotal =
        selectedQuantities[item.product_id] * item.product_price;
      return total + productTotal;
    }, 0)
    .toFixed(2);

  return (
    <>
      {cartList.length === 0 ? (
        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          padding={10}
          margin={0}
          xs={12}
          sm={12}
          md={12}
          xl={12}
          lg={12}
          style={{
            backgroundColor: "ghostwhite",
            width: "100%",
            height: "100vh",
            borderRadius: "10px",
          }}
        >
          <Grid
            item
            margin={0}
            padding={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              backgroundColor: "#DADAE0",
              borderRadius: "16px",
              padding: 4,
            }}
          >
            <Typography variant="h4">
              <ProductionQuantityLimitsRoundedIcon fontSize="large" /> NO
              PRODUCTS FOUND
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                navigate(-1);
              }}
              sx={{
                width: "fit-content",
                borderRadius: "16px",
                fontWeight: "bold",
                backgroundColor: "#03045e",
                "&:hover": {
                  backgroundColor: "#032174",
                },
              }}
              startIcon={<ArrowBack sx={{ color: "white" }} />}
              size="large"
            >
              Back
            </Button>
          </Grid>
        </Grid>
      ) : (
        <>
          {!isOrderPlaced ? (
            <Grid container padding={2} margin={0} sx={{ userSelect: "none" }}>
              <Grid container padding={2} margin={0}>
                <Grid xs={8} paddingX={2} paddingY={1} margin={0}>
                  <Grid
                    container
                    padding={0}
                    margin={0}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h4" fontWeight="bold">
                      Shopping Cart
                    </Typography>
                    <Typography>{cartList.length} items</Typography>
                  </Grid>
                  <hr className="my-4" />
                  {cartList.map((item, index) => (
                    <Grid
                      key={index}
                      container
                      alignItems="center"
                      justifyContent="space-between"
                      padding={0}
                      margin={0}
                    >
                      <Grid
                        item
                        margin={0}
                        padding={0}
                        sx={{ display: "flex" }}
                      >
                        <Grid item margin={0} padding={0}>
                          <img
                            src={item.product_images[0]}
                            alt="product_image"
                            onClick={() => {
                              navigate(
                                `/product-details?id=${item.product_id}`
                              );
                            }}
                            style={{
                              width: 200,
                              height: 200,
                              objectFit: "contain",
                              backgroundColor: "#F2F2F2",
                              borderRadius: "16px",
                              cursor: "pointer",
                            }}
                          />
                        </Grid>
                        <Grid item padding={4} margin={0}>
                          <Typography variant="h6" fontWeight="bold">
                            <Link
                              to={`/product-details?id=${item.product_id}`}
                              style={{ color: "black" }}
                            >
                              {item.product_title}
                            </Link>
                          </Typography>
                          <Typography variant="subtitle2">
                            ₹ {item.product_price}
                          </Typography>
                          <Typography variant="body2">
                            Available Quantity:{" "}
                            {item.product_available_quantity}
                          </Typography>
                          <Typography variant="body2">
                            From: {item.seller_city}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        padding={0}
                        margin={0}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid item padding={1} margin={0}>
                          <Tooltip
                            title="Remove"
                            TransitionComponent={Zoom}
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "common.black",
                                  "& .MuiTooltip-arrow": {
                                    color: "common.black",
                                  },
                                },
                              },
                            }}
                          >
                            <IconButton
                              aria-label="remove"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product_id,
                                  selectedQuantities[item.product_id] - 1,
                                  parseInt(item.product_available_quantity)
                                )
                              }
                              sx={{
                                backgroundColor: "lavender",
                                color: "#023E8A",
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item padding={0} margin={0}>
                          <FormControl size="small">
                            <Select
                              id="quantity"
                              value={selectedQuantities[item.product_id] || 1}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.product_id,
                                  parseInt(e.target.value),
                                  parseInt(item.product_available_quantity)
                                )
                              }
                              MenuProps={{
                                sx: {
                                  "& .MuiPaper-root": {
                                    "&::-webkit-scrollbar": {
                                      width: "8px",
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                      backgroundColor: "#888",
                                      borderRadius: "4px",
                                    },
                                    "&::-webkit-scrollbar-thumb:hover": {
                                      backgroundColor: "#555",
                                    },
                                  },
                                },
                              }}
                              sx={{
                                width: 80,
                                borderRadius: 25,
                                fontWeight: "bold",
                              }}
                            >
                              {[
                                ...Array(
                                  item.product_available_quantity
                                ).keys(),
                              ].map((quantity) => (
                                <MenuItem
                                  key={quantity + 1}
                                  value={quantity + 1}
                                >
                                  {quantity + 1}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item padding={1} margin={0}>
                          <Tooltip
                            title="Add"
                            TransitionComponent={Zoom}
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "common.black",
                                  "& .MuiTooltip-arrow": {
                                    color: "common.black",
                                  },
                                },
                              },
                            }}
                          >
                            <IconButton
                              aria-label="add"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product_id,
                                  selectedQuantities[item.product_id] + 1,
                                  parseInt(item.product_available_quantity)
                                )
                              }
                              sx={{
                                backgroundColor: "lavender",
                                color: "#023E8A",
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        padding={1}
                        margin={0}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6">
                          ₹
                          {(
                            selectedQuantities[item.product_id] *
                            item.product_price
                          ).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        padding={0}
                        margin={0}
                      >
                        <Grid container spacing={1} justifyContent="center">
                          <Grid item>
                            <Tooltip
                              title="Remove From Cart"
                              TransitionComponent={Zoom}
                              arrow
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    bgcolor: "common.black",
                                    "& .MuiTooltip-arrow": {
                                      color: "common.black",
                                    },
                                  },
                                },
                              }}
                            >
                              <IconButton
                                aria-label="remove-from-cart"
                                onClick={() => deleteFromCart(item.product_id)}
                                sx={{
                                  backgroundColor: "#fff0f3",
                                  color: "#D32F2F",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            {isProductInWishList(item.product_id) ? (
                              <Tooltip
                                title="Remove WishList"
                                TransitionComponent={Zoom}
                                arrow
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      bgcolor: "common.black",
                                      "& .MuiTooltip-arrow": {
                                        color: "common.black",
                                      },
                                    },
                                  },
                                }}
                              >
                                <IconButton
                                  aria-label="remove-wishList"
                                  onClick={() =>
                                    deleteFromWishList(item.product_id)
                                  }
                                  sx={{
                                    backgroundColor: "lavender",
                                    color: "#023E8A",
                                  }}
                                >
                                  <FavoriteIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title="Add WishList"
                                TransitionComponent={Zoom}
                                arrow
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      bgcolor: "common.black",
                                      "& .MuiTooltip-arrow": {
                                        color: "common.black",
                                      },
                                    },
                                  },
                                }}
                              >
                                <IconButton
                                  aria-label="add-wishList"
                                  onClick={() => addToWishList(item.product_id)}
                                  sx={{
                                    backgroundColor: "lavender",
                                    color: "#023E8A",
                                  }}
                                >
                                  <FavoriteBorderIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid xs={12}>
                        <hr className="my-4" />
                      </Grid>
                    </Grid>
                  ))}
                  <Grid
                    container
                    justifyContent="flex-start"
                    padding={2}
                    margin={0}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(-1);
                      }}
                      sx={{
                        minWidth: "10%",

                        borderRadius: "16px",
                        fontWeight: "bold",
                        backgroundColor: "#03045e",
                        "&:hover": {
                          backgroundColor: "#032174",
                        },
                      }}
                      startIcon={<ArrowBack sx={{ color: "white" }} />}
                      size="large"
                    >
                      Back
                    </Button>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  paddingY={2}
                  paddingX={6}
                  margin={0}
                  sx={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Grid container direction="column" padding={0} margin={0}>
                    <Typography variant="h5" fontWeight="bold">
                      Summary
                    </Typography>
                    <hr className="my-4" />
                    {cartList.map((item, index) => (
                      <Grid
                        key={index}
                        container
                        justifyContent="space-between"
                        mb={4}
                      >
                        <Typography variant="subtitle1">
                          {item.product_title}
                        </Typography>
                        <Typography variant="subtitle1">
                          &#x20b9;{Number(item.product_price).toFixed(2)} (
                          {selectedQuantities[item.product_id]} item
                          {selectedQuantities[item.product_id] > 1 && "s"})
                        </Typography>
                      </Grid>
                    ))}
                    <hr className="my-4" />
                    <Grid container justifyContent="space-between" mb={4}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        Other Charges
                      </Typography>
                    </Grid>
                    <Grid container justifyContent="space-between" mb={4}>
                      <Typography variant="subtitle1">eBay Charge</Typography>
                      <Typography variant="subtitle1">
                        &#x20b9;
                        {(
                          TotalAmount *
                          (process.env.REACT_APP_EBAY_CHARGES / 100)
                        ).toFixed(2)}{" "}
                        ({process.env.REACT_APP_EBAY_CHARGES}%)
                      </Typography>
                    </Grid>
                    <hr className="my-4" />
                    <Grid container justifyContent="space-between" mb={4}>
                      <Typography
                        variant="subtitle1"
                        className="text-uppercase"
                      >
                        Total price
                      </Typography>
                      <Typography variant="subtitle1">
                        &#x20b9;
                        {(
                          Number(TotalAmount) + Number(TotalAmount * 0.012)
                        ).toFixed(2)}{" "}
                        ({totalQuantities} item{totalQuantities > 1 && "s"})
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      justifyContent="center"
                      padding={2}
                      margin={0}
                    >
                      <Button
                        variant="contained"
                        onClick={() => {
                          setIsOrderPlaced(true);
                        }}
                        sx={{
                          minWidth: "100%",

                          borderRadius: "16px",
                          fontWeight: "bold",
                          backgroundColor: "#03045e",
                          "&:hover": {
                            backgroundColor: "#032174",
                          },
                        }}
                        startIcon={<LocalMallIcon sx={{ color: "white" }} />}
                        size="large"
                      >
                        Place Order
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <>
              <OrderPlace
                totalQuantities={totalQuantities}
                setIsOrderPlaced={setIsOrderPlaced}
                selectedQuantities={selectedQuantities}
                TotalAmount={Number(TotalAmount)}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
