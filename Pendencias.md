# Pendências do Centelha

**Para quem vai propor a próxima rodada.** Este arquivo diz o que está aberto no projeto inteiro,
quem decide cada coisa, o que está pronto para executar e o que trava o quê. Ele não repete o
detalhe: cada item aponta para o arquivo onde mora, por nome e sigla.

**Como está montado.** Duas camadas, e só uma é escrita à mão:

- **A direção (seções 1 a 6), escrita à mão.** Frentes, o que está pronto, o que está com o
  humano, os bloqueios, a revisão e a ordem proposta em três trilhas. Revista em **23/09/2026**
  (rodadas 94 a 96).
- **A contagem (seção 0) e a lista dos itens (seção 7), geradas.** Saem de
  `scripts/gen-pendencias.mjs`, a partir de `docs/pendencias/A` a `L`, e o `npm run validate` fica
  vermelho se divergirem dos arquivos de tema, ou se um tema tiver linha com cara de caixa que o
  gerador não lê. **Não edite entre os marcadores:** mude a caixa ou a marca no tema e rode
  `node scripts/gen-pendencias.mjs`.

**As marcas dos temas.** Cada item tem uma sigla estável (A1, B2, …), e as siglas não mudam de
lugar nem de número. **[DECIDIR]** = precisa da palavra do humano. **[FAZER]** = já decidido, é
execução. **[AUTOR]** = frente de escrita do humano. **[CONSERTAR]** = defeito conhecido, com o
conserto claro. **[ADIADO]**, junto da outra marca (em qualquer ordem), tira o item da fila de trabalho, com o
motivo escrito no tema; ele continua contado como aberto.

**Quando o humano pedir "traga as pendências"**, a resposta é mostrar a contagem (seção 0), as
frentes (seção 1) e as trilhas (seção 6) para ele escolher, e não abrir todos os arquivos nem
tentar resolver tudo de uma vez.

---

## 0 · A contagem, e o que ela diz

**Por que a fila não anda.** Nos temas A a K, a maior parte do que está aberto é **DECIDIR** e
**AUTOR** (as duas colunas abaixo): só o humano move isso, e nenhuma instância pode. A coluna
**Adiados** é o que saiu da fila de propósito, com o motivo no tema. O tema L quase não tem essas
marcas porque a etiqueta dele é texto livre (a coluna "Outra marca"); o que ele tem de decisão
está na seção 3.

<!-- gen:pendencias-contagem -->

| Letra | Tema | Arquivo | Itens | Abertos | Parciais | Fechados | DECIDIR | FAZER | AUTOR | CONSERTAR | Outra marca | Adiados |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Arcano · As Artes | [`A-arcano-artes.md`](docs/pendencias/A-arcano-artes.md) | 28 | 18 | 1 | 9 | 11 | 4 | 4 | 0 | 0 | 0 |
| B | Bestiário | [`B-bestiario.md`](docs/pendencias/B-bestiario.md) | 14 | 9 | 0 | 5 | 4 | 5 | 0 | 0 | 0 | 0 |
| C | Trilhas de Feitiçaria | [`C-trilhas-feiticaria.md`](docs/pendencias/C-trilhas-feiticaria.md) | 4 | 4 | 0 | 0 | 2 | 1 | 0 | 0 | 0 | 1 |
| D | Proezas e Técnicas | [`D-proezas-tecnicas.md`](docs/pendencias/D-proezas-tecnicas.md) | 8 | 5 | 0 | 3 | 2 | 1 | 0 | 0 | 0 | 2 |
| E | Social, Mental e Antecedentes | [`E-social-mental-antecedentes.md`](docs/pendencias/E-social-mental-antecedentes.md) | 10 | 7 | 0 | 3 | 5 | 1 | 0 | 1 | 0 | 0 |
| F | Lore | [`F-lore.md`](docs/pendencias/F-lore.md) | 10 | 9 | 0 | 1 | 6 | 0 | 3 | 0 | 0 | 0 |
| G | Ações & Sistema | [`G-acoes-sistema.md`](docs/pendencias/G-acoes-sistema.md) | 43 | 29 | 0 | 14 | 23 | 2 | 0 | 4 | 0 | 0 |
| H | Arremesso | [`H-arremesso.md`](docs/pendencias/H-arremesso.md) | 6 | 4 | 0 | 2 | 1 | 0 | 0 | 2 | 0 | 1 |
| I | Mesa virtual · tempo real | [`I-mesa-tempo-real.md`](docs/pendencias/I-mesa-tempo-real.md) | 14 | 10 | 2 | 2 | 3 | 8 | 0 | 0 | 0 | 1 |
| J | Infraestrutura · endereço, hospedagem e versão | [`J-infraestrutura.md`](docs/pendencias/J-infraestrutura.md) | 12 | 9 | 0 | 3 | 1 | 3 | 0 | 2 | 1 | 2 |
| K | Combate · a linha do tempo | [`K-combate-linha-do-tempo.md`](docs/pendencias/K-combate-linha-do-tempo.md) | 32 | 18 | 1 | 13 | 14 | 5 | 0 | 0 | 0 | 0 |
| L | Simulação em massa e as oito regras novas do Simultâneo | [`L-simulacao-simultaneo.md`](docs/pendencias/L-simulacao-simultaneo.md) | 107 | 74 | 0 | 33 | 0 | 8 | 1 | 0 | 65 | 0 |
| | **Total** | | **288** | **196** | **4** | **88** | **72** | **38** | **8** | **9** | **66** | **7** |

*Contado pelas caixas de cada arquivo de tema: `- [ ]` aberto, `- [~]` parcial, `- [x]` fechado. As colunas de tipo contam os abertos e parciais que NÃO estão adiados, pela primeira palavra da casa na marcação (`FAZER/DECIDIR` conta como FAZER); "Outra marca" é o resto, quase todo do tema L, onde a etiqueta é texto livre. Adiados são os que têm `[ADIADO]` depois da sigla. Gerado por `scripts/gen-pendencias.mjs`; não edite à mão.*

**O que a contagem esconde, e o gerador acusa sem consertar:**

