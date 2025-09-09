-- ARCHIVED: This file is no longer used. See shared migrations.

-- Nexium RPG Database Schema

-- Users table for player profiles
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY, -- Discord user ID
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nexium INTEGER DEFAULT 100, -- Soulbound currency
    cred INTEGER DEFAULT 50, -- Tradable currency
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    sync_points INTEGER DEFAULT 0,
    location VARCHAR(100) DEFAULT 'Neo-Avalon Central',
    title VARCHAR(200) DEFAULT 'Novice Weaver'
);

-- Eidolons table for collectible entities
CREATE TABLE IF NOT EXISTS eidolons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('C', 'UC', 'R', 'SR', 'SSR')),
    element VARCHAR(20) NOT NULL,
    description TEXT,
    lore TEXT,
    base_attack INTEGER DEFAULT 100,
    base_defense INTEGER DEFAULT 100,
    base_speed INTEGER DEFAULT 100,
    skill_name VARCHAR(100),
    skill_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Eidolons - player's collected Eidolons
CREATE TABLE IF NOT EXISTS user_eidolons (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    eidolon_id INTEGER REFERENCES eidolons(id),
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    sync_ratio DECIMAL(5,2) DEFAULT 0.0, -- Bond strength 0-100
    ascension_level INTEGER DEFAULT 0,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_interacted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items and equipment
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'tuner', 'material', 'equipment', 'consumable'
    subtype VARCHAR(50),
    rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('Unstable', 'Stable', 'Optimized', 'Flawless')),
    description TEXT,
    base_value INTEGER DEFAULT 0,
    stats JSONB, -- Flexible stats storage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User inventory
