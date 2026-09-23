# Rodada 93 · veredito

Pino: `d79206f` (aviso), faixa `25ffb62..5134d6c`, `lore/` fora. Passo 0 conferido: toplevel é a
worktree da Revisora, HEAD `d79206f5e40a`.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE. As cinco coisas que o aviso pediu
estão abaixo, cada uma com a prova. Todo controle que podia gravar em configuração rodou num clone
descartável no meu scratchpad, com a `.git/config` própria dele, e nunca contra a compartilhada.

## 1 · A config, antes e depois, e o controle do incidente

**Onde:** um clone local (`git clone --no-checkout` da minha worktree, `checkout --detach d79206f`),
com `core.hooksPath scripts/hooks` ligado **na config do clone**, `node_modules` por junção (como o
próprio gancho faz) e o `.env` copiado. O teste foi o gancho de verdade, disparado por
`git commit -- <caminho>` dentro do clone, e não uma simulação das variáveis.

| rodada no clone | o que o gancho validou | exit | `git config --local --list` do clone |
|---|---|:--:|---|
| commit de um `.md` | o `validate` inteiro, com o `test-reapontar.mjs` commitado (a saída mostra "a .git/config de quem rodou o teste está como estava") | 0 | **idêntica** antes e depois |
| commit do `test-reapontar.mjs` **sem o ambiente limpo** (troquei `env: ENV_LIMPO` por `env: process.env` nas duas chamadas) | a versão de antes do conserto | 1 | **ganhou `core.worktree=<pasta temporária>` e `core.autocrlf=false`**, exatamente o estrago do incidente |

**O incidente reproduz, e o conserto o impede.** A variante sem o ambiente limpo gravou as duas
chaves na config do clone. Com a versão commitada, nada mudou. Desfiz o estrago no clone, depois
apaguei o clone inteiro, removendo a junção antes para não encostar no `node_modules` da minha
worktree. Conferi em seguida a config compartilhada: **nenhuma `core.worktree` e nenhuma
`core.autocrlf`**.

**Ressalva sobre o próprio instrumento:** o `diff` deste ambiente passa por um filtro que devolve
exit 0 mesmo quando os arquivos diferem. No segundo caso ele imprimiu as linhas acrescentadas e, logo
depois, o meu "CONFIG-IDENTICA" encadeado por `&&`. Li a diferença pela saída, e não pelo código de
saída. Registro porque um `diff ... && echo igual` neste ambiente pode mentir.

## 2 · Outros testes com o mesmo risco (listados, não consertados)

Procurei em `scripts/` todo `.mjs` que chama processo (`child_process`) e todo `git init`,
`git config`, `commit`, `checkout` e `worktree add`:

- **Escrevem em repositório e limpam as `GIT_*`:** `test-reapontar.mjs`, que remove toda `GIT_*`
  menos `GIT_EDITOR`, e `test-rodada.mjs`, que remove uma lista explícita: `GIT_DIR`,
  `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES`,
  `GIT_PREFIX` e `GIT_COMMON_DIR`. Conferi as **12** chamadas `exec*Sync` do `test-rodada.mjs`, e as
  12 passam `env: ENV_LIMPO`. Os dois estão protegidos. A diferença de forma (regex contra lista)
  não abre buraco hoje, mas é um lugar onde os dois podem divergir.
- **Só leem git, sem limpar o ambiente:** `test-portoes.mjs:413` (`git config core.hooksPath`, só
  leitura), `test-lance.mjs:79` (`git rev-parse HEAD`) e, por baixo do `test-corpus-misto.mjs`, o
  `sim/agregar.mjs:261-262` (`rev-parse` e `status --porcelain`). Nenhum grava config. Dentro do
  gancho, os três leem o repositório real e o índice temporário, e não a pasta de validação. Isso é
  leitura, e não o risco do incidente.
- **`duo.mjs` e `rodada.mjs` fazem `add`/`commit`/`checkout`**, mas são ferramentas e não testes. O
  `validate` não os roda, e o `test-duo.mjs` só importa funções (`duo-gasto`, `duo-arvore`), sem
  chamar git.

**Nenhum outro teste do `validate` grava config ou faz `git init`.**

## 3 · A 107ª citação

Conferi as 107 pelo diff da faixa, citação por citação, com um script meu: casei a linha antiga com a
nova em cada documento e, para as linhas do `CONTEXTO.md` (que o `e8a3411` deslocou), casei pelo
texto sem o número. **A 107ª é a do `const condId` em `L-simulacao-simultaneo.md:1689`**: 1894 foi
para 1896 só pelo diff do comentário de `aguentouFicarParado` (+2 linhas). Ela já estava certa desde
a 92 e não precisou ser endireitada. É a única das 107 cuja linha antiga já tinha a âncora na base
`25ffb62`.

