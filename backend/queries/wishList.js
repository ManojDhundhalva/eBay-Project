const getWishListByUserId = `
SELECT 
    p.product_id, 
    p.product_title, 
    p.product_price, 
    p.product_available_quantity,
    ARRAY_AGG(pi.product_image) AS product_images 
FROM 
    product AS p 
LEFT JOIN 
    product_image AS pi ON p.product_id = pi.product_id 
JOIN 
    wishlist AS w ON w.product_id = p.product_id 
WHERE 
    w.user_id = $1
GROUP BY 
    p.product_id, 
    p.product_title, 
    p.product_price,
    p.product_available_quantity;
`;

const addToWishByUserId = `
INSERT INTO wishlist (product_id, user_id) 
VALUES ($1, $2);
`;

const deleteFromWishListByUserIdAndProductID = `
DELETE FROM wishlist 
WHERE product_id = $1 AND user_id = $2;
`;

module.exports = {
  getWishListByUserId,
  addToWishByUserId,
  deleteFromWishListByUserIdAndProductID,
};
