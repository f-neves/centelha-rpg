# Triagem do relatório do jogador novo

**O que este arquivo é:** a separação do relatório de 14/09/2026 em pilhas que pedem coisas
diferentes. **O que ele NÃO é:** um resumo do relatório. Os achados moram em
`docs/simulacao/caixa/jogador-novo-fase1.md` (as dúvidas, na ordem em que apareceram lendo o
site) e `jogador-novo-fase2.md` (o veredito de cada uma, com arquivo e linha). Aqui só a
ordem de ataque, e os números são as dúvidas daquele relatório.

**Por que a triagem existe.** São perto de 180 achados reais. O padrão mais caro registrado
nesta série (`ARQUITETO.md §4.2`) é exatamente esse: cada achado verdadeiro, nenhum movendo a
fila, a fase parada. O relatório vale como FILA, não como lista de tarefas, e a diferença entre
as duas é esta página.

**O escopo do relatório, dito porque ele mesmo o disse:** ela leu o site publicado inteiro na
fase 1, e na fase 2 leu `regras.json`, `calc.ts`, `site.ts`, `modulos.ts` e cinco JSONs
inteiros, mais os trechos que cada dúvida exigia. **Não abriu** `docs/simulacao/`, o
`Pendencias.md`, os testes, os geradores, nem os JSONs de monstros, técnicas, antecedentes,
preços e condições. Então a ausência de achado nessas áreas não é sinal de que estão limpas.

---

## Pilha 1 · CONSERTO DIRETO, sem decisão de ninguém

São os que a régua já desempata ou que são erro puro. Não precisam de você. Podem ir em lotes
para a Executora na ordem abaixo.

**Lote H1 · a causa única, e é o melhor negócio da lista.** Os **quinze links quebrados**
(dúvida 45) têm uma causa só: `rehypeBaseLinks` (`astro.config.mjs:69`) só visita link escrito
em sintaxe markdown, e os quinze estão em HTML cru dentro de `callout`. **Consertar a função
conserta os quinze e impede o próximo**; trocar os quinze `href` conserta os quinze e não
impede nada. A escolha entre as duas é minha e eu escolho a função.

**Lote H2 · os números que discordam e têm dono.** Os tetos da criação escritos duas vezes na
mesma página com números diferentes (22, 23, 24, 25, 119), a Centelha custando XP ou não no
mesmo arquivo de dados (73), as duas tabelas do capítulo IV com faixas diferentes para os mesmos
estados (65), o Bram com PV 37 no capítulo e 34 na ficha (66), as três raças que andam metade ou
dois terços (112, 94). **Em todos, uma das duas fontes tem jurisdição e a outra se corrige.**

**Lote H3 · o texto que mente na tela.** O `[object Object]` impresso no capítulo das Artes
(150), a nota da armadura "Nenhuma" dizendo que o Vigor defende de lâminas (197), a `/mestre`
mandando intimidação para a Defesa Mental (203), o rótulo da ficha cobrando Arte por `nível×10`
quando o motor cobra 15 (196), o Efeito custando 2× ou 4× (163), o glossário com piso 5 na
Vontade e 10 XP na Especialidade (133, 134). **Cada um é uma frase**, e todos são lidos no
momento exato em que alguém decide alguma coisa.

**Lote H4 · o Kael, e ele é maior que os outros três.** O personagem de exemplo tem números
diferentes em cada capítulo (97, 141, 86). Exemplo é onde o novato aprende a fórmula conferindo
a conta, então exemplo errado ensina errado. **E há um script quebrado no meio disto:** o que
existe para pegar o erro do orçamento do Bram imprime `NaN` em tudo (34). Consertar o script
vem antes de recustear à mão.

**Lote H5 · cosmético e vocabulário.** O parágrafo publicado duas vezes (82), os numerais de
capítulo contra o índice (144, 107), o `(Valor)` que é id de Virtude vazando para a prosa (9,
59, 99), Miúdo contra Minúsculo (115, 138), os anglicismos de bastidor na tela (75, 79, 156,
176, 187), "uma Técnica de um Proeza" (190). **Vale fazer junto e por último**, numa varredura
só.

