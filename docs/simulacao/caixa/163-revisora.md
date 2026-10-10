# 163 · Revisora · Rodada 8, o fechamento (`5d2cfeea`)

Pino: `5d2cfeea` (branch `revisora` reancorada com `git switch -C revisora 5d2cfeea`; o 162, `afca40fd`, é ancestral). Escopo: o commit da Executora-2 (`test-capitulo-armas.mjs`, `referencia.astro`, `regras.json`, `gen-bench-tempo.mjs`, `combate-tempo-bench.html`); o resto do `diff` desde `afca40fd` são documentos do Arquiteto (`be553ee0`, `91547574`), que não revi. Fonte: o plano (Rodada 8, itens 1 a 18), os vereditos 153 a 162 e a D-087. A mensagem do commit tratei como hipótese.

**Resultado: PROCEDE. Nenhum BLOQUEIA, CORRIGE, PERGUNTA ou ESCALA.** **Todos os buracos que eu achei nos vereditos 154, 156, 157, 160, 161 e 162 e que o plano manda pinar agora são pegos**; o fallback da `ficha-pgr.ts` é testado por mutantes do código real; o `/mesa/referencia` a 390 px deixa de rolar; e **os totais que a Executora relatou nas rodadas 4d a 7 não estavam errados por causa do "=" do contador**. Duas sugestões, sem veredito.

**CI (§11):** `Validar dados e regras` e `Deploy site` de `5d2cfeea` **verdes** (filtrei `gh run list --json headSha`). Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (**165 estragos**, como a mensagem diz), `test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`, `test-bandeiras`, `test-travessao-capitulos`, `test-links-base`, `test-portoes`, `test-procedencia`, `test-kael`, `validate-data`, `test-espelho` e `gen-bench-tempo --check`. O smoke eu não rodei.

## (a) Os buracos dos meus vereditos, mutados de novo no pino

Reexecutei **as mesmas mutações** que eu tinha rodado em cada rodada (os meus scripts, no arquivo de verdade, uma por vez, restaurado a cada vez, `git status` limpo), contra o teste de agora:

| Veredito | O buraco (passava) | Agora |
|---|---|---|
| 153, item 3 | "−1d6 acumulando" trocado por −2d6; "só corpo a corpo" removido da Rajada; "2 ataques para a Guarda" dos Punhos trocado por 1; "Esquiva 8" do exemplo da D-088 | **as quatro falham** |
| 154, item 4 | "Os punhos não barram o dano de arma nenhuma" invertido; "sem ela, o dano passa" removido | **as duas falham** |
| 156, itens 6 e 7 | `anatomiaDaFicha(w, {}) /* ... */`; sem o fallback; id sem a Velocidade; o arremesso e a distância lendo o tiro todo; o fallback aceitando a linha sem arma | **todas falham**; sobra só "não troca o ciclo" (mutante equivalente, o motor já devolve ciclo = Velocidade) |
| 157, itens 9 e 10 | "9 Ticks quando a ação passa a 10"; a frase final do parágrafo da Arte; "Esses Ticks são a Velocidade da conjuração" trocada por "de preparo" | **as três falham** |
| 160, item 13 | a tabelinha "Defesa zerada ou cego" removida da `mesa.astro`; Esquiva e Bloqueio trocados na renderização | **as duas falham** |
| 161, item 16 | o sinal de "À distância, alvo menor" trocado de − para + | **falha** |
| 162, itens 17 e 18 | o parêntese do "sem dobro" removido ou invertido; "Quem controla sofre as penalidades da Preparação"; o imobilizado que se solta sozinho | **todas falham** |

**O que continua passando, e é o que o plano não prometeu pinar:** na Rajada "só o Preparo é interrompível" invertido; "−2 em vez de −4" da dupla; "Haste média +2"; a exceção da Lança Longa; "a armadura funciona" da D-088; o "6 quando é 4" do callout "Os dois modos"; `reforma.arte.esticar.sinal` e a nota do custo (campos de dado que ninguém lê); e, em `regras.json`, a `defesaZerada.nota` e o `combateTatico.teto` (também sem leitor). Nenhum é dos 18 itens. Entram na sugestão 1.

## (b) O fallback de `ficha-pgr.ts`: os mutantes são do código real

