import * as React from "react";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useProduct } from "../../context/product";

const payments = [
  { name: "Card type:", detail: "Visa" },
  { name: "Card holder:", detail: "Mr. John Smith" },
  { name: "Card number:", detail: "xxxx-xxxx-xxxx-1234" },
  { name: "Expiry date:", detail: "04/2024" },
];

export default function Review({
  totalDistanceKM,
  totalQuantities,
  selectedQuantities,
  totalPrice,
  distances,
  buyerFirstName,
  buyerLastName,
  location,
  pincode,
  country,
  state,
  city,
}) {
  const { cartList } = useProduct();

  return (
    <>
      <React.Fragment>
        <List disablePadding>
          {cartList.map((product) => (
            <ListItem key={product.product_id} sx={{ py: 1, px: 0 }}>
              <ListItemText
                sx={{ mr: 2 }}
                primary={product.product_title}
                // secondary={product.desc}
              />
              <Typography variant="body1" fontWeight="medium">
                ₹ {product.product_price} (
                {selectedQuantities[product.product_id]} item
                {selectedQuantities[product.product_id] > 1 && "s"})
              </Typography>
            </ListItem>
          ))}
          <hr className="my-4" />
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText
              className="text-uppercase"
              sx={{ mr: 2 }}
              primary={`Total Amount`}
            />
            <Typography
              variant="body1"
              fontWeight="medium"
              style={{ backgroundColor: "lightblue" }}
            >
              ₹ {Number(totalPrice).toFixed(2)} ({totalQuantities} item
              {totalQuantities > 1 && "s"})
            </Typography>
          </ListItem>
          <ListItem className="mt-4" sx={{ py: 1, px: 0 }}>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              Shipping Charges
            </Typography>
          </ListItem>
          {distances.map((item, index) => (
            <ListItem key={index} sx={{ py: 1, px: 0 }}>
              <ListItemText
                sx={{ mr: 2 }}
                primary={item.sourceCity}
                // secondary={product.desc}
              />
              <Typography variant="body1" fontWeight="medium">
                {item.distanceKM} KM
              </Typography>
            </ListItem>
          ))}
          <hr className="my-4" />
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText
              className="text-uppercase"
              sx={{ mr: 2 }}
              primary={`Total Distance`}
            />
            <Typography variant="body1" fontWeight="medium">
              {totalDistanceKM} KM
            </Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText
              className="text-uppercase"
              // sx={{ mr: 2 }}
              primary={`Total Distance Charges`}
            />
            <Typography
              variant="body1"
              fontWeight="medium"
              style={{ backgroundColor: "lightblue" }}
            >
              ₹{" "}
              {Number(
                Number(totalDistanceKM) *
                  Number(process.env.REACT_APP_SHIPPING_CHARGES / 100)
              ).toFixed(2)}
              ({process.env.REACT_APP_SHIPPING_CHARGES}%)
            </Typography>
          </ListItem>

          <ListItem className="mt-4" sx={{ py: 1, px: 0 }}>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              Other Charges
            </Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText
              className="text-uppercase"
              sx={{ mr: 2 }}
              primary={`ebay Charge`}
            />
            <Typography
              variant="body1"
              fontWeight="medium"
              style={{ backgroundColor: "lightblue" }}
            >
              ₹{" "}
              {Number(
                Number(totalPrice) * (process.env.REACT_APP_EBAY_CHARGES / 100)
              ).toFixed(2)}{" "}
              ({process.env.REACT_APP_EBAY_CHARGES}%)
            </Typography>
          </ListItem>
          <hr className="my-4" />
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText
              className="text-uppercase"
              sx={{ mr: 2 }}
              primary={`Total Amount`}
            />
            <Typography
              variant="body1"
              fontWeight="medium"
              style={{ backgroundColor: "lightblue" }}
            >
              ₹{" "}
              {Number(
                Number(
                  Number(
                    Number(totalPrice) +
                      Number(
                        Number(totalPrice) *
                          (process.env.REACT_APP_EBAY_CHARGES / 100)
                      )
                  ) +
                    Number(
                      Number(totalDistanceKM) *
                        Number(process.env.REACT_APP_SHIPPING_CHARGES / 100)
                    )
                )
              ).toFixed(2)}{" "}
              ({totalQuantities} item{totalQuantities > 1 && "s"})
            </Typography>
          </ListItem>
        </List>
      </React.Fragment>
      <Stack spacing={2}>
        <Divider />
        <Stack
          direction="column"
          divider={<Divider flexItem />}
          spacing={2}
          sx={{ my: 2 }}
        >
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Shipment details
            </Typography>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item xs={3.5}>
                <Typography gutterBottom>First Name</Typography>
              </Grid>
              <Grid item xs={0.5}>
                <Typography gutterBottom> : </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography gutterBottom>{buyerFirstName}</Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item xs={3.5}>
                <Typography gutterBottom>Last Name</Typography>
              </Grid>
              <Grid item xs={0.5}>
                <Typography gutterBottom> : </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography gutterBottom>{buyerLastName}</Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item xs={3.5}>
                <Typography gutterBottom>Shipping Address</Typography>
              </Grid>
              <Grid item xs={0.5}>
                <Typography gutterBottom> : </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography gutterBottom>{location}</Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item xs={3.5}>
                <Typography gutterBottom>Pincode</Typography>
              </Grid>
              <Grid item xs={0.5}>
                <Typography gutterBottom> : </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography gutterBottom>{pincode}</Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item xs={3.5}>
                <Typography gutterBottom>Country</Typography>
              </Grid>
              <Grid item xs={0.5}>
                <Typography gutterBottom> : </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography gutterBottom>{country}</Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item xs={3.5}>
                <Typography gutterBottom>State</Typography>
              </Grid>
              <Grid item xs={0.5}>
                <Typography gutterBottom> : </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography gutterBottom>{state}</Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item xs={3.5}>
                <Typography gutterBottom>City</Typography>
              </Grid>
              <Grid item xs={0.5}>
                <Typography gutterBottom> : </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography gutterBottom>{city}</Typography>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Stack>
    </>
  );
}
