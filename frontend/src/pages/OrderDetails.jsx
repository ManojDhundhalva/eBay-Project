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
import { ArrowBack } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Rating from "@mui/material/Rating";
import { useProduct } from "../context/product";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const steps = [
  "Order placed",
  "Order shipped",
  "Reached at buyer's inventory",
  "Out for Delivery",
  "Delivered",
];

function OrderDetails() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderIdParams = queryParams.get("id");

  const getOrder = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/order/order-details?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem(
          "role"
        )}&orderId=${orderIdParams}`,
        {
          headers,
        }
      );
      console.log("order-details", results.data);
      setOrderDetails(results.data);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("role") === "user") {
      if (orderIdParams === null) {
        navigate(-1);
      } else {
        getOrder();
      }
    }
  }, []);

  const formatTimestampAgo = (timestamp) => {
    const currentTime = new Date();
    const productTime = new Date(timestamp);
    const timeDifference = currentTime - productTime;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    let formattedTimestamp = "";
    if (days > 0) {
      formattedTimestamp += `${days} days `;
    }
    if (hours > 0) {
      formattedTimestamp += `${hours} hr `;
    }
    if (minutes > 0) {
      formattedTimestamp += `${minutes} min `;
    }

    return formattedTimestamp ? `${formattedTimestamp} ago` : "Just now";
  };

  function formatTimestamp(postgresTimestamp) {
    // Assuming postgresTimestamp is in ISO format (e.g., '2024-05-13T12:34:56Z')
    return moment(postgresTimestamp).format("DD/MM/YYYY hh:mm A");
  }

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
                          Order Details
                        </Typography>
                        <Typography variant="body1" className="mb-0 text-muted">
                          {orderDetails.length} items
                        </Typography>
                      </div>
                      <hr className="my-4" />
                      <React.Fragment>
                        <Grid
                          container
                          spacing={2}
                          alignItems="center"
                          className="mb-4"
                          justifyContent="space-between"
                        >
                          <Grid item xs={12} sm={8} container>
                            <Grid item>
                              <Grid item xs sx={{ textAlign: "left" }}>
                                <Typography variant="h3" component="div">
                                  &#x20b9; {orderDetails.payment_amount}
                                </Typography>
                                <Typography
                                  gutterBottom
                                  variant="subtitle1"
                                  component="div"
                                >
                                  Order id : {orderDetails.order_id}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  Payment type : {orderDetails.payment_type}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  First Name :{" "}
                                  {orderDetails.order_buyer_first_name}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  Last Name :{" "}
                                  {orderDetails.order_buyer_last_name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Ordered Date :{" "}
                                  {formatTimestamp(
                                    orderDetails.order_timestamp
                                  )}{" "}
                                  (
                                  {formatTimestampAgo(
                                    orderDetails.order_timestamp
                                  )}
                                  )
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  Contact Number : (+91)
                                  {
                                    orderDetails.order_shipping_address_mobile_number
                                  }
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  Shipping address :{" "}
                                  {orderDetails.order_shipping_location}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  Pincode :{" "}
                                  {orderDetails.order_shipping_address_pincode}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  City :{" "}
                                  {orderDetails.order_shipping_address_city}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  State :{" "}
                                  {orderDetails.order_shipping_address_state}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  Country :{" "}
                                  {orderDetails.order_shipping_address_country}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <hr className="my-4" />
                      </React.Fragment>
                      {orderDetails.products?.map((item, index) => (
                        <React.Fragment key={index}>
                          <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            className="mb-4"
                            justifyContent="space-between"
                          >
                            <Grid item xs={12} sm={8} container>
                              <Grid item>
                                <Grid item xs sx={{ textAlign: "left" }}>
                                  <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                  >
                                    Product id :{" "}
                                    <span
                                      style={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        navigate(
                                          `/product-details?id=${item.has_order.has_order_product_id}`
                                        );
                                      }}
                                    >
                                      {item.has_order.has_order_product_id}
                                    </span>
                                  </Typography>
                                  <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    component="div"
                                  >
                                    Product Title : {item.product.product_title}
                                  </Typography>
                                  <Typography
                                    gutterBottom
                                    variant="body1"
                                    component="div"
                                  >
                                    Product tracking id :{" "}
                                    {item.has_order.tracking_id}
                                  </Typography>
                                  <Typography
                                    gutterBottom
                                    variant="body1"
                                    component="div"
                                  >
                                    Ordered Quantity :{" "}
                                    {item.has_order.has_order_product_quantity}
                                  </Typography>
                                  <Typography
                                    gutterBottom
                                    variant="body1"
                                    component="div"
                                  >
                                    Average rating :{" "}
                                    <Rating
                                      name="read-only"
                                      value={item.product.product_avg_rating}
                                      readOnly
                                      precision={0.1}
                                    />
                                    {item.product.product_avg_rating}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Product Listed On :{" "}
                                    {formatTimestamp(
                                      item.product.product_timestamp
                                    )}{" "}
                                    (
                                    {formatTimestampAgo(
                                      item.product.product_timestamp
                                    )}
                                    )
                                  </Typography>
                                  <hr />
                                  <Typography
                                    variant="subtitle1"
                                    component="div"
                                  >
                                    Product Price :{" "}
                                    <span
                                      style={{ backgroundColor: "lightblue" }}
                                    >
                                      &#x20b9; {item.product.product_price}
                                    </span>
                                  </Typography>
                                  <hr />
                                  <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    component="div"
                                  >
                                    Distance({"From " + item.seller_city}) :{" "}
                                    {Number(
                                      item.has_order.has_order_distance
                                    ).toFixed(2)}
                                    KM
                                  </Typography>
                                  <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    component="div"
                                  >
                                    Distance Charges :{" "}
                                    <span
                                      style={{ backgroundColor: "lightblue" }}
                                    >
                                      &#x20b9;{" "}
                                      {Number(
                                        item.has_order.has_order_distance_charge
                                      ).toFixed(2)}
                                      ({process.env.REACT_APP_SHIPPING_CHARGES}
                                      %)
                                    </span>
                                  </Typography>
                                  <hr />
                                  <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    component="div"
                                  >
                                    eBay Charges :{" "}
                                    <span
                                      style={{ backgroundColor: "lightblue" }}
                                    >
                                      &#x20b9;{" "}
                                      {Number(
                                        item.product.product_price *
                                          (item.has_order
                                            .has_order_ebay_charge /
                                            100)
                                      ).toFixed(2)}
                                      ({item.has_order.has_order_ebay_charge}%)
                                    </span>
                                  </Typography>
                                  <hr />
                                  <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    component="div"
                                  >
                                    Total Amount :{" "}
                                    <span
                                      style={{ backgroundColor: "lightblue" }}
                                    >
                                      &#x20b9;{" "}
                                      {Number(
                                        Number(item.product.product_price) +
                                          Number(
                                            item.has_order
                                              .has_order_distance_charge
                                          ) +
                                          Number(
                                            item.product.product_price *
                                              (item.has_order
                                                .has_order_ebay_charge /
                                                100)
                                          )
                                      ).toFixed(2)}
                                    </span>
                                  </Typography>
                                  <hr />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid key={index} item md={2} lg={2} xl={2}>
                              <CardMedia
                                // width={50}
                                // height={100}
                                component="img"
                                src={item.product_image[0]}
                                alt="Product Image"
                                className="rounded-3"
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ width: "100%" }}>
                              <Stepper
                                activeStep={
                                  item.has_order.shipping_status_delivered !==
                                  null
                                    ? 5
                                    : item.has_order
                                        .shipping_status_out_for_delivery !==
                                      null
                                    ? 4
                                    : item.has_order
                                        .shipping_status_reached_at_buyers_inventory !==
                                      null
                                    ? 3
                                    : item.has_order
                                        .shipping_status_order_shipped !== null
                                    ? 2
                                    : 1
                                }
                                alternativeLabel
                              >
                                <Tooltip
                                  title={`${formatTimestamp(
                                    item.has_order.shipping_status_order_placed
                                  )} (${formatTimestampAgo(
                                    item.has_order.shipping_status_order_placed
                                  )}
                                  )`}
                                  TransitionComponent={Zoom}
                                  arrow
                                  placement="top"
                                >
                                  <Step>
                                    <StepLabel>{"Order placed"}</StepLabel>
                                  </Step>
                                </Tooltip>
                                <Tooltip
                                  title={`${formatTimestamp(
                                    item.has_order.shipping_status_order_shipped
                                  )} (${formatTimestampAgo(
                                    item.has_order.shipping_status_order_shipped
                                  )}
                                  )`}
                                  TransitionComponent={Zoom}
                                  arrow
                                  placement="top"
                                >
                                  <Step>
                                    <StepLabel>{"Order shipped"}</StepLabel>
                                  </Step>
                                </Tooltip>
                                <Tooltip
                                  title={`${formatTimestamp(
                                    item.has_order
                                      .shipping_status_reached_at_buyers_inventory
                                  )} (${formatTimestampAgo(
                                    item.has_order
                                      .shipping_status_reached_at_buyers_inventory
                                  )}
                                  )`}
                                  TransitionComponent={Zoom}
                                  arrow
                                  placement="top"
                                >
                                  <Step>
                                    <StepLabel>
                                      {"Reached at buyer's inventory"}
                                    </StepLabel>
                                  </Step>
                                </Tooltip>
                                <Tooltip
                                  title={`${formatTimestamp(
                                    item.has_order
                                      .shipping_status_out_for_delivery
                                  )} (${formatTimestampAgo(
                                    item.has_order
                                      .shipping_status_out_for_delivery
                                  )}
                                  )`}
                                  TransitionComponent={Zoom}
                                  arrow
                                  placement="top"
                                >
                                  <Step>
                                    <StepLabel>{"Out for Delivery"}</StepLabel>
                                  </Step>
                                </Tooltip>
                                <Tooltip
                                  title={`${formatTimestamp(
                                    item.has_order.shipping_status_delivered
                                  )} (${formatTimestampAgo(
                                    item.has_order.shipping_status_delivered
                                  )}
                                  )`}
                                  TransitionComponent={Zoom}
                                  arrow
                                  placement="top"
                                >
                                  <Step>
                                    <StepLabel>{"Delivered"}</StepLabel>
                                  </Step>
                                </Tooltip>
                              </Stepper>
                            </Box>
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
                          <ArrowBack sx={{ mr: 1 }} /> Back
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

export default OrderDetails;
