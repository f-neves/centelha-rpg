# Pendências do Centelha · mapa geral

> Foto de **2026-08-17**. Índice único de tudo que está aberto, em todas as frentes.
> Cada item diz **o que falta**, **onde mora o detalhe** e **o que ele trava**. Quando um item
> fecha, marque a caixa e registre a decisão no doc da frente, que é a fonte de verdade.
>
> **Código:** cada item tem uma sigla estável (A1, B2, …) para chamar pelo nome na conversa.
> **[DECIDIR]** = precisa da sua palavra, não dá para adivinhar.
> **[FAZER]** = já decidido, é trabalho de execução.
> **[AUTOR]** = frente de escrita sua, não minha.

**Placar:** 67 itens abertos · 33 [DECIDIR] · 29 [FAZER] · 5 [AUTOR]
Por frente: **Arcano 18** · **Bestiário 9** · Mesa 9 · Lore 6 · Ações & Sistema 5 · Proezas 5 ·
Trilhas 4 · Arremesso 4 · Infraestrutura 4 · Social 3

> **Mesa, 2026-08-12:** fechou **I7** (névoa de guerra) e entraram **I9** (caderno de melhorias do
> tabuleiro) e **I10** (as pontas soltas do jogador agindo). O detalhe das duas mora em
> `Grid_melhorias.md`.
>
> **Placar recontado em 2026-08-17.** Ele dizia 60 e vinha de antes de três mudanças: as Artes
> fecharam **A12** (o Metal virou bloco de Efeitos de Terra) e **A17** (o chão se compra por molde)
> e abriram **A13** a **A16**; a Mesa fechou o **I7**; e a frente **J · Infraestrutura**, aberta em
> 15/08, nunca tinha entrado na linha de frentes, apesar de ter quatro itens. A contagem sai do
> próprio arquivo: uma linha por item com a caixa vazia.

---

## A. Arcano · As Artes

Detalhe em `Arcano_revisao.md` §10. O que já está fechado está no site (`/artes/regras`,
`/artes/efeitos`, `/artes/catalogo`) e em `regras.json → arcano`.

- [ ] **A1 · [DECIDIR] Guardar um feitiço: os limites.** A regra base está no site (paga o Mana na
  hora, Raciocínio conta um nível abaixo e −1d6 nas rolagens enquanto carrega). Falta: a penalidade
  **acumula** por feitiço guardado? Há **teto** de quantos dá para carregar? O feitiço guardado
  **vence** com o tempo?
- [ ] **A2 · [DECIDIR] Focos das Artes não elementais.** As sete rascunhadas estão no site. Falta
  dizer quais outras Artes ganham foco e, principalmente, **como se mede a abundância** de um foco
  que não é elemento (um baralho de tarô não tem volume como um rio tem).
- [ ] **A3 · [DECIDIR] O desconto da fonte pode passar de +1?** Hoje é fixo. Fica registrado que
  lugar sagrado do elemento, estação do ano ou um pacto poderiam aumentá-lo.
- [ ] **A4 · [DECIDIR] Rituais.** Ritual já é o modo lento de conjurar (troca Mana por tempo e
  Vontade). Falta: a regra antiga de "metade do Mana no Ritual" **morre de vez**? Existe **algum
  Efeito que só funciona no modo lento** (o círculo de invocação, por exemplo)?
- [ ] **A5 · [DECIDIR] Clarão Cegante.** Ficou **sem Dificuldade** por ora: quem está na área e
  olhando sofre a Penalidade, sem rolagem. Confirmar assim ou dar uma resistência.
- [ ] **A6 · [DECIDIR] O campo `escalonavel`.** Órfão desde que os níveis dos Efeitos viraram
  fixos. Ou vira `sucede` (comprar a Fenda por cima do Terremoto pagando a diferença), ou some do
  schema.
- [ ] **A7 · [AUTOR] Treze Efeitos elementais ainda sem número**, e **Fogo, Raio e Luz não têm nada
  de nível 1**. Sua frente de revisão dos elementais.
- [ ] **A8 · [FAZER] Revisar em mesa a primeira leva** dos Efeitos das Artes não elementais: os
  números e os limites saíram no papel e não passaram por jogo.
- [ ] **A9 · [FAZER] O Efeito Especial no bestiário.** Na ficha ele já tem lugar; falta decidir
  como uma criatura carrega Efeitos no stat block.
- [ ] **A10 · [FAZER] Abertura do capítulo para iniciante.** As seções 2 a 4 do `Arcano_revisao.md`
  (o que a feitiçaria é) ainda não viraram prosa no site.
- [ ] **A11 · [FAZER] Revisar as seções 3 e 4 do `Arcano_revisao.md`** quando a rolagem por Tradição
  fechar (C1): hoje elas ainda dizem "Ocultismo + Atributo".
- [x] **A12 · [RESOLVIDO 2026-08-15] Metal não vira Arte.** Passa a ser um **bloco de Efeitos de
  Terra** aberto por **Trilha**: os verbos dele são coisas que se fazem com equipamento (e coisa
  que se faz é Efeito), não tem dano nem parâmetro próprio, e a tabela de estado já o põe junto da
  Terra em "sólido, metade". Falta escrever os Efeitos, o que é conteúdo e cai na A15.
- [ ] **A13 · [AUTOR] Revisar Área × Volume.** **Encaminhado pela A17**, que separou os dois de vez:
  chão é molde, matéria é Volume. O que sobra aqui é a escada de Volume em si, e a leitura de que
  ela está calibrada como massa (169 kg de pedra no grau 3, 10,8 t no grau 6) e não como chão.
  O parâmetro inteiro está em revisão pelo autor.
  Tudo que foi calibrado contra ele depende do resultado: a escada de Volume (lado 2 cm · 10 cm ·
  25 cm · 50 cm · 1 m · 1,5 m · 2 m), a tabela de **estado da matéria** (sólido metade, granular
  normal, líquido normal, fenômeno dobro, gás oito vezes), o teste de que o Volume cabe embaixo da
  Área do mesmo grau, e o corte entre **corpo** (Volume) e **jurisdição** (Área).
- [ ] **A14 · [FAZER] Revisar os textos de Regras das Artes** (`/artes/regras`, capítulo XV). O
  capítulo cresceu por acréscimo em várias conversas seguidas (grau 0, as três travas do improviso,
  Área ou Volume, estado da matéria) e precisa de uma passada de edição: ordem das seções, o que
  ficou repetido e o que ficou sem explicação de por quê.
- [ ] **A15 · [AUTOR] Revisar as descrições de nível das Artes** em `artes.json`, conforme os
  Efeitos Especiais e os Parâmetros de hoje. Vários níveis ainda descrevem improvisos que as travas
  não permitem mais: Fogo 3 "sustentar uma parede baixa de chamas", Fogo 4 "parede de chamas
  fechando um corredor" e "explosão que pega quatro inimigos juntos". Os seis níveis de cada Arte
  deixaram de ser regra e passaram a ser **exemplo de alocação típica**, e o texto ainda não sabe
  disso.
