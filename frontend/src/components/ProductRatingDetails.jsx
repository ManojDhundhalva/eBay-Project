import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import Rating from "@mui/material/Rating";

const ProductRatingGraph = () => {
  const [ratings, setRatings] = useState({
    five: 5,
    four: 4,
    three: 3,
    two: 2,
    one: 1,
  });

  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const val =
      ratings.one + ratings.two + ratings.three + ratings.four + ratings.five;
    setTotalValue(val);
  }, [ratings]);

  return (
    <>
      <h2>Guest Rating & Reviews</h2>
      <div style={{ display: "flex" }}>
        <div>
          <Box sx={{ width: 300 }} style={{ margin: "2em" }}>
            {Object.keys(ratings).map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: "10px" }}>{key}</div>
                <Slider
                  aria-label="Rating"
                  value={ratings[key]} // Use the rating value as the value for the slider
                  valueLabelDisplay="off"
                  marks={[]}
                  max={totalValue} // Set the max value for the slider
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
                      height: 8, // increase height of the background line
                      backgroundColor: "#f0f0f0", // set a very light color
                    },
                  }}
                />
                <div>{((ratings[key] / totalValue) * 100).toFixed(0)}%</div>
              </div>
            ))}
          </Box>
        </div>
        <div>
          <h2>{(totalValue / 5).toFixed(1)}</h2>
          <Rating
            name="half-rating"
            value={Number((totalValue / 5).toFixed(1))}
            precision={0.1}
            readOnly
          />
          <div>{totalValue} start rating</div>
          <div>3 Responses "Baki"</div>
        </div>
        <div>
          <Gauge
            width={200}
            height={200}
            value={Number(((totalValue / 25) * 100).toFixed(0))}
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
          <h4>{((totalValue / 25) * 100).toFixed(0)}% would recommend</h4>
        </div>
      </div>
    </>
  );
};

export default ProductRatingGraph;
