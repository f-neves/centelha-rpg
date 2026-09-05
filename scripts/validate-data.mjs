// Portão de integridade dos dados — roda ANTES do astro build.
// Falha com mensagem clara em: id duplicado, referência órfã (prereq/caminho/atributo),
// campo obrigatório faltando ou tipo inválido. Sem isso, o site não builda.
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { POR_MATERIAL as MATERIAIS } from './lib-materiais.mjs';

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'src', 'data');
const read = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
const erros = [];
const fail = (msg) => erros.push(msg);

const custo = z.object({ energia: z.number().int().nonnegative().optional(), mana: z.number().int().nonnegative().optional(), vontade: z.number().int().nonnegative().optional() });
const soakModos = z.object({ impacto: z.number().int(), corte: z.number().int(), perfuracao: z.number().int() });
// Um degrau de régua, igual em todo lugar: número, rótulo do degrau e o texto dele.
const escala = z.array(z.object({ nivel: z.number().int(), rotulo: z.string().optional(), texto: z.string(), conduta: z.string().optional() }));
const S = {
  atributos: z.object({ id: z.string(), nome: z.string(), grupo: z.enum(['fisico', 'social', 'mental']), descricao: z.string(), niveis: escala.optional() }),
  habilidades: z.object({ id: z.string(), nome: z.string(), grupo: z.enum(['combate', 'fisica', 'social', 'saber', 'tecnica']), atributos: z.array(z.string()).optional(), secundaria: z.boolean().optional(), descricao: z.string(), niveis: escala.optional() }),
  'habilidades-secundarias': z.object({ id: z.string(), nome: z.string(), grupo: z.enum(['corpo', 'sociais', 'conhecimento', 'oficio', 'expressao', 'subterfugio', 'interior']), descricao: z.string(), niveis: escala.optional() }),
  virtudes: z.object({ id: z.string(), nome: z.string(), resiste: z.string(), descricao: z.string(), niveis: escala.optional() }),
  // Os seis níveis são obrigatórios: um Antecedente com a régua pela metade não tem como
  // ser comprado nem lido, e o capítulo é gerado direto desta tabela.
  antecedentes: z.object({
    id: z.string(), ordem: z.number().int().min(1), nome: z.string(),
    formato: z.enum(['unico', 'nomeado']), notaFormato: z.string().optional(),
    descricao: z.string(), niveis: escala.length(6),
    exemplo: z.string().optional(), amarra: z.string().optional(),
    tetoCriacao: z.number().int().min(1).max(6).optional(),
  }),
  caminhos: z.object({ id: z.string(), nome: z.string(), trilha: z.enum(['corpo', 'voz', 'mente']), atributo: z.string(), habilidade_ancora: z.string().optional(), descricao: z.string() }),
  tecnicas: z.object({ id: z.string(), nome: z.string(), caminho: z.string(), atributo: z.string(), nivel: z.number().int().min(1).max(6), efeito: z.enum(['bonus', 'soak', 'dano', 'penetracao', 'carga', 'salto', 'velocidade', 'tamanho', 'estado']), tipo: z.enum(['passiva', 'ativa', 'reflexiva']), custo, prereq: z.array(z.string()), aliases: z.array(z.string()), texto: z.string(), pendente: z.boolean() }),
  artes: z.object({ id: z.string(), nome: z.string(), categoria: z.enum(['elemental', 'universal']), atributo_conjuracao: z.string(), niveis: z.array(z.object({ nivel: z.number().int().min(1).max(6), nome: z.string(), efeito: z.string(), custo: z.object({ mana: z.number().int().min(1).max(6) }).optional(), exemplos: z.array(z.string()).optional() })).min(5).max(6), aliases: z.array(z.string()), pendente: z.boolean() }),
  efeitos: z.object({
    id: z.string(), nome: z.string(), nivel: z.number().int().min(1).max(6), escalonavel: z.boolean(),
    artes: z.array(z.object({ id: z.string(), sabor: z.string() })).min(1),
    parametros: z.array(z.object({
      nome: z.string(), tipo: z.enum(['padrao', 'substitui', 'fixo']),
      regua: z.enum(['breve', 'longa']).optional(), substitui: z.string().optional(),
      unidade: z.string().optional(), escala: z.array(z.string()).optional(),
      valor: z.string().optional(), nota: z.string().optional(),
    })).min(1),
    efeito: z.string(), notas: z.string().optional(),
  }),
  glossario: z.object({ id: z.string(), termo: z.string(), aliases: z.array(z.string()), definicao: z.string() }),
  racas: z.object({ id: z.string(), nome: z.string(), custo: z.number().int().nonnegative(), atributos: z.record(z.number().int()), aparenciaMod: z.number().int(), aparenciaUniversal: z.boolean(), descricao: z.string(), tracos: z.array(z.string()) }),
  inimigos: z.object({
    id: z.string(), nome: z.string(), tipo: z.enum(['capanga', 'soldado', 'elite', 'fera', 'chefe']),
    categoria: z.string().optional(),
    ameaca: z.number().int().min(1).max(6), centelha: z.number().int().min(0).max(10),
    conceito: z.string(), descricao: z.string(), tags: z.array(z.string()),
    pv: z.number().int(), defesa: z.number().int(), defesaSocial: z.union([z.number().int(), z.literal('-')]), defesaMental: z.union([z.number().int(), z.literal('-')]),
    vontade: z.number().int(),
    soak: soakModos, resistPerf: z.number().int().min(0),
    iniciativa: z.string(), atributos: z.record(z.number().int()),
    ataques: z.array(z.object({ nome: z.string(), pool: z.string(), dano: z.string(), ticks: z.number().int(), notas: z.string().optional() })),
    tecnicas: z.array(z.string()), artes: z.array(z.object({ id: z.string(), nivel: z.number().int() })),
    poderes: z.array(z.object({ efeito: z.string(), tipo: z.enum(['proeza', 'feiticaria', 'natural']), alvo: z.string(), caminho: z.string().optional(), arte: z.string().optional() })).optional(),
    notas: z.string(), pendente: z.boolean(),
  }),
  armas: z.object({
    id: z.string(), nome: z.string(), classe: z.enum(['leve', 'media', 'pesada', 'haste', 'distancia', 'arremesso']),
    atrib: z.string(), pericia: z.string(), dado: z.number().int().min(1).max(3), danoBonus: z.number().int().optional(), acerto: z.number().int(),
    defesaArma: z.number().int(), maos: z.number().int().min(1).max(2), ticks: z.number().int(), folego: z.number().int().min(0).optional(),
    forcaMult: z.number().optional(), forcaCap: z.number().int().optional(), forcaMin: z.number().int().optional(),
    alcance: z.enum(['curto', 'medio', 'longo']).optional(),
    tipoDano: z.enum(['corte', 'perfurante', 'impacto']), pen: z.number().int().min(0).max(5),
    fichaModo: z.enum(['corte', 'perfurante', 'impacto']).optional(),
    modos: z.array(z.object({ tipo: z.enum(['corte', 'perfurante', 'impacto']), perf: z.number().int().min(0).max(5).optional(), principal: z.boolean() })),
    tags: z.array(z.string()), notas: z.string(),
  }),
  armaduras: z.object({ id: z.string(), nome: z.string(), classe: z.enum(['nenhuma', 'leve', 'media', 'pesada']), soak: soakModos, resistPerf: z.number().int().min(0), penalidade: z.number().int().min(0), acesso: z.number().int().optional(), notas: z.string() }),
  escudos: z.object({ id: z.string(), nome: z.string(), bloqCaC: z.number().int(), habilProjetil: z.boolean(), penalidade: z.number().int(), acesso: z.number().int().optional(), notas: z.string() }),
};

