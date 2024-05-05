const pool = require("../db");
const queries = require("../queries/profile");

const getProfile = async (req, resp) => {
  try {
    const results = await pool.query(queries.getProfileByUserId, [req.user.id]);

    if (results.rows.length !== 1) {
      return resp.status(401).json({ message: "User not found" });
    }

    const data = results.rows[0];
    delete data.id;
    return resp.status(200).json(data);
  } catch (err) {
    console.log("Error -> ", err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};
const updateProfile = async (req, resp) => {
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
  getProfile,
  updateProfile,
};
