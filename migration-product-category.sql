-- ===================================================
-- MIGRAÇÃO: Adicionar campo category à tabela products
-- Executa DEPOIS do fix-admin-rls.sql
-- ===================================================

-- 1. Adicionar coluna category (se não existir)
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'outros';

-- 2. Adicionar coluna category_order para ordenar categorias no menu
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_order INT DEFAULT 99;

-- 3. Limpar seed anterior e inserir com categorias
DELETE FROM products WHERE created_at IS NOT NULL;

INSERT INTO products (name, description, price, image_url, display_order, category, category_order, is_active) VALUES
  -- Decoração
  ('LOVE - Decoração Metal',     'Uma palavra simples, universal e direta. Decoração em metal com QR integrado, pensada para mesas, estantes ou secretárias.', 24.90, '/imagens/quadro.jpeg',  1, 'decoracao', 1, true),
  ('AMOR - Decoração Metal',     'Mais próxima, mais nossa. Uma peça decorativa com presença e significado, com QR integrado de forma discreta.', 24.90, '/imagens/quadro.jpeg',  2, 'decoracao', 1, true),
  ('TE AMO - Decoração Metal',   'Direto ao ponto, sem rodeios. Uma declaração clara, transformada numa peça decorativa sólida e intencional.', 24.90, '/imagens/quadro.jpeg',  3, 'decoracao', 1, true),
  ('FAMÍLIA - Decoração Metal',  'Uma palavra que não precisa de explicação. Decoração em metal com QR integrado, pensada para o centro da casa.', 24.90, '/imagens/quadro.jpeg',  4, 'decoracao', 1, true),
  -- Canecas
  ('Caneca LOVE',    'Uma caneca simples com uma palavra que todos reconhecem. O QR acrescenta uma camada pessoal a um objeto do dia a dia.', 13.90, '/imagens/caneca.jpeg', 5, 'canecas', 2, true),
  ('Caneca AMOR',    'Uma caneca pensada para casa, para uso diário ou como presente. A palavra Amor é clara, próxima e intemporal.', 13.90, '/imagens/caneca.jpeg', 6, 'canecas', 2, true),
  ('Caneca TE AMO',  'Para quem prefere dizer as coisas sem filtros. Uma caneca direta, com uma mensagem forte e um QR integrado.', 13.90, '/imagens/caneca.jpeg', 7, 'canecas', 2, true),
  ('Caneca FAMÍLIA', 'Uma caneca que faz sentido em qualquer cozinha. Pensada para uso diário, com uma palavra que une e um QR discreto.', 13.90, '/imagens/caneca.jpeg', 8, 'canecas', 2, true),
  -- Porta-chaves
  ('Porta-chaves QR Neutro',          'Design simples e discreto. Feito para uso diário, sem texto nem símbolos desnecessários. Funcional e direto.', 8.90, '/imagens/chaveiro.jpeg', 9,  'porta-chaves', 3, true),
  ('Porta-chaves QR Feminino',        'Linhas suaves e acabamento cuidado. Pensado para quem prefere um objeto funcional com um toque mais delicado.', 8.90, '/imagens/chaveiro.jpeg', 10, 'porta-chaves', 3, true),
  ('Porta-chaves QR Masculino',       'Mais sóbrio, mais direto. Um porta-chaves resistente, com QR discreto e sem elementos decorativos.', 8.90, '/imagens/chaveiro.jpeg', 11, 'porta-chaves', 3, true),
  ('Porta-chaves QR Minimal Premium', 'Versão mais refinada, com materiais e acabamento superiores. Funcional e elegante.', 8.90, '/imagens/chaveiro.jpeg', 12, 'porta-chaves', 3, true),
  -- Íman / Autocolante
  ('Íman QR Clássico',             'Pensado para o frigorífico ou superfícies metálicas. Discreto, funcional e sempre acessível.', 6.90, '/imagens/autocolante.jpeg', 13, 'iman-autocolante', 4, true),
  ('Íman QR Minimal',              'Design preto e branco, sem texto. Ideal para quem quer algo o mais neutro possível.', 6.90, '/imagens/autocolante.jpeg', 14, 'iman-autocolante', 4, true),
  ('Autocolante QR Espelho/Portátil', 'Autocolante discreto para superfícies lisas. Ideal para espelhos, portáteis ou uso pessoal.', 6.90, '/imagens/autocolante.jpeg', 15, 'iman-autocolante', 4, true),
  ('Autocolante QR Vinil Removível',  'Vinil mate, fácil de aplicar e remover. Pensado para quem quer flexibilidade.', 6.90, '/imagens/autocolante.jpeg', 16, 'iman-autocolante', 4, true),
  -- Digital
  ('QR Digital', 'Versão digital em PNG de alta qualidade. Ideal para uso discreto ou integração em outros objetos. Download imediato após compra.', 2.90, NULL, 17, 'digital', 5, true)
ON CONFLICT DO NOTHING;

SELECT 'Migração de categorias aplicada!' AS resultado;
