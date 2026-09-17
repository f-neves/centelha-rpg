# Progresso · execução das 11 decisões do dossiê de 16/09/2026

Lote: M-21h, M-17, M-20, M-23, M-36, M-38, M-16, M-34, M-35, M-40, M-44.
Origem das decisões: `docs/simulacao/caixa/jogador-novo-decisoes.md`, seção "As 19 do dossiê ·
sessão de conversa em 16/09/2026" (commit `2e4f064`).

**Nota sobre os carimbos abaixo:** os horários até "commits" foram escritos de cabeça, sem
consultar o relógio a cada linha, e saíram uns 30min adiantados do relógio real da máquina (achado
pelo Arquiteto, conferindo o mtime do arquivo contra o `git log`). Corrigidos aqui pelos horários
reais dos commits (`git log --date=format:"%H:%M:%S"`); as linhas daqui em diante usam o relógio
consultado na hora (`date`).

- 2026-09-17 11:18 (relógio de cabeça, impreciso) · início do lote.
- 2026-09-17 11:33 · commit `e4fe156`, M-16/M-17 (capítulo de Secundárias + verbete de Acerto Arcano, gerador rodado).
- 2026-09-17 11:33 · commit `f76b00f`, M-34/M-40/M-44 (regras.json: nível×5, exceção do Quebrar Guarda no teto, nota do portão de Centelha em xp.tecnica).
- 2026-09-17 11:34 · commit `976afa8`, M-36 (relacoes-sociais.md, exemplo do Lírio soma 3, não 4).
- 2026-09-17 11:35 · commit `743cdb1`, M-35. Redesenho completo: Dano virou FIXO (1d6), Penalidade nova (1d6), Duração mantida (já era 6 Ticks/ponto). Achado no caminho: Dano fixo saía do `parametrosAjustaveis` e zerava o dano computado no diálogo de conjurar (`artes-grid-ui.ts`); corrigido `dadosDeDano` (`artes-grid.ts`) para ler dado fixo do `valor`, e `planoAtual` para achar o Dano fixo fora da lista ajustável. Teste `test-artes-grid.mjs` atualizado e verde. Efeito colateral: a edição deslocou linhas citadas por `test-procedencia.mjs` (Pendencias.md:2742, VOZ.md:656/671) — reapontadas para as linhas corretas.
- 2026-09-17 11:35 · commit `83dcadd`, M-23/M-38 (a tabela de três eixos e as três subseções nomeadas do teste em grupo).
- 2026-09-17 11:36 · commit `2492336`, M-21h (confirmação da caixa da Vida no Reiniciar).
- 2026-09-17 11:38 · achado no fechamento: M-20 estava na lista dos 11 e tinha ficado de fora
  do trabalho. Implementado antes de fechar o lote: `aparenciaMod` (calc.ts) ganha o parâmetro
  `mascararCom`, e `aparencia-virtudes-vontade.md:16` ganha a mecânica de Compostura+Furtividade.
  validate + typecheck verdes, commit `903c99d`.
- 2026-09-17 11:41 · commit `4df5f5b`: todos os 11 marcados FEITO com sha em
  `jogador-novo-decisoes.md`, L102 aberto em Pendencias.md para a M-18. Push feito
  (`2e4f064..4df5f5b`).

## LOTE FECHADO

Os 11 itens (M-21h, M-17, M-20, M-23, M-36, M-38, M-16, M-34, M-35, M-40, M-44) estão feitos,
commitados e marcados na origem. M-18 ficou de fora por decisão do Arquiteto (regra nova de
verdade, tamanho de fase, não conserto pontual).
