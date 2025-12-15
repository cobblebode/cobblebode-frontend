
-- Simulate payment approval for testing
UPDATE payments 
SET status = 'approved', 
    paid_at = CURRENT_TIMESTAMP, 
    updated_at = CURRENT_TIMESTAMP 
WHERE payment_id = '137544560848';
