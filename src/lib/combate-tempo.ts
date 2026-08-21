// A linha do tempo do combate: as duas maneiras de contar Ticks.
//
// O jogo tem DOIS sistemas de tempo, à escolha do mestre por mesa, e UM conjunto
// de regras:
//
//   normal  a ação custa a Velocidade e resolve no primeiro Tick (o capítulo IX);
//   pgr     a mesma Velocidade partida em Preparo, Golpe e Recuperação.
//
// Tudo o que foi decidido (a escada de penalidades, a rajada, a dupla, o
// deslocamento pago, a dívida de Ticks) está escrito em moeda comum — Ticks,
// dados e pontos de Defesa — e vale nos dois. Ver `Combate_Tempo.md`, §15.
//
// Este arquivo é PURO: não toca no DOM, não lê o banco, não sabe o que é uma
// mesa. Quem desenha é `mesa-combate-fita.ts`; quem persiste é a coluna `acao`
// dos combatentes (migração 27). Os números todos vêm de `regras.json`, bloco
// `combate` — nada de régua escrita à mão aqui.
//
// O motor da bancada (`scripts/lib-tempo.mjs`) usa a MESMA estrutura de agenda
// (`offs` lá, `golpes` aqui): em que Ticks o golpe sai, contado da declaração.
// Se as duas divergirem, a medição deixa de valer para o que a mesa joga.
import regras from '../data/regras.json';
import { ARMA } from './equip';

const C = (regras as any).combate;

export type Sistema = 'normal' | 'pgr';
export type Marcacao = 'fita' | 'numeros';
export type Fase = 'livre' | 'preparo' | 'golpe' | 'recuperacao';
export type Manobra = 'simples' | 'dupla' | 'segura' | 'rajada';
export type ClasseArma = 'leve' | 'media' | 'haste' | 'pesada' | 'distancia' | 'arremesso' | 'arte';

/** O que uma mesa escolheu: o sistema de tempo e como ele aparece na tela. */
export interface CombateMesa { sistema: Sistema; marcacao: Marcacao }
export const COMBATE_PADRAO: CombateMesa = {
  sistema: (C?.sistemaPadrao as Sistema) || 'normal',
  marcacao: (C?.marcacao?.padrao as Marcacao) || 'fita',
};
export const combateDaMesa = (mesa: any): CombateMesa => ({ ...COMBATE_PADRAO, ...(mesa?.combate || {}) });

export const SISTEMAS: { id: Sistema; nome: string; resumo: string; detalhe: string }[] = C?.sistemas || [];
export const MARCACOES: { id: Marcacao; nome: string; resumo: string }[] = C?.marcacao?.modos || [];

/**
 * A ação declarada, do jeito que ela mora no banco (`combatentes.acao`, jsonb).
 *
 * `golpes` é a agenda em Ticks ABSOLUTOS da mesa: um número no caso comum, dois
 * na empunhadura dupla, N na rajada. `livre` é o Tick em que o ciclo fecha e a
 * guarda se refaz. Desses dois campos sai tudo o mais, e por isso não há um
 * terceiro: fase, Defesa perdida, se dá para interromper e quanto custa reagir
 * são contas, não estado guardado.
 */
export interface Acao {
  golpes: number[];
  livre: number;
  desde?: number;         // o Tick em que foi declarada (o abortar precisa dele)
  tipo?: Manobra;
  arma?: string | null;   // só o mestre vê (a view mascara para o jogador)
  alvo?: string | null;   // idem
  divida?: number;        // Ticks que já foram empurrados para o futuro
  pressao?: number;       // ataques recebidos neste ciclo (cada um −2 de Defesa)
}

/**
 * Nada aqui dentro? Então esta pessoa está livre e de guarda inteira.
 *
 * A PRESSÃO CONTA. Quem levou três ataques e ainda não agiu não tem agenda de
 * golpe nenhuma, mas tem a guarda aberta em −6, e é justamente essa a regra
 * mais antiga do capítulo IX. Tratar `{pressao: 3}` como vazio fazia a Pressão
 * ser gravada no banco e nunca mais lida: acumulava em silêncio e não descontava
 * Defesa de ninguém.
 */
