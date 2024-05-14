const pool = require("../db");
const queries = require("../queries/product");
const bcrypt = require("bcrypt");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const saltRounds = Number(process.env.SALT_ROUNDS);
const hashAsync = util.promisify(bcrypt.hash);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

    const results = await pool.query(queries.findSellerCityStateCountry, [
      req.user.id,
    ]);

    const name =
      String(capitalizeFirstLetter(results.rows[0].seller_city)) +
      String(capitalizeFirstLetter(results.rows[0].seller_state)) +
      String(capitalizeFirstLetter(results.rows[0].seller_country));

    const managerName = name + "Manager";
    const shipperName = name + "Shipper";

    const usernameResult = await pool.query(queries.IfExistSellerSideManager, [
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
        String(capitalizeFirstLetter(results.rows[0].seller_city)) +
        " Inventory";

      const inventoryUniqueId = uuidv4();
      const createInventoryResult = await pool.query(queries.createInventory, [
        inventoryUniqueId,
        managerUniqueId,
        inventory_house_name,
        results.rows[0].seller_city,
        results.rows[0].seller_state,
        results.rows[0].seller_country,
      ]);

      const createShipperResult = await pool.query(queries.createShipper, [
        shipperUniqueId,
        inventoryUniqueId,
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
      req.user.id,
    ]);
    return resp.status(200).json(results.rows[0]);
  } catch (err) {
    console.log("Error listing product: ", err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const rateTheProduct = async (req, resp) => {
  const { product_id, product_review_rating } = req.body;
  try {
    const results = await pool.query(queries.isProductValid, [
      req.user.id,
      product_id,
    ]);
    if (results.rows.length) {
      const results1 = await pool.query(queries.ifProductRatingOfUserExist, [
        product_id,
        req.user.id,
      ]);

      if (results1.rows.length) {
        const results2 = await pool.query(queries.updateRating, [
          product_review_rating,
          product_id,
          req.user.id,
        ]);
      } else {
        const results3 = await pool.query(queries.createRating, [
          product_id,
          req.user.id,
          product_review_rating,
        ]);
      }
      return resp.status(200).json({ message: "Rated successfully!" });
    } else {
      return resp.status(201).json({ message: "Product not found!" });
    }
  } catch (err) {
    console.log("Error rating product: ", err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const makeCommentOnProduct = async (req, resp) => {
  const { product_id, product_comment } = req.body;
  try {
    const results = await pool.query(queries.isProductValid, [
      req.user.id,
      product_id,
    ]);
    if (results.rows.length) {
      const results1 = await pool.query(queries.ifProductCommentOfUserExist, [
        product_id,
        req.user.id,
      ]);

      if (results1.rows.length) {
        const results2 = await pool.query(queries.updateComment, [
          product_comment,
          product_id,
          req.user.id,
        ]);
      } else {
        const results3 = await pool.query(queries.createComment, [
          product_id,
          req.user.id,
          product_comment,
        ]);
      }
      return resp
        .status(200)
        .json({ message: "Comment added on product successfully!" });
    } else {
      return resp.status(201).json({ message: "Product not found!" });
    }
  } catch (err) {
    console.log("Error rating product: ", err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const watchProduct = async (req, resp) => {
  const { product_id } = req.body;
  try {
    const results = await pool.query(queries.checkIfAlredyWatched, [
      product_id,
      req.user.id,
    ]);

    if (results.rows.length === 0) {
      const results1 = await pool.query(queries.watchProduct, [
        product_id,
        req.user.id,
      ]);

      const results2 = await pool.query(queries.incrementWatchCount, [
        product_id,
      ]);

      resp.status(200).json({ message: "Product watched succussefully!" });
    } else {
      resp.status(200).json({ message: "Already, product watched" });
    }
  } catch (err) {
    console.log("Error -> ", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  listProduct,
  getAllProducts,
  getProductsDetails,
  rateTheProduct,
  watchProduct,
  makeCommentOnProduct,
};