- `A-arcano-artes.md`: a sigla **A22** aparece 2 vezes (fechado · fechado)
- `G-acoes-sistema.md`: item sem sigla, "As cinco físicas de toda sessão." (fechado)
- `J-infraestrutura.md`: item sem sigla, "A linha de fechamento do `test-grid` é texto fixo · [DECIDIR]" (aberto)
- `L-simulacao-simultaneo.md`: **L6** tem a caixa aberta e o título riscado (a contagem o conta como aberto)
- `L-simulacao-simultaneo.md`: **L9** tem a caixa aberta e o título riscado (a contagem o conta como aberto)
- `L-simulacao-simultaneo.md`: a sigla **L6** aparece 2 vezes (fechado · aberto, riscado)
- `L-simulacao-simultaneo.md`: a sigla **L9** aparece 2 vezes (fechado · aberto, riscado)

<!-- /gen:pendencias-contagem -->

---

## 1 · As frentes, uma linha de estado cada

| Frente | Estado em 23/09/2026 | Quem decide o próximo passo | Onde mora |
|---|---|---|---|
| **Frenesi e teste de Virtude** | Regras decididas e no livro: o livro na rodada 90, com ajustes na 91 e na 92, e o "ficar parado" do Grid na 91 e na 92 (as três com PROCEDE). O teste de Frenesi não existe no motor. As três perguntas da Revisora foram decididas em 23/09 (§17) e **não estão implementadas**. | Execução | `FRENESI.md`; `leitura-de-novato-decisoes.md` §16 e §17 |
| **Jogador novo** | 47 perguntas `M`: 32 feitas, 7 decididas e esperando mão de obra, 6 abertas ou adiadas, 2 decididas sem nada a fazer. 104 consertos `C`: 90 fechados, 4 abertos, 3 parciais, 3 marcados como feitos que não estão, 2 recusados pela Executora e 2 fechados sem ação. Contagem remedida em 23/09 (a de 18 e 78 é de 16/09). | Execução, para as 7 decididas; humano, para as abertas | `jogador-novo-decisoes.md`, `jogador-novo-consertos.md`, `jogador-novo-consertos-2.md`, `jogador-novo-bestiario.md`, todos em `docs/simulacao/caixa/` |
| **Relações Sociais** | Rodadas 85 a 89 fechadas com PROCEDE. O item 9 (`acoes.longevidadeFirula` no `regras.json`) está **feito** (`6509801`, veredito `a6e7e41`). | Humano: a fronteira entre o dia a dia e o Combate Social, e os E4 a E8 | `ritmo-da-regua.md`; tema E |
| **O Grid** | Simulação encerrada (06/09). Fases 2 e 2.5 fechadas. Fase 3 congelada até a mesa reavaliar o plano. Fase 4 bloqueada por uma batalha de verdade. | Humano (fila do `PLANO.md` §8, itens 3 e 4) | `PLANO.md` §8 e §9; `ESTADO.md`; tema L |
| **Voz** | Barra de comando, desfazer e captura de áudio fechados (rodadas 30 a 33). Parada de propósito até o humano usar a barra numa batalha. | Humano (a batalha); depois execução | `VOZ.md` §8; L62, L71, L74 |
| **Mapa de Uldun** | Frente do Cartógrafo, em `lore/mapas/`. Empreitada autônoma na noite de 23/09, com o que é decisão marcado como recomendação dele, esperando o usuário testar. | Humano, pelo que o `RELATORIO-FINAL.md` lista | `lore/mapas/CARTOGRAFO.md`, `lore/mapas/RELATORIO-FINAL.md` |
| **Economia** | Um catálogo unificado de preços e um pedido de revisão para outra IA, em `lore/economia/`, **não versionados**. Nada decidido. | Humano | `lore/economia/catalogo-unificado.md`, `lore/economia/prompt-revisao-economica.md` |
| **Os temas A a L** | 249 itens; a contagem está na seção 0 e a lista na seção 7. | Por item (a marca diz) | `docs/pendencias/` |

---

## 2 · Pronto para executar, sem decisão pendente

### O que a §16 e a §17 deixaram

- **§16 (Frenesi e teste de Virtude): nada a executar.** O livro entrou na rodada 90, com ajustes
  na 91 e na 92, e o "ficar parado" do Grid passou à Virtude sozinha na 91 (a comparação foi para o
  motor na 92). A 93 foi outra coisa, o `reapontar.mjs`. O motor não tem caminho que role o teste
  de Frenesi (conferido na rodada 90), então a exceção do piso de 1d6 não tem onde entrar.
- **§17, três mudanças, todas de texto e dado:**
  1. **A Força entra na definição de ação física:** "as que rolam Força, Destreza ou Vigor", em
     `vida-ferimentos-cura.md` e `racas.md`, no `FRENESI.md` §5 e na própria §16. Muda para todo
     mundo: a penalidade de ferimento passa a valer no golpe das armas que rolam Força.
  2. **A tortura se divide em corpo e alma:** a dor do ferro é Vigor + Convicção; aguentar sem
     falar é a Convicção sozinha. Na tabela das Virtudes e no item Resistir de
     `aparencia-virtudes-vontade.md`. É a palavra "tortura" que a rodada 91 segurou.
  3. **A Firula negativa vale só no teste de Virtude e no Frenesi, e não devolve nada.**

### As decisões M que esperam mão de obra

Remedidas em 23/09. **Duas das seis que o `CONTEXTO.md` lista já estão feitas**, fora das rodadas
numeradas: a **M-05** (`7db14f1`, 17/09) e a **M-42** (`2520b5d`, 18/09, veredito `21304e2`).

| Decisão | O que falta | Onde a decisão mora |
|---|---|---|
| **M-01** · a ficha avisa os limites da criação, sem travar | nada no código lê os limites de criação | `jogador-novo-decisoes.md`, seção M-01 |
| **M-07** · os três números dos verbetes | a Esquiva encurralada e a segunda Firula continuam sem número; a armadura na Furtividade tira ponto, e a decisão diz dado | seção M-07 |
| **M-24** · a Investida é Corrida que termina em ataque | o `regras.json` (`combate.movimento.investida`), o capítulo de Combate e o Grid seguem no modelo velho | seção M-24 |
| **M-33** · Imobilizado são quatro prisões | `armas.json` ainda cita "Acrobacias"; o capítulo de armas ainda diz "vs o lançamento"; a condição não tem tipo; o `regras.json` não tem as quatro saídas | seção M-33 |
| **M-18** · Canalizar Virtude com carga binária | decidida em 16/09, texto antigo no livro; o registro de autoria é o **L102** | seção M-18 |
| **M-06 / M-19** · Virtude e Vontade não se somam | parcial: o que falta é a §17 acima | seções M-06 e M-19 |

