import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/product";
import Skeleton from "@mui/material/Skeleton";

const ScrollBox = styled(Box)({
  overflowX: "auto",
  whiteSpace: "nowrap",
  "&::-webkit-scrollbar": {
    display: "none", // Hide the scrollbar
  },
  "-ms-overflow-style": "none", // Hide scrollbar for IE and Edge
  "scrollbar-width": "none", // Hide scrollbar for Firefox
});

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

  const scrollBoxRefMostWatched = useRef(null);
  const scrollBoxRefMostRated = useRef(null);
  const scrollBoxRefMostPopularSeller = useRef(null);

  const navigate = useNavigate();
  const { setSelectedCategoryHome } = useProduct();

  const scrollLeftMostWatched = () => {
    if (scrollBoxRefMostWatched.current) {
      scrollBoxRefMostWatched.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRightMostWatched = () => {
    if (scrollBoxRefMostWatched.current) {
      scrollBoxRefMostWatched.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const scrollLeftMostRated = () => {
    if (scrollBoxRefMostRated.current) {
      scrollBoxRefMostRated.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRightMostRated = () => {
    if (scrollBoxRefMostRated.current) {
      scrollBoxRefMostRated.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeftMostPopularSeller = () => {
    if (scrollBoxRefMostPopularSeller.current) {
      scrollBoxRefMostPopularSeller.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRightMostPopularSeller = () => {
    if (scrollBoxRefMostPopularSeller.current) {
      scrollBoxRefMostPopularSeller.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            style={{ fontSize: 22, fontWeight: "bold" }}
            sx={{ paddingX: { xs: 1, sm: 2, md: 4 }, paddingY: 2 }}
          >
            Most Watched
          </Typography>
          <Typography
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            sx={{ paddingX: { xs: 1, sm: 2, md: 4 }, mt: 4 }}
          >
            See All
          </Typography>
        </div>
        <div>
          <Button
            onClick={scrollLeftMostWatched}
            sx={{
              position: "absolute",
              left: "3%",
              top: "50%",
              zIndex: 1,
              minWidth: "unset",
              backgroundColor: "lightblue",
              borderRadius: "100%",
            }}
          >
            <ArrowBackIosIcon style={{ transform: "translateX(4px)" }} />
          </Button>
          <ScrollBox
            ref={scrollBoxRefMostWatched}
            sx={{
              ml: { xs: 1, sm: 2, md: 4 },
              mr: { xs: 1, sm: 2, md: 4 },
            }}
          >
            <Stack
              direction="row"
              spacing={4}
              sx={{ paddingTop: 4, paddingBottom: 4 }}
            >
              {allProduct.length === 0
                ? Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      animation="wave"
                      variant="rounded"
                      sx={{
                        width: "34vh",
                        height: "42vh",
                        flexShrink: 0,
                        marginRight: 2,
                      }}
                    />
                  ))
                : allProduct.map((data, index) => (
                    <ProductCard key={index} product={data} />
                  ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
            </Stack>
          </ScrollBox>
          <Button
            onClick={scrollRightMostWatched}
            sx={{
              position: "absolute",
              right: "3%",
              top: "50%",
              zIndex: 1,
              minWidth: "unset",
              backgroundColor: "lightblue",
              borderRadius: "100%",
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        </div>
      </Container>
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            style={{ fontSize: 22, fontWeight: "bold" }}
            sx={{ paddingX: { xs: 1, sm: 2, md: 4 }, paddingY: 2 }}
          >
            Most Rated
          </Typography>
          <Typography
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            sx={{ paddingX: { xs: 1, sm: 2, md: 4 }, mt: 4 }}
          >
            See All
          </Typography>
        </div>
        <div>
          <Button
            onClick={scrollLeftMostRated}
            sx={{
              position: "absolute",
              left: "3%",
              top: "50%",
              zIndex: 1,
              minWidth: "unset",
              backgroundColor: "lightblue",
              borderRadius: "100%",
            }}
          >
            <ArrowBackIosIcon style={{ transform: "translateX(4px)" }} />
          </Button>
          <ScrollBox
            ref={scrollBoxRefMostRated}
            sx={{
              ml: { xs: 1, sm: 2, md: 4 },
              mr: { xs: 1, sm: 2, md: 4 },
            }}
          >
            <Stack
              direction="row"
              spacing={4}
              sx={{ paddingTop: 4, paddingBottom: 4 }}
            >
              {allProduct.length === 0
                ? Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                      animation="wave"
                      key={index}
                      variant="rounded"
                      sx={{
                        width: "34vh",
                        height: "42vh",
                        flexShrink: 0,
                        marginRight: 2,
                      }}
                    />
                  ))
                : allProduct.map((data, index) => (
                    <ProductCard key={index} product={data} />
                  ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
            </Stack>
          </ScrollBox>
          <Button
            onClick={scrollRightMostRated}
            sx={{
              position: "absolute",
              right: "3%",
              top: "50%",
              zIndex: 1,
              minWidth: "unset",
              backgroundColor: "lightblue",
              borderRadius: "100%",
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        </div>
      </Container>
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            style={{ fontSize: 22, fontWeight: "bold" }}
            sx={{ paddingX: { xs: 1, sm: 2, md: 4 }, paddingY: 2 }}
          >
            Most Popular Seller's Product
          </Typography>
          <Typography
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            sx={{ paddingX: { xs: 1, sm: 2, md: 4 }, mt: 4 }}
          >
            See All
          </Typography>
        </div>
        <div>
          <Button
            onClick={scrollLeftMostPopularSeller}
            sx={{
              position: "absolute",
              left: "3%",
              top: "50%",
              zIndex: 1,
              minWidth: "unset",
              backgroundColor: "lightblue",
              borderRadius: "100%",
            }}
          >
            <ArrowBackIosIcon style={{ transform: "translateX(4px)" }} />
          </Button>
          <ScrollBox
            ref={scrollBoxRefMostPopularSeller}
            sx={{
              ml: { xs: 1, sm: 2, md: 4 },
              mr: { xs: 1, sm: 2, md: 4 },
            }}
          >
            <Stack
              direction="row"
              spacing={4}
              sx={{ paddingTop: 4, paddingBottom: 4 }}
            >
              {allProduct.length === 0
                ? Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      animation="wave"
                      variant="rounded"
                      sx={{
                        width: "34vh",
                        height: "42vh",
                        flexShrink: 0,
                        marginRight: 2,
                      }}
                    />
                  ))
                : allProduct.map((data, index) => (
                    <ProductCard key={index} product={data} />
                  ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
              {allProduct.map((data, index) => (
                <ProductCard key={index} product={data} />
              ))}
            </Stack>
          </ScrollBox>
          <Button
            onClick={scrollRightMostPopularSeller}
            sx={{
              position: "absolute",
              right: "3%",
              top: "50%",
              zIndex: 1,
              minWidth: "unset",
              backgroundColor: "lightblue",
              borderRadius: "100%",
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        </div>
      </Container>
    </>
  );
}

export default DisplayProduct;
