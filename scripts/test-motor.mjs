// test-motor.mjs · o motor único (src/lib/motor.ts) contra os números conferidos das fichas (plano-conversao.md, A1 e A2).
//
// O QUE ISTO GUARDA. As fichas .md de criatura escrevem os números que o conferidor da Bestiarista confere (PV, Defesas,
// Absorção, peso erguido, Tamanho, faixa, Energia, Iniciativa, Mana e, por ataque, a jogada, o dano médio e a
// Velocidade). O gen-criaturas-esperado.mjs os copia para scripts/fixtures/criaturas-esperado.json junto com as entradas,
// e este teste pede cada conta ao motor e compara número por número. Acusa a criatura, a conta e os dois números.
// Uma diferença só se aceita com o motivo escrito em ACEITAS, abaixo.
//
// O jogador também tem números esperados, escritos aqui com a procedência (D-234; plano-conversao.md, seção 0).
//
// O CONTRATO que o motor cumpre (o teste foi escrito antes dele, e começa vermelho):
//   criatura(entrada)       → { pv, pesoErguido, faixa, tamanho, segundoTamanho, esquiva, bloqueio, defesaMental,
//                               defesaSocial, iniciativa, energia, mana, absorcao: {impacto, corte, perfuracao},
//                               comEquipamento, ataques: [{ nome, velocidade, danoMedio, jogada }] }
//                             o Tamanho é o id (`medio`), a Defesa de Inteligência 0 é 'imune', a Mana de quem não tem
//                             Arte é null, e a `jogada` inclui o `acerto` do ataque;
//   tamanhosDaArea(area)    → os ids que a área aceita, o do corte primeiro e, a menos de 5% dele, o vizinho
//                             (decisoes-autor §13); a entrada guarda `corpo.tamanhoEscolhido` só quando a ficha
//                             ficou com o vizinho;
//   comForma(entrada, muda) → a entrada da forma, montada por cima da principal (D-217);
//   personagem(ficha)       → { pv, pesoErguido }, com a raça, os Atributos, as Habilidades e a `corpo.massa`.
//
//   node scripts/test-motor.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FIX = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/fixtures/criaturas-esperado.json'), 'utf8'));
const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

// As fichas corrigidas de P3/P4 são conferidas sem exceção numérica.

async function carregarMotor(semEnxame = false) {
  const fonte = path.join(ROOT, 'src/lib/motor.ts');
  if (!fs.existsSync(fonte)) return null;
  const saida = path.join(os.tmpdir(), `motor-test-${process.pid}${semEnxame ? '-sem-enxame' : ''}.mjs`);
  await build({
    ...(semEnxame ? { stdin: { contents: fs.readFileSync(fonte,'utf8').replace('pv: enxame ? enxame.pvCheio :', 'pv:'), resolveDir:path.dirname(fonte), sourcefile:fonte, loader:'ts' } } : {entryPoints:[fonte]}), outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error', define: { 'import.meta.env': 'globalThis.__ENV__' },
  });
  globalThis.__ENV__ = globalThis.__ENV__ || { BASE_URL: '/', MODE: 'test' };
  try { return await import(pathToFileURL(saida).href); } finally { try { fs.unlinkSync(saida); } catch { /* o sistema limpa */ } }
}

const M = await carregarMotor();
if (!M) {
  console.log('✘ test-motor: src/lib/motor.ts não existe (o A2 o escreve); nenhuma das '
    + `${Object.keys(FIX.criaturas).length} criaturas do criaturas-esperado.json foi conferida`);
  process.exit(1);
}

const falhas = [], aceitas = [];
let contas = 0;
const confere = (id, conta, vem, deve, tol = 0) => {
  contas++;
  const igual = typeof deve === 'number' && typeof vem === 'number' ? Math.abs(vem - deve) <= tol : vem === deve;
  if (igual) return;
  falhas.push({ id, conta, vem, deve });
};
// ACEITAS. D-208 completada pela D-258 (29/10/2026): no corpo a corpo a criatura rola pela maior entre Briga e Armas.
// Estas fichas .md (tmp/arquiteto/bestiario/fichas-v3) escreveram a frase "Jogada:" pela Habilidade do catálogo
// (arma) ou pela gravada (ataque natural), com a outra maior. A ficha .md é que se corrige; até lá, a diferença só
// passa se o número da ficha for exatamente a conta pela Habilidade antiga.
// A reconversão de 30/10/2026 (P17, fase5-01 a fase5-18) não as resolve, porque não muda a ficha .md: as 11 estão com
// o número novo para a Bestiarista em tmp/bestiarista-fichas/ajustes-parecer-f4.md, seção 7. A entrada que deixar de
// ser usada (a ficha corrigida entrou e o fixture foi regenerado) falha, para a lista encolher junto com o problema.
const ACEITAS_JOGADA = Object.fromEntries([
  ['babau', 'Lança', 'armas', true], ['boggard', 'Maça estrela', 'armas', true], ['diabo-barbado', 'Glaive serrilhada', 'armas', true],
  ['erinia', 'Espada flamejante', 'armas', true], ['centauro', 'Coice', 'briga', false], ['minotauro', 'Chifrada', 'briga', false],
  ['sahuagin', 'Garras', 'briga', false], ['salamandra', 'Cauda', 'briga', false], ['skum-ulat-kini', 'Mordida', 'briga', false],
  ['skum-ulat-kini', 'Garras', 'briga', false], ['tengu', 'Bico', 'briga', false],
].map(([id, nome, antiga, arma]) => [id + ' · ' + nome, { antiga, arma }]));
// o peso erguido da ficha vem com duas casas, e o conferidor confere a 1% (GUIA-FICHA.md, seção 7)
const tolPeso = (p) => Math.max(0.02, Math.abs(p) * 0.01);

for (const [id, c] of Object.entries(FIX.criaturas)) {
  // a entrada é a que o conversor escreve, com as escolhas da ficha (o Tamanho perto do corte, a linha de PV na zona)
  const e = c.entrada, x = c.esperado;
  const r = M.criatura(e);
  confere(id, 'pv', r.pv, x.pv);
  if (x.pesoErguido === null) confere(id, 'pesoErguido', r.pesoErguido, null);
  else if (x.pesoErguido !== undefined) confere(id, 'pesoErguido', r.pesoErguido, x.pesoErguido, tolPeso(x.pesoErguido));
  confere(id, 'faixa', r.faixa, x.faixa);
  if (x.tamanho) confere(id, 'tamanho', r.tamanho, slug(x.tamanho));
  if (x.segundoTamanho) confere(id, 'segundoTamanho', r.segundoTamanho, slug(x.segundoTamanho));
  for (const k of ['esquiva', 'bloqueio', 'defesaMental', 'defesaSocial', 'iniciativa', 'energia', 'mana']) if (k in x) confere(id, k, r[k], x[k]);
  for (const [k, v] of Object.entries(x.absorcao || {})) confere(id, `absorcao.${k}`, r.absorcao?.[k], v);
  for (const [k, v] of Object.entries(x.comEquipamento || {})) confere(id, `comEquipamento.${k}`, r.comEquipamento?.[k], v);
  for (const a of x.ataques) {
    const ra = r.ataques.find((y) => y.nome === a.nome);
    if (!ra) { falhas.push({ id, conta: `ataque ${a.nome}`, vem: 'ausente', deve: 'presente' }); continue; }
    if (a.velocidade !== undefined) confere(id, `${a.nome}.velocidade`, ra.velocidade, a.velocidade);
    if (a.danoMedio !== undefined) confere(id, `${a.nome}.danoMedio`, ra.danoMedio, a.danoMedio);
    // a frase "Jogada:" da ficha soma o Atributo, a Habilidade e a Centelha, sem o Acerto da coluna
    if (a.jogada !== undefined) {
      const aceita = ACEITAS_JOGADA[id + ' · ' + a.nome];
      if (aceita && ra.jogada - (ra.acerto || 0) !== a.jogada) {
        // a ficha só passa se o número dela for a conta pela Habilidade antiga, e o motor a conta pela maior
        const ea = e.ataques.find((y) => y.nome === a.nome), hv = (h) => e.habilidades[h] ?? e.habilidadesSec[h] ?? 0;
        const velha = hv(aceita.antiga), nova = hv(ra.habilidade);
        const atr = Math.max(e.atributos.forca ?? 0, e.atributos.destreza ?? 0), ce = e.centelha ?? 0;
        confere(id, `${a.nome}.jogada pela Habilidade antiga (${aceita.antiga})`, atr + velha + 2 * Math.min(ce, velha), a.jogada);
        confere(id, `${a.nome}.jogada pela maior entre Briga e Armas`, ra.jogada - (ra.acerto || 0), atr + nova + 2 * Math.min(ce, nova));
        confere(id, `${a.nome}.a maior é maior que a antiga`, nova > velha && !ea?.arma === !aceita.arma, true);
        aceitas.push(id + ' · ' + a.nome);
      } else confere(id, `${a.nome}.jogada`, ra.jogada - (ra.acerto || 0), a.jogada);
    }
  }
  for (const [fid, fo] of Object.entries(c.formas || {})) {
    const rf = M.criatura(M.comForma(c.entrada, fo.entrada));
    for (const [k, v] of Object.entries(fo.esperado)) {
      if (k === 'pesoErguido') confere(id, `formas.${fid}.${k}`, rf[k], v, tolPeso(v));
      else confere(id, `formas.${fid}.${k}`, rf[k], k === 'tamanho' ? slug(v) : v);
    }
  }
}
// a lista de exceção encolhe com o problema: a entrada que nenhuma ficha usou é velha
for (const k of Object.keys(ACEITAS_JOGADA)) if (!aceitas.includes(k)) confere(k, 'ACEITAS_JOGADA sem uso (a ficha já foi corrigida: tire a linha)', 'sem uso', 'usada');

