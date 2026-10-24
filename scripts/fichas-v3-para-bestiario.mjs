// fichas-v3-para-bestiario.mjs · as fichas-v3 (.md) para as fontes do site
// (src/data/bestiario/<id>.json). Etapa 6 do plano de publicação do bestiário (D-179).
//
// Lê as fichas de trabalho, que moram fora do repositório, e o ids-definitivos.tsv do
// Arquiteto (também fora). O formato de cada campo novo está em
// tmp/arquiteto/bestiario/publicacao/decisoes-etapa-6.md, e o mapa campo a campo em
// tmp/executora/publicacao/mapa-ficha-json.md.
//
// Uso:
//   node scripts/fichas-v3-para-bestiario.mjs --fichas <pasta> --tsv <arquivo> [--saida <pasta>]
// Sem --saida, grava em src/data/bestiario/. O conversor não corrige ficha: o que a
// ficha diz entra como está, só sem as marcas de trabalho (manual §7.5).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process'; import { vestidaDoLivro, vestidaDaFicha, bonusDaArma, defesaComArma, formasDaFicha, jogadaDoAtaque, artesDaFicha } from './lib-ficha-v3.mjs';

const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const RAIZ = arg('--raiz') || path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const PASTA_FICHAS = arg('--fichas');
const TSV = arg('--tsv');
const SAIDA = arg('--saida') || path.join(RAIZ, 'src/data/bestiario');
if (!PASTA_FICHAS || !TSV) { console.error('uso: --fichas <pasta> --tsv <arquivo> [--saida <pasta>]'); process.exit(2); }

// ------------------------------------------------------------------ os ajustes
// O id de toda ficha sai do .tsv (coluna ficha_v3 igual ao nome do arquivo), nunca da
// célula `id`. O AJUSTE_FICHA (decisoes-etapa-6.md §1; D-179, item 12) saiu em 22/10/2026,
// sem nenhuma entrada: o lobo-terrivel virou lobo-atroz.md (D-179, item 20), e cao e
// cao-de-guarda viraram cachorro.md e cachorro-de-guarda.md (decisão do autor de
// 19/10/2026). Nos dois casos as 97 fontes saem iguais byte a byte.
// A ficha e o site têm os mesmos oito portes desde a D-179 (o Minúsculo da D-166,
// abaixo do Miúdo). A tabela fica para recusar porte fora da lista, e não para
// traduzir: cada um vai com o próprio nome.
const PORTE_DO_SITE = {
  'Minúsculo': 'Minúsculo', 'Miúdo': 'Miúdo', 'Pequeno': 'Pequeno', 'Médio': 'Médio',
  'Grande': 'Grande', 'Enorme': 'Enorme', 'Imenso': 'Imenso', 'Colossal': 'Colossal',
};
// As segundas fichas herdam Ameaça, Terreno e Clima da irmã (decisoes-etapa-6.md §6).
const IRMA = {
  'crocodilo-do-nilo-femea': 'crocodilo-do-nilo', 'leao-das-cavernas-tardio': 'leao-das-cavernas',
  'lula-de-humboldt': 'lula-de-humboldt-grande', 'urso-pardo-litoral': 'urso-pardo', 'varano-femea': 'varano',
};
const HAB = {
  'atletismo': ['skills', 'atletismo'], 'bloqueio': ['skills', 'bloqueio'], 'briga': ['skills', 'briga'],
  'empatia': ['skills', 'empatia'], 'esquiva': ['skills', 'esquiva'], 'furtividade': ['skills', 'furtividade'],
  'integridade': ['skills', 'integridade'], 'prontidao': ['skills', 'prontidao'],
  'resistencia': ['skills', 'resistencia'], 'sobrevivencia': ['skills', 'sobrevivencia'],
  'equilibrio': ['skills2', 'equilibrio'], 'escalada': ['skills2', 'escalada'], 'natacao': ['skills2', 'natacao'],
  // as Habilidades só de criatura (decisoes-etapa-6.md §8)
  'musculatura': ['skills2', 'musculatura'], 'corrida': ['skills2', 'corrida'],
  'voo': ['skills2', 'voo'], 'disparo': ['skills2', 'disparo'],
};
const TIPO_DANO = { 'perfuracao': 'perfurante', 'corte': 'corte', 'impacto': 'impacto', 'eletricidade': 'eletricidade' };
const TERRENO = { 'Gélido': 'Cold', 'Deserto': 'Desert', 'Floresta': 'Forest', 'Selva': 'Jungle', 'Montanha': 'Mountain',
  'Planície': 'Plains', 'Pântano': 'Swamp', 'Subterrâneo': 'Underground', 'Urbano': 'Urban', 'Aquático': 'Water',
  'Litoral': 'Coast', 'Céu': 'Sky', 'Ruínas': 'Ruins', 'Qualquer': 'Any' };
