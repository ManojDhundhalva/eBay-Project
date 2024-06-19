import React from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HorizontalSlider({ images, id }) {
  const navigate = useNavigate();
  const ImgUrl = `https://t3.ftcdn.net/jpg/05/15/95/32/360_F_515953296_4OTDJFNzT9YmriBZwR688gsWzLFSyc1u.webp`;

  return (
    <Grid
      id="style-2"
      margin={0}
      padding={1}
      sx={{
        backgroundColor: "#f2ebfb",
        borderRadius: "20px",
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {images.map((image, index) => (
        <>
          <Grid
            key={index}
            padding={1}
            margin={0}
            sx={{
              display: "inline-block",
              transition: "transform 0.15s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <img
              src={image}
              alt="product_image"
              onClick={() => {
                navigate(`/product-details?id=${id}`);
              }}
              onError={(e) => {
                e.target.src = ImgUrl;
              }}
              style={{
                width: 200,
                height: 200,
                display: "inline-block",
                objectFit: "contain",
                backgroundColor: "#F2F2F2",
                borderRadius: "16px",
                cursor: "pointer",
              }}
            />
          </Grid>
        </>
      ))}
    </Grid>
  );
}

export default HorizontalSlider;
