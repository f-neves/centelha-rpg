// Os diagramas dos capítulos, desenhados no BUILD e não no navegador de quem lê.
//
// O PROBLEMA
// Um capítulo do livro (`qual-sistema.md`) tem seis fluxogramas em mermaid, e
// eles custavam 3,0 MB de JavaScript no `dist/`: o mermaid arrasta cytoscape,
// katex, dagre e um módulo por tipo de diagrama, e o empacotador não tem como
// saber que só um deles é usado. O carregamento era sob demanda, então quem lia
// os outros 21 capítulos não pagava nada; quem lia ESTE baixava ~700 KB
// comprimidos para ver seis caixas com setas que nunca mudam.
//
// A SAÍDA
// O desenho é sempre o mesmo, então ele é feito uma vez, aqui, e guardado como
// SVG em `src/data/diagramas.json`. A página entrega o SVG pronto e não carrega
// biblioteca nenhuma. O mermaid vira dependência de desenvolvimento.
//
// E O TEMA?
// O site tem três temas e ainda deixa o leitor trocar as cores. Um SVG com cor
// gravada perderia isso. Por isso o desenho é feito com CORES-SENTINELA (#f00001
// para o fundo, #f00002 para o painel, e assim por diante) e, no fim, cada
// sentinela é trocada pela variável CSS correspondente. O SVG sai falando
// `var(--bg)`, `var(--ink)`, `var(--accent)`, e segue o tema como qualquer outro
// pedaço da página, inclusive as cores personalizadas.
//
//   node scripts/gen-mermaid.mjs           # redesenha e grava
//   node scripts/gen-mermaid.mjs --check   # falha se algum diagrama está velho
//
// O `--check` roda no portão, no mesmo espírito do gen-grid-artes: mexeu no
// diagrama e esqueceu de redesenhar, o build para e diz isso.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const CAPS = path.join(ROOT, 'src/content/chapters');
const SAIDA = path.join(ROOT, 'src/data/diagramas.json');
const MERMAID = path.join(ROOT, 'node_modules/mermaid/dist/mermaid.min.js');
const CHECK = process.argv.includes('--check');

/** As cores que o mermaid recebe, e a variável do site que cada uma vira depois. */
const SENTINELAS = {
  '#f00001': 'var(--bg)',
  '#f00002': 'var(--panel)',
  '#f00003': 'var(--ink)',
  '#f00004': 'var(--accent)',
  '#f00005': 'var(--panel-2, var(--panel))',
  '#f00006': 'var(--bg-soft, var(--bg))',
  '#f00007': 'var(--accent-soft, var(--accent))',
};
const TEMA = {
  background: '#f00001',
  primaryColor: '#f00002',
  primaryTextColor: '#f00003',
  primaryBorderColor: '#f00004',
  secondaryColor: '#f00005',
  tertiaryColor: '#f00006',
  lineColor: '#f00007',
  textColor: '#f00003',
  mainBkg: '#f00002',
  nodeBorder: '#f00004',
  clusterBkg: '#f00006',
  edgeLabelBackground: '#f00006',
  // O mermaid deriva tons destes quando não são informados, e o derivado sairia
  // com cor gravada. Informar todos mantém tudo em cima das sentinelas.
  secondaryTextColor: '#f00003',
  tertiaryTextColor: '#f00003',
  secondaryBorderColor: '#f00004',
  tertiaryBorderColor: '#f00004',
  nodeTextColor: '#f00003',
  titleColor: '#f00003',
  edgeLabelColor: '#f00003',
  clusterBorder: '#f00004',
  defaultLinkColor: '#f00007',
  labelBoxBkgColor: '#f00002',
  labelBoxBorderColor: '#f00004',
  labelTextColor: '#f00003',
};

const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

// ------------------------------------------------- colher os blocos dos .md
const blocos = [];
for (const f of fs.readdirSync(CAPS).filter((x) => x.endsWith('.md'))) {
  const txt = fs.readFileSync(path.join(CAPS, f), 'utf8');
  for (const m of txt.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)) {
    const fonte = m[1].replace(/\r\n/g, '\n').trimEnd();
    blocos.push({ cap: f, fonte, id: hash(fonte) });
  }
}

const velho = fs.existsSync(SAIDA) ? JSON.parse(fs.readFileSync(SAIDA, 'utf8')) : {};
const faltam = blocos.filter((b) => !velho[b.id]);
const sobram = Object.keys(velho).filter((k) => !blocos.some((b) => b.id === k));

if (CHECK) {
  if (!faltam.length && !sobram.length) {
    console.log(`✓ diagramas em dia · ${blocos.length} desenhos`);
    process.exit(0);
  }
  console.error('✘ Diagramas fora de dia:');
  for (const b of faltam) console.error(`  • sem desenho: ${b.cap} (${b.id}) — ${b.fonte.split('\n')[0]}`);
  for (const k of sobram) console.error(`  • desenho órfão: ${k}`);
  console.error('\n  Rode: node scripts/gen-mermaid.mjs');
  process.exit(1);
}

