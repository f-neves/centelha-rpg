# 140 · Revisora · rodada 13 (`2dc330a2`): Desarmado vira Punhos e Chutes (D-057, D-065, D-066)

Pino: `2dc330a2`, que contém o registro `0a7067e1` (branch `revisora` na árvore `centelha-techlead-revisora`; o
veredito 139 é ancestral de origin/main). Fonte: D-057, D-065 (com a correção da dúvida 13 A) e D-066 em
`docs/decisoes-partes/decisoes.md`, e a seção da rodada 13 de `docs/simulacao/caixa/veterana-1e-relato.md`.

**CI:** `2dc330a2`: Validar 37384390341 `success` (a rerodada) e Deploy 37384390236 `success`.

**Resultado: um CORRIGE (o Bloqueio da ficha com Punhos na mão inábil). O resto PROCEDE. Nenhum BLOQUEIA, nenhuma
ESCALA.**

## CORRIGE · a ficha soma arma e corpo quando os Punhos estão na mão inábil

**Original** (`src/lib/ficha-engine.ts`, `calcConj`, logo antes do `return`):

```ts
const ehCorpo = (s: any) => s?.ref === 'a:desarmado' || s?.ref === 'a:chutes';
const maosLivres = (ehCorpo(cj.habil) ? 1 : 0) + (inabil.kind === 'nada' && !it2H(habil) ? 1 : 0);
const nasMaos = [ehCorpo(cj.habil) ? null : habil, inabil].filter((it: any) => it && it.kind !== 'nada');
```

O `ehCorpo` só é perguntado à mão **hábil**. A mão inábil oferece o catálogo inteiro (`optsItens`, que lista todas
as `ARMAS`, Punhos e Chutes inclusive), e quando o jogador escolhe "Punhos" nela, os Punhos entram em `nasMaos` como
se fossem uma arma na mão, e somam com o que está na outra.

**Medido na tela** (dev server e Edge headless, ficha limpa, conjunto 0, trocando os dois seletores; script
`../tmp/revisora/bloqueio-140.mjs`, saída em `bloqueio-140.txt`). A ficha mostra "Defesa por Bloqueio"; com os
traços no piso, a base sem nada é **2** (o caso Machado / Chutes, abaixo, prova: 2 + 0):

| Hábil / Inábil | Bloqueio na tela | Pela D-065 | |
|---|:--:|:--:|---|
| (ficha nova) | 4 | 4 | dois punhos, +2 |
| Punhos / mão livre | 4 | 4 | |
| Chutes / mão livre | 4 | 4 | as mãos ficam livres, +2 |
| Espada Longa (+1) / mão livre | 3 | 3 | a espada ou um punho, +1 |
| Machado (+0) / mão livre | 3 | 3 | o punho livre, +1, é a melhor |
| Espada Longa / Broquel | 4 | 4 | +1 +1 |
| mão livre / Broquel | 3 | 3 | o broquel ou um punho, +1 |
| Lança (duas mãos, +2) | 4 | 4 | |
| **Espada Longa / Punhos** | **4** | **3** | soma a espada (+1) com o punho (+1) |
| **Punhos / Punhos** | **3** | **4** | conta um punho só |

As duas linhas em negrito contradizem a D-065, item 3: "Arma ou escudo e corpo não somam" e "só os dois punhos
somam entre si (+1 cada, +2 com as duas mãos livres)". E contradizem o que a rodada promete: o relato e a N17
(`docs/pendencias/N-grid-pendencias.md`) dizem que "A ficha já faz isso (`calcConj` em `ficha-engine.ts`)".

**Por que CORRIGE (§8):** o caminho é alcançável por qualquer jogador (escolher Punhos na lista da mão inábil é o
gesto óbvio de quem quer "os dois punhos"), falsifica a promessa escrita da rodada, e o conserto é pequeno: tratar
`a:desarmado` e `a:chutes` como mão livre também na inábil (o `ehCorpo(cj.inabil)` contar em `maosLivres` e sair de
`nasMaos`, como a hábil já faz). O smoke da ficha não mede isso, como o Arquiteto disse.

**Leituras do conserto, sem escolher:** (a) a inábil com Punhos ou Chutes conta como mão livre, exatamente como a
hábil; (b) além disso, tirar Punhos e Chutes da lista da mão inábil, para o jogador escolher o vazio ("mão livre") e
a ficha não ter dois caminhos para o mesmo estado.

## O que PROCEDE

1. **As armas contra as decisões vivas.** `armas.json`:
   - `desarmado` (id mantido), nome "Punhos": `classe: leve`, `ticks: 5`, `acerto: 1`, `defesaArma: 1`, `dado: 1`,
     `danoBonus: -2`, Força, Impacto, Briga. É a D-065, item 1.
   - `chutes` (novo): `classe: media`, `ticks: 6`, `acerto: 0`, `defesaArma: -1`, `dado: 1`, `danoBonus: 0`, Força,
     Impacto, Briga.
   - **P/G/R pela régua** (`regras.json` `combate.pgr`: "P + G + R = Velocidade", Preparo leve 0, média 1, Golpe 1):
     Punhos 0 / 1 / 4 (Velocidade 5), Chutes 1 / 1 / **4** (Velocidade 6). É a correção da dúvida 13 A, anotada na
     D-065; o "R 3" do texto da D-057 e da D-065 é o erro de digitação que a nota explica.
   - Nenhum id sumiu: comparei os ids de `armas.json` antes e depois, e só `chutes` entrou.
