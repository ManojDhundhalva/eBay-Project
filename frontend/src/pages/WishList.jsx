import React from "react";
import {
  Button,
  Grid,
  Chip,
  IconButton,
  Typography,
  Tooltip,
  Zoom,
} from "@mui/material";
import { useProduct } from "../context/product";
import { Link, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

function WishList() {
  const {
    cartList,
    addToCart,
    deleteFromCart,
    wishList,
    addToWishList,
    deleteFromWishList,
  } = useProduct();

  const navigate = useNavigate();
  const isProductInWishList = (productId) => {
    return wishList.some((item) => item.product_id === productId);
  };

  const isProductInCartList = (productId) => {
    return cartList.some((item) => item.product_id === productId);
  };

  return (
    <Grid container padding={2} margin={0} sx={{ userSelect: "none" }}>
      <Grid xs={12} paddingX={6} paddingY={2} margin={0}>
        <Grid
          container
          padding={0}
          margin={0}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontWeight="bold">
            Whishing List
          </Typography>
          <Typography>{wishList.length} items</Typography>
        </Grid>
        <hr className="my-4" />
        {wishList.map((item, index) => (
          <Grid
            key={index}
            container
            alignItems="center"
            justifyContent="space-between"
            padding={0}
            margin={0}
          >
            <Grid item margin={0} padding={0} sx={{ display: "flex" }}>
              <Grid item margin={0} padding={0}>
                <img
                  src={item.product_images[0]}
                  alt="product_image"
                  onClick={() => {
                    navigate(`/product-details?id=${item.product_id}`);
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
                  Available Quantity: {item.product_available_quantity}
                </Typography>
                <Typography variant="body2">
                  From: {item.seller_city}
                </Typography>
                {item.product_available_quantity ? (
                  <></>
                ) : (
                  <Chip label="Sold Out" variant="outlined" color="error" />
                )}
              </Grid>
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
                  {item.product_available_quantity ? (
                    isProductInCartList(item.product_id) ? (
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
                            backgroundColor: "lavender",
                            color: "#032174",
                          }}
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title="Add To Cart"
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
                          aria-label="add-to-cart"
                          onClick={() => addToCart(item.product_id)}
                          sx={{
                            backgroundColor: "lavender",
                            color: "#032174",
                          }}
                        >
                          <ShoppingCartOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    )
                  ) : (
                    <></>
                  )}
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
                        onClick={() => deleteFromWishList(item.product_id)}
                        sx={{
                          backgroundColor: "#fff0f3",
                          color: "#e01e37",
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
                          backgroundColor: "#fff0f3",
                          color: "#e01e37",
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
        <Grid container justifyContent="flex-start" padding={2} margin={0}>
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
    </Grid>
  );
}

export default WishList;