### Os consertos C que continuam abertos

- **Abertos:** nenhum. C-22, C-23, C-39, C-61, C-102, C-103 e C-104 fechados na rodada 99
  (`bed1e91`). Os três que estavam marcados como feitos sem estar (C-22, C-39, C-61) nunca tinham
  sido consertados: `git log -S` mostra cada frase só no commit que a criou.
- **Parciais:** C-12 (falta decisão: as cinco linhas do Bram ficaram por escolha registrada na
  M-02), C-47 (falta execução: os três números da M-07), C-85 (falta execução: o link do ☆ em
  `/artes/catalogo` e em `/caminhos/<proeza>`).
- **Recusados pela Executora, sem decisão de mesa:** C-72, C-87.

### Nos temas

Os itens marcados **[FAZER]** e **[CONSERTAR]** da seção 7 são execução. Os que já têm prova de
feito estão na seção 5, e não entram aqui.

---

## 3 · Com o humano

- **Da `PASSAGEM.md` §7:** a conversa do modo site (por que a mesa rola o dado na mão, L26, e quem
  digita o total, L29 item 1); testar a barra de comando na mesa; jogar uma batalha de verdade.
  **A migração 33 que a §7 ainda lista como esperando ele já rodou** (13 a 14/09, `CONTEXTO.md`,
  seção "As migrações").
- **Do `PLANO.md` §8:** o item 3 (gravar o par régua contra botão do veredito numa mesa de verdade)
  e o item 4 (a decisão "fase 2.5 ou fase 4", que o próprio plano diz para não abrir sem ele pedir).
- **Relações Sociais:** onde termina o dia a dia e começa o Combate Social; e os **E4 a E8**
  (tema E), dos quais o E4 é regra de jogo que ninguém decidiu.
- **Jogador novo, as abertas:** M-15 (o que a Energia Espiritual faz, com direção provável),
  M-22 (adiada), M-27 (suspensa com o módulo de Fôlego), M-41 (adiada até a revisão das Proezas),
  M-43 e o custo da M-46 (esperam a fila fechar).
- **O dossiê publicado** (`https://claude.ai/artifact/2H8aDMgNmU7A6hP5wo26s4`), lido em 23/09/2026
  às 20:22: **nenhuma marca gravada** (o estado da página é vazio). As 19 perguntas dele foram
  quase todas decididas depois por outro caminho; ele não é mais a fila.
- **Toda pergunta de regra aberta nos temas:** os itens da seção 7 com **DECIDIR** na coluna
  Marcação (no tema L a marca é livre, e as perguntas de regra aparecem como "DECISÃO DE MESA",
  "PEDIDO" e "PERGUNTADO"), mais o item sem sigla do tema J (a linha de fechamento do `test-grid`).
  A lista não é repetida aqui de propósito: seria uma segunda lista para divergir da gerada; a
  soma está na coluna DECIDIR da seção 0. As cinco que mais destravam estão no topo da trilha de
  decisão (seção 6). Uma nota: **o K4 dizia que não podia ser decidido antes do K13, e o K13 está
  consertado desde 19/08**.

---

## 4 · Os bloqueios de produção e de mesa

| O que | Estado | O que destrava |
|---|---|---|
| **Migrações (L42)** | Todas as escritas estão aplicadas, de 1 a 39, lidas no banco em 14/09. A 34 não existe como arquivo. A `migracoes_fronteira` devolve nulo desde a 33, e o instrumento está certo. | Decidir o que fazer com a linha da 35 (registrado no L86b) |
| **A barra de comando sem teste (L62)** | Sem teste automatizado commitado; `mover` contra casa ocupada falha em silêncio (herdado de `porNoMapa`). | Um teste; o primeiro achado continua aberto por decisão do humano |
| **O modelo de voz que trava (L71)** | Um modelo presente mas corrompido trava para sempre, sem prazo. Escalado pela Revisora; decisão tomada, e o teste do prazo existe desde a rodada 39. | Conferir se o L71 fecha (seção 5) |
| **O gatilho `armadilha` (L86b)** | Família de quatro Efeitos (`brasa-retardada`, `semente-adormecida`, `salvaguarda`, `cura-guardada`) que disparam por condições diferentes, nenhuma decidida. O chão da `cura-guardada` existe (migração 39) sem consumidor. | Desenho de regra, do humano |
| **A batalha de verdade** | Pré-requisito da fase 4 e da voz, e o que confirma tudo o que nunca passou por mesa. | O humano sentar e jogar, com a barra aberta |

---

## 5 · A revisão de 23/09/2026: o que fechou com prova e o que é suspeito

**Caixa só muda com prova** (um sha, ou uma entrada de decisão), citada ao lado no próprio tema.
Sem prova, o item fica aberto e aparece aqui como suspeito.

### Fechados nesta revisão, com prova no tema

**Rodada 94:** A22 (a entrada de antes da decisão; a decisão é a outra A22), B13 (`888a196`), D1
(`971b6f4`), E9 (`b903a26`), E10 (`fb9310c`), K12 (§14 e §16 de `leitura-de-novato-decisoes.md`, e
`c5dd390`), K13 (`b6af150`). **Rodada 96:** J4, o mesmo defeito do B12, consertado em `20daeea`
(conferido: nenhum leitor de fraqueza ou resistência no topo da criatura sobra em `src/`).

Todos são a forma "fechar a frente sem fechar o documento" (`CATALOGO.md`): o trabalho estava
pronto, e a caixa ficou aberta.

### Suspeitos de fechado, nos temas A a K

