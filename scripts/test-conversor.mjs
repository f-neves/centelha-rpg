// test-conversor.mjs · o conversor novo (scripts/conversor-criatura.mjs) contra os dois exemplos do formato (A3).
//
// O QUE ISTO GUARDA. O plano-conversao.md, A3: "o conversor, rodado na ficha do lobisomem e na do dragão branco, tem de
// dar os dois exemplos chave por chave". As fichas e os exemplos moram fora do repositório; as cópias de 26/10/2026 estão
// em scripts/fixtures/conversor/, com o JSON do site de cada um (de onde vêm o lore e as imagens).
//
// A FICHA ANDOU DEPOIS DO EXEMPLO, e o exemplo reescreveu à mão alguns textos dela. Cada diferença tem a classe e o motivo
// escritos abaixo, e nenhuma outra passa:
//   - FORMATO (nome de chave, tipo, id, aninhamento, a lista `formas`): não tem exceção;
//   - FICHA: a ficha mudou depois do exemplo, com a prova (a pasta de antes, em tmp/arquiteto/bestiario/);
//   - EXEMPLO: o exemplo escreveu um texto que a ficha não tem (e não mudou); vai ao Arquiteto (perguntas.md, P8);
//   - AJUSTE: a ficha espera o lote de ajuste do texto de trabalho (PERGUNTAS.md, pergunta 1, 26/10/2026).
// A `revisao` se compara pelo conjunto de campos, e não pelo motivo, que é texto livre. As listas encolhem com o
// problema: a entrada que não foi usada nesta execução falha.
//
// E as paradas: para cada uma do plano (pgr que não soma, apoio que não se tira, texto de trabalho, Habilidade fora do
// catálogo, linha das Manobras sem classe, revisao que não aponta, esquema), um defeito plantado numa cópia do
// lobisomem tem de parar o conversor e nomear o problema.
//
//   node scripts/test-conversor.mjs
import fs from 'node:fs';
import path from 'node:path';
import { converterFicha, aponta } from './conversor-criatura.mjs';
import { criaturaNovaSchema, criaturaParaLeituraSchema } from './criatura-schema.mjs';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FIX = path.join(ROOT, 'scripts/fixtures/conversor');
const ler = (f) => fs.readFileSync(path.join(FIX, f), 'utf8');
const falhas = [];

