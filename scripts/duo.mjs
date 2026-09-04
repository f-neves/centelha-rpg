// duo.mjs · o revezamento automático entre a executora e a revisora.
//
// Alterna chamadas `claude -p` em duas pastas, uma rodada de cada vez, sem
// humano no meio. O canal entre as duas continua sendo `docs/simulacao/caixa/`:
// este script não passa contexto de uma para a outra, ele só as chama na ordem
// certa, move o commit e conta o dinheiro.
//
//   npm run duo                      · o ciclo com os padrões
//   npm run duo -- --rodadas 3       · teto de rodadas
//   npm run duo -- --custo 12        · teto de custo, em dólares
//   npm run duo -- --timeout 20      · teto por chamada, em minutos
//   npm run duo -- --seco            · imprime o que faria e não chama nada
//   npm run duo -- --fumaca          · UMA chamada real mínima em cada lado
//   npm run duo -- --alvo "..."      · o alvo da execução, escrito pelo humano
//   npm run duo -- --zerar "..."     · zera o acumulado do assunto, e SÓ isso
//
// O PONTO DESTE SCRIPT SÃO AS TRAVAS, e não a automação. Duas instâncias do
// mesmo modelo conversando sem ninguém no meio convergem para concordar, e
// concordar de graça é caro: sai commit, sai relatório e não sai resposta. Todas
// as paradas abaixo são de fechar, e nenhuma é de "avisar e continuar".
//
//   teto de rodadas    · o ciclo acaba, mesmo indo bem
//   teto de custo      · o ciclo acaba, mesmo com rodada sobrando
//   veredito PARA      · encerra na hora
//   SEGUE duas vezes   · revisão esgotada, encerra
//   ESCALA não vazia   · precisa do humano, encerra na hora
//   assunto repetido   · duas voltas sem convergir não convergem em cinco
//   árvore suja        · encerra em qualquer ponto
//   chamada que falha  · encerra, e NÃO tenta de novo
//
// Saia como sair, sai um `RESUMO-NN.md` na caixa. É a única coisa que o humano
// vai ler.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as GASTO from './duo-gasto.mjs';
import { ilegivel, secao, dizNada, temConteudo, veredito, repetidos } from './duo-leitura.mjs';

// ============================================================ as duas pastas
const EXEC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REV = path.resolve(EXEC, '..', 'centelha-revisora');
const CAIXA = path.join(EXEC, 'docs', 'simulacao', 'caixa');
/**
 * O PAPEL DA REVISORA, e o script confere que ele existe antes de CADA checkout.
 *
 * O motivo não é zelo: o checkout sobrescreve caminho rastreado sem perguntar, e
 * o papel dela já foi escrito uma vez por cima do `CLAUDE.md` da raiz, que é o do
 * projeto e é versionado. Se este arquivo sumir, a revisora abre a rodada sem
 * papel nenhum e revisa como uma instância qualquer: sem as vigilâncias, sem o
 * formato da resposta e sem a trava de regra de jogo. O ciclo continuaria
 * rodando e produzindo texto plausível, que é o pior jeito de falhar.
 */
const PAPEL = path.join(REV, '.claude', 'CLAUDE.local.md');

// ================================================================ os limites
const arg = (n, p) => {
  const i = process.argv.indexOf(n);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : p;
};
const SECO = process.argv.includes('--seco');
/**
 * A FUMAÇA: uma chamada real mínima em cada lado, prompt trivial, e mais nada.
 *
 * O `--seco` prova o caminho das DECISÕES sem chamar processo nenhum, e por isso
 * a classe inteira de falha de invocação é invisível para ele: a primeira
 * execução molhada morreu na primeira chamada com o prompt partido pelo shell, e
 * o seco tinha passado limpo minutos antes. A fumaça prova o caminho do PROCESSO
 * (o `claude` é achado, o stdin chega, a saída é JSON, o custo é lido) nos dois
 * worktrees, por centavos. Nenhum dos dois substitui o outro, e a fumaça é o
 * passo anterior a toda execução molhada.
 */
const FUMACA = process.argv.includes('--fumaca');

/** Teto de rodadas. Seis é o padrão pedido; ao bater, para e resume. */
const TETO_RODADAS = parseInt(arg('--rodadas', '6'), 10);
/**
 * TETO DE CUSTO, EM DÓLARES. Escolhido em 25, e o número vem de medição.
 *
 * A rodada 02, que tratou dois BLOQUEIA, custou US$ 12,89 (executora 9,48,
 * revisora 3,41). Uma rodada pesada é isso; vinte e cinco compra duas.
 *
 * E A CONFERÊNCIA É POR CHAMADA, e não por rodada. Era por rodada, com uma
 * previsão baseada na rodada anterior mais cara, e na PRIMEIRA rodada não há
 * anterior: a estimativa de partida era US$ 4, a rodada custou 12,89 contra um
 * teto de 8, e nada acendeu. Conferir só na porta da rodada seguinte é conferir
 * depois de gastar.
 *
 * O que a versão por rodada protegia continua protegido, e está nas três linhas
 * de `conferirCusto`: um aviso commitado SEMPRE tem revisão. Estourar entre a
 * executora e a revisora paga a revisora daquela rodada, fecha o ciclo e não abre
 * a seguinte; parar no meio deixaria um aviso na caixa que ninguém revisou, que é
 * pior que gastar os três dólares da revisora.
 *
 * ERRAR PARA BAIXO É O LADO CERTO: parar cedo custa uma rodada e um `--custo`
 * maior na próxima execução; parar tarde custa dinheiro que ninguém autorizou. E
 * o RESUMO diz que a parada foi por custo, então a informação não se perde.
 */