- [x] **A17 · [DECIDIDO 2026-08-15] O chão se compra por MOLDE, e cada molde tem régua.** Detalhe
  em `Arcano_revisao.md` §5.3. O problema era que uma régua métrica solta mais liberdade de moldar
  deixa o jogador **lavar matéria em alcance**: 1 m³ vira 127 m de cilindro fino, e a laje
  improvisada **vence o Muro comprado com XP** a partir do grau 5 (17 m contra 12; 40 contra 20).
  A alavanca não é o cuboide (ele é o mais manso dos oito), é a **esbeltez**, então nenhum teto de
  forma resolve. A escola escolhida é a de D&D 3.5, Pathfinder, Warhammer e FFT: **o molde é o
  parâmetro**, com nome e régua própria, em metros. Cinco moldes: **Explosão** (diâmetro 0,5 · 1 ·
  2 · 3,5 · 5 · 6,5 · 8 m), **Leque** (comprimento a 60°), **Linha** (comprimento, 1 m de largura,
  compra 6× o alcance da Explosão e paga na largura), **Muralha** (a régua que o Muro já tem) e
  **Cadeia** (inimigos ligados, o único molde imune à formação). O **Volume fica intacto** e perde só
  o direito de virar forma. **Corrigido em 17/08:** os cinco moldes são o que se compra com **XP**; o
  improviso ganhou geometria própria, que é a **A18**.
- [x] **A18 · [DECIDIDO 2026-08-17] A manifestação da Arte básica: fatias que saem do feiticeiro.**
  Detalhe em `Arcano_revisao.md` §5.4, e desenhada na bancada `volume-bench.html` (modo *molde de
  chão*). O parâmetro compra uma **base de n × n** (0,5 · 1 · 2 · 3 · 4 · 5 · 6 m de lado): *n* de
  frente somada e *n* de altura. A Arte sai do feiticeiro em **fatias** vizinhas, todas do mesmo
  ponto, e há **três aberturas, 60°, 90° e 120°**, que são as três que fecham o círculo em número
  inteiro (6, 4 e 3). Com a base travada, ângulo e distância são **amarrados**:
  `distância = (aresta ÷ 2) ÷ tan(ângulo ÷ 2)`. Cada fatia é uma **pirâmide**, então
  `volume = base × distância ÷ 3`, ou em fechado `n³ ÷ (6 · N · tan(θ÷2))`. **O nº de fatias nunca
  passa do nível**, o que faz três coisas de uma vez: a cobertura cresce em todo grau, só o grau 6
  fecha o círculo em fatias de 60° (o 4 fecha em 90°, o 3 em 120°) e o **piso sai de graça** (dividir
  pelo próprio nível dá aresta de 1 m, ou seja 87 cm do peito). **O que é conservado é a base, e não
  o volume:** abrir paga com a distância, e o volume e o chão vão atrás. No grau 6 com uma fatia:
  60° → 5,196 m e 62,35 m³; 90° → 3,000 m e 36,00 m³; 120° → 1,732 m e 20,78 m³. **Duas alturas**, o
  ápice e o pé da base, com o ápice preso dentro da altura da base e as duas limitadas pelo alcance do
  braço; deslizar o ápice não custa nada (Cavalieri) e com isso o desperdício no subsolo virou
  escolha. **Estado da matéria incide no lado da base:** Terra metade, Ar o dobro, o resto igual
  (grau 6: Terra 3 m, água 6 m, Ar 12 m). Recusado no mesmo dia: o nível da Arte **não** vale alcance
  grátis. Parede, reta e bloco passam a ser **só Efeito Especial**. Três erros de conta foram
  corrigidos no caminho e estão nomeados no fim da §5.4, porque são fáceis de repetir: o volume vinha
  de um **prisma** e não de uma pirâmide (0,433 n³ em vez de 0,289 n³, 50% alto), o volume **não** é
  conservado ao abrir, e baixar a altura pela metade dá **98,2°** e não 120°.
- [ ] **A21 · [DECIDIR] A base da fatia fica em corda ou vai para arco.** Aberta em 2026-08-17, e as
  três versões estão medidas na bancada, no controle **Base**. Na **corda** a base é uma reta a
  `distância` metros e o chão é um triângulo. No **arco** o lado do triângulo vira **raio**: no grau 6
  a 60°, o lado de 6 m vira um setor de 60° com raio 6 m, e o volume sai da mesma conta da pirâmide
  (`arco × altura × raio ÷ 3`). O arco rende `θ ÷ sen θ` a mais que a corda, ou seja **+21% a 60°,
  +57% a 90° e +142% a 120°**, e é aí que está a decisão: **no arco, abrir fica barato** (ir de 60°
  para 120° corta o volume a dois terços, contra um terço na corda), justo na alavanca que segura o
  leque largo. A terceira opção, **arco justo**, encolhe o raio em `√(sen θ ÷ θ)` e bate o volume e o
  chão da corda em qualquer abertura: é a forma redonda sem mexer em número nenhum. Nota de desenho:
  em arco, seis fatias de 60° formam um **cilindro** em volta do conjurador, e não um hexágono.
- [ ] **A19 · [DECIDIR] O que a matéria dentro da fatia faz em número.** Aberta pela A18. A
  manifestação diz **quanto** elemento aparece e **onde**, e não diz o que ele faz além do parâmetro
  de Dano: o que 62 m³ de chama fazem a quem está dentro, o que a espessura de uma fatia de Terra
  aguenta antes de ceder, o que pesa ao desabar. Encosta na A9 e no capítulo de Vida & Ferimentos.
- [ ] **A20 · [FAZER] Portar a manifestação para `regras.json`.** A escada do lado da base, a trava
  das fatias, as três aberturas e o fator de estado no lado. Nada disso está no dado, e o Grid lê de
  lá, então é o que liga a decisão à mesa. Espera a A21, porque a base escolhida muda a fórmula do
  volume. Junto vai a decisão de onde mora: bloco novo `arcano.improviso.manifestacao`, e o que sobra
  do `graus.volume` e do `graus.area` de hoje.
- [ ] **A16 · [DECIDIR] A Fonte do Elemento: os elementos que faltam.** A régua de abundância tem
  oito escadas, uma por elemental, e nenhuma para **Areia**, **Som** e o que mais aparecer. O caso
  da areia é o mais visível: a escada da Terra desliza de solo solto para rocha viva conforme sobe,
  então um deserto cai perto do fundo de uma régua que trata material solto como fraco. Decidir
  quais materiais ganham escada própria, e se Som é escola de Ar ou outra coisa.

## B. Bestiário

