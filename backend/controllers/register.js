const pool = require("../db");
const queries = require("../queries/register");
const bcrypt = require("bcrypt");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const saltRounds = Number(process.env.SALT_ROUNDS);
const hashAsync = util.promisify(bcrypt.hash);

const createAccount = async (req, resp) => {
  const {
    firstname,
    lastname,
    username,
    emailid,
    password,
    role,
    phone_number,
  } = req.body;

  try {
    const usernameResult = await pool.query(queries.getUserName, [username]);
    if (usernameResult.rows.length !== 0) {
      return resp.status(401).json({ message: "UserName Already Exist" });
    }

    const emailResult = await pool.query(queries.getEmailId, [emailid]);
    if (emailResult.rows.length !== 0) {
      return resp
        .status(401)
        .json({ message: "Email-id is Already Registered" });
    }

    const newPassword = await hashAsync(password, saltRounds);

    const uniqueId = uuidv4();
    const createAccountResult = await pool.query(queries.createAccount, [
      uniqueId,
      firstname,
      lastname,
      username,
      emailid,
      newPassword,
      role,
      phone_number,
    ]);

    resp.status(201).json({ message: "Created Successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createAccount,
};
