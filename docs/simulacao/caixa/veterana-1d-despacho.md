# Veterana 1d · despacho das rodadas 1 a 3

Liberado pelo autor em 04/10/2026, para a Executora. **Uma rodada de cada vez: Executora, depois Revisora, com o
CI verde (Validar e Deploy, pelo código de saída) antes da próxima.** Avise o Arquiteto ao fim de cada rodada.
Relato em `docs/simulacao/caixa/veterana-1d-relato.md`, uma seção por rodada, com antes e depois, sha e CI.

## A fonte

`C:\Users\Neves\ClaudeCode\centelha\tmp\veterana\veterana-1d.md` (fora do repositório, só leitura; não copie o
arquivo para dentro da árvore). Leia o topo (CONFLITOS, a tabela "decisão → pontos de A"), a **Parte D** (o plano
de rodadas; cada rodada lista as páginas, os IDs e o que a Revisora confere) e, na **Parte A**, o ponto de cada ID
da rodada (procure por `#### <ID>.`). O texto de **(e) Correção final** é o que se aplica, palavra por palavra.
A Parte A foi conferida contra o site no deploy `319bf4b`; o texto das páginas não mudou depois (5c18b7d3 e 822be8b1
só mexem em documentação e `.gitignore`).

## O registro

As decisões estão em `docs/decisoes-partes/decisoes.md` (D-017 a D-033, e a tabela de ligação com D-001 a D-014).
**Antes de cada rodada**, confira as citações de (b) contra a FONTE (`src/content/chapters/*.md`, `src/data/*.json`),
não contra o site: o repositório mudou desde a leitura. O que já estiver resolvido, **pule e anote no relato**.
**Se um ponto contradisser uma decisão registrada, pare e avise o Arquiteto** (CLAUDE.md). Atenção a dois casos
conhecidos, já resolvidos pelo autor, que NÃO são motivo de parada:
- D-027 revisa A-004 e A-005 (o desconto do Antecedente passa a ser a metade do nível); vale a D-027 (rodada 1).
- D-017 substitui a D-015 (o teto 4 volta ao cortejo); isso é da rodada 6, não mexa agora.

**As decisões da Missão 1c** (numeradas "decisão N da 1c" no 1d) vieram da fala do autor e não estão no registro
com texto verbatim. Onde um ponto "aplica a decisão do 1c" (Longa a 3 por dado, Especialidade +2 por nível na Longa,
o Mestre escolhe o modo, Iniciativa sem Centelha, Acelerar 10% não vale abaixo de 0), aplique, mas **se o ponto
exigir mexer em CÓDIGO ou em número que um teste ou calculadora lê** (por exemplo, a média 3,5 da Longa em
`regras.json`, `calc.ts`, `test-*`), **pare, descreva o que lê e me avise antes de mudar o código**. Texto de capítulo
e JSON de descrição seguem sem pergunta.

## Regras da rodada

- Um commit por rodada (ou por página, se o gancho pedir), `git pull --rebase` antes de cada, pathspec, sem
  coautoria, sem travessão, "Habilidade" e nunca "Perícia". Commit que toca `src/` traz a linha "para quem joga hoje".
- Conferência comum da Parte D: depois do deploy, reler o gerado (`dist/`) e conferir que o texto de (e) está lá,
  buscar os termos antigos da rodada (nenhum pode sobrar), refazer os números com o script indicado (os scripts do
  1d estão em `tmp/veterana/scripts/`), conferir as referências cruzadas.
- O Resistir já está no ar (1 + Margem, teto 4, fora do limite de 1 ponto por ação): nenhuma rodada o reabre.
- Fora destas rodadas: NÃO aplique nada do CONFLITO·CORTEJO (é da rodada 6), nem os pontos B·RESISTIR-PROEZA,
  B·BRAM-TETO, B·REQUER-EXEMPLOS e B·a4-TECNICAS, que esperam o veterana-1e.
- Arquivos sem dono (`.agents/`, `AGENTS.md`, `.claude/commands/comerciante.md`, `inventario-limites.md`,
  `lore/economia/prompt-revisao-economica.md`): não toque.

## Rodada 1 · Atributos, Raças, Antecedentes (sem dependências)

Páginas: Cap. I (`coracao-do-sistema`, T2a e K1a), Cap. V (`centelha`), Cap. VI (`racas`), Cap. VII (`antecedentes`),
páginas de apoio. IDs: T2a, K1a, K9b, ATRIBUTO-PURO, ART-27, C14a, ANAO-PORTE, ELFO, RACIAL-7, K9c, ANTECEDENTE-6,
FE-VONTADE, K9h, K9i, K3a, K9j. Decisões: 31 (D-027), 32 (D-028), 33 (D-029). O RACIAL-7 item 5 fala do limite de
Atributo na `/ficha`: confira se o código já segue a raça (racas.json) e, se não segue, **pare e avise** antes de
mudar `ficha-engine.ts`. A Revisora confere o que a Parte D lista para a rodada 1.

## Rodada 2 · Cap. III, Cap. IV e Cura

Páginas: `aparencia-virtudes-vontade` (T4a, K9a, T1b), `vida-ferimentos-cura`, `acoes-resistir` (A·NOVO-a2-2, Veneno e
Doença), `combate` (a linha "Quem chega a 0 de Vida", em A·T1a). IDs: T4a, K9a, T1b, T1a, NOVO-a2-1, NOVO-a2-2,
NOVO-a2-3, K5a, T1c, ACELERA-10. Decisões: 2 (D-001), 14 (D-007), 15 (D-008), 16 (D-009). Confira se o Tratar é lido
por código ou calculadora (ficha, Grid, `calc.ts`) e relate. Bloqueia as rodadas 8 e 9.

## Rodada 3 · Cap. VIII, a régua comum e a Longa

Páginas: `acoes-e-sistema`, `coracao-do-sistema` (C1a), `combate` (ART-30), `artes/regras` (ARTE-LONGA). IDs: C1a,
LONGA-1, ESPECIALIDADE-LONGA, K9e, ART-30, ARTE-LONGA. Decisão: 19 (D-012). O site diz hoje "3,5 por dado"; o 1d
manda 3 por dado. **Antes de mudar**, procure quem lê a média da Longa (regras.json, `calc.ts`, calculadoras, testes,
Ofício e Serviços) e traga a lista ao Arquiteto; os tempos do Ofício e da economia refeitos são da rodada 7. Bloqueia
as rodadas 4, 7, 8 e 10.
