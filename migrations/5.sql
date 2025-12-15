
ALTER TABLE orders ADD COLUMN product_id_nullable INTEGER;
UPDATE orders SET product_id_nullable = product_id WHERE product_id IS NOT NULL;
