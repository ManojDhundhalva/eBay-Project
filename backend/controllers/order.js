const pool = require("../db");
const queries = require("../queries/order");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const makePayment = async (req, resp) => {
  const { payment_amount, payment_type } = req.body;
  try {
    const uniqueID = uuidv4();
    const results = await pool.query(queries.makeOrderPayment, [
      uniqueID,
      payment_amount,
      payment_type,
    ]);
    resp.status(200).json({ payment_transaction_id: uniqueID });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const makeOrder = async (req, resp) => {
  const {
    prdouctQuanties,
    productList,
    order_buyer_first_name,
    order_buyer_Last_name,
    order_transaction_id,
    order_total_cost,
    order_shipping_cost,
    order_shipping_location,
    latitude,
    longitude,
    order_shipping_address_country,
    order_shipping_address_state,
    order_shipping_address_city,
    order_shipping_address_pincode,
    order_shipping_address_mobile_number,
  } = req.body;

  try {
    const orderUniqueID = uuidv4();
    const results = await pool.query(queries.makeOrderAfterPayment, [
      orderUniqueID,
      req.user.id,
      order_buyer_first_name,
      order_buyer_Last_name,
      order_transaction_id,
      order_total_cost,
      order_shipping_cost,
      order_shipping_location,
      latitude,
      longitude,
      order_shipping_address_country,
      order_shipping_address_state,
      order_shipping_address_city,
      order_shipping_address_pincode,
      order_shipping_address_mobile_number,
    ]);

    for (const product of productList) {
      const results1 = await pool.query(queries.makeHasOrder, [
        orderUniqueID,
        prdouctQuanties[product.product_id],
        product.product_id,
      ]);

      const results2 = await pool.query(queries.makeUpdateProductQuantity, [
        prdouctQuanties[product.product_id],
        product.product_id,
      ]);

      const results3 = await pool.query(queries.transferMoneyToSeller, [
        prdouctQuanties[product.product_id],
        Number(
          Number(product.product_price) -
            Number(product.product_price * (process.env.EBAY_CHARGES / 100))
        ).toFixed(2),
        product.seller_user_id,
      ]);

      const results4 = await pool.query(queries.clearCart, [
        product.product_id,
        req.user.id,
      ]);
    }

    resp.status(200).json({ order_id: orderUniqueID });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  makePayment,
  makeOrder,
};
