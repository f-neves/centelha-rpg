// test-portoes.mjs · o portão que guarda os portões.
//
// POR QUE ELE EXISTE
//
// Em 04/09/2026, cinco achados seguidos não tinham nada a ver com regra de jogo.
// Eram todos a mesma coisa: **instrumento que existia e ninguém executava.**
//
//   · `test-grid-simultaneo.mjs`, 45 asserções, fora de `validate`, `build` e
//     `smoke`, enquanto o Simultâneo era justamente o que estava sendo mexido;
//   · o smoke do CI, quatro execuções, quatro falhas, invisíveis porque o
//     gatilho ignorava `main` num projeto que empurra direto para `main`;
//   · a política de pular copiada em oito arquivos, três delas cravadas no Edge
//     do Windows e sem honrar `SMOKE_EXIGE_NAVEGADOR`;
//   · `npx tsc --noEmit` com `continue-on-error` e a desculpa escrita ao lado
//     ("há erros antigos") havia muito expirada: não há erro nenhum;
//   · `encontro_visao` sem `tick_atual` desde agosto, e o relógio do jogador em
//     zero para sempre.
//
// Nenhum é erro de programação, e por isso nenhum teste os pegaria. São
// **omissões**, e omissão não faz barulho: cada arquivo continua coerente
// consigo mesmo, e o verde continua verde.
//
// O QUE ELE CONFERE, e as três respondem à mesma pergunta por ângulos diferentes:
//
//   1. TODO TESTE ESTÁ EM ALGUM PORTÃO. Um `scripts/test-*.mjs` que não aparece
//      em `validate` nem em `smoke` é um teste que ninguém roda. Ficar de fora é
//      permitido, e tem de ser DECLARADO aqui, com o motivo;
//   2. TODO GERADOR SE CONFERE. Um `gen-*.mjs` sem `--check` no `build` deixa o
//      arquivo gerado divergir da fonte sem ninguém ver. Idem: pode ficar de
//      fora, declarando;
//   3. TODA TOLERÂNCIA TEM PRAZO OU CONDIÇÃO. Uma frase como "por ora", "por
//      enquanto" ou "provisório" marca um lugar em que o código faz menos do que
//      a regra manda. Sem uma condição escrita ao lado, ela vira permanente por
//      esquecimento, que foi exatamente o caso do `continue-on-error`.
//
// A FORMA DAS TRÊS É A MESMA, e é a do princípio do zero ambíguo: a ausência
// nunca vale por si. Ou o instrumento está no portão, ou a ausência dele está
// escrita aqui com o motivo. O que não pode é ninguém saber em qual dos dois
// casos se está.
//
//   node scripts/test-portoes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { lerCarimbos, idade } from './carimbo.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (p) => fs.readFileSync(path.join(RAIZ, p), 'utf8');
const PKG = JSON.parse(ler('package.json'));

const falhas = [];
let grupo = '';
const secao = (t) => { grupo = t; console.log('\n' + t); };
const ok = (cond, msg) => {
  console.log((cond ? '  ✓ ' : '  ✘ ') + msg);
  if (!cond) falhas.push(`${grupo} · ${msg}`);
};

// ===================================================================== 1
// OS TESTES QUE NÃO ESTÃO EM PORTÃO NENHUM, e o motivo de cada um.
//
// A chave é o nome do arquivo; o valor é a razão, e ela é lida por gente. Uma
// razão vazia não passa: "está de fora" sem porquê é a mesma omissão silenciosa
// que este arquivo existe para acabar.
// Vazio, e este é o estado bom. A primeira versão trazia `test-portoes.mjs`
// aqui, por achar que ele não entraria no `validate`. Entrou, e a segunda
// metade da conferência (motivo escrito para teste que JÁ está em portão)
// derrubou o próprio arquivo na primeira execução. Foi de propósito: uma lista
// de exceções que não encolhe junto com o problema vira ficção em duas semanas.
const TESTES_FORA = {};

