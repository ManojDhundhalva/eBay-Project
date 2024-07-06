import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  MenuItem,
  Select,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Zoom,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import axios from "axios";

const ImgUrl = `https://t3.ftcdn.net/jpg/05/15/95/32/360_F_515953296_4OTDJFNzT9YmriBZwR688gsWzLFSyc1u.webp`;
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
        order.products?.every(
          (product) => product.has_order.shipping_status_order_placed !== null
        )
      ) {
        step = 1;
      }
      if (
        order.products?.every(
          (product) => product.has_order.shipping_status_order_shipped !== null
        )
      ) {
        step = 2;
      }
      if (
        order.products?.every(
          (product) =>
            product.has_order.shipping_status_reached_at_buyers_inventory !==
            null
        )
      ) {
        step = 3;
      }
      if (
        order.products?.every(
          (product) =>
            product.has_order.shipping_status_out_for_delivery !== null
        )
      ) {
        step = 4;
      }
      if (
        order.products?.every(
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
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/order?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      console.log("results.data", results.data);
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
            backgroundColor: "#fafaff",
            width: "100%",
            height: "100%",
            borderRadius: "30px",
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
            {myOrderList?.map((item, index) => (
              <>
                <Grid
                  padding={2}
                  key={index}
                  sx={{
                    backgroundColor: "ghostwhite",
                    borderRadius: "30px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                    // boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                  }}
                >
                  <Grid
                    padding={4}
                    sx={{
                      backgroundColor: "lavender",
                      borderRadius: "16px",
                      boxShadow:
                        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                    }}
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
                        <Chip
                          label={"Pending"}
                          sx={{ backgroundColor: "#023e8a", color: "white" }}
                        />
                      ) : (
                        <Chip
                          label={"Completed"}
                          sx={{ backgroundColor: "#036666", color: "white" }}
                        />
                      )}
                    </Grid>
                    <Grid container padding={2} margin={0}>
                      <Grid xs={2} container alignItems="center">
                        <Typography fontWeight="bold">Order id</Typography>
                      </Grid>
                      <Grid container xs={10} alignItems="center">
                        <Typography fontWeight="bold">:&nbsp;&nbsp;</Typography>
                        <Typography fontWeight="bold" sx={{ color: "#495057" }}>
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
                        </Typography>
                      </Grid>
                      <Grid xs={2} container alignItems="center">
                        <Typography fontWeight="bold">
                          Shipping address
                        </Typography>
                      </Grid>
                      <Grid xs={10} container alignItems="center">
                        <Typography fontWeight="bold">:</Typography>
                        <Typography
                          fontWeight="bold"
                          sx={{ px: 2, color: "#495057" }}
                        >
                          {item.order_shipping_location}
                        </Typography>
                      </Grid>
                      <Grid xs={2} container alignItems="center">
                        <Typography fontWeight="bold">
                          Contact Number
                        </Typography>
                      </Grid>
                      <Grid xs={10} container alignItems="center">
                        <Typography fontWeight="bold">:</Typography>
                        <Typography
                          fontWeight="bold"
                          sx={{ px: 2, color: "#495057" }}
                        >
                          (+91) {item.order_shipping_address_mobile_number}
                        </Typography>
                      </Grid>
                      <Grid xs={2} container alignItems="center">
                        <Typography fontWeight="bold">Ordered Date</Typography>
                      </Grid>
                      <Grid xs={10} container alignItems="center">
                        <Typography fontWeight="bold">:</Typography>
                        <Typography
                          fontWeight="bold"
                          sx={{ px: 2, color: "#495057" }}
                        >
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
                      {steps?.map((label, index) => (
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
                  <Grid
                    id="style-2"
                    margin={0}
                    padding={1}
                    sx={{
                      backgroundColor: "lavender",
                      borderRadius: "20px",
                      overflowX: "auto",
                      overflowY: "hidden",
                      whiteSpace: "nowrap",
                      boxShadow:
                        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                    }}
                  >
                    {item.products?.map((product, index) => (
                      <>
                        <Grid
                          key={index}
                          padding={1}
                          margin={0}
                          sx={{
                            display: "inline-block",
                            transition: "transform 0.15s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <img
                            src={product.product_image[0]}
                            alt="product_image"
                            onClick={() => {
                              navigate(
                                `/product-details?id=${product.has_order.has_order_product_id}`
                              );
                            }}
                            onError={(e) => {
                              e.target.src = ImgUrl;
                            }}
                            style={{
                              width: 200,
                              height: 200,
                              display: "inline-block",
                              objectFit: "contain",
                              backgroundColor: "#F2F2F2",
                              borderRadius: "16px",
                              cursor: "pointer",
                              boxShadow:
                                "rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
                            }}
                          />
                        </Grid>
                      </>
                    ))}
                  </Grid>
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
    </>
  );
}

export default Order;
