# Rodada 101 · despacho · o lote do monte A

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> Liberado pelo humano em 24/09/2026: uma rodada, um lote, com a Revisora fechando. Progresso em
> `progresso-101.md` (uma linha por etapa pequena), relato em `101-executora.md`.

## 0 · Onde, e é a primeira rodada numa árvore própria

**Você trabalha em `C:/Users/Neves/ClaudeCode/centelha-executora`**, e NÃO no `rpg-system`. A árvore
foi criada pelo Arquiteto em 24/09/2026 (passo 4 do `docs/simulacao/caixa/plano-worktrees.md`),
destacada em `origin/main`, com `node_modules` em junction para o do `rpg-system` e o `.env` copiado.
O `rpg-system` está nove commits atrás do `origin/main` e com o `main` local cheio de commits do mapa;
nada desta rodada toca nele.

1. **Ao começar:** `git -C C:/Users/Neves/ClaudeCode/centelha-executora status --short` vazio, depois
   `git fetch origin` e `git checkout --detach origin/main` lá dentro. A primeira linha do progresso
   diz o sha em que você começou.
2. **Commits com pathspec**, como sempre. Todo commit que toque `src/` traz a linha do que muda para
   quem joga amanhã.
3. **Antes de publicar:** `git fetch origin` e `git rebase origin/main`. Conflito: `git rebase --abort`
   e me avise, sem resolver sozinha conflito em arquivo que não é desta rodada.
4. **`git push origin HEAD:main`.** Se não for fast-forward, uma volta do passo 3 e mais uma tentativa;
   recusou de novo, **avise em vez de forçar**. Nunca `--force`.
5. O relato dá os shas como estão no `origin/main`.
6. **`npm install` não se roda nesta árvore** (a junction faria o install mudar todas as árvores). Se
   algo pedir, pare e me diga.
7. Nada de `npm run dev` nem `npm run bancada` sem porta: os testes já pedem porta livre sozinhos. Se
   precisar de servidor à mão, `--port 4400`.

## 1 · O lote, nesta ordem

A fonte é `docs/simulacao/caixa/leitura-de-novato-2-cruzamento.md`, **seção 2 (MONTE A)**: cada linha
de lá já traz o arquivo, a linha e o dado que manda. Leia a linha, confira no dado, conserte o texto.
**O JSON vence o capítulo** (a regra da casa); quando o texto e o dado discordam, é o texto que muda,
salvo onde a linha diz o contrário.

### 1.1 · As CONTAS publicadas erradas, primeiro (são número errado no site)

a1, a10, a15, a17, a25, a26, a29, a38, c6, c14.

**O a18 (o Bram) NÃO entra**, por decisão do humano: nenhum dos cinco números da tabela do Bram se
mexe. Ver o 1.3.

### 1.2 · Os demais do monte A

a2, a6, a7, a8, a9, a12, a13 (só o meio-orc), a14, a19, a28, a36, a37, a41, a42, a43, b3, b6, b7,
b11, b14, b17, b18, b19, b20, c1, c2, c3, c4, c8, c9, c10, c11, c12, c15, c16.

Três avisos de terreno:

- **o a2 entra** (o humano confirmou): alinhar a `defesas.md:37-39` e às notas de `regras.json` da
  Defesa Mental e da Social. **O a3 (o alvo do interrogatório sem tortura) NÃO entra**, fica no monte B;
- **c10 e c11 mexem em `habilidades-secundarias.md`, que tem um bloco GERADO** (entre
  `<!-- gen:secundarias -->` e `<!-- /gen:secundarias -->`, por `node scripts/gen-cap-pericias.mjs` a
  partir dos JSONs de habilidades). O que estiver dentro do bloco se conserta na fonte e se regera;
  correção por cima de trecho gerado morre no próximo regen. O que estiver fora, à mão;
- **b7 e c9 mexem em JSON** (`venenos.json`, `antecedentes.json`): o b7 acrescenta um valor que o
  capítulo já publica, e o c9 limpa um texto. Rode o `npm run validate` depois.

**Se um item se revelar de duas leituras** (o dado não responde, ou responde de dois jeitos), **pare
esse item e escreva como PERGUNTA no relato**, com as duas leituras. Não decida. O resto do lote segue.

### 1.3 · A dívida escrita da M-02 (decisão do humano, 24/09/2026)

A M-02 fica de pé e nenhum número do Bram se conserta. Mas ela passa a dizer em voz alta por que o
total não se confere:

- **`src/content/chapters/criacao-de-personagem.md`, logo abaixo da tabela do Bram:** uma linha dizendo
  que o total do exemplo não se confere hoje, e por quê: a linha de Técnicas não se confere em
  nenhum dos quatro exemplos (Kael, Sora, Veil, Bram), porque a lista de Técnicas deles não existe no
  dado. Curta, no tom do capítulo, para o jogador;
- **`docs/simulacao/caixa/jogador-novo-decisoes.md`, na M-02:** o porquê que ela não tem. A
  escolha consciente de deixar as cinco linhas de pé se apoia em que nenhum total de exemplo é
  conferível hoje, e diga por quê, com os fatos do conferidor (`node scripts/cost-examples.mjs`):
  ele **carrega os 120 de Técnicas sem conferir**, **supõe os níveis das Secundárias** (o capítulo
  só dá a contagem) e **supõe todas as Especialidades primárias de nível 1**. Enquanto ele supuser,
  nenhum total de exemplo é conferível, e isso tem de estar escrito antes de qualquer reabertura.
  Cole a saída do conferidor para o Bram no relato.

### 1.4 · As correções que ficaram das rodadas 98 e 99

- **CORRIGE da 98** (`98-revisora.md`, §2): `racas.md:145` e `FRENESI.md:116-118` dizem que o conjunto
  que ganha +2 é "o mesmo" cuja penalidade de ferimento a fúria ignora; desde a 98 o tiro sofre
  penalidade, então os dois diferem no tiro. Uma oração em cada lugar ("menos o tiro"), redação sua;
- **CORRIGE da 99, C-102** (`99-revisora.md`, §1): a marca do C-102 em
  `docs/simulacao/caixa/jogador-novo-bestiario.md` passa a dar a causa medida: o 101 conta o
  **Espantalho Desperto** (`mon-exemplo-espantalho`), a única criatura com elementos que não está no
  satélite `elementos-bestiario.json`;
- **CORRIGE da 99, C-23** (`99-revisora.md`, §2): a tabela de `acoes-sentidos-e-engano.md:18-23` supõe
  vigias sem Centelha e não diz. Um parêntese no cabeçalho da coluna ou uma frase sob a tabela, no
  molde de `coracao-do-sistema.md:90`. Os números não mudam;
- **`Pendencias.md` §6, item 2:** ainda cita C-22, C-39 e C-61 como "marcados como feitos que não
  estão", e os três fecharam na rodada 99 (`bed1e91`). Corrija a frase.

## 2 · O que NÃO entra

Nada do monte B. Nenhum número do Bram. A PERGUNTA da 99 (o contrapé na iniciativa social) e a da 98
(a Arte mirada ferida) são do humano. Nada do L104, do L105 e do L106. Migração 33, fase 4 e o desfazer
da voz, não.

## 3 · O relato

`101-executora.md`, as quatro seções da casa. Para cada item: o arquivo, o que estava, o que ficou, e o
dado que manda. `npm run validate` verde antes do último push, e o CI lido pelo run inteiro. Travessão
conferido lendo os arquivos, e não pelo `git diff`.
