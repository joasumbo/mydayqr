-- Tabela de Cupons de Desconto
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para performance
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_is_active ON public.coupons(is_active);

-- RLS (Row Level Security)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver cupons ativos (para validação no checkout)
CREATE POLICY "Anyone can view active coupons"
    ON public.coupons FOR SELECT
    USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Política: Apenas administradores podem gerir cupons
CREATE POLICY "Admins can manage coupons"
    ON public.coupons FOR ALL
    USING (
        auth.uid() IN (SELECT user_id FROM public.admins)
    );

-- Inserir cupom de exemplo
INSERT INTO public.coupons (code, discount_type, discount_value) 
VALUES ('BEMVINDO10', 'percentage', 10.00)
ON CONFLICT DO NOTHING;
