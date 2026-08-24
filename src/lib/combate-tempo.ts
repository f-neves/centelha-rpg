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
const R = regras as any;

export type Sistema = 'normal' | 'pgr';
export type Marcacao = 'fita' | 'numeros';
export type Fase = 'livre' | 'preparo' | 'golpe' | 'recuperacao';
export type Manobra = 'simples' | 'dupla' | 'segura' | 'rajada';
export type ClasseArma = 'leve' | 'media' | 'haste' | 'pesada' | 'distancia' | 'arremesso' | 'arte';

/**
 * Quem rola os dados.
 *
 * Não é regra: nenhum número muda. É uma escolha de MESA sobre quem digita o
 * resultado, e por isso mora junto do sistema de tempo, no mesmo painel. O
 * padrão é `mesa` (ninguém rola no site) porque o dado na mão é metade da mesa,
 * e o `misto` existe porque metade das transcrições de uma sessão é o mestre
 * rolando pelos próprios monstros, que é a parte que ninguém sente falta.
 */
export type Rolagem = 'mesa' | 'misto' | 'site';

/**
 * O golpe sai no Tick agendado, e nao na declaracao?
 *
 * E a regra escrita (`combate.pgr.preparo`): declara-se no Tick T e o golpe cai
 * em T + Preparo. A mesa, ate aqui, resolvia tudo na declaracao, e o que
 * acontecia em T + Preparo era so desenho. Ligar isto faz o motor obedecer.
 *
 * Nasce DESLIGADO de proposito. Nao e uma regra nova: e uma regra antiga que a
 * tela nunca cumpriu, e cumpri-la muda o ritmo da mesa (declara-se as cegas,
 * espera-se, e o alvo pode morrer ou sumir no meio). Isso se prova jogando, e
 * enquanto nao estiver provado a mesa de sempre continua intacta.
 *
 * So tem efeito no `pgr`: no sistema normal o Preparo e zero em toda classe, e
 * o golpe ja cai no Tick da declaracao por construcao.
 */
export const GOLPE_ADIADO: {
  nome?: string; resumo?: string; detalhe?: string; nota?: string;
  padrao?: boolean; soNoPgr?: boolean;
} = C?.golpeAdiado || {};
export const golpeAdiadoPadrao: boolean = !!GOLPE_ADIADO.padrao;

/**
 * Esta mesa adia o golpe, de verdade, agora?
 *
 * Duas condições, e a segunda é a que evita a pergunta boba: no sistema normal
 * o Preparo é zero em toda classe, então adiar não adiaria nada e a mesa
 * ganharia um segundo clique para confirmar o golpe que acabou de declarar.
 */
export const adiaGolpe = (c: CombateMesa | null | undefined): boolean =>
  !!c?.golpeAdiado && c.sistema === 'pgr';

/** O que uma mesa escolheu: o sistema de tempo, o desenho dele e os dados. */
export interface CombateMesa {
  sistema: Sistema; marcacao: Marcacao; rolagem: Rolagem; golpeAdiado: boolean;
}
export const COMBATE_PADRAO: CombateMesa = {
  sistema: (C?.sistemaPadrao as Sistema) || 'normal',
  marcacao: (C?.marcacao?.padrao as Marcacao) || 'fita',
  rolagem: (C?.rolagem?.padrao as Rolagem) || 'mesa',
  golpeAdiado: golpeAdiadoPadrao,
};
export const combateDaMesa = (mesa: any): CombateMesa => ({ ...COMBATE_PADRAO, ...(mesa?.combate || {}) });

export const SISTEMAS: { id: Sistema; nome: string; resumo: string; detalhe: string }[] = C?.sistemas || [];
export const MARCACOES: { id: Marcacao; nome: string; resumo: string }[] = C?.marcacao?.modos || [];
export const ROLAGENS: { id: Rolagem; nome: string; resumo: string }[] = C?.rolagem?.modos || [];

