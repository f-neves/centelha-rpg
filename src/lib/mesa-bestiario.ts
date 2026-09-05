// Ponte entre o bestiário e a mesa.
//
// Fica separado de `mesa-core.ts` de propósito: importar isto arrasta
// `monsters.json` (~900 KB) para o pacote da página. Só as abas Criaturas e
// Combate pagam esse preço; o Escudo, o Diário e as outras não.
// E o bestiário entra na versão MAGRA. `monsters.json` tem 709 KB minificados, e
// mais da metade disso é prosa: habilidades (27%), lore (24%), poderes,
// descrição, notas, conceito. Nada disso entra em conta nenhuma da mesa; é o
// texto do card, que o mestre abre para uma criatura de cada vez.
// `monsters-mesa.json` (gerado por gen-monsters.mjs) tem só o bloco de jogo:
// 271 KB minificados, 27 KB comprimidos, contra 171 KB comprimidos do inteiro.
// O card completo vem por `criaturaCompleta()`, um arquivo por criatura.
import monstersData from '../data/monsters-mesa.json';
import artesData from '../data/artes.json';
import { resumoCombatePC } from './combate-resumo';
import { esc, u, norm, fmtDano } from './mesa-core';
import { sparkSVG } from './centelha-spark';
import { d6 } from './rolagem';
import { qaDaPeca, type QACombate } from './quase-acerto';


export const MONSTROS = monstersData as any[];
export const MON: Record<string, any> = Object.fromEntries(MONSTROS.map((m) => [m.id, m]));
export const ARTE_NOME: Record<string, string> = Object.fromEntries((artesData as any[]).map((a) => [a.id, a.nome]));

/** Índice leve para busca e listagens (sem arrastar o objeto inteiro). */
export const MON_LIST = MONSTROS.map((m) => ({
  id: m.id, nome: m.nome, nomeIngles: m.nomeIngles || '', ameaca: m.ameaca,
  centelha: m.centelha, categoria: m.categoria || '', porte: m.porte || '',
  imagem: m.imagem || '', pv: m.combate?.pv ?? null, defesa: m.combate?.defesa ?? null,
  terreno: m.ecologia?.terreno || [], clima: m.ecologia?.clima || [],
  busca: norm(`${m.nome} ${m.nomeIngles || ''} ${m.categoria || ''}`),
}));

export const ECO_TERR: Record<string, string> = {
  Cold: 'Gélido', Desert: 'Deserto', Forest: 'Floresta', Jungle: 'Selva', Mountain: 'Montanha',
  Plains: 'Planície', Swamp: 'Pântano', Underground: 'Subterrâneo', Urban: 'Urbano',
  Water: 'Aquático', Coast: 'Litoral', Sky: 'Céu', Ruins: 'Ruínas', Any: 'Qualquer',
};
export const ECO_CLIMA: Record<string, string> = {
  Cold: 'Frio', Temperate: 'Temperado', Tropical: 'Tropical', Extraplanar: 'Extraplanar',
};

const ATR: [string, string][] = [
  ['forca', 'Força'], ['destreza', 'Destreza'], ['vigor', 'Vigor'],
  ['influencia', 'Influência'], ['perspicacia', 'Perspicácia'], ['compostura', 'Compostura'],
  ['percepcao', 'Percepção'], ['inteligencia', 'Inteligência'], ['raciocinio', 'Raciocínio'],
];
const AP_CURVA: Record<number, number> = { 1: -4, 2: -2, 3: -1, 4: 0, 5: 0, 6: 0, 7: 1, 8: 2, 9: 3, 10: 4 };
const apMod = (n: number) => (n > 10 ? 4 + (n - 10) : n < 1 ? -5 - (0 - n) : (AP_CURVA[n] ?? 0));
export const estrelas = (a: number) => '★'.repeat(a) + '☆'.repeat(Math.max(0, 6 - a));

/** Dado de iniciativa da criatura: 1d6 + o bônus escrito no bloco. */
export function iniDeMonstro(m: any): number {
  const s = m?.combate?.iniciativa || '';
  const mt = /([+-]?\s*\d+)\s*$/.exec(String(s).replace(/\dd6/, ''));
  const bonus = mt ? parseInt(mt[1].replace(/\s/g, ''), 10) : 0;
  return d6() + (isNaN(bonus) ? 0 : bonus);
}
// O dado mora em `rolagem.ts` agora, com o resto do acaso do combate. Fica
// reexportado porque meia dúzia de telas o importam daqui.
export { d6 };

