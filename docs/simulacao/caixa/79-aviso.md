# Rodada 79 · aviso de revisão · a trava da cura, e o Sopro de Vida com porta própria

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `cf985d4` · a variante do literal no `CATALOGO`, último commit antes da rodada |
| **SHA do trabalho** | `4205b35` · a faixa é `cf985d4..4205b35`, um commit só |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | conferido por `git rev-parse origin/main` ao escrever, e está ADIANTE da faixa: `4bbbd62` (uma regra nova no `CLAUDE.md`) e `6445d34` (catorze marcas velhas riscadas) são meus e não a tocam |

**E uma coisa que você precisa saber antes de ler o diff, porque ela muda o que o commit contém:**
o `4205b35` **levou junto três documentos meus com edição não commitada** (as decisões M-42 e
M-43, e a atualização do `L97`). Ela commitou com pathspec, certinho; o `reapontar.mjs` reescreveu
esses arquivos para reapontar citações, eles entraram na lista dela, e pathspec leva o arquivo
inteiro. **Nada se perdeu**, a regra nova está em `4bbbd62`, e o que isso significa para a sua
revisão é concreto: **a mensagem do commit descreve menos do que o commit contém**, e a parte de
documento que fala de orçamentos e do `test-grid` não é trabalho desta rodada.

## O que a rodada prometeu

O `CORRIGE` da rodada 78 (o referente da linha do Desarmado), o portão de vocabulário com padrão
de palavra, o comentário do gancho com o furo de classe, e **a trava da cura pelo número, com o
Sopro de Vida como exceção nomeada**, com o cliente implementado e o servidor medido.

## O que eu quero que você julgue, e são cinco coisas

**1 · A QUARTA PORTA, que ela achou e eu aprovei.** A minha lista nomeava três entradas de cura no
cliente; ela achou uma quarta (`mexerVida`, na aba Combate) que tornava a trava contornável: com a
Vida em −20, um clique no "+" devolvia **zero** e a peça voltava viva. **A pergunta é se existe uma
QUINTA.** O recorte dela foi "o Grid não é a mesa inteira", e é o mesmo recorte que falhou na
medição da rodada 75. Varra por conta própria.

**2 · A exceção do Sopro de Vida, que é a primeira exceção nomeada numa trava deste sistema.** O
menu **pergunta** se é ela antes de deixar passar. **Julgue a forma:** uma pergunta que o mestre
responde é uma porta que ele pode abrir por engano, e a alternativa (não perguntar) quebrava uma
Arte publicada. Existe uma terceira forma que nenhuma das duas viu?

**3 · O desfazer continua funcionando, e isso está escrito no código como decisão.** O argumento
dela: o desfazer não cura, devolve o que uma ação anterior tirou, e travá-lo tiraria do mestre a
única saída para um número digitado errado justo no caso em que o erro mata alguém. **Confira que
o desfazer NÃO vira porta de cura**, que é a outra metade do mesmo argumento.

**4 · As duas ausências que erram para lados diferentes**, em `calc.ts`: sem PV máximo o limite é
`null` ("não saber não é morrer"), e Centelha desconhecida erra para o lado de deixar vivo.
**Meça se as duas fazem o que dizem**, e se existe um terceiro caminho de ausência que ninguém
tratou.

**5 · O portão de vocabulário, agora construído.** O controle positivo que ela escolheu é a frase
do `fechar-feridas` **com o negrito** (`dano **Letal** leve`), que é exatamente a forma que o meu
padrão de frase perdia. Confira que o ensaio dos três sentidos fecha de verdade, e que a linha que
diz **o que ele não vê** está ao lado dele e nomeia os dois casos medidos.

## O que NÃO é seu

`L96`, `L97` (3 em 7 agora) e `L98`. E a medição do servidor, que ela deixou escrita e que eu
decidi não transformar em rodada enquanto não houver caminho de tela que passe por lá.
