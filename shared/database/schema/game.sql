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
