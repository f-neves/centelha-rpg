// test-artes-grid.mjs — regressão do motor das Artes no tabuleiro.
//
// Empacota `src/lib/artes-grid.ts` com o esbuild (que já vem com o Astro) porque
// o módulo importa JSON, e o Node cru não faz isso sem cerimônia. O que se testa
// aqui é só matemática: custo, régua de duração, geometria e a ordem em que
// armadura, resistência e absorção natural mordem o dano.
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `artes-grid-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/artes-grid.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
});
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };
const eq = (a, b, msg) => ok(a === b, `${msg} — esperado ${b}, veio ${a}`);

// ---------------------------------------------------------------- a régua
//
// Os degraus ficam presos aqui porque o tabuleiro os tornou visíveis: a régua
// antiga punha 15 m no nível 3 e uma hora no nível 6, e no grid isso aparecia
// como um feitiço barato varrendo o mapa inteiro por mais tempo que a cena.
const escadaDe = (nome, n = 6) => {
  const p = { nome, tipo: 'padrao', ...(nome === 'Duração' ? { regua: 'breve' } : {}) };
  return Array.from({ length: n }, (_, i) => M.valorNoNivel(p, i + 1));
};
eq(escadaDe('Alcance').join(' · '), 'toque · 2 m · 4 m · 10 m · 20 m · 50 m',
  'a régua de Alcance');
eq(escadaDe('Área').join(' · '), '0,5 × 0,5 m · 1 × 1 m · 1,5 × 1,5 m · 2 × 2 m · 3 × 3 m · 5 × 5 m',
  'a régua de Área');
eq(escadaDe('Alvos').join(' · '), '1 · 2 · 3 · 4 · 6 · 10', 'a régua de Alvos');
// A área do topo é um círculo de menos de três metros de raio: cabe no mapa.
ok(M.raioDoCirculo(M.areaEmM2({ nome: 'Área', tipo: 'padrao' }, 6)) < 3,
  'a maior área comprável ainda cabe num tabuleiro de mesa');
// E a menor não é inflada pelo piso de quem não compra tamanho nenhum.
eq(M.areaEmM2({ nome: 'Área', tipo: 'padrao' }, 1), 0.25, 'Área 1 é um quarto de metro quadrado');
ok(M.figuraDaArea({ molde: 'circulo', areaM2: 0.25, ancora: M.encaixeNoCentro({ q: 0, r: 0 }, 1) }).raioM < 0.3,
  'o nível 1 de Área continua menor que uma pessoa');

eq(M.turnosDeDuracao(1), 1, 'Duração 1 = 1 turno');
eq(M.turnosDeDuracao(2), 2, 'Duração 2 = 2 turnos');
eq(M.turnosDeDuracao(3), 4, 'Duração 3 = 4 turnos');
eq(M.turnosDeDuracao(6), 50, 'o topo da régua breve são 50 turnos, e não mais uma hora');
eq(M.TICKS_POR_TURNO, 6, 'um turno são 6 ticks');
eq(M.turnosDeDuracao(6) * M.TICKS_POR_TURNO, 300, 'a régua breve inteira cabe em 300 ticks');
// A régua breve acaba onde a longa começa, sem sobreposição: 50 turnos são cinco
// minutos, e o primeiro degrau da longa são dez.
ok(M.turnosDeDuracao(6, 'breve') < M.turnosDeDuracao(1, 'longa'),
  'a régua breve termina antes de a longa começar');
eq(M.rotuloDuracao(300), 'a cena toda', 'acima de 50 turnos o número não diz nada');

// ------------------------------------------------- o exemplo da mesa: a Aura
// Aura de Fogo com Volume 3 (3 m de raio), Dano 2 (2d6) e Duração 2 (2 turnos).
const aura = M.EFEITO['aura'];
const fogo = M.ARTE['fogo'];
ok(!!aura && !!fogo, 'Aura e Fogo existem');
eq(aura.grid.forma, 'aura', 'Aura ocupa espaço como aura');
eq(aura.grid.ancora, 'conjurador', 'a Aura nasce presa a quem conjurou');
eq(aura.grid.gatilho, 'ao-entrar', 'a Aura morde quem entra');
eq(aura.grid.materia, null, 'a Aura não deixa matéria: a armadura não pega');

const pVol = aura.parametros.find((p) => p.nome === 'Volume');
const pDano = aura.parametros.find((p) => p.nome === 'Dano');
eq(M.valorNoNivel(pVol, 3), '3 m', 'Volume 3 = 3 m de raio');
eq(M.dadosDeDano(pDano, 2, fogo), 2, 'Dano 2 em Fogo = 2d6');

// Custo: Efeito 2 + Volume 3 + Dano 2 + Duração 2 = 9 pontos.
const c = M.custoDe(aura, fogo, 3, { Volume: 3, Dano: 2, 'Duração': 2 }, 3);
eq(c.base, 2, 'a Aura é Efeito de nível 2');
eq(c.parametros, 7, 'Volume 3 + Dano 2 + Duração 2 = 7');
eq(c.total, 9, 'total de 9 pontos');
eq(c.mana, 6, 'com Centelha 3 sobram 6 de Mana');
eq(c.esticados.length, 0, 'nada esticado com Fogo 3');

// Esticar: com Fogo 2, o Volume 3 fica um nível acima e custa 3 × 2.
const c2 = M.custoDe(aura, fogo, 2, { Volume: 3, Dano: 2, 'Duração': 2 }, 3);
eq(c2.parametros, 10, 'Volume esticado custa 6 no lugar de 3');
eq(c2.esticados.length, 1, 'um parâmetro esticado');
eq(c2.ticks, 4 + 2 + 1, 'esticar soma um tick');

// Grátis quando cabe na Centelha.
eq(M.custoDe(null, fogo, 3, { Alcance: 1, Dano: 1 }, 3).mana, 0, 'até a Centelha, sai de graça');

// --------------------------------------------------------------- Terra dobra
const terra = M.ARTE['terra'];
eq(terra.grid.dadoPorNivel, 2, 'Terra dobra o dado');
eq(M.dadosDeDano({ nome: 'Dano', tipo: 'padrao' }, 2, terra), 4, 'Dano 2 em Terra = 4d6');
eq(M.dadosDeDano({ nome: 'Dano', tipo: 'padrao' }, 2, fogo), 2, 'Dano 2 em Fogo = 2d6');

// Arma Elemental soma dano liso, e não dados.
const armaEl = M.EFEITO['arma-elemental'];
const pAE = armaEl.parametros.find((p) => p.nome === 'Dano');
eq(M.bonusPlano(pAE, 2), 4, 'Arma Elemental nível 2 = +4 de dano');
eq(armaEl.grid.gatilho, 'ao-tocar', 'a Arma Elemental morde no golpe');
eq(armaEl.grid.ancora, 'objeto', 'a Arma Elemental pega uma peça, não o corpo');

// Metal Incandescente: escala própria, e a Duração dele já é em turnos.
const metal = M.EFEITO['metal-incandescente'];
const pMD = metal.parametros.find((p) => p.nome === 'Dano');
eq(M.dadosDeDano(pMD, 4, fogo), 2, 'Metal Incandescente 4 = 2d6, pela escala do próprio Efeito');
ok(metal.grid.pegaItem, 'Metal Incandescente marca uma peça de metal');
ok(!M.EFEITO['aura'].grid.pegaItem, 'a Aura não pega peça nenhuma');

// ------------------------------------------------------------- a geometria
// A figura é UMA forma geométrica em metros, e não um punhado de hexágonos que
// a aproximam. Quem está dentro sai de um teste de ponto na forma.
const ANC = (q, r, escala = 1) => M.encaixeNoCentro({ q, r }, escala);
const CENTRO = ANC(0, 0);

// CÍRCULO: a área comprada vira raio, e o teste é a distância.
const circ = M.figuraDaArea({ molde: 'circulo', areaM2: 28.27, ancora: CENTRO });
eq(circ.tipo, 'circulo', 'o molde círculo vira uma figura de círculo');
ok(Math.abs(circ.raioM - 3) < 0.01, `28,27 m² viram raio 3 (${circ.raioM.toFixed(2)})`);
ok(M.pontoNaFigura(circ, { x: 2.9, y: 0 }), 'a 2,9 m está dentro');
ok(!M.pontoNaFigura(circ, { x: 3.1, y: 0 }), 'a 3,1 m está fora');
ok(M.pontoNaFigura(circ, { x: 2.1, y: 2.1 }), 'na diagonal, dentro do raio, está dentro');
ok(!M.pontoNaFigura(circ, { x: 2.2, y: 2.2 }), 'e passando do raio, fora — é redondo, não quadrado');

// LINHA: faixa de 1 m, ancorada na PONTA e girada pela direção.
const lin = M.figuraDaArea({ molde: 'linha', areaM2: 12, ancora: CENTRO, dir: 0 });
eq(lin.larguraM, 1, 'a faixa tem um metro de largura');
eq(lin.comprimentoM, 12, '12 m² de área viram 12 m de faixa');
ok(M.pontoNaFigura(lin, { x: 6, y: 0.4 }), 'no meio da faixa, dentro');
ok(!M.pontoNaFigura(lin, { x: 6, y: 0.6 }), 'meio metro para o lado já é fora');
ok(!M.pontoNaFigura(lin, { x: -0.5, y: 0 }), 'atrás da ponta é fora: a âncora é o começo');
ok(!M.pontoNaFigura(lin, { x: 12.5, y: 0 }), 'depois do fim é fora');
// Girada 90°, a mesma faixa desce em vez de ir para a direita.
const linV = M.figuraDaArea({ molde: 'linha', areaM2: 12, ancora: CENTRO, dir: Math.PI / 2 });
ok(M.pontoNaFigura(linV, { x: 0, y: 6 }), 'girada 90°, a faixa desce');
ok(!M.pontoNaFigura(linV, { x: 6, y: 0 }), 'e deixa de pegar quem estava na horizontal');
// A angulação é contínua: 20° existe, e não só os seis ângulos do hexágono.
const lin20 = M.figuraDaArea({ molde: 'linha', areaM2: 12, ancora: CENTRO, dir: 20 * Math.PI / 180 });
ok(M.pontoNaFigura(lin20, { x: 6 * Math.cos(0.349), y: 6 * Math.sin(0.349) }), 'a faixa sai a 20°');

// RETÂNGULO: a pessoa escolhe um lado, o outro sai da divisão da área.
const ret = M.figuraDaArea({ molde: 'retangulo', areaM2: 24, ancora: CENTRO, dir: 0, ladoM: 4 });
eq(ret.larguraM, 4, 'o lado escolhido é respeitado');
eq(ret.comprimentoM, 6, 'o outro lado sai da área (24 / 4 = 6)');
ok(M.pontoNaFigura(ret, { x: 3, y: 1.9 }), 'dentro do retângulo');
ok(!M.pontoNaFigura(ret, { x: 3, y: 2.1 }), 'passando da metade da largura, fora');
// O lado mínimo é um metro, e pedir menos não encolhe o retângulo em nada.
eq(M.figuraDaArea({ molde: 'retangulo', areaM2: 24, ancora: CENTRO, ladoM: 0.2 }).larguraM,
  M.LADO_MINIMO, 'o lado mínimo é de um metro');

// LEQUE: ângulo e raio, com a área como orçamento.
const leq = M.figuraDaArea({ molde: 'leque', areaM2: 24, ancora: CENTRO, dir: 0, aberturaGraus: 90 });
eq(leq.aberturaGraus, 90, 'a abertura escolhida é respeitada');
ok(Math.abs((Math.PI / 4) * leq.raioM ** 2 - 24) < 1e-6, 'o setor devolve a área comprada');
ok(M.pontoNaFigura(leq, { x: 3, y: 0 }), 'na direção, dentro');
ok(!M.pontoNaFigura(leq, { x: -3, y: 0 }), 'atrás, fora');
ok(!M.pontoNaFigura(leq, { x: 0, y: 5 }), 'a 90° do eixo, fora do leque de 90°');
// Abrir mais encurta o alcance, porque a área não muda.
ok(M.figuraDaArea({ molde: 'leque', areaM2: 24, ancora: CENTRO, aberturaGraus: 45 }).raioM
  > M.figuraDaArea({ molde: 'leque', areaM2: 24, ancora: CENTRO, aberturaGraus: 180 }).raioM,
  'abrir menos alcança mais longe');

// A ÂNCORA PODE SER UM VÉRTICE, e não só o centro da casa.
const enc = M.encaixesDoHex({ q: 0, r: 0 }, 1);
eq(enc.length, 7, 'cada casa tem sete encaixes: o centro e seis vértices');
eq(enc.filter((e) => e.tipo === 'vertice').length, 6, 'seis deles são vértices');
const R = M.raioEmMetros(1);
ok(enc.filter((e) => e.tipo === 'vertice')
  .every((e) => Math.abs(Math.hypot(e.x, e.y) - R) < 1e-9),
  'os vértices ficam todos no circunraio da casa');
// O ponteiro bem no meio da casa encaixa no centro; perto da ponta, no vértice.
eq(M.encaixeMaisProximo({ x: 0.05, y: 0.05 }, { q: 0, r: 0 }, 1).tipo, 'centro',
  'no miolo da casa, encaixa no centro');
eq(M.encaixeMaisProximo({ x: 0, y: -R * 0.95 }, { q: 0, r: 0 }, 1).tipo, 'vertice',
  'junto da ponta, encaixa no vértice');
// E a figura nasce mesmo ali: um círculo ancorado no vértice de cima tem o miolo
// meio circunraio acima do centro da casa.
const noVertice = M.figuraDaArea({
  molde: 'circulo', areaM2: 12,
  ancora: M.encaixeMaisProximo({ x: 0, y: -R * 0.95 }, { q: 0, r: 0 }, 1),
});
ok(Math.abs(noVertice.ay + R) < 1e-9, 'a figura ancora no vértice, e não no centro da casa');

// A lista de casas continua saindo da figura, para o registro.
const casas = M.hexesDaFigura(
  M.figuraDaArea({ molde: 'circulo', areaM2: 28.27, ancora: ANC(10, 10) }), 1, 40, 40);
ok(casas.some((h) => h.q === 10 && h.r === 10), 'a casa da âncora está na lista');
ok(casas.length > 20 && casas.length < 45, `a lista tem o tamanho do círculo (${casas.length})`);

// O traço é UMA forma, e não uma colcha de polígonos.
const q = { raioHexPx: 30, pxPorM: 30, margem: { x: 10, y: 10 } };
ok(/^<circle /.test(M.caminhoDaFigura(circ, q).trim()), 'o círculo desenha um <circle>');
ok(/^<rect /.test(M.caminhoDaFigura(ret, q).trim()), 'o retângulo desenha um <rect>');
ok(/rotate\(/.test(M.caminhoDaFigura(lin20, q)), 'a faixa girada leva um rotate');
ok(/^<path /.test(M.caminhoDaFigura(leq, q).trim()), 'o leque desenha um <path> com arco');
ok(/ A /.test(M.caminhoDaFigura(leq, q)), 'e o arco é um arco de verdade');
// Aberto em 360° o leque vira o círculo.
ok(/^<circle /.test(M.caminhoDaFigura(
  M.figuraDaArea({ molde: 'leque', areaM2: 24, ancora: CENTRO, aberturaGraus: 360 }), q).trim()),
  'em 360° o leque vira um círculo');

// -------------------------------------------------------------------- o dano
// Fenômeno puro: a armadura não pega, só a Absorção natural.
let g = M.danoNoAlvo({ bruto: 10, elemento: 'fogo', materia: null, soakArmadura: 6, soakNatural: 2 });
eq(g.liquido, 8, 'fogo puro ignora a armadura e sofre só a absorção natural');

// Matéria conjurada: a armadura entra na frente.
g = M.danoNoAlvo({ bruto: 10, elemento: 'gelo', materia: 'perfuracao', soakArmadura: 6, soakNatural: 2 });
eq(g.liquido, 2, 'a lasca de gelo encontra a armadura primeiro');

// Fraqueza: passa inteiro e agrava.
g = M.danoNoAlvo({ bruto: 10, elemento: 'fogo', materia: null, soakArmadura: 6, soakNatural: 4, fraquezas: ['fogo'] });
eq(g.liquido, 10, 'fraqueza ignora toda a absorção');
ok(g.agravado, 'fraqueza agrava o ferimento');

// Resistência: corta pela metade DEPOIS da armadura e ANTES da absorção natural.
g = M.danoNoAlvo({ bruto: 12, elemento: 'fogo', materia: null, soakArmadura: 0, soakNatural: 2, resistencias: ['fogo'] });
eq(g.liquido, 4, 'resistência corta pela metade e só então entra a absorção natural');
ok(!g.agravado, 'resistência nunca agrava');

// As duas ao mesmo tempo se anulam.
g = M.danoNoAlvo({ bruto: 10, elemento: 'fogo', materia: null, soakArmadura: 0, soakNatural: 3, fraquezas: ['fogo'], resistencias: ['fogo'] });
eq(g.liquido, 7, 'fraqueza e resistência juntas se anulam');
ok(!g.agravado, 'anuladas, não agrava');

// --------------------------------------------------------- quem sabe o quê
// Personagem: só o que comprou, e só até o nível da Arte.
const comprados = { aura: true, 'arma-elemental': true, 'chuva-de-fogo': true };
const doPC = M.efeitosDisponiveis('fogo', 3, comprados).map((e) => e.id);
ok(doPC.includes('aura'), 'a Aura comprada aparece com Fogo 3');
ok(!doPC.includes('chuva-de-fogo'), 'Chuva de Fogo é nível 6: não aparece com Fogo 3');
// Criatura: alcança o que a Arte dela comporta, porque o bestiário não guarda compra.
ok(M.efeitosDisponiveis('fogo', 3, null).length > doPC.length, 'a criatura alcança mais que o PC');

// ------------------------------------------------------- o relógio do efeito
const ef = {
  ate_tick: 60, desde_tick: 0, mordidos: {}, hexes: [{ q: 0, r: 0 }, { q: 1, r: 0 }],
  forma: 'zona', nome: 'teste', dano_dados: 2, dano_bonus: 0, condicao: null, raio_m: null,
};
eq(M.turnosRestantes(ef, 0), 10, 'um efeito de 60 ticks dura 10 turnos');
eq(M.turnosRestantes(ef, 54), 1, 'no tick 54 resta um turno');
ok(M.venceu(ef, 60), 'no tick 60 o efeito venceu');
eq(M.rodadaDoTick(0), 1, 'o tick 0 é a rodada 1');
eq(M.rodadaDoTick(6), 2, 'o tick 6 já é a rodada 2');
eq(M.dentroDoEfeito(ef, { a: { q: 0, r: 0 }, b: { q: 9, r: 9 } }).join(), 'a', 'só quem pisa na casa está dentro');
// A mordida vale por rodada, e não por entrada.
ef.mordidos = { a: 1 };
ok(M.jaMordido(ef, 'a', 0), 'quem já foi mordido nesta rodada não é mordido de novo');
ok(!M.jaMordido(ef, 'a', 6), 'na rodada seguinte, morde de novo');

// ------------------------------------------- Parar, Dissipar e a região
// Parar resolve do lado de quem conjura: as ações DELE deixam de custar Ticks,
// em vez de o tabuleiro mexer no relógio de todos os outros.
const parar = M.EFEITO['parar'];
eq(parar.grid.alvo, 'si', 'Parar cai em quem conjura');
eq(parar.grid.condicao, 'fora-do-tempo', 'Parar deixa a condição Fora do tempo');
const foraDoTempo = M.CONDICAO['fora-do-tempo'];
ok(foraDoTempo && foraDoTempo.velocidade <= -50,
  'Fora do tempo zera o custo em Ticks pela via que o rastreador já soma');

// Dissipar escolhe um efeito no tabuleiro, e não um chão nem um corpo.
ok(M.EFEITO['dissipar'].grid.dissipa, 'Dissipar apaga efeito alheio');
ok(!M.EFEITO['aura'].grid.dissipa, 'a Aura não dissipa nada');

// Escala de região cobre a arena inteira, seja qual for o tamanho dela.
ok(M.EFEITO['inverno'].grid.arenaInteira, 'o Inverno é de escala de região');
ok(M.EFEITO['semear-o-ermo'].grid.arenaInteira, 'Semear o Ermo também');
ok(!M.EFEITO['neblina'].grid.arenaInteira, 'a Neblina continua sendo área medida');
eq(M.hexesDaArena(12, 8).length, 96, 'a arena inteira são cols × rows hexágonos');
eq(M.hexesDaFigura({ tipo: 'arena', ax: 0, ay: 0, q: 0, r: 0 }, 1, 12, 8).length, 96,
  'a figura de arena cobre o tabuleiro inteiro, seja qual for a área comprada');

// ------------------------------------------- nenhum Efeito de chão nasce vazio
//
// O Muro compra METROS DE PAREDE, e não metros quadrados; o Passo Relâmpago só
// compra Alcance; Criar Substância só compra Quantidade. Quem lê apenas a régua
// de área acha zero nos três, e zero vira uma figura sem tamanho: o efeito é
// gravado, cobra a Mana e não desenha nada. A parede de chamas sumiu assim.
const CHAO = ['zona', 'muro', 'cone', 'linha', 'aura'];
const figuraDoEfeito = (e, n = 3) => {
  const par = (nome) => (e.parametros || []).find((p) => p.nome === nome && p.tipo !== 'fixo');
  const pArea = par('Área') || par('Volume');
  const pComp = par('Comprimento');
  const ehRaio = !!pArea && /de raio/i.test(pArea.unidade || '');
  const forma = e.grid.forma;
  const molde = forma === 'aura' ? 'circulo'
    : forma === 'muro' || forma === 'linha' ? 'linha'
    : forma === 'cone' ? 'leque' : 'circulo';
  return M.figuraDaArea({
    molde, ancora: CENTRO, aberturaGraus: 90,
    areaM2: pArea && !ehRaio ? M.areaEmM2(pArea, n) : 0,
    raioProprioM: pArea && ehRaio ? parseFloat(M.valorNoNivel(pArea, n)) || 0 : 0,
    comprimentoProprioM: pComp ? parseFloat(M.valorNoNivel(pComp, n)) || 0
      : (forma === 'linha' ? M.alcanceEmMetros(par('Alcance') || { nome: 'Alcance', tipo: 'padrao' }, n) : 0),
  });
};
const vazios = M.EFEITOS
  .filter((e) => CHAO.includes(e.grid.forma))
  .filter((e) => {
    const f = figuraDoEfeito(e);
    return Math.max(f.raioM || 0, f.comprimentoM || 0) < 0.5;
  })
  .map((e) => e.id);
eq(vazios.join(', ') || 'nenhum', 'nenhum',
  'Efeito de chão que nasceria sem tamanho no tabuleiro');

const muro = figuraDoEfeito(M.EFEITO['muro'], 3);
eq(muro.tipo, 'linha', 'o Muro é uma faixa, e não um círculo');
eq(muro.comprimentoM, 8, 'Comprimento 3 são 8 m de parede, e não 8 m² divididos');
eq(muro.larguraM, 1, 'a parede tem um metro de espessura');
// O escudo continua vindo da área, porque a régua dele é de área mesmo.
ok(figuraDoEfeito(M.EFEITO['escudo-de-forca'], 3).comprimentoM > 0,
  'o Escudo de Força ainda sai da área comprada');

// ---------------------------------------------------- cobertura da projeção
eq(M.EFEITOS.filter((e) => !e.grid).length, 0, 'todo Efeito tem bloco grid');
eq(M.ARTES.filter((a) => !a.grid).length, 0, 'toda Arte tem bloco grid');
ok(M.ARTES.every((a) => a.grid.cor), 'toda Arte tem cor no tabuleiro');

if (falhas.length) {
  console.error(`\n✘ Motor das Artes FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log(`✓ Motor das Artes OK · ${M.ARTES.length} Artes · ${M.EFEITOS.length} Efeitos · `
  + `Aura de Fogo 3 m/2d6/2 turnos = 9 pontos, 6 de Mana`);
