import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const ALLOWED_TABLES = ['products', 'examples', 'coupons', 'orders', 'site_config', 'admins', 'users', 'qrcodes'];

export async function POST(req: Request) {
  const { table, query, accessToken } = await req.json();

  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Tabela não permitida.' }, { status: 403 });
  }

  // Verificar que é admin
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  if (accessToken) {
    const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    const { data: admin } = await supabaseAdmin.from('admins').select('id').or(`user_id.eq.${user.id},email.eq.${user.email}`).single();
    if (!admin) return NextResponse.json({ error: 'Não é admin.' }, { status: 403 });
  }

  // Executar query com service_role (sem RLS)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabaseAdmin.from(table).select(query?.select || '*');
  if (query?.order) q = q.order(query.order.column, { ascending: query.order.ascending ?? true });
  if (query?.eq) q = q.eq(query.eq.column, query.eq.value);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function PUT(req: Request) {
  const { table, id, updates, accessToken } = await req.json();

  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Tabela não permitida.' }, { status: 403 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Verificar admin
  const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
  if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  const { data: admin } = await supabaseAdmin.from('admins').select('id').or(`user_id.eq.${user.id},email.eq.${user.email}`).single();
  if (!admin) return NextResponse.json({ error: 'Não é admin.' }, { status: 403 });

  const { data, error } = id
    ? await supabaseAdmin.from(table).update(updates).eq('id', id).select().single()
    : await supabaseAdmin.from(table).insert(updates).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req: Request) {
  const { table, id, accessToken } = await req.json();

  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Tabela não permitida.' }, { status: 403 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
  if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  const { data: admin } = await supabaseAdmin.from('admins').select('id').or(`user_id.eq.${user.id},email.eq.${user.email}`).single();
  if (!admin) return NextResponse.json({ error: 'Não é admin.' }, { status: 403 });

  const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
