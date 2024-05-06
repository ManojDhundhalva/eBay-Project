const queries = {
  getAccount: "SELECT * FROM users WHERE username = $1 AND password = $2",
  getAccountByUserName: "SELECT * FROM users WHERE username = $1",
  getUserName: "SELECT username FROM users WHERE username = $1",
  getEmailId: "SELECT emailid FROM users WHERE emailid = $1",
  getPassword: "SELECT password FROM users WHERE password = $1",
};

module.exports = queries;
  