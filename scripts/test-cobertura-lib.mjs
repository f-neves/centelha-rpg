// test-cobertura-lib.mjs · o portão da CLASSE que o espelho não acha.
//
// A PERGUNTA: quais funções de `src/lib/combate-tempo.ts` a MESA chama e o
// harness de simulação NÃO chama? Elas são o buraco de cobertura que nenhum
// outro instrumento daqui enxerga, e a razão é estrutural: o espelho de motor
// (`test-espelho.mjs`) compara o harness com a mesa, mas por Tick e por retrato,
// e o que ele compara é o que os DOIS executam. Função que só um lado chama não
// aparece em divergência nenhuma, porque não há o que divergir. A ausência é
// muda por construção, e este arquivo é o único lugar em que ela fala.
//
// O ACHADO QUE O TROUXE (06/09/2026): 63 exportadas, 20 chamadas pelos dois,
// ZERO chamadas só pelo harness, 21 FUNÇÕES chamadas pela mesa e ausentes do
// harness. Dez delas foram lidas uma a uma e nove ALONGAM a batalha (a entrada
// escalonada, o contrapé, o abortar, o gesto adiado, o passo pago na
// Recuperação), uma encurta, e as duas formas dão o mesmo resultado: a batalha
// do harness acaba antes da batalha da mesa.
//
//   node scripts/test-cobertura-lib.mjs           · o portão
//   node scripts/test-cobertura-lib.mjs --lista   · só os nomes, sem veredito
//
// O QUE ELE NÃO DIZ: chamar não é exercitar. Uma função chamada uma vez num
// caminho que a política automática nunca toma conta como chamada aqui. Isto
// mede ALCANCE, e a diferença entre alcance e exercício é a mesma que o
// `mapa-cobertura.mjs` já escreve para os módulos.
//
// ── as formas do CATÁLOGO que se aplicam (`docs/simulacao/CATALOGO.md`) ──
//
//   · **o portão que casa por texto fixo.** É a forma central deste arquivo, e
//     ela mordeu no desenho: a primeira versão lia `nome` com um `[^\w$.]` na
//     frente para não casar `obj.nome`, e o ponto do ESPALHAMENTO (`...nome`)
//     entrava na mesma proibição. `COMBATE_PADRAO` e `contrapeDe` saíram como
//     "importados e nunca usados", os dois falsos, e a lista de mortos teria
//     mandado apagar dois importes vivos. A emenda é a alternativa `\.\.\.` do
//     `usa`, e a regressão dela está no autoteste;
//   · **a conferência que CONTA em vez de NOMEAR.** A régua não é "21": é a
//     LISTA de nomes abaixo. Contagem envelhece na primeira função nova do
//     arquivo e, quando falha, não diz qual faltou;
//   · **o portão nunca visto vermelho.** Os três sentidos foram ensaiados à mão
//     antes de publicar (vermelho com uma chamada nova de mesa plantada, verde
//     com ela tirada, vermelho de novo com o nome fora da lista), e o autoteste
//     abaixo repete o essencial a cada execução, contra texto SINTÉTICO;
//   · **falhar fechado e controle positivo são duas provas diferentes.** As duas
//     estão aqui e são separadas: falhar fechado é o `if (!exportadas.size)` e
//     seus irmãos, que assumem o pior quando a leitura não achou nada; o
//     controle positivo é o autoteste, que planta uma divergência em texto que
//     não é deste repositório e cobra que ela seja achada. O controle positivo
//     NATURAL (a lista real de hoje) não basta sozinho: ele depende de o
//     repositório continuar do jeito que está, e é exatamente essa dependência
//     que os dois portões de 05/09 tinham e que 06/09 tirou dos outros dois;
//   · **a asserção negativa sozinha.** O autoteste tem o par: um corpus com
//     divergência plantada (que TEM de acusar) e um sem divergência nenhuma (que
//     TEM de ficar quieto). Sem o segundo, um portão que acusa tudo passaria.
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const LIB = 'src/lib/combate-tempo.ts';

/**
 * A MESA, e ela é uma lista escrita à mão porque "a mesa" é um recorte de
 * produto e não uma pasta: as duas abas que rodam combate mais o módulo de tela
 * que só elas usam. `mesa-tempo-ui.ts` entra porque é por ele que a `foraDeHora`
 * chega à mesa; sem ele o portão daria 20, e a vigésima primeira estaria fora da
 * lista por endereço, não por mérito.
 */
const MESA = ['src/pages/mesa/grid.astro', 'src/pages/mesa/combate.astro', 'src/lib/mesa-tempo-ui.ts'];
/** O harness: tudo em `scripts/sim`, que chama a lib pelo pacote da ponte. */
const HARNESS = 'scripts/sim';

// ============================================================ o instrumento
/** Comentário e bloco de import fora: importar não é chamar, e citar não é chamar. */
const semRuido = (t) => t
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
  .replace(/import\s*\{[^}]*\}\s*from\s*'[^']*';?/g, ' ');