- [x] ~~**B1 · Preencher `fraquezas` e `resistencias` nas 308 criaturas.**~~ **FEITO em
  2026-08-10.** Os campos não cabiam no `inimigos.json`, que é gerado, então viraram o **sétimo
  satélite** do bestiário: `src/data/elementos-bestiario.json`, semeado por
  `scripts/gen-elementos.mjs` e embutido no `monsters.json` pelo `gen-monsters.mjs`. **Três
  camadas** dentro do script, cada uma vencendo a de cima: a regra por categoria e tag (64
  criaturas), o **material** de que a criatura é feita (22) e as exceções à mão (14); o JSON de
  saída é descartável. **100 das 308 têm alguma coisa (32%)**, 101 contando a criatura de
  `inimigos-custom.json`, que traz as suas inline e não passa por este script. E a
  previsão do `Arcano_revisao.md` bateu na mosca: são **47 com fraqueza a luz e sagrado**, os 32
  Corruptores mais os 15 Mortos-vivos, os 15% do livro que o Luz mira. O vocabulário ficou fechado
  em 15 palavras e o **validador falha o build** em qualquer palavra fora dele ou em fraqueza e
  resistência ao mesmo tipo. Aparece no bloco do bestiário, em duas linhas novas.
- [x] ~~**B1b · O que a fraqueza faz em número.**~~ **Decidido em 2026-08-10**, e a resposta é uma
  só para todos os tipos: **o dano não é absorvido por nada e é agravado.** Nem armadura, nem
  resistência, nem Absorção natural, nem Centelha; e ainda não fecha com descanso nem com a
  perícia Cura. **Com isso o Luz deixa de ser exceção**: ele é agravado contra as criaturas das
  trevas porque elas têm a fraqueza, não porque a Arte seja especial, e uma criatura de água
  atingida por Raio sofre agravado pela mesma razão. Isso rendeu dado novo: **água e metal
  ganharam fraqueza a raio** (condutividade), cinco criaturas. Escrito em `Arcano_revisao.md` §9,
  pendência 4c e na tabela de dano, e explicado num callout do bestiário.
- [ ] **B4 · [DECIDIR] Nada causa dano `sagrado` nem `profano`.** As duas palavras só existem
  hoje *dentro* de dois Efeitos de Luz, como condição. São **47 criaturas com fraqueza a sagrado**
  e 8 a profano esperando uma fonte de dano que o livro não tem. Ela viria da mecânica de clérigo
  e paladino: **depende de F3**. Enquanto não vier, metade das fraquezas do bestiário é decorativa.
- [ ] **B5 · [DECIDIR] `prata` não é representável.** `armas.json` não tem campo de material, então
  "adaga de prata" não existe como dado. Vampiro e lobisomem têm fraqueza que nenhuma arma do livro
  dispara. Ou entra um campo `material` na arma, ou vira etiqueta narrativa que o Mestre aplica.
- [ ] **B6 · [DECIDIR] `sol` é ambiente, não ataque.** Só o vampiro tem, e quem dispara é a cena.
  Talvez pertença à ficha de **Ambiente** (`Acoes_Sistema.md` §8.5) em vez da régua de dano.
- [ ] **B2 · [FAZER] Modificadores de Defesa por porte.** Criatura não média não tem ajuste de
  Defesa hoje; o porte já mexe em PV e Absorção, falta a esquiva.
- [ ] **B3 · [FAZER] Rebalancear os brutos grandes.** O pool de ataque deles está acima da régua da
  Centelha (registrado em `Proezas_revisao.md` e `REVISAR.md`).

**O editor de criaturas** entrou em 2026-08-10 (`BestiaEditor.astro` + `src/lib/bestia-editor.ts`):
botão no bloco de cada criatura e um "Nova criatura", os dois só para o ADM, abrindo um modal de
cinco abas que cobre o esquema inteiro e recalcula os derivados ao vivo. Ele nasceu com três
limitações conhecidas, que são as três de baixo.

- [ ] **B7 · [FAZER] O ataque da criatura do livro não volta para o formulário.** O `monsters.json`
  guarda o ataque **já calculado** (`pool: "2d6 +1"`, `dano: "1d6 +2 corte"`, `speed`) e não a
  origem dele (atributo, perícia, dados, mão, penetração), então não há como repopular a linha sem
  adivinhar. O modal mostra o ataque do livro em leitura, marcado como tal, em vez de deixar a
  lista vazia fingindo que a criatura não ataca. **O conserto é no gerador**: o `gen-monsters.mjs`
  preservar os campos de origem ao lado do calculado. Criatura nova não sofre disso, porque ela
  nasce com os campos de origem.
- [ ] **B8 · [FAZER] O modal não edita poderes, técnicas nem artes.** As três listas existem no
  `monsters.json` e o formulário não as toca, então criatura cadastrada por ele sai sem nenhuma das
  três. Encosta em **A9** (como uma criatura carrega Efeito Especial no stat block): não vale
  desenhar a UI das artes antes de A9 dizer o formato.
- [ ] **B9 · [DECIDIR] Onde a criatura editada mora.** O site é estático: o modal guarda a edição no
  `localStorage` do navegador e oferece o bloco pronto para colar no `inimigos-custom.json`, que é
  o único caminho que entra no build. Duas pontas soltas nisso. A primeira: **editar criatura do
  livro não tem para onde ir**, porque o `inimigos.json` é gerado, e a correção teria de voltar à
  bancada `conversao-monstros.html`. A segunda: o portão de ADM é `ehAdmin()`, **portão de
  interface e não de segurança**, o que basta enquanto o dado é estático e deixa de bastar no dia
  em que a edição escrever no Supabase, como as fichas já escrevem.
- [x] **B10 · [RESOLVIDO 2026-08-17] `inimigos.json` saía de sincronia calado.** Detalhe em
  `Bestiario_Centelha.md`. A suspeita registrada aqui (**"os números novos são os que a bancada
  manda; os antigos é que estavam velhos"**) estava invertida: **o regen de 10/08 desfez a
  Reescala**. A prova é tripla: a distribuição antes do regen tinha um buraco exatamente no degrau
  que a Reescala **inseriu** (nada em Centelha 2); o `Reescala.md` já avisava, na Fase 6, *"se
  regerar do zero, reaplicar o +1 nos ≥2"*, e o passo não foi refeito; e o **Campeão (herói
  inimigo)**, cujo conceito é "um adversário à altura dos PJs", lia Desperto 2 enquanto Kael, o
  herói de referência, é 3. Quatro criaturas ficaram até impossíveis, carregando Técnica de nível 3
  com Centelha 2. **110 criaturas subiram +1**: as 91 de Centelha ≥3 e 19 das 57 do degrau 2, que
  passou por **triagem** em vez de subir em bloco (sobe quem tem piso técnico 3 ou ameaça 4+; ficam
  no Desperto as 38 de tropa, emboscada e bicho de estrada). Os derivados vieram por fórmula, sem
  delta à mão. **O conserto de fundo:** o +1 passou a morar **na fonte** (bancada,
  `conversao-extra.json` e os builds inline), o gerador ficou idempotente (verificado byte a byte) e
  o novo **`gen-bestiario.mjs --check`** falha o `validate` e o `build` se o JSON commitado divergir
  da fonte, nomeando as criaturas. De quebra, dois resquícios da régua velha saíram do gerador: a
  nota de "acima do teto mortal" ia marcar 16 Semideus como entidade, e o nível de Arte era cortado
  em 5 quando as Artes já têm 6.