| Item | A evidência | O que falta para fechar |
|---|---|---|
| **C3**, **C4** | a M-10 decidiu que a Tradição é requisito de ficção e que Trilha não é palavra do Arcano | o C3 perde o sentido (e está `[ADIADO]` desde a rodada 96); o C4 ainda pede revisar o mortal-tocado (o Bram) |
| **K28** | o próprio item diz "fecha inteiro", e mantém aberto pela falta de zona de controle | registrar que a ausência é decisão |
| **K20** | o deslocamento na Recuperação foi decidido no K28; o −1d6 está no código | escrever que o ataque normal não cabe, e listar as ações livres |
| **K27** | a decisão que faltava ("o atacante acompanha com o próprio passo") está no K28 | a fatia 2 no código e a prova de mesa |
| **K5** | a fase 4 andou (`77516b7`) e o K12, um dos bloqueios, fechou | K17, o lado do jogador e a Pressão da Arte mirada |
| **G12** | a §4b diz que ferimento e Desgaste cortam do mesmo pool | se o teto 4 vale para a soma, e a prosa do capítulo |
| **G13** | só o preço da peça pronta andou (`a492010`, `484c33f`) | os outros seis assuntos |
| **E3** | a M-36 decidiu "a banda é 3", numa unidade que pode não ser a do E3 | confirmar se é a mesma pergunta; o decaimento não foi decidido |

### Suspeitos de fechado, no tema L

O próprio texto destes itens diz que alguma coisa foi feita ou fechada, e a caixa continua aberta.
A maioria fecha em parte; **nenhum foi reconferido** (estão fora da zona das rodadas 75 a 93):

- **Dizem fechado por inteiro, com sha:** L80 (`3c5201d`, revisado `d6a6e19`), L81 (`e99049c`,
  revisado `4453963`), L84 (rodada 50, `529e21c` e `cb21dbd`), L87 (`454a1d8`, `71a0228`), L88
  (`8d7b450`, `697fc29`), L93 (`75bcb32`, `fcf778e`), L89 (consertado no mesmo dia), L70 ("fecha sem
  CORRIGE"), L76 (resolvido pela fórmula do L77), L71 (fechado quanto à decisão, e o teste do prazo
  existe).
- **Dizem fechado em parte:** L8, L33 (falta rodar a 33, que já rodou), L35 (um bloco feito; a
  decisão da furtividade por porte e categoria está no `CONTEXTO.md` e o L35 não foi marcado), L42,
  L43, L45, L48, L52, L62, L86 (o L86a fechou).
- **Duplicatas:** L6 e L9 têm uma entrada `[x]` e outra `[ ]` riscada, e a riscada conta como aberta.

### O que a contagem esconde

Siglas repetidas (A22, L6, L9), item aberto riscado e item sem sigla: o gerador as lista na seção
0, sem consertar. **O I5 eram dois itens diferentes com a mesma sigla**; na rodada 96 o editor de
cenário ficou com ela (é o citado de fora) e o anel de Vida remoto virou **I14**, com a
renumeração registrada no tema.

### Documentos de direção que envelheceram

- **`CONTEXTO.md`:** lista M-05 e M-42 como esperando mão de obra (estão feitas); diz que o item 9
  de Relações Sociais não foi executado (foi); diz "rodada 85 em revisão" (fechou); a contagem
  18 e 78 é de 16/09.
- **`PASSAGEM.md` §7:** diz que a migração 33 espera o humano (rodou em 13 a 14/09).
- **`PLANO.md` §8:** o quadro de 20/09 aponta Relações Sociais como próximo passo, e o item 9 que
  ele espera já foi feito.
- **`FRENESI.md` §5 e a §16:** "Vigor ou Destreza", que a §17 muda.
- **O `Pendencias.md` de antes desta revisão:** a "Ordem sugerida" de agosto listava A21 e A22 como
  abertas (fecharam em 19/08), e a prosa somava os E4 a E10 e o J9 e J10 por cima de uma tabela que
  já os contava.

---

## 6 · As três trilhas · PROPOSTA DO ARQUITETO, e não decisão

*Redigida pela Executora nas rodadas 94 e 96, para o Arquiteto revisar antes de o humano ver. Nada
aqui foi decidido.*

Não é uma fila só. São três trilhas que não disputam o mesmo recurso, e por isso correm ao mesmo
tempo: uma gasta o tempo do humano, outra gasta token, a terceira gasta o tempo criativo dele.

### Trilha de DECISÃO · custa tempo do humano, e zero token

**No topo, as cinco decisões-raiz, ordenadas por quanto destravam, e não por urgência.** Elas são do
humano, e ele responde em bloco:

1. **F7 · travar o panteão.** Trava a F5 e a F6: uma decisão libera dois itens de autoria.
2. **F3 · a mecânica de clérigo, paladino e monge.** Trava a B4. Enquanto não sair, **47 das 309
   criaturas** têm fraqueza a sagrado que nada no jogo dispara (conferido em 23/09 nos dois lugares
   em que o dado mora, `monsters.json` e `elementos-bestiario.json`).
3. **A camada de Tradição.** Trava a C1, a C2, metade da A11, e por consequência a C3 e a C4. É o
   bloqueio mais antigo do mapa.
4. **G12 · o teto 4 da soma de Desgaste e ferimento.** Os dois já cortam do mesmo pool, somando
   direto e com o piso comum em 1d6 (`vida-ferimentos-cura.md`, desde `2b08d7a`, 22/09/2026). O que
   continua aberto é só se o teto 4 do Desgaste vale para a soma dos dois.
5. **E4 com E8 · a régua de Relação.** O capítulo publicado depende delas. O E8 tem o dente medido:
   15 pontos saem em 3 intervalos, e 14 saem em 6.

**Depois delas, na mesma lista única** (a regra da casa: pergunta de regra vem em lista, não item a
item): o **K4**, destravado desde que o K13 caiu; as perguntas M abertas e os E5 a E7 (seção 3); a
conversa do modo site e os itens 3 e 4 do `PLANO.md` §8; a fronteira entre o dia a dia e o Combate
Social; e o resto da coluna DECIDIR da seção 0.

### Trilha de EXECUÇÃO · custa token, e zero tempo do humano

Só o que já tem decisão:

1. **A §17 inteira, numa rodada.** Foi decidida em 23/09, é pequena (texto e dado), e fecha a frente
   do Frenesi e do teste de Virtude **no livro**. O motor continua sem o teste de Frenesi, porque
   nenhuma tela o rola. Deixar a §17 para depois é deixar o livro dizendo "Vigor ou Destreza" com a
   regra já trocada.
