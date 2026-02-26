import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { accessToken } = await req.json();
  if (!accessToken) return NextResponse.json({ isAdmin: false }, { status: 401 });

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Obter o utilizador a partir do token (sem RLS)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) return NextResponse.json({ isAdmin: false }, { status: 401 });

  // Verificar na tabela admins sem RLS (service role bypassa tudo)
  const { data: adminRow } = await supabaseAdmin
    .from('admins')
    .select('id, role, user_id')
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .single();

  if (!adminRow) return NextResponse.json({ isAdmin: false });

  // Garantir que user_id está actualizado
  if (!adminRow.user_id || adminRow.user_id !== user.id) {
    await supabaseAdmin.from('admins').update({ user_id: user.id }).eq('id', adminRow.id);
  }

  return NextResponse.json({ isAdmin: true, role: adminRow.role });
}
