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

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm({
  buyerFirstName,
  setBuyerFirstName,
  buyerLastName,
  setBuyerLastName,
  shippingAddressLine,
  setShippingAddressLine,
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
}) {
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

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
    setCountryList(Country.getAllCountries());
  }, []);

  useEffect(() => {
    setState("");
    setCity("");
    setStateList(State.getStatesOfCountry(country.isoCode));
  }, [country]);

  useEffect(() => {
    setCity("");
    setCityList(City.getCitiesOfState(state.countryCode, state.isoCode));
  }, [state]);

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
        <FormLabel htmlFor="address1" required>
          Address line
        </FormLabel>
        <OutlinedInput
          value={shippingAddressLine}
          id="address"
          name="address"
          type="address"
          placeholder="Apartment, suite, unit"
          autoComplete="shipping address-line"
          required
          onChange={(e) => {
            setShippingAddressLine(e.target.value);
          }}
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
        <FormLabel htmlFor="country" required>
          Country
        </FormLabel>
        <Select
          id="country"
          name="country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
          }}
          displayEmpty
        >
          <MenuItem value="">Select Country</MenuItem>
          {countryList.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {/* <FormHelperText>Without label</FormHelperText> */}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="state" required>
          State
        </FormLabel>
        <Select
          id="state"
          name="state"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
          }}
          displayEmpty
        >
          <MenuItem value="">Select State</MenuItem>
          {stateList.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {/* <FormHelperText>Without label</FormHelperText> */}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="city" required>
          City
        </FormLabel>
        <Select
          id="city"
          name="city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
          displayEmpty
        >
          <MenuItem value="">Select City</MenuItem>
          {cityList.map((item, index) => (
            <MenuItem key={index} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {/* <FormHelperText>Without label</FormHelperText> */}
      </FormGrid>
      <FormGrid item xs={12}>
        &nbsp;
      </FormGrid>
    </Grid>
  );
}
