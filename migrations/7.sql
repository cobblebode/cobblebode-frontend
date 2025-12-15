
-- Create the missing order #21 for payment 136907385929
INSERT INTO orders (id, player_name, player_email, product_id, item_id, order_type, amount, status, created_at, updated_at)
VALUES (21, 'BodeJr', 'cobblemon@example.com', 0, 3, 'item', 25.00, 'pending', '2025-12-12 06:12:00', '2025-12-12 06:12:00');

-- Create the payment record for order #21
INSERT INTO payments (order_id, payment_id, status, amount, payment_method, created_at, updated_at)
VALUES (21, '136907385929', 'approved', 25.00, 'pix', '2025-12-12 06:12:00', '2025-12-12 06:12:00');
