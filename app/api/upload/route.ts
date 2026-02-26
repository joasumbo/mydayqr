import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folder = (formData.get('folder') as string) || 'uploads';

  if (!file) return NextResponse.json({ error: 'Nenhum ficheiro enviado.' }, { status: 400 });

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from('images')
    .upload(filename, bytes, { contentType: file.type, upsert: false });

  if (error) {
    // Tentar criar o bucket se não existir
    if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
      await supabaseAdmin.storage.createBucket('images', { public: true });
      const { error: err2 } = await supabaseAdmin.storage
        .from('images')
        .upload(filename, bytes, { contentType: file.type, upsert: false });
      if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from('images').getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
