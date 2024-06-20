import React, { useState, useEffect } from "react";
import UserDetails from "./UserDetails";
import ReviewOrder from "./ReviewOrder";
import PaymentDetails from "./PaymentDetails";
import SideBar from "./SideBar";
import Done from "./Done";
import { Grid, Button } from "@mui/material";
import axios from "axios";
import { useProduct } from "../../context/product";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const steps = ["Shipping address", "Review your order", "Payment details"];
const EmptyCircleStepIcon = () => {
  return <CircleOutlinedIcon fontSize="small" sx={{ color: "#03045E" }} />;
};
const CircleStepIcon = () => {
  return <CircleIcon fontSize="small" sx={{ color: "#03045E" }} />;
};
const CheckedStepIcon = () => {
  return <CheckCircleRoundedIcon fontSize="small" sx={{ color: "#03045E" }} />;
};

function OrderPlace({
  TotalAmount,
  selectedQuantities,
  setIsOrderPlaced,
  totalQuantities,
}) {
  const { cartList, setCartList, getOrderList } = useProduct();
  const { LogOut } = useAuth();
  const navigate = useNavigate();

  const [buyerFirstName, setBuyerFirstName] = React.useState("");
  const [buyerLastName, setBuyerLastName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [state, setState] = React.useState("");
  const [city, setCity] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [paymentType, setPaymentType] = React.useState("creditCard");
  const [isPaid, setIsPaid] = React.useState(false);

  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [activeStep, setActiveStep] = useState(0);

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
    } else if (activeStep <= 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep) {
      setActiveStep(activeStep - 1);
    }
  };

  // const [uniqueCities, setUniqueCities] = useState([]);

  // Function to update unique cities whenever products change
  // useEffect(() => {
  //   const updateUniqueCities = () => {
  //     // Use reduce to filter out unique combinations of seller_city, latitude, and longitude
  //     const uniqueCitiesArray = cartList.reduce((unique, product) => {
  //       // Check if a product with the same seller_city, latitude, and longitude already exists
  //       const existingProduct = unique.find(
  //         (p) =>
  //           p.seller_city === product.seller_city &&
  //           p.latitude === product.latitude &&
  //           p.longitude === product.longitude
  //       );

  //       // If not, add the product to the unique array
  //       if (!existingProduct) {
  //         unique.push({
  //           seller_city: product.seller_city,
  //           latitude: product.latitude,
  //           longitude: product.longitude,
  //         });
  //       }

  //       return unique;
  //     }, []);

  //     // Set the state of uniqueCities
  //     setUniqueCities(uniqueCitiesArray);
  //   };

  //   // Call the update function
  //   updateUniqueCities();
  // }, [cartList]);

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
    const { latitude: lat2, longitude: lon2, seller_city, product_id } = dest;

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
      productId: product_id,
      sourceCity: seller_city,
      destinationCity: location,
      distanceKM: calculatedDistance.toFixed(2),
      distanceCost: Number(
        calculatedDistance * (process.env.REACT_APP_SHIPPING_CHARGES / 100)
      ).toFixed(2),
    };
  };

  const handleCalculateDistance = () => {
    const distancesArray = cartList.map((dest) => calculateDistance(dest));
    setDistances(distancesArray);
  };

  useEffect(() => {
    handleCalculateDistance();
  }, [latitude, longitude]);

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
                  Number(
                    TotalAmount * (process.env.REACT_APP_EBAY_CHARGES / 100)
                  ).toFixed(2)
                ) +
                Number(
                  Number(
                    totalDistanceKM *
                      (process.env.REACT_APP_SHIPPING_CHARGES / 100)
                  ).toFixed(2)
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
              distances,
              has_order_eBay_charge: Number(
                process.env.REACT_APP_EBAY_CHARGES
              ).toFixed(2),
            },
            { headers }
          ),
          {
            loading: "Order placing...", // Message shown during loading
            success: <b>Order placed successfully!</b>, // Success message
            error: <b>Failed to order place.</b>, // Error message
          }
        );
        getOrderList();
        setOrderId(results1.data.order_id);
        handleNext();
      } catch (err) {
        // LogOut();
        console.error("Error in order placing:", err);
      }
    } catch (err) {
      // LogOut();
      console.error("Error updating profile:", err);
    }
  };

  return (
    <>
      <Grid container margin={0} padding={0}>
        <Grid
          container
          item
          margin={0}
          padding={0}
          sx={{ backgroundColor: "#FBFCFE", borderRadius: "16px" }}
        >
          <Grid
            id="style-1"
            xs={4}
            item
            margin={0}
            padding={2}
            sx={{
              width: "100%",
              height: "100vh",
              overflow: "scroll",
            }}
          >
            <Grid
              item
              margin={0}
              padding={4}
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "lavender",
                borderRadius: "20px",
              }}
            >
              <Grid
                container
                justifyContent="flex-start"
                paddingY={2}
                margin={0}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setIsOrderPlaced(false);
                  }}
                  sx={{
                    borderRadius: "16px",
                    fontWeight: "bold",
                    backgroundColor: "#03045e",
                    "&:hover": {
                      backgroundColor: "#032174",
                    },
                  }}
                  startIcon={<ArrowBackRoundedIcon sx={{ color: "white" }} />}
                  size="large"
                >
                  Back
                </Button>
              </Grid>
              <SideBar
                totalDistanceKM={totalDistanceKM}
                totalQuantities={totalQuantities}
                selectedQuantities={selectedQuantities}
                totalPrice={TotalAmount}
              />
            </Grid>
          </Grid>
          <Grid
            id="style-1"
            xs={8}
            item
            margin={0}
            padding={0}
            sx={{
              backgroundColor: "ghostwhite",
              width: "100%",
              height: "100vh",
              overflow: "scroll",
            }}
          >
            <Grid margin={0} paddingX={4} paddingTop={6} paddingBottom={2}>
              <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel
                      StepIconComponent={
                        activeStep === index
                          ? CircleStepIcon
                          : activeStep > index
                          ? CheckedStepIcon
                          : EmptyCircleStepIcon
                      }
                      sx={{ fontSize: "large", fontWeight: "bold" }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            <Grid margin={0} paddingX={10} paddingY={6}>
              {activeStep === 0 && (
                <UserDetails
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
              )}
              {activeStep === 1 && (
                <ReviewOrder
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
              )}
              {activeStep === 2 && (
                <PaymentDetails
                  handleOrderPayment={handleOrderPayment}
                  paymentType={paymentType}
                  setPaymentType={setPaymentType}
                />
              )}
              {activeStep === 3 && <Done orderId={orderId} />}
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              padding={2}
              margin={0}
            >
              <Button
                variant="contained"
                onClick={handleBack}
                sx={{
                  visibility:
                    activeStep <= 0 || activeStep >= 3 ? "hidden" : "visible",
                  borderRadius: "16px",
                  fontWeight: "bold",
                  backgroundColor: "#03045e",
                  "&:hover": {
                    backgroundColor: "#032174",
                  },
                }}
                startIcon={<ArrowBackRoundedIcon sx={{ color: "white" }} />}
                size="large"
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  visibility: activeStep >= 2 ? "hidden" : "visible",
                  borderRadius: "16px",
                  fontWeight: "bold",
                  backgroundColor: "#03045e",
                  "&:hover": {
                    backgroundColor: "#032174",
                  },
                }}
                endIcon={<ArrowForwardRoundedIcon sx={{ color: "white" }} />}
                size="large"
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default OrderPlace;
