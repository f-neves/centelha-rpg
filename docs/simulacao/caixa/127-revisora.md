# Rodada 127 · veredito · Bloco G, os CORRIGE da 126, D-035 e a rodada 1 do veterana-1d

**Aviso:** a mensagem do Arquiteto, com quatro itens em ordem:
1. `822be8b1`, o Bloco G;
2. `da98f8b1`, os dois CORRIGE da 126;
3. `2aa30250`, a D-035;
4. `eaca41a0`, a rodada 1 do veterana-1d.

**Pino** `2aa30250`, o mais novo dos quatro. Passo 0 pelo §0.1:
- `merge-base --is-ancestor HEAD origin/main` passou (o veredito 126, `476fade1`, está no `main`);
- depois, `switch -C revisora 2aa30250`;
- toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE nos quatro.** Nenhum BLOQUEIA e nenhum CORRIGE. Ficam duas observações de
redação e uma sobra num documento da raiz, fora do site.

## CI (§11)

Workflow `Validar dados e regras`, os quatro `completed / success` na tentativa 1.

| commit | run |
|---|---|
| `822be8b1` | `37174631521` |
| `da98f8b1` | `37175588407` |
| `eaca41a0` | `37176419134` |
| `2aa30250` | `37176997957` |

O Validar roda num `actions/checkout@v4`, que é checkout limpo: só os arquivos versionados.

Rodado por mim no pino:
- `npm run build`, verde (log em `../tmp/revisora/build-127.txt`);
- `gen-cap-antecedentes --check`, verde;
- `gen-mermaid --check`, verde;
- os scripts `a1_1d.py` e `a1_contas.py`, com saída em `../tmp/revisora/a1-contas-127.txt`.

## 1 · Bloco G, `lore/economia` fora do git: PROCEDE

**O que fica versionado** (`git ls-files lore/economia`):
- a `v2/` inteira: `base.py`, `gerar.py`, `mercadorias.py`, `modelo.py`, `revisao-economica-v2.md` e o
  `v2/mercadorias.procedencia.json`;
- os três `*.procedencia.json` de fora da `v2/`: `mercadorias.procedencia.json`,
  `montarias.procedencia.json` e `etapas-abc/mercadorias.procedencia.json`.

Mais nada.

**O `.gitignore` não desprotege a `v2/`:**
- `git check-ignore --no-index` em cada arquivo versionado não acusa nenhum;
- a regra nova `lore/economia/*.md` só pega o primeiro nível, e por isso não alcança
  `v2/revisao-economica-v2.md`;
- `lore/economia/etapas-abc/*` tem a exceção `!...procedencia.json`.

**Ninguém lê os 9 que saíram.** `git grep` em `scripts`, `src`, `.github` e `package.json` por:
- `lore/economia`;
- os nove nomes: `README`, `anexo-auditoria`, `catalogo-unificado`, `estado-revisao`, `etapas-abc`,
  `revisao-economica-etapas`.

Quem lê `lore/economia` lê só a `v2/` e os `procedencia.json`:
- `copiar-economia.mjs:27-28`;
- `gen-cap-economia.mjs:4`;
- `validate-data.mjs:922`.

Os `README.md` que aparecem são outros (`supabase/`, `docs/simulacao/caixa/`).

**O restore, rodado na minha árvore:**
- tirei o comando da mensagem do commit por `rtk proxy git log`, porque a saída comum encurta a linha, e
  ele ficou salvo em `../tmp/revisora/restore-g.sh`;
- os nove voltaram ao disco;
- `git status --short` ficou limpo;
- `git status --ignored` os mostra como ignorados (`!!`), fora do índice. Funciona como o commit diz.

**Observação, sem rótulo.** `git rm --cached` tira os nove do índice daqui para a frente, e a história
continua com eles. O registro (P-10) fala em "fora do repositório público", e quem clona o repositório
ainda chega a eles pelo histórico. O commit diz isso ("a história não muda"), e a opção A do autor era
essa. Fica anotado só para não ser lido como "apagado do público".

## 2 · Os dois CORRIGE da 126 (`da98f8b1`): PROCEDE

- **`qual-sistema.md:43`** (o nó do diagrama) virou "Alvo pode gastar Vontade: 1 + Margem (teto 4) recusa;
  pagar 1 encurta um grau na régua de Duração do efeito, e no menor grau anula".
- **`qual-sistema.md:119`** virou "pagar **1 + Margem** de Força de Vontade (teto 4) recusa o efeito; com
  Margem 1 ou mais, pagar só 1 encurta um grau na régua de Duração do próprio efeito, e no menor grau o
  anula (ver Defesas)". O "Contra leitura não dá" ficou.
- **O SVG** foi regerado, com `gen-mermaid --check` verde. No gerado
  (`dist/regras/qual-sistema/index.html`), "por cena/dia" aparece 0 vezes, e "encurta um grau" 2 (o
  diagrama e a folha).
