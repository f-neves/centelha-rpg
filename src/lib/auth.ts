// Helpers de sessão/conta. Rodam no navegador (client-side islands).
import type { User } from '@supabase/supabase-js';
import { getSupabase, supabaseConfigurado } from './supabase';

export { supabaseConfigurado };

/** Usuário logado, ou null (também null se o Supabase não estiver configurado). */
export async function usuarioAtual(): Promise<User | null> {
  if (!supabaseConfigurado) return null;
  const { data } = await getSupabase().auth.getUser();
  return data.user ?? null;
}

/** Nome de exibição do usuário logado (da tabela profiles), ou ''. */
export async function perfilNome(): Promise<string> {
  const u = await usuarioAtual();
  if (!u) return '';
  const { data } = await getSupabase().from('profiles').select('nome').eq('id', u.id).maybeSingle();
  return (data?.nome as string) || u.email?.split('@')[0] || '';
}

/** Entra com e-mail + senha. Retorna { erro } com mensagem amigável, ou {} em sucesso. */
export async function entrar(email: string, senha: string): Promise<{ erro?: string }> {
  if (!supabaseConfigurado) return { erro: 'Supabase não configurado.' };
  const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password: senha });
  return error ? { erro: traduzErro(error.message) } : {};
}

/** Cria uma conta (e-mail + senha) guardando o nome em metadata; o profile é criado por trigger. */
export async function cadastrar(email: string, senha: string, nome: string): Promise<{ erro?: string }> {
  if (!supabaseConfigurado) return { erro: 'Supabase não configurado.' };
  const { error } = await getSupabase().auth.signUp({
    email: email.trim(),
    password: senha,
    options: { data: { nome: nome.trim() } },
  });
  return error ? { erro: traduzErro(error.message) } : {};
}

/** Envia e-mail de redefinição de senha (com link para a página de redefinir). */
export async function recuperarSenha(email: string, redirectTo?: string): Promise<{ erro?: string }> {
  if (!supabaseConfigurado) return { erro: 'Supabase não configurado.' };
  const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim(), redirectTo ? { redirectTo } : undefined);
  return error ? { erro: traduzErro(error.message) } : {};
}

/** Encerra a sessão. */
export async function sair(): Promise<void> {
  if (!supabaseConfigurado) return;
  await getSupabase().auth.signOut();
}

/**
 * Guarda de rota: garante que há usuário logado; se não, redireciona para /entrar
 * (guardando a página de destino em ?proximo=). Retorna o usuário ou null (já redirecionou).
 */
export async function exigirLogin(baseUrl: string): Promise<User | null> {
  const u = await usuarioAtual();
  if (u) return u;
  const proximo = encodeURIComponent(location.pathname + location.search);
  location.href = `${baseUrl}entrar?proximo=${proximo}`;
  return null;
}

function traduzErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered') || m.includes('already exists')) return 'Este e-mail já tem conta.';
  if (m.includes('password') && m.includes('at least')) return 'A senha é curta demais (mín. 6 caracteres).';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde um pouco.';
  return msg;
}
