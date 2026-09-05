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

export type Sistema = 'normal' | 'pgr' | 'simultaneo';

/**
 * A física de um sistema: que régua de Preparo ele usa.
 *
 * O simultâneo NÃO é uma terceira física. É a física do P/G/R com outro
 * relógio (um Tick por vez, decisão a cada Tick, deslocamento no mapa), então
 * toda conta de anatomia pergunta pela física, e só o relógio pergunta pelo
 * sistema. Ver `Combate_Simultaneo.md`.
 */
export const fisicaDe = (s: Sistema): 'normal' | 'pgr' => (s === 'normal' ? 'normal' : 'pgr');
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
  // No simultâneo o golpe adiado não é opção, é o próprio modo: declarar em T e
  // valer em T+1 só existe se declarar agendar. A chave fica ignorada lá.
  c?.sistema === 'simultaneo' || (!!c?.golpeAdiado && c?.sistema === 'pgr');

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
  /**
   * O DESLOCAMENTO DECLARADO junto com o gesto (ver `Mov`, mais abaixo).
   *
   * Ele já andava aqui dentro desde o simultâneo (o Grid escreve `acao.mov` e o
   * banco guarda), e não estava declarado: era campo que existe no jsonb e que
   * o tipo não conhecia. Passou a estar quando a `defesaPerdida` precisou LER o
   * modo, para cobrar a Investida.
   */
  mov?: Mov | null;
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
  /**
   * O IDENTIFICADOR DESTA AÇÃO (`aid`, do D2 da simulação).
   *
   * Nasce na declaração, vive aqui, e sobrevive à re-projeção: quando a agenda
   * desliza porque o alvo ainda não foi alcançado, os Ticks mudam e o `aid`
   * não. É o que liga o `decl` ao `dano` no log da bateria, e sem ele o tempo
   * morto do jogador não é calculável, porque não há como saber de que
   * declaração aquele golpe veio.
   *
   * Uma ação tem UM `aid`, e uma rajada de três golpes são três golpes da mesma
   * ação: quem separa os golpes é o índice na agenda, e não o identificador.
   */
  aid?: string;
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
export function classeDeTempo(
  arma?: string | null, velocidade?: number | null, explicita?: string | null,
): ClasseArma {
  if (armaDoCatalogo(arma)) return classeDaArma(arma);
  // A classe estimada pelo bestiário (`gen-monsters.mjs`), quando existe: é ela
  // que sabe que o Arqueiro atira e o forcado alcança dois hexágonos. O
  // catálogo vem antes porque o id de arma da FICHA é dado, não estimativa.
  if (explicita && ['leve', 'media', 'haste', 'pesada', 'distancia', 'arremesso', 'arte'].includes(explicita)) {
    return explicita as ClasseArma;
  }
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
  if (fisicaDe(sistema) !== 'pgr') return 0;
  const r = C?.pgr?.preparo?.[classe];
  if (!r) return 0;
  const p = r.fixo != null ? r.fixo : velocidade + (r.daVelocidade || 0);
  return Math.max(0, Math.min(p, Math.max(0, velocidade - 1)));
}

/** O Preparo e o ciclo de uma Arte de grau N: sai no ÚLTIMO Tick da montagem. */
export function reguaDaArte(nivel: number, sistema: Sistema) {
  const a = C?.pgr?.arte || {};
  const ciclo = (a.cicloBase ?? 3) + (a.cicloPorNivel ?? 1) * nivel;
  const preparo = fisicaDe(sistema) === 'pgr' ? (a.preparoBase ?? 2) + (a.preparoPorNivel ?? 1) * nivel : 0;
  return { preparo, ciclo, golpe: 1, recuperacao: Math.max(0, ciclo - preparo - 1) };
}

/** O teto de golpes da rajada, por classe. Zero quer dizer "não pode". */
export function tetoDaRajada(classe: ClasseArma): number {
  return C?.rajada?.teto?.[classe] ?? 1;
}

