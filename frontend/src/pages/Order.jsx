import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Add, Minimize, ArrowBack } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Checkout from "../components/PlaceOrder/Checkout";
import { useProduct } from "../context/product";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

function Order() {
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
    <>
      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
        <Grid
          container
          className="py-5 h-100"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Card
              className="card-registration card-registration-2"
              sx={{ borderRadius: "15px" }}
            >
              <CardContent className="p-0">
                <Grid container className="g-0">
                  <Grid item lg={12}>
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <Typography
                          variant="h4"
                          className="fw-bold mb-0 text-black"
                        >
                          Order List
                        </Typography>
                        <Typography variant="body1" className="mb-0 text-muted">
                          {wishList.length} items
                        </Typography>
                      </div>
                      <hr className="my-4" />
                      {/* Repeat this section for each item */}
                      {wishList.map((item) => (
                        <React.Fragment key={item.product_id}>
                          <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            className="mb-4"
                          >
                            {item.product_images.map((image, index) => (
                              <Grid key={index} item md={2} lg={2} xl={2}>
                                <CardMedia
                                  width={50}
                                  height={100}
                                  component="img"
                                  src={image}
                                  alt="Product Image"
                                  className="rounded-3"
                                />
                              </Grid>
                            ))}
                            <Grid
                              item
                              md={3}
                              lg={2}
                              xl={2}
                              className="text-end"
                            >
                              <Typography variant="subtitle2" className="mb-0">
                                &#x20b9;
                                {Number(item.product_price).toFixed(2)}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              md={0.5}
                              lg={0.5}
                              xl={0.5}
                              className="text-end"
                            >
                              {/* Wishlist icon */}
                              {item.product_available_quantity ? (
                                isProductInCartList(item.product_id) ? (
                                  <Tooltip
                                    title="Remove From Cart"
                                    TransitionComponent={Zoom}
                                    arrow
                                  >
                                    <ShoppingCartIcon
                                      onClick={() =>
                                        deleteFromCart(item.product_id)
                                      }
                                      color="primary"
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip
                                    title="Add To Cart"
                                    TransitionComponent={Zoom}
                                    arrow
                                  >
                                    <ShoppingCartOutlinedIcon
                                      style={{ cursor: "pointer" }}
                                      onClick={() => addToCart(item.product_id)}
                                    />
                                  </Tooltip>
                                )
                              ) : (
                                <></>
                              )}
                            </Grid>
                            <Grid
                              item
                              md={0.5}
                              lg={0.5}
                              xl={0.5}
                              className="text-end"
                            >
                              {/* Wishlist icon */}
                              {isProductInWishList(item.product_id) ? (
                                <Tooltip
                                  title="Remove WishList"
                                  TransitionComponent={Zoom}
                                  arrow
                                >
                                  <FavoriteIcon
                                    onClick={() =>
                                      deleteFromWishList(item.product_id)
                                    }
                                    style={{ cursor: "pointer", color: "red" }}
                                  />
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  title="Add WishList"
                                  TransitionComponent={Zoom}
                                  arrow
                                >
                                  <FavoriteBorderIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      addToWishList(item.product_id)
                                    }
                                  />
                                </Tooltip>
                              )}
                            </Grid>
                          </Grid>
                          <hr className="my-4" />
                        </React.Fragment>
                      ))}
                      <div className="pt-5">
                        <Typography
                          onClick={() => {
                            navigate(-1);
                          }}
                          variant="subtitle1"
                          className="mb-0"
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          <ArrowBack sx={{ mr: 1 }} /> Back to shop
                        </Typography>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>
    </>
  );
}

export default Order;
