const pool = require("../db");
const queries = require("../queries/cart");

const getCart = async (req, resp) => {
  try {
    const results = await pool.query(queries.getCartByUserId, [req.user.id]);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const addToCart = async (req, resp) => {
  const { product_id } = req.body;
  try {
    const results = await pool.query(queries.addToCartByUserId, [
      product_id,
      req.user.id,
    ]);
    resp.status(200).json({ message: "Added Into Cart" });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteFromCart = async (req, resp) => {
  try {
    const results = await pool.query(
      queries.deleteFromCartByUserIdAndProductID,
      [req.query.product_id, req.user.id]
    );
    resp.status(200).json({ message: "Deleted From Cart" });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  deleteFromCart,
};