// P4: o critério é Inteligência, inclusive fora dos animais; Int 0 continua imune.
for (const categoria of ['animal', 'fera-magica', 'humanoide']) {
  const base = structuredClone(FIX.criaturas.grifo.entrada);
  base.categoria = categoria; base.centelha = 2; base.atributos.compostura = 2;
  base.habilidades.sobrevivencia = 3; base.habilidades.sociabilidade = 1;
  for (const [inteligencia, esperado] of [[0, 'imune'], [1, 14], [2, categoria === 'animal' ? 14 : 8]]) {
    base.atributos.inteligencia = inteligencia;
    confere('P4 ' + categoria, 'Int ' + inteligencia, M.criatura(base).defesaSocial, esperado);
  }
}

// O jogador (D-234): o PV pelo Tamanho da raça, e não pela massa; o peso erguido pela massa (a R15, D-184).
const pessoa = (raca, vigor, massa, extra = {}) => ({
  raca, atributos: { forca: 3, destreza: 3, vigor, percepcao: 3, inteligencia: 3, raciocinio: 3, influencia: 3, perspicacia: 3, compostura: 3, ...extra.atributos },
  habilidadesSec: extra.habilidadesSec || {}, corpo: { massa },
});
const JOGADOR = [
  // "um elfo de 25 kg continua Médio" (D-234): a linha do Médio, 25 + Vigor × 3
  ['elfo de 25 kg, Vigor 3', pessoa('elfo', 3, 25), 'pv', 34],
  // "um gnomo de 50 kg continua Pequeno" (D-234): a linha do Pequeno, 20 + Vigor × 2 (racas.md:76)
  ['gnomo de 50 kg, Vigor 3', pessoa('gnomo', 3, 50), 'pv', 26],
  // "um orc de 500 kg continua Médio" (D-234), com a Vitalidade por cima (+ Vigor, racas.json; racas.md:113,129)
  ['orc de 500 kg, Vigor 3', pessoa('orc', 3, 500), 'pv', 37],
  // o peso erguido muda com a massa: humano de Força 6 e Halterofilismo 6, de 299 a 354 kg com 60 a 80 kg (plano, seção 0)
  ['humano de 60 kg, Força 6, Halterofilismo 6', pessoa('humano', 3, 60, { atributos: { forca: 6 }, habilidadesSec: { halterofilismo: 6 } }), 'pesoErguido', 299.1],
  ['humano de 80 kg, Força 6, Halterofilismo 6', pessoa('humano', 3, 80, { atributos: { forca: 6 }, habilidadesSec: { halterofilismo: 6 } }), 'pesoErguido', 354.03],
  // o exemplo do guia: soldado veterano de 82 kg, Força 3, Halterofilismo 1, P = 143,31 kg (GUIA-FICHA.md, seção 7)
  ['soldado de 82 kg, Força 3, Halterofilismo 1', pessoa('humano', 3, 82, { habilidadesSec: { halterofilismo: 1 } }), 'pesoErguido', 143.31],
];
for (const [quem, ficha, conta, deve] of JOGADOR) {
  const r = M.personagem(ficha);
  confere(`jogador (${quem})`, conta, r[conta], deve, conta === 'pesoErguido' ? tolPeso(deve) : 0);
}

