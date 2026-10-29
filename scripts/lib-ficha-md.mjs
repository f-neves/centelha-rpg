// lib-ficha-md.mjs · o leitor da ficha .md de criatura (tmp/arquiteto/bestiario/fichas-v3/), sem conta nenhuma.
//
// Lê o que a ficha ESCREVE: as seções, as tabelas pelo nome da coluna, o número em negrito, o bloco de conferência.
// Não calcula, não escolhe e não completa: o que a ficha não diz fica de fora, e quem precisa do número pede ao motor
// (`src/lib/motor.ts`, plano-conversao.md, A2). É a base do gen-criaturas-esperado.mjs (A1) e do conversor novo (A3),
// para os dois lerem a ficha do mesmo jeito.
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const dado = (f) => JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data', f), 'utf8'));

/** Texto sem acento, minúsculo, com hífen no lugar do espaço: o id do livro a partir do nome. */
export const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** "1.009,15" ou "0,5" em número. */
export const numBR = (s) => Number(String(s).replace(/\./g, '').replace(',', '.').replace('−', '-'));

/** Tira as marcas de trabalho da célula: ◆ e `**[...]**`. */
export const semMarcas = (s) => String(s).replace(/\*\*\[[^\]]*\]\*\*/g, '').replace(/◆/g, '').trim();

/** Os números em negrito da célula, na ordem (`**12**`, `**1.009,15**`). */
export const negritos = (s) => [...String(s).matchAll(/\*\*([−-]?[\d.]+(?:,\d+)?)\*\*/g)].map((m) => numBR(m[1]));

const celulas = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim());

/** A ficha em seções (título → linhas) e tabelas (título → lista de objetos pela coluna do cabeçalho). */
export function lerFichaMd(texto) {
  const t = texto.replace(/\r\n/g, '\n');
  const titulo = (t.match(/^# (.*)$/m) || [])[1] || '';
  const secoes = {};
  for (const s of t.split(/^## /m).slice(1)) {
    const [tit, ...linhas] = s.split('\n');
    secoes[tit.trim()] = linhas;
  }
  const tabelas = {};
  for (const [nome, linhas] of Object.entries(secoes)) {
    const tl = linhas.filter((l) => l.startsWith('|'));
    if (tl.length < 2) continue;
    const cab = celulas(tl[0]);
    tabelas[nome] = tl.slice(1).filter((l) => !/^\|\s*:?-/.test(l)).map((l) => {
      const c = celulas(l), o = {};
      cab.forEach((k, i) => { o[k] = c[i] ?? ''; });
      return o;
    });
  }
  const bl = t.match(/\{"v3":(\{[^}]*\})\}/);
  return { titulo, secoes, tabelas, bloco: bl ? JSON.parse(bl[1]) : null };
}

/** A linha de uma tabela Campo/Valor pelo começo do Campo ("Peso erguido" casa "Peso erguido (o que ergue...)"). */
export function campo(tabela, nome) {
  const l = (tabela || []).find((r) => {
    const k = Object.values(r)[0] || '';
    return k === nome || k.startsWith(nome + ' (');
  });
  return l ? Object.values(l)[1] ?? '' : undefined;
}

// Os nomes do livro para id: Atributos, Habilidades (primárias e secundárias), Classes de ataque.
const ATRIBUTOS = Object.fromEntries(dado('atributos.json').map((a) => [a.nome, a.id]));
const HAB = Object.fromEntries(dado('habilidades.json').map((h) => [slug(h.nome), h.id]));
const SEC = Object.fromEntries(dado('habilidades-secundarias.json').map((h) => [slug(h.nome), h.id]));
export const idAtributo = (nome) => ATRIBUTOS[nome];
/** O id da Habilidade pelo nome da ficha, e se ela é secundária no catálogo; undefined quando o livro não a tem. */
export function idHabilidade(nome) {
  const s = slug(nome);
  if (HAB[s]) return { id: HAB[s], secundaria: false };
  if (SEC[s]) return { id: SEC[s], secundaria: true };
  return undefined;
}
