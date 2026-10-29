// test-sentidos.mjs — a Percepção Passiva e a Furtividade das criaturas chegam
// inteiras à mesa, e a tabela que as produz mexe de verdade.
//
// POR QUE ESTE PORTÃO EXISTE, e ele nasce de três previsões que a revisora fez
// no mesmo dia em que a tabela foi escrita. Todas são a mesma família: **o dado
// entra na conta e nada lê o resultado**, que é o L25 pela porta dos dados.
//
//   1. a Prontidão entrando na fórmula da Passiva sem que nada leia o número;
//   2. a fórmula devolvendo o mesmo valor para portes diferentes, e a tabela
//      parecendo funcionar por parecer plausível;
//   3. a exceção por criatura existindo e nunca rodando.
//
// A TERCEIRA JÁ TINHA ACONTECIDO quando este arquivo foi escrito, e não é
// hipótese: `gen-monsters.mjs` monta a versão MAGRA do bestiário por uma lista
// de campos (`CAMPOS_MESA`), e `pericias` não estava nela. O bloco `sentidos`
// do `ResumoCombate` lia `MON[id].pericias`, `MON` vem de `monsters-mesa.json`,
// e a chave não existia lá: **a Passiva de toda criatura da mesa era `null`, e
// nada acusava**, porque `null` é um valor que o contrato permite.
//
// RODA NO `validate`, e não no smoke, de propósito: não precisa de navegador,
// então continua respondendo numa máquina onde o Astro não compila.
import { carregarTS } from './lib-ts.mjs';
const MOTOR = await carregarTS('src/lib/motor.ts');
const IMAGENS = await carregarTS('src/lib/imagem-escolhida.ts');
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ler = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8'));

const falhas = [];
const ok = (cond, msg) => {
  console.log(`  ${cond ? '✓' : '✘'} ${msg}`);
  if (!cond) falhas.push(msg);
};

const exemploImagens = { id: '__a6_imagens__', imagens: ['a.png', 'b.png', 'c.png'] };
ok(IMAGENS.imagemDe(exemploImagens) === 'a.png', 'imagem principal da lista');
ok(IMAGENS.alternarImagem(exemploImagens) === 2 && IMAGENS.imagemDe(exemploImagens) === 'b.png', 'segunda imagem');
ok(IMAGENS.alternarImagem(exemploImagens) === 3 && IMAGENS.imagemDe(exemploImagens) === 'c.png', 'terceira imagem');
ok(IMAGENS.alternarImagem(exemploImagens) === 1 && IMAGENS.imagemDe(exemploImagens) === 'a.png', 'lista volta à principal');
ok(IMAGENS.imagemDe({ id: '__sem_imagem__', imagens: [] }) === null, 'lista vazia sem imagem');
const CHEIO = ler('monsters.json');
const MESA = ler('monsters-mesa.json');

console.log('· os sentidos das criaturas: a Passiva, a tabela e a exceção');

// ---------------------------------------------------------------- 1 · a mesa
//
// O QUE A MESA CARREGA, e é o teste que teria pego o `CAMPOS_MESA`. A pergunta
// não é "o bestiário tem perícia" (tem, e o gerador confere), é "a versão que
// vai para o navegador tem". São dois arquivos e o segundo é um recorte do
// primeiro.
const porId = Object.fromEntries(MESA.map((m) => [m.id, m]));
for (const m of [...CHEIO, ...MESA]) {
  ok(typeof m.tamanho === 'string' && !('porte' in m), m.id + ': Tamanho no contrato');
  ok(m.corpo && !('dimensoes' in m), m.id + ': Corpo no contrato');
  ok(Array.isArray(m.imagens) && !('imagem' in m) && !('imagem2' in m), m.id + ': lista de imagens no contrato');
  ok(!('pericias' in m), m.id + ': contrato sem pericias');
  ok(m.habilidadesSec && !Array.isArray(m.habilidadesSec), m.id + ': mapa secundário presente');
}
const semPericias = MESA.filter((m) => !m.habilidades || !Object.keys(m.habilidades).length);
ok(semPericias.length === 0,
  `a versão MAGRA do bestiário leva as perícias (${MESA.length - semPericias.length} de ${MESA.length})`);

