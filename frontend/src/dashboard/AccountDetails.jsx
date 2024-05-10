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
import ToggleColorMode from "./ToggleColorMode";
import { useAuth } from "../context/auth";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import getLPTheme from "../getLPTheme";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SearchIcon from "@mui/icons-material/Search";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

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

const steps = ["Shipping address", "Payment details", "Review your order"];

const logoStyle = {
  width: "140px",
  height: "56px",
  marginLeft: "-4px",
  marginRight: "-8px",
};

export default function AccountDetails() {
  const [accountNumber, setAccountNumber] = React.useState("");
  const [accountHolderFirstName, setAccountHolderFirstName] =
    React.useState("");
  const [accountHolderLastName, setAccountHolderLastName] = React.useState("");
  const [accountIFSCcode, setAccountIFSCcode] = React.useState("");
  const [accountBranch, setAccountBranch] = React.useState("");
  const [accountBranchAddress, setAccountBranchAddress] = React.useState("");
  const [accountBalance, setAccountBalance] = React.useState("00.00");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [pincode, setPincode] = React.useState("");

  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);

  const [editOn, setEditOn] = React.useState(false);
  const [isAccount, setIsAccount] = React.useState(false);
  const { LogOut } = useAuth();

  const handleAccountNumber = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      setAccountNumber(input);
    }
  };

  const handlePincode = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      if (input.length <= 6) {
        setPincode(input);
      }
    }
  };

  const LPtheme = createTheme(getLPTheme());
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [sellerCity, setSellerCity] = useState("");
  const [sellerState, setSellerState] = useState("");
  const [sellerCountry, setSellerCountry] = useState("");

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

  const [apiKey, setApiKey] = useState("");
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
      // const newLocation =
      //   String(data.data.result.position.lat) +
      //   "," +
      //   String(data.data.result.position.lng);
      // setLocation(newLocation);
      setLocation(data.data.text);
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

  // Event handler for TextField change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update state based on the name of the input field
    switch (name) {
      case "account-number":
        setAccountNumber(value);
        break;
      case "first-name":
        setAccountHolderFirstName(value);
        break;
      case "last-name":
        setAccountHolderLastName(value);
        break;
      case "IFSC-code":
        setAccountIFSCcode(value);
        break;
      case "branch-name":
        setAccountBranch(value);
        break;
      case "address":
        setAccountBranchAddress(value);
        break;
      case "zip":
        setPincode(value);
        break;
      default:
        break;
    }
  };

  const handleEdit = () => {
    setEditOn(!editOn);
  };

  const updateAccount = async () => {
    if (
      accountNumber === "" ||
      accountHolderFirstName === "" ||
      accountHolderLastName === "" ||
      accountIFSCcode === "" ||
      accountBranch === "" ||
      accountBranchAddress === "" ||
      latitude === "" ||
      longitude === "" ||
      city === "" ||
      state === "" ||
      country === "" ||
      pincode === "" ||
      accountNumber.length >= 255 ||
      accountHolderFirstName.length >= 255 ||
      accountHolderLastName.length >= 255 ||
      accountIFSCcode.length >= 16 ||
      accountBranch.length >= 255 ||
      accountBranchAddress.length >= 65536
    ) {
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/bank-details?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          account_number: accountNumber,
          account_holder_first_name: accountHolderFirstName,
          account_holder_last_name: accountHolderLastName,
          account_IFSC_code: accountIFSCcode,
          account_branch: accountBranch,
          account_branch_address: accountBranchAddress,
          seller_latitude: latitude,
          seller_longitude: longitude,
          seller_location: location,
          seller_city: city,
          seller_state: state.name,
          seller_country: country.name,
          seller_pincode: pincode,
        },
        { headers }
      );

      if (response.status === 201) {
        // Account already exists
        toast.error(<b>Account already exists</b>);
        setEditOn(true);
      } else {
        toast.success(<b>Account updated successfully!</b>);
      }
    } catch (err) {
      // LogOut();
      console.log("Error updating profile:", err);
      toast.error(<b>Failed to update account. Please try again later.</b>);
    }
  };

  const getAccount = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/bank-details?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );

      if (results.status === 200) {
        const data = results.data;

        setAccountBalance(data.account_balance);
        setAccountNumber(data.account_number);
        setAccountHolderFirstName(data.account_holder_first_name);
        setAccountHolderLastName(data.account_holder_last_name);
        setAccountIFSCcode(data.account_ifsc_code);
        setAccountBranch(data.account_branch);
        setAccountBranchAddress(data.account_branch_address);
        setLatitude(data.seller_coordinates.x);
        setLongitude(data.seller_coordinates.y);
        setLocation(data.seller_location);
        setPincode(data.seller_pincode);
        setSellerCity(data.seller_city);
        setSellerState(data.seller_state);
        setSellerCountry(data.seller_country);

        // // Find corresponding country, state, and city objects
      } else {
        console.error("Failed to fetch account details");
      }
    } catch (err) {
      LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  React.useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    const foundCountry = countryList.find(
      (country) => country.name === sellerCountry
    );
    if (foundCountry) {
      setCountry(foundCountry);
      setStateList(State.getStatesOfCountry(foundCountry.isoCode));
    }
  }, [sellerCountry]);

  useEffect(() => {
    const foundState = stateList.find((state) => state.name === sellerState);
    if (foundState) {
      setState(foundState);
      setCityList(
        City.getCitiesOfState(foundState.countryCode, foundState.isoCode)
      );
    }
  }, [stateList]);

  useEffect(() => {
    const foundCity = cityList.find((city) => city.name === sellerCity);
    if (foundCity) {
      setCity(foundCity.name);
    }
  }, [cityList]);

  return (
    <>
      <ThemeProvider theme={LPtheme}>
        <CssBaseline />
        <h1>{accountBalance}Rs</h1>
        {editOn ? (
          <Button
            variant="contained"
            onClick={() => {
              handleEdit();
              updateAccount();
            }}
          >
            Save <SaveIcon />
          </Button>
        ) : (
          <Button variant="contained" onClick={handleEdit}>
            Edit Bank Details <EditIcon />
          </Button>
        )}
        <hr></hr>
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
          <React.Fragment>
            <Grid container spacing={3}>
              <FormGrid item xs={12}>
                <FormLabel htmlFor="seller" style={{ fontWeight: "bold" }}>
                  Seller Details
                </FormLabel>
              </FormGrid>
              <FormGrid item xs={6}>
                <FormLabel htmlFor="location" required>
                  <PlaceOutlinedIcon /> Location
                </FormLabel>
                <div>{location}</div>
                <Grid
                  style={{
                    marginTop: "0.4em",
                    width: "20em",
                    display: editOn ? "block" : "none",
                  }}
                  id="searchBoxContainer"
                ></Grid>
                <TextField
                  value={location}
                  id="search"
                  variant="outlined"
                  style={{
                    marginTop: "0.4em",
                    width: "20em",
                    display: !editOn ? "block" : "none",
                  }}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <SearchIcon style={{ color: "gray" }} />,
                  }}
                />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormLabel htmlFor="zip" required>
                  Zip / Postal code
                </FormLabel>
                <TextField
                  value={pincode}
                  id="zip"
                  name="zip"
                  type="zip"
                  placeholder="12345"
                  autoComplete="shipping postal-code"
                  required
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  onChange={handlePincode}
                  error={pincode === ""}
                  helperText={
                    pincode === "" ? "This field cannot be empty" : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={3}>
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
              <FormGrid item xs={3}>
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
                  inputProps={{
                    readOnly: !editOn,
                  }}
                  error={country === ""}
                >
                  <MenuItem value="">Select Country</MenuItem>
                  {countryList.map((item, index) => (
                    <MenuItem
                      key={index}
                      value={item}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {editOn && (
                  <FormHelperText style={{ color: "red" }}>
                    {country === "" ? "Please, Select country" : ""}
                  </FormHelperText>
                )}
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
                  inputProps={{
                    readOnly: !editOn,
                  }}
                  error={state === ""}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {stateList.map((item, index) => (
                    <MenuItem
                      key={index}
                      value={item}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {editOn && (
                  <FormHelperText style={{ color: "red" }}>
                    {state === "" ? "Please, Select State" : ""}
                  </FormHelperText>
                )}
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
                  inputProps={{
                    readOnly: !editOn,
                  }}
                  error={city === ""}
                >
                  <MenuItem value="">Select City</MenuItem>
                  {cityList.map((item, index) => (
                    <MenuItem
                      key={index}
                      value={item.name}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {editOn && (
                  <FormHelperText style={{ color: "red" }}>
                    {city === "" ? "Please, Select City" : ""}
                  </FormHelperText>
                )}
              </FormGrid>
              <FormGrid item xs={12}>
                <FormLabel htmlFor="bank" style={{ fontWeight: "bold" }}>
                  Bank Details
                </FormLabel>
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="first-name" required>
                  Account Holder First Name
                </FormLabel>
                <TextField
                  value={accountHolderFirstName}
                  id="first-name"
                  name="first-name"
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  required
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  onChange={handleInputChange}
                  error={
                    accountHolderFirstName === "" ||
                    accountHolderFirstName.length >= 255
                  }
                  helperText={
                    accountHolderFirstName === ""
                      ? "This field cannot be empty"
                      : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="last-name" required>
                  Account Holder Last name
                </FormLabel>
                <TextField
                  value={accountHolderLastName}
                  id="last-name"
                  name="last-name"
                  type="text"
                  placeholder="Snow"
                  autoComplete="last name"
                  required
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  onChange={handleInputChange}
                  error={
                    accountHolderLastName === "" ||
                    accountHolderLastName.length >= 255
                  }
                  helperText={
                    accountHolderLastName === ""
                      ? "This field cannot be empty"
                      : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="account-number" required>
                  Account Number
                </FormLabel>
                <TextField
                  value={accountNumber}
                  id="account-number"
                  name="account-number"
                  type="account-number"
                  placeholder="83413112414"
                  autoComplete="account-number"
                  required
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  onChange={(e) => {
                    handleAccountNumber(e);
                  }}
                  error={accountNumber === "" || accountNumber.length >= 255}
                  helperText={
                    accountNumber === "" ? "This field cannot be empty" : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="IFSC-code" required>
                  IFSC Code
                </FormLabel>
                <TextField
                  value={accountIFSCcode}
                  id="IFSC-code"
                  name="IFSC-code"
                  type="IFSC-code"
                  placeholder="ISCRH343"
                  autoComplete="IFSC-code"
                  required
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  onChange={handleInputChange}
                  error={accountIFSCcode === ""}
                  //  || accountIFSCcode.length >= 16}
                  helperText={
                    accountIFSCcode === "" ? "This field cannot be empty" : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="branch-name" required>
                  Branch Name
                </FormLabel>
                <TextField
                  value={accountBranch}
                  id="branch-name"
                  name="branch-name"
                  type="branch-name"
                  placeholder="Bharuch"
                  autoComplete="branch name"
                  required
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  onChange={handleInputChange}
                  error={accountBranch === "" || accountBranch.length >= 255}
                  helperText={
                    accountBranch === "" ? "This field cannot be empty" : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={12}>
                <FormLabel htmlFor="address" required>
                  Branch Address
                </FormLabel>
                <TextField
                  value={accountBranchAddress}
                  id="address"
                  name="address"
                  type="address"
                  placeholder="Street name and number"
                  autoComplete="shipping address-line"
                  required
                  InputProps={{
                    readOnly: !editOn,
                  }}
                  onChange={handleInputChange}
                  error={
                    accountBranchAddress === ""
                    // ||accountBranchAddress.length >= 65536
                  }
                  helperText={
                    accountBranchAddress === ""
                      ? "This field cannot be empty"
                      : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormLabel>&nbsp;</FormLabel>
              </FormGrid>
            </Grid>
          </React.Fragment>
        </Grid>
      </ThemeProvider>
    </>
  );
}
