import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderDetails() {
  const [orderDetails, setOrderDetails] = useState({});

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
        )}&orderId=${window.localStorage.getItem("order-id")}`,
        {
          headers,
        }
      );
      console.log(results.data);
      setOrderDetails(results.data);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <>
      <h1>OrderDetails</h1>
      <h1>
        {window.localStorage.getItem("order-id") == null
          ? "NULL"
          : window.localStorage.getItem("order-id")}
      </h1>
    </>
  );
}

export default OrderDetails;
