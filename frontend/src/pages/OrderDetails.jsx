import React, { useEffect, useState } from "react";
import {
  Button,
  Step,
  Stepper,
  StepLabel,
  Grid,
  Rating,
  Typography,
  Chip,
  Tooltip,
  Divider,
  Zoom,
  Breadcrumbs,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import moment from "moment";

const EmptyCircleStepIcon = () => {
  return <CircleOutlinedIcon sx={{ color: "#03045E" }} />;
};
const CircleStepIcon = () => {
  return <CircleIcon sx={{ color: "#03045E" }} />;
};
const CheckedStepIcon = () => {
  return <CheckCircleRoundedIcon sx={{ color: "#03045E" }} />;
};

const ImgUrl = `https://t3.ftcdn.net/jpg/05/15/95/32/360_F_515953296_4OTDJFNzT9YmriBZwR688gsWzLFSyc1u.webp`;

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
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/order/order-details?username=${window.localStorage.getItem(
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
      <Grid margin={0} padding={4} sx={{ userSelect: "none" }}>
        <Grid
          margin={0}
          padding={0}
          sx={{
            backgroundColor: "lavender",
            width: "100%",
            height: "100%",
            borderRadius: "20px",
          }}
        >
          <Grid
            container
            margin={0}
            padding={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight="bold">
              Order Details
            </Typography>
            <Typography fontWeight="bold">
              {orderDetails.products?.length} item
              {orderDetails.products?.length > 1 ? "s" : ""}
            </Typography>
          </Grid>
          <Grid margin={0} paddingX={4}>
            <hr className="mt-4" />
          </Grid>
          <Grid margin={0} padding={4}>
            <Grid
              container
              margin={0}
              padding={4}
              sx={{
                backgroundColor: "ghostwhite",
                borderRadius: "20px",
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
              }}
            >
              <Grid
                xs={12}
                margin={0}
                padding={2}
                sx={{ borderRadius: "20px" }}
              >
                <Typography variant="h3" fontWeight="bold">
                  <span style={{ fontFamily: "Roboto", fontWeight: "normal" }}>
                    ₹
                  </span>{" "}
                  {orderDetails.payment_amount}
                </Typography>
              </Grid>
              <Grid
                container
                xs={12}
                margin={0}
                padding={4}
                sx={{ backgroundColor: "lavender", borderRadius: "20px" }}
              >
                <Grid xs={2}>
                  <Typography fontWeight="bold">Order id</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.order_id}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">Payment type</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.payment_type}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">First Name</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.order_buyer_first_name}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">Last Name</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.order_buyer_last_name}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">Ordered Date</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {formatTimestamp(orderDetails.order_timestamp)} (
                    {formatTimestampAgo(orderDetails.order_timestamp)})
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">Contact Number</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    (+91) {orderDetails.order_shipping_address_mobile_number}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">Shipping address</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.order_shipping_location}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">Pincode</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.order_shipping_address_pincode}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">City</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.order_shipping_address_city}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">State</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.order_shipping_address_state}
                  </Typography>
                </Grid>
                <Grid xs={2}>
                  <Typography fontWeight="bold">Country</Typography>
                </Grid>
                <Grid container xs={10}>
                  <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#495057" }}>
                    {orderDetails.order_shipping_address_country}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid margin={0} paddingX={4} paddingY={0}>
            <hr className="my-4" />
          </Grid>
          <Grid margin={0} padding={4}>
            <Grid margin={0} padding={0}>
              {orderDetails.products?.map((item, index) => (
                <Grid key={index}>
                  <Grid
                    margin={0}
                    padding={0}
                    sx={{
                      backgroundColor: "#fbfaff",
                      borderRadius: "30px",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      // boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
                    }}
                  >
                    <Grid container>
                      <Grid
                        xs={4}
                        margin={0}
                        padding={4}
                        paddingRight={0}
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={item.product_image[0]}
                          alt="product_image"
                          onClick={() => {
                            navigate(
                              `/product-details?id=${item.has_order.has_order_product_id}`
                            );
                          }}
                          onError={(e) => {
                            e.target.src = ImgUrl;
                          }}
                          style={{
                            width: 400,
                            height: 400,
                            objectFit: "contain",
                            backgroundColor: "#F2F2F2",
                            borderRadius: "16px",
                            cursor: "pointer",
                            boxShadow:
                              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                            // boxShadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
                            // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                          }}
                        />
                      </Grid>
                      <Grid
                        xs={8}
                        padding={4}
                        margin={0}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Grid
                          margin={0}
                          paddingX={4}
                          paddingY={2}
                          container
                          alignItems="center"
                          sx={{
                            backgroundColor: "lavender",
                            borderRadius: "20px",
                            boxShadow:
                              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                          }}
                        >
                          <Grid
                            container
                            xs={12}
                            justifyContent="space-between"
                          >
                            <Grid container xs={8}>
                              <Grid container xs={12} margin={0} padding={0}>
                                <Typography variant="h4" fontWeight="bold">
                                  {item.product.product_title}
                                </Typography>
                              </Grid>
                              <Grid container xs={12} paddingY={1} margin={0}>
                                <Grid margin={0} padding={0}>
                                  <Rating
                                    name="read-only"
                                    value={item.product.product_avg_rating}
                                    readOnly
                                    precision={0.1}
                                    emptyIcon={<StarRoundedIcon />}
                                    icon={<StarRoundedIcon />}
                                  />
                                </Grid>
                                <Grid margin={0} paddingX={1}>
                                  <Typography fontWeight="bold">
                                    {item.product.product_avg_rating}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid xs={4}>
                              <Grid
                                container
                                justifyContent="flex-end"
                                alignItems="flex-start"
                              >
                                <Chip
                                  sx={{ p: 1, fontWeight: "bold" }}
                                  icon={<VisibilityRoundedIcon />}
                                  label={item.product.product_watch_count}
                                />
                              </Grid>
                              <Grid
                                container
                                justifyContent="flex-end"
                                alignItems="flex-start"
                              >
                                <Typography fontWeight="bold">
                                  {formatTimestampAgo(
                                    item.product.product_timestamp
                                  )}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid xs={12} margin={0} padding={0}>
                            <Typography
                              variant="h4"
                              fontWeight="bold"
                              sx={{ px: 2 }}
                            >
                              &#x20b9; {item.product.product_price}
                            </Typography>
                          </Grid>
                          <Grid
                            container
                            margin={0}
                            padding={2}
                            sx={{
                              backgroundColor: "ghostwhite",
                              borderRadius: "16px",
                            }}
                          >
                            <Grid container xs={4} alignItems="center">
                              <Typography fontWeight="bold">
                                Product id
                              </Typography>
                            </Grid>
                            <Grid container xs={8} alignItems="center">
                              <Typography fontWeight="bold">
                                :&nbsp;&nbsp;
                              </Typography>
                              <Tooltip
                                title="See Details"
                                onClick={() => {
                                  navigate(
                                    `/product-details?id=${item.has_order.has_order_product_id}`
                                  );
                                }}
                                TransitionComponent={Zoom}
                                arrow
                                placement="top"
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
                                <Button
                                  variant="text"
                                  sx={{
                                    color: "black",
                                    textDecoration: "underline",
                                    fontWeight: "bold",
                                    fontSize: 16,
                                  }}
                                >
                                  {item.has_order.has_order_product_id}
                                </Button>
                              </Tooltip>
                            </Grid>
                            {/* <Grid xs={4}>
                              <Typography fontWeight="bold">
                                Product tracking id
                              </Typography>
                            </Grid>
                            <Grid container xs={8}>
                              <Typography fontWeight="bold">:</Typography>
                              <Typography fontWeight="bold" sx={{ px: 2 }}>
                                {item.has_order.tracking_id}
                              </Typography>
                            </Grid> */}
                            <Grid xs={4}>
                              <Typography fontWeight="bold">
                                Ordered Quantity
                              </Typography>
                            </Grid>
                            <Grid container xs={8}>
                              <Typography fontWeight="bold">:</Typography>
                              <Typography fontWeight="bold" sx={{ px: 2 }}>
                                {item.has_order.has_order_product_quantity}
                              </Typography>
                            </Grid>
                            <Grid xs={12} margin={0} padding={0}>
                              <Grid
                                container
                                margin={0}
                                paddingTop={2}
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Grid>
                                  <Typography fontWeight="bold">
                                    Category &#x2022;
                                  </Typography>
                                </Grid>
                                <Grid sx={{ px: 1 }}>
                                  <Breadcrumbs
                                    aria-label="breadcrumb"
                                    separator={
                                      <NavigateNextIcon fontSize="small" />
                                    }
                                  >
                                    <Chip
                                      sx={{ backgroundColor: "#e9ecef" }}
                                      label={
                                        <Typography
                                          onClick={() => {
                                            navigate(
                                              `/category?category=${encodeURIComponent(
                                                item.product
                                                  .product_category_name
                                              )}`
                                            );
                                          }}
                                          sx={{
                                            color: "black",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            textDecorationColor: "grey",
                                            "&:hover": {
                                              textDecorationColor: "black",
                                            },
                                          }}
                                        >
                                          {item.product.product_category_name}
                                        </Typography>
                                      }
                                    />
                                    {item.product.product_sub_category_name && (
                                      <Chip
                                        sx={{ backgroundColor: "#e9ecef" }}
                                        label={
                                          <Typography
                                            onClick={() => {
                                              navigate(
                                                `/category?category=${encodeURIComponent(
                                                  item.product
                                                    .product_category_name
                                                )}&sub_category=${encodeURIComponent(
                                                  item.product
                                                    .product_sub_category_name
                                                )}`
                                              );
                                            }}
                                            sx={{
                                              color: "black",
                                              cursor: "pointer",
                                              textDecoration: "underline",
                                              textDecorationColor: "grey",
                                              "&:hover": {
                                                textDecorationColor: "black",
                                              },
                                            }}
                                          >
                                            {
                                              item.product
                                                .product_sub_category_name
                                            }
                                          </Typography>
                                        }
                                      />
                                    )}
                                    {item.product
                                      .product_sub_sub_category_name && (
                                      <Chip
                                        sx={{ backgroundColor: "#e9ecef" }}
                                        label={
                                          <Typography
                                            onClick={() => {
                                              navigate(
                                                `/category?category=${encodeURIComponent(
                                                  item.product
                                                    .product_category_name
                                                )}&sub_category=${encodeURIComponent(
                                                  item.product
                                                    .product_sub_category_name
                                                )}&sub_sub_category=${encodeURIComponent(
                                                  item.product
                                                    .product_sub_sub_category_name
                                                )}`
                                              );
                                            }}
                                            sx={{
                                              color: "black",
                                              cursor: "pointer",
                                              textDecoration: "underline",
                                              textDecorationColor: "grey",
                                              "&:hover": {
                                                textDecorationColor: "black",
                                              },
                                            }}
                                          >
                                            {
                                              item.product
                                                .product_sub_sub_category_name
                                            }
                                          </Typography>
                                        }
                                      />
                                    )}
                                  </Breadcrumbs>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} margin={0} padding={6} paddingTop={8}>
                      <Stepper
                        activeStep={
                          item.has_order.shipping_status_delivered !== null
                            ? 5
                            : item.has_order
                                .shipping_status_out_for_delivery !== null
                            ? 4
                            : item.has_order
                                .shipping_status_reached_at_buyers_inventory !==
                              null
                            ? 3
                            : item.has_order.shipping_status_order_shipped !==
                              null
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
                          )})`}
                          TransitionComponent={Zoom}
                          arrow
                          placement="top"
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
                          <Step>
                            <StepLabel StepIconComponent={CheckedStepIcon}>
                              {"Order placed"}
                            </StepLabel>
                          </Step>
                        </Tooltip>
                        <Tooltip
                          title={
                            item.has_order.shipping_status_order_shipped ===
                            null
                              ? "Pending"
                              : `${formatTimestamp(
                                  item.has_order.shipping_status_order_shipped
                                )} (${formatTimestampAgo(
                                  item.has_order.shipping_status_order_shipped
                                )})`
                          }
                          TransitionComponent={Zoom}
                          arrow
                          placement="top"
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
                          <Step>
                            <StepLabel
                              StepIconComponent={
                                item.has_order.shipping_status_order_shipped !==
                                null
                                  ? CheckedStepIcon
                                  : CircleStepIcon
                              }
                            >
                              {"Order shipped"}
                            </StepLabel>
                          </Step>
                        </Tooltip>
                        <Tooltip
                          title={
                            item.has_order
                              .shipping_status_reached_at_buyers_inventory ===
                            null
                              ? "Pending"
                              : `${formatTimestamp(
                                  item.has_order
                                    .shipping_status_reached_at_buyers_inventory
                                )} (${formatTimestampAgo(
                                  item.has_order
                                    .shipping_status_reached_at_buyers_inventory
                                )})`
                          }
                          TransitionComponent={Zoom}
                          arrow
                          placement="top"
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
                          <Step>
                            <StepLabel
                              StepIconComponent={
                                item.has_order
                                  .shipping_status_reached_at_buyers_inventory !==
                                null
                                  ? CheckedStepIcon
                                  : item.has_order
                                      .shipping_status_order_shipped !== null
                                  ? CircleStepIcon
                                  : EmptyCircleStepIcon
                              }
                            >
                              {"Reached at buyer's inventory"}
                            </StepLabel>
                          </Step>
                        </Tooltip>
                        <Tooltip
                          title={
                            item.has_order.shipping_status_out_for_delivery ===
                            null
                              ? "Pending"
                              : `${formatTimestamp(
                                  item.has_order
                                    .shipping_status_out_for_delivery
                                )} (${formatTimestampAgo(
                                  item.has_order
                                    .shipping_status_out_for_delivery
                                )})`
                          }
                          TransitionComponent={Zoom}
                          arrow
                          placement="top"
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
                          <Step>
                            <StepLabel
                              StepIconComponent={
                                item.has_order
                                  .shipping_status_out_for_delivery !== null
                                  ? CheckedStepIcon
                                  : item.has_order
                                      .shipping_status_reached_at_buyers_inventory !==
                                    null
                                  ? CircleStepIcon
                                  : EmptyCircleStepIcon
                              }
                            >
                              {"Out for Delivery"}
                            </StepLabel>
                          </Step>
                        </Tooltip>
                        <Tooltip
                          title={
                            item.has_order.shipping_status_delivered === null
                              ? "Pending"
                              : `${formatTimestamp(
                                  item.has_order.shipping_status_delivered
                                )} (${formatTimestampAgo(
                                  item.has_order.shipping_status_delivered
                                )})`
                          }
                          TransitionComponent={Zoom}
                          arrow
                          placement="top"
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
                          <Step>
                            <StepLabel
                              StepIconComponent={
                                item.has_order.shipping_status_delivered !==
                                null
                                  ? CheckedStepIcon
                                  : item.has_order
                                      .shipping_status_out_for_delivery !== null
                                  ? CircleStepIcon
                                  : EmptyCircleStepIcon
                              }
                            >
                              {"Delivered"}
                            </StepLabel>
                          </Step>
                        </Tooltip>
                      </Stepper>
                    </Grid>
                    <Grid margin={0} padding={4}>
                      <Grid
                        container
                        margin={0}
                        padding={4}
                        sx={{
                          backgroundColor: "lavender",
                          borderRadius: "20px",
                          boxShadow:
                            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                        }}
                      >
                        <Grid xs={12} margin={0} padding={2}>
                          <Typography variant="h5" fontWeight="bold">
                            Summary
                          </Typography>
                        </Grid>
                        <Grid
                          container
                          margin={0}
                          padding={4}
                          sx={{
                            backgroundColor: "ghostwhite",
                            borderRadius: "20px",
                          }}
                        >
                          <Grid xs={4}>
                            <Typography fontWeight="bold">
                              Product Price
                            </Typography>
                          </Grid>
                          <Grid container xs={8}>
                            <Typography fontWeight="bold">:</Typography>
                            <Typography fontWeight="bold" sx={{ px: 2 }}>
                              &#x20b9; {item.product.product_price} (
                              {item.has_order.has_order_product_quantity} item
                              {item.has_order.has_order_product_quantity > 1
                                ? "s"
                                : ""}
                              )
                            </Typography>
                          </Grid>
                          <Grid xs={12}>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                          <Grid xs={4}>
                            <Typography fontWeight="bold">
                              Distance({"From " + item.seller_city})
                            </Typography>
                          </Grid>
                          <Grid container xs={8}>
                            <Typography fontWeight="bold">:</Typography>
                            <Typography fontWeight="bold" sx={{ px: 2 }}>
                              {Number(
                                item.has_order.has_order_distance
                              ).toFixed(2)}{" "}
                              KM
                            </Typography>
                          </Grid>
                          <Grid xs={4}>
                            <Typography fontWeight="bold">
                              Distance Charges
                            </Typography>
                          </Grid>
                          <Grid container xs={8}>
                            <Typography fontWeight="bold">:</Typography>
                            <Typography fontWeight="bold" sx={{ px: 2 }}>
                              &#x20b9;{" "}
                              {Number(
                                item.has_order.has_order_distance_charge
                              ).toFixed(2)}
                              ({process.env.REACT_APP_SHIPPING_CHARGES}
                              %)
                            </Typography>
                          </Grid>
                          <Grid xs={12}>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                          <Grid xs={4}>
                            <Typography fontWeight="bold">
                              eBay Charges
                            </Typography>
                          </Grid>
                          <Grid container xs={8}>
                            <Typography fontWeight="bold">:</Typography>
                            <Typography fontWeight="bold" sx={{ px: 2 }}>
                              &#x20b9;{" "}
                              {Number(
                                item.product.product_price *
                                  (item.has_order.has_order_ebay_charge / 100)
                              ).toFixed(2)}
                              ({item.has_order.has_order_ebay_charge}%)
                            </Typography>
                          </Grid>
                          <Grid xs={12}>
                            <hr />
                          </Grid>
                          <Grid xs={4}>
                            <Typography variant="h6" fontWeight="bold">
                              Total Amount
                            </Typography>
                          </Grid>
                          <Grid container xs={8}>
                            <Typography variant="h6" fontWeight="bold">
                              :
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              sx={{ px: 2 }}
                            >
                              &#x20b9;{" "}
                              {Number(
                                Number(
                                  item.product.product_price *
                                    item.has_order.has_order_product_quantity
                                ) +
                                  Number(
                                    item.has_order.has_order_distance_charge
                                  ) +
                                  Number(
                                    item.product.product_price *
                                      (item.has_order.has_order_ebay_charge /
                                        100)
                                  )
                              ).toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs={12}>
                    <hr className="my-4" />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
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
    </>
  );
}

export default OrderDetails;
