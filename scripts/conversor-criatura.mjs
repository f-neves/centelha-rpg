// conversor-criatura.mjs · a ficha .md de criatura para o JSON do formato unificado (plano-conversao.md, A3).
//
// O formato é o do formato-criatura.md (tmp/arquiteto/bestiario/formato-json/): só entrada e escolha (D-216), as
// formas por cima da principal (D-217), a `revisao` (D-222) e os nomes da D-218. O conversor lê a ficha pelo
// lib-ficha-md.mjs, o mesmo leitor do gen-criaturas-esperado.mjs, e pede ao motor só o que decide uma escolha (o
// Tamanho perto do corte). Ele não corrige ficha e não completa o que ela não diz: o que não entende vira PARADA, e a
// criatura com parada não é gravada. O que a ficha diz e o formato ainda não tem lugar vira LACUNA: entra com o nome
// proposto e vai na lista, para o Arquiteto (tmp/executora/fase3/perguntas.md).
//
// Uso: node scripts/conversor-criatura.mjs <pasta das fichas> <pasta de saída> [--site <pasta>]
//   --site   a pasta dos JSON do site de hoje (padrão src/data/bestiario), de onde vêm o lore, as imagens e o
//            que a ficha não tem (Terreno e Clima, a Ameaça)
// Grava <id>.json de cada criatura sem parada e relatorio.txt com as paradas e as lacunas, ficha por ficha.
// O site não muda: o JSON novo só substitui o de src/data/bestiario/ na troca, com as 324 (A5, D-227).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerFichaMd, campo, negritos, numBR, semMarcas, slug, idAtributo, idHabilidade } from './lib-ficha-md.mjs';
import { carregarTS } from './lib-ts.mjs';
import { criaturaNovaSchema } from './criatura-schema.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const dado = (f) => JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data', f), 'utf8'));
const M = await carregarTS('src/lib/motor.ts');

const UN = { g: 0.001, kg: 1, t: 1000 };
const TAMANHOS = 'Minúsculo|Miúdo|Pequeno|Médio|Grande|Enorme|Imenso|Colossal';
const ARMAS = dado('armas.json').filter((a) => a.arma);
const ARMADURAS = new Set(dado('armaduras.json').filter((a) => a.armadura).map((a) => a.id));
const ESCUDOS = new Set(dado('escudos.json').filter((a) => a.escudo).map((a) => a.id));
const ARTES = new Set(dado('artes.json').map((a) => a.id));
const TECNICAS = new Set(dado('tecnicas.json').map((t) => t.id));
const VOC = dado('elementos-vocab.json');
const ORDEM_ELEM = VOC.grupos.flatMap((g) => g.palavras);
const ID_ELEM = Object.fromEntries([...ORDEM_ELEM.map((id) => [slug(id), id]), ...Object.entries(VOC.rotulos).map(([id, r]) => [slug(r), id])]);
// as secundárias só de criatura (Musculatura, Voo, Corrida, Disparo): não estão no catálogo do personagem
const SO_DE_CRIATURA = new Set(['musculatura', 'voo', 'corrida', 'disparo']);
// Terreno e Clima do site (inglês, de antes) para as palavras do formato (D-219), e os sinônimos das fichas
const TERRENO_DO_SITE = { Cold: 'gélido', Desert: 'deserto', Forest: 'floresta', Jungle: 'selva', Mountain: 'montanha',
  Plains: 'planície', Swamp: 'pântano', Underground: 'subterrâneo', Urban: 'urbano', Water: 'aquático', Coast: 'litoral',
  Sky: 'céu', Ruins: 'ruínas', Any: 'qualquer' };
const CLIMA_DO_SITE = { Cold: 'frio', Temperate: 'temperado', Tropical: 'tropical', Extraplanar: 'extraplanar' };
const TERRENO_SINONIMO = { frio: 'gélido', cidade: 'urbano', 'água': 'aquático', costa: 'litoral' };
// as regras do livro que a linha "livro:" nomeia e que o card escreve (D-221); a primeira palavra da linha
const REGRAS_LIVRO = [[/^a Rajada\b/, 'rajada'], [/^(o )?Agarr(ar|ão)\b/i, 'agarrar'], [/^Investida\b/, 'investida'],
  [/^Derrubar\b/, 'derrubar'], [/^Empurrar\b/, 'empurrar'], [/^a empunhadura dupla\b/, 'empunhadura-dupla'], [/^a Regra de Horda\b/, 'horda']];
// o texto de trabalho que não vai ao texto de jogo (manual 7.5; PERGUNTAS.md, pergunta 1, 26/10/2026)
const TRABALHO = /\(site\)|autor decid\w*|\b[CD]-\d{2,4}\b/;
const CAMPOS_HE = [['Ativação', 'ativacao'], ['Duração', 'duracao'], ['Alcance', 'alcance'], ['Área', 'area'], ['Efeito', 'efeito'],
  ['Dano', 'dano'], ['Resistência', 'resistencia'], ['Limite de uso', 'limiteDeUso']];
const SECOES = new Set(['Identidade', 'Corpo, área e porte', 'Corpo e porte', 'Variantes', 'Atributos', 'Habilidades',
  'Vontade, Virtudes e Aparência', 'Corpo e movimento', 'Ataques', 'Manobras', 'Sentidos', 'Veneno e doença', 'Corpo',
  'Comportamento', 'Aptidões', 'Elementos', 'Luz', 'Comparação com D&D 3.5 e Pathfinder 1', 'Comparação com o animal de base',
  'No jogo', 'Visual', 'Procedência', 'Notas de observação', 'Bloco de conferência']);

const inteiro = (s) => { const m = String(s ?? '').match(/[−-]?\d+/); return m ? Number(m[0].replace('−', '-')) : undefined; };
const metros = (s) => { const m = String(s ?? '').match(/\*\*([\d.,]+) m\*\*/) || String(s ?? '').match(/^([\d.,]+) m\b/); return m ? numBR(m[1]) : undefined; };
// o texto de jogo, sem as marcas: a marca das formas, a palavra de dúvida da linha (D-197), as marcas `**[...]**`, o ◆ e o negrito
const jogo = (s) => semMarcas(String(s ?? '').replace(/\s*\*\*\[formas:[^\]]*\]\*\*\s*$/, '').replace(/\bPROVIS[ÓO]RIO\.?\s*/g, ''))
  .replace(/\*\*/g, '').replace(/\s{2,}/g, ' ').trim();
const semPonto = (s) => s.replace(/\s*\.\s*$/, '').trim();
const idForma = (nome) => slug(String(nome).replace(/^forma (de |d[ao] )?/, ''));

