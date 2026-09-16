# Progresso · rodada 79 · o portão de vocabulário, e a trava da cura

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `cf985d4`. Quatro itens: o referente que falta na linha do Desarmado, o portão de
vocabulário com padrão de PALAVRA (e os dois falsos positivos consertados onde nascem), o furo de
classe no comentário do gancho, e a trava da cura pelo número, com a exceção do Sopro de Vida.

- **01:39** · começo. `HEAD` = `cf985d4`, árvore limpa fora o `jogador-novo-prompt-executor.md`,
  que não é meu.
- **01:39** · a cor que eu devia, e ela é VERMELHA: run **35049813953** (`2f74e1d`, a rodada 78)
  fechou **completed failure**, e o único trabalho vermelho é o `Smoke · test-grid`, com as DUAS
  asserções do `L97`, conferidas no log e não presumidas: *"a peça saiu do lugar"* e *"mover custa
  de 2 a 7 idas ao banco (foram 0)"*. É a intermitência já registrada, primeira queda neste
  commit, então digo e sigo, sem investigar.
- **01:40** · item 1 FEITO: a linha do Desarmado ganhou o referente. Ela dizia "quem o pararia
  nele" e agora diz "quem pararia o Impacto nele, como o Inquebrantável", que é o nome que o
  `tecnicas.json` já trazia e esta linha não. Regra comprável se lê sozinha, no meio da briga.
- **01:40** · item 2 FEITO. Os sete catálogos de coisa comprável entraram no `ondeNaoPodeVoltar`,
  com padrão de PALAVRA, e os dois falsos positivos foram consertados onde nascem:
  `pele-adamantina` e `corpo-inospito` dizem "ambientes mortais". O comentário ao lado diz o que
  o portão NÃO vê, com os dois casos medidos nomeados (`imortalidade-tenue` e o `ultimo-suspiro`
  de antes da M-21e), porque garantia sem o limite ao lado é pior que nenhuma.
- **01:40** · ensaio: **vermelho hoje** foi medido na rodada 78, antes de eu reescrever nada (2
  casamentos em 6.235 campos, os dois "ambientes letais"); **verde** com os dois textos
  consertados, sem tocar no portão; e **vermelho de novo** com o controle positivo, que é uma das
  cinco frases antigas de volta · escolhi a do `fechar-feridas` com o NEGRITO (`dano **Letal**
  leve`), que é exatamente a forma que o padrão de frase perdia. `EXIT=1`, nomeando
  `tecnicas.json (regra comprável)`. Restaurado, verde.
- **01:40** · item 3 FEITO, e a contagem é minha e não herdada: `git ls-files` devolve **51**
  `.ts`/`.tsx` rastreados e **zero** fora de `src/` e `scripts/`, então o furo de classe existe e
  está vazio hoje. O `include` do `tsconfig.json` é `**/*`, então o `tsc` confere todo `.ts` e o
  padrão só dispara por duas pastas. Ficou no comentário, e não no mecanismo: caminho que não
  existe vira regra sem caso.
- **01:44** · item 4, a conta: `limiteDaMorte` e `passouDoLimite` entraram em `src/lib/calc.ts`,
  que é onde mora a matemática que vem do `regras.json`. Uma implementação só, para a trava, o
  portão e quem vier depois lerem a mesma conta. As duas ausências devolvem coisa diferente de
  zero: sem PV máximo o limite é `null` (não saber não é morrer), e Centelha desconhecida erra
  para o lado de deixar vivo.
- **01:45** · a trava no `curarPv` (o núcleo de cura do Grid), só para `quanto > 0`, porque com
  negativo esse mesmo caminho é o tique do Sangramento e travar ali impediria a MORTE.
- **01:45** · a porta do Sopro de Vida, e ela é reachable de verdade: a Arte Cura nível 6 não tem
  Efeito no tabuleiro, então o mestre a resolve pelo menu "Recuperar Vida". O menu agora pergunta,
  com o nome da Arte na frase, e só então chama com `atravessaMorte`. Sem essa pergunta a trava
  iria ao ar tornando impossível de jogar uma Arte publicada e comprável.
- **01:45** · `devolverVida` (o desfazer) fica FORA da trava, por decisão escrita no código:
  desfazer não cura, devolve o que uma ação anterior tirou, e travá-lo tiraria do mestre a única
  saída para um número digitado errado, justo no caso em que o erro mata alguém.
- **01:45** · as asserções da conta entraram no `test-bandeiras.mjs`, que já é portão e já
  importava o `calc.ts`: teste novo nasceria fora da matriz do CI. Onze asserções, com o par
  (passa/não passa) e o caso que só a M-21c distingue. Controle negativo: trocando o lado no
  `regras.json`, a asserção do PV ímpar fica vermelha e só ela.
- **01:47** · **uma QUARTA entrada de cura no cliente, que a lista da rodada não nomeia**, e ela
  torna a trava do Grid contornável: `mexerVida` (`combate.astro`) prende a Vida em
  `Math.max(0, …)`, então um clique no "+" com a Vida em −20 devolvia ZERO e ressuscitava a peça
  num gesto. Travei também ali, com `delta > 0` e a Centelha indo como desconhecida (a aba não
  monta perfil por peça). Se o alcance não for teu, é um `if` para reverter.
