import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Rating,
  TextField,
  IconButton,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceIcon from "@mui/icons-material/Place";
import { useAuth } from "../../context/auth";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { toast } from "react-hot-toast";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FormLabel from "@mui/material/FormLabel";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

function BankDetails() {
  axios.defaults.withCredentials = true;

  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderFirstName, setAccountHolderFirstName] = useState("");
  const [accountHolderLastName, setAccountHolderLastName] = useState("");
  const [accountIFSCcode, setAccountIFSCcode] = useState("");
  const [accountBranch, setAccountBranch] = useState("");
  const [accountBranchAddress, setAccountBranchAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("00.00");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [sellerRating, setSellerRating] = useState("");

  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);

  const [justVerify, setJustVerify] = useState(false);
  const [editOn, setEditOn] = useState(false);
  const { validateUser, LogOut } = useAuth();

  const [originalPincode, setOriginalPincode] = useState("");
  const [originalLocation, setOriginalLocation] = useState("");
  const [originalAccountNumber, setOriginalAccountNumber] = useState("");
  const [originalAccountHolderFirstName, setOriginalAccountHolderFirstName] =
    useState("");
  const [originalAccountHolderLastName, setOriginalAccountHolderLastName] =
    useState("");
  const [originalAccountIFSCcode, setOriginalAccountIFSCcode] = useState("");
  const [originalAccountBranch, setOriginalAccountBranch] = useState("");
  const [originalAccountBranchAddress, setOriginalAccountBranchAddress] =
    useState("");

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

  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        };
        const response = await axios.get(
          (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
          `/getTomTomApiKey?username=${window.localStorage.getItem(
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
        setLocation(data.data.text);
      }
      if (data.data.result.address?.country !== undefined) {
        setCountry(data.data.result.address.country);
      }
      if (data.data.result.address?.countrySubdivision !== undefined) {
        setState(data.data.result.address.countrySubdivision);
      }
      if (data.data.result.address?.countrySecondarySubdivision !== undefined) {
        setCity(data.data.result.address.countrySecondarySubdivision);
      }
      if (data.data.result.address?.postalCode !== undefined) {
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

  const updateAccount = async () => {
    setJustVerify(true);
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
      toast.error(<b>Please, Complete All required details.</b>);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      const response = await axios.post(
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
        `/bank-details?username=${window.localStorage.getItem(
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
          seller_state: state,
          seller_country: country,
          seller_pincode: pincode,
        },
        { headers }
      );

      if (response.status === 201) {
        // Account already exists
        toast.error(<b>Account already exists</b>);
      } else {
        toast.success(<b>Account updated successfully!</b>);
        setOriginalPincode(pincode);
        setOriginalLocation(location);
        setOriginalAccountBranch(accountBranch);
        setOriginalAccountBranchAddress(accountBranchAddress);
        setOriginalAccountHolderFirstName(accountHolderFirstName);
        setOriginalAccountHolderLastName(accountHolderLastName);
        setOriginalAccountIFSCcode(accountIFSCcode);
        setOriginalAccountNumber(accountNumber);
        setEditOn(false);
        setJustVerify(false);
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
        (process.env.REACT_APP_BACKEND_API || "http://localhost:8000/api/v1") +
        `/bank-details?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );

      if (results.status === 200) {
        const data = results.data;
        console.log(results.data);

        setAccountBalance(data.account_balance);

        setAccountNumber(data.account_number);
        setOriginalAccountNumber(data.account_number);

        setAccountHolderFirstName(data.account_holder_first_name);
        setOriginalAccountHolderFirstName(data.account_holder_first_name);

        setAccountHolderLastName(data.account_holder_last_name);
        setOriginalAccountHolderLastName(data.account_holder_last_name);

        setAccountIFSCcode(data.account_ifsc_code);
        setOriginalAccountIFSCcode(data.account_ifsc_code);

        setAccountBranch(data.account_branch);
        setOriginalAccountBranch(data.account_branch);

        setAccountBranchAddress(data.account_branch_address);
        setOriginalAccountBranchAddress(data.account_branch_address);

        setLocation(data.seller_location);
        setOriginalLocation(data.seller_location);

        setPincode(data.seller_pincode);
        setOriginalPincode(data.seller_pincode);

        setLatitude(data.seller_coordinates.x);
        setLongitude(data.seller_coordinates.y);
        setCity(data.seller_city);
        setState(data.seller_state);
        setCountry(data.seller_country);
        setSellerRating(data.seller_avg_rating);
      } else {
        setEditOn(true);

        setLocation("N/A");
        setOriginalLocation("N/A");

        setLatitude("  --");
        setLongitude("  --");
        setCity("--");
        setState("--");
        setCountry("--");
      }
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    validateUser();
  }, []);

  return (
    <>
      <Grid container padding={2} margin={0}>
        <Grid xs={12} item padding={2} margin={0}>
          <Box sx={{ backgroundColor: "white", borderRadius: "20px", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid container margin={0} padding={0} alignItems="center">
                <Typography variant="h6" noWrap component="div">
                  Seller Info
                </Typography>
                <Grid container margin={0} padding={0} alignItems="center">
                  <Rating
                    name="product-rating"
                    value={Number(sellerRating)}
                    precision={0.1}
                    readOnly
                    emptyIcon={<StarRoundedIcon />}
                    icon={<StarRoundedIcon />}
                  />
                  <Typography sx={{ px: 1 }} fontWeight="bold">
                    {sellerRating}
                  </Typography>
                </Grid>
              </Grid>
              {editOn ? (
                <Grid>
                  <Tooltip title="Cancel" TransitionComponent={Zoom} arrow>
                    <IconButton
                      aria-label="Cancel"
                      color="#ADD8E6"
                      onClick={() => {
                        setEditOn(false);
                        setJustVerify(false);
                        setPincode(originalPincode);
                        setLocation(originalLocation);
                        setAccountNumber(originalAccountNumber);
                        setAccountHolderFirstName(
                          originalAccountHolderFirstName
                        );
                        setAccountHolderLastName(originalAccountHolderLastName);
                        setAccountIFSCcode(originalAccountIFSCcode);
                        setAccountBranch(originalAccountBranch);
                        setAccountBranchAddress(originalAccountBranchAddress);
                      }}
                      sx={{ backgroundColor: "#fae0e4", color: "red", mx: 1 }}
                    >
                      <CloseRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Save" TransitionComponent={Zoom} arrow>
                    <IconButton
                      aria-label="save"
                      color="#ADD8E6"
                      onClick={() => {
                        updateAccount();
                      }}
                      sx={{ backgroundColor: "lavender", color: "#023E8A" }}
                    >
                      <SaveRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              ) : (
                <Tooltip title="Edit" TransitionComponent={Zoom} arrow>
                  <IconButton
                    aria-label="edit"
                    color="#ADD8E6"
                    onClick={() => {
                      setEditOn(true);
                    }}
                    sx={{ backgroundColor: "lavender", color: "#023E8A" }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <hr />
            <Grid
              container
              paddingX={3}
              paddingY={1}
              margin={0}
              alignItems="center"
            >
              <Grid>
                <Avatar
                  sx={{ backgroundColor: "lightblue", width: 60, height: 60 }}
                >
                  <PlaceIcon fontSize="large" sx={{ color: "#023e8a" }} />
                </Avatar>
              </Grid>
              <Grid padding={3}>
                <Typography variant="h6" noWrap component="div">
                  {location === "" ? "N/A" : location}
                </Typography>
              </Grid>
              <Grid container margin={0} padding={2}>
                <Grid item margin={0} padding={2} xs={12}>
                  <FormLabel
                    htmlFor="location"
                    required
                    sx={{ display: editOn ? "block" : "none" }}
                  >
                    <PlaceOutlinedIcon sx={{ color: "#0077b6" }} /> Location
                  </FormLabel>
                  <Grid
                    sx={{ display: editOn ? "block" : "none" }}
                    id="searchBoxContainer"
                  ></Grid>
                  <TextField
                    value={location}
                    id="search"
                    label="location"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputProps={{
                      readOnly: true,
                      startAdornment: <SearchIcon style={{ color: "blue" }} />,
                    }}
                    sx={{
                      display: !editOn ? "block" : "none",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid container item margin={0} padding={2} xs={6}>
                  <TextField
                    value={latitude}
                    id="latitude"
                    label="Latitude"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <MyLocationRoundedIcon sx={{ color: "#0077b6" }} />
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
                <Grid container item margin={0} padding={2} xs={6}>
                  <TextField
                    value={longitude}
                    id="longitude"
                    label="Longitude"
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
                <Grid item margin={0} padding={2} xs={6}>
                  <TextField
                    value={pincode}
                    onChange={handlePincode}
                    id="pincode"
                    label="pincode"
                    placeholder="e.g. 345622"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      readOnly: !editOn,
                    }}
                    error={justVerify && pincode === ""}
                    helperText={
                      justVerify && pincode === ""
                        ? "This field cannot be empty"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid item margin={0} padding={2} xs={6}>
                  <TextField
                    value={city}
                    id="city"
                    label="city"
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
                <Grid item margin={0} padding={2} xs={6}>
                  <TextField
                    value={state}
                    id="state"
                    label="state"
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
                <Grid item margin={0} padding={2} xs={6}>
                  <TextField
                    value={country}
                    id="country"
                    label="country"
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
            </Grid>
          </Box>
        </Grid>
        <Grid xs={12} item padding={2} margin={0}>
          <Box sx={{ backgroundColor: "white", borderRadius: "20px", p: 2 }}>
            <Typography variant="h6" noWrap component="div">
              Bank Info
            </Typography>
            <hr />
            <Grid
              container
              paddingX={3}
              paddingY={1}
              margin={0}
              alignItems="center"
            >
              <Grid>
                <Avatar
                  sx={{ backgroundColor: "lightblue", width: 60, height: 60 }}
                >
                  <AccountBalanceRoundedIcon
                    fontSize="large"
                    sx={{ color: "#023e8a" }}
                  />
                </Avatar>
              </Grid>
              <Grid padding={3}>
                <Typography variant="h5" fontWeight="bold">
                  &#8377; {accountBalance}
                </Typography>
              </Grid>
              <Grid container margin={0} padding={2}>
                <Grid item margin={0} padding={2} xs={6}>
                  <TextField
                    value={accountHolderFirstName}
                    onChange={(e) => {
                      setAccountHolderFirstName(e.target.value);
                    }}
                    id="first-name"
                    label="First Name"
                    placeholder="e.g. Manoj"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      readOnly: !editOn,
                    }}
                    error={justVerify && accountHolderFirstName === ""}
                    helperText={
                      justVerify && accountHolderFirstName === ""
                        ? "This field cannot be empty"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid container item margin={0} padding={2} xs={6}>
                  <TextField
                    value={accountHolderLastName}
                    onChange={(e) => {
                      setAccountHolderLastName(e.target.value);
                    }}
                    id="last-name"
                    label="Last Name"
                    placeholder="e.g. Dhundhalva"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      readOnly: !editOn,
                    }}
                    error={justVerify && accountHolderLastName === ""}
                    helperText={
                      justVerify && accountHolderLastName === ""
                        ? "This field cannot be empty"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid container item margin={0} padding={2} xs={6}>
                  <TextField
                    value={accountBranch}
                    onChange={(e) => {
                      setAccountBranch(e.target.value);
                    }}
                    id="account-branch"
                    label="Account Branch"
                    placeholder="e.g. Bharuch"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      readOnly: !editOn,
                    }}
                    error={justVerify && accountBranch === ""}
                    helperText={
                      justVerify && accountBranch === ""
                        ? "This field cannot be empty"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid item margin={0} padding={2} xs={6}>
                  <TextField
                    value={accountIFSCcode}
                    onChange={(e) => {
                      setAccountIFSCcode(e.target.value);
                    }}
                    id="IFSC-code"
                    label="IFSC code"
                    variant="outlined"
                    placeholder="ISCRH343"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      readOnly: !editOn,
                    }}
                    error={justVerify && accountIFSCcode === ""}
                    helperText={
                      justVerify && accountIFSCcode === ""
                        ? "This field cannot be empty"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid item margin={0} padding={2} xs={6}>
                  <TextField
                    value={accountNumber}
                    onChange={handleAccountNumber}
                    id="account-number"
                    label="Account Number"
                    placeholder="e.g. 1234567890"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      readOnly: !editOn,
                    }}
                    error={justVerify && accountNumber === ""}
                    helperText={
                      justVerify && accountNumber === ""
                        ? "This field cannot be empty"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid item margin={0} padding={2} xs={12}>
                  <TextField
                    value={accountBranchAddress}
                    onChange={(e) => {
                      setAccountBranchAddress(e.target.value);
                    }}
                    id="account-branch-address"
                    label="Account Branch Address"
                    placeholder="e.g. Bharuch, Gujarat"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      readOnly: !editOn,
                    }}
                    error={justVerify && accountBranchAddress === ""}
                    helperText={
                      justVerify && accountBranchAddress === ""
                        ? "This field cannot be empty"
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default BankDetails;
