import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { toast } from "react-hot-toast";

function ReceivedQueue() {
  const [allQueues, setAllQueues] = useState([]);

  const getAllQueuesOfShipper = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/shipper?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      console.log(results.data);
      setAllQueues(results.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleDeliverProducts = async () => {
    const productIdsArray = allQueues.flatMap((item) =>
      item.products.map((product) => product.product_id)
    );

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      toast.promise(
        axios.post(
          `http://localhost:8000/api/v1/shipper?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
          { productIdsArray },
          { headers }
        ),
        {
          loading: "Delivering Rroducts...",
          success: "Order is delivered!",
          error: (err) => `Error, while delivering orders: ${err.message}`,
        }
      );
    } catch (err) {
      console.error("Error shipping orders:", err);
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("role") === "shipper") {
      getAllQueuesOfShipper();
    }
  }, []);

  const generateRowsWithIndex = (rows) => {
    return rows.map((row, index) => {
      return { ...row, index: index + 1 };
    });
  };

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

  const columns = [
    {
      field: "index",
      headerName: "Index",
      type: "number",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "seller_user_name",
      headerName: "Seller Name",
      width: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "product_name",
      headerName: "Product Name",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          // onClick={() => handleProductClick(params)}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "product_price",
      headerName: "Product Price(INR)",
      type: "number",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "seller_city",
      headerName: "Seller City",
      type: "number",
      width: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "has_order_product_quantity",
      headerName: "Ordered Quantity",
      type: "number",
      width: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "product_tracking_id",
      headerName: "Product Tracking id",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "product_id",
      headerName: "Product Id",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "seller_contact_number",
      headerName: "(+91)Contact Number",
      type: "number",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <>
      <h1>All Ordered Queues({allQueues.length})</h1>
      {allQueues.map((item, index) => (
        <Card key={index} sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              &#x20b9; {item.payment_amount}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              Order id : {item.order_id}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Transaction Id : {item.order_transaction_id}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Order Placed Date :{" "}
              {new Date(item.order_timestamp).toLocaleDateString()} (
              {formatTimestamp(item.order_timestamp)})
            </Typography>
            <Typography variant="body2">
              First Name : {item.order_buyer_first_name}
            </Typography>
            <Typography variant="body2">
              Last Name : {item.order_buyer_last_name}
            </Typography>
            <Typography variant="body2">
              Buyer Id : {item.order_buyer_id}
            </Typography>
            <Typography variant="body2">
              Shipping Address : {item.order_shipping_location}
            </Typography>
            <Typography variant="body2">
              Contact Number : (+91){item.order_shipping_address_mobile_number}
            </Typography>
            <Typography variant="body2">
              Pincode : {item.order_shipping_address_pincode}
            </Typography>
            <Typography variant="body2">
              City : {item.order_shipping_address_city}
            </Typography>
            <Typography variant="body2">
              State : {item.order_shipping_address_state}
            </Typography>
            <Typography variant="body2">
              Country : {item.order_shipping_address_country}
            </Typography>
          </CardContent>
          <CardActions>
            <div style={{ width: "100%" }}>
              <DataGrid
                rows={generateRowsWithIndex(item.products)}
                columns={columns}
                pageSize={3}
                autoHeight
              />
              <Button variant="contained" onClick={handleDeliverProducts}>
                Deliver
              </Button>
            </div>
          </CardActions>
        </Card>
      ))}
    </>
  );
}

export default ReceivedQueue;
