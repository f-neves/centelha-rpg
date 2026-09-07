// Portão de integridade dos dados — roda ANTES do astro build.
// Falha com mensagem clara em: id duplicado, referência órfã (prereq/caminho/atributo),
// campo obrigatório faltando ou tipo inválido. Sem isso, o site não builda.
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import ts from 'typescript';
import { POR_MATERIAL as MATERIAIS } from './lib-materiais.mjs';
import { semComentario, sabeTirarChave } from './lib-deteccao-remocao-jsonb.mjs';

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
  if (g.condicaoAparente && !COND_IDS.has(g.condicaoAparente))
    fail(`efeito "${e.id}": grid.condicaoAparente "${g.condicaoAparente}" não existe em condicoes.json`);
  if (g.condicao && g.condicaoAparente)
    fail(`efeito "${e.id}": grid.condicao e grid.condicaoAparente não podem coexistir (um é aplicado pelo motor, o outro é só rótulo)`);
  if ((g.forma === 'nenhuma') !== (g.alvo === 'nenhum'))
    fail(`efeito "${e.id}": grid.forma "${g.forma}" e grid.alvo "${g.alvo}" divergem (um dos dois é "nenhuma/nenhum" e o outro não)`);
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


// ------------- o vocabulário de REMOÇÃO da `jogador_muda_efeito` (L42, L43)
//
// A MIGRAÇÃO 35 FEZ O `mordidos` FUNDIR EM VEZ DE SUBSTITUIR, e com isso a RPC
// do jogador passou a saber dizer PÕE e a NÃO saber dizer TIRE: chave ausente da
// carga sobrevive, em vez de sumir. O cliente TIRA chave · o
// `marcarMordido(ctx, ef, A_SAIR, null)` cai num `delete`, e é assim que a marca
// que segura a Arte em montagem é consumida quando ela sai.
//
// PELA RPC, ESSE `delete` É OPERAÇÃO SEM EFEITO: a marca fica gravada, e a
// próxima aba que ler a linha do banco acha que a Arte ainda deve a saída e a
// resolve DE NOVO. Dano recobrado, condição reaplicada, e um segundo "saiu" no
// registro.
//
// ESTE PORTÃO MORA AQUI, PERTO DO CLIENTE, e não dentro do `.sql`: quem for
// escrever a chamada não vai abrir a migração para conferir se pode.
//
// A EVIDÊNCIA É O TEXTO DA MIGRAÇÃO, E NÃO UM SÍMBOLO DO CLIENTE. Saber apagar
// chave é propriedade do corpo da função: nome de função pode existir com a
// capacidade ausente, e uma `jogador_tira_mordida` vazia passaria por qualquer
// portão que só procurasse o nome. Então o que se lê é a expressão do
// `mordidos = ...` na definição EFETIVA (a migração de maior número que redefine
// a função), atrás do operador de remoção do jsonb (`-` ou `#-`).
//
// A APOSENTADORIA NÃO PEDE EDIÇÃO NENHUMA AQUI: a migração que trouxer a
// remoção deixa este portão verde no mesmo diff, porque a condição é sobre o
// texto dela e não sobre uma data nem sobre uma lista escrita à mão.
{
  const RAIZ = path.join(DIR, '..', '..');
  const dirMig = path.join(RAIZ, 'supabase');
  // A DEFINIÇÃO EFETIVA é a da MAIOR migração que redefine a função: rodar as
  // migrações em ordem faz a última vencer, então é ela que descreve o banco.
  const defs = fs.readdirSync(dirMig)
    .filter((f) => /^migracao-(\d+)\.sql$/.test(f))
    .map((f) => ({ f, n: Number(f.match(/^migracao-(\d+)\.sql$/)[1]),
                   txt: fs.readFileSync(path.join(dirMig, f), 'utf8') }))
    .filter((m) => /function\s+public\.jogador_muda_efeito/.test(semComentario(m.txt)))
    .sort((a, b) => a.n - b.n);
  const efetiva = defs[defs.length - 1];

  // O CLIENTE TIRA CHAVE? O `delete` no mapa é a remoção, e ele só importa se
  // puder VIAJAR pela RPC · o atalho do jogador (`sbDoJogador`) troca todo
  // `from('arena_efeitos').update(...)` por uma chamada da função.
  const mod = fs.readFileSync(path.join(RAIZ, 'src/lib/artes-grid-mesa.ts'), 'utf8');
  const grid = fs.readFileSync(path.join(RAIZ, 'src/pages/mesa/grid.astro'), 'utf8');
  //
  // A DETECÇÃO NÃO PODE DEPENDER DA FORMA DA CHAMADA, e isto aqui já falhou uma
  // vez por isso: a primeira versão procurava `.update({ mordidos`, e no mesmo
  // dia o conserto trocou aquilo por `.update(patch)`. O portão ficou VERDE por
  // ter parado de enxergar o cliente, que é o pior modo de falhar que existe.
  // Agora ele procura o SENTIDO: um `delete` num objeto, e esse MESMO objeto
  // sendo atribuído a um `.mordidos`. Renomear a variável não escapa (o nome
  // sai do próprio texto), e renomear a função também não (ela não é citada).
  const tira = /delete\s+(\w+)\[[^\]]+\]/.exec(mod);
  const clienteTira = !!tira
    && new RegExp('mordidos\\s*=\\s*' + tira[1] + '\\b').test(mod);
  const viaja = /arena_efeitos'[\s\S]{0,200}?jogador_muda_efeito/.test(grid);

  if (clienteTira && viaja) {
    // A DETECÇÃO MORA EM `lib-deteccao-remocao-jsonb.mjs`, e não aqui, para
    // poder ser testada sozinha contra texto sintético — o controle positivo
    // que faltava. Ver `scripts/test-remocao-jsonb.mjs`.
    const sabeTirar = efetiva ? sabeTirarChave(semComentario(efetiva.txt)) : false;
    if (!sabeTirar) {
      fail('a `jogador_muda_efeito` NÃO sabe apagar chave do `mordidos`, e o cliente já tira uma '
        + '(`marcarMordido(ctx, ef, A_SAIR, null)`, em artes-grid-mesa.ts). Pelo atalho do jogador '
        + `(grid.astro, \`sbDoJogador\`) esse \`delete\` vira chamada da RPC, e a definição efetiva `
        + `(${efetiva ? efetiva.f : 'nenhuma migração a define'}) só FUNDE: a marca fica gravada, `
        + 'a próxima aba resolve a Arte de novo, e sai dano recobrado com um segundo "saiu" no '
        + 'registro. CONSERTO: uma migração cujo `mordidos = ...` use o operador de remoção do '
        + 'jsonb (`-` ou `#-`); este portão fica verde no mesmo diff, sem ninguém abrir este '
        + 'arquivo. O QUE ELE PROVA: a metade do CLIENTE, que é ninguém chamar a RPC antes de a '
        + 'migração com remoção existir NO REPOSITÓRIO. O QUE ELE NÃO PROVA: que o BANCO tenha o '
        + 'vocabulário · migração roda à mão, e nada daqui alcança produção. Ver L43.');
    }
  }
}