- [ ] **B11 · [FAZER] Palavra nova de fraqueza precisa de rito para virar oficial.** O vocabulário
  vive em `src/data/elementos-vocab.json` (15 palavras, lido pelo validador, pelo gerador e pelo
  editor) e o **validador falha o build** em qualquer palavra fora dele. O modal aceita palavra
  avulsa e a guarda no `localStorage`, o que serve para rascunhar mas não atravessa: quem quiser
  oficializar tem de editar o JSON à mão. Falta o passo que promove a palavra rascunhada.

## C. Trilhas de Feitiçaria

Detalhe em `Trilhas_Feiticaria.md` §6. As seis Tradições já estão descritas no site.

- [ ] **C1 · [DECIDIR] Jogadas das Artes, casos de fronteira.** O esquema **Mirado** (Acerto Arcano
  + Percepção ou Destreza) contra **Moldado** (perícia da Tradição) está proposto e não batido.
  Falta o martelo nos híbridos (recomendo uma rolagem só). **Trava A11.**
- [ ] **C2 · [DECIDIR] A perícia de conjuração de cada Tradição.** A tabela está proposta e precisa
  de aval. A **Iniciação** provavelmente pede um traço de **Fé/Devoção** que não existe: criar?
- [ ] **C3 · [FAZER] O mapa Arte × Trilha.** Só existe um exemplo (Terra). O catálogo das 24 Artes
  é frente própria, do tamanho do bestiário, com os números de treino junto.
- [ ] **C4 · [FAZER] Portar `trilhas.json`** quando a mecânica fechar, e revisar o mortal-tocado
  (Bram é Erudição).

## D. Proezas e Técnicas

Detalhe em `Proezas_revisao.md`.

- [ ] **D1 · [FAZER] Fase 3 da migração.** Matar a **banda** de vez (Velocidade independente por nível,
  apagar o campo `banda` e tirar do schema) e **surfar o modificador da trilha na UI**, mostrando o
  valor ao lado da Técnica.
- [ ] **D2 · [DECIDIR] Números por Técnica contra a régua.** O texto de cada Técnica ainda traz o
  número antigo ("+2 em Furtividade") enquanto a régua diz nível×3. Reconciliar o texto, ou surfar a
  trilha e deixar o texto como sabor.
- [ ] **D3 · [DECIDIR] Densidade dos funis.** Caminhos reaproveitados têm ~3 Técnicas no nível 1
  (funil 3·2·1·1·1), mais enxuto que o padrão de Força. Alargar ou aceitar.
- [x] **D4 · [SEM CAUSA 2026-08-17] O retag já estava feito; o item nasceu de uma leitura errada.**
  A frase da auditoria (**"Defesa Mental agora só aparece em Comando e Marionete"**) fala dos dois
  **Caminhos**, não de duas Técnicas, e "Marionete" ser também o nome de uma Técnica de nível 6 é a
  armadilha. Conferido no dado vivo: as **15 Técnicas** que citam Defesa Mental estão **todas** em
  Comando (9) e Marionete (6), que é exatamente o que o doc manda. As 12 que a auditoria nomeia
  estão lá; a 13ª é **Tom de Autoridade**, que **baixa** a Defesa Mental em 3 em vez de rolar contra
  ela, como o próprio doc prevê; e as outras duas são **Ordem que Pesa** e **Impulso Plantado**, as
  de nível 2 nascidas depois, na Fase 6 da Reescala, nos mesmos dois Caminhos. Nenhuma Técnica que
  a auditoria manda para a Social cita Defesa Mental. **O lado Social não precisa de marcação:** o
  capítulo de Relações Sociais faz da Defesa Social o alvo padrão, e a Mental é a exceção, que é o
  que se marca. O Arcano também está tagueado, com 15 Efeitos citando Defesa Mental. Sobra só um
  detalhe cosmético, registrado e não corrigido: 17 Técnicas sociais marcam o alvo padrão e 15
  vizinhas, de mesmo efeito, não marcam.
- [ ] **D5 · [FAZER] Reorg de conteúdo.** As árvores novas do doc (Atlas reorganizado, Força de
  Guerra, Presença Aterradora, Arremesso, Salto, Vigarista/Confessor, as novas de Perspicácia) ainda
  não entraram na data viva.
- [ ] **D6 · [DECIDIR] Custo de Técnica e de Arte em ×10.** Ficou de fora da recalibração de XP de
  propósito (largura segue sendo o gasto caro). Confirmar que fica.

## E. Social, Mental e Antecedentes

- [ ] **E1 · [FAZER] Portar `Antecedentes.md` ao site.** 14 Antecedentes escritos, escala 1 a 6,
  XP ×3, Únicos e Nomeados, tetos de criação. Falta capítulo, `antecedentes.json` e lugar na ficha.
  Nada disso existe no site hoje.
- [ ] **E2 · [FAZER] Portar `Ataques_Mentais.md` ao site.** A Defesa Mental já está no motor e no
  bestiário; o capítulo (as três camadas, a duração dos efeitos, a inimizade ao despertar) não.
- [ ] **E3 · [DECIDIR] Banda neutra da Régua de Relação: 5 ou 3?** Hoje é 5 (rompe o Neutro em 3
  passos). A de 3 faz a régua andar mais rápido. Junto vai a alternativa do decaimento: rumo à
  baseline do par, como está, ou rumo ao neutro mais próximo.

## F. Lore

Detalhe em `lore/Lore_Centelha.md` §7 e §8. Nada de lore foi ao site ainda.

- [ ] **F1 · [DECIDIR] Como os deuses romperam a Lei** na Grande Guerra (avatares? campeões? uma
  brecha?) e por que romper foi em si destrutivo. E se **alguém hoje sabe ou suspeita** que a Lei
  existe.
- [ ] **F2 · [DECIDIR] Quem impôs a Lei.** A proposta é o próprio cosmos, a Primeira Luz reagindo ao
  ser agarrada, sem entidade legisladora. Confirmar.
- [ ] **F3 · [DECIDIR] Mecânica de clérigo, paladino e monge** (poder divino via Centelha e campo de
  crença). Fecha junto com as Trilhas: clérigo e paladino são **Iniciação**, monge é **Marcial**.