**São.** O teste lê o **arquivo de verdade** (`ler('src/lib/ficha-pgr.ts')`), troca nele um trecho (`FONTE.replace(de, () => para)`) e **compila o texto mutado** (`carregarTSdoTexto(..., 'src/lib')`, com `src/lib` como diretório de resolução), não uma cópia escrita à mão. Duas guardas: `FONTE.split(de).length !== 2` acusa quando o trecho a mutar não casa uma vez só ("o teste de teste está torto"), então uma edição futura de `ficha-pgr.ts` quebra o teste em vez de silenciá-lo; e a asserção não tem condicional. São **14 casos**, com 4 por grupo (corpo a corpo, arremesso, distância, arma sem catálogo), mais **cinco mutantes**: sem o fallback, o casamento por id sem a Velocidade, o arremesso lendo o tiro todo, a distância lendo o tiro todo, e o fallback aceitando a linha sem arma. Eu mutei as **mesmas** no arquivo de verdade e **todas** falharam o teste inteiro. A Executora diz que a primeira versão não acusava os dois que leem o tiro todo, e que acrescentou o Shuriken a V7 e o Arco Curto a V5, que caem no motor: **foi o que eu tinha sugerido**, e agora ambos são acusados.

## (c) O "=" contra o "+=" do contador

**Não: os totais das rodadas 4d a 7 não estavam errados por causa disso.** Reconstituí pela história do arquivo (`git show <sha>:scripts/test-capitulo-armas.mjs`):
- `TOTAL_ARTE` nasce `0` (l.399) e o **primeiro** que o usa, na 4c (`b56d78f5`, l.701), fazia `=` no bloco da Arte. **Nenhum bloco anterior a ele somava em `TOTAL_ARTE`**: o bloco da ficha da 4d, que roda antes, entrava no total pela **constante `+ 3` fixa** no fim da conta. E os blocos seguintes (Defesa, 5; Porte, 6; Manobras, 7) já faziam `+=`. Então o `=` não apagou nada.
- O defeito só apareceria com o que a 8 acrescentou **antes** do bloco da Arte, os cinco mutantes do fallback (`TOTAL_ARTE += Object.keys(mutantesFP).length`, l.635): com `=`, o bloco da Arte os teria apagado. A Executora o pegou ao acrescentar, e trocou para `+=`.
- **Os números que ela relatou batem com o que o teste imprimiu em cada pino**, e eu os reproduzi um a um quando revi cada rodada: 60 (4d), 80 (4c), 100 (5), 104 (5-bis), 113 (5-ter), 131 (6), 141 (7), e hoje 165 = 141 + 19 novos + 5 mutantes. **Não há nenhum a anotar no plano.**
Observação: o total continua sendo uma **conta à mão** (`TOTAL_ARTE + ... + 2 + 7 + 1 + 9 + 13 + 9 + 3`), com constantes. Hoje fecha; se alguém acrescentar um estrago sem somar, o número imprimido envelhece calado. Sugestão 2.

## (d) `nomeDaChave` virou `nota`

`arcano.tempoDaArte.ultimoTick.nota` (onde a 157 apontou, e não em `combate.pgr.reforma.arte`, que a Executora e o Arquiteto também notaram). **Ninguém a lê:** a página só lê `ultimoTick.regra`, `.excecao`, `.porque`, `.tabela` e `.resumo` (`regras.astro:316-330`), o teste lê as mesmas, e `nomeDaChave` não resta em lugar nenhum (busquei em `src/`, `scripts/` e `docs/`). Apagar `nota` não faz teste nenhum falhar (mutação minha): é documentação. **A frase do Tick de decisão continua nos três lugares**: o parágrafo próprio de `regras.astro`, a última frase de `decisaoTardia` e `reforma.arte.esticar.nota` (conferi as três por texto).

## (e) `.ref-duas > * { min-width: 0; }` em `/mesa/referencia`

**Medi com a bancada** (`astro dev --config astro.bancada.mjs`, mesa `MESA_BANCADA`, Edge headless, `<details>` abertos): a 390 px, **a página mede 390 = 390** (era **494 contra 390** no `fd0058dc`, o que eu mostrei no 160), **sem erro de página**, e os poucos elementos que passam de 390 são só a barra de abas da mesa, dentro do próprio carrossel (a página fica em 390). A tabela do porte rola **dentro do `.tab-wrap`** (481 contra 368); a 1300 px, 1300 = 1300 e as tabelas não mudaram (1264). O pino no CSS existe: tirar a regra `.ref-duas > * { min-width: 0; }` **faz o teste falhar**. `/mesa` a 390 px segue em 390.
O defeito era o que a Executora diz: o item de grade tem `min-width: auto` e, com `overflow` visível, crescia até a largura da tabela. O conserto é de CSS da própria página, sem tocar o Grid.

