// sinais.mjs · os sinais de bateria ineficaz, como predicados puros.
//
// POR QUE ELES SAÍRAM DO AGREGADOR. Não é arrumação: é o princípio do ZERO
// AMBÍGUO aplicado aos próprios alarmes (`02-projeto-harness.md`, a regra do
// contador de ocasiões).
//
// Dez sinais imprimiam o veredito e nove nunca tinham acendido. Um alarme que
// nunca disparou é um alarme não testado, e um alarme não testado é exatamente
// o zero de duas caras que ele existe para pegar: "não houve problema" e "o
// predicado está errado e nunca vai acender" imprimem o mesmo ✓. Enquanto os
// predicados moravam soltos no meio do agregador, não havia como acender nenhum
// de propósito sem falsificar uma bateria inteira.
//
// Aqui eles são funções sobre um objeto pequeno, e `scripts/test-sinais.mjs`
// alimenta cada um com o mínimo que TEM de acendê-lo e com o mínimo que NÃO
// pode. Onze predicados, vinte e dois casos.
//
// O CONTEXTO que eles recebem:
//   boas       · as batalhas válidas (linhas do .jsonl)
//   invalidas  · as que violaram invariante
//   porCelula  · Map<id da célula, linhas>
//   infoDe     · (id) => a célula do manifesto (dist, ciclo, nivelLimiar...)

const soma = (a) => a.reduce((x, y) => x + y, 0);
const med = (a) => (a.length ? soma(a) / a.length : null);
const varia = (a) => {
  if (a.length < 2) return 0;
  const m = med(a);
  return soma(a.map((y) => (y - m) ** 2)) / (a.length - 1);
};
const num = (x, c = 2) => (x == null ? '·' : x.toFixed(c));
const pct = (x) => (x == null ? '·' : `${(x * 100).toFixed(0)}%`);
const rotuloCheio = (id) => id.replace(/-l\d+$/, '');

/** Uma célula com distância inicial: é onde a travessia e a re-projeção moram. */
const comDistancia = (ctx) => (l) => (ctx.infoDe(l.celula).dist || 1) > 1;

/**
 * OS ONZE SINAIS.
 *
 * Cada um devolve `{ aceso, texto, nota }`: `texto` é o que sai quando ele
 * acende, `nota` é o que sai quando ele não acende. Os dois saem sempre, porque
 * silêncio e conferência-que-não-rodou não podem ser a mesma coisa na tela.
 */
