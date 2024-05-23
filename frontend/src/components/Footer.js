// src/Footer.js
import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#FBFCFE",
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Company Name</Typography>
            <Typography variant="body2" color="inherit">
              Hello
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Quick Links</Typography>
            <Link href="#" color="inherit" sx={{ display: "block", mt: 1 }}>
              Home
            </Link>
            <Link href="#" color="inherit" sx={{ display: "block", mt: 1 }}>
              About
            </Link>
            <Link href="#" color="inherit" sx={{ display: "block", mt: 1 }}>
              Services
            </Link>
            <Link href="#" color="inherit" sx={{ display: "block", mt: 1 }}>
              Contact
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Follow Us</Typography>
            <Box>
              <IconButton href="#" color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton href="#" color="inherit">
                <InstagramIcon />
              </IconButton>
              <IconButton href="#" color="inherit">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