// a tabela de Vida mora duas vezes em regras.json: o texto que a mesa mostra (`linhas`) e os números que o motor lê
// (`conta`); as duas têm de dizer o mesmo, linha por linha, pelo exemplo de Vigor 3 que o texto já traz
{
  const RG = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8')).derivados.pv.massa;
  if (RG.linhas.length !== RG.conta.length) falhas.push({ id: 'regras.json', conta: 'derivados.pv.massa: linhas e conta', vem: RG.conta.length, deve: RG.linhas.length });
  RG.linhas.forEach((l, i) => {
    const k = RG.conta[i];
    if (k) confere('regras.json', `derivados.pv.massa, linha ${i + 1} (${l.massa}) com Vigor 3`, k.base + Math.floor((3 * k.vigorMult) / k.vigorDivisor), l.comVigor3);
  });
}
// A5j: exemplos independentes de personagem, com números do livro e da D-234.
for (const [raca,pv] of [['gnomo',26],['halfling',26],['humano',34],['orc',37],['meio-orc',37]]) {
  const S = {raca,attrs:{forca:3,destreza:3,vigor:3,raciocinio:3,compostura:3},skills:{bloqueio:2,esquiva:1,prontidao:2},skills2:{},willpower:5,centelha:0,arte:{},equip:{},corpo:{massa:70},conjuntos:[{ativo:true,habil:{ref:'a:espada-longa'},inabil:{ref:'e:broquel'}}]};
  const n = M.numerosPersonagem(S);
  confere('A5j '+raca,'PV',n.pv,pv);
  confere('A5j '+raca,'Iniciativa',n.iniciativa.bonus,5);
  confere('A5j '+raca,'Bloqueio com espada e broquel',n.bloqueio,12);
}
// D-224: nem a vista nem os gerados públicos carregam revisao, em qualquer profundidade.
function temRevisao(x) { return x && typeof x==='object' && (Object.hasOwn(x,'revisao') || Object.values(x).some(temRevisao)); }
for (const arquivo of ['inimigos.json','monsters.json','monsters-mesa.json']) {
  const pub = JSON.parse(fs.readFileSync(path.join(ROOT,'src/data',arquivo),'utf8'));
  confere(arquivo,'sem revisao',!!temRevisao(pub),false);
}
for (const arquivo of fs.readdirSync(path.join(ROOT,'src/data/bestiario'))) {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT,'src/data/bestiario',arquivo),'utf8'));
  if (!c.corpo) continue;
  const vista = M.vistaPublicaCriatura({...c,revisao:[{campo:'nome',motivo:'__REVISAO_PRIVADA_A5__'}]});
  confere(c.id,'vista sem revisao',JSON.stringify(vista).includes('__REVISAO_PRIVADA_A5__'),false);
  for (const a of vista.motor.stat.ataques) if (['corte','impacto','perfuracao','perfurante'].includes(a.tipo)) confere(c.id,a.nome+' com tipo de dano legível',/\([CIP]\)/.test(a.dano),true);
}
// Item 20, D-208: um golpe corpo a corpo sem Habilidade guardada escolhe a maior entre Briga e Armas.
{
  const entrada = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/bestiario/lobisomem.json'), 'utf8'));
  entrada.habilidades.briga = 2;
  entrada.habilidades.armas = 5;
  entrada.ataques = [{ nome: 'Golpe', parte: 'mao', classe: 'media', pgr: [2,1,3], dado: '1d6', multiplicadorForca: 1, tipoDano: 'impacto', nivelPerfuracao: null, acerto: 0, bloqueiaComoArma: null }];
  const conta = M.criatura(entrada).ataques[0];
  confere('Item 20', 'sem Habilidade usa Armas maior', conta.jogada, Math.max(entrada.atributos.forca, entrada.atributos.destreza) + 5 + 2 * Math.min(entrada.centelha, 5));
  entrada.ataques[0].classe = 'distancia';
  confere('Item 20', 'controle negativo, tiro sem Habilidade não ganha jogada', M.criatura(entrada).ataques[0].jogada, null);
}

