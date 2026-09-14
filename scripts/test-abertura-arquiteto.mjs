// test-abertura-arquiteto.mjs · o `/arquiteto` aponta para um prompt que existe.
//
// Desde 14/09/2026 o arranjo abre por um comando (`.claude/commands/arquiteto.md`), e ele
// foi escrito DE PROPÓSITO como ponteiro e não como cópia: o prompt de abertura continua
// morando em `docs/simulacao/PASSAGEM.md §9`. A razão é a forma catalogada em
// `docs/simulacao/CATALOGO.md` · duas listas que precisam concordar, sustentadas só por
// disciplina, divergem. A régua de lá dá duas saídas, fonte única ou cópia com detector,
// e aqui a escolha foi fonte única.
//
// MAS FONTE ÚNICA COM PONTEIRO TEM UM MODO DE FALHA PRÓPRIO, e é o que este arquivo guarda:
// o ponteiro pode deixar de resolver. Se o título da seção mudar no `PASSAGEM.md`, o comando
// manda ler algo que não está lá, e isso acontece no PIOR momento possível · na abertura de
// uma sessão, antes de qualquer contexto existir, com o humano esperando.
//
// O que ele NÃO pode fazer é conferir se o prompt é bom. Só que o endereço fecha.
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };

const CMD = path.join(ROOT, '.claude/commands/arquiteto.md');
const PASSAGEM = path.join(ROOT, 'docs/simulacao/PASSAGEM.md');

ok(fs.existsSync(CMD), 'o comando `/arquiteto` existe em `.claude/commands/arquiteto.md`');
ok(fs.existsSync(PASSAGEM), 'o `PASSAGEM.md` existe (é a fonte para onde o comando aponta)');
if (falhas.length) { falhar(); }

const cmd = fs.readFileSync(CMD, 'utf8');
const passagem = fs.readFileSync(PASSAGEM, 'utf8');

// ------------------------------------------------- 1 · o ponteiro resolve
//
// O TÍTULO EXATO que o comando manda procurar. Se ele mudar de um lado só, esta asserção
// cai, que é o ponto inteiro deste arquivo.
const TITULO = 'O prompt de abertura do Arquiteto';
ok(cmd.includes(TITULO),
  `o comando NOMEIA a seção que manda ler ("${TITULO}"), em vez de mandar "procurar o prompt"`);
ok(new RegExp(`^#{2,4}\\s*${TITULO}\\s*$`, 'm').test(passagem),
  `e o \`PASSAGEM.md\` TEM essa seção, com esse título exato (o ponteiro resolve)`);
ok(/PASSAGEM\.md/.test(cmd), 'o comando diz em que arquivo a seção está, e não só o nome dela');

// O prompt propriamente dito, que é o conteúdo que o ponteiro promete entregar. A âncora é
// a primeira linha dele, que é o que o Arquiteto vai ler ao chegar lá.
ok(/Você é o ARQUITETO deste projeto\. Antes de qualquer coisa, leia, nesta ordem:/.test(passagem),
  'e o prompt está de fato escrito lá (a primeira linha dele, que é o que o ponteiro entrega)');

// -------------------------------- 2 · e NÃO virou cópia pelas costas
//
// A asserção que mantém a decisão de desenho viva depois que quem a tomou sair. Se alguém
// colar o prompt dentro do comando "para ficar mais rápido", passam a existir duas listas,
// e a próxima edição de uma delas não alcança a outra.
ok(!/NÃO leia os relatórios 00 a 09/.test(cmd),
  'o comando NÃO carrega cópia do prompt (a lista do que não ler mora só no `PASSAGEM.md`)');
ok(!/docs\/simulacao\/PLANO\.md\s+·/.test(cmd),
  'e nem da ordem de leitura dos documentos: o comando aponta, não repete');

// ------------------------------- 3 · o que o comando ACRESCENTA ao prompt
//
// Estas três coisas são operacionais e moram no comando de propósito, porque é ele que roda.
ok(/Executora/.test(cmd) && /Revisora/.test(cmd),
  'o comando cria os dois teammates, que é o que esta invocação acrescenta ao prompt escrito');
ok(/centelha-techlead-revisora/.test(cmd),
  'e nomeia a worktree da Revisora, que já existe e não se recria');
// A LIÇÃO QUE CUSTOU UMA SEMANA, e por isso ela é asserção e não comentário.
ok(/ANTES/.test(cmd) && /orçamento/i.test(cmd),
  'e diz que montar a equipe vem ANTES do portão de orçamento (confundir as duas travas custou uma semana sem revisão)');

// -------------------------------------- 4 · o nome e a conferência da equipe
//
// Pedidos do humano em 14/09/2026, e os dois existem pelo mesmo motivo: o arranjo tem UMA
// janela, e o que não se vê não se governa.
ok(/Arquiteto \(RPG\)/.test(cmd),
  'o comando manda a sessão se chamar `Arquiteto (RPG)` (o humano acha esta janela entre várias)');
// A HONESTIDADE DO PASSO, que é o que o torna útil quando ele não funciona: se não houver como
// renomear no ambiente, o comando manda AVISAR com a forma certa, não fingir que nomeou.
ok(/claude -n "Arquiteto \(RPG\)"/.test(cmd),
  'e, quando não der para renomear no meio da sessão, entrega ao humano a forma que funciona (`claude -n`)');
ok(/ListAgents/.test(cmd),
  'o comando CONFERE a equipe por `ListAgents`, e não por ter chamado a criação (rótulo não é estado)');
ok(/DIGA AO HUMANO em vez de seguir/.test(cmd),
  'e manda AVISAR em vez de seguir quando faltar teammate: trabalhar sem revisão é decisão do humano');

// --------------------------------- 5 · e a lista de passos não se contradiz
//
// Este arquivo já ganhou um passo no topo depois de escrito, e a renumeração quebrou uma
// referência por posição que havia nele. É a forma que o `CATALOGO.md` nomeia, e a asserção
// existe porque ela vai acontecer de novo na próxima inserção.
const passos = [...cmd.matchAll(/^(\d+)\. /gm)].map((m) => Number(m[1]));
ok(new Set(passos).size === passos.length,
  `os passos numerados não se repetem (achei ${JSON.stringify(passos)})`);
ok(passos.every((n, i) => i === 0 || n === passos[i - 1] + 1),
  `e sobem de um em um, sem buraco (achei ${JSON.stringify(passos)})`);
ok(!/PASSOS \d+ E \d+/.test(cmd),
  'e nenhuma frase do arquivo se refere a um passo PELO NÚMERO (referência por posição envelhece na inserção seguinte)');

function falhar() {
  console.error(`✗ abertura do Arquiteto · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
if (falhas.length) { falhar(); }
console.log('✓ abertura · o `/arquiteto` aponta para um prompt que existe, não virou cópia dele, '
  + 'e carrega o que é só dele (os dois teammates e a ordem contra o portão de orçamento)');
