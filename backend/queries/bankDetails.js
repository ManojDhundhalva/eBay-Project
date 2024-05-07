const ifExistAccount = `
SELECT * FROM seller WHERE seller_user_id = $1
`;

const getBankAccountByUserId = `
SELECT *
FROM seller AS s
JOIN bank_details AS b ON account_number = seller_account_number
WHERE seller_user_id = $1;
`;

const ifSellerExist = `
SELECT seller_user_id FROM seller WHERE seller_user_id = $1
`;

const updateBankAccountByAccountNumber = `
UPDATE bank_details
SET account_holder_first_name = $1,
    account_holder_last_name = $2,
    account_IFSC_code = $3,
    account_branch = $4,
    account_branch_address = $5
WHERE account_number = $6;
`;

const updateSellerBySellerUserId = `
UPDATE seller
SET seller_city = $1,
    seller_state = $2, 
    seller_country = $3,
    seller_pincode = $4
WHERE seller_user_id = $5;
`;

const ifExistGivenAccount = `
SELECT account_number FROM bank_details WHERE account_number = $1
`;

const createBankAccountByAccountNumber = `
INSERT INTO bank_details (
  account_number, 
  account_holder_first_name, 
  account_holder_last_name, 
  account_IFSC_code, 
  account_branch, 
  account_branch_address
) VALUES ($1, $2, $3, $4, $5, $6);
`;

const createSellerByAccountNumber = `
INSERT INTO seller (
  seller_user_id, 
  seller_account_number,
  seller_city,
  seller_state, 
  seller_country,
  seller_pincode
) VALUES ($1, $2, $3, $4, $5, $6);
`;

module.exports = {
  ifExistAccount,
  getBankAccountByUserId,
  ifSellerExist,
  ifExistGivenAccount,
  createBankAccountByAccountNumber,
  createSellerByAccountNumber,
  updateBankAccountByAccountNumber,
  updateSellerBySellerUserId,
};
