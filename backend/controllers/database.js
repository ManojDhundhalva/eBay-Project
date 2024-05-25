const pool = require("../db");
const queries = require("../queries/database");

const getAllTables = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllTables);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getTableData = async (req, resp) => {
  try {
    const results = await pool.query(
      `SELECT ROW_NUMBER() OVER () AS id, * FROM ${req.query.table_name}`
    );
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllTables,
  getTableData,
};