export interface ResumoCombate {
  arma: string; ataque: string; dano: string; defesa: number | null;
  defesaSocial?: number | null; defesaMental?: number | null;
  soak: { impacto: number; corte: number; perfuracao: number };
  resistPerf: number; velocidade?: number | null;
  /**
   * A classe de tempo do ataque (leve · media · pesada · haste · distancia ·
   * arremesso · arte), estimada pelo `gen-monsters.mjs` para criatura. O PC não
   * a carrega: a dele sai da arma do catálogo, pelo id. Nula, a mesa cai no
   * atalho pela Velocidade, como sempre caiu.
   */
  classe?: string | null;
  /**
   * As três velocidades em metros por Tick. Do PC saem da ficha (mesma régua
   * que ela desenha); da criatura, do bloco `combate.deslocamento` que o
   * `gen-deslocamento.mjs` semeia a partir da velocidade original dela. Sem
   * isso o Grid oferecia 3 m/Tick para todo mundo, do caramujo ao guepardo.
   */
  passo?: { batalha: number; arranque: number; corrida: number } | null;
  /**
   * O P/G/R escrito à mão pelo mestre, quando ele discorda da régua. Só existe
   * como ajuste por instância: a régua continua sendo a do catálogo.
   */
  pgr?: { preparo?: number; golpes?: number; recuperacao?: number } | null;
  qa?: QACombate;
  /**
   * OS SENTIDOS, e este bloco é de 04/09/2026, para o golpe vindo do escuro.
   *
   * A régua compara a Furtividade de quem ataca com a Percepção Passiva do
   * alvo (`coracao-do-sistema.md:59`), e o `ResumoCombate` não tinha nenhuma
   * das duas: **ele foi montado para o golpe**, então carrega os derivados de
   * combate e nenhuma perícia por nome.
   *
   * OS DOIS LADOS VÊM DE LUGARES DIFERENTES e chegam aqui iguais, que é o que
   * este contrato existe para fazer: do PC saem da ficha, que tem as perícias;
   * da criatura saem do bloco `pericias` que o `gen-bestiario.mjs` passou a
   * emitir (quatro pela conta invertida dos derivados e a Furtividade pela
   * tabela `regras.furtividadeCriatura`).
   *
   * `null` em qualquer um dos dois quer dizer "não dá para saber daqui", e não
   * "zero". Quem compara tem de tratar o nulo como recusa a responder, senão
   * uma peça sem dado vira uma peça surda.
   *
   * A FURTIVIDADE VEM PARTIDA em atributo e perícia, e não como pool pronto, de
   * propósito: montar o pool é regra (quantos dados por ponto, o +2 do ímpar) e
   * ela mora no motor, não neste resumo. Aqui é só o que a peça tem.
   */
  /**
   * OS NOVE ATRIBUTOS CRUS E AS PERÍCIAS, e esta é a passada do L35, decidida em
   * 04/09/2026: **o resumo da PEÇA, e não o resumo do golpe.**
   *
   * O modelo tinha sido montado para o golpe, então carregava só derivados de
   * combate. Em uma semana três regras diferentes esbarraram no mesmo buraco (o
   * bestiário sem perícia, o resumo sem os sentidos, o resumo sem atributo), e
   * cada vez alguém parava e escalava. **Carregar nove números que às vezes não
   * são usados custa menos que parar a cada regra nova.**
   *
   * NÃO ENTREGA NADA NOVO AO JOGADOR, e isso foi conferido antes de escrever: o
   * resumo não viaja, ele é MONTADO no navegador a partir de
   * `monsters-mesa.json`, que é import estático do Grid e já carrega os nove
   * atributos das 309 desde antes. A distinção que sustenta isso é entre
   * ESPÉCIE e INSTÂNCIA: o bestiário é livro publicado, e o que a `combate_visao`
   * esconde é a Vida DAQUELE ogro agora, os ajustes do mestre e a intenção da
   * ação. Nada disso passa por aqui.
   *
   * NULO É "NÃO DÁ PARA SABER DAQUI", e nunca zero. A peça `custom`, digitada na
   * mesa, não tem bloco no bestiário e a `combate_visao` não expõe coluna de
   * atributo nenhuma: para ela os dois saem nulos, e a ausência é informação. É a
   * mesma regra que fez 24 criaturas saírem SEM Furtividade em vez de com
   * Furtividade errada.
   *
   * A CONTA NÃO SE FAZ AQUI. Isto é o que a peça tem; a fórmula é do motor
   * (`valorPassivo`, em `calc.ts`). Um resumo que já traz a Passiva pronta volta
   * a ser um bloco por assunto, e foi disso que esta passada saiu.
   */
  atributos?: Record<string, number> | null;
  pericias?: Record<string, number> | null;
}


