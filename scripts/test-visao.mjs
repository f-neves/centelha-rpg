// test-visao.mjs · a bancada não pode ser mais generosa que o esquema.
//
// POR QUE ELE EXISTE
//
// A `mesa-mock.mjs` imita o Supabase para a mesa poder ser testada no navegador,
// e toda view que ela imita é um lugar onde a bancada pode discordar do banco.
// A discordância é ASSIMÉTRICA, e é isso que a torna perigosa:
//
//   · se a bancada esconde MAIS que a view, uma asserção falha aqui primeiro,
//     e alguém olha;
//   · se a bancada esconde MENOS, a asserção "o jogador vê X" passa verde na
//     bancada e a mesa quebra em produção, calada.
//
// Já aconteceu: o `encontro_visao` do mock tinha `tick_atual`, coluna que a view
// nunca teve, e o relógio do jogador ficou em zero por três semanas com o smoke
// verde o tempo todo. A `combate_visao` estava no mesmo estado até 04/09/2026 ·
// o mock tirava `acao.arma` e `acao.alvo` e mais nada, enquanto a view de
// verdade mascara Vida em número, `dados`, energia, mana, condição e o resumo do
// colega.
//
// O QUE ELE CONFERE
//
//   1. A LISTA DE COLUNAS é a mesma da migração, lida do próprio `.sql`. Uma
//      coluna nova na view sem linha no `visao-combate.mjs` para aqui;
//   2. O CORTE ACONTECE, peça a peça, e cada asserção negativa vem com a gêmea
//      positiva. "O jogador não vê a Vida do ogro" passa sozinha com a bancada
//      quebrada e a cena vazia; junto com "e vê a do próprio herói", não passa.
//
//   node scripts/test-visao.mjs
import fs from 'node:fs';
import path from 'node:path';
import { combateParaJogador, COLUNAS_COMBATE_VISAO } from './visao-combate.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const falhas = [];
const ok = (cond, msg) => {
  console.log((cond ? '  ✓ ' : '  ✘ ') + msg);
  if (!cond) falhas.push(msg);
};
const secao = (t) => console.log('\n' + t);

// ===================================================================== 1
// AS COLUNAS, LIDAS DA MIGRAÇÃO.
//
// A alternativa seria uma segunda lista escrita à mão, e duas listas à mão são
// o defeito que este arquivo existe para pegar. O `.sql` é a fonte.
secao('· a lista de colunas sai da migração, e não de uma segunda cópia');
{
  const sql = fs.readFileSync(path.join(RAIZ, 'supabase/migracao-27.sql'), 'utf8');
  const i = sql.indexOf('create view public.combate_visao');
  const j = sql.indexOf('from combatentes c', i);
  const corpo = sql.slice(sql.indexOf('select', i) + 'select'.length, j);

  // Vírgulas de topo só: as de dentro de `case ... end` e de subselect separam
  // argumentos, e cortar por elas quebraria a coluna no meio.
  const partes = [];
  let nivel = 0;
  let atual = '';
  for (const ch of corpo) {
    if (ch === '(') nivel++;
    if (ch === ')') nivel--;
    if (ch === ',' && nivel === 0) { partes.push(atual); atual = ''; continue; }
    atual += ch;
  }
  partes.push(atual);

  const nomes = partes
    .map((p) => p.replace(/--[^\n]*/g, '').trim())
    .filter(Boolean)
    .map((p) => {
      const alias = p.match(/\bas\s+([a-z_][a-z0-9_]*)\s*$/i);
      if (alias) return alias[1];
      const ponto = p.match(/^[a-z0-9_]+\.([a-z_][a-z0-9_]*)$/i);
      return ponto ? ponto[1] : p;
    });

  const faltam = nomes.filter((n) => !COLUNAS_COMBATE_VISAO.includes(n));
  const sobram = COLUNAS_COMBATE_VISAO.filter((n) => !nomes.includes(n));
  ok(nomes.length > 20, `a migração 27 foi lida e tem ${nomes.length} colunas`);
  ok(faltam.length === 0, faltam.length
    ? `coluna(s) na view e não no \`visao-combate.mjs\`: ${faltam.join(', ')}`
    : 'toda coluna da view tem lugar na imitação');
  ok(sobram.length === 0, sobram.length
    ? `coluna(s) na imitação e não na view: ${sobram.join(', ')}`
    : 'e a imitação não inventa coluna nenhuma');
  ok(JSON.stringify(nomes) === JSON.stringify(COLUNAS_COMBATE_VISAO),
    'e as duas listas estão na mesma ordem');
}

// ===================================================================== 2
// O CORTE, PEÇA A PEÇA.
//
// A cena é a da bancada: `revelar` vazio (que é o padrão de toda mesa nova), um
// PC meu, um PC de colega e uma criatura.
const REVELAR = {};
const linha = (extra) => ({
  id: 'x', encontro_id: 'e', tipo: 'criatura', personagem_id: null, monstro_id: 'ogro',
  nome: 'Criatura 1', tick: 3, iniciativa: 12, grupo: 'inimigo', ativo: true,
  imagem: null, retrato: null, criado_em: '2026-01-01T00:00:00Z',
  pv_atual: 30, pv_max: 40, mana_atual: 4, mana_max: 8, energia_atual: 5, energia_max: 9,
  dados: { arma: 'espada-longa', ataque: '4d6 +1' },
  condicoes: [{ id: 'cego' }],
  acao: { golpes: [9], livre: 12, arma: 'espada-longa', alvo: 'c000' },
  oculto: false, ...extra,
});
const ver = (extra, meu) => combateParaJogador(linha(extra), { meu, revelarMesa: REVELAR, resumo: { pv: 1 } });

