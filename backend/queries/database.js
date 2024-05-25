const getAllTables = `
SELECT 
    t.table_name,
    json_agg(
        json_build_object(
            'column_name', c.column_name,
            'data_type', c.data_type,
            'data_type_name', c.udt_name,
            'constraint_type', tc.constraint_type,
            'character_maximum_length', c.character_maximum_length,
            'is_nullable', c.is_nullable,
            'column_default', c.column_default
        )
        ORDER BY tc.constraint_type DESC NULLS LAST, c.column_name ASC
    ) AS attributes
FROM 
    information_schema.tables AS t
LEFT JOIN 
    information_schema.columns AS c
    ON t.table_name = c.table_name 
    AND t.table_schema = c.table_schema 
    AND t.table_catalog = c.table_catalog
LEFT JOIN 
    information_schema.key_column_usage AS kcu
    ON t.table_name = kcu.table_name
    AND c.column_name = kcu.column_name
    AND t.table_schema = kcu.table_schema
    AND t.table_catalog = kcu.table_catalog
LEFT JOIN 
    information_schema.table_constraints AS tc
    ON kcu.constraint_name = tc.constraint_name
    AND t.table_schema = tc.table_schema
    AND t.table_catalog = tc.table_catalog
WHERE 
    t.table_schema = 'public' 
    AND t.table_catalog = 'eBay'
GROUP BY 
    t.table_name;
`;

module.exports = { getAllTables };