- [ ] **F4 · [DECIDIR] Os planetas.** Quais importam, quais são habitados, quais são alcançáveis, e
  o que sobrou da fase interplanetária.
- [ ] **F5 · [AUTOR] Nomes próprios.** Faltam: as massas de terra sem rótulo, as cidades de Calin e
  as escondidas de Mére, o resto de Uldun, o reino feérico élfico, os planos (incluindo o da Fenda),
  as eras, os primeiros deuses e as ortodoxias rivais com seu cisma.
- [ ] **F6 · [AUTOR] Deuses locais e espíritos de lugar** por cidade e região, casando com as
  cidades que você está escrevendo.

## G. Ações & Sistema

Frente aberta em **2026-08-09**. Três documentos: `Acoes_Catalogo.md` é a **bancada** (o que cada
ação é, com referências de Exalted, D&D 3.5/5e, Pathfinder 1/2, Cyberpunk RED, Chronicles of
Darkness, GURPS, Blades in the Dark, Burning Wheel e Ars Magica), `Acoes_Texto.md` é o **texto do
capítulo** na voz do livro (75 verbetes, sem regra), e `Acoes_Sistema.md` é a **regra**.
Modelo: **Drama and Systems** do Exalted 2ª edição.

**A régua comum fechou quase inteira em 2026-08-09** e está em `Acoes_Sistema.md` §3: cinco modos
de ação (Direta, Acumulada, Longa, Reflexiva, Passiva), Dificuldade pela tabela de âncoras, a
Margem como expertise excedente, banda morta de uma Margem na falha, ajuda por soma ou apoio, e
o teste coletivo. Como efeito colateral, o capítulo publicado de **Relações Sociais** foi
corrigido para falar a mesma língua.

**A régua comum está FECHADA** desde 2026-08-09. As sete decisões estruturais saíram, incluindo a
escada de seis intervalos (Tick, minuto, hora, dia, semana, estação) e o Fôlego, que morde só em
intervalo de Tick e não exigiu regra nova. **Ressalva do autor:** o Fôlego é módulo opcional e
pode vir a ser ocultado, então nenhuma ficha deve depender dele.

**Antes da primeira ficha:**

- [x] ~~**G1 · O gabarito de ficha.**~~ **Escrito em 2026-08-09** (`Acoes_Sistema.md` §5): nove
  campos em ordem fixa, o princípio de que a ficha só escreve o que **desvia** do padrão da §3, a
  régua de calibragem da §5.3 (Dificuldade de Acumulada e Longa a 70% da de Direta) e a regra
  §5.5 de primária + secundária. O caso sem modo está previsto, com Arremesso (§6.6) de exemplo.
- [ ] **G2 · [DECIDIR] Reequilibrar a Especialidade.** Efeito colateral assumido da regra de
  primária + secundária (`Acoes_Sistema.md` §5.5): a maior entra no pool e a **menor inteira**
  vira bônus fixo, o que torna a secundária cerca de duas vezes e meia mais eficiente por XP do
  que a Especialidade (secundária 4 custa 18 XP e dá +4; dois níveis de Especialidade custam 28 e
  dão ~+2,4). Ou a Especialidade barateia, ou fica claro que ela serve para o que **não tem**
  secundária pronta ("espada longa", "nas sombras"), que é o caso da maioria. **Não trava as
  fichas**, mas mexe na economia de XP.
- [x] ~~**G3 · Normalizar a tabela §4 do `Acoes_Sistema.md`.**~~ **Refeita em 2026-08-10**, de
  uma vez e não linha a linha, junto com o G9. A tabela agora tem coluna de **Modo** e fala a
  língua dos cinco, e a coluna de Estado aponta a ficha (**§x.y**) quando ela existe. Ganhou uma
  §4.8 com o placar da frente: **22 das 75 ações têm ficha**, e as duas famílias intactas são
  Sentidos e mente e Fé e o sobrenatural, ambas travadas por decisões de fora deste documento.

**Escrever:**

- [x] ~~**G4 · Construção e ofício.**~~ **Escrito em 2026-08-09** (`Acoes_Sistema.md` §7), e
  **não virou subsistema**: é a Jogada Longa com tabela. A peça tem cinco números (**Requisito** =
  a porta, Dificuldade = o ritmo, Montagem = o que se paga uma vez por lote, Peça = por unidade,
  intervalo) e às vezes um **Piso**, para o serviço que é mão e não técnica. Requisito e
  Dificuldade não são a mesma coisa dita duas vezes: cota de malha é Requisito 2 com Acúmulo
  enorme, fechadura é Requisito 5 com Acúmulo pequeno. Fecharam junto: o **lote** (a montagem se
  paga uma vez, o que explica por que ninguém acende a forja para uma espada só), o território de
  **Ofícios Gerais** (cobre sozinho Dificuldade até o **nível da Habilidade**; fora dele, **+4**;
  e vale **metade** ao conferir o Requisito), a **régua de
  qualidade simétrica** de seis graus (Sucata a Excepcional; cada grau mexe em Requisito ±1,
  Dificuldade ±3, Acúmulo ×1,5 ou ×0,5, preço, e sobe o intervalo a cada dois graus, que é como se
  chega à Espada Longa Ótima do painel de ajuste), oficina e material como os ±2/±4, a **direção
  de obra** (ajudante sem ofício trabalha contra Dificuldade 4 sob supervisão, até dez por
  supervisor) e as quatro tabelas de referência por escala. Ficaram fora, na §7.10: preço da peça
  pronta, material sobrenatural, a oficina como traço e a etapa de colheita e extração.
- [x] ~~**As cinco físicas de toda sessão.**~~ **Escritas em 2026-08-09**
  (`Acoes_Sistema.md` §6.1 a §6.5): Escalar, Nadar, Cair, Feito de força e Esgueirar-se. Feito de
  força saiu com as duas faces separadas (erguer não rola, romper rola) e ganhou a tabela de
  material que faltava. Esgueirar-se resolveu na prática o **Valor Passivo de Prontidão** como
  alvo, o que encaminha o G7.
- [x] ~~**G5 · Uma escada de exaustão única?**~~ **Decidido em 2026-08-09: não existe.** Os cinco
  casos não medem a mesma coisa (veneno é dose, doença é estado que piora, ambiente é pressão
  constante, sufocamento é contagem regressiva, sono é dívida), e cada um tem relógio, dano e
  penalidade próprios. Veneno e sono nem sequer usam o mesmo modo: um tem jogada, o outro é
  Passiva. O esqueleto das cinco está em `Acoes_Sistema.md` §8.1.
