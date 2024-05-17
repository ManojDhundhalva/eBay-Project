import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Hero() {
  const ImgUrl =
    "https://img.freepik.com/free-photo/cyber-monday-retail-sales_23-2148688493.jpg?size=626&ext=jpg&uid=R149233148&ga=GA1.1.1356918092.1684837164&semt=ais_user_b";

  return (
    <Container maxWidth="xl" style={{ marginTop: 40 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "72vh",
          width: "100%",
          padding: { xs: 1, sm: 2, md: 4 },
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: "100%",
            width: "100%",
            backgroundImage: `url(${ImgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: { xs: "50%", md: "28%", lg: "28%", xl: "30%" },
              left: { xs: "50%", md: "4%", lg: "4%", xl: "4%" },
              transform: { xs: "translate(-50%, -50%)", md: "none" },
              textAlign: { xs: "center", sm: "left", md: "left" },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                lineHeight: "1.2",
                fontWeight: "bold",
              }}
            >
              Our latest products
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mt: 2,
                width: { xs: "90%", md: "60%" },
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              }}
            >
              Explore our cutting-edge dashboard, delivering high-quality
              solutions tailored to your needs. Elevate your experience with
              top-tier features and services.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
