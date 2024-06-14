const getProfileByUserId = `
SELECT 
    firstname, 
    lastname, 
    username, 
    emailid, 
    role, 
    phone_number,
    s.seller_location
FROM 
    users AS u
LEFT JOIN 
    seller AS s ON s.seller_user_id = u.id
WHERE id = $1;
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
