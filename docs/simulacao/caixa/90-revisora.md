# Rodada 90 · veredito

Pino: `c88b93a` (aviso), faixa `6bb35a3..95505da`, só `src/`, `FRENESI.md` e os arquivos da caixa
citados no aviso. `lore/` fora. Passo 0 conferido: toplevel é a worktree da Revisora, HEAD
`c88b93a6efa7`.

**Veredito geral: PROCEDE, com dois CORRIGE (pequenos, não bloqueiam), três PERGUNTA e um apontamento
de livro contra código para a decisão do grupo 4.** Nenhum BLOQUEIA. O CORRIGE 2 foi rebaixado a nota
pelo que chegou ao `main` depois do pino (ver o Delta, no fim).

## 1 · O CORRIGE da 89 (`95e1e90`)

**Fecha o que eu pedi.** Bastão 0,25 kg, abaixo da Adaga 0,3 kg (`armas.json:1106` e `:9`), e a frase
de `leitura-de-novato-decisoes.md` passou a citar os dois números. O `combate-tempo-bench.html` foi
regenerado (conferido: o dado embutido do `bastao` tem `"peso":0.25`). O `.min(0)` da penalidade de
escudo entrou nos dois espelhos, `content.config.ts` e `validate-data.mjs`, alinhado com o de
armadura.

## 2 · Os números, recalculados sem aproveitar script de ninguém

Escrevi a convolução do zero (conversão `⌊s÷2⌋d6`, +2 se ímpar, soma 1 = 2 fixo; sucesso = total
maior que a Dificuldade; entrar = total igual ou menor) e conferi **todas** as tabelas do
`FRENESI.md`, não uma amostra: §2 (Virtude), §6 (entrar limpo, cedendo, resistindo), §7 (manutenção,
inclusive a coluna de renovações esperadas), §8 (sair com +1d6, e a do aliado). **Batem célula por
célula.** As frases do §3 corrigidas em `8151fe0` também batem (Firula 2 leva a Virtude 4 a 62% na
Dura; Firula 3, 56% na Extrema; Virtude 1 com Firula 2, 50% na Tensa e 17% na Séria), e as da §16
(Temperança 4 em Dificuldade 5: 28 / 83 / 5; sair com Temperança 4: 95 em 5, 50 em 10). As duas
tabelas que foram para o livro (`aparencia-virtudes-vontade.md`, a do §2; `racas.md`, a de entrar
limpo) são cópia exata das do `FRENESI.md`.

**Nota, sem consequência de jogo:** o arredondamento do 0,5 não é o mesmo nas duas pontas do
`FRENESI.md`. O §2 arredonda para baixo (Virtude 6: 62,5 vira 62 na Dura, 37,5 vira 37 na Severa, e
é essa a versão que foi para o livro); o §8 arredonda para cima o mesmo 62,5 (Temperança 4 em
Dificuldade 9, 3d6 > 9, aparece como 63). Um ponto percentual, e só no documento da raiz.

## 3 · O livro contra o `FRENESI.md` e a §16, regra por regra

Li a seção `## Frenesi` de `racas.md` inteira contra os §4 a §10 e a §16, e o §11 e §12 contra o que
ficou de fora. **Nada faltando que seja regra, nada inventado, nada da §15 sobrevivendo.** Conferi em
particular os cinco pontos do aviso:

- penalidade de ferimento opcional, na moeda de sempre, podendo zerar a parada, e parada zerada
  entra sem rolar: presente, e a exceção ao piso de 1d6 está também em `vida-ferimentos-cura.md`;
- Força de Vontade ±1d6, um ponto por teste, tirar também zera: presente;
- dois gatilhos forçados (20% da Vida num golpe, líquido depois da Absorção, acumulado não dispara;
  provocação importante por Influência com Habilidade livre contra FdV × 2 + Centelha): presentes;
- saída espelhando a entrada, +1d6 pelo ponto, Temperança limpa, Dificuldade da situação corrente,
  Crítico não bloqueia: presente;
- ressaca que nunca leva a Incapacitado, −1d6/−4 por estado além de Crítico, −3d6/−12 e −4d6/−16:
  presente, e a nota sob a tabela de `vida-ferimentos-cura.md` diz que o degrau só existe para ela.

Varri a seção por resto de versão velha (bônus de ferimento, "+2 pontos" da FdV, "automático",
"garante", "sem iniciar ataque", a régua 3/5/7, "Trivial", "Leve", a Consequência 2 do §8 antigo):
zero, lido com a ferramenta de busca sobre o arquivo e não sobre o diff. Travessão: zero nas linhas
novas dos três capítulos (o único de `vida-ferimentos-cura.md` é célula vazia de tabela, antiga).

Ficaram de fora do livro, e está certo que fiquem: o "sobe para 25%" (nota de calibração), as tabelas
de ceder, resistir, sair e do aliado, e o §12 (êxtase), que não é regra.

**Uma nota de redação, não CORRIGE:** o gatilho 3 do `FRENESI.md` é "ser **obrigado** a ficar parado,
preso ou contido"; o livro diz "ficar parado, preso ou contido". Não muda jogo, porque o orc que fica
parado por vontade já cai no gatilho 1 com a mesma janela, mas a palavra é o que separa os dois
gatilhos e custa uma palavra devolver.

