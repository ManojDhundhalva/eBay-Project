import * as React from "react";
import Hero from "./components/Hero";
import AboutUs from "./pages/AboutUs";
import MostWatched from "./components/HomePageCategory/MostWatched";
import MostRated from "./components/HomePageCategory/MostRated";
import MostPopularSeller from "./components/HomePageCategory/MostPopularSeller";
import HomeCategory from "./components/HomePageCategory/HomeCategory";
import { Grid } from "@mui/material";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Grid margin={0} padding={2}>
        <HomeCategory />
        <MostWatched />
        <MostRated />
        <MostPopularSeller />
      </Grid>
    </>
  );
}