/**
 * O site rola por esta peça?
 *
 * A pergunta é sempre sobre QUEM AGE, e não sobre quem está olhando: no misto,
 * o goblin rola sozinho mesmo quando é o jogador que aperta o botão de dano
 * nele, porque quem está rolando ali é o ataque do goblin.
 */
export const rolaNoSite = (rolagem: Rolagem, ehPersonagem: boolean) =>
  rolagem === 'site' || (rolagem === 'misto' && !ehPersonagem);

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
  /**
   * Os Ticks de `golpes` cujo golpe AINDA NÃO FOI RESOLVIDO.
   *
   * Só existe com o golpe adiado ligado, e é o que separa "o gesto está
   * agendado" de "o gesto já caiu". Sem ele não há como distinguir o martelo
   * que ainda vai bater no Tick 3 do martelo que bateu e está se recompondo:
   * os dois têm `golpes: [3]` e os dois estão em Recuperação depois disso.
   *
   * Some um Tick de cada vez, conforme a mesa resolve. Lista vazia (ou ausente)
   * quer dizer que não há nada no ar, que é o estado de toda ação declarada com
   * a chave desligada.
   */
  aResolver?: number[];
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
/**
 * A arma do catálogo, pelo id OU pelo nome.
 *
 * A mesa guarda ora um ora outro: a ficha grava `espada-longa`, o bestiário
 * escreve "Espada Longa" e o mestre digita o que quiser num figurante. Quem
 * precisa do catálogo precisa das duas portas, e a busca por nome mora aqui
 * para não ser reescrita em cada tela que resolve uma arma.
 */
export function armaDoCatalogo(idOuNome?: string | null): any | null {
  if (!idOuNome) return null;
  return ARMA[idOuNome] || Object.values(ARMA).find((x: any) => x.nome === idOuNome) || null;
}

export function classeDaArma(idOuNome?: string | null): ClasseArma {
  return (armaDoCatalogo(idOuNome)?.classe as ClasseArma) || 'leve';
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
  if (armaDoCatalogo(arma)) return classeDaArma(arma);
  const v = velocidade ?? 5;
  return v <= 5 ? 'leve' : v === 6 ? 'media' : 'pesada';
}