- **01:48** · o `test-l86a-cura.mjs` ficou vermelho, e o código estava certo: a asserção procurava
  `Math.min(c.pv_max` dentro de **400 caracteres** depois do `const curarPv`, e a trava entrou no
  meio. Ela media a DISTÂNCIA entre duas linhas, e o que ela quer dizer é "o teto mora dentro
  desta função". Passou a recortar o corpo da função e procurar ali dentro.
- **01:49** · `reapontar.mjs` rodado UMA vez (a régua do `CATALOGO`: ele calcula deslocamento, e
  a segunda passada aplicaria o mesmo delta de novo): **94 citações movidas**, 20 puladas por
  serem históricas, e o `--check` antes confirmou que os 12 documentos do portão estão cobertos.
  `npm run validate` verde depois, e `npx tsc --noEmit` verde antes.

## Item 4b · o custo da trava no SERVIDOR, medido e não construído

**A única entrada de cura que mora no banco é `jogador_muda_peca`**
(`supabase/migracao-22.sql`, a função que escreve `pv_atual` absoluto vindo de um jsonb, sem piso
e sem teto). O `jogador_dano` só baixa, e o `jogador_invoca` cria. Conferido varrendo `pv_atual`
em `supabase/*.sql`.

**O que falta lá dentro:** o limite precisa de `pv_max` (que está na mesma linha da mesma tabela)
e do LADO DO ARREDONDAMENTO, que depende da Centelha. **`combatentes` não tem coluna de
Centelha.**

**As quatro saídas, com o preço de cada uma:**

| saída | custo | o que se compra e o que se perde |
|---|---|---|
| **coluna `centelha` em `combatentes`** | migração de esquema + 3 pontos de escrita que criam peça + linhas velhas nascem nulas | o servidor fica igual ao cliente, e o backfill de peça já em jogo não existe |
| **parâmetro na RPC** | `create or replace function`, sem esquema novo | o cliente já sabe a Centelha, mas o cliente é do JOGADOR: dá para mentir, e o que se ganha mentindo é **1 ponto de Vida, só em PV ímpar** |
| **o servidor usa sempre o lado permissivo** | uma linha na RPC | zero Centelha e zero migração; o preço é o servidor discordar do cliente em 1 ponto para um mortal de PV ímpar |
| **o servidor lê a ficha** | um join, sem esquema novo | `personagens.ficha->>'centelha'` existe e alcança peça de PC; **não alcança criatura**, porque `monstro_id` é texto e o bestiário não está no banco, então criatura cairia no lado permissivo de qualquer jeito |

**E o tamanho do buraco, dito com o escopo:** as travas que eu pus hoje cobrem QUATRO portas de
interface (o menu do mestre, as Artes e os botões de Vida da aba Combate), mais o desfazer, que
fica aberto de propósito. A RPC continua aceitando `pv_atual` absoluto de quem a chamar direto.
Nenhum caminho de tela do jogador passa por ela para curar hoje, então o que está aberto ali é a
chamada fabricada, e não um botão.

> **CORRIGIDO EM 16/09/2026, E É A SEGUNDA CORREÇÃO DA MESMA FRASE.** A redação original dizia
> que as travas cobriam "as portas de INTERFACE", no plural fechado, e isso era falso: a Revisora
> achou uma QUINTA (o botão **Reiniciar** com a caixa "zerar PV", em `combate.astro`, que escreve
> `pv_atual = pv_max` em todas as peças de uma vez, mortos inclusive).
>
> **A primeira correção trocou uma afirmação falsa por outra mais estreita**, e ela era minha:
> escrevi, no `L99` e na placa do código, que a porta era legítima porque vinha acompanhada de
> zerar relógio, limpar condições e devolver quem estava fora, no mesmo clique. **O Reiniciar tem
> SEIS caixas independentes, CINCO marcadas** (`combate.astro`; a sexta, "apagar o registro",
> nasce desmarcada): desmarcando as outras quatro do pacote, o clique devolve a Vida cheia de
> todo mundo, **e a Energia junto**. O "vem acompanhada" era o PADRÃO DA TELA, não uma
> necessidade do botão.
>
> **E a Energia é a segunda correção, de 16/09/2026:** as duas primeiras redações escreveram que
> a escrita "não faz mais nada", e ela faz · `energia_atual = energia_max` está no MESMO `if`,
> sem caixa própria. A régua tem dois lados e eu tinha usado um só: vizinho em `if` próprio é
> opcional, vizinho no MESMO `if` é obrigatório.
>
> **O que esta frase pode afirmar hoje:** existe uma quinta escrita de Vida na interface, ela não
> passa pela trava, e **se ela é legítima ou não é pergunta aberta na mesa (`M-21h`)**. Nada aqui
> decide isso, e este arquivo não é o lugar onde se decide.
