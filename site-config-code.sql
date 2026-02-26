-- Entradas para CSS e JS personalizados injectáveis via admin
INSERT INTO public.site_config (key, value, type, category, label, description)
VALUES
  ('custom_css', '', 'textarea', 'custom', 'CSS Personalizado', 'CSS injectado globalmente no site'),
  ('custom_js',  '', 'textarea', 'custom', 'JavaScript Personalizado', 'JS executado no cliente em todas as páginas')
ON CONFLICT (key) DO NOTHING;