// Os sinônimos que as fichas usam no Terreno: "Cidade" é o Urbano, e "Frio" é o Gélido (o dragão branco).
const TERRENO_SINONIMO = { 'cidade': 'Urbano', 'frio': 'Gélido' };
const terrenoDe = (x) => { const k = x.trim().toLowerCase(); const n = TERRENO_SINONIMO[k] ?? Object.keys(TERRENO).find((t) => t.toLowerCase() === k); return n ? TERRENO[n] : null; };
// D-206: o catálogo do livro para a criatura vestida.
const ARMAS_IDS = new Set(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/armas.json'), 'utf8')).map((a) => a.id));
const ARMADURAS = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/armaduras.json'), 'utf8')).map((a) => [a.id, a.armadura]));
const ESCUDOS = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/escudos.json'), 'utf8')).filter((e) => e.id !== 'nenhum').map((e) => [e.id, e.escudo]));
// As Técnicas do livro, para a linha "Técnica <id>, nível N" das Manobras (a ficha v3 do humano com Centelha).
const TECNICAS = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/tecnicas.json'), 'utf8')).map((t) => [t.id, t]));
// As armas do livro pelo id, para achar a arma de tiro de um ataque (a regra de Força dela vai ao lib-bestiario).
const ARMAS_POR_ID = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/armas.json'), 'utf8')).map((a) => [a.id, a]));
const CLIMA = { 'Frio': 'Cold', 'Temperado': 'Temperate', 'Tropical': 'Tropical', 'Extraplanar': 'Extraplanar' };
const ATRIB = { 'Força': 'forca', 'Destreza': 'destreza', 'Vigor': 'vigor', 'Percepção': 'percepcao',
  'Inteligência': 'inteligencia', 'Raciocínio': 'raciocinio', 'Influência': 'influencia',
  'Perspicácia': 'perspicacia', 'Compostura': 'compostura' };

// ------------------------------------------------------------------ a leitura
const sem = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const numBR = (s) => Number(String(s).replace(/\./g, '').replace(',', '.'));
// AS HABILIDADES DO LIVRO (criaturas não animais): além das 17 do animal, toda Habilidade de
// habilidades.json (vai em skills) e de habilidades-secundarias.json (em skills2), pelo nome.
// Armas, Atirador, Ocultismo, Intimidação, Acerto Arcano e as outras. As do animal não mudam.
for (const [arquivo, campo] of [['habilidades.json', 'skills'], ['habilidades-secundarias.json', 'skills2']]) {
  const lista = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data', arquivo), 'utf8'));
  for (const h of (Array.isArray(lista) ? lista : Object.values(lista))) if (h && h.nome && !HAB[sem(h.nome)]) HAB[sem(h.nome)] = [campo, h.id];
}
// FRAQUEZAS, RESISTÊNCIAS E IMUNIDADES (D-195; manual §5.2, item 15). A primeira linha não
// vazia da seção "## Elementos": "nenhum", ou "fraquezas: ... · resistências: ... ·
// imunidades: ...", com as palavras como o livro as escreve ("ácido", "perfuração"). A
// palavra vira id pelo rótulo (ou pelo próprio id) do elementos-vocab.json; palavra fora
// dele para o conversor, nomeando a ficha. Saem as três listas, na ordem do vocabulário.
const VOCAB_ELEM = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/elementos-vocab.json'), 'utf8'));
const ORDEM_ELEM = VOCAB_ELEM.grupos.flatMap((g) => g.palavras);
// O Tipo do dano (manual §5.2, item 8): além dos três físicos, toda palavra do vocabulário de elementos
// ("fogo", "ácido") e o "fenômeno" (o dano que a armadura não absorve, só a Centelha; C-008, C-041).
// O "eletricidade" do poraque fica, de antes; o manual pede a palavra "raio" (relato da rodada).
for (const id of ORDEM_ELEM) TIPO_DANO[id] ??= id;
TIPO_DANO.fenomeno = 'fenomeno';
const CLASSES = { leve: 'leve', media: 'media', haste: 'haste', pesada: 'pesada', distancia: 'distancia', arremesso: 'arremesso' };
const ARTES_IDS = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/artes.json'), 'utf8')).map((a) => a.id);
const ID_ELEM = Object.fromEntries([...ORDEM_ELEM.map((id) => [sem(id), id]), ...Object.entries(VOCAB_ELEM.rotulos).map(([id, r]) => [sem(r), id])]);
function elementosDaFicha(arq, corpo) {
  if (corpo == null) throw new Error(`${arq}: sem a seção "## Elementos"`);
  const linha = (corpo.split('\n').map((l) => l.trim()).find((l) => l) || '').replace(/^-\s*/, '').replace(/\.$/, '');
  const out = { fraquezas: [], resistencias: [], imunidades: [] };
  if (/^nenhum$/i.test(linha)) return out;
  for (const parte of linha.split('·')) {
    const m = /^\s*([^:]+):\s*(.+)$/.exec(parte);
    const campo = m && { fraquezas: 'fraquezas', resistencias: 'resistencias', imunidades: 'imunidades' }[sem(m[1]).trim()];
    if (!campo) throw new Error(`${arq}: linha de Elementos fora do formato: "${linha}"`);
    for (const w of m[2].split(/,|\s+e\s+/).map((x) => x.trim()).filter(Boolean)) {
      const id = ID_ELEM[sem(w)];
      if (!id) throw new Error(`${arq}: palavra fora do vocabulário em Elementos: "${w}"`);
      if (Object.values(out).some((l) => l.includes(id))) throw new Error(`${arq}: "${w}" repetida em Elementos`);
      out[campo].push(id);
    }
  }
  for (const k of Object.keys(out)) out[k].sort((a, b) => ORDEM_ELEM.indexOf(a) - ORDEM_ELEM.indexOf(b));
  return out;
}
// A PLANTA DA FICHA (adendo do autor de 23/10/2026, item 1): o conversor para diante de qualquer
// seção ou linha que não conhece. Cada uma é LIDA (o código a usa) ou IGNORADA (com o motivo).
// Linha que começa com um dos prefixos vale como a linha do prefixo ("Carga (o que leva andando)").
const PLANTA = {
  secoes: {
    lidas: ['Identidade', 'Corpo, área e tamanho', 'Corpo e tamanho', 'Corpo, área e porte', 'Corpo e porte', 'Corpo e movimento',
      'Variantes', 'Atributos', 'Habilidades', 'Elementos', 'Vontade, Virtudes e Aparência', 'Ataques', 'Manobras', 'Sentidos',
      'Veneno e doença', 'Corpo', 'Comportamento', 'No jogo', 'Notas de observação', 'Bloco de conferência', 'Aptidões'],
    ignoradas: {
      'Comparação com D&D 3.5 e Pathfinder 1': 'trabalho da Bestiarista: a conversa com o bloco publicado não vai ao site',
      'Comparação com o animal de base': 'trabalho da Bestiarista: a conta da versão maior não vai ao site',
      'Procedência': 'as fontes da pesquisa, que ficam com a Bestiarista',
      'Visual': 'a descrição para a arte, que não vai ao card',
      'Luz': 'texto de pesquisa sobre a luz do corpo; o que vale em jogo está nas Manobras (besouro-de-fogo, elemental do fogo)',
    },
  },
  linhas: {
    'Identidade': {
      lidas: ['Nome', 'Nome em inglês (D&D, Pathfinder)', 'Categoria · papel · Centelha', 'Ameaça', 'Terreno', 'Clima', 'Equipamento', 'Artes', 'Mana', 'Formas'],
      ignoradas: {
        'id': 'o id sai do ids-definitivos.tsv, nunca da ficha', 'id antigo do bestiário': 'sai do ids-definitivos.tsv',
        'Nome científico': 'não vai ao card', 'Extinto': 'não vai ao card', 'Referência': 'o modelo da ficha, não vai ao card',
        'Anatomia': 'não vai ao card', 'Escala': 'nota de trabalho sobre a escala da versão maior',
        'Por que ': 'a escolha da espécie de base, texto de pesquisa',
      },
    },
    'Corpo, área e porte': 'CORPO', 'Corpo, área e tamanho': 'CORPO', 'Corpo e porte': 'CORPO', 'Corpo e tamanho': 'CORPO',
    'CORPO': {
      lidas: ['Massa', 'Tamanho', 'Segundo Tamanho', 'Altura', 'Largura', 'Comprimento total', 'Comprimento', 'Envergadura'],
      ignoradas: {
        'Postura': 'não vai ao card', 'Cauda grossa': 'entrou na conta da área, que a ficha já fez',
        'Comprimento sem ': 'medida de pesquisa; o card mostra o comprimento total', 'Envergadura das pernas': 'medida de pesquisa',
        'Espaço': 'o espaço pelas dimensões ainda não tem regra no Grid (D-147)', 'Espaço parado': 'o espaço da criatura pousada (quetzalcoatlo); o Grid não tem regra de espaço (D-147)', 'Espaço em voo': 'o espaço de asas abertas; idem', 'Área': 'entrou no Tamanho, que a ficha já fez',
      },
    },
    'Corpo e movimento': {
      lidas: ['Absorção', 'Bloqueio', 'Esquiva', 'Carga', 'Defesa Mental', 'Defesa Social', 'Deslocamento em terra', 'Escalada, escavação',
        'Escalada', 'Nado / Voo', 'Nado, voo', 'Nado', 'Voo', 'PV total', 'Peso erguido'],
      ignoradas: {
        'PV base': 'a conta do PV; vale o PV total', 'Bônus de PV': 'já está no PV total', 'Energia': 'o card não mostra a Energia',
        'Iniciativa': 'o motor faz a conta (Raciocínio + Prontidão)', 'Velocidade contra o real': 'conferência da Bestiarista',
        'Feito': 'feito de pesquisa', 'Feitos': 'feitos de pesquisa', 'Arrasto': 'conta de pesquisa (o card usa o Peso erguido)', 'Arremesso': 'conta de pesquisa',
        'Tração': 'conta de pesquisa', 'Içar': 'conta de pesquisa', 'Erguer ': 'conta de pesquisa', 'Virar com a pata': 'conta de pesquisa',
        'Comer': 'texto do corpo', 'Fuçar': 'texto do corpo', 'Tromba': 'texto do corpo', 'Salto': 'texto do corpo',
        'Mergulho': 'texto do corpo', 'Corrida bípede': 'texto do corpo', 'O que leva em voo': 'texto do corpo',
      },
    },
    'Vontade, Virtudes e Aparência': { lidas: ['Vontade', 'Virtudes', 'Aparência'], ignoradas: {} },
    'Comportamento': {
      lidas: ['Texto curto', 'Social', 'Ambientação:'],
      ignoradas: { 'Atividade': 'não vai ao card', 'Dieta': 'não vai ao card', 'Caça ou forrageio': 'não vai ao card', 'Diante de gente': 'não vai ao card' },
    },
  },
};
const casa = (rotulo, nome) => rotulo === nome || rotulo.startsWith(nome + ' (') || (/[ :]$/.test(nome) && rotulo.startsWith(nome));
function conferePlanta(arq, S) {
  const erros = [];
  for (const t of Object.keys(S)) {
    if (t === '_titulo') continue;
    if (!PLANTA.secoes.lidas.includes(t) && !(t in PLANTA.secoes.ignoradas)) erros.push(`seção "## ${t}" que o conversor não conhece`);
  }
  for (const [sec, regra0] of Object.entries(PLANTA.linhas)) {
    if (!S[sec] || sec === 'CORPO') continue;
    const regra = typeof regra0 === 'string' ? PLANTA.linhas[regra0] : regra0;
    for (const r of tabela(S[sec]).rows) {
      const rot = (r[0] || '').replace(/\*\*/g, '').trim();
      if (!rot) continue;
      const conhecida = regra.lidas.some((n) => casa(rot, n)) || Object.keys(regra.ignoradas).some((n) => casa(rot, n));
      if (!conhecida) erros.push(`linha "${rot}" da seção "${sec}" que o conversor não conhece`);
    }
  }
  if (erros.length) throw new Error(`${arq}: ${erros.join('; ')}`);
}
function secoes(txt) {
  const out = {};
  const corpo = txt.split(/^## /m);
  out._titulo = corpo[0];
  for (const b of corpo.slice(1)) { const [t, ...r] = b.split('\n'); out[t.trim()] = r.join('\n'); }
  return out;
}
function tabela(corpo) {
  const ls = (corpo || '').split('\n').filter((l) => /^\|/.test(l));
  if (ls.length < 2) return { cab: [], rows: [] };
  const sp = (l) => l.replace(/\\\|/g, '\u0001').split('|').slice(1, -1).map((c) => c.replace(/\u0001/g, '|').trim());
  return { cab: sp(ls[0]), rows: ls.slice(2).map(sp) };
}
const celula = (corpo, rotulo) => (tabela(corpo).rows.find((r) => r[0] === rotulo || r[0].startsWith(rotulo + ' ') || r[0].startsWith(rotulo + ' (')) || [])[1];
const negrito = (s) => { const m = /\*\*\s*([\d.]*\d(?:,\d+)?)/.exec(s || ''); return m ? numBR(m[1]) : null; };
const itens = (corpo) => (corpo || '').split(/\nLinhas de antes desta proposta/)[0].split('\n').filter((l) => /^- /.test(l)).map((l) => l.slice(2));

// ------------------------------------------------------------- a limpeza do texto
// O texto publicado leva só frase de mesa (manual §7.5). Saem as marcas, os ◆, o
// negrito, o "era X" e os nomes de arquivo; um parêntese que só existia para isso sai
// inteiro.
// A CITAÇÃO DE FONTE SAI DO TEXTO PUBLICADO (manual, linha 638; decisoes-etapa-6.md §9,
// item 10). A lista é fechada: as instituições e sites que aparecem nas 97, mais o
// autor com ano ("Wroe 2005", "Sander e colegas 2010", "Potier et al. 2020"), mais os
// qualificadores que só existem junto de uma citação ("via Wikipédia", "sem método").
// Só sai o que está entre parênteses; o resto do parêntese fica.
const FONTES = ['ADW', 'Wikipédia', 'NPS', 'National Park Service', 'San Diego Zoo', 'SDZG', 'Penn State Extension',
  'National Geographic', 'National Zoo', 'ABC Science', 'Discover Magazine', 'Smithsonian', 'Scientific American',
  'SANBI', 'AKC', 'FAO', 'NOAA', 'NABC', 'CDC', 'NINA', 'ADF&G', 'PBI', 'Naturalis', 'International Wolf Center',
  'Manual MS', 'Tillers', 'Htun', 'Wan Htun', 'Matsuura'];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE_FONTE = new RegExp(`^(via\\s+)?(${FONTES.map(esc).join('|')})(\\s+"[^"]*")?$`);
const RE_AUTOR_ANO = /^(via\s+)?[A-ZÀ-ÚØÅ][\p{L}'’-]+(?:(?:,\s*|\s+e\s+|\s+)[A-ZÀ-ÚØÅ][\p{L}'’-]+)*(?:\s+et al\.|\s+e colegas|\s+e outros)?,?\s+(1[89]\d\d|20[0-2]\d)[a-z]?(\s+via\s+.*|\s+não conferido)?$/u;
const QUALIFICADOR = /^(sem método|sem número|conferido|não conferido|trecho de busca|modelo óptico|divulgação|fonte infantil|marcada como fraca|mesma fonte|uso histórico|l\.\s?\d+(-\d+)?|"[^"]*")$/;
const CITACOES = [];
// A VÍRGULA ENTRE DÍGITOS É DECIMAL ("dano médio 10,5"), e não separa peça: antes o parêntese se partia nela e
// voltava "10, 5" (achado da Revisora, rodada 18). E o parêntese de que nada saiu volta como estava, só aparado
// nas pontas, e não conta como citação limpa: antes, só a remontagem com ", " já o mudava e ele contava.
// Devolve { fica, tirou }.
function tiraCitacao(dentro) {
  let tirou = false;
  const segs = dentro.split(';').map((seg) => {
    const pecas = seg.split(/(?<!\d),|,(?!\d)/).map((x) => x.trim());
    // junta as peças de uma lista de autores ("Harley, Cienfuegos e Wagenaar 2011")
    const saida = [];
    for (let i = 0; i < pecas.length; i++) {
      let j = i, achou = -1;
      for (; j < pecas.length; j++) if (RE_AUTOR_ANO.test(pecas.slice(i, j + 1).join(', '))) { achou = j; break; }
      if (achou >= 0 && pecas.slice(i, achou + 1).every((p) => /^[A-ZÀ-ÚØÅ]/.test(p) || /^via /.test(p))) { i = achou; saida.push(null); continue; }
      const p = pecas[i];
      if (RE_FONTE.test(p) || QUALIFICADOR.test(p)) { saida.push(null); continue; }
      // o título de artigo depois da Wikipédia ("Wikipédia, Scorpion")
      if (saida.length && saida[saida.length - 1] === null && /^[A-Z][a-z]+$/.test(p) && /Wikipédia/.test(pecas[i - 1] || '')) { saida.push(null); continue; }
      saida.push(p);
    }
    if (saida.includes(null)) tirou = true;
    return saida.filter((x) => x !== null).join(', ');
  });
  return { fica: tirou ? segs.map((x) => x.trim()).filter(Boolean).join('; ') : dentro.trim(), tirou };
}
const TRABALHO = /\bera\b|◆|`[^`]*`|\.md\b|\bD-\d{3}\b|\bdecis[aã]o (de )?\d|\b\d{1,2}\/\d{1,2}\/\d{4}\b|\bsétima rodada\b|\bquinta rodada\b/i;
// O NOME EM INGLÊS SEM A PROCEDÊNCIA (etapa 8a, aprovado pelo Arquiteto): a célula traz
// o nome e, junto, de que bloco do d20 ele saiu ("Cane toad (bloco parecido: Toad,
// D&D 3.5 e Pathfinder 1)"). Fica o que vem antes do primeiro " (" ou ";"; a célula que
// começa por "não há ficha" não tem nome em inglês.
function nomeEmIngles(celulaTxt) {
  const t = limpa(celulaTxt);
  if (!t || /^não há ficha/i.test(t)) return null;
  return t.split(/ \(|;/)[0].trim() || null;
}
function limpa(s) {
  let t = String(s || '');
  t = t.replace(/\*\*\[[^\]]*\]\*\*/g, '').replace(/\[(provis[óo]rio|extrapolação|sem dado|medido|comparação|conta|piso medido|estimado)[^\]]*\]/gi, '');
  t = t.replace(/\*\*/g, '').replace(/◆/g, '');
  t = t.replace(/\s*\bPROVIS[ÓO]RIO\b\.?/g, '');
  // o rótulo de classificação da linha de jogo sai, e o resto do parêntese fica; "(texto)" sai
  t = t.replace(/\(provis[óo]rio,\s*/gi, '(').replace(/\s*\((provis[óo]rio|do livro|texto|texto, sem regra)\)/gi, '');
  // parêntese de trabalho: ( ... era ... ), ( `x.md` ), ( decisão 3 )
  for (let i = 0; i < 3; i++) t = t.replace(/\s*\(([^()]*)\)/g, (m, dentro) => (TRABALHO.test(dentro) ? '' : m));
  // a citação de fonte (decisoes-etapa-6.md §9, item 10)
  t = t.replace(/\(([^()]*)\)/g, (m, dentro) => {
    const { fica, tirou } = tiraCitacao(dentro);
    if (tirou) CITACOES.push({ antes: dentro, depois: fica });
    return fica ? `(${fica})` : '';
  });
  // rótulo que ficou sem conteúdo depois da limpeza ("Outras doenças e parasitas:.")
  t = t.replace(/(^|[.;]\s*)[^.;:]*:\s*(?=[.;]|$)/g, '$1');
  // frase de trabalho: "Era 1d6 + 9, média 12,5." / "era +4; ..."
  t = t.split(/(?<=[.;])\s+/).filter((fr) => !/^(era|antes:)\b/i.test(fr.trim())).join(' ');
  t = t.replace(/`([^`]*)`/g, '$1');
  t = t.replace(/\s+([,.;:])/g, '$1').replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').replace(/;\s*\./g, '.').replace(/([^.])\.\.(?!\.)/g, '$1.').trim(); // ".." de marca tirada entre dois pontos
  return t.replace(/^[.;:,\s]+/, '');
}