**Links e âncoras**, conferidos no HTML gerado e não no Markdown: `id="frenesi"`,
`id="frenesi-contido"` e `id="o-teste-de-virtude"` existem, e os links de `racas.md`,
`vida-ferimentos-cura.md` e `aparencia-virtudes-vontade.md` saem todos com o prefixo
`/centelha-rpg/`. O build da minha worktree passou (exit 0), **mas o primeiro saiu sem os capítulos**
("The collection chapters does not exist or is empty", `dist/regras` ausente, exit 0 mesmo assim):
cache velho do `.astro` da minha própria árvore. Apaguei o meu `.astro`, reconstruí, 23 capítulos.
Registro porque o exit 0 com a coleção vazia é um verde que não conferiu nada.

## 4 · O `+2d6` de Intimidar do meio-orc

**A regra sustenta a leitura da Executora.** O `FRENESI.md` §4 dá ao Frenesi Contido "mesma restrição
de ações", o §5 ("O que a fúria dá e o que ela tira") é escrito para "a fúria" sem separar os traços,
e o §10 lista as diferenças do Contido (ferimento, −2 na Dificuldade, saída por Crítico, reentrada)
sem tirar o Intimidar. A seção do livro diz o mesmo ("o que se segue vale para as duas"). É um ganho
para quem joga meio-orc hoje, e a mensagem de `c5dd390` diz isso. Procede.

## 5 · CORRIGE 1 · o Resistir ainda cobre a dor do corpo, pela tabela logo acima

O aviso pediu que o Resistir não pareça cobrir as resistências do corpo. O `95505da` trocou "a dor que
pede para desistir" por "o desânimo" na frase do teste, e **a mensagem do commit e o relato afirmam
que com isso o texto não parece mais cobrir o Vigor + Convicção**. A afirmação não se sustenta,
porque a frase trocada não era o único caminho:

- o item diz: *"Resistir. Para aguentar uma pressão da alma, role **a Virtude que resiste a ela**,
  sozinha"* (`aparencia-virtudes-vontade.md:65`);
- a tabela do mesmo capítulo, vinte linhas acima, tem a coluna que responde qual é "a Virtude que
  resiste": **Convicção · Resiste… à dor, à tortura e ao desânimo** (`:43`), e o verbete diz que quem
  testa a Convicção é "o ferro em brasa" (`:53`).

Quem lê em ordem chega a "tortura e dor: Convicção, sozinha". A frase antiga dizia, com todas as
letras, "suportar a tortura = Convicção + Vigor", e saiu sem nada no lugar que diga onde a dor do
corpo foi parar. É `§8` do meu contrato: a rodada prometeu a fronteira por escrito, e o achado mostra
um caminho sem ela.

**Conserto, uma frase no item Resistir ou no parágrafo de abertura do teste:** dizer que o que pesa
no **corpo** (a dor física, o veneno, a doença, o sangramento) continua sendo **Vigor + Convicção**,
como no Estabilizar e nas Artes, e que o teste de Virtude é para o que pesa na alma. Onde a tortura
cai é a PERGUNTA 2, abaixo; a frase de fronteira não depende dela.

## 6 · CORRIGE 2 · um número do relato que vai para a decisão do humano

`90-executora.md:89-90`, na ordem de grandeza do "ficar parado": *"Bravura 4 sozinha é 2d6 contra 10,
17%"*. **2d6 maior que 10 é 3 em 36, 8%.** 17% é 2d6 contra 9. A primeira metade (Bravura 4 + Vigor 3,
3d6+2 contra 10, 74%) está certa. O erro subestima a queda (de 74 para 8, e não para 17), e é
exatamente o número que o humano vai usar para decidir a parada do Grid. Conserto: trocar 17% por 8%
na linha.

## 7 · PERGUNTAS

**PERGUNTA 1 · a definição de ação física deixa a Força de fora, e a seção nova lista ações de
Força.** `racas.md` define o +2 da fúria pelos testes "que rolam Vigor ou Destreza", citando
`vida-ferimentos-cura.md:36`, e na mesma frase dá como exemplos levantar peso, atacar e arremessar,
e justifica o arremesso por ser "força bruta". Pela letra, uma ação de Força não é ação física:
**14 das 33 armas de `armas.json` rolam Força** (Machado, Montante, Martelo de Guerra, Maça, o
**Machado de Arremesso** e o **Pilum**, entre outras), e levantar peso é Força (`FAH`). Isso quer dizer
que hoje, pela letra, nem a penalidade de ferimento nem o +2 da fúria valem para o golpe de machado.

