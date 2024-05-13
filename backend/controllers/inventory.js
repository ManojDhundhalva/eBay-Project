const pool = require("../db");
const queries = require("../queries/inventory");

const getAllProducts = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllProductsOfInventory, [
      req.user.id,
    ]);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllQueues = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllQueuesOfInventory, [
      req.user.id,
    ]);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllReceivedQueues = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllRecievedQueuesOfInventory, [
      req.user.id,
    ]);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const makeOrderShipped = async (req, resp) => {
  const { productIdsArray } = req.body;
  try {
    for (product_id of productIdsArray) {
      const results = await pool.query(queries.makeOrderShippedByProductId, [
        product_id,
      ]);
    }
    resp.status(200).json({ message: "Order Shipped Successfully!" });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const makeOrderOutForDelivery = async (req, resp) => {
  const { productIdsArray } = req.body;
  try {
    for (product_id of productIdsArray) {
      const results = await pool.query(
        queries.makeOrderOutForDeliveryByProductId,
        [product_id]
      );
    }
    resp.status(200).json({ message: "Order Shipped Successfully!" });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllProducts,
  getAllQueues,
  getAllReceivedQueues,
  makeOrderShipped,
  makeOrderOutForDelivery,
};