const AJUSTE_FORMAS = 'FICHA: o ajuste das formas de 24/10/2026 (D-230), depois do exemplo; a de antes está em tmp/arquiteto/bestiario/fichas-v3-antes-ajuste-formas-2026-10-24/lobisomem.md';
const NENHUMA = 'EXEMPLO: a ficha escreve "nenhum", como o GUIA-FICHA.md, seção 11, manda ("esquiva, corpo, mente ou nenhum"); o exemplo escreveu "nenhuma"';
const DIFERENCAS = {
  lobisomem: {
    'corpo.apoio': 'EXEMPLO: o exemplo não traz o `apoio`, que o formato-criatura.md, 2.2, diz obrigatório (e o exemplo falha no esquema por isso)',
    'corpo.posturaDoTamanho': 'EXEMPLO: a linha Tamanho diz "(0,98 m², de frente)"; o exemplo juntou o "de pé" da linha Área',
    'habilidadesEspeciais[Forma mutável].efeito': 'EXEMPLO: a ficha diz "(Variantes)" no Efeito, e o exemplo tirou',
    'habilidadesEspeciais[Forma mutável].resistencia': NENHUMA,
    'habilidadesEspeciais[Mordida que derruba e amaldiçoa].efeito': 'EXEMPLO: a ficha diz "; e quem sobrevive", também na de antes do ajuste; o exemplo tirou o "e"',
    'habilidadesEspeciais[Afinidade com lobos].formas': `${AJUSTE_FORMAS} (a nota "formas" da ficha: "a Afinidade com lobos em todas, porque vem da maldição")`,
    'habilidadesEspeciais[Afinidade com lobos].resistencia': NENHUMA,
    'comoLuta[caça em bando].formas': `${AJUSTE_FORMAS} (o "como luta" em duas linhas)`,
    'comoLuta[caça em bando].texto': `${AJUSTE_FORMAS} (o "de dia, volta a ser homem comum" foi para a linha nova)`,
    'comoLuta[homem comum de dia]': `${AJUSTE_FORMAS} (a linha nova)`,
    'sentidos[faro].descricao': `${AJUSTE_FORMAS} ("de lobo, que segue o rastro de horas")`,
    'fisiologia.tracos': `${AJUSTE_FORMAS} (os traços de homem foram para a forma humana)`,
    'formas[forma humana].corpo.postura': 'EXEMPLO: a linha da forma humana não diz a Postura; o exemplo escreveu "bípede, de pé"',
    'formas[forma humana].fisiologia.tracos': `${AJUSTE_FORMAS} (os Traços na linha da forma)`,
    'formas[forma de lobo].fisiologia': `${AJUSTE_FORMAS} (a Camuflagem e os Traços na linha da forma)`,
  },
  'dragao-branco-jovem': {
    'corpo.segundoTamanho.area': 'EXEMPLO: a linha diz "(2,5 m², ...)"; o exemplo tirou 2,54 da conta da Justificativa',
    'habilidadesEspeciais[Sopro de frio].ativacao': 'EXEMPLO: o exemplo reescreveu a Ativação como "uma ação: o ataque Sopro de frio" (formato-criatura.md, 4.5); a ficha diz "uma ação, Velocidade 7, o ataque natural a distância da tabela (Vigor + Disparo)"',
    'habilidadesEspeciais[Sopro de frio].dano': 'EXEMPLO: o exemplo reescreveu o Dano como "o do Sopro de frio" (formato-criatura.md, 4.5); a ficha diz "6d6 + Centelha, gelo"',
    'habilidadesEspeciais[Multiataque].efeito': 'AJUSTE: o texto de trabalho "(site)", "C-046" e "o autor decide" sai da ficha no lote de ajuste da pergunta 1; até lá o conversor para nele',
    'habilidadesEspeciais[Andar no gelo].resistencia': NENHUMA,
    'habilidadesEspeciais[Nevasca].resistencia': NENHUMA,
    'habilidadesEspeciais[Voo em mergulho].resistencia': NENHUMA,
    'comoLuta[escava].texto': 'EXEMPLO: o formato-criatura.md, 4.1, diz que o "a 3 m por Tick" saiu do texto; a ficha ainda o tem',
  },
};
const REVISAO = {
  lobisomem: {
    'ataques.Mordida': 'só no conversor: o leitor de 27/10/2026 lê a nota de ataque já existente na ficha; o exemplo anterior não a traz',
    'formas.humana': 'só no conversor: a marca da Justificativa da linha da forma humana; o exemplo a pôs em formas.humana.atributos.forca',
    'formas.humana.atributos.forca': 'só no exemplo: a leitura à mão da marca da forma humana (a Força 4)',
    'formas.lobo.corpo': 'só no exemplo: a nota "forma de lobo" desdobrada à mão; o conversor a põe em formas.lobo',
    'formas.lobo.atributos.vigor': 'só no exemplo: a mesma nota desdobrada',
    'formas.lobo.couraca': 'só no exemplo: a mesma nota desdobrada',
    'formas.lobo.aparencia': 'só no exemplo: a mesma nota desdobrada',
  },
  'dragao-branco-jovem': {
    ataques: 'só no conversor: tabela de nomes soltos de 28/10 traduz a nota ataque para a lista de ataques, mantendo o texto da ficha',
    'ataques.Sopro de frio.dado': 'só no exemplo: a ficha não marca o dado do sopro; o exemplo tirou da Justificativa ("sugestão da ficha")',
    'habilidadesEspeciais.Multiataque': 'só no exemplo: a nota de trabalho do Multiataque vai às Notas de observação no lote de ajuste da pergunta 1 (AJUSTE)',
  },
};
const PARADAS = {
  lobisomem: [],
  'dragao-branco-jovem': ['Ataques, Garras: Habilidade ausente na frase Jogada', 'Manobras, Multiataque: texto de trabalho no texto de jogo ("(site)"; manual 7.5)'],
};
// o exemplo do lobisomem não passa no esquema novo: falta o `apoio`, que o formato diz obrigatório
const EXEMPLO_FORA_DO_ESQUEMA = { lobisomem: ['corpo.apoio'] };

