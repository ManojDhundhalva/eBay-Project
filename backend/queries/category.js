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

module.exports = {
  getAllCategories,
};
