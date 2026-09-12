# Progresso · rodada 48 (fecha o L79: exceção de ficção no portão de travessão)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA, no instante em que
ela fecha, hora lida da máquina (`date +%H:%M`).

- 21:50 (sha 2cac904, 0 à frente/atrás de `origin/main`): começando. Item único:
  a exceção de ficção (linha que COMEÇA com travessão, incluindo depois de `> ` e
  de espaço de indentação) em `scripts/test-travessao-capitulos.mjs`. Controle
  obrigatório: capítulo temporário fabricado com diálogo de verdade, exigir verde;
  tirar a exceção, exigir vermelho no mesmo arquivo; apagar o temporário depois.
  Cuidado explícito do Arquiteto: a exceção não pode confundir travessão (`—`) com
  hífen de item de lista (`-`), e se a fronteira ficar ambígua em algum caso real
  dos 13 capítulos, parar e trazer antes de decidir sozinha.
- 21:52 · EXCEÇÃO ESCRITA em `scripts/test-travessao-capitulos.mjs`: `FALA =
  /^\s*(?:>\s*)*—/`, testada contra o próprio caractere (nunca hífen) com oito
  casos sintéticos em Node antes de rodar contra o repositório (todos batendo:
  fala direta, indentada, citada, citada aninhada, item de lista comum, item de
  lista COM travessão no meio, frase comum com aparte, hífen duplo). Ela exime a
  LINHA INTEIRA, não só a abertura, porque um inciso do narrador no meio da fala
  usa a mesma convenção.

  CONFERIDA A FRONTEIRA NOS 13 CAPÍTULOS DE VERDADE: nenhuma linha bate com a
  exceção hoje (script dedicado rodando `FALA.test` linha a linha nos 13
  arquivos, zero achados), então não há ambiguidade real para trazer.

  CONTROLE (fabricado, porque não há caso real): criei
  `src/content/chapters/_teste-fala-l79.md` com diálogo de verdade (fala direta,
  fala citada com `> `, fala indentada, inciso do narrador no meio, e um item de
  lista comum começando com hífen para testar a fronteira). Com a exceção ligada:
  verde. Copiei o script, desliguei só a linha da isenção de fala, rodei de novo
  contra o mesmo arquivo: vermelho, 3 travessões acusados, exatamente as 3 linhas
  de fala (o item de lista não acendeu em nenhum dos dois casos, porque nunca
  teve travessão). Apaguei o arquivo fabricado e o script temporário depois.
  `npm run validate` completo: verde, saída 0.

