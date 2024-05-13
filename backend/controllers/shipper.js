const pool = require("../db");
const queries = require("../queries/shipper");

const getAllProducts = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllProductsOfShipper, [
      req.user.id,
    ]);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const deliverAllProducts = async (req, resp) => {
  const { productIdsArray } = req.body;
  console.log(productIdsArray);
  try {
    for (product_id of productIdsArray) {
      const results = await pool.query(queries.deliverAllProductsOfShipper, [
        product_id,
      ]);
    }
    resp.status(200).json({ message: "Products are delivered" });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllProducts,
  deliverAllProducts,
};
