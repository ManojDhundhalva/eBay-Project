import React, { useState, useRef } from "react";
import { Grid, IconButton, useMediaQuery } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const ImgUrl =
  "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg";

const DisplayImages = ({ images }) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [hoverImg, setHoverImg] = useState(null);
  const scrollBoxRef = useRef(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const nextImage = () => {
    setSelectedImgIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImgIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Grid container>
      <Grid
        xs={12}
        sm={12}
        md={12}
        xl={1.5}
        lg={1.5}
        paddingY={2}
        margin={0}
        ref={scrollBoxRef}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: {
            xs: "row",
            sm: "row",
            md: "row",
            xl: "column",
            lg: "column",
          },
          overflowX: "auto",
          whiteSpace: "nowrap",
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar in webkit browsers (Chrome, Safari)
          },
          "-ms-overflow-style": "none", // Hide scrollbar in IE and Edge
          "scrollbar-width": "none", // Hide scrollbar in Firefox
        }}
      >
        {images.map((image, index) => (
          <Grid key={index} margin={0} sx={{ padding: "4px" }}>
            <img
              src={image}
              alt={`Thumbnail ${index}`}
              style={{
                userSelect: "none",
                backgroundColor: "#F2F2F2",
                objectFit: "contain",
                width: isSmallScreen ? 60 : 100,
                height: isSmallScreen ? 60 : 100,
                borderRadius: "10px",
                cursor: "pointer",
                border: selectedImgIndex === index ? "2px solid black" : "none",
              }}
              onError={(e) => {
                e.target.src = ImgUrl;
              }}
              onClick={() => {
                setSelectedImgIndex(index);
              }}
              onMouseEnter={() => {
                setHoverImg(image);
              }}
              onMouseLeave={() => {
                setHoverImg(null);
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Grid
        padding={2}
        xs={12}
        sm={10.5}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <IconButton
          onClick={prevImage}
          sx={{
            position: "absolute",
            top: "50%",
            left: isSmallScreen ? "2%" : 20,
            transform: "translateY(-50%)",
            zIndex: 2,
            color: "#032174",
            backgroundColor: "white",
          }}
          aria-label="left"
        >
          <ArrowBackIosRoundedIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={nextImage}
          sx={{
            position: "absolute",
            top: "50%",
            right: isSmallScreen ? "2%" : 20,
            transform: "translateY(-50%)",
            zIndex: 2,
            color: "#032174",
            backgroundColor: "white",
          }}
          aria-label="right"
        >
          <ArrowForwardIosRoundedIcon fontSize="large" />
        </IconButton>
        {images.length > 0 && (
          <img
            src={hoverImg || images[selectedImgIndex]}
            alt="Selected"
            onError={(e) => {
              e.target.src = ImgUrl;
            }}
            style={{
              width: "100%",
              maxInlineSize: "100%",
              blockSize: "auto",
              aspectRatio: 6 / 5,
              userSelect: "none",
              backgroundColor: "#F2F2F2",
              objectFit: "contain",
              borderRadius: "16px",
              cursor: "pointer",
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default DisplayImages;