- **O `arcano.astro:63` entrou na lista do Bloco D** do relato (`rodada-pendencias-relato.md:182-187` e
  `:570`).

## 3 · D-035 (`2aa30250`): PROCEDE

- **O texto novo** (`arcano.astro:63`): "um magus de academia de Centelha mínima que se destaca pela
  **amplitude**: muitas Artes, rituais e preparo para cada ocasião. A pouca Centelha segura o nível de cada
  Arte (o teto é Centelha + 2: Centelha 0 chega ao nível 2, Centelha 1 ao 3), e não o quanto ele sabe".
  Bate com a D-035 e com a tabela da D-006.
- **No gerado** (`dist/arcano/index.html`), "se destaca pela amplitude" aparece 1 vez, e "tão fundas
  quanto" 0.
- **`criacao-de-personagem.md` não foi tocado:** o `--stat` do `2aa30250` só tem `arcano.astro` e o
  relato. O `:149` e o Bram (`:153`) ficaram, como a D-035 manda ("não aplicar antes" do veterana-1e).
- **O relato traz o `:149` como conflito** (`rodada-pendencias-relato.md:587`) e também o Bram (`:597-599`).

## 4 · Rodada 1 do veterana-1d (`eaca41a0`): PROCEDE

### O texto de (e), palavra por palavra no gerado

Escrevi um verificador, `../tmp/revisora/check-e-127.mjs`. Para cada um dos 16 IDs, ele lê na fonte
(`tmp/veterana/veterana-1d.md`) a seção `#### <ID>.`, tira do (e) cada trecho «…» e procura o trecho no
texto de todo HTML do `dist/`. Antes de comparar, ele tira as tags e as entidades, o markdown e os
espaços.

Saída em `../tmp/revisora/check-e-127.txt`.

**Os trechos que ele não achou:**
- **Texto velho, que tinha de sumir, e sumiu:**
  - K9c, 1 trecho;
  - ANTECEDENTE-6, 6 trechos;
  - RACIAL-7, 2 trechos ("respeitados os tetos que a sua raça moveu" e "Atributo máximo 5;").
- **Falso negativo do meu verificador (entidade `&#x26;` no `&` do link):** C14a (Gnomo) e ANAO-PORTE
  (Anão). Li o HTML: "Porte pequeno [...] Vida, Ferimentos &#x26; Cura" e "Porte médio [...] e não muda o
  porte" estão lá, com as palavras certas.
- **K9j** é um rótulo de interface. O `dist/tecnicas/index.html` tem os filtros de nível 1, 2, 3, 4, 5
  e 6.
- **RACIAL-7 item 2:** as palavras estão todas lá, e só a pontuação mudou. O (e) diz «Seus Atributos param
  no teto humano (6), salvo o primeiro ponto acima, que a herança racial pode dar a um Atributo (Cap.
  VI).», com ponto final. Em `centelha.md:30` o trecho entrou no meio da frase que já existia, e o ponto
  virou vírgula: "[...] a um Atributo ([Cap. VI](...)), seus saltos são saltos de atleta [...]". Ver
  observação 1.

Todos os outros trechos novos dos 16 IDs estão no gerado, inclusive:
- T2a, os dois;
- ATRIBUTO-PURO, os seis, nos Caps. V, IX, X e na Criação;
- ELFO, com o texto do Meio-Elfo em paridade;
- K9b, os dez;
- ART-27, FE-VONTADE, K9h, K9i e K3a.

### Os termos antigos

- **"teto de +6", "até +6" e "somando entre os traços":** zero em `src`. A única sobra é
  `Antecedentes.md:54`, um documento de desenho da raiz, fora do site ("somam entre si até um teto de +6").
  Ver observação 2.
- **"+3" solto:** os "+3" que sobram em `antecedentes.md:123` e `relacoes-sociais.md` são o degrau
  Aliança da Régua de Relação, e não desconto de Antecedente.
- **"nível do traço tira/desconta/por passo"** sem a metade: zero em `src`. `antecedentes.json`
  (Reputação, Posição, Refúgio) e a nota de `regras.json:408` dizem a metade, e o
  `gen-cap-antecedentes --check` está verde.
- **O Resistir não foi reaberto** (item 5 da conferência comum da Parte D): nenhuma página diz "1 ponto
  por ação" para resistir, "pedido 1 nível abaixo" ou blindagem "por cena/dia".

### As decisões da rodada

- **D-027:** os dois lados batem.
  - O Cap. VII diz "a metade do nível do traço, arredondada para baixo [...] (nível 1, nenhum passo; 2 e
    3, um; 4 e 5, dois; 6, os três [...])" e "Vale a metade do maior traço".
  - O Cap. X (`relacoes-sociais.md`, "Sair do Neutro") diz "pela metade do nível do traço (para baixo), e
    só o nível 6 desconta os três".
  - O script dá o mesmo (`floor(n/2)`: 0, 0, 1, 1, 2, 2, 3).