2. **As M decididas e não feitas (M-01, M-07, M-24, M-33, e o texto da M-18), mais os C parciais
   que são execução (C-47, C-85).** Os três C que estavam marcados como feitos sem estar (C-22, C-39,
   C-61) e os C abertos fecharam na rodada 99 (`bed1e91`). É execução pura sobre
   decisão que o humano já pagou. A M-24 e a M-33 mexem em combate e no Grid, então pedem revisão
   com cuidado.
3. **Registro:** fechar com prova o que a seção 5 lista como suspeito, e reescrever o `CONTEXTO.md` e
   o §7 da `PASSAGEM.md`. É barato, e cada suspeito aberto é uma pergunta que a próxima instância
   refaz. O L tem dez itens que se declaram fechados por inteiro.
4. **Os [FAZER] e [CONSERTAR] dos temas** (as colunas FAZER e CONSERTAR da seção 0).

A fila do Grid (`PLANO.md` §8) está nesta trilha, e está parada: o que ela espera é a batalha de
verdade, abaixo.

### Trilha de AUTORIA · custa o tempo criativo do humano, e não trava nada técnico

Os itens [AUTOR] dos temas (a coluna AUTOR da seção 0). Dois deles, a F5 e a F6, esperam a F7 da
trilha de decisão. Nenhum item de autoria segura código.

### O que não cabe em trilha: a batalha de verdade

É tempo do humano, mas não é decisão: é jogar. Destrava de uma vez a fase 4, a voz e o L62, e nenhuma
rodada substitui o que ela revela (`PLANO.md` §9).

### O que saiu das trilhas: os adiados

Sete itens foram marcados `[ADIADO]` na rodada 96, por proposta do humano, com o motivo escrito no
tema: o catálogo das Artes (C3), os travessões em dado publicado (J0 e J10), o ponteiro ao vivo (I8)
e três refinamentos que ninguém sentiu falta em mesa (H4, D3 e D6). Eles continuam contados como
abertos, na coluna Adiados da seção 0, e fora das somas de trabalho.

---

## 7 · Os temas

A lista abaixo é gerada pelos arquivos de tema (a contagem está na seção 0). **O detalhe de cada
item mora no arquivo do tema**, e é lá que a caixa muda.

Os itens abertos e parciais de cada tema, com a marca e o título; os fechados vão só pela sigla.

<!-- gen:pendencias-itens -->

### A · Arcano · As Artes

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| A1 | aberto | DECIDIR | Guardar um feitiço: os limites. |
| A2 | aberto | DECIDIR | Focos das Artes não elementais. |
| A3 | aberto | DECIDIR | O desconto da fonte pode passar de +1? |
| A4 | aberto | DECIDIR | Rituais. |
| A5 | aberto | DECIDIR | Clarão Cegante. |
| A6 | aberto | DECIDIR | O campo `escalonavel`. |
| A7 | aberto | AUTOR | Treze Efeitos elementais ainda sem número |
| A8 | aberto | FAZER | Revisar em mesa a primeira leva |
| A9 | aberto | FAZER | O Efeito Especial no bestiário. |
| A10 | aberto | FAZER | Abertura do capítulo para iniciante. |
| A11 | parcial | DECIDIR | Duas partes, dois estados |
| A13 | aberto | AUTOR | Revisar Área × Volume. |
| A14 | aberto | FAZER | Revisar os textos de Regras das Artes |
| A24 | aberto | AUTOR | Dar um molde a cada Efeito que ainda declara `zona`. |
| A25 | aberto | DECIDIR | A geometria das Artes que não manifestam elemento. |
| A15 | aberto | AUTOR | Revisar as descrições de nível das Artes |
| A26 | aberto | DECIDIR | O improviso pode começar em qualquer lugar? |
| A19 | aberto | DECIDIR | O que a matéria dentro da fatia faz em número. |
| A16 | aberto | DECIDIR | A Fonte do Elemento: os elementos que faltam. |

Fechados (9): A12, A17, A18, A22, A23, A27, A21, A22, A20.

### B · Bestiário

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| B4 | aberto | DECIDIR | Nada causa dano `sagrado` nem `profano`. |
| B5 | aberto | DECIDIR | `prata` não é representável. |
| B6 | aberto | DECIDIR | `sol` é ambiente, não ataque. |
| B2 | aberto | FAZER | Modificadores de Defesa por porte. |
| B3 | aberto | FAZER | Rebalancear os brutos grandes. |
| B7 | aberto | FAZER | O ataque da criatura do livro não volta para o formulário. |
| B8 | aberto | FAZER | O modal não edita poderes, técnicas nem artes. |
| B9 | aberto | DECIDIR | Onde a criatura editada mora. |
| B11 | aberto | FAZER | Palavra nova de fraqueza precisa de rito para virar oficial. |

Fechados (5): B12, B1, B1b, B10, B13.

### C · Trilhas de Feitiçaria

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| C1 | aberto | DECIDIR, BLOQUEADO | Jogadas das Artes, casos de fronteira. |
| C2 | aberto | DECIDIR, BLOQUEADO | A perícia de conjuração de cada Tradição. |
| C3 | aberto, ADIADO | FAZER | O mapa Arte × Trilha. |
| C4 | aberto | FAZER | Portar `trilhas.json` |

Fechados (0): nenhum.

### D · Proezas e Técnicas

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| D3 | aberto, ADIADO | DECIDIR | Densidade dos funis. |
| D5 | aberto | FAZER | Reorg de conteúdo. |
| D6 | aberto, ADIADO | DECIDIR | Custo de Técnica e de Arte em ×10. |
| D7 | aberto | DECIDIR | Bônus de Centelha em ataque e defesa: +1 ou +2 por ponto? |
| D8 | aberto | DECIDIR | Mãos Hábeis: +3 ou +2 em Ofícios? |

Fechados (3): D1, D2, D4.