export const acaoVazia = (a: any): boolean =>
  !a || ((!Array.isArray(a.golpes) || !a.golpes.length) && !(a.pressao > 0));

/** Tem gesto no ar? (Agenda de golpes, e não só Pressão acumulada.) */
export const temGesto = (a: any): boolean => !!a && Array.isArray(a.golpes) && a.golpes.length > 0;

// ------------------------------------------------------------------ a régua
/** A classe de tempo de uma arma. Sem arma, é `leve`: o punho é rápido. */
export function classeDaArma(idOuNome?: string | null): ClasseArma {
  if (!idOuNome) return 'leve';
  const w = ARMA[idOuNome];
  if (w?.classe) return w.classe as ClasseArma;
  const achou = Object.values(ARMA).find((x: any) => x.nome === idOuNome);
  return ((achou as any)?.classe as ClasseArma) || 'leve';
}

/**
 * A classe de tempo de quem não está no catálogo: a criatura.
 *
 * O bestiário não guarda arma, guarda ataque ("Garras", "Mordida") com uma
 * Velocidade própria. Cair sempre em `leve` daria Preparo 0 ao dragão que gasta
 * 8 Ticks para bater, o que é exatamente o contrário do que a régua diz. Então,
 * quando o nome não bate com o catálogo, a classe sai da Velocidade: é a mesma
 * escada que o catálogo desenha (5 leve, 6 média, 7+ pesada).
 */
export function classeDeTempo(arma?: string | null, velocidade?: number | null): ClasseArma {
  if (arma && (ARMA[arma] || Object.values(ARMA).some((x: any) => x.nome === arma))) return classeDaArma(arma);
  const v = velocidade ?? 5;
  return v <= 5 ? 'leve' : v === 6 ? 'media' : 'pesada';
}

/** A Velocidade da arma em Ticks (o ciclo inteiro), com fallback razoável. */
export function velocidadeDaArma(idOuNome?: string | null, padrao = 5): number {
  if (!idOuNome) return padrao;
  const w = ARMA[idOuNome] || Object.values(ARMA).find((x: any) => x.nome === idOuNome);
  return (w as any)?.ticks ?? padrao;
}

/**
 * O Preparo: quantos Ticks de montagem antes do golpe sair.
 *
 * No sistema normal é sempre zero, e é isso que faz a fita degenerar com
 * elegância: o Golpe cai no Tick da declaração e todo o resto do ciclo é
 * Recuperação. No P/G/R vem da tabela por classe, com as de distância e de
 * arremesso derivando da própria Velocidade.
 */
export function preparoDe(classe: ClasseArma, velocidade: number, sistema: Sistema): number {
  if (sistema !== 'pgr') return 0;
  const r = C?.pgr?.preparo?.[classe];
  if (!r) return 0;
  const p = r.fixo != null ? r.fixo : velocidade + (r.daVelocidade || 0);
  return Math.max(0, Math.min(p, Math.max(0, velocidade - 1)));
}

/** O Preparo e o ciclo de uma Arte de grau N: sai no ÚLTIMO Tick da montagem. */
export function reguaDaArte(nivel: number, sistema: Sistema) {
  const a = C?.pgr?.arte || {};
  const ciclo = (a.cicloBase ?? 3) + (a.cicloPorNivel ?? 1) * nivel;
  const preparo = sistema === 'pgr' ? (a.preparoBase ?? 2) + (a.preparoPorNivel ?? 1) * nivel : 0;
  return { preparo, ciclo, golpe: 1, recuperacao: Math.max(0, ciclo - preparo - 1) };
}

/** O teto de golpes da rajada, por classe. Zero quer dizer "não pode". */
export function tetoDaRajada(classe: ClasseArma): number {
  return C?.rajada?.teto?.[classe] ?? 1;
}

