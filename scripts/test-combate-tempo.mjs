// test-combate-tempo.mjs — a régua dos dois sistemas, travada.
//
// `src/lib/combate-tempo.ts` é o que a mesa usa para desenhar o tempo: em que
// Tick o golpe sai, em que fase alguém está, quanto de Defesa a fase custa. O
// motor da bancada (`scripts/lib-tempo.mjs`) mede a MESMA régua, mas por outro
// caminho e para outro fim, e nada obrigava os dois a concordarem.
//
// Aqui obriga. O teste confere três coisas:
//
//   1. a anatomia (P/G/R) bate com a tabela do catálogo da bancada, arma a arma;
//   2. a escada devolve os números da §14.11 em cada fase;
//   3. o sistema normal degenera como prometido: Preparo 0, Golpe no Tick da
//      declaração, o resto Recuperação, e a dupla no mesmo ciclo em toda classe.
//
// Depois cresceu para o resto das réguas que a mesa usa e ninguém guardava: a
// ENTRADA na linha de Ticks pela iniciativa (`derivados.iniciativa`) e as
// FAIXAS DE DISTÂNCIA (`combate.alcance`, com a régua do `Arremesso.md`).
//
// Entra no `npm run validate`: é barato e trava o contrato.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const tmp = [];
async function carregar(rel) {
  const saida = path.join(os.tmpdir(), `${path.basename(rel, '.ts')}-${process.pid}.mjs`);
  await build({
    entryPoints: [path.join(ROOT, rel)],
    outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error',
  });
  tmp.push(saida);
  return import(pathToFileURL(saida).href);
}

const T = await carregar('src/lib/combate-tempo.ts');
const regras = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const armas = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/armas.json'), 'utf8'));

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m} — esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);

// ------------------------------------------------- 0. o bloco existe e fecha
ok(regras.combate, 'regras.json não tem o bloco `combate`');
eq(regras.combate.sistemas.map((s) => s.id), ['normal', 'pgr', 'simultaneo'], 'os três sistemas');
eq(regras.combate.marcacao.modos.map((m) => m.id), ['fita', 'numeros'], 'os dois modos de marcação');
for (const c of ['leve', 'media', 'haste', 'pesada', 'distancia', 'arremesso']) {
  ok(regras.combate.pgr.preparo[c], `a régua P/G/R não cobre a classe ${c}`);
  ok(regras.combate.rajada.teto[c] != null || c === 'distancia' || c === 'arremesso',
    `o teto da rajada não cobre a classe ${c}`);
}

// ------------------------------------------------------------ 1. a anatomia
// P/G/R por classe, com a Velocidade que o catálogo dá. É a tabela da §14.3.
const ESPERADO = {
  'adaga':             [0, 1, 4],  // leve, 5t
  'espada-curta':      [0, 1, 4],
  'desarmado':         [0, 1, 4],
  'espada-longa':      [1, 1, 4],  // média, 6t
  'machado':           [1, 1, 4],
  'lanca':             [2, 1, 3],  // haste, 6t
  'alabarda':          [2, 1, 3],
  'montante':          [2, 1, 4],  // pesada, 7t
  'martelo-de-guerra': [2, 1, 4],
  'arco-longo':        [5, 1, 0],  // distância: P = Velocidade − 1
  'besta-grande':      [6, 1, 0],
  'azagaia':           [3, 1, 1],  // arremesso: P = Velocidade − 2
  'dardos':            [2, 1, 1],
};
for (const [id, esp] of Object.entries(ESPERADO)) {
  const w = armas.find((x) => x.id === id);
  ok(w, `arma ${id} sumiu do catálogo`);
  if (!w) continue;
  const a = T.anatomia({ classe: w.classe, velocidade: w.ticks, sistema: 'pgr' });
  eq([a.preparo, a.golpes, a.recuperacao], esp, `P/G/R de ${id}`);
  eq(a.ciclo, w.ticks, `o ciclo de ${id} tem que ser a Velocidade dela`);
  eq(a.preparo + a.golpes + a.recuperacao, a.ciclo, `P+G+R de ${id} não fecha o ciclo`);
}

// toda arma do catálogo fecha o ciclo, não só as listadas acima
for (const w of armas) {
  const a = T.anatomia({ classe: w.classe, velocidade: w.ticks, sistema: 'pgr' });
  eq(a.preparo + a.golpes + a.recuperacao, w.ticks, `P+G+R de ${w.id} não fecha o ciclo`);
  ok(a.preparo < w.ticks, `o Preparo de ${w.id} come o ciclo inteiro`);
}

// ------------------------------------------------- 2. a rajada e a dupla
// §14.12: a rajada é +2 de Velocidade e −1d6 acumulativo por golpe extra.
const raj = T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr', manobra: 'rajada', golpes: 3 });
eq([raj.preparo, raj.golpes, raj.recuperacao, raj.ciclo], [0, 3, 6, 9], 'rajada de 3 com arma leve');
eq(raj.penDados, [0, -1, -2], 'os dados da rajada de 3');
eq(raj.offs, [0, 1, 2], 'a agenda da rajada: Golpes em Ticks seguidos');
const rajTeto = T.anatomia({ classe: 'pesada', velocidade: 7, sistema: 'pgr', manobra: 'rajada', golpes: 3 });
eq(rajTeto.golpes, 2, 'a arma pesada para em 2 golpes');
ok(rajTeto.aviso, 'estourar o teto tem que avisar');
const rajArco = T.anatomia({ classe: 'distancia', velocidade: 6, sistema: 'pgr', manobra: 'rajada', golpes: 2 });
eq(rajArco.golpes, 1, 'a rajada é só corpo a corpo');

