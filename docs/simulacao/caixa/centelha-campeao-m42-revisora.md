# Revisão: rebatize da Centelha (Campeão) e M-42 (orçamentos)

Reancoragem: `2054f9c` (com autorização explícita do Arquiteto, que já tinha conferido `git fetch`
+ `git log` antes de mandar o aviso; eu reancorei sozinha desta vez porque o worktree ainda estava
em `1ba51aa` quando o aviso chegou). Confirmado por `git rev-parse HEAD` e
`git rev-parse --show-toplevel`.

Base: `1ba51aa` (meu veredito anterior). Trabalho: `4ce6476..2054f9c` (três commits).

## `4ce6476` · degrau 4 da Centelha: "Grande herói" → "Campeão"

- `regras.json → escalaCentelha[4].rotulo` mudou para "Campeão".
- Varri `src/` inteiro por "Grande her[oó]i": zero ocorrências restantes fora do que o commit já
  mudou (as duas listas `TIER_NOME`, em `src/lib/data.ts` e `src/components/ArvoreTecnicas.astro`,
  a tabela e o texto narrativo de `centelha.md`, as duas citações em `criacao-de-personagem.md`).
- Um terceiro consumidor de `TIER_NOME` existe (`src/pages/caminhos/[id].astro`), mas importa a
  constante de `data.ts` em vez de ter cópia própria: já vem corrigido de graça.
- A linha de `arcano.astro` que ficou com "grande herói" minúsculo é prosa descritiva genérica
  ("conjura Artes tão fundas quanto as de um grande herói"), não citação do rótulo do degrau: certo
  não mexer.
- As exceções declaradas (citação histórica do M-42 em `jogador-novo-decisoes.md`, os três
  documentos de design pré-Reescala) são material superado por decisão anterior, não deste commit.

## `2520b5d` · M-42: orçamentos ganham nome próprio

- `regras.json`: `orcamentoPadrao/orcamentoVeterano/orcamentoHeroico` → `iniciante/veterano/
  especialista`, valores 1500/2000/2600 inalterados (conferido byte a byte no diff).
- Varri o repositório inteiro pelas três chaves antigas: zero ocorrências em `src/` ou `scripts/`.
  As que sobram (`jogador-novo-consertos.md`, `jogador-novo-decisoes.md`, `jogador-novo-fase2.md`,
  `Reescala.md`, `REVISAR.md`) são registro histórico ou decisão/documento anterior citando o nome
  de quando ele valia, não referência viva.
- `scripts/cost-examples.mjs` era o único leitor de código: rodei (`node scripts/cost-examples.mjs`)
  e ele executa limpo, com "orçamento 2000" etc. saindo certo para cada exemplo; as divergências
  que aparecem (Bram, Técnicas não conferíveis) são as mesmas já registradas em rodadas anteriores
  (M-02), não coisa nova deste commit.
- `criacao-de-personagem.md`: as três menções ao orçamento por nome e o cabeçalho do exemplo do
  Veil (agora "Especialista") acompanharam.
- Conferido que o glossário de fato não tinha verbete de orçamento antes (não é omissão nova).

## `2054f9c` · travessão nos próprios marcadores

Achado e corrigido pela própria Executora, sem esperar pergunta: quatro arquivos de
`docs/simulacao/caixa/` tinham travessão em linhas que ela mesma escreveu nesta sessão. Conferido
o diff inteiro: as trocas (vírgula, dois-pontos, ponto-e-vírgula) preservam o sentido de cada frase,
e o sha `<pendente>` do M-42 em `jogador-novo-decisoes.md` foi preenchido com `2520b5d`. Não mexeu
em travessão pré-existente de citação literal nem de célula de tabela, como a mensagem diz.

## Verificação

`npm run validate` rodado aqui: verde. `node scripts/cost-examples.mjs` rodado aqui: executa sem
erro, saída consistente com o esperado.

## Veredito

**PROCEDE.** Os dois itens (rebatize da Centelha, M-42) e a limpeza de travessão da própria
Executora estão corretos e completos contra o que o aviso descreveu. Não achei ocorrência
esquecida de "Grande herói" nem das três chaves antigas de orçamento em código, conteúdo publicado
ou script.
