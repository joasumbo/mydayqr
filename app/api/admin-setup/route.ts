import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email e senha obrigatórios.' }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Criar utilizador no Auth (ou usar existente)
  let userId: string;

  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createErr) {
    // Se já existe, tentar fazer sign-in para obter o user_id
    if (createErr.message?.includes('already been registered') || createErr.message?.includes('already exists')) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers();
      const existing = list?.users?.find(u => u.email === email);
      if (!existing) return NextResponse.json({ error: 'Utilizador já existe mas não foi possível encontrá-lo.' }, { status: 400 });
      userId = existing.id;

      // Actualizar a senha
      await supabaseAdmin.auth.admin.updateUserById(userId, { password });
    } else {
      return NextResponse.json({ error: createErr.message }, { status: 400 });
    }
  } else {
    userId = created.user.id;
  }

  // 2. Inserir na tabela admins (ignorar se já existir)
  const { error: adminErr } = await supabaseAdmin
    .from('admins')
    .upsert({ user_id: userId, email, role: 'admin' }, { onConflict: 'email' });

  if (adminErr) {
    return NextResponse.json({ error: 'Auth OK mas erro ao inserir em admins: ' + adminErr.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Admin "${email}" criado/actualizado com sucesso! Já pode fazer login.` });
}
