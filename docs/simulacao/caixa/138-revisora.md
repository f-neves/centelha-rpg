# 138 · Revisora · rodada 12 (`bd041499`) e o registro D-054 a D-064 (`5ee62d88`)

Pino: `bd041499`, que contém `5ee62d88` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 137 é
ancestral de origin/main). Fonte: `docs/decisoes-partes/decisoes.md` (D-054 a D-064), `tmp/veterana/veterana-1e.md`
(as (e) de ART-37, ART-47, ATAQUE-DIF) e a seção Rodada 12 de `docs/simulacao/caixa/veterana-1e-relato.md`.

**CI:** `5ee62d88`: Validar 37253635923 e Deploy 37253635984 `success`. `bd041499`: Deploy 37254395118 `success`; o
Validar 37254395011 estava `in_progress` quando escrevi (conferido por `gh run list`).

**Resultado: um CORRIGE (D-055, o passo 8 da Criação). O resto PROCEDE. Nenhum BLOQUEIA, nenhuma ESCALA nova.**

## CORRIGE · D-055: sobrou um "teto 3" da Centelha na criação

**Original** (`src/content/chapters/criacao-de-personagem.md`:23, Passo a passo da criação):

> 8. **Centelha.** Teto **3** na criação. Ela **não custa XP**: o tier é definido com o Mestre e define o que você
> alcança. O Mestre escolhe pela campanha: **Centelha 0** numa campanha mortal; de **1 a 3** numa campanha heroica (3
> é o Herói, para quem quer um herói de saga).

**No gerado:** `dist/regras/criacao-de-personagem/index.html` traz "Centelha. Teto 3 na criação. Ela não custa XP",
e "Teto 3 na criação" dá 1 no dist inteiro.

