import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

function DisplayProduct() {
  const [allProduct, setAllProduct] = useState([]);
  const { LogOut } = useAuth();

  const getAllProducts = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/product?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setAllProduct(results.data);
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("role") === "user") {
      getAllProducts();
    }
  }, []);

  return (
    <>
      <h1>DisplayProduct</h1>
      <Grid
        container
        spacing={2}
        style={{ margin: "0 auto", maxWidth: "1300px" }}
      >
        {allProduct.map((data, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={index}
            style={{ margin: "0 auto" }}
          >
            <ProductCard product={data} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default DisplayProduct;