CREATE TABLE IF NOT EXISTS user_items (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    quality VARCHAR(20) DEFAULT 'Stable',
    custom_stats JSONB,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Syndicates (Guilds)
CREATE TABLE IF NOT EXISTS syndicates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    leader_id BIGINT REFERENCES users(id),
    level INTEGER DEFAULT 1,
    resources INTEGER DEFAULT 0,
    controlled_ward VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Syndicate memberships
CREATE TABLE IF NOT EXISTS syndicate_members (
    id SERIAL PRIMARY KEY,
    syndicate_id INTEGER REFERENCES syndicates(id),
    user_id BIGINT REFERENCES users(id),
    rank VARCHAR(50) DEFAULT 'Member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution_points INTEGER DEFAULT 0,
    UNIQUE(syndicate_id, user_id)
);

-- Combat encounters and puzzles
CREATE TABLE IF NOT EXISTS encounters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'glitch', -- 'glitch', 'anomaly', 'boss'
    location VARCHAR(100),
    difficulty INTEGER DEFAULT 1,
    weakness_pattern TEXT, -- The puzzle solution pattern
    weakness_hint TEXT, -- Hint given via /scan
    rewards JSONB, -- Flexible rewards structure
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market listings
CREATE TABLE IF NOT EXISTS market_listings (
    id SERIAL PRIMARY KEY,
    seller_id BIGINT REFERENCES users(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER NOT NULL,
    price_per_unit INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    quality VARCHAR(20),
    custom_stats JSONB,
    listed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    sold BOOLEAN DEFAULT FALSE
);

-- Combat logs for tracking player actions
CREATE TABLE IF NOT EXISTS combat_logs (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    encounter_id INTEGER REFERENCES encounters(id),
    action_type VARCHAR(50), -- 'scan', 'weave', 'skill'
    action_data JSONB,
    success BOOLEAN,
    damage_dealt INTEGER DEFAULT 0,
    rewards JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- World events and storms
CREATE TABLE IF NOT EXISTS world_events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'storm',
    description TEXT,
    active BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    effects JSONB,
    participation_rewards JSONB
);

-- Insert base Eidolons from the PDF
INSERT INTO eidolons (name, rarity, element, description, lore, base_attack, base_defense, base_speed, skill_name, skill_description) VALUES
('Seraphina, the Final Verse', 'SSR', 'Resonance', 'A legendary composer whose melodies can reshape reality', 'Once the greatest composer of Neo-Avalon, her final symphony was said to open doorways between dimensions. Her spectral form still conducts ethereal orchestras.', 180, 120, 140, 'Symphony of Echoes', 'Deals massive damage and buffs all allied Eidolons'),

('Kaelen, the Unraveled', 'SSR', 'Void', 'An architect whose structures defied the laws of physics', 'Master architect who built impossible geometries. When reality rejected his designs, he became one with the architectural paradoxes he created.', 160, 150, 130, 'Paradox Construction', 'Creates defensive barriers that reflect damage back to enemies'),

('Bexley, the Iron Sentinel', 'SR', 'Steel', 'Guardian of the old metro tunnels beneath Neo-Avalon', 'Former security chief of the underground transit system. Even in death, she patrols the forgotten tunnels, protecting travelers from the anomalies below.', 140, 180, 100, 'Metro Shield', 'Provides strong defense and counterattacks when allies are hit'),

('Zara, the Glitch Walker', 'R', 'Data', 'A hacker who became one with the digital realm', 'Brilliant programmer who dove too deep into the city''s data networks. Her consciousness fragmented across servers, becoming a living glitch.', 130, 110, 160, 'System Intrusion', 'Bypasses enemy defenses and causes confusion effects'),

('Echo, the Lost Signal', 'UC', 'Sound', 'Remnant of the city''s communication network', 'A fragment of the old city-wide communication AI that gained sentience. Echoes of lost messages and forgotten conversations.', 110, 100, 120, 'Signal Boost', 'Amplifies the abilities of other Eidolons in the party'),

('Static, the Interference', 'C', 'Electric', 'Basic electrical anomaly found throughout the city', 'Simple manifestation of electromagnetic disturbance. Common but useful for basic tasks and early training.', 80, 90, 110, 'Electric Jolt', 'Quick electric attack that can paralyze weak enemies');

-- Insert base items
INSERT INTO items (name, type, subtype, rarity, description, base_value, stats) VALUES
('Basic Tuner', 'tuner', 'standard', 'Stable', 'Standard device for attuning to Eidolons', 100, '{}'),
('Advanced Tuner', 'tuner', 'enhanced', 'Optimized', 'Enhanced tuner with better Eidolon detection', 500, '{"success_rate": 1.2}'),
('Resonance Crystal', 'material', 'crafting', 'Stable', 'Basic crafting material found throughout Neo-Avalon', 50, '{}'),
('Void Fragment', 'material', 'crafting', 'Optimized', 'Rare material from dimensional tears', 200, '{"void_affinity": true}'),
('Data Core', 'equipment', 'processor', 'Stable', 'Enhances digital-based Eidolon abilities', 300, '{"data_boost": 15}'),
('Neural Amplifier', 'equipment', 'enhancement', 'Optimized', 'Increases sync ratio gain with Eidolons', 800, '{"sync_boost": 25}');

-- Insert sample encounters
INSERT INTO encounters (name, type, location, difficulty, weakness_pattern, weakness_hint, rewards) VALUES
('Data Glitch', 'glitch', 'Neo-Avalon Central', 1, 'NOT Logic', 'It fears the logic it cannot compute', '{"nexium": 50, "experience": 25, "tuner_chance": 0.1}'),
('Memory Leak', 'anomaly', 'Digital District', 2, 'Memory AND Clear', 'It hoards what should be freed', '{"nexium": 80, "experience": 40, "items": [{"id": 3, "quantity": 2}]}'),
('Recursive Loop', 'anomaly', 'Tech Sector', 3, 'Break OR Escape', 'It''s trapped in its own creation', '{"nexium": 120, "experience": 60, "rare_material_chance": 0.3}'),
('The Corrupted Archive', 'boss', 'Data Vaults', 5, '(Scan AND Analyze) OR Purge', 'Knowledge corrupted seeks cleansing or understanding', '{"nexium": 300, "experience": 150, "guaranteed_ssr_tuner": true}');