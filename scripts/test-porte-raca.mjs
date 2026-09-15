// test-porte-raca.mjs · o porte da raça chega ao PV, e a explicação sai da tabela.
//
// A `M-29` decidiu que o Halfling é `pequeno`. O defeito que ela conserta não era
// um número errado: era uma tabela que NINGUÉM ALCANÇAVA. `derivados.pv.porte`
// tem sete linhas calibradas em `regras.json`, e os dois únicos chamadores vivos
// de `pv()` chamavam `pv(vig)` sem o segundo argumento, então todo personagem
// jogável caía no default de Médio e um Halfling tinha exatamente o PV de um Orc
// de mesmo Vigor.
//
// Este portão guarda quatro coisas, e três delas são armadilhas de silêncio:
//
//   1. O CAMPO EXISTE NAS OITO RAÇAS. Ausente e decidido-Médio são
//      indistinguíveis, porque `d.porte?.[porte] ?? {base, vigorMult}` cai em
//      Médio para qualquer erro de digitação, calado.
//   2. A EXPLICAÇÃO DA FICHA NÃO TEM NÚMERO À MÃO. Ela trazia `25 + Vigor 3×3`
//      escrito na string, e com o Halfling em `pequeno` isso imprimiria
//      "25 + Vigor 3×3 = 26", uma conta que não fecha dentro da própria frase.
//      Esta é a asserção que o Arquiteto pediu, e ela vale mais que o conserto:
//      o conserto morre na próxima vez que alguém reescrever a linha à mão.
//   3. OS DOIS CHAMADORES PASSAM O PORTE. Se um voltar a chamar `pv(vig)` seco,
//      a tabela deixa de ser alcançada de novo, e nenhum número fica vermelho.
//   4. A NOTA DO FÔLEGO NÃO PROMETE O QUE O DADO NÃO TEM (`M-26`): ela dizia
//      "Base por raça (humano = 10)" e o dado entrega um número só para as oito.
//
// Entra no `npm run validate`: é puro e custa milissegundos.
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const saida = path.join(os.tmpdir(), `calc-porte-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/calc.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
const C = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const RACAS = JSON.parse(ler('src/data/racas.json'));
const regras = JSON.parse(ler('src/data/regras.json'));

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m} · esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);

// ---------------------------------------- 1. o campo existe nas OITO, e é válido
const PORTES = ['minusculo', 'pequeno', 'medio', 'grande', 'enorme', 'imenso', 'colossal'];
eq(RACAS.length, 8, 'as oito raças jogáveis');
for (const r of RACAS) {
  ok(r.porte != null, `a raça ${r.id} não declara porte, e ausente é indistinguível de Médio decidido`);
  ok(PORTES.includes(r.porte), `o porte de ${r.id} (${r.porte}) não está na tabela de portes`);
}
// O ROL do que a mesa DECIDIU, e ele e uma lista e nao uma regra: mexer nele e
// legitimo, e o que o portão cobra é que o gesto seja DELIBERADO e traga a
// decisão pelo nome. Ele já cobrou uma vez: a `M-29b` mudou o Gnomo e esta linha
// ficou vermelha na hora, que é exatamente o serviço dela.
//
//   `M-29`  (15/09) · Halfling → pequeno
//   `M-29b` (15/09) · Gnomo → pequeno, Anão continua médio
//
// A régua que a `M-29b` deixou para raça nova: baixo não é pequeno, largo
// compensa. O porte acompanha a MASSA; a altura já tem efeito próprio, que é o
// dois terços de deslocamento, e é por isso que as TRÊS raças baixas não caem
// juntas: o Anão é "baixo e corpulento".
eq(RACAS.filter((r) => r.porte === 'pequeno').map((r) => r.id).sort(), ['gnomo', 'halfling'],
  'o rol das raças Pequenas decididas mudou sem a decisão passar por aqui');
eq(RACAS.find((r) => r.id === 'anao').porte, 'medio',
  'o Anão é baixo e CORPULENTO: baixa estatura não decide porte, massa decide (`M-29b`)');

// ------------------------------------------------- 2. a tabela alcança de verdade
// A ponte tolera `pvPorte` AUSENTE de propósito: sem isso o teste estoura na
// primeira linha quando a função ainda não existe, e o vermelho fica cego para
// tudo que vem depois. O ensaio dos três sentidos precisa ver a lista inteira.
ok(typeof C.pvPorte === 'function', '`calc.ts` não exporta `pvPorte`: quem explica a conta volta a guardar cópia à mão');
const pvPorte = typeof C.pvPorte === 'function' ? C.pvPorte : () => ({ base: null, vigorMult: null });
eq(pvPorte('pequeno'), { base: 20, vigorMult: 2 }, 'a linha de Pequeno em `derivados.pv.porte`');
eq(pvPorte('medio'), { base: 25, vigorMult: 3 }, 'a linha de Médio');
eq(C.pv(3, 'pequeno'), 26, 'Halfling de Vigor 3: 20 + 3×2');
eq(C.pv(3, 'medio'), 34, 'e o mesmo Vigor num Médio: 25 + 3×3');
ok(C.pv(3, 'pequeno') !== C.pv(3, 'medio'), 'os dois portes têm de dar números DIFERENTES, senão a tabela não está sendo lida');
// o controle negativo: porte que não existe cai no default, e isso é de propósito
eq(C.pv(3, 'Pequeno'), 34, 'porte escrito errado cai em Médio, calado: é por isso que o esquema do portão o valida');

// --------------------- 2.5 a frase da ficha, COMPOSTA pela linha da tabela
// O molde é o mesmo de `ficha-engine.ts`, e os dois casos existem para provar que
// a função resolveu de verdade: com um caso só, um número escrito à mão que por
// acaso batesse passaria.
{
  const frase = (vigor, porte) => {
    const t = pvPorte(porte);
    return `${t.base} + Vigor ${vigor}×${t.vigorMult} = ${C.pv(vigor, porte)}`;
  };
  eq(frase(3, 'pequeno'), '20 + Vigor 3×2 = 26', 'a linha do Halfling de Vigor 3');
  eq(frase(4, 'pequeno'), '20 + Vigor 4×2 = 28', 'a linha do Gnomo de Vigor 4 (base 3 + 1 racial)');
  eq(frase(3, 'medio'), '25 + Vigor 3×3 = 34', 'e a linha de um Médio de Vigor 3');
}

// --------------------------- 3. a ficha não guarda cópia à mão dos dois números
{
  const eng = ler('src/lib/ficha-engine.ts');
  const linha = eng.split('\n').find((l) => l.includes("r('Pontos de Vida'"));
  ok(linha, 'a linha de Pontos de Vida sumiu da ficha');
  if (linha) {
    ok(!/25 \+ Vigor/.test(linha),
      'a explicação do PV voltou a trazer o `25` escrito à mão: com o Halfling em Pequeno ela imprime uma conta que não fecha');
    ok(/×\$\{/.test(linha) || /linhaPV/.test(linha),
      'a explicação do PV tem de sair da linha de `porte` em uso, e não de outra cópia à mão');
  }
  ok(!/\bpv\(vig\)/.test(eng), 'a ficha voltou a chamar `pv(vig)` sem porte: a tabela deixa de ser alcançada');
  const mesa = ler('src/lib/mesa-ficha.ts');
  ok(!/\bpv\(vig\)(?!,)/.test(mesa), 'a ficha da mesa voltou a chamar `pv(vig)` sem porte');
  ok(/porteDaRaca/.test(mesa), 'a ficha da mesa tem de resolver o porte da raça antes de chamar `pv()`');
}

// ------------------------------------------- 4. o Fôlego não promete base por raça
{
  const nota = regras.derivados.folego?.nota || '';
  ok(!/base por ra[cç]a/i.test(nota),
    'a nota do Fôlego voltou a prometer base por raça, e o dado entrega um número só para as oito (`M-26`)');
  eq(regras.derivados.folego.base, 10, 'a base do Fôlego continua sendo 10, e igual para todos');
  const cap = ler('src/content/chapters/folego.md');
  ok(!/base racial/i.test(cap), 'o capítulo do Fôlego voltou a chamar a base de racial');
}

// ------------------------ 5. o capítulo das raças NÃO é gerado, e não acompanha
//
// `racas.md` é escrito à mão: nenhum script o cita (varrido em 15/09/2026). O
// custo de cada raça aparece em DOIS lugares dentro dele (a tabela resumo e o
// primeiro marcador da seção) e um TERCEIRO no dado, e nada prendia os três
// juntos. O Gnomo é o caso vivo: a `M-29b` derrubou o PV dele, o humano baixou
// o custo de 40 para 30, e sem este portão o capítulo continuaria dizendo 40 em
// dois lugares com o `validate` verde.
{
  const cap = ler('src/content/chapters/racas.md');
  const linhas = cap.split('\n');

  // as seções por raça: `### Nome` até o próximo `###`
  const secoes = {};
  let atual = null;
  for (const l of linhas) {
    const m = /^### (.+)$/.exec(l);
    if (m) { atual = m[1].trim(); secoes[atual] = []; } else if (atual) secoes[atual].push(l);
  }

  // a TABELA RESUMO é a que tem `Custo XP` no cabeçalho. O capítulo tem outra
  // tabela com uma coluna numérica logo depois do nome (a das IDADES), e pegar
  // a errada faria o portão comparar custo com idade de maturidade.
  const iCab = linhas.findIndex((l) => /^\| Ra[cç]a \| Custo XP \|/.test(l));
  ok(iCab > 0, 'a tabela resumo das raças (a que traz `Custo XP`) sumiu do capítulo');
  const tabela = {};
  for (let i = iCab + 2; i < linhas.length && linhas[i].startsWith('|'); i++) {
    const m = /^\| ([^|]+?) \| (\d+) \|/.exec(linhas[i]);
    if (m) tabela[m[1].trim()] = Number(m[2]);
  }

  for (const r of RACAS) {
    eq(tabela[r.nome], r.custo, `o custo de ${r.nome} na TABELA do capítulo não bate com \`racas.json\``);
    const sec = secoes[r.nome];
    if (!sec) continue; // o Humano não tem seção própria: ele é a régua, e está na prosa de abertura
    const m = /\*\*Custo de XP:\*\*\s*(\d+)/.exec(sec.join('\n'));
    ok(m, `a seção de ${r.nome} não diz o Custo de XP`);
    if (m) eq(Number(m[1]), r.custo, `o custo de ${r.nome} na SEÇÃO do capítulo não bate com \`racas.json\``);
  }

  // ---- e o rótulo de porte que o capítulo usa tem de ser o porte do dado ----
  //
  // O DEFEITO que isto guarda é medido e não hipotético: o Gnomo e o Halfling
  // eram descritos como "miúdo", e `Miúdo` é o rótulo de `minusculo` no
  // vocabulário do próprio jogo (`grid.astro`, `bestia-editor.ts`), contra
  // `Pequeno` que é o porte real dos dois. Fator DOIS entre os dois rótulos na
  // tabela de diâmetro, e o capítulo dizendo um enquanto o dado diz o outro.
  //
  // A lista de palavras é CURTA de propósito, e a medição é o motivo: varrendo
  // as sete com os sete rótulos, "pequenos demais para grande força bruta"
  // (Gnomo) casava `grande`, que ali é adjetivo comum e não tamanho. Um portão
  // com falso positivo é um portão que alguém desliga. `miúdo` e `minúsculo`
  // não são adjetivos comuns descrevendo raça jogável, e é essa a classe de
  // defeito que existe aqui.
  const ROTULO = { miúdo: 'minusculo', miúda: 'minusculo', miúdos: 'minusculo', miúdas: 'minusculo', minúsculo: 'minusculo', minúsculos: 'minusculo' };
  for (const [nome, sec] of Object.entries(secoes)) {
    const r = RACAS.find((x) => x.nome === nome);
    if (!r) continue;
    const txt = sec.join('\n');
    for (const [palavra, porte] of Object.entries(ROTULO)) {
      if (!new RegExp(`\\b${palavra}\\b`, 'i').test(txt)) continue;
      ok(r.porte === porte,
        `a seção de ${nome} usa "${palavra}", que é o rótulo do porte \`${porte}\`, e o dado diz \`${r.porte}\``);
    }
  }
}

