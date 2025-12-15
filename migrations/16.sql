
-- Fix migration #7 conflict by ensuring order #21 exists without causing constraint errors
INSERT OR IGNORE INTO orders (id, player_name, player_email, product_id, item_id, order_type, amount, status, created_at, updated_at)
VALUES (21, 'BodeJr', 'recuperado@sistema.com', 0, 3, 'item', 25.0, 'completed', '2024-12-05 12:00:00', '2024-12-05 12:00:00');

INSERT OR IGNORE INTO payments (order_id, payment_id, status, amount, payment_method, paid_at, created_at, updated_at)
VALUES (21, '136907385929', 'approved', 25.0, 'pix', '2024-12-05 12:00:00', '2024-12-05 12:00:00', '2024-12-05 12:00:00');
