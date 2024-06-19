import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  MenuItem,
  Select,
  Chip,
  Typography,
  FormControl,
  InputLabel,
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
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HorizontalSilder from "../components/HorizontalSilder";
import axios from "axios";

const steps = [
  "Order placed",
  "Order shipped",
  "Reached at buyer's inventory",
  "Out for Delivery",
  "Delivered",
];

const EmptyCircleStepIcon = () => {
  return <CircleOutlinedIcon sx={{ color: "#03045E" }} />;
};
const CircleStepIcon = () => {
  return <CircleIcon sx={{ color: "#03045E" }} />;
};
const CheckedStepIcon = () => {
  return <CheckCircleRoundedIcon sx={{ color: "#03045E" }} />;
};

const sortByTimeNewestFirst = (data) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.order_timestamp);
    const dateB = new Date(b.order_timestamp);
    return dateB - dateA;
  });
};

const sortByTimeOldestFirst = (data) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.order_timestamp);
    const dateB = new Date(b.order_timestamp);
    return dateA - dateB;
  });
};

const filterByCompleted = (data, orderStepOfOrderId) => {
  if (!orderStepOfOrderId) return [];

  return data.filter((item) => {
    return orderStepOfOrderId[item.order_id] >= 5;
  });
};

const filterByPending = (data, orderStepOfOrderId) => {
  if (!orderStepOfOrderId) return [];

  return data.filter((item) => {
    return orderStepOfOrderId[item.order_id] < 5;
  });
};

