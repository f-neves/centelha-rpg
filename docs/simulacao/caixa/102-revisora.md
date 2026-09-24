# Rodada 102 · veredito

Pino: `8c57aea` (aviso), faixa `badd087..a305665`. **Primeira reancoragem pelo §0.1.** Antes, conferi
que o meu veredito da 101 (`2acb5a4`, o HEAD de então) estava no `origin/main`, pelo
`merge-base --is-ancestor`, e estava. Depois rodei `git switch -C revisora 8c57aea`. Passo 0:
toplevel é a worktree da Revisora, HEAD `8c57aea1cb72`, e `git branch --show-current` dá `revisora`.
A worktree estava limpa antes.

**Veredito geral: PROCEDE, com um CORRIGE da Executora e um CORRIGE do contrato.** Nenhum BLOQUEIA.

- **O CORRIGE da Executora:** o autolink de "Perfuração" pôs **24 links** no sentido errado (o modo
  de dano), em 10 páginas (§1).
- **O CORRIGE do contrato:** o §0.1 manda pular a conferência justamente na primeira vez, e o
  contrato ainda diz "detached" em dois lugares (§0).
- O resto confere: o id reusado, a Bravura e os valores do verbete novo.
- **Uma ESCALA de CI:** o `test-luas` caiu no run do trabalho porque o navegador não subiu. Não é da
  rodada, e o run do aviso passou inteiro.

## CI (§11)

Workflow `Validar dados e regras`:

- **`a305665` (o trabalho):** run `35963915888`, **`completed / failure`**, 18 de 19 jobs verdes.
  **Vermelho só em `Smoke · test-luas`**, e o erro é de subir o navegador, antes de abrir qualquer
  página: `TimeoutError: Timed out after 30000 ms while waiting for the WS endpoint URL to appear in
  stdout!`.
- **`8c57aea` (o aviso):** run `35964002508`, **`completed / success`**, 19 de 19 jobs verdes,
  **`test-luas` incluído**. O aviso só acrescenta um `.md` sobre a mesma árvore de código, e o
  mesmo teste passou.
- **A base `badd087`:** run `35963561014`, `success`.

**A classificação:** o vermelho **não é da rodada**. O navegador não subiu, o que acontece antes de o
teste tocar qualquer coisa que a faixa mudou, e o commit seguinte, com o mesmo `src/`, passou no
mesmo job. Não vi esta forma antes. Na lista de jobs vermelhos dos 60 runs que li na 98 o
`test-luas` não aparece, e os vermelhos desde então que li foram outros jobs. Não reli job por job
os runs de hoje. Não é BLOQUEIA. Pelo §11, é **ESCALA** como intermitência de
infraestrutura nascida em `a305665`, sem causa investigada.

## 0 · O §0.1: o primeiro achado, e é do contrato

**1. A conferência some exatamente na primeira vez.** O bloco do §0.1 é
`git merge-base --is-ancestor revisora origin/main`, com "(pule na primeira vez)". Na primeira vez a
branch `revisora` não existe, e o comentário manda pular. Mas é justamente na primeira vez que o
veredito anterior está num HEAD destacado, que é o caso mais frágil. O aviso da 102 remendou isso
trocando `revisora` por `HEAD`.

**`HEAD` serve sempre:** depois do commit do veredito, HEAD e `revisora` são o mesmo commit, e na
primeira vez HEAD é o único nome que existe. **O conserto é trocar `revisora` por `HEAD` no bloco e
apagar o "(pule na primeira vez)".**

**2. O contrato continua dizendo "detached" onde já não é.**

- `§0:26`: "Onde está agora: ... **detached**, no sha que o último aviso de rodada mandou."
- `§7:269-270`: "a Revisora trabalha num worktree em **detached HEAD**", com a explicação de por que o
  commit não move ramo nenhum.

O §0.1 avisa que substitui o `checkout --detach` do `§0:17`, mas não toca nessas duas frases. A do
§7 é a justificativa histórica do push e pode ficar como passado. **A do §0:26 descreve o presente,
e está falsa desde a 102.**

Quem abrir o contrato do começo lê "detached" duas vezes antes de chegar ao §0.1. É a forma que o
próprio contrato já catalogou no §0 (a frase que envelhece enquanto o parágrafo não muda).

