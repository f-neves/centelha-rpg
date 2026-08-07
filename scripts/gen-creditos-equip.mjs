// Gera D&D/armas&armaduras/CREDITOS.md a partir do relatório do baixador.
//
// As duas fontes pedem coisas diferentes: o acervo aberto do Metropolitan é CC0
// (dispensa crédito, mas registrar a proveniência da peça é o mínimo), e o
// game-icons.net é CC BY 3.0, que EXIGE atribuição ao autor do desenho onde a
// imagem for usada. Por isso este arquivo existe e precisa acompanhar as
// imagens se elas forem parar no site.
//
//   node scripts/gen-creditos-equip.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PASTA = resolve(raiz, 'D&D/armas&armaduras');
const ARQ = resolve(PASTA, '.temp/relatorio.json');

if (!existsSync(ARQ)) {
  console.error('Sem relatório. Rode antes: node scripts/baixar-imagens-equip.mjs');
  process.exit(1);
}

const relatorio = JSON.parse(readFileSync(ARQ, 'utf8'));
const museu = relatorio.filter((r) => r.fonte === 'MET');
const icones = relatorio.filter((r) => r.fonte === 'ícone');
const faltando = relatorio.filter((r) => r.fonte !== 'MET' && r.fonte !== 'ícone');

// Quando a arte de IA é instalada, o acervo de museu vai para acervo-museu/ e
// deixa de ser o que a pasta principal mostra. O crédito tem de dizer isso, ou
// atribui a peça errada à fonte errada.
const trocado = existsSync(resolve(PASTA, 'acervo-museu'));
const planoIA = resolve(raiz, 'scripts/folhas-ia.json');
const folhas = existsSync(planoIA) && existsSync(resolve(PASTA, 'folhas'))
  ? JSON.parse(readFileSync(planoIA, 'utf8')).folhas.filter(
      (f) => existsSync(resolve(PASTA, 'folhas', f.id)))
  : [];

const out = [];
out.push('# Créditos das imagens');
out.push('');
out.push('Gerado por `scripts/gen-creditos-equip.mjs`. Não editar à mão.');
out.push('');

if (folhas.length) {
  const nIA = folhas.reduce((s, f) => s + f.pecas.length, 0);
  out.push('## Arte em uso na pasta principal · gerada por IA');
  out.push('');
  out.push(`${nIA} peças em estilo de gravura, geradas por IA a partir dos prompts de`);
  out.push('`prompts-ia.md` e endireitadas por `scripts/retificar_folha.py`. Não há');
  out.push('terceiro a creditar: nenhuma obra alheia foi copiada. As folhas cruas ficam');
  out.push('em `folhas/<folha>/bruta.png`, junto do atlas e do mapa de células.');
  out.push('');
  out.push('| Folha | Peças | Atlas |');
  out.push('| --- | --- | --- |');
  for (const f of folhas) {
    out.push(`| \`${f.id}\` · ${f.titulo} | ${f.pecas.map((p) => p.nome).join(', ')} `
      + `| \`folhas/${f.id}/${f.id}.webp\` |`);
  }
  out.push('');
}

out.push(trocado
  ? `## Acervo anterior, guardado em \`acervo-museu/\``
  : '## Acervo em uso');
out.push('');
out.push(`${relatorio.length} peças: ${museu.length} de foto de museu, ${icones.length} de ícone.`);
if (trocado) {
  out.push('Saiu da pasta principal quando a arte de IA entrou, mas continua aqui:');
  out.push('a exigência de atribuição do game-icons.net vale enquanto os arquivos existirem.');
}
out.push('');
out.push('## Se estas imagens forem para o site');
out.push('');
out.push('As duas fontes não pedem a mesma coisa:');
out.push('');
out.push('- **The Metropolitan Museum of Art · CC0.** Domínio público, sem exigência.');
out.push('  A proveniência abaixo fica registrada porque é honesto dizer de que peça');
out.push('  histórica se trata, não porque a licença obrigue.');
out.push('- **game-icons.net · CC BY 3.0.** Exige atribuição ao autor do desenho');
out.push('  em qualquer lugar onde a imagem apareça publicada. A lista de ícones');
out.push('  abaixo, com autor e link, é o que precisa acompanhar a publicação.');
out.push('');

out.push('## Fotos do acervo do Metropolitan (CC0)');
out.push('');
out.push('| Arquivo | Peça do museu | Ficha |');
out.push('| --- | --- | --- |');
for (const r of museu) {
  const credito = (r.credito || '').replace(/<\/?i>/g, '*');
  out.push(`| \`${r.id}.png\` | ${credito} | [objeto](${r.link}) |`);
}
out.push('');

out.push('## Ícones do game-icons.net (CC BY 3.0 · exige atribuição)');
out.push('');
out.push('| Arquivo | Desenho | Autor | Página |');
out.push('| --- | --- | --- | --- |');
for (const r of icones) {
  // o crédito vem como: "nome" por autor, game-icons.net
  const m = (r.credito || '').match(/^"(.+)" por (.+?),/);
  const nome = m ? m[1] : r.credito;
  const autor = m ? m[2] : '?';
  out.push(`| \`${r.id}.png\` | ${nome} | ${autor} | [ícone](${r.link}) |`);
}
out.push('');

if (faltando.length) {
  out.push('## Sem imagem');
  out.push('');
  for (const r of faltando) out.push(`- \`${r.id}\` (${r.fonte})`);
  out.push('');
}

out.push('## Atribuição pronta para copiar');
out.push('');
out.push('> Ícones de equipamento por ' + [...new Set(icones.map((r) => {
  const m = (r.credito || '').match(/ por (.+?),/);
  return m ? m[1] : null;
}).filter(Boolean))].sort().join(', ') + ' (game-icons.net), sob licença CC BY 3.0.');
out.push('> Fotografias de peças do acervo aberto do Metropolitan Museum of Art (CC0).');
out.push('');

writeFileSync(resolve(PASTA, 'CREDITOS.md'), out.join('\n'), 'utf8');
console.log(`CREDITOS.md gerado: ${museu.length} do museu, ${icones.length} ícones` +
  (faltando.length ? `, ${faltando.length} sem imagem` : '') + '.');
