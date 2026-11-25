// Lê o índice das imagens do bestiário do disco e responde, por criatura, o que o carrossel
// mostra. SÓ roda no build (frontmatter das páginas .astro): usa `node:fs`.
//
// Duas tolerâncias, por decisão do prompt 056-imagens (item 9):
//  - `src/data/bestiario-imagens.json` ausente: a `import.meta.glob` devolve `{}` e o site
//    segue como antes, sem carrossel (um `import` direto quebraria o build);
//  - arquivo do índice que não está em `public/bestiario-galeria/`: a entrada cai, e a
//    criatura com menos de duas imagens válidas fica sem carrossel.
import fs from 'node:fs';
import path from 'node:path';
import { lerIndice, imagensDe, type ImagensDaCriatura } from './bestiario-imagens';

const achados = import.meta.glob('../data/bestiario-imagens.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const INDICE = lerIndice(Object.values(achados)[0]);

/** A pasta dos webp no repositório (a que o `scripts/sync-bestiario-imagens.mjs` preenche). */
export const PASTA_GALERIA = path.join(process.cwd(), 'public', 'bestiario-galeria');
const existe = (arquivo: string) => fs.existsSync(path.join(PASTA_GALERIA, arquivo));

/** As imagens do carrossel da criatura, ou `null` quando ela não tem duas (carrossel só com 2 ou mais). */
export function galeriaDe(id: string): ImagensDaCriatura | null {
  const g = imagensDe(INDICE, id, { existe });
  return g.total >= 2 ? g : null;
}