const TETO_CUSTO = parseFloat(arg('--custo', '25'));
/**
 * ZERAR O ACUMULADO DO ASSUNTO. É um ato do humano, e nunca do script.
 *
 * `--zerar "<motivo>"` grava o registro em zero, commita, e SAI: não roda ciclo
 * nenhum. Ser um comando separado é de propósito. Se zerar fosse efeito colateral
 * de rodar (uma flag `--assunto` que reinicia quando o nome muda, por exemplo),
 * um erro de digitação zeraria o teto sem ninguém notar, e o teto por assunto
 * valeria tanto quanto o teto por execução que ele veio substituir.
 *
 * O nome do assunto vem do `--alvo`, que já é a frase do humano sobre o que a
 * frente está fazendo.
 */
const ZERAR = arg('--zerar', '');
/**
 * O ALVO DA EXECUÇÃO, escrito pelo humano, em uma frase.
 *
 * É o único lugar por onde a direção do humano entra no laço. A caixa é o canal
 * entre executora e revisora; o `--alvo` é o canal entre o humano e a executora, e
 * existe porque o pedido padrão ("faça a próxima rodada") deixa a escolha do que
 * fazer com quem está dentro do ciclo, e foi assim que a rodada 02 saiu inteira em
 * instrumento e nenhuma medição nova. Vai no prompt da executora, sai impresso no
 * diário e entra no RESUMO, para que o ciclo possa ser julgado contra o que foi
 * pedido, e não contra o que ele resolveu fazer.
 */
const ALVO = arg('--alvo', '');

/** Teto por chamada, em minutos. A executora roda bateria (30 s) e escreve. */
const TETO_MIN = parseInt(arg('--timeout', '30'), 10);
/**
 * A SEMELHANÇA que conta como "mesmo assunto" entre duas respostas seguidas.
 *
 * É heurística, e assumida como tal: comparar assunto por texto não tem jeito
 * exato. Ela olha os IDENTIFICADORES de cada item (o que vem entre crases e as
 * seções `§x.y`), que é o sinal forte, e cai para a interseção de palavras
 * quando não há identificador. O limiar erra para o lado de PARAR, que é o lado
 * barato: um falso positivo custa uma rodada, um falso negativo custa o ciclo
 * inteiro girando no mesmo ponto.
 */
const MODELO_CHAMADA = arg('--model', '');

// =================================================================== o básico
const git = (dir, c) => execSync(`git ${c}`, { cwd: dir, encoding: 'utf8' }).trim();
const limpa = (dir) => git(dir, 'status --porcelain') === '';
const registro = [];
const anote = (t) => { registro.push(t); console.log(t); };

/** Os NN de aviso que já existem na caixa. */
const avisos = () => fs.readdirSync(CAIXA)
  .map((f) => /^(\d{2})-executora\.md$/.exec(f)).filter(Boolean)
  .map((m) => m[1]).sort();

let custo = 0;
let custoDaRodada = [];
/**
 * O QUE JÁ FOI GASTO NESTE ASSUNTO, antes desta execução.
 *
 * O teto é conferido contra `gastoAnterior + custo`, e não contra `custo`. Sem
 * isso o teto reinicia a cada `npm run duo` e dez execuções seguidas passam por
 * baixo dele sem nada acender.
 */
let registroGasto = null;
let gastoAnterior = 0;
/** Estourou o teto no meio de uma rodada? A rodada fecha, e não abre a seguinte. */
let estourouNoMeio = null;
/**
 * CHAMADAS CUJO CUSTO NÃO DÁ PARA LER, e que NÃO valem zero.
 *
 * A rodada 03 morreu por limite de uso depois de rodar duas baterias, mexer em
 * cinco arquivos e commitar. Custo real: alto. O RESUMO publicou **US$ 0,00**,
 * porque uma chamada que falha devolve zero e zero entra na soma como se fosse
 * medida. É o zero ambíguo dentro do contador de dinheiro: "não gastou" e "não
 * consegui ler quanto gastou" saíam com o mesmo número.
 *
 * O teto continua sendo conferido contra a soma do que deu para ler, que é o
 * único número que existe. O que muda é que o RESUMO não afirma um total quando
 * há chamada sem leitura: ele diz que o total é um PISO, e quantas chamadas
 * ficaram de fora.
 */