/**
 * O bloco VAZIO, com cada campo no estado que o diz vazio.
 *
 * Repare no `defesa: null` ao lado do `soak: 0`: os dois são "não preenchido",
 * mas só um deles pode ser zero de verdade. Absorção zero é um valor legítimo
 * (o camponês de camisa), então zero ali é a resposta certa. Defesa zero não
 * existe em ninguém que esteja de pé, então zero ali seria uma mentira que a
 * tela somaria sem piscar. Nulo é a única coisa que a folha consegue distinguir
 * de um número, e é o que faz o veredito sair nulo em vez de sair errado.
 */
const resumoVazio = (): ResumoCombate => ({
  arma: '', ataque: '', dano: '',
  defesa: null, defesaSocial: null, defesaMental: null,
  soak: { impacto: 0, corte: 0, perfuracao: 0 },
  resistPerf: 0, velocidade: null, classe: null, passo: null,
  qa: qaDaPeca('', '', null),
  // A peça de cena não sabe nada de si, e os dois são NULO e não `{}`, pela mesma
  // razão do `defesa: null` acima: um objeto vazio se leria como "tem atributos,
  // todos zero", e o que se sabe dela é que ninguém preencheu.
  atributos: null, pericias: null,
});

/** Bloco de combate de origem: da ficha (PC) ou do bestiário (criatura). */
export function baseResumo(c: any, fichaPorId: Record<string, any> = {}): ResumoCombate | null {
  // A PEÇA DE CENA (`custom`), e ela não tem bloco de origem NENHUM: nem ficha
  // nem verbete, porque foi digitada na mesa. Tudo o que ela sabe de si mora em
  // `combatentes.dados`, que o `resumoDe` mescla por cima daqui.
  //
  // O DEFEITO QUE ISTO CONSERTA, e ele fechava a saída de emergência bem onde
  // ela era necessária. Antes não havia este ramo: `custom` caía no `return
  // null` do fim, e uma peça sem `dados` (o "+ NPC" preenchido só com nome e
  // Vida, ou a linha em branco da aba Combate) ficava com `RESUMO[id] === null`.
  // Aí, na ficha do lance, `objDe('alvo')` devolvia `null` e o
  // `escreveCaminho` saía pela primeira linha sem escrever nada: **o mestre
  // digitava a Defesa do sujeito no campo e o número não ia a lugar nenhum**. O
  // campo aceitava a tecla, repintava, e a folha continuava sem Defesa.
  //
  // Com um bloco vazio no lugar de `null`, a peça sempre tem onde receber o que
  // o mestre escreve, e a peça digitada na mesa passa a se conserta na mesa.
  //
  // O `monstro_id` de uma peça `custom` NÃO entra aqui, e é de propósito: no
  // formulário ele é o campo **Retrato**, e serve só para dar cara ao token.
  // Quem escolhe a arte do ogro para o capanga não está dizendo que o capanga
  // tem a Defesa do ogro, e ler o verbete daí encheria a ficha de números que
  // ninguém pediu.
  if (c.tipo === 'custom') return resumoVazio();
  if (c.tipo === 'pc' && fichaPorId[c.personagem_id]) {
    try {
      const r = resumoCombatePC(fichaPorId[c.personagem_id]) as any;
      return { ...r, velocidade: null };
    } catch { return null; }
  }
  if (c.tipo === 'criatura') {
    const cb = MON[c.monstro_id]?.combate || {};
    const a0 = (cb.ataques || [])[0];
    const ab = cb.absorcao;
    return {
      arma: a0?.nome || '', ataque: a0?.pool || '', dano: a0 ? fmtDano(a0.dano) : '',
      defesa: cb.defesa ?? null, defesaSocial: cb.defesaSocial ?? null, defesaMental: cb.defesaMental ?? null,
      soak: ab ? { impacto: ab.impacto || 0, corte: ab.corte || 0, perfuracao: ab.perfuracao || 0 }
                : { impacto: 0, corte: 0, perfuracao: 0 },
      resistPerf: cb.resistenciaPerfuracao || 0,
      velocidade: a0?.speed ?? null,
      classe: a0?.classe ?? null,
      passo: cb.deslocamento || null,
      // A criatura não tem armadura vestida (ver `QACombate`): só a metade da
      // arma sai preenchida. O dano médio dela vem da própria expressão de dano,
      // porque ali a expressão É a arma.
      qa: qaDaPeca(a0?.nome || '', a0 ? fmtDano(a0.dano) : '', null),
      // A ESPÉCIE inteira, como o verbete a publica. O `?? null` em vez de `|| {}`
      // é a regra da omissão: uma criatura sem bloco devolve nulo, e não um
      // objeto vazio que se leria como "tem atributos, todos zero".
      atributos: MON[c.monstro_id]?.atributos ?? null,
      pericias: MON[c.monstro_id]?.pericias ?? null,
    };
  }
  return null;
}

