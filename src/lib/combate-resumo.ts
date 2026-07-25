// Resumo de combate de um PC a partir do estado da ficha (objeto S).
// Puro e reaproteitável: extrai Ataque, Dano e Defesa física (Esquiva) usando a
// mesma matemática de ficha-engine (renderCombate/renderDerived), sem tocar no DOM.
// Serve ao rastreador de combate da mesa, que só tem a ficha crua do personagem.
import { defesa, ataqueCentelha, empilharArmaduras, soakNatural, regras, MODO_ORDEM, MODO_SIGLA } from './calc';
import ARMA_D from '../data/armas.json';
import ARMADURA_D from '../data/armaduras.json';
import ESCUDO_D from '../data/escudos.json';

const ARMA: Record<string, any> = Object.fromEntries((ARMA_D as any[]).map((w) => [w.id, w]));
const ARMADURA: Record<string, any> = Object.fromEntries((ARMADURA_D as any[]).map((a) => [a.id, a]));
const ESCUDO: Record<string, any> = Object.fromEntries((ESCUDO_D as any[]).map((s) => [s.id, s]));

export interface Soak { impacto: number; corte: number; perfuracao: number; }
export interface ResumoCombate {
  arma: string;
  ataque: string; // pool de acerto, ex.: "4d6+2 +1"
  dano: string;   // dano base + sigla do modo principal, ex.: "3d6 +2 (C)"
  defesa: number; // Defesa física (Esquiva)
  soak: Soak;     // Absorção por tipo (abate o dano bruto sofrido)
  resistPerf: number; // Resistência a Perfuração (Nível) da armadura
}

/** Calcula Ataque, Dano e Defesa física de um PC a partir da ficha (S). */
export function resumoCombatePC(S: any): ResumoCombate {
  const attrs = S?.attrs || {}, skills = S?.skills || {}, skills2 = S?.skills2 || {};
  const C = S?.centelha || 0, forca = attrs.forca || 0;
  const w = ARMA[S?.equip?.arma || 'desarmado'] || ARMA['desarmado'];
  const escD = ESCUDO[S?.equip?.escudo || 'nenhum'] || { penalidade: 0 };
  const pecas = (S?.equip?.armaduras || []).map((id: string) => ARMADURA[id]).filter(Boolean);
  const armSt = empilharArmaduras(pecas);
  const armorPen = armSt.penalidade || 0;
  const penFisica = armorPen + (escD.penalidade || 0);

  // Ataque: [(Atrib + Perícia) / 2]d6 (+2 se ímpar) + acerto da arma + Centelha − armadura
  const soma = (attrs[w.atrib] || 0) + (skills[w.pericia] || skills2[w.pericia] || 0);
  const dados = Math.floor(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
  const flat = (w.acerto || 0) + ataqueCentelha(C) - armorPen;
  const sgn = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n)}`;
  const ataque = `${dados}d6${bonus ? '+2' : ''}${flat ? ` ${sgn(flat)}` : ''}`;

  // Dano base: dado da arma + Força (nada à distância) e a sigla do modo principal
  const dist = (w.tags || []).includes('distância');
  const fm = regras.derivados.danoForca as { umaMao: number; duasMaos: number };
  const forcaAp = dist ? 0 : forca * (w.forcaMult ?? (w.maos === 2 ? fm.duasMaos : fm.umaMao));
  const modos = ((w.modos ?? [{ tipo: w.tipoDano, principal: true }]) as any[]).slice()
    .sort((a, b) => ((MODO_ORDEM as any)[a.tipo] ?? 9) - ((MODO_ORDEM as any)[b.tipo] ?? 9));
  const sigla = MODO_SIGLA[(modos[0]?.tipo) as keyof typeof MODO_SIGLA] || '';
  const dano = `${w.dado}d6${forcaAp ? ` +${forcaAp}` : ''}${sigla ? ` ${sigla}` : ''}`;

  // Defesa física passiva = Esquiva: (Destreza + Esquiva)×2 + Centelha − penalidade física
  const def = defesa({ destreza: attrs.destreza || 0, habilidade: skills.esquiva || 0, centelha: C }) - penFisica;

  // Absorção por tipo: Impacto = Vigor + Centelha + armadura; Corte/Perfuração = Centelha + armadura.
  const cs = (regras.dano as { centelhaNoSoak?: number })?.centelhaNoSoak ?? 0;
  const vig = attrs.vigor || 0;
  const soak: Soak = {
    impacto: soakNatural(vig, 'impacto') + C * cs + (armSt.soak.impacto || 0),
    corte: soakNatural(vig, 'corte') + C * cs + (armSt.soak.corte || 0),
    perfuracao: soakNatural(vig, 'perfuracao') + C * cs + (armSt.soak.perfuracao || 0),
  };

  return { arma: w.nome, ataque, dano, defesa: def, soak, resistPerf: armSt.resistPerf || 0 };
}