// ------------------------------------------------------------- o .tsv e as fontes
const linhasTsv = fs.readFileSync(TSV, 'utf8').trim().split(/\r?\n/).map((l) => l.split('\t'));
const cabTsv = linhasTsv.shift();
const ct = (n) => cabTsv.indexOf(n);
const porFicha = {};
for (const l of linhasTsv) {
  const fv = l[ct('ficha_v3')];
  if (!fv || fv === '(esqueleto)') continue;
  porFicha[fv] = { site: l[ct('id_site')] === '(nenhum)' ? null : l[ct('id_site')], id: l[ct('id_definitivo')],
    // as imagens do padrão novo (D-179, item 14): a coluna diz o caminho, ou 'null'
    imagem: [l[ct('imagem_nova')]].map((v) => (!v || v === 'null' ? null : v))[0],
    imagem2: [l[ct('imagem_2_nova')]].map((v) => (!v || v === 'null' ? null : v))[0] };
}
// A FONTE DE ANTES vem do commit da etapa 4 (`--base`, ea564c19 por padrão), e não da
// pasta: a pasta já tem o resultado deste conversor depois da primeira rodada, e ler
// dela de novo somaria o "No jogo" e o Social duas vezes. Assim o conversor dá sempre a
// mesma saída.
const BASE = arg('--base') || 'ea564c19';
// A FONTE BASE vem do commit BASE pelo git, ou de uma pasta (`--base-pasta`, os testes: o CI clona raso, com
// --depth 1, e o ea564c19 não existe lá). Sem a pasta, o commit tem de existir: antes, a falta dele virava
// "fonte base nenhuma" calada em todas as fichas (achado do CI vermelho no 683d881a).
const BASE_PASTA = arg('--base-pasta');
if (!BASE_PASTA) {
  try { execFileSync('git', ['-C', RAIZ, 'cat-file', '-e', `${BASE}^{commit}`], { stdio: 'ignore' }); }
  catch { console.error(`✘ o commit da fonte base (${BASE}) não existe neste clone (raso?); passe --base-pasta ou busque o histórico`); process.exit(1); }
}
const fontePorId = (id) => {
  if (BASE_PASTA) { const p = path.join(BASE_PASTA, `${id}.json`); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; }
  try {
    return JSON.parse(execFileSync('git', ['-C', RAIZ, 'show', `${BASE}:src/data/bestiario/${id}.json`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch { return null; }
};

const arquivos = fs.readdirSync(PASTA_FICHAS).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)).sort();
const idDaFicha = (arq) => {
  const linha = porFicha[arq];
  if (!linha) throw new Error(`${arq}.md: sem linha no .tsv`);
  return linha;
};

// ------------------------------------------------------------- uma ficha
function converte(arq) {
  const txt = fs.readFileSync(path.join(PASTA_FICHAS, arq + '.md'), 'utf8').replace(/\r\n/g, '\n');
  const S = secoes(txt);
  const { site, id, imagem, imagem2 } = idDaFicha(arq);
  const aviso = [];
  conferePlanta(arq, S);
  const ident = S['Identidade'];
  const corpoPorte = S['Corpo, área e tamanho'] ?? S['Corpo e tamanho'] ?? S['Corpo, área e porte'] ?? S['Corpo e porte']; // D-183
  const mov = S['Corpo e movimento'];

  // Identidade
  const nome = limpa(celula(ident, 'Nome'));
  // Formas (D-201; manual §5.2, item 1): só em quem muda de forma. Erro na linha para o conversor.
  const linhaFormas = celula(ident, 'Formas');
  let transforma = null;
  if (linhaFormas != null) { try { transforma = formasDaFicha(linhaFormas, tabela(S['Variantes']).rows.map((r) => r[0])); } catch (e) { throw new Error(`${arq}: ${e.message}`); } }
  const [categoria, papel, cent] = celula(ident, 'Categoria · papel · Centelha').split('·').map((x) => x.trim());
  // Atributos
  const attrs = {};
  for (const r of tabela(S['Atributos']).rows) { if (!ATRIB[r[0]]) { aviso.push(`Atributo desconhecido: ${r[0]}`); continue; } attrs[ATRIB[r[0]]] = parseInt(r[1].replace(/\*/g, ''), 10); if (Number.isNaN(attrs[ATRIB[r[0]]])) aviso.push(`Atributo ${r[0]} sem número: "${r[1]}"`); }
  // Habilidades
  const skills = {}, skills2 = {};
  for (const r of tabela(S['Habilidades']).rows) {
    const base = sem(r[0].replace(/\s*\(.*$/, '').trim());
    const v = parseInt(r[1].replace(/\*/g, ''), 10);
    const destino = HAB[base];
    if (!destino) { aviso.push(`Habilidade sem destino: ${r[0]}`); continue; }
    if (Number.isNaN(v) && /^não tem\b/.test(r[1].trim())) continue; // "não tem": a Habilidade em zero (o macaco e a Corrida)
    if (Number.isNaN(v)) { aviso.push(`Habilidade ${r[0]} sem número: "${r[1]}"`); continue; }
    if (v > 0) (destino[0] === 'skills' ? skills : skills2)[destino[1]] = v;
  }
  // Especialidades
  const especialidades = [];
  // O cabeçalho vem com ou sem negrito: 26 das 97 escrevem sem (etapa 9, CORRIGE da Revisora).
  const cabecalhosEsp = (S['Habilidades'] || '').split('\n').filter((l) => /^(\*\*)?Especialidades (naturais|\(o limite)/.test(l)).length;
  let blocosEsp = 0;
  for (const bloco of (S['Habilidades'] || '').split(/\n\*\*|\n(?=Especialidades)/).slice(1)) {
    const origem = /^Especialidades naturais/.test(bloco) ? 'natural' : /^Especialidades \(o limite/.test(bloco) ? 'livro' : null;
    if (!origem) continue;
    blocosEsp++;
    for (const l of bloco.split('\n').filter((x) => /^- /.test(x))) {
      // "- Armas (espada longa) +1; Bloqueio (escudo) +1.": cada pedaço é uma Especialidade
      // O PRIMEIRO pedaço da linha é uma Especialidade, "nenhuma", ou a nota de trabalho da Bestiarista sobre a
      // Especialidade que saiu ("A Resistência (Fôlego) 2 de hoje sai") ou que não entrou ("Sem Resistência (frio)",
      // "Os sentidos não foram achados"); os pedaços depois do primeiro ";" podem ser texto. Fora disso, para.
      const primeira = l.slice(2).split(';')[0];
      if (!/^\s*([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Ú][a-zà-ú]+)*) \(([^)]+)\) \+?(\d+)/.test(primeira) && !/^\s*nenhuma\b/i.test(primeira)
        && !/^\s*(A "?Resistência \([^)]+\) \+?\d+"? de hoje sai|Sem [A-ZÀ-Ú]|Os sentidos não foram achados)/.test(primeira)) aviso.push(`linha de Especialidade fora do formato: ${l.slice(0, 60)}`);
      for (const parte of l.slice(2).split(';')) {
        // o nome é uma ou mais palavras com maiúscula ("Acerto Arcano"); "A Resistência (Fôlego) ... de hoje sai" não casa
        const m = /^\s*([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Ú][a-zà-ú]+)*) \(([^)]+)\) \+?(\d+)/.exec(parte);
        if (!m) continue; // "nenhuma.", "A ... de hoje sai", "Sem Resistência (frio)": texto de trabalho
        const h = HAB[sem(m[1])];
        if (!h) { aviso.push(`Especialidade com Habilidade desconhecida: ${parte.trim().slice(0, 50)}`); continue; }
        especialidades.push({ habilidade: h[1], foco: m[2], valor: Number(m[3]), origem });
      }
    }
  }
  const elementos = elementosDaFicha(arq, S['Elementos']);
  // Artes e Mana (D-196; manual §5.2): "nenhuma" ou "morte 6 · fogo 4"; a Mana é o número em negrito.
  let artes = null;
  try { artes = artesDaFicha(celula(ident, 'Artes'), ARTES_IDS); } catch (e) { throw new Error(`${arq}: ${e.message}`); }
  const manaTxt = celula(ident, 'Mana');
  const mana = manaTxt == null || /^não tem/i.test(manaTxt.replace(/\*/g, '').trim()) ? null : negrito(manaTxt);
  if (manaTxt != null && mana == null && !/^não tem/i.test(manaTxt.replace(/\*/g, '').trim())) throw new Error(`${arq}: Mana sem número: "${manaTxt}"`);
  if ((artes == null) !== (mana == null)) throw new Error(`${arq}: Artes e Mana não concordam (Artes ${artes ? 'tem' : 'nenhuma'}, Mana ${mana ?? 'não tem'})`);
  // Vontade, Virtudes, Aparência
  const vva = S['Vontade, Virtudes e Aparência'];
  const willpower = parseInt(celula(vva, 'Vontade').replace(/\*/g, ''), 10);
  const aparencia = parseInt(celula(vva, 'Aparência').replace(/\*/g, ''), 10);
  const virtues = { compaixao: 0, conviccao: 0, temperanca: 0, valor: 0 };
  for (const parte of celula(vva, 'Virtudes').replace(/\*/g, '').split(';')) {
    const n = /(\d+)\s*$/.exec(parte.trim()); if (!n) continue;
    // A Virtude se chama Bravura na ficha desde 22/10/2026 (decisão 40 do autor); o id no JSON continua `valor` (C-15)
    for (const [k, rot] of [['compaixao', 'Compaixão'], ['conviccao', 'Convicção'], ['temperanca', 'Temperança'], ['valor', 'Bravura']]) if (parte.includes(rot)) virtues[k] = Number(n[1]);
  }
  if (/\bValor\b/.test(celula(vva, 'Virtudes'))) throw new Error(`${arq}.md: a linha Virtudes diz "Valor"; o nome é Bravura (decisão 40 do autor)`);
  // Corpo e porte
  const alvo = (/\*\*([A-Za-zÀ-ú]+)\*\*/.exec(celula(corpoPorte, 'Tamanho')) || [])[1] || (celula(corpoPorte, 'Tamanho') || '').split(/[\s(]/)[0];
  const porte = PORTE_DO_SITE[alvo];
  if (!porte) throw new Error(`${arq}: Tamanho desconhecido "${alvo}" (a linha | Tamanho | da ficha, D-183)`);
  // O segundo tamanho não vai para os dados; a linha só tem de existir com o nome novo (D-183, complemento 2).
  if (celula(corpoPorte, 'Segundo Tamanho') == null) throw new Error(`${arq}: sem a linha | Segundo Tamanho | (D-183, complemento 2)`);
  // e o valor tem de ser um Tamanho da régua, "não se aplica" ou "igual ao principal" (o que mais vier, para)
  const seg = String(celula(corpoPorte, 'Segundo Tamanho')).replace(/\*\*|◆/g, '').trim();
  if (!/^(não se aplica|igual ao principal)\b/.test(seg) && !Object.keys(PORTE_DO_SITE).some((t) => seg.startsWith(t))) throw new Error(`${arq}: Segundo Tamanho "${seg.slice(0, 40)}" fora do que se aceita (um Tamanho, "não se aplica" ou "igual ao principal")`);
  const medida = (rot) => { const v = negrito(celula(corpoPorte, rot)); return v && v > 0 ? v : undefined; };
  const massaTxt = (/\*\*([^*]+)\*\*/.exec(celula(corpoPorte, 'Massa')) || [])[1];
  const comp = medida('Comprimento total') ?? medida('Comprimento');
  const alt = medida('Altura');
  const dimensoes = {
    medida: [comp ? `${String(comp).replace('.', ',')} m de comprimento` : null, alt ? `${String(alt).replace('.', ',')} m de altura` : null].filter(Boolean).join(', ') || 'sem medida',
    // "**sem massa** · volume **0,079 m³**": o card diz que não tem massa e mostra o volume
    peso: /^sem massa$/i.test((massaTxt || '').trim())
      ? `sem massa${(/volume\s*\*\*([^*]+)\*\*/.exec(celula(corpoPorte, 'Massa') || '') || [])[1] ? ` (volume ${(/volume\s*\*\*([^*]+)\*\*/.exec(celula(corpoPorte, 'Massa')))[1].trim()})` : ''}`
      : massaTxt ? massaTxt.trim() : 'sem peso',
    ...(comp ? { comprimento: comp } : {}), ...(medida('Largura') ? { largura: medida('Largura') } : {}),
    ...(alt ? { altura: alt } : {}), ...(medida('Envergadura') ? { envergadura: medida('Envergadura') } : {}),
  };
  // Corpo e movimento: os números prontos (decisoes-etapa-6.md §3)
  const absTxt = celula(mov, 'Absorção') || '';
  const impacto = Number((/Impacto\s*\*\*(\d+)\*\*/.exec(absTxt) || [])[1]);
  // Corte e Perfuração: o número da ficha, antes da frase do equipamento ("Com o peitoral ...");
  // os animais escrevem "a definir" e ficam com o valor do Impacto (decisoes-etapa-6.md §3).
  const absNatural = absTxt.split(/\bCom (?:o|a|os|as) /)[0];
  const corteN = /Corte\s*\*\*(\d+)\*\*/.exec(absNatural), perfN = /Perfuração\s*\*\*(\d+)\*\*/.exec(absNatural);
  // "**não ergue**" (Peso erguido) e "**imune**" (Defesa Mental e Social) são nulos que a ficha decide
  const declara = (rot, re) => re.test(String(celula(mov, rot) || '').replace(/\*/g, '').trim());
  const naoErgue = declara('Peso erguido', /^não ergue\b/i);
  const imuneMental = declara('Defesa Mental', /^imune\b/i), imuneSocial = declara('Defesa Social', /^imune\b/i);
  const couracaNivel = Number((/Couraça\s*\*{0,2}\s*nível\s*(\d+)/i.exec(absTxt) || [])[1] ?? 0);
  const esquiva = negrito(celula(mov, 'Esquiva')), bloqueio = negrito(celula(mov, 'Bloqueio'));
  const cargaTxt = celula(mov, 'Carga') || '';
  const kg = (rot) => { const m = new RegExp(rot + '\\s*\\**\\s*([\\d.]*\\d(?:,\\d+)?)').exec(cargaTxt); return m ? numBR(m[1]) : null; };
  const carga = /Leve/.test(cargaTxt) ? { leve: kg('Leve'), media: kg('Média'), pesada: kg('Pesada'), maxima: kg('Máxima') } : null;
  const terraTxt = celula(mov, 'Deslocamento em terra') || '';
  const tres = /Batalha\s*\*\*(\d+)\*\*\s*·\s*Arranque\s*\*\*(\d+)\*\*\s*·\s*Corrida\s*\*\*(\d+)\*\*/.exec(terraTxt);
  const vooTxt = celula(mov, 'Voo') || '';
  const voo = /Batalha\s*\*\*(\d+)\*\*/.exec(vooTxt);
  const nadoTxt = celula(mov, 'Nado') || '';
  // O Nado vem em número único ("**5** m por Tick", a lula) ou em velocidades ("Batalha **3** (m por Tick)",
  // o hezrou; "Batalha **5** · Arranque **8** · Corrida **12**", o merfolk). As duas formas se leem.
  const nado = /^\*\*(\d+)\*\*/.exec(nadoTxt.trim()) ?? /^Batalha\s*\*\*(\d+)\*\*/.exec(nadoTxt.trim());
  const nado3 = /^Batalha\s*\*\*(\d+)\*\*\s*·\s*Arranque\s*\*\*(\d+)\*\*\s*·\s*Corrida\s*\*\*(\d+)\*\*/.exec(nadoTxt.trim());
  const voo3 = /Arranque\s*\*\*(\d+)\*\*\s*·\s*Corrida\s*\*\*(\d+)\*\*/.exec(vooTxt);
  const escNum = /^Batalha\s*\*\*(\d+)\*\*/.exec(String(celula(mov, 'Escalada') ?? '').trim());
  // AS FORMAS DE VELOCIDADE QUE O CONVERSOR LÊ, e só elas (CORRIGE da Revisora, rodada 16, na 146d85a9): a
  // sequência dos rótulos dos números em negrito da célula tem de ser uma destas, e todo número de uma forma
  // aceita vai ao JSON. Qualquer outra combinação para: "Batalha **3** · Arranque **5**" sem a Corrida
  // perdia o Arranque calado. "" é o número único do começo ("**5** m por Tick"). Texto sem número não
  // decide (decisoes-etapa-6.md §9, item 11) e segue.
  const opc = (base, ...extras) => extras.reduce((acc, e) => [...acc, ...acc.map((x) => `${x} · ${e}`)], [base]);
  const FORMAS = {
    'Nado': ['', 'Batalha', 'Batalha · Arranque · Corrida'],
    'Voo': [...opc('Batalha', 'Cruzeiro', 'Mergulho'), ...opc('Batalha · Arranque · Corrida', 'Cruzeiro', 'Mergulho')],
    'Escalada': ['Batalha'],
    'Deslocamento em terra': ['Batalha · Arranque · Corrida'],
    'Nado / Voo': [], 'Escalada, escavação': [],
  };
  const confereNumeros = (rot, txt) => {
    const t = String(txt ?? '').trim();
    const seq = [...t.matchAll(/(?:^|([A-Za-zÀ-ú]+))\s*\*\*\s*\d+/g)].map((m) => m[1] ?? '').join(' · ');
    if (seq !== '' || /^\*\*\s*\d/.test(t)) if (!FORMAS[rot].includes(seq)) aviso.push(`${rot} "${t.slice(0, 80)}": velocidades "${seq || 'número único'}" fora das formas que o conversor lê (${FORMAS[rot].map((f) => f || 'número único').join('; ') || 'nenhuma: esta célula não leva número'})`);
  };
  confereNumeros('Nado', nadoTxt); confereNumeros('Voo', vooTxt); confereNumeros('Escalada', celula(mov, 'Escalada'));
  confereNumeros('Deslocamento em terra', terraTxt); confereNumeros('Nado / Voo', celula(mov, 'Nado / Voo') ?? celula(mov, 'Nado, voo')); confereNumeros('Escalada, escavação', celula(mov, 'Escalada, escavação'));
  const deslocamento = {
    ...(tres ? { terra: { batalha: +tres[1], arranque: +tres[2], corrida: +tres[3] } } : {}),
    ...(voo ? { voo: { batalha: +voo[1], ...(/Cruzeiro\s*\*\*(\d+)/.exec(vooTxt) ? { cruzeiro: +/Cruzeiro\s*\*\*(\d+)/.exec(vooTxt)[1] } : {}), ...(/Mergulho\s*\*\*(\d+)/.exec(vooTxt) ? { mergulho: +/Mergulho\s*\*\*(\d+)/.exec(vooTxt)[1] } : {}), ...(voo3 ? { arranque: +voo3[1], corrida: +voo3[2] } : {}) } } : {}),
    ...(nado3 ? { nado: { batalha: +nado3[1], arranque: +nado3[2], corrida: +nado3[3] } } : nado ? { nado: +nado[1] } : {}),
  };
  const v3 = {
    pv: negrito(celula(mov, 'PV total')),
    esquiva, bloqueio, defesa: Math.max(esquiva ?? 0, bloqueio ?? 0),
    defesaMental: negrito(celula(mov, 'Defesa Mental')),
    defesaSocial: negrito(celula(mov, 'Defesa Social')),
    absorcao: { impacto, corte: corteN ? Number(corteN[1]) : impacto, perfuracao: perfN ? Number(perfN[1]) : impacto },
    couracaNivel,
    pesoErguido: naoErgue ? null : negrito(celula(mov, 'Peso erguido')),
    ...(carga ? { carga } : {}),
    deslocamento,
  };
  const nuloDeclarado = { pesoErguido: naoErgue, defesaMental: imuneMental, defesaSocial: imuneSocial };
  for (const [k, v] of Object.entries(v3)) if ((v == null || Number.isNaN(v)) && !nuloDeclarado[k]) aviso.push(`v3.${k} sem valor`);
  // OS MODOS QUE A FICHA DECIDE (decisoes-etapa-6.md §9, item 11): número decide; "não",
  // "não tem", "não se aplica" decidem que o modo não existe; "[sem dado]", "não entra
  // na conta", "texto" e "sem número" não decidem, e o modo de hoje fica. Valor `null`
  // quer dizer "a ficha decidiu que não há" (ou que é 0, que a mesa não lê).
  const NEGA = /^(não|não tem|não se aplica|não escala nem escava|não, pela anatomia)\b(?!\s+(entra|achad))/i;
  const nega = (txt) => NEGA.test(String(txt || '').replace(/\*/g, '').trim());
  const comb = celula(mov, 'Nado / Voo') ?? celula(mov, 'Nado, voo');
  const escTxt = celula(mov, 'Escalada, escavação') ?? celula(mov, 'Escalada');
  const locomocao = {};
  if (tres) locomocao.terra = +tres[1] >= 1 ? +tres[1] : null; else if (nega(terraTxt)) locomocao.terra = null;
  if (voo) locomocao.voo = +voo[1] >= 1 ? Math.min(30, +voo[1]) : null; else if (nega(vooTxt) || nega(comb)) locomocao.voo = null;
  if (nado) locomocao.natacao = +nado[1] >= 1 ? +nado[1] : null; else if (nega(nadoTxt) || nega(comb)) locomocao.natacao = null;
  if (escNum) locomocao.escalada = +escNum[1] >= 1 ? +escNum[1] : null; // "Batalha **1** (m por Tick), em parede e teto" (a geleia ocre)
  else if (nega(escTxt)) { locomocao.escalada = null; if (/escava/.test(String(celula(mov, 'Escalada, escavação') ?? ''))) locomocao.escavacao = null; }
  // Ataques
  const atq = tabela(S['Ataques']);
  const col = (...n) => n.map((x) => atq.cab.indexOf(x)).find((i) => i >= 0);
  // As colunas que a tabela pode ter. P/G/R e Dano médio não se leem: o tempo do golpe sai da Classe e o
  // dano médio, da conta do motor. Coluna que não está aqui para.
  const COLUNAS_ATQ = ['Nome', 'Ataque', 'Parte', 'Classe', 'P/G/R', 'Velocidade', 'Dano', 'Tipo', 'Nível de Perfuração', 'Nível', 'Acerto', 'Bloqueia como arma', 'Dano médio', 'Justificativa'];
  for (const c of atq.cab) if (!COLUNAS_ATQ.includes(c)) aviso.push(`coluna "${c}" da tabela Ataques que o conversor não conhece`);
  const ataques = [];
  const semDano = []; // a Língua da rã: não é ataque (decisoes-etapa-6.md §9, item 2)
  const jogadaPorParte = {};
  // O Bloqueio da ficha vem SEM a arma desde a D-190 ("o Bloqueio sem a arma, que o card
  // soma"): o bônus sai da coluna "Bloqueia como arma" ("sim, +1", "sim (+1; ...)",
  // "sim, Defesa +2"), o maior entre os ataques, e a Defesa do card soma. Sem número, 0.
  const iArma = atq.cab.indexOf('Bloqueia como arma');
  // O que a célula Bloqueia aceita (CORRIGE da Revisora, rodada 16): "não", "sim" (com ou sem o número,
  // "sim, +1", "sim (+1; ...)", "sim, Defesa +2", "sim (−2)"), e "o mesmo <parte> (+N)" (o segundo golpe
  // do mesmo chifre do tricerátops, que bloqueia como o primeiro). O texto entre parênteses depois é nota.
  // Fora disso, para: um "talvez" baixava a Defesa calado.
  if (iArma >= 0) for (const r of atq.rows) {
    const b = String(r[iArma] || '').replace(/\*\*/g, '').trim();
    if (!/^(não|sim)(\b|$)/i.test(b) && !/^o mesmo [a-zà-ú ]+\(\+\d+\)$/i.test(b)) aviso.push(`ataque "${limpa(r[0])}": Bloqueia como arma "${r[iArma]}" fora do que se aceita (não, sim, sim +N, o mesmo ... (+N))`);
  }
  const bonusArma = iArma < 0 ? 0 : bonusDaArma(atq.rows.map((r) => r[iArma])); // o maior, uma vez (lib-ficha-v3.mjs)
  if (bonusArma) { v3.bloqueioArma = bonusArma; v3.defesa = defesaComArma(v3, bonusArma); }
  // A CRIATURA VESTIDA (D-206: "mostra as duas, mas normalmente se escolhe a maior. Essa é uma escolha do
  // mestre, não nossa. Mas as Defesas são influenciadas pelos equipamentos da criatura"). O Equipamento da
  // Identidade é "nenhum" ou "armas: <id> · armaduras: <id|nenhuma> · escudos: <id|nenhum>", com os ids do
  // livro; a conta do livro (vestidaDoLivro) e a frase da linha Absorção (vestidaDaFicha) têm de bater.
  // Uma peça só por categoria: empilhar (gambeson sob a malha) é Variante, e não entra aqui.
  const equipTxt = String(celula(ident, 'Equipamento') ?? 'nenhum').replace(/`/g, '').trim();
  let peca = { armadura: null, escudo: null };
  if (!/^nenhum$/.test(equipTxt)) {
    const eq = /^armas: ([a-z0-9-]+(?:, [a-z0-9-]+)*) · armaduras: ([a-z0-9-]+) · escudos: ([a-z0-9-]+)$/.exec(equipTxt);
    if (!eq) throw new Error(`${arq}: Equipamento fora do formato "armas: <id>[, <id>] · armaduras: <id> · escudos: <id>": "${equipTxt}"`);
    for (const a of eq[1].split(', ')) if (!ARMAS_IDS.has(a)) throw new Error(`${arq}: Equipamento: arma "${a}" não está no armas.json`); // mais de uma arma: "lanca, besta-media" (o merfolk)
    if (eq[2] !== 'nenhuma') { peca.armadura = ARMADURAS[eq[2]]; if (!peca.armadura) throw new Error(`${arq}: Equipamento: armadura "${eq[2]}" não está no armaduras.json`); }
    if (eq[3] !== 'nenhum') { peca.escudo = ESCUDOS[eq[3]]; if (!peca.escudo) throw new Error(`${arq}: Equipamento: escudo "${eq[3]}" não está no escudos.json`); }
  }
  const fraseVestida = vestidaDaFicha(absTxt);
  if (peca.armadura || peca.escudo) {
    const livro = vestidaDoLivro(v3, peca.armadura, peca.escudo, bonusArma);
    if (!fraseVestida) throw new Error(`${arq}: veste armadura ou escudo e a linha Absorção não tem a frase "Com o ...: Esquiva, Bloqueio; Impacto, Corte, Perfuração (Nível); Penalidade"`);
    const dif = [];
    for (const k of ['esquiva', 'bloqueio', 'nivel', 'penalidade', 'contraTiro']) if (fraseVestida[k] != null && fraseVestida[k] !== livro[k]) dif.push(`${k} ${fraseVestida[k]} (livro ${livro[k]})`);
    for (const k of ['impacto', 'corte', 'perfuracao']) if (fraseVestida.absorcao[k] !== livro.absorcao[k]) dif.push(`${k} ${fraseVestida.absorcao[k]} (livro ${livro.absorcao[k]})`);
    if (dif.length) throw new Error(`${arq}: a frase vestida da Absorção não bate com a conta do livro: ${dif.join(', ')}`);
    v3.vestida = livro;
  } else if (fraseVestida) throw new Error(`${arq}: a linha Absorção tem a frase vestida e o Equipamento não tem armadura nem escudo`);
  for (const r of atq.rows) {
    const nomeA = limpa(r[col('Nome', 'Ataque')]);
    const danoTxt = r[col('Dano')].replace(/◆/g, '').replace(/\*\*/g, '');
    const tipoTxt = sem(r[col('Tipo')]).trim();
    const dado = /(\d+)d6/.exec(danoTxt);
    if (!dado) {
      // O GOLPE SEM DANO (a Língua da rã, as Antenas do monstro da ferrugem; decisão do Arquiteto de 24/10/2026):
      // só a forma exata, Dano "nenhum (<texto>)", Tipo "não se aplica" e Nível vazio, "0" ou "não se aplica" (o da
      // rã-gigante publicada). Vira a habilidade "<Nome>: <texto>, sem dano", com o texto da ficha; o efeito fica
      // nas Manobras. Qualquer outra combinação com "nenhum" para.
      const semDanoM = /^nenhum \(([^)]+)\)$/.exec(danoTxt.trim());
      const nivelSD = String(r[col('Nível de Perfuração', 'Nível')] || '').replace(/\*\*/g, '').trim();
      if (semDanoM && tipoTxt === 'nao se aplica' && /^(|0|não se aplica)$/.test(nivelSD)) { semDano.push({ nome: nomeA, descricao: `${semDanoM[1]}, sem dano` }); continue; }
      aviso.push(`ataque sem dado: ${nomeA} (${danoTxt})`); continue;
    }
    const lado = danoTxt.includes('=') ? danoTxt.split('=').pop() : danoTxt;
    const menos = /[−-]\s*(\d+)/.exec(lado.replace(/\d+d6/, ''));
    const mais = !/Força/.test(lado) && /\+\s*(\d+)/.exec(lado.replace(/\d+d6/, ''));
    const tipo = TIPO_DANO[tipoTxt];
    // Tipo fora do que o manual aceita (§5.2, item 8: Impacto, Corte, Perfuração, palavra do vocabulário, "fenômeno") para.
    if (!tipo) throw new Error(`${arq}: ataque "${nomeA}": Tipo "${r[col('Tipo')]}" fora do que o manual aceita`);
    // O Nível de Perfuração aceita N0 a N3 (combate.md:300, "Nível de Perfuração (0–3)"), com nota depois
    // ("N1 (estocada, modo secundário)", "N0 [sem dado]"); vazio, "não se aplica" ou "n/a" só fora do
    // Perfurante. No golpe que não é Perfurante o nível é lido e conferido, e não vai ao card: o motor só lê
    // a Perfuração do modo Perfurante (o N1 da estocada do Corte é o modo secundário, que o card não tem).
    const nivelTxt = String(r[col('Nível de Perfuração', 'Nível')] || '').replace(/\*\*/g, '').replace(/\[[^\]]*\]/g, '').trim();
    const nivel = /^N([0-3])(?:\s*\(.*\))?$/.exec(nivelTxt);
    if (!nivel && !(tipo !== 'perfurante' && /^(|não se aplica|n\/a)$/i.test(nivelTxt))) aviso.push(`ataque "${nomeA}": Nível de Perfuração "${r[col('Nível de Perfuração', 'Nível')]}" fora do que se aceita (N0 a N3${tipo === 'perfurante' ? ', e o Perfurante tem de ter' : ', vazio ou "não se aplica"'})`);
    // O Acerto aceita +N, −N ou vazio. Antes um "bom" sumia calado, e o "−1" tipográfico virava +1.
    const acertoTxt = String(r[col('Acerto')] || '').replace(/\*\*/g, '').trim();
    const acertoM = /^([+−-])\s*(\d+)$/.exec(acertoTxt);
    if (acertoTxt && !acertoM) aviso.push(`ataque "${nomeA}": Acerto "${r[col('Acerto')]}" fora do que se aceita (+N, −N ou vazio)`);
    const acerto = acertoM ? (acertoM[1] === '+' ? 1 : -1) * Number(acertoM[2]) : 0;
    // A Classe: as seis do armas.json; Distância e Arremesso são ataque à distância. Classe que não existe para.
    const classeTxt = sem(r[col('Classe')] || '').trim();
    const classe = CLASSES[classeTxt] ?? null;
    if (classeTxt && !classe) throw new Error(`${arq}: ataque "${nomeA}": Classe "${r[col('Classe')]}" não existe no armas.json`);
    // A jogada ("Jogada: Destreza 3 + Armas 3", na Justificativa). Sem ela, a da linha de antes com a mesma
    // arma ("espada longa (duas mãos)" segue "espada longa (uma mão)"); sem nenhuma, Força + Briga, como no animal.
    const parteBase = sem(r[col('Parte')] || '').replace(/\s*\(.*$/, '').trim();
    const jg = jogadaDoAtaque(r[col('Justificativa')] || '');
    let atrib = 'forca', pericia = 'briga';
    if (jg) {
      atrib = ATRIB[jg.atributo]; pericia = HAB[sem(jg.habilidade)]?.[1];
      if (!atrib || !pericia) throw new Error(`${arq}: ataque "${nomeA}": a jogada "${jg.atributo} + ${jg.habilidade}" tem Atributo ou Habilidade que não existe`);
      jogadaPorParte[parteBase] = { atrib, pericia };
    } else if (jogadaPorParte[parteBase]) ({ atrib, pericia } = jogadaPorParte[parteBase]);
    // A jogada comum, sem frase: o corpo a corpo vai pelo maior entre Destreza e Força (combate.md:156,
    // "normalmente o maior dos dois"; decisão do Arquiteto de 23/10/2026, como no card do editor).
    else if ((attrs.destreza ?? 0) > (attrs.forca ?? 0)) atrib = 'destreza';
    // A JOGADA TEM DE SER A DO LIVRO, e a que não for para (combate.md:156; ordem do autor, "nenhum pode
    // passar errado sem aviso"): o Disparo natural (o sopro) é Vigor + Disparo; a Classe Distância,
    // Percepção + Atirador; o Arremesso, Destreza + Arremesso; o corpo a corpo, "Destreza ou Força, à
    // escolha de quem ataca, normalmente o maior dos dois", e a frase com o menor para.
    const regraJogada = pericia === 'disparo' ? (atrib === 'vigor' ? null : 'o Disparo natural é Vigor + Disparo')
      : classe === 'distancia' ? (atrib === 'percepcao' && pericia === 'atirador' ? null : 'o tiro é Percepção + Atirador')
      : pericia === 'arremesso' ? (atrib === 'destreza' ? null : 'o arremesso é Destreza + Arremesso')
      : (atrib === 'forca' || atrib === 'destreza') ? ((attrs[atrib] ?? 0) < (attrs[atrib === 'forca' ? 'destreza' : 'forca'] ?? 0) ? 'o corpo a corpo usa o maior entre Destreza e Força' : null)
      : 'o corpo a corpo é Destreza ou Força';
    if (regraJogada) aviso.push(`ataque "${nomeA}": a jogada ${atrib} + ${pericia} contra o livro (combate.md:156: ${regraJogada})${jg ? '' : ', sem frase "Jogada:" (a jogada comum Força + Briga)'}`);
    // A ARMA DE TIRO (o arco, a besta): o ataque de Classe Distância leva o id da arma do Equipamento cujo nome é o
    // do ataque ou o da Parte ("Arco longo", "arco curto, à distância"); com uma arma de tiro só, é ela. A Força
    // no dano segue a regra dela no lib-bestiario. Tiro que soma a Força sem arma identificada para; o sopro e a
    // rajada, que não somam, seguem sem arma.
    let armaTiro = null;
    if (classe === 'distancia') {
      const nm = (x) => sem(String(x || '')).replace(/\s*\(.*$/, '').replace(/,.*$/, '').trim();
      const armasEq = (/^armas: ([^·]+)/.exec(equipTxt)?.[1] || '').split(',').map((x) => x.trim()).filter(Boolean);
      const cands = armasEq.filter((id) => ARMAS_POR_ID[id]?.arma?.classe === 'distancia');
      armaTiro = cands.find((id) => [nm(nomeA), nm(r[col('Parte')])].includes(nm(ARMAS_POR_ID[id].nome))) ?? (cands.length === 1 ? cands[0] : null);
      if (!armaTiro && /Força/.test(lado)) aviso.push(`ataque "${nomeA}": tiro que soma a Força sem a arma de tiro no Equipamento`);
    }
    ataques.push({
      nome: nomeA, atrib, pericia, dado: Number(dado[1]),
      ...(/Força\s*×\s*2/.test(danoTxt) ? { mao: 2 } : { mao: 1 }),
      tipo: tipo || tipoTxt,
      ...(acerto ? { acerto } : {}),
      ...(tipo === 'perfurante' && nivel ? { perf: Number(nivel[1]) } : {}),
      ticks: parseInt(r[col('Velocidade')], 10) || (aviso.push(`ataque "${nomeA}": Velocidade sem número: "${r[col('Velocidade')]}"`), null),
      ...(menos ? { danoBonus: -Number(menos[1]) } : mais ? { danoBonus: Number(mais[1]) } : {}),
      // sem a Força: o golpe que não a soma (o bico do falcão, §9 item 2) e a conta já
      // feita ("1d6 − 2 + 2 = 1d6"), em que o lado direito é o final; com Força 0 não muda nada
      ...(!/Força/.test(lado) && (attrs.forca > 0 || danoTxt.includes('=')) ? { forca: false } : {}),
      ...(classe ? { classe } : {}),
      ...(classe === 'distancia' ? { distancia: true } : classe === 'arremesso' ? { distancia: true, arremesso: true } : {}),
      ...(armaTiro ? { arma: armaTiro } : {}),
    });
  }
  // Manobras e Sentidos (decisoes-etapa-6.md §4 e §5)
  // Uma linha é "nome · ataque · classe: texto" (manual §5.2, item 9); o ataque e a
  // classe podem faltar, e a classe vem escrita de vários jeitos ("com regra no livro",
  // "regra do livro", "livro:"). Linha que a própria ficha marca como fora ("não
  // manobra", "não entra") não vai para o card.
  const CLASSE_MAN = /^(com regra no livro|regra do livro|regra no livro|livro|regra da ficha|sem regra ainda|como luta)\b[:.]?\s*/i;
  const CLASSE_NOME = (s) => (/sem regra/i.test(s) ? 'sem regra ainda' : /da ficha/i.test(s) ? 'regra da ficha' : /como luta/i.test(s) ? 'como luta' : 'livro');
  const habilidades = [...semDano];
  // AS TÉCNICAS (CORRIGE da Revisora na d1b893a9): "Pisar Leve · Técnica pisar-leve, nível 1 · livro: ..." vai
  // ao `tech` da fonte, de onde o card e a mesa tiram o bloco "Técnicas:". O id e o nível têm de bater com o
  // tecnicas.json; a linha que começa um segmento com "Técnica" e não fecha o formato para.
  const tech = {};
  for (const it of itens(S['Manobras'])) {
    const tm = /(?:^|·)\s*Técnica ([a-z0-9-]+), nível (\d+)\s*(?:·|$)/.exec(it);
    if (!tm) { if (/(?:^|·)\s*Técnica\s/.test(it)) aviso.push(`Técnica fora do formato "Técnica <id>, nível N": ${it.slice(0, 70)}`); continue; }
    const t = TECNICAS[tm[1]];
    if (!t) { aviso.push(`Técnica "${tm[1]}" não está no tecnicas.json`); continue; }
    if (Number(tm[2]) !== t.nivel) aviso.push(`Técnica "${tm[1]}": nível ${tm[2]} na ficha, ${t.nivel} no tecnicas.json`);
    if (tech[tm[1]]) aviso.push(`Técnica "${tm[1]}" repetida`);
    tech[tm[1]] = true;
  }
  for (const it of itens(S['Manobras']).filter((l) => !/^nenhuma\b/i.test(l))) {
    if (/não manobra|não entra\b/i.test(it)) continue;
    const m = /^([^·:]+?)\s*(?:·|:)\s*(.*)$/.exec(it);
    if (!m) { aviso.push(`manobra fora do formato: ${it.slice(0, 60)}`); continue; }
    const partes = m[2].split(' · ');
    const k = partes.findIndex((p) => CLASSE_MAN.test(p));
    let descricao = m[2], classe = null;
    if (k >= 0) {
      classe = CLASSE_NOME(CLASSE_MAN.exec(partes[k])[1]);
      const texto = limpa([partes[k].replace(CLASSE_MAN, ''), ...partes.slice(k + 1)].join(' · ')).replace(/^[.;:,\s]+/, '');
      descricao = [limpa(partes.slice(0, k).join(' · ')), texto].filter(Boolean).join(': ');
    } else descricao = limpa(descricao);
    habilidades.push({ nome: limpa(m[1]), descricao, ...(classe ? { classe } : {}) });
  }
  const sentidos = itens(S['Sentidos']).map((l) => limpa(l).replace(/^[.;:,\s]+/, '')).filter(Boolean);
  if (sentidos.length) habilidades.push({ nome: 'Sentidos', descricao: sentidos.join(' · ') });
  // Veneno, doença, enxame: só as linhas de jogo (manual §5.4), que são as que trazem
  // os números. As linhas soltas "Veneno: ..." e "Doença: ..." são pesquisa.
  const vd = itens(S['Veneno e doença']);
  const nomeTexto = (l) => { const i = l.indexOf(':'); return { nome: limpa(l.slice(0, i)), texto: limpa(l.slice(i + 1)) }; };
  const venenos = vd.filter((l) => /^Veneno no jogo/.test(l)).map(nomeTexto);
  const doencas = vd.filter((l) => /^(Doença no jogo|Variante )/.test(l)).map(nomeTexto);
  const enxameL = itens(S['Corpo']).filter((l) => /^Enxame no jogo/.test(l)).map(nomeTexto);
  // O texto do card
  const comp_ = tabela(S['Comportamento']);
  const descricao = limpa((comp_.rows.find((r) => r[0] === 'Texto curto') || [])[1] || '');
  const social = limpa((comp_.rows.find((r) => r[0] === 'Social') || [])[1] || '');
  const ambientacao = comp_.rows.filter((r) => /^Ambientação:/.test(r[0])).map((r) => {
    const tit = r[0].replace(/^Ambientação:\s*/, '');
    const novo = /\(novo título:\s*([^)]+)\)/.exec(tit);
    return { titulo: tit.replace(/\s*\(novo título:[^)]*\)/, '').trim(), novo: novo ? novo[1].trim() : null, texto: limpa(r[1]) };
  });
  const noJogo = limpa((S['No jogo'] || '').trim().replace(/\n+/g, ' '));
  const notasObservacao = itens(S['Notas de observação']);
  // conferência contra o bloco v3 da própria ficha
  const bloco = /```json\s*\n(\{"v3".*\})\s*\n```/.exec(S['Bloco de conferência'] || '');
  if (bloco) {
    const b = JSON.parse(bloco[1]).v3;
    if (b.forca !== attrs.forca) aviso.push(`bloco: forca ${b.forca} ≠ ${attrs.forca}`);
    if (b.vigor !== attrs.vigor) aviso.push(`bloco: vigor ${b.vigor} ≠ ${attrs.vigor}`);
    if (b.pv !== v3.pv) aviso.push(`bloco: pv ${b.pv} ≠ ${v3.pv}`);
    if (Math.abs(b.pesoErguido - v3.pesoErguido) > 0.01) aviso.push(`bloco: pesoErguido ${b.pesoErguido} ≠ ${v3.pesoErguido}`);
    if (b.couracaNivel !== v3.couracaNivel) aviso.push(`bloco: couracaNivel ${b.couracaNivel} ≠ ${v3.couracaNivel}`);
    if (b.alvo !== alvo) aviso.push(`bloco: alvo ${b.alvo} ≠ ${alvo}`);
  } else aviso.push('sem bloco de conferência');

  return { arq, id, site, imagem, imagem2, elementos, transforma, artes, mana, nome, nomeIngles: nomeEmIngles(celula(ident, 'Nome em inglês (D&D, Pathfinder)')), categoria, papel, centelha: Number(cent),
    ameaca: celula(ident, 'Ameaça') ? parseInt(celula(ident, 'Ameaça'), 10) : null,
    // no Terreno, o que vem depois do ';' é a nota de onde a criatura prefere ficar ('qualquer; pântano e imundície', o hezrou): o card mostra os terrenos, e a nota não tem campo
    terreno: celula(ident, 'Terreno') ? celula(ident, 'Terreno').split(';')[0].split(',').map((x) => terrenoDe(x) ?? (aviso.push(`Terreno fora do conjunto: ${x.trim()}`), null)) : null,
    clima: celula(ident, 'Clima') ? celula(ident, 'Clima').split(',').map((x) => CLIMA[x.trim()] ?? (aviso.push(`Clima fora do conjunto: ${x.trim()}`), null)) : null,
    faltaEsp: blocosEsp === cabecalhosEsp ? null : `${cabecalhosEsp} cabeçalho(s) de Especialidade, ${blocosEsp} bloco(s) lido(s)`,
    porte, dimensoes, locomocao, attrs, skills, skills2, especialidades, willpower, virtues, aparencia,
    ataques, habilidades, tech, venenos, doencas, enxame: enxameL, descricao, ambientacao, noJogo, notasObservacao, v3,
    social, aptidoes: limpa(itens(S['Aptidões']).join(' ') || (S['Aptidões'] || '').trim()), aviso };
}

// ------------------------------------------------------------- a fonte do site
// A CATEGORIA LEGADA, que o inimigos.json usa como categoria (lib-bestiario.mjs) e de onde sai a Furtividade
// publicada (regras.json, furtividadeCriatura). Antes caía em "Fera" calada para toda fonte base sem o campo, e
// a pixie, o grifo, o lich e outros 12 não animais viraram Fera no merge 2df6cdaa. Agora, nesta ordem: a
// categoriaLegada da fonte base; senão a categoria da fonte base (o que o inimigos.json usava antes); senão, sem
// fonte base, a ficha "Animal" é "Fera" (a categoria das feras do bestiário). Qualquer outro caso para.
function categoriaLegadaDe(f, velha) {
  if (velha?.categoriaLegada) return velha.categoriaLegada;
  if (velha?.categoria) return velha.categoria;
  if (!velha && f.categoria === 'Animal') return 'Fera';
  throw new Error(`${f.arq}: sem categoria legada (${velha ? 'a fonte base não tem categoria nem categoriaLegada' : `sem fonte base, e a categoria da ficha é "${f.categoria}", não "Animal"`})`);
}
function montaFonte(f, todas) {
  const velha = f.site ? fontePorId(f.id) : null; // depois da etapa 4, a fonte de hoje já está no id definitivo
  const irma = IRMA[f.arq] ? todas.find((x) => x.arq === IRMA[f.arq]) : null;
  if (IRMA[f.arq] && !irma) throw new Error(`${f.arq}: a ficha irmã ${IRMA[f.arq]} não existe`);
  const irmaFonte = irma ? fontePorId(irma.id) : null;
  const ameaca = f.ameaca ?? velha?.ameacaLegada ?? irma?.ameaca ?? irmaFonte?.ameacaLegada;
  const terreno = f.terreno ?? velha?.ecologia?.terreno ?? irma?.terreno ?? irmaFonte?.ecologia?.terreno;
  const clima = f.clima ?? velha?.ecologia?.clima ?? irma?.clima ?? irmaFonte?.ecologia?.clima;
  if (ameaca == null || !terreno || !clima) throw new Error(`${f.arq}: sem Ameaça, Terreno ou Clima, nem na fonte nem na irmã`);
  // lore: o de hoje, com a Ambientação trocando o parágrafo de mesmo título; "No jogo" no fim
  const lore = (velha?.lore || []).map((s) => ({ ...s }));
  for (const a of f.ambientacao) {
    const i = lore.findIndex((s) => s.titulo === a.titulo);
    const novo = { titulo: a.novo || a.titulo, texto: a.texto };
    if (i >= 0) lore[i] = novo; else lore.push(novo);
  }
  // o Social vai ao parágrafo "Comportamento" (§9, item 5): no fim dele, ou num novo
  if (f.social) {
    const frase = `Social: ${f.social.replace(/[.;\s]+$/, '')}.`;
    const i = lore.findIndex((s) => s.titulo === 'Comportamento');
    if (i >= 0) lore[i] = { ...lore[i], texto: `${lore[i].texto.replace(/\s+$/, '')} ${frase}` };
    else lore.push({ titulo: 'Comportamento', texto: frase });
  }
  if (f.venenos.length || f.doencas.length) lore.push({ titulo: 'Veneno e doença', texto: [...f.venenos, ...f.doencas].map((x) => `${x.nome}: ${x.texto}`).join(' ') });
  if (f.enxame.length) lore.push({ titulo: 'Enxame', texto: f.enxame.map((x) => x.texto).join(' ') });
  if (/\bsim\b/.test(f.aptidoes)) lore.push({ titulo: 'Aptidões', texto: f.aptidoes });
  if (f.noJogo) lore.push({ titulo: 'No jogo', texto: f.noJogo });
  const fonte = {
    ...(velha?.ordem != null ? { ordem: velha.ordem } : {}),
    id: f.id,
    ...(velha?.idAntigo ? { idAntigo: velha.idAntigo } : {}),
    nome: f.nome,
    nomeIngles: f.nomeIngles,
    categoria: f.categoria,
    categoriaLegada: categoriaLegadaDe(f, velha),
    papel: f.papel,
    conceito: velha?.conceito ?? `animal ${f.porte}`,
    descricao: f.descricao,
    ...(velha?.descricaoLegada ? { descricaoLegada: velha.descricaoLegada } : {}),
    tags: velha?.tags ?? [],
    imagem: f.imagem,
    ...(f.imagem2 ? { imagem2: f.imagem2 } : {}),
    porte: f.porte,
    dimensoes: f.dimensoes,
    locomocao: Object.fromEntries(Object.entries({ ...(velha?.locomocao || {}), ...f.locomocao }).filter(([, v]) => v != null)),
    // a mesa lê no mínimo 1 em cada número; o 0 da ficha fica no v3 (§9, item 3)
    ...(f.v3.deslocamento.terra ? { deslocamentoDeclarado: Object.fromEntries(Object.entries(f.v3.deslocamento.terra).map(([k, v]) => [k, Math.max(1, v)])) } : {}),
    centelha: f.centelha,
    attrs: f.attrs,
    skills: f.skills,
    ...(Object.keys(f.skills2).length ? { skills2: f.skills2 } : {}),
    ...(f.especialidades.length ? { especialidades: f.especialidades } : {}),
    virtues: f.virtues,
    willpower: f.willpower,
    aparencia: f.aparencia,
    ataques: f.ataques,
    // D-195: as três sempre, mesmo vazias, da linha Elementos da ficha (e não da fonte velha).
    fraquezas: f.elementos.fraquezas, resistencias: f.elementos.resistencias, imunidades: f.elementos.imunidades, ...(f.transforma ? { transforma: f.transforma } : {}),
    ...(f.artes ? { arte: f.artes } : {}), ...(f.mana != null ? { mana: f.mana } : {}), // D-196
    habilidades: f.habilidades,
    ...(f.venenos.length ? { venenos: f.venenos } : {}),
    ...(f.doencas.length ? { doencas: f.doencas } : {}),
    ...(f.enxame.length ? { enxame: f.enxame } : {}),
    lore,
    ecologia: { tipo: velha?.ecologia?.tipo ?? f.categoria, terreno, clima },
    notas: velha?.notas ?? '',
    pendente: velha?.pendente ?? true,
    ...(velha?.fonte ? { fonte: velha.fonte } : {}),
    variantes: velha?.variantes ?? [],
    ameacaLegada: ameaca,
    ...(velha?.proezaFutura ? { proezaFutura: velha.proezaFutura } : {}),
    v3: f.v3,
    ...(Object.keys(f.tech).length ? { tech: f.tech } : {}),
    ...(f.notasObservacao.length ? { notasObservacao: f.notasObservacao } : {}),
  };
  return fonte;
}

// Cada ficha que o conversor não entende entra na lista, e ele para depois de ler todas, sem gravar nada.
const paradas = [];
const todas = arquivos.map((a) => { try { return converte(a); } catch (e) { paradas.push(e.message); return null; } });
if (paradas.length) { console.error(`✘ ${paradas.length} ficha(s) que o conversor não entendeu:\n` + paradas.map((m) => '  ' + m).join('\n')); process.exit(1); }
// Ficha com cabeçalho de Especialidade cujo bloco o laço não leu falha alto, e antes de
// gravar qualquer fonte: sair sem nenhuma Especialidade, calado, foi o defeito da etapa 9.
const semEsp = todas.filter((f) => f.faltaEsp);
// O ADENDO DO AUTOR (23/10/2026, item 1): aviso não segue. Tudo o que o conversor não entendeu numa ficha
// (Habilidade sem destino, ataque sem dado, valor sem número, o bloco de conferência que não bate) para aqui.
const comAviso = todas.filter((f) => f.aviso.length);
if (comAviso.length) {
  console.error(`✘ ${comAviso.length} ficha(s) com o que o conversor não entendeu:\n` + comAviso.map((f) => f.aviso.map((a) => `  ${f.arq}: ${a}`).join('\n')).join('\n'));
  process.exit(1);
}
if (semEsp.length) {
  console.error(`✘ ${semEsp.length} ficha(s) com Especialidade que o conversor não leu:\n` + semEsp.map((f) => `  ${f.arq}: ${f.faltaEsp}`).join('\n'));
  process.exit(1);
}
let gravadas = 0;
fs.mkdirSync(SAIDA, { recursive: true });
// Monta todas antes de gravar a primeira: uma que pare no montaFonte (a categoria legada) não deixa metade gravada.
const paradasFonte = [];
const fontes = todas.map((f) => { try { return montaFonte(f, todas); } catch (e) { paradasFonte.push(e.message); return null; } });
if (paradasFonte.length) { console.error(`✘ ${paradasFonte.length} ficha(s) que o conversor não entendeu:\n` + paradasFonte.map((m) => '  ' + m).join('\n')); process.exit(1); }
for (const fonte of fontes) {
  fs.writeFileSync(path.join(SAIDA, fonte.id + '.json'), JSON.stringify(fonte, null, 2) + '\n');
  gravadas++;
}
console.log(`${gravadas} fontes gravadas em ${SAIDA}`);
if (arg('--log')) fs.writeFileSync(arg('--log'), JSON.stringify(CITACOES, null, 1) + '\n');
console.log(`${CITACOES.length} parêntese(s) com citação de fonte limpos`);
