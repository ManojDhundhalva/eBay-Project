const pool = require("../db");
const queries = require("../queries/order");
const bcrypt = require("bcrypt");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const saltRounds = Number(process.env.SALT_ROUNDS);
const hashAsync = util.promisify(bcrypt.hash);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDistanceCostByProductId(data, productId) {
  const product = data.find((item) => item.productId === productId);
  return product ? product : null; // Return distanceCost or null if not found
}

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
    distances,
    has_order_eBay_charge,
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
      const tracking_id = uuidv4();
      const { distanceKM, distanceCost } = getDistanceCostByProductId(
        distances,
        product.product_id
      );
      const results1 = await pool.query(queries.makeHasOrder, [
        tracking_id,
        orderUniqueID,
        prdouctQuanties[product.product_id],
        product.product_id,
        distanceKM,
        distanceCost,
        has_order_eBay_charge,
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

    const name =
      String(capitalizeFirstLetter(order_shipping_address_city)) +
      String(capitalizeFirstLetter(order_shipping_address_state)) +
      String(capitalizeFirstLetter(order_shipping_address_country));

    const managerName = name + "Manager";
    const shipperName = name + "Shipper";

    const usernameResult = await pool.query(queries.IfExistBuyerSideManager, [
      managerName,
    ]);

    if (usernameResult.rows.length === 0) {
      const userManager = {
        firstname: managerName,
        lastname: managerName,
        username: managerName,
        emailid: managerName + "@gmail.com",
        password: "123456789",
        role: "manager",
        phone_number: "1234567890",
      };

      const userShipper = {
        firstname: shipperName,
        lastname: shipperName,
        username: shipperName,
        emailid: shipperName + "@gmail.com",
        password: "123456789",
        role: "shipper",
        phone_number: "1234567890",
      };

      const newPasswordManager = await hashAsync(
        userManager.password,
        saltRounds
      );
      const managerUniqueId = uuidv4();
      const createAccountResult1 = await pool.query(queries.createAccount, [
        managerUniqueId,
        userManager.firstname,
        userManager.lastname,
        userManager.username,
        userManager.emailid,
        newPasswordManager,
        userManager.role,
        userManager.phone_number,
      ]);

      const newPasswordShipper = await hashAsync(
        userShipper.password,
        saltRounds
      );
      const shipperUniqueId = uuidv4();
      const createAccountResult2 = await pool.query(queries.createAccount, [
        shipperUniqueId,
        userShipper.firstname,
        userShipper.lastname,
        userShipper.username,
        userShipper.emailid,
        newPasswordShipper,
        userShipper.role,
        userShipper.phone_number,
      ]);

      const inventory_house_name =
        String(capitalizeFirstLetter(order_shipping_address_city)) +
        " Inventory";

      const inventoryUniqueId = uuidv4();
      const createInventoryResult = await pool.query(queries.createInventory, [
        inventoryUniqueId,
        managerUniqueId,
        inventory_house_name,
        order_shipping_address_city,
        order_shipping_address_state,
        order_shipping_address_country,
      ]);

      const createShipperResult = await pool.query(queries.createShipper, [
        shipperUniqueId,
        inventoryUniqueId,
      ]);
    }

    resp.status(200).json({ order_id: orderUniqueID });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrders = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllOrders, [req.user.id]);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getOrdersDetails = async (req, resp) => {
  try {
    const results = await pool.query(queries.getOrderDetailsByOrderId, [
      req.query.orderId,
    ]);
    resp.status(200).json(results.rows[0]);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getOrderedProductIds = async (req, resp) => {
  try {
    const results = await pool.query(queries.getOrderedProductIds, [
      req.user.id,
    ]);
    resp.status(200).json(results.rows[0]);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getCountOfOrders = async (req, resp) => {
  try {
    const results = await pool.query(queries.getCountOfOrders, [req.user.id]);
    resp.status(200).json(results.rows[0]);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  makePayment,
  makeOrder,
  getAllOrders,
  getOrdersDetails,
  getOrderedProductIds,
  getCountOfOrders,
};