const data = {};
for (const k of Object.keys(S)) {
  const arr = read(`${k}.json`);
  if (!Array.isArray(arr)) { fail(`${k}.json: deve ser um array`); continue; }
  const ids = new Set();
  arr.forEach((item, i) => {
    const r = S[k].safeParse(item);
    if (!r.success) fail(`${k}[${i}] (${item.id ?? '?'}): ${r.error.issues.map((e) => `${e.path.join('.')} ${e.message}`).join('; ')}`);
    if (item.id != null) { if (ids.has(item.id)) fail(`${k}: id duplicado "${item.id}"`); ids.add(item.id); }
  });
  data[k] = arr;
}

// integridade referencial
const setOf = (k) => new Set((data[k] || []).map((x) => x.id));
const A = setOf('atributos'), C = setOf('caminhos'), T = setOf('tecnicas');
for (const c of data.caminhos || []) if (!A.has(c.atributo)) fail(`caminho "${c.id}": atributo inexistente "${c.atributo}"`);
// `habilidade_ancora` é texto livre ("Oratória / Liderança"), e por isso apodrecia calado: a
// revisão de 2026-08 encontrou três Caminhos ancorados em perícias que não existiam mais
// (Ladinagem, que virou Prestidigitação, e Tática, que nunca existiu). Cada nome separado por
// barra tem de existir na data viva. Virtude também vale como âncora, porque também entra em pool.
const NOMES_PERICIA = new Set([...(data.habilidades || []), ...(data['habilidades-secundarias'] || []), ...(data.virtudes || [])].map((h) => h.nome));
for (const c of data.caminhos || [])
  for (const n of String(c.habilidade_ancora || '').split('/').map((s) => s.trim()).filter(Boolean))
    if (!NOMES_PERICIA.has(n)) fail(`caminho "${c.id}": habilidade_ancora inexistente "${n}"`);
