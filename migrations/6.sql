
-- Add shop items if they don't exist
INSERT OR IGNORE INTO shop_items (id, name, description, price, item_command, category, is_active) VALUES 
(1, 'Chave Lendária Gen 1-3', 'Contém todos os pokémons lendários das gerações 1 até 3', 25.0, 'give {player} cobblemontrainerbattle:elite_aaron_ticket', 'keys', 1),
(2, 'Chave Lendária Gen 4-5', 'Contém todos os pokémons lendários das gerações 4 e 5', 25.0, 'give {player} cobblemontrainerbattle:leader_volkner_ticket', 'keys', 1),
(3, 'Chave Lendária Gen 6-7', 'Contém todos os pokémons lendários das gerações 6 e 7', 25.0, 'give {player} cobblemontrainerbattle:champion_cynthia_ticket', 'keys', 1),
(4, 'Chave Lendária Gen 8-9', 'Contém todos os pokémons lendários das gerações 8 e 9', 25.0, 'give {player} cobblemontrainerbattle:elite_bertha_ticket', 'keys', 1);