function Order() {
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();
  const [orderStepOfOrderId, setOrderStepOfOrderId] = useState({});
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest First");

  const [myOrderList, setMyOrderList] = useState([]);

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
          (product) => product.has_order.shipping_status_order_placed !== null
        )
      ) {
        step = 1;
      }
      if (
        order.products.every(
          (product) => product.has_order.shipping_status_order_shipped !== null
        )
      ) {
        step = 2;
      }
      if (
        order.products.every(
          (product) =>
            product.has_order.shipping_status_reached_at_buyers_inventory !==
            null
        )
      ) {
        step = 3;
      }
      if (
        order.products.every(
          (product) =>
            product.has_order.shipping_status_out_for_delivery !== null
        )
      ) {
        step = 4;
      }
      if (
        order.products.every(
          (product) => product.has_order.shipping_status_delivered !== null
        )
      ) {
        step = 5;
      }
      newOrderStepOfOrderId[order.order_id] = step;
    });
    setOrderStepOfOrderId(newOrderStepOfOrderId);
  }, [orderList]);

  const getOrderList = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/order?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setOrderList(results.data);
      setMyOrderList(sortByTimeNewestFirst(results.data));
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  useEffect(() => {
    getOrderList();
  }, []);

  return (
    <>
      <Grid margin={0} paddingX={4} sx={{ userSelect: "none" }}>
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
            <Grid>
              <Typography variant="h4" fontWeight="bold">
                Order Details
              </Typography>
            </Grid>
            <Grid
              sx={{ display: "flex", alignItems: "center" }}
              padding={0}
              margin={0}
            >
              <Chip
                sx={{ mx: 1, fontWeight: "bold" }}
                label={`${myOrderList.length} item${
                  myOrderList.length > 1 ? "s" : ""
                }`}
                variant="outlined"
                color="primary"
              />
              <FormControl size="small" sx={{ mx: 1 }}>
                <InputLabel id="filter-label">Filter</InputLabel>
                <Select
                  labelId="filter-label-label"
                  id="filter-label"
                  value={filter}
                  label="Filter"
                  onChange={(e) => {
                    setFilter(e.target.value);
                  }}
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
                    minWidth: "140px",
                    borderRadius: 25,
                    fontWeight: "bold",
                  }}
                >
                  <MenuItem
                    value="All"
                    onClick={() => {
                      setMyOrderList(orderList);
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    value="Completed"
                    onClick={() => {
                      setSort("Newest First");
                      setMyOrderList(
                        filterByCompleted(
                          sortByTimeNewestFirst(orderList),
                          orderStepOfOrderId
                        )
                      );
                    }}
                  >
                    Completed
                  </MenuItem>
                  <MenuItem
                    value="Pending"
                    onClick={() => {
                      setSort("Newest First");
                      setMyOrderList(
                        filterByPending(
                          sortByTimeNewestFirst(orderList),
                          orderStepOfOrderId
                        )
                      );
                    }}
                  >
                    Pending
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ mx: 1 }}>
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select
                  labelId="sort-label-label"
                  id="sort-label"
                  value={sort}
                  label="Sort"
                  onChange={(e) => {
                    setSort(e.target.value);
                  }}
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
                    minWidth: "140px",
                    borderRadius: 25,
                    fontWeight: "bold",
                  }}
                >
                  <MenuItem
                    value="Newest First"
                    onClick={() => {
                      setMyOrderList(sortByTimeNewestFirst(myOrderList));
                    }}
                  >
                    Newest First
                  </MenuItem>
                  <MenuItem
                    value="Oldest First"
                    onClick={() => {
                      setMyOrderList(sortByTimeOldestFirst(myOrderList));
                    }}
                  >
                    Oldest First
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid margin={0} paddingX={4} paddingY={2}>
            <hr className="my-4" />
            {myOrderList.map((item, index) => (
              <>
                <Grid
                  padding={2}
                  key={index}
                  sx={{ backgroundColor: "ghostwhite", borderRadius: "20px" }}
                >
                  <Grid
                    padding={4}
                    sx={{ backgroundColor: "lightblue", borderRadius: "16px" }}
                  >
                    <Grid
                      padding={2}
                      margin={0}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        &#x20b9; {Number(item.payment_amount).toFixed(2)}
                      </Typography>
                      {orderStepOfOrderId[item.order_id] < 5 ? (
                        <Chip label={"Pending"} color="primary" />
                      ) : (
                        <Chip label={"Completed"} color="success" />
                      )}
                    </Grid>
                    <Grid container padding={2} margin={0}>
                      <Grid
                        xs={2}
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{ display: "flex" }}
                      >
                        <Typography fontWeight="bold">Order id:</Typography>
                      </Grid>
                      <Grid xs={10}>
                        <Tooltip
                          title="See Details"
                          onClick={() => {
                            navigate(`/order-details?id=${item.order_id}`);
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
                            {item.order_id}
                          </Button>
                        </Tooltip>
                      </Grid>
                      <Grid
                        xs={2}
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{ display: "flex" }}
                      >
                        <Typography fontWeight="bold">
                          Shipping address :
                        </Typography>
                      </Grid>
                      <Grid xs={10}>
                        <Typography>{item.order_shipping_location}</Typography>
                      </Grid>
                      <Grid
                        xs={2}
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{ display: "flex" }}
                      >
                        <Typography fontWeight="bold">
                          Contact Number :
                        </Typography>
                      </Grid>
                      <Grid xs={10}>
                        <Typography>
                          (+91) {item.order_shipping_address_mobile_number}
                        </Typography>
                      </Grid>
                      <Grid
                        xs={2}
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{ display: "flex" }}
                      >
                        <Typography fontWeight="bold">
                          Ordered Date :
                        </Typography>
                      </Grid>
                      <Grid xs={10}>
                        <Typography>
                          {new Date(item.order_timestamp).toLocaleDateString()}{" "}
                          ({formatTimestamp(item.order_timestamp)})
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid padding={6} margin={0}>
                    <Stepper
                      activeStep={orderStepOfOrderId[item.order_id]}
                      alternativeLabel
                    >
                      {steps.map((label, index) => (
                        <Step key={index}>
                          <StepLabel
                            StepIconComponent={
                              orderStepOfOrderId[item.order_id] === index
                                ? CircleStepIcon
                                : orderStepOfOrderId[item.order_id] > index
                                ? CheckedStepIcon
                                : EmptyCircleStepIcon
                            }
                          >
                            {label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Grid>
                  <HorizontalSilder
                    images={item.products[0].product_image}
                    id={item.products[0].has_order.has_order_product_id}
                  />
                </Grid>
                <Grid>
                  <hr className="my-5" />
                </Grid>
              </>
            ))}
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
      {/* <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
        <Grid
          container
          className="p-4 h-100"
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
                                        navigate(
                                          `/order-details?id=${item.order_id}`
                                        );
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
                                    {Number(item.payment_amount).toFixed(2)}
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
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section> */}
    </>
  );
}

export default Order;
