// const getAllProductsOfInventory = `
// SELECT
//     i.*,
//     json_agg(
//         json_build_object(
//             'seller_user_id', s.seller_user_id,
//             'products', seller_products.products
//         )
//     ) AS sellers
// FROM
//     inventory_house AS i
// JOIN
//     seller AS s ON i.inventory_house_city = s.seller_city
//                AND i.inventory_house_state = s.seller_state
//                AND i.inventory_house_country = s.seller_country
// LEFT JOIN (
//     SELECT
//         s.seller_user_id,
//         json_agg(
//             json_build_object(
//                 'product_id', p.product_id,
//                 'product_title', p.product_title,
//                 'product_price', p.product_price,
//                 'product_available_quantity', p.product_available_quantity,
//                 'product_watch_count', p.product_watch_count,
//                 'product_avg_rating', p.product_avg_rating,
//                 'product_seller_mobile_number', p.product_seller_mobile_number,
//                 'product_timestamp', p.product_timestamp
//             )
//         ) AS products
//     FROM
//         seller AS s
//     JOIN
//         product AS p ON s.seller_user_id = p.product_seller_id
//     GROUP BY
//         s.seller_user_id
// ) AS seller_products ON s.seller_user_id = seller_products.seller_user_id
// WHERE
//     i.manager_id = $1
// GROUP BY
//     i.inventory_house_id;
// `;

const getAllProductsOfInventory = `
SELECT 
	ROW_NUMBER() OVER () AS id,
	ROW_NUMBER() OVER () AS index,
	u.username AS seller_user_name,
    p.product_id AS product_id,
	p.product_title AS product_name,
	p.product_price As product_price,
	p.product_available_quantity AS product_available_quantity,
	p.product_seller_mobile_number AS seller_contact_number,
	p.product_timestamp AS product_timestamp
FROM 
    seller AS s
JOIN
	users AS u ON u.id = s.seller_user_id
JOIN 
    product AS p ON s.seller_user_id = p.product_seller_id
JOIN 
	inventory_house AS i ON i.inventory_house_city = s.seller_city
						AND i.inventory_house_state = s.seller_state
						AND i.inventory_house_country = s.seller_country
WHERE p.product_available_quantity <> 0 AND manager_id = $1
GROUP BY 
	u.username,
	p.product_id;
`;

const getAllQueuesOfInventory = `
SELECT
    o.*,
    py.payment_transaction_id,
    py.payment_amount,
    json_agg(
        json_build_object(
			'id',  p.product_id,
            'product_id', p.product_id,
            'product_name', p.product_title,
            'product_price', p.product_price,
            'has_order_product_quantity', h.has_order_product_quantity,
            'seller_contact_number', p.product_seller_mobile_number,
			'seller_user_name', u.username,
            'product_timestamp', p.product_timestamp
        )
    ) AS products
FROM 
    order_details AS o 
JOIN
	shipping_status AS ss ON ss.order_id = o.order_id
JOIN 
    payment AS py ON py.payment_transaction_id = o.order_transaction_id
JOIN 
    has_order AS h ON o.order_id = h.has_order_id
JOIN 
    product AS p ON p.product_id = h.has_order_product_id
JOIN 
	users AS u ON u.id = p.product_seller_id
JOIN 
	inventory_house AS i ON i.inventory_house_state = o.order_shipping_address_state
						AND i.inventory_house_city = o.order_shipping_address_city
						AND i.inventory_house_country = o.order_shipping_address_country
WHERE ss.shipping_status_order_shipped IS NULL AND manager_id = $1
GROUP BY
    o.order_id, 
	py.payment_transaction_id;
`;

const getAllRecievedQueuesOfInventory = `
SELECT
    o.*,
    py.payment_transaction_id,
    py.payment_amount,
    json_agg(
        json_build_object(
			'id',  p.product_id,
            'product_id', p.product_id,
            'product_name', p.product_title,
            'product_price', p.product_price,
            'has_order_product_quantity', h.has_order_product_quantity,
            'seller_contact_number', p.product_seller_mobile_number,
			'seller_user_name', u.username,
            'product_timestamp', p.product_timestamp
        )
    ) AS products
FROM 
    order_details AS o 
JOIN
	shipping_status AS ss ON ss.order_id = o.order_id
JOIN 
    payment AS py ON py.payment_transaction_id = o.order_transaction_id
JOIN 
    has_order AS h ON o.order_id = h.has_order_id
JOIN 
    product AS p ON p.product_id = h.has_order_product_id
JOIN 
	users AS u ON u.id = p.product_seller_id
JOIN 
	inventory_house AS i ON i.inventory_house_state = o.order_shipping_address_state
						AND i.inventory_house_city = o.order_shipping_address_city
						AND i.inventory_house_country = o.order_shipping_address_country
WHERE ss.shipping_status_order_shipped IS NOT NULL 
    AND ss.shipping_status_reached_at_buyers_inventory IS NOT NULL 
    AND ss.shipping_status_out_for_delivery IS NULL 
    AND manager_id = $1
GROUP BY
    o.order_id, 
	py.payment_transaction_id;
`;

module.exports = {
  getAllProductsOfInventory,
  getAllQueuesOfInventory,
  getAllRecievedQueuesOfInventory,
};
