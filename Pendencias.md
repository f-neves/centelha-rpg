# Pendências do Centelha

**Para quem vai propor a próxima rodada.** Este arquivo diz o que está aberto no projeto inteiro,
quem decide cada coisa, o que está pronto para executar e o que trava o quê. Ele não repete o
detalhe: cada item aponta para o arquivo onde mora, por nome e sigla.

**Como está montado.** Duas camadas, e só uma é escrita à mão:

- **A direção (seções 1 a 6), escrita à mão.** Frentes, o que está pronto, o que está com o
  autor, os bloqueios, a varredura e a ordem de trabalho. Reescrita em **26/11/2026**, na Fase 2 da
  varredura de pendências (relatório do coordenador 097 a 101); antes, revista em 23/09/2026.
- **A contagem (seção 0) e a lista dos itens (seção 7), geradas.** Saem de
  `scripts/gen-pendencias.mjs`, a partir de `docs/pendencias/A` a `L` e `N` (o `M` é levantamento, sem
  itens com caixa, e fica fora da contagem), e o `npm run validate` fica
  vermelho se divergirem dos arquivos de tema, ou se um tema tiver linha com cara de caixa que o
  gerador não lê. **Não edite entre os marcadores:** mude a caixa ou a marca no tema e rode
  `node scripts/gen-pendencias.mjs`.

**As marcas dos temas.** Cada item tem uma sigla estável (A1, B2, …), e as siglas não mudam de
lugar nem de número. **[DECIDIR]** = precisa da palavra do humano. **[FAZER]** = já decidido, é
execução. **[AUTOR]** = frente de escrita do humano. **[CONSERTAR]** = defeito conhecido, com o
conserto claro. **[ADIADO]**, junto da outra marca (em qualquer ordem), tira o item da fila de trabalho, com o
motivo escrito no tema (desde a varredura de 26/11/2026, `[ADIADO: motivo, com a frase do autor ou a
D-/T- citada]`); ele continua contado como aberto. As marcas que a varredura acrescentou entram na
coluna "Outra marca" quando vêm sozinhas, e o tipo (DECIDIR, FAZER, AUTOR) vale pelo primeiro
colchete: **[AUTOR-REGRA]** e **[AUTOR-ESCRITA]** = só o autor decide (regra ou escrita), e contam como
AUTOR; **[MESTRE: frase proposta]** = caso de borda que o bom senso do Mestre resolve (D-087), a
frase espera a conferência do coordenador; **[ESPERA: o que espera, quem move]** = depende de outro
item ou frente; **[LIVRO-NO-GRID]** = regra do livro que hoje só aparece no Grid ou na mesa;
**[GRID-CÓDIGO]** = só código do Grid ou da mesa; **[INCERTO: o que falta]** = a prova não bastou.

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
| A | Arcano · As Artes | [`A-arcano-artes.md`](docs/pendencias/A-arcano-artes.md) | 36 | 21 | 0 | 15 | 8 | 6 | 7 | 0 | 0 | 0 |
| B | Bestiário | [`B-bestiario.md`](docs/pendencias/B-bestiario.md) | 36 | 21 | 0 | 15 | 4 | 12 | 3 | 0 | 0 | 2 |
| C | Trilhas de Feitiçaria | [`C-trilhas-feiticaria.md`](docs/pendencias/C-trilhas-feiticaria.md) | 4 | 2 | 0 | 2 | 0 | 0 | 1 | 0 | 0 | 1 |
| D | Proezas e Técnicas | [`D-proezas-tecnicas.md`](docs/pendencias/D-proezas-tecnicas.md) | 21 | 11 | 0 | 10 | 0 | 0 | 5 | 0 | 0 | 6 |
| E | Social, Mental e Antecedentes | [`E-social-mental-antecedentes.md`](docs/pendencias/E-social-mental-antecedentes.md) | 12 | 8 | 0 | 4 | 0 | 4 | 4 | 0 | 0 | 0 |
| F | Lore | [`F-lore.md`](docs/pendencias/F-lore.md) | 10 | 8 | 0 | 2 | 0 | 0 | 8 | 0 | 0 | 0 |
| G | Ações & Sistema | [`G-acoes-sistema.md`](docs/pendencias/G-acoes-sistema.md) | 82 | 37 | 0 | 45 | 2 | 23 | 9 | 0 | 0 | 3 |
| H | Arremesso | [`H-arremesso.md`](docs/pendencias/H-arremesso.md) | 7 | 4 | 0 | 3 | 1 | 1 | 1 | 0 | 0 | 1 |
| I | Mesa virtual · tempo real | [`I-mesa-tempo-real.md`](docs/pendencias/I-mesa-tempo-real.md) | 15 | 11 | 2 | 2 | 4 | 8 | 0 | 0 | 0 | 1 |
| J | Infraestrutura · endereço, hospedagem e versão | [`J-infraestrutura.md`](docs/pendencias/J-infraestrutura.md) | 20 | 15 | 0 | 5 | 0 | 7 | 5 | 1 | 1 | 1 |
| K | Combate · a linha do tempo | [`K-combate-linha-do-tempo.md`](docs/pendencias/K-combate-linha-do-tempo.md) | 39 | 19 | 1 | 19 | 9 | 5 | 5 | 0 | 0 | 1 |
| L | Simulação em massa e as oito regras novas do Simultâneo | [`L-simulacao-simultaneo.md`](docs/pendencias/L-simulacao-simultaneo.md) | 107 | 49 | 0 | 58 | 0 | 12 | 2 | 0 | 29 | 6 |
| N | Grid e mesa · o que o livro diz e o tabuleiro ainda não faz | [`N-grid-pendencias.md`](docs/pendencias/N-grid-pendencias.md) | 34 | 29 | 0 | 5 | 2 | 26 | 0 | 1 | 0 | 0 |
| | **Total** | | **423** | **235** | **3** | **185** | **30** | **104** | **50** | **2** | **30** | **22** |

*Contado pelas caixas de cada arquivo de tema: `- [ ]` aberto, `- [~]` parcial, `- [x]` fechado. As colunas de tipo contam os abertos e parciais que NÃO estão adiados, pela primeira palavra da casa na marcação (`FAZER/DECIDIR` conta como FAZER); "Outra marca" é o resto, quase todo do tema L, onde a etiqueta é texto livre. Adiados são os que têm `[ADIADO]` depois da sigla. Gerado por `scripts/gen-pendencias.mjs`; não edite à mão.*

**O que a contagem esconde, e o gerador acusa sem consertar:**