for (const t of data.tecnicas || []) {
  if (!C.has(t.caminho)) fail(`técnica "${t.id}": caminho inexistente "${t.caminho}"`);
  if (!A.has(t.atributo)) fail(`técnica "${t.id}": atributo inexistente "${t.atributo}"`);
  for (const p of t.prereq) if (!T.has(p)) fail(`técnica "${t.id}": prereq órfão "${p}"`);
}
for (const a of data.artes || []) if (!A.has(a.atributo_conjuracao)) fail(`arte "${a.id}": atributo_conjuracao inexistente "${a.atributo_conjuracao}"`);
const ART = setOf('artes'), H = setOf('habilidades');
for (const e of data.efeitos || []) for (const x of e.artes) if (!ART.has(x.id)) fail(`efeito "${e.id}": arte inexistente "${x.id}"`);

for (const i of data.inimigos || []) {
  for (const t of i.tecnicas) if (!T.has(t)) fail(`inimigo "${i.id}": técnica inexistente "${t}"`);
  for (const a of i.artes) if (!ART.has(a.id)) fail(`inimigo "${i.id}": arte inexistente "${a.id}"`);
}
for (const w of data.armas || []) {
  if (!A.has(w.atrib)) fail(`arma "${w.id}": atributo inexistente "${w.atrib}"`);
  if (!H.has(w.pericia)) fail(`arma "${w.id}": perícia inexistente "${w.pericia}"`);
  // A ARMA DE VÁRIOS PRINCIPAIS TEM DE DIZER QUAL MODO VAI NA FICHA (D45).
  //
  // Sem este campo quem decide é a ordem de exibição de `MODO_ORDEM`, dentro do
  // `find` de `combate-resumo.ts`, e ela decide EM SILÊNCIO: a Alabarda saía
  // como impacto, que é o pior ou o empatado-pior contra os três alvos de
  // referência, sem que nada em lugar nenhum tivesse escolhido isso. Uma arma
  // nova com dois principais reintroduziria o defeito do mesmo jeito, e é para
  // isso que esta conferência existe.
  const principais = (w.modos || []).filter((m) => m.principal);
  if (principais.length > 1 && !w.fichaModo) {
    fail(`arma "${w.id}": ${principais.length} modos principais e nenhum \`fichaModo\`.`
      + ' Com mais de um principal, o catálogo precisa dizer qual modo vai na expressão'
      + ' de dano da ficha, senão quem decide é a ordem de exibição, em silêncio');
  }
  if (w.fichaModo && !(w.modos || []).some((m) => m.tipo === w.fichaModo)) {
    fail(`arma "${w.id}": \`fichaModo\` "${w.fichaModo}" não é um dos modos dela`);
  }
  if (w.fichaModo && principais.length && !principais.some((m) => m.tipo === w.fichaModo)) {
    fail(`arma "${w.id}": \`fichaModo\` "${w.fichaModo}" é um modo SECUNDÁRIO.`
      + ' A ficha não pode nascer no modo que paga −2 de acerto e −1d6 de dano');
  }
}

