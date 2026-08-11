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
eq(M.turnosDeDuracao(1), 1, 'Duração 1 = 1 turno');
eq(M.turnosDeDuracao(2), 5, 'Duração 2 = 5 turnos');
eq(M.turnosDeDuracao(3), 10, 'Duração 3 (1 minuto) = 10 turnos');
eq(M.TICKS_POR_TURNO, 6, 'um turno são 6 ticks');
eq(M.rotuloDuracao(300), 'a cena toda', 'acima de 50 turnos o número não diz nada');

// ------------------------------------------------- o exemplo da mesa: a Aura
// Aura de Fogo com Volume 3 (3 m de raio), Dano 2 (2d6) e Duração 2 (5 turnos).
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
const raio = M.hexesNoRaio({ q: 10, r: 10 }, 3, 1, 40, 40);
eq(raio.length, 37, 'raio de 3 m numa arena de 1 m cobre 37 hexágonos (1+6+12+18)');
ok(raio.some((h) => h.q === 10 && h.r === 10), 'o centro entra no raio');
// Numa arena de 0,5 m o MESMO raio de 3 m cobre mais casas, e a conta é a mesma.
ok(M.hexesNoRaio({ q: 10, r: 10 }, 3, 0.5, 40, 40).length > raio.length, 'arena mais fina, mais casas');
eq(M.hexesParaArea(16, 1), 16, '4 × 4 m numa arena de 1 m são 16 casas');
eq(M.hexesParaArea(16, 2), 4, 'a mesma área numa arena de 2 m são 4 casas');

const leque = M.hexesEmLeque({ q: 0, r: 0 }, { q: 4, r: 0 }, 9, 40, 40);
eq(leque.length, 9, 'o leque respeita o número de casas da área');
ok(!leque.some((h) => h.q === 0 && h.r === 0), 'o leque não inclui a casa de quem conjura');
const linha = M.hexesEmLinha({ q: 0, r: 0 }, { q: 5, r: 0 }, 4, 40, 40);
eq(linha.length, 4, 'a linha tem o comprimento pedido');

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
  + `Aura de Fogo 3 m/2d6/5 turnos = 9 pontos, 6 de Mana`);