// D-258/A4: arma do catálogo não repete a Habilidade, e a troca no catálogo muda a jogada.
{
  const entrada = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/bestiario/aasimar.json'), 'utf8'));
  const ataque = entrada.ataques.find((a) => a.arma);
  confere('D-258', 'arma sem Habilidade repetida', Object.hasOwn(ataque, 'habilidade'), false);
  const antes = M.criatura(entrada).ataques.find((a) => a.nome === ataque.nome).jogada;
  entrada.habilidades.armas += 1;
  confere('D-258', 'controle negativo, alterar a Habilidade do catálogo hipotético muda a jogada', M.criatura(entrada).ataques.find((a) => a.nome === ataque.nome).jogada, antes + 1);
}

// D-208 completada pela D-258: no corpo a corpo a criatura rola pela maior entre Briga e Armas, mais o maior entre
// Força e Destreza e o termo da Centelha, com a arma ou sem ela; a Habilidade gravada (no JSON ou no catálogo) não
// conta. Tiro e arremesso seguem a Habilidade do catálogo (arma) ou da ficha (ataque natural).
{
  const ler = (id) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/bestiario', id + '.json'), 'utf8'));
  const jog = (Mx, c, nome) => Mx.criatura(c).ataques.find((a) => a.nome === nome);
  // babau: Briga 5, Armas 4, Força 6, Centelha 4; a lança do catálogo diz Armas
  const babau = ler('babau');
  confere('D-258', 'babau, lança do catálogo Armas rola pela Briga maior', jog(M, babau, 'Lança').jogada, 6 + 5 + 2 * 4 + 1);
  confere('D-258', 'babau, lança diz a Habilidade usada', jog(M, babau, 'Lança').habilidade, 'briga');
  // a cópia antiga gravada no JSON não manda no corpo a corpo, nem na arma nem no ataque natural
  const copia = ler('babau');
  copia.ataques.find((a) => a.nome === 'Lança').habilidade = 'armas';
  copia.ataques.find((a) => a.nome === 'Garras').habilidade = 'armas';
  confere('D-258', 'babau, cópia antiga Armas na lança é ignorada', jog(M, copia, 'Lança').jogada, 6 + 5 + 2 * 4 + 1);
  confere('D-258', 'babau, cópia antiga Armas nas garras é ignorada', jog(M, copia, 'Garras').jogada, 6 + 5 + 2 * 4 + 0);
  const aasimar = ler('aasimar');
  aasimar.ataques[0].habilidade = 'arremesso';
  confere('D-258', 'aasimar, cópia antiga Arremesso na espada não a faz de arremesso', jog(M, aasimar, 'Espada longa').jogada, 2 + 2 + 2 * 1 + 1);
  // e o tiro e o arremesso seguem a Habilidade de cada um
  const gigante = ler('gigante-da-colina');
  confere('D-258', 'gigante, rocha arremessada (classe pesada) sai pela Destreza e Arremesso', jog(M, gigante, 'Rocha arremessada').jogada, 2 + 3 + 2 * 1 + 0);
  confere('D-258', 'gigante, pancada pela Briga e Força', jog(M, gigante, 'Pancada descomunal').jogada, 9 + 5 + 2 * 1 + 0);
  const erinia = ler('erinia');
  confere('D-258', 'erínia, arco longo pela Percepção e Atirador do catálogo', jog(M, erinia, 'Arco longo').jogada, 5 + 4 + 2 * 4 + 0);
  // o catálogo trocado: a Habilidade de corpo a corpo dele é ignorada; a de tiro e arremesso é respeitada
  const plugin = { name: 'armas-trocadas', setup(b) {
    b.onLoad({ filter: /[\\/]armas\.json$/ }, (args) => {
      const armas = JSON.parse(fs.readFileSync(args.path, 'utf8'));
      for (const a of armas) {
        if (a.id === 'espada-longa') a.arma.pericia = 'briga';
        if (a.id === 'arco-longo') a.arma.pericia = 'arremesso';
      }
      return { contents: JSON.stringify(armas), loader: 'json' };
    });
  } };
  const saida = path.join(os.tmpdir(), `motor-test-${process.pid}-armas.mjs`);
  await build({ entryPoints: [path.join(ROOT, 'src/lib/motor.ts')], outfile: saida, bundle: true, format: 'esm', platform: 'node', loader: { '.json': 'json' }, logLevel: 'error', define: { 'import.meta.env': 'globalThis.__ENV__' }, plugins: [plugin] });
  const MT = await import(pathToFileURL(saida).href);
  try { fs.unlinkSync(saida); } catch { /* o sistema limpa */ }
  confere('D-258', 'catálogo trocado, espada longa Briga: aasimar continua pela Armas maior', jog(MT, ler('aasimar'), 'Espada longa').jogada, 2 + 2 + 2 * 1 + 1);
  confere('D-258', 'catálogo trocado, arco longo Arremesso: a erínia rola Destreza e Arremesso', jog(MT, ler('erinia'), 'Arco longo').jogada, 7 + 3 + 2 * 3 + 0);
  confere('D-258', 'catálogo trocado, o card mostra o Arremesso', MT.vistaPublicaCriatura(ler('erinia')).motor.stat.ataques.find((a) => a.nome === 'Arco longo').pericia, 'arremesso');
  confere('D-258', 'o card mostra a Briga da lança do babau', M.vistaPublicaCriatura(ler('babau')).motor.stat.ataques.find((a) => a.nome === 'Lança').pericia, 'briga');
}