// §14.13: a dupla dá um Tick de Golpe por mão, −1d6 nas duas.
const dupLeve = T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr', manobra: 'dupla' });
eq([dupLeve.preparo, dupLeve.golpes, dupLeve.recuperacao, dupLeve.ciclo], [0, 2, 3, 5], 'dupla de leves: o ciclo não muda');
eq(dupLeve.penDados, [-1, -1], 'os dados da dupla');
const dupMedia = T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr', manobra: 'dupla' });
eq(dupMedia.ciclo, 7, 'dupla com média no P/G/R: ciclo +1');
eq(T.anatomia({ classe: 'media', velocidade: 6, sistema: 'normal', manobra: 'dupla' }).ciclo, 6,
  'dupla com média no normal: mesma Velocidade (§15.2, a única regra que calibra por sistema)');

// ------------------------------------------------------------ 3. a escada
// §14.11: Preparo −2 · Golpe −4 · Recuperação −2 por golpe dado, mais a Pressão.
{
  const a = T.declarar(10, T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr' }));
  eq([a.golpes, a.livre], [[11], 16], 'a agenda da espada longa declarada no Tick 10');
  eq(T.faseEm(a, 10), 'preparo', 'Tick 10 é Preparo');
  eq(T.faseEm(a, 11), 'golpe', 'Tick 11 é Golpe');
  eq(T.faseEm(a, 12), 'recuperacao', 'Tick 12 é Recuperação');
  eq(T.faseEm(a, 16), 'livre', 'Tick 16 já é livre');
  eq(T.defesaPerdida(a, 10).total, -2, 'a escada no Preparo');
  eq(T.defesaPerdida(a, 11).total, -4, 'a escada no Golpe');
  eq(T.defesaPerdida(a, 12).total, -2, 'a escada na Recuperação de um golpe');
  eq(T.defesaPerdida(a, 16).total, 0, 'livre não custa nada');
  eq(T.defesaPerdida(a, 11, { segura: true }).total, -2, 'segurar a segunda arma sem golpear alivia o Golpe');
  eq(T.defesaPerdida({ ...a, pressao: 3 }, 12).total, -8, 'a Pressão soma: −2 na Recuperação, −6 de três ataques');
  eq(T.podeSerInterrompido(a, 10), true, 'o Preparo é interrompível');
  eq(T.podeSerInterrompido(a, 11), false, 'o Golpe não é');
  eq(T.custoDeReagir(a, 12, 5), { resta: 4, total: 9 }, 'o custo de reagir na Recuperação');
}
// ---------------------------------------------------------- agir fora de hora
//
// A TRANSAÇÃO, e não só a metade dela. `custoDeReagir` já estava escrita,
// exportada e testada, e o único chamador era a linha acima: era o L25 em
// estado puro. A irmã dela, `podeAgirForaDeHora`, foi embora em 05/09 · ela
// respondia a MESMA pergunta que a `foraDeHora` com outro `pode`, e nenhuma
// das duas metades tinha chamador de produção.
{
  const a = T.declarar(10, T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr' }));
  // Preparo 10, Golpe 11, Recuperação 12..15, livre em 16.
  eq(T.foraDeHora(a, 16, 5).pode, false, 'livre não é fora de hora: age na hora e não paga');
  eq(T.foraDeHora(a, 11, 5).pode, false, 'no Golpe não se reage');
  eq(T.foraDeHora(a, 10, 5).pode, false, 'no Preparo o que cabe é abortar, e ele tem botão próprio');
  ok(/abortar/.test(T.foraDeHora(a, 10, 5).porque), 'e a recusa do Preparo manda para o abortar');

  const r = T.foraDeHora(a, 12, 5);
  eq(r.pode, true, 'na Recuperação se reage, pagando');
  eq({ resta: r.resta, velocidade: r.velocidade, total: r.total },
    { resta: 4, velocidade: 5, total: 9 }, 'a conta: 4 do ciclo que sobrava mais 5 da reação');
  eq(r.novoTick, 21, 'e ele fica livre no Tick 12 + 9');
  // A DÍVIDA É O `resta`: os Ticks empurrados para o futuro são os do ciclo
  // velho que não foram cumpridos. A Velocidade da reação não é dívida, é o
  // preço normal da ação nova.
  eq(r.divida, 4, 'a dívida é o que sobrava do ciclo, e não o total');

  // UMA POR AÇÃO, e quem conta é a própria dívida.
  const devendo = { ...a, divida: 4, livre: 21, golpes: [17] };
  eq(T.foraDeHora(devendo, 18, 5).pode, false, 'ação que já nasceu devendo não paga outra');
  eq(T.foraDeHora(devendo, 18, 5).jaUsou, true, 'e o motivo é a dívida, não a fase');
  eq(T.foraDeHora({ ...devendo, divida: 0 }, 18, 5).pode, true,
    'e sem dívida a mesma peça, na mesma fase e no mesmo Tick, pode');
}
// ------------------------------------------------------------------ a Investida
//
// A REGRA TINHA TRES METADES E O MOTOR NAO TINHA NENHUMA. Estava escrita com
// numero em `combate.movimento.investida` (`danoDados: 1`, `defesaExtra: -2`),
// na tabela do capitulo e no catalogo de condicoes, e o `ModoMov` do motor tinha
// tres modos: a palavra "investida" aparecia UMA vez no arquivo inteiro, dentro
// de um comentario sobre travessia.
{
  const corrida = T.MODOS_MOV.find((m) => m.id === 'corrida');
  const inv = T.MODOS_MOV.find((m) => m.id === 'investida');
  ok(inv, 'a Investida e um modo de deslocamento');
  eq(inv.porTick, corrida.porTick,
    'e corre: o passo dela e o da Corrida, porque investir e gastar o Preparo correndo');

  // O PREDICADO, e ele existe porque DOIS lugares perguntavam `=== 'corrida'`.
  eq(['andar', 'batalha', 'corrida', 'investida'].map(T.modoCorre), [false, false, true, true],
    'quem corre: a Corrida e a Investida');

  // A DEFESA. A regra, decidida em 05/09/2026: QUEM INVESTE GASTA A GUARDA DA
  // CORRIDA, e so no Preparo. Investir e uma forma de aproximacao, da mesma
  // familia da Corrida, e quem corre para cima do outro perde guarda pelo mesmo
  // motivo. O numero e o mesmo que a soma antiga dava, e a razao e outra.
  const base = T.declarar(10, T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr' }));
  const inv6 = { ...base, mov: { modo: 'investida', porTick: 6, auto: true } };
  const cor6 = { ...base, mov: { modo: 'corrida', porTick: 6, auto: true } };
  eq(T.defesaPerdida(base, 10).total, -2, 'o Preparo andando custa o -2 de sempre');
  eq(T.defesaPerdida(inv6, 10).total, T.CORRIDA.defesa,
    `e investindo custa a guarda da Corrida (${T.CORRIDA.defesa})`);
  // A TRAVA DAS TRES ESCRITAS, e ela e a razao de esta linha existir. O numero
  // esta escrito A MAO em TRES arquivos que nenhum gerador liga: o
  // `defesaExtra` do `regras.json`, a tabela do capitulo e a nota da condicao
  // `investindo`. Eles concordam porque foram digitados na mesma sentada, e a
  // conta abaixo e o que os prende: mexer na Corrida ou no Preparo sem mexer no
  // `defesaExtra` para aqui, em vez de deixar dois textos mentindo em silencio.
  eq((T.ESCADA.preparo ?? -2) + (T.INVESTIDA.defesaExtra ?? -2), T.CORRIDA.defesa,
    'e as duas maneiras de escrever o mesmo numero continuam batendo '
    + `(preparo ${T.ESCADA.preparo} + extra ${T.INVESTIDA.defesaExtra} = corrida ${T.CORRIDA.defesa})`);
  eq(T.defesaPerdida(cor6, 10).total, -2,
    'e a Corrida declarada NAO mexe na escada: o -4 dela e da condicao, e nao desta conta');
  // O PAR QUE FAZ A ASSERCAO VALER: se o -2 vazasse para as outras fases, a
  // Investida viraria uma penalidade de acao inteira, que e outra regra.
  eq([T.defesaPerdida(inv6, 11).total, T.defesaPerdida(inv6, 12).total],
    [T.defesaPerdida(base, 11).total, T.defesaPerdida(base, 12).total],
    'e no Golpe e na Recuperacao a Investida nao cobra nada a mais');

  // A TRAVESSIA. A nota da regra diz "so para quem declarou Corrida ou
  // Investida", e o portao comparava com a palavra `corrida` e mais nada.
  const passo = (modo) => T.passoDoGolpe({ temAlvo: true, noAlcance: true, modo });
  eq(passo('corrida'), 'atravessar', 'quem chega correndo atravessa');
  eq(passo('investida'), 'atravessar', 'e quem chega investindo tambem, que e o que a nota diz');
  eq(passo('batalha'), 'nenhum', 'e quem chega andando para no impacto');
}

// o espelho: interromper atrasa o alvo em tantos Ticks quantos o interruptor pagou
{
  const meu = T.declarar(10, T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr' }));
  const alvo = T.declarar(12, T.anatomia({ classe: 'pesada', velocidade: 7, sistema: 'pgr' }));
  // O alvo declarou no 12: Preparo até o 14, Golpe no 15.
  eq(T.faseEm(alvo, 13), 'preparo', 'o alvo está montando o gesto');
  eq(T.foraDeHora(meu, 13, 5, { alvo }).atrasaOAlvo, 8,
    'interromper quem está em Preparo atrasa o alvo pelo que o interruptor pagou (3 + 5)');
  eq(T.foraDeHora(meu, 13, 5, { alvo: null }).atrasaOAlvo, 0, 'sem alvo, não há espelho');
  eq(T.foraDeHora(meu, 13, 5, { alvo: { ...alvo, golpes: [13], livre: 19 } }).atrasaOAlvo, 0,
    'e quem está no Golpe não é interrompível: o espelho não morde');

  // O OUTRO LADO: o gesto atrasado anda INTEIRO, e o `desde` fica.
  const atrasado = T.atrasarGesto(alvo, 8);
  eq(atrasado.golpes, alvo.golpes.map((g) => g + 8), 'os golpes agendados andam junto');
  eq(atrasado.livre, alvo.livre + 8, 'e o fim do ciclo também');
  eq(atrasado.desde, alvo.desde, 'e o `desde` NÃO anda: é quando ele declarou, e continua sendo');
  eq(T.atrasarGesto(alvo, 0), alvo, 'atrasar zero devolve a mesma ação');
}
// a Recuperação da dupla conta os DOIS golpes
{
  const a = T.declarar(0, T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr', manobra: 'dupla' }));
  eq(a.golpes, [0, 1], 'a dupla golpeia em dois Ticks seguidos');
  eq(T.defesaPerdida(a, 0).total, -4, 'o primeiro Golpe da dupla');
  eq(T.defesaPerdida(a, 1).total, -4, 'o segundo Golpe da dupla');
  eq(T.defesaPerdida(a, 2).total, -4, 'a Recuperação da dupla conta os dois golpes');
}
// a rajada não vira Recuperação no meio dela
{
  const a = T.declarar(0, T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr', manobra: 'rajada', golpes: 3 }));
  eq([0, 1, 2, 3].map((t) => T.faseEm(a, t)), ['golpe', 'golpe', 'golpe', 'recuperacao'], 'as fases da rajada de 3');
  eq(T.defesaPerdida(a, 3).total, -6, 'a Recuperação da rajada de 3: −2 por golpe dado');
}

// ------------------------------------------------------------ 3b. o abortar
// §14.6: só no Preparo, perdendo os Ticks investidos, e só para mover, desviar
// ou se interpor. 1 Tick por metro, o preço do desvio de emergência da §5.5.
{
  // martelo (pesada, 7t): declara no 10, Preparo 10-11, Golpe 12, Recuperação 13-16
  const a = T.declarar(10, T.anatomia({ classe: 'pesada', velocidade: 7, sistema: 'pgr' }));
  eq([a.desde, a.golpes, a.livre], [10, [12], 17], 'a agenda do martelo declarado no Tick 10');

  const noAto = T.abortar(a, 10, 0);
  eq([noAto.pode, noAto.perdidos, noAto.custo, noAto.novoTick], [true, 0, 0, 10],
    'abortar no mesmo Tick da declaração não perde nada');

  const tarde = T.abortar(a, 11, 0);
  eq([tarde.pode, tarde.perdidos, tarde.novoTick, tarde.devolvidos], [true, 1, 11, 6],
    'abortar no segundo Tick de Preparo perde 1 Tick e devolve 6 do ciclo');

  const fugindo = T.abortar(a, 11, 3);
  eq([fugindo.custo, fugindo.novoTick], [3, 14], 'recuar 3 m ao abortar custa 3 Ticks (1 por metro)');

  eq(T.abortar(a, 12, 0).pode, false, 'no Golpe não se aborta');
  ok(/braço/.test(T.abortar(a, 12, 0).porque), 'e o motivo é dito');
  eq(T.abortar(a, 13, 0).pode, false, 'na Recuperação não há o que abortar');
  ok(new RegExp(`${regras.combate.recuperacao.deslocamentoTicksPorMetro} Tick`).test(T.abortar(a, 13, 0).porque), 'e a Recuperação aponta o que cabe nela');
  eq(T.abortar(a, 17, 0).pode, false, 'quem está livre não tem gesto para abortar');
  eq(T.abortar(null, 3, 0).pode, false, 'sem ação nenhuma, não há abortar');

  // Quem tem Preparo 0 nunca pode abortar, e é o preço de ser rápido: a leve
  // já está golpeando no Tick em que declara.
  const leve = T.declarar(4, T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr' }));
  eq(T.abortar(leve, 4, 0).pode, false, 'a arma leve não tem Preparo para abortar');

  // O arqueiro é o caso que a regra existe para socorrer: Recuperação 0, e
  // portanto cinco Ticks de Preparo em que a única saída é desistir.
  const arco = T.declarar(0, T.anatomia({ classe: 'distancia', velocidade: 6, sistema: 'pgr' }));
  eq([0, 1, 2, 3, 4].every((t) => T.abortar(arco, t, 0).pode), true,
    'o arqueiro pode abortar em qualquer Tick da mira');
  eq(T.abortar(arco, 4, 0).perdidos, 4, 'e perde os quatro Ticks que já investiu');
}
// no sistema normal ninguém aborta: não existe Preparo para desistir
for (const w of armas) {
  const a = T.declarar(3, T.anatomia({ classe: w.classe, velocidade: w.ticks, sistema: 'normal' }));
  eq(T.abortar(a, 3, 0).pode, false, `no sistema normal ${w.id} não tem o que abortar`);
}

// --------------------------- 3c. a Pressão sozinha, sem gesto nenhum
// Guarda sob pressão é a regra mais antiga do capítulo IX: −2 por ataque
// recebido, acumulando até você agir. Quem apanha SEM ter ação declarada não
// tem agenda de golpe, e mesmo assim está com a guarda aberta. Isto vive aqui
// porque já quebrou uma vez: a ação `{golpes: [], pressao: 3}` contava como
// vazia, e a Pressão era gravada no banco e nunca mais lida.
{
  const so = { golpes: [], livre: 0, pressao: 3 };
  eq(T.acaoVazia(so), false, 'uma ação que carrega Pressão NÃO é vazia');
  eq(T.temGesto(so), false, 'mas ela também não é um gesto no ar');
  eq(T.faseEm(so, 0), 'livre', 'quem só apanhou está livre (preso a gesto nenhum)');
  eq(T.faseEm(so, 9), 'livre', 'e continua livre em qualquer Tick, sem virar Recuperação');
  eq(T.defesaPerdida(so, 0).total, -6, 'três ataques recebidos abrem a guarda em −6');
  eq(T.defesaPerdida(so, 0).acao, 0, 'sem gesto, nada da escada da ação');
  eq(T.podeSerInterrompido(so, 0), false, 'e não há gesto para interromper');
  eq(T.abortar(so, 0).pode, false, 'nem para abortar');

  eq(T.acaoVazia({}), true, 'ação vazia continua vazia');
  eq(T.acaoVazia({ golpes: [], livre: 0, pressao: 0 }), true, 'e Pressão zero também');
  eq(T.acaoVazia(null), true, 'e null também');

  // Pressão MAIS gesto: as duas se somam, que é o caso do martelo apanhando
  // enquanto monta o golpe.
  const ambos = T.declarar(0, T.anatomia({ classe: 'pesada', velocidade: 7, sistema: 'pgr' }));
  ambos.pressao = 2;
  eq(T.defesaPerdida(ambos, 0).total, -6, 'Preparo −2 mais dois ataques recebidos −4');
  eq(T.defesaPerdida(ambos, 2).total, -8, 'e no Tick do Golpe, −4 mais os mesmos −4');
  eq(T.temGesto(ambos), true, 'e isso continua sendo um gesto no ar');
}

// -------------------------------------- 4. o sistema normal degenera direito
for (const w of armas) {
  eq(T.preparoDe(w.classe, w.ticks, 'normal'), 0, `no sistema normal ${w.id} não tem Preparo`);
  const a = T.declarar(7, T.anatomia({ classe: w.classe, velocidade: w.ticks, sistema: 'normal' }));
  eq(a.golpes, [7], `no normal o golpe de ${w.id} cai no Tick da declaração`);
  eq(T.faseEm(a, 7), 'golpe', `no normal ${w.id} está em Golpe no Tick da declaração`);
  eq(T.faseEm(a, 8), 'recuperacao', `no normal o resto do ciclo de ${w.id} é Recuperação`);
}
eq(T.faseEm(null, 3), 'livre', 'sem ação declarada, todo mundo está livre');
eq(T.defesaPerdida(null, 3).total, 0, 'sem ação declarada não se perde Defesa');
eq(T.fita(null, 4, 3).map((c) => c.fase), ['livre', 'livre', 'livre'], 'a fita de quem está livre');

// ---------------------------------------------------- 5. a Arte, e a mesa
{
  const g6 = T.reguaDaArte(6, 'pgr');
  eq([g6.preparo, g6.ciclo], [8, 9], 'Arte de grau 6: Preparo 8, ciclo 9 (§5.3 do Arcano)');
  eq(T.reguaDaArte(6, 'normal').preparo, 0, 'no sistema normal a Arte também resolve no primeiro Tick');
}
eq(T.combateDaMesa(null),
  { sistema: 'normal', marcacao: 'fita', rolagem: 'mesa', golpeAdiado: false },
  'a mesa sem escolha usa o padrão');
eq(T.combateDaMesa({ combate: { sistema: 'pgr' } }),
  { sistema: 'pgr', marcacao: 'fita', rolagem: 'mesa', golpeAdiado: false },
  'a escolha da mesa se sobrepõe ao padrão, campo a campo');

// -------------------------------------------- 5b. o golpe que sai depois
//
// A chave nasce DESLIGADA, e enquanto estiver desligada nada nas ações muda:
// `aResolver` não existe, e a mesa de sempre continua sendo a mesa de sempre.
// Este bloco trava as duas metades: que o desligado é mesmo o antigo, e que o
// ligado agenda, cobra e some na ordem certa.
{
  eq(T.COMBATE_PADRAO.golpeAdiado, false, 'o golpe adiado nasce desligado');

  // Só vale no P/G/R: no sistema normal o Preparo é zero em toda classe, e
  // adiar pediria à mesa um segundo clique para confirmar o que ela acabou de
  // declarar.
  eq(T.adiaGolpe({ sistema: 'pgr', golpeAdiado: true }), true, 'ligado no P/G/R, adia');
  eq(T.adiaGolpe({ sistema: 'normal', golpeAdiado: true }), false,
    'ligado no sistema normal, não adia: lá o golpe já cai na declaração');
  eq(T.adiaGolpe({ sistema: 'pgr', golpeAdiado: false }), false, 'desligado, não adia');
  eq(T.adiaGolpe(null), false, 'e sem mesa nenhuma também não');

  // A espada longa (média, 6 Ticks) declara no 1 e bate no 2.
  const espada = T.declarar(1, T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr' }));
  eq(espada.golpes, [2], 'espada longa declarada no Tick 1: o golpe cai no 2');
  eq(T.golpesNoAr(espada), [], 'a ação declarada sem agendar não deve golpe nenhum');

  const ag = T.agendar(espada, 1);
  eq(T.golpesNoAr(ag), [2], 'agendada, ela deve o golpe do Tick 2');
  eq(T.proximoGolpe(ag), 2, 'e o próximo golpe dela é esse');
  eq(T.golpeDevido(ag, 1), null, 'no Tick da declaração ainda não venceu nada');
  eq(T.golpeDevido(ag, 2), 2, 'no Tick do Golpe ele vence');
  // Um golpe esquecido não evapora: continua devendo nos Ticks seguintes, e é
  // por isso que a faixa consegue marcá-lo como atrasado em vez de perdê-lo.
  eq(T.golpeDevido(ag, 5), 2, 'e continua devendo depois, se a mesa não o resolveu');

  const dep = T.golpeResolvido(ag, 2);
  eq(T.golpesNoAr(dep), [], 'resolvido, sai da agenda');
  eq(dep.golpes, [2], 'mas a agenda de golpes fica: ela é história, e a fita a desenha');
  eq(T.faseEm(dep, 3), 'recuperacao', 'e a fase continua saindo de `golpes`, e não de `aResolver`');

  // A ARMA LEVE NÃO PENDURA NADA. Preparo zero quer dizer que o golpe cai no
  // mesmo Tick da declaração, e agendar pediria à mesa que confirmasse o que ela
  // acabou de decidir.
  const adaga = T.declarar(3, T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr' }));
  eq(adaga.golpes, [3], 'a adaga bate no Tick em que declara');
  eq(T.golpesNoAr(T.agendar(adaga, 3)), [],
    'e por isso agendá-la não pendura nada: ela resolve na hora, como sempre');

  // A EMPUNHADURA DUPLA DEVE DOIS, e cada um sai por si: são duas resoluções
  // contra a guarda de dois instantes diferentes.
  const duas = T.agendar(
    T.declarar(0, T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr', manobra: 'dupla' })), 0);
  eq(T.golpesNoAr(duas).length, 2, 'a empunhadura dupla deve dois golpes');
  eq(T.golpesNoAr(T.golpeResolvido(duas, T.golpesNoAr(duas)[0])).length, 1,
    'e resolver o primeiro deixa o segundo no ar');

  // No sistema normal a arma média também tem Preparo zero, então nem lá o
  // agendamento pega: a degeneração elegante do motor vale aqui também.
  const normal = T.declarar(0, T.anatomia({ classe: 'media', velocidade: 6, sistema: 'normal' }));
  eq(T.golpesNoAr(T.agendar(normal, 0)), [],
    'no sistema normal nada fica no ar: o golpe cai no Tick da declaração');
}

// O padrão dos dados é a mesa rolando: o site só rola onde a mesa pedir, e uma
// mesa antiga (sem a chave) não pode começar a rolar sozinha depois de um deploy.
eq(T.COMBATE_PADRAO.rolagem, 'mesa', 'e o padrão dos dados é ninguém rolar no site');
eq([T.rolaNoSite('mesa', false), T.rolaNoSite('mesa', true)], [false, false], 'no modo mesa o site não rola nada');
eq([T.rolaNoSite('site', false), T.rolaNoSite('site', true)], [true, true], 'no modo site ele rola tudo');
eq([T.rolaNoSite('misto', false), T.rolaNoSite('misto', true)], [true, false],
  'no misto a criatura rola sozinha e o personagem não');
// A ENTRADA NA LINHA DE TICKS, pela iniciativa.
// A regua (`derivados.iniciativa`): o maior entra SOZINHO no Tick 1, e os
// demais um Tick depois por degrau de 6 pontos, arredondando para cima. O
// exemplo da mesa: 13, 12, 10, 9 e 5 -> 1, 2, 2, 2 e 3.
{
  const e = T.ticksDeEntrada([13, 12, 10, 9, 5]);
  eq(e.map((x) => x.tick), [1, 2, 2, 2, 3], 'o maior entra sozinho no Tick 1, e os degraus sao de 6');
  eq(e.map((x) => x.penDados), [0, -1, -1, -1, -2], 'e cada degrau custa 1d6 de contrape');
  // As bordas do degrau: 6 atras ainda e o primeiro degrau, 7 ja e o segundo.
  eq(T.ticksDeEntrada([18, 12, 11, 6, 5, 2]).map((x) => x.tick), [1, 2, 3, 3, 4, 4],
    'a borda do degrau cai no lugar certo (6 atras ainda e o primeiro)');
  eq(T.ticksDeEntrada([12, 12, 10]).map((x) => x.tick), [1, 1, 2],
    'empate no topo: os dois entram juntos no Tick 1');
  eq(T.ticksDeEntrada([]).length, 0, 'cena vazia nao quebra');
  eq(T.ticksDeEntrada([7]).map((x) => x.tick), [1], 'sozinho em cena, entra no Tick 1');
  // O teto: a iniciativa vai de 2 a 18, entao o vao maximo e 16 e ninguem
  // NUNCA entra depois do Tick 4. E o que faz o degrau de 6 ser seguro.
  eq(T.ticksDeEntrada([18, 2]).map((x) => x.tick), [1, 4], 'o pior atraso possivel para no Tick 4');
}

// A ORDEM DA FILA, com o desempate por Raciocinio que a regra manda fazer.
// O que isto guarda: as duas telas escreviam o mesmo comparador, e as duas
// pulavam o Raciocinio, caindo direto num criterio de estabilidade (a hora em
// que a peca entrou no mapa) que nao e regra de coisa nenhuma.
{
  const fila = (xs) => xs.slice().sort(T.ordemDaFila).map((x) => x.nome);
  eq(fila([
    { nome: 'tarde', tick: 5, iniciativa: 20 },
    { nome: 'cedo', tick: 2, iniciativa: 3 },
  ]), ['cedo', 'tarde'], 'o Tick manda em tudo: iniciativa alta nao adianta a vez');
  eq(fila([
    { nome: 'baixa', tick: 2, iniciativa: 8 },
    { nome: 'alta', tick: 2, iniciativa: 15 },
  ]), ['alta', 'baixa'], 'dentro do Tick, a maior iniciativa age primeiro');
  // O caso que ninguem cobria: iniciativa IGUAL, e o Raciocinio decide. A
  // ordem de chegada e a INVERSA de proposito, para provar que foi o
  // Raciocinio que mandou, e nao o criterio de reserva.
  eq(fila([
    { nome: 'lerdo', tick: 2, iniciativa: 12, raciocinio: 2, chegada: 'a' },
    { nome: 'esperto', tick: 2, iniciativa: 12, raciocinio: 5, chegada: 'b' },
  ]), ['esperto', 'lerdo'], 'iniciativa igual: o maior Raciocinio age primeiro');
  // E sem Raciocinio nenhum, o criterio de reserva volta a valer.
  eq(fila([
    { nome: 'depois', tick: 2, iniciativa: 12, chegada: 'b' },
    { nome: 'antes', tick: 2, iniciativa: 12, chegada: 'a' },
  ]), ['antes', 'depois'], 'sem Raciocinio, decide a ordem de chegada');
  // Quem a mesa nao conhece fica ATRAS de quem tem o numero, e nao empata com
  // Raciocinio 0: o figurante de cena nao ganha a vez por omissao.
  eq(fila([
    { nome: 'figurante', tick: 2, iniciativa: 12, chegada: 'a' },
    { nome: 'com ficha', tick: 2, iniciativa: 12, raciocinio: 0, chegada: 'b' },
  ]), ['com ficha', 'figurante'], 'Raciocinio ausente perde para Raciocinio zero');
}

// GOLPES NO MESMO INSTANTE: os dois estao abertos, e nao so quem declarou
// primeiro. Sem isto, num duelo de adagas quem o mestre resolve por ultimo
// vence 97% das vezes.
{
  // Adaga contra adaga (Preparo 0), os dois agindo no Tick 4.
  eq(T.faseDeQuemVaiAgir(4, 0, 4), 'golpe', 'quem age agora com Preparo 0 ja esta no Golpe');
  // Arma media (Preparo 1) agindo no 4: no 4 esta montando, no 5 e que bate.
  eq(T.faseDeQuemVaiAgir(4, 1, 4), 'preparo', 'com Preparo 1, no Tick da declaracao ele so montou');
  eq(T.faseDeQuemVaiAgir(4, 1, 5), 'golpe', 'e o golpe dele cai um Tick depois');
  // Fora da janela do gesto dele, nada se presume.
  eq(T.faseDeQuemVaiAgir(4, 1, 6), 'livre', 'depois do golpe dele nao ha o que presumir');
  eq(T.faseDeQuemVaiAgir(6, 0, 4), 'livre', 'e quem so age depois esta com a guarda inteira');
  // A fase forcada entra na escada como qualquer outra.
  const dv = T.defesaPerdida(null, 4, { fase: 'golpe' });
  eq([dv.fase, dv.total], ['golpe', -4], 'a fase presumida cobra o mesmo que a declarada');
}

// O CONTRAPE DECAI COM O RELOGIO, e nao com o que a pessoa faz.
{
  const a = { contrape: -2, contrapeDesde: 3 };
  eq([3, 4, 5, 6].map((t) => T.contrapeEm(a, t)), [-2, -1, 0, 0],
    'cada Tick de espera devolve 1d6, e ele para em zero');
  eq(T.contrapeEm({}, 9), 0, 'sem contrape, nao ha o que descontar');
  eq(T.contrapeEm(a, 1), -2, 'antes da hora dele, o contrape e o cheio');
  eq(T.contrapeAcaba(a), 5, 'e da para dizer em que Tick ele acaba');
  eq(T.contrapeAcaba({}), null, 'quem nao tem contrape nao tem prazo');
  // Ele atravessa a declaracao: nao se compra a limpeza gastando um Tick.
  eq(T.contrapeDe(a), { contrape: -2, contrapeDesde: 3 }, 'o contrape e carregado para a acao nova');
  eq(T.contrapeDe({ golpes: [4], livre: 9 }), {}, 'e quem nao tem nao carrega nada');
  const nova = T.declarar(4, T.anatomiaLivre(5, 'agora', 'pgr'), T.contrapeDe(a));
  eq(T.contrapeEm(nova, 4), -1, 'declarar no Tick 4 preserva o contrape ja decaido');
}

// A acao que a regua nao previu: derrubar a estante, arrombar a porta.
{
  const ag = T.anatomiaLivre(5, 'agora', 'pgr');
  eq([ag.preparo, ag.offs[0], ag.recuperacao, ag.ciclo], [0, 0, 4, 5],
    'a acao livre que resolve agora: Preparo 0, o resto e Recuperacao');
  const fim = T.anatomiaLivre(5, 'fim', 'pgr');
  eq([fim.preparo, fim.offs[0], fim.recuperacao, fim.ciclo], [4, 4, 0, 5],
    'e a que resolve no fim telegrafa o caminho inteiro, como a Arte');
  eq(T.anatomiaLivre(5, 'fim', 'normal').preparo, 0,
    'no sistema normal as duas colapsam: la nada telegrafa');
  eq(T.anatomiaLivre(0, 'agora', 'pgr').ciclo, 1, 'e ninguem gasta menos de 1 Tick');
}
eq(T.classeDaArma('espada-longa'), 'media', 'a classe sai do id');
eq(T.classeDaArma('Espada Longa'), 'media', 'e também do nome, que é o que a mesa guarda');
eq(T.classeDaArma(null), 'leve', 'sem arma, o punho é rápido');
eq(T.velocidadeDaArma('martelo-de-guerra'), 7, 'a Velocidade sai do catálogo');

// ------------------------------------------------------- 6. a distância
// A régua do `Arremesso.md`: o que se corta em quatro não é o alcance total, é
// o que SOBRA entre o livre e o máximo. É isso que faz a mesma regra servir ao
// dardo (vão minúsculo, quase todo o alcance é bom) e ao machado (vão enorme,
// ele chega muito além de onde ainda acerta).
const AL = await carregar('src/lib/alcance.ts');
{
  ok(regras.combate.alcance, 'regras.json não tem o bloco `combate.alcance`');
  eq([AL.HEX_CORPO_A_CORPO, AL.HEX_HASTE], [1, 2], 'o braço alcança o vizinho; a haste, o vizinho do vizinho');
  eq([AL.alcancaNoCorpoACorpo(1, false), AL.alcancaNoCorpoACorpo(2, false)], [true, false],
    'a dois hexágonos a espada não chega');
  eq([AL.alcancaNoCorpoACorpo(2, true), AL.alcancaNoCorpoACorpo(3, true)], [true, false],
    'e a haste chega a dois, e não a três');

  // Arco curto: máximo 120, livre 1/3 = 40. Sobram 80, em quatro de 20.
  const a = AL.alcanceDaArma('arco-curto');
  eq([a.livre, a.max], [40, 120], 'o alcance livre é a fração que a arma declara');
  const f = (m) => { const x = AL.faixaDeDistancia('arco-curto', m); return [x.faixa, x.pen, x.alem]; };
  eq(f(10), [0, 0, false], 'dentro do livre a distância não conta para nada');
  eq(f(40), [0, 0, false], 'e o limite do livre ainda é livre');
  eq(f(41), [1, -3, false], 'o primeiro metro além do livre já é a primeira faixa');
  eq(f(60), [1, -3, false], 'a faixa vai até o fim do quarto');
  eq(f(61), [2, -6, false], 'e o quarto seguinte custa o dobro');
  eq(f(120), [4, -12, false], 'no limite do máximo, a última faixa');
  eq(f(121)[2], true, 'passou do máximo: não chega, e não há jogada a fazer');
  ok(AL.faixaDeDistancia('espada-longa', 30) === null,
    'arma sem alcance no catálogo não inventa faixa (o arremesso depende de quem joga)');
}

for (const f of tmp) { try { fs.unlinkSync(f); } catch {} }
if (falhas.length) {
  console.error(`\n✘ combate-tempo: ${falhas.length} falha(s)\n` + falhas.map((f) => '  · ' + f).join('\n'));
  process.exit(1);
}
console.log('✓ combate-tempo: a régua dos dois sistemas bate com o catálogo e com a §14.11,'
  + ' a iniciativa distribui os Ticks de entrada e a distância cai nas quatro faixas');
