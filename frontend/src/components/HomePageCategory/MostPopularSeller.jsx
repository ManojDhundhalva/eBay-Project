import React, { useState, useEffect, useRef } from "react";
import { Grid, Typography, IconButton, Button, Skeleton } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useAuth } from "../../context/auth";
import ProductCard from "../ProductCard";
import axios from "axios";

function MostPopularSeller() {
  const [allProduct, setAllProduct] = useState([]);
  const scrollBoxRef = useRef(null);
  const { LogOut } = useAuth();

  const scrollLeft = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

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
      <Grid item container margin={0} padding={0}>
        <Grid
          item
          xs={12}
          container
          margin={0}
          padding={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold">
            Most Popular Seller
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{
              textDecoration: "underline",
              fontWeight: "bold",
              borderRadius: "10px",
              color: "black",
            }}
          >
            See All
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          container
          margin={0}
          padding={2}
          sx={{ position: "relative" }}
        >
          <Grid
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              zIndex: 2,
            }}
          >
            <IconButton
              onClick={scrollLeft}
              sx={{
                color: "#032174",
                backgroundColor: "#F5F5F5",
              }}
              aria-label="left"
            >
              <ArrowBackIosRoundedIcon />
            </IconButton>
          </Grid>
          <Grid
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              zIndex: 2,
            }}
          >
            <IconButton
              onClick={scrollRight}
              sx={{
                color: "#032174",
                backgroundColor: "#F5F5F5",
                zIndex: 9999,
              }}
              aria-label="right"
            >
              <ArrowForwardIosRoundedIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            ref={scrollBoxRef}
            xs={12}
            margin={0}
            padding={0}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "16px",
              overflowX: "auto",
              overflowY: "hidden",
              whiteSpace: "nowrap",
              "&::-webkit-scrollbar": {
                display: "none", // Hide scrollbar in webkit browsers (Chrome, Safari)
              },
              msOverflowStyle: "none", // Hide scrollbar in IE and Edge
              scrollbarWidth: "none", // Hide scrollbar in Firefox
            }}
          >
            {allProduct.length === 0
              ? Array.from({ length: 10 }).map((_, index) => (
                  <Grid
                    key={index}
                    margin={0}
                    paddingRight={2}
                    sx={{ display: "inline-block" }}
                  >
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      sx={{
                        width: 250,
                        height: 354,
                      }}
                    />
                  </Grid>
                ))
              : allProduct.map((data, index) => (
                  <Grid
                    key={index}
                    margin={0}
                    padding={2}
                    sx={{ display: "inline-block" }}
                  >
                    <ProductCard product={data} />
                  </Grid>
                ))}
            {allProduct.map((data, index) => (
              <Grid
                key={index}
                margin={0}
                padding={2}
                sx={{ display: "inline-block" }}
              >
                <ProductCard product={data} />
              </Grid>
            ))}
            {allProduct.map((data, index) => (
              <Grid
                key={index}
                margin={0}
                padding={2}
                sx={{ display: "inline-block" }}
              >
                <ProductCard product={data} />
              </Grid>
            ))}
            {allProduct.map((data, index) => (
              <Grid
                key={index}
                margin={0}
                padding={2}
                sx={{ display: "inline-block" }}
              >
                <ProductCard product={data} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default MostPopularSeller;
