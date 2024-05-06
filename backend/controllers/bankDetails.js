const pool = require("../db");
const queries = require("../queries/bankDetails");

const getBankAccount = async (req, resp) => {
  try {
    const results = await pool.query(queries.ifExistAccount, [req.user.id]);

    if (results.rows.length !== 1) {
      return resp.status(201).json({ message: "Account not found" });
    }

    const results1 = await pool.query(queries.getBankAccountByUserId, [
      req.user.id,
    ]);
    const data = results1.rows[0];
    return resp.status(200).json(data);
  } catch (err) {
    console.log("Error -> ", err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};
const updateBankAccount = async (req, resp) => {
  const { firstname, lastname, phone_number } = req.body;

  try {
    const results = await pool.query(queries.updateProfileByUserId, [
      firstname,
      lastname,
      phone_number,
      req.user.id,
    ]);
    return resp.status(200).json({ message: "Profile Updated Succesfully" });
  } catch (err) {
    return resp
      .status(500)
      .json({ message: "Error In Profile Update, While Inserting Data" });
  }
};

module.exports = {
  getBankAccount,
  updateBankAccount,
};
