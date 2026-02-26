-- 1. Criar tabela de encomendas
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_id UUID,
    product_name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled', 'completed')),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    shipping_address TEXT,
    short_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 3. Ativar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Função is_admin com SECURITY DEFINER (evita recursão infinita)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
$$;

-- 5. Políticas
CREATE POLICY "Anyone can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage all orders"
    ON public.orders FOR ALL
    USING (public.is_admin());