const chave = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? (x.nome ?? x.id ?? x.campo ?? x.tipo ?? x.titulo) : undefined);
function dif(a, b, p, out) {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (Array.isArray(a) && Array.isArray(b) && [...a, ...b].every((x) => chave(x) !== undefined)) {
    const ks = [...new Set([...a.map(chave), ...b.map(chave)])];
    for (const k of ks) dif(a.find((x) => chave(x) === k), b.find((x) => chave(x) === k), `${p}[${k}]`, out);
    if (a.length === b.length && a.length === ks.length && a.map(chave).join('|') !== b.map(chave).join('|')) out.push({ caminho: `${p} (a ordem)`, conv: a.map(chave), ex: b.map(chave) });
    return;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) dif(a[k], b[k], p ? `${p}.${k}` : k, out);
    return;
  }
  out.push({ caminho: p, conv: a, ex: b });
}

let comparados = 0;
for (const id of Object.keys(DIFERENCAS)) {
  const { criatura, paradas } = converterFicha(ler(`${id}.md`), { site: JSON.parse(ler(`${id}-site.json`)) });
  const ex = JSON.parse(ler(`${id}-exemplo.json`));
  if (JSON.stringify(paradas) !== JSON.stringify(PARADAS[id])) falhas.push(`${id}: paradas ${JSON.stringify(paradas)}, esperadas ${JSON.stringify(PARADAS[id])}`);
  const { revisao: rc, ...c } = criatura, { revisao: re, ...e } = ex;
  // A fonte omite a Jogada das Garras: o resultado é recusado, não um JSON publicável.
  // Só esse campo ausente sai da comparação; a parada exata acima e a ausência abaixo são obrigatórias.
  if (id === 'dragao-branco-jovem') {
    if (c.ataques.find(a=>a.nome==='Garras').habilidade !== undefined) falhas.push('Garras: Habilidade foi inferida sem Jogada');
    e.ataques=structuredClone(e.ataques);
    delete e.ataques.find(a=>a.nome==='Garras').habilidade;
  }
  const out = [];
  dif(c, e, '', out);
  const usadas = new Set();
  for (const d of out) {
    comparados++;
    if (DIFERENCAS[id][d.caminho]) { usadas.add(d.caminho); continue; }
    falhas.push(`${id}, ${d.caminho}: o conversor dá ${JSON.stringify(d.conv)}, o exemplo diz ${JSON.stringify(d.ex)}`);
  }
  for (const k of Object.keys(DIFERENCAS[id])) if (!usadas.has(k)) falhas.push(`${id}: a diferença aceita "${k}" não aconteceu (tire a entrada)`);
  const ca = new Set(rc.map((x) => x.campo)), ce = new Set(re.map((x) => x.campo));
  const difRev = [...[...ca].filter((x) => !ce.has(x)), ...[...ce].filter((x) => !ca.has(x))];
  for (const k of difRev) if (!REVISAO[id][k]) falhas.push(`${id}: revisao, o campo "${k}" está só ${ca.has(k) ? 'no conversor' : 'no exemplo'}`);
  for (const k of Object.keys(REVISAO[id])) if (!difRev.includes(k)) falhas.push(`${id}: a diferença aceita da revisao "${k}" não aconteceu (tire a entrada)`);
  // o esquema novo: a saída do conversor sem parada passa; o exemplo, salvo o que está escrito acima
  if (!paradas.length) { const r = criaturaNovaSchema.safeParse(criatura); if (!r.success) falhas.push(`${id}: a saída do conversor não passa no esquema: ${r.error.issues[0].path.join('.')}`); }
  const rx = criaturaNovaSchema.safeParse(ex);
  const fora = rx.success ? [] : rx.error.issues.map((i) => i.path.join('.'));
  if (JSON.stringify(fora) !== JSON.stringify(EXEMPLO_FORA_DO_ESQUEMA[id] || [])) falhas.push(`${id}: o exemplo no esquema dá ${JSON.stringify(fora)}, esperado ${JSON.stringify(EXEMPLO_FORA_DO_ESQUEMA[id] || [])}`);
}

