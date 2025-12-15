
INSERT INTO orders (id, player_name, player_email, product_id, item_id, order_type, amount, status, created_at, updated_at) 
SELECT 21, 'BodeJr', 'bodejr@sistema.com', 0, 3, 'item', 25.00, 'pending', '2024-12-05 12:00:00', '2024-12-05 12:00:00'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = 21);

INSERT INTO payments (order_id, payment_id, status, amount, payment_method, paid_at, created_at, updated_at)
SELECT 21, '136907385929', 'approved', 25.00, 'pix', '2024-12-05 12:00:00', '2024-12-05 12:00:00', '2024-12-05 12:00:00'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE order_id = 21);
