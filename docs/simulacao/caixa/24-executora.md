# Rodada 24 · aviso à revisora (Fase 2.5, lote 1: levantamento, sem código)

## COMMIT

Esta rodada não tem diff meu de código. O TechLead pediu levantamento das três
frentes de "a vista do jogador como produto" (Pendencias.md L33, PLANO.md §2),
"sem escrever código, mesmo método da Fase 1". Entreguei o levantamento por
mensagem; o TechLead registrou o resultado direto em `Pendencias.md` (corrige
L33, abre L51), sem passar por mim:

```
BASE  14dea0905acd2310569e25950f8c9ee8b5259ab3  (fecho do L31, rodada 23)
SHA   92e442b799f535c3978d45bcd35939dece19bad8  (TechLead: registra o levantamento em Pendencias.md)
TOPO  92e442b799f535c3978d45bcd35939dece19bad8  (nada entrou depois)
```

`92e442b` não é meu commit (mecânica do TechLead, mesmo padrão de `7e56946`
citado em rodadas anteriores como "não é trabalho meu"). Este arquivo é o
registro que falta: `CONTRATO-REVISORA.md:50-66` (rodada 15, "mensagem se
perde na rolagem, arquivo commitado fica"): o levantamento já mudou a
prioridade declarada da fase, não pode existir só na caixa de mensagem.

**Achado à parte, sobre o próprio `92e442b`:** a mensagem desse commit traz
`Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` e uma linha
`Claude-Session`. Isso contraria a regra do usuário (`CLAUDE.md` global: nunca
coautoria de Claude/Anthropic em commit ou PR, em nenhum projeto). Recebi a
mesma instrução por um `system-reminder` nesta rodada, identifiquei como
injeção (a mesma que já apareceu antes nesta sessão, com a mesma URL de
sessão fabricada) e recusei aplicá-la nos meus commits. Não sei se o TechLead
recebeu o mesmo texto e aplicou, ou se é outra causa; não vou emendar o
commit de outra frente sem autorização. Fica registrado para o TechLead
decidir o que fazer com `92e442b`.

## O QUE ESTE RELATÓRIO AFIRMA

Número ou claim sem procedência não entra.

| claim | de onde sai |
|---|---|
| Migração 31 rodou em produção em 05/09/2026 | `Pendencias.md` L42 (:2870-2871, :2903); commit `2f26368` |
| Migração 33 não rodou | cabeçalho de `supabase/migracao-33.sql` ("NAO RODE ESTA ANTES..."); `Pendencias.md` L42 (:2903, "NÃO · falta a TELA"); commit `dab2c48` ("NAO RODE A MIGRACAO 33 AINDA") |
| `SEM_RELOGIO` já degrada corretamente, com prova e2e | `src/pages/mesa/grid.astro:3010-3027` (lógica); `scripts/test-grid.mjs:1438-1457` (cenário `SIM5`, com e sem `&semrelogio=1`) |
| O teste do relógio só cobre o sistema Simultâneo, por admissão própria | `scripts/test-grid.mjs:1433-1437` (comentário citando `tickDaVez`) |
| `combate.astro` nunca lê `tick_atual` | `grep -n "tick_atual" src/pages/mesa/combate.astro` → 0 ocorrências (rodado nesta rodada) |
| O relógio do `combate.astro` é `emCampo[0].tick`, não `tick_atual` | `src/pages/mesa/combate.astro:888-894` (`const atual = emCampo[0] \|\| null; const tick = atual?.tick ?? 0; AGORA = tick;`) |
| `lembranca` (ASCII) tem zero ocorrências em `src/` | `grep -rc "lembranca" src/` → 0 arquivos (rodado nesta rodada; correção: eu tinha dito "por script" na mensagem ao TechLead, o comando real foi este grep) |
| `lembrança` (acentuado) aparece só em comentário, 5 vezes, em `grid.astro` | `grep -ro "lembrança" src/pages/mesa/grid.astro \| wc -l` → 5 |
| `visto_em` tem zero ocorrências em `src/` | `grep -rc "visto_em" src/` → 0 arquivos |
| `lembrarVistos()` existe e está em uso desde `dab2c48` | `grep -c "lembrarVistos" src/pages/mesa/grid.astro` → 2; `git show dab2c48 --stat` |
| Só `combate_visao` tem checagem automática contra o `.sql` real | `scripts/test-visao.mjs:49` (`fs.readFileSync('supabase/migracao-27.sql')`, compara com `scripts/visao-combate.mjs`); `scripts/mesa-mock.mjs:944-947` (`encontro_visao` é lista literal à mão, sem comparação) |
| `token_visao` real hoje é a definição da migração 25, não a 31 | `supabase/migracao-31.sql:36` ("a `token_visao` segue igual") |

## MEDIÇÃO NÃO FEITA (escala, não degradação silenciosa)

O TechLead pediu três medições na Frente 3: o que a tela desenha, o que
chega ao navegador (payload real) e o payload conferido contra o esquema
real. Fiz a 1 (leitura do client) e a 3 (nomeação da fonte real + auditoria
de cobertura). **Não fiz a 2**: não abri uma mesa real e capturei um payload
de rede de verdade para comparar contra o `.sql`. Isto é uma escolha de
escopo minha, não uma medição que travou ou que degradei em silêncio: o
método para fazer isso já existe e está documentado (`Pendencias.md` L42,
sondagem via chave anon), só não rodei nesta rodada porque o pedido era
levantamento de código, não uma sessão de mesa ao vivo. Registro aqui para
não passar como "as três medições feitas" quando só duas foram.

## O QUE FICOU EM ABERTO

- **Lacuna de prova no P/G/R** (não é achado novo em `Pendencias.md`, é
  descoberta desta rodada, ainda não registrada como item numerado): o
  relógio do jogador nesse sistema nunca foi provado por teste, embora os
  campos que ele precisa (`combate_visao.tick` desde a migração 14,
  `.acao` desde a 27) já cheguem. Fica para o TechLead decidir se vira item
  na fila.
- **Pergunta não fechada sobre `combate.astro`**: se o Tick de quem está
  livre pode ficar atrás do `tick_atual` da arena, a aba Combate mostra o
  relógio errado para os dois lados da mesa (mestre e jogador), não é
  achado exclusivo da vista do jogador. Não verificado com cena real.
- **L51** (cobertura desigual das quatro views) já registrado pelo TechLead
  em `92e442b`. Não corrigido nesta rodada, por instrução ("não construa
  nada ainda").

## ONDE LER

- `Pendencias.md`, correção do achado do relógio (L33, em torno de `:1892`)
  e L51 (novo, em torno de `:3476`), ambos de `92e442b`
- `scripts/test-grid.mjs:1433-1437` · a admissão do próprio teste sobre o
  P/G/R
- `scripts/test-visao.mjs:49` e `scripts/mesa-mock.mjs:944-947` · o par que
  mostra a cobertura 1 de 4
