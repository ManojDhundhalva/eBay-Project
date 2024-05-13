import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/auth";

export default function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { LogOut } = useAuth();

  const imageURL =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1fYaY9LEjaK0yhT3WsncM36y6MD9sLCHU4A&s";

  const getProfile = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/profile?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );
      setFirstName(results.data.firstname);
      setLastName(results.data.lastname);
      setUserName(results.data.username);
      setEmail(results.data.emailid);
      setRole(results.data.role);
      setPhoneNumber(results.data.phone_number);
    } catch (err) {
      // LogOut();
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div
      className="gradient-custom-2"
      style={{ backgroundColor: "#9de2ff", padding: "20px" }}
    >
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item lg={12} xl={12}>
          <Card>
            <div
              className="rounded-top text-white d-flex flex-row"
              style={{ backgroundColor: "#000", height: "200px" }}
            >
              <div
                className="ms-4 mt-5 d-flex flex-column"
                style={{ width: "150px" }}
              >
                <img
                  src={imageURL}
                  alt="Generic placeholder image"
                  className="mt-4 mb-2 img-thumbnail"
                  style={{ width: "150px", zIndex: "1" }}
                />
                <Button
                  onClick={() => {
                    LogOut();
                  }}
                  variant="outlined"
                  style={{ height: "36px", overflow: "visible", color: "#000" }}
                >
                  LogOut
                </Button>
              </div>
              <div className="ms-3" style={{ marginTop: "130px" }}>
                <Typography variant="h5">{userName}</Typography>
                <Typography>{email}</Typography>
              </div>
            </div>
            <div
              className="p-4 text-black"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div className="d-flex justify-content-end text-center py-1">
                <div>
                  <Typography variant="h5" className="mb-1">
                    253
                  </Typography>
                  <Typography variant="body2" className="small text-muted mb-0">
                    Photos
                  </Typography>
                </div>
                <div className="px-3">
                  <Typography variant="h5" className="mb-1">
                    1026
                  </Typography>
                  <Typography variant="body2" className="small text-muted mb-0">
                    Followers
                  </Typography>
                </div>
                <div>
                  <Typography variant="h5" className="mb-1">
                    478
                  </Typography>
                  <Typography variant="body2" className="small text-muted mb-0">
                    Following
                  </Typography>
                </div>
              </div>
            </div>
            <CardContent className="text-black p-4">
              <div className="mb-5">
                <Typography variant="h6" className="fw-normal mb-1">
                  About
                </Typography>
                <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                  <Typography variant="body1" className="font-italic mb-1">
                    First Name : {firstName}
                  </Typography>
                  <Typography variant="body1" className="font-italic mb-1">
                    Last Name : {lastName}
                  </Typography>
                  <Typography variant="body1" className="font-italic mb-0">
                    Phone Number : {phoneNumber}
                  </Typography>
                  <Typography variant="body1" className="font-italic mb-0">
                    Inventory
                  </Typography>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h6" className="fw-normal mb-0">
                  Recent photos
                </Typography>
                <Typography variant="body2" className="mb-0">
                  <a href="#!" className="text-muted">
                    Show all
                  </a>
                </Typography>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                    alt="image 1"
                    className="w-100 rounded-3"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                    alt="image 1"
                    className="w-100 rounded-3"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                    alt="image 1"
                    className="w-100 rounded-3"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                    alt="image 1"
                    className="w-100 rounded-3"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