/**
 * Mescla o bloco de origem com os ajustes por instância que o mestre salvou em
 * `combatentes.dados`. O ajuste sempre vence: é ele que diz "este ogro aqui é o
 * chefe e tem 4 a mais de Absorção".
 */
export function resumoDe(c: any, fichaPorId: Record<string, any> = {}): ResumoCombate | null {
  const base = baseResumo(c, fichaPorId);
  const ov = (c.dados && typeof c.dados === 'object') ? c.dados : {};
  if (!base && !Object.keys(ov).length) return null;
  const bs = base?.soak || ({} as any); const os = ov.soak || {};
  return {
    arma: ov.arma ?? base?.arma ?? '',
    ataque: ov.ataque ?? base?.ataque ?? '',
    dano: ov.dano ?? base?.dano ?? '',
    defesa: ov.defesa ?? base?.defesa ?? null,
    defesaSocial: ov.defesaSocial ?? base?.defesaSocial ?? null,
    defesaMental: ov.defesaMental ?? base?.defesaMental ?? null,
    soak: {
      impacto: os.impacto ?? bs.impacto ?? 0,
      corte: os.corte ?? bs.corte ?? 0,
      perfuracao: os.perfuracao ?? bs.perfuracao ?? 0,
    },
    resistPerf: ov.resistPerf ?? base?.resistPerf ?? 0,
    velocidade: ov.velocidade ?? base?.velocidade ?? null,
    classe: ov.classe ?? base?.classe ?? null,
    // O passo se mescla CAMPO A CAMPO: o mestre pode fixar só a corrida do
    // lobo ferido e deixar o resto na régua.
    passo: (base?.passo || ov.passo)
      ? { ...(base?.passo || {}), ...(ov.passo || {}) } as any : null,
    pgr: ov.pgr ?? null,
    // O QUASE-ACERTO SEGUE A ARMA que o ajuste escolheu. Trocar a arma do goblin
    // por um martelo e deixar o raspão da adaga seria a mesma incoerência que o
    // `ataque` e o `dano` já evitam vindo do mesmo lugar. E `dados.qa` continua
    // podendo escrever por cima dos quatro números, um a um, que é como o
    // cavaleiro de placa construído como criatura se conserta.
    //
    // A METADE DO COURO VEM DA BASE quando o ajuste não traz armadura, e essa
    // linha é um conserto de 02/09. A versão anterior passava sempre
    // `ov.armaduras ?? null`, o que jogava fora a armadura que o
    // `resumoCombatePC` já tinha resolvido da ficha: um PC de malha entrava no
    // Grid com Margem e raspão de alvo DESPROTEGIDO. O defeito não aparecia em
    // teste porque as duas metades do Quase-Acerto nascem zero e zero é um
    // número plausível.
    //
    // A ordem importa e é esta: a arma manda (segue o ajuste), a armadura da
    // base entra só onde o ajuste calou, e o `ov.qa` escreve por cima dos dois.
    // Assim o ajuste por instância continua funcionando POR CIMA, e não por
    // baixo.
    qa: (() => {
      const daArma = qaDaPeca(ov.arma ?? base?.arma, ov.dano ?? base?.dano,
        (ov.armaduras ?? null) as any);
      const daBase = ov.armaduras ? null : (base?.qa || null);
      return {
        ...daArma,
        ...(daBase ? {
          armaduraBonus: daBase.armaduraBonus,
          armaduraReducao: daBase.armaduraReducao,
          armaduraClasses: daBase.armaduraClasses,
        } : {}),
        ...(ov.qa || {}),
      };
    })(),
  };
}