**CORRIGE, do Arquiteto, que é o dono do contrato.** Duas trocas pequenas.

## 1 · O autolink de "Perfuração": 50 links, 24 no sentido errado

**Como medi.** O autolink roda no navegador (`Referencias.astro:38-94`), e não no build. Então o
`dist/` estático não o mostra. Escrevi um medidor no scratchpad (`medir-autolink.mjs`):

- serve o `dist/` da minha worktree sob `/centelha-rpg/`;
- abre as **107 páginas** no Edge sem janela;
- espera o `ref-index.json` e o autolink;
- lista todo `a.ref` com `data-ref` `perfuracao` ou `penetracao`, com o bloco em volta.

**Um tropeço do instrumento, que fica dito.** O primeiro build saiu com exit 0 e com os capítulos
**velhos**: o `.astro/` da minha worktree servia conteúdo em cache. O HTML de
`aparencia-virtudes-vontade` ainda dizia "ao medo e à intimidação", e o de custos, "+1 nível de
Penetração". Apaguei o `.astro/` (não versionado, só meu), rebuildei, e os dois textos saíram
certos. **Todos os números abaixo são do build limpo.** A primeira medição, suja, diferia em um link
só.

**O resultado:** **50 links para `perfuracao`** em 11 páginas, e 6 para `penetracao`.

**Os 26 no sentido certo (o gate):**

- "Nível de Perfuração" (10, com os dois "+1 nível de Perfuração" da tabela de custos);
- "Resistência à Perfuração" (2);
- "gate" (4);
- e "Perfuração" solta onde ela é o nível ou a resistência (10): "Perfuração nível 3+" (3),
  "Perfuração natural" (2), "Rest. Perfuração" (2), o "Gate natural de Perfuração" da mesa e os dois
  cabeçalhos "Perfuração (Nível)".

**Os 24 no sentido errado (o modo de dano e a Absorção dele):**

| página | links | o que a palavra é ali |
|---|---|---|
| `regras/combate` | 5 | "três Absorções (Impacto, Corte e Perfuração)", "tem Perfuração baixa", "Couraça incide só em Corte e Perfuração", "Impacto / Corte / Perfuração" (Horda), "(Impacto, Corte, Perfuração)" (Absorção de Proeza) |
| `artes` e `artes/regras` | 3 + 3 | "resistem a PERFURAÇÃO" e "resistem a Perfuração" (duas vezes), a resistência elemental ao tipo de dano |
| `artes/efeitos` | 2 | "a armadura absorve normalmente, como perfuração" |
| `mesa/referencia` | 3 | "Couraça (Corte e Perfuração)", "Impacto, Corte e Perfuração", e a célula "perfuracao" da coluna Modo, na tabela que tem "Passa por gate?" ao lado |
| `regras/armas-e-armaduras` | 2 | "Impacto, Corte e Perfuração", "contra Corte e Perfuração entra só a Centelha" |
| `equipamentos` | 2 | as mesmas duas frases |
| `regras/vida-ferimentos-cura` | 2 | "Corte, perfuração, impacto", "corte ou perfuração abre um Sangramento" |
| `bestiario` | 1 | a legenda "Perfuração (P)" dos tipos de dano |
| `ficha` | 1 | o rótulo "Perfuração" da linha de Absorção (`ficha-engine.ts:2067`, `st.soak.perfuracao`) |

**Antes da rodada, nenhum destes 24 era link.** A conclusão vem da lista de apelidos do verbete
antigo, e não de medição: os apelidos eram "Penetração", "pen", "nível de perfuração", "resistência
à perfuração", "r.perf" e "gate", e a palavra "Perfuração" sozinha não estava entre eles. Não
rebuildei a base para medir.

**Por que é CORRIGE:** o despacho prometia "quem procurar a palavra acha a regra certa". Em quase
metade dos lugares, quem clica em "Perfuração" cai no gate quando o texto fala do tipo de dano. É o
§8: a rodada afirma uma coisa e o achado a contradiz. **O conserto é pequeno, mas tem uma escolha
de forma, e ela é da Executora:**

- **tirar a palavra solta das agulhas:** dar ao verbete o termo "Nível de Perfuração" e deixar
  "Perfuração" só no título da página. Perde os 10 acertos de palavra solta, e fica com os 16 das
  expressões;
