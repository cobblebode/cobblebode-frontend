
-- Remove the payment record
DELETE FROM payments WHERE order_id = 21 AND payment_id = '136907385929';

-- Remove the order
DELETE FROM orders WHERE id = 21;
