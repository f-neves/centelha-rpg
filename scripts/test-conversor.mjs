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
import { criaturaNovaSchema } from './criatura-schema.mjs';

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
    'formas.humana': 'só no conversor: a marca da Justificativa da linha da forma humana; o exemplo a pôs em formas.humana.atributos.forca',
    'formas.humana.atributos.forca': 'só no exemplo: a leitura à mão da marca da forma humana (a Força 4)',
    'formas.lobo.corpo': 'só no exemplo: a nota "forma de lobo" desdobrada à mão; o conversor a põe em formas.lobo',
    'formas.lobo.atributos.vigor': 'só no exemplo: a mesma nota desdobrada',
    'formas.lobo.couraca': 'só no exemplo: a mesma nota desdobrada',
    'formas.lobo.aparencia': 'só no exemplo: a mesma nota desdobrada',
  },
  'dragao-branco-jovem': {
    'ataques.Sopro de frio.dado': 'só no exemplo: a ficha não marca o dado do sopro; o exemplo tirou da Justificativa ("sugestão da ficha")',
    'habilidadesEspeciais.Multiataque': 'só no exemplo: a nota de trabalho do Multiataque vai às Notas de observação no lote de ajuste da pergunta 1 (AJUSTE)',
  },
};
const PARADAS = {
  lobisomem: [],
  'dragao-branco-jovem': ['Manobras, Multiataque: texto de trabalho no texto de jogo ("(site)"; manual 7.5)'],
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

if (falhas.length) {
  console.log(`✘ test-conversor: ${falhas.length} falha(s)`);
  for (const f of falhas) console.log(`  · ${f}`);
  process.exit(1);
}
console.log(`✓ test-conversor · os dois exemplos, ${comparados} diferenças com a classe e o motivo escritos, ${PLANTADOS.length + 1} paradas plantadas acusadas`);
