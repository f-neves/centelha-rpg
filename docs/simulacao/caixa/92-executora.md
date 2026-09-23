# Rodada 92 · Executora · o CORRIGE e as três notas da 91

Despacho: `docs/simulacao/caixa/92-despacho.md` (`05a9f84`). Veredito tratado: `91-revisora.md`
(`12fb0be`). Progresso com as horas lidas da máquina em `progresso-92.md`.

## Arquivos tocados

| arquivo | o que mudou nele |
|---|---|
| `src/lib/artes-grid.ts` | função nova `aguentouFicarParado(total, desvio)` |
| `src/lib/artes-grid-mesa.ts` | `oferecerSaida` chama a função no lugar de `r.total > d.difParado` |
| `scripts/test-artes-grid.mjs` | uma asserção nova sobre quem aguenta na borda |
| `src/data/regras.json` | o texto do ficar parado cita o núcleo (4 m, 25 vira 13) |
| `src/content/chapters/aparencia-virtudes-vontade.md` | "os do mundo (... que não vêm de uma Arte)" antes de veneno, doença e ambiente |
| `docs/pendencias/L-simulacao-simultaneo.md` | a citação sem arquivo virou `src/lib/artes-grid-mesa.ts:1901`; a de `artes-grid.ts` do `condId` foi para 1894 |
| `docs/simulacao/caixa/progresso-92.md`, `92-executora.md` | progresso e relato |

Portões: `npx tsc --noEmit` sem erro, `npm run validate` exit 0, `npm run build` exit 0 com os 23
capítulos. O texto novo do núcleo sai no HTML de `/artes/regras`.

## 1 · CORRIGE · a comparação saiu da caixa

A Revisora tinha razão: a `oferecerSaida` não só coletava e rolava, ela escolhia qual Dificuldade
comparar. Agora quem decide é `aguentouFicarParado(total, d)` em `artes-grid.ts` (`total >
d.difParado`), e o ramo do ficar parado em `oferecerSaida` não lê `difMetade` nem `difParado` para
decidir nada. O `difParado` continua só na nota e no registro, para mostrar a Dificuldade.

**A asserção:** na borda (`difParado` 5, `difMetade` 10), totais 5, 6 e 9 dão `false true true`. O 6
e o 9 são os que separam as duas Dificuldades.

**O controle negativo, com a mesma troca que a Revisora fez**, só que agora onde a comparação mora:
`return total > d.difMetade` em `artes-grid.ts`. Resultado: **exit 1**, a asserção nova caiu com
`false false false`. Arquivo restaurado, teste de volta a exit 0, diff conferido (só a função nova e a
chamada).

**O que continua sem cobertura, dito para não prometer mais que isso:** a `oferecerSaida` ainda pode
ser reescrita à mão para comparar direto de novo, e nenhum teste veria, porque nenhum teste passa pela
caixa. O que mudou é que hoje ela não compara: a troca da Revisora não tem mais onde ser feita dentro
da caixa. O ramo "tentar sair" (`fator` contra `difMetade`/`difNada`) segue decidindo dentro da caixa,
como antes; ele não é do despacho.

## 2 a 4 · as notas

**Nota 1.** `regras.json` agora termina a lista com "e o núcleo, a quatro metros, 25 vira 13", que
é o `Math.ceil(25 / 2)` do código.

**Nota 2.** A fronteira diz "os do mundo (veneno, doença e ambiente hostil que não vêm de uma Arte)
nem passam pela Virtude". A doença de uma Arte fica na oração anterior, com o Vigor + Convicção.

**Nota 3.** `L-simulacao-simultaneo.md:5492`: "o mesmo em `:1787`" virou "o mesmo em
`src/lib/artes-grid-mesa.ts:1901`". Conferido pelo conteúdo: as duas linhas `Math.max(0,
(alvo.pv_atual ?? 0) - golpe.liquido)` do arquivo estão em 1867 e 1901.

**Achado ao rodar o `reapontar.mjs`, fora do despacho:** ele moveu uma citação da mesma frase de
`L-simulacao-simultaneo.md` (a do `const condId` em `artes-grid.ts`) de 1883 para 1893, e o alvo está
em **1894**. A citação já estava uma linha abaixo antes das minhas rodadas: em `84228f3` ela dizia
1864 e a linha estava em 1865. O `reapontar.mjs` confere a âncora numa janela de ±3 linhas
(`JANELA = 3`, `scripts/reapontar.mjs:196`), e por isso ele não reclama de um desvio de uma linha.
Não conferi se o `test-procedencia.mjs` tem a mesma folga, mas o `validate` também passou. Corrigi à
mão para 1894.

## Em aberto

Nada desta rodada.