/**
 * `nome` aparece como VALOR neste texto?
 *
 * A alternativa `\.\.\.` é a emenda descrita no cabeçalho: `...nome` tem um
 * ponto na frente e não é acesso a membro.
 */
const usa = (txt, n) => new RegExp(`(?:^|[^\\w$.'"]|\\.\\.\\.)${n}(?![\\w$])`).test(txt);

/** As exportadas de um módulo, separando FUNÇÃO de constante. */
function exportadasDe(fonte) {
  const todas = new Set();
  const funcoes = new Set();
  for (const m of fonte.matchAll(/^export\s+(?:async\s+)?(function|const|let|class)\s+([A-Za-z_$][\w$]*)([^\n=]*=?[^\n]*)/gm)) {
    todas.add(m[2]);
    if (m[1] === 'function' || /=>|\bfunction\b/.test(m[3] || '')) funcoes.add(m[2]);
  }
  return { todas, funcoes };
}

/** Quem a MESA chama, entre as exportadas. */
const chamadasNaMesa = (nomes, textos) => new Set(
  [...nomes].filter((n) => textos.some((t) => usa(t, n))),
);

/**
 * Quem o HARNESS chama, entre as exportadas.
 *
 * O harness recebe o pacote da lib por parâmetro (`L`, `LIB`, `M`) e chama por
 * membro, então aqui a busca é a INVERSA da da mesa: casa `L.nome` e confere
 * contra a lista de exportadas. É a mesma pergunta pelo outro lado do ponto.
 */
const chamadasNoHarness = (nomes, textos) => {
  const s = new Set();
  for (const t of textos) {
    for (const m of t.matchAll(/(?:^|[^\w$.])(?:L|LIB|M)\.([A-Za-z_$][\w$]*)/g)) if (nomes.has(m[1])) s.add(m[1]);
  }
  return s;
};

/** Importado da lib e nunca usado no corpo: importe morto. */
const importesMortos = (bruto, nomes) => {
  const imp = new Set();
  for (const m of bruto.matchAll(/import\s*\{([^}]*)\}\s*from\s*'[^']*combate-tempo';?/g)) {
    for (const n of m[1].split(',').map((s) => s.trim().replace(/^type\s+/, ''))) if (n) imp.add(n);
  }
  const corpo = semRuido(bruto);
  return [...imp].filter((n) => nomes.has(n) && !usa(corpo, n));
};

// ================================================================ a régua
/**
 * A LISTA DE HOJE, e ela é MEDIÇÃO e não declaração de escopo.
 *
 * A pergunta "este subconjunto é por decisão ou por sedimentação?" foi
 * respondida em 06/09/2026, e a resposta é **sedimentação** (a prova está no
 * `docs/simulacao/ESTADO.md`, e o índice dos itens no `Pendencias.md` L48).
 * Por isso esta lista é uma FILA e não um contrato: cada nome que sai daqui
 * porque o harness passou a chamá-lo é trabalho feito, e sair é o caminho
 * esperado de todos eles.
 *
 * NOMES, e nunca um número. Contar diria "eram 21 e agora são 22" sem dizer
 * qual, e é justamente o qual que decide se é buraco novo ou item fechado.
 */
const SO_DA_MESA = [
  'abortar', 'acaoVazia', 'adiaGolpe', 'anatomiaLivre', 'atrasarGesto',
  'comOverride', 'combateDaMesa', 'contrapeDe', 'contrapeEm', 'ehSimultaneo',
  'fita', 'foraDeHora', 'modoCorre', 'podeSerInterrompido', 'proximoGolpe',
  'resumoDaAcao', 'rolaNoSite', 'temGesto', 'tetoDaRajada',
  'ticksDeDeslocamento', 'ticksDeEntrada',
];

/**
 * Quem os DOIS chamam, e ela existe para o portão morder na direção contrária.
 *
 * Sem esta lista, apagar uma chamada do harness deixaria o portão VERDE: a
 * função sairia de "nos dois" e entraria em "só da mesa", e bastaria alguém
 * acrescentá-la à lista de cima para o vermelho sumir. O par é o que impede
 * que a cobertura encolha em silêncio.
 */
const NOS_DOIS = [
  'agendaSimultanea', 'agendar', 'anatomia', 'armaDoCatalogo', 'classeDeTempo',
  'decideEmValeDepois', 'decisaoAutomatica', 'declarar', 'defesaPerdida',
  'faseDeQuemVaiAgir', 'faseEm', 'golpeDaAgenda', 'golpeResolvido', 'golpesNoAr',
  'ordemDaFila', 'passoDoGolpe', 'preparoDe', 'reprojetarAgenda',
  'ticksDeViagem', 'velocidadeDaArma',
];

// ============================================================== a execução
const ler = (p) => fs.readFileSync(path.join(RAIZ, p), 'utf8');
const { todas, funcoes } = exportadasDe(ler(LIB));
const textosMesa = MESA.map((f) => semRuido(ler(f)));
const arqsHarness = fs.readdirSync(path.join(RAIZ, HARNESS)).filter((f) => f.endsWith('.mjs'));
const textosHarness = arqsHarness.map((f) => semRuido(ler(`${HARNESS}/${f}`)));