- [x] ~~**G5b · Escrever as cinco fichas de Resistir.**~~ **Escritas em 2026-08-10**
  (`Acoes_Sistema.md` §8.3 a §8.7). As três decisões que atravessavam a família saíram juntas:
  as penalidades **somam com teto 4**, a moeda comum é o **Desgaste** (−1d6 por degrau, pool nunca
  abaixo de 1d6) e **cada veneno declara** se derruba Atributo, tira PV ou dá Desgaste, sempre
  ignorando Absorção. Nenhuma condição mata pelo Desgaste: mata pelo relógio próprio dela.
  Destaques: doença roda por **cinco estágios** com a banda morta de uma Margem e foi calibrada
  contra o **camponês**, de modo que a cura vem de quem cuida (as circunstâncias de cama e
  curandeiro) e não da ficha do doente; no ambiente, **agasalho não muda a Severidade, muda o
  intervalo**, e Sobrevivência evita enquanto Resistência aguenta; sufocamento são dois relógios
  ((Vigor + Resistência) × 10 Ticks de ar, depois Vigor × 20 de socorro) e não toca em Fôlego.
  Pendências novas na §8.8, sendo a que mais importa: **Desgaste ainda não conversa com as
  penalidades de ferimento** de Vida & Ferimentos, e as duas vão se somar em mesa.
- [ ] **G6 · [DECIDIR] Percepção passiva: confirmar.** A ficha de Esgueirar-se (§6.5) já usa o
  **Valor Passivo de Prontidão** (2 × Percepção + Prontidão) como alvo, e a calibragem sai
  razoável: servo distraído 6, sentinela comum 10, batedor de elite 16, mestre de espiões 20.
  Falta só confirmar que é assim que o jogo lê "notar sem procurar", e o resto da família de
  Sentidos herda.

**Arrumação:**

- [x] ~~**G7 · Duas ações levantadas e nunca catalogadas.**~~ **Entraram, em 2026-08-10.** As
  duas aparecem em mesa toda hora e nenhuma tinha casa. **Escapar de amarras** foi para Corpo e
  movimento, depois de Cavalgar, e cabe como Acumulada, porque o que interessa é o tempo até
  soltar. **Sinalizar à distância** foi para Sentidos e mente, depois de Enxergar longe, que é a
  ação de que ela é o oposto, e é a que menos tem de onde copiar: só o `GURPS` tem perícia
  própria para isso. As duas estão nos três documentos, e a §12 do catálogo ficou vazia.
- [x] **G8 · [DECIDIDO 2026-08-17] "Stunt" virou **Manobra**.** A palavra saiu de 14 lugares no
  site (`habilidades.md`, `combate.md`, `relacoes-sociais.md`, `glossario.json`) e de 29 nos docs
  de trabalho (`Combate_Social.md`, `Acoes_Sistema.md`, `Regua_Relacao.md`, `Antecedentes.md`,
  `Relacoes.md`, `Reescala.md`, `resumo-regras.txt`), de uma vez. Três decisões junto da palavra:
  o oposto é **Manobra Infeliz**, e não "Contra Manobra", que leria como contragolpe; "manobra"
  **deixou de ser apelido de Técnica** no glossário, para a palavra não ter dois donos (Técnica é o
  que se compra com XP, Manobra é o que nasce da descrição e vale só naquele lance), e o capítulo
  de Habilidades ganhou o parágrafo que diz isso em voz alta. O texto foi **reescrito frase a
  frase**, e não trocado no braço: "empilhando gestos (stunts)" virou "empilhando Manobras", com a
  explicação de que ali elas são gestos. Fica anotado que existe uma Técnica chamada **Ler a
  Manobra** (Estrategista N3), que não muda de nome: o sentido dela é o tático, e o contexto
  separa os dois.
- [x] ~~**G9 · Três listas paralelas das mesmas ações.**~~ **Unificadas em 2026-08-10.** A regra
  ficou escrita na §4.0 do `Acoes_Sistema.md`: **a lista é do `Acoes_Texto.md`, as referências são
  do `Acoes_Catalogo.md`, a mecânica é do `Acoes_Sistema.md`**, e os três carregam as mesmas
  **sete famílias e setenta e cinco ações**, com os mesmos nomes e na mesma ordem. As divergências
  reais eram duas, e foram fechadas: **Apostar** e **Levantar o peso máximo** faltavam no
  catálogo.
- [x] ~~**G10 · Capítulo único ou distribuído?**~~ **Capítulo único, publicado em 2026-08-10** a
  pedido do autor: **capítulo VII, logo depois de Raças**. Combate em diante andou um numeral, e
  de quebra corrigiu-se uma divergência que já existia: Fôlego, Criação de Personagem e Qual
  Sistema tinham no frontmatter um numeral a menos do que o `site.ts` mostrava na barra lateral.
  **Fatiado em cinco sub-páginas** logo em seguida, no padrão dos capítulos II e XVI (53 mil
  caracteres eram o dobro do maior capítulo do livro): `acoes-e-sistema` (A Régua Comum),
  `acoes-corpo-e-movimento`, `acoes-resistir`, `acoes-sentidos-e-engano` e `acoes-oficio-e-mundo`.
  As quatro famílias que ainda não têm ficha couberam numa página só.
- [ ] **G12 · [DECIDIR] Desgaste e ferimento não se conhecem.** Levantado na §8.8 do
  `Acoes_Sistema.md` e é o que mais importa das sobras: o Desgaste (−1d6 por degrau, teto 4) não
  conversa com PV nem com as penalidades de ferimento do capítulo de Vida & Ferimentos, e os dois
  **vão se somar em mesa** no primeiro personagem envenenado que também apanhou. Ou o teto 4 passa
  a valer para a soma dos dois, ou ferimento vira Desgaste, ou eles correm em paralelo de
  propósito. Enquanto não sair, o Mestre está arbitrando.
- [ ] **G13 · [FAZER] As sobras das duas famílias escritas.** Sete assuntos que as fichas
  encostaram e não cobriram. Do ofício (§7.10): **preço da peça pronta** (o `precos.json` não cobre
  arma, armadura nem obra), **material sobrenatural** como ponte com Artes e bestiário, **a oficina
  como traço** do personagem em vez de modificador de circunstância, e **colheita e extração**
  (minerar, abater, curtir), que é a etapa antes da forja. De Resistir (§8.8): o **catálogo de
  venenos** com preço e legalidade, a **doença como enredo** de campanha em vez de jogada por
  personagem, e **frio e calor mágicos**, que é decidir se o gelo de uma Arte causa dano ou
  Severidade.
- [ ] **G11 · [FAZER] `regras.json → acoes`.** O capítulo já está no site, mas as tabelas dele
  são texto: nada disso é lido pelo motor nem aparece na ficha. Os melhores candidatos são a
  tabela de dano por queda, o Desgaste e os cinco números das peças do ofício, que destravariam
  o ajuste de peça na ficha deixar de ser um campo livre.

## H. Arremesso

Frente aberta em **2026-08-10** e até agora sem linha neste mapa. Três documentos:
`Arremesso_Fatos.md` é o levantamento do que se mediu no mundo real, `Arremesso.md` é a regra que
está no ar, e `Arremesso_Regra.md` é a **proposta nova**, em três regimes. A bancada
`arremesso-bench.html` compara as duas com gráfico.