// Item 2: quando terra falta, o leitor preserva a ausência e o card pode escrever "não anda".
{
  const entrada = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/bestiario/lobisomem.json'), 'utf8'));
  delete entrada.deslocamento.terra;
  entrada.deslocamento.voo = { batalha: 5 };
  const vista = M.vistaPublicaCriatura(entrada);
  confere('Item 2', 'terra ausente vira não anda no card', vista.locomocao.terra, null);
  const antiga = structuredClone(entrada); antiga.deslocamento.terra = { batalha: 3, arranque: 5, corrida: 7 };
  confere('Item 2', 'controle negativo, terra declarada não vira nula', M.vistaPublicaCriatura(antiga).locomocao.terra, 3);
}

// P10/P13: oito números escritos nas fichas, sem PV guardado no bloco enxame.
const PV_ENXAMES = [['aranhas',24,12,6],['caranguejos',26,13,6],['centopeias',24,12,6],['formigas',26,13,6],['morcegos',34,17,8],['ratos',28,14,7],['sanguessugas',26,13,6],['vespas',24,12,6]];
const controleSemEnxame = await carregarMotor(true);
let negativasEnxame = 0;
for (const [nome,cheio,metade,quarto] of PV_ENXAMES) {
  const id = 'enxame-de-' + nome, e = FIX.criaturas[id].entrada;
  confere(id,'P10 cheio',M.criatura(e).pv,cheio);
  confere(id,'P10 metade',M.enxamePorQuadrado(e,e.enxame.individuosPorQuadrado/2).pv,metade);
  const minimo = M.enxamePorQuadrado(e).minimo;
  confere(id,'P10 mínimo',M.enxamePorQuadrado(e,minimo).pv,quarto);
  confere(id,'P10 mínimo ainda é enxame',M.enxamePorQuadrado(e,minimo).aindaEnxame,true);
  confere(id,'P10 abaixo do mínimo',M.enxamePorQuadrado(e,minimo-1).aindaEnxame,false);
  confere(id,'P10 bloco sem PV',Object.keys(e.enxame).some(k=>/pv/i.test(k)),false);
  if (controleSemEnxame.criatura(e).pv !== cheio) negativasEnxame++;
}
confere('P10','controle negativo sem ramo do enxame',negativasEnxame,8);
console.log('P10 controle negativo: remover o ramo do enxame produz ' + negativasEnxame + ' divergências de PV.');

