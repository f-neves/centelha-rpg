// Cliente Supabase para o navegador (o site é estático; a segurança real é a RLS no banco).
// As variáveis PUBLIC_* são embutidas no bundle do cliente pela Astro e são públicas por design.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

/** true quando as chaves do Supabase estão definidas no ambiente de build. */
export const supabaseConfigurado = Boolean(URL && KEY);

let _client: SupabaseClient | null = null;

/** Retorna o cliente Supabase (singleton). Lança se as chaves não estiverem configuradas. */
export function getSupabase(): SupabaseClient {
  if (!supabaseConfigurado) {
    throw new Error(
      'Supabase não configurado. Defina PUBLIC_SUPABASE_URL e PUBLIC_SUPABASE_ANON_KEY (veja .env.example).',
    );
  }
  if (!_client) {
    _client = createClient(URL!, KEY!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return _client;
}