2. **O texto (Cap. XIII, Luta desarmada).** As duas linhas da tabela, os parágrafos dos golpes, do Bloqueio, da lâmina
   contra o corpo (qualquer parte do corpo, a Esquiva não muda) e o das armas naturais. É curto, sem tabela de casos,
   como a D-065, item 4, pede. A remissão está em `defesas.md` (Bloqueio) e em `combate.md`:270, e o âncora
   `#luta-desarmada` existe no gerado. No dist: "Desarmado / Briga" 0; "Luta desarmada" no capítulo e no glossário.
3. **D-066.** Uma linha só, na Luta desarmada ("Quem tem armas naturais no corpo … ataca e se defende com elas, e quase
   sempre bloqueia a lâmina sem tomar o dano; o Mestre julga os casos…"), sem tabela. A linha do bestiário e a revisão
   dos golens estão na B14 (`docs/pendencias/B-bestiario.md`), como a decisão manda.
4. **Grid e mesa intactos (D-054).** `git diff --stat 2dc330a2~1 2dc330a2` sobre `src/lib/artes-grid*`,
   `src/lib/mesa-*`, `src/pages/mesa/`, `scripts/gen-grid-artes.mjs`, `src/lib/equip.ts`, `src/lib/combate-resumo.ts`
   e `src/data/condicoes.json`: vazio. `monsters.json`, `monsters-mesa.json` e `inimigos.json` **iguais byte a byte**
   ao commit anterior (`cmp`), e `gen-monsters --check` verde. O `CLASSE_OVERRIDE` dos dois golens em
   `gen-monsters.mjs` é o que mantém isso: sem ele, "Punhos" no nome os jogaria de "media" para "leve".
5. **N16 a N20.** Coerentes com o código que li: a mesa cai em `ARMA['desarmado']` com a mão vazia
   (`combate-resumo.ts`:66, :72), o `ficha-card.ts`:74 guarda "Desarmado" como reserva, o Bloqueio da mesa não soma
   Defesa de arma (`mesa-ficha.ts`:97), a lâmina contra o corpo e a escolha da arma não existem no Grid, e os golens
   (N20). **Exceção:** a frase da N17 "A ficha já faz isso" precisa esperar o conserto acima.
6. **Scripts:** `test-contrato.mjs` passou a esperar o nome "Punhos" na ficha vazia; `gen-lista-equip.mjs` pôs `chutes`
   na lista sem imagem; `test-portoes.mjs` perdeu a isenção do comentário "vazio por ora" da tabela de exceções de
   `gen-monsters.mjs`, que deixou de estar vazia.
7. **Travessão e vocabulário.** Nos dois commits, a contagem por arquivo é igual antes e depois, e nenhuma linha nova de
   texto tem travessão nem o nome antigo de Habilidade. As duas linhas acrescentadas que aparecem com travessão no
   diff são o `ARMAS_JSON` regerado do `combate-tempo-bench.html` (o travessão é das descrições antigas de outras
   armas) e a linha do `vazioRot` (abaixo).

## Observações

1. **"Mãos" dos Chutes: o livro diz 0, o dado diz 1.** A tabela do Cap. XIII (`armas-e-armaduras.md`) dá aos Chutes
   "Mãos 0"; `armas.json` tem `maos: 1`. O `1` é o que deixa os Chutes caberem no seletor da mão hábil e não serem lidos
   como arma de duas mãos (`maos === 2`), e o `0` é a verdade de jogo. Pela regra do repositório (o JSON é a fonte e o
   capítulo se corrige), a divergência pede uma escolha: ou a tabela diz o que o dado diz, ou o dado ganha um jeito de
   dizer "nenhuma mão" sem quebrar o seletor. Não é defeito de jogo hoje (ninguém lê o `maos` dos Chutes para outra
   coisa que não o 2 mãos); anoto para o Arquiteto decidir.
2. **O rótulo `[travessão] punhos (briga) [travessão]`** (`ficha-engine.ts`, `vazioRot`, a opção vazia da mão hábil) tem travessões. Eram do
   rótulo antigo (`[travessão] desarmado (briga) [travessão]`), e a linha foi reescrita sem tirá-los. A regra de escrita vale para texto
   de tela também, então eu tiraria: "(punhos, Briga)" ou "Punhos (Briga)", e "(mão livre)" na outra. Mesmo caso do
   `equipamentos.astro`:100 da 131: travessão herdado numa linha reescrita, que o portão não cobre.

## CLAREZA

Nada a acrescentar.
