const pool = require("../db");
const queries = require("../queries/category");

const getAllCategories = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllCategories);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllCategories,
};
