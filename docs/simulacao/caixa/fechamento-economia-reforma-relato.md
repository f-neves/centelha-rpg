# Fechamento da economia e restos da Reforma da Centelha · relato

Despacho em `docs/simulacao/caixa/fechamento-economia-reforma-despacho.md`. Orçamento curto,
um commit por item, CI conferido job a job com `gh run view` em cada um (nunca `gh run watch`,
e `gh run list` sem `--branch`).

## Item 1 · Restos da Reforma da Centelha

**(a) `coracao-do-sistema.md:89/91/93`.** As três sobras corrigidas juntas: a fórmula (`:89`),
o texto que ainda dizia "+1 por ponto" (`:91`) e o exemplo do guarda (`:93`), todos para
`(Atributo + Habilidade) × 2 + 2 × mín(Centelha, Habilidade) + Especialidade`.

**Divergência encontrada, não decidida (ordem explícita do despacho).** `:89` traz a
Especialidade DENTRO do Valor Passivo; `acoes-e-sistema.md:123` diz que ela NÃO entra (entra
por cima, quando o escopo nomeado se aplica). Deixei cada capítulo como já estava nisso: só
troquei o termo de Centelha nos dois, sem mexer em quem leva ou não a Especialidade. Fica para
o autor decidir se é divergência de fato ou dois contextos diferentes (resumo geral × o modo
Passiva especificamente).

**(b) `acoes-e-sistema.md:65` (tabela) e `:121` (fórmula)**, e `src/lib/calc.ts`:
- `valorPassivo` (`calc.ts:407-409`) trocado de `(atributo + habilidade) * 2 + centelha` para
  `(atributo + habilidade) * 2 + centelhaNaJogada(centelha, habilidade)`. Conferido: a função
  não tem CHAMADOR nenhum hoje (só é citada em comentário de `combate-resumo.ts:46` e
  `mesa-bestiario.ts:143`), então não quebra teste nem resumo em produção.
- `combate-resumo.ts:156`: o CÓDIGO (linha 157) já chamava `defesa()` (que já usa
  `centelhaNaJogada` desde a Reforma); só o COMENTÁRIO estava desatualizado ("+ Centelha" em
  vez de "2×mín(Centelha,Esquiva)"). Corrigido o comentário; o número que a ficha mostra não
  mudou.

**(c) Jogada só de Atributo.** `centelhaSoAtributo` (`calc.ts`) deixou de ser "regra de
primeira versão/pendência" no comentário: agora documenta a decisão do autor de 01/10/2026
(oficial, sem teto, porque não há Habilidade para travar o teto de `centelhaNaJogada`). Fechei
a pendência **D12** (`docs/pendencias/D-proezas-tecnicas.md`) e escrevi a regra em
`centelha.md`, item 1 (`:44`), como uma frase extra no mesmo item que já descrevia o teto geral.
`Pendencias.md` regerado (346 itens, 241 abertos, 8 anomalias pré-existentes, nenhuma nova).

**(d) Sobras do "+1 por ponto".** Conferidas as notas de `regras.json`: `escalasProeza`
(`:114`) já falava em `2×menor(Centelha,Habilidade)`, nada sobrando. Os quatro `centelhaMult`
de ataque/defesa/defesaMental/defesaSocial já tinham `centelhaNota: "DESATUALIZADO..."`
apontando para a pendência **K35**, que já cobre quem ainda lê esses campos
(`scripts/lib-tempo.mjs`, `scripts/cost-examples.mjs`): nada para corrigir ali. **Um sobrou de
verdade**: o bloco `modoDevagar` (Régua de Relação, `:2683`) ainda descrevia "Defesa parada =
... + Centelha × centelhaMult", sem nenhum código lendo esse bloco (conferido: zero
ocorrências de `modoDevagar`/`centelhaSoNaDefesa` fora do próprio JSON). Corrigido o texto para
`2×menor(Centelha,Sociabilidade)`, igual ao resto da Reforma.

**(e) Confirmado.** `acoes-e-sistema.md:107` ("A Centelha não entra na Longa") segue correto:
nem o (b) nem o (c) mexem na Longa, que continua sem termo de Centelha nenhum.

**(f) `lore/economia/estado-revisao.md:3`** corrigido de "fora do git" (`lore/economia/` não é
rastreada) para "versionado desde a rodada 111 (`508c92a3`)", que é o estado atual.

Arquivos: `src/content/chapters/coracao-do-sistema.md`, `src/content/chapters/acoes-e-sistema.md`,
`src/content/chapters/centelha.md`, `src/lib/calc.ts`, `src/lib/combate-resumo.ts`,
`src/data/regras.json`, `docs/pendencias/D-proezas-tecnicas.md`, `Pendencias.md`,
`lore/economia/estado-revisao.md`, `Regua_Relacao.md` (citação `calc.ts:164→:171`, reapontada
porque o novo comentário de `centelhaSoAtributo` empurrou `defesaSocial` três linhas).

**Produção.** Muda o número exibido pela ficha: a Defesa física passiva (resumo de combate) e
qualquer leitura futura de `valorPassivo` passam a usar o teto de Centelha certo
(2×mín(Centelha,Habilidade)) em vez do antigo "+1 por ponto" sem teto. O resumo de combate em
produção já usava `defesa()` direto (não `valorPassivo`), então o comportamento ao vivo não
muda; o que muda é o comentário que o descrevia errado. Nenhuma migração.

**Verificação:** `npm run validate`, `npx tsc --noEmit`, `npm run build` (prova no gerado:
`dist/regras/coracao-do-sistema/index.html` e `dist/regras/acoes-e-sistema/index.html` mostram
a fórmula nova), `npm run espelho` (tocou `calc.ts`). Todos verdes.

**Commit:** `8d1cbb79` · **CI:** (conferir após o adendo abaixo, mesmo item)

### Adendo do autor (commit `f963cbf5`, após o item 1 commitado)

Unificou a fórmula do Valor Passivo nos dois capítulos: a mesma redação agora em
`coracao-do-sistema.md:89/93` e `acoes-e-sistema.md:65/121`, incluindo a Especialidade com a
ressalva por extenso: "+ Especialidade (só quando o escopo dela se aplica, somada no momento do
uso)". `acoes-e-sistema.md:123` ajustado para casar (não diz mais "a Especialidade não entra
aqui", diz "não entra no número parado que a ficha imprime", mesma explicação de sempre). O
`calc.ts` não mudou: `valorPassivo` continua sem somar Especialidade (não tem esse parâmetro), e
isso é o comportamento certo, porque a Especialidade só entra no momento do uso, não no número
parado. Guarda comum (Centelha 0, sem Especialidade) continua dando (Percepção + Prontidão) × 2,
sem mudança.

**Verificação do adendo:** `npm run validate`, `npm run build` (prova no gerado: as duas páginas
mostram a fórmula idêntica agora), zero travessão. `npx tsc`/`espelho` não repetidos porque
`calc.ts` não mudou nesta parte.
