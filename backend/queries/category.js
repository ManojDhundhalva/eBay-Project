const getAllCategories = `
SELECT
    c.category_name AS category,
    JSON_AGG(
        json_build_object(
            'sub_category', c.sub_category_name,
            'sub_sub_category', sub.sub_sub_categories
        ) ORDER BY c.sub_category_name
    ) AS sub_categories
FROM
    category_has_sub_category c
LEFT JOIN (
    SELECT
        sc.sub_category_name,
        JSON_AGG(sc.sub_sub_category_name ORDER BY sc.sub_sub_category_name) AS sub_sub_categories
    FROM
        sub_category_has_sub_sub_category sc
    GROUP BY
        sc.sub_category_name
) AS sub ON sub.sub_category_name = c.sub_category_name
GROUP BY
    c.category_name
ORDER BY 
	c.category_name;
`;

const getFilteredProducts = `
SELECT * 
FROM product AS p 
JOIN (
    SELECT * 
    FROM category_has_sub_category 
    NATURAL JOIN sub_category_has_sub_sub_category 
    WHERE category_name = 'Clothing & Accessories'
) AS c 
ON p.product_category_name = c.category_name 
AND p.product_sub_category_name = c.sub_category_name 
AND p.product_sub_sub_category_name = c.sub_sub_category_name;
`;

const isInCategory = `
SELECT * 
FROM category_has_sub_category 
WHERE category_name = $1;
`;

const isInSubCategory = `
SELECT * 
FROM category_has_sub_category 
WHERE sub_category_name = $1;
`;

const getAllCategoryProduct = `
SELECT 
    p.product_id,
    p.product_title, 
    p.product_price, 
    p.product_avg_rating,
    p.product_watch_count,
    p.product_timestamp,
    s.seller_avg_rating,
    ARRAY_AGG(pi.product_image) AS product_images 
FROM 
    product AS p 
JOIN
    seller AS s
ON
    p.product_seller_id = s.seller_user_id
JOIN 
    product_image AS pi 
ON 
    p.product_id = pi.product_id
WHERE 
    p.product_seller_id <> $1 
	AND p.product_available_quantity <> 0
	AND p.product_category_name = $2
GROUP BY
    p.product_id,
    p.product_title,
    p.product_price,
    p.product_avg_rating,
    p.product_watch_count,
    s.seller_avg_rating
`;

const getAllSubCategoryProduct = `
SELECT 
    p.product_id,
    p.product_title, 
    p.product_price, 
    p.product_avg_rating,
    p.product_watch_count,
    p.product_timestamp,
    s.seller_avg_rating,
    ARRAY_AGG(pi.product_image) AS product_images  
FROM 
    product AS p 
JOIN
    seller AS s
ON
    p.product_seller_id = s.seller_user_id
JOIN 
    product_image AS pi 
ON 
    p.product_id = pi.product_id
WHERE 
    p.product_seller_id <> $1 
	AND p.product_available_quantity <> 0
	AND p.product_sub_category_name = $2
GROUP BY
    p.product_id,
    p.product_title,
    p.product_price,
    p.product_avg_rating,
    p.product_watch_count,
    s.seller_avg_rating
`;

const getAllSubSubCategoryProduct = `
SELECT 
    p.product_id,
    p.product_title, 
    p.product_price, 
    p.product_avg_rating,
    p.product_watch_count,
    p.product_timestamp,
    s.seller_avg_rating,
    ARRAY_AGG(pi.product_image) AS product_images 
FROM 
    product AS p 
JOIN
    seller AS s
ON
    p.product_seller_id = s.seller_user_id
JOIN 
    product_image AS pi 
ON 
    p.product_id = pi.product_id
WHERE 
    p.product_seller_id <> $1 
	AND p.product_available_quantity <> 0
	AND p.product_sub_sub_category_name = $2
GROUP BY
    p.product_id,
    p.product_title,
    p.product_price,
    p.product_avg_rating,
    p.product_watch_count,
    s.seller_avg_rating
`;

const getAllProducts = `
SELECT 
    p.product_id,
    p.product_title, 
    p.product_price, 
    p.product_avg_rating,
    p.product_watch_count,
    p.product_timestamp,
    s.seller_avg_rating,
    ARRAY_AGG(pi.product_image) AS product_images 
FROM 
    product AS p
JOIN
    seller AS s
ON
    p.product_seller_id = s.seller_user_id
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
    p.product_watch_count,
    s.seller_avg_rating
LIMIT 10;
`;

const getCategoriesOnly = `
SELECT DISTINCT category_name FROM category_has_sub_category;
`;

module.exports = {
  getAllCategories,
  getFilteredProducts,
  isInCategory,
  isInSubCategory,
  getAllCategoryProduct,
  getAllSubCategoryProduct,
  getAllSubSubCategoryProduct,
  getAllProducts,
  getCategoriesOnly,
};
