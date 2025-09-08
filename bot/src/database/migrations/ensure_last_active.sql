-- Add last_active column to users if it doesn't exist (idempotent)
ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