---

## Pilha 2 · O QUE MUDA ONDE O CONSERTO VAI

**Antes de qualquer lote acima.** Dois capítulos são **gerados**, e conserto escrito por cima
deles morre no próximo regen. É a mesma forma que a rodada 58 achou no `gen-grid-artes.mjs`, em
outro lugar do repositório, e a lição já custou caro uma vez (`bestiario-centelha-b10`).

Quem pegar a pilha 1 confere primeiro se o arquivo que vai editar é fonte ou derivado. O
relatório diz quais são, na seção "Dois capítulos são GERADOS".

---

## Pilha 3 · OS BURACOS DE REGRA, agrupados

**São 53 vereditos (C) e NÃO são 53 perguntas.** Eles se agrupam, e um lote costuma fechar
vários. Esta é a ordem que eu levaria à mesa, do que mais trava um jogador para o que menos.

| lote | o assunto | dúvidas |
|---|---|---|
| **R1** | **As secundárias não dizem com que Atributo se rolam** · 66 entradas, e trava a ficha | 52, 54, 60, 70, 158 |
| **R2** | **Preparo, Golpe e Recuperação** · a regra existe no dado e em capítulo nenhum, e o capítulo IX usa o termo treze vezes | 81, 85, 162, 191, 193 |
| **R3** | **Quantos golpes uma ação rende** · capítulo diz um, dado diz três, ficha imprime três | 192, 111 |
| **R4** | **As raças** · sem porte não há PV; traços em prosa; o custo é o único número | 113, 114, 116, 117, 118, 120, 121 |
| **R5** | **Recursos que não voltam** · Força de Vontade, Energia Espiritual, Fôlego | 62, 53, 109 |
| **R6** | **Ferimento e cura** · penalidade é ponto ou dado, e Impacto sara mais rápido sem número | 68, 71 |
| **R7** | **Tempo** · turno, rodada e Tick são três unidades sem conversão | 69, 92, 105, 155 |
| **R8** | **Orçamento e tetos de XP** · inclui o teto de Atributo acima de 6 pela Centelha | 26, 27, 35, 76 |
| **R9** | **Equipamento** · recarga de besta sem Tick, requisito de Força sem consequência, armadura | 126, 199, 128, 46, 47, 124 |
| **R10** | **Artes** · a rolagem central não decidida, Trilhas, Escolas, e os 21 itens "Em revisão" | 146, 147, 153, 159, 160, 168 |
| **R11** | **Social** · a segunda vez impressiona menos sem número, assimetria ataque/defesa | 50, 173, 174, 182 |
| **R12** | **Combate, o resto** · o raspão, o que "Imobiliza" faz, atordoar sem Dificuldade | 80, 132, 187, 188, 86, 87 |

**O R1 e o R2 são os dois que eu levaria primeiro**, e por motivos diferentes: o R1 porque são
66 entradas e quanto mais tarde for decidido mais caro fica; o R2 porque sem ele não dá para ler
a coluna de nenhuma arma, e é a regra que já existe inteira no dado, então pode ser a mais
barata da lista inteira.

---

## O que eu NÃO recomendo

**Não abrir isto como frente única de "arrumar tudo".** Pilha 1 e pilha 3 têm donos diferentes
(Executora e você) e ritmos diferentes, e misturá-las faz as duas pararem. A pilha 1 anda sozinha
enquanto a 3 espera a mesa.

**E não tratar o relatório como fechado.** Ele mesmo declara o que não leu, e a lista é grande:
monstros, técnicas, antecedentes, preços, condições, e todo o bestiário. Zero achado ali é zero
por ausência de leitura, não por ausência de defeito · que é a primeira forma da tabela do
`CATALOGO.md`.

## O que fica aberto desta frente, e não é da revisão

A **rodada 59b** (os quatro gatilhos da família `armadilha`) está escrita e esperando em
`docs/simulacao/caixa/59-fila-de-aterrissagem.md`. Ela não compete com esta triagem: é a mesma
mesa, em fila.
