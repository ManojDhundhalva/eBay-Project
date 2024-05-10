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

module.exports = {
  makeOrderPayment,
  makeOrderAfterPayment,
  makeHasOrder,
  makeUpdateProductQuantity
};