secao('· a criatura: o que o jogador lê dela');
{
  const c = ver({}, false);
  ok(c.pv_atual === null && c.pv_max === null,
    'a Vida do inimigo NÃO chega em número (a mesa nova revela só o estado)');
  ok(c.pv_pct === 75,
    `e chega em degraus de 5%, que é o que desenha a barra (${c.pv_pct})`);
  ok(Object.keys(c.dados).length === 0,
    'o bloco `dados` do inimigo vem VAZIO, e é dele que sairia a Defesa dele');
  ok(c.condicoes.length === 1,
    'a condição do inimigo aparece, porque `condInimigo` nasce ligado');
  ok(c.acao && c.acao.arma === undefined && c.acao.alvo === undefined,
    'a intenção some: fica o tempo do gesto, sai contra quem e com quê');
  ok(c.acao.golpes.length === 1 && c.acao.livre === 12,
    'e a agenda do gesto FICA, que é o que se vê olhando para o sujeito');
  ok(c.mana_atual === null && c.mana_max === null && c.mana_pct === null,
    'a Mana do inimigo não chega, nem em número nem em porcentagem');
  ok(c.resumo_pc === null, 'e criatura não tem `resumo_pc`');
}

secao('· o herói do próprio jogador: o outro lado do par');
{
  const c = ver({ tipo: 'pc', personagem_id: 'p000', nome: 'Herói 1' }, true);
  ok(c.pv_atual === 30 && c.pv_max === 40, 'a Vida da peça dele chega em número');
  ok(Object.keys(c.dados).length === 2, 'e o bloco `dados` dela chega inteiro');
  ok(c.acao.arma === 'espada-longa' && c.acao.alvo === 'c000',
    'a intenção da própria peça não é escondida de quem a declarou');
  ok(c.mana_atual === 4 && c.energia_atual === 5, 'Mana e Energia da peça dele chegam');
  ok(c.resumo_pc !== null, 'e o resumo dela chega, porque `stats` é verdadeiro para o dono');
}

secao('· o herói do colega: nem tudo, nem nada');
{
  const c = ver({ tipo: 'pc', personagem_id: 'p001', nome: 'Herói 2' }, false);
  ok(c.pv_atual === 30, 'a Vida do colega chega em número (`vidaColegas` nasce ligado)');
  ok(Object.keys(c.dados).length === 0, 'mas o bloco `dados` dele não (`statusColegas` nasce desligado)');
  ok(c.energia_atual === null, 'nem a Energia (`energiaColegas` nasce desligado)');
  ok(c.resumo_pc === null, 'nem o resumo dele');
  ok(c.acao.arma === undefined, 'e a intenção dele também é intenção');
}

// ===================================================================== 3
// AS CHAVES DA MESA MUDAM O CORTE, e sem isso as asserções acima poderiam
// estar provando uma função que ignora `revelar` e devolve sempre a mesma coisa.
secao('· e o corte obedece às chaves da mesa, não a uma constante');
{
  const aberto = combateParaJogador(linha({}), {
    meu: false, revelarMesa: { vidaInimigo: 'numero', statsInimigo: true }, resumo: null,
  });
  ok(aberto.pv_atual === 30, 'com `vidaInimigo: numero`, a Vida do inimigo passa a chegar');
  ok(Object.keys(aberto.dados).length === 2, 'com `statsInimigo`, o bloco `dados` dele também');
  ok(aberto.acao.arma === 'espada-longa',
    'e com `stats` aberto a intenção vem junto, que é o que a migração 27 diz');

  const fechado = combateParaJogador(linha({}), {
    meu: false, revelarMesa: { condInimigo: false }, resumo: null,
  });
  ok(fechado.condicoes.length === 0, 'e com `condInimigo: false` a condição do inimigo some');
}

// ===================================================================== 4
// A LINHA NÃO GANHA CAMPO NENHUM ALÉM DOS DA VIEW. `oculto` e `revelar` são
// colunas de `combatentes` que a view não seleciona, e uma delas escapando é o
// mesmo defeito por outro lado: o navegador do jogador recebendo o que o
// Postgres não manda.
secao('· e nada além das colunas da view atravessa');
{
  const c = ver({ revelar: { vida: 'numero' } }, false);
  const extras = Object.keys(c).filter((k) => !COLUNAS_COMBATE_VISAO.includes(k));
  ok(extras.length === 0, extras.length
    ? `campo(s) fora da view chegando ao jogador: ${extras.join(', ')}`
    : `as ${Object.keys(c).length} chaves da linha são as da view, e \`oculto\`/\`revelar\` ficaram para trás`);
  ok(c.pv_atual === 30,
    'e o `revelar` DA PEÇA continua sendo lido, mesmo sem viajar: esta criatura tem Vida aberta por ajuste próprio');
}

if (falhas.length) {
  console.error(`\n✘ Visão FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log('\n✓ Visão OK · a bancada corta o que a `combate_visao` corta, coluna a coluna');
