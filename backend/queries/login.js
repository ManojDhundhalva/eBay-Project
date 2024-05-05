const getAccount = "SELECT * FROM users WHERE userName = $1 AND password = $2";
const getAccountByUserName = "SELECT * FROM users WHERE userName = $1";
const getUserName = "SELECT userName FROM users WHERE userName = $1";
const getEmailId = "SELECT emailId FROM users WHERE emailId = $1";
const getPassword = "SELECT password FROM users WHERE password = $1";

module.exports = {
  getAccount,
  getAccountByUserName,
  getUserName,
  getEmailId,
  getPassword,
};
