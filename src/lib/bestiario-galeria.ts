// Lê o índice das imagens do bestiário do disco e responde, por criatura, o que o carrossel
// mostra. SÓ roda no build (frontmatter das páginas .astro): usa `node:fs`.
//
// Três tolerâncias, por decisão do prompt 056-imagens (item 9) e da conferência da Revisora:
//  - `src/data/bestiario-imagens.json` ausente: o site segue como antes, sem carrossel;
//  - arquivo do índice ilegível ou com JSON inválido: lido com try/catch, vale como ausente
//    (a `import.meta.glob` do Vite derrubaria o build com um JSON quebrado, por isso o índice
//    é lido aqui com `fs`, e não importado);
//  - arquivo do índice que não está na pasta da galeria: a entrada cai, e a criatura com menos
//    de duas imagens válidas fica sem carrossel.
//
// Dois ganchos de ambiente, só para o smoke do carrossel rodar com o conjunto real presente
// (`scripts/test-galeria-bestiario.mjs`); em produção ficam sem valor e valem os padrões:
//  - BESTIARIO_GALERIA_DIR: NOME da pasta dentro de `public/` (padrão `bestiario-galeria`);
//  - BESTIARIO_GALERIA_INDICE: caminho do índice (padrão `src/data/bestiario-imagens.json`).
import fs from 'node:fs';
import path from 'node:path';
import { lerIndice, imagensDe, type ImagensDaCriatura } from './bestiario-imagens';

/** O nome da pasta dos webp dentro de `public/` (e, portanto, o trecho da URL). */
export const NOME_PASTA_GALERIA = (process.env.BESTIARIO_GALERIA_DIR || 'bestiario-galeria').replace(/[\/]+/g, '');
const ARQUIVO_INDICE = path.resolve(process.cwd(), process.env.BESTIARIO_GALERIA_INDICE || path.join('src', 'data', 'bestiario-imagens.json'));

function lerArquivoIndice(): unknown {
  try { return JSON.parse(fs.readFileSync(ARQUIVO_INDICE, 'utf8')); } catch { return {}; }
}
const INDICE = lerIndice(lerArquivoIndice());

/** A pasta dos webp no repositório (a que o `scripts/sync-bestiario-imagens.mjs` preenche). */
export const PASTA_GALERIA = path.join(process.cwd(), 'public', NOME_PASTA_GALERIA);
const existe = (arquivo: string) => fs.existsSync(path.join(PASTA_GALERIA, arquivo));

/** As imagens do carrossel da criatura, ou `null` quando ela não tem duas (carrossel só com 2 ou mais). */
export function galeriaDe(id: string): ImagensDaCriatura | null {
  const g = imagensDe(INDICE, id, { existe });
  return g.total >= 2 ? g : null;
}