/** Quantos Ticks o ciclo cresce ao golpear com as duas mãos, por sistema. */
export function cicloExtraDaDupla(classe: ClasseArma, sistema: Sistema): number {
  if (sistema !== 'pgr') return C?.dupla?.cicloExtraNoNormal ?? 0;
  return C?.dupla?.cicloExtra?.[classe] ?? 0;
}

// ---------------------------------------------------------------- a anatomia
export interface Anatomia {
  preparo: number; golpes: number; recuperacao: number; ciclo: number;
  penDados: number[];   // por golpe, na ordem em que saem
  offs: number[];       // em que Ticks o golpe sai, contado da declaração (0 = já)
  aviso?: string;
}

/**
 * A ação inteira, desmontada: onde caem os golpes e quanto custa cada um.
 *
 * É a mesma conta do motor da bancada. O `offs` sai daqui em Ticks RELATIVOS
 * (0 = o Tick da declaração); quem soma o Tick da mesa é `declarar`.
 */
export function anatomia(opts: {
  classe: ClasseArma; velocidade: number; sistema: Sistema;
  manobra?: Manobra; golpes?: number;
}): Anatomia {
  const { classe, sistema } = opts;
  const manobra = opts.manobra || 'simples';
  const vel = Math.max(1, opts.velocidade || 1);
  const preparo = preparoDe(classe, vel, sistema);
  let aviso: string | undefined;

  if (manobra === 'rajada') {
    const teto = tetoDaRajada(classe);
    let n = Math.max(1, Math.min(opts.golpes || 2, teto));
    if ((opts.golpes || 2) > teto) aviso = `A rajada da arma ${classe} para em ${teto} golpes.`;
    if (C?.rajada?.corpoACorpo && (classe === 'distancia' || classe === 'arremesso' || classe === 'arte')) {
      n = 1; aviso = 'A rajada é só corpo a corpo.';
    }
    const extras = n - 1;
    const pen = C?.rajada?.penDadosPorGolpeExtra ?? -1;
    const ciclo = vel + (C?.rajada?.velocidadePorGolpeExtra ?? 2) * extras;
    const offs = Array.from({ length: n }, (_, i) => preparo + i);
    return {
      preparo, golpes: n, recuperacao: Math.max(0, ciclo - preparo - n), ciclo, offs, aviso,
      penDados: Array.from({ length: n }, (_, i) => (C?.rajada?.penDadosAcumula ? pen * i : (i ? pen : 0))),
    };
  }

  if (manobra === 'dupla') {
    const ciclo = vel + cicloExtraDaDupla(classe, sistema);
    const pen = C?.dupla?.penDados ?? -1;
    const offs = [preparo, preparo + 1];
    return {
      preparo, golpes: 2, recuperacao: Math.max(0, ciclo - preparo - 2), ciclo, offs,
      penDados: [pen, C?.dupla?.penDadosAmbasAsMaos ? pen : 0],
    };
  }

  // simples e "segura" (duas armas, golpe com uma só) têm a mesma anatomia; o
  // que muda é a escada, que alivia o Tick do Golpe da segunda.
  return {
    preparo, golpes: 1, recuperacao: Math.max(0, vel - preparo - 1), ciclo: vel,
    offs: [preparo], penDados: [0],
  };
}

/** Monta a ação a partir do Tick em que ela é declarada. */
export function declarar(tickAgora: number, a: Anatomia, extra: Partial<Acao> = {}): Acao {
  return {
    golpes: a.offs.map((o) => tickAgora + o),
    livre: tickAgora + a.ciclo,
    desde: tickAgora,
    divida: 0, pressao: 0,
    ...extra,
  };
}

// ------------------------------------------------------------------ a leitura
/**
 * Em que fase alguém está, num Tick qualquer.
 *
 * A ordem das perguntas importa: primeiro "já acabou?", depois "o golpe é
 * agora?", depois "ainda falta golpe?". Sem essa ordem a rajada, que tem
 * Golpes em Ticks seguidos, se leria como Recuperação no meio dela.
 */