- [ ] **H1 · [DECIDIR] Adotar a regra nova ou ficar com a que está no ar.** O que muda: o **ápice
  sai de 1 kg e vai para 0,1 kg**, a parede sai de P e vai para **P ÷ 4**, e a curva do meio, que
  hoje é `massaBraço ÷ (peso + massaBraço)`, vira uma **raiz quadrada** (`Alcance = 2 × FAA ÷
  √massa`). O que fica igual: as duas reservas, as quatro faixas de carga, os quatro fatores de
  forma, o alcance livre como fração e as quatro bandas de −3. O argumento é medida, não gosto: a
  massa efetiva do braço não é constante, é ~1,7 × a massa do objeto em quatro séries que cobrem
  500× de faixa, e com isso a álgebra colapsa numa raiz (ajuste `45,9 × massa^−0,488`, R² 0,971).
  Erro médio de 15% contra doze marcas reais, pior caso 34%. Na mesa cabe numa frase: **o dobro da
  Força de Arremesso, dividido pela raiz do peso**.
- [ ] **H2 · [FAZER] Se adotar, portar.** Hoje o `regras.json` ainda tem a régua antiga inteira
  (`arremessoMassaBraco: 1`, `arremessoParedeExp`, `arremessoR0` e a `notaArremesso`, que é o texto
  que a ficha exibe). Mexem junto: a ficha, o painel de Força & Arremesso, os ganhos de corrida e
  giro e a bancada, que passa a comparar com a antiga como histórico.
- [ ] **H3 · [DECIDIR] Os quatro assuntos que a proposta levanta e não fecha** (§7). **Funda e
  ferramentas que estendem o braço**: medido +30% a +70% na funda, +58% na correia grega, +81% no
  cabo do martelo, e a funda existe como arma do jogo sem número próprio (proposta: ×1,5, ao lado
  do fator de forma). **A energia que chega**: uma pedrinha de 2 g voa 94 m e entrega 2 J, que não
  machuca ninguém, e o corte da ponta leve é energia e não distância. **Limite de pegada**: acima
  de uns 13 cm de diâmetro não sai de uma mão. **Duas mãos**: no objeto leve saem 75% da velocidade
  de uma mão, no pesado empata, ou seja, é penalidade no leve e é a única opção no pesado.
- [ ] **H4 · [DECIDIR] O degrau de baixo do fator de forma: ÷2 ou ÷3?** Ressalva já medida na §3 da
  proposta. Pela densidade seccional, um baralho de cartas e uma bola de beisebol pesam quase o
  mesmo e o baralho chega a **22% do alcance**, não aos 50% que o ÷2 promete. Fica em ÷2 por
  simplicidade; se incomodar em mesa, o conserto é uma tecla.

---

## I. Mesa virtual · tempo real

Frente aberta em **2026-08-11**, quando o Grid passou a atualizar sozinho. O desenho está escrito
em `src/lib/mesa-tempo-real.ts` e no topo de `supabase/migracao-20.sql`: quem escreve toca uma
**campainha** no canal `mesa:<id>` com uma palavra, e quem ouve relê aquele pedaço pela própria
view. Nada de estado viaja pelo canal, e é isso que mantém a máscara de coluna da migração 14 de pé.
Medido: 1,1 s do dedo sair do mouse até a peça aparecer na outra tela, uma consulta por evento.

- [ ] **I1 · [FAZER] Fechar o canal.** Hoje ele é público: quem soubesse o UUID da mesa poderia
  ouvir as campainhas dela (descobriria que *algo* mexeu, e leria o nome de quem apontou uma casa).
  As duas policies estão prontas e comentadas no fim de `migracao-20.sql`; falta ligar o
  `private: true` no cliente e **testar com dois navegadores antes de subir**. O motivo de não estar
  ligado é o preço de errar: com a policy torta, todo mundo é recusado e o tempo real some sem
  mensagem de erro na tela.
- [ ] **I2 · [FAZER] O registro da arena ainda é um `jsonb` reescrito inteiro.** A migração 20
  barateia a LEITURA (uma linha por entrada, as 60 últimas); a ESCRITA continua subindo o array
  todo, até uns 45 KB, a cada peça movida. O conserto é o mesmo da migração 19 com os efeitos:
  `arena_log` como tabela, uma linha por entrada, e o desfazer virando um `delete`.
- [ ] **I3 · [FAZER] As outras abas ainda não ouvem.** Grid e Combate estão no canal; Grupo, Mapas,
  Compêndio, Diário e Arquivos não. A ficha aprovada, o mapa revelado e o handout liberado
  continuam pedindo F5 do outro lado. É barato: `abrirCanal` + um `carregar()` no aviso, como em
  `combate.astro`.
- [ ] **I4 · [FAZER] Nada garante entrega.** Sem número de sequência, uma mensagem perdida deixa a
  tela velha até o próximo aviso, até religar o canal ou até voltar para a aba. Um contador por
  mesa (um `int` que sobe a cada campainha) deixaria o ouvinte perceber o buraco e pedir tudo.
- [ ] **I5 · [FAZER] O anel de Vida remoto aparece em salto.** A peça que anda por ordem de outra
  tela desliza; a Vida que muda por ordem de outra tela pula direto para o valor final, porque o
  desenho troca o nó e transição de CSS não roda em elemento recém-nascido. O caminho é o mesmo do
  `deslizarTokens`: mexer no `stroke-dashoffset` do nó que já está lá.
- [ ] **I6 · [FAZER] A presença não distingue quem está olhando.** Ela conta abas abertas, e uma
  aba em segundo plano conta igual. O navegador estrangula os timers da aba escondida, então ela
  também **atrasa a própria campainha** quando é ela que escreve (não incomoda na prática: quem
  age está com a aba na frente).
- [x] **I7 · FEITO em 2026-08-12. Névoa de guerra.** Três estados (claro, névoa leve, névoa
  pesada), visão em volta das peças do grupo, fogo e luz abrindo o mapa, e memória do que já foi
  explorado. As perguntas de mesa foram respondidas assim: a névoa é **do grupo**, o explorado
  **fica** (vira névoa leve, que mostra o chão e esconde quem está nele), e o alcance é um **raio da
  cena**, igual para todos. Migrações 23 e 25; o corte é na view `token_visao`, e não na tela. O
  quadro completo e os seis limites que sobraram estão em `Grid_melhorias.md`.
- [ ] **I8 · [DECIDIR] Ponteiro ao vivo.** Hoje há o ping (dois cliques acendem uma casa para todo
  mundo, assinada). O passo seguinte é o cursor de cada um deslizando pelo mapa, que é o que as
  mesas virtuais grandes fazem. Custa uma mensagem a cada ~50 ms por pessoa que estiver mexendo o
  mouse, e é a única coisa desta lista que pesa de verdade: vale a pena?