// OS GERADORES SEM `--check` NO BUILD, e o motivo.
//
// Cinco têm `--check` e é ele que impede o arquivo gerado de divergir da fonte
// em silêncio. Os sete abaixo não têm, e a lista é a pendência L31 escrita em
// código: cada linha daqui que sumir é um gerador que passou a se conferir.
const GERADORES_FORA = {
  'gen-monsters.mjs': 'roda no `build` SEM `--check`: ele produz `public/dados/`, que não é versionado, então não há o que divergir.',
  'gen-cap-pericias.mjs': 'L31 · o `CLAUDE.md` manda rodá-lo à mão depois de mexer nos JSONs de habilidades, e nada confere se alguém esqueceu. É o pior dos sete.',
  'gen-elementos.mjs': 'L31 · escreve `elementos-bestiario.json`, e o JSON é editado pelo script, nunca à mão.',
  'gen-deslocamento.mjs': 'L31 · uma passada só, já aplicada ao bestiário em 28/08/2026.',
  'gen-arte-equip.mjs': 'L31 · gera CSS de arte de equipamento; a saída é versionada e ninguém a confere.',
  'gen-lista-equip.mjs': 'L31 · gera lista para leitura humana, fora do site.',
  'gen-creditos-equip.mjs': 'L31 · gera a página de créditos das artes.',
  'gen-prompts-folhas.mjs': 'L31 · gera texto para pedir arte, e não entra no site.',
};

secao('· todo teste está em algum portão');
{
  const emPortao = [PKG.scripts.validate, PKG.scripts.smoke].join(' || ');
  const testes = fs.readdirSync(path.join(RAIZ, 'scripts'))
    .filter((f) => /^test-.*\.mjs$/.test(f)).sort();
  const orfaos = testes.filter((t) => !emPortao.includes(t) && !TESTES_FORA[t]);
  ok(orfaos.length === 0, orfaos.length
    ? `${orfaos.length} teste(s) fora de todo portão e sem motivo escrito: ${orfaos.join(', ')}`
    : `os ${testes.length} testes estão no \`validate\` ou no \`smoke\`, menos ${Object.keys(TESTES_FORA).length} declarado(s)`);

  // E o contrário: um motivo escrito para um teste que voltou ao portão é lixo
  // que engana quem lê. A lista tem de encolher junto com o problema.
  const sobrando = Object.keys(TESTES_FORA).filter((t) => emPortao.includes(t));
  ok(sobrando.length === 0,
    sobrando.length ? `motivo escrito para teste que JÁ está em portão: ${sobrando.join(', ')}` : 'e nenhum motivo escrito sobrando');

  const semRazao = Object.entries(TESTES_FORA).filter(([, r]) => !r || r.length < 20).map(([t]) => t);
  ok(semRazao.length === 0, semRazao.length ? `sem razão de verdade: ${semRazao.join(', ')}` : 'e todo motivo tem uma razão escrita');
}

secao('· todo gerador se confere');
{
  const build = PKG.scripts.build + ' ' + PKG.scripts.validate;
  const gers = fs.readdirSync(path.join(RAIZ, 'scripts'))
    .filter((f) => /^gen-.*\.mjs$/.test(f)).sort();
  const orfaos = gers.filter((g) => !build.includes(`${g} --check`) && !GERADORES_FORA[g]);
  ok(orfaos.length === 0, orfaos.length
    ? `${orfaos.length} gerador(es) sem \`--check\` e sem motivo escrito: ${orfaos.join(', ')}`
    : `${gers.length - Object.keys(GERADORES_FORA).length} de ${gers.length} geradores com \`--check\` no build; ${Object.keys(GERADORES_FORA).length} declarados`);
  const sobrando = Object.keys(GERADORES_FORA).filter((g) => build.includes(`${g} --check`));
  ok(sobrando.length === 0,
    sobrando.length ? `motivo escrito para gerador que JÁ tem --check: ${sobrando.join(', ')}` : 'e nenhum motivo escrito sobrando');
}

// ===================================================================== 3
// AS TOLERÂNCIAS
//
// A frase é o gatilho; o que se cobra é a CONDIÇÃO ao lado. Três formas valem,
// e a terceira é a mais importante das três:
//
//   EXPIRA EM: 2026-12-01          uma data. Passou, o portão fica vermelho.
//   LEVANTA QUANDO: <condição>     o que tem de ser verdade para ela sair.
//   SEM CONDIÇÃO CONHECIDA · ...   quem afrouxou não deixou a volta escrita.
//
// A terceira existe porque a alternativa é pior: obrigar uma condição faria
// alguém INVENTAR uma, e condição inventada é pior que ignorância declarada,
// porque parece resposta. Elas são contadas e impressas, para a conta não
// crescer sem ninguém ver.
const GATILHO = /por ora|por enquanto|provis[óo]ri|tempor[áa]ri|fica para depois|continue-on-error|desativado por|não trava/i;
const MARCA = /TOLERÂNCIA/;
const CONDICAO = /EXPIRA EM:\s*(\d{4}-\d{2}-\d{2})|LEVANTA QUANDO:|SEM CONDIÇÃO CONHECIDA/;
const JANELA = 16;   // linhas acima em que a marca pode estar