// as paradas, com o defeito plantado numa cópia do lobisomem
const LOBO = ler('lobisomem.md'), SITE = JSON.parse(ler('lobisomem-site.json'));
const troca = (de, para) => { if (!LOBO.includes(de)) throw new Error(`o trecho do defeito plantado não está na ficha: ${de}`); return LOBO.replace(de, para); };
const PLANTADOS = [
  ['o pgr que não soma a Velocidade', troca('| Mordida | boca | Média | 2/1/3 | 6 |', '| Mordida | boca | Média | 2/1/3 | 7 |'), /Mordida: o pgr 2\/1\/3 não soma a Velocidade 7/],
  ['o apoio que não se tira', troca('| Anatomia | humanoide bípede com cabeça e garras de lobo |', '| Anatomia | forma estranha |').replace('| Postura | bípede, de pé, um pouco curvado |', '| Postura | estranha |'), /^apoio:/],
  ['o texto de trabalho', troca('- visão e audição: apuradas.', '- visão e audição: apuradas (site).'), /Sentidos, visão e audição: texto de trabalho/],
  ['a Habilidade fora do catálogo', troca('| Lábia (secundária) | 1 |', '| Lábias (secundária) | 1 |'), /a Habilidade "Lábias" não está no catálogo/],
  ['a linha das Manobras sem classe', troca('## Sentidos', '- linha solta sem classe **[formas: todas]**\n\n## Sentidos'), /Manobras: linha fora do formato/],
  ['o esquema', troca('| Aparência | 2 |', '| Aparência | 20 |'), /^esquema: aparencia/],
];
for (const [nome, texto, re] of PLANTADOS) {
  const { paradas } = converterFicha(texto, { site: SITE });
  if (!paradas.some((p) => re.test(p))) falhas.push(`o defeito plantado (${nome}) não parou o conversor; paradas: ${JSON.stringify(paradas)}`);
}
// rodar de novo depois da troca (A5): o JSON novo no lugar do site de hoje dá a mesma saída (a cada lote se roda de novo)
for (const id of Object.keys(DIFERENCAS)) {
  const md = ler(`${id}.md`), a = converterFicha(md, { site: JSON.parse(ler(`${id}-site.json`)) }).criatura;
  if (JSON.stringify(converterFicha(md, { site: a }).criatura) !== JSON.stringify(a)) falhas.push(`${id}: com o próprio JSON novo no lugar do site, o conversor dá outra saída`);
}
// a revisao que não aponta: o caminho é conferido pela função do conversor
const { criatura: lobo } = converterFicha(LOBO, { site: SITE });
if (!aponta(lobo, 'ataques.Mordida.nivelPerfuracao') || !aponta(lobo, 'formas.lobo') || !aponta(lobo, 'habilidadesEspeciais.Mordida que derruba e amaldiçoa')) falhas.push('aponta() recusou um caminho que existe');
if (aponta(lobo, 'atributos.inexistente') || aponta(lobo, 'ataques.Coice') || aponta(lobo, 'formas.peixe.corpo')) falhas.push('aponta() aceitou um caminho que não existe');

// P5: naoErgue é condicional e aceita só true, também nos corpos das formas.
{
  const c = structuredClone(lobo);
  c.corpo.naoErgue = true;
  if (!criaturaNovaSchema.safeParse(c).success) falhas.push('P5: naoErgue true recusado');
  c.corpo.naoErgue = false;
  if (criaturaNovaSchema.safeParse(c).success) falhas.push('P5: naoErgue false aceito');
  delete c.corpo.naoErgue; c.corpo.semMassa = true; c.corpo.volume = 0.1;
  if (!criaturaNovaSchema.safeParse(c).success) falhas.push('P5: semMassa sem naoErgue recusado');
}

