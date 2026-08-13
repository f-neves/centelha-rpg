// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const BASE = '/centelha-rpg';

// Troca cada bloco ```mermaid``` pelo SVG já desenhado, ANTES do shiki (senão o realce de
// código estragaria a sintaxe do diagrama).
//
// O desenho é feito no build por `scripts/gen-mermaid.mjs` e guardado em
// `src/data/diagramas.json`, com a chave sendo o hash do próprio código do diagrama. Antes
// isto virava `<pre class="mermaid">` e o mermaid desenhava no navegador de quem lia, o que
// custava 3,0 MB de JavaScript no dist (o pacote arrasta cytoscape, katex, dagre e um módulo
// por tipo de diagrama) para seis caixas com setas que nunca mudam.
//
// Bloco sem desenho guardado vira um aviso visível em vez de sumir: `gen-mermaid.mjs --check`
// roda no portão e já teria barrado, então chegar aqui é sinal de que alguém pulou o portão.
function remarkMermaid() {
  const arquivo = new URL('./src/data/diagramas.json', import.meta.url);
  const DIAGRAMAS = existsSync(arquivo) ? JSON.parse(readFileSync(arquivo, 'utf8')) : {};
  /** @param {string} s */
  const chave = (s) => createHash('sha1').update(s.replace(/\r\n/g, '\n').trimEnd()).digest('hex').slice(0, 12);
  /** @param {any} node */
  const walk = (node) => {
    if (node.type === 'code' && node.lang === 'mermaid') {
      const svg = DIAGRAMAS[chave(node.value)];
      node.type = 'html';
      node.value = svg
        ? `<figure class="diagrama-caixa">${svg}</figure>`
        : '<p class="erro">Diagrama sem desenho gravado. Rode <code>node scripts/gen-mermaid.mjs</code>.</p>';
      node.lang = undefined;
      node.meta = undefined;
    }
    (node.children || []).forEach(walk);
  };
  return (/** @type {any} */ tree) => walk(tree);
}

// Envolve toda <table> da prosa num <div class="table-wrap"> (que tem overflow-x: auto).
// Sem isso, a largura intrínseca da tabela empurra o documento inteiro e o celular ganha
// rolagem horizontal. Antes o wrapper era escrito à mão em cada .md — e faltava em vários.
// Pula quem já está envolvido, para os wrappers manuais existentes não duplicarem.
function rehypeTableWrap() {
  /** @param {any} n */
  const ehWrap = (n) =>
    n && n.type === 'element' && n.tagName === 'div'
    && String(n.properties?.className || '').includes('table-wrap');
  /** @param {any} node */
  const walk = (node) => {
    const filhos = node.children || [];
    for (let i = 0; i < filhos.length; i++) {
      const f = filhos[i];
      if (f.type === 'element' && f.tagName === 'table' && !ehWrap(node)) {
        filhos[i] = {
          type: 'element', tagName: 'div',
          properties: { className: ['table-wrap'] },
          children: [f],
        };
      }
      walk(filhos[i]);
    }
  };
  return (/** @type {any} */ tree) => walk(tree);
}

// Prefixa o base do site em links root-relativos da prosa (markdown) → sem 404 no Pages.
function rehypeBaseLinks() {
  /** @param {any} node */
  const walk = (node) => {
    if (node.tagName === 'a' && node.properties && typeof node.properties.href === 'string') {
      const h = node.properties.href;
      if (h.startsWith('/') && !h.startsWith('//') && !h.startsWith(BASE + '/') && h !== BASE) {
        node.properties.href = BASE + h;
      }
    }
    (node.children || []).forEach(walk);
  };
  return (/** @type {any} */ tree) => walk(tree);
}

export default defineConfig({
  site: 'https://f-neves.github.io',
  base: BASE + '/',
  trailingSlash: 'ignore',
  // O capítulo XV virou três páginas; quem tinha /artes salvo cai na primeira delas.
  // (o destino leva o base na mão: o Astro não o prefixa no valor do redirect)
  redirects: { '/artes': BASE + '/artes/regras' },
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'css-variables' },
    remarkPlugins: [remarkMermaid],
    rehypePlugins: [rehypeBaseLinks, rehypeTableWrap],
  },
  integrations: [
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      // Service worker "self-destroying": remove qualquer SW antigo preso e limpa os caches
      // nos aparelhos ao abrir o site (resolve versoes velhas travadas). Sem PWA/offline por ora.
      selfDestroying: true,
      manifest: {
        name: 'Centelha',
        short_name: 'Centelha D6',
        description: 'Sistema de RPG de mesa em d6, do mortal ao semideus.',
        lang: 'pt-BR',
        // Cores do fundo do ícone. As antigas (azul #1f3f8f e creme #f3e9d2)
        // vinham do d6 azul e faziam a splash abrir creme para entregar um ícone
        // escuro.
        theme_color: '#15171c',
        background_color: '#15171c',
        display: 'standalone',
        // Os PNGs são rasterizados de D&D/favicon/centelha_teste2.svg.
        //
        // O "-v2" no nome não é enfeite: launcher e navegador guardam o ícone pelo
        // NOME do arquivo, então trocar só o conteúdo deixa o desenho velho grudado
        // em quem já instalou. Mudou o desenho, muda o nome.
        //
        // O maskable é arquivo à parte porque precisa de fundo opaco e de caber na
        // zona segura (círculo de raio 40% do lado). Detalhe da conta no gerador.
        icons: [
          { src: 'icon-192-v2.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512-v2.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512-v2.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{html,js,css,json,svg,png,woff,woff2}'],
        navigateFallback: null,
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          { urlPattern: ({ url }) => url.pathname.includes('/pagefind/'), handler: 'StaleWhileRevalidate', options: { cacheName: 'pagefind' } },
        ],
      },
    }),
  ],
});
