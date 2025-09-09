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
