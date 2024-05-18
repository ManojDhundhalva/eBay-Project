import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Grid } from "@mui/material";

// Styling for ScrollBox
const ScrollBox = styled(Box)({
  overflowY: "auto",
  whiteSpace: "nowrap",
  height: "60vh",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
});

// MagnifyingGlass Component
const MagnifyingGlass = ({ src, zoom }) => {
  const magnifyingGlassRef = useRef(null);
  const [bgPosition, setBgPosition] = useState("0% 0%");
  const [glassPosition, setGlassPosition] = useState({ x: -9999, y: -9999 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      magnifyingGlassRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBgPosition(`${x}% ${y}%`);
    setGlassPosition({ x: e.pageX - left, y: e.pageY - top });
  };

  const glassStyle = {
    position: "absolute",
    top: glassPosition.y - 75, // Adjusting for the larger circle
    left: glassPosition.x - 75, // Adjusting for the larger circle
    width: "180px", // Increased diameter
    height: "180px", // Increased diameter
    borderRadius: "50%",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    backgroundImage: `url(${src})`,
    backgroundSize: `${zoom * 100}%`,
    backgroundPosition: bgPosition,
    pointerEvents: "none",
  };

  return (
    <div
      ref={magnifyingGlassRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "75%", // Maintain aspect ratio
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <img
        src={src}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <div style={glassStyle}></div>
    </div>
  );
};

const DisplayImages = ({ images }) => {
  const [selectedImg, setSelectedImg] = useState(images[0]);
  const scrollBoxRef = useRef(null);

  const scrollTop = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollBy({ top: -300, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollBy({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" style={{ position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            width: { xs: "15vh", sm: "20vh" },
            marginX: 2,
          }}
        >
          <Button
            onClick={scrollTop}
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: "-4vh",
              zIndex: 1,
              minWidth: "unset",
              backgroundColor: "lightblue",
              borderRadius: "100%",
            }}
          >
            <KeyboardArrowUpIcon />
          </Button>
          <ScrollBox ref={scrollBoxRef}>
            <Stack spacing={2}>
              {images.map((image, index) => (
                <img
                  style={{
                    width: { xs: "15vh", sm: "20vh" },
                    height: { xs: "15vh", sm: "20vh" },
                    // width: "20vh",
                    // height: "20vh",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  key={index}
                  src={image}
                  onClick={() => {
                    setSelectedImg(image);
                  }}
                />
              ))}
            </Stack>
          </ScrollBox>
          <Button
            onClick={scrollDown}
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "-4vh",
              zIndex: 1,
              minWidth: "unset",
              backgroundColor: "lightblue",
              borderRadius: "100%",
            }}
          >
            <KeyboardArrowDownIcon />
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <MagnifyingGlass src={selectedImg} zoom={6} />
        </Box>
      </Stack>
    </Box>
  );
};

export default DisplayImages;