// Fraquezas e resistências do bestiário (satélite semeado por gen-elementos.mjs).
// Vocabulário FECHADO de propósito: palavra nova aqui é decisão de regra, não digitação.
const ELEM_VOCAB = new Set([
  'fogo', 'agua', 'gelo', 'raio', 'vento', 'terra', 'luz', 'sombra',
  'corte', 'perfuracao', 'impacto', 'sagrado', 'profano', 'prata', 'sol',
]);
// A projeção no tabuleiro (bloco `grid`, semeado por gen-grid-artes.mjs).
// Vocabulário fechado e cobertura cobrada: Efeito novo sem `grid` não tem como
// ser conjurado no Grid, e é melhor o build parar aqui do que a mesa descobrir
// isso no meio da cena.
const G_FORMAS = new Set(['nenhuma', 'alvo', 'aura', 'zona', 'muro', 'cone', 'linha', 'cadeia', 'token', 'movimento']);
const G_ANCORAS = new Set(['nenhuma', 'conjurador', 'ponto', 'alvo', 'objeto']);
const G_GATILHOS = new Set(['passivo', 'imediato', 'ao-entrar', 'por-turno', 'ao-tocar', 'armadilha']);
const G_MATERIAS = new Set(['impacto', 'corte', 'perfuracao']);
const COND_IDS = new Set((read('condicoes.json').lista || []).map((c) => c.id));
for (const a of data.artes || []) {
  if (!a.grid) fail(`arte "${a.id}": sem bloco \`grid\` (rode gen-grid-artes.mjs)`);
  else if (a.grid.elemento && !ELEM_VOCAB.has(a.grid.elemento))
    fail(`arte "${a.id}": grid.elemento "${a.grid.elemento}" fora do vocabulário`);
}
for (const e of data.efeitos || []) {
  const g = e.grid;
  if (!g) { fail(`efeito "${e.id}": sem bloco \`grid\` (rode gen-grid-artes.mjs)`); continue; }
  if (!G_FORMAS.has(g.forma)) fail(`efeito "${e.id}": grid.forma inválida "${g.forma}"`);
  if (!G_ANCORAS.has(g.ancora)) fail(`efeito "${e.id}": grid.ancora inválida "${g.ancora}"`);
  if (!G_GATILHOS.has(g.gatilho)) fail(`efeito "${e.id}": grid.gatilho inválido "${g.gatilho}"`);
  if (g.materia && !G_MATERIAS.has(g.materia)) fail(`efeito "${e.id}": grid.materia inválida "${g.materia}"`);
  if (g.condicao && !COND_IDS.has(g.condicao))
    fail(`efeito "${e.id}": grid.condicao "${g.condicao}" não existe em condicoes.json`);
}

if (fs.existsSync(path.join(DIR, 'elementos-bestiario.json'))) {
  const ELE = read('elementos-bestiario.json');
  const idsBesta = new Set((data.inimigos || []).map((i) => i.id));
  for (const [id, v] of Object.entries(ELE)) {
    if (!idsBesta.has(id)) fail(`elementos-bestiario "${id}": criatura inexistente`);
    const f = v.fraquezas || [], r = v.resistencias || [];
    if (!f.length && !r.length) fail(`elementos-bestiario "${id}": entrada vazia`);
    for (const k of [...f, ...r]) if (!ELEM_VOCAB.has(k)) fail(`elementos-bestiario "${id}": palavra fora do vocabulário "${k}"`);
    const choque = f.filter((x) => r.includes(x));
    if (choque.length) fail(`elementos-bestiario "${id}": "${choque.join(', ')}" é fraqueza e resistência ao mesmo tempo (as duas se anulam)`);
  }
}

