// Resumo de combate de um PC a partir do estado da ficha (objeto S).
// Puro e reaproteitável: extrai Ataque, Dano e Defesa física (Esquiva) usando a
// mesma matemática de ficha-engine (renderCombate/renderDerived), sem tocar no DOM.
// Serve ao rastreador de combate da mesa, que só tem a ficha crua do personagem.
import { defesa, defesaMental, ataqueCentelha, empilharArmaduras, soakNatural, regras, MODO_ORDEM, MODO_SIGLA, deslocamento, valorPassivo, type Sentidos } from './calc';
import { ARMA, ESCUDO, armaDoSlot, escudoDoSlot, armadurasDe } from './equip';
import { qaDaPeca, type QACombate } from './quase-acerto';
import RACA_D from '../data/racas.json';

const RACA: Record<string, any> = Object.fromEntries((RACA_D as any[]).map((r) => [r.id, r]));

export interface Soak { impacto: number; corte: number; perfuracao: number; }
/** As três velocidades de uma peça, em metros por Tick. */
export interface Passo { batalha: number; arranque: number; corrida: number; }
export interface ResumoCombate {
  arma: string;
  ataque: string; // pool de acerto, ex.: "4d6+2 +1"
  dano: string;   // dano base + sigla do modo principal, ex.: "3d6 +2 (C)"
  defesa: number; // Defesa física (Esquiva)
  defesaMental: number; // Defesa Mental (o bloco da criatura já trazia a dela)
  soak: Soak;     // Absorção por tipo (abate o dano bruto sofrido)
  resistPerf: number; // Resistência a Perfuração (Nível) da armadura
  qa: QACombate;  // Quase-Acerto: o que a arma amplia e o que o couro abate
  /**
   * O PASSO REAL, que o tabuleiro precisa e não tinha.
   *
   * O Grid oferecia 3 m/Tick para todo mundo, porque o número morava só na
   * ficha e ninguém o trazia até aqui: Kael anda 4 e o anão 2, e os dois
   * recebiam 3. Sai da mesma `deslocamento()` que a ficha desenha, com a
   * fração da raça (baixa estatura) e a meia penalidade da armadura já
   * descontadas, para os dois lugares mostrarem o mesmo número.
   */
  passo: Passo;
  /** Perceber e esconder-se. Ver `Sentidos`, em `calc.ts`. */
  sentidos: Sentidos;
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

