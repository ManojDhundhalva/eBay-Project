import React from "react";
import { Grid, Typography } from "@mui/material";
import { useProduct } from "../context/product";
import { useNavigate } from "react-router-dom";

const ImgUrl = `https://t3.ftcdn.net/jpg/05/15/95/32/360_F_515953296_4OTDJFNzT9YmriBZwR688gsWzLFSyc1u.webp`;

function CategoryCard({ image, category }) {
  const { setSelectedCategoryHome } = useProduct();
  const navigate = useNavigate();

  return (
    <>
      <Grid margin={0} padding={2}>
        <Grid
          margin={0}
          padding={2}
          paddingX={1}
          sx={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
            borderRadius: "16px",
            width: 160,
            height: 160,
            transition: "all 0.1s ease",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
          onClick={() => {
            setSelectedCategoryHome(category);
            navigate(`/category?category=${encodeURIComponent(category)}`);
          }}
        >
          <Grid margin={0} padding={0}>
            <img
              src={image}
              alt="product_image"
              onError={(e) => {
                e.target.src = ImgUrl;
              }}
              style={{
                width: 80,
                height: 80,
                display: "inline-block",
                objectFit: "contain",
                backgroundColor: "#F2F2F2",
                borderRadius: "12px",
              }}
            />
          </Grid>
          <Grid margin={0} paddingTop={1}>
            <Typography
              fontWeight="bold"
              sx={{
                overflowWrap: "anywhere",
                textAlign: "center",
                wordBreak: "break-word",
                maxWidth: "100%",
                whiteSpace: "normal",
              }}
            >
              {category}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default CategoryCard;
