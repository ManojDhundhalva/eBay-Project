const getCartByUserId = `
SELECT 
    p.product_id, 
    p.product_title, 
    p.product_price, 
    p.product_available_quantity,
	s.seller_city,
	s.seller_coordinates[0] AS latitude,
	s.seller_coordinates[1] AS longitude,
    ARRAY_AGG(pi.product_image) AS product_images 
FROM 
    product AS p 
JOIN 
    seller AS s ON p.product_seller_id = s.seller_user_id 
JOIN 
    product_image AS pi ON p.product_id = pi.product_id 
JOIN 
    cart AS c ON c.product_id = p.product_id 
WHERE 
    c.user_id = $1
GROUP BY 
    p.product_id, 
    p.product_title, 
    p.product_price,
    p.product_available_quantity,
	s.seller_city,
	s.seller_coordinates[0],
	s.seller_coordinates[1];
`;

const addToCartByUserId = `
INSERT INTO cart (product_id, user_id) 
VALUES ($1, $2);
`;

const deleteFromCartByUserIdAndProductID = `
DELETE FROM cart 
WHERE product_id = $1 AND user_id = $2;
`;

module.exports = {
  getCartByUserId,
  addToCartByUserId,
  deleteFromCartByUserIdAndProductID,
};
