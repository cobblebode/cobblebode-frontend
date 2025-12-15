
-- Rollback: Remove order #21 and its payment if they were inserted by this migration
DELETE FROM payments WHERE order_id = 21 AND payment_id = '136907385929';
DELETE FROM orders WHERE id = 21 AND player_name = 'BodeJr' AND created_at = '2024-12-05 12:00:00';
