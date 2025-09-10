-- Seed data for eidolons
INSERT INTO eidolons (name, rarity, element, description, lore, base_attack, base_defense, base_speed, skill_name, skill_description)
VALUES
	('Seraphina, the Final Verse', 'SSR', 'Resonance', 'A legendary composer whose melodies can reshape reality', 'Once the greatest composer of Neo-Avalon, her final symphony was said to open doorways between dimensions. Her spectral form still conducts ethereal orchestras.', 180, 120, 140, 'Symphony of Echoes', 'Deals massive damage and buffs all allied Eidolons'),
	('Kaelen, the Unraveled', 'SSR', 'Void', 'An architect whose structures defied the laws of physics', 'Master architect who built impossible geometries. When reality rejected his designs, he became one with the architectural paradoxes he created.', 160, 150, 130, 'Paradox Construction', 'Creates defensive barriers that reflect damage back to enemies'),
	('Bexley, the Iron Sentinel', 'SR', 'Steel', 'Guardian of the old metro tunnels beneath Neo-Avalon', 'Former security chief of the underground transit system. Even in death, she patrols the forgotten tunnels, protecting travelers from the anomalies below.', 140, 180, 100, 'Metro Shield', 'Provides strong defense and counterattacks when allies are hit'),
	('Zara, the Glitch Walker', 'R', 'Data', 'A hacker who became one with the digital realm', 'Brilliant programmer who dove too deep into the city''s data networks. Her consciousness fragmented across servers, becoming a living glitch.', 130, 110, 160, 'System Intrusion', 'Bypasses enemy defenses and causes confusion effects'),
	('Echo, the Lost Signal', 'UC', 'Sound', 'Remnant of the city''s communication network', 'A fragment of the old city-wide communication AI that gained sentience. Echoes of lost messages and forgotten conversations.', 110, 100, 120, 'Signal Boost', 'Amplifies the abilities of other Eidolons in the party'),
	('Static, the Interference', 'C', 'Electric', 'Basic electrical anomaly found throughout the city', 'Simple manifestation of electromagnetic disturbance. Common but useful for basic tasks and early training.', 80, 90, 110, 'Electric Jolt', 'Quick electric attack that can paralyze weak enemies');

-- Seed data for encounters
INSERT INTO encounters (name, type, location, difficulty, weakness_pattern, weakness_hint, rewards) VALUES
('Data Glitch', 'glitch', 'Neo-Avalon Central', 1, 'NOT Logic', 'It fears the logic it cannot compute', '{"nexium": 50, "experience": 25, "tuner_chance": 0.1}'),
('Memory Leak', 'anomaly', 'Digital District', 2, 'Memory AND Clear', 'It hoards what should be freed', '{"nexium": 80, "experience": 40, "items": [{"id": 3, "quantity": 2}]}'),
('Recursive Loop', 'anomaly', 'Tech Sector', 3, 'Break OR Escape', 'It''s trapped in its own creation', '{"nexium": 120, "experience": 60, "rare_material_chance": 0.3}'),
('The Corrupted Archive', 'boss', 'Data Vaults', 5, '(Scan AND Analyze) OR Purge', 'Knowledge corrupted seeks cleansing or understanding', '{"nexium": 300, "experience": 150, "guaranteed_ssr_tuner": true}');
