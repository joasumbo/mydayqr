-- Adicionar configurações de cores ao site_config
INSERT INTO public.site_config (key, value, type, category, label, description) VALUES
  ('brand_primary', '#e11d48', 'text', 'branding', 'Cor Primária', 'Cor principal do site (botões, ícones, etc.)'),
  ('brand_secondary', '#fb7185', 'text', 'branding', 'Cor Secundária', 'Cor de destaque secundária (hovers, detalhes)'),
  ('brand_gradient_from', '#ef4444', 'text', 'branding', 'Gradiente (Início)', 'Cor inicial dos gradientes'),
  ('brand_gradient_to', '#be123c', 'text', 'branding', 'Gradiente (Fim)', 'Cor final dos gradientes')
ON CONFLICT (key) DO NOTHING;
