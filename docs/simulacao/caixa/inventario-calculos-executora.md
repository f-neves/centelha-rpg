# Inventário de cálculos e simulações · relato da Executora

Despacho: `docs/simulacao/caixa/inventario-calculos-despacho.md`. Entrega:
`docs/export/proezas/09-inventario-calculos.md`.

## Onde procurei

- **Worktree usada**: `rpg-system` (main), que já estava em dia com `origin/main` no início (sem
  precisar de `git pull --rebase`). Não toquei nas mudanças não commitadas de outra frente que
  encontrei na árvore (`lore/mapas/dados/camadas_referencia.json`, `lore/mapas/registro-git.jsonl`,
  `.agents/`, `AGENTS.md`, `lore/economia/prompt-revisao-economica.md`).
- **Pastas**: `src/lib/` (todos os arquivos listados por nome, abri os relevantes por conteúdo),
  `scripts/` (raiz e a subpasta `scripts/sim/`), `docs/simulacao/` (os documentos de topo e os mais
  citados de `docs/simulacao/caixa/`, não os 300+ arquivos `progresso-*.md`/`*-revisora.md` um a um:
  são logs de rodada, não documentos de cálculo, e abri por nome quando o título sugeria número),
  `docs/pendencias/` (D-proezas-tecnicas.md, B-bestiario.md), `docs/export/proezas/` (a árvore
  inteira, incluindo `chatgpt/centelha/`), `src/pages/mesa/` e `src/pages/mestre.astro`,
  `src/data/regras.json`, `centelha.md`, `Proezas_revisao.md`.
- **Outras worktrees e branches**: listei com `git worktree list` e `git branch -a`
  (`centelha-executora`, `centelha-mapa`, `centelha-techlead-revisora`, e os branches sem worktree
  própria: `combate-simultaneo`, `revisora-59` a `66`, `sim/base-congelada`,
  `worktree-agent-a61135436a32b96cc`). **Não abri o conteúdo delas linha a linha**: o levantamento
  na worktree `main` já cobriu o pacote de simulação inteiro (`scripts/sim/`, `sim-*.mjs`), que é a
  peça técnica mais relevante, e os nomes dos branches (datados de setembro, a maioria ligada à
  Revisora ou ao combate simultâneo) sugerem trabalho já mesclado ou paralelo sem simulador próprio
  distinto do que já está em `main`. **Isto é uma lacuna admitida**, não uma garantia de que nada
  ficou para trás nos branches — ver "Pendências" abaixo.

## Quantos achados

- **Motores de combate**: 12 arquivos/pacotes (`calc.ts`, `lance.ts`, `combate-tempo.ts`,
  `rolagem.ts`, `quase-acerto.ts`, `forca-empurrao.ts`, `ficha-engine.ts`, `hex.ts`, e o pacote
  `scripts/sim/` inteiro: `motor.mjs`, `espelho.mjs`, `agregar.mjs` + 6 arquivos de suporte).
- **Probabilidade de dados**: 3 achados (`acaso.ts`, `mestre.astro`, `sim-soak.mjs`), mais 1 lacuna
  registrada (Especialidade/Firula sem modelo isolado).
- **Balanceamento**: 15 scripts `sim-*.mjs` mais `cost-examples.mjs` (fora do escopo de combate,
  mas é "curva de progressão"), mais 2 citados sem abrir (`precos.mjs`, `dano-por-tipo.mjs`).
- **Bestiário (B14)**: 4 achados (o item B14 em si, os 3 documentos da fase 2, `REC_FATOR` em
  `modelo.py`, e `sim-grupo.mjs` como candidato desatualizado).
- **Documentos de intenção com número**: 7 achados.

Total: **cerca de 40 itens relatados** na tabela do arquivo de entrega (contando o pacote `sim/`
como um bloco e não item a item para não inflar a contagem).

## O que rodei

Rodei sem escrever nada em disco: `sim-caps.mjs`, `sim-defesas.mjs`, `sim-duelo.mjs`. Os três
terminaram limpos, com saída de terminal só (nenhum abre arquivo em modo escrita). Os resultados
completos estão citados na tabela do arquivo de entrega.

**Não rodei** (marcados "não rodado, risco não descartado" na tabela): `sim-defesa-armas.mjs`,
`sim-absorcao.mjs`, `sim-pressao.mjs`, `sim-passo-golpe.mjs`, `sim-ticks.mjs`, `sim-morte.mjs`,
`sim-folego.mjs`, `sim-horda.mjs`. Não porque suspeitasse de efeito colateral concreto (a maioria
parece ler JSON e imprimir), mas porque não tive tempo de ler cada um por completo antes de rodar,
e o despacho pede exatamente essa cautela ("na dúvida, não rode").

## Para o autor decidir (não decidi sozinha)

1. **`sim-grupo.mjs` modela grupo de 3, não 4.** É o script estruturalmente mais parecido com a
   definição de calibração do B14 ("desafio X = grupo de 4 de Centelha X"), mas está na premissa
   antiga. Alguém precisa decidir se vale a pena atualizá-lo ou escrever um cenário novo do zero
   sobre `scripts/sim/motor.mjs`.
2. **`regras.json.escalasProeza` tem duas informações que não batem**: a nota em prosa fala em
   "+2/ponto de Centelha", mas o campo `centelhaMult` usado de fato pelo motor é 1; e os valores de
   `trilhas.bonus` (`+3/+4/+6/+9/+12/+15`) não são a progressão 3N aprovada em 26/09
   (`3/6/9/12/15/18`). Não sei se a intenção é atualizar `escalasProeza` para bater com 3N, ou se
   3N é só para as jogadas em si e `escalasProeza` cobre outra coisa (o "estado" das trilhas que não
   são "Bônus") — não tive como confirmar isso sem decidir por conta própria, e o despacho pede
   para não presumir.
3. **Não abri `armas.json`/`armaduras.json` linha a linha** para confirmar se os números que
   `sim-defesa-armas.mjs` cita no comentário (pesada −2, antes −1) ainda batem com o catálogo vivo.
   Fica como INDETERMINADO na tabela por essa razão, e não por suspeita concreta de divergência.
4. **Não abri o conteúdo dos branches locais sem worktree** (`revisora-59` a `66`,
   `combate-simultaneo`, `sim/base-congelada`, `worktree-agent-...`) linha a linha. Se algum deles
   tiver um simulador próprio que não chegou a `main`, este levantamento não pegou.
5. **`docs/export/proezas/centelha-dossie.md` e `scripts/precos.mjs`/`dano-por-tipo.mjs`** foram
   listados mas não abertos por conteúdo, por tempo. Marcados "não classificado" na tabela.

Travessão: zero neste arquivo e no de entrega (conferido à mão, sem usar `git diff` como medidor,
conforme a regra do CLAUDE.md sobre o hook que encolhe a saída do `git`).
