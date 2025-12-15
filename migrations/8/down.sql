
-- Revert payment to pending
UPDATE payments 
SET status = 'pending', 
    paid_at = NULL, 
    updated_at = CURRENT_TIMESTAMP 
WHERE payment_id = '137544560848';