// P7: referências estruturadas, complemento próprio e números repetidos.
{
  const linha = (texto) => converterFicha(LOBO.replace('## Sentidos', '- teste P7 · Mordida · livro: ' + texto + ' **[formas: todas]**\n\n## Sentidos'), { site: SITE });
  const a = linha('Agarrar, segura a presa no chão com o pé.');
  const h = a.criatura.habilidadesEspeciais.find((h) => h.nome === 'teste P7');
  if (h?.regra !== 'agarrar' || h?.texto !== 'segura a presa no chão com o pé') falhas.push('P7: complemento próprio perdido ou referência repetida');
  if (linha('Agarrar.').criatura.habilidadesEspeciais.find((h) => h.nome === 'teste P7')?.texto !== undefined) falhas.push('P7: nome da regra repetido no texto');
  const referencia = linha('Furtividade; parado entre espantalhos comuns, disfarça sua natureza');
  if (referencia.paradas.length || referencia.criatura.habilidadesEspeciais.find(h=>h.nome==='teste P7')?.regra !== 'furtividade') falhas.push('P7: referência sem número à Furtividade recusada');
  if (!linha('Furtividade 12.').paradas.some((p) => p.includes('P7'))) falhas.push('P7: resumo de Habilidade calculada passou');
  if (!linha('Esquiva 14.').paradas.some((p) => p.includes('P7'))) falhas.push('P7: Defesa calculada passou');
  if (!linha('a Rajada. Dois golpes, o segundo a −1d6.').paradas.some(p=>p.includes('P7'))) falhas.push('P7: cópia da penalidade da Rajada passou');
  if (linha('a Rajada. Até três golpes por ação.').criatura.habilidadesEspeciais.find(h=>h.nome==='teste P7')?.texto !== undefined) falhas.push('P7: teto calculado da Rajada repetido no texto');
  if (linha('a Rajada. Até dois golpes por ação.').criatura.habilidadesEspeciais.find(h=>h.nome==='teste P7')?.texto !== 'Até dois golpes por ação') falhas.push('P7: limite próprio da Rajada se perdeu');
  const c = structuredClone(lobo); c.habilidadesEspeciais.push({nome: 'P7', formas: 'todas', classe: 'livro', tecnica: {id: 'passo-veloz', nivel: 1}, arte: {id: 'fogo', nivel: 1}, texto: 'só descendo'});
  if (!criaturaNovaSchema.safeParse(c).success) falhas.push('P7: esquema recusou referencias e texto');
  c.habilidadesEspeciais.at(-1).tecnica.nivel = '1';
  if (criaturaNovaSchema.safeParse(c).success) falhas.push('P7: esquema aceitou nível textual');
}

// D-179: o card antigo tem um único destino; outra ficha pode só citar sua referência.
{
  const compartilhado = converterFicha(LOBO.replace('`mon-werewolf` |', '`mon-crocodilo` |'), {site:SITE});
  if (compartilhado.criatura.idAntigo !== undefined || !compartilhado.avisos.some(x=>x.includes('pertence a crocodilo-do-nilo'))) falhas.push('alias de outro card foi duplicado');
  if (converterFicha(LOBO, {site:SITE}).criatura.idAntigo !== 'mon-werewolf') falhas.push('alias canônico foi perdido');
}

// P10/P13: uma linha de enxame incompleta não permite inventar quantidade nem equivalência.
{
  const enxame = LOBO.replace(/^(\| PV base \| )[^|]*/m, '$1Por quadrado cheio: **24** ');
  if (!converterFicha(enxame, {site:SITE}).paradas.some(x=>x.startsWith('enxame:'))) falhas.push('enxame sem formato foi convertido');
}

// A5: as células de bloqueio já aprovadas pelo leitor da ficha continuam válidas.
for (const [celula, esperado] of [['sim, +1',1], ['sim, Defesa +2',2], ['sim (+1; galhada)',1], ['o mesmo chifre (+1)',1]]) {
  const texto = LOBO.split('\n').map(l=>{
    if (!l.startsWith('| Mordida |')) return l;
    const colunas=l.split('|'); colunas[10]=' '+celula+' '; return colunas.join('|');
  }).join('\n');
  const r = converterFicha(texto, {site:SITE});
  if (r.paradas.length || r.criatura.ataques.find(a=>a.nome==='Mordida')?.bloqueiaComoArma !== esperado) falhas.push('bloqueio da célula não preservado: '+celula);
}

// Dizer que bloqueia sem o número nunca vira o null de não bloquear.
for (const celula of ['sim','sim (carapaça)']) {
  const texto=LOBO.split('\n').map(l=>{if(!l.startsWith('| Mordida |'))return l;const a=l.split('|');a[10]=' '+celula+' ';return a.join('|');}).join('\n');
  if (!converterFicha(texto,{site:SITE}).paradas.some(p=>p.includes('Bloqueia como arma'))) falhas.push('bloqueio afirmativo sem número passou: '+celula);
}

