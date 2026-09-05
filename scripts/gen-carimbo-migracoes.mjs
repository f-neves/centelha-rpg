// Carimba cada migração com o número e o hash do próprio texto.
//
// POR QUE ISTO EXISTE: "quais migrações rodaram?" não é um fato que alguém
// precisa lembrar de perguntar · é um fato que NINGUÉM CONSEGUE perguntar daqui.
// O repositório não sabe, e o único caminho era sondar o PostgREST coluna a
// coluna e inferir. E a sondagem responde uma pergunta PARECIDA, não a mesma:
// ela diz "a coluna existe", que não separa "a 31 rodou" de "alguém criou a
// coluna à mão".
//
// A saída é trazer a resposta para dentro do banco: a tabela `migracoes`
// (criada na migração 36) e uma linha no fim de cada arquivo que se carimba
// sozinha quando ele roda.
//
// O HASH É DO TEXTO DE ANTES DO CARIMBO, e tem de ser: o carimbo carrega o
// hash, então incluí-lo seria pedir que o arquivo se descrevesse depois de
// mudar por causa da própria descrição. O marcador é a fronteira.
//
// E O HASH É O QUE SEPARA DUAS PERGUNTAS que parecem uma só: "um arquivo com
// este número rodou" e "o TEXTO DE HOJE está no banco". Migração é arquivo
// vivo · os comentários de conferência de dez delas foram reescritos em
// 05/09/2026, depois de já terem rodado. Sem o hash a tabela responderia a
// primeira e seria lida como se respondesse a segunda.
//
// Uso:
//   node scripts/gen-carimbo-migracoes.mjs                  escreve os carimbos
//   node scripts/gen-carimbo-migracoes.mjs --check           falha se algum envelheceu
//   node scripts/gen-carimbo-migracoes.mjs --dir=<pasta>      aponta para outra pasta
//
// O `--dir` NÃO é para uso normal: existe para o CONTROLE POSITIVO deste portão
// (`scripts/test-carimbo-migracoes.mjs`), que precisa provar que a detecção acha
// um arquivo sem carimbo de verdade, sem sujar `supabase/`. Sem essa saída, provar
// a detecção exigiria mexer nos arquivos reais e desfazer depois — o mesmo risco
// que os ensaios de portão desta leva sempre evitaram.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const argDir = process.argv.find((a) => a.startsWith('--dir='));
const DIR = argDir ? path.resolve(argDir.slice('--dir='.length)) : path.join(RAIZ, 'supabase');
const MARCA = '-- >>> carimbo';

// A PRIMEIRA MIGRAÇÃO NÃO TEM NÚMERO NO NOME: ela é `migracao.sql`, e é a 1.
// Quem lê a pasta em ordem alfabética não descobre isso sozinho.
const numeroDe = (f) => (f === 'migracao.sql' ? 1
  : (f.match(/^migracao-(\d+)\.sql$/) || [])[1] !== undefined
    ? Number(f.match(/^migracao-(\d+)\.sql$/)[1]) : null);

const arquivos = fs.readdirSync(DIR)
  .filter((f) => numeroDe(f) !== null)
  .map((f) => ({ f, n: numeroDe(f) }))
  .sort((a, b) => a.n - b.n);

const carimbo = (n, f, hash) => `${MARCA} (gerado por scripts/gen-carimbo-migracoes.mjs · não editar à mão)
--
-- O \`on conflict\` ATUALIZA, e é de propósito: rerodar o arquivo tem de
-- corrigir o hash e tirar o \`a_mao\` da carga histórica da migração 36. Quem
-- rerodou sabe mais do que quem escreveu a carga de memória.
insert into public.migracoes (numero, arquivo, sha256, a_mao) values
  (${n}, '${f}', '${hash}', false)
  on conflict (numero) do update set arquivo = excluded.arquivo,
    sha256 = excluded.sha256, a_mao = false, aplicada_em = now();
`;

const velhos = [];
let escritos = 0;
for (const { f, n } of arquivos) {
  const p = path.join(DIR, f);
  const txt = fs.readFileSync(p, 'utf8');
  const i = txt.indexOf(MARCA);
  const corpo = (i === -1 ? txt : txt.slice(0, i)).replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n';
  const hash = crypto.createHash('sha256').update(corpo, 'utf8').digest('hex').slice(0, 16);
  const novo = corpo + '\n' + carimbo(n, f, hash);
  if (novo === txt) continue;
  if (process.argv.includes('--check')) { velhos.push(f); continue; }
  fs.writeFileSync(p, novo, 'utf8');
  escritos += 1;
}

if (velhos.length) {
  console.error(`\n✘ ${velhos.length} migração(ões) com o carimbo velho: ${velhos.join(', ')}`);
  console.error('  Rode `node scripts/gen-carimbo-migracoes.mjs`. O carimbo é o que faz o banco');
  console.error('  saber qual TEXTO rodou; um hash velho responde por um arquivo que não existe mais.\n');
  process.exit(1);
}
console.log(process.argv.includes('--check')
  ? `✓ carimbo das migrações em dia (${arquivos.length} arquivos)`
  : `✓ ${escritos} carimbo(s) escrito(s), ${arquivos.length} migração(ões) conferidas`);