### E · Social, Mental e Antecedentes

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| E2 | aberto | FAZER | Portar `Ataques_Mentais.md` ao site. |
| E3 | aberto | DECIDIR | Banda neutra da Régua de Relação: 5 ou 3? |
| E4 | aberto | DECIDIR | A jornada "Neutro → +2 Apreço" do ritmo da régua não se reconstrói pela fórmula. |
| E8 | aberto | DECIDIR | A trava de um gesto por intervalo não é monotônica. |
| E5 | aberto | DECIDIR | ⚑ O que a leitura revela no modo devagar. |
| E6 | aberto | DECIDIR | ⚑ O preço de um gesto em moeda. |
| E7 | aberto | CONSERTAR | A Dama Vesna tem três estados diferentes no mesmo capítulo. |

Fechados (3): E1, E9, E10.

### F · Lore

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| F1 | aberto | DECIDIR | Como os deuses romperam a Lei |
| F2 | aberto | DECIDIR | Quem impôs a Lei. |
| F3 | aberto | DECIDIR | Mecânica de clérigo, paladino e monge |
| F4 | aberto | DECIDIR | Os planetas. |
| F5 | aberto | AUTOR | Nomes próprios. |
| F6 | aberto | AUTOR | Deuses locais e espíritos de lugar |
| F7 | aberto | DECIDIR | Travar a §7 (o panteão). |
| F8 | aberto | AUTOR | Os nomes do calendário. |
| F10 | aberto | DECIDIR | A moeda mecânica das datas afinadas. |

Fechados (1): F9.

### G · Ações & Sistema

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| G2 | aberto | DECIDIR | Reequilibrar a Especialidade. |
| G6 | aberto | DECIDIR | Percepção passiva: confirmar. |
| G12 | aberto | DECIDIR | Desgaste e ferimento não se conhecem. |
| G13 | aberto | FAZER | As sobras das duas famílias escritas. |
| G11 | aberto | FAZER | `regras.json → acoes`. |
| G14 | aberto | DECIDIR | Firula na ação Longa. |
| G15 | aberto | DECIDIR | Como o bônus fixo de Proeza entra na Longa. |
| G16 | aberto | DECIDIR | Alcance da regra da maior e da menor. |
| G17 | aberto | CONSERTAR | Nomes de ofício divergentes. |
| G21 | aberto | DECIDIR | Direção sem custo. |
| G22 | aberto | DECIDIR | O que é o "ganho por semana". |
| G23 | aberto | CONSERTAR | Duas espadas no mesmo documento. |
| G24 | aberto | DECIDIR | Semântica do teto de demanda do ganho de ofício. |
| G25 | aberto | DECIDIR | Peça de mais de um ofício. |
| G26 | aberto | DECIDIR | O que é "arma marcial". |
| G27 | aberto | DECIDIR | O machado da faca. |
| G28 | aberto | CONSERTAR | O ofício Arcos não está na lista de ofícios. |
| G30 | aberto | DECIDIR | O braçal soma com material bom. |
| G31 | aberto | DECIDIR | A cerca é obra? |
| G32 | aberto | DECIDIR | O curandeiro ainda apoia pelo modo antigo. |
| G33 | aberto | DECIDIR | O teste coletivo perdeu o equilíbrio. |
| G34 | aberto | DECIDIR | "Apoio numa jogada única" e "jogada estendida" no mesmo parágrafo. |
| G35 | aberto | CONSERTAR | O catálogo de ações ainda cita o apoio antigo. |
| G36 | aberto | DECIDIR | A Brigandina domina a Cota de malha e a Camisa de malha. |
| G37 | aberto | DECIDIR | A Placa articulada domina a Placa de transição. |
| G38 | aberto | DECIDIR | Kite × Heater e Pavês × Scutum. |
| G39 | aberto | DECIDIR | O Machado custa mais que a Espada Longa. |
| G40 | aberto | DECIDIR | Preços provisórios de baixa confiança, sem linha de fabricação. |
| G41 | aberto | DECIDIR | As três bestas sem base de custo. |

Fechados (14): G1, G3, G4, "As cinco físicas de toda sessão.", G5, G5b, G7, G8, G9, G10, G18, G19, G20, G29.

### H · Arremesso

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| H3 | aberto | DECIDIR | Os quatro assuntos que a proposta levanta e não fecha |
| H4 | aberto, ADIADO | DECIDIR | O degrau de baixo do fator de forma: ÷2 ou ÷3? |
| H5 | aberto | CONSERTAR | O Arco de Guerra não existe no catálogo. |
| H6 | aberto | CONSERTAR | O teto de Força do Arco Curto diverge. |

Fechados (2): H1, H2.

### I · Mesa virtual · tempo real

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| I1 | aberto | FAZER | Fechar o canal. |
| I2 | aberto | FAZER | O registro da arena ainda é um `jsonb` reescrito inteiro. |
| I5 | aberto | FAZER | Um editor de cenário no Grid. |
| I3 | aberto | FAZER | As outras abas ainda não ouvem. |
| I4 | aberto | FAZER | Nada garante entrega. |
| I14 | aberto | FAZER | O anel de Vida remoto aparece em salto. |
| I6 | aberto | FAZER | A presença não distingue quem está olhando. |
| I8 | aberto, ADIADO | DECIDIR | Ponteiro ao vivo. |
| I9 | aberto | DECIDIR | O caderno de melhorias do tabuleiro. |
| I10 | aberto | FAZER | As pontas soltas do jogador no tabuleiro. |
| I11 | parcial | DECIDIR | A Arte sai no ÚLTIMO Tick, no tabuleiro. PARCIAL em 2026-08-21. |
| I12 | parcial | DECIDIR | O Grid como copiloto: menos toque, mais escolha. FEITO em 21/08, menos uma decisão de regra. |

Fechados (2): I7, I13.

### J · Infraestrutura · endereço, hospedagem e versão

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| J0 | aberto, ADIADO |  | 41 travessões sobreviveram dentro de `src/data/*.json` |
| J1b | aberto | FAZER | SMTP próprio no Supabase. |
| J2 | aberto | DECIDIR | Qual hospedeiro. |
| J3 | aberto | FAZER | Sair do GitHub Pages, e só então subir para o Astro 7. |
| J6 | aberto | CONSERTAR | `/mesa/referencia` rola de lado no telefone, e a culpa é da classe do embrulho. |
| J9 | aberto | CONSERTAR | `gen-mermaid.mjs` redesenha os seis diagramas a cada execução, e o `--check` não enxerga isso. |
| (sem sigla) | aberto |  | A linha de fechamento do `test-grid` é texto fixo · [DECIDIR] |
| J11 | aberto | FAZER | O link automático de "Perfuração" leva ao gate quando o texto fala do modo de dano, e nenhum portão confere … |
| J10 | aberto, ADIADO | DECIDIR | Os 23 travessões do `regras.json`, e seis deles NÃO são travessão. |

