import { supabase } from './supabase';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function adminFetch(table: string, query?: { select?: string; order?: { column: string; ascending?: boolean }; eq?: { column: string; value: any } }) {
  const accessToken = await getToken();
  const res = await fetch('/api/admin-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, query, accessToken }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao carregar dados');
  return json.data;
}

export async function adminSave(table: string, updates: Record<string, any>, id?: string) {
  const accessToken = await getToken();
  const res = await fetch('/api/admin-data', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, id, updates, accessToken }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao guardar');
  return json.data;
}

export async function adminDelete(table: string, id: string) {
  const accessToken = await getToken();
  const res = await fetch('/api/admin-data', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, id, accessToken }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao apagar');
  return json.success;
}