export const SINAIS = [
  // ------------------------------------------------------- 1 · invariantes
  {
    nome: 'invariantes',
    confere: (ctx) => ({
      aceso: ctx.invalidas.length > 0,
      texto: `${ctx.invalidas.length} batalha(s) violaram invariante`,
      nota: `nenhuma das ${ctx.boas.length} batalhas violou um dos quinze invariantes`,
    }),
  },

  // ------------------------------ 2 a 7 · contadores de OCASIÃO em zero
  //
  // O coração do princípio: uma métrica que depende de um evento nunca
  // observado não é uma métrica baixa, é uma métrica que não existe.
  {
    nome: 'ocasião · reprojetar',
    confere: (ctx) => {
      const ls = ctx.boas.filter(comDistancia(ctx));
      const n = soma(ls.map((l) => l.paradasSub?.reprojetar || 0));
      // `ls.length > 0` NÃO É DETALHE: sem nenhuma célula com distância o zero é
      // legítimo (não há travessia para re-projetar), e o alarme acenderia
      // apontando para o eixo em vez de para a grade. Achado pelo
      // `test-sinais.mjs`, e é a mesma forma de erro que os alarmes existem para
      // pegar, agora com o sinal do lado errado: um aceso que não significa nada
      // gasta a confiança do painel tão rápido quanto um apagado que esconde.
      return {
        aceso: ls.length > 0 && !n,
        texto: '`reprojetar` em ZERO nas células com distância: o eixo E2 não está mordendo',
        nota: ls.length
          ? `${n} re-projeções nas células com distância`
          : 'nenhuma célula com distância nesta grade: nada a conferir',
      };
    },
  },
  {
    nome: 'ocasião · fugir',
    confere: (ctx) => {
      const n = soma(ctx.boas.map((l) => l.paradasSub?.fugir || 0));
      return {
        aceso: !n,
        texto: '`fugir` em ZERO: o limiar nunca disparou e a fase de fuga não existe',
        nota: `${n} declarações de fuga`,
      };
    },
  },
  {
    nome: 'ocasião · redirecionar',
    confere: (ctx) => {
      const n = soma(ctx.boas.map((l) => l.paradasSub?.redirecionar || 0));
      return {
        aceso: !n,
        texto: '`redirecionar` em ZERO: a regra do golpe no caído nunca foi exercitada',
        nota: `${n} golpes redirecionados`,
      };
    },
  },
  {
    nome: 'ocasião · raspão',
    confere: (ctx) => {
      const n = soma(ctx.boas.map((l) => l.vereditos?.raspao || 0));
      return {
        aceso: !n,
        texto: 'nenhum RASPÃO em toda a bateria: o Quase-Acerto não está sendo exercitado',
        nota: `${n} raspões`,
      };
    },
  },
  {
    nome: 'ocasião · quarta célula do quadro',
    confere: (ctx) => {
      const n = soma(ctx.boas.map((l) => l.quadro?.soResolveu || 0));
      return {
        aceso: !n,
        texto: '`só resolveu` em ZERO: a quarta célula do quadro nunca acontece',
        nota: `${n} Ticks em que algo caiu sem consultar ninguém`,
      };
    },
  },
  {
    // O SINAL QUE GUARDA O NÚMERO PUBLICADO DA §2.4, e ele nasceu desta
    // varredura. O piso do avanço automático (11,4%) sai do Tick MORTO, que é o
    // Tick sem parada em que também ninguém andou. Se `log.andou` deixar de ser
    // chamado, o Tick morto passa a ser IGUAL ao Tick sem parada em toda
    // batalha, o piso sobe para o teto (20%) e **nada no relatório acusa**: o
    // número sai plausível, redondo e errado. É o mesmo zero de duas caras das
    // bandeiras, e desta vez dentro de um número que já foi publicado.
    //
    // Onde ele NÃO deve acender: nas células encostadas ninguém anda, e ali os
    // dois contadores são legitimamente iguais. Por isso o filtro de distância.
    nome: 'ocasião · passo',
    confere: (ctx) => {
      const ls = ctx.boas.filter(comDistancia(ctx));
      const semParada = (l) => (l.quadro?.nada || 0) + (l.quadro?.soResolveu || 0);
      const difere = ls.filter((l) => (l.ticksMortos || 0) !== semParada(l)).length;
      return {
        aceso: ls.length > 0 && difere === 0,
        texto: 'o Tick MORTO é igual ao Tick sem parada em TODA batalha com distância:'
          + ' `log.andou` não está conectado, e o piso da §2.4 virou o teto sem avisar',
        nota: `${difere} de ${ls.length} batalhas com distância têm Tick morto < Tick sem parada`,
      };
    },
  },

  // ------------------------------------------------------- 8 · variância
  {
    nome: 'variância',
    confere: (ctx) => {
      const metric = (l) => l.fases.combate.paradasPorTick.media;
      const dentro = med([...ctx.porCelula.values()]
        .map((ls) => varia(ls.map(metric))).filter((x) => x != null));
      const entre = varia([...ctx.porCelula.values()].map((ls) => med(ls.map(metric))));
      return {
        aceso: dentro >= entre,
        texto: `variância DENTRO da célula (${num(dentro, 4)}) ≥ variância ENTRE células`
          + ` (${num(entre, 4)}): os eixos não estão fazendo nada`,
        nota: `os eixos explicam ${num(entre / Math.max(dentro, 1e-9), 0)}× mais que o acaso`,
        extra: { dentro, entre },
      };
    },
  },

  // ------------------------------------------------------------ 9 · teto
  {
    nome: 'teto',
    confere: (ctx) => {
      const estouram = [...ctx.porCelula.entries()]
        .filter(([, ls]) => ls.every((l) => l.fim === 'estourou'));
      return {
        aceso: ctx.porCelula.size > 0 && estouram.length === ctx.porCelula.size,
        texto: 'TODAS as células estouram o teto: nada termina',
        nota: `${estouram.length} de ${ctx.porCelula.size} células estouram sempre, e`
          + ` ${ctx.porCelula.size - estouram.length} terminam`,
        extra: { estouram },
      };
    },
  },

  // --------------------------------------------------- 10 · distribuição
  {
    nome: 'distribuição',
    confere: (ctx) => {
      const degeneradas = [];
      for (const [id, ls] of ctx.porCelula) {
        const p10 = med(ls.map((l) => l.fases.combate.paradasPorTick.p10));
        const p90 = med(ls.map((l) => l.fases.combate.paradasPorTick.p90));
        if (p10 != null && p90 != null && Math.abs(p90 - p10) < 1e-9) degeneradas.push(rotuloCheio(id));
      }
      return {
        aceso: degeneradas.length > 0,
        texto: `p10 = p90 em paradas/Tick (combate) em ${degeneradas.length} célula(s):`
          + ' a distribuição é degenerada e o percentil não diz nada · '
          + degeneradas.slice(0, 6).join(', ')
          + (degeneradas.length > 6 ? ` e mais ${degeneradas.length - 6}` : ''),
        nota: 'nenhuma célula com p10 = p90 em paradas/Tick',
      };
    },
  },

  // ------------------------------------------------ 11 · fuga-consumada
  {
    nome: 'fuga-consumada',
    confere: (ctx) => {
      const engolidas = [];
      for (const [id, ls] of ctx.porCelula) {
        const f = ls.filter((l) => l.fim === 'fuga-consumada').length / ls.length;
        if (f > 0.9) engolidas.push(`${rotuloCheio(id)} ${pct(f)}`);
      }
      return {
        aceso: engolidas.length > 0,
        texto: `fuga-consumada acima de 90% em ${engolidas.length} célula(s): a fase de fuga`
          + ' engoliu a batalha · ' + engolidas.slice(0, 6).join(', ')
          + (engolidas.length > 6 ? ` e mais ${engolidas.length - 6}` : ''),
        nota: 'nenhuma célula com fuga-consumada acima de 90%',
      };
    },
  },
];

/** Confere os onze e devolve o veredito de cada um, aceso ou apagado. */
export function conferirSinais(ctx) {
  return SINAIS.map((s) => ({ nome: s.nome, ...s.confere(ctx) }));
}
