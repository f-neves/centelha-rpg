// @ts-check
import { defineConfig } from 'astro/config';

const BASE = '/centelha-rpg';

// Prefixa o base do site em links root-relativos (ex.: /ficha → /centelha-rpg/ficha)
// usados na prosa em markdown, para não dar 404 no GitHub Pages.
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
    rehypePlugins: [rehypeBaseLinks],
  },
});