const semProntidao = MESA.filter((m) => m.habilidades?.prontidao == null);
ok(semProntidao.length === 0,
  `e a Prontidão está em todas, que é o que a Passiva precisa (${MESA.length - semProntidao.length} de ${MESA.length})`);

// ------------------------------------------------------- 2 · a Prontidão MEXE
//
// A ASSERÇÃO EM PAR, e é a que a revisora pediu: alguma coisa tem de falhar se a
// Prontidão parar de ser lida. Uma conferência de "a Passiva é (P+Pr)×2" passaria
// com Prontidão zero em todo mundo, porque a fórmula continuaria fechando.
//
// Então são duas: a Passiva bate com a fórmula (a positiva) E ela é DIFERENTE da
// que sairia sem a Prontidão, em quantidade de criaturas que não dá para
// confundir com acaso (a gêmea). Zerar a Prontidão na fonte derruba a segunda.
// o bônus de Centelha da Reforma (28/09/2026, confirmado no Adendo 1 de 02/10/2026): 2 × mín(Centelha, Prontidão)
const passiva = MOTOR.valorPassivo;
for (const [a,h,c,esperado] of [[3,2,1,12],[3,0,3,6],[6,3,2,22]]) ok(passiva(a,h,c) === esperado, 'Passiva de referência: '+[a,h,c]+' resulta em '+esperado);
let batem = 0;
let mexem = 0;
for (const m of MESA) {
  const p = m.atributos?.percepcao;
  const pr = m.habilidades?.prontidao;
  const c = m.centelha || 0;
  const v = passiva(p, pr, c);
  if (Number.isFinite(v)) batem += 1;
  if (v !== passiva(p, 0, c)) mexem += 1;
}
ok(batem === MESA.length, `o motor calcula a Passiva em todas (${batem} de ${MESA.length})`);
ok(mexem > MESA.length * 0.7,
  `E A PRONTIDÃO MOVE O NÚMERO em ${mexem} das ${MESA.length}:`
  + ' zerá-la mudaria a Passiva da maioria, então ela não é enfeite na fórmula');

// ----------------------------------------------------- 3 · a tabela DISTINGUE
//
// A segunda previsão: a fórmula devolvendo o mesmo número para portes
// diferentes. Uma tabela que não separa nada é uma constante com cara de regra,
// e ela passa em qualquer conferência que só olhe se o campo existe.
// A6: o vetor especial tem nome próprio; Habilidades será o mapa de níveis.
for (const m of CHEIO) {
  ok(Array.isArray(m.habilidadesEspeciais), m.id + ': especiais no contrato público');
  ok(!Array.isArray(m.habilidades), m.id + ': nome antigo das especiais ausente');
}
// D-226: as fichas novas usam a Habilidade escrita, sem ajuste de Tamanho.
let fontesNovas=0;
for(const arquivo of fs.readdirSync(path.join(ROOT,'src/data/bestiario'))) {
  const c=JSON.parse(fs.readFileSync(path.join(ROOT,'src/data/bestiario',arquivo),'utf8'));
  if(!c.corpo)continue;
  fontesNovas++;
  const m=CHEIO.find(x=>x.id===c.id);
  ok((m?.habilidades?.furtividade ?? m?.habilidadesSec?.furtividade)===(c.habilidades.furtividade ?? c.habilidadesSec.furtividade ?? 0),c.id+': Furtividade escrita, sem ajuste por porte');
}
ok(fontesNovas===324,'324 fontes guardam a Habilidade Furtividade, sem tabela de semente');

if (falhas.length) {
  console.error(`\n✘ Sentidos FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log('✓ Sentidos OK · Passiva e Furtividade escrita nas 324 fontes');
