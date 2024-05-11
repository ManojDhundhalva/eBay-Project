const createAccount = `
INSERT INTO users (
    id,
    firstname,
    lastname,
    username,
    emailid,
    password,
    role,
    phone_number
) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
`;

const getUserName = "SELECT username FROM users WHERE username = $1";
const getEmailId = "SELECT emailid FROM users WHERE emailid = $1";

module.exports = {
  createAccount,
  getUserName,
  getEmailId,
};