A origem não é desta rodada: o escopo "Vigor ou Destreza" é da decisão da §4b
(`leitura-de-novato-decisoes.md:208`), e o `FRENESI.md` §5 e a §16 repetem a citação. A frase do
humano citada na mesma §4b ("todas as penalidades de dano entram nas ações físicas, o personagem está
com dificuldade de se mover") e o `coracao-do-sistema.md:57` ("Força, Destreza e Vigor são físicos")
sugerem que a Força ficou de fora por descuido. Por isso é PERGUNTA e não CORRIGE: consertar muda o
escopo da penalidade de ferimento para todo mundo, e isso é decisão. **Minha recomendação:** "as que
rolam Força, Destreza ou Vigor", nos dois capítulos e nos dois documentos.

**PERGUNTA 2 · a tortura cai de que lado.** A §14 manda trocar a linha antiga inteira, que tinha
"suportar a tortura = Convicção + Vigor", por "só Virtude"; o aviso desta rodada diz que as
resistências do corpo (Vigor + Convicção) continuam. As duas leituras são defensáveis (aguentar sem
falar é alma; aguentar o ferro é corpo), e o texto hoje não escolhe.

**PERGUNTA 3 · a Firula negativa é regra geral ou só do teste de Virtude, e ela devolve reserva?**
O livro a introduz no teste de Virtude e no Frenesi, e o capítulo de Habilidades, que é onde a Firula
mora, não a conhece. Lá a Firula de nível 2 devolve 1 de Força de Vontade (`habilidades.md:107`).
Se a negativa também devolve, o orc que descreve bem a própria entrega em fúria ganha Força de
Vontade por ceder, que é o oposto do que o ponto gasto para ceder custa.

## 8 · Livro contra código, por causa do grupo 4 (não cobrado como faltante)

O aviso pediu que eu dissesse onde. Confirmo a conferência 8 da Executora e acrescento a forma do
atrito:

- `src/lib/artes-grid-mesa.ts:1707` diz, em comentário, que os pares **Bravura + Vigor** e
  **Temperança + Raciocínio** são "os dois pares do capítulo III". **Desde `c5dd390` o capítulo III
  não tem mais esses pares**: o comentário cita uma fonte que deixou de dizer o que ele afirma, e o
  livro agora diz "sem somar Atributo nenhum".
- `regras.json:1995` (o texto do "ficar parado") pede "teste de Bravura ou Temperança" contra a
  Dificuldade da linha "metade" da área, que é da régua de 5 em 5 e vai de 10 a 25. Com a Virtude
  sozinha, que para em 18, as linhas de 20 e 25 ficam impossíveis, e o capítulo III diz que teste de
  Virtude tem régua própria. Ou o "ficar parado" continua somando Atributo e o capítulo precisa de uma
  exceção, ou ele passa à Virtude sozinha e a Dificuldade precisa sair de outra régua. É a pergunta
  que já está com o humano, e o CORRIGE 2 acima é o número dela.

A colisão da Técnica `frenesi` e do estado "em fúria" do Sangue Fervente (conferência 5 da
Executora) conferi em `tecnicas.json:1812-1927`: procede como ela descreveu, e está com o humano.

## Delta · o que chegou ao `main` depois do pino, e o que ele muda neste veredito

Ao publicar, `origin/main` tinha três commits além de `c88b93a`: `4336c16` (só `lore/`), `26f0d59`
(`91-despacho.md`) e **`a8ce2bc`**, que registra na §16 **quatro decisões do humano sobre o grupo 4**.
Nenhum dos três toca `src/` nem o `FRENESI.md`, então **todo achado acima continua valendo para a
árvore que eu julguei (`95505da`)**, e rebaseei (`§10` do contrato, terceiro caso). O que muda é o
estado de alguns itens, e digo qual:

- **§8 (livro contra código):** decidido. O "ficar parado" passa à Virtude sozinha contra metade da
  Dificuldade da área, arredondada para cima. Conferi os números da decisão do zero: Bravura 4 contra
  5, 72%; Bravura 4 + Vigor 3 contra 10, 74%; Bravura 6 contra 10, 50%; Bravura 6 + Vigor 3 contra 20,
  10% (9,7). Batem. O comentário de `artes-grid-mesa.ts:1707` que cita "os pares do capítulo III"
  precisa sair junto quando o código for tocado.
- **CORRIGE 2 (o 17% do relato):** continua errado no arquivo, mas **deixou de ser o número de uma
  decisão em aberto**: o humano decidiu com outros números, e certos. Rebaixo para nota; corrigir
  continua custando uma linha.
- **CORRIGE 1 (a fronteira do Resistir):** a decisão manda exatamente isso ("o capítulo diz quando é
  uma e quando é outra"). O CORRIGE fica de pé, agora com a decisão por trás.
- **PERGUNTA 2 (a tortura):** a decisão fixa a fronteira (alma: Virtude sozinha; corpo: Vigor +
  Convicção), mas não diz de que lado a tortura cai, e a tabela do capítulo a põe na Convicção. Fica
  aberta.
- A colisão da Técnica `frenesi`: decidida (a fúria racial não ativa as Técnicas "em fúria"; o nome
  fica nos dois, e o livro distingue).

## Limpeza

Nada foi revertido nesta rodada, então não há falsificação a desfazer. `git status --short` ao
fechar: só os meus dois arquivos da caixa. O `.astro` que apaguei é da minha worktree e não é
versionado.
