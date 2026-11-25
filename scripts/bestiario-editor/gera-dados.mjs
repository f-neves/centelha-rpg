// gera-dados.mjs · os dados do editor de fichas, a partir da FONTE ÚNICA das criaturas: src/data/bestiario/*.json (B3, T12 do autor).
//
//   node scripts/bestiario-editor/gera-dados.mjs                 grava tmp/arquiteto/bestiario/editor/fichas-dados.json
//   node scripts/bestiario-editor/gera-dados.mjs --saida <arq>   grava em outro arquivo (os testes usam)
//   node scripts/bestiario-editor/gera-dados.mjs --check         confere que o arquivo gravado está em dia (não escreve)
//
// O arquivo é uma LISTA, uma entrada por criatura, ordenada pelo id:
//   { id, titulo, categorias: [categoria], nome, nomeIngles, criatura: <o JSON do site, inteiro e sem mudar nada> }
// `id` e `titulo` são o CONTRATO com a Curadora (tmp/curadora/scripts/bestiario_index.py lê `id` e `titulo`, e tira os parênteses do
// título para a legenda curta): o título é "Nome" ou "Nome (Nome em inglês)", quando o nome em inglês é outro. Não renomeie esses dois.
// Sem data nem hora dentro, para o arquivo ser reproduzível. O editor antigo (fichas-v3, .md) guardava aqui as seções do .md; elas
// saíram, e quem as lia (o editor antigo, que embute os dados no próprio HTML) não depende deste arquivo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PASTA = path.join(RAIZ, 'src', 'data', 'bestiario');

/** O caminho do arquivo da Curadora: o primeiro ancestral da árvore que tem tmp/arquiteto/bestiario/editor (a árvore pode estar em tmp/executora/). */
export function caminhoPadrao() {
  for (let d = RAIZ; ; d = path.dirname(d)) {
    const c = path.join(d, 'tmp', 'arquiteto', 'bestiario', 'editor');
    if (fs.existsSync(c)) return path.join(c, 'fichas-dados.json');
    if (path.dirname(d) === d) return path.join(RAIZ, '..', 'tmp', 'arquiteto', 'bestiario', 'editor', 'fichas-dados.json');
  }
}

export function tituloDe(c) {
  const ing = String(c.nomeIngles || '').trim();
  return ing && ing !== c.nome ? `${c.nome} (${ing})` : c.nome;
}

/** A lista do editor, lida de `pasta` (padrão: src/data/bestiario). */
export function gerarLista(pasta = PASTA) {
  const arquivos = fs.readdirSync(pasta).filter((f) => f.endsWith('.json')).sort();
  return arquivos.map((f) => {
    const c = JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8'));
    if (f !== c.id + '.json') throw new Error(`id diferente do arquivo: ${f}`);
    return { id: c.id, titulo: tituloDe(c), categorias: c.categoria ? [c.categoria] : [], nome: c.nome, nomeIngles: c.nomeIngles ?? null, criatura: c };
  });
}

export const texto = (lista) => JSON.stringify(lista, null, 1) + '\n';

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--saida');
  const saida = path.resolve(i >= 0 ? args[i + 1] : caminhoPadrao());
  const novo = texto(gerarLista());
  if (args.includes('--check')) {
    const atual = fs.existsSync(saida) ? fs.readFileSync(saida, 'utf8') : '';
    if (atual !== novo) { console.error(`✘ ${saida} não está em dia com src/data/bestiario: rode node scripts/bestiario-editor/gera-dados.mjs`); process.exit(1); }
    console.log(`✓ fichas-dados.json em dia (${gerarLista().length} criaturas)`);
  } else {
    // a primeira vez que troca o formato antigo (seções do .md), guarda o de antes ao lado, como o editor sempre fez
    if (fs.existsSync(saida)) {
      try {
        const velho = JSON.parse(fs.readFileSync(saida, 'utf8'));
        if (Array.isArray(velho) && velho[0] && 'secoes' in velho[0]) {
          const copia = saida.replace(/\.json$/, '-antes-fonte-unica-2026-11-25.json');
          if (!fs.existsSync(copia)) fs.copyFileSync(saida, copia);
        }
      } catch { /* arquivo ilegível: será sobrescrito */ }
    }
    fs.mkdirSync(path.dirname(saida), { recursive: true });
    fs.writeFileSync(saida, novo, 'utf8');
    console.log(`✓ ${saida}: ${JSON.parse(novo).length} criaturas (${(novo.length / 1048576).toFixed(1)} MB)`);
  }
}
