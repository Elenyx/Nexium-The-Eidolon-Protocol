-- Seed data for eidolons
INSERT INTO eidolons (name, rarity, element, description, lore, base_attack, base_defense, base_speed, skill_name, skill_description)
VALUES
	('Astra', 'SR', 'Light', 'A radiant Eidolon of hope.', 'Forged in the first dawn, Astra brings light to the lost.', 120, 110, 130, 'Radiant Pulse', 'Deals light damage to all foes.'),
	('Umbra', 'SR', 'Dark', 'A shadowy Eidolon of secrets.', 'Born from the void, Umbra manipulates darkness.', 125, 105, 125, 'Shadow Veil', 'Reduces enemy accuracy.'),
	('Pyra', 'R', 'Fire', 'A fiery Eidolon with a temper.', 'Pyra once ignited the Great Forge.', 110, 100, 120, 'Blazing Rush', 'Deals fire damage and may burn.'),
	('Aegis', 'SSR', 'Earth', 'A stalwart protector.', 'Aegis is the shield of the ancient world.', 100, 140, 90, 'Stonewall', 'Raises defense for all allies.'),
	('Zephyra', 'UC', 'Wind', 'A swift Eidolon of the skies.', 'Zephyra rides the jetstream.', 105, 95, 140, 'Gale Dance', 'Increases speed for all allies.');
