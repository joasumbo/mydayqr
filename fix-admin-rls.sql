-- ===================================================
-- FIX: Eliminar recursão RLS em todas as tabelas admin
-- Executa este script no Supabase SQL Editor
-- ===================================================

-- 1. Função SECURITY DEFINER — lê admins sem RLS (evita recursão)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
$$;

-- 2. ADMINS — recriar políticas
DROP POLICY IF EXISTS "Admins can view admins" ON admins;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;
DROP POLICY IF EXISTS "admins_select" ON admins;
DROP POLICY IF EXISTS "admins_all" ON admins;

CREATE POLICY "admins_select" ON admins
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admins_all" ON admins
  FOR ALL USING (public.is_admin());

-- 3. PRODUCTS — recriar políticas
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "products_public_select" ON products;
DROP POLICY IF EXISTS "products_admin_all" ON products;

CREATE POLICY "products_public_select" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (public.is_admin());

-- 4. EXAMPLES — recriar políticas
DROP POLICY IF EXISTS "Anyone can view active examples" ON examples;
DROP POLICY IF EXISTS "Admins can manage examples" ON examples;
DROP POLICY IF EXISTS "examples_public_select" ON examples;
DROP POLICY IF EXISTS "examples_admin_all" ON examples;

CREATE POLICY "examples_public_select" ON examples
  FOR SELECT USING (is_active = true);

CREATE POLICY "examples_admin_all" ON examples
  FOR ALL USING (public.is_admin());

-- 5. SITE CONFIG — recriar políticas
DROP POLICY IF EXISTS "Anyone can view site config" ON site_config;
DROP POLICY IF EXISTS "Admins can manage site config" ON site_config;
DROP POLICY IF EXISTS "site_config_public_select" ON site_config;
DROP POLICY IF EXISTS "site_config_admin_all" ON site_config;

CREATE POLICY "site_config_public_select" ON site_config
  FOR SELECT USING (true);

CREATE POLICY "site_config_admin_all" ON site_config
  FOR ALL USING (public.is_admin());

-- 6. COUPONS (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'coupons') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can view coupons" ON coupons';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons';
    EXECUTE 'CREATE POLICY "coupons_admin_all" ON coupons FOR ALL USING (public.is_admin())';
  END IF;
END $$;

-- 7. ORDERS (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all orders" ON orders';
    EXECUTE 'DROP POLICY IF EXISTS "admins_manage_orders" ON orders';
    EXECUTE 'CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "orders_public_insert" ON orders FOR INSERT WITH CHECK (true)';
  END IF;
END $$;

-- 8. Garantir dados iniciais em site_config (caso não existam)
INSERT INTO site_config (key, value, type, category, label, description) VALUES
  ('hero_title', 'Um presente que nunca fica igual', 'text', 'hero', 'Título Principal', 'Título do hero'),
  ('hero_subtitle', 'Oferece um QR Code que muda de mensagem sempre que quiseres.', 'textarea', 'hero', 'Subtítulo', 'Descrição do hero'),
  ('hero_cta', 'Começar agora', 'text', 'hero', 'Botão CTA', 'Texto do botão principal'),
  ('para_quem_title', 'Para quem é', 'text', 'para_quem', 'Título da Secção', ''),
  ('para_quem_item1', 'Para quem quer oferecer algo que evolui com a relação', 'text', 'para_quem', 'Item 1', ''),
  ('para_quem_item2', 'Para quem quer estar presente todos os dias, mesmo à distância', 'text', 'para_quem', 'Item 2', ''),
  ('para_quem_item3', 'Para quem gosta de surpreender com palavras', 'text', 'para_quem', 'Item 3', ''),
  ('diferencial_title', 'Porque é diferente', 'text', 'diferencial', 'Título da Secção', ''),
  ('diferencial_item1', 'Não é só um QR estático — é um canal de comunicação', 'text', 'diferencial', 'Item 1', ''),
  ('diferencial_item2', 'Sem apps para instalar — basta apontar a câmara', 'text', 'diferencial', 'Item 2', ''),
  ('diferencial_item3', 'Muda de mensagem quando quiseres — é vitalício', 'text', 'diferencial', 'Item 3', ''),
  ('contact_email', 'geral@inpulse-events.com', 'text', 'contact', 'Email', ''),
  ('contact_phone', '+351 913 698 968', 'text', 'contact', 'Telefone', ''),
  ('contact_address', 'Santa Maria da Feira, Portugal', 'text', 'contact', 'Endereço', ''),
  ('footer_copyright', 'Inpulse Events. Todos os direitos reservados.', 'text', 'footer', 'Copyright', '')
ON CONFLICT (key) DO NOTHING;

-- 9. Garantir produtos iniciais
INSERT INTO products (name, description, price, image_url, display_order, is_active) VALUES
  ('Download Digital', 'Ficheiro PNG de alta qualidade', 2.00, NULL, 1, true),
  ('Imagem Impressa', 'Imagem impressa pronta para emoldurar', 5.00, '/imagens/quadro.jpeg', 2, true),
  ('Caneca', 'Caneca personalizada com o teu QR Code', 17.00, '/imagens/caneca.jpeg', 3, true),
  ('T-shirt', 'T-shirt com o QR Code da tua mensagem', 25.00, '/imagens/tshirt.jpeg', 4, true),
  ('Autocolante', 'Autocolante resistente para qualquer superfície', 5.00, '/imagens/autocolante.jpeg', 5, true),
  ('Chaveiro', 'Chaveiro personalizado com QR Code', 8.00, '/imagens/chaveiro.jpeg', 6, true),
  ('Almofada', 'Almofada decorativa com QR Code', 20.00, '/imagens/almofada.jpeg', 7, true),
  ('Pack Completo', 'Caneca + T-shirt + Autocolante', 40.00, NULL, 8, true)
ON CONFLICT DO NOTHING;

-- 10. Garantir exemplos iniciais
INSERT INTO examples (title, description, image_url, display_order, is_active) VALUES
  ('Caneca com frase diária', 'Café da manhã com uma mensagem sempre nova', '/imagens/caneca.jpeg', 1, true),
  ('Autocolante no portátil', 'No portátil, agenda ou espelho', '/imagens/autocolante.jpeg', 2, true),
  ('Peça na mesa de cabeceira', 'A última coisa que vês antes de dormir', '/imagens/quadro.jpeg', 3, true),
  ('T-shirt com mensagem sempre nova', 'Uma t-shirt que nunca enjoa', '/imagens/tshirt.jpeg', 4, true)
ON CONFLICT DO NOTHING;

-- 11. Bucket de imagens para upload
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Política: qualquer um pode ver (public), só admins fazem upload via service_role (API)
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
CREATE POLICY "Public read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

SELECT 'FIX aplicado com sucesso!' as resultado;
