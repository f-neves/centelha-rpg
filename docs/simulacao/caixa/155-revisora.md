# 155 · Revisora · A conta do tempo da Arte, antes da 4c (pedido do Arquiteto, plano `e5ab6925`)

Não é revisão de sha: é a conferência da conta que o plano trava ("a Executora só escreve depois de a Revisora refazer a conta e confirmar"). Pino de leitura: `main` em `e5ab6925`.
Fontes lidas: D-082 e D-084 (`decisoes.md`), `veterana-2b-reforma-pgr.md` §0, §2, §3 e §4 item 7 (em `tmp/veterana/`), o plano (rodada 4c, "Fonte e conta do tempo da Arte"),
`regras.json` (`esticar`, `tempoDaArte`, `feiticoTicks`, `combate.pgr`), `combate.md`, `artes/regras.astro`, `combate-tempo.ts`, `artes-grid.ts`, `grid.astro` e os testes que tocam a Arte. Não escrevi em `src/`.

**Resultado: a conta está certa, para V5, V6 e V7, em qualquer número de ciclos, e a hipótese "só o ciclo final leva Recuperação" é coerente com a Defesa e com o custo `2 × Velocidade + 2`, com uma condição de redação (item 3).** O plano deixa de listar seis lugares com número ou frase que a conta muda (item 5) e um conflito de dados que já existia e que a 4c não deve "consertar" sozinha (item 6).

## 1 · Os números, refeitos

Ticks contados de 1, como o capítulo das Artes conta. D-082: Preparo = V − 1 − R, Golpe 1, Recuperação 1 (Arte). Logo Preparo = V − 2 e o Golpe cai no Tick **V − 1**.

| Velocidade (grau investido) | Preparo | Golpe no Tick | Recuperação no Tick | Sinal anunciado (Preparo + Golpe) | Defesa aberta, custo `2V + 2` |
|---|---|---|---|---|---|
| 5 (graus 0 a 3) | 3 (Ticks 1 a 3) | **4** | 5 | **4** Ticks | 12 |
| 6 (grau 4) | 4 | **5** | 6 | **5** | 14 |
| 7 (graus 5 e 6) | 5 | **6** | 7 | **6** | 16 |

Isto confirma "4 a 6" (era 5 a 7) e "uma conjuração de 7 Ticks acontece no sexto" (2b §3, D-084). O `feiticoTicks` e o texto de `artes/regras.astro:59` (5, 6, 7 por grau) **não mudam**: a Velocidade segue a mesma, só o Tick do efeito recua um.

**Esticar.** O esticar multiplica a Velocidade (`esticar.speed`: "CADA nível acima soma outra vez a Velocidade"; `esticar.tabela` dá ×1, ×2, ×3, ×4 para 0 a 3 níveis acima). Com T = n × V no ciclo n, o Golpe cai no Tick **n × V − 1**:

| V | n = 1 | n = 2 | n = 3 | n = 4 (3 níveis acima, o máximo da tabela) |
|---|---|---|---|---|
| 5 | 4 | 9 | 14 | 19 |
| 6 | 5 | 11 | 17 | 23 |
| 7 | 6 | 13 | 20 | 27 |

**Os seus números conferem** (V5: 4, 9, 14; V6: 5, 11, 17; V7: 6, 13, 20). Os "4, 9, 14" do 2b valem para a V5 e são literais da fonte (§3: "4, 9, 14, e não 5, 10, 15"); V6 e V7 são extensão, mas a extensão **não precisa de regra própria**: é a mesma fórmula da D-082 aplicada à Velocidade esticada T. Com T = 10, o Preparo é T − 2 = 8, o Golpe cai no 9 e a Recuperação no 10; com T = 15, 13, 14 e 15. Acrescentei a coluna n = 4, que o plano não tem e que a tabela do esticar permite.

## 2 · "Só o ciclo final leva Recuperação" é a fonte, não é extensão

A frase está no 2b §3, última linha do parágrafo do esticar: "Só o ciclo final leva Recuperação." Não é hipótese do Arquiteto. E é a leitura que fecha com os dados: o `esticar.speed` diz que a Velocidade da ação passa a 10 e 15, ou seja, **uma ação de 10 Ticks com uma Recuperação só**, não duas ações de 5.

## 3 · Coerência com a Defesa e com o custo do Normal

