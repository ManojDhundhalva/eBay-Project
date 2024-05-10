import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
// import { CountryDropdown, RegionDropdown, CityDropdown } from 'react-country-region-selector';
import { Country, State, City } from "country-state-city";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import axios from "axios";
import TextField from "@mui/material/TextField";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm({
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
    <Grid container spacing={3}>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="first-name" required>
          First name
        </FormLabel>
        <OutlinedInput
          value={buyerFirstName}
          id="first-name"
          name="first-name"
          type="name"
          placeholder="John"
          autoComplete="first name"
          required
          onChange={(e) => {
            setBuyerFirstName(e.target.value);
          }}
        />
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="last-name" required>
          Last name
        </FormLabel>
        <OutlinedInput
          value={buyerLastName}
          id="last-name"
          name="last-name"
          type="last-name"
          placeholder="Snow"
          autoComplete="last name"
          required
          onChange={(e) => {
            setBuyerLastName(e.target.value);
          }}
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="location" required>
          <PlaceOutlinedIcon /> Location
        </FormLabel>
        <div>{location}</div>
        <Grid
          style={{
            marginTop: "0.4em",
            width: "20em",
          }}
          id="searchBoxContainer"
        ></Grid>
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="zip" required>
          Zip / Postal code
        </FormLabel>
        <OutlinedInput
          value={pincode}
          id="zip"
          name="zip"
          type="zip"
          placeholder="12345"
          autoComplete="shipping postal-code"
          onChange={handlePincode}
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="phone-number" required>
          Phone Number
        </FormLabel>
        <OutlinedInput
          value={phoneNumber}
          id="phone-number"
          name="phone-number"
          type="phone-number"
          placeholder="1234567890"
          autoComplete="phoneNumber"
          required
          onChange={handlePhoneNumber}
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <hr />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="latitude">Latitude</FormLabel>
        <TextField
          value={latitude}
          id="latitude"
          name="latitude"
          type="latitude"
          placeholder="23.532"
          InputProps={{
            readOnly: true,
          }}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="longitude">Longitude</FormLabel>
        <TextField
          value={longitude}
          id="longitude"
          name="longitude"
          type="longitude"
          placeholder="23.532"
          InputProps={{
            readOnly: true,
          }}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="country">Country</FormLabel>
        <TextField
          value={country}
          id="Country"
          name="Country"
          type="text"
          placeholder="Country"
          InputProps={{
            readOnly: true,
          }}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="state">State</FormLabel>
        <TextField
          value={state}
          id="state"
          name="state"
          type="text"
          placeholder="State"
          InputProps={{
            readOnly: true,
          }}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="city">City</FormLabel>
        <TextField
          value={city}
          id="city"
          name="city"
          type="text"
          placeholder="City"
          InputProps={{
            readOnly: true,
          }}
        />
      </FormGrid>
      <FormGrid item xs={12}>
        &nbsp;
      </FormGrid>
    </Grid>
  );
}
