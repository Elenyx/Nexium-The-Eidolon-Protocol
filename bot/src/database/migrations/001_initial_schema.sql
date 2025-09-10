-- Initial schema for Nexium RPG (shared)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nexium INTEGER DEFAULT 100,
    cred INTEGER DEFAULT 50,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    sync_points INTEGER DEFAULT 0,
    location VARCHAR(100) DEFAULT 'Neo-Avalon Central',
    title VARCHAR(200) DEFAULT 'Novice Weaver'
);

-- Eidolons table
CREATE TABLE IF NOT EXISTS eidolons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(12) UNIQUE,
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

CREATE OR REPLACE FUNCTION set_eidolon_code() RETURNS trigger AS $$
BEGIN
    UPDATE eidolons SET code = 'ED' || LPAD(NEW.id::text, 2, '0') WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER eidolons_set_code AFTER INSERT ON eidolons
FOR EACH ROW EXECUTE FUNCTION set_eidolon_code();

-- User Eidolons
CREATE TABLE IF NOT EXISTS user_eidolons (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    eidolon_id INTEGER REFERENCES eidolons(id),
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    sync_ratio DECIMAL(5,2) DEFAULT 0.0,
    ascension_level INTEGER DEFAULT 0,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_interacted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(16) UNIQUE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    subtype VARCHAR(50),
    rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('Unstable', 'Stable', 'Optimized', 'Flawless')),
    description TEXT,
    base_value INTEGER DEFAULT 0,
    stats JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION set_item_code() RETURNS trigger AS $$
BEGIN
    UPDATE items SET code = 'ITEM' || LPAD(NEW.id::text, 2, '0') WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_set_code AFTER INSERT ON items
FOR EACH ROW EXECUTE FUNCTION set_item_code();

-- User Items
CREATE TABLE IF NOT EXISTS user_items (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    quality VARCHAR(20) DEFAULT 'Stable',
    custom_stats JSONB,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Syndicates
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

-- Syndicate Members
CREATE TABLE IF NOT EXISTS syndicate_members (
    id SERIAL PRIMARY KEY,
    syndicate_id INTEGER REFERENCES syndicates(id),
    user_id BIGINT REFERENCES users(id),
    rank VARCHAR(50) DEFAULT 'Member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution_points INTEGER DEFAULT 0,
    UNIQUE(syndicate_id, user_id)
);

-- Encounters
CREATE TABLE IF NOT EXISTS encounters (
    id SERIAL PRIMARY KEY,
    code VARCHAR(12) UNIQUE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'glitch',
    location VARCHAR(100),
    difficulty INTEGER DEFAULT 1,
    weakness_pattern TEXT,
    weakness_hint TEXT,
    rewards JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION set_encounter_code() RETURNS trigger AS $$
BEGIN
    UPDATE encounters SET code = 'EC' || LPAD(NEW.id::text, 2, '0') WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encounters_set_code AFTER INSERT ON encounters
FOR EACH ROW EXECUTE FUNCTION set_encounter_code();

-- Market Listings
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
