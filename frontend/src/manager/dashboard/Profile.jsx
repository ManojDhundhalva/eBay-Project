import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

export default function Profile() {
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
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                  alt="Generic placeholder image"
                  className="mt-4 mb-2 img-thumbnail"
                  style={{ width: "150px", zIndex: "1" }}
                />
                <Button
                  variant="outlined"
                  style={{ height: "36px", overflow: "visible", color: "#000" }}
                >
                  Edit profile
                </Button>
              </div>
              <div className="ms-3" style={{ marginTop: "130px" }}>
                <Typography variant="h5">Andy Horwitz</Typography>
                <Typography>New York</Typography>
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
                    Web Developer
                  </Typography>
                  <Typography variant="body1" className="font-italic mb-1">
                    Lives in New York
                  </Typography>
                  <Typography variant="body1" className="font-italic mb-0">
                    Photographer
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
