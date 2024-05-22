const listProduct = `
INSERT INTO product (
    product_id,
    product_seller_id,
    product_title,
    product_price,
    product_available_quantity,
    product_seller_mobile_number,
    product_category_name,
    product_sub_category_name,
    product_sub_sub_category_name
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
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
/**/
const findSellerCityStateCountry = `
SELECT seller_city, seller_state, seller_country FROM seller WHERE seller_user_id = $1;
`;

const IfExistSellerSideManager = `
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
/**/

const getAllProducts = `
SELECT 
    p.product_id,
    p.product_title, 
    p.product_price, 
    p.product_avg_rating,
    p.product_watch_count,
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
    p.product_avg_rating,
    p.product_watch_count
LIMIT 10;
`;

const getProductsDetails = `
SELECT 
    c.*,
    us.username,
    s.seller_city, 
    s.seller_state, 
    s.seller_country, 
    s.seller_pincode,
    (SELECT 
        json_build_object(
           'your_rating', product_review_rating,
           'your_comment', product_comment,
           'your_review_timestamp', product_review_timestamp
    ) AS your_reviews
    FROM 
        product_review
    WHERE 
        product_id = $1 AND user_id = $2), 
	(SELECT 
	 json_build_object(
		'total_user_response', COUNT(DISTINCT user_id),
		'rating_1_count', SUM(CASE WHEN product_review_rating = 1 THEN 1 ELSE 0 END), 
		'rating_2_count', SUM(CASE WHEN product_review_rating = 2 THEN 1 ELSE 0 END),
		'rating_3_count', SUM(CASE WHEN product_review_rating = 3 THEN 1 ELSE 0 END),
		'rating_4_count', SUM(CASE WHEN product_review_rating = 4 THEN 1 ELSE 0 END),
		'rating_5_count', SUM(CASE WHEN product_review_rating = 5 THEN 1 ELSE 0 END)
	) AS ratings
	FROM 
		product_review
	WHERE 
		product_id = $1
	),
    ARRAY_AGG(json_build_object('key', pd.key, 'value', pd.value)) AS product_description,
    (SELECT
        ARRAY_AGG(json_build_object(
            'rating', pr.product_review_rating,
            'comment', pr.product_comment, 
            'username',  u.username, 
            'product_review_timestamp',  pr.product_review_timestamp)
        ) AS product_reviews   
    FROM
        product_review AS pr
    JOIN
        users AS u
    ON
        pr.user_id = u.id
    WHERE
        pr.product_id = $1 AND user_id <> $2)
FROM 
    (
        SELECT 
            p.*,
            ARRAY_AGG(pi.product_image) AS product_images 
        FROM 
            product AS p
        JOIN 
            product_image AS pi ON p.product_id = pi.product_id 
        WHERE 
            p.product_id = $1
        GROUP BY 
            p.product_id
    ) AS c
JOIN 
    product_description AS pd ON c.product_id = pd.product_id
JOIN 
    seller AS s ON c.product_seller_id = s.seller_user_id
JOIN 
    users AS us ON us.id = s.seller_user_id
GROUP BY 
    c.*,
    us.username,
    c.product_seller_id,
    c.product_title,
    c.product_price,
    c.product_available_quantity,
    c.product_watch_count,
    c.product_avg_rating,
    c.product_seller_mobile_number,
    c.product_timestamp,
    c.product_images,
    c.product_id,
    c.product_category_name,
	c.product_sub_category_name,
	c.product_sub_sub_category_name,
    s.seller_city, 
    s.seller_state, 
    s.seller_country, 
    s.seller_pincode;
`;

const checkIfAlredyWatched = `
SELECT * 
FROM 
    watches 
WHERE 
    product_id = $1 AND user_id = $2;
`;

const watchProduct = `
INSERT INTO watches (product_id, user_id)
VALUES ($1, $2);
`;

const incrementWatchCount = `
UPDATE product 
SET product_watch_count = product_watch_count + 1 
WHERE product_id = $1;
`;

const isProductValid = `
SELECT DISTINCT h.has_order_product_id
FROM order_details AS o
JOIN has_order AS h ON h.has_order_id = o.order_id
WHERE o.order_buyer_id = $1
AND h.has_order_product_id = $2
`;

const ifProductReviewOfUserExist = `
SELECT * 
FROM 
    product_review 
WHERE 
    product_id = $1 AND user_id = $2;
`;

const updateReview = `
UPDATE product_review
SET 
    product_review_rating = $1,
    product_comment = $2,
    product_review_timestamp = CURRENT_TIMESTAMP
WHERE 
    product_id = $3 AND user_id = $4;
`;

const createReview = `
INSERT INTO product_review (
    product_id, 
    user_id, 
    product_review_rating,
    product_comment
)
VALUES ($1, $2, $3, $4);
`;

module.exports = {
  listProduct,
  addImage,
  addDescription,
  getAllProducts,
  getProductsDetails,
  checkIfAlredyWatched,
  watchProduct,
  incrementWatchCount,
  IfExistSellerSideManager,
  createAccount,
  findSellerCityStateCountry,
  createInventory,
  createShipper,
  isProductValid,
  ifProductReviewOfUserExist,
  updateReview,
  createReview,
};
