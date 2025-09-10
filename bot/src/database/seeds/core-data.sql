-- Seed data for items
INSERT INTO items (name, type, subtype, rarity, description, icon, base_value, stats)
VALUES
	('Basic Tuner', 'tuner', NULL, 'Stable', 'A simple device for attuning Eidolons.', '🔧', 100, '{"power": 5}'),
	('Nano Medkit', 'consumable', NULL, 'Stable', 'Restores a small amount of HP.', '🩹', 50, '{"heal": 25}'),
	('Quantum Blade', 'equipment', 'weapon', 'Optimized', 'A blade forged with quantum filaments.', '⚔️', 500, '{"attack": 20}'),
	('Memory Core', 'material', NULL, 'Unstable', 'A fragment of lost knowledge.', '🧩', 30, '{"sync": 10}');

-- Seed data for syndicates
INSERT INTO syndicates (name, description, leader_id, level, resources, controlled_ward)
VALUES
	('Neo-Avalon Vanguard', 'Defenders of Neo-Avalon Central.', NULL, 1, 1000, 'Neo-Avalon Central'),
	('The Null Collective', 'Seekers of forbidden knowledge.', NULL, 1, 500, 'The Null Zone');
