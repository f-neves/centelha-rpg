// Núcleo do editor de criaturas do bestiário: vocabulário, derivados e persistência.
// Fica fora do .astro para poder ser importado tanto no servidor (montar o form)
// quanto no cliente (recalcular ao vivo), sem duplicar número nenhum.
import { pv, defesa, defesaMental, defesaSocial, iniciativa, regras } from './calc';
import type { Porte } from './calc';

/** As 15 palavras de fraqueza e resistência. Mesma lista do gen-elementos.mjs e
 *  do validate-data.mjs: mudar aqui exige mudar nos três. */
export const VOCAB_ELEM = [
  'fogo', 'agua', 'gelo', 'raio', 'vento', 'terra', 'luz', 'sombra',
  'corte', 'perfuracao', 'impacto',
  'sagrado', 'profano', 'prata', 'sol',
] as const;

/** O bestiário guarda o porte como RÓTULO ("Enorme", "Miúdo") e o `calc.ts` espera
 *  slug ("enorme", "minusculo"). Sem esta ponte o porte cai no padrão Médio em
 *  silêncio, e um Treant perde 26 PV sem ninguém perceber. */
export const PORTE_LBL: Record<string, string> = {
  minusculo: 'Miúdo', pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande',
  enorme: 'Enorme', imenso: 'Imenso', colossal: 'Colossal',
};
const PORTE_SLUG: Record<string, Porte> = Object.fromEntries(
  Object.entries(PORTE_LBL).map(([slug, lbl]) => [lbl.toLowerCase(), slug as Porte]),
) as Record<string, Porte>;

export function porteSlug(v: string | undefined): Porte {
  if (!v) return 'medio';
  const k = String(v).toLowerCase();
  if (k in PORTE_LBL) return k as Porte;      // já é slug
  return PORTE_SLUG[k] ?? 'medio';            // é rótulo
}

export interface CriaturaEdit {
  id: string;
  nome: string;
  conceito: string;
  ameaca: number;
  centelha: number;
  porte: Porte;
  atributos: Record<string, number>;
  vontade: number;
  integridade: number;
  /** Perícia; entra na Iniciativa (1d6 + Raciocínio + Prontidão). */
  prontidao: number;
  fraquezas: string[];
  resistencias: string[];
  notas: string;
}

/** Os derivados, pelas mesmas fórmulas dos personagens (src/lib/calc.ts → regras.json). */
export function derivados(c: CriaturaEdit) {
  const a = c.atributos || {};
  const n = (k: string) => Number(a[k] ?? 0);
  const cent = Number(c.centelha ?? 0);
  const vig = n('vigor');
  const soakCent = (regras as any).dano?.centelhaNoSoak ?? 1;
  return {
    pv: pv(vig, porteSlug(c.porte)),
    defesa: defesa({ destreza: n('destreza'), habilidade: 0, centelha: cent }),
    defesaSocial: defesaSocial({ compostura: n('compostura'), sociabilidade: 0, centelha: cent }),
    defesaMental: defesaMental({ raciocinio: n('raciocinio'), integridade: Number(c.integridade ?? 0), vontade: Number(c.vontade ?? 0), centelha: cent }),
    // Absorção natural: Vigor + Centelha (a armadura entra por fora, no gerador)
    absorcao: vig + cent * soakCent,
    iniciativa: iniciativa({ raciocinio: n('raciocinio'), prontidao: Number(c.prontidao ?? 0) }).str,
  };
}

const CHAVE = 'centelha:bestiario:edicoes';

export function lerEdicoes(): Record<string, Partial<CriaturaEdit>> {
  try { return JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch { return {}; }
}
export function salvarEdicao(id: string, dados: Partial<CriaturaEdit>) {
  const todas = lerEdicoes();
  todas[id] = dados;
  localStorage.setItem(CHAVE, JSON.stringify(todas));
}
export function apagarEdicao(id: string) {
  const todas = lerEdicoes();
  delete todas[id];
  localStorage.setItem(CHAVE, JSON.stringify(todas));
}

/** O bloco no formato que o `inimigos-custom.json` espera, pronto para colar. */
export function paraJson(c: CriaturaEdit) {
  const out: Record<string, unknown> = {
    id: c.id,
    nome: c.nome,
    conceito: c.conceito,
    ameaca: Number(c.ameaca) || 1,
    centelha: Number(c.centelha) || 0,
    porte: porteSlug(c.porte),
    attrs: Object.fromEntries(Object.entries(c.atributos || {}).filter(([, v]) => Number(v) > 0).map(([k, v]) => [k, Number(v)])),
    vontade: Number(c.vontade) || 0,
    integridade: Number(c.integridade) || 0,
    pericias: { prontidao: Number(c.prontidao) || 0 },
  };
  if (c.fraquezas?.length) out.fraquezas = [...c.fraquezas].sort();
  if (c.resistencias?.length) out.resistencias = [...c.resistencias].sort();
  if (c.notas) out.notas = c.notas;
  return JSON.stringify(out, null, 2);
}