- **D-028:** o máximo racial vale na criação, escrito nos três lugares:
  - Atributos: `atributos.md:74`, "leva um Atributo a 7 mesmo em quem tem Centelha 0";
  - Centelha: `:30` e o item 3 de "O que a Centelha faz";
  - Criação: o passo 4, os Limites e o pico, "o 6 e o 7 dele não gastam o pico".
- **D-029:** `racas.json` dá o porte Médio para Humano, Anão, Elfo, Meio-Elfo, Orc e Meio-Orc, e
  Pequeno para Gnomo e Halfling.
  - O capítulo diz o mesmo nas linhas novas e na coluna da tabela (C14a).
  - A Resiliência Mental não foi tocada (o diff do `racas.md` não passa por ela), e só a Aparência
    Universal mudou.
- **A Fé:** "recuperação de Vontade em terreno sagrado" saiu de `antecedentes.json` e do capítulo.
- **Iniciativa sem Centelha:** a mesma frase está em `combate.md:27`, em `relacoes-sociais.md:134` e no
  item 1 do Cap. V, e na tabela da Criação.

### As contas, refeitas com `a1_1d.py` e `a1_contas.py`

- **K9b:** 1 em 20 = 5%; 95 + 5 = 100. O texto novo explica que os percentuais contam "quem chega a este
  nível ou mais".
- **K9c:** o Antecedente custa 3, 6, 9, 12, 15 e 18 por ponto, contra a secundária 3, 4, 5, 6, 7, 8 e a
  primária 6, 8, 10, 12, 14, 16. Então custa o mesmo que a secundária no nível 1, menos que a primária
  até o 3, o mesmo no 4 e mais no 5 e no 6 ("15 contra 14, 18 contra 16"). Confere.
- **ANTECEDENTE-6:** o desconto é `floor(n/2)`, como acima.
- **T2a:** com Destreza 3 e Centelha 3, 1d6 + 5 contra 1d6 + 2. Confere com o exemplo do Cap. V.

### O código pequeno

- **`content.config.ts:327-331`:** o campo opcional `capitulo` nos capítulos.
- **`regras/[slug].astro`:** `rotulo()` só põe o nome do capítulo na frente do título quando a página
  vizinha é de outro numeral. `acoes-e-sistema.md` ganhou `capitulo: "Ações & Sistema"`. É o K3a, cujo
  trecho de (e) está no gerado.
- **`tecnicas.astro:27`:** o filtro passa a ir de 1 até o maior nível das Técnicas visíveis. O gerado tem
  de 1 a 6. É dinâmico, e não fixo em 6: se um dia o maior nível visível baixar, o filtro encolhe junto.
  Isso é coerente com o filtro, e só registro.
- **`antecedentes.json`:** os três "amarra" (Posição `:213`, Reputação `:249`, Refúgio `:319`) e a Fé
  (`:422`). O capítulo é gerado deles, e o `gen-cap-antecedentes --check` está verde.
- Fora do que você pediu, conferi também `venenos.json` (a nota da bebida forte, K9h) e `glossario.json`
  (a régua de 0 a 6 para o jogador e até 12 no bestiário, K9b). Os dois batem com o capítulo.

Não cobrei as duas decisões que a Executora levantou e que são suas:
- o "(Vontade máxima)" da linha da Energia;
- o limite 5/pico 6 na `/ficha`, que vai para o autor.

### Observações, sem rótulo

1. **RACIAL-7 item 2** (`centelha.md:30`): o trecho do (e) entrou no meio de uma frase que lista o que o
   mortal é ("Seus Atributos param [...] (Cap. VI), seus saltos são saltos de atleta, sua força [...]").
   As palavras estão todas lá, e o ponto final do (e) virou vírgula para a lista continuar. A leitura fica
   carregada, mas não muda a regra.
2. **`Antecedentes.md:54`** (documento de desenho da raiz, fora do site) ainda diz que os traços
   "somam entre si até um teto de +6". O D-027 revisou isso. Não é página do livro, e fica para quem
   cuida dos documentos de desenho.

## Travessão

Contei o caractere no arquivo inteiro, no `476fade1` e no pino, em todo arquivo que os quatro commits
tocam, fora o `diagramas.json` e o registro.
- Nenhum número mudou.
- O relato novo do veterana-1d tem 0.
- Nenhum travessão novo.

## Limpeza

O build gerou `dist/` e `.astro/` só na minha árvore. O restore pôs os 9 arquivos no disco desta árvore,
como ignorados. Os scripts e as saídas estão em `../tmp/revisora/`. Nenhum arquivo versionado tocado além
deste e do `progresso-revisora-127.md`.
