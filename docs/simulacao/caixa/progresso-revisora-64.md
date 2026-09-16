# Progresso da revisora · rodada 64 dela, rodada 81 do projeto

Reancorada em `317ae7495283c6bcffa69625ce826dc1d5f3063b` (o sha do aviso), conferido por
`git rev-parse HEAD` na worktree `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`, e ele
bate com `git rev-parse origin/main`. Árvore limpa antes e depois do checkout. Hora lida da
máquina.

- 02:20 · reancoragem terminada em `317ae74`, vinda de `db5179b` (a ponta da rodada 79, cujo
  conteúdo está no `main` como `532bc80`). Passo 0 do contrato fechado.
- 02:21 · Q1: a placa afirma que a devolução de Vida "vem acompanhada de zerar o relógio, limpar
  as condições e devolver quem estava fora, na mesma passagem e no mesmo clique". MEDIDO no
  diálogo (`combate.astro:257-262`): são CINCO caixas independentes, todas marcadas por padrão.
  Desmarcando as outras quatro e deixando só "restaurar a Vida ao máximo", o clique devolve a
  Vida cheia de todo mundo, mortos inclusive, sem recomeço nenhum. A placa descreve a decisão,
  e a decisão foi tomada sobre um pacote que o mecanismo não obriga.
- 02:22 · Q3: o recorte novo tem o MESMO defeito, medido. `regras.json` tem 35 blocos de topo e
  o portão vigia três mais um sub-bloco. Plantei "Cortante e Perfurante sao Letal" em `dano.nota`
  (o bloco que DEFINE os modos, o lugar mais provável de a regra velha voltar) e o portão ficou
  VERDE. Restaurado.
- 02:22 · Q2: sobrou eco, e no documento para o qual o próprio L99 corrigido aponta
  (`progresso-79.md:88`). E a correção do L99 repete a premissa da placa ("vem com zerar relógio,
  limpar condições e devolver quem estava fora, no mesmo clique"), que é o que a Q1 falsifica.
- 02:23 · Q4: amostrei CINCO dos 23, procurando pela ideia. `C-68`, `C-79`, `C-72` e `C-83`
  conferem como abertos. O `C-70` está PARCIALMENTE resolvido: `habilidades.md:70`, que é o
  capítulo II (`numeral: "II"`), diz "o Atributo (Destreza ou Força)". O item afirma que o
  capítulo II nunca junta as duas metades, e ele junta uma: diz que são os dois, não diz que a
  escolha é de quem ataca.
- 02:24 · veredito escrito: PROCEDE, com três CORRIGE. Falsificação do item 3 desfeita, árvore
  conferida limpa.
