// gera-marca-gif.mjs — fotografa o ciclo da faísca da marca e monta os GIFs de
// marca/. Roda à mão, não entra no build: precisa do Edge e do ffmpeg, e a saída
// é binária.
//
//   node scripts/gera-marca-gif.mjs [pasta-de-saida]
//   EDGE=<caminho do msedge/chrome> node scripts/gera-marca-gif.mjs
//
// A geometria vem de src/lib/centelha-spark.ts (VALE e PICO), lida do arquivo em
// vez de copiada, para o GIF não descolar do site quando alguém mexer no desenho.
//
// Cada quadro é congelado em DOIS relógios, porque a faísca tem dois: a forma e a
// escala rodam em SMIL (setCurrentTime + pauseAnimations) e o brilho roda em CSS
// (animation-delay negativo + animation-play-state paused). Parar só um deles
// rende um quadro com a forma de um instante e o brilho de outro.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const SAIDA = process.argv[2] || path.join(RAIZ, 'marca');

const LADO = 512;   // caixa quadrada do GIF
const ALTURA = 400; // altura da faísca dentro dela; o resto é a folga da aura
const QUADROS = 100;
const DUR = 5;      // segundos do ciclo, o mesmo do componente

// --- geometria, lida da fonte ---------------------------------------------
const ts = fs.readFileSync(path.join(RAIZ, 'src/lib/centelha-spark.ts'), 'utf8');
const pega = (nome) => {
  const m = ts.match(new RegExp(`export const ${nome} =\\s*([\\s\\S]*?);\\n`));
  if (!m) throw new Error(`não achei ${nome} em src/lib/centelha-spark.ts`);
  return [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]).join('');
};
const VALE = pega('VALE');
const PICO = pega('PICO');
const VIEWBOX = pega('VIEWBOX');

// --- as três versões -------------------------------------------------------
// As cores saem dos tokens de global.css: --gold do tema claro (#b08d3a) e do
// escuro (#d9b85f), o petróleo --accent-strong (#0B3B47) e o pergaminho --bg.
const VERSOES = [
  // Sem fundo a aura sai: GIF só tem transparência de 1 bit, então um brilho que
  // esmaece viraria halo de borda dura. Fica a silhueta limpa.
  { nome: 'centelha-transparente', fundo: null, cor: '#b08d3a', aura: false },
  { nome: 'centelha-azul', fundo: '#0B3B47', cor: '#d9b85f', aura: true },
  { nome: 'centelha-claro', fundo: '#f3e9d2', cor: '#b08d3a', aura: true },
];

const pagina = (v) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:${v.fundo ?? 'transparent'}}
  #box{width:${LADO}px;height:${LADO}px;display:flex;align-items:center;justify-content:center;
       background:${v.fundo ?? 'transparent'}}
  svg{height:${ALTURA}px;width:auto;overflow:visible;color:${v.cor};
      animation:respiro ${DUR}s cubic-bezier(.4,0,.6,1) infinite}
  @keyframes respiro{
    0%,100%{filter:brightness(1)${v.aura ? ' drop-shadow(0 0 0 currentColor)' : ''}}
    50%{filter:brightness(1.18)${v.aura ? ' drop-shadow(0 0 .128em currentColor)' : ''}}
  }
</style></head><body><div id="box">
  <svg id="fa" viewBox="${VIEWBOX}" fill="currentColor">
    <g transform="translate(512 512)"><g>
      <animateTransform attributeName="transform" type="scale" values="0.96;1;0.96"
        dur="${DUR}s" repeatCount="indefinite" calcMode="spline"
        keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
      <g transform="translate(-512 -512)"><path d="${PICO}">
        <animate attributeName="d" values="${VALE};${PICO};${VALE}"
          dur="${DUR}s" repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
      </path></g>
    </g></g>
  </svg>
</div></body></html>`;

const ff = (args) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args]);

if (!fs.existsSync(EDGE)) {
  console.error(`✘ navegador não encontrado em ${EDGE}. Use EDGE=<caminho do msedge.exe>.`);
  process.exit(2);
}

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'marca-gif-'));
fs.mkdirSync(SAIDA, { recursive: true });
const br = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
try {
  for (const v of VERSOES) {
    const dir = path.join(TMP, v.nome);
    fs.mkdirSync(dir, { recursive: true });

    const p = await br.newPage();
    await p.setViewport({ width: LADO, height: LADO, deviceScaleFactor: 1 });
    await p.setContent(pagina(v), { waitUntil: 'load' });
    const caixa = await p.$('#box');

    for (let i = 0; i < QUADROS; i++) {
      const t = (i * DUR) / QUADROS;
      await p.evaluate((t) => {
        const s = document.getElementById('fa');
        s.setCurrentTime(t);
        s.pauseAnimations();
        s.style.animationDelay = `-${t}s`;
        s.style.animationPlayState = 'paused';
      }, t);
      await caixa.screenshot({
        path: path.join(dir, `f${String(i).padStart(3, '0')}.png`),
        omitBackground: v.fundo === null,
      });
    }
    await p.close();

    const gif = path.join(SAIDA, v.nome + '.gif');
    // stats_mode=diff: a paleta sai do que MUDA entre os quadros, que é a faísca,
    // e não do fundo chapado, que ocupa a maior parte da imagem.
    const filtro = v.fundo === null
      ? '[0:v]split[a][b];[a]palettegen=reserve_transparent=1:stats_mode=diff[p];'
        + '[b][p]paletteuse=alpha_threshold=128:dither=bayer:bayer_scale=3'
      : '[0:v]split[a][b];[a]palettegen=stats_mode=diff[p];'
        + '[b][p]paletteuse=dither=bayer:bayer_scale=3';
    ff([
      '-framerate', String(QUADROS / DUR),
      '-i', path.join(dir, 'f%03d.png'),
      '-filter_complex', filtro,
      '-loop', '0',
      gif,
    ]);
    console.log(`${v.nome}.gif  ${(fs.statSync(gif).size / 1024).toFixed(0)} KB`);
  }
} finally {
  await br.close();
  fs.rmSync(TMP, { recursive: true, force: true });
}
console.log('→ ' + SAIDA);