// Variante com ataque próprio, volume incorpóreo e Habilidades fixas, lote autorizado de 28/10.
{
  const texto = ler('ghaele-azata.md');
  const r = converterFicha(texto, { site: SITE });
  const globo = r.criatura.formas.find(f=>f.id==='globo-de-luz');
  if (r.paradas.length || !globo?.corpo.naoErgue || !globo.corpo.semMassa || globo.corpo.volume!==0.089109 || globo.ataques[0].habilidade!=='disparo') falhas.push('ghaele: Variante completa não foi lida');
  if (!converterFicha(texto.replace('Vigor + Disparo','Vigor'),{site:SITE}).paradas.some(p=>p.includes('Raio de luz'))) falhas.push('ghaele: leitor inferiu Habilidade ausente');
  if (!converterFicha(texto.replace('; Força 0;', '; Força 0; Bloqueio 0;'),{site:SITE}).paradas.some(p=>p.includes('Habilidade fixa'))) falhas.push('ghaele: Habilidade da forma passou como substituível');
}

// Nomes soltos das notas viram caminhos existentes, sem alterar a ficha de entrada.
{
  const nomes = ['ataque', 'equipamento', 'tamanho', 'pv', 'couracaNivel', 'raciocinio', 'temperanca'];
  for (const nome of nomes) {
    const texto = LOBO.replace('## Notas de observação', '## Notas de observação\n\n- `' + nome + '`: teste de tradução a conferir');
    const r = converterFicha(texto, { site: SITE });
    if (r.paradas.length || r.avisos.some(a=>a.includes('"' + nome + '"')) || !r.criatura.revisao.some(x=>x.motivo.includes('teste de tradução') && aponta(r.criatura,x.campo))) falhas.push('nota não traduzida: ' + nome);
  }
  const texto = LOBO.replace('## Notas de observação', '## Notas de observação\n\n- `campo-inexistente-teste`: teste a conferir');
  if (!converterFicha(texto, { site: SITE }).avisos.some(a=>a.includes('campo-inexistente-teste'))) falhas.push('nota desconhecida sumiu sem aviso');
}

// Anatomias do lote final usam o apoio outro já aprovado, sem criar anatomia nova.
for (const anatomia of ['esfera luminosa sem membros', 'artrópode de seis pernas', 'vegetal ramificado']) {
  const texto = LOBO.replace(/^(\| Anatomia \| )[^|]*/m, '$1' + anatomia + ' ').replace(/^(\| Postura \| )[^|]*/m, '$1pairando ');
  const r = converterFicha(texto, { site: SITE });
  if (r.paradas.length || r.criatura.corpo.apoio !== 'outro') falhas.push('apoio outro recusado: ' + anatomia);
}
{
  const r = converterFicha(LOBO.replace('Deslocamento: o do lobo do molde (7 · 10 · 16)', 'Deslocamento em terra: Batalha 7, Arranque 10, Corrida 16'), { site: SITE });
  if (r.paradas.length || r.criatura.formas.find(f=>f.id==='lobo')?.deslocamento?.terra?.corrida !== 16) falhas.push('deslocamento de Variante por marchas recusado');
}

// P15: terra condicional aceita a criatura que não anda, mas texto ilegível ainda para.
{
  const base = LOBO.replace('Batalha **3** · Arranque **5** · Corrida **7** (m por Tick)', 'não anda')
    .replace('| Nado |', '| Voo | Batalha **5** (m por Tick) | |\n| Nado |');
  const semTerra = converterFicha(base, { site: SITE });
  if (semTerra.paradas.length || semTerra.lacunas.some(x => x.includes('deslocamento.terra')) || semTerra.criatura.deslocamento.terra) falhas.push('P15: terra ausente ainda gera parada ou lacuna');
  const ilegivel = converterFicha(base.replace('| Deslocamento em terra | não anda |', '| Deslocamento em terra | passo misterioso |'), { site: SITE });
  if (!ilegivel.paradas.some(x => x.includes('Deslocamento em terra ilegível'))) falhas.push('P15: controle negativo de terra ilegível não parou');
}

// M1: terra é opcional, mas um bloco declarado precisa conter pelo menos um meio.
{
  const semTerra = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/bestiario/arconte-lanterna.json'), 'utf8'));
  if (!criaturaNovaSchema.safeParse(semTerra).success) falhas.push('M1: criatura sem terra e com voo foi recusada');
  const vazio = structuredClone(semTerra); vazio.deslocamento = {};
  if (criaturaNovaSchema.safeParse(vazio).success) falhas.push('M1: controle negativo, deslocamento principal vazio aceito');
  const variante = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/bestiario/lobisomem.json'), 'utf8'));
  variante.formas.find(f => f.id === 'lobo').deslocamento = {};
  if (criaturaNovaSchema.safeParse(variante).success) falhas.push('M1: controle negativo, deslocamento de forma vazio aceito');
}

