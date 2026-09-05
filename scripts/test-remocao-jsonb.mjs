// O CONTROLE POSITIVO do detector "este SQL sabe tirar chave de um jsonb?"
// (`lib-deteccao-remocao-jsonb.mjs`, usado pelo portão da migração 35/36 em
// `validate-data.mjs`).
//
// FALHAR FECHADO POR PADRÃO (nenhum `mordidos = ...` achado → `false`) impede o
// FALSO VERDE. Isto aqui prova a outra metade, que é diferente: que a busca
// ACHA a remoção quando ela existe de verdade, contra texto SINTÉTICO — sem
// depender de a migração 36 continuar presente e continuar sendo a de maior
// número, que era a dependência implícita que este autoteste substitui.
import { semComentario, sabeTirarChave } from './lib-deteccao-remocao-jsonb.mjs';

const FALHAS = [];
const ok = (cond, msg) => { console.log(`  ${cond ? '✓' : '✗'} ${msg}`); if (!cond) FALHAS.push(msg); };
const sabe = (sql) => sabeTirarChave(semComentario(sql));

console.log('\n· o positivo: texto sintético com remoção de verdade');
ok(sabe(`
  update t set
    mordidos = coalesce(mordidos, '{}'::jsonb) - 'chave',
    outro = 1
  where id = p_id;
`), 'um `-` de string literal simples é achado');

ok(sabe(`
  update t set
    mordidos = (coalesce(mordidos, '{}'::jsonb) || coalesce(p_dados->'mordidos', '{}'::jsonb))
               - coalesce((select array_agg(x) from jsonb_array_elements_text(
                   coalesce(p_dados->'tirar_mordidos', '[]'::jsonb)) x), '{}'::text[])
  where id = p_id;
`), 'o formato REAL da migração 36 (fundir e depois subtrair um array) é achado');

ok(sabe(`
  update t set
    mordidos = mordidos #- array['chave']
  where id = p_id;
`), 'o operador de caminho `#-` também é achado');

console.log('\n· o negativo: texto sintético que só sabe PÔR');
ok(!sabe(`
  update t set
    mordidos = coalesce(mordidos, '{}'::jsonb) || coalesce(p_dados->'mordidos', '{}'::jsonb)
  where id = p_id;
`), 'só `||` (o defeito real da migração 35) não é achado como remoção');

ok(!sabe(`
  update t set
    mordidos = coalesce(p_dados->'mordidos', mordidos)
  where id = p_id;
`), 'substituição pura (o defeito anterior à 35) também não');

console.log('\n· o negativo que a primeira versão do portão errava: sem coalesce');
ok(sabe(`
  update t set
    mordidos = mordidos - 'chave'
  where id = p_id;
`), 'remoção direta, sem `coalesce` em volta, ainda é achada (a primeira versão do portão só reconhecia `- coalesce(...)`)');

console.log('\n· falso positivo conhecido, e por que ele é aceito');
ok(sabe(`
  update t set
    mordidos = jsonb_build_object('saldo', -5)
  where id = p_id;
`), 'um NÚMERO NEGATIVO literal também acende — é o falso positivo documentado no comentário do detector, e é aceito porque não há caso de uso real de número negativo dentro de um mapa de mordidas');

console.log('\n· ausência de sinal nunca vira "sabe tirar" (falha fechado)');
ok(!sabe('update t set outro_campo = 1 where id = p_id;'),
  'texto sem `mordidos = ...` nenhum não é lido como remoção');
ok(!sabe(''), 'texto vazio idem');

console.log('');
if (FALHAS.length) {
  console.error(`✗ Detecção de remoção jsonb (controle positivo): ${FALHAS.length} falha(s) de 8`);
  for (const f of FALHAS) console.error('   · ' + f);
  process.exit(1);
}
console.log('✓ Detecção de remoção jsonb (controle positivo) OK · 8 asserções · a busca acha remoção real, em duas formas, e não confunde `||` nem substituição pura com ela');