Fechados (3): J1, J4, J5.

### K · Combate · a linha do tempo

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| K11 | aberto | DECIDIR | Alabarda, Maça e o Impacto de uma mão. |
| K8 | aberto | DECIDIR | Cinco das nove bordas. |
| K4 | aberto | DECIDIR | O Preparo de distância e arremesso. |
| K9 | aberto | DECIDIR | A carga voluntária. |
| K6 | aberto | DECIDIR | A leitura do sinal. |
| K20 | aberto | DECIDIR | O que se pode fazer no Preparo e na Recuperação. |
| K17 | aberto | DECIDIR | O arqueiro ficou forte demais. |
| K18 | aberto | DECIDIR | A Técnica Ambidestria ficou sem função. |
| K19 | aberto | FAZER | A cadeia foi medida só na arma leve. |
| K21 | aberto | FAZER/DECIDIR | As armas versáteis: a regra, a lista e o preço da forma de duas mãos. |
| K24 | aberto | DECIDIR | O montante e o martelo pagam duas vezes, e o dano não conserta. |
| K27 | aberto | DECIDIR | O Golpe sai depois, e a mesa ainda resolve na declaração. |
| K30 | aberto | FAZER | A CAIXA QUE ABRE NO TICK EM QUE A ARTE SAI |
| K28 | parcial | DECIDIR | Deslocamento: sete decisões tomadas em 21/08, a oitava (código) já saiu; falta só a ausência. |
| K25 | aberto | DECIDIR | A Defesa da arma e a do escudo somam, e o escudeiro vira parede. |
| K14 | aberto | DECIDIR | A bancada só mede o canto "todo mundo esquiva". |
| K5 | aberto | FAZER | A implementação: os DOIS sistemas. |
| K31 | aberto | FAZER | O Grid anda a Corrida só na primeira fase: a regra publicada tem duas, e o código aplica metade. |
| K32 | aberto | DECIDIR | Tags de arma sem definição. |

Fechados (13): K29, K1, K2, K3, K10, K7, K15, K16, K22, K23, K26, K12, K13.

