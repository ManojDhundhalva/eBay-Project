const ifExistAccount = `
SELECT * FROM seller WHERE seller_user_id = $1
`;

const getBankAccountByUserId = `
SELECT b.*
FROM seller AS s
JOIN bank_details AS b ON account_number = seller_account_number
WHERE seller_user_id = $1;
`;

const updateBankAccountByUserId = `
UPDATE users
SET firstname = $1, lastname = $2, phone_number = $3
WHERE id = $4;
`;

module.exports = {
  ifExistAccount,
  getBankAccountByUserId,
  updateBankAccountByUserId,
};
