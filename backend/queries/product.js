const listProduct = `
INSERT INTO product (
    product_id,
    product_seller_id,
    product_title,
    product_price,
    product_available_quantity,
    product_seller_mobile_number
) VALUES ($1, $2, $3, $4, $5, $6);
`;

const addImage = `
INSERT INTO product_image (
    product_id,
    product_image
) VALUES ($1, $2);
`;

const addDescription = `
INSERT INTO product_description (
    product_id,
    key,
    value
) VALUES ($1, $2, $3);
`;

const getAllProducts = `
SELECT 
    p.product_id,
    p.product_title, 
    p.product_price, 
    p.product_avg_rating,
    ARRAY_AGG(pi.product_image) AS product_images 
FROM 
    product AS p 
JOIN 
    product_image AS pi 
ON 
    p.product_id = pi.product_id 
WHERE 
    p.product_seller_id <> $1 AND p.product_available_quantity <> 0
GROUP BY
    p.product_id,
    p.product_title,
    p.product_price,
    p.product_avg_rating
LIMIT 10;
`;

const getProductsDetails = `
SELECT 
    c.*, 
    ARRAY_AGG(json_build_object('key', pd.key, 'value', pd.value)) AS product_description 
FROM 
    (SELECT 
        p.*, 
        ARRAY_AGG(pi.product_image) AS product_images 
    FROM 
        product AS p 
    JOIN 
        product_image AS pi ON p.product_id = pi.product_id 
    WHERE 
        p.product_id = $1
    GROUP BY 
        p.product_id) AS c
JOIN 
    product_description AS pd ON c.product_id = pd.product_id 
GROUP BY 
	c.*,
	c.product_seller_id,
	c.product_title,
	c.product_price,
	c.product_available_quantity,
	c.product_watch_count,
	c.product_avg_rating,
	c.product_seller_mobile_number,
	c.product_timestamp,
	c.product_images,
    c.product_id;
`;

module.exports = {
  listProduct,
  addImage,
  addDescription,
  getAllProducts,
  getProductsDetails,
};