// F5.1: null em uma forma cancela só o meio herdado e o zero continua sendo deslocamento real.
{
  const c = structuredClone(lobo);
  const forma = c.formas.find(f => f.id === 'lobo');
  forma.deslocamento = { terra: null, voo: null };
  if (!criaturaNovaSchema.safeParse(c).success) falhas.push('F5.1: null na forma foi recusado');
  forma.deslocamento.terra = { batalha: 0, arranque: 0, corrida: 0 };
  if (!criaturaNovaSchema.safeParse(c).success) falhas.push('F5.1: zero explícito deixou de ser deslocamento válido');
  const principal = structuredClone(c); principal.deslocamento.terra = null;
  if (criaturaNovaSchema.safeParse(principal).success) falhas.push('F5.1: controle negativo, null na principal foi aceito');
}

// F5.2: Tamanho próprio sem área não entra no JSON e não passa pelo esquema.
{
  const c = structuredClone(lobo);
  const forma = c.formas.find(f => f.id === 'lobo');
  forma.corpo = { tamanhoEscolhido: 'grande' };
  if (criaturaNovaSchema.safeParse(c).success) falhas.push('F5.2: controle negativo, Tamanho próprio sem área passou');
  if (!criaturaParaLeituraSchema.safeParse(c).success) falhas.push('F5.2: leitor não aceitou a ficha antiga enquanto aguarda o ajuste');
  forma.corpo.area = 6;
  if (!criaturaNovaSchema.safeParse(c).success) falhas.push('F5.2: Tamanho próprio com área foi recusado');
  const texto = LOBO.replace('Área: 0,51 m², silhueta vista de lado; ', '').replace('Tamanho: Médio (0,51 m², de lado)', 'Tamanho: Pequeno');
  if (!converterFicha(texto, { site: SITE }).paradas.some(p => p.includes('Tamanho próprio exige Área própria'))) falhas.push('F5.2: conversor aceitou Variante com Tamanho sem área');
}

for (const invalido of [{individuosPorQuadrado:0,tamanhoEquivalente:'pequeno'},{individuosPorQuadrado:1.5,tamanhoEquivalente:'pequeno'},{individuosPorQuadrado:10,tamanhoEquivalente:'sem-tamanho'},{individuosPorQuadrado:10,tamanhoEquivalente:'pequeno',pv:24}]) {
  if (criaturaNovaSchema.innerType().shape.enxame.safeParse(invalido).success) falhas.push('P10: bloco inválido ou com PV gravado passou');
}
if (!criaturaNovaSchema.innerType().shape.enxame.safeParse({individuosPorQuadrado:3500,tamanhoEquivalente:'pequeno'}).success) falhas.push('P10: bloco aprovado foi recusado');

// F5.3: a equivalência de enxame fica só em Pequeno ou Médio até outra decisão.
if (criaturaNovaSchema.innerType().shape.enxame.safeParse({individuosPorQuadrado:10,tamanhoEquivalente:'grande'}).success) falhas.push('F5.3: controle negativo, enxame Grande passou');
if (!criaturaNovaSchema.innerType().shape.enxame.safeParse({individuosPorQuadrado:10,tamanhoEquivalente:'medio'}).success) falhas.push('F5.3: enxame Médio foi recusado');

// F5.4: o bônus de PV é da criatura toda e não pode entrar em uma Variante.
{
  const c = structuredClone(lobo);
  c.formas.find(f => f.id === 'lobo').bonusPV = 1;
  if (criaturaNovaSchema.safeParse(c).success) falhas.push('F5.4: controle negativo, bonusPV da forma passou no esquema');
  const texto = LOBO.replace('| forma de lobo |', '| forma de lobo | Bônus de PV: 1; ');
  if (!converterFicha(texto, { site: SITE }).paradas.some(p => p.includes('Bônus de PV é comum'))) falhas.push('F5.4: conversor aceitou bonusPV na Variante');
}

if (falhas.length) {
  console.log(`✘ test-conversor: ${falhas.length} falha(s)`);
  for (const f of falhas) console.log(`  · ${f}`);
  process.exit(1);
}
console.log(`✓ test-conversor · os dois exemplos, ${comparados} diferenças com a classe e o motivo escritos, ${PLANTADOS.length + 2} paradas plantadas acusadas`);