- **Custo.** Aplicando a D-082 à Velocidade esticada T = n × V: Preparo T − 2 Ticks a −2, Golpe a −4, Recuperação a −2. Soma = 2(T − 2) + 4 + 2 = **2T + 2**, igual ao `2 × Velocidade + 2` do Normal (V5: 12, 22, 32, 42; V6: 14, 26, 38, 50; V7: 16, 30, 44, 58). Bate com o 2b §2 ("a Recuperação da Arte cobra −2, como qualquer ataque; 12 para a Velocidade 5").
- **A condição, que é de redação.** A conta só fecha se os Ticks de decisão dos ciclos intermediários (4, 9, 14 na V5, exceto o do ciclo em que a Arte de fato sai) contarem como **Preparo (−2)**, não como Golpe (−4): lá o efeito não saiu, não houve ataque. Se um leitor contar −4 em cada Tick de decisão, o custo sai maior que `2T + 2` (mais 2 por ciclo intermediário). O 2b não diz isto; o texto da 4c deve dizer uma frase: *"só o Tick em que a Arte sai é Golpe (−4); o Tick em que você decide esticar ainda é Preparo (−2)."*
- **A Recuperação do ciclo de decisão.** Quem segura no Tick 4 da V5 (não solta) **não tem Recuperação no Tick 5**: esse Tick é Preparo do ciclo seguinte, a −2, o mesmo número da Recuperação. Defesa idêntica, e o ciclo seguinte segue até o Golpe no 9. Não há contradição.
- **O Normal.** "A Arte rola e produz o efeito no Tick do Golpe (V − 1, ou n × V − 1)", e o último Tick da Velocidade é de Recuperação a −2. A frase de `combate.md:131` ("Não há um Tick isolado de Recuperação: a Velocidade inteira empurra a...") convive: a Recuperação é a da Velocidade, não um tipo de Tick à parte; ao reescrever a exceção da Arte, ler o resto do parágrafo junto.
- **O sinal esticado.** "4 a 6 Ticks" vale para a conjuração sem esticar; esticada, o sinal dura T − 1 (9, 14...). A frase deve dizer "pela Velocidade, menos um".

## 4 · O que a conta NÃO muda (conferido)

As contas por metro e a Dificuldade do desvio (`ticksPorMetro` 1, `difBase` 5, `difPorMetro` 5) são por Tick gasto e não dependem do Tick da saída. "Sustentar cobra a cada 6 Ticks, mesmo quando a conjuração levou 5" (a janela é da Duração). "A Labareda de 12 Ticks fere no 6º e no 12º Tick **depois de sair**" (conta a partir da saída). Os preços e os graus (`feiticoTicks`, `esticar.tabela`, `esticar.exemplo`, `regras.astro:490`: V5, 10, 15) ficam iguais. A Velocidade de `combate.md:60` ("5 a 7") também fica. Concordo com o 2b: o que perde 1 Tick é a janela de sair do caminho (quem ainda não agiu).

## 5 · Lugares que a conta muda e que o plano não lista

O plano lista `combate.md` l.95 e l.131, `regras.astro` l.315 e l.492, `regras.json` l.1909 a 1924, l.2096, l.2385 e o `combate.pgr` congelado. Faltam:

1. **`src/pages/artes/regras.astro:59`**, o callout "Os dois modos": "Esses Ticks são de preparo, e a Arte sai no **último** deles, ao contrário da ação comum". O 2b §4 item 7 lista "o texto dos dois modos", mas o plano não dá a linha. É o primeiro texto que o leitor encontra sobre o tempo da Arte.
2. **`src/data/regras.json:1929`** (`identificar.teste`): "No primeiro Tick o sinal é um arrepio no ar; **no último** é uma bola de fogo pronta na mão." O último Tick do sinal passa a ser o do Golpe. Está fora do intervalo 1909 a 1924.
3. **`src/data/regras.json:1942`** (`area.deslocamentoLivre.semGabarito`): "Como a mira e a forma **só travam no último Tick**..." e "a mesa não precisa de gabarito desenhado **durante os sete Ticks**". Com a conta: trava no Tick do Golpe, e o grau 6 (V7) tem **seis** Ticks até lá (5 de Preparo e o Golpe), não sete.
4. **`src/data/regras.json:1920`** (a linha da tabela "Último Tick, quando sai") está dentro do intervalo do plano, mas o **nome da chave `ultimoTick`** (`TEMPO.ultimoTick` em `regras.astro:315-330`, cinco usos) é lido pela página: se a 4c renomear a chave, tem de trocar a página junto.
5. **`combate.md:60`**, "5 a 7 (esticada: 10 em diante) ... esticar a conjuração a leva a 10, 15, 20 e adiante": o "10, 15, 20" só vale para a V5; com a V6 são 12, 18, 24 e com a V7, 14, 21, 28. Já era assim antes da 4c, não é consequência dela, mas a 4c vai escrever "regra geral mais exemplo da V5" e é o momento de arrumar a frase ("a Velocidade, duas, três e quatro vezes").
6. **O Grid.** Ele resolve a Arte no último Tick: `grid.astro:11500` a `11520` (`declararTempo`: Preparo `ticks − 1`, Golpe 1, **Recuperação 0**, ciclo `ticks`), os comentários e a conta de `artes-grid-mesa.ts` (l.887, 1390, 1507), `artes-grid.ts:1594` e `test-artes-grid.mjs:949-977` ("sai no 8, que é o último Tick da montagem", V6 declarada no Tick 3). **A N22 deve ganhar um bullet** (a Arte sai no Tick do Golpe no livro e no último Tick no Grid, sem Recuperação), e a 4c **não pode tocar** nessas linhas (D-054; o teste as pina).

