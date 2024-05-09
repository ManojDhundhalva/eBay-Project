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
      {!isOrderPlaced ? (
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
                          <Typography
                            variant="body1"
                            className="mb-0 text-muted"
                          >
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
                                  style={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    window.localStorage.setItem(
                                      "product-id",
                                      item.product_id
                                    );
                                  }}
                                >
                                  <Link
                                    to="/product-details"
                                    style={{ color: "black" }}
                                  >
                                    {item.product_title}
                                  </Link>
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  className="text-black mb-0"
                                >
                                  ₹ {item.product_price}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="text-black mb-0"
                                >
                                  Available Quantity :
                                  {item.product_available_quantity}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="text-black mb-0"
                                >
                                  From : {item.seller_city}
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
                                      selectedQuantities[item.product_id] - 1,
                                      parseInt(item.product_available_quantity)
                                    )
                                  }
                                >
                                  <RemoveIcon />
                                </Button>
                                <Select
                                  value={
                                    selectedQuantities[item.product_id] || 1
                                  } // Set the default value to 1 if no value is selected
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.product_id,
                                      parseInt(e.target.value),
                                      parseInt(item.product_available_quantity)
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
                                      selected={
                                        quantity + 1 ===
                                        selectedQuantities[item.product_id]
                                      }
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
                                      selectedQuantities[item.product_id] + 1,
                                      parseInt(item.product_available_quantity)
                                    )
                                  }
                                >
                                  <Add />
                                </Button>
                              </Grid>
                              <Grid
                                item
                                md={3}
                                lg={2}
                                xl={2}
                                className="text-end"
                              >
                                <Typography
                                  variant="subtitle2"
                                  className="mb-0"
                                >
                                  &#x20b9;
                                  {(
                                    selectedQuantities[item.product_id] *
                                    item.product_price
                                  ).toFixed(2)}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                md={1}
                                lg={1}
                                xl={1}
                                className="text-end"
                              >
                                {/* Delete icon */}
                                <Tooltip
                                  title="Remove From Cart"
                                  onClick={() =>
                                    deleteFromCart(item.product_id)
                                  }
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
                    <Grid item lg={4} className="bg-grey">
                      <div className="p-5">
                        <Typography
                          variant="h5"
                          className="fw-bold mb-5 mt-2 pt-1"
                        >
                          Summary
                        </Typography>
                        <hr className="my-4" />
                        {cartList.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between mb-4"
                          >
                            <Typography variant="subtitle1">
                              {item.product_title}
                            </Typography>
                            <Typography variant="subtitle1">
                              &#x20b9;
                              {Number(item.product_price).toFixed(2)} (
                              {selectedQuantities[item.product_id]} item
                              {selectedQuantities[item.product_id] > 1 && "s"})
                            </Typography>
                          </div>
                        ))}
                        <hr className="my-4" />
                        <div className="d-flex justify-content-between mb-4">
                          <Typography
                            variant="subtitle2"
                            style={{ fontWeight: "bold" }}
                          >
                            Other Charges
                          </Typography>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                          <Typography variant="subtitle1">
                            ebay Charge
                          </Typography>
                          <Typography variant="subtitle1">
                            &#x20b9;{" "}
                            {Number(
                              (
                                TotalAmount *
                                (process.env.REACT_APP_EBAY_CHARGES / 100)
                              ).toFixed(2)
                            ).toFixed(2)}{" "}
                            ({process.env.REACT_APP_EBAY_CHARGES}%)
                          </Typography>
                        </div>
                        <hr className="my-4" />
                        <div className="d-flex justify-content-between mb-5">
                          <Typography
                            variant="subtitle1"
                            className="text-uppercase"
                          >
                            Total price
                          </Typography>
                          <Typography variant="subtitle1">
                            &#x20b9;{" "}
                            {(
                              Number(TotalAmount) + Number(TotalAmount * 0.012)
                            ).toFixed(2)}{" "}
                            ({totalQuantities} item{totalQuantities > 1 && "s"})
                          </Typography>
                        </div>
                        <Button
                          onClick={() => {
                            setIsOrderPlaced(true);
                          }}
                          color="inherit"
                          variant="contained"
                          size="large"
                          fullWidth
                        >
                          <LocalMallIcon /> &nbsp; Place Order
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </section>
      ) : (
        <>
          <Checkout
            totalQuantities={totalQuantities}
            setIsOrderPlaced={setIsOrderPlaced}
            selectedQuantities={selectedQuantities}
            TotalAmount={Number(TotalAmount)}
          />
        </>
      )}
    </>
  );
}