const mesa = chamadasNaMesa(todas, textosMesa);
const harness = chamadasNoHarness(todas, textosHarness);
const soMesa = [...mesa].filter((n) => !harness.has(n) && funcoes.has(n)).sort();
const soHarness = [...harness].filter((n) => !mesa.has(n)).sort();
const nosDois = [...mesa].filter((n) => harness.has(n)).sort();
const mortos = MESA.filter((f) => f.endsWith('.astro')).flatMap(
  (f) => importesMortos(ler(f), todas).map((n) => `${f}: ${n}`),
);

if (process.argv.includes('--lista')) {
  for (const n of soMesa) console.log(n);
  process.exit(0);
}

const falhas = [];
// FALHAR FECHADO: leitura que não achou nada é leitura quebrada, e não repositório limpo.
if (!todas.size) falhas.push(`não achei exportada nenhuma em ${LIB}: o portão está cego`);
if (!mesa.size) falhas.push('não achei chamada nenhuma da mesa: o portão está cego');
if (!harness.size) falhas.push('não achei chamada nenhuma do harness: o portão está cego');

const falta = (lista, tem, rot) => lista.filter((n) => !tem.includes(n)).map((n) => `${rot}: \`${n}\``);
falhas.push(...falta(SO_DA_MESA, soMesa, 'saiu da lista SO_DA_MESA sem a lista ser atualizada'));
falhas.push(...falta(soMesa, SO_DA_MESA, 'FUNÇÃO NOVA que a mesa chama e o harness não'));
falhas.push(...falta(NOS_DOIS, nosDois, 'DEIXOU de ser chamada pelos dois (a cobertura encolheu)'));
falhas.push(...falta(nosDois, NOS_DOIS, 'passou a ser chamada pelos dois e não está em NOS_DOIS'));
falhas.push(...mortos.map((m) => `importe morto: ${m}`));

// ============================================================== o autoteste
//
// CONTRA TEXTO SINTÉTICO, e é isto que o separa do controle positivo natural: a
// lista real de hoje prova que a busca acha ENQUANTO o repositório for este.
// Estas duas provas continuam valendo com o repositório inteiro consertado.
const LIB_FALSA = [
  'export function soANossa(a) { return a; }',
  'export function nosDois(a) { return a; }',
  'export const constante = 3;',
].join('\n');
const MESA_FALSA = 'const x = soANossa(1) + nosDois(2) + constante;';
const HARNESS_FALSO = 'const y = L.nosDois(2);';
{
  const e = exportadasDe(LIB_FALSA);
  const m = chamadasNaMesa(e.todas, [MESA_FALSA]);
  const h = chamadasNoHarness(e.todas, [HARNESS_FALSO]);
  const so = [...m].filter((n) => !h.has(n) && e.funcoes.has(n)).sort();
  // O CONTROLE POSITIVO: a divergência plantada tem de ser achada, e sozinha.
  // `constante` fica de fora por não ser função, que é a mesma regra da régua real.
  if (so.join(',') !== 'soANossa') falhas.push(`autoteste: a divergência plantada saiu como [${so}], e não [soANossa]`);
  // E O PAR: sem divergência, o portão tem de ficar quieto.
  const so2 = [...chamadasNaMesa(e.todas, ['const x = nosDois(2);'])]
    .filter((n) => !h.has(n) && e.funcoes.has(n));
  if (so2.length) falhas.push(`autoteste: acusou [${so2}] num corpus sem divergência nenhuma`);
  // E o espalhamento: `...nome` é uso, e foi o falso positivo do desenho.
  if (importesMortos("import { nosDois } from '../../lib/combate-tempo';\nconst z = { ...nosDois };", e.todas).length) {
    falhas.push('autoteste: `...nome` voltou a contar como importe morto');
  }
}

// ================================================================= o placar
console.log(`\n· ${LIB}: ${todas.size} exportadas (${funcoes.size} funções, ${todas.size - funcoes.size} constantes)`);
console.log(`  mesa ${mesa.size} · harness ${harness.size} · nos dois ${nosDois.length}`
  + ` · só o harness ${soHarness.length} · só a mesa ${soMesa.length} funções`);
console.log(`\n  AS FUNÇÕES QUE A MESA CHAMA E O HARNESS NÃO (Pendencias.md L48):`);
for (const n of soMesa) console.log(`    ${n}`);
if (soHarness.length) console.log(`\n  só o harness: ${soHarness.join(', ')}`);

if (falhas.length) {
  console.log(`\n✘✘✘ ${falhas.length} divergência(s) entre a régua e a árvore:`);
  for (const f of falhas) console.log(`     ${f}`);
  console.log('\n     Se a mudança é legítima, a lista deste arquivo é que se atualiza,');
  console.log('     e o item correspondente do `Pendencias.md` L48 se fecha junto.');
  process.exit(1);
}
console.log('\n✓ a fronteira entre a mesa e o harness é a que está escrita aqui');
