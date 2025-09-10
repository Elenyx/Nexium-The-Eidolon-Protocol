-- Migration 003: Add web app integration tables and columns
-- Adds Discord OAuth fields, battles table, and player stats table

-- Add Discord OAuth fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS discord_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS discriminator VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS access_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token TEXT;

-- Create battles table for PvP results
CREATE TABLE IF NOT EXISTS battles (
    id SERIAL PRIMARY KEY,
    winner_id BIGINT REFERENCES users(id),
    loser_id BIGINT REFERENCES users(id),
    battle_type VARCHAR(20) DEFAULT 'pvp' CHECK (battle_type IN ('pvp', 'pve', 'dungeon')),
    exp_gained INTEGER DEFAULT 0,
    gold_gained INTEGER DEFAULT 0,
    items_gained JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create player_stats table for user statistics
CREATE TABLE IF NOT EXISTS player_stats (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) UNIQUE,
    total_power INTEGER DEFAULT 0,
    pvp_wins INTEGER DEFAULT 0,
    pvp_losses INTEGER DEFAULT 0,
    pvp_rating INTEGER DEFAULT 1000,
    dungeons_cleared INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_battles_winner_id ON battles(winner_id);
CREATE INDEX IF NOT EXISTS idx_battles_loser_id ON battles(loser_id);
CREATE INDEX IF NOT EXISTS idx_battles_created_at ON battles(created_at);
CREATE INDEX IF NOT EXISTS idx_player_stats_user_id ON player_stats(user_id);
