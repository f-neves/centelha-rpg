// test-exemplos-criacao.mjs · a coluna de XP dos quatro exemplos fecha com o Total.
//
// O capítulo da criação traz quatro personagens prontos (Kael, Sora, Veil e
// Bram), cada um numa tabela de compras com uma coluna de XP e uma linha de
// Total. Nada prendia a soma ao Total, e o capítulo é escrito à MÃO: nenhum
// script o gera.
//
// O defeito que isto existe para pegar é concreto e acabou de acontecer. Até a
// `M-28` os quatro eram humanos SEM DIZER que eram: a ficha cobra de 20 a 50 XP
// de raça (`ficha-engine.ts`, o `xr` entra no total), o passo a passo não tinha
// passo de raça, e os totais fechavam porque o Humano custa 0. Estavam certos
// POR ACIDENTE. A `M-28` pôs a linha `Raça | Humano | 0` nos quatro, e daqui em
// diante trocar a raça de um exemplo por uma que custe 30 e esquecer o Total
// fica vermelho aqui.
//
// O QUE ESTE PORTÃO NÃO COBRE, e é importante não fingir que cobre:
//
//   · ele SOMA a coluna, e somar não olha para DENTRO de linha nenhuma. O
//     `A-03` (a linha de Técnicas não ser derivável por dentro em nenhum dos
//     quatro: não dá para reconstruir quais Proezas somam 450 no Kael) continua
//     aberto e este teste não diz nada sobre ele;
//   · ele não confere se os números batem com o que a FICHA calcularia. Isso é
//     o `test-kael.mjs`, e só para o Kael;
//   · ele não confere se o total cabe no orçamento declarado no título.
//
// Um teste que parece cobrir mais do que cobre é pior que nenhum, e por isso
// estas três linhas estão aqui e não numa conversa.
//
// Entra no `npm run validate`: lê um arquivo de texto e soma inteiros.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const cap = fs.readFileSync(path.join(ROOT, 'src/content/chapters/criacao-de-personagem.md'), 'utf8');
const RACAS = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/racas.json'), 'utf8'));

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m} · esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);

// --------------------------------------------- as tabelas, uma por exemplo
const linhas = cap.split('\n');
const exemplos = [];
let atual = null;
for (const l of linhas) {
  const m = /^### (.+)$/.exec(l);
  if (m) { atual = { titulo: m[1].trim(), compras: [], total: null }; exemplos.push(atual); continue; }
  if (!atual || !l.startsWith('|')) continue;
  const mt = /^\|\s*\*\*Total\*\*\s*\|\s*\|\s*\*\*(\d+)\*\*\s*\|/.exec(l);
  if (mt) { atual.total = Number(mt[1]); continue; }
  const mx = /^\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]+?)\s*\|\s*$/.exec(l);
  if (!mx || mx[1] === 'Compra' || /^-+$/.test(mx[1])) continue;
  // O DETALHE (a coluna do meio) é guardado, e não descartado: sem ele a
  // conferência da raça achava a primeira linha `| Raça |` do ARQUIVO em vez da
  // deste exemplo, e passava verde com o Kael virando Anão e pagando 0.
  // Aconteceu de verdade, no terceiro sentido do ensaio deste próprio teste.
  atual.compras.push({ nome: mx[1], detalhe: mx[2], xp: mx[3] });
}

const comTabela = exemplos.filter((e) => e.total != null);
eq(comTabela.length, 4, 'o capítulo tem de trazer QUATRO exemplos com tabela de compras e Total');

for (const e of comTabela) {
  const nome = e.titulo.split(',')[0];
  let soma = 0;
  for (const c of e.compras) {
    const v = c.xp.replace(/\*\*/g, '').trim();
    if (/^\d+$/.test(v)) { soma += Number(v); continue; }
    // "grátis" é a única palavra aceita no lugar de um número, e ela é da
    // Centelha, que por regra não custa XP (`regras.json → xp.centelha.tipo`).
    ok(v === 'grátis', `${nome}: a linha "${c.nome}" traz "${v}" na coluna de XP, que não é número nem "grátis"`);
  }
  eq(soma, e.total, `${nome}: a soma da coluna de XP não fecha com o Total declarado`);

  // ---- e a linha de RAÇA existe, com o custo que o dado dá àquela raça ----
  const raca = e.compras.find((c) => /^Ra[cç]a$/i.test(c.nome));
  ok(raca, `${nome}: não tem linha de Raça. A ficha COBRA raça no total (de 20 a 50 XP),`
    + ' e um exemplo sem a linha está certo só enquanto a raça escolhida for o Humano (`M-28`)');
  if (raca) {
    const v = raca.xp.replace(/\*\*/g, '').trim();
    ok(/^\d+$/.test(v), `${nome}: a linha de Raça tem de trazer o custo em número`);
    // A raça é achada no DETALHE desta linha, e pelo nome exato do dado.
    const escolhida = RACAS.find((r) => new RegExp(`(^|[^\\wÀ-ÿ])${r.nome}([^\\wÀ-ÿ]|$)`, 'i').test(raca.detalhe || ''));
    ok(escolhida, `${nome}: a linha de Raça não nomeia nenhuma das ${RACAS.length} raças do \`racas.json\`,`
      + ` e o detalhe diz "${raca.detalhe}"`);
    if (escolhida && /^\d+$/.test(v)) {
      eq(Number(v), escolhida.custo,
        `${nome}: a tabela diz ${escolhida.nome} custando ${v}, e o \`racas.json\` diz ${escolhida.custo}`);
    }
  }
}

// ---------------------- o passo a passo tem passo de raça, e ele vem ANTES
{
  const iRaca = linhas.findIndex((l) => /^3\. \*\*\[?Ra[cç]a/.test(l));
  const iAttr = linhas.findIndex((l) => /^\d+\. \*\*Atributos\.\*\*/.test(l));
  ok(iRaca > 0, 'o passo a passo da criação não tem passo de Raça');
  ok(iAttr > 0, 'o passo a passo da criação não tem passo de Atributos');
  ok(iRaca > 0 && iAttr > 0 && iRaca < iAttr,
    'a Raça tem de vir ANTES dos Atributos: é ela que move os tetos que o passo seguinte usa (`M-28`)');
  // e a numeração não pode ter buraco nem repetição
  const nums = linhas.filter((l) => /^\d+\. \*\*/.test(l)).map((l) => Number(/^(\d+)\./.exec(l)[1]));
  const seq = nums.slice(0, 10);
  eq(seq, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'os dez passos têm de estar numerados em sequência, sem buraco');
}

if (falhas.length) {
  console.error(`\n✘ exemplos-criacao: ${falhas.length} falha(s)\n` + falhas.map((f) => '  · ' + f).join('\n'));
  process.exit(1);
}
console.log('✓ exemplos-criacao: os quatro exemplos somam o Total que declaram, os quatro dizem a raça'
  + ' com o custo que o dado dá, e a Raça é um passo numerado antes dos Atributos'
  + ' (soma a coluna: NÃO confere o conteúdo de linha nenhuma, ver `A-03`)');
