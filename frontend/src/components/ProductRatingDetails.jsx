import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import Rating from "@mui/material/Rating";
import EmojiPicker, { Theme, EmojiStyle, SkinTones } from "emoji-picker-react"; // Added SkinTones

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
      <h2>Buyer's Rating & Reviews</h2>
      <div style={{ display: "flex" }}>
        <div>
          <Box sx={{ width: 300 }} style={{ margin: "2em" }}>
            {Object.keys(ratings).map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: "10px" }}>{key}</div>
                <Slider
                  aria-label="Rating"
                  value={ratings[key]}
                  valueLabelDisplay="off"
                  marks={[]}
                  max={total}
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
                <div>{((ratings[key] / (total || 1)) * 100).toFixed(0)}%</div>
              </div>
            ))}
          </Box>
        </div>
        <div>
          <h2>
            {(totalValue / (productRatings?.total_user_response || 1)).toFixed(
              1
            )}
          </h2>
          <Rating
            name="half-rating"
            value={(
              totalValue / (productRatings?.total_user_response || 1)
            ).toFixed(1)}
            precision={0.1}
            readOnly
          />
          <div>{totalValue} star rating</div>
          <div>{productRatings?.total_user_response || 1} Responses</div>
        </div>
        <div>
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
          <h4>
            {(
              (totalValue / ((productRatings?.total_user_response || 1) * 5)) *
              100
            ).toFixed(0)}
            % would recommend
          </h4>
        </div>
        <div>
          {/* google, apple, facebook, twitter and native. */}
          {/* <EmojiPicker
            emojiStyle="facebook"
            theme={Theme.DARK}
            // skinTonePicker={SkinTones}
          /> */}
        </div>
      </div>
    </>
  );
};

export default ProductRatingGraph;
