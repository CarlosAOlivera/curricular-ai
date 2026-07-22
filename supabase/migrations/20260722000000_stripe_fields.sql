-- Add Stripe fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;

-- Index for webhook lookups
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);
