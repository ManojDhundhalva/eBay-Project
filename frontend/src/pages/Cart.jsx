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
  TextField,
} from "@mui/material";
import { Add, Minimize, ArrowBack } from "@mui/icons-material";
import { useProduct } from "../context/product";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import RemoveIcon from "@mui/icons-material/Remove";

export default function QuantityEdit() {
  const {
    cartList,
    deleteFromCart,
    wishList,
    addToWishList,
    deleteFromWishList,
  } = useProduct();
  const navigate = useNavigate();

  // Function to check if a product is in the wishlist
  const isProductInWishList = (productId) => {
    return wishList.some((item) => item.product_id === productId);
  };

  // State to store the selected quantities for each product
  const [selectedQuantities, setSelectedQuantities] = useState({});

  // Function to handle quantity change for a product

  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, quantity),
    }));
  };

  useEffect(() => {
    // Initialize selectedQuantities with default values (1)
    const initialQuantities = {};
    cartList.forEach((item) => {
      initialQuantities[item.product_id] = 1;
    });
    setSelectedQuantities(initialQuantities);
  }, [cartList]);

  return (
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
                <Grid item lg={8}>
                  <div className="p-5">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                      <Typography
                        variant="h4"
                        className="fw-bold mb-0 text-black"
                      >
                        Shopping Cart
                      </Typography>
                      <Typography variant="body1" className="mb-0 text-muted">
                        {cartList.length} items
                      </Typography>
                    </div>
                    <hr className="my-4" />
                    {/* Repeat this section for each item */}
                    {cartList.map((item) => (
                      <React.Fragment key={item.product_id}>
                        <Grid
                          container
                          spacing={2}
                          alignItems="center"
                          className="mb-4"
                        >
                          <Grid item md={2} lg={2} xl={2}>
                            <CardMedia
                              component="img"
                              src={item.product_images[0]}
                              alt="Product Image"
                              className="rounded-3"
                            />
                          </Grid>
                          <Grid item md={3} lg={3} xl={3}>
                            <Typography
                              variant="subtitle2"
                              className="text-muted"
                            >
                              {item.product_title}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              className="text-black mb-0"
                            >
                              ₹ {item.product_price}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            md={3}
                            lg={3}
                            xl={3}
                            className="d-flex align-items-center"
                          >
                            <Button
                              color="inherit"
                              className="px-2"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product_id,
                                  selectedQuantities[item.product_id] - 1
                                )
                              }
                            >
                              <RemoveIcon />
                            </Button>
                            <Select
                              value={selectedQuantities[item.product_id]}
                              defaultValue={1}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.product_id,
                                  parseInt(e.target.value)
                                )
                              }
                              style={{ width: 100 }}
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
                            <Button
                              color="inherit"
                              className="px-2"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product_id,
                                  selectedQuantities[item.product_id] + 1
                                )
                              }
                            >
                              <Add />
                            </Button>
                          </Grid>
                          <Grid item md={3} lg={2} xl={2} className="text-end">
                            <Typography variant="subtitle2" className="mb-0">
                              {item.product_price}
                            </Typography>
                          </Grid>
                          <Grid item md={1} lg={1} xl={1} className="text-end">
                            {/* Delete icon */}
                            <Tooltip
                              title="Remove From Cart"
                              onClick={() => deleteFromCart(item.product_id)}
                              TransitionComponent={Zoom}
                              arrow
                            >
                              <DeleteIcon
                                color="error"
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
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
                                  color="primary"
                                  style={{ cursor: "pointer" }}
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
                                  onClick={() => addToWishList(item.product_id)}
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
                          navigate("/");
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
                <Grid item lg={4} className="bg-grey">
                  <div className="p-5">
                    <Typography variant="h5" className="fw-bold mb-5 mt-2 pt-1">
                      Summary
                    </Typography>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between mb-4">
                      <Typography
                        variant="subtitle1"
                        className="text-uppercase"
                      >
                        items {cartList.length}
                      </Typography>
                      <Typography variant="subtitle1">€ 132.00</Typography>
                    </div>
                    <Typography
                      variant="subtitle1"
                      className="text-uppercase mb-3"
                    >
                      Shipping
                    </Typography>
                    <div className="mb-4 pb-2">
                      <Select
                        className="select p-2 rounded bg-grey"
                        defaultValue={1}
                        style={{ width: "100%" }}
                        variant="outlined"
                      >
                        <MenuItem value={1}>Standard-Delivery- €5.00</MenuItem>
                        <MenuItem value={2}>Two</MenuItem>
                        <MenuItem value={3}>Three</MenuItem>
                        <MenuItem value={4}>Four</MenuItem>
                      </Select>
                    </div>
                    <Typography
                      variant="subtitle1"
                      className="text-uppercase mb-3"
                    >
                      Give code
                    </Typography>
                    <div className="mb-5">
                      <TextField
                        label="Enter your code"
                        variant="outlined"
                        fullWidth
                      />
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between mb-5">
                      <Typography
                        variant="subtitle1"
                        className="text-uppercase"
                      >
                        Total price
                      </Typography>
                      <Typography variant="subtitle1">€ 137.00</Typography>
                    </div>
                    <Button
                      color="inherit"
                      variant="contained"
                      size="large"
                      fullWidth
                    >
                      Register
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
}
