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

const getFilteredProducts = async (req, resp) => {
  const { value } = req.body;
  try {
    if (value === "All Products") {
      const allProducts = await pool.query(queries.getAllProducts, [
        req.user.id,
      ]);
      return resp.status(200).json(allProducts.rows);
    }

    const categoryResults = await pool.query(queries.isInCategory, [value]);
    const subCategoryResults = await pool.query(queries.isInSubCategory, [
      value,
    ]);

    let query, queryParams;
    if (categoryResults.rows.length > 0) {
      query = queries.getAllCategoryProduct;
    } else if (subCategoryResults.rows.length > 0) {
      query = queries.getAllSubCategoryProduct;
    } else {
      query = queries.getAllSubSubCategoryProduct;
    }

    queryParams = [req.user.id, value];
    const products = await pool.query(query, queryParams);

    resp.status(200).json(products.rows);
  } catch (err) {
    console.error("Error retrieving filtered products:", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getCategoriesOnly = async (req, resp) => {
  try {
    const results = await pool.query(queries.getCategoriesOnly);
    resp.status(200).json(results.rows);
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getFilteredSellerProducts = async (req, resp) => {
  const { value, seller_id } = req.body;
  try {
    if (value === "All Products") {
      const allProducts = await pool.query(queries.getAllSellerProducts, [
        req.user.id,
        seller_id,
      ]);
      return resp.status(200).json(allProducts.rows);
    }

    const categoryResults = await pool.query(queries.isInCategory, [value]);
    const subCategoryResults = await pool.query(queries.isInSubCategory, [
      value,
    ]);

    let query, queryParams;
    if (categoryResults.rows.length > 0) {
      query = queries.getAllSellerCategoryProduct;
    } else if (subCategoryResults.rows.length > 0) {
      query = queries.getAllSellerSubCategoryProduct;
    } else {
      query = queries.getAllSellerSubSubCategoryProduct;
    }

    queryParams = [req.user.id, value, seller_id];
    const products = await pool.query(query, queryParams);

    resp.status(200).json(products.rows);
  } catch (err) {
    console.error("Error retrieving filtered products:", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllCategories,
  getFilteredProducts,
  getCategoriesOnly,
  getFilteredSellerProducts,
};
