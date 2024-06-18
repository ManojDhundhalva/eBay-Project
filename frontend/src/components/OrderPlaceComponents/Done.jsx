import React from "react";
import { Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../context/product";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

function Done({ orderId }) {
  const navigate = useNavigate();
  const { setCartList } = useProduct();
  return (
    <>
      <Stack spacing={2} useFlexGap>
        <Typography variant="h1">📦</Typography>
        <Typography variant="h5">Thank you for your order!</Typography>
        <Typography variant="body1" color="text.secondary">
          Your order number is
          <strong>&nbsp;{orderId}</strong>. We have emailed your order
          confirmation and will update you once its shipped.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setCartList([]);
            navigate("/order");
          }}
          sx={{
            width: "fit-content",
            borderRadius: "16px",
            fontWeight: "bold",
            backgroundColor: "#03045e",
            "&:hover": {
              backgroundColor: "#032174",
            },
          }}
          startIcon={<OpenInNewRoundedIcon sx={{ color: "white" }} />}
          size="large"
        >
          Go to my orders
        </Button>
      </Stack>
    </>
  );
}

export default Done;