// Criaturas suas: id único e material conhecido. Um material com erro de digitação
// passaria silenciosamente como "sem fraqueza nenhuma", que é o pior tipo de bug.
if (fs.existsSync(path.join(DIR, 'inimigos-custom.json'))) {
  const CUSTOM = read('inimigos-custom.json');
  const vistos = new Set();
  for (const c of CUSTOM) {
    if (!c?.id) { fail('inimigos-custom: entrada sem id'); continue; }
    if (vistos.has(c.id)) fail(`inimigos-custom "${c.id}": id repetido`);
    vistos.add(c.id);
    if (!c.nome) fail(`inimigos-custom "${c.id}": sem nome`);
    if (c.material && !MATERIAIS[String(c.material).toLowerCase()]) {
      fail(`inimigos-custom "${c.id}": material desconhecido "${c.material}" (conhecidos: ${Object.keys(MATERIAIS).join(', ')})`);
    }
    for (const k of [...(c.fraquezas || []), ...(c.resistencias || [])]) {
      if (!ELEM_VOCAB.has(k)) fail(`inimigos-custom "${c.id}": palavra fora do vocabulário "${k}"`);
    }
  }
}

// ------------------------------------- a mesma regra escrita em três arquivos
//
// A INVESTIDA ESTÁ ESCRITA COM NÚMERO EM TRÊS LUGARES QUE NENHUM GERADOR LIGA:
// `combate.movimento.investida` no `regras.json`, a tabela do § Investida do
// capítulo, e a nota da condição `investindo`. Elas concordam porque foram
// digitadas na mesma sentada (`0f191fe`, 22/08/2026) e nada as prendia: mexer no
// `defesaExtra` deixaria as outras duas dizendo o número velho, em silêncio, que
// é a forma exata do defeito do comentário que envelhece.
//
// Levantado em 05/09/2026, quando o `travessiaNota` apareceu com um QUARTO
// número (−6) que ninguém lia. Este bloco é o que impede o quinto.
//
// Ele confere PRESENÇA DO NÚMERO no texto, e não o texto inteiro: a redação é
// livre, o número não é. E o campo `fonte` da condição, que sempre apontou para
// `combate · movimento` e nunca foi lido por ninguém, passa a valer alguma coisa.
{
  const RAIZ = path.join(DIR, '..', '..');
  const mov = (read('regras.json').combate || {}).movimento || {};
  const inv = mov.investida || {};
  const cond = (read('condicoes.json').lista || []).find((c) => c.id === 'investindo');
  // Os números são escritos com o sinal de menos TIPOGRÁFICO nos textos (−, U+2212)
  // e com o hífen no JSON. Comparar sem normalizar acusaria diferença onde não há.
  const temNum = (txt, n) => String(txt || '').replace(/−/g, '-').includes(String(n));

  if (!cond) fail('condicoes.json: a condição "investindo" sumiu, e a régua da Investida cita ela');
  else {
    if (cond.defesa !== inv.defesaExtra) {
      fail(`a condição "investindo" (Defesa ${cond.defesa}) discorda de `
        + `combate.movimento.investida.defesaExtra (${inv.defesaExtra}) no regras.json`);
    }
    if (!temNum(cond.nota, inv.defesaExtra) || !temNum(cond.nota, `+${inv.danoDados}d6`)) {
      fail(`a nota da condição "investindo" não repete os números da régua `
        + `(${inv.defesaExtra} de Defesa e +${inv.danoDados}d6): "${String(cond.nota).slice(0, 60)}…"`);
    }
  }

  const cap = fs.readFileSync(path.join(RAIZ, 'src/content/chapters/combate.md'), 'utf8');
  const linha = cap.split('\n').find((l) => /Preparo investindo/.test(l));
  if (!linha) fail('o capítulo de combate perdeu a linha "Preparo investindo" da tabela da Investida');
  else if (!temNum(linha, inv.defesaExtra) || !temNum(linha, `+${inv.danoDados}d6`)) {
    fail(`a tabela do capítulo discorda da régua da Investida `
      + `(esperado ${inv.defesaExtra} e +${inv.danoDados}d6): "${linha.trim()}"`);
  }

  // E O QUARTO NÚMERO NÃO VOLTA. O −6 morava na `travessiaNota` e só fechava se
  // a Investida carregasse o −4 da Corrida MAIS o −2 dela. Decidido em
  // 05/09/2026 que ela gasta a guarda da Corrida e nada mais: o total é o da
  // Corrida, uma vez só. Qualquer soma dos dois de novo cai aqui.
  const somaProibida = (mov.corrida?.defesa ?? -4) + (inv.defesaExtra ?? -2);
  const sim = (read('regras.json').combate || {}).simultaneo || {};
  const nota = String(sim.passoNoGolpe?.travessiaNota || '');
  if (temNum(nota, somaProibida)) {
    fail(`a travessiaNota traz ${somaProibida} de Defesa investindo: a Investida gasta a guarda `
      + `da Corrida (${mov.corrida?.defesa}), e não a Corrida MAIS o degrau dela`);
  }
}