export function faseEm(acao: Acao | null | undefined, tick: number): Fase {
  if (acaoVazia(acao)) return 'livre';
  const a = acao as Acao;
  // Só Pressão, sem agenda: a guarda está aberta, mas a pessoa não está preso a
  // gesto nenhum. Sem esta linha, `Math.max()` de uma lista vazia dá −Infinito e
  // ela seria lida como Recuperação para sempre.
  if (!temGesto(a)) return 'livre';
  if (tick >= a.livre) return 'livre';
  if (a.golpes.includes(tick)) return 'golpe';
  if (tick < Math.max(...a.golpes)) return 'preparo';
  return 'recuperacao';
}

/** Quantos golpes já saíram até este Tick (inclusive). Conta a Recuperação. */
export const golpesDados = (acao: Acao | null | undefined, tick: number): number =>
  acaoVazia(acao) ? 0 : (acao as Acao).golpes.filter((g) => g <= tick).length;

/**
 * A escada: quanto de Defesa a ação custa neste Tick.
 *
 * Preparo −2 · Golpe −4 (o dobro, porque no instante do golpe não há como
 * defender) · Recuperação −2 POR GOLPE DADO. Mais a Pressão recebida, que
 * acumula sem teto e só zera quando o ciclo fecha. Devolve número NEGATIVO ou
 * zero, para somar direto na Defesa.
 */
export function defesaPerdida(acao: Acao | null | undefined, tick: number, opts: { segura?: boolean } = {}) {
  const e = C?.escada || {};
  const fase = faseEm(acao, tick);
  const pressao = (acao?.pressao || 0) * (e.pressaoPorAtaque ?? -2);
  let acaoDV = 0;
  if (fase === 'preparo') acaoDV = e.preparo ?? -2;
  else if (fase === 'golpe') acaoDV = (e.golpe ?? -4) + (opts.segura ? (e.alivioSegundaMao ?? 2) : 0);
  else if (fase === 'recuperacao') acaoDV = (e.recuperacaoPorGolpe ?? -2) * golpesDados(acao, tick);
  return { fase, acao: acaoDV, pressao, total: acaoDV + pressao };
}

/** Dá para interromper o gesto desta pessoa agora? Só no Preparo. */
export const podeSerInterrompido = (acao: Acao | null | undefined, tick: number) => faseEm(acao, tick) === 'preparo';

/** Ela pode agir fora da hora? Na Recuperação sim, pagando; no Preparo só para abortar. */
export function podeAgirForaDeHora(acao: Acao | null | undefined, tick: number) {
  const f = faseEm(acao, tick);
  if (f === 'livre') return { pode: true, como: 'está livre' };
  if (f === 'recuperacao') return { pode: true, como: 'pagando a Velocidade da ação em dívida' };
  if (f === 'preparo') return { pode: true, como: 'abortando o Preparo, e só para mover, desviar ou se interpor' };
  return { pode: false, como: 'está no Golpe: não se aborta, não se reage, não se interrompe' };
}

// ---------------------------------------------------------------- o abortar
/**
 * Abortar o gesto que ainda não saiu.
 *
 * A ASSIMETRIA É O CORAÇÃO DA COISA: **no Preparo você ainda pode desistir; na
 * Recuperação você já não pode, só pode pagar.** Por isso o abortar só existe
 * numa fase. No Golpe não se aborta (não há como parar o próprio braço no
 * instante em que ele cai) e na Recuperação não há o que abortar, o golpe já foi.
 *
 * O PREÇO SÃO OS TICKS INVESTIDOS. Você fica livre no Tick de AGORA, e não no
 * Tick em que declarou: tudo o que gastou montando o gesto foi para o lixo. É
 * isso que impede abortar de ser de graça, e é por isso que a arma pesada, que
 * tem o Preparo mais longo, é quem mais perde ao desistir.
 *
 * E SÓ PARA MOVER, DESVIAR OU SE INTERPOR, nunca para atacar: quem aborta não
 * ganha um ataque mais rápido, ganha uma saída. O movimento custa 1 Tick por
 * metro, o mesmo preço do desvio de emergência da §5.5 do Arcano, de que esta
 * regra é a generalização.
 *
 * Devolve a conta inteira, incluindo o caso em que não dá: quem chama decide se
 * mostra o botão ou o porquê de ele não estar lá.
 */
