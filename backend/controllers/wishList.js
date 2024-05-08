const pool = require("../db");
const queries = require("../queries/wishList");

const getWishList = async (req, resp) => {
  try {
    const results = await pool.query(queries.getWishListByUserId, [
      req.user.id,
    ]);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const addToWishList = async (req, resp) => {
  const { product_id } = req.body;
  try {
    const results = await pool.query(queries.addToWishByUserId, [
      product_id,
      req.user.id,
    ]);
    resp.status(200).json({ message: "Added Into Cart" });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteFromWishList = async (req, resp) => {
  try {
    const results = await pool.query(
      queries.deleteFromWishListByUserIdAndProductID,
      [req.query.product_id, req.user.id]
    );
    resp.status(200).json({ message: "Deleted From Cart" });
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getWishList,
  addToWishList,
  deleteFromWishList,
};
