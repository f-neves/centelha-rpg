// espelho.mjs · o lado HEADLESS do espelho de motor.
//
// Roda uma cena pelo laço do `motor.mjs` e devolve exatamente o que a mesa
// devolve em `window.__DESPEJO` e em `window.__LANCES`, campo a campo, para o
// comparador não ter de traduzir nada. Traduzir é onde uma divergência some.
//
// O RETRATO É TIRADO NO MESMO PONTO: a mesa chama `despejarTick` no fim de
// `avancarTickSimultaneo`, ou seja depois do passo e da declaração e ANTES de
// os golpes daquele Tick caírem (o botão do ⏭ tranca até o mestre resolver).
// Comparar retratos tirados em pontos diferentes do Tick daria diferença em
// Vida e Pressão sem que houvesse defeito nenhum.
import { montarCena, arquetipo } from './cena.mjs';
import { novoLog } from './log.mjs';
import { batalha } from './motor.mjs';

/**
 * Uma célula de espelho, no mesmo formato que a URL da bancada aceita.
 * `arq` são os dois arquétipos, `n` as peças por lado, `dist` a distância
 * inicial em hexágonos.
 */
export const celulaEspelho = (id, arq, n, dist) => ({
  id, arq, n, dist, ciclo: id, distancia: `d${dist}`, pecas: `${n}v${n}`,
});

/** O retrato de um Tick, no molde de `despejarTickInterno` da mesa. */
function retratoDe(L, T, fila) {
  const pecas = fila.map((c) => {
    // `acaoNo` da mesa: a ação existe quando tem golpe OU Pressão. O objeto
    // vazio que a bancada guarda em quem nunca agiu não é ação, e tratá-lo como
    // uma faria o retrato do harness trazer bloco onde a mesa traz `null`.
    const a = temAcao(c.acao) ? c.acao : null;
    return {
    id: c.id, nome: c.nome,
    q: c.pos?.q ?? null, r: c.pos?.r ?? null,
    chao: c.pv <= 0,
    pv: c.pv,
    tick: c.tick ?? null,
    ini: c.iniciativa ?? null,
    fase: L.faseEm(a, T),
    defesaPerdida: L.defesaPerdida(a, T).total,
    acao: a
      ? {
        tipo: a.tipo ?? null, desde: a.desde ?? null, livre: a.livre ?? null,
        golpes: (a.golpes || []).slice(), pressao: a.pressao ?? 0,
        mov: a.mov ? { destino: a.mov.destino ?? null, alvo: a.mov.alvo ?? null } : null,
      }
      : null,
    };
  });
  return { t: T, fila: pecas.map((p) => p.id), pecas };
}

/** `acaoVazia` da régua, invertida: tem golpe no ar OU Pressão acumulada. */
const temAcao = (a) => !!a && ((Array.isArray(a.golpes) && a.golpes.length > 0) || a.pressao > 0);

/** Roda a célula pelo laço e devolve os dois despejos. */
export function rodarEspelho(L, celula, semente, teto) {
  L.semear(L.semeadoDe(semente));
  const cena = montarCena(celula, semente);
  const log = novoLog();
  const ticks = [];
  const lances = [];
  const res = batalha(L, cena, log, {
    teto,
    // SEM FIM DE CENA. A mesa não tem nenhum: lá quem decide que acabou é o
    // mestre, e o botão do Tick continua clicável com um lado inteiro no chão.
    // Deixar o `fimDaCena` do harness ligado encurtava a comparação justamente
    // onde ela fica interessante (peça caída, fuga saindo do mapa).
    semFim: true,
    retrato: (T, fila) => ticks.push(retratoDe(L, T, fila)),
    lance: (x) => lances.push(x),
  });
  return { ticks, lances, res, cena, arquetipos: celula.arq.map(arquetipo) };
}
