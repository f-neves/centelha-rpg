// Preferências de diagramação do leitor (página /configuracoes).
//
// Fluxo: o script inline do <head> (Base.astro) aplica o cache do localStorage ANTES da
// primeira pintura, para a página não "pular"; depois, quem estiver logado sincroniza com
// profiles.config no Supabase (migracao-9). O site inteiro lê os valores por variáveis
// CSS com fallback, então config ausente = padrões atuais do site.
//
// O usuário pretende usar estes valores para calibrar o PADRÃO futuro do site: o botão
// "Copiar JSON" da página exporta o estado para virar default depois.

export type ConfigSite = {
  tema?: 'classico' | 'escuro' | 'legivel';
  /** largura da coluna de texto, em rem (no modo 2 colunas é a largura de CADA coluna) */
  largTexto?: number;
  /** 1 ou 2 colunas de texto corrido (2 só vale acima de 1100px; celular é sempre 1) */
  colunas?: 1 | 2;
  /** teto das tabelas de capítulo, em rem; 0 = "igual ao texto" (sem recuo além da coluna) */
  largTabela?: number;
  /** largura da Ficha de Personagem, em rem; 0 = tela toda */
  largFicha?: number;
  /** corpo do texto, em px */
  fonteCorpo?: number;
  /** entrelinha do corpo */
  entrelinha?: number;
};

export const CONFIG_PADRAO: Required<Omit<ConfigSite, 'tema'>> = {
  largTexto: 36,
  colunas: 1,
  largTabela: 48,
  largFicha: 60,
  fonteCorpo: 18.9,
  entrelinha: 1.62,
};

export const CONFIG_KEY = 'centelha:config';

export function lerCache(): ConfigSite {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}') || {}; } catch { return {}; }
}

export function gravarCache(cfg: ConfigSite) {
  try {
    const limpo = Object.fromEntries(Object.entries(cfg).filter(([, v]) => v != null));
    if (Object.keys(limpo).length) localStorage.setItem(CONFIG_KEY, JSON.stringify(limpo));
    else localStorage.removeItem(CONFIG_KEY);
  } catch { /* modo privado etc. */ }
}

/** Aplica a config no documento. Mesma lógica do script inline do Base (mantê-los em pé de igualdade). */
export function aplicarConfig(cfg: ConfigSite) {
  const de = document.documentElement;
  const st = de.style;
  const põe = (n: string, v: string | null) => (v == null ? st.removeProperty(n) : st.setProperty(n, v));

  põe('--cfg-larg-texto', cfg.largTexto ? cfg.largTexto + 'rem' : null);
  põe('--cfg-larg-tabela', cfg.largTabela === 0
    ? 'var(--cfg-larg-texto, 36rem)'                       // "igual ao texto"
    : cfg.largTabela ? cfg.largTabela + 'rem' : null);
  põe('--cfg-larg-ficha', cfg.largFicha === 0 ? '200rem' : cfg.largFicha ? cfg.largFicha + 'rem' : null);
  põe('--fs-corpo', cfg.fonteCorpo ? (cfg.fonteCorpo / 16) + 'rem' : null);
  põe('--cfg-entrelinha', cfg.entrelinha ? String(cfg.entrelinha) : null);

  if (cfg.colunas === 2) de.dataset.colunas = '2';
  else delete de.dataset.colunas;

  if (cfg.tema) {
    de.dataset.theme = cfg.tema;
    try { localStorage.setItem('tema', cfg.tema); } catch { /* noop */ }
  }
}

/** Sincroniza com a conta: baixa o config salvo (se houver) e o aplica; devolve o efetivo. */
export async function sincronizarDaConta(): Promise<ConfigSite | null> {
  try {
    const { getSupabase } = await import('./supabase');
    const sb = getSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    const { data, error } = await sb.from('profiles').select('config').eq('id', user.id).maybeSingle();
    if (error || !data?.config) return null; // coluna pode nem existir ainda (migracao-9)
    const cfg = data.config as ConfigSite;
    gravarCache(cfg);
    aplicarConfig(cfg);
    return cfg;
  } catch { return null; }
}

/** Salva na conta (silencioso se deslogado ou sem a coluna da migracao-9). */
export async function salvarNaConta(cfg: ConfigSite): Promise<boolean> {
  try {
    const { getSupabase } = await import('./supabase');
    const sb = getSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return false;
    const { error } = await sb.from('profiles').update({ config: cfg }).eq('id', user.id);
    return !error;
  } catch { return false; }
}
