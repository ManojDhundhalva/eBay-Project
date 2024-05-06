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

  const [editOn, setEditOn] = React.useState(false);
  const { LogOut } = useAuth();

  function isValidPin(pin) {
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pin);
  }

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
      case "city":
        setCity(value);
        break;
      case "state":
        setState(value);
        break;
      case "zip":
        setPincode(value);
        break;
      case "country":
        setCountry(value);
        break;
      default:
        break;
    }
  };

  const handleEdit = () => {
    setEditOn(!editOn);
  };

  const updateAccount = () => {};
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
      setAccountBalance(results.data.account_balance);
      setAccountNumber(results.data.account_number);
      setAccountHolderFirstName(results.data.account_holder_first_name);
      setAccountHolderLastName(results.data.account_holder_last_name);
      setAccountIFSCcode(results.data.account_IFSC_code);
      setAccountBranch(results.data.account_branch);
      setAccountBranchAddress(results.data.account_branch_address);
      setCity(results.data.city);
      setState(results.data.state);
      setPincode(results.data.pincode);
      setCountry(results.data.country);
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  React.useEffect(() => {
    getAccount();
  }, []);

  return (
    <>
      <CssBaseline />
      <h1>{accountBalance}Rs</h1>
      {editOn ? (
        <Button
          variant="contained"
          onClick={() => {
            updateAccount();
            handleEdit();
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
            <FormGrid item xs={12} md={6}>
              <FormLabel htmlFor="first-name" required>
                Account Holder First Name
              </FormLabel>
              <TextField
                value={accountHolderFirstName}
                id="first-name"
                name="first-name"
                type="name"
                placeholder="John"
                autoComplete="first name"
                required
                InputProps={{
                  readOnly: !editOn,
                }}
                onChange={handleInputChange}
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
                type="last-name"
                placeholder="Snow"
                autoComplete="last name"
                required
                InputProps={{
                  readOnly: !editOn,
                }}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
              />
            </FormGrid>

            <FormGrid item xs={6}>
              <FormLabel htmlFor="city" required>
                City
              </FormLabel>
              <TextField
                value={city}
                id="city"
                name="city"
                type="city"
                placeholder="New York"
                autoComplete="City"
                required
                InputProps={{
                  readOnly: !editOn,
                }}
                onChange={handleInputChange}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormLabel htmlFor="state" required>
                State
              </FormLabel>
              <TextField
                value={state}
                id="state"
                name="state"
                type="state"
                placeholder="NY"
                autoComplete="State"
                required
                InputProps={{
                  readOnly: !editOn,
                }}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormLabel htmlFor="country" required>
                Country
              </FormLabel>
              <TextField
                value={country}
                id="country"
                name="country"
                type="country"
                placeholder="United States"
                autoComplete="shipping country"
                required
                InputProps={{
                  readOnly: !editOn,
                }}
                onChange={handleInputChange}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormLabel>&nbsp;</FormLabel>
            </FormGrid>
          </Grid>
        </React.Fragment>
      </Grid>
    </>
  );
}