- `A-arcano-artes.md`: a sigla **A22** aparece 2 vezes (fechado · fechado)
- `G-acoes-sistema.md`: item sem sigla, "As cinco físicas de toda sessão." (fechado)
- `J-infraestrutura.md`: item sem sigla, "A linha de fechamento do `test-grid` é texto fixo · [DECIDIR]" (aberto)
- `K-combate-linha-do-tempo.md`: a sigla **K36** aparece 2 vezes (fechado · aberto)
- `L-simulacao-simultaneo.md`: a sigla **L6** aparece 2 vezes (fechado · fechado, riscado)
- `L-simulacao-simultaneo.md`: a sigla **L9** aparece 2 vezes (fechado · fechado, riscado)

<!-- /gen:pendencias-contagem -->

---

## 1 · As frentes, uma linha de estado cada

**Estado em 26/11/2026**, depois da Fase 2 da varredura. Três coisas valem para tudo o que segue:

- **O Grid é a última frente.** O autor, em 26/11 às 11:29: "Grid vai ser a última coisa, só quando
  terminarmos e fecharmos todas as outras por completo." Tudo o que mexe no que o Grid faz ou mostra
  fica como pendência, sem análise além do registro (T21); os itens são etiquetados `[GRID-CÓDIGO]`
  ou `[LIVRO-NO-GRID]` e esperam o Grid refeito.
- **As decisões do autor estão no `autor.md` da varredura de 26/11/2026**, um arquivo de trabalho
  fora do repositório: cada pergunta com o texto como está hoje, três soluções e a recomendada. Este
  arquivo não repete a lista.
- **A ordem de trabalho** é o lote do bestiário (o refator do bando, o campo `desafio`, as 324
  fichas, as fichas da T4 e D-377 e os desvios de Velocidade das D-334 e D-335), e depois as decisões
  dele, uma por vez (seção 6).

| Frente | Estado em 26/11/2026 | Quem decide o próximo passo | Onde mora |
|---|---|---|---|
| **Bestiário e a bancada de criaturas** | A fonte única das fichas é `src/data/bestiario` (B3). A bancada (B14) tem o laço corrigido (multiataque e dupla só pela ficha, regeneração ligada) e o piloto das oito criaturas rodado, com o desafio de 7 a 12 pela C-044. Faltam o refator do bando, o campo `desafio` (0 a 12, meio degrau) e as fichas da T4. | Execução; o autor, para o campo `desafio` | tema B (B14, B32 a B35); `docs/bestiario/` |
| **Frenesi e teste de Virtude** | Decidido e no livro. A §17 está feita (`vida-ferimentos-cura.md:52`, `aparencia-virtudes-vontade.md:49` e `:123`, `FRENESI.md:116-117`). O teste de Frenesi não existe no motor, e nenhuma tela o rola. | Nada a executar | `FRENESI.md`; `leitura-de-novato-decisoes.md` §16 e §17 |
| **Jogador novo** | 47 perguntas `M` e 104 consertos `C`, recontados em 26/11/2026: 5 M abertas e 3 C abertos (2 por confirmar). M-05, M-07, M-15, M-24, M-27, M-33, M-41 e M-42 estão feitas ou superadas; ficam M-01 e o L102 (M-18) a executar, M-22 adiada, M-43 e M-46 do autor. | Execução, para M-01 e L102; o autor, para as abertas | `jogador-novo-decisoes.md`, `jogador-novo-consertos.md`, `jogador-novo-consertos-2.md`, `jogador-novo-bestiario.md`, em `docs/simulacao/caixa/` |
| **Relações Sociais** | Rodadas 85 a 89 fechadas, e o item 9 (`acoes.longevidadeFirula`) feito (`6509801`). A fronteira entre o dia a dia e o Combate Social está escrita (`relacoes-sociais.md:11` e `:141`). Ficam os itens E3 a E8 do tema E. | O autor (E3); execução (E4, E7) | tema E; `ritmo-da-regua.md` |
| **O Grid** | Simulação encerrada (06/09). Fases 2 e 2.5 fechadas; fase 3 congelada; fase 4 bloqueada por uma batalha de verdade. É a última frente, e o que o toca está parado (T21; N33 e N34 no tema N). | O autor, no fim | `PLANO.md` §8 e §9; `ESTADO.md`; temas K, L e N |
| **Voz** | Barra de comando, desfazer e captura de áudio fechados (rodadas 30 a 33). O L71 está decidido (D-389: o prazo fica, a troca do Worker não se faz); o L62 e o L74 estão `[ADIADO]` até o autor usar a barra numa batalha. | O autor (a batalha); depois execução | `VOZ.md` §8; L62, L71, L74 |
| **Mapa de Uldun** | Frente do Cartógrafo, em `lore/mapas/`, parada desde 24/09: dez decisões do Cartógrafo esperam o autor olhar o render e dizer. | O autor | `lore/mapas/CARTOGRAFO.md`, `lore/mapas/DECISOES-A-REVISAR.md` |
| **Economia** | O modelo foi decidido e aplicado em 26/11/2026 (D-386, Forma 1: o pacote da Veterana só em Ganhar a vida, Serviços congelado numa tabela publicada fixa). O TETO em Livre, a Forma 2 e a tabela `custo_qualidade` do lore seguem abertos (G80). Dos arquivos de `lore/economia`, só `catalogo-unificado.md` e `prompt-revisao-economica.md` ficam fora do git. | O autor | `lore/economia/v2/`; tema G (G71 a G80) |
| **Antecedentes** | Não custam XP, nenhum dos 14 (D-385, T24). Restam os documentos de trabalho que ainda dizem o custo antigo (E12). | Nada a decidir | tema E (E12) |
| **Os temas A a L e N** | A contagem está na seção 0 e a lista na seção 7. O tema M (`docs/pendencias/M-virtude-somada.md`) é um levantamento sem itens com caixa e não entra na tabela: a varredura só acrescentou a ele uma seção com as 13 linhas conferidas. | Por item (a marca diz) | `docs/pendencias/` |

---

## 2 · Pronto para executar, sem decisão pendente

### O que a §16 e a §17 deixaram

