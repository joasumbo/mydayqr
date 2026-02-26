-- ===================================================
-- HOTFIX Produção (Vercel): orders + products
-- Executar no Supabase SQL Editor
-- ===================================================

-- 1) Orders: colunas usadas no checkout
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- 2) Products: garantir colunas de categoria
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'outros';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_order INT DEFAULT 99;

-- 3) Corrigir categorias antigas (quando vierem como "gift"/vazio)
UPDATE public.products
SET category = CASE
  WHEN lower(name) LIKE '%caneca%' THEN 'canecas'
  WHEN lower(name) LIKE '%chaveir%' OR lower(name) LIKE '%porta-chav%' THEN 'porta-chaves'
  WHEN lower(name) LIKE '%autocolante%' OR lower(name) LIKE '%iman%' OR lower(name) LIKE '%íman%' THEN 'iman-autocolante'
  WHEN lower(name) LIKE '%digital%' OR lower(name) LIKE '%download%' THEN 'digital'
  ELSE 'decoracao'
END,
category_order = CASE
  WHEN lower(name) LIKE '%caneca%' THEN 2
  WHEN lower(name) LIKE '%chaveir%' OR lower(name) LIKE '%porta-chav%' THEN 3
  WHEN lower(name) LIKE '%autocolante%' OR lower(name) LIKE '%iman%' OR lower(name) LIKE '%íman%' THEN 4
  WHEN lower(name) LIKE '%digital%' OR lower(name) LIKE '%download%' THEN 5
  ELSE 1
END
WHERE category IS NULL OR category = '' OR lower(category) = 'gift';

-- 4) Remover duplicados de produtos (mantém o mais recente)
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY lower(trim(name)), price, COALESCE(image_url, '')
           ORDER BY created_at DESC NULLS LAST, id DESC
         ) AS rn
  FROM public.products
)
DELETE FROM public.products p
USING ranked r
WHERE p.id = r.id
  AND r.rn > 1;

SELECT 'Hotfix aplicado com sucesso' AS resultado;