/** Quantos Ticks o ciclo cresce ao golpear com as duas mãos, por sistema. */
export function cicloExtraDaDupla(classe: ClasseArma, sistema: Sistema): number {
  if (fisicaDe(sistema) !== 'pgr') return C?.dupla?.cicloExtraNoNormal ?? 0;
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
  /**
   * O P/G/R escrito à mão, quando o mestre discorda da régua. Aplicado DEPOIS
   * do cálculo, e por isso ele vale para qualquer manobra: quem escreve aqui
   * está dizendo "neste lance, esta ação demora isto", e o ciclo e a agenda se
   * refazem em volta do que ele escreveu.
   */
  pgr?: { preparo?: number; golpes?: number; recuperacao?: number } | null;
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
 * A anatomia com o P/G/R do mestre por cima, quando houver.
 *
 * Fica separada de `anatomia` porque o override é da MESA e não da régua: o
 * motor da bancada e os testes continuam medindo a régua limpa, e só a tela
 * passa por aqui. Os `offs` se refazem a partir do Preparo novo, e o ciclo é a
 * soma das três fases, para a fita não desenhar um buraco.
 */
export function comOverride(
  a: Anatomia, pgr?: { preparo?: number; golpes?: number; recuperacao?: number } | null,
): Anatomia {
  if (!pgr || (pgr.preparo == null && pgr.golpes == null && pgr.recuperacao == null)) return a;
  const preparo = Math.max(0, pgr.preparo ?? a.preparo);
  const golpes = Math.max(1, pgr.golpes ?? a.golpes);
  const recuperacao = Math.max(0, pgr.recuperacao ?? a.recuperacao);
  const penDados = Array.from({ length: golpes }, (_, i) => a.penDados[i] ?? a.penDados[a.penDados.length - 1] ?? 0);
  return {
    preparo, golpes, recuperacao, ciclo: preparo + golpes + recuperacao,
    offs: Array.from({ length: golpes }, (_, i) => preparo + i),
    penDados, aviso: a.aviso,
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
  const preparo = fisicaDe(sistema) === 'pgr' && quando === 'fim' ? vel - 1 : 0;
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

/**
 * QUAL GOLPE DA AGENDA é o que cai neste Tick.
 *
 * Zero para o primeiro, e é o número que escolhe a penalidade em `penDados`. A
 * conta é sobre os DESLOCAMENTOS (`offs`), e não sobre os Ticks absolutos, por
 * causa da re-projeção: quando a agenda desliza, os Ticks todos andam juntos e
 * a posição de cada golpe dentro da ação continua a mesma.
 *
 * Devolve 0 quando não dá para saber, que é o caminho da folha não adiada (uma
 * folha para a ação inteira) e o certo para ele: lá o campo do total é do
 * primeiro golpe, por desenho.
 */
export function golpeDaAgenda(acao: Acao | null | undefined, tick: number): number {
  const g = acao?.golpes;
  if (!g || !g.length) return 0;
  const i = g.indexOf(tick);
  return i >= 0 ? i : 0;
}

/**
 * A PENALIDADE DE DADOS deste golpe, pela régua.
 *
 * Existe para que a conferência possa comparar o que a mesa aplicou com o que o
 * `regras.json` manda, em vez de comparar a mesa com ela mesma: a igualdade
 * entre "qual golpe é" e "qual penalidade foi lida" prova consistência, e só
 * isto prova correção.
 */
export function penDadosDaRegua(an: Anatomia, indice: number): number {
  return an.penDados?.[indice] ?? 0;
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
  // A INVESTIDA NÃO COBRA AQUI, e isso é decisão e não esquecimento.
  //
  // Ela cobrou, entre 05/09/2026 e o mesmo dia. A escada lia `acao.mov.modo` e
  // trocava a guarda do Preparo pela da Corrida, e o número saía CERTO · −4, que
  // é o que a régua diz. O defeito era outro: a condição `investindo` do
  // catálogo cobra os mesmos −2 pelo caminho à mão, e as duas se somam sem se
  // conhecer, porque a `defesaEfetiva` empilha `condicoesDefesa` e
  // `defesaPerdida` como parcelas independentes. Quem declarava no Grid E ligava
  // a condição pagava −6, que nenhuma das quatro fontes da régua diz.
  //
  // E OS DOIS CAMINHOS, SOZINHOS, JÁ DAVAM O −4 CERTO, por aritméticas
  // diferentes: aqui a guarda da Corrida SUBSTITUÍA a do Preparo; na condição os
  // −2 dela SOMAM aos −2 do Preparo. Não eram duas cópias de um número, eram
  // duas contas caindo no mesmo total · e por isso não dava para "tirar a
  // cópia": tirar qualquer uma tirava um caminho inteiro de quem a usa. A aba
  // Combate não tem tela de modo de deslocamento nenhuma, então para ela a
  // condição não é redundância, é o único caminho.
  //
  // A MESA DECIDIU (05/09/2026) que o número mora num lugar só, na CONDIÇÃO, e
  // que quem passa a alimentá-la é o tabuleiro: declarar Investida no Grid
  // aplica `investindo` sozinho, e a varredura do Tick a tira quando o Preparo
  // acaba. Ver `marcarInvestida` no `grid.astro`. Assim a aba Combate continua
  // funcionando como sempre, o Grid não pede gesto nenhum, e a soma acontece uma
  // vez só.
  //
  // A RAZÃO DO NÚMERO continua sendo a guarda da Corrida (a Investida é uma
  // forma de aproximação, da mesma família), e o que a mantém escrita é a
  // asserção do `test-combate-tempo.mjs`: `escada.preparo + investida.defesaExtra`
  // tem de dar `corrida.defesa`. É ela que prende as duas maneiras de escrever o
  // mesmo número, agora que a condição carrega uma e a régua guarda a outra.
  if (fase === 'preparo') acaoDV = e.preparo ?? -2;
  else if (fase === 'golpe') acaoDV = (e.golpe ?? -4) + (opts.segura ? (e.alivioSegundaMao ?? 2) : 0);
  else if (fase === 'recuperacao') acaoDV = (e.recuperacaoPorGolpe ?? -2) * golpesDados(acao, tick);
  return { fase, acao: acaoDV, pressao, total: acaoDV + pressao };
}

/** Dá para interromper o gesto desta pessoa agora? Só no Preparo. */
export const podeSerInterrompido = (acao: Acao | null | undefined, tick: number) => faseEm(acao, tick) === 'preparo';

/*
 * A `podeAgirForaDeHora` MORREU AQUI, em 05/09/2026, e vale dizer por quê.
 *
 * Ela respondia "cabe agir fora da hora?" com um `pode` por fase, e a
 * `foraDeHora` abaixo passou a responder a MESMA pergunta com um `pode` que diz
 * o contrário em duas das quatro fases (livre e Preparo). As duas respostas
 * eram defensáveis · uma sobre a regra, outra sobre a transação · e é
 * exatamente essa a forma do defeito do `mordidos`: duas funções respondendo a
 * mesma pergunta, cada uma certa no seu sentido, e quem chama escolhendo sem
 * saber que escolheu.
 *
 * E não havia empate a desfazer: a `pode` dela não tinha um único chamador de
 * produção, e a frase `como` era lida por uma linha da `foraDeHora` que também
 * nunca chegava a lugar nenhum. As duas metades estavam mortas. O que a mesa lê
 * hoje é o `porque` da `foraDeHora`, que diz a mesma coisa no lugar em que
 * alguém olha.
 */

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

/**
 * AGIR FORA DA SUA VEZ · a conta fechada, do jeito que o `abortar` a devolve.
 *
 * A REGRA, escrita em `regras.json` (`combate.foraDeHora`): paga-se a Velocidade
 * da ação **empurrada para o próprio futuro**, a guarda não se refaz, e é uma
 * por ação. Quem interrompe alguém atrasa o alvo em tantos Ticks quantos pagou,
 * que é o espelho.
 *
 * AS DUAS METADES JÁ EXISTIAM E NÃO SE FALAVAM: `podeAgirForaDeHora` dizia se
 * cabe, `custoDeReagir` dizia quanto custa, as duas exportadas e testadas, e os
 * únicos chamadores eram os testes. Esta função é a transação, e é o que faltava
 * para haver o que uma tela chame.
 *
 * POR QUE ELA DIZ "NÃO" EM TRÊS DAS QUATRO FASES: a pergunta aqui é "há
 * transação a fazer?", e não "cabe agir?". Quem está **livre**
 * age na hora e não paga nada; quem está no **Preparo** tem o `abortar`, que é
 * outra conta e já tem botão. Sobra a **Recuperação**, que é onde a regra existe
 * de verdade: o golpe já saiu, você não pode mais desistir, só pagar.
 *
 * A DÍVIDA É O `resta`, E NÃO O `total`. `Acao.divida` diz, com estas palavras,
 * "Ticks que já foram empurrados para o futuro": são os que sobravam do ciclo
 * velho e não foram cumpridos. A Velocidade da reação não é dívida, é o preço
 * normal da ação nova · ela sairia igual se ele tivesse esperado.
 *
 * E É A DÍVIDA QUE CONTA O "UMA POR AÇÃO": ação que já nasceu devendo não paga
 * outra, e é isso que impede encadear reações. O campo já existia (declarado na
 * interface, zerado pelo `declarar`, documentado na migração 27) e **nunca foi
 * escrito com valor nenhum nem lido em lugar nenhum**: é o L25 em campo de dado.
 *
 * A leitura alternativa de "uma por ação" seria contar por ciclo em vez de por
 * ação encadeada, e as duas proíbem a mesma coisa na mesa (reagir duas vezes
 * seguidas). Trocar de leitura é mudar `jaUsou`, uma linha.
 */
export function foraDeHora(
  acao: Acao | null | undefined, tick: number, velocidadeDaReacao: number,
  opts: { alvo?: Acao | null } = {},
) {
  const F = C?.foraDeHora || {};
  const fase = faseEm(acao, tick);
  const vel = Math.max(0, Math.round(velocidadeDaReacao) || 0);
  const { resta, total } = custoDeReagir(acao, tick, vel);
  const jaUsou = F.umaPorAcao !== false && ((acao as Acao)?.divida || 0) > 0;
  const nao = (porque: string) => ({
    pode: false, fase, resta, velocidade: vel, total: 0,
    novoTick: tick, divida: 0, jaUsou, atrasaOAlvo: 0, porque,
  });
  if (fase === 'livre') return nao('Está livre: age na hora, e não paga nada por isso.');
  if (fase === 'golpe') return nao('Está no Golpe: não se aborta, não se reage, não se interrompe.');
  if (fase === 'preparo') {
    return nao('No Preparo o gesto ainda não saiu, e o que cabe é abortar: fica livre agora,'
      + ' perdendo os Ticks investidos, e só para mover, desviar ou se interpor.');
  }
  if (jaUsou) {
    return nao(`Esta ação já nasceu devendo ${(acao as Acao).divida} Tick(s), e é uma por ação:`
      + ' reagir de novo seria encadear reações sem nunca pagar nenhuma.');
  }
  // O ESPELHO: quem interrompe atrasa o alvo em tantos Ticks quantos pagou. Só
  // vale contra quem está em Preparo, que é a única fase interrompível, e é a
  // mesma frase que a aba Combate já mostrava sem ter como cumprir.
  const atrasaOAlvo = F.espelho !== false && opts.alvo && podeSerInterrompido(opts.alvo, tick)
    ? total : 0;
  return {
    pode: true, fase, resta, velocidade: vel, total,
    novoTick: tick + total, divida: resta, jaUsou: false, atrasaOAlvo, porque: '',
  };
}

/**
 * Empurrar um gesto inteiro N Ticks para a frente · o outro lado do espelho.
 *
 * O gesto ANDA JUNTO: os golpes agendados, o fim do ciclo e o que falta
 * resolver. Atrasar só o `livre` deixaria o golpe caindo na hora marcada com a
 * recuperação esticada, que é o contrário do que interromper quer dizer.
 *
 * `desde` NÃO anda: é o Tick em que a ação foi declarada, e continua sendo. É
 * ele que o `abortar` usa para contar o que se perde, e mexer nele faria o
 * interrompido "perder" Ticks que ele de fato investiu.
 */
export function atrasarGesto(acao: Acao, ticks: number): Acao {
  const n = Math.max(0, Math.round(ticks) || 0);
  if (!n) return acao;
  return {
    ...acao,
    golpes: (acao.golpes || []).map((g) => g + n),
    livre: acao.livre + n,
    ...(acao.aResolver ? { aResolver: acao.aResolver.map((g) => g + n) } : {}),
  };
}

/** Ticks que custa andar N metros durante a Recuperação (o deslocamento pago). */
export const ticksDeDeslocamento = (metros: number) =>
  Math.max(0, Math.round(metros * (C?.recuperacao?.deslocamentoTicksPorMetro ?? 2)));

// ------------------------------------------------------------ o simultâneo
/**
 * O que só o sistema simultâneo usa. A física é a do P/G/R; o que muda é o
 * relógio (um Tick por vez, decisão a cada Tick) e o deslocamento, que passa a
 * acontecer no mapa, passo a passo. Ver `Combate_Simultaneo.md`.
 */
const SIM = C?.simultaneo || {};

export const ehSimultaneo = (c: CombateMesa | null | undefined): boolean =>
  c?.sistema === 'simultaneo';

/**
 * A INVESTIDA, tirada do `regras.json` e não escrita aqui.
 *
 * `combate.movimento.investida`: `danoDados: 1` e `defesaExtra: -2`. A régua
 * estava escrita desde sempre, com número, no capítulo (§ Investida do
 * `combate.md`) e no catálogo de condições (`investindo`, Defesa −2), e o motor
 * não a conhecia: `ModoMov` tinha três modos e a palavra "investida" aparecia
 * uma vez no arquivo inteiro, dentro de um comentário.
 */
export const INVESTIDA = C?.movimento?.investida || {};

/**
 * A ESCADA de Defesa do P/G/R, tirada do `regras.json`.
 *
 * Exportada porque a trava das três escritas da Investida precisa dela: a
 * asserção que prende `defesaExtra` a `corrida.defesa` passa pelo `preparo`.
 */
export const ESCADA = C?.escada || {};

/**
 * A CORRIDA, e ela está aqui porque a Investida a lê.
 *
 * Quem investe gasta a guarda da Corrida (decisão de 05/09/2026), então o
 * `defesaPerdida` precisa deste número e não de um degrau próprio. Ver a
 * `defesaPerdida`.
 */
export const CORRIDA = C?.movimento?.corrida || {};

/** Os modos de andar, com o padrão de metros por Tick e a penalidade escrita. */
export type ModoMov = 'andar' | 'batalha' | 'corrida' | 'investida';
export const MODOS_MOV: { id: ModoMov; nome: string; porTick: number; nota: string }[] = [
  { id: 'andar', nome: 'Andar', porTick: SIM?.velocidadePadrao?.andar ?? 1.5,
    nota: 'passo de estrada, sem pressa e sem custo' },
  { id: 'batalha', nome: 'Deslocamento de Batalha', porTick: SIM?.velocidadePadrao?.batalha ?? 3,
    nota: 'a guarda de pé: sem penalidade nenhuma' },
  { id: 'corrida', nome: 'Corrida', porTick: SIM?.velocidadePadrao?.corrida ?? 6,
    nota: `Defesa ${CORRIDA.defesa ?? -4} enquanto corre e até se recompor` },
  // A INVESTIDA CORRE, e é por isso que o passo dela é o da Corrida: investir é
  // gastar o Preparo correndo em vez de andando, e não uma quarta velocidade.
  { id: 'investida', nome: 'Investida', porTick: SIM?.velocidadePadrao?.corrida ?? 6,
    nota: `Defesa ${CORRIDA.defesa ?? -4} no Preparo (a mesma da Corrida, e o tabuleiro `
      + `põe a condição sozinho), e +${INVESTIDA.danoDados ?? 1}d6 no golpe` },
];

/**
 * Este modo é uma corrida?
 *
 * A pergunta existe porque DOIS lugares precisam dela e nenhum dos dois é sobre
 * velocidade: o portão da travessia (`travessiaExigeCorrida`, cuja nota diz
 * "só para quem declarou Corrida ou Investida") e o passo da peça, que usa o
 * arranque nos dois. Escrever `modo === 'corrida'` nos dois lugares foi o que
 * deixou a Investida do lado de fora sem ninguém notar.
 */
export const modoCorre = (modo: ModoMov | string | null | undefined): boolean =>
  modo === 'corrida' || modo === 'investida';

/**
 * O deslocamento declarado, do jeito que mora dentro da `acao` (`acao.mov`).
 *
 * `alvo` OU `destino`: perseguir alguém é mirar a posição ATUAL dele a cada
 * Tick (e é isso que faz dois que avançam um no outro se encontrarem antes do
 * previsto, sem regra nenhuma escrita para isso); um ponto do chão fica parado.
 * `auto` desligado é a trajetória à mão: a intenção fica registrada e quem
 * anda a peça, Tick a Tick, é a mesa.
 */
export interface Mov {
  alvo?: string | null;
  destino?: { q: number; r: number } | null;
  modo: ModoMov;
  porTick: number;      // metros por Tick
  auto: boolean;
}

/**
 * O PASSO NO TICK DO GOLPE.
 *
 * A §14.6 dizia "no Golpe não se faz nada", e o motor plantava o pé ali. A mesa
 * reabriu com uma distinção que a régua não tinha: o problema nunca foi ANDAR,
 * foi andar PARA TRÁS. Medido em `scripts/sim-passo-golpe.mjs`, o passo livre
 * entregava o Tick a quem foge e custava 24% dos golpes de quem precisa colar;
 * restrito à direção do alvo ele mede idêntico ao pé plantado em todas as
 * baterias, inclusive contra o bate-e-corre.
 *
 * Duas formas, e a segunda é paga:
 *   `aproximar`  cobre os últimos metros e PARA no alcance. É o caso comum, e
 *                existe para o gesto não ir para o lixo por faltar um metro.
 *   `atravessar` a inércia de quem chega correndo: segue em linha reta e sai do
 *                outro lado. Só com Corrida ou Investida declarada, porque sem
 *                esse portão atravessar vira fuga disfarçada.
 */
const PNG = SIM?.passoNoGolpe || {};
export type PassoGolpe = 'nenhum' | 'aproximar' | 'atravessar';
export function passoDoGolpe(opts: {
  temAlvo: boolean; noAlcance: boolean; modo?: string | null;
}): PassoGolpe {
  if (!opts.temAlvo) return 'nenhum';
  if (!opts.noAlcance) return PNG.aproximar === false ? 'nenhum' : 'aproximar';
  // Já ao alcance: o único movimento que sobra é a travessia, e ela é da
  // Corrida. Quem chegou andando para no impacto.
  if (!PNG.travessia) return 'nenhum';
  // `modoCorre` E NÃO `=== 'corrida'`: a nota da regra diz "só para quem
  // declarou Corrida ou Investida", e o `!==` literal deixava a Investida de
  // fora · o que não fazia diferença enquanto o modo não existia, e passaria a
  // fazer no dia em que passasse a existir, calado.
  if (PNG.travessiaExigeCorrida && !modoCorre(opts.modo)) return 'nenhum';
  return 'atravessar';
}

/** Quantos Ticks a decisão leva para valer: declara em T, começa em T + este. */
export const decideEmValeDepois = (): number => SIM?.decideEmValeDepois ?? 1;

/** Ticks de viagem para cobrir `metros` andando `porTick` metros por Tick. */
export const ticksDeViagem = (metros: number, porTick: number): number =>
  metros <= 0 ? 0 : Math.ceil(metros / Math.max(0.1, porTick));

/**
 * A agenda do simultâneo: decidir é no Tick T, valer é de T+1 em diante, e o
 * deslocamento cabe DENTRO do Preparo — só o excedente atrasa o golpe.
 *
 * Os quatro números do exemplo que abriu a revisão saem daqui:
 *   martelo (P2) com 2 Ticks de viagem, declarado no 0 → golpe no 3;
 *   adaga (P0) com 1 Tick de viagem → golpe no 2;
 *   adaga já no alcance → golpe no 1 (o Tick 0 é só preparação);
 *   arco (P5) parado → flecha no 6.
 */
export function agendaSimultanea(
  tickDecl: number, a: Anatomia, ticksViagem = 0,
): { golpes: number[]; livre: number; inicio: number; atraso: number } {
  const inicio = tickDecl + decideEmValeDepois();
  const atraso = Math.max(0, ticksViagem - a.preparo);
  return {
    golpes: a.offs.map((o) => inicio + o + atraso),
    livre: inicio + a.ciclo + atraso,
    inicio, atraso,
  };
}

/**
 * A AGENDA RE-PROJETADA, no avanço, para quem ainda está a caminho.
 *
 * A agenda nasce na DECLARAÇÃO, e a declaração assume o alvo parado. Quando ele
 * sai de baixo, o atacante o persegue (a perseguição mira a posição atual), mas
 * o Tick do golpe continuava o de antes: o cartão vencia com o alvo ainda longe
 * e ficava pendurado até o mestre decidir o que fazer com um golpe que não
 * alcança nada. Aqui esse Tick é recalculado a cada avanço, pela distância que
 * SOBROU depois do passo deste Tick.
 *
 * SÓ ATRASA (decidido em 02/09). O golpe anda para frente e nunca para trás: o
 * Tick anunciado no log é o mais cedo que ele pode cair. Antecipar seria
 * defensável (quem chega antes do previsto podia bater antes), e foi recusado
 * porque mudaria debaixo da mesa um número que ela já leu; quem chega adiantado
 * espera, como sempre esperou.
 *
 * A conta é a da declaração, um Tick depois: faltando `v` Ticks de viagem, a
 * peça chega no fim do Tick `T + v` e o golpe cai no seguinte. Todos os golpes
 * ainda no ar andam juntos, porque a rajada é uma corrente de Ticks seguidos e
 * quebrá-la seria inventar uma pausa no meio dela; o fim do ciclo anda com eles.
 *
 * Sem teto de adiamento: enquanto a perseguição não fecha, o golpe desliza e o
 * log diz que deslizou. Quem desiste é a mesa, no abortar, e não o motor.
 *
 * Devolve `null` quando nada muda, que é o caso comum de quem está no rumo:
 * assim o avanço não gera escrita nenhuma no banco.
 */
export function reprojetarAgenda(
  acao: Acao | null | undefined, tick: number, viagemRestante: number,
): Acao | null {
  if (acaoVazia(acao)) return null;
  const a = acao as Acao;
  // O que ainda está no ar. A lista `aResolver` é a boa; sem ela (ação antiga,
  // ou golpe que nasceu já vencido) sobra olhar a agenda daqui para a frente.
  const noAr = golpesNoAr(a);
  const pendentes = noAr.length ? noAr : a.golpes.filter((g) => g >= tick);
  if (!pendentes.length) return null;
  const primeiro = Math.min(...pendentes);
  const cedoQuePode = tick + Math.max(0, viagemRestante) + 1;
  const atraso = cedoQuePode - primeiro;
  if (atraso <= 0) return null;
  const desloca = (g: number) => (g >= primeiro ? g + atraso : g);
  const nova: Acao = { ...a, golpes: a.golpes.map(desloca), livre: a.livre + atraso };
  if (noAr.length) nova.aResolver = noAr.map(desloca);
  return nova;
}

/**
 * Em quantos Ticks um alcança o outro, pela projeção de agora.
 *
 * `velAlvo` positivo se o alvo FOGE, negativo se ele vem ao encontro (e aí a
 * distância fecha com a soma das velocidades: é o P1 e o Orc 1 se encontrando
 * um Tick antes do que qualquer um faria sozinho). `null` = nunca alcança com
 * essas velocidades, que é o aviso que a tela dá antes de alguém declarar uma
 * perseguição perdida.
 */
export function previsaoDeEncontro(
  distM: number, minhaVelM: number, velAlvoM: number, alcanceM = 1,
): number | null {
  const falta = distM - alcanceM;
  if (falta <= 0) return 0;
  const fecha = minhaVelM - velAlvoM;
  if (fecha <= 0) return null;
  return Math.ceil(falta / fecha);
}

/**
 * O modo automático de uma criatura: a decisão de um Tick, sem mesa.
 *
 * De propósito é só isto — atacar o inimigo de pé mais próximo, fugir com a
 * Vida abaixo do limiar — porque a heurística existe para a horda andar
 * sozinha, não para jogar bem. O mestre desliga por peça e retoma o controle;
 * é a escolha registrada em `Combate_Simultaneo.md` §2.1.
 */
export function decisaoAutomatica(
  eu: { id: string; pvPct: number | null; pos: { q: number; r: number } | null },
  inimigos: { id: string; pos: { q: number; r: number } | null }[],
  distancia: (a: { q: number; r: number }, b: { q: number; r: number }) => number,
  /**
   * O LIMIAR DE FUGA, injetável. Sem ele vale o do `regras.json`, que é o que a
   * mesa usa e nunca passa este argumento.
   *
   * Ele existe para a bateria poder medir a SENSIBILIDADE da carga a um valor
   * que já é do produto, em vez de inventar políticas novas: o limiar decide
   * quando a cena vira perseguição, e a perseguição é metade do que a bateria
   * mede. Um parâmetro que muda o desfecho de sete em cada dez batalhas não
   * pode ficar fora da leitura só porque tem um padrão escrito.
   */
  opts: { limiarFugaPct?: number } = {},
): { tipo: 'atacar' | 'fugir' | 'nada'; alvo: string | null } {
  const deAlcance = inimigos.filter((i) => i.pos && eu.pos);
  if (!deAlcance.length || !eu.pos) return { tipo: 'nada', alvo: null };
  const maisPerto = deAlcance.reduce((m, i) =>
    (distancia(eu.pos!, i.pos!) < distancia(eu.pos!, m.pos!) ? i : m));
  const limiar = opts.limiarFugaPct ?? SIM?.ia?.fugirAbaixoDePct ?? 25;
  if (eu.pvPct != null && eu.pvPct < limiar) return { tipo: 'fugir', alvo: maisPerto.id };
  return { tipo: 'atacar', alvo: maisPerto.id };
}

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
