import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import image2 from "../images/image2.png";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/product";

const categories = [
  { category: "Electronics" },
  { category: "Clothing & Accessories" },
  { category: "Home & Kitchen" },
  { category: "Beauty & Personal Care" },
  { category: "Sports & Outdoors" },
  { category: "Books, Movies & Music" },
  { category: "Toys & Games" },
  { category: "Health & Wellness" },
  { category: "Baby & Kids" },
];

const ScrollBox = styled(Box)({
  overflow: "auto",
  whiteSpace: "nowrap",
  "&::-webkit-scrollbar": {
    display: "none", // Hide the scrollbar
  },
  "-ms-overflow-style": "none", // Hide scrollbar for IE and Edge
  "scrollbar-width": "none", // Hide scrollbar for Firefox
});

function HomePageCategory() {
  const scrollBoxRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedCategoryHome } = useProduct();

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
    <Container maxWidth="xl" sx={{ position: "relative" }}>
      <Typography
        style={{ fontSize: 22, fontWeight: "bold" }}
        sx={{ paddingX: { xs: 1, sm: 2, md: 4 }, marginY: 2 }}
      >
        Categories
      </Typography>
      <div>
        <Button
          onClick={scrollLeft}
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
          ref={scrollBoxRef}
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
            {categories.map((item, index) => (
              <Box
                key={index}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "ghostwhite",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  },
                  width: "42vh",
                  height: "20vh",
                }}
                onClick={() => {
                  setSelectedCategoryHome(item.category);
                  navigate("/category");
                }}
              >
                <img
                  src={image2}
                  style={{
                    transform: "translateY(10px)",
                    width: "10vh",
                    height: "10vh",
                  }}
                />
                <Box
                  sx={{
                    wordBreak: "break-word",
                    textAlign: "center",
                    fontWeight: "bold",
                    whiteSpace: "normal",
                    width: "20vh",
                    height: "10vh",
                    padding: 2,
                  }}
                >
                  {item.category}
                </Box>
              </Box>
            ))}
          </Stack>
        </ScrollBox>
        <Button
          onClick={scrollRight}
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
  );
}

export default HomePageCategory;