export function converterFicha(texto, { site = null } = {}) {
  const F = lerFichaMd(texto), T = F.tabelas, S = F.secoes;
  const paradas = [], lacunas = [], avisos = [], revisao = [];
  const para = (s) => paradas.push(s), lacuna = (s) => lacunas.push(s);
  for (const s of Object.keys(S)) if (!SECOES.has(s)) para(`seção "## ${s}" que o conversor não conhece`);
  const I = T['Identidade'] || [], C = T['Corpo, área e porte'] ?? T['Corpo e porte'] ?? [], MV = T['Corpo e movimento'] || [];
  const VVA = T['Vontade, Virtudes e Aparência'] || [];
  const c = {};

  // ----- 2.1 Identidade
  c.id = semMarcas(campo(I, 'id') || '').replace(/`/g, '');
  const ida = semMarcas(campo(I, 'id antigo do bestiário') || '').replace(/`/g, '');
  if (ida && !/^não|^nenhum/.test(ida)) c.idAntigo = ida;
  c.nome = jogo(campo(I, 'Nome'));
  const ing = jogo(campo(I, 'Nome em inglês') || '');
  c.nomeIngles = /^não há ficha/i.test(ing) ? null : ing.split(/ \(|;/)[0].trim();
  const cpc = (campo(I, 'Categoria · papel · Centelha') || '').split('·').map((x) => jogo(x));
  c.categoria = slug(cpc[0] || ''); c.papel = slug(cpc[1] || '');
  // o site de hoje e o JSON novo (depois da troca, A5): o conversor lê os dois, para rodar de novo a cada lote
  c.ameaca = inteiro(campo(I, 'Ameaça')) ?? site?.ameaca ?? site?.ameacaLegada;
  if (c.ameaca === undefined) para('sem Ameaça na ficha nem no site');
  c.centelha = inteiro(cpc[2]);
  if (c.centelha === undefined) para('Centelha ilegível na linha Categoria');
  const lf = campo(I, 'Formas');
  const nomesFormas = lf ? jogo(lf).split(' · ').map((x) => x.trim()) : null;
  if (nomesFormas) {
    if (!/\(esta ficha\)$/.test(nomesFormas[0])) para('a primeira forma da linha Formas não diz "(esta ficha)"');
    nomesFormas[0] = nomesFormas[0].replace(/\s*\(esta ficha\)$/, '');
    c.formaPrincipal = { id: idForma(nomesFormas[0]), nome: nomesFormas[0] };
  }
  const idsFormas = nomesFormas ? nomesFormas.map(idForma) : null;
  // a marca **[formas: ...]** do fim da linha: "todas" ou os ids das formas que ela nomeia (D-230; manual 5.2, itens 9 e 10)
  const formasDaLinha = (l, onde) => {
    const m = l.match(/\*\*\[formas: ([^\]]*)\]\*\*\s*$/);
    if (!nomesFormas) { if (m) para(`${onde}: a marca das formas numa ficha sem a linha Formas`); return 'todas'; }
    if (!m) { para(`${onde}: a linha não tem a marca das formas`); return 'todas'; }
    if (m[1].trim() === 'todas') return 'todas';
    const ids = m[1].split(',').map((x) => x.trim());
    for (const x of ids) if (!nomesFormas.includes(x)) para(`${onde}: a marca diz "${x}", que não está na linha Formas`);
    return ids.map(idForma);
  };

  // ----- 2.2 Corpo
  const corpo = {};
  corpo.postura = jogo(campo(C, 'Postura') || '');
  const anat = `${campo(I, 'Anatomia') || ''} ${corpo.postura}`;
  corpo.apoio = /quadrúpede|quatro patas/i.test(anat) ? 'quadrupede' : /bípede|de pé|duas pernas/i.test(anat) ? 'bipede' : undefined;
  if (!corpo.apoio) {
    if (/serpente|sem pernas|sem patas|cobra|verme|limo|enxame|tentáculo|nada|voa|flutua|asas|peixe|incorpóreo|nuvem|redemoinho|hexápode|seis patas|oito patas|aracnídeo|inseto|caranguejo|crustáceo/i.test(anat)) corpo.apoio = 'outro';
    else para(`apoio: a Anatomia e a Postura não dizem bípede nem quadrúpede ("${anat.trim().slice(0, 80)}")`);
  }
  corpo.altura = metros(campo(C, 'Altura'));
  const lg = campo(C, 'Largura') || '';
  corpo.largura = metros(lg);
  const pr = lg.match(/profundidade ([\d.,]+) m/);
  corpo.profundidade = pr ? numBR(pr[1]) : null;
  const ct = campo(C, 'Comprimento total') ?? campo(C, 'Comprimento');
  corpo.comprimento = /^não se aplica/.test(ct || '') || ct === undefined ? null : metros(ct) ?? null;
  const cs = campo(C, 'Comprimento sem a cauda');
  if (cs && !/^não se aplica/.test(cs)) {
    corpo.comprimentoSemCauda = metros(cs);
    const cg = campo(C, 'Cauda grossa');
    if (cg !== undefined) corpo.caudaGrossa = /^sim/.test(jogo(cg));
  }
  const env = campo(C, 'Envergadura');
  if (env && !/^não se aplica/.test(env)) corpo.envergadura = metros(env);
  const lm = campo(C, 'Massa') || '';
  if (/\*\*sem massa\*\*/.test(lm)) {
    corpo.semMassa = true;
    const v = lm.match(/volume \*\*([\d.,]+) m³\*\*/);
    if (v) corpo.volume = numBR(v[1]); else para('incorpóreo sem o volume na linha Massa');
  } else {
    const m = lm.match(/\*\*(?:cerca de )?([\d.,]+) (g|kg|t)\b/);
    if (m) corpo.massa = numBR(m[1]) * UN[m[2]]; else para('Massa ilegível');
  }
  const la = campo(C, 'Área'), lt = campo(C, 'Tamanho') || '';
  const ar = String(la ?? '').match(/\*\*([\d.,]+) m²\*\*/) || lt.match(/\(([\d.,]+) m²/);
  if (ar) corpo.area = numBR(ar[1]); else para('Área ilegível');
  const tam = (lt.match(new RegExp(`^\\s*\\*\\*(${TAMANHOS})\\b`)) || [])[1];
  if (!tam) para('Tamanho ilegível');
  const pp = lt.match(/\([\d.,]+ m²,\s*([^)]*)\)/);
  if (pp) corpo.posturaDoTamanho = pp[1].trim();
  // a escolha do Tamanho (D-216, D-225): só quando a ficha ficou com o vizinho do corte, a menos de 5% (decisoes-autor
  // §13), ou pela decisão 7 (os quadrúpedes de 50 a 75 kg são Pequenos), a exceção que o confere_etapa2.py aceita
  const escolha = (area, t, rotulo, cel) => {
    if (!t || area === undefined) return undefined;
    const aceita = M.tamanhosDaArea(area);
    if (aceita[0] === slug(t)) return undefined;
    if (aceita.includes(slug(t)) || /decisão 7.*quadrúpedes de 50 a 75 kg/.test(cel)) return slug(t);
    para(`${rotulo}: a ficha diz ${t}, e a área de ${area} m² dá ${aceita.join(' ou ')}`);
    return undefined;
  };
  const linhaTam = C.find((r) => Object.values(r)[0] === 'Tamanho');
  const tEsc = escolha(corpo.area, tam, 'Tamanho', linhaTam ? Object.values(linhaTam).join(' ') : '');
  if (tEsc) corpo.tamanhoEscolhido = tEsc;
  const ls = semMarcas(campo(C, 'Segundo Tamanho') || '');
  const seg = (ls.match(new RegExp(`^\\s*\\*\\*(${TAMANHOS})\\b`)) || [])[1];
  if (seg) {
    const sa = ls.match(/\(([\d.,]+) m²\s*(?:,\s*([^)]*))?\)/);
    if (!sa) para('Segundo Tamanho sem a área');
    else {
      corpo.segundoTamanho = { area: numBR(sa[1]), posturaDoTamanho: (sa[2] || '').trim() };
      const s2 = escolha(corpo.segundoTamanho.area, seg, 'Segundo Tamanho', ls);
      if (s2) corpo.segundoTamanho.tamanhoEscolhido = s2;
    }
  }
  // a linha de PV na zona de transição (decisoes-autor §13): a que a ficha usou, pelos limites que ela mesma escreve
  const pvb = campo(MV, 'PV base') || '';
  const fx = pvb.match(/Faixa de PV de ([\d.,]+) ?(g|kg|t)? a ([\d.,]+) ?(g|kg|t)/);
  const kg = corpo.semMassa ? (corpo.volume ?? 0) * 1010 : corpo.massa;
  if (fx && kg !== undefined) {
    const de = numBR(fx[1]) * UN[fx[2] || fx[4]], ate = numBR(fx[3]) * UN[fx[4]];
    if (kg > ate) corpo.linhaPV = 'abaixo'; else if (kg <= de) corpo.linhaPV = 'acima';
  }
  if (/^Por quadrado cheio/.test(pvb)) lacuna('enxame: a Vida por quadrado cheio não tem formato (formato-criatura.md, fim da seção 4)');
  const carga = campo(MV, 'Carga') || '';
  const cm = carga.match(/\*\*Leve ([\d.,]+) kg\*\*/);
  if (cm && /medid/.test(carga)) corpo.cargaMedida = numBR(cm[1]);
  if (/^\s*\*\*não ergue\*\*/.test(campo(MV, 'Peso erguido') || '')) { corpo.naoErgue = true; lacuna('corpo.naoErgue: quem não ergue, chave que o formato não tem (perguntas.md, P5)'); }
  for (const [k, rot] of [['altura', 'Altura'], ['largura', 'Largura']]) if (corpo[k] === undefined) para(`sem a linha ${rot} legível em "Corpo, área e porte"`);
  c.corpo = corpo;
  c.couraca = F.bloco?.couracaNivel ?? inteiro((campo(MV, 'Absorção') || '').match(/Couraça \*\*nível (\d+)/)?.[1]);
  if (c.couraca === undefined) para('sem a Couraça (bloco de conferência ou linha Absorção)');
  const bpv = inteiro(campo(MV, 'Bônus de PV'));
  if (bpv) c.bonusPV = bpv;

  // ----- 2.3 Números
  c.atributos = {};
  for (const r of T['Atributos'] || []) {
    const [nome, valor] = Object.values(r), aid = idAtributo(semMarcas(nome));
    if (aid) c.atributos[aid] = inteiro(valor); else para(`Atributo "${nome}" que o conversor não conhece`);
  }
  c.habilidades = {}; c.habilidadesSec = {};
  const habId = (nome, onde) => {
    const h = idHabilidade(nome);
    if (h) return h;
    if (SO_DE_CRIATURA.has(slug(nome))) return { id: slug(nome), secundaria: true };
    para(`${onde}: a Habilidade "${nome}" não está no catálogo (D-231)`);
    return undefined;
  };
  for (const r of T['Habilidades'] || []) {
    const [nome, valor] = Object.values(r), limpo = semMarcas(nome).replace(/\s*\(.*\)\s*$/, '').trim();
    const h = habId(limpo, 'Habilidades');
    if (h) (h.secundaria ? c.habilidadesSec : c.habilidades)[h.id] = inteiro(valor);
  }
  // as Especialidades por Habilidade (D-231): as naturais e as do livro, cada uma com a origem
  c.especialidades = {}; c.especialidadesSec = {};
  const hab = (S['Habilidades'] || []).join('\n');
  for (const [bloco, origem] of [[/Especialidades naturais[^\n]*\n([\s\S]*?)(?=\n\*\*Especialidades \(|$)/, 'natural'], [/\*\*Especialidades \([^\n]*\n([\s\S]*?)$/, 'livro']]) {
    const b = (hab.match(bloco) || [])[1] || '';
    for (const l of b.split('\n').filter((x) => /^- /.test(x))) {
      if (/^- nenhuma/.test(l)) continue;
      // a ficha antiga escreve a justificativa depois do número ("+1 ◆: o ataque habitual"); ela fica na ficha
      const m = semMarcas(l).match(/^- ([^(]+?) \(([^)]+)\) \+?(\d+)\b/);
      if (!m) { para(`Especialidade fora do formato: "${l.slice(0, 70)}"`); continue; }
      const h = habId(m[1].trim(), 'Especialidades');
      if (!h) continue;
      const alvo = h.secundaria ? c.especialidadesSec : c.especialidades;
      (alvo[h.id] ??= []).push({ foco: m[2].trim(), valor: Number(m[3]), origem });
    }
  }
  const vt = (campo(VVA, 'Virtudes') || '').replace(/\*\*/g, '');
  c.virtudes = {};
  // "Bravura 2; Compaixão, Convicção e Temperança 1": o número vale para os nomes que o antecedem no mesmo trecho
  const VIRT = { Bravura: 'bravura', Compaixão: 'compaixao', Convicção: 'conviccao', Temperança: 'temperanca' };
  for (const trecho of vt.split(/[;.]/)) {
    const n = trecho.match(/(\d+)\s*$/);
    if (n) for (const [rot, k] of Object.entries(VIRT)) if (new RegExp(`\\b${rot}\\b`).test(trecho)) c.virtudes[k] = Number(n[1]);
    for (const m of trecho.matchAll(/(Bravura|Compaixão|Convicção|Temperança) (\d+)/g)) c.virtudes[VIRT[m[1]]] = Number(m[2]);
  }
  for (const [rot, k] of Object.entries(VIRT)) if (c.virtudes[k] === undefined) para(`Virtudes sem ${rot}`);
  c.vontade = inteiro(campo(VVA, 'Vontade'));
  c.aparencia = inteiro(campo(VVA, 'Aparência'));
  c.deslocamento = {};
  const dt = campo(MV, 'Deslocamento em terra') || '';
  const dtm = dt.match(/Batalha \*\*(\d+)\*\* · Arranque \*\*(\d+)\*\* · Corrida \*\*(\d+)\*\*/);
  if (dtm) c.deslocamento.terra = { batalha: +dtm[1], arranque: +dtm[2], corrida: +dtm[3] };
  else if (/^(não anda|não se aplica|\*\*\[sem dado\]\*\*)/.test(dt.trim())) lacuna('deslocamento.terra: obrigatório no formato, e a ficha diz que não anda em terra');
  else para('Deslocamento em terra ilegível');
  for (const [rot, k] of [['Voo', 'voo'], ['Nado', 'nado'], ['Escavação', 'escavacao'], ['Escalada', 'escalada']]) {
    const v = campo(MV, rot) || '';
    const b = v.match(/Batalha \*\*(\d+)\*\*/) || v.match(/^\s*\*\*(\d+)\*\* m por Tick/);
    if (!b) continue;
    c.deslocamento[k] = { batalha: +b[1] };
    const a2 = v.match(/Arranque \*\*(\d+)\*\*/), c2 = v.match(/Corrida \*\*(\d+)\*\*/);
    if (a2) c.deslocamento[k].arranque = +a2[1];
    if (c2) c.deslocamento[k].corrida = +c2[1];
  }

  // ----- 2.4 Equipamento, Artes e ataques
  const lerEquip = (v, onde) => {
    const eq = { arsenal: [], armaduras: [] };
    const t = semMarcas(v || 'nenhum').replace(/`/g, '');
    if (t === 'nenhum') return eq;
    const m = t.match(/^armas: (.+?) · armaduras: (\S+) · escudos: (\S+)/);
    if (!m) { para(`${onde}: Equipamento fora do formato`); return eq; }
    for (const a of m[1].split(',').map((x) => x.trim()).filter((x) => x !== 'nenhuma')) {
      if (!ARMAS.some((w) => w.id === a)) para(`${onde}: a arma ${a} não está no armas.json`);
      eq.arsenal.push({ ref: `a:${a}` });
    }
    if (m[3] !== 'nenhum') { if (!ESCUDOS.has(m[3])) para(`${onde}: o escudo ${m[3]} não está no escudos.json`); eq.arsenal.push({ ref: `e:${m[3]}` }); }
    if (m[2] !== 'nenhuma') { if (!ARMADURAS.has(m[2])) para(`${onde}: a armadura ${m[2]} não está no armaduras.json`); eq.armaduras.push({ base: m[2], vestida: true }); }
    return eq;
  };
  c.equipamento = lerEquip(campo(I, 'Equipamento'), 'Identidade');
  const lerArtes = (v, onde, zero) => {
    const out = {};
    const t = semMarcas(v || 'nenhuma').replace(/`/g, '');
    if (t === 'nenhuma') return out;
    for (const p of t.split(' · ')) {
      const m = p.trim().match(/^([a-z0-9-]+) (\d+)$/);
      if (!m || !ARTES.has(m[1])) { para(`${onde}: Arte "${p.trim()}" fora do formato ou do artes.json`); continue; }
      if (!zero && Number(m[2]) === 0) para(`${onde}: Arte ${m[1]} no nível 0 fora de uma forma`);
      out[m[1]] = Number(m[2]);
    }
    return out;
  };
  c.artes = lerArtes(campo(I, 'Artes'), 'Identidade', false);
  const armasDaFicha = (eq) => eq.arsenal.filter((x) => x.ref.startsWith('a:')).map((x) => x.ref.slice(2));
  const lerAtaque = (r, armasEq, onde) => {
    const nome = semMarcas(r['Nome'] ?? r['Ataque'] ?? '');
    const just = r['Justificativa'] ?? '';
    const citada = just.match(/`armas\.json`, `([a-z0-9-]+)`/)?.[1];
    const arma = armasEq.includes(citada) ? citada : ARMAS.find((w) => armasEq.includes(w.id) && w.nome.toLowerCase() === nome.toLowerCase())?.id;
    const jog = just.match(/Jogada:[^|]*?\+\s*(Briga|Armas|Disparo|Atirador|Arremesso)\b/) || just.match(/Jogada:[^|]*?(Briga|Armas|Disparo|Atirador|Arremesso)\b/);
    if (arma) {
      // a arma do livro guarda só o nome, a arma e a Habilidade (D-220); o resto vem do catálogo
      const w = ARMAS.find((x) => x.id === arma);
      const pgrCol = String(r['P/G/R'] ?? '').match(/(\d+)\/(\d+)\/(\d+)/), vel = inteiro(r['Velocidade']);
      if (pgrCol && vel !== undefined && +pgrCol[1] + +pgrCol[2] + +pgrCol[3] !== vel) avisos.push(`${onde}, ${nome}: a coluna P/G/R (${pgrCol.slice(1).join('/')}) não soma a Velocidade ${vel}; a arma do livro usa a do catálogo (${w.arma.ticks})`);
      return { nome, arma, habilidade: jog ? slug(jog[1]) : w.arma.pericia };
    }
    // a parte é o pedaço do corpo; o resto da célula diz como o golpe sai ("boca, à distância")
    const a = { nome, parte: slug(semMarcas(r['Parte'] ?? '').split(',')[0]) };
    const cls = slug(semMarcas(r['Classe'] ?? ''));
    a.habilidade = jog ? slug(jog[1]) : cls === 'distancia' ? 'disparo' : cls === 'arremesso' ? 'arremesso' : 'briga';
    a.classe = cls;
    const pgr = String(r['P/G/R'] ?? '').match(/(\d+)\/(\d+)\/(\d+)/);
    if (!pgr) para(`${onde}, ${nome}: P/G/R ilegível`);
    else {
      a.pgr = pgr.slice(1).map(Number);
      const vel = inteiro(r['Velocidade']);
      if (vel !== undefined && a.pgr[0] + a.pgr[1] + a.pgr[2] !== vel) para(`${onde}, ${nome}: o pgr ${a.pgr.join('/')} não soma a Velocidade ${vel} (D-221)`);
    }
    let d = semMarcas(r['Dano'] ?? '').replace(/\*\*/g, '').replace(/PROVIS\S*/g, '').trim();
    if (/^nenhum/.test(d)) { a.dado = null; a.multiplicadorForca = 0; }
    else {
      if (d.includes('=')) d = d.split('=').pop().trim();
      const m = d.match(/^(\d+)d6(?:\s*([+−-])\s*(\d+))?/);
      if (!m) para(`${onde}, ${nome}: Dano ilegível`);
      else {
        a.dado = `${m[1]}d6${m[3] ? `${m[2] === '+' ? '+' : '-'}${m[3]}` : ''}`;
        a.multiplicadorForca = /Força\s*×\s*(\d)/.test(d) ? Number(d.match(/Força\s*×\s*(\d)/)[1]) : /Força\s*\(/.test(d) ? 1 : 0;
      }
    }
    const tp = slug(semMarcas(r['Tipo'] ?? '').replace(/\*\*/g, ''));
    a.tipoDano = tp === 'nao-se-aplica' ? 'nao-se-aplica' : (ID_ELEM[tp] ?? tp);
    const np = String(r['Nível de Perfuração'] ?? r['Nível'] ?? '').match(/N(\d)/);
    a.nivelPerfuracao = np ? Number(np[1]) : null;
    a.acerto = inteiro(r['Acerto']) ?? 0;
    const bl = String(r['Bloqueia como arma'] ?? '').match(/sim\s*\(([+−-]?\d+)\)/);
    a.bloqueiaComoArma = bl ? inteiro(bl[1]) : null;
    return a;
  };
  c.ataques = (T['Ataques'] || []).filter((r) => { const n = semMarcas(r['Nome'] ?? r['Ataque'] ?? ''); return n && n !== 'Nome' && n !== 'Ataque'; })
    .map((r) => lerAtaque(r, armasDaFicha(c.equipamento), 'Ataques'));

  // ----- 2.5 Habilidades especiais, como luta, sentidos
  c.habilidadesEspeciais = []; c.comoLuta = [];
  const nomesAtaques = new Set(c.ataques.map((a) => a.nome));
  // a linha cita o ataque pelo nome, pelo nome sem o parêntese ("Pisão" do "Pisão (ou investida)") ou pela parte
  const ataqueCitado = (p) => {
    const q = p.trim(), sem = q.replace(/\s*\(.*\)$/, '');
    return c.ataques.find((a) => a.nome === q || a.nome === sem || a.nome.replace(/\s*\(.*\)$/, '') === sem
      || (a.parte && a.parte === slug(sem)))?.nome;
  };
  for (const l0 of (S['Manobras'] || []).filter((l) => l.startsWith('- '))) {
    const formas = formasDaLinha(l0, 'Manobras');
    const l = l0.slice(2).replace(/\s*\*\*\[formas:[^\]]*\]\*\*\s*$/, '');
    const partes = l.split(' · ');
    const iCl = partes.findIndex((p, i) => i > 0 && /^(livro|regra da ficha|sem regra ainda|como luta):/.test(p));
    if (iCl < 0) { para(`Manobras: linha fora do formato (sem "livro:", "regra da ficha:", "sem regra ainda:" ou "como luta:"): "${l.slice(0, 80)}"`); continue; }
    const nome = jogo(partes[0]);
    const [cl, ...resto] = partes.slice(iCl).join(' · ').split(/:\s*/);
    const corpoTxt = resto.join(': ');
    if (TRABALHO.test(corpoTxt)) para(`Manobras, ${nome}: texto de trabalho no texto de jogo ("${corpoTxt.match(TRABALHO)[0]}"; manual 7.5)`);
    if (cl === 'como luta') { c.comoLuta.push({ nome, formas, texto: jogo(corpoTxt) }); continue; }
    const he = { nome, formas, classe: cl };
    for (const p of partes.slice(1, iCl)) {
      const mb = p.match(/^poder natural \(base ([^)]+?) (\d+)(?:,[^)]*)?\)$/);
      const mt = p.match(/^Técnica ([a-z0-9-]+), nível (\d+)$/);
      const ma = p.match(/^Arte (\S+) (\d+)$/);
      if (mb) {
        const arte = slug(mb[1]);
        if (!ARTES.has(arte)) para(`Manobras, ${nome}: a base ${mb[1]} não é Arte do artes.json`);
        he.base = { arte, nivel: Number(mb[2]) };
      } else if (mt) {
        if (!TECNICAS.has(mt[1])) para(`Manobras, ${nome}: a Técnica ${mt[1]} não está no tecnicas.json`);
        he.tecnica = { id: mt[1], nivel: Number(mt[2]) };
        lacuna(`habilidadesEspeciais.tecnica: a Técnica (Proeza) não tem formato (formato-criatura.md, fim da seção 4)`);
      } else if (ma) {
        he.arte = { id: slug(ma[1]), nivel: Number(ma[2]) };
        lacuna('habilidadesEspeciais.arte: a Arte numa linha das Manobras não tem formato (D-196 a manda para a linha Artes)');
      } else if (ataqueCitado(p)) he.ataque = ataqueCitado(p);
      else if (/^poder natural$/.test(p.trim())) para(`Manobras, ${nome}: "poder natural" sem a base (GUIA-FICHA.md, seção 11: "poder natural (base Vento 2)")`);
      else para(`Manobras, ${nome}: o campo "${p}" não é ataque, poder natural nem Técnica`);
    }
    // o poder natural ligado ao ataque de mesmo nome (o sopro do dragão): a habilidade diz o ataque (formato, 4.5)
    if (!he.ataque && nomesAtaques.has(nome)) he.ataque = nome;
    if (cl === 'regra da ficha') {
      const t = jogo(corpoTxt);
      const pos = CAMPOS_HE.map(([rot]) => t.search(new RegExp(`(^|[.;] )${rot}: `)));
      if (pos.some((p) => p < 0)) { para(`Manobras, ${nome}: regra da ficha sem os oito campos (falta ${CAMPOS_HE.filter((x, i) => pos[i] < 0).map((x) => x[0]).join(', ')})`); continue; }
      CAMPOS_HE.forEach(([rot, k], i) => {
        const ini = t.indexOf(`${rot}: `, pos[i]) + rot.length + 2, fim = i + 1 < CAMPOS_HE.length ? pos[i + 1] : t.length;
        he[k] = semPonto(t.slice(ini, fim));
      });
      if (/PROVIS/.test(corpoTxt)) revisao.push({ campo: `habilidadesEspeciais.${nome}`, motivo: 'números sugeridos pela ficha (D-197)' });
    } else if (cl === 'livro') {
      const t = semPonto(jogo(corpoTxt));
      const r = REGRAS_LIVRO.find(([re]) => re.test(t));
      if (r) he.regra = r[1];
      if (!r || r[1] !== 'rajada') { he.texto = t; lacuna('habilidadesEspeciais.texto: a linha "livro:" que não é a Rajada não tem campo de texto no formato (perguntas.md, P7)'); }
    } else he.efeito = semPonto(jogo(corpoTxt));
    c.habilidadesEspeciais.push(he);
  }
  c.sentidos = [];
  for (const l0 of (S['Sentidos'] || []).filter((l) => l.startsWith('- '))) {
    const formas = formasDaLinha(l0, 'Sentidos');
    const l = jogo(l0.slice(2));
    const m = l.match(/^([^:]+):\s*(.*)$/);
    if (!m) { para(`Sentidos: linha fora do formato: "${l.slice(0, 60)}"`); continue; }
    if (TRABALHO.test(m[2])) para(`Sentidos, ${m[1]}: texto de trabalho no texto de jogo ("${m[2].match(TRABALHO)[0]}"; manual 7.5)`);
    const s = { nome: m[1].trim(), descricao: semPonto(m[2].replace(/\s*\(sem regra ainda\)/, '').replace(/\s*;\s*$/, '')), formas };
    if (/\(sem regra ainda\)|sem regra ainda/.test(m[2])) {
      s.classe = 'sem regra ainda';
      revisao.push({ campo: `sentidos.${s.nome}`, motivo: 'sem regra ainda no livro' });
    }
    c.sentidos.push(s);
  }

  // ----- Elementos, com as formas (D-217): o da principal vale nas formas que não dizem os delas e nas que o repetem
  const lerElem = (linha, onde) => {
    const out = { fraquezas: [], resistencias: [], imunidades: [] };
    const t = semMarcas(String(linha || '')).replace(/`/g, '').replace(/^-\s*/, '').replace(/\.$/, '').trim();
    if (!t || /^nenhum$/i.test(t)) return out;
    for (const parte of t.split('·')) {
      const m = parte.match(/^\s*([^:]+):\s*(.+)$/);
      const k = m && { fraquezas: 'fraquezas', resistencias: 'resistencias', imunidades: 'imunidades' }[slug(m[1])];
      if (!k) { para(`${onde}: Elementos fora do formato: "${t.slice(0, 60)}"`); return out; }
      for (const w of m[2].split(',').map((x) => x.trim()).filter(Boolean)) {
        const id = ID_ELEM[slug(w)];
        if (!id) para(`${onde}: "${w}" fora do vocabulário de Elementos`); else out[k].push(id);
      }
    }
    return out;
  };
  const elemP = lerElem((S['Elementos'] || []).find((l) => l.trim()), 'Elementos');

  // ----- fisiologia, aptidões, comportamento, ecologia
  const corpoSec = Object.fromEntries((S['Corpo'] || []).filter((l) => l.startsWith('- ')).map((l) => { const m = l.slice(2).match(/^([^:]+):\s*(.*)$/); return m ? [m[1].trim(), jogo(m[2])] : [l, '']; }));
  c.fisiologia = { respiracao: semPonto(corpoSec['Respiração'] || '') };
  const prende = semPonto((corpoSec['Prende a respiração'] || '').replace(/\s*\(o Mestre decide quanto\)/, '; quanto tempo, o Mestre decide'));
  if (prende && !/^(a de um humano|comum|não se aplica|nenhuma)$/.test(prende)) c.fisiologia.prendeRespiracao = prende;
  const camu = semPonto(corpoSec['Camuflagem'] || '');
  if (camu && !/^nenhuma$/.test(camu)) c.fisiologia.camuflagem = camu;
  c.fisiologia.mente = semPonto(corpoSec['Mente'] || '');
  c.fisiologia.tracos = semPonto(corpoSec['Traços'] || '');
  const lerApt = (t, onde) => {
    const m = String(t || '').replace(/`/g, '').trim().match(/^montaria (sim|não) · carga (sim|não) · tração (sim|não)\.?$/);
    if (!m) { para(`${onde}: Aptidões fora do formato`); return undefined; }
    return { montaria: m[1] === 'sim', carga: m[2] === 'sim', tracao: m[3] === 'sim' };
  };
  c.aptidoes = lerApt((S['Aptidões'] || []).find((l) => l.trim()), 'Aptidões');
  const CO = T['Comportamento'] || [];
  const valorCo = (rot) => { const v = jogo(campo(CO, rot) || ''); if (TRABALHO.test(v)) para(`Comportamento, ${rot}: texto de trabalho ("${v.match(TRABALHO)[0]}")`); return v; };
  c.comportamento = { social: valorCo('Social'), atividade: valorCo('Atividade'), dieta: valorCo('Dieta'), caca: valorCo('Caça ou forrageio'), dianteDeGente: valorCo('Diante de gente') };
  const ter = campo(I, 'Terreno'), cli = campo(I, 'Clima');
  const pal = (s, sin) => jogo(s).split(',').map((x) => x.trim().toLowerCase()).filter(Boolean).map((x) => sin[x] ?? x);
  c.ecologia = {
    terreno: ter !== undefined ? pal(ter, TERRENO_SINONIMO) : (site?.ecologia?.terreno || []).map((x) => TERRENO_DO_SITE[x] ?? x),
    clima: cli !== undefined ? pal(cli, {}) : (site?.ecologia?.clima || []).map((x) => CLIMA_DO_SITE[x] ?? x),
  };
  c.descricao = valorCo('Texto curto');
  // o lore é o do site, com as linhas "Ambientação: <título>" trocando o parágrafo de mesmo título; saem o "No jogo" e o
  // "Comportamento" que o conversor de hoje cola com o Social (formato-criatura.md, 2.5)
  const amb = CO.filter((r) => /^Ambientação:/.test(Object.values(r)[0])).map((r) => [Object.values(r)[0].replace(/^Ambientação:\s*/, '').trim(), jogo(Object.values(r)[1])]);
  c.lore = (site?.lore || []).filter((x) => x.titulo !== 'No jogo' && !(x.titulo === 'Comportamento' && /^Social:/.test(x.texto)))
    .map((x) => (x.titulo === 'Comportamento' ? { ...x, texto: x.texto.replace(/\s*Social: [^.]*\.$/, '') } : x))
    .map((x) => { const a = amb.find(([t]) => t === x.titulo || t.replace(/\s*\(novo título:.*\)$/, '') === x.titulo); return a ? { titulo: (a[0].match(/\(novo título: (.*)\)$/) || [])[1] ?? x.titulo, texto: a[1] } : x; });
  c.imagens = site?.imagens ?? (site?.imagem ? [site.imagem] : []);

  // ----- as formas (D-217, D-230): cada linha da Variantes que a linha Formas nomeia, com o que muda
  if (nomesFormas) {
    c.formas = [];
    const variantes = T['Variantes'] || [];
    for (const nomeF of nomesFormas.slice(1)) {
      const r = variantes.find((x) => Object.values(x)[0] === nomeF);
      if (!r) { para(`a forma "${nomeF}" não tem linha em Variantes`); continue; }
      const f = { id: idForma(nomeF), nome: nomeF };
      const fc = {}, fa = {}, ff = {};
      for (const p of String(Object.values(r)[1]).split(/;\s+(?![^(]*\))/)) {
        const t = p.trim().replace(/\.$/, '');
        const at = t.match(/^(Força|Destreza|Vigor|Percepção|Inteligência|Raciocínio|Influência|Perspicácia|Compostura) (\d+)$/);
        if (at) { fa[idAtributo(at[1])] = Number(at[2]); continue; }
        if (/^PV \d+$/.test(t)) continue; // o PV da forma é conta do motor
        const m = t.match(/^([^:]+):\s*(.*)$/) || t.match(/^(Couraça) nível (\d+)$/) || t.match(/^(Aparência) (\d+)$/);
        if (!m) { para(`Variantes, ${nomeF}: "${t.slice(0, 50)}" fora do formato`); continue; }
        const [k, v] = [m[1].trim(), m[2].trim()];
        const n = (s) => numBR((s.match(/([\d.,]+)/) || [])[1]);
        if (k === 'Postura') { fc.postura = v; fc.apoio = /quadrúpede/.test(v) ? 'quadrupede' : /bípede/.test(v) ? 'bipede' : 'outro'; }
        else if (k === 'Altura') fc.altura = n(v);
        else if (k === 'Largura') { fc.largura = n(v); const q = v.match(/profundidade ([\d.,]+) m/); fc.profundidade = q ? numBR(q[1]) : (fc.apoio === 'quadrupede' ? null : undefined); if (fc.profundidade === undefined) delete fc.profundidade; }
        else if (k === 'Comprimento total' || k === 'Comprimento') fc.comprimento = n(v);
        else if (k === 'Comprimento sem a cauda') fc.comprimentoSemCauda = n(v);
        else if (k === 'Envergadura') fc.envergadura = n(v);
        else if (k === 'Massa') { const q = v.match(/([\d.,]+) (g|kg|t)\b/); if (q) fc.massa = numBR(q[1]) * UN[q[2]]; }
        else if (k === 'Área') fc.area = n(v);
        else if (k === 'Tamanho') {
          const q = v.match(new RegExp(`^(${TAMANHOS})(?:\\s*\\(([\\d.,]+) m²,\\s*([^)]*)\\))?`));
          if (q?.[3]) fc.posturaDoTamanho = q[3].trim();
          else if (q && fc.area === undefined) fc.tamanhoEscolhido = slug(q[1]);
        }
        else if (k === 'Couraça') f.couraca = Number(v);
        else if (k === 'Aparência') f.aparencia = inteiro(v);
        else if (k === 'Camuflagem') ff.camuflagem = v;
        else if (k === 'Traços') ff.tracos = v;
        else if (k === 'Equipamento') f.equipamento = lerEquip(v, `Variantes, ${nomeF}`);
        else if (k === 'Artes') f.artes = lerArtes(v, `Variantes, ${nomeF}`, true);
        else if (k === 'Aptidões') f.aptidoes = lerApt(v, `Variantes, ${nomeF}`);
        else if (k === 'Elementos') f._elementos = lerElem(v, `Variantes, ${nomeF}`);
        else if (k === 'Deslocamento') { const q = v.match(/\((\d+) · (\d+) · (\d+)\)/); if (q) f.deslocamento = { terra: { batalha: +q[1], arranque: +q[2], corrida: +q[3] } }; else para(`Variantes, ${nomeF}: Deslocamento ilegível`); }
        else if (k === 'Ataques') f._ataques = v;
        else if (k === 'Prende a respiração') ff.prendeRespiracao = v;
        else if (k === 'Voo' || k === 'Nado') {
          const q = v.match(/Batalha \**(\d+)\**/) || v.match(/^(\d+)\b/);
          if (q) (f.deslocamento ??= {})[k === 'Voo' ? 'voo' : 'nado'] = { batalha: +q[1] };
          else if (!/^não (voa|nada)/.test(v)) para(`Variantes, ${nomeF}: ${k} ilegível`);
        }
        else if (['PV', 'Peso erguido', 'Espaço', 'Anatomia', 'o resto', 'Mente', 'Respiração'].includes(k) || /^PV \d/.test(t)) { /* conta do motor, ou texto que não é número */ }
        else para(`Variantes, ${nomeF}: campo "${k}" que o conversor não conhece`);
      }
      if (/^PV \d/.test(String(Object.values(r)[1]))) { /* o PV da forma é conta */ }
      if (Object.keys(fc).length) f.corpo = fc;
      if (Object.keys(fa).length) f.atributos = fa;
      if (Object.keys(ff).length) f.fisiologia = ff;
      // os ataques da forma: a arma do equipamento dela, ou o ataque natural com o que a linha diz e o resto do de mesmo nome
      if (f._ataques) {
        const eqArmas = f.equipamento ? armasDaFicha(f.equipamento) : armasDaFicha(c.equipamento);
        f.ataques = [];
        for (const m of f._ataques.matchAll(/([^,(]+?) \(([^)]*)\)/g)) {
          const nomeA = m[1].trim(), det = m[2].split(',').map((x) => x.trim());
          const arma = ARMAS.find((w) => eqArmas.includes(w.id) && w.nome.toLowerCase() === nomeA.toLowerCase());
          if (arma) { f.ataques.push({ nome: nomeA, arma: arma.id, habilidade: arma.arma.pericia }); continue; }
          const base = c.ataques.find((a) => a.nome === nomeA);
          const pgr = (det[1] || '').match(/^(\d+)\/(\d+)\/(\d+)$/), dd = (det[3] || '').match(/^(\d+)d6(?:\s*([+−-])\s*(\d+))?/);
          if (!base || !pgr || !dd) { para(`Variantes, ${nomeF}: o ataque "${nomeA}" ilegível`); continue; }
          f.ataques.push({ ...base, classe: slug(det[0]), pgr: pgr.slice(1).map(Number),
            dado: `${dd[1]}d6${dd[3] ? `${dd[2] === '+' ? '+' : '-'}${dd[3]}` : ''}`,
            multiplicadorForca: /Força\s*×\s*(\d)/.test(det[3]) ? Number(det[3].match(/Força\s*×\s*(\d)/)[1]) : /Força/.test(det[3]) ? 1 : 0,
            tipoDano: ID_ELEM[slug(det[4] || '')] ?? slug(det[4] || ''), nivelPerfuracao: (det[5] || '').match(/^N(\d)/) ? Number(det[5].match(/^N(\d)/)[1]) : base.nivelPerfuracao });
        }
        delete f._ataques;
      }
      c.formas.push(f);
    }
  }
  // os elementos com as formas
  const formaDeElem = (k, id) => {
    if (!c.formas) return 'todas';
    const em = [c.formaPrincipal.id, ...c.formas.filter((f) => !f._elementos || f._elementos[k].includes(id)).map((f) => f.id)];
    return em.length === c.formas.length + 1 ? 'todas' : em;
  };
  c.elementos = { fraquezas: [], resistencias: [], imunidades: [] };
  for (const k of Object.keys(c.elementos)) {
    for (const id of elemP[k]) c.elementos[k].push({ tipo: id, formas: formaDeElem(k, id) });
    for (const f of c.formas || []) for (const id of f._elementos?.[k] || []) if (!elemP[k].includes(id) && !c.elementos[k].some((x) => x.tipo === id)) {
      c.elementos[k].push({ tipo: id, formas: c.formas.filter((g) => g._elementos?.[k].includes(id)).map((g) => g.id) });
    }
  }
  for (const f of c.formas || []) delete f._elementos;
  // cada forma guarda só o que muda (D-217): sai o que é igual ao da principal, chave por chave no objeto, inteiro na lista
  const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  for (const f of c.formas || []) for (const k of Object.keys(f)) {
    if (k === 'id' || k === 'nome') continue;
    if (igual(f[k], c[k])) { delete f[k]; continue; }
    if (f[k] && typeof f[k] === 'object' && !Array.isArray(f[k]) && c[k] && typeof c[k] === 'object' && !Array.isArray(c[k])) {
      for (const s of Object.keys(f[k])) if (igual(f[k][s], c[k][s])) delete f[k][s];
      if (!Object.keys(f[k]).length) delete f[k];
    }
  }

  // ----- a revisao (formato-criatura.md, seção 7): as duas marcas de dúvida (a do número sugerido e a da extrapolação) das tabelas e das notas
  const MARCA = /\*\*\[(provis[óo]rio|extrapolação)\]\*\*/;
  const marcaLinha = (sec, chave, r) => { const t = Object.values(r).slice(1).join(' | '); if (MARCA.test(t)) revisao.push({ campo: chave, motivo: semMarcas(Object.values(r).slice(-1)[0]).replace(/\*\*/g, '') }); };
  for (const r of T['Atributos'] || []) { const aid = idAtributo(semMarcas(Object.values(r)[0])); if (aid) marcaLinha('Atributos', `atributos.${aid}`, r); }
  for (const r of T['Habilidades'] || []) { const h = idHabilidade(semMarcas(Object.values(r)[0]).replace(/\s*\(.*\)\s*$/, '')) || { id: slug(semMarcas(Object.values(r)[0]).replace(/\s*\(.*\)\s*$/, '')), secundaria: true }; marcaLinha('Habilidades', `${h.secundaria ? 'habilidadesSec' : 'habilidades'}.${h.id}`, r); }
  const CORPO_CHAVE = { Altura: 'altura', Largura: 'largura', 'Comprimento total': 'comprimento', 'Comprimento sem a cauda': 'comprimentoSemCauda', Envergadura: 'envergadura', Massa: 'massa', Área: 'area' };
  for (const r of C) { const k = CORPO_CHAVE[Object.values(r)[0]]; if (k && k in corpo) marcaLinha('Corpo', `corpo.${k}`, r); }
  for (const r of VVA) { const k = { Aparência: 'aparencia', Vontade: 'vontade' }[Object.values(r)[0]]; if (k) marcaLinha('VVA', k, r); }
  const abs = MV.find((r) => Object.values(r)[0] === 'Absorção');
  if (abs && MARCA.test(Object.values(abs).join(' '))) revisao.push({ campo: 'couraca', motivo: semMarcas(Object.values(abs).slice(-1)[0]).replace(/\*\*/g, '') });
  for (const r of CO) { const k = { Social: 'social', Atividade: 'atividade', Dieta: 'dieta', 'Caça ou forrageio': 'caca', 'Diante de gente': 'dianteDeGente' }[Object.values(r)[0]]; if (k) marcaLinha('Comportamento', `comportamento.${k}`, r); }
  for (const r of T['Ataques'] || []) {
    const nome = semMarcas(r['Nome'] ?? r['Ataque'] ?? '');
    if (!nomesAtaques.has(nome) || !MARCA.test(r['Justificativa'] ?? '')) continue;
    const just = r['Justificativa'];
    // a marca na frase do Nível de Perfuração ("N0, como o lobo ... (mordida abaixo de 4.000 N)", seguida da marca de dúvida)
    const k = /\bN\d\b(?:[^.]|\.\d)*\*\*\[/.test(just) ? 'nivelPerfuracao' : null;
    revisao.push({ campo: k ? `ataques.${nome}.${k}` : `ataques.${nome}`, motivo: semMarcas(just).replace(/\*\*/g, '') });
  }
  for (const r of T['Variantes'] || []) {
    const f = (c.formas || []).find((x) => x.nome === Object.values(r)[0]);
    if (f && MARCA.test(Object.values(r)[2] || '')) revisao.push({ campo: `formas.${f.id}`, motivo: semMarcas(Object.values(r)[2]).replace(/\*\*/g, '') });
  }
  // as Notas de observação: "- `nome`, `nome`: texto", com a marca ou "a conferir", no campo que o nome diz
  const NOTA = { altura: 'corpo.altura', largura: 'corpo.largura', comprimento: 'corpo.comprimento', envergadura: 'corpo.envergadura',
    massa: corpo.semMassa ? 'corpo.volume' : 'corpo.massa', volume: 'corpo.volume', area: 'corpo.area', aparencia: 'aparencia', couraca: 'couraca', vontade: 'vontade' };
  for (const l of (S['Notas de observação'] || []).filter((x) => x.startsWith('- '))) {
    if (!MARCA.test(l) && !/a conferir/.test(l)) continue;
    const m = l.match(/^- ((?:`[^`]+`(?:,\s*|\s+e\s+)?)+):\s*(.*)$/);
    if (!m) continue;
    for (const nm of [...m[1].matchAll(/`([^`]+)`/g)].map((x) => x[1])) {
      const s = slug(nm), aid = idAtributo(nm.charAt(0).toUpperCase() + nm.slice(1)) ?? ({ forca: 'forca' }[s]);
      const fo = (c.formas || []).find((f) => slug(f.nome) === s || f.id === s);
      const he = c.habilidadesEspeciais.find((h) => slug(h.nome) === s);
      const se = c.sentidos.find((x) => slug(x.nome) === s);
      const cp = NOTA[s] ?? (aid ? `atributos.${aid}` : fo ? `formas.${fo.id}` : he ? `habilidadesEspeciais.${he.nome}` : se ? `sentidos.${se.nome}` : null);
      if (cp) revisao.push({ campo: cp, motivo: semMarcas(m[2]).replace(/\*\*/g, '') });
      else avisos.push(`Notas de observação: "${nm}" não nomeia um campo do formato; a nota não entra na revisao`);
    }
  }
  // uma entrada por campo; duas dúvidas no mesmo campo vão no mesmo motivo
  const rev = new Map();
  for (const x of revisao) rev.set(x.campo, rev.has(x.campo) ? `${rev.get(x.campo)}; ${x.motivo}` : x.motivo);
  c.revisao = [...rev].map(([campo, motivo]) => ({ campo, motivo }));
  // todo campo da revisao aponta para uma chave que existe (formato, seção 7)
  for (const { campo: cp } of c.revisao) if (!aponta(c, cp)) para(`revisao: o campo "${cp}" não aponta para nada`);
  // e o JSON passa no esquema novo, todo .strict() (scripts/criatura-schema.mjs, criaturaNovaSchema)
  if (!paradas.length) {
    const r = criaturaNovaSchema.safeParse(c);
    if (!r.success) for (const i of r.error.issues.slice(0, 5)) para(`esquema: ${i.path.join('.')}: ${i.message}`);
  }
  return { criatura: c, paradas, lacunas: [...new Set(lacunas)], avisos };
}

/** O caminho da revisao existe no JSON: objeto pelo nome da chave, forma pelo id, item de lista pelo `nome`. */
export function aponta(c, caminho) {
  let o = c;
  const partes = caminho.split('.');
  for (let i = 0; i < partes.length; i++) {
    const p = partes[i];
    if (o == null) return false;
    if (Array.isArray(o)) {
      // o nome do item pode ter ponto; junta as partes até achar
      let achou = null, j = i;
      for (; j < partes.length && !achou; j++) achou = o.find((x) => x.nome === partes.slice(i, j + 1).join('.') || x.id === partes.slice(i, j + 1).join('.'));
      if (!achou) return false;
      o = achou; i = j - 1;
    } else if (typeof o === 'object' && p in o) o = o[p];
    else return false;
  }
  return true;
}

// ----- a linha de comando
if (path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url))) {
  const [entrada, saida] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
  const iSite = process.argv.indexOf('--site');
  const SITE = iSite > 0 ? process.argv[iSite + 1] : path.join(RAIZ, 'src/data/bestiario');
  if (!entrada || !saida) { console.error('uso: node scripts/conversor-criatura.mjs <pasta das fichas> <pasta de saída> [--site <pasta>]'); process.exit(2); }
  fs.mkdirSync(saida, { recursive: true });
  const rel = [], contaParadas = {}, contaLacunas = {};
  let gravadas = 0;
  const arquivos = fs.readdirSync(entrada).filter((a) => a.endsWith('.md')).sort();
  for (const a of arquivos) {
    const id = a.slice(0, -3);
    const sp = path.join(SITE, `${id}.json`);
    const { criatura, paradas, lacunas, avisos } = converterFicha(fs.readFileSync(path.join(entrada, a), 'utf8'), { site: fs.existsSync(sp) ? JSON.parse(fs.readFileSync(sp, 'utf8')) : null });
    for (const p of paradas) { const k = p.replace(/"[^"]*"/g, '"…"').replace(/\d+([,.]\d+)?/g, 'N').replace(/^[^:]*?, [^:]*?: /, ''); contaParadas[k] = (contaParadas[k] || 0) + 1; }
    for (const l of lacunas) contaLacunas[l] = (contaLacunas[l] || 0) + 1;
    if (paradas.length || lacunas.length || avisos.length) rel.push(`${id}${paradas.length ? ' · PARADA' : ''}`, ...paradas.map((p) => `  parada: ${p}`), ...lacunas.map((l) => `  lacuna: ${l}`), ...avisos.map((v) => `  aviso: ${v}`));
    if (!paradas.length) { fs.writeFileSync(path.join(saida, `${id}.json`), JSON.stringify(criatura, null, 2) + '\n'); gravadas++; }
  }
  const resumo = [`${arquivos.length} fichas: ${gravadas} gravadas, ${arquivos.length - gravadas} com parada`, '', 'paradas, por tipo:',
    ...Object.entries(contaParadas).sort((x, y) => y[1] - x[1]).map(([k, n]) => `  ${n} · ${k}`), '', 'lacunas do formato, por tipo:',
    ...Object.entries(contaLacunas).sort((x, y) => y[1] - x[1]).map(([k, n]) => `  ${n} fichas · ${k}`), '', ...rel];
  fs.writeFileSync(path.join(saida, 'relatorio.txt'), resumo.join('\n') + '\n');
  console.log(resumo.slice(0, 40).join('\n'));
}