### L · Simulação em massa e as oito regras novas do Simultâneo

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| L1 | aberto | FAZER | As oito regras novas do Simultâneo (N1 a N8), na mesa. |
| L2 | aberto | FAZER | As 15 bandeiras de regra |
| L3 | aberto | FAZER | O `ate` das condições passa a ser lido |
| L4 | aberto | FAZER | A migração 30 |
| L6 | aberto, riscado | DEPOIS | O harness. |
| L9 | aberto, riscado | PRIMEIRO | O encontro carimba o perfil de bandeiras. |
| L10 | aberto | ANTES DE LER O RESULTADO | Duas coisas que não bloqueiam o começo e bloqueiam a leitura. |
| L8 | aberto | FAZER | Fundir as duas especificações de política. |
| L16 | aberto | OBSERVAÇÃO | A política automática do produto termina a cena em debandada. |
| L25 | aberto | DÍVIDA DE PRODUTO, NÃO DE INSTRUMENTO | O item 1.0 da Etapa 1 foi dado como feito e não está feito. |
| L35 | aberto | DECISÃO DE MESA | A CRIATURA NÃO TEM PERÍCIA, E A COMPARAÇÃO DO GOLPE DO ESCURO FECHA PARA UM LADO SÓ |
| L33 | aberto | FASE 2.5 | A VISTA DO JOGADOR COMO PRODUTO |
| L30 | aberto | FAZER | OS DEZ MÓDULOS FORA DE TODO PACOTE DE TESTE |
| L29 | aberto | A FILA DO GRID | Sete consertos, e o `ESTADO.md` é a fonte. |
| L28 | aberto | PEQUENO | O alarme do E4 inerte é o único sem teste. |
| L26 | aberto | PRIMEIRO, E NÃO É CÓDIGO | Por que as mesas rolam o dado na mão? |
| L24 | aberto | DEPOIS | O ⏭ é um terço do trabalho do mestre, e nenhuma regra o toca. |
| L23 | aberto | DEPOIS | A fração de gestos com JOGADOR na mesa. |
| L20 | aberto | DEPOIS | Uma política que recua |
| L7 | aberto | DEPOIS | A medição de campo do Supabase real |
| L40 | aberto | MITIGADO EM 05/09/2026 | O registro do jogador que o mestre apaga sem saber |
| L41 | aberto | PENDÊNCIA DA MESMA FAMÍLIA | Leitura-modificação-escrita de coleção inteira a partir de foto local |
| L42 | aberto | AS CINCO RODARAM | As migrações pendentes |
| L43 | aberto | OS DOIS LADOS FEITOS | A marca da mordida que a aba do jogador apagava |
| L45 | aberto | A 36 FECHOU O DEFEITO ORIGINAL | A fachada que preserva a forma e troca o destino |
| L36 | aberto | QUANDO A REGRA APARECER | O `resumoParaBanco` é vitrine, e não entrada de conta. |
| L47 | aberto | ACHADO NA REVISÃO DE 06/09/2026, SÓ REGISTRO | O portão por literal continua dentro da própria bancada do avanço unificado. |
| L48 | aberto | ABERTO | O harness chamava 20 funções da lib, e a mesa 41. |
| L51 | aberto | FAZER | Só 1 das 4 views do lado do jogador tem prova automática contra o SQL real. |
| L52 | aberto | PARCIAL | Duas contagens que nunca existiram. |
| L54 | aberto | FAZER | `scripts/mapa.mjs`, a forma final do `docs/MAPA.md`. |
| L55 | aberto | BLOQUEADO | O `~42%` de `regras.json:910` está errado; o número certo para o lugar dele ainda não existe. |
| L56 | aberto | ANOTADO | Payoff da arma leve. |
| L57 | aberto | ANOTADO | Bookkeeping do Quase-Acerto. |
| L58 | aberto | ANOTADO | Trilha de aprendizado para quem chega agora. |
| L59 | aberto | ANOTADO | As quatro reservas (Energia/Mana/Fôlego/Vontade) podem ser carga cognitiva demais. |
| L60 | aberto | ANOTADO | Quatro recomendações de `Auditoria_Memoria/RELATORIO.md` §5, de uma sessão fora do arranjo. |
| L62 | aberto |  | dois achados da revisão do aviso 30 (barra de comando, `VOZ.md` §8 item 1), nenhum bloqueando o veredito … |
| L63 | aberto | ANOTADO | Os três termos do trabalho do mestre aparecem com dois arredondamentos diferentes. |
| L101 | aberto | DITO | O alcance do portão de vocabulário foi justificado por uma medida presa à lista de palavras de HOJE, e ela … |
| L100 | aberto | ACHADO | O foco da caixa de diálogo cai no botão errado por ordem do DOM, e a intenção escrita é a oposta. |
| L99 | aberto | MEDIDO | A trava da cura não existe no SERVIDOR, e as quatro saídas têm preço. |
| L98 | aberto | ESCALA | O gancho passou a escrever `.astro/` a cada commit de código, e o `.astro/` é compartilhado por quem divide a … |
| L97 | aberto | ACHADO | O `test-grid` do smoke falha de forma INTERMITENTE, e a taxa medida subiu: 3 falhas em 7 execuções … |
| L96 | aberto | ESCALA 1 | Duas varreduras de dano contínuo escrevem a Vida por motores diferentes, e só uma tem piso. |
| L95 | aberto | ACHADO | O peso de quem é empurrado nunca vem do bestiário: o campo lido não existe, e a estimativa por porte responde … |
| L94 | aberto | ACHADO | Passar pelo espaço de outra criatura: hoje é impossível, e "cercado não é preso" é o nome de um cenário de … |
| L93 | aberto | LEVANTADO | O passo automático grava posição, ignora a recusa, e escreve no registro que a peça andou. |
| L92 | aberto | ACHADO | O tipo não protege os dublês: campo novo obrigatório numa interface passa pelo compilador e quebra em tempo … |
| L91 | aberto | MEDIDO | Sobram 59 travessões de prosa em SEIS documentos que nunca foram varridos, e o `L79` não mentiu sobre isso. |
| L90 | aberto | ACHADO | Uma cena de `scripts/test-grid.mjs` falha por intermitência no arrasto por mouse simulado, e passa na … |
| L89 | aberto | ESTRAGO | O reapontador movia em silêncio, e rodá-lo duas vezes sobre o mesmo diff não commitado quebrou 39 citações de … |
| L65 | aberto | ANOTADO | Dez citações de linha em `grid.astro` foram reapontadas TRÊS vezes num só dia, e vão envelhecer de novo no … |
| L71 | aberto | ESCALADO | O carregamento do modelo de voz não tem prazo, e um modelo PRESENTE mas corrompido trava para sempre, sem … |
| L74 | aberto |  | O teste do status da voz fica verde com o defeito de volta: a costura RECALCULA o texto em vez de OBSERVAR o … |
| L77 | aberto | ACHADO | O `L67` foi construído só de um lado: o raio do ALVO entra na régua, o do próprio ATACANTE não entra em lugar … |
| L76 | aberto | ESCALADO | A interposição continua medindo de centro a centro depois do `L67`, e a régua nova não chegou nela. |
| L78 | aberto | PEDIDO | Falta um campo de ALCANCE por criatura: o braço derivado do porte trata corpos diferentes como iguais. |
| L80 | aberto | MEDIDO | O portão da procedência confere DOIS documentos, e há dez outros com citação de código viva. |
| L81 | aberto | ACHADO | O `BASE` do aviso sai do `HEAD` da worktree da Revisora, e esse `HEAD` fica num commit órfão toda vez que o … |
| L82 | aberto | SEPARADO | A dívida de travessão no CÓDIGO: 702 ocorrências em 116 arquivos, e 55 delas não são pontuação. |
| L70 | aberto | REGISTRADO | A gravação de posição não passa pela checagem de ocupação, e a invariante mora nos chamadores em vez de morar … |
| L83 | aberto | PERGUNTADO | O que acontece quando um empurrão joga um corpo para cima de outro. A regra passou a existir; o que falta são … |
| L88 | aberto | MEDIDO | A invariante de ocupação ganha um DETECTOR no cliente, e não uma trava no banco. |
| L86 | aberto | ACHADO | Sete Artes marcadas como cura não curam nada no tabuleiro, e o caminho não está escrito. |
| L87 | aberto | ACHADO | Duas escritas de condição gravam no banco sem repintar a coluna de iniciativa, e uma delas não avisa a mesa. |
| L84 | aberto | MEDIDO | `noChao` responde duas perguntas diferentes com uma função só, e a condição "Caído" paga a conta. |
| L69 | aberto | ANOTADO | Nem toda criatura chega pelo caminho de borda. |
| L66 | aberto | ANOTADO | `porNoMapa` recusa em silêncio, e quem a chama tem de trazer o próprio sinal. |
| L102 | aberto | AUTOR | M-18, Canalizar Virtude: teto ou contrapartida. Regra nova de verdade, não conserto pontual. |
| L103 | aberto | ANOTADO | O laço do harness não soma ao ataque as condições nem o porte que a mesa soma. |
| L104 | aberto | ESCALA | Uma asserção do `test-grid` cai às vezes: 3 falhas em 60 runs do CI, sempre na "Criatura 17". |
| L105 | aberto | ANOTADO | A caixa que o mestre lê ao rolar a iniciativa no Grid ainda diz "Tick 0". |
| L106 | aberto | ANOTADO | "No máximo 60 KB de HTML por movimento (foram 67,1 KB)". |

Fechados (33): L5, L6, L9, L11, L12, L13, L14, L15, L17, L18, L19, L21, L22, L34, L32, L31, L27, L37, L39, L44, L46, L49, L50, L53, L61, L64, L67, L72, L73, L75, L79, L85, L68.

<!-- /gen:pendencias-itens -->