- [ ] **I9 · [DECIDIR] O caderno de melhorias do tabuleiro.** `Grid_melhorias.md` guarda a lista
  inteira do que as mesas virtuais têm, do que os usuários reclamam que falta nelas e do que os
  jogos de combate por turno resolveram (Fire Emblem, FFT, Into the Breach, Grandia, Valkyria,
  XCOM, Divinity, BG3). São ~25 ideias com custo estimado; três delas precisam de decisão de regra
  antes do código (**terreno por hexágono**, **altura** e **face da peça**).
- [ ] **I10 · [FAZER] As pontas soltas do jogador no tabuleiro.** Em 2026-08-12 o jogador passou a
  mover a própria peça, mirar, conjurar e lançar dano (migração 22: funções `jogador_*`, e não
  policy, porque RLS filtra linha e o que precisa ser filtrado é coluna). Ficaram seis pendências
  pequenas, listadas em `Grid_melhorias.md` na seção "Pontas soltas": as **Proezas** ainda não são
  ação de tabuleiro, a **invocação do jogador não sobrevive ao F5**, a **Absorção não entra no dano
  dele**, a **caixa de acerto vem vazia** do lado dele, o **número de dano só aparece para quem
  enxerga o número**, e o adaptador `sbDoJogador` conhece cinco formas de escrita (nota de
  manutenção, para quando o módulo das Artes ganhar outra).

---

## J. Infraestrutura · endereço, hospedagem e versão

- [x] **J1 · [DECIDIDO 15/08/2026] O endereço será `centelha.rec.br`.** R$ 40/ano no
  Registro.br, categoria de recreação e jogos, portátil, preço fixo em real, e **4,6× mais
  rápido que um `.net` na consulta fria de DNS a partir do Brasil** (30,4 ms contra 140,9 ms,
  medido de duas formas). **O roteiro executável está em `Migracao_Dominio.md`**: as seis
  fases, os arquivos e linhas a mudar, o portão de verificação e o plano de volta atrás.
  Falta confirmar no ato da compra se `rec.br` aceita CPF; se pedir CNPJ, os substitutos
  na ordem são `centelha.art.br`, `centelha.wiki.br` e `centelharpg.com.br`.
  *Descartados, para não se reabrir a discussão:* Freenom (`.tk`, `.ml`, `.ga`) morreu em
  2024 e voltou em 2026 cobrando; `js.org` e `is-a.dev` estão fora por regulamento, os dois
  exigem projeto ligado a desenvolvimento de software; `centelha.eu.org` é grátis e bonito
  mas a aprovação é manual e leva de semanas a meses; `centelha.net` (R$ 64) tinha o melhor
  nome e perdeu no DNS e no preço; subdomínio de hospedeiro solda a origem à casa e cobraria
  a conta de novo na próxima mudança. **O que decidiu foi a portabilidade:** cada mudança de
  origem apaga as 7 chaves de `localStorage` dos leitores, ficha de personagem inclusa,
  então a conta se paga por endereço, não por hospedeiro.
- [ ] **J1b · [FAZER, depois de J1] SMTP próprio no Supabase.** Achado ao medir as diferenças
  técnicas entre domínios: o cadastro (`signUp`) e a recuperação de senha saem hoje pelo SMTP
  embutido do Supabase, **limitado a 2 e-mails por hora em todos os planos, o pago inclusive**.
  Três cadastros na mesma hora e o terceiro fica sem confirmar a conta. A saída é SMTP próprio
  (Resend/Brevo têm faixa grátis), que **exige domínio próprio** para publicar SPF, DKIM e
  DMARC. Detalhe em `Dominio.md` seção 12.1. É o único ganho técnico da compra que se paga
  sozinho, e conserta um defeito que já existe hoje.
- [ ] **J2 · [DECIDIR] Qual hospedeiro.** `Migracao_Astro7.md` seção 4 e `Migracao_Dominio.md`
  seção 2.1. Com J1 decidido, a sugestão é **Cloudflare Pages com a zona na Cloudflare**
  (`centelha.rec.br` é ápice, e ápice não aceita CNAME · a Cloudflare resolve com *flattening*;
  o domínio segue comprado no Registro.br, só o DNS muda de casa). Netlify serve com a zona
  no próprio Registro.br, via registro A do ápice. **O plano grátis do Vercel proíbe uso
  comercial**, então ele só serve se o Centelha nunca gerar receita.
- [ ] **J3 · [FAZER, depois de J2] Sair do GitHub Pages, e só então subir para o Astro 7.**
  A mudança de endereço tem roteiro próprio em **`Migracao_Dominio.md`** (seis fases, com
  portão e volta atrás); a subida de versão fica em `Migracao_Astro7.md`. **As duas não se
  misturam**: superfícies e riscos de natureza diferente, e juntas ninguém sabe qual quebrou
  o quê. Os dois bloqueios técnicos da subida já saíram em 14/08 (o dev server centralizado
  e a aposentadoria do `@vite-pwa/astro`), e o `rehypeBaseLinks` sai na fase B do endereço.
- [ ] **J4 · [DECIDIR] Fraquezas e resistências do bestiário não chegam ao dano.** Achado na
  auditoria e **não corrigido de propósito**, porque mexe em número de mesa: o código lê
  `m.fraquezas`/`m.resistencias` no topo da criatura, e elas moram dentro de `combate`.
  Zero das 309 têm no topo; 101 têm dentro. Detalhe em `Auditoria_Tecnica.md` seção 8.2.

---

## Ordem sugerida

1. **E1**, Antecedentes ao site: o doc está fechado, o trabalho é portar, e é o mesmo tipo de
   trabalho que a frente de Ações acabou de receber, então sai com o caminho quente.
2. **C1**, as jogadas das Artes: é a decisão que destrava mais coisa depois dela (A11, C2, C3, F3).
3. ~~**B10**, confirmar a Centelha das 148.~~ **Feito em 17/08.** Era o único item que já estava
   valendo no repositório sem ter passado por você, e a suspeita se confirmou ao contrário do que
   este mapa dizia: o regen tinha desfeito a Reescala, não corrigido nada.
4. ~~**D4**, o retag das Técnicas.~~ **Fechado sem causa em 17/08:** a divergência entre doc e dado
   não existia. A frase da auditoria falava dos Caminhos de Comando e Marionete, e o item a leu
   como duas Técnicas.
5. ~~**G8**, trocar a palavra "stunt" por um termo em português.~~ **Feito em 17/08:** é
   **Manobra**, com **Manobra Infeliz** no lugar do "Contra Stunt".

**Os três primeiros da lista saíram no mesmo dia.** O que sobra de mais barato agora é o **E1**,
portar os Antecedentes ao site: o doc está fechado e o trabalho é de execução.