// ------------------ 6. o `+1` racial é piso E teto, por DOIS caminhos (`M-30b`)
//
// O humano registrou que os dois efeitos podem vir a ser separados por raça
// ("o Gnomo ganha o segundo ponto mas mantém o máximo em 6"). Enquanto os dois
// saem do mesmo campo, a separação futura só é barata se a LEITURA já estiver
// partida: aí ela troca de onde um dos dois lê, em vez de virar migração de
// dado. Este bloco guarda o seam, e não o campo.
{
  const eng = ler('src/lib/ficha-engine.ts');

  ok(/function pisoRacialAttr\(/.test(eng),
    'o caminho do PISO sumiu da ficha: sem ele o `+1` racial volta a ser só teto');
  ok(/function tetoRacialAttr\(/.test(eng),
    'o caminho do TETO sumiu da ficha');
  ok(!/(?<![a-zA-Z])racialAttr\(/.test(eng),
    'voltou a existir um `racialAttr` único: piso e teto têm de ler por dois caminhos separados (`M-30b`)');

  // O piso lê SÓ O POSITIVO, e isto não é zelo: `atributos` guarda os dois
  // sinais no mesmo campo (o Elfo tem `destreza: 1` e `vigor: -1`), e somar o
  // negativo faria o Elfo abrir com Vigor 0, abaixo do piso de todo mundo.
  const linhaPiso = eng.split('\n').find((l) => /function pisoRacialAttr\(/.test(l)) || '';
  ok(/Math\.max\(0,/.test(linhaPiso),
    'o caminho do PISO tem de descartar o `−1` racial: sem o `Math.max(0, …)` o Elfo abriria com Vigor 0');

  // O XP cobra a partir do piso racial, e não do piso da régua.
  ok(/custoPontos\('atributo', pisoAttr\(/.test(eng),
    'o XP dos Atributos voltou a cobrar do piso da régua: o ponto que a raça dá de graça está sendo vendido');

  // O piso passou a depender da CHAVE, e os três leitores têm de usar o novo.
  ok(/const pisoDe = \(kind: string, key\?: string\)/.test(eng), 'o `pisoDe(kind, key)` sumiu');
  const soltos = eng.split('\n').filter((l) => /floorOf\[kind\]/.test(l) && !/^\s*(\/\/|\*)/.test(l) && !/pisoDe = /.test(l));
  eq(soltos.length, 0,
    'sobrou `floorOf[kind]` solto fora do `pisoDe`: o Atributo bonificado tem piso próprio, e ali ele seria tratado como os outros oito');

  // E a ficha salva abaixo do piso novo SOBE, e sobe AVISANDO.
  ok(/SUBIU_PELO_PISO/.test(eng),
    'a ficha parou de tratar o dado vivo: uma ficha de Elfo salva com Destreza 1 existe e fica abaixo do piso novo');
  ok(/uiPainel\('A sua raça passou a dar estes pontos de graça'\)/.test(eng),
    'a subida do piso voltou a ser silenciosa: é um número que o jogador escolheu, e ele tem de saber');
}

// -------------------- 7. o preço do brinde, medido, para a conta futura da M-46
{
  // `custoPontos(chave, de, ate)` cobra de `de+1` até `ate`: passar o piso
  // racial como `de` tira exatamente o preço dos níveis regalados. Medido aqui
  // em vez de afirmado, porque é o número que a `M-46` vai usar.
  for (const n of [2, 3, 4, 5, 6, 7]) {
    eq(C.custoPontos('atributo', 1, n) - C.custoPontos('atributo', 2, n), 15,
      `o brinde do piso 2 tem de valer 15 XP no nível ${n}, e não mudar com o nível`);
  }
  const brinde = (r) => 15 * Object.values(r.atributos || {}).filter((v) => v > 0).length;
  eq(RACAS.filter((r) => brinde(r) === 30).map((r) => r.id).sort(), ['meio-orc', 'orc'],
    'as raças de DOIS `+1` (30 XP de brinde) mudaram sem a M-46 saber');
  eq(RACAS.filter((r) => brinde(r) === 0).map((r) => r.id).sort(), ['humano', 'meio-elfo'],
    'as raças sem `+1` (nenhum brinde) mudaram sem a M-46 saber');
}

if (falhas.length) {
  console.error(`\n✘ porte-raca: ${falhas.length} falha(s)\n` + falhas.map((f) => '  · ' + f).join('\n'));
  process.exit(1);
}
console.log('✓ porte-raca: as oito raças declaram porte, o Halfling e o Gnomo são Pequenos e o porte chega ao `pv()`,'
  + ' a explicação da ficha sai da tabela em vez de guardar cópia à mão,'
  + ' o capítulo (que NÃO é gerado) diz o mesmo custo e o mesmo porte que o dado,'
  + ' o `+1` racial é piso E teto por dois caminhos separados e vale 15 XP de brinde,'
  + ' e o Fôlego parou de prometer base por raça');
