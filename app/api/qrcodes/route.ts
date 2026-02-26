import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function getUserFromToken(authToken?: string | null) {
  if (!authToken) return { user: null, error: 'Não autorizado' };
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(authToken);
  if (error || !user) return { user: null, error: 'Sessão inválida' };
  return { user, error: null };
}

// GET - Listar QR codes do usuário
export async function GET(request: NextRequest) {
  const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const { user, error: userError } = await getUserFromToken(authToken);
  if (!user) return NextResponse.json({ error: userError }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('qrcodes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Criar novo QR code
export async function POST(request: NextRequest) {
  const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const { user, error: userError } = await getUserFromToken(authToken);
  if (!user) return NextResponse.json({ error: userError }, { status: 401 });

  const body = await request.json();
  const { phrase } = body;

  if (!phrase || !phrase.trim()) {
    return NextResponse.json({ error: 'Frase é obrigatória' }, { status: 400 });
  }

  const shortCode = nanoid(8);

  const { data, error } = await supabaseAdmin
    .from('qrcodes')
    .insert({
      user_id: user.id,
      phrase: phrase.trim(),
      short_code: shortCode,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0] || data);
}

// PUT - Atualizar frase do QR code
export async function PUT(request: NextRequest) {
  const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const { user, error: userError } = await getUserFromToken(authToken);
  if (!user) return NextResponse.json({ error: userError }, { status: 401 });

  const body = await request.json();
  const { id, phrase } = body;

  if (!id || !phrase || !phrase.trim()) {
    return NextResponse.json({ error: 'ID e frase são obrigatórios' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('qrcodes')
    .update({ phrase: phrase.trim() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'QR Code não encontrado' }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

// DELETE - Remover QR code
export async function DELETE(request: NextRequest) {
  const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const { user, error: userError } = await getUserFromToken(authToken);
  if (!user) return NextResponse.json({ error: userError }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('qrcodes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'QR Code não encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