// O QUE A FRASE PEGA E NÃO É TOLERÂNCIA, por âncora e não por número de linha:
// linha se move, texto não. Cada entrada diz por que aquela ocorrência não é
// código fazendo menos do que a regra manda.
const NAO_E_TOLERANCIA = [
  ['src/components/TecnicaItem.astro', 'Texto provisório — revisar',
    'rótulo de tela, dirigido ao leitor: é o dado `t.pendente` do JSON aparecendo, e não uma trava afrouxada.'],
  ['src/pages/artes/efeitos.astro', 'Sem Efeitos por enquanto',
    'frase de tela para uma lista vazia.'],
  ['scripts/gen-lista-equip.mjs', 'Sem imagem por enquanto',
    'frase do texto gerado, dirigida a quem o lê.'],
  ['src/lib/ficha-engine.ts', 'aparece como aviso e NÃO trava',
    'decisão fechada e coerente: o modo Criação saiu do motor, e travar aqui seria a única trava de criação da ficha inteira.'],
  ['src/pages/mesa/grid.astro', 'dividem um metro quadrado, e por ora a resposta é não',
    'regra de mesa decidida, com a alternativa nomeada. Mudá-la é decisão, não dívida.'],
  ['src/pages/mesa/grid.astro', 'por ora sem a escolha de outro alvo',
    'a regra do golpe no caído está implementada; a escolha de outro alvo é fatia de trabalho seguinte, e não regra afrouxada.'],
  ['scripts/gen-monsters.mjs', 'vazio por ora',
    'tabela de exceções vazia. Vazia é o estado normal dela, não um afrouxamento.'],
  ['supabase/migracao-23.sql', 'fica para depois',
    'névoa por jogador é funcionalidade não construída, e não regra afrouxada. A névoa do grupo é a decisão de mesa, não um degrau para ela.'],
  ['scripts/sim/lib-ponte.mjs', 'arquivo temporário',
    'fala de um arquivo em disco que existe por uma execução: outro sentido da palavra.'],
  ['scripts/test-arte-na-mesa.mjs', 'arquivo temporário', 'idem.'],
  ['scripts/test-grid-simultaneo.mjs', 'o relógio não trava', 'é a asserção do teste, dizendo o que ele prova.'],
  ['scripts/test-grid-simultaneo.mjs', 'não trava a cena num golpe', 'idem.'],
  ['.github/workflows/validate.yml', 'rodava com `continue-on-error: true`',
    'é o comentário que conta a tolerância REMOVIDA, em 04/09/2026. Apagar a história para o portão calar seria trocar uma dívida por uma amnésia.'],
  ['scripts/test-portoes.mjs', '', 'este arquivo: as frases aqui são a definição do gatilho, e não usos dele.'],
];

