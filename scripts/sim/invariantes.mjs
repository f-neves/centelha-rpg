// invariantes.mjs · o que tem de valer em toda batalha.
//
// NÃO SÃO OS QUINZE DA R3 §3.1, e o critério de escolha é este: entram os que
// pegam erro de MOTOR (o laço, que é código novo) e os que pegam erro de
// INSTRUMENTO (o log, que é onde uma métrica errada nasce plausível). Ficam de
// fora os que pegam erro de REGRA, porque a regra vem de módulos com teste
// próprio e agora também com espelho.
//
// Conferidos EM MEMÓRIA, sobre o estado que o laço já tem (P §0.8.7): a
// violação não grava nada na hora, marca a batalha e sai na mesma gravação do
// fim. E a batalha que viola vai para um balde próprio e NÃO ENTRA EM MÉDIA
// NENHUMA, porque uma batalha inválida na média é pior que uma batalha a menos.

import { TETO_TICKS } from './motor.mjs';
import { CLASSES } from './log.mjs';

export function conferir(cena, log, res) {
  const e = log.est;
  const falhas = [];

  // V1 · CONSERVAÇÃO DA VIDA. Ninguém tem Vida negativa, e ninguém curou.
  for (const c of cena.pecas) {
    if (c.pv < 0) falhas.push(`${c.id} com Vida ${c.pv}`);
    if (c.pv > c.pvMax) falhas.push(`${c.id} com Vida ${c.pv} acima do máximo ${c.pvMax}`);
  }

  // V2 · A AGENDA É MONOTÔNICA. Nenhuma ação ficou com o `livre` antes do
  // último golpe dela.
  for (const c of cena.pecas) {
    if (!c.acao) continue;
    const g = c.acao.golpes || [];
    if (g.length && c.acao.livre < Math.max(...g)) {
      falhas.push(`${c.id}: livre ${c.acao.livre} antes do último golpe ${Math.max(...g)}`);
    }
  }

  // V3 · TODO DANO TEM UM DECL ANCESTRAL. É o V15 da R3, e o que impede o tempo
  // morto de virar ficção plausível: um `aid` perdido na re-projeção produz
  // tempos menores e perfeitamente críveis.
  if (e.golpesAplicados > 0 && e.tempoMorto.length + e.tempoMortoViagem.length === 0) {
    falhas.push('golpes aplicados sem nenhum decl ancestral: o aid não sobreviveu');
  }

  // V4 · O ÍNDICE DO GOLPE BATE COM A PENALIDADE LIDA. Nasce do conserto do L11.
  //   (conferido no motor, na montagem da entrada: os dois saem do mesmo `idx`.
  //    Aqui fica o registro de que ele existe e de onde ele mora.)

  // V5 · O TETO NÃO FOI ESTOURADO SEM MOTIVO.
  if (res.fim === 'estourou' && res.ticks < TETO_TICKS) {
    falhas.push(`marcada como estourada com ${res.ticks} Ticks`);
  }

  // ---------------------------------------------------------------------
  // OS DE INSTRUMENTO. Eles não olham o jogo: olham se o que foi MEDIDO pode
  // ser verdade. Existem porque a rodada anterior publicou uma tabela em que
  // `paradas/Tick 1,14`, `86% de Ticks vazios` e `pico 4` não cabiam juntos, e
  // ninguém percebeu até a aritmética não fechar na revisão. Um invariante
  // barato teria pego na primeira batalha.

  // V6 · O QUADRO FECHA. As quatro células da partição somam os Ticks.
  const q = e.quadro;
  const somaQ = q.nada + q.soResolveu + q.soParou + q.ambos;
  if (somaQ !== e.ticks) {
    falhas.push(`o quadro soma ${somaQ} e a batalha tem ${e.ticks} Ticks`);
  }

  // V7 · AS DUAS MARGINAIS BATEM COM O QUADRO. `ticksSemParada` é a linha de
  // cima e `ticksSemResolucao` é a coluna da esquerda: se alguma delas parar de
  // ser isso, uma das duas está medindo outra coisa (que foi o defeito).
  if (e.ticksSemParada !== q.nada + q.soResolveu) {
    falhas.push(`ticksSemParada ${e.ticksSemParada} ≠ nada+soResolveu ${q.nada + q.soResolveu}`);
  }
  if (e.ticksSemResolucao !== q.nada + q.soParou) {
    falhas.push(`ticksSemResolucao ${e.ticksSemResolucao} ≠ nada+soParou ${q.nada + q.soParou}`);
  }

  // V8 · O TOTAL DE PARADAS BATE COM A SOMA POR TICK. As duas contas saem de
  // lugares diferentes (`est.paradas` por classe, `porTick` por Tick), e é
  // justamente esse tipo de par que divergiu antes.
  const porTick = e.porTick.reduce((a, b) => a + b, 0);
  const porClasse = e.paradas.i + e.paradas.ii + e.paradas.iii;
  if (porTick !== porClasse) {
    falhas.push(`paradas: ${porClasse} por classe e ${porTick} por Tick`);
  }

  // V9 · E COM A SOMA POR SUBTIPO. Fecha o triângulo: classe, Tick e subtipo
  // têm de contar a mesma coisa, senão a banda do relatório (que sai do
  // subtipo) mede um universo e a fração (que sai da classe) mede outro.
  const porSub = Object.values(e.paradasSub).reduce((a, b) => a + b, 0);
  if (porSub !== porClasse) {
    falhas.push(`paradas: ${porClasse} por classe e ${porSub} por subtipo`);
  }

  // V10 · O PICO NÃO PASSA DO TETO TEÓRICO. Cada peça de pé produz no máximo
  // uma declaração (com a agenda junto) e um golpe (com o aplicar junto) por
  // Tick: quatro paradas por peça. Passar disso é o laço declarando ou
  // resolvendo duas vezes, que foi um dos defeitos que o espelho achou na mesa.
  const teto = cena.pecas.length * 4;
  const pico = Math.max(0, ...e.porTick);
  if (pico > teto) falhas.push(`pico de ${pico} paradas num Tick, acima do teto ${teto}`);

  // V11 · O TEMPO MORTO NÃO É NEGATIVO. Um golpe que cai antes da declaração
  // que o pediu é `aid` trocado, e o número sai pequeno e crível.
  if (e.tempoMorto.some((x) => x < 0) || e.tempoMortoViagem.some((x) => x < 0)) {
    falhas.push('tempo morto negativo: o golpe caiu antes da declaração');
  }

  // V12 · TODO GOLPE APLICADO TEM VEREDITO. Um golpe contado sem veredito é um
  // golpe que passou pela contagem e não pela régua.
  const vs = e.vereditos;
  const somaV = (vs.acerto || 0) + (vs.raspao || 0) + (vs.erro || 0);
  if (somaV !== e.golpesAplicados) {
    falhas.push(`${e.golpesAplicados} golpes e ${somaV} vereditos`);
  }

  // V13 · OS GESTOS FECHAM POR CLASSE. Toda ação de entrada do mestre é ou o
  // clique do ⏭ ou o gesto de uma parada de alguma classe: não há terceira
  // origem. Este invariante existe porque a fração de gestos por classe é agora
  // um número PUBLICADO, e um numerador que não pertence a nenhuma classe (ou
  // que pertence a duas) produziria uma fração menor e perfeitamente crível.
  const gc = e.gestosClasse;
  const somaG = gc.i + gc.ii + gc.iii + e.gestosRelogio;
  if (somaG !== e.gestos) {
    falhas.push(`gestos: ${e.gestos} no total e ${somaG} por classe mais relógio`);
  }

  // V14 · E POR SUBTIPO. O mesmo triângulo do V9, na outra moeda: a tabela "de
  // onde vêm os gestos" sai do subtipo e a fração publicada sai da classe, e as
  // duas têm de estar contando o mesmo universo.
  const gSub = Object.values(e.gestosSub).reduce((a, b) => a + b, 0);
  if (gSub !== e.gestos - e.gestosRelogio) {
    falhas.push(`gestos de parada: ${e.gestos - e.gestosRelogio} por classe e ${gSub} por subtipo`);
  }

  // V15 · TODA PARADA TEM CLASSE, E ELA É UMA DAS TRÊS. O `classeDoTipo` é
  // escrito pelo motor a cada parada e é o que o agregador publica na coluna
  // "classe" da tabela por tipo. Um tipo sem classe, ou com classe fora do
  // vocabulário, não pode ser carimbado por padrão: carimbo por padrão foi
  // exatamente o que produziu o mapa a mão que dizia `fugir` classe i e
  // `aplicar` classe iii. Aqui ele falha alto, na primeira batalha.
  for (const [tipo, classe] of Object.entries(e.classeDoTipo || {})) {
    if (!CLASSES.includes(classe)) {
      falhas.push(`parada '${tipo}' com classe ${JSON.stringify(classe)}, fora de {i, ii, iii}`);
    }
  }
  for (const tipo of Object.keys(e.paradasSub || {})) {
    if (!e.classeDoTipo?.[tipo]) falhas.push(`parada '${tipo}' contada sem classe registrada`);
  }

  return falhas;
}
