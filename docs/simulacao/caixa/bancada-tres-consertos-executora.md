# Três consertos na bancada (calibrar.mjs) · relato da Executora

Despacho: `docs/simulacao/caixa/bancada-tres-consertos-despacho.md` (commit `2251724d`).

## Item 1 · força por Tick não passava pelo ajuste da anatomia

**Antes**: `cicloDaPeca(p)` chamava `L0.anatomia({classe, velocidade, ...})` direto dos dados
crus da peça, sem o `ajustarAnatomia(c, a)` que a luta de verdade aplica. `preparo-1` e
`recuperacao-1` saíam com força/Tick igual à força/tentativa, porque o ciclo usado no cálculo
nunca refletia o −1 de Preparo/Recuperação.

```
| 8 | 1 | preparo-1 | 2,32 | 2,23 | 14,69 | 15,26 | 1,039 | 1,039 |  | 70,0% ...
```

**Depois**: `cicloDaPeca` aplica `ajustarAnatomia(p, a).ciclo` antes de devolver o valor. O
critério de aceite do próprio despacho (preparo-1 com espada ≈ força/tentativa × 6/5) bate:

```
| 8 | 1 | preparo-1 | 2,27 | 2,04 | 14,66 | 16,32 | 1,113 | 1,336 | ⚑ | 88,3% [86,7%; 89,8%], n=2000 | ...
```

1,336 / 1,113 = 1,2004 ≈ 6/5. **Achado a mais**: com o limiar de `⚑` em 20% (o antigo), essa
linha NÃO ficava marcada (16,7% de diferença relativa ao maior valor). Baixei o limiar para 15%
em `discorda` (`calibrar.mjs`), porque 6/5 é exatamente o piso esperado desta classe de
alavanca, e o próprio despacho pede a bandeira nessa linha. Conferido que nenhuma outra linha
(mesma arma dos dois lados) ganhou `⚑` por acidente com o limiar mais baixo: força e força/Tick
continuam idênticas sempre que os dois lados usam a mesma arma (o ciclo é o mesmo), porque a
única fonte de discordância é diferença de ciclo, não ruído de amostra.

## Item 2 · a alavanca de Destreza sumiu da seção E

**Antes**: `ALAVANCAS` tinha dez chaves, sem `atributo+1-destreza-espada` (que já existia,
tratada em `fichaDe`). A seção E nunca media essa alavanca; só a nova `linhasMontante` (Força +
Montante) aparecia no relatório.

**Depois**: `atributo+1-destreza-espada` entrou em `ALAVANCAS`. Ela roda dentro do loop da seção
E (que já fixa `arma: 'espada-longa'`), então cai automaticamente no mesmo formato de linha da
tabela E, ao lado de `habilidade+1` e das outras. Trecho da tabela E, soma 8 Centelha 1:

```
| 8 | 1 | atributo+1-destreza-espada | 2,84 | 1,17 | 11,97 | 29,02 | 2,424 | 2,424 |  | 100,0% [99,8%; 100,0%], n=2000 | ...
```

Comparável lado a lado com a Força + Montante (seção 6a, mesma soma/Centelha):

```
| 8 | 1 | ... | 9,37 | 4,83 | 3,63 | 7,04 | 1,941 | 1,941 |  | 83,7% ...
```

## Item 3 · o teto de Pressão da seção D: cabo ligado, teto nunca alcançado

**Não é defeito de fiação.** Testei com dado real, não só leitura de código: um script
descartável (`scripts/sim/_tmp-diag.mjs`, rodado e apagado) instrumentou `libDaBancada` para
gravar a Pressão CRUA (antes do teto) de cada golpe, numa luta 1×3 (soma 12, Centelha 5, o
extremo da tabela D), 60 lutas por configuração:

```
cap=sem teto · lances=3563 · defesaPerdida(total) minimo=-8
  pressao CRUA (antes do teto), min=-4: -4:885 -2:893 0:1785
cap=4          · mesma distribuição CRUA, minimo=-4 (idêntico ao sem teto)
cap=6          · mesma distribuição CRUA, minimo=-4 (idêntico ao sem teto)
cap=1 (controle) · pressao CRUA continua min=-4, mas o TOTAL muda: minimo de -8 para -5
```

A pressão crua nunca desce de −4 nesta cena (1×3, soma 12, C5, o caso mais extremo da tabela D),
então um teto de −4 ou −6 é sempre folgado e nunca corta nada: **é exatamente o que a segunda
hipótese do despacho previa**. Rodei também `cap=1` (bem mais apertado que qualquer valor da
tabela real) como controle positivo: com ele, o total SEMPRE muda em relação ao "sem teto"
(mínimo passa de −8 para −5), provando que o cabo está ligado de verdade: se estivesse
desconectado, `cap=1` teria dado o mesmo resultado que `cap=4`/`cap=6`/`sem teto`, e não deu.

**Nenhum código de produção foi tocado.** O wiring está correto; a distribuição prova que o
teto testado (−4/−6) é folgado demais para esta cena específica, não que ele não funciona.
Não mexi em `calibrar.mjs` para este item: não havia nada de fato quebrado para consertar.

## O que foi regenerado

Só as seções **E, 6a (Força + Montante) e D**, com `--n 1000`. As seções **A, B, C e 6b (Briga ×
Armas) são as MESMAS do commit anterior (`1b933b5`/`cdf4a8c6`)**, copiadas verbatim: acrescentei
um flag novo em `calibrar.mjs`, `--pular <A,B,C,Briga>`, que lê o relatório já publicado e copia
o trecho de cada seção pulada em vez de recalcular. Validado antes do uso real: rodei o script
duas vezes sobre a mesma semente com `--n 20` (uma vez sem `--pular`, uma vez com), e as tabelas
B/A/C saíram byte a byte idênticas entre as duas rodadas: confirma que pular não muda valor
nenhum, só economiza a bateria. A seção "Resumo para a Revisora" (parte do topo) e a "seção 7 ·
onde as camadas divergem" continuam calculadas do zero em toda rodada (são baratas: 21 e 9
células, não as 126+108+9 de B+C+Briga inteiras), então elas refletem a regra de hoje mesmo com
`--pular`.

`node scripts/sim/calibrar.mjs --teste`: verde (3 golpes manuais, 2 pontos de concordância; sem
critério novo para expressar como asserção neste despacho, já que os três itens são sobre a
MEDIÇÃO, e o `--teste` já cobre a regra em si).

## Verificação

- `npx tsc --noEmit`: limpo.
- `npm run validate`: verde.
- Nenhuma mudança em `src/`, como o despacho previa; só `scripts/sim/calibrar.mjs` e
  `docs/calibracao/15-linha-de-base.md`.

## É seguro dar `/clear`

Sim, depois do commit deste relato: por pathspec só do necessário
(`scripts/sim/calibrar.mjs`, `docs/calibracao/15-linha-de-base.md` e este próprio arquivo).
