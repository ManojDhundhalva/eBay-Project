import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import Rating from "@mui/material/Rating";
import EmojiPicker, { Theme, EmojiStyle, SkinTones } from "emoji-picker-react"; // Added SkinTones
import { Grid, Typography } from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

const ProductRatingGraph = ({ productRatings }) => {
  const [ratings, setRatings] = useState({
    five: 0,
    four: 0,
    three: 0,
    two: 0,
    one: 0,
  });

  const [totalValue, setTotalValue] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const val =
      Number(ratings.one) +
      Number(ratings.two) +
      Number(ratings.three) +
      Number(ratings.four) +
      Number(ratings.five);
    setTotal(val);
  }, [ratings]);

  useEffect(() => {
    const val =
      Number(ratings.one) +
      Number(2 * ratings.two) +
      Number(3 * ratings.three) +
      Number(4 * ratings.four) +
      Number(5 * ratings.five);
    setTotalValue(val);
  }, [ratings]);

  useEffect(() => {
    if (productRatings) {
      setRatings({
        one: Number(productRatings.rating_1_count),
        two: Number(productRatings.rating_2_count),
        three: Number(productRatings.rating_3_count),
        four: Number(productRatings.rating_4_count),
        five: Number(productRatings.rating_5_count),
      });
    }
  }, [productRatings]);

  return (
    <>
      <Grid
        container
        xs={4}
        sm={4}
        md={4}
        lg={4}
        xl={4}
        // style={{ backgroundColor: "lightblue" }}
      >
        {Object.keys(ratings).map((key) => (
          <>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              xs={2}
              sm={2}
              md={2}
              lg={2}
              xl={2}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {key === "one"
                  ? 1
                  : key === "two"
                  ? 2
                  : key === "three"
                  ? 3
                  : key === "four"
                  ? 4
                  : 5}{" "}
                star
              </Typography>
            </Grid>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              xs={8}
              sm={8}
              md={8}
              lg={8}
              xl={8}
            >
              <Slider
                aria-label="Rating"
                value={ratings[key] ? ratings[key] : 1}
                valueLabelDisplay="off"
                marks={[]}
                max={ratings[key] ? total : 40}
                sx={{
                  "& .MuiSlider-thumb": {
                    display: "none",
                  },
                  "& .MuiSlider-track": {
                    height: 8,
                    marginTop: 0,
                    marginBottom: 0,
                  },
                  "& .MuiSlider-rail": {
                    height: 8,
                    backgroundColor: "#f0f0f0",
                  },
                }}
              />
            </Grid>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              xs={2}
              sm={2}
              md={2}
              lg={2}
              xl={2}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {((ratings[key] / (total || 1)) * 100).toFixed(0)}%
              </Typography>
            </Grid>
          </>
        ))}
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        xs={4}
        sm={4}
        md={4}
        lg={4}
        xl={4}
        padding={0}
        margin={0}
        // style={{ backgroundColor: "lightpink" }}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <Typography variant="h2" fontWeight="bold">
            {(totalValue / (productRatings?.total_user_response || 1)).toFixed(
              1
            )}
          </Typography>
          <Rating
            name="half-rating"
            value={(
              totalValue / (productRatings?.total_user_response || 1)
            ).toFixed(1)}
            precision={0.1}
            readOnly
            emptyIcon={<StarBorderRoundedIcon fontSize="large" />}
            icon={<StarRateRoundedIcon fontSize="large" />}
          />
          <Typography variant="body1" fontWeight="bold">
            {totalValue} star rating
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {productRatings?.total_user_response || 1} Responses
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        xs={4}
        sm={4}
        md={4}
        lg={4}
        xl={4}
        // style={{ backgroundColor: "lightblue" }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <Gauge
            width={200}
            height={200}
            value={(
              (totalValue / ((productRatings?.total_user_response || 1) * 5)) *
              100
            ).toFixed(0)}
            cornerRadius="50%"
            sx={(theme) => ({
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 40,
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: "#0959AA",
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: theme.palette.text.disabled,
              },
            })}
          />
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {(
              (totalValue / ((productRatings?.total_user_response || 1) * 5)) *
              100
            ).toFixed(0)}
            % would recommend
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductRatingGraph;
