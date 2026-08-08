// Preferências de diagramação do leitor (página /configuracoes).
//
// Fluxo: o script inline do <head> (Base.astro) aplica o cache do localStorage ANTES da
// primeira pintura, para a página não "pular"; depois, quem estiver logado sincroniza com
// profiles.config no Supabase (migracao-9). O site inteiro lê os valores por variáveis
// CSS com fallback, então config ausente = padrões atuais do site.
//
// O usuário pretende usar estes valores para calibrar o PADRÃO futuro do site: o botão
// "Copiar JSON" da página exporta o estado para virar default depois.

import { aplicarCores, type CoresConfig } from './cores-site';

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
  /** texto corrido justificado (com hifenização); no celular segue à esquerda */
  justificar?: boolean;
  /** margem lateral da área de conteúdo, em rem (só acima de 900px) */
  margem?: number;
  /** a coluna de texto fica centrada na página ou encostada à esquerda */
  alinha?: 'centro' | 'esquerda';
  /** estilo da barra de rolagem (janela e sidebar) */
  barra?: 'nativa' | 'fina' | 'editorial' | 'dourada' | 'teal';
  /** onde o Fundo Arcano aparece: no site inteiro ou só nas páginas de ficha */
  fundo?: 'site' | 'ficha';
  /** intensidade do fundo decorativo (--deco-strength); 1 = como foi desenhado */
  decoForca?: number;
  /** cores fora do padrão, por tema: { escuro: { ink: '#e9e5d7' } }. Ver lib/cores-site.ts */
  cores?: CoresConfig;
};

/** Padrões DO SITE. Os mesmos valores estão nos fallbacks do global.css, para valerem
 *  também sem JavaScript; aqui eles servem para a página acender o preset certo. */
export const CONFIG_PADRAO: Required<ConfigSite> = {
  tema: 'escuro',
  largTexto: 46,
  colunas: 1,
  largTabela: 0,        // igual ao texto
  largFicha: 60,
  fonteCorpo: 21,
  entrelinha: 1.62,
  justificar: true,
  margem: 3,
  alinha: 'esquerda',
  barra: 'fina',
  fundo: 'site',
  decoForca: 1,
  cores: {},           // nenhuma cor fora do que o global.css já define
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
    ? 'var(--cfg-larg-texto, 46rem)'                       // "igual ao texto"
    : cfg.largTabela ? cfg.largTabela + 'rem' : null);
  põe('--cfg-larg-ficha', cfg.largFicha === 0 ? '200rem' : cfg.largFicha ? cfg.largFicha + 'rem' : null);
  põe('--fs-corpo', cfg.fonteCorpo ? (cfg.fonteCorpo / 16) + 'rem' : null);
  põe('--cfg-entrelinha', cfg.entrelinha ? String(cfg.entrelinha) : null);
  põe('--cfg-margem', cfg.margem == null ? null : cfg.margem + 'rem');
  põe('--deco-strength', cfg.decoForca == null ? null : String(cfg.decoForca));

  // O fundo decorativo é a única marca que o site sempre escreve, inclusive no
  // padrão: o CSS trata "sem atributo" como site inteiro, mas deixar o valor
  // explícito é o que faz o controle da página acender o botão certo.
  de.dataset.fundo = cfg.fundo === 'ficha' ? 'ficha' : 'site';

  if (cfg.colunas === 2) de.dataset.colunas = '2';
  else delete de.dataset.colunas;

  // os data-attributes marcam quem SAIU do padrão do site; ausência = padrão
  if (cfg.justificar === false) de.dataset.justif = '0';
  else delete de.dataset.justif;

  if (cfg.alinha === 'centro') de.dataset.alinha = 'centro';
  else delete de.dataset.alinha;

  if (cfg.barra && cfg.barra !== 'fina') de.dataset.barra = cfg.barra;
  else delete de.dataset.barra;

  // a paleta não cabe em variáveis inline no <html>: ela é por tema, e o leitor troca
  // de tema pelo cabeçalho sem passar por aqui. Vai numa folha de estilo injetada.
  aplicarCores(cfg.cores);

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
