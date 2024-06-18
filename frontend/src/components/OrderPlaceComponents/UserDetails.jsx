import React, { useState, useEffect } from "react";
import { Grid, TextField, Typography, IconButton } from "@mui/material";
import axios from "axios";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

function UserDetails({
  buyerFirstName,
  setBuyerFirstName,
  buyerLastName,
  setBuyerLastName,
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  pincode,
  setPincode,
  phoneNumber,
  setPhoneNumber,
  location,
  setLocation,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
}) {
  const [apiKey, setApiKey] = useState("");

  const handlePincode = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      if (input.length <= 6) {
        setPincode(input);
      }
    }
  };

  const handlePhoneNumber = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      if (input.length <= 10) {
        setPhoneNumber(input);
      }
    }
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        };
        const response = await axios.get(
          `http://localhost:8000/api/v1/getTomTomApiKey?username=${window.localStorage.getItem(
            "username"
          )}&role=${window.localStorage.getItem("role")}`,
          { headers }
        );
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };
    fetchApiKey();
  }, []);

  useEffect(() => {
    if (apiKey) {
      initializeTomTomSearchBox(apiKey);
    }
  }, [apiKey]);

  const initializeTomTomSearchBox = (apiKey) => {
    var options = {
      searchOptions: {
        key: apiKey,
        language: "en-GB",
        limit: 5,
        placeholder: "Search for Nearby Location",
      },
      autocompleteOptions: {
        key: apiKey,
        language: "en-GB",
      },
    };

    options.container = "#searchBoxContainer";

    var ttSearchBox = new window.tt.plugins.SearchBox(
      window.tt.services,
      options
    );

    ttSearchBox.on("tomtom.searchbox.resultselected", function (data) {
      if (data.data?.text !== undefined) {
        // console.log(data.data.text);
        setLocation(data.data.text);
      }
      if (data.data.result.address?.country !== undefined) {
        // console.log(data.data.result.address.country);
        setCountry(data.data.result.address.country);
      }
      if (data.data.result.address?.countrySubdivision !== undefined) {
        // console.log(data.data.result.address.countrySubdivision);
        setState(data.data.result.address.countrySubdivision);
      }
      if (data.data.result.address?.countrySecondarySubdivision !== undefined) {
        // console.log(data.data.result.address.countrySecondarySubdivision);
        setCity(data.data.result.address.countrySecondarySubdivision);
      }
      if (data.data.result.address?.postalCode !== undefined) {
        // console.log(data.data.result.address.postalCode);
        setPincode(data.data.result.address.postalCode);
      } else {
        setPincode("");
      }
      if (
        data.data.result.position?.lat !== undefined &&
        data.data.result.position?.lng !== undefined
      ) {
        setLatitude(data.data.result.position.lat);
        setLongitude(data.data.result.position.lng);
      } else {
        console.log("Position data is not available:", data);
      }
    });

    var searchBoxHTML = ttSearchBox.getSearchBoxHTML();
    document.getElementById("searchBoxContainer").appendChild(searchBoxHTML);
  };

  return (
    <>
      <Grid container item margin={0} padding={0}>
        <Grid xs={6} item margin={0} padding={2}>
          <TextField
            value={buyerFirstName}
            onChange={(e) => {
              setBuyerFirstName(e.target.value);
            }}
            id="first-name"
            label="First Name"
            placeholder="e.g. John"
            variant="outlined"
            fullWidth
            required
            size="small"
            error={buyerFirstName === ""}
            helperText={
              buyerFirstName === "" ? "This field cannot be empty" : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid xs={6} item margin={0} padding={1}>
          <TextField
            value={buyerLastName}
            onChange={(e) => {
              setBuyerLastName(e.target.value);
            }}
            id="last-name"
            label="Last Name"
            placeholder="e.g. John"
            variant="outlined"
            fullWidth
            required
            size="small"
            error={buyerLastName === ""}
            helperText={
              buyerLastName === "" ? "This field cannot be empty" : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid xs={12} item margin={0} paddingX={2} paddingBottom={4}>
          <Grid sx={{ display: "flex", alignItems: "center" }}>
            <IconButton aria-label="fingerprint">
              <LocationOnRoundedIcon
                fontSize="large"
                sx={{ color: "#0077b6" }}
              />
            </IconButton>
            <Typography variant="h6">
              {location === "" ? "N/A" : location}
            </Typography>
          </Grid>
          <Grid id="searchBoxContainer"></Grid>
        </Grid>
        <Grid xs={3} item margin={0} padding={1}>
          <TextField
            value={latitude}
            id="latitude"
            label="Latitude"
            placeholder="  --"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <MyLocationRoundedIcon style={{ color: "#0077b6" }} />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid xs={3} item margin={0} padding={1}>
          <TextField
            value={longitude}
            onChange={(e) => {
              setBuyerLastName(e.target.value);
            }}
            id="longitude"
            label="Longitude"
            placeholder="  --"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <MyLocationRoundedIcon style={{ color: "#0077b6" }} />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid xs={6} item margin={0} padding={1}>
          <TextField
            value={phoneNumber}
            onChange={handlePhoneNumber}
            id="phone-number"
            label="Phone Number"
            placeholder="e.g. 1234567890"
            variant="outlined"
            fullWidth
            required
            size="small"
            error={phoneNumber === ""}
            helperText={phoneNumber === "" ? "This field cannot be empty" : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid xs={6} item margin={0} padding={1}>
          <TextField
            value={pincode}
            onChange={handlePincode}
            id="pincode"
            label="Pincode"
            placeholder="e.g. 123456"
            variant="outlined"
            fullWidth
            required
            size="small"
            error={pincode === ""}
            helperText={pincode === "" ? "This field cannot be empty" : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid xs={6} item margin={0} padding={1}>
          <TextField
            value={city}
            id="city"
            label="City"
            placeholder="e.g. Surat"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid xs={6} item margin={0} padding={1}>
          <TextField
            value={state}
            id="state"
            label="State"
            placeholder="e.g. Gujarat"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
        <Grid xs={6} item margin={0} padding={1}>
          <TextField
            value={country}
            id="country"
            label="Country"
            placeholder="e.g. India"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 25,
                fontWeight: "bold",
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default UserDetails;
