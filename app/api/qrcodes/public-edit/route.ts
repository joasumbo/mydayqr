import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const editCode = searchParams.get('editCode');

  if (!editCode) {
    return NextResponse.json({ error: 'Token de edição é obrigatório' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('qrcodes')
    .select('id, phrase, short_code, created_at')
    .eq('edit_code', editCode)
    .maybeSingle();

  if (error) {
    if (error.code === '42703' || (typeof error.message === 'string' && error.message.toLowerCase().includes('edit_code'))) {
      return NextResponse.json({ error: 'A edição por link ainda não está ativa. Executa a migração SQL primeiro.' }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Link de edição inválido' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { editCode, phrase } = body;

  if (!editCode || !phrase || !phrase.trim()) {
    return NextResponse.json({ error: 'Token de edição e frase são obrigatórios' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('qrcodes')
    .update({ phrase: phrase.trim() })
    .eq('edit_code', editCode)
    .select('id, phrase, short_code, created_at')
    .maybeSingle();

  if (error) {
    if (error.code === '42703' || (typeof error.message === 'string' && error.message.toLowerCase().includes('edit_code'))) {
      return NextResponse.json({ error: 'A edição por link ainda não está ativa. Executa a migração SQL primeiro.' }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Link de edição inválido' }, { status: 404 });
  }

  return NextResponse.json({ success: true, qr: data });
}