// ------------- toda escrita de `mordidos` em arena_efeitos passa por marcarMordido
//
// A FAMÍLIA (L45, "a fachada que preserva a forma e troca o destino") CUSTOU SAÍDA
// DUPLA EM PRODUÇÃO uma vez, quando um dos quatro pontos que escreviam `mordidos`
// escapou da leitura ("grava direto na tabela") por causa de um cliente trocado por
// baixo. O `marcarMordido` (`artes-grid-mesa.ts`) existe para isso: relê o banco e
// aplica UMA CHAVE, em vez de mandar o objeto inteiro montado de uma foto local. Se
// um QUINTO ponto nascer e não passar por ele, o defeito volta calado.
//
// A DETECÇÃO É POR SENTIDO, E NÃO POR LITERAL, por uma lição já paga nesta mesma
// leva: um portão irmão (o vocabulário de remoção da migração 36) teve uma versão
// que procurava o texto `.update({ mordidos` e ficou VERDE quando o próprio
// conserto trocou aquilo por `.update(patch)` — verde por ter parado de enxergar o
// cliente. Aqui o "sentido" é: percorrer a ÁRVORE SINTÁTICA (não o texto) atrás de
// toda chamada `.update(...)`/`.upsert(...)` feita sobre `.from('arena_efeitos')`,
// e RESOLVER o valor do argumento — objeto literal direto, OU a variável que o
// recebeu, seguindo a declaração dela e qualquer atribuição posterior a ela dentro
// da mesma função. Renomear a variável do payload (`patch` → `dados`, `carga`,
// o que for) não escapa, porque o rastreamento segue o VALOR, não o nome.
//
// O QUE ESTE PORTÃO DELIBERADAMENTE NÃO TENTA: escrita de `mordidos` na hora da
// CRIAÇÃO da linha (o `.insert(...)` de `gravarEfeito`) não é o defeito desta
// família — não há concorrência possível sobre uma linha que ainda não existe.
// Por isso só `.update`/`.upsert` são vigiados, nunca `.insert`.
//
// O LIMITE, DECLARADO AQUI PORQUE O OUTRO PORTÃO DA FAMÍLIA JÁ ENSINOU A DECLARAR
// NO TEXTO DO VERMELHO E NÃO SÓ NO REGISTRO: isto prova que nenhuma chamada
// `.update`/`.upsert` sobre `arena_efeitos`, nos dois arquivos vasculhados, carrega
// `mordidos` fora do `marcarMordido`. NÃO prova que uma escrita por uma ROTA
// DIFERENTE de `.update`/`.upsart` (uma RPC chamada direto por nome, um terceiro
// arquivo que também toque `arena_efeitos`) esteja coberta — é o item 5 da lista
// de formas de um portão ficar verde sem o problema resolvido (`docs/simulacao/
// CATALOGO.md`), e continua em aberto.
{
  const RAIZ = path.join(DIR, '..', '..');
  const arqTS = path.join(RAIZ, 'src/lib/artes-grid-mesa.ts');
  const arqAstro = path.join(RAIZ, 'src/pages/mesa/grid.astro');
  const srcTS = fs.readFileSync(arqTS, 'utf8');
  const srcAstroFull = fs.readFileSync(arqAstro, 'utf8');

  // O `.astro` não é TypeScript puro: só o miolo do <script> é. Recorta o texto
  // ANTES do parser, e guarda o deslocamento de linha para os erros apontarem
  // para o arquivo de verdade.
  const mScript = /<script[^>]*>([\s\S]*?)<\/script>/.exec(srcAstroFull);
  const srcAstroScript = mScript ? mScript[1] : '';
  const offsetAstro = mScript
    ? srcAstroFull.slice(0, mScript.index + mScript[0].indexOf(mScript[1])).split('\n').length - 1
    : 0;

  const achados = [];

  function acharPropriedade(obj, nome) {
    if (!obj || !ts.isObjectLiteralExpression(obj)) return null;
    for (const p of obj.properties) {
      if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === nome) return p;
      if (ts.isShorthandPropertyAssignment(p) && p.name.text === nome) return p;
      // `{ ...outraVar }`: o valor pode ter vindo de outro objeto espalhado.
      // Não resolve recursivamente (o alcance é uma função só), mas não finge
      // que o espalhamento é seguro por omissão: se a variável espalhada for
      // rastreável no mesmo corpo, ela também é uma leitura, não uma escrita
      // de `mordidos`, e cai fora do que este portão vigia.
    }
    return null;
  }

  // Acha a escrita de `mordidos` por trás de UM argumento de `.update`/`.upsert`:
  // objeto literal direto, ou a variável que o recebeu — pela declaração dela e
  // por qualquer atribuição `alvo.mordidos = ...` no MESMO corpo de função.
  //
  // DEVOLVE TRÊS ESTADOS, E NÃO DOIS: `true` (confirmado — a chave está lá),
  // `false` (confirmado AUSENTE — a variável foi declarada NESTE corpo com um
  // objeto literal por inicializador, e nenhuma atribuição posterior a tocou),
  // ou `null` ("NÃO RESOLVI" — o argumento não é nem literal nem identificador
  // rastreável até uma declaração local, ou a declaração achada não é um
  // literal inspecionável). O CHAMADOR TRATA `null` COMO SUSPEITO, NUNCA COMO
  // SEGURO: "não resolvi" não é o mesmo fato que "não achei remoção", e
  // confundir os dois faria este portão dizer "não há cliente tirando chave"
  // quando a resposta certa era "não sei".
  function escritaDeMordidos(arg, corpoDaFuncao, sf) {
    if (ts.isObjectLiteralExpression(arg)) return !!acharPropriedade(arg, 'mordidos');
    if (!ts.isIdentifier(arg) || !corpoDaFuncao) return null;
    const nomeVar = arg.text;
    let achouChave = false;
    let declaradaLocalmente = false;
    let inicializadorIlegivel = false;
    const visita = (n) => {
      if (achouChave) return;
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === nomeVar) {
        declaradaLocalmente = true;
        if (n.initializer) {
          if (ts.isObjectLiteralExpression(n.initializer)) {
            if (acharPropriedade(n.initializer, 'mordidos')) achouChave = true;
          } else {
            // Inicializada por chamada, spread de outra variável, ou qualquer
            // coisa que não seja um objeto literal direto: não dá para
            // confirmar NEM negar por aqui.
            inicializadorIlegivel = true;
          }
        }
      }
      if (!achouChave && ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.EqualsToken
          && ts.isPropertyAccessExpression(n.left) && ts.isIdentifier(n.left.expression)
          && n.left.expression.text === nomeVar && n.left.name.text === 'mordidos') {
        achouChave = true;
      }
      if (!achouChave) ts.forEachChild(n, visita);
    };
    visita(corpoDaFuncao);
    if (achouChave) return true;
    if (!declaradaLocalmente) return null; // veio de fora do corpo (parâmetro, closure): não sei
    if (inicializadorIlegivel) return null; // declarada, mas o valor inicial não é inspecionável
    return false; // declarada aqui, objeto literal sem `mordidos`, sem reatribuição
  }

  function funcaoEnvolvente(node) {
    let n = node.parent;
    while (n) {
      if (ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n)
          || ts.isMethodDeclaration(n)) return n.body || n;
      n = n.parent;
    }
    return null;
  }

  function varre(nomeArquivo, codigo, offsetLinha, faixaPermitida) {
    const sf = ts.createSourceFile(nomeArquivo, codigo, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const linhaDe = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1 + offsetLinha;
    const dentroDoHelper = (pos) => !!faixaPermitida && pos >= faixaPermitida[0] && pos <= faixaPermitida[1];

    const visita = (node) => {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
          && (node.expression.name.text === 'update' || node.expression.name.text === 'upsert')) {
        const receptor = node.expression.expression;
        // A vigia é sobre `arena_efeitos`, não sobre "qualquer .update": o texto
        // do RECEPTOR (a cadeia até o `.from(...)`) nomeia a tabela, e nomear a
        // tabela é semântica, não estilo de chamada.
        if (/arena_efeitos/.test(receptor.getText(sf)) && node.arguments[0]
            && !dentroDoHelper(node.getStart(sf))) {
          const corpo = funcaoEnvolvente(node);
          // `false` É O ÚNICO VALOR QUE LIBERA A CHAMADA. `null` (não resolvi)
          // é tratado IGUAL a `true` (achei): ambos entram na lista, e a
          // mensagem diz qual dos dois é, porque "não sei" pede investigação
          // e "achei" pede o mesmo conserto de sempre.
          const r = escritaDeMordidos(node.arguments[0], corpo, sf);
          if (r !== false) {
            const local = `${nomeArquivo}:${linhaDe(node.getStart(sf))}`;
            achados.push(r === null ? `${local} (NÃO RESOLVI o payload — trato como suspeito)` : local);
          }
        }
      }
      ts.forEachChild(node, visita);
    };
    visita(sf);
  }

  // A FAIXA PERMITIDA é o corpo da própria `marcarMordido` — achado pelo nome, e
  // não por número de linha, porque número de linha é a mesma fragilidade que
  // este portão existe para não ter.
  const sfMod = ts.createSourceFile('artes-grid-mesa.ts', srcTS, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let faixaHelper = null;
  (function acha(n) {
    if (ts.isFunctionDeclaration(n) && n.name && n.name.text === 'marcarMordido') {
      faixaHelper = [n.getStart(sfMod), n.getEnd()];
    }
    ts.forEachChild(n, acha);
  })(sfMod);

  varre('src/lib/artes-grid-mesa.ts', srcTS, 0, faixaHelper);
  varre('src/pages/mesa/grid.astro', srcAstroScript, offsetAstro, null);

  if (achados.length) {
    fail('escrita de `mordidos` em `arena_efeitos` fora do `marcarMordido`, achada por SENTIDO '
      + '(uma chamada `.update`/`.upsert` cujo argumento — direto ou por variável rastreada — carrega '
      + `a chave \`mordidos\`): ${achados.join(', ')}. Renomear a variável do payload não escapa deste `
      + 'portão. CONSERTO: roteie a escrita por `marcarMordido(ctx, ef, chave, valor)`. O QUE ELE PROVA: '
      + 'nenhuma chamada `.update`/`.upsert` sobre `arena_efeitos`, nos dois arquivos vasculhados, carrega '
      + '`mordidos` fora do helper. O QUE ELE NÃO PROVA: que uma escrita por uma ROTA DIFERENTE (uma RPC '
      + 'chamada direto, um terceiro arquivo) não exista. Ver L45.');
  }
}

if (erros.length) {
  console.error(`\n✘ Validação de dados FALHOU (${erros.length} erro(s)):`);
  for (const e of erros) console.error('  • ' + e);
  console.error('');
  process.exit(1);
}
console.log(`✓ Dados válidos: ${data.tecnicas.length} técnicas, ${data.caminhos.length} caminhos, ${data.artes.length} artes, ${data.efeitos.length} efeitos — referências íntegras.`);