## 4 · As 106 (todas, e não por amostra), e as 10 ambíguas

**A lição da 92 aplicada:** para cada citação movida, procurei a **âncora entre crases** (pela mesma
regra do portão) **na linha nova**, e não comparei a linha velha com a nova. Resultado: **107 de
107 têm a âncora na linha nova**, e **104 das 105** que casei linha a linha estavam tortas na base
(a âncora não estava na linha citada). Contagem por documento, idêntica à do relato:
`L-simulacao-simultaneo` 73, `CONJURACAO` 11, `Grid_Mobile` 6, `REVISORA` 4, e 2 cada em `CATALOGO`,
`ESTADO`, `VOZ`, `Migracao_Dominio` e `CONTEXTO`, mais 1 cada em `Auditoria_Tecnica`, `B-bestiario`
e `K-combate`. As duas do `CONTEXTO`, conferidas à mão: `log.mjs:226-228` tem `golpeNoTick = true`
na 226, e `grid.astro:2681` é `const curarPv = async (`.

**As 10 ambíguas não foram movidas:** a linha de cada uma (`ESTADO.md:790`,
`L-simulacao-simultaneo.md` :68, :71, :659, :812, :1188, :1698, :2454, :3829, `Grid_Mobile.md:177`)
está **byte a byte igual** em `25ffb62` e em `5134d6c`.

**A segunda passada, refeita por mim no clone:** `node scripts/reapontar.mjs --tudo` sobre
`d79206f` deu "0 citação(ões) movidas", avisou as mesmas 10 como ambíguas, e o `git status` ficou
limpo.

## 5 · Duas âncoras na janela: ele não escolhe

**Prova pelo terceiro sentido:** escrevi uma variante do `reapontar.mjs` em que o caso ambíguo
**escolhe a mais próxima** (a linha `if (achadas.length === 1)` vira "ordena por distância e pega a
primeira") e rodei `node scripts/test-reapontar.mjs --script <variante>` no clone. **Falha 3**:
"a ambígua anda o deslocamento e não é endireitada por proximidade", "a torta vai de 7 para 6; a
certa (9) e a ambígua (13) ficam" e "uma segunda passada não move nada". O script commitado passa
6 de 6. Então o teste pega exatamente a escolha por proximidade que o `L65` proíbe. No repositório
real, as 10 ambíguas intactas do item 4 são a mesma prova.

## 6 · O resto da faixa

- **O comentário de `aguentouFicarParado`** agora separa os dois ramos: no de ficar parado a caixa
  só coleta e rola, e no de tentar sair ela ainda decide contra `difMetade` e `difNada`. Isso fecha
  a minha nota da 92.
- **A janela do portão** ficou como estava, e a medida da Executora (2 verde, 1 com 3 vermelhas, 0
  com 10) é coerente com o que achei: as 10 que acenderiam com janela 0 são as 10 ambíguas. Com o
  `reapontar.mjs` endireitando, a folga deixou de propagar desvio. Concordo em não mexer.
- **`REVISORA.md` teve 4 citações movidas.** O arquivo se declara "copiado byte a byte" como
  registro histórico. Mas as citações dele já eram cobradas pelo portão e já tinham sido
  reapontadas no `L80` (`3c5201d`, 11/09), com as históricas marcadas. Então o gesto tem
  precedente, e não é desta rodada. Anoto só para a frase "byte a byte" não ser lida como literal.
- **`e8a3411` (Arquiteto, `CONTEXTO.md` e `PLANO.md`):** não achei nada falso. Os três PROCEDE e os
  shas (`84228f3`, `12fb0be`, `25ffb62`) batem com os meus vereditos, a 93 está descrita como aberta,
  e as três perguntas estão descritas como estão: com o humano, sem resposta.

## Delta · o que chegou depois do pino

Ao publicar, `origin/main` tinha dois commits além de `d79206f`: `95e4733` e `2820332`. Os dois só
mexem no `progresso-93.md` da Executora. Eles registram o incidente e a mesma prova do item 1, feita
no repositório real: a config lida antes e depois de um commit pelo gancho, 16 linhas idênticas por
`cmp`. A busca por testes de risco que ela registrou ali chega aos mesmos dois nomes que o meu item 2
(`test-rodada.mjs` e `test-reapontar.mjs`). Nenhum dos dois commits toca uma conclusão minha. Rebaseei
(`§10`, contagem e não conclusão) e não li o registro como prova minha: a minha prova é a do clone.

## Limpeza

Tudo que foi transitório rodou no clone (`scratchpad/clone93`, apagado no fim, com a junção do
`node_modules` removida antes) ou em arquivos do scratchpad. Na minha worktree não mexi em arquivo
versionado nenhum. A config compartilhada, conferida no fim, não tem `core.worktree` nem
`core.autocrlf`. `git status --short` ao fechar: só os meus dois arquivos da caixa.