// F5.1: só a forma pode cancelar um meio herdado; o card recebe o nulo para escrever o "não".
{
  const entrada = structuredClone(FIX.criaturas.lobisomem.entrada);
  const forma = { id: 'sem-terra', deslocamento: { terra: null, voo: null } };
  const lida = M.comForma(entrada, forma);
  confere('F5.1', 'terra cancelada', lida.deslocamento.terra, null);
  confere('F5.1', 'voo cancelado', lida.deslocamento.voo, null);
  const card = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/bestiario/lobisomem.json'), 'utf8'));
  const vista = M.vistaPublicaCriatura({ ...card, formas: [...card.formas, { ...forma, nome: 'sem terra' }] });
  confere('F5.1', 'card conserva terra nula', vista.motor.formas.find(f => f.id === 'sem-terra').ficha.locomocao.terra, null);
}

// F5.2: com a área própria, a forma pode escolher o Tamanho que o motor apresenta.
{
  const entrada = structuredClone(FIX.criaturas.lobisomem.entrada);
  const forma = { corpo: { area: 6, tamanhoEscolhido: 'grande' } };
  confere('F5.2', 'motor usa Tamanho com área', M.criatura(M.comForma(entrada, forma)).tamanho, 'grande');
}

// F5.3: o motor não amplia a decisão para outro Tamanho quando recebe um objeto fora do esquema.
{
  const entrada = structuredClone(FIX.criaturas['enxame-de-aranhas'].entrada);
  entrada.enxame.tamanhoEquivalente = 'grande';
  let recusou = false; try { M.enxamePorQuadrado(entrada); } catch { recusou = true; }
  confere('F5.3', 'controle negativo, motor recusa enxame Grande', recusou, true);
}

// F5.4: mesmo uma fonte antiga, fora do esquema, não muda o PV por forma.
{
  const entrada = structuredClone(FIX.criaturas.lobisomem.entrada);
  const principal = M.criatura(entrada).pv;
  const forma = M.comForma(entrada, { id: 'bonus-proibido', bonusPV: 20 });
  confere('F5.4', 'motor ignora bonusPV da forma', M.criatura(forma).pv, principal);
  const card = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/bestiario/lobisomem.json'), 'utf8'));
  const vista = M.vistaPublicaCriatura({ ...card, formas: [...card.formas, { id: 'bonus-proibido', nome: 'bonus proibido', bonusPV: 20 }] });
  const lida = vista.motor.formas.find(f => f.id === 'bonus-proibido').ficha.motor.stat.pv;
  confere('F5.4', 'card ignora bonusPV da forma', lida, vista.motor.stat.pv);
}

const nC = Object.keys(FIX.criaturas).length;
if (falhas.length) {
  const porConta = {};
  for (const x of falhas) { const k = x.conta.replace(/^.*\.(velocidade|danoMedio|jogada)$/, 'ataque.$1').replace(/^formas\.[^.]+\./, 'formas.'); (porConta[k] ??= []).push(x); }
  console.log(`✘ test-motor: ${falhas.length} diferença(s) em ${contas} contas de ${nC} criaturas e ${JOGADOR.length} jogadores`);
  for (const [k, l] of Object.entries(porConta).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  · ${k}: ${l.length}`);
    for (const x of l.slice(0, 5)) console.log(`      ${x.id}, ${x.conta}: o motor dá ${JSON.stringify(x.vem)}, a ficha diz ${JSON.stringify(x.deve)}`);
  }
  process.exit(1);
}
console.log(`✓ test-motor · ${contas} contas de ${nC} criaturas e ${JOGADOR.length} referências de jogador e 5 casos raciais batem com as fichas`
  + (aceitas.length ? ` · ${aceitas.length} aceitas com motivo` : ''));
