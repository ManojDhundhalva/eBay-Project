import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "../context/product";
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Breadcrumbs,
  Typography,
  Chip,
  Select,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import ProductCard from "../components/ProductCard";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import axios from "axios";

const sortByTimeNewestFirst = (data) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.product_timestamp);
    const dateB = new Date(b.product_timestamp);
    return dateB - dateA;
  });
};

const sortByTimeOldestFirst = (data) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.product_timestamp);
    const dateB = new Date(b.product_timestamp);
    return dateA - dateB;
  });
};

const sortByMostWatched = (data) => {
  return data.sort((a, b) => b.product_watch_count - a.product_watch_count);
};

const sortByMostRated = (data) => {
  return data.sort((a, b) => b.product_avg_rating - a.product_avg_rating);
};

const sortByMostPopularSeller = (data) => {
  return data.sort((a, b) => b.seller_avg_rating - a.seller_avg_rating);
};

export default function Category() {
  const { categories, categoriesSort, setCategoriesSort } = useProduct();
  const [products, setProducts] = useState([]);
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [thirdValue, setThirdValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const handleItemClick = async (value) => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.post(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/category/filter-products?username=${encodeURIComponent(
            window.localStorage.getItem("username")
          )}&role=${encodeURIComponent(window.localStorage.getItem("role"))}`,
        { value },
        { headers }
      );
      if (categoriesSort === "Newest First") {
        setProducts(sortByTimeNewestFirst(results.data));
      } else if (categoriesSort === "Oldest First") {
        setProducts(sortByTimeOldestFirst(results.data));
      } else if (categoriesSort === "Most Rated") {
        setProducts(sortByMostRated(results.data));
      } else if (categoriesSort === "Most Popular Seller") {
        setProducts(sortByMostPopularSeller(results.data));
      } else {
        setProducts(sortByMostWatched(results.data));
      }
    } catch (err) {
      console.log("Error -> ", err);
    }
  };

  useEffect(() => {
    if (!queryParams.has("category")) {
      handleItemClick("All Products");
      setFirstValue("All Products");
      navigate(`/category?category=${encodeURIComponent("All Products")}`);
    } else {
      setFirstValue(decodeURIComponent(queryParams.get("category")));
      if (queryParams.has("sub_sub_category")) {
        setSecondValue(decodeURIComponent(queryParams.get("sub_category")));
        setThirdValue(decodeURIComponent(queryParams.get("sub_sub_category")));
        handleItemClick(
          decodeURIComponent(queryParams.get("sub_sub_category"))
        );
      } else if (queryParams.has("sub_category")) {
        setSecondValue(decodeURIComponent(queryParams.get("sub_category")));
        handleItemClick(decodeURIComponent(queryParams.get("sub_category")));
      } else {
        handleItemClick(decodeURIComponent(queryParams.get("category")));
      }
    }
  }, []);

  const handleBreadcrumbClick = (value) => {
    handleItemClick(value);
    if (value === firstValue) {
      navigate(`/category?category=${encodeURIComponent(firstValue)}`);
      setSecondValue("");
      setThirdValue("");
    } else if (value === secondValue) {
      navigate(
        `/category?category=${encodeURIComponent(
          firstValue
        )}&sub_category=${encodeURIComponent(secondValue)}`
      );
      setThirdValue("");
    }
  };

  return (
    <Grid container paddingX={2}>
      <Grid
        container
        item
        padding={0}
        margin={0}
        xs={3}
        sm={3}
        md={3}
        xl={3}
        lg={3}
        sx={{ height: "100vh" }}
      >
        <Box
          sx={{
            height: "100vh",
            flexGrow: 1,
            backgroundColor: "ghostwhite",
            borderRadius: "16px",
            padding: 2,
            marginX: 2,
          }}
        >
          <SimpleTreeView>
            <TreeItem
              sx={{
                backgroundColor: "lavender",
                marginY: 1,
                borderRadius: "10px",
              }}
              itemId="All-Products"
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <RadioButtonUncheckedOutlinedIcon /> All Products
                </Box>
              }
              onClick={() => {
                handleItemClick("All Products");
                navigate(
                  `/category?category=${encodeURIComponent("All Products")}`
                );
                setFirstValue("All Products");
                setSecondValue("");
                setThirdValue("");
              }}
            />
            {categories.map((category, index) => (
              <TreeItem
                sx={{
                  backgroundColor: "lavender",
                  marginY: 1,
                  borderRadius: "10px",
                }}
                key={`${category.category}-${index}`}
                itemId={`${category.category}-${index}`}
                label={category.category}
                onClick={() => {
                  handleItemClick(category.category);
                  navigate(
                    `/category?category=${encodeURIComponent(
                      category.category
                    )}`
                  );
                  setFirstValue(category.category);
                  setSecondValue("");
                  setThirdValue("");
                }}
                open={firstValue === "All Products"}
              >
                {category?.sub_categories?.map((sub_category, index2) =>
                  sub_category.sub_sub_category === null ? (
                    <TreeItem
                      sx={{
                        backgroundColor: "lavender",
                        marginY: 1,
                        borderRadius: "10px",
                      }}
                      key={`${sub_category.sub_category}-${index2}`}
                      itemId={`${sub_category.sub_category}-${index2}`}
                      label={sub_category.sub_category}
                      onClick={() => {
                        handleItemClick(sub_category.sub_category);
                        navigate(
                          `/category?category=${encodeURIComponent(
                            category.category
                          )}&sub_category=${encodeURIComponent(
                            sub_category.sub_category
                          )}`
                        );
                        setFirstValue(category.category);
                        setSecondValue(sub_category.sub_category);
                        setThirdValue("");
                      }}
                      open={secondValue === category.category}
                    />
                  ) : (
                    <TreeItem
                      sx={{
                        backgroundColor: "lavender",
                        marginY: 1,
                        borderRadius: "10px",
                      }}
                      key={`${sub_category.sub_category}-${index2}`}
                      itemId={`${sub_category.sub_category}-${index2}`}
                      label={sub_category.sub_category}
                      onClick={() => {
                        handleItemClick(sub_category.sub_category);
                        navigate(
                          `/category?category=${encodeURIComponent(
                            category.category
                          )}&sub_category=${encodeURIComponent(
                            sub_category.sub_category
                          )}`
                        );
                        setFirstValue(category.category);
                        setSecondValue(sub_category.sub_category);
                        setThirdValue("");
                      }}
                      open={thirdValue === sub_category.sub_category}
                    >
                      {sub_category.sub_sub_category.map(
                        (sub_sub_category, index3) => (
                          <TreeItem
                            sx={{
                              backgroundColor: "lavender",
                              marginY: 1,
                              borderRadius: "10px",
                            }}
                            key={`${sub_sub_category}-${index3}`}
                            itemId={`${sub_sub_category}-${index3}`}
                            label={sub_sub_category}
                            onClick={() => {
                              handleItemClick(sub_sub_category);
                              navigate(
                                `/category?category=${encodeURIComponent(
                                  category.category
                                )}&sub_category=${encodeURIComponent(
                                  sub_category.sub_category
                                )}&sub_sub_category=${encodeURIComponent(
                                  sub_sub_category
                                )}`
                              );
                              setFirstValue(category.category);
                              setSecondValue(sub_category.sub_category);
                              setThirdValue(sub_sub_category);
                            }}
                            open={thirdValue === sub_sub_category}
                          />
                        )
                      )}
                    </TreeItem>
                  )
                )}
              </TreeItem>
            ))}
          </SimpleTreeView>
        </Box>
      </Grid>
      <Grid
        padding={0}
        margin={0}
        xs={9}
        sm={9}
        md={9}
        xl={9}
        lg={9}
        // sx={{ background: "lightpink" }}
      >
        <Grid
          container
          xs={12}
          sm={12}
          md={12}
          xl={12}
          lg={12}
          padding={1}
          margin={0}
          sx={{ backgroundColor: "ghostwhite", borderRadius: "10px" }}
        >
          <FormControl size="small" sx={{ mx: 1 }}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label-label"
              id="sort-label"
              value={categoriesSort}
              label="Sort"
              onChange={(e) => {
                setCategoriesSort(e.target.value);
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
                minWidth: "200px",
                borderRadius: 25,
                fontWeight: "bold",
              }}
            >
              <MenuItem
                value="Newest First"
                onClick={() => {
                  setProducts(sortByTimeNewestFirst(products));
                }}
              >
                Newest First
              </MenuItem>
              <MenuItem
                value="Oldest First"
                onClick={() => {
                  setProducts(sortByTimeOldestFirst(products));
                }}
              >
                Oldest First
              </MenuItem>
              <MenuItem
                value="Most Watched"
                onClick={() => {
                  setProducts(sortByMostWatched(products));
                }}
              >
                Most Watched
              </MenuItem>
              <MenuItem
                value="Most Rated"
                onClick={() => {
                  setProducts(sortByMostRated(products));
                }}
              >
                Most Rated
              </MenuItem>
              <MenuItem
                value="Most Popular Seller"
                onClick={() => {
                  setProducts(sortByMostPopularSeller(products));
                }}
              >
                Most Popular Seller
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          container
          xs={12}
          sm={12}
          md={12}
          xl={12}
          lg={12}
          padding={1}
          margin={0}
          sx={{ backgroundColor: "ghostwhite", borderRadius: "10px" }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Chip
              sx={{ fontWeight: "bold" }}
              label={firstValue}
              onClick={() => handleBreadcrumbClick(firstValue)}
            />

            {secondValue && (
              <Chip
                sx={{ fontWeight: "bold" }}
                label={secondValue}
                onClick={() => handleBreadcrumbClick(secondValue)}
              />
            )}
            {thirdValue && (
              <Chip
                sx={{ fontWeight: "bold" }}
                label={thirdValue}
                onClick={() => handleBreadcrumbClick(thirdValue)}
              />
            )}
          </Breadcrumbs>
        </Grid>
        <Grid
          container
          xs={12}
          sm={12}
          md={12}
          xl={12}
          lg={12}
          padding={2}
          margin={0}
          // sx={{ backgroundColor: "lightpink" }}
        >
          {products.length ? (
            products.map((data, index) => (
              <Grid
                item
                container
                padding={0}
                margin={0}
                xs={4}
                sm={4}
                md={4}
                xl={4}
                lg={4}
                key={index}
              >
                <ProductCard key={index} product={data} />
              </Grid>
            ))
          ) : (
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              padding={10}
              margin={0}
              xs={12}
              sm={12}
              md={12}
              xl={12}
              lg={12}
              style={{
                backgroundColor: "ghostwhite",
                width: "100%",
                height: "100vh",
                borderRadius: "10px",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  backgroundColor: "#DADAE0",
                  borderRadius: "16px",
                  padding: 4,
                }}
              >
                NO PRODUCTS FOUND
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
