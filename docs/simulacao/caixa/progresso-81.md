# Progresso · rodada 81 · o furo do portão, a placa da quinta porta, e os 46 restantes

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `97a73a0`. Quatro itens: a entrada que falta na lista do portão de vocabulário, o
texto que a quinta porta não tem (`M-21g`), a conferência do `C-05` que virou falso positivo, e
a varredura dos 46 itens de tabela do `LOTE 8`, com denominador.

**A régua que veio junto, e vale para a varredura:** varredura de comportamento se faz pela
ESCRITA e não pelo NOME. Foi assim que a quinta porta apareceu (ela não se chamava cura em lugar
nenhum: era o "+" de uma barra), e é assim que a minha quarta tinha aparecido.

- **02:13** · começo. `HEAD` = `97a73a0`, árvore limpa fora o `jogador-novo-prompt-executor.md`.
  Os quatro arquivos CRLF foram renormalizados pelo Arquiteto: `git ls-files --eol` agora dá
  **zero**, conferido aqui.
- **02:13** · item 1 FEITO: `regras.json · arcano.cura` virou entrada do `ondeNaoPodeVoltar`. A
  falsificação DELA refeita: plantando "só alcança dano Letal a partir do nível 3" de volta no
  `outrasArtes`, o portão agora acende (`EXIT=1`, nomeando `regras.json · arcano.cura`), e sem o
  plantio fica verde. Restaurado, `diff` vazio.
- **02:14** · item 2 FEITO: a placa da quinta porta mora ao lado da ESCRITA que ela descreve
  (`combate.astro`, o `zPv` do Reiniciar), no tamanho do parágrafo do desfazer. Ela diz por que
  a porta é legítima (recomeço de cena, com relógio, condições e "fora de combate" na mesma
  passagem) e guarda a régua que a achou: varredura de comportamento pela ESCRITA, não pelo nome.
- **02:14** · e o `L99` do `docs/pendencias/L-simulacao-simultaneo.md` ganhou a correção junto, porque ele afirmava que as
  portas de interface estavam TODAS fechadas. Deixar a frase de pé seria manter no registro de
  itens abertos uma afirmação que a rodada 63 já falsificou.
- **02:14** · item 3 FEITO: a conferência do `C-05` passou a nomear o Bram
  (`grep "Bram tem **PV 37**"` = 0, medido) em vez de casar qualquer "PV 37". O falso positivo era
  meu: veio do exemplo de PV ímpar que a `M-21c` publicou no mesmo capítulo.
- **02:15** · item 4, os 46 do `LOTE 8`, medidos em cinco lotes de busca. Extraí as linhas de
  tabela por forma (`| C-nn (...) | ... |`) e conferi cada uma pelo texto que ela cita.
- **02:17** · segunda parte do inventário escrita: **8 FEITO, 38 ABERTO, 0 PREJUDICADO, 0 NÃO
  SEI**, soma 46. **E a divisão que importa mais que o número:** dos 38 abertos, 15 têm evidência
  DIRETA (o item cita um texto e o texto está lá) e 23 têm evidência NEGATIVA, que é mais fraca ·
  são os itens cujo defeito é uma frase que FALTA, e quem a tivesse escrito com outras palavras
  que as minhas continuaria contado como aberto. Está dito no arquivo, junto do número.
- **02:17** · denominador das duas partes: **99 itens · 21 FEITO · 78 ABERTO**.
