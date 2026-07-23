// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

const BASE = '/centelha-rpg';

// Converte blocos ```mermaid``` em <pre class="mermaid">…</pre> ANTES do shiki, para o realce de
// código não estragar a sintaxe do diagrama. O mermaid.run() (no cliente) lê o textContent, então
// escapamos &<> para o navegador devolver o texto exato.
function remarkMermaid() {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const walk = (node) => {
    if (node.type === 'code' && node.lang === 'mermaid') {
      node.type = 'html';
      node.value = `<pre class="mermaid">${esc(node.value)}</pre>`;
      node.lang = undefined;
      node.meta = undefined;
    }
    (node.children || []).forEach(walk);
  };
  return (tree) => walk(tree);
}

// Prefixa o base do site em links root-relativos da prosa (markdown) → sem 404 no Pages.
function rehypeBaseLinks() {
  const walk = (node) => {
    if (node.tagName === 'a' && node.properties && typeof node.properties.href === 'string') {
      const h = node.properties.href;
      if (h.startsWith('/') && !h.startsWith('//') && !h.startsWith(BASE + '/') && h !== BASE) {
        node.properties.href = BASE + h;
      }
    }
    (node.children || []).forEach(walk);
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site: 'https://f-neves.github.io',
  base: BASE + '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'css-variables' },
    remarkPlugins: [remarkMermaid],
    rehypePlugins: [rehypeBaseLinks],
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
        theme_color: '#1f3f8f',
        background_color: '#f3e9d2',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
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