**Contra o quê:** a D-055 ("Cai. A ficha básica não tem restrição; quem informa as restrições da campanha aos
jogadores é o Mestre") e o próprio texto novo de Limites na criação, 41 linhas abaixo, no mesmo capítulo: "A ficha
básica não tem restrição de criação, e isso vale também para a Centelha". O passo 8 diz o contrário no começo da
página que o jogador lê primeiro.

**Por que CORRIGE e não ESCALA (§8):** falsifica a promessa da rodada. O relato diz que a Executora varreu
"capítulos, `regras.json`, glossário e ficha atrás de 'teto 3', 'Centelha máxima' e 'teto de criação'" e lista o
que ficou; o passo 8 não está na lista. A varredura não o pegou porque o texto é "**Teto** **3**", com T maiúsculo e
o número em negrito. O próprio relato do 1d (`veterana-1d-relato.md`:427) já tinha apontado este lugar: "o teto 3 da
Centelha na criação: `limitesCriacao.centelha`, `criacao-de-personagem.md` passo 8 e 'Centelha máxima **3**' em
Limites". Dois dos três saíram; o passo 8 ficou. O conserto é uma frase.

**Leituras possíveis do conserto, sem escolher:** (a) tirar só "Teto **3** na criação." e deixar o resto do passo,
que já é orientação ao Mestre; (b) trocar pela frase da D-055 ("Sem restrição na ficha: quem informa as restrições
da campanha é o Mestre."). As duas deixam o "de **1 a 3** numa campanha heroica", que o relato manteve em `:33` e
`centelha.md`:89 como orientação, e que eu leio do mesmo jeito.

## O que PROCEDE

1. **Nenhum arquivo do Grid ou da mesa mudou.** `git diff --stat bd041499~2 bd041499` sobre `src/lib/artes-grid*`,
   `src/lib/mesa-*`, `src/pages/mesa/`, `src/lib/equip.ts`, `scripts/gen-grid-artes.mjs`, `src/data/condicoes.json` e
   `src/data/armas.json`: vazio. Os 16 arquivos de `bd041499` são os do relato.
2. **O registro (`5ee62d88`).** D-054 a D-064 estão escritas com a dúvida, a letra e o texto entre aspas. **Não
   tenho o texto do autor**, então não confirmo o verbatim; confiro a coerência interna:
   - C-025: índice (:120) "substituída por D-060", entrada (:698) "SUBSTITUÍDA por D-060 (04/10/2026)". C-029: índice
     (:124) "substituída por D-057 (desarmado)", entrada (:722) com a ressalva de que a Proeza "punho como arma média"
     continua a implementar. As duas pontas batem.
   - Procurei no registro outras entradas sobre o mesmo ponto: `tetoCriacao`, "teto 3", "teto de criação",
     `limitesCriacao`, C-025, C-029. Só aparecem as próprias D-055/D-056/D-060/D-057 e a D-040 (que elas estendem).
     Nenhuma decisão viva fica contradita.
   - A D-060 diz "Consistente com a D-022": o Chão Traiçoeiro já estava em "(maior grau investido) × 5". Bate.
   - A tabela de índice não tem linhas D (nenhuma D-001 a D-064 tem), que é a convenção do arquivo; não é falta desta
     rodada. Ver CLAREZA sobre a seção "Cadeias a conhecer".
3. **D-055 no resto.** `regras.json` `limitesCriacao` perdeu o `centelha: 3`, e a nota cita D-040 e D-055. Limites na
   criação (`criacao-de-personagem.md`:64) tem a frase nova, e "Centelha máxima" e "Centelha 3 do teto de criação" dão
   0 no dist. A ficha: o teto da Centelha em `ficha-engine.ts`:185 é 6 (`centelha: 6`), igual aos outros traços.
   Ninguém lê `limitesCriacao` (Grep em todo o repositório, fora `dist`, `.astro` e `node_modules`: só documentos).
   A "Exceção declarada" de Veil ("o teto de criação é Centelha 3", :128) ficou e está anotada na D17
   (`docs/pendencias/D-proezas-tecnicas.md`), pela D-053.
4. **D-056.** `tetoCriacao` saiu de Recursos e de Artefato em `antecedentes.json`, do schema de `validate-data.mjs`,
   e o `notaFormato` "Nomeado (teto 3 na criação)" saiu. A ficha perdeu a função `teto(a)` e as duas chamadas, e o
   `.ante-teto` saiu de `FichaSkeleton.astro`. Os três trechos do texto: `antecedentes.md`:55-56, :208 e :318. A tabela
   de custos da Criação (:52) perdeu o "teto **3** na criação em Recursos e Artefato". **Prova de que ninguém lê o
   campo:** a ferramenta Grep por `tetoCriacao|ante-teto|limitesCriacao` em todo o repositório (fora `dist`, `.astro`,
   `node_modules`) só acha documentos e a citação na própria D-056. `Antecedentes.md`:54 (a raiz, "teto de +6") está
   intocado: o último commit nele é `ac71adee`. **Smoke da ficha:** `node .claude/skills/run-centelha-rpg/driver.mjs`
   no pino, "✓ all checks passed" (12 verificações, incluindo Proezas, Artes, Efeitos e o modal; saída em
   `../tmp/revisora/smoke-ficha-138.txt`).
5. **D-060.** Comparei `efeitos.json` Efeito a Efeito (`bd041499~1` contra `bd041499`): 30 mudaram. 28 trocaram a
   Dificuldade para "(maior grau investido) × 5", e são exatamente os 28 da (c) do ART-37 (16 com × 4: Arremesso,
   Coração Verde, Definhar, Dreno, Enxerto, Fogo que Não Apaga, Julgamento, Marca do Fim, Passo Lento, Peso, Prisão,
   Semente Adormecida, Sopro do Norte, Tempestade, Trilha Fechada, Vendaval; 12 com × 5: Afogar, Convocar, Céu Aberto,
   Dissipar, Engolir, Esmagar, Fenda, Invocar, Maremoto, Onde é Embaixo, Praga, Tromba). Com o Chão Traiçoeiro, 29
   Efeitos têm a fórmula. O Dissipar ganhou "decide o maior grau investido de cada lado"; Mãos sobre a Multidão,
   "1 PV por grau investido" e a nota sem a remissão ao Acelerar a Cura; o parágrafo "Nível da Arte e grau investido
   não são a mesma coisa" entrou em `regras.astro`. Todos palavra por palavra do (e). Os seis Efeitos com Ataque do
   ATAQUE-DIF estão entre os 28. **Fórmula antiga:** "(nível da Arte) × 5" e "× 4" sobram uma vez cada em
   `/artes/efeitos`, e são a Resistência de uma barreira ("de dano até ceder") e a Distância de Arremesso: as medidas
   que o parágrafo novo manda continuar pelo nível da Arte. "2 × o menor entre a Centelha do conjurador" dá 0; os 11
   "2 × mín" que sobram no dist são o bônus de Centelha das jogadas (C-024), fora das Artes. **Chamar à Mão** ficou
   ("disputa de Força contra o nível da Arte", sem Dificuldade) e está na N8.
   **Nenhum campo estruturado mudou:** comparando os 30 Efeitos sem `valor`, `nota`, `efeito` e `notas`, zero diferenças;
   `porNivel`, `custaMana`, `pontos` e o bloco `grid` estão como estavam. O Grid calcula pelo estruturado
   (`curaDoEfeito`, `artes-grid.ts`:309), então o tabuleiro não muda de comportamento.
6. **D-062.** O Acelerar a Cura diz "cada nível da Arte encurta em 10% o intervalo da tabela de Recuperação, até no
   máximo 50%" e, abaixo de 0, "a Arte soma ao teste de Tratar … +1 por nível da Arte"; a linha Cura, "encurta o
   intervalo em 10% por nível da Arte"; as notas, "vale o maior" e "não vale na linha por dia". É o (e) do ART-47
   palavra por palavra. Coerente com a D-009 (+1 por nível da Vida no Tratar) e com a D-050 (a Vida 1 tira Desgaste, que
   é outra coisa: o Acelerar não toca Desgaste, como o próprio 1e diz em A·VIDA-1, item 5).
7. **D-063.** O Vento 3 segue "desvia projéteis; rajada cortante (o Efeito Muro, 2d6)". O "rajada que derruba" que
   sobra no catálogo é a Lufada Cortante, Vento 2 (conferido na 135).
8. **N-grid-pendencias.md e A34.** N1 a N15, quinze itens, cada um com o que o livro diz e o que o Grid ou a mesa
   fazem, com arquivo:linha. Cobrem a minha ESCALA da 131 (N9 a N13, condições e `gen-grid-artes.mjs`:248), o Grid
   divergente da 134 (N1 a N5), o Acelerar e o Mãos (N6, N7), o Chamar à Mão (N8), o Escapismo (N14) e o Desarmado
   (N15). A A34 (`A-arcano-artes.md`:281) lista ART-34, ART-5, ART-38 e ART-40 e a ordem da D-061 (a Bola de Fogo antes
   das fichas). `node scripts/gen-pendencias.mjs --check`: "Pendencias.md em dia com os temas: 376 itens (268
   abertos, 4 parciais, 104 fechados) em 13 temas".
9. **O que mudou nos scripts:**
   - `scripts/gen-pendencias.mjs`: a classe de letra dos temas passou de `[A-L]` para `[A-LN]` (na sigla, no filtro de
     arquivo e no título), com o comentário "o M é levantamento e fica fora". Só isso.
   - `scripts/test-portoes.mjs`: saiu uma entrada da lista `NAO_E_TOLERANCIA` (`['src/lib/ficha-engine.ts', 'aparece
     como aviso e NÃO trava', …]`), a isenção que apontava para o comentário do aviso de teto que a D-056 tirou.
   - `scripts/validate-data.mjs`: saiu `tetoCriacao: z.number().int().min(1).max(6).optional()` do schema dos
     Antecedentes.
10. **Fichas intactas.** Os hunks de `criacao-de-personagem.md` são só :52 e :64; nada entre o Kael (:88) e o fim do
    Bram. Antecedentes: :55-56, :208, :318.
11. **Travessão e vocabulário:** nos dois commits, a contagem por arquivo é igual antes e depois, e nenhuma linha
    acrescentada tem travessão nem o nome antigo de Habilidade.

## Observações

1. **O diálogo de conjurar do Grid agora mostra o texto do livro e faz outra coisa.** O Grid mostra cada parâmetro
   fixo pelo `valor` (`artes-grid-ui.ts`:807-808, "`<b>${p.nome}:</b> ${p.valor}`"). Com a rodada, quem conjura o
   Acelerar a Cura no tabuleiro lê "Cura: encurta o intervalo em 10% por nível da Arte" e o Grid cura 1 PV por nível;
   no Mãos sobre a Multidão lê "1 PV por grau investido" e o Grid cura pelo nível da Arte; e os 28 Efeitos mostram
   "Dificuldade: (maior grau investido) × 5". É a D-054 funcionando (o livro manda, o dado é um só), e a N6 e a N7 já
   dizem o que o Grid faz. Vale acrescentar às duas que o rótulo do diálogo já mudou, para quem testar a mesa antes da
   passada do Grid não achar que é defeito novo.
2. **`src/lib/ficha-engine.ts`:174-175** ainda tem "TOLERÂNCIA: o teto de Arte Centelha + 2 (D-006, 03/10/2026) ainda
   não é definitivo. LEVANTA QUANDO: o autor fechar o teto de Arte do mortal e da Centelha baixa." A rodada 8 tirou o
   "provisório" do teto no livro (TETO-ARTE, D-006). Fora do escopo desta rodada; entra na lista de pontos abertos da
   137, ao lado do `ficha-engine.ts`:94.
3. **A C-029 está marcada "substituída" e o site ainda a aplica.** A D-057 está "a implementar, DEPOIS do relato das
   três conferências", e `armas.json` continua com o Desarmado +1/+1. É a convenção do registro (a mais antiga se marca
   no dia da nova), e a N15 cobre a parte da mesa. Só anoto que, até a D-057 entrar, quem ler o índice acha que a regra
   no ar não vale mais.

## CLAREZA

A seção "Cadeias a conhecer" (`decisoes.md`:15) não ganhou as duas cadeias novas (C-025 para D-060, C-029 para
D-057), nem traz a D-017 no fim da cadeia do Resistir de um jeito que se leia de cima a baixo. Não é exigência da regra
do registro (ela pede a entrada e a marca de substituída, e as duas estão lá); é o lugar onde quem chega procura
primeiro.
