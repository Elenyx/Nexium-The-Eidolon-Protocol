-- Seed data for Nexium RPG Database
-- Run this after creating the schema to populate with sample data

-- Sample users
INSERT INTO users (id, username, nexium, cred, level, experience, sync_points, location, title) VALUES
(123456789012345678, 'TestPlayer1', 500, 200, 5, 1200, 150, 'Neo-Avalon Central', 'Eidolon Trainer'),
(987654321098765432, 'TestPlayer2', 300, 150, 3, 800, 100, 'Digital District', 'Data Weaver'),
(111111111111111111, 'TestPlayer3', 1000, 500, 10, 5000, 300, 'Tech Sector', 'Syndicate Leader');

-- Sample user eidolons (linking users to eidolons)
INSERT INTO user_eidolons (user_id, eidolon_id, level, experience, sync_ratio, ascension_level) VALUES
(123456789012345678, 1, 5, 2500, 85.5, 1), -- Seraphina
(123456789012345678, 4, 3, 1200, 65.0, 0), -- Zara
(987654321098765432, 2, 4, 1800, 75.2, 0), -- Kaelen
(987654321098765432, 6, 2, 600, 45.0, 0), -- Static
(111111111111111111, 1, 10, 10000, 95.0, 2), -- Seraphina maxed
(111111111111111111, 3, 8, 7200, 88.0, 1); -- Bexley

-- Sample user items
INSERT INTO user_items (user_id, item_id, quantity, quality) VALUES
(123456789012345678, 1, 2, 'Stable'), -- Basic Tuners
(123456789012345678, 3, 5, 'Stable'), -- Resonance Crystals
(987654321098765432, 1, 1, 'Optimized'), -- Advanced Tuner
(987654321098765432, 4, 3, 'Optimized'), -- Void Fragments
(111111111111111111, 2, 1, 'Flawless'), -- Advanced Tuner
(111111111111111111, 5, 2, 'Optimized'), -- Data Cores
(111111111111111111, 6, 1, 'Flawless'); -- Neural Amplifier

-- Sample syndicates
INSERT INTO syndicates (name, description, leader_id, level, resources, controlled_ward) VALUES
('The Void Walkers', 'Masters of dimensional manipulation and reality bending', 111111111111111111, 5, 2500, 'Tech Sector'),
('Data Guardians', 'Protectors of the digital realm and information flows', 123456789012345678, 3, 1200, 'Digital District');

-- Sample syndicate members
INSERT INTO syndicate_members (syndicate_id, user_id, rank, contribution_points) VALUES
(1, 111111111111111111, 'Leader', 5000),
(1, 123456789012345678, 'Officer', 1200),
(2, 123456789012345678, 'Leader', 800),
(2, 987654321098765432, 'Member', 300);

-- Sample market listings
INSERT INTO market_listings (seller_id, item_id, quantity, price_per_unit, total_price, quality, expires_at) VALUES
(987654321098765432, 3, 10, 60, 600, 'Stable', CURRENT_TIMESTAMP + INTERVAL '7 days'),
(111111111111111111, 4, 5, 250, 1250, 'Optimized', CURRENT_TIMESTAMP + INTERVAL '3 days'),
(123456789012345678, 1, 1, 150, 150, 'Optimized', CURRENT_TIMESTAMP + INTERVAL '1 day');

-- Sample world events
INSERT INTO world_events (name, type, description, active, start_time, end_time, effects, participation_rewards) VALUES
('Digital Storm', 'storm', 'A massive electromagnetic disturbance sweeping through Neo-Avalon', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hours', '{"damage_multiplier": 1.5, "eidolon_sync_bonus": 20}', '{"nexium": 100, "experience": 50}'),
('Void Rift', 'anomaly', 'Dimensional tears opening across the city, releasing powerful Eidolons', false, CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day 4 hours', '{"rarity_boost": true, "encounter_rate": 2.0}', '{"rare_materials": [{"id": 4, "quantity": 3}]}');

-- Sample combat logs
INSERT INTO combat_logs (user_id, encounter_id, action_type, action_data, success, damage_dealt, rewards) VALUES
(123456789012345678, 1, 'weave', '{"pattern": "NOT Logic"}', true, 150, '{"nexium": 50, "experience": 25}'),
(987654321098765432, 2, 'scan', '{"analysis": "Memory patterns detected"}', true, 0, '{"nexium": 80, "experience": 40}'),
(111111111111111111, 4, 'skill', '{"eidolon_id": 1, "skill_used": "Symphony of Echoes"}', true, 500, '{"nexium": 300, "experience": 150}');
