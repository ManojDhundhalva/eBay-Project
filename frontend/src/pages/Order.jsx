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
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = [
  "order placed",
  "order shipped",
  "reached at your's inventory",
  "Out for Delivery",
  "Delivered",
];

function Order() {
  const { orderList } = useProduct();

  const navigate = useNavigate();

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
                      {/* Repeat this section for each item */}
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
                                    Order id : {item.order_buyer_id}
                                  </Typography>
                                  <Typography variant="body2" gutterBottom>
                                    Tracking id : {item.tracking_id}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
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
                            {item.product.map((image, index) => (
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
                                activeStep={
                                  item.shipping_status_order_placed !== null
                                    ? 1
                                    : item.shipping_status_order_shipped !==
                                      null
                                    ? 2
                                    : item.shipping_status_reached_at_buyers_inventory !==
                                      null
                                    ? 3
                                    : item.shipping_status_out_for_delivery !==
                                      null
                                    ? 4
                                    : item.shipping_status_delivered !== null
                                    ? 5
                                    : 6
                                }
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