export function abortar(acao: Acao | null | undefined, tick: number, metros = 0) {
  const A = C?.abortar || {};
  const fase = faseEm(acao, tick);
  if (fase !== 'preparo') {
    return {
      pode: false, fase, perdidos: 0, custo: 0, novoTick: tick, devolvidos: 0,
      porque: fase === 'golpe'
        ? 'No Golpe não se aborta: o braço já está caindo.'
        : fase === 'recuperacao'
          ? 'Na Recuperação não há o que abortar, o golpe já saiu. O que cabe aqui é pagar: uma ação fora de hora, ou 2 Ticks por metro para se deslocar.'
          : 'Não há gesto no ar para abortar.',
    };
  }
  const a = acao as Acao;
  const custo = Math.max(0, Math.round(metros * (A.ticksPorMetro ?? 1)));
  // `desde` é opcional: ação escrita antes deste campo existir só não sabe
  // narrar quanto se perdeu, e zero é mais honesto do que um palpite.
  const perdidos = a.desde != null ? Math.max(0, tick - a.desde) : 0;
  return {
    pode: true, fase, perdidos, custo,
    novoTick: tick + custo,
    devolvidos: Math.max(0, a.livre - tick),   // o resto do ciclo, que volta
    porque: '',
  };
}

/** Quanto custa reagir agora: o que falta do ciclo mais a Velocidade da reação. */
export function custoDeReagir(acao: Acao | null | undefined, tick: number, velocidadeDaReacao: number) {
  const resta = acaoVazia(acao) ? 0 : Math.max(0, (acao as Acao).livre - tick);
  return { resta, total: resta + Math.max(0, velocidadeDaReacao) };
}

/** Ticks que custa andar N metros durante a Recuperação (o deslocamento pago). */
export const ticksDeDeslocamento = (metros: number) =>
  Math.max(0, Math.round(metros * (C?.recuperacao?.deslocamentoTicksPorMetro ?? 2)));

// -------------------------------------------------------------- para a tela
export const FASE_ROTULO: Record<Fase, string> = {
  livre: 'livre', preparo: 'Preparo', golpe: 'Golpe', recuperacao: 'Recuperação',
};
export const FASE_GLIFO: Record<Fase, string> = { livre: '·', preparo: '▓', golpe: '█', recuperacao: '░' };

/** Uma frase curta para o mestre: em que pé está esta ação. */
export function resumoDaAcao(acao: Acao | null | undefined, tick: number): string {
  const f = faseEm(acao, tick);
  if (f === 'livre') return 'livre';
  const a = acao as Acao;
  const dv = defesaPerdida(a, tick);
  const falta = Math.max(0, a.livre - tick);
  const q = f === 'golpe' && a.golpes.length > 1 ? ` ${a.golpes.indexOf(tick) + 1}/${a.golpes.length}` : '';
  return `${FASE_ROTULO[f]}${q} · Defesa ${dv.total} · livre em ${falta}t`;
}

/**
 * A fita: uma célula por Tick, do Tick corrente para a frente.
 *
 * Devolve dados, não HTML, porque a mesma fita é desenhada em dois lugares com
 * tamanhos diferentes (o card do rastreador e o token do Grid).
 */
export function fita(acao: Acao | null | undefined, tickAgora: number, largura = 12) {
  const cels: { tick: number; fase: Fase; agora: boolean }[] = [];
  for (let i = 0; i < largura; i++) {
    const t = tickAgora + i;
    cels.push({ tick: t, fase: faseEm(acao, t), agora: i === 0 });
  }
  return cels;
}
