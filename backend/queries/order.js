const makeOrderPayment = `
INSERT INTO payment (
    payment_transaction_id,
    payment_amount,
    payment_type
) 
VALUES 
    ($1, $2, $3);
`;

const makeOrderAfterPayment = `
INSERT INTO order_details (
    order_id,
	order_buyer_id,
	order_buyer_first_name,
	order_buyer_Last_name,
	order_transaction_id,
	order_total_cost,
	order_shipping_cost,
	order_shipping_location,
	order_shipping_coordinates,
	order_shipping_address_country,
	order_shipping_address_state,
	order_shipping_address_city,
	order_shipping_address_pincode,
	order_shipping_address_mobile_number
) 
VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, POINT($9, $10), $11, $12, $13, $14, $15);
`;

const makeHasOrder = `
INSERT INTO has_order (
    has_order_id,
    has_order_product_quantity,
    has_order_product_id
) 
VALUES 
    ($1, $2, $3);
`;

const makeUpdateProductQuantity = `
UPDATE product 
SET product_available_quantity = product_available_quantity - $1 
WHERE product_id = $2;
`;

const transferMoneyToSeller = `
UPDATE bank_details
SET account_balance = account_balance + ($1::numeric * $2::numeric)
WHERE account_number = (
    SELECT b.account_number
    FROM seller AS s
    JOIN bank_details AS b ON s.seller_account_number = b.account_number
    WHERE seller_user_id = $3 
);
`;

const clearCart = `
DELETE FROM cart
WHERE 
    product_id = $1 AND user_id = $2;
`;

//Order Status Proccess
const makeShippingStatus = `
INSERT INTO shipping_status (
    tracking_id,
    order_id,
    shipping_status_order_placed
) VALUES ($1, $2, CURRENT_TIMESTAMP);
`;

const IfExistBuyerSideManager = `
SELECT username FROM users WHERE username = $1;
`;

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

const createInventory = `
INSERT INTO inventory_house (
    inventory_house_id,
    manager_id,
    inventory_house_name,
    inventory_house_city,
    inventory_house_state,
    inventory_house_country
) 
VALUES ($1, $2, $3, $4, $5, $6);
`;

const createShipper = `
INSERT INTO shipper (
    shipper_id,
    shipper_inventory_house_id
) 
VALUES ($1, $2);
`;

const getAllOrders = `
SELECT o.*, s.*, 
       (
        SELECT ARRAY_AGG(
            JSON_BUILD_OBJECT(
                'product_image', (SELECT ARRAY_AGG(pi.product_image) FROM product_image AS pi WHERE pi.product_id = h.has_order_product_id),
                'has_order_product_id', h.has_order_product_id,
                'has_order_product_quantity', h.has_order_product_quantity
            )
        )
        FROM has_order AS h
        WHERE o.order_id = h.has_order_id
       ) AS product
FROM order_details AS o
JOIN shipping_status AS s ON o.order_id = s.order_id
WHERE o.order_buyer_id = $1
GROUP BY o.order_id, s.tracking_id;
`;

module.exports = {
  makeOrderPayment,
  makeOrderAfterPayment,
  makeHasOrder,
  makeUpdateProductQuantity,
  transferMoneyToSeller,
  clearCart,
  makeShippingStatus,
  IfExistBuyerSideManager,
  createAccount,
  createInventory,
  createShipper,
  getAllOrders,
};
