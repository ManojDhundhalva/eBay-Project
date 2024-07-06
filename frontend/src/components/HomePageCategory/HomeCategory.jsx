import React, { useRef, useState, useEffect } from "react";
import { Grid, Typography, IconButton, Button, Skeleton } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CategoryCard from "../CategoryCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const image2 =
  "https://cdn.pixabay.com/photo/2021/10/11/23/49/app-6702045_1280.png";

function HomeCategory() {
  const scrollBoxRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const getAllCategories = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/category/category-only?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      console.log("dsfkdsnfj", results.data);
      setCategories(results.data);
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const scrollLeft = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <>
      <Grid item container margin={0} padding={0} sx={{ userSelect: "none" }}>
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
            Categories
          </Typography>
          <Button
            onClick={() => {
              navigate("/category");
            }}
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
            item
            padding={0}
            margin={0}
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
            item
            padding={0}
            margin={0}
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
            {categories.length === 0
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
              : categories.map((item, index) => (
                  <Grid
                    key={index}
                    margin={0}
                    padding={0}
                    sx={{ display: "inline-block" }}
                  >
                    <CategoryCard
                      image={image2}
                      category={item.category_name}
                    />
                  </Grid>
                ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default HomeCategory;
