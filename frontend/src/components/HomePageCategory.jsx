import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

const categories = [
  { category: "Electronics" },
  { category: "Clothing & Accessories" },
  { category: "Home & Kitchen" },
  { category: "Beauty & Personal Care" },
  { category: "Sports & Outdoors" },
  { category: "Books, Movies & Music" },
  { category: "Toys & Games" },
  { category: "Health & Wellness" },
  { category: "Pet Supplies" },
  { category: "Baby & Kids" },
];

const ScrollBox = styled(Box)({
  overflowX: "auto",
  whiteSpace: "nowrap",
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#adb5bd",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#6c757d",
  },
});

function HomePageCategory() {
  return (
    <Container maxWidth="xl">
      <Typography
        style={{ fontSize: 22, fontWeight: "bold" }}
        sx={{ paddingX: { xs: 1, sm: 2, md: 4 } }}
      >
        Categories
      </Typography>
      <ScrollBox>
        <Stack
          direction="row"
          spacing={4}
          sx={{ padding: { xs: 1, sm: 2, md: 4 } }}
        >
          {categories.map((item, index) => (
            <Box
              key={index}
              sx={{
                cursor: "pointer",
                backgroundColor: "ghostwhite",
                borderRadius: "12px",
                padding: "10px",
                paddingTop: "14px",
                paddingBottom: "14px",
                height: "20vh",
                width: "14vh",
                fontWeight: "bold",
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                flex: "0 0 auto",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              {item.category}
            </Box>
          ))}
        </Stack>
      </ScrollBox>
    </Container>
  );
}

export default HomePageCategory;
