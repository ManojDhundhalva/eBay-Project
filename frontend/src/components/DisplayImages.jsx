import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

const DisplayImages = ({ images }) => {
  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [hoverImg, setHoverImg] = useState(null);

  return (
    <Grid container margin={0} padding={2}>
      <Grid
        container
        paddingLeft={2}
        paddingTop={2}
        margin={0}
        xs={12}
        sm={2}
        md={2}
        xl={2}
        lg={2}
        sx={{
          borderRadius: "10px",
          // backgroundColor: "ghostwhite",
          maxHeight: "600px",
          overflowX: "scroll",
          whiteSpace: "normal",
          overflowY: "scroll",
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
            <Grid key={index}>
              <img
                src={image}
                alt={`Thumbnail ${index}`}
                style={{
                  backgroundColor: "#F2F2F2",
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: selectedImg === image ? "2px solid black" : "none",
                }}
                onClick={() => {
                  setSelectedImg(image);
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
        </Stack>
      </Grid>
      <Grid
        container
        paddingTop={2}
        paddingLeft={2}
        xs={12}
        sm={10}
        md={10}
        xl={10}
        lg={10}
        sx={{ borderRadius: "10px" }}
      >
        {selectedImg && (
          <img
            src={hoverImg || selectedImg}
            alt={`Selected Img`}
            style={{
              backgroundColor: "#F2F2F2",
              objectFit: "contain",
              width: "100%",
              height: "auto",
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