## (f) A varredura, refeita

Minha, em `src/` e `scripts/` (sem `monsters*.json` e o bestiário):
- **"Dardos":** só em comentários e asserções de teste (`test-catalogo-distancia`, `test-combate-tempo`, `test-folha-arremesso`: "os Dardos saíram", "no lugar dos Dardos (D-076)"). **Nenhum "Dardos" no sentido da classe velha em texto de livro ou de dado.**
- **"±6" / "+/-6" / "+-6":** a régua social (`relacoes-sociais.md` l.89 e l.304, `regras.json` l.831), outro assunto; os comentários de `test-l64-velocidade` (sobre um teto ingênuo no Grid) e o próprio `test-capitulo-armas` (as asserções). **Nada de Defesa ou de porte.**
- **"teto de ±12":** nenhuma ocorrência. **"teto de 4 categorias"/`capCategorias`:** só `regras.json` (a `gridNota` e `capCategorias`), `calc.ts` e `test-bandeiras.mjs`, ou seja, o que o Grid lê (D-054, N22).
- **"Distância" no sentido velho:** a classe `distancia` do catálogo e o valor "Distância" da coluna Classe do Atirador; nenhuma coluna velha.
**O cartão do bench:** `gen-bench-tempo.mjs` e o `combate-tempo-bench.html` regerado trocam uma só frase ("O teto de ±6" por "O teto de +6 dos bônus de Defesa"), e o `gen-bench-tempo --check` passa. O HTML não tem mais "±6".

## (g) O "perícia" antigo do bench

**Confirmo que existe, e vira sugestão, não CORRIGE desta rodada.** Em `scripts/gen-bench-tempo.mjs` (l.236, e na página gerada): "Quem tem a mesma arma e a mesma **perícia** do atacante lê de graça", dentro do texto do cartão "a finta" (`REGRAS_TEXTO`). É **texto que o leitor vê**, mas o leitor é quem abre o `combate-tempo-bench.html` (a ferramenta de bancada do tempo, na raiz do repositório): **ele não está em `dist/` nem em `public/`**, então não vai para o site. A palavra do livro é "Habilidade"; a frase vem do cartão original (3c1492f9), anterior à reforma. As outras quatro ocorrências de "pericia" no HTML são a **chave** `"pericia":"armas"` dos dados do catálogo embutidos, não texto. A linha não foi tocada por esta rodada.

## Sugestões sem veredito (D-087)

1. **O que continua sem pino** (item (a)): a lista dos que o plano não prometeu. Os três com mais risco para o Mestre são "só o Preparo é interrompível" da Rajada, "−2 em vez de −4" da dupla e a exceção da Lança Longa; os de dado sem leitor (`defesaZerada.nota`, `combateTatico.teto`, `reforma.arte.esticar.sinal`) podem ficar sem pino.
2. **O total de estragos é uma conta à mão** com constantes: uma asserção de que o número impresso é a soma dos objetos de mutação evitaria o "=" de novo. Hoje fecha em 165.
3. **(g)** trocar "perícia" por "Habilidade" na frase do cartão da finta, quando alguém mexer no bench (é o único com o vocabulário velho).

## O que ficou sem medir (§9)

- **Mesa com Supabase de mentira**, Edge headless, 390 e 1300 px, só `/mesa` e `/mesa/referencia`; papéis e dados reais não exercitei. Medi com `getBoundingClientRect` e li o texto renderizado, sem capturas.
- **O smoke** eu não rodei. **Os documentos do Arquiteto** (`be553ee0`, `91547574`: Estados das D-072 a D-085, o T8 da fase de testes, o plano) **não revi**: o aviso pede só o commit da Executora-2.
- **A passada da Leitora-novata** da parte C não é minha e não a li.
- **Travessão, "Perícia" e coautoria:** nenhum nas 148 linhas adicionadas de `src/` e `scripts/` desde `91547574` nem na mensagem do commit.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/163-revisora.md` e `docs/simulacao/caixa/progresso-revisora-163.md`. Mutei `combate.md`, `armas-e-armaduras.md`, `regras.json`, `armas.json`, `ficha-engine.ts`, `ficha-pgr.ts`, `mesa.astro` e `referencia.astro` no lugar, um por vez, e os restaurei (`git status` limpo); subi o dev server da bancada na minha árvore (saída fora de `dist/` e `.astro/`) e rodei `npx astro sync` depois.