  // TOLERÂNCIA · o dano à distância soma Força×1, que é o atalho e não a régua.
  // LEVANTA QUANDO: a régua de dano à distância fechar. Ela depende do arremesso
  // (`Arremesso_Regra.md`, seção H do `Pendencias.md`), onde a massa do braço e o
  // arco já estão modelados, e onde a Força não entra linearmente.
  //
  // Dano base: dado da arma + Força e a sigla do modo principal. À distância soma Força×1 (por ora).
  const dist = (w.tags || []).includes('distância');
  const fm = regras.derivados.danoForca as { umaMao: number; duasMaos: number };
  const versatil = (w.tags || []).includes('versátil');
  const capF = w.forcaCap != null ? Math.min(forca, w.forcaCap) : forca;
  const mult = dist ? (w.forcaMult ?? 1) : (w.maos === 2 ? (w.forcaMult ?? fm.duasMaos) : (versatil && inabilVazio ? fm.duasMaos : (w.forcaMult ?? fm.umaMao)));
  const forcaAp = (w.danoBonus || 0) + capF * mult;
  const modos = ((w.modos ?? [{ tipo: w.tipoDano, principal: true }]) as any[]).slice()
    .sort((a, b) => ((MODO_ORDEM as any)[a.tipo] ?? 9) - ((MODO_ORDEM as any)[b.tipo] ?? 9));
  // O MODO DA FICHA É O `principal` DO CATÁLOGO, e não o primeiro da ordem de
  // exibição. Decidido em 03/09. SEIS das dez armas de mais de um modo mudaram
  // de categoria de Absorção (contadas por `scripts/dano-por-tipo.mjs`, e não a
  // olho); cinco por esta regra e a Alabarda pela do `fichaModo`, mais abaixo:
  //
  //   Machado, Montante, Machado de Arremesso · Impacto → Corte
  //   Picareta de Guerra                      · Impacto → Perfuração
  //   Adaga                                   · Corte   → Perfuração
  //
  // A Alabarda não está na lista porque ela marca os TRÊS modos como principal;
  // o caso dela é o parágrafo do `fichaModo`, mais abaixo.
  //
  // Não era cosmético: a sigla vai para a expressão de dano, a mesa lê o tipo
  // dela (`tipoDeDano(ra.dano)`) e é ele que escolhe QUAL ABSORÇÃO o alvo
  // aplica. E as três Absorções não valem a mesma coisa (só o Impacto recebe o
  // Vigor natural), então a troca MEXE NO EQUILÍBRIO, e não na vitrine: contra
  // alvo sem armadura o Machado sobe 230% no dano líquido por golpe, e contra
  // malha ele DESCE 50%, porque a malha protege mais contra corte que contra
  // impacto. O sinal depende do alvo, e as duas pontas são grandes.
  //
  // A ARMA DE VÁRIOS PRINCIPAIS DIZ QUAL VAI NA FICHA, no campo `fichaModo`.
  // Decidido em 03/09 (D45). Só a Alabarda tem mais de um principal hoje, e sem
  // este campo quem decidia era o `find` sobre a lista ordenada por exibição:
  // saía IMPACTO, que é o pior ou o empatado-pior contra os três alvos de
  // referência (nu 7/3/3, malha 8/9/4, placa 12/11/7). A arma que existe para
  // cobrir as três frentes estava saindo pela face mais fraca, e por acidente de
  // ordem. O `validate` cobra o campo de toda arma com mais de um principal.
  //
  // A ordem de `MODO_ORDEM` continua valendo como desempate para a arma que
  // não marca principal nenhum.
  const escolhido = (w as any).fichaModo
    ? modos.find((m) => m.tipo === (w as any).fichaModo) : null;
  const principal = escolhido || modos.find((m) => m.principal) || modos[0];
  const sigla = MODO_SIGLA[(principal?.tipo) as keyof typeof MODO_SIGLA] || '';
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

  // O PASSO, pela mesma régua da ficha (ver `ficha-engine`, bloco do
  // Deslocamento): a fração da raça entra DENTRO de `deslocamento()`, antes do
  // arredondamento, e a armadura tira metade da penalidade em metros.
  const fracR = RACA[S?.raca]?.deslocamentoFrac ?? 1;
  const dz = deslocamento({
    forca, destreza: attrs.destreza || 0,
    atletismo: skills.atletismo || skills2.atletismo || 0, centelha: C,
  }, fracR);
  const penMov = Math.floor(penFisica / 2);
  const mp = (v: number) => Math.max(0, v - penMov);
  const passo: Passo = { batalha: mp(dz.normal), arranque: mp(dz.arranque), corrida: mp(dz.corrida) };

  // OS SENTIDOS, para o golpe vindo do escuro. O PC e o lado facil dos dois: a
  // ficha tem as pericias por nome, entao a Passiva e a jogada saem direto. A
  // criatura chega ao mesmo contrato por outro caminho (ver ).
  const sentidos = {
    percepcaoPassiva: valorPassivo(attrs.percepcao, skills.prontidao ?? skills2.prontidao, C),
    furtividade: { atributo: attrs.destreza || 0, pericia: skills.furtividade ?? skills2.furtividade ?? 0 },
  };
  return { arma: w.nome, ataque, dano, defesa: def, defesaMental: defMental, soak,
    resistPerf: armSt.resistPerf || 0, qa, passo, sentidos };
}