/**
 * A criatura INTEIRA, com a prosa que a versão magra não carrega.
 *
 * Busca `/dados/criatura/<id>.json` (arquivo estático gerado no build) e guarda
 * o que veio: abrir o card do mesmo goblin dez vezes numa sessão custa uma ida à
 * rede. Falhando a busca, devolve o que a mesa já tem, e o card sai sem o texto
 * em vez de não sair.
 */
const CACHE_CRIATURA = new Map<string, any>();
export async function criaturaCompleta(id: string): Promise<any> {
  if (!id) return null;
  if (CACHE_CRIATURA.has(id)) return CACHE_CRIATURA.get(id);
  const base = MON[id] || null;
  try {
    const r = await fetch(u(`dados/criatura/${encodeURIComponent(id)}.json`));
    if (r.ok) {
      const cheia = await r.json();
      CACHE_CRIATURA.set(id, cheia);
      return cheia;
    }
  } catch {}
  // Não guarda a falha: a próxima tentativa pode dar certo (rede que voltou).
  return base;
}

/** Card completo da criatura, o mesmo do bestiário. Serve ao modal das três abas. */
export function cardCriaturaHTML(m: any): string {
  const cb = m.combate || {};
  const en = m.nomeIngles && m.nomeIngles.toLowerCase() !== m.nome.toLowerCase()
    ? ` <span class="besta-nome-en">(${esc(m.nomeIngles)})</span>` : '';
  const arte = m.imagem
    ? `<figure class="arte"><img src="${u(m.imagem)}" alt="${esc(m.nome)}" /><span class="arte-ameaca" title="Ameaça ${m.ameaca}/6">${estrelas(m.ameaca)}</span>${m.centelha > 0 ? `<span class="arte-cent">${sparkSVG(true)} ${m.centelha}</span>` : ''}</figure>`
    : `<figure class="arte sem-arte"><span class="capitular cinzel">${esc((m.nome || '?').trim()[0])}</span><span class="arte-ameaca">${estrelas(m.ameaca)}</span></figure>`;
  const badges = `${m.categoria ? `<span class="badge cat">${esc(m.categoria)}</span>` : ''}${(m.ecologia?.terreno || []).map((t: string) => `<span class="badge terr">${esc(ECO_TERR[t] || t)}</span>`).join('')}${(m.ecologia?.clima || []).map((c: string) => `<span class="badge clima">${esc(ECO_CLIMA[c] || c)}</span>`).join('')}`;
  const porte = m.porte ? `<p class="besta-porte"><span class="pt-lbl">Porte</span><span class="pt-cat">${esc(m.porte)}</span><span class="pt-sep">·</span>${esc(m.dimensoes?.medida || '')}<span class="pt-sep">·</span>${esc(m.dimensoes?.peso || '')}</p>` : '';
  const abs = cb.absorcao ? `${cb.absorcao.impacto}/${cb.absorcao.corte}/${cb.absorcao.perfuracao}${cb.resistenciaPerfuracao ? `·N${cb.resistenciaPerfuracao}` : ''}` : '-';
  const stat = (dt: string, dd: any) => `<div><dt>${dt}</dt><dd>${dd ?? '-'}</dd></div>`;
  const stats = `<dl class="besta-stats">${stat('PV', cb.pv)}${stat('Defesa', cb.defesa)}${stat('Def. Social', cb.defesaSocial)}${stat('Def. Mental', cb.defesaMental)}${stat('Absorção', abs)}${stat('Iniciativa', esc(cb.iniciativa || '-'))}</dl>`;
  const atrib = m.atributos ? `<div class="besta-atrib"><span class="atr-lbl">Atributos</span><div class="atr-grid">${ATR.map(([k, full]) => `<span class="atr"><span class="atr-nm">${full}</span><span class="atr-v">${m.atributos[k] ?? 0}</span></span>`).join('')}</div></div>` : '';
  const tracos = m.virtudes ? `<div class="besta-tracos"><div class="tr-linha"><span class="tr"><span class="tr-nm">Vontade</span><span class="tr-v">${m.vontade ?? '-'}</span></span><span class="tr"><span class="tr-nm">Aparência</span><span class="tr-v">${m.aparencia ?? '-'} <small class="tr-mod">(${apMod(m.aparencia) >= 0 ? '+' : ''}${apMod(m.aparencia)})</small></span></span></div><div class="tr-virt"><span class="tr-nm">Virtudes</span><span class="tr-vv">Comp ${m.virtudes.compaixao} · Conv ${m.virtudes.conviccao} · Temp ${m.virtudes.temperanca} · Val ${m.virtudes.valor}</span></div></div>` : '';
  const elem = (m.fraquezas?.length || m.resistencias?.length)
    ? `<div class="besta-elem">${(m.fraquezas || []).map((f: string) => `<span class="el el-fraco" title="Fraqueza">▼ ${esc(f)}</span>`).join('')}${(m.resistencias || []).map((r: string) => `<span class="el el-forte" title="Resistência">▲ ${esc(r)}</span>`).join('')}</div>` : '';
  const atk = (cb.ataques || []).length ? `<ul class="besta-atk">${cb.ataques.map((a: any) => `<li><span class="atk-nome">${esc(a.nome)}</span><span class="atk-rolls">Ataque: <b>${esc(a.pool)}</b> · Dano <b>${fmtDano(esc(a.dano))}</b> · Velocidade ${a.speed}</span>${a.notas ? `<span class="atk-nota muted">${esc(a.notas)}</span>` : ''}</li>`).join('')}</ul>` : '';
  const habs = (m.habilidades || []).length ? `<h4 class="cc-h">Habilidades</h4><ul class="ib-hab">${m.habilidades.map((h: any) => `<li><b>${esc(h.nome)}</b> ${esc(h.descricao)}</li>`).join('')}</ul>` : '';
  const pods = (m.poderes || []).length ? `<h4 class="cc-h">Poderes <span class="muted">(sistema)</span></h4><ul class="ib-pod">${m.poderes.map((p: any) => `<li><span class="pw-ef">${esc(p.efeito)}</span> → <span class="pw-alvo">${esc(p.alvo)}</span></li>`).join('')}</ul>` : '';
  // A TÉCNICA JÁ VEM RESOLVIDA (`{ id, nome, caminho }`), do `gen-monsters.mjs`
  // e do endpoint por criatura. Antes esta linha era o único uso do
  // `tecnicas.json` neste módulo, e por causa dela 179 KB de catálogo (26,3 KB
  // gzipados) viajavam para toda aba da mesa, o Grid inclusive, para responder
  // 630 bytes de par (nome, caminho) em 24 das 309 criaturas.
  //
  // A forma antiga (id solto) continua aceita: um card guardado no cache do
  // navegador antes desta mudança ainda abre, e abre com o nome cru em vez de
  // quebrar. É a diferença entre degradar e falhar.
  const refTec = (m.tecnicas || []).length ? `<p class="ib-ref"><b>Técnicas:</b> ${
    m.tecnicas.map((t: any) => {
      const id = typeof t === 'string' ? t : t?.id;
      const nome = typeof t === 'string' ? t : (t?.nome || id);
      const cam = typeof t === 'string' ? '' : (t?.caminho || '');
      return `<a href="${u('caminhos/' + cam)}#${id}">${esc(nome)}</a>`;
    }).join(' · ')}</p>` : '';
  const refArte = (m.artes || []).length ? `<p class="ib-ref"><b>Artes:</b> ${m.artes.map((a: any) => `<a href="${u('arcano')}#${a.id}">${esc(ARTE_NOME[a.id] || a.id)}</a> ${a.nivel}`).join(' · ')}</p>` : '';
  const refs = (refTec || refArte) ? `<h4 class="cc-h">Técnicas &amp; Artes</h4>${refTec}${refArte}` : '';
  const notas = m.notas ? `<h4 class="cc-h">Notas</h4><p class="ib-notas">${esc(m.notas)}</p>` : '';
  const lore = (m.lore || []).length ? `<h4 class="cc-h">Informações</h4>${m.lore.map((s: any) => `<div class="ib-lore"><h5>${esc(s.titulo)}</h5><p>${esc(s.texto)}</p></div>`).join('')}` : '';
  return `<article class="besta cc-besta">${arte}<div class="besta-corpo">
    <header class="besta-head"><span class="besta-nome cinzel">${esc(m.nome)}${en}</span></header>
    ${badges ? `<div class="besta-badges">${badges}</div>` : ''}
    ${porte}${m.descricao ? `<p class="besta-con muted">${esc(m.descricao)}</p>` : ''}
    ${stats}${elem}${atrib}${tracos}${atk}${habs}${pods}${refs}${notas}${lore}
  </div></article>`;
}
