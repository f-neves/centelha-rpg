# Progresso · execução das 11 decisões do dossiê de 16/09/2026

Lote: M-21h, M-17, M-20, M-23, M-36, M-38, M-16, M-34, M-35, M-40, M-44.
Origem das decisões: `docs/simulacao/caixa/jogador-novo-decisoes.md`, seção "As 19 do dossiê ·
sessão de conversa em 16/09/2026" (commit `2e4f064`).

- 2026-09-17 11:18 · início do lote.
- 2026-09-17 11:30 · M-17 e M-16 feitos (capítulo de Secundárias + verbete de Acerto Arcano, gerador rodado).
- 2026-09-17 11:35 · M-34, M-40, M-44 feitos (regras.json: nível×5, exceção do Quebrar Guarda no teto, nota do portão de Centelha em xp.tecnica).
- 2026-09-17 11:40 · M-36 feito (relacoes-sociais.md, exemplo do Lírio soma 3, não 4).
- 2026-09-17 11:58 · M-35 feito. Redesenho completo: Dano virou FIXO (1d6), Penalidade nova (1d6), Duração mantida (já era 6 Ticks/ponto). Achado no caminho: Dano fixo saía do `parametrosAjustaveis` e zerava o dano computado no diálogo de conjurar (`artes-grid-ui.ts`); corrigido `dadosDeDano` (`artes-grid.ts`) para ler dado fixo do `valor`, e `planoAtual` para achar o Dano fixo fora da lista ajustável. Teste `test-artes-grid.mjs` atualizado e verde. Efeito colateral: a edição deslocou linhas citadas por `test-procedencia.mjs` (Pendencias.md:2742, VOZ.md:656/671) — reapontadas para as linhas corretas.
- 2026-09-17 12:00 · validate + astro sync + tsc --noEmit verdes.
- 2026-09-17 12:05 · commits de M-16/M-17, M-34/M-40/M-44, M-36, M-35 (com o fix de motor e as
  citações reapontadas), M-23/M-38, M-21h.
- 2026-09-17 12:10 · achado no fechamento: M-20 estava na lista dos 11 e tinha ficado de fora
  do trabalho. Implementado antes de fechar o lote: `aparenciaMod` (calc.ts) ganha o parâmetro
  `mascararCom`, e `aparencia-virtudes-vontade.md:16` ganha a mecânica de Compostura+Furtividade.
  validate + typecheck verdes, commit `903c99d`.
- 2026-09-17 12:15 · todos os 11 marcados FEITO com sha em `jogador-novo-decisoes.md`.

## LOTE FECHADO

Os 11 itens (M-21h, M-17, M-20, M-23, M-36, M-38, M-16, M-34, M-35, M-40, M-44) estão feitos,
commitados e marcados na origem. M-18 ficou de fora por decisão do Arquiteto (regra nova de
verdade, tamanho de fase, não conserto pontual).