let chamadasSemCusto = 0;

/**
 * O ACUMULADO DEPOIS DE CADA CHAMADA, contra o teto, sempre impresso.
 *
 * Devolve `true` se o teto já foi passado. Quem chama decide o que fazer com
 * isso, e a decisão nunca é "abandonar a rodada no meio".
 */
function conferirCusto(quem) {
  const total = gastoAnterior + custo;
  const passou = total > TETO_CUSTO;
  anote(`  ✓ ${quem} · esta execução US$ ${custo.toFixed(2)}`
    + ` · o assunto US$ ${total.toFixed(2)} de US$ ${TETO_CUSTO.toFixed(2)}`
    + `${passou ? ' ■ PASSOU DO TETO' : ''}`);
  return passou;
}

/**
 * Uma chamada headless.
 *
 * `--permission-mode bypassPermissions` é obrigatório num laço sem humano: sem
 * ele a chamada trava no primeiro `git commit` esperando um "sim" que ninguém vai
 * dar, e o timeout a mata sem nada feito. É a linha mais perigosa deste arquivo,
 * e está escrita no README da caixa como tal.
 */
function chamar(dir, quem, prompt) {
  return new Promise((resolve) => {
    if (SECO) {
      console.log(`\n  [seco] ${quem} em ${path.basename(dir)}:\n${prompt.split('\n').map((l) => `    | ${l}`).join('\n')}`);
      return resolve({ ok: true, custo: 0, texto: '(seco)' });
    }
    // O PROMPT VAI PELO STDIN, E NUNCA COMO ARGUMENTO. A primeira execução
    // molhada morreu na primeira chamada por isto: com `shell: true` (que o
    // Windows exige para achar o `claude.cmd`) o argumento é concatenado sem
    // escape, o prompt inteiro é partido nos espaços e cortado na primeira quebra
    // de linha, e o CLI recebeu "Ao" como prompt e o resto como flags inválidas.
    // A saída não era JSON e o ciclo parou, corretamente, sem gastar nada. O
    // `--seco` não pegaria nunca, porque ele não chama o processo. Pelo stdin o
    // texto chega inteiro, com crase, aspas e quebra de linha, e os argumentos
    // ficam sendo só as flags fixas, que não têm nada para o shell mastigar.
    const args = ['-p', '--output-format', 'json', '--permission-mode', 'bypassPermissions'];
    if (MODELO_CHAMADA) args.push('--model', MODELO_CHAMADA);
    const p = spawn('claude', args, { cwd: dir, shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
    p.stdin.on('error', () => {});
    p.stdin.end(prompt);
    let saida = '', erro = '';
    const relogio = setTimeout(() => {
      p.kill('SIGKILL');
      resolve({ ok: false, custo: 0, custoIncerto: true, texto: '', motivo: `estourou ${TETO_MIN} min` });
    }, TETO_MIN * 60_000);
    p.stdout.on('data', (d) => { saida += d; });
    p.stderr.on('data', (d) => { erro += d; });
    p.on('close', (code) => {
      clearTimeout(relogio);
      if (code !== 0) {
        // O MOTIVO LÊ OS DOIS CANOS, E O IMPORTANTE É O STDOUT.
        //
        // A rodada 03 morreu assim e o RESUMO saiu com "saiu com 1: " e nada
        // depois dos dois-pontos: o motivo só citava o stderr, e o stderr estava
        // vazio. A razão da morte ("You've hit your session limit") tinha sido
        // escrita no STDOUT, junto com a resposta, e o script a jogou fora. Ficou
        // um ciclo encerrado sem causa legível, com uma hora de trabalho feito e
        // commitado na árvore, e a causa só apareceu abrindo o transcrito da
        // sessão à mão.
        //
        // É a mesma família do princípio: um diagnóstico vazio não quer dizer
        // "não havia diagnóstico", quer dizer que ninguém olhou onde ele estava.
        const dois = [erro.trim() && `stderr: ${erro.trim().slice(0, 400)}`,
          saida.trim() && `stdout: ${saida.trim().slice(-400)}`].filter(Boolean).join(' · ');
        return resolve({ ok: false, custo: 0, custoIncerto: true, texto: saida,
          motivo: `saiu com ${code}${dois ? `: ${dois}` : ', e não escreveu nada em stdout nem em stderr'}` });
      }
      try {
        const j = JSON.parse(saida);
        // O nome do campo de custo já mudou de versão para versão; ler os três
        // é mais barato que descobrir isso com o teto de custo desligado.
        //
        // E CUSTO AUSENTE NÃO É CUSTO ZERO. A versão da estreia caía em `?? 0`, e
        // isso é a ausência de sinal lida como sinal favorável na trava que
        // guarda o dinheiro: se o CLI mudasse o nome do campo, cada chamada
        // entraria de graça na conta e o teto de custo nunca acenderia. Sem o
        // campo, a chamada é tratada como falha de leitura e o ciclo encerra.
        const c = j.total_cost_usd ?? j.cost_usd ?? j.usage?.total_cost_usd;
        if (c == null || Number.isNaN(Number(c))) {
          return resolve({ ok: false, custo: 0, custoIncerto: true, texto: j.result || '',
            motivo: 'a saída não traz o custo da chamada (total_cost_usd), e sem ele o'
              + ' teto de custo não tem como valer' });
        }
        // A saída real (conferida em 04/09 com uma chamada de US$ 0,34) traz
        // `subtype: "success"`, `is_error` e `total_cost_usd`. Os dois sinais de
        // erro são lidos, porque ler um só é apostar em qual deles o CLI mantém.
        resolve({ ok: j.subtype !== 'error' && !j.is_error, custo: Number(c), texto: j.result || '' });
      } catch {
        // A SAÍDA CRUA VAI NO MOTIVO. Sem ela, "não era JSON" obriga a reproduzir
        // a chamada para saber o que veio, e reproduzir custa uma chamada.
        const amostra = (saida || erro || '(vazia)').replace(/\s+/g, ' ').slice(0, 400);
        resolve({ ok: false, custo: 0, texto: saida,
          motivo: `saída não era JSON. Os primeiros 400 caracteres: ${amostra}` });
      }
    });
  });
}

// ==================================================================== o resumo
function resumo(nn, motivo, aberto) {
  const arq = path.join(CAIXA, `RESUMO-${nn}.md`);
  const txt = `# Resumo do ciclo · até a rodada ${nn}

## MOTIVO DA PARADA

${motivo}

## O QUE FOI RESOLVIDO

${registro.filter((l) => l.startsWith('  ✓')).join('\n') || '(nada: o ciclo parou antes de fechar uma rodada)'}

## O QUE FICOU ABERTO

${aberto || 'ver a última resposta da revisora na caixa, seções BLOQUEIA e PERGUNTA'}

## CUSTO

Esta execução: **US$ ${custo.toFixed(2)}**${chamadasSemCusto ? ' (é PISO, veja abaixo)' : ''}.
Por rodada: ${custoDaRodada.map((c, i) => `${i + 1}ª US$ ${c.toFixed(2)}`).join(' · ') || '·'}

**O ASSUNTO, que é contra o que o teto vale:** US$ ${(gastoAnterior + custo).toFixed(2)} de um teto
de US$ ${TETO_CUSTO.toFixed(2)}${gastoAnterior ? `, dos quais US$ ${gastoAnterior.toFixed(2)} vieram de execuções anteriores` : ''}.
${registroGasto ? `Assunto: "${registroGasto.assunto}", zerado em ${String(registroGasto.zeradoEm).slice(0, 10)} porque: ${registroGasto.zeradoPorque}` : ''}
${chamadasSemCusto
  ? `
**O total é um PISO, e o de verdade é MAIOR.** ${chamadasSemCusto} chamada(s) morreram sem devolver o
custo, e uma chamada que não devolve custo não custou zero: ela gastou o que gastou
e não disse quanto. O que essas chamadas consumiram não está nesta soma.`
  : ''}

## O ALVO PEDIDO, E SE ELE SAIU
${ALVO ? `\nPedido: ${ALVO}\n\nJulgue o ciclo contra isto, e não contra o que ele fez.` : '\nNenhum alvo foi passado nesta execução (`--alvo`), então o ciclo escolheu sozinho o que fazer.'}

## O QUE PRECISA DO HUMANO

${aberto && aberto.includes('ESCALA') ? 'Ver a seção ESCALA da última resposta da revisora.'
    : 'Nada foi escalado. Se o ciclo parou por teto, a decisão é só continuar ou não.'}

## O DIÁRIO

\`\`\`
${registro.join('\n')}
\`\`\`
`;
  const rel = `docs/simulacao/caixa/RESUMO-${nn}.md`;
  // NO SECO NÃO SAI ARQUIVO NENHUM. A primeira versão escrevia sempre e só
  // deixava de commitar, e uma prova em seco chegou a deixar um RESUMO de uma
  // rodada que nunca aconteceu na caixa. Resumo é registro de ciclo que rodou.
  if (SECO) { console.log(`
  [seco] escreveria ${rel}`); return; }
  fs.writeFileSync(arq, txt);
  // O ACUMULADO DO ASSUNTO SOBE JUNTO COM O RESUMO, e no mesmo commit.
  //
  // Junto de propósito: são o mesmo fato (esta execução gastou isto), e separá-los
  // abriria a chance de o resumo entrar e o acumulado não, que é a forma de o teto
  // por assunto voltar a ser teto por execução sem ninguém notar.
  const caminhos = [rel];
  if (registroGasto) {
    try {
      registroGasto = GASTO.somar(registroGasto, {
        custo, semCusto: chamadasSemCusto, parada: motivo,
      });
      fs.writeFileSync(path.join(EXEC, GASTO.CAMINHO), GASTO.texto(registroGasto));
      caminhos.push(GASTO.CAMINHO);
      console.log(`  · acumulado do assunto: ${GASTO.frase(registroGasto)}`);
    } catch (e) { console.log(`  ✘ não deu para somar o acumulado: ${e.message}`); }
  }
  {
    try {
      for (const c of caminhos) git(EXEC, `add "${c}"`);
      git(EXEC, `commit -q -m "ciclo até a rodada ${nn} · resumo" -- ${caminhos.map((c) => `"${c}"`).join(' ')}`);
    } catch { /* se não der para commitar, os arquivos ficam na árvore mesmo assim */ }
  }
  console.log(`\n📄 ${rel}`);
}

const parar = (nn, motivo, aberto) => {
  anote(`\n■ PARA · ${motivo}`);
  resumo(nn, motivo, aberto);
  process.exit(0);
};

/**
 * A RESPOSTA QUE O SECO USA, e ela é fixture e não revisão. Serve só para o
 * caminho das travas ser andado sem chamada nenhuma: tem as cinco seções, um
 * item em CORRIGE (para o parser ler item de verdade), "nada" escrito em ESCALA,
 * e veredito CORRIGE-E-SEGUE, que não acende SEGUE-duas-vezes nem PARA.
 *
 * O ITEM DE CORRIGE REPETE DE UMA RODADA PARA A OUTRA, DE PROPÓSITO. Com isso o
 * seco termina na rodada 03 pela trava de ASSUNTO REPETIDO, e não pelo teto de
 * rodadas: é a trava mais difícil de ver acender (ela é heurística), e a trilha
 * do seco é o único lugar em que ela acende de graça. A primeira versão desta
 * nota dizia que o seco terminava pelo teto; a trilha mostrou o contrário, e o
 * contrário é mais útil.
 */
const FIXTURE_SECO = (nn) => `# Rodada ${nn} · resposta da revisora (FIXTURE DO SECO)

## BLOQUEIA

nada

## CORRIGE

- (fixture) o mesmo item em toda rodada, para a trava de repetição acender no seco

## PERGUNTA

nada

## ESCALA

nada

## VEREDITO

CORRIGE-E-SEGUE
`;

// ===================================================================== o ciclo
console.log(`\n· duo · teto ${TETO_RODADAS} rodadas · US$ ${TETO_CUSTO.toFixed(2)} · ${TETO_MIN} min por chamada`
  + `${SECO ? ' · SECO (não chama nada)' : ''}`);
if (ALVO) registro.push(`\n· ALVO (do humano): ${ALVO}`);
if (ALVO) console.log(`· alvo: ${ALVO}`);

if (!fs.existsSync(REV)) parar('00', `o worktree da revisora não existe em ${REV}`);
if (!fs.existsSync(CAIXA)) parar('00', 'não há caixa de correio');

// ================================================== o acumulado, antes de tudo
//
// `--zerar` é um comando, e não uma flag de execução: ele grava, commita e SAI.
if (ZERAR) {
  const assunto = ALVO || ZERAR;
  const novo = GASTO.zerar(assunto, ZERAR);
  fs.writeFileSync(path.join(EXEC, GASTO.CAMINHO), GASTO.texto(novo));
  try {
    git(EXEC, `add "${GASTO.CAMINHO}"`);
    git(EXEC, `commit -q -m "duo · zerar o acumulado: ${ZERAR.slice(0, 60)}" -- "${GASTO.CAMINHO}"`);
  } catch { /* fica na árvore */ }
  console.log(`\n✓ acumulado zerado · ${GASTO.frase(novo)}`);
  console.log('  Nenhum ciclo rodou. Rode o `npm run duo` de novo, sem `--zerar`.');
  process.exit(0);
}

// REGISTRO AUSENTE NÃO É ZERO, e é por isso que o script se recusa a abrir.
//
// "nunca gastei nada neste assunto" e "não achei o registro do que gastei" sairiam
// com o mesmo número, e o segundo é o que acontece quando alguém apaga o arquivo,
// troca de máquina ou erra o caminho. Um teto conferido contra um zero inventado
// não é teto. Fail-closed, com a instrução junto.
registroGasto = GASTO.lerDoDisco(EXEC);
if (!registroGasto) {
  console.error(`\n✘ não há acumulado legível em ${GASTO.CAMINHO}.`);
  console.error('  Isto NÃO quer dizer que o assunto não gastou nada: quer dizer que não há');
  console.error('  registro, e um teto conferido contra um zero inventado não é teto.');
  console.error('\n  Para começar um assunto novo, com o acumulado em zero e o motivo escrito:');
  console.error('    npm run duo -- --alvo "<o assunto>" --zerar "<por que está zerando>"');
  process.exit(1);
}
gastoAnterior = registroGasto.acumulado;
console.log(`· gasto do assunto até aqui: ${GASTO.frase(registroGasto)}`);
registro.push(`\n· gasto do assunto até aqui: ${GASTO.frase(registroGasto)}`);

// =================================================================== a fumaça
if (FUMACA) {
  console.log('\n· fumaça · uma chamada real mínima em cada lado, e nada mais');
  if (!fs.existsSync(PAPEL)) {
    console.error(`\n✘ o papel da revisora não está em ${path.relative(REV, PAPEL)}`);
    process.exit(1);
  }
  let total = 0, falhou = false;
  for (const [dir, quem] of [[EXEC, 'executora'], [REV, 'revisora']]) {
    const r = await chamar(dir, quem, 'Responda apenas a palavra: ok');
    total += r.custo;
    const disse = (r.texto || '').trim().toLowerCase();
    if (!r.ok) {
      falhou = true;
      console.log(`  ✘ ${quem} · a chamada falhou: ${r.motivo || 'sem motivo'}`);
    } else {
      console.log(`  ✓ ${quem} · invocação ok · JSON ok · custo lido US$ ${r.custo.toFixed(2)}`
        + ` · respondeu ${JSON.stringify(disse.slice(0, 20))}`);
    }
  }
  console.log(`\n  custo da fumaça: US$ ${total.toFixed(2)}`);
  console.log(falhou
    ? '\n✘ a fumaça falhou: NÃO rode a molhada até isto passar'
    : '\n✓ o caminho do processo funciona nos dois lados. O seco prova o das decisões;'
      + '\n  nenhum dos dois substitui o outro.');
  process.exit(falhou ? 1 : 0);
}

let seguesSeguidos = 0;
let respostaAnterior = null;
const jaFeitas = avisos().length;

for (let volta = 1; volta <= TETO_RODADAS; volta += 1) {
  const nn = String(jaFeitas + volta).padStart(2, '0');
  anote(`\n══ rodada ${nn} ══`);

  // -- trava de custo, ANTES de abrir a rodada -------------------------------
  //
  // Este é o caso LIMPO: nada foi gasto nesta rodada ainda, então parar aqui não
  // deixa aviso sem revisão. A previsão é a rodada mais cara até aqui; na
  // primeira não há anterior, e a estimativa de partida é chute declarado, o que
  // é justamente por que a conferência de verdade passou a ser por chamada.
  if (estourouNoMeio) parar(nn, estourouNoMeio);
  const previsao = custoDaRodada.length ? Math.max(...custoDaRodada) : 4;
  if (gastoAnterior + custo + previsao > TETO_CUSTO) {
    parar(nn, `teto de custo do ASSUNTO: US$ ${(gastoAnterior + custo).toFixed(2)} gastos`
      + `${gastoAnterior ? ` (US$ ${gastoAnterior.toFixed(2)} em execuções anteriores)` : ''}`
      + ` e a próxima rodada deve custar ~US$ ${previsao.toFixed(2)},`
      + ` o que passaria de US$ ${TETO_CUSTO.toFixed(2)}`);
  }

  // -- trava de árvore suja --------------------------------------------------
  if (!SECO && !limpa(EXEC)) parar(nn, `a árvore da executora está suja:\n${git(EXEC, 'status --short')}`);

  // ---------------------------------------------------------- 1 · a executora
  // A RESPOSTA ANTERIOR PODE ESTAR NO DISCO E NÃO NESTA EXECUÇÃO: a primeira
  // rodada de uma execução nova tem de começar com o que a revisora respondeu
  // na anterior, senão o ciclo recomeça do zero e trata de novo o que já foi
  // tratado. A caixa é o canal, e o disco é a caixa.
  const nnAnterior = String(jaFeitas + volta - 1).padStart(2, '0');
  const arqRespAnterior = path.join(CAIXA, `${nnAnterior}-revisora.md`);
  const haResposta = respostaAnterior || fs.existsSync(arqRespAnterior);
  const pedido = haResposta
    ? `A revisora respondeu a rodada anterior em docs/simulacao/caixa/${nnAnterior}-revisora.md.`
      + ' Leia, trate BLOQUEIA e CORRIGE, responda PERGUNTA, e faça a rodada seguinte.'
    : 'Faça a próxima rodada de trabalho da frente de simulação.';
  if (!respostaAnterior && fs.existsSync(arqRespAnterior)) {
    anote(`  → a rodada começa com a resposta ${nnAnterior}-revisora.md já na caixa`);
  }
  const pExec = `${pedido}\n\n`
    + (ALVO ? `O ALVO DESTA EXECUÇÃO, decidido pelo humano e acima da sua ordem de trabalho:\n${ALVO}\n\n` : '')
    + 'Ao terminar: commite tudo, rode `npm run rodada` para abrir o aviso, preencha as seis'
    + ' seções do arquivo criado, e rode `npm run rodada -- --enviar`.\n\n'
    + 'Regras da caixa em docs/simulacao/caixa/README.md. Não decida regra de jogo:'
    + ' isso vai escrito no aviso, em O QUE FICOU EM ABERTO, marcado como precisando do humano.';

  const rExec = await chamar(EXEC, 'executora', pExec);
  custo += rExec.custo;
  if (rExec.custoIncerto) chamadasSemCusto += 1;
  if (!rExec.ok) parar(nn, `a chamada da executora falhou: ${rExec.motivo || 'sem motivo'}`);
  anote(`  ✓ executora · US$ ${rExec.custo.toFixed(2)}`);
  if (conferirCusto('custo') && !estourouNoMeio) {
    // NÃO PARA AQUI. O aviso desta rodada já foi escrito e commitado pela
    // executora; abandoná-lo sem revisão é o único desfecho pior que gastar os
    // dólares da revisora. A rodada fecha inteira, e a seguinte não abre.
    estourouNoMeio = `teto de custo: US$ ${custo.toFixed(2)} passaram de`
      + ` US$ ${TETO_CUSTO.toFixed(2)} (assunto) na chamada da executora da rodada ${nn}. A rodada`
      + ' fechou inteira (a revisora foi paga, porque aviso commitado sempre tem'
      + ' revisão) e a seguinte não abriu';
    anote('  → o teto estourou no meio: esta rodada fecha, a próxima não abre');
  }

  // -- o aviso saiu? ---------------------------------------------------------
  //
  // NO SECO o aviso desta rodada não existe (ninguém o escreveu), então o caminho
  // usa o ÚLTIMO aviso real da caixa, para que o commit mostrado seja um commit
  // de verdade e não um sha inventado. Está dito na trilha.
  const nnAviso = SECO ? (avisos().pop() || nn) : nn;
  if (SECO && nnAviso !== nn) anote(`  [seco] a executora não escreveu o ${nn}-executora.md; usando o ${nnAviso} para mostrar o caminho`);
  const arqAviso = path.join(CAIXA, `${nnAviso}-executora.md`);
  anote(`  trava · o aviso existe? ${fs.existsSync(arqAviso) ? '✓' : '■'}`);
  if (!fs.existsSync(arqAviso)) parar(nn, 'a executora não escreveu o aviso da rodada');
  anote(`  trava · árvore da executora limpa? ${limpa(EXEC) ? '✓' : '■'}`);
  if (!limpa(EXEC)) parar(nn, `a executora deixou a árvore suja:\n${git(EXEC, 'status --short')}`);

  // -- O COMMIT QUE CONTÉM O AVISO, e nunca o topo da branch ------------------
  //
  // O topo pode ter andado (a executora pode ter commitado depois), e mandar a
  // revisora para o topo por conveniência quebraria a única coisa que o
  // congelamento compra: ela revisa o que foi avisado.
  const shaAviso = git(EXEC, `log -1 --format=%H -- "docs/simulacao/caixa/${nnAviso}-executora.md"`);
  if (!shaAviso) parar(nn, 'não achei o commit que contém o aviso');
  const topo = git(EXEC, 'rev-parse HEAD');
  anote(`  → commit do aviso: ${shaAviso.slice(0, 7)}${shaAviso === topo ? ' (é o topo)'
    : ` (o topo é ${topo.slice(0, 7)}, e NÃO é ele que vai)`}`);

  // ----------------------------------------------------------- 2 · o checkout
  anote(`  trava · o papel da revisora existe em .claude/CLAUDE.local.md? ${fs.existsSync(PAPEL) ? '✓' : '■'}`);
  if (!fs.existsSync(PAPEL)) {
    parar(nn, `o papel da revisora sumiu de ${path.relative(REV, PAPEL)}.`
      + ' Sem ele a revisora abre a rodada sem contrato: sem as vigilâncias, sem o formato'
      + ' da resposta e sem a trava de regra de jogo, produzindo texto plausível e inútil.');
  }
  anote(`  trava · árvore da revisora limpa? ${limpa(REV) ? '✓' : '■'}`);
  if (!limpa(REV)) parar(nn, `a árvore da revisora está suja:\n${git(REV, 'status --short')}`);
  if (SECO) {
    anote(`  [seco] faria: git -C ${path.basename(REV)} fetch && checkout ${shaAviso.slice(0, 7)}`);
  } else {
    git(REV, 'fetch -q');
    git(REV, `checkout -q ${shaAviso}`);
    if (!fs.existsSync(PAPEL)) parar(nn, 'o checkout apagou o papel da revisora');
    anote(`  ✓ revisora alinhada em ${shaAviso.slice(0, 7)}, e o papel sobreviveu`);
  }

  // ----------------------------------------------------------- 3 · a revisora
  const pRev = `A executora avisou a rodada ${nn}. Leia docs/simulacao/caixa/${nn}-executora.md`
    + ` e o commit ${shaAviso}, e escreva docs/simulacao/caixa/${nn}-revisora.md`
    + ' com as cinco seções do seu contrato. Não commite: quem commita é o script.';
  const rRev = await chamar(REV, 'revisora', pRev);
  custo += rRev.custo;
  if (rRev.custoIncerto) chamadasSemCusto += 1;
  const custoRodada = rExec.custo + rRev.custo;
  custoDaRodada.push(custoRodada);
  if (!rRev.ok) parar(nn, `a chamada da revisora falhou: ${rRev.motivo || 'sem motivo'}`);
  anote(`  ✓ revisora · US$ ${rRev.custo.toFixed(2)} · rodada US$ ${custoRodada.toFixed(2)}`);
  if (conferirCusto('custo') && !estourouNoMeio) {
    estourouNoMeio = `teto de custo do assunto: US$ ${(gastoAnterior + custo).toFixed(2)} passaram`
      + ` de US$ ${TETO_CUSTO.toFixed(2)} na rodada ${nn}, que fechou inteira. A seguinte não abriu`;
  }

  // ----------------------------------------- 4 · o script commita por ela
  let resposta;
  if (SECO) {
    // A RESPOSTA DO SECO É UMA FIXTURE, dita como tal na trilha. Ela existe para
    // o caminho das travas ser andado até o fim sem chamada nenhuma; o que ela
    // diz não é revisão de nada.
    resposta = FIXTURE_SECO(nn);
    anote('  [seco] a resposta da revisora é uma FIXTURE (CORRIGE-E-SEGUE, sem escalada)');
  } else {
    const arqRespRev = path.join(REV, 'docs', 'simulacao', 'caixa', `${nn}-revisora.md`);
    if (!fs.existsSync(arqRespRev)) parar(nn, 'a revisora não escreveu a resposta');
    resposta = fs.readFileSync(arqRespRev, 'utf8');
    fs.writeFileSync(path.join(CAIXA, `${nn}-revisora.md`), resposta);
    // Tirada do worktree dela: senão o próximo checkout esbarra num arquivo não
    // rastreado no mesmo caminho e recusa andar.
    fs.rmSync(arqRespRev, { force: true });
    const relResp = `docs/simulacao/caixa/${nn}-revisora.md`;
    git(EXEC, `add "${relResp}"`);
    git(EXEC, `commit -q -m "rodada ${nn} · resposta da revisora" -- "${relResp}"`);
    anote(`  ✓ resposta commitada · ${relResp}`);
  }

  // ------------------------------------------------------- 5 · as travas
  //
  // O FORMATO PRIMEIRO, e antes de qualquer leitura. `ilegivel` separa os três
  // estados de uma seção (ausente, em branco, "nada" escrito): os dois primeiros
  // encerram, porque ler pela metade faria o ciclo seguir por cima do que ele
  // existe para pegar. Foi o furo da estreia, dentro da trava e não do medido.
  const problemas = ilegivel(resposta);
  anote(`  trava · a resposta é legível (cinco seções, "nada" escrito onde vazio)? ${problemas.length ? '■' : '✓'}`);
  if (problemas.length) {
    parar(nn, `a resposta da revisora não dá para ler:\n    ${problemas.join('\n    ')}`);
  }
  const v = veredito(resposta);
  anote(`  veredito: ${v}`);

  const escalou = temConteudo(resposta, 'ESCALA');
  anote(`  trava · ESCALA ${escalou ? 'tem item ■' : dizNada(resposta, 'ESCALA') ? 'diz "nada" ✓' : '?'}`);
  if (escalou) {
    parar(nn, 'a revisora ESCALOU: há decisão que precisa do humano, e escalar encerra o ciclo'
      + ' na hora, mesmo com rodadas sobrando', `### ESCALA da rodada ${nn}\n\n${secao(resposta, 'ESCALA')}`);
  }
  anote(`  trava · veredito PARA? ${v === 'PARA' ? '■' : '✓ não'}`);
  if (v === 'PARA') parar(nn, 'veredito PARA', secao(resposta, 'BLOQUEIA'));

  if (respostaAnterior) {
    const rep = repetidos(respostaAnterior, resposta);
    anote(`  trava · assunto repetido com a resposta anterior? ${rep.length ? '■' : '✓ não'}`);
    if (rep.length) {
      parar(nn, `assunto repetido em duas respostas seguidas (duas voltas sem convergir não`
        + ` convergem em cinco):\n    ${rep.slice(0, 3).join('\n    ')}`,
      `### os itens que se repetiram\n\n${rep.join('\n\n')}`);
    }
  }

  seguesSeguidos = v === 'SEGUE' ? seguesSeguidos + 1 : 0;
  anote(`  trava · SEGUE seguidos: ${seguesSeguidos} de 2 ${seguesSeguidos >= 2 ? '■' : '✓'}`);
  if (seguesSeguidos >= 2) {
    parar(nn, 'SEGUE duas vezes seguidas: revisão esgotada. Continuar daqui é inventar trabalho');
  }

  respostaAnterior = resposta;
}

if (estourouNoMeio) parar(String(jaFeitas + TETO_RODADAS).padStart(2, '0'), estourouNoMeio);

parar(String(jaFeitas + TETO_RODADAS).padStart(2, '0'),
  `teto de ${TETO_RODADAS} rodadas alcançado. O ciclo não continua "só mais uma"`);
