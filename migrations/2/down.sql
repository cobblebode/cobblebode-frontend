
DELETE FROM vip_products;

INSERT INTO vip_products (name, description, price, duration_days, features) VALUES
('VIP Bronze', 'Benefícios básicos para começar sua jornada', 19.90, 30, 'Kit inicial VIP|Acesso a área VIP|2x XP|Fly por 1 hora/dia'),
('VIP Prata', 'Vantagens intermediárias para treinadores dedicados', 39.90, 30, 'Tudo do Bronze|Kit mensal melhorado|3x XP|Fly ilimitado|/home (3 casas)|Nickname colorido'),
('VIP Ouro', 'Pacote completo para mestres Pokémon', 69.90, 30, 'Tudo do Prata|Kit premium|5x XP|/back após morte|/home (5 casas)|Partículas exclusivas|Tag [VIP OURO]'),
('VIP Diamante', 'A experiência definitiva no CobbleBode', 129.90, 30, 'Tudo do Ouro|Kit lendário|10x XP|Acesso a eventos exclusivos|/home (10 casas)|Pokémon shiny garantido|Tag [DIAMANTE] especial');
