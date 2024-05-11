import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import AddressForm from "./AddressForm";
import getCheckoutTheme from "./getCheckoutTheme";
import Info from "./Info";
import InfoMobile from "./InfoMobile";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
// import ToggleColorMode from "./ToggleColorMode";
import ToggleColorMode from "../ToggleColorMode";
import { useAuth } from "../../context/auth";
import { useProduct } from "../../context/product";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100dvw",
        position: "fixed",
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: "background.default",
          "& .Mui-selected": {
            pointerEvents: "none",
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: "20px", mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.shape({
    valueOf: PropTypes.func.isRequired,
  }).isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

const steps = ["Shipping address", "Review your order", "Payment details"];

const logoStyle = {
  width: "140px",
  height: "56px",
  marginLeft: "-4px",
  marginRight: "-8px",
};

export default function Checkout({
  TotalAmount,
  selectedQuantities,
  setIsOrderPlaced,
  totalQuantities,
}) {
  const { cartList, setCartList } = useProduct();
  const { LogOut } = useAuth();
  const navigate = useNavigate();

  const [buyerFirstName, setBuyerFirstName] = React.useState("");
  const [buyerLastName, setBuyerLastName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [state, setState] = React.useState("");
  const [city, setCity] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [paymentType, setPaymentType] = React.useState("creditCard"); //bankTransfer
  const [isPaid, setIsPaid] = React.useState(false);

  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);

  const { mode, setMode } = useAuth();
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = React.useState(0);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleNext = () => {
    if (
      activeStep == 0 &&
      (location === "" ||
        phoneNumber.length !== 10 ||
        pincode === "" ||
        buyerFirstName === "" ||
        buyerLastName === "")
    ) {
      toast("Please, Fill Your Details", {
        icon: "👏",
      });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const [uniqueCities, setUniqueCities] = useState([]);

  // Function to update unique cities whenever products change
  useEffect(() => {
    const updateUniqueCities = () => {
      // Use reduce to filter out unique combinations of seller_city, latitude, and longitude
      const uniqueCitiesArray = cartList.reduce((unique, product) => {
        // Check if a product with the same seller_city, latitude, and longitude already exists
        const existingProduct = unique.find(
          (p) =>
            p.seller_city === product.seller_city &&
            p.latitude === product.latitude &&
            p.longitude === product.longitude
        );

        // If not, add the product to the unique array
        if (!existingProduct) {
          unique.push({
            seller_city: product.seller_city,
            latitude: product.latitude,
            longitude: product.longitude,
          });
        }

        return unique;
      }, []);

      // Set the state of uniqueCities
      setUniqueCities(uniqueCitiesArray);
    };

    // Call the update function
    updateUniqueCities();
  }, [cartList]);

  // useEffect(() => {
  //   console.log(uniqueCities);
  // }, [uniqueCities]);

  const [distances, setDistances] = useState([]);
  const [totalDistanceKM, setTotalDistanceKM] = useState(0);

  const calculateDistance = (dest) => {
    const R = 6371; // Earth's radius in kilometers

    // Check if coordinatesData is null
    if (latitude === "" || longitude === "") {
      return {
        sourceCity: "Unknown",
        destinationCity: dest.city,
        distanceKM: "Unknown",
      };
    }

    const lat1 = latitude;
    const lon1 = longitude;
    const { latitude: lat2, longitude: lon2, seller_city } = dest;

    // Convert latitude and longitude from degrees to radians
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    // Haversine formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const calculatedDistance = R * c;

    return {
      sourceCity: seller_city,
      destinationCity: location,
      distanceKM: calculatedDistance.toFixed(2),
    };
  };

  const handleCalculateDistance = () => {
    const distancesArray = uniqueCities.map((dest) => calculateDistance(dest));
    setDistances(distancesArray);
  };

  useEffect(() => {
    handleCalculateDistance();
  }, [latitude, longitude]);

  useEffect(() => {
    console.log("distances", distances);
  }, [distances]);

  useEffect(() => {
    const total = distances.reduce(
      (acc, curr) => Number(acc) + Number(curr.distanceKM),
      0
    );
    setTotalDistanceKM(total);
  }, [distances]);

  const [orderId, setOrderId] = useState("");
  const handleOrderPayment = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      const results = await toast.promise(
        axios.post(
          `http://localhost:8000/api/v1/order/payment?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
          {
            payment_amount: Number(
              Number(TotalAmount) +
                Number(
                  TotalAmount * (process.env.REACT_APP_EBAY_CHARGES / 100)
                ) +
                Number(
                  totalDistanceKM *
                    (process.env.REACT_APP_SHIPPING_CHARGES / 100)
                )
            ).toFixed(2),
            payment_type: paymentType,
          },
          { headers }
        ),
        {
          loading: "On Going Payment...", // Message shown during loading
          success: <b>Payment successfully!</b>, // Success message
          error: <b>Failed to Payment</b>, // Error message
        }
      );
      // setPaymentTransactionId(results.data.payment_transaction_id);
      try {
        const results1 = await toast.promise(
          axios.post(
            `http://localhost:8000/api/v1/order?username=${window.localStorage.getItem(
              "username"
            )}&role=${window.localStorage.getItem("role")}`,
            {
              prdouctQuanties: selectedQuantities,
              productList: cartList,
              order_buyer_first_name: buyerFirstName,
              order_buyer_Last_name: buyerLastName,
              order_transaction_id: results.data.payment_transaction_id,
              order_total_cost: Number(TotalAmount).toFixed(2),
              order_shipping_cost: Number(
                totalDistanceKM * (process.env.REACT_APP_SHIPPING_CHARGES / 100)
              ).toFixed(2),
              order_shipping_location: location,
              latitude,
              longitude,
              order_shipping_address_country: country,
              order_shipping_address_state: state,
              order_shipping_address_city: city,
              order_shipping_address_pincode: pincode,
              order_shipping_address_mobile_number: phoneNumber,
            },
            { headers }
          ),
          {
            loading: "Order placing...", // Message shown during loading
            success: <b>Order placed successfully!</b>, // Success message
            error: <b>Failed to order place.</b>, // Error message
          }
        );
        setOrderId(results1.data.order_id);
        handleNext();
      } catch (err) {
        LogOut();
        console.error("Error in order placing:", err);
      }
    } catch (err) {
      LogOut();
      console.error("Error updating profile:", err);
    }
  };

  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
      <CssBaseline />
      <Grid
        container
        sx={{ height: { xs: "100%", sm: "100dvh" } }}
        className="mb-5"
      >
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "start",
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              height: 150,
            }}
          >
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              component="a"
              onClick={() => {
                setIsOrderPlaced(false);
              }}
              sx={{ ml: "-8px" }}
            >
              Back to
              <img
                src={
                  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg"
                }
                style={logoStyle}
                alt="Sitemark's logo"
              />
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Info
              totalDistanceKM={totalDistanceKM}
              totalQuantities={totalQuantities}
              selectedQuantities={selectedQuantities}
              totalPrice={activeStep >= 1 ? TotalAmount : TotalAmount}
            />
          </Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                component="a"
                href="/material-ui/getting-started/templates/landing-page/"
                sx={{ alignSelf: "start" }}
              >
                Back to
                <img
                  src={
                    "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg"
                  }
                  style={logoStyle}
                  alt="Sitemark's logo"
                />
              </Button>
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexGrow: 1,
                height: 150,
              }}
            >
              {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
              <div className="mt-5">&nbsp;</div>
              <Stepper
                className="mt-5"
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: "100%",
                  height: 40,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-child": { pl: 0 },
                      ":last-child": { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                ":last-child": { pb: 2 },
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">
                  {activeStep >= 2 ? "$144.97" : "$134.98"}
                </Typography>
              </div>
              <InfoMobile
                totalPrice={activeStep >= 2 ? "$144.97" : "$134.98"}
              />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: "flex", md: "none" } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ":first-child": { pl: 0 },
                    ":last-child": { pr: 0 },
                    "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{
                      ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                <Typography variant="body1" color="text.secondary">
                  Your order number is
                  <strong>&nbsp;{orderId}</strong>. We have emailed your order
                  confirmation and will update you once its shipped.
                </Typography>
                <Button
                  onClick={() => {
                    setCartList([]);
                    navigate("/order");
                  }}
                  variant="contained"
                  sx={{
                    alignSelf: "start",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Go to my orders
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {activeStep === 0 ? (
                  <AddressForm
                    buyerFirstName={buyerFirstName}
                    setBuyerFirstName={setBuyerFirstName}
                    buyerLastName={buyerLastName}
                    setBuyerLastName={setBuyerLastName}
                    country={country}
                    setCountry={setCountry}
                    state={state}
                    setState={setState}
                    city={city}
                    setCity={setCity}
                    pincode={pincode}
                    setPincode={setPincode}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    location={location}
                    setLocation={setLocation}
                    latitude={latitude}
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                  />
                ) : activeStep === 1 ? (
                  <Review
                    buyerFirstName={buyerFirstName}
                    buyerLastName={buyerLastName}
                    location={location}
                    pincode={pincode}
                    country={country}
                    state={state}
                    city={city}
                    distances={distances}
                    totalDistanceKM={totalDistanceKM}
                    totalQuantities={totalQuantities}
                    selectedQuantities={selectedQuantities}
                    totalPrice={TotalAmount}
                  />
                ) : (
                  <PaymentForm
                    handleOrderPayment={handleOrderPayment}
                    paymentType={paymentType}
                    setPaymentType={setPaymentType}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    justifyContent:
                      activeStep !== 0 ? "space-between" : "flex-end",
                    alignItems: "end",
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: "60px",
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{
                        display: { xs: "flex", sm: "none" },
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                    className="mb-5"
                    sx={{
                      width: { xs: "100%", sm: "fit-content" },
                    }}
                    style={{
                      display:
                        activeStep === steps.length - 1 ? "none" : "block",
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
