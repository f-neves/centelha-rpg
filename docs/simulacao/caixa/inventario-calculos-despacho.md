# Inventário de cálculos e simulações existentes · despacho

Liberado pelo humano em 27/09/2026. Levantamento **só de leitura**: mapear o que já existe no
repositório para embasar a calibração das Proezas, sem refazer trabalho e sem mexer em código
nem em dados. Texto do autor, colado sem edição:

## O pedido, verbatim

> Levantamento, somente leitura: cálculos e simulações que já existem no projeto. Objetivo:
> embasar a calibração das Proezas (valor de cada "alavanca" de regra em poder de combate) sem
> refazer o que já foi feito.
>
> Procure em todo o repositório (todas as worktrees e ramos locais, docs/, lore/, scripts/,
> src/lib/, a pasta do Grid, docs/simulacao/, docs/pendencias/, Proezas_revisao.md e similares)
> por:
> 1. Simuladores ou motores de combate: resolução de ataque contra Defesa, Margens, dano,
>    Absorção por tipo, Ticks (preparação e recuperação), ferimentos, duelo até o fim. Inclua o
>    motor do Grid e o da ficha (ficha-engine, calc.ts).
> 2. Scripts ou tabelas de probabilidade dos dados: pools de d6, soma e paridade, Especialidade
>    (dados extras descartando os menores), Firula, chance contra Dificuldade, disputas.
> 3. Análises de balanceamento: comparação de armas, armaduras, Absorção, Ticks, Proezas, Artes,
>    custo de XP, curvas de progressão, personagens de referência por Centelha.
> 4. Calibração do bestiário: o que a frente B14 (fase 2) calculou para "desafio X = grupo de 4
>    de Centelha X", incluindo fichas de grupo de referência e encontros simulados.
> 5. Qualquer documento que registre intenção de design com número: duração de combate, chance
>    de acerto entre iguais, quanto vale um nível de Centelha.
>
> Para cada achado, relate:
> - caminho e linha, tipo (código, planilha, markdown, JSON), data do último commit;
> - o que calcula, com entradas e saídas;
> - a versão das regras que usa: confira contra o regras.json atual e as decisões recentes (3N
>   nas Proezas, grupo de referência 4, +1 por Centelha vigente) e marque ATUAL, DESATUALIZADO
>   (o que mudou) ou INDETERMINADO;
> - se roda hoje: rode o que for script rápido e sem efeitos colaterais, e anote o resultado ou
>   o erro. Não altere nada;
> - se serve de bancada para medir alavancas (sim, sim com ajustes, não) e por quê.
>
> Entrega: um arquivo docs/export/proezas/09-inventario-calculos.md com a tabela acima e, no
> fim, uma recomendação: qual peça existente deve ser a base do simulador de calibração e o que
> falta nela. Não mexa em código nem em dados. Commit só desse arquivo, por pathspec.

## Conferência prévia (Arquiteto, antes de despachar)

Não pré-verifiquei cada achado (é o próprio levantamento), só as três âncoras que a Executora
vai usar para julgar ATUAL/DESATUALIZADO:

- **"3N nas Proezas"**: decisão registrada nesta mesma sessão (26/09/2026), presente em
  `docs/export/proezas/chatgpt/05-decisoes-da-regua.md`, `01-regua.md` e
  `decisoes-entendimento.md` (e as cópias em `docs/export/proezas/chatgpt/centelha/`, idênticas).
- **"grupo de referência 4" e "desafio X = grupo de 4 de Centelha X"**: da frente B14 fase 2,
  documentada em `docs/simulacao/caixa/b14-fase2-despacho.md` e `b14-fase2-executora.md`, e
  citada em `docs/pendencias/B-bestiario.md`.
- **"+1 por Centelha vigente"**: cuidado aqui — há uma pendência ABERTA sobre isso, a **D7**
  (`docs/pendencias/D-proezas-tecnicas.md`): `centelha.md` diz "+1 por ponto de Centelha" no
  ataque e nas Defesas, mas `regras.json` (nota de `escalasProeza`) diz "+2/ponto". Ainda não
  decidido qual vale. Trate isso como parte do próprio levantamento: qualquer cálculo achado
  que dependa desse número deve citar QUAL dos dois usa, sem presumir que um dos dois é o
  "vigente".

## Atenção especial da Executora

- **Só leitura, em qualquer sentido.** Não editar `src/`, `scripts/`, dados, nem os documentos
  achados. Rodar um script é permitido só se ele não escrever nada (nem em disco, nem em
  banco) — confira o script antes de rodar, e se tiver dúvida, não rode e anote como
  "não rodado, risco de efeito colateral" em vez de arriscar.
- **Todas as worktrees e ramos locais**: inclui `centelha-executora` (a sua própria árvore),
  `centelha-techlead-revisora`, `centelha-mapa`, e qualquer branch local que não seja `main`.
  Rode `git branch -a` e `git worktree list` para não esquecer nenhuma.
- **O escopo é achar e classificar, não julgar qual é "a certa"**: a pergunta final (base do
  simulador de calibração) é uma recomendação, não uma escolha de qual documento "vence" — isso
  fica para depois, com o autor.
- **Data do último commit**: use `git log -1 --format=%ad --date=short -- <caminho>` por
  arquivo, não a data de modificação do disco (pode divergir por rebase/checkout).
- **`regras.json` atual**: para julgar ATUAL/DESATUALIZADO, o ponto de comparação é o
  `src/data/regras.json` desta árvore, na revisão em que você estiver trabalhando (rebase antes
  de começar).
- Se dois achados forem, na prática, o mesmo motor citado duas vezes (ex.: `calc.ts` referenciado
  por um doc E lido diretamente por outro script), relate as duas entradas mas diga isso na
  recomendação final, para não inflar a tabela com duplicata.

## Verificação

- Não há `npm run validate`/build a rodar aqui (não há mudança de código/dados).
- Conferir que o commit final leva **só** `docs/export/proezas/09-inventario-calculos.md`, por
  pathspec (essa pasta está no `.gitignore`; use `git add -f` só nesse arquivo, como já foi
  feito na rodada anterior para `docs/export/proezas/chatgpt/centelha/`).
- Travessão: zero no arquivo novo.

## O relato

`docs/simulacao/caixa/inventario-calculos-executora.md`: lista de onde procurou (worktrees,
branches, pastas), quantos achados no total, e qualquer coisa que não deu para rodar/decidir
sozinha (leva para o autor, não decide por conta própria).
