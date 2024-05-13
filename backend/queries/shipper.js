const getAllProductsOfShipper = `
SELECT
    o.*,
    py.payment_transaction_id,
    py.payment_amount,
    json_agg(
        json_build_object(
            'id', p.product_id,
            'product_id', p.product_id,
            'product_name', p.product_title,
            'product_price', p.product_price,
            'has_order_product_quantity', h.has_order_product_quantity,
            'seller_contact_number', p.product_seller_mobile_number,
            'product_timestamp', p.product_timestamp,
			'seller_user_name', u.username,
			'seller_city', s.seller_city,
			'product_tracking_id', h.tracking_id
        )
    ) AS products
FROM 
    order_details AS o 
JOIN 
    payment AS py ON py.payment_transaction_id = o.order_transaction_id
JOIN 
    has_order AS h ON o.order_id = h.has_order_id
JOIN 
    product AS p ON p.product_id = h.has_order_product_id
JOIN 
    users AS u ON u.id = p.product_seller_id
JOIN
    seller AS s ON s.seller_user_id = p.product_seller_id
JOIN 
    inventory_house AS i ON i.inventory_house_state = o.order_shipping_address_state
                        AND i.inventory_house_city = o.order_shipping_address_city
                        AND i.inventory_house_country = o.order_shipping_address_country
JOIN shipper AS sh ON sh.shipper_inventory_house_id = i.inventory_house_id
WHERE 
    h.shipping_status_out_for_delivery IS NOT NULL 
	AND h.shipping_status_delivered IS NULL
	AND shipper_id = $1
GROUP BY
    o.order_id, 
    py.payment_transaction_id;
`;

const deliverAllProductsOfShipper = `
UPDATE has_order 
SET 
    shipping_status_delivered = CURRENT_TIMESTAMP
WHERE 
    has_order_product_id = $1; 
`;

module.exports = {
  getAllProductsOfShipper,
  deliverAllProductsOfShipper,
};