if (!blocos.length) {
  fs.writeFileSync(SAIDA, '{}\n');
  console.log('✓ nenhum diagrama nos capítulos');
  process.exit(0);
}

// -------------------------------------------------------- desenhar de fato
const puppeteer = (await import('puppeteer-core')).default;
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
if (!fs.existsSync(EDGE)) {
  console.error(`✘ Navegador não encontrado em ${EDGE}. Defina EDGE=<caminho do msedge/chrome>.`);
  process.exit(2);
}

const lib = fs.readFileSync(MERMAID, 'utf8');
// A FONTE precisa ser a mesma da página final, e não uma parecida.
//
// Com `htmlLabels: false` o mermaid escreve o texto em <text> e MEDE cada
// palavra para dimensionar a caixa em volta. Medindo com uma fonte e desenhando
// com outra, o texto sai maior que a caixa e vaza pela borda: foi exatamente o
// que aconteceu na primeira tentativa, com a página de desenho caindo no serif
// do sistema.
const FONTE = path.join(ROOT, 'node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff2');
const fonte = fs.readFileSync(FONTE);
const srv = http.createServer((req, res) => {
  if (req.url === '/mermaid.js') {
    res.writeHead(200, { 'content-type': 'text/javascript' });
    return res.end(lib);
  }
  if (req.url === '/fonte.woff2') {
    res.writeHead(200, { 'content-type': 'font/woff2' });
    return res.end(fonte);
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><meta charset="utf-8">
    <style>@font-face{font-family:'EB Garamond';src:url('/fonte.woff2') format('woff2');font-weight:400;font-display:block}
      body{font-family:'EB Garamond',Georgia,serif}</style>
    <body><script src="/mermaid.js"></script>`);
});
await new Promise((r) => srv.listen(0, r));
const porta = srv.address().port;

const br = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
const pg = await br.newPage();
await pg.goto(`http://localhost:${porta}/`, { waitUntil: 'networkidle0' });
await pg.evaluate(() => document.fonts.load("16px 'EB Garamond'").then(() => document.fonts.ready));

const novo = {};
for (const b of blocos) {
  const svg = await pg.evaluate(async (fonte, tema, id) => {
    // eslint-disable-next-line no-undef
    const mermaid = window.mermaid;
    mermaid.initialize({
      startOnLoad: false, securityLevel: 'strict', theme: 'base',
      fontFamily: "'EB Garamond', Georgia, serif", themeVariables: tema,
      flowchart: { useMaxWidth: true, htmlLabels: false },
    });
    const { svg } = await mermaid.render('d' + id, fonte);
    return svg;
  }, b.fonte, TEMA, b.id);
  novo[b.id] = limpar(svg);
  console.log(`  ${b.cap} · ${b.id} · ${(novo[b.id].length / 1024).toFixed(1)} KB`);
}
await br.close();
srv.close();

/** Troca as sentinelas por variáveis do site e tira o que não serve no HTML. */
function limpar(svg) {
  let s = svg;
  // O mermaid grava a largura no atributo e deixa a altura solta; aqui a figura
  // se ajusta à coluna do texto, como as tabelas do capítulo.
  s = s.replace(/<svg /, '<svg class="diagrama" ');
  // O `id` do <svg> FICA. O mermaid escopa a folha interna por ele
  // (`#d1e2f… .node rect { fill: … }`), e tirá-lo derrubava todas as regras de
  // uma vez: as caixas voltavam ao `fill` inicial do SVG, que é preto sólido.
  s = s.replace(/style="max-width:[^"]*"/g, 'style="max-width:100%"');
  for (const [sent, varr] of Object.entries(SENTINELAS)) {
    s = s.replaceAll(sent, varr);
    s = s.replaceAll(sent.toUpperCase(), varr);
  }
  return s;
}

// Conferência: sobrou cor gravada? Vale como aviso, não como falha: o mermaid
// desenha alguns detalhes (a ponta da seta, por exemplo) com cor própria.
const restos = new Map();
for (const s of Object.values(novo)) {
  for (const m of s.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) restos.set(m[0], (restos.get(m[0]) || 0) + 1);
}
fs.writeFileSync(SAIDA, JSON.stringify(novo, null, 1) + '\n');
const peso = Object.values(novo).reduce((n, s) => n + s.length, 0);
console.log(`\n✓ ${blocos.length} diagramas · ${(peso / 1024).toFixed(0)} KB de SVG em src/data/diagramas.json`);
if (restos.size) {
  console.log('  cores ainda gravadas (não seguem o tema): '
    + [...restos].sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c}×${n}`).join(' '));
}