// ------------------------------- a peneira da L38, e o dia em que ela mudar
//
// A CONDIÇÃO COM PRAZO VENCE SOZINHA, E A POSTA À MÃO NÃO VENCE NUNCA. A regra
// é da mesa (05/09/2026), e o que a torna barata é uma propriedade do dado que
// já existia sem ninguém ter projetado: NADA QUE O MESTRE PÕE À MÃO GRAVA `ate`.
// Por isso o `varrerCondicoesVencidas` pergunta uma coisa só, "tem `ate`?", e é
// um mecanismo em vez de dois.
//
// ISSO É FRÁGIL DE UM JEITO ESPECÍFICO: no dia em que o diálogo do mestre ganhar
// campo de duração, ele passa a gravar `ate` e a peneira muda de significado sem
// que ninguém encoste nela. A varredura passaria a derrubar o que o mestre pôs,
// que é exatamente o que a regra proíbe.
//
// Este bloco é o portão desse dia. Ele lê o ARQUIVO do diálogo, e não os dados,
// porque o defeito nasce no código: enquanto o `mesa-condicoes.ts` não escrever
// `ate`, a peneira vale. A bancada tem o par de fora (`cenaCondicaoQueVence`, no
// `test-grid-simultaneo.mjs`), que mede a mesma coisa na saída do diálogo de
// verdade; este aqui é o barato, e roda a cada commit.
//
// QUANDO A FEATURE CHEGAR, o conserto não é apagar este bloco: é ensinar a
// varredura a separar prazo pedido de prazo herdado (por `porArte`/`auto`, que
// já viajam gravados), e só então soltar a trava.
{
  const RAIZ = path.join(DIR, '..', '..');
  const arq = path.join(RAIZ, 'src/lib/mesa-condicoes.ts');
  const src = fs.readFileSync(arq, 'utf8');
  // Só as linhas que ESCREVEM condição: o comentário pode falar de `ate` à
  // vontade, e é bom que fale.
  const escrevem = src.split('\n')
    .map((l, i) => [i + 1, l])
    .filter(([, l]) => /c\.condicoes\s*=/.test(l) || /^\s*(id|nome|cor|icone|acao|dados|defesa|porRodada|nota|ate)\s*:/.test(l))
    .filter(([, l]) => !/^\s*(\/\/|\*)/.test(l));
  const comAte = escrevem.filter(([, l]) => /\bate\b\s*:/.test(l));
  if (comAte.length) {
    fail('o diálogo de condições do mestre passou a gravar `ate` '
      + `(${comAte.map(([n]) => `mesa-condicoes.ts:${n}`).join(', ')}). `
      + 'A peneira do `varrerCondicoesVencidas` é "tem `ate`?", e ela só vale enquanto nada '
      + 'posto à mão tiver prazo: do jeito que está, a varredura vai derrubar o que o mestre pôs. '
      + 'Ver L38 no Pendencias.md.');
  }
}

if (erros.length) {
  console.error(`\n✘ Validação de dados FALHOU (${erros.length} erro(s)):`);
  for (const e of erros) console.error('  • ' + e);
  console.error('');
  process.exit(1);
}
console.log(`✓ Dados válidos: ${data.tecnicas.length} técnicas, ${data.caminhos.length} caminhos, ${data.artes.length} artes, ${data.efeitos.length} efeitos — referências íntegras.`);
