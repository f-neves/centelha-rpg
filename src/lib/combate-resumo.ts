// Resumo de combate de um PC a partir do estado da ficha (objeto S).
// Puro e reaproteitável: extrai Ataque, Dano e Defesa física (Esquiva) usando a
// mesma matemática de ficha-engine (renderCombate/renderDerived), sem tocar no DOM.
// Serve ao rastreador de combate da mesa, que só tem a ficha crua do personagem.
import { defesa, defesaMental, ataqueCentelha, empilharArmaduras, soakNatural, regras, MODO_ORDEM, MODO_SIGLA } from './calc';
import { ARMA, ESCUDO, armaDoSlot, escudoDoSlot, armadurasDe } from './equip';
import { qaDaPeca, type QACombate } from './quase-acerto';

export interface Soak { impacto: number; corte: number; perfuracao: number; }
export interface ResumoCombate {
  arma: string;
  ataque: string; // pool de acerto, ex.: "4d6+2 +1"
  dano: string;   // dano base + sigla do modo principal, ex.: "3d6 +2 (C)"
  defesa: number; // Defesa física (Esquiva)
  defesaMental: number; // Defesa Mental (o bloco da criatura já trazia a dela)
  soak: Soak;     // Absorção por tipo (abate o dano bruto sofrido)
  resistPerf: number; // Resistência a Perfuração (Nível) da armadura
  qa: QACombate;  // Quase-Acerto: o que a arma amplia e o que o couro abate
}

// As peças saem de equip.ts já com os ajustes que o jogador fez na ficha
// (variação de qualidade), então a mesa e a ficha mostram o mesmo número.
const refArma = (slot: any) => armaDoSlot(slot);
const refPen = (slot: any) => escudoDoSlot(slot)?.penalidade || 0;

/** Calcula Ataque, Dano e Defesa física de um PC a partir da ficha (S). */
export function resumoCombatePC(S: any): ResumoCombate {
  const attrs = S?.attrs || {}, skills = S?.skills || {}, skills2 = S?.skills2 || {};
  const C = S?.centelha || 0, forca = attrs.forca || 0;
  // conjunto em uso (novo modelo) com fallback para o modelo antigo (equip.arma/escudo).
  const cj = Array.isArray(S?.conjuntos) && S.conjuntos.length ? (S.conjuntos.find((c: any) => c.ativo) || S.conjuntos[0]) : null;
  let w: any, escPen = 0, inabilVazio = true;
  if (cj) {
    w = refArma(cj.habil) || ARMA['desarmado'];
    const habil2H = refArma(cj.habil)?.maos === 2;
    const inabil = habil2H ? null : cj.inabil;
    inabilVazio = !inabil || (inabil.ref || 'nada') === 'nada';
    escPen = refPen(cj.habil) + (inabil ? refPen(inabil) : 0);
  } else {
    w = ARMA[S?.equip?.arma || 'desarmado'] || ARMA['desarmado'];
    const e = ESCUDO[S?.equip?.escudo || 'nenhum'] || { penalidade: 0 };
    escPen = e.penalidade || 0; inabilVazio = !S?.equip?.escudo || S.equip.escudo === 'nenhum';
  }
  const armSt = empilharArmaduras(armadurasDe(S));
  const armorPen = armSt.penalidade || 0;
  const penFisica = armorPen + escPen;

  // Ataque: [(Atrib + Perícia) / 2]d6 (+2 se ímpar) + acerto da arma + Centelha − armadura
  // Atributo do acerto por perícia: tiro = Percepção; arremesso = Destreza; corpo a corpo = maior(Destreza, Força).
  const atribAcerto = w.pericia === 'atirador' ? (attrs.percepcao || 0)
    : w.pericia === 'arremesso' ? (attrs.destreza || 0)
    : Math.max(attrs.destreza || 0, attrs.forca || 0);
  const soma = atribAcerto + (skills[w.pericia] || skills2[w.pericia] || 0);
  const dados = Math.floor(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
  const flat = (w.acerto || 0) + ataqueCentelha(C) - armorPen;
  const sgn = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n)}`;
  const ataque = `${dados}d6${bonus ? '+2' : ''}${flat ? ` ${sgn(flat)}` : ''}`;

  // Dano base: dado da arma + Força e a sigla do modo principal. À distância soma Força×1 (por ora).
  const dist = (w.tags || []).includes('distância');
  const fm = regras.derivados.danoForca as { umaMao: number; duasMaos: number };
  const versatil = (w.tags || []).includes('versátil');
  const capF = w.forcaCap != null ? Math.min(forca, w.forcaCap) : forca;
  const mult = dist ? (w.forcaMult ?? 1) : (w.maos === 2 ? (w.forcaMult ?? fm.duasMaos) : (versatil && inabilVazio ? fm.duasMaos : (w.forcaMult ?? fm.umaMao)));
  const forcaAp = (w.danoBonus || 0) + capF * mult;
  const modos = ((w.modos ?? [{ tipo: w.tipoDano, principal: true }]) as any[]).slice()
    .sort((a, b) => ((MODO_ORDEM as any)[a.tipo] ?? 9) - ((MODO_ORDEM as any)[b.tipo] ?? 9));
  const sigla = MODO_SIGLA[(modos[0]?.tipo) as keyof typeof MODO_SIGLA] || '';
  const dano = `${w.dado}d6${forcaAp ? ` ${sgn(forcaAp)}` : ''}${sigla ? ` ${sigla}` : ''}`;

  // Defesa física passiva = Esquiva: (Destreza + Esquiva)×2 + Centelha − penalidade física
  const def = defesa({ destreza: attrs.destreza || 0, habilidade: skills.esquiva || 0, centelha: C }) - penFisica;

  // Defesa Mental. A criatura sempre trouxe a dela no bloco do bestiário; o PC
  // não trazia, e por isso a pastilha "Mental" do rastreador nascia vazia em
  // todo personagem. Mesma conta da ficha: Integridade + Raciocínio + Vontade.
  const defMental = defesaMental({
    raciocinio: attrs.raciocinio || 0,
    integridade: skills.integridade || 0,
    vontade: S?.willpower || 0,
    centelha: C,
  });

  // Absorção por tipo: Impacto = Vigor + Centelha + armadura; Corte/Perfuração = Centelha + armadura.
  const cs = (regras.dano as { centelhaNoSoak?: number })?.centelhaNoSoak ?? 0;
  const vig = attrs.vigor || 0;
  const soak: Soak = {
    impacto: soakNatural(vig, 'impacto') + C * cs + (armSt.soak.impacto || 0),
    corte: soakNatural(vig, 'corte') + C * cs + (armSt.soak.corte || 0),
    perfuracao: soakNatural(vig, 'perfuracao') + C * cs + (armSt.soak.perfuracao || 0),
  };

  // O QUASE-ACERTO, com as duas metades (ver `QACombate`). Sai daqui porque é
  // aqui que a arma resolvida e as peças de armadura já estão na mão: refazer
  // essa resolução na tela era o caminho para as duas divergirem.
  const qa = qaDaPeca(w.id || w.nome, dano, armadurasDe(S));

  return { arma: w.nome, ataque, dano, defesa: def, defesaMental: defMental, soak,
    resistPerf: armSt.resistPerf || 0, qa };
}