- ou marcar os blocos do modo de dano com `.no-gloss`, que o autolink já respeita
  (`Referencias.astro:48`). Isso resolve caso a caso, mas cada frase nova sobre Absorção volta a
  linkar errado.

A primeira fecha o defeito pela causa. A segunda fecha pelos sintomas.

**A Penetração:** os **6** links de `penetracao` estão todos no sentido da Técnica: `olho-de-aguia`
(2), `quebra-muralhas`, `ficha`, a linha da tabela de `regras/centelha` e `tecnicas`. O apelido "pen"
não gerou link nenhum nas 107 páginas.

## 2 · O id `penetracao` reusado: o risco que sobra é pequeno, e ela o descreveu certo

- **Nenhum link para `glossario#penetracao` ou `#perfuracao`** em `src`, `scripts` ou `docs`, fora os
  arquivos desta rodada. Conferi a lista dela e ela está certa.
- **No `ref-index.json` gerado:** `perfuracao` traz os termos do gate, e `penetracao` traz
  "Penetração" e "pen". **Os dois não colidem com Técnica nem com Arte**, porque o `byHash`
  (`Referencias.astro:25`) juntaria os três tipos. Os 14 ids repetidos do índice são os mesmos de
  antes, como ela diz.
- **O risco que ela não citou:** as entidades fixadas pelo leitor ficam em `sessionStorage`, com a
  chave `tipo:id` (`Referencias.astro:17, 221`). Quem tinha "termo:penetracao" fixado numa aba aberta
  durante o deploy passa a ver a Técnica no lugar do gate. O efeito dura só até a aba fechar, e
  **não vale conserto**. Fica dito.

## 3 · A Bravura: a busca refeita, e a Temperança intocada

Refiz a busca do meu lado, com um critério mais largo que o dela: toda linha com "intimid" em
`src/**` (md, json, ts, astro) e `scripts/**`, que tenha "Bravura", "valor" ou "Virtude" até duas
linhas antes ou depois. Deu **6 linhas**, e todas já seguem a régua do medo:

- `acoes-resistir.md:190`;
- `aparencia-virtudes-vontade.md:125`;
- `defesas.md:37`;
- `qual-sistema.md:58` e `:116`;
- `racas.json:133`, o Intimidar do Frenesi, que não é a Bravura.

**Nenhuma ocorrência de "medo e à intimidação"** (nem variante) em `src`, `scripts` ou no `dist/`
limpo. A ficha lê o `virtudes.json`, e o `ref-index.json` diz "Resiste ao medo.".

**A Temperança está intocada:** o diff do `virtudes.json` tem uma linha só, a do `valor`. O caso
gêmeo está registrado como ABERTO em `lista-unica-decisoes.md:80-84`, e o despacho o deixou fora de
propósito.

## 4 · O verbete novo da Técnica: os valores batem

O verbete diz: "2, 3, 4 e 6 pontos nos níveis 1 a 4, toda a armadura no 5, armadura mais Absorção
natural no 6". Batem, na ordem, com:

- `regras.json` → `escalasProeza.trilhas.penetracao.valores`: "2", "3", "4", "6", "toda a
  armadura", "armadura + Absorção natural";
- `centelha.md:76`: N1 a N6, "2 | 3 | 4 | 6 | toda a armadura | armadura + natural".

"Absorção ignorada" é a `unidade` do dado, e o verbete diz "ignora parte da Absorção".

## 5 · O resto

- **`BestiaEditor.astro:214`:** só o `title` mudou, e o rótulo "pen" ficou, como o despacho mandava.
- **`gen-lista-equip.mjs:71`:** a saída é ignorada pelo git, como ela diz.
- **Travessão, lendo os arquivos:** varri as linhas acrescentadas dos 8 arquivos da faixa, mais o
  aviso. Achei uma ocorrência, em `102-executora.md:109`, e ela cita o caractere entre aspas ao
  descrever a própria contagem. Não há travessão de prosa. Controle positivo: `combate.md:35`.

## Limpeza

O medidor e as duas medições ficaram no scratchpad (`medir-autolink.mjs`, `autolink102.json` com o
build sujo, `autolink102b.json` com o limpo). Apaguei e refiz o `.astro/` da minha worktree (não
versionado). Não mexi em arquivo versionado. `git status --short` ao fechar: só os meus dois
arquivos da caixa.
