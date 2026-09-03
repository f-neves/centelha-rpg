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

/** Teto de rodadas. Seis é o padrão pedido; ao bater, para e resume. */
const TETO_RODADAS = parseInt(arg('--rodadas', '6'), 10);
/**
 * TETO DE CUSTO, EM DÓLARES. Escolhido em 20.
 *
 * A conta: são duas chamadas por rodada, e a da executora é a cara (ela roda
 * bateria, mexe em código e escreve documento). Com seis rodadas são doze
 * chamadas. Vinte dólares corta o ciclo por volta da quarta ou quinta rodada num
 * ritmo pesado, e deixa as seis passarem num ritmo leve.
 *
 * ERRAR PARA BAIXO É O LADO CERTO: parar cedo custa uma rodada e um `--custo`
 * maior na próxima execução; parar tarde custa dinheiro que ninguém autorizou. E
 * o RESUMO diz que a parada foi por custo, então a informação não se perde.
 */
const TETO_CUSTO = parseFloat(arg('--custo', '20'));
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
      resolve({ ok: false, custo: 0, texto: '', motivo: `estourou ${TETO_MIN} min` });
    }, TETO_MIN * 60_000);
    p.stdout.on('data', (d) => { saida += d; });
    p.stderr.on('data', (d) => { erro += d; });
    p.on('close', (code) => {
      clearTimeout(relogio);
      if (code !== 0) {
        return resolve({ ok: false, custo: 0, texto: saida, motivo: `saiu com ${code}: ${erro.slice(0, 300)}` });
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
          return resolve({ ok: false, custo: 0, texto: j.result || '',
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

Total: **US$ ${custo.toFixed(2)}** de um teto de US$ ${TETO_CUSTO.toFixed(2)}.
Por rodada: ${custoDaRodada.map((c, i) => `${i + 1}ª US$ ${c.toFixed(2)}`).join(' · ') || '·'}

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
  {
    try {
      git(EXEC, `add "${rel}"`);
      git(EXEC, `commit -q -m "ciclo até a rodada ${nn} · resumo" -- "${rel}"`);
    } catch { /* se não der para commitar, o arquivo fica na árvore mesmo assim */ }
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

if (!fs.existsSync(REV)) parar('00', `o worktree da revisora não existe em ${REV}`);
if (!fs.existsSync(CAIXA)) parar('00', 'não há caixa de correio');

let seguesSeguidos = 0;
let respostaAnterior = null;
const jaFeitas = avisos().length;

for (let volta = 1; volta <= TETO_RODADAS; volta += 1) {
  const nn = String(jaFeitas + volta).padStart(2, '0');
  anote(`\n══ rodada ${nn} ══`);

  // -- trava de custo, ANTES de abrir a rodada -------------------------------
  //
  // A unidade atômica é a RODADA, e não a chamada: parar no meio deixa um aviso
  // commitado que ninguém vai revisar, o que é pior que parar antes. A previsão
  // é a rodada mais cara até aqui, ou uma estimativa de partida na primeira.
  const previsao = custoDaRodada.length ? Math.max(...custoDaRodada) : 4;
  if (custo + previsao > TETO_CUSTO) {
    parar(nn, `teto de custo: US$ ${custo.toFixed(2)} gastos e a próxima rodada`
      + ` deve custar ~US$ ${previsao.toFixed(2)}, o que passaria de US$ ${TETO_CUSTO.toFixed(2)}`);
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
    + 'Ao terminar: commite tudo, rode `npm run rodada` para abrir o aviso, preencha as seis'
    + ' seções do arquivo criado, e rode `npm run rodada -- --enviar`.\n\n'
    + 'Regras da caixa em docs/simulacao/caixa/README.md. Não decida regra de jogo:'
    + ' isso vai escrito no aviso, em O QUE FICOU EM ABERTO, marcado como precisando do humano.';

  const rExec = await chamar(EXEC, 'executora', pExec);
  custo += rExec.custo;
  if (!rExec.ok) parar(nn, `a chamada da executora falhou: ${rExec.motivo || 'sem motivo'}`);
  anote(`  ✓ executora · US$ ${rExec.custo.toFixed(2)} · acumulado US$ ${custo.toFixed(2)}`);

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
  const custoRodada = rExec.custo + rRev.custo;
  custoDaRodada.push(custoRodada);
  if (!rRev.ok) parar(nn, `a chamada da revisora falhou: ${rRev.motivo || 'sem motivo'}`);
  anote(`  ✓ revisora · US$ ${rRev.custo.toFixed(2)} · rodada US$ ${custoRodada.toFixed(2)}`
    + ` · acumulado US$ ${custo.toFixed(2)}`);

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

parar(String(jaFeitas + TETO_RODADAS).padStart(2, '0'),
  `teto de ${TETO_RODADAS} rodadas alcançado. O ciclo não continua "só mais uma"`);
