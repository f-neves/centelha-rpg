// A bancada: o site rodando com um banco de mentira.
//
// É a configuração de sempre, com dois desvios:
//   · `@supabase/supabase-js` vira `scripts/mesa-mock.mjs`, e com isso as abas da
//     mesa abrem sem login, sem mesa criada e sem tocar no banco de produção;
//   · a saída e o cache vão para fora de `dist/` e `.astro/`, que são
//     compartilhados (há duas instâncias trabalhando neste repositório).
//
// Serve a duas coisas: rodar `scripts/test-grid.mjs` (o smoke do tabuleiro) e
// abrir a mesa na mão para olhar uma cena grande sem montá-la no banco.
//
//   npx astro dev --config astro.bancada.mjs --port 4399
//   http://localhost:4399/centelha-rpg/mesa/grid?id=00000000-0000-4000-8000-0000000000aa&bench=30&cols=40&rows=30&nevoa=1
//
// Os parâmetros da cena estão documentados em scripts/mesa-mock.mjs.
//
// Um efeito colateral conhecido: rodar por aqui reescreve `.astro/types.d.ts`,
// que é do projeto e não da bancada, e com isso o `tsc` passa a reclamar de
// `astro:content` e afins. `npx astro sync` põe de volta. Não vale um desvio a
// mais na configuração: é uma pasta gerada, e o conserto é um comando.
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const AQUI = fileURLToPath(new URL('.', import.meta.url));
const BASE = '/centelha-rpg';

export default defineConfig({
  site: 'https://f-neves.github.io',
  base: BASE + '/',
  trailingSlash: 'ignore',
  outDir: AQUI + '.bancada/dist',
  cacheDir: AQUI + '.bancada/cache',
  build: { format: 'directory' },
  markdown: { shikiConfig: { theme: 'css-variables' } },
  // Sem sitemap e sem PWA: a bancada não publica nada, e o service worker só
  // atrapalharia um teste (ele guarda a página velha entre voltas).
  integrations: [],
  vite: {
    resolve: {
      alias: [{ find: /^@supabase\/supabase-js$/, replacement: AQUI + 'scripts/mesa-mock.mjs' }],
    },
  },
});
