import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

function AllProducts() {
  const [allProducts, setAllProducts] = useState([]);

  const getAllProductsOfInventory = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/inventory?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setAllProducts(results.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    getAllProductsOfInventory();
  }, []);

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
      field: "product_available_quantity",
      headerName: "Quantity",
      type: "number",
      width: 140,
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
    {
      field: "product_timestamp",
      headerName: "Product Timestamp",
      width: 200,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        const timestamp = new Date(params);
        const formattedDate = timestamp.toLocaleString("en-GB", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        });
        return formattedDate;
      },
    },
  ];

  return (
    <>
      <h1>All Products</h1>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          className="custom-data-grid"
          rows={allProducts}
          columns={columns}
          pageSize={5}
        />
      </div>
    </>
  );
}

export default AllProducts;
