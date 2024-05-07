const pool = require("../db");
const queries = require("../queries/product");
const { v4: uuidv4 } = require("uuid");

const listProduct = async (req, resp) => {
  const {
    product_title,
    product_price,
    product_available_quantity,
    product_seller_mobile_number,
    product_image,
    product_description,
  } = req.body;

  try {
    const uniqueId = uuidv4();

    await pool.query(queries.listProduct, [
      uniqueId,
      req.user.id,
      product_title,
      product_price,
      product_available_quantity,
      product_seller_mobile_number,
    ]);

    for (const image of product_image) {
      await pool.query(queries.addImage, [uniqueId, image]);
    }

    for (const description of product_description) {
      await pool.query(queries.addDescription, [
        uniqueId,
        description.key,
        description.value,
      ]);
    }

    return resp.status(200).json({ message: "Product Listed Successfully" });
  } catch (err) {
    console.log("Error listing product: ", err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllProducts = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllProducts, [req.user.id]);
    return resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error listing product: ", err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getProductsDetails = async (req, resp) => {
  try {
    const results = await pool.query(queries.getProductsDetails, [
      req.query.productId,
    ]);
    return resp.status(200).json(results.rows[0]);
  } catch (err) {
    console.log("Error listing product: ", err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  listProduct,
  getAllProducts,
  getProductsDetails,
};