secao('· toda tolerância tem prazo ou condição');
{
  const arquivos = [];
  const anda = (d) => {
    for (const e of fs.readdirSync(path.join(RAIZ, d), { withFileTypes: true })) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) { anda(p); continue; }
      if (/\.(mjs|ts|astro|sql|yml|js)$/.test(e.name)) arquivos.push(p);
    }
  };
  for (const d of ['src', 'scripts', 'supabase', '.github']) anda(d);

  const semCondicao = [];
  const declaradas = [];
  let ignoradas = 0;
  for (const arq of arquivos) {
    const L = ler(arq).split(/\r?\n/);
    L.forEach((linha, i) => {
      if (!GATILHO.test(linha)) return;
      const isento = NAO_E_TOLERANCIA.some(([a, anc]) => arq === a && (anc === '' || linha.includes(anc)));
      if (isento) { ignoradas++; return; }
      const acima = L.slice(Math.max(0, i - JANELA), i + 1).join('\n');
      if (!MARCA.test(acima) || !CONDICAO.test(acima)) { semCondicao.push(`${arq}:${i + 1}`); return; }
      const m = acima.match(/EXPIRA EM:\s*(\d{4}-\d{2}-\d{2})/);
      declaradas.push({ onde: `${arq}:${i + 1}`, prazo: m ? m[1] : null, cega: /SEM CONDIÇÃO CONHECIDA/.test(acima) });
    });
  }

  ok(semCondicao.length === 0, semCondicao.length
    ? `${semCondicao.length} tolerância(s) sem prazo nem condição: ${semCondicao.join(', ')}`
    : `${declaradas.length} tolerância(s) com condição escrita, e ${ignoradas} ocorrência(s) declaradas como não sendo tolerância`);

  const hoje = new Date().toISOString().slice(0, 10);
  const vencidas = declaradas.filter((d) => d.prazo && d.prazo < hoje);
  ok(vencidas.length === 0, vencidas.length
    ? `${vencidas.length} tolerância(s) VENCIDA(S): ${vencidas.map((d) => `${d.onde} (${d.prazo})`).join(', ')}`
    : 'e nenhuma com a data vencida');

  const cegas = declaradas.filter((d) => d.cega);
  // Não falha: ignorância declarada é melhor que condição inventada. Mas sai
  // impressa toda vez, porque uma conta que ninguém vê é uma conta que cresce.
  console.log(`  · ${cegas.length} sem condição conhecida${cegas.length ? ': ' + cegas.map((d) => d.onde).join(', ') : ''}`);

  const orfas = NAO_E_TOLERANCIA.filter(([a, anc]) => {
    if (anc === '') return false;
    try { return !ler(a).includes(anc); } catch { return true; }
  });
  ok(orfas.length === 0, orfas.length
    ? `isenção escrita para texto que não existe mais: ${orfas.map(([a, anc]) => `${a} · "${anc}"`).join(', ')}`
    : 'e nenhuma isenção apontando para texto que sumiu');
}

// ===================================================================== 4
// HÁ QUANTO TEMPO CADA PORTÃO NÃO RODA AQUI.
//
// Não é asserção, é notícia, e ela sai impressa em todo `npm run validate`, que
// é o comando que se roda o tempo todo. O `validate` é rápido e o smoke é
// lento, então o lento vai sendo deixado para depois e nada na tela dizia que
// estava sendo deixado. Foi assim que o smoke passou de 27/08 a 04/09 sem rodar
// enquanto a confiança continuava vindo do portão rápido.
//
// NÃO FALHA: não ter rodado o smoke hoje não é defeito, é informação. E é
// informação LOCAL: o que está verde no repositório é pergunta do CI, e a
// resposta dela é o badge do `README.md`. As duas importam, porque o commit sai
// desta máquina e o merge sai do CI.
{
  const carimbado = new Map(lerCarimbos().map((x) => [x.nome, x]));
  const smoke = (PKG.scripts.smoke.match(/scripts\/([\w-]+)\.mjs/g) || [])
    .map((m) => m.slice('scripts/'.length, -'.mjs'.length));
  console.log('\n· quando cada portão de navegador passou NESTA máquina');
  for (const nome of smoke) {
    const x = carimbado.get(nome);
    const velho = !x || x.dias >= 7;
    console.log(`  ${velho ? '⚑' : '·'} ${nome.padEnd(22)} `
      + (x ? `${idade(x.dias)} atrás${x.commit ? ` · ${x.commit}` : ''}` : 'nunca rodou aqui'));
  }
  const velhos = smoke.filter((n) => !carimbado.has(n) || carimbado.get(n).dias >= 7);
  if (velhos.length) {
    console.log(`  ⚑ ${velhos.length} de ${smoke.length} sem passar aqui há uma semana ou mais.`);
    console.log('    `npm run smoke` roda os oito. O CI roda os mesmos em matriz a cada push.');
  }
}

if (falhas.length) {
  console.error(`\n✘ Portões FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  console.error('\n  Ficar de fora é permitido; ficar de fora em silêncio, não.');
  console.error('  Declare em `TESTES_FORA`, `GERADORES_FORA` ou `NAO_E_TOLERANCIA`, com o motivo,');
  console.error('  ou ponha `TOLERÂNCIA` + `EXPIRA EM:` / `LEVANTA QUANDO:` ao lado da frase.');
  process.exit(1);
}
console.log('\n✓ Portões OK · todo teste num portão, todo gerador se conferindo, toda tolerância com prazo ou condição');