**Nada a executar.** A §16 e a §17 estão no livro: a Força entra na definição de ação física ("as que
rolam Força, Destreza ou Vigor", `vida-ferimentos-cura.md:52` e `racas.md:173`); a tortura se divide
em corpo e alma (`aparencia-virtudes-vontade.md:45`, `:49` e `:79`); a Firula negativa vale só no
teste de Virtude e no Frenesi e não devolve reserva (`aparencia-virtudes-vontade.md:123`). O motor não
tem caminho que role o teste de Frenesi, então a exceção do piso de 1d6 não tem onde entrar.

### As decisões M

Das seis que esperavam mão de obra, **M-05** (`7db14f1`), **M-07**, **M-24**, **M-33** e **M-42**
estão feitas ou superadas por decisões do autor, e a **M-06 / M-19** fechou com a §17. O que falta
fazer:

| Decisão | O que falta | Onde mora |
|---|---|---|
| **M-01** · a ficha avisa os limites da criação, sem travar | `limitesCriacao` existe em `regras.json` e nada em `src` o lê | `jogador-novo-decisoes.md`, seção M-01 |
| **M-18** · Canalizar Virtude com carga binária | decidida em 16/09, com texto antigo no livro; o registro de autoria é o **L102** | tema L (L102) |

M-43 e o custo da M-46 são do autor (AUTOR-REGRA), e a M-22 está adiada.

### Os consertos C que continuam abertos

- **Abertos ou parciais:** **C-12** (falta decisão do autor: as cinco linhas do Bram ficaram por
  escolha registrada na M-02), **C-47** (falta execução) e **C-85** (falta execução: o link do ☆ em
  `/artes/catalogo` e em `/caminhos/<proeza>`). Os fechados na rodada 99 (`bed1e91`) foram C-22, C-23,
  C-39, C-61 e C-102 a C-104, e a frase "nenhum aberto" vale só para essa lista.
- **Recusados pela Executora, sem decisão de mesa:** **C-72**, decidido como editorial na D-390 (a
  regra "o como define o Atributo" fica escrita uma vez, com link, em `habilidades.md:24`), e
  **C-87**, que segue `[INCERTO]`.

### Nos temas

Os itens marcados **[FAZER]** e **[CONSERTAR]** da seção 7 são execução, e a coluna FAZER da seção 0
os soma. Os que já têm prova de feito estão fechados no tema, com a data e a prova na linha de
fechamento.

---

## 3 · Com o autor

**Fica com ele** tudo o que está no `autor.md` da varredura de 26/11/2026, que é a fila de decisões
dele (os itens `[AUTOR-REGRA]` e `[AUTOR-ESCRITA]` dos temas e as confirmações "fica como está?").
Do que a versão de 23/09/2026 deste arquivo listava aqui, o que já se resolveu:

- **A conversa do modo site (L26)** está respondida em 12/09/2026 (D-388): o dado é rolado na mão
  pelos jogadores e pelo mestre, e o que chega ao Grid é o total. Resta a pergunta "quem digita o
  total", que vai com a experiência do jogador (L29).
- **A migração 33** rodou em 13 a 14/09, e a `PASSAGEM.md` §7 ainda diz que espera (documento a
  reescrever, seção 5).
- **Relações Sociais:** a fronteira entre o dia a dia e o Combate Social está escrita (`relacoes-sociais.md:11`
  e `:141`; A-001, 20/09). O E4 não é mais "regra que ninguém decidiu": a D-378 e `relacoes-sociais.md:115`
  e `:315` decidem a descida; os itens E3 a E8 estão etiquetados no tema E.
- **Jogador novo:** M-15 (a Energia Espiritual fica como está, D-049), M-27 e M-41 estão fechadas; M-22
  segue adiada; M-43 e o custo da M-46 são do autor.
- **O dossiê publicado** (o artefato do claude.ai) não tem nenhuma marca gravada, e as 19 perguntas
  dele têm resposta em `jogador-novo-decisoes.md:2999-3283`: ele deixou de ser a fila.
- **O K4** está fechado (D-082).

**Ainda é dele e espera o Grid:** jogar uma batalha de verdade (pré-requisito da fase 4, da voz e do
N22), testar a barra de comando (L62 e L74, adiados) e os itens 3 e 4 do `PLANO.md` §8 (o par régua
contra botão numa mesa de verdade, e a escolha "fase 4 ou não", já que a fase 2.5 fechou). Como o
Grid é a última frente, esses itens estão como `[ESPERA]` e `[GRID-CÓDIGO]` nos temas.

---

## 4 · Os bloqueios de produção e de mesa

| O que | Estado | O que destrava |
|---|---|---|
| **Migrações (L42)** | Todas as escritas estão aplicadas, **de 1 a 42**: a 40 rodou em 28/09/2026, a 41 em 29/10 e a 42 em 30/10 (carimbo `c5b845f7aa03a935`, 42 de 42 batem). A 34 não existe como arquivo. | Nada; fica a escolha da migração 40 (coluna `centelha` em `combatentes` ou parâmetro extra em `jogador_dano`, `supabase/migracao-40.sql`, opções a e b), que é do Grid |
| **A barra de comando sem teste (L62)** | Sem teste automatizado commitado; `mover` contra casa ocupada falha em silêncio (herdado de `porNoMapa`). `[ADIADO]` pelo autor | Um teste, depois de ele usar a barra numa batalha |
| **O modelo de voz que trava (L71)** | Decidido em 11/09/2026 (D-389): o prazo fica (`comando-voz.ts`, `prazoMs ?? 20_000`) e o Worker não se troca. Fechado quanto à decisão | Nada, salvo se aparecer na bancada dele (o caminho é a troca do Worker) |
| **O gatilho `armadilha` (L86b)** | Família de quatro Efeitos (`brasa-retardada`, `semente-adormecida`, `salvaguarda`, `cura-guardada`) que disparam por condições diferentes, nenhuma decidida. O chão da `cura-guardada` existe (migração 39) sem consumidor. `[GRID-CÓDIGO]` | Desenho de regra do autor, no fim, com o Grid |
| **A batalha de verdade** | Pré-requisito da fase 4 e da voz, e o que confirma tudo o que nunca passou por mesa. `[ESPERA]` | O autor sentar e jogar, com a barra aberta, quando o Grid chegar |

---

## 5 · A varredura de 26/11/2026: o que fechou com prova e o que ficou aberto

**Caixa só muda com prova**, e a prova vai ao lado, na linha de fechamento do próprio tema ("Fechado em
26/11/2026 (varredura): ..."). A varredura leu as pendências dos temas A a N, os documentos de
direção e o registro de decisões, e a Revisora conferiu 556 das 573 linhas FECHADO, DUPLICADO e MESTRE.
O resultado da Fase 2: fecharam-se os FECHADO e os DUPLICADO conferidos; os que o bom senso do Mestre
resolve ganharam `[MESTRE: frase proposta]` e **não** fecham até o coordenador conferir; o que depende
de outro item ou frente ganhou `[ESPERA]`; o que o autor adiou, `[ADIADO: motivo]`; e o resto foi
dividido em `[FAZER]`, `[AUTOR-REGRA]`, `[AUTOR-ESCRITA]`, `[LIVRO-NO-GRID]` e `[GRID-CÓDIGO]`.

### Os suspeitos de fechado da revisão de 23/09, resolvidos

Dos itens que a versão anterior desta seção chamava de suspeitos: o C3 e o C4 viraram duplicados do C1
(o livro já diz "Não há mapa de qual Arte sai de qual Tradição", e a D-035 já revisou o mortal-tocado);
o K28, o K20, o K27 e o K5 foram classificados (AUTOR-REGRA, LIVRO-NO-GRID, GRID-CÓDIGO); o G12 e o
G13 ficaram com a marca certa; o E3 segue do autor (a M-36 decidiu "a banda é 3"); no tema L, dos dez
que se diziam fechados por inteiro, sete fecham (L81, L88, L93, L89, L70, L71 e o L76, duplicado do
L77), e o L80, o L84 e o L87 seguem abertos com a marca certa; e as duplicatas **L6 e L9** (uma
entrada `[x]` e outra `[ ]` riscada) fecharam como duplicadas.

### O que a contagem esconde

O gerador acusa, na seção 0, o que não consegue consertar: a sigla **A22** aparece duas vezes (a
entrada de antes da decisão e a decisão, ambas fechadas), o **K36** aparece duas vezes (o "Agarrar não
tem regra", fechado, e o dano fenômeno, aberto como `[GRID-CÓDIGO]`; renumerar o segundo é um conserto
de tema), as duplicatas **L6** e **L9** (a riscada fechou) e dois itens sem sigla (um no G, fechado, e
um no J, a linha de fechamento do `test-grid`). **O I5 eram dois itens diferentes com a mesma
sigla**, e o anel de Vida remoto virou **I14** na rodada 96.

### Documentos de direção que ainda estão velhos

- **`CONTEXTO.md` (linhas 194 a 231):** é de 16/09 (rodada 81), com "46 M / 18 abertas" e "99 C / 78
  abertos", e lista M-05, M-42, M-07, M-24 e M-33 como esperando mão de obra (todas feitas).
- **`PASSAGEM.md` §7 (linhas 220 a 225 e a mesma frase em `:193`):** diz "Ninguém perguntou ainda"
  (o L26 foi respondido em 12/09) e "rodar a migração 33" (rodou em 13 a 14/09).
- **`PLANO.md` §8 (linhas 322 a 339):** "Em 23/09 a frente corrente é o Frenesi", "rodada 85 em
  revisão" e "Depois do veredito vem o item 9" (o item 9 e as rodadas 85 a 89 estão feitos).
- O que a versão anterior listava de `FRENESI.md` §5 e da §16 ("Vigor ou Destreza") **já foi
  consertado** (`FRENESI.md:116-117`), e a "Ordem sugerida" de agosto do `Pendencias.md` não existe mais.

Reescrever os três primeiros é execução barata, e cada um aberto é uma pergunta que a próxima instância
refaz.

---

## 6 · A ordem de trabalho · proposta do Arquiteto, e não decisão

*Substitui as três trilhas de 23/09/2026. Nada aqui foi decidido pelo autor; o que ele já decidiu está
no `autor.md` da varredura e no registro de decisões.*

Duas coisas não competem pelo mesmo recurso: a execução gasta token e a decisão gasta o tempo do
autor. A ordem é:

1. **O lote do bestiário**, que é execução e não espera decisão: o refator do bando (a mesma função de
   turno do 1 contra 1, indivíduos até 7 e Horda a partir de 8), o campo `desafio` (0 a 12, meio
   degrau) nas 324 fichas e no esquema, as fichas da T4 e D-377 (trol, vampiro, planetar e solar:
   B32) e os desvios de Velocidade das D-334 e D-335. O campo `desafio` no /bestiario mostra o número
   com a Centelha ao lado; os leitores da mesa ficam como pendência (T21).
2. **As decisões do autor, uma por vez**, na ordem do `autor.md` da varredura: cada uma com o texto de
   hoje, três soluções e a recomendada. Destravam mais: o **F7** (travar o panteão, que trava o F5 e o
   F6) e o **C1** (a camada de Tradição, que trava o C2, o C3, o C4 e metade do A11; o **F3**, a
   mecânica de clérigo, paladino e monge, é duplicado dele, e trava o B4).
3. **Os `[FAZER]` e `[CONSERTAR]` dos temas**, que são execução pura sobre decisão já tomada (a coluna
   FAZER da seção 0), e a limpeza dos documentos de direção velhos (seção 5).
4. **O Grid, por último**, e só depois de fechar todas as outras frentes por completo: os itens
   `[GRID-CÓDIGO]` e `[LIVRO-NO-GRID]` esperam o Grid refeito, e a batalha de verdade (jogar com a barra
   aberta) é a primeira coisa que ele pede.

**O que saiu da fila: os adiados.** Os itens `[ADIADO: motivo]` (coluna Adiados da seção 0) foram
adiados pelo autor, com a frase dele ou a D-/T- citada no motivo (entre eles o C3, o H4, o D3, o D6, o
D19, o G71, o G73, o G74, o L62, o L74 e o L82). Continuam contados como abertos e fora das somas de
trabalho.

---

## 7 · Os temas

A lista abaixo é gerada pelos arquivos de tema (a contagem está na seção 0). **O detalhe de cada
item mora no arquivo do tema**, e é lá que a caixa muda.

Os itens abertos e parciais de cada tema, com a marca e o título; os fechados vão só pela sigla.

<!-- gen:pendencias-itens -->

### A · Arcano · As Artes

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| A1 | aberto | AUTOR-REGRA | Guardar um feitiço: os limites. |
| A2 | aberto | DECIDIR | Focos das Artes não elementais. |
| A3 | aberto | AUTOR-REGRA | O desconto da fonte pode passar de +1? |
| A4 | aberto | DECIDIR | Rituais. |
| A5 | aberto | AUTOR-REGRA | Clarão Cegante. |
| A6 | aberto | AUTOR-REGRA | O campo `escalonavel`. |
| A7 | aberto | AUTOR | Treze Efeitos elementais ainda sem número |
| A8 | aberto | FAZER | Revisar em mesa a primeira leva |
| A10 | aberto | FAZER | Abertura do capítulo para iniciante. |
| A13 | aberto | AUTOR | Revisar Área × Volume. |
| A14 | aberto | FAZER | Revisar os textos de Regras das Artes |
| A24 | aberto | AUTOR | Dar um molde a cada Efeito que ainda declara `zona`. |
| A25 | aberto | DECIDIR | A geometria das Artes que não manifestam elemento. |
| A15 | aberto | FAZER | Revisar as descrições de nível das Artes |
| A26 | aberto | DECIDIR | O improviso pode começar em qualquer lugar? |
| A19 | aberto | DECIDIR | O que a matéria dentro da fatia faz em número. |
| A16 | aberto | DECIDIR | A Fonte do Elemento: os elementos que faltam. |
| A30 | aberto | DECIDIR | Cura, Acerto Arcano e Energia Espiritual: comparar por pacote na etapa das Artes. |
| A31 | aberto | DECIDIR | Energia/Mana fora da Reforma da Centelha, avaliar com as Artes. |
| A33 | aberto | FAZER | O campo `custo.mana` dos níveis do catálogo das Artes. |
| A34 | aberto | FAZER | Recalibração das Artes: ART-34, ART-5, ART-38 e ART-40 (D-061). |

Fechados (15): A9, A11, A12, A17, A18, A22, A23, A27, A21, A22, A20, A28, A29, A32, A35.

### B · Bestiário

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| B4 | aberto | DECIDIR | Nada causa dano `sagrado` nem `profano`. |
| B5 | aberto | DECIDIR | `prata` não é representável. |
| B6 | aberto | DECIDIR | `sol` é ambiente, não ataque. |
| B9 | aberto | FAZER | Onde a criatura editada mora. |
| B14 | aberto | FAZER | Recalibrar nível de desafio e Centelha das criaturas, e revisar as fichas do bestiário. |
| B16 | aberto | FAZER | Tipos de dano fora do vocabulário fechado (ácido, e possivelmente outros). |
| B17 | aberto | FAZER | Descrições faltando (item 4 inteiro) + 38 criaturas com Arte ainda para reverter a poder natural, sem nota … |
| B18 | aberto | FAZER | Fila da B14: medir o bando por N, com a Regra de Horda a partir de 8. |
| B20 | aberto | FAZER | Bestiário novo: refazer as fichas pelas descrições da ficha humana, começando pelos animais. |
| B22 | aberto, ADIADO | ESPERA: | Os planos: aguarda o lore (R42, D-321). |
| B24 | aberto | FAZER | Catálogo de armas: as que as fichas usam por equivalência (itens 014, 016, 017, 019, 020 e 021; D-344). |
| B25 | aberto | AUTOR-REGRA | Quem empunha arma de outro tamanho: a regra por peso e Força (G4, D-366). |
| B26 | aberto, ADIADO | FAZER | Armas improvisadas: uma seção no livro que ensine o Mestre a calcular o dano de objetos que não são armas … |
| B28 | aberto | AUTOR-REGRA | Carrossel de imagens do bestiário: o código está pronto; as imagens reais ainda não entraram no repositório … |
| B29 | aberto | FAZER | A Mesa e o Grid seguem com a imagem antiga do bestiário (resposta 067, 25/11/2026). |
| B30 | aberto | DECIDIR | Os losangos de Ameaça têm contraste baixo sobre a aquarela (conjunto real das imagens do bestiário). |
| B31 | aberto | FAZER | O fluxo "o Arquiteto propõe, o autor aprova" do editor antigo de criaturas não foi portado para o editor novo … |
| B32 | aberto | FAZER | Fichas da T4 (D-377) não aplicadas: trol, vampiro, planetar, solar. |
| B33 | aberto | AUTOR-REGRA | Sete imagens de elemental sem ficha. |
| B34 | aberto | FAZER | `iffrit` e `incubo`: imagem com nome sem ficha. |
| B35 | aberto | FAZER | `cao-de-guerra-nessiano` sem imagem; `ninfa_verde-mar_pantano.png` fora de 3:2. |

Fechados (15): B12, B1, B1b, B2, B3, B7, B8, B10, B11, B13, B15, B19, B21, B23, B27.

### C · Trilhas de Feitiçaria

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| C1 | aberto | AUTOR-REGRA | Jogadas das Artes, casos de fronteira. |
| C3 | aberto, ADIADO | FAZER | O mapa Arte × Trilha. |

Fechados (2): C2, C4.

### D · Proezas e Técnicas

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| D3 | aberto, ADIADO | DECIDIR | Densidade dos funis. |
| D5 | aberto | AUTOR-REGRA | Reorg de conteúdo. |
| D6 | aberto, ADIADO | DECIDIR | Custo de Técnica e de Arte em ×10. |
| D11 | aberto | AUTOR-REGRA | Proeza de Quase-acerto, com duas alavancas. |
| D13 | aberto | AUTOR-REGRA | Proeza "punho como arma média". |
| D14 | aberto, ADIADO | DECIDIR | Custo de Habilidades a revisar depois da Parte B. |
| D15 | aberto, ADIADO |  | Botão de Atributo puro. |
| D17 | aberto, ADIADO | DECIDIR | Revisar as fichas de exemplo (Kael, Sora, Veil, Bram) ao fim da revisão do sistema. |
| D19 | aberto, ADIADO |  | Orçamento de XP da criação (R54). |
| D20 | aberto | AUTOR-REGRA | Recalibração das Proezas (D-358): as Técnicas de nível maior que repetem o bônus de uma de nível menor sem … |
| D21 | aberto | AUTOR-REGRA | A ficha não calcula a Rajada nem a Investida com Técnica: o Frenesi (C20) e a Investida Devastadora (C21) … |

Fechados (10): D1, D2, D4, D7, D8, D9, D10, D12, D16, D18.

### E · Social, Mental e Antecedentes

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| E2 | aberto | FAZER | Portar `Ataques_Mentais.md` ao site. |
| E3 | aberto | AUTOR-REGRA | Banda neutra da Régua de Relação: 5 ou 3? |
| E4 | aberto | FAZER | A jornada "Neutro → +2 Apreço" do ritmo da régua não se reconstrói pela fórmula. |
| E8 | aberto | AUTOR-REGRA | A trava de um gesto por intervalo não é monotônica. |
| E5 | aberto | AUTOR-REGRA | ⚑ O que a leitura revela no modo devagar. |
| E6 | aberto | AUTOR-REGRA | ⚑ O preço de um gesto em moeda. |
| E7 | aberto | FAZER | A Dama Vesna tem três estados diferentes no mesmo capítulo. |
| E12 | aberto | FAZER | Documentos de trabalho fora do site ainda dizem que Antecedente custa XP (T24, 26/11/2026). |

Fechados (4): E1, E9, E10, E11.

### F · Lore

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| F1 | aberto | AUTOR-ESCRITA | Como os deuses romperam a Lei |
| F2 | aberto | AUTOR-ESCRITA | Quem impôs a Lei. |
| F4 | aberto | AUTOR-ESCRITA | Os planetas. |
| F5 | aberto | AUTOR | Nomes próprios. |
| F6 | aberto | AUTOR | Deuses locais e espíritos de lugar |
| F7 | aberto | AUTOR-ESCRITA | Travar a §7 (o panteão). |
| F8 | aberto | AUTOR | Os nomes do calendário. |
| F10 | aberto | AUTOR-REGRA | A moeda mecânica das datas afinadas. |

Fechados (2): F3, F9.

### G · Ações & Sistema

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| G2 | aberto | AUTOR-REGRA | Reequilibrar a Especialidade. |
| G12 | aberto | AUTOR-REGRA | Desgaste e ferimento não se conhecem. |
| G13 | aberto | AUTOR-REGRA | As sobras das duas famílias escritas. |
| G11 | aberto | FAZER | `regras.json → acoes`. |
| G15 | aberto | FAZER | Como o bônus fixo de Proeza entra na Longa. |
| G16 | aberto | FAZER | Alcance da regra da maior e da menor. |
| G21 | aberto | DECIDIR | Direção sem custo. |
| G23 | aberto | FAZER | Duas espadas no mesmo documento. |
| G25 | aberto | FAZER | Peça de mais de um ofício. |
| G26 | aberto | FAZER | O que é "arma marcial". |
| G27 | aberto | FAZER | O machado da faca. |
| G30 | aberto | FAZER | O braçal soma com material bom. |
| G31 | aberto | FAZER | A cerca é obra? |
| G34 | aberto | FAZER | "Apoio numa jogada única" e "jogada estendida" no mesmo parágrafo. |
| G35 | aberto | FAZER | O catálogo de ações ainda cita o apoio antigo. |
| G36 | aberto | AUTOR-REGRA | A Brigandina domina a Cota de malha e a Camisa de malha. |
| G37 | aberto | AUTOR-REGRA | A Placa articulada domina a Placa de transição. |
| G38 | aberto | AUTOR-REGRA | Kite × Heater e Pavês × Scutum. |
| G39 | aberto | AUTOR-REGRA | O Machado custa mais que a Espada Longa. |
| G40 | aberto | FAZER | Preços provisórios de baixa confiança, sem linha de fabricação. |
| G41 | aberto | AUTOR-REGRA | As três bestas sem base de custo. |
| G42 | aberto | FAZER | O preço unitário dos Dardos lido como preço de maço. |
| G43 | aberto | FAZER | Dois nomes de armadura ainda de trabalho. |
| G47 | aberto | FAZER | A2 · Equipamento de aventura pela tabela de mercadorias. |
| G48 | aberto | FAZER | A4 · Moeda e metais. |
| G53 | aberto | FAZER | B6 · Recursos por faixas. |
| G61 | aberto | FAZER | A1 · Munição. |
| G64 | aberto | FAZER | B7 · Status obrigatório. |
| G66 | aberto | FAZER | C7 · Serviços contratados. |
| G68 | aberto | FAZER | E3 · Empréstimo de XP, a regra completa (completa a G44). |
| G69 | aberto | FAZER | E5 · Pacote inicial pelo Recursos. |
| G71 | aberto, ADIADO | DECIDIR | Comércio e modificador regional. |
| G73 | aberto, ADIADO | DECIDIR | Preços do sobre-humano: Centelha, Proezas e Magia. |
| G74 | aberto, ADIADO | DECIDIR | Poções como estoque de emergência caro. |
| G76 | aberto | DECIDIR | Itens mágicos: poções, pergaminhos, itens mágicos, armas e armaduras encantadas, artefatos. |
| G78 | aberto | FAZER | Catálogo de armas: o campo de estilo e as imagens por raça (I1, D-371). |
| G80 | aberto | AUTOR-REGRA | TETO em Livre (Veterana), a Forma 2 do modelo de economia e a tabela `custo_qualidade` do lore (Forma 1, … |

Fechados (45): G1, G3, G4, "As cinco físicas de toda sessão.", G5, G5b, G6, G7, G8, G9, G10, G14, G17, G18, G19, G20, G22, G24, G28, G29, G32, G33, G44, G45, G46, G49, G50, G51, G52, G54, G55, G56, G57, G58, G59, G60, G62, G63, G65, G67, G70, G72, G75, G77, G79.

### H · Arremesso

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| H3 | aberto | AUTOR-REGRA | Os quatro assuntos que a proposta levanta e não fecha |
| H4 | aberto, ADIADO | DECIDIR | O degrau de baixo do fator de forma: ÷2 ou ÷3? |
| H5 | aberto | FAZER | O Arco de Guerra não existe no catálogo. |
| H7 | aberto | DECIDIR | A bancada de calibração não modela alcance. |

Fechados (3): H1, H2, H6.

### I · Mesa virtual · tempo real

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| I1 | aberto | FAZER | Fechar o canal. |
| I2 | aberto | FAZER | O registro da arena ainda é um `jsonb` reescrito inteiro. |
| I5 | aberto | FAZER | Um editor de cenário no Grid. |
| I3 | aberto | FAZER | As outras abas ainda não ouvem. |
| I4 | aberto | FAZER | Nada garante entrega. |
| I14 | aberto | FAZER | O anel de Vida remoto aparece em salto. |
| I15 | aberto | DECIDIR | Sugestão de interface: mostrar juntos os resultados de todos os golpes de um Tick. |
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
| J2 | aberto | AUTOR-REGRA | Qual hospedeiro. |
| J3 | aberto | FAZER | Sair do GitHub Pages, e só então subir para o Astro 7. |
| J6 | aberto | CONSERTAR | `/mesa/referencia` rola de lado no telefone, e a culpa é da classe do embrulho. |
| J9 | aberto | FAZER | `gen-mermaid.mjs` redesenha os seis diagramas a cada execução, e o `--check` não enxerga isso. |
| (sem sigla) | aberto |  | A linha de fechamento do `test-grid` é texto fixo · [DECIDIR] |
| J12 | aberto | AUTOR-REGRA | Os apelidos ambíguos do glossário: 99 links errados em oito linhas, depois do conserto da Compostura e do … |
| J13 | aberto | FAZER | O bestiário recebe link automático só nas fichas montadas quando o índice chega. |
| J14 | aberto | AUTOR-REGRA | "Margem" nomeia duas grandezas: a Margem do verbete e a Margem de Quase-Acerto. |
| J15 | aberto | AUTOR-REGRA | "nível" no sentido da Arte: 202 links, fora da conta da J12. |
| J16 | aberto | AUTOR-REGRA | "Nível" é o nome do próprio verbete, usado como palavra comum em todo o sistema: 125 links errados, fora da … |
| J17 | aberto | FAZER | Busca do site: o componente não tem teste de navegador no CI, e a premissa dos `locations` só tem o guarda de … |
| J18 | aberto | FAZER | O seed `supabase/migracao-42.sql` ainda grava a tag "projétil veloz" nas armas (RT-045, T13, 25/11/2026). |
| J19 | aberto | FAZER | O filtro de Tag de `/equipamentos` não casa tag de duas palavras (projétil rápido). |

Fechados (5): J1, J11, J10, J4, J5.

### K · Combate · a linha do tempo

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| K11 | aberto | DECIDIR | Alabarda, Maça e o Impacto de uma mão. |
| K8 | aberto | DECIDIR | Cinco das nove bordas. |
| K9 | aberto | AUTOR-REGRA | A carga voluntária. |
| K6 | aberto | AUTOR-REGRA | A leitura do sinal. |
| K20 | aberto | DECIDIR | O que se pode fazer no Preparo e na Recuperação. |
| K17 | aberto | DECIDIR | O arqueiro ficou forte demais. |
| K19 | aberto | FAZER | A cadeia foi medida só na arma leve. |
| K21 | aberto | AUTOR-REGRA | As armas versáteis: a regra, a lista e o preço da forma de duas mãos. |
| K24 | aberto | DECIDIR | O montante e o martelo pagam duas vezes, e o dano não conserta. |
| K27 | aberto | DECIDIR | O Golpe sai depois, e a mesa ainda resolve na declaração. |
| K30 | aberto | FAZER | A CAIXA QUE ABRE NO TICK EM QUE A ARTE SAI |
| K28 | parcial | AUTOR-REGRA | Deslocamento: sete decisões tomadas em 21/08, a oitava (código) já saiu; falta só a ausência. |
| K5 | aberto | FAZER | A implementação: os DOIS sistemas. |
| K31 | aberto | FAZER | O Grid anda a Corrida só na primeira fase: a regra publicada tem duas, e o código aplica metade. |
| K32 | aberto | FAZER | Tags de arma sem definição. |
| K33 | aberto | AUTOR-REGRA | Redução de raspão quando armaduras são vestidas juntas. |
| K35 | aberto | DECIDIR | `lib-tempo.mjs` continua na régua antiga de Centelha |
| K36 | aberto | DECIDIR | Dano fenômeno (armadura não absorve, só Centelha) não alcança ataque normal de criatura. |
| K37 | aberto | DECIDIR | `defesaPerdida` só soma o ataque RECEBIDO; `combate.md:405` cobra também o FEITO. |
| K38 | aberto, ADIADO | DECIDIR | Guarda sob pressão: como a guarda se renova para quem não age. |

Fechados (19): K29, K1, K2, K3, K10, K7, K4, K15, K16, K18, K22, K23, K26, K25, K12, K13, K14, K34, K36.

### L · Simulação em massa e as oito regras novas do Simultâneo

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| L1 | aberto | FAZER | As oito regras novas do Simultâneo (N1 a N8), na mesa. |
| L10 | aberto | ANTES DE LER O RESULTADO | Duas coisas que não bloqueiam o começo e bloqueiam a leitura. |
| L25 | aberto | DÍVIDA DE PRODUTO, NÃO DE INSTRUMENTO | O item 1.0 da Etapa 1 foi dado como feito e não está feito. |
| L30 | aberto | FAZER | OS DEZ MÓDULOS FORA DE TODO PACOTE DE TESTE |
| L29 | aberto | A FILA DO GRID | Sete consertos, e o `ESTADO.md` é a fonte. |
| L28 | aberto | FAZER | O alarme do E4 inerte é o único sem teste. |
| L24 | aberto | DEPOIS | O ⏭ é um terço do trabalho do mestre, e nenhuma regra o toca. |
| L23 | aberto | DEPOIS | A fração de gestos com JOGADOR na mesa. |
| L20 | aberto | DEPOIS | Uma política que recua |
| L7 | aberto | DEPOIS | A medição de campo do Supabase real |
| L40 | aberto | MITIGADO EM 05/09/2026 | O registro do jogador que o mestre apaga sem saber |
| L41 | aberto | PENDÊNCIA DA MESMA FAMÍLIA | Leitura-modificação-escrita de coleção inteira a partir de foto local |
| L36 | aberto | QUANDO A REGRA APARECER | O `resumoParaBanco` é vitrine, e não entrada de conta. |
| L47 | aberto | ACHADO NA REVISÃO DE 06/09/2026, SÓ REGISTRO | O portão por literal continua dentro da própria bancada do avanço unificado. |
| L48 | aberto | ABERTO | O harness chamava 20 funções da lib, e a mesa 41. |
| L51 | aberto | FAZER | Só 1 das 4 views do lado do jogador tem prova automática contra o SQL real. |
| L52 | aberto, ADIADO | PARCIAL | Duas contagens que nunca existiram. |
| L54 | aberto | FAZER | `scripts/mapa.mjs`, a forma final do `docs/MAPA.md`. |
| L55 | aberto | BLOQUEADO | O `~42%` de `regras.json:910` está errado; o número certo para o lugar dele ainda não existe. |
| L56 | aberto | AUTOR-REGRA | Payoff da arma leve. |
| L57 | aberto | AUTOR-REGRA | Bookkeeping do Quase-Acerto. |
| L58 | aberto, ADIADO | ANOTADO | Trilha de aprendizado para quem chega agora. |
| L62 | aberto, ADIADO |  |  |
| L63 | aberto | FAZER | Os três termos do trabalho do mestre aparecem com dois arredondamentos diferentes. |
| L100 | aberto | FAZER | O foco da caixa de diálogo cai no botão errado por ordem do DOM, e a intenção escrita é a oposta. |
| L99 | aberto | GRID-CÓDIGO | A trava da cura não existe no SERVIDOR, e as quatro saídas têm preço. |
| L98 | aberto | FAZER | O gancho passou a escrever `.astro/` a cada commit de código, e o `.astro/` é compartilhado por quem divide a … |
| L97 | aberto | ACHADO | O `test-grid` do smoke falha de forma INTERMITENTE, e a taxa medida subiu: 3 falhas em 7 execuções … |
| L96 | aberto | ESCALA 1 | Duas varreduras de dano contínuo escrevem a Vida por motores diferentes, e só uma tem piso. |
| L95 | aberto | GRID-CÓDIGO | O peso de quem é empurrado nunca vem do bestiário: o campo lido não existe, e a estimativa por porte responde … |
| L94 | aberto | LIVRO-NO-GRID | Passar pelo espaço de outra criatura: hoje é impossível, e "cercado não é preso" é o nome de um cenário de … |
| L92 | aberto | ACHADO | O tipo não protege os dublês: campo novo obrigatório numa interface passa pelo compilador e quebra em tempo … |
| L91 | aberto | FAZER | Sobram 59 travessões de prosa em SEIS documentos que nunca foram varridos, e o `L79` não mentiu sobre isso. |
| L65 | aberto | ANOTADO | Dez citações de linha em `grid.astro` foram reapontadas TRÊS vezes num só dia, e vão envelhecer de novo no … |
| L74 | aberto, ADIADO |  | O teste do status da voz fica verde com o defeito de volta: a costura RECALCULA o texto em vez de OBSERVAR o … |
| L77 | aberto | FAZER | O `L67` foi construído só de um lado: o raio do ALVO entra na régua, o do próprio ATACANTE não entra em lugar … |
| L78 | aberto, ADIADO | PEDIDO | Falta um campo de ALCANCE por criatura: o braço derivado do porte trata corpos diferentes como iguais. |
| L80 | aberto | FAZER | O portão da procedência confere DOIS documentos, e há dez outros com citação de código viva. |
| L82 | aberto, ADIADO | SEPARADO | A dívida de travessão no CÓDIGO: 702 ocorrências em 116 arquivos, e 55 delas não são pontuação. |
| L83 | aberto | LIVRO-NO-GRID | O que acontece quando um empurrão joga um corpo para cima de outro. A regra passou a existir; o que falta são … |
| L86 | aberto | GRID-CÓDIGO | Sete Artes marcadas como cura não curam nada no tabuleiro, e o caminho não está escrito. |
| L87 | aberto | ACHADO | Duas escritas de condição gravam no banco sem repintar a coluna de iniciativa, e uma delas não avisa a mesa. |
| L84 | aberto | LIVRO-NO-GRID | `noChao` responde duas perguntas diferentes com uma função só, e a condição "Caído" paga a conta. |
| L69 | aberto | ANOTADO | Nem toda criatura chega pelo caminho de borda. |
| L102 | aberto | FAZER | M-18, Canalizar Virtude: teto ou contrapartida. Regra nova de verdade, não conserto pontual. |
| L103 | aberto | ANOTADO | O laço do harness não soma ao ataque as condições nem o porte que a mesa soma. |
| L104 | aberto | ESCALA | Uma asserção do `test-grid` cai às vezes: 3 falhas em 60 runs do CI, sempre na "Criatura 17". |
| L105 | aberto | ANOTADO | A caixa que o mestre lê ao rolar a iniciativa no Grid ainda diz "Tick 0". |
| L106 | aberto | ANOTADO | "No máximo 60 KB de HTML por movimento (foram 67,1 KB)". |

Fechados (58): L2, L3, L4, L5, L6, L6, L9, L9, L11, L12, L8, L13, L14, L15, L16, L17, L18, L19, L21, L22, L34, L35, L33, L32, L31, L27, L26, L37, L39, L42, L43, L44, L45, L46, L49, L50, L53, L59, L60, L61, L64, L101, L93, L90, L89, L67, L71, L72, L73, L75, L76, L79, L81, L70, L88, L85, L68, L66.

### N · Grid e mesa · o que o livro diz e o tabuleiro ainda não faz

| Sigla | Estado | Marcação | Título |
|---|---|---|---|
| N1 | aberto | FAZER | Velocidade da conjuração pelo maior grau investido (ART-35). |
| N2 | aberto | FAZER | O primeiro alvo da Cura é grátis (ART-33). |
| N3 | aberto | FAZER | A escada da Defesa no desvio fora da vez (ART-11). |
| N4 | aberto | FAZER | Projétil e arma de Gelo, Água e Terra são matéria (ART-36). |
| N5 | aberto | FAZER | Bloquear uma Arte pelo critério da matéria (ART-42). |
| N6 | aberto | FAZER | Acelerar a Cura na escala dos dias (D-062, ART-47). |
| N7 | aberto | FAZER | Mãos sobre a Multidão pelo maior grau investido (D-060, ART-37). |
| N8 | aberto | FAZER | Chamar à Mão com Dificuldade (D-060, ART-23). |
| N10 | aberto | FAZER | O estado Preso não existe na mesa (D-064). |
| N13 | aberto | FAZER | A Prisão deixa Preso, e não Imobilizado (D-064). |
| N14 | aberto | FAZER | A escala de 0 a 6 do Escapismo. |
| N17 | aberto | FAZER | Os dois punhos somam no Bloqueio (D-065). |
| N18 | aberto | FAZER | Lâmina contra o corpo (D-057, D-065). |
| N19 | aberto | FAZER | A escolha da melhor combinação de defesa (D-065). |
| N20 | aberto | FAZER | A classe de ataque dos golems de Punhos (D-065, D-054). |
| N21 | aberto | FAZER | Religar o `test-grid` no começo da passada única do Grid (D-071). |
| N22 | aberto | FAZER | O catálogo de Arremesso e tiro da rodada 1 (D-072 a D-076, D-082): o que o Grid herda e o que ele ainda não … |
| N23 | aberto | FAZER | As condições das decisões R8 a R20 (D-281 a D-294, 03/11/2026): o que o painel já tem e o que o Grid e a aba … |
| N24 | aberto | FAZER | Os Efeitos que ganharam parâmetro na revisão de textos (RT-124, RT-126 e RT-127, decisões T7 e T8 do autor, … |
| N25 | aberto | FAZER | O dano de Luz fere todos, pela metade contra quem não tem fraqueza a luz (RT-123, decisão T6 do autor, … |
| N27 | aberto | FAZER | Os parâmetros que a RT-071 (T13, 25/11/2026) passou de fixos a comprados: o Grid só lê o Dano, a Área e o … |
| N28 | aberto | FAZER | O campo `projetilVeloz` de `scripts/lib-tempo.mjs` agora lê a tag "projétil rápido" e pode ser renomeado na … |
| N29 | aberto | FAZER | A Ambidestria (D18, 25/11/2026) alivia a Defesa no Tick do Golpe de −4 para −2 também golpeando com as duas … |
| N30 | aberto | FAZER | O Frenesi (C20, 25/11/2026) tira o −1d6 acumulado por golpe das Rajadas por 6 Ticks; o Grid não lê a Técnica. |
| N31 | aberto | FAZER | A Investida Devastadora (C21, 25/11/2026) soma +1 de dano a cada 2 m percorridos, até +7, e derruba e empurra … |
| N32 | aberto | FAZER | O card "Ver a ficha por dentro" da mesa mostra o chip cru de uma Técnica removida (achado da Revisora no D16, … |
| N33 | aberto | DECIDIR | O livro diz Área grau 3 = 2 m e o Grid desenha ao menos 28 Efeitos de zona e aura pela régua do molde no … |
| N34 | aberto | DECIDIR | Os sete Efeitos de forma fora da tabela: trocar ou tirar a Área muda o que a caixa do Grid lê (RT-069, T21 do … |
| N35 | aberto | CONSERTAR | O card do bestiário na mesa ainda usa a curva velha de Aparência (achado 090, 26/11/2026). |

Fechados (5): N9, N11, N12, N15, N26.

<!-- /gen:pendencias-itens -->
