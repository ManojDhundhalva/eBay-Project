import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Grid from "@mui/material/Grid";

const DisplayImages = ({ images }) => {
  const [selectedImg, setSelectedImg] = useState(images[0]);

  return (
    <Grid container margin={0} padding={2}>
      <Grid
        container
        padding={2}
        xs={12}
        sm={3}
        md={3}
        xl={3}
        lg={3}
        sx={{
          borderRadius: "10px",
          backgroundColor: "ghostwhite",
          maxHeight: "500px",
          overflowX: "scroll",
          whiteSpace: "normal",
          overflowY: "scroll",
          // "&::-webkit-scrollbar": {
          //   width: "8px",
          // },
          // "&::-webkit-scrollbar-thumb": {
          //   backgroundColor: "gray",
          //   borderRadius: "50px",
          // },
          // "&::-webkit-scrollbar-thumb:hover": {
          //   backgroundColor: "darkgray",
          // },
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <Stack
          height={{ xs: "auto", sm: 800 }}
          spacing={2}
          direction={{
            xs: "row",
            sm: "column",
          }}
        >
          {images.map((image, index) => (
            <Grid key={index} sx={{ backgroundColor: "lemonchiffon" }}>
              <img
                src={image}
                alt={`Thumbnail ${index}`}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedImg(image);
                }}
              />
            </Grid>
          ))}
        </Stack>
      </Grid>
      <Grid
        container
        padding={2}
        xs={12}
        sm={9}
        md={9}
        xl={9}
        lg={9}
        sx={{ borderRadius: "10px" }}
      >
        {selectedImg && (
          <img
            src={selectedImg}
            alt={`Selected Img`}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default DisplayImages;
