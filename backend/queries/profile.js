const getProfileByUserId = `
SELECT firstname, lastname, username, emailid, role, phone_number 
FROM users WHERE id = $1
`;

const updateProfileByUserId = `
UPDATE users
SET firstname = $1, lastname = $2, phone_number = $3
WHERE id = $4;
`;

module.exports = {
  getProfileByUserId,
  updateProfileByUserId,
};