## 6 · Um conflito de dados que a 4c não deve "consertar" sozinha

A Velocidade da Arte tem **três escalas diferentes no repositório**, e só a primeira é a da D-082:

1. **Livro e `feiticoTicks`:** 5 para grau 0 a 3, 6 para o grau 4, 7 para 5 e 6; esticar soma a Velocidade (×1 a ×4). É a base da conta acima.
2. **`regras.json:2159` (`arcano.efeitos.ticks`) e `artes-grid.ts:395`:** "4 + nível do Efeito + 1 por grau que qualquer parâmetro passe do nível dele". Para Efeito Especial de nível 4 a 6 dá Velocidade 8 a 10, **acima do teto 7 da D-082**, e o esticar soma **1** por grau, não a Velocidade. Nenhuma página do livro renderiza esta linha; só o Grid a usa.
3. **`combate.pgr.arte` (`cicloBase` 3, `cicloPorNivel` 1) e `reguaDaArte`:** ciclo = nível + 3 (grau 6: 9 Ticks, `test-combate-tempo.mjs:358` fixa "Preparo 8, ciclo 9"). Só o teste a chama; o Grid de verdade usa a caixa de conjuração.

Isso **não afeta a conta** (ela usa a escala 1, que é a do livro), mas a Executora não deve unificar nada: a unificação é da passada do Grid (D-054) e da recalibração das Artes (A34, D-061). Sugiro um bullet no N22 ou no A34 com as três. Pergunta nenhuma ao autor por ora (D-087): é conflito de dado entre o livro e o motor congelado, do tipo que a "passada única" resolve.
Fora de escopo e **a não tocar**: `economiaPoderes.ticksIndependente` (`regras.json:1220`, os mesmos 5, 6, 7) é o tempo das Técnicas independentes, não o da Arte. A D-082 e a D-084 não falam delas.

## 7 · Resumo para a Executora (o que escrever, na ordem)

1. A regra geral: *"A Arte sai no Tick do Golpe, o penúltimo da Velocidade (Velocidade menos um); o último é de Recuperação."* Com o exemplo: V5, Preparo nos Ticks 1 a 3, Golpe no 4, Recuperação no 5; V7, Golpe no 6.
2. A linha da tabela de P/G/R (`combate.md:95`) em três linhas (V5 3/1/1, V6 4/1/1, V7 5/1/1), e a frase do Normal (`:131`) para "no Tick do Golpe".
3. O esticar: o Golpe de cada ciclo é o Tick `n × V − 1`; "a Recuperação vem só no fim"; "o Tick de decisão é Preparo (−2); só o Tick em que a Arte sai é Golpe (−4)". Exemplo da V5 (4, 9, 14), e dizer que as outras Velocidades seguem a mesma conta.
4. Os cinco textos que o plano não lista (item 5, números 1 a 5) e o bullet do N22 (item 5, número 6).

## O que ficou sem medir (§9)

- **Não simulei** a conta Tick a Tick no motor (o Grid está congelado e usa outra escala); refiz à mão e com um laço de aritmética (a tabela do item 1 sai dele).
- **Não conferi** se o texto do bestiário (criaturas com Arte, `combate.pgr.preparo.arte`) fica coerente; ele segue o Grid.
- **Não li** o `veterana-2e` nem outro documento da Veterana além do 2b; a conta depende só do 2b §3 e da D-082/D-084.
- **A leitura de `regras.json:1929` e `:1942` e de `regras.astro:59` foi do arquivo-fonte**, não do HTML gerado.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/155-revisora.md` e `docs/simulacao/caixa/progresso-revisora-155.md`. Nenhum arquivo de `src/` foi tocado.
