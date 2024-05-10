import * as React from "react";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useProduct } from "../../context/product";

function Info({
  totalPrice,
  selectedQuantities,
  totalQuantities,
  totalDistanceKM,
}) {
  const { cartList } = useProduct();

  React.useEffect(() => {
    console.log(process.env.REACT_APP_SHIPPING_CHARGES);
  }, []);

  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="text.secondary">
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        ₹
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
        ).toFixed(2)}
      </Typography>
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
      </List>
      <hr className="my-4" />
      <Typography variant="body1" style={{ fontWeight: "bold" }}>
        Other Charges
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            className="text-uppercase"
            sx={{ mr: 2 }}
            primary={`ebay Charge`}
          />
          <Typography variant="body1" fontWeight="medium">
            ₹{" "}
            {Number(
              Number(totalPrice) * (process.env.REACT_APP_EBAY_CHARGES / 100)
            ).toFixed(2)}{" "}
            ({process.env.REACT_APP_EBAY_CHARGES}%)
          </Typography>
        </ListItem>
        {totalDistanceKM ? (
          <>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText
                className="text-uppercase"
                sx={{ mr: 2 }}
                primary={`Total Distance`}
              />

              <Typography variant="body2" fontWeight="medium">
                {(totalDistanceKM).toFixed(2)} KM
              </Typography>
            </ListItem>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText
                className="text-uppercase"
                sx={{ mr: 2 }}
                primary={`Shipping Cost`}
                secondary={`Distance(${process.env.REACT_APP_SHIPPING_CHARGES}%)`}
              />
              <Typography variant="body1" fontWeight="medium">
                ₹{" "}
                {Number(
                  Number(totalDistanceKM) *
                    Number(process.env.REACT_APP_SHIPPING_CHARGES / 100)
                ).toFixed(2)}
                ({process.env.REACT_APP_SHIPPING_CHARGES}%)
              </Typography>
            </ListItem>
          </>
        ) : (
          <></>
        )}
      </List>
      <hr className="my-4" />
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            className="text-uppercase"
            sx={{ mr: 2 }}
            primary={`Total Amount`}
          />
          <Typography variant="body1" fontWeight="medium">
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
  );
}

export default Info;
