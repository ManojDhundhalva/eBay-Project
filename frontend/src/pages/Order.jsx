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
import { useProduct } from "../context/product";
import { Link, useNavigate } from "react-router-dom";

const steps = [
  "Order placed",
  "Order shipped",
  "Reached at buyer's inventory",
  "Out for Delivery",
  "Delivered",
];

function Order() {
  const { orderList } = useProduct();
  const navigate = useNavigate();
  const [orderStepOfOrderId, setOrderStepOfOrderId] = useState({});

  const formatTimestamp = (timestamp) => {
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

  useEffect(() => {
    // Assuming orderList is an array of orders
    const newOrderStepOfOrderId = {};
    orderList.forEach((order) => {
      let step = 0;
      if (
        order.products.every(
          (product) => product.shipping_status_order_placed !== null
        )
      ) {
        step = 1;
      }
      if (
        order.products.every(
          (product) => product.shipping_status_order_shipped !== null
        )
      ) {
        step = 2;
      }
      if (
        order.products.every(
          (product) =>
            product.shipping_status_reached_at_buyers_inventory !== null
        )
      ) {
        step = 3;
      }
      if (
        order.products.every(
          (product) => product.shipping_status_out_for_delivery !== null
        )
      ) {
        step = 4;
      }
      if (
        order.products.every(
          (product) => product.shipping_status_delivered !== null
        )
      ) {
        step = 5;
      }
      newOrderStepOfOrderId[order.order_id] = step;
    });
    setOrderStepOfOrderId(newOrderStepOfOrderId);
  }, [orderList]);

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
                          {orderList.length} items
                        </Typography>
                      </div>
                      <hr className="my-4" />
                      {orderList.map((item, index) => (
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
                                    variant="subtitle1"
                                    component="div"
                                  >
                                    Order id :{" "}
                                    <span
                                      onClick={() => {
                                        window.localStorage.setItem(
                                          "order-id",
                                          item.order_id
                                        );
                                        navigate("/order-details");
                                      }}
                                      style={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {item.order_id}
                                    </span>
                                  </Typography>
                                  <Typography variant="body2" gutterBottom>
                                    Shipping address :{" "}
                                    {item.order_shipping_location}
                                  </Typography>
                                  <Typography variant="body2" gutterBottom>
                                    Contact Number : (+91)
                                    {item.order_shipping_address_mobile_number}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Ordered Date :{" "}
                                    {new Date(
                                      item.order_timestamp
                                    ).toLocaleDateString()}{" "}
                                    ({formatTimestamp(item.order_timestamp)})
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    component="div"
                                  >
                                    &#x20b9;{" "}
                                    {Number(
                                      Number(
                                        Number(item.order_shipping_cost) +
                                          Number(
                                            item.order_shipping_cost *
                                              (process.env
                                                .REACT_APP_EBAY_CHARGES /
                                                100)
                                          )
                                      ) + Number(item.order_total_cost)
                                    ).toFixed(2)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            {item.products.map((image, index) => (
                              <Grid key={index} item md={2} lg={2} xl={2}>
                                <CardMedia
                                  width={50}
                                  height={100}
                                  component="img"
                                  src={image.product_image[0]}
                                  alt="Product Image"
                                  className="rounded-3"
                                />
                              </Grid>
                            ))}
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ width: "100%" }}>
                              <Stepper
                                activeStep={orderStepOfOrderId[item.order_id]}
                                alternativeLabel
                              >
                                {steps.map((label) => (
                                  <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                  </Step>
                                ))}
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

export default Order;