/** A Velocidade da arma em Ticks (o ciclo inteiro), com fallback razoável. */
export function velocidadeDaArma(idOuNome?: string | null, padrao = 5): number {
  return armaDoCatalogo(idOuNome)?.ticks ?? padrao;
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

/**
 * ONDE CADA UM ENTRA NA LINHA DE TICKS, pela iniciativa que rolou.
 *
 * A régua (`derivados.iniciativa`), e ela NÃO é um Tick por ponto:
 *
 *   · quem tirou o MAIOR entra sozinho no Tick 1;
 *   · os demais entram um Tick depois por DEGRAU de atraso, arredondando para
 *     cima: 1 a 6 pontos atrás entram no 2, 7 a 12 no 3, 13 a 18 no 4;
 *   · cada degrau custa também 1d6 na ação, o contrapé (ver `contrapeEm`).
 *
 * O degrau de 6 não é gosto: a iniciativa vai de 2 a 18, então o vão máximo
 * possível é 16, e com degrau 6 ninguém nunca entra depois do Tick 4, role o
 * que rolar. Medido numa cena de oito (quatro PCs e quatro criaturas do
 * bestiário), o vão típico é de 7 a 9 pontos e a cena se parte em três
 * instantes: é o suficiente para a ordem importar sem virar fila de banco.
 *
 * Empate no topo: os dois entram juntos no Tick 1, e quem age primeiro dentro
 * do instante é o desempate do capítulo (maior Raciocínio, depois o dado), que
 * é ordem e não tempo, e a fila já resolve arrastando.
 *
 * Devolve na MESMA ORDEM que recebeu: quem chama costuma ter a lista de peças
 * ao lado e não quer casar nada por nome.
 */
export function ticksDeEntrada(
  iniciativas: number[],
): { tick: number; penDados: number; atras: number }[] {
  if (!iniciativas.length) return [];
  const I = (R as any)?.derivados?.iniciativa;
  const primeiro = I?.tickDoPrimeiro ?? 1;
  const gap = Math.max(1, I?.gapPorPenalidade ?? 6);
  const porDegrau = I?.contrapeDadosPorDegrau ?? -1;
  const maior = Math.max(...iniciativas.map((v) => v || 0));
  return iniciativas.map((v0) => {
    const atras = Math.max(0, maior - (v0 || 0));
    const degrau = Math.ceil(atras / gap);
    return { tick: primeiro + degrau, penDados: porDegrau * degrau, atras };
  });
}

/**
 * A ORDEM DA FILA, num lugar só.
 *
 * As duas telas ordenavam a fila com o mesmo comparador escrito duas vezes, e
 * as duas cópias tinham o mesmo defeito: pulavam o **Raciocínio**, que a regra
 * manda usar para desempatar iniciativa igual, e caíam direto num critério de
 * estabilidade (a hora em que a peça foi posta no mapa) que não é regra de
 * coisa nenhuma.
 *
 * Os quatro degraus, nesta ordem:
 *
 *   1. o **Tick**, menor primeiro: é o relógio, e ele manda em tudo;
 *   2. a **iniciativa**, maior primeiro, dentro do mesmo Tick;
 *   3. o **Raciocínio**, maior primeiro, que é o desempate do capítulo;
 *   4. e o que sobrar, só para a ordem não dançar a cada repintura.
 *
 * `raciocinio` ausente vale −1, e não zero: quem a mesa não conhece (o
 * figurante de cena) fica atrás de quem tem o número, em vez de empatar com
 * quem tem Raciocínio 0.
 */
export interface NaOrdem {
  tick?: number | null;
  iniciativa?: number | null;
  raciocinio?: number | null;
  /** O critério de estabilidade: um carimbo, um id, o que a tela tiver. */
  chegada?: string | null;
  nome?: string | null;
}
export const ordemDaFila = (a: NaOrdem, b: NaOrdem): number =>
  ((a.tick ?? 0) - (b.tick ?? 0))
  || ((b.iniciativa ?? 0) - (a.iniciativa ?? 0))
  || ((b.raciocinio ?? -1) - (a.raciocinio ?? -1))
  || String(a.chegada || '').localeCompare(String(b.chegada || ''))
  || String(a.nome || '').localeCompare(String(b.nome || ''));

/**
 * A FASE DE QUEM AINDA NÃO DECLAROU, MAS AGE NESTE INSTANTE.
 *
 * O problema que ela resolve: dois duelistas de adaga agem no mesmo Tick. O
 * mestre resolve um de cada vez, e quando o primeiro ataca, o segundo ainda não
 * declarou nada, então a agenda dele está vazia e ele lê como **livre**, com a
 * guarda inteira. Quando o segundo ataca de volta, o primeiro já declarou e
 * está em Golpe, com −4. Medido num duelo de iguais: quem o mestre resolve por
 * último ganha **97%** das vezes, e a jogada certa passa a ser nunca declarar
 * primeiro, que é uma regra se voltando contra si mesma.
 *
 * A correção é ler a escada pela REGRA e não pela ordem de digitação: se a
 * agenda dos dois diz Golpe no mesmo Tick, os dois estão abertos nesse Tick.
 * Quem age no Tick T com Preparo P golpeia em T+P, e é isso que esta função
 * responde para quem ainda não escreveu a agenda.
 *
 * Com Preparo ≥ 1 nada muda (os dois já liam −4, porque a agenda do primeiro
 * marca o Golpe num Tick futuro que o segundo também alcança). O conserto vale
 * para o Preparo 0: a arma leve no P/G/R, e todo mundo no sistema normal.
 *
 * É uma PRESUNÇÃO, e assumida: o alvo pode acabar movendo em vez de golpear.
 * Por isso a tela escreve o motivo ao lado do número, e o ajuste avulso da
 * folha continua ali para quem quiser desfazer a conta.
 */
export function faseDeQuemVaiAgir(
  tickDoAlvo: number, preparoDoAlvo: number, tickDoGolpe: number,
): Fase {
  const golpe = tickDoAlvo + Math.max(0, preparoDoAlvo);
  if (tickDoGolpe < tickDoAlvo || tickDoGolpe > golpe) return 'livre';
  return tickDoGolpe === golpe ? 'golpe' : 'preparo';
}

/**
 * O CONTRAPÉ, E POR QUE ELE É DO RELÓGIO E NÃO DA AÇÃO.
 *
 * Quem entrou atrasado age pego no contrapé: 1d6 a menos por degrau de atraso.
 * Num sistema em que a jogada é `total > Defesa`, um dado não é um arranhão:
 * medido num pool de PC (3d6 +5) contra Defesa 12, ele leva a chance de acertar
 * de 84% para 42%, e dois dados a levam a zero, porque 1d6+5 não tem como
 * superar 12. Uma penalidade que pode ser erro matemático precisa de saída.
 *
 * A saída é o TEMPO: a penalidade cai 1d6 a cada Tick que passa. Quem entrou no
 * Tick 3 com −2d6 escolhe entre bater no 3 por −2d6, no 4 por −1d6 ou no 5
 * inteiro. A vantagem de quem rolou bem deixa de ser "o outro erra" e passa a
 * ser "o outro chega depois", que é a moeda deste motor.
 *
 * E ela desce SOZINHA, sem depender de a pessoa fazer ou deixar de fazer nada.
 * Foi de propósito: se qualquer ação declarada apagasse o contrapé, a jogada
 * ótima seria comprá-lo por um Tick de bobagem, e uma penalidade que vale
 * metade da chance de acertar não pode custar um Tick.
 */
export function contrapeEm(acao: any, tick: number): number {
  const n = Number(acao?.contrape) || 0;
  if (!n) return 0;
  const decai = (R as any)?.derivados?.iniciativa?.contrapeDecaiPorTick ?? 1;
  const desde = Number(acao?.contrapeDesde) || 0;
  return Math.min(0, n + Math.max(0, tick - desde) * decai);
}

/**
 * O contrapé atravessa a declaração de uma ação nova.
 *
 * `declarar` monta uma ação limpa, e é isso que faz a Pressão zerar quando a
 * pessoa age, que é a regra. O contrapé é o contrário: ele não é da ação, é do
 * relógio, então tem de ser carregado à mão para o outro lado.
 */
export const contrapeDe = (acao: any): { contrape?: number; contrapeDesde?: number } =>
  (Number(acao?.contrape) || 0)
    ? { contrape: acao.contrape, contrapeDesde: Number(acao.contrapeDesde) || 0 }
    : {};

/** Em que Tick o contrapé desta ação chega a zero. */
export function contrapeAcaba(acao: any): number | null {
  const n = Number(acao?.contrape) || 0;
  if (!n) return null;
  const decai = (R as any)?.derivados?.iniciativa?.contrapeDecaiPorTick ?? 1;
  return (Number(acao?.contrapeDesde) || 0) + Math.ceil(Math.abs(n) / decai);
}

/**
 * A ANATOMIA DE UMA AÇÃO QUALQUER, a que a régua não previu.
 *
 * A régua por classe cobre o que tem catálogo: arma, arremesso, Arte. O resto
 * do jogo (derrubar a estante, arrombar a porta, amarrar a corda, acalmar o
 * cavalo) não tem classe nenhuma, e é justamente onde a mesa mais improvisa.
 * Sem uma forma para isso, "outra coisa" só existiria como o mestre empurrando
 * o Tick na mão, e o improviso ficaria MAIS CARO que o ataque comum, que é o
 * contrário do que se quer.
 *
 * Duas formas, e a escolha é de quem está mestrando:
 *
 *   `agora` · resolve no Tick da declaração e o resto do ciclo é Recuperação.
 *     É a forma de beber a poção, abrir a porta, gritar a ordem: acontece, e
 *     depois se paga.
 *   `fim` · resolve no ÚLTIMO Tick, e o caminho todo é Preparo. É a forma da
 *     Arte e do arco: telegrafa, dá para ler e dá para interromper. É o que
 *     serve para mirar, montar a emboscada, empurrar a estante.
 *
 * No sistema normal as duas colapsam na primeira, porque lá nada telegrafa: é
 * a mesma degeneração elegante do resto do motor.
 */
export function anatomiaLivre(
  velocidade: number, quando: 'agora' | 'fim', sistema: Sistema,
): Anatomia {
  const vel = Math.max(1, Math.round(velocidade) || 1);
  const preparo = sistema === 'pgr' && quando === 'fim' ? vel - 1 : 0;
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

// ------------------------------------------------------ o golpe que sai depois
/**
 * A ação declarada com os golpes AINDA NO AR.
 *
 * É o único ponto em que o golpe adiado entra na construção: `declarar` monta a
 * agenda como sempre, e isto marca quais desses Ticks ainda devem à mesa uma
 * resolução. Com a chave desligada ninguém chama esta função, e `aResolver` não
 * existe em ação nenhuma: o estado antigo continua sendo exatamente o antigo.
 *
 * Ela não agenda nada que já venceu no mesmo instante em que nasce: no sistema
 * normal, e na arma leve do P/G/R, o Preparo é zero e o golpe cai no Tick da
 * declaração. Esses resolvem na hora, como sempre resolveram, e pendurá-los
 * seria pedir à mesa um segundo clique para confirmar o que ela acabou de
 * declarar.
 */
export function agendar(acao: Acao, tickAgora: number): Acao {
  const noAr = acao.golpes.filter((g) => g > tickAgora);
  return noAr.length ? { ...acao, aResolver: noAr } : acao;
}

/** Os Ticks de golpe que esta ação ainda deve resolver. Vazio = nada no ar. */
export const golpesNoAr = (acao: Acao | null | undefined): number[] =>
  Array.isArray(acao?.aResolver) ? (acao as Acao).aResolver as number[] : [];

/** O primeiro golpe no ar desta ação, resolvido ou não. `null` = nada pendente. */
export function proximoGolpe(acao: Acao | null | undefined): number | null {
  const p = golpesNoAr(acao);
  return p.length ? Math.min(...p) : null;
}

/**
 * O golpe desta ação que já venceu neste Tick, se houver.
 *
 * "Venceu" é `<=` e não `===` de propósito: um golpe agendado para o Tick 3 que
 * a mesa não resolveu no 3 continua devendo no 4, e sumir dele por causa de um
 * clique esquecido seria perder o gesto sem que ninguém decidisse perdê-lo. O
 * atraso aparece na tela; o golpe não evapora.
 */
export function golpeDevido(acao: Acao | null | undefined, tick: number): number | null {
  const p = golpesNoAr(acao).filter((g) => g <= tick);
  return p.length ? Math.min(...p) : null;
}

/**
 * A ação depois que um dos golpes no ar caiu.
 *
 * Tira só aquele Tick, e não a lista: a rajada tem golpes em Ticks seguidos e a
 * empunhadura dupla tem dois, e cada um é resolvido por si. `golpes` fica
 * intacto, porque a agenda é história e a fita continua a desenhá-la; o que
 * muda é a dívida.
 */
export function golpeResolvido(acao: Acao, tick: number): Acao {
  const resta = golpesNoAr(acao).filter((g) => g !== tick);
  const nova: Acao = { ...acao, aResolver: resta };
  if (!resta.length) delete nova.aResolver;
  return nova;
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
export function defesaPerdida(
  acao: Acao | null | undefined, tick: number,
  opts: { segura?: boolean; fase?: Fase } = {},
) {
  const e = C?.escada || {};
  // `opts.fase` é a fase FORÇADA de quem ainda não declarou mas já está
  // comprometido com este instante: ver `faseDeQuemVaiAgir`.
  const fase = opts.fase || faseEm(acao, tick);
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
          ? `Na Recuperação não há o que abortar, o golpe já saiu. O que cabe aqui é pagar: uma ação fora de hora, ou ${
            C?.recuperacao?.deslocamentoTicksPorMetro ?? 1} Tick(s) por metro para se deslocar.`
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
