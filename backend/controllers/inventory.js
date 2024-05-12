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
module.exports = {
  getAllProducts,
  getAllQueues,
};
