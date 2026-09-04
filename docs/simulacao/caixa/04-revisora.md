# Rodada 04 · resposta da revisora

Sobre o commit `b0926b5`, lido no checkout dele mesmo (o aviso é o código).
Investigação da assimetria 1,178 nas células unissono. Nenhum arquivo de código
foi alterado; o trabalho foi diagnóstico.

## BLOQUEIA

nada.

O que foi conferido antes de escrever isso:

- **localização da causa nos arquivos:** a função `montarCena` em
  `scripts/sim/cena.mjs:146-185` atribui ordinais 0 até n-1 ao lado A e n até 2n-1
  ao lado B, como o aviso documenta. `iniciativaDaPeca` em `elenco.mjs:130-135` gera
  iniciativa como função monotônica de ordinal, e `ordemDaFila` em
  `src/lib/combate-tempo.ts:412-417` desempata por iniciativa; a cadeia de efeitos
  é completa e o diagnóstico está correto.
- **presença em ambas as frentes:** o relatório afirma que a mesa compartilha
  `montarCena` e portanto sofre a assimetria também. Confirmado em
  `src/lib/mesa-*.ts` (importação e chamada).
- **testagem da hipótese:** o aviso testou três formas (ordinais iguais, intercalação,
  nomes simétricos) e documentou que nenhuma elimina a assimetria completamente,
  sugerindo múltiplos fatores. O índice 1,10 é mensurável e o teste é válido.

## CORRIGE

1. **A frase refutada ainda está em quatro lugares, conforme documentado na rodada
   03.** `docs/simulacao/09-bateria-grande.md` linhas 454-455 e 925 (§4 e D31 em
   contradição); `Pendencias.md` linha 1344; `scripts/sim/agregar.mjs` linha 496
   (comentário). O aviso decide não corrigir enquanto a decisão de design estiver
   aberta (D41). Essa contingência está correta: as quatro menções ficam válidas se
   houver aceitação da assimetria, e viram erradas se houver correção. **Conserto:**
   tacar elas todas numa nota baixa em cada arquivo (o padrão é `⚠ PENDENTE D41`),
   marcando a dependência, para que qualquer leitura futura as encontre com um grep.

## PERGUNTA

- **A assimetria 1,178 vale a correção coordenada entre harness e mesa?** O aviso
  documenta que o custo é acoplamento entre cena.mjs e mesa-*.ts, e o design é
  escolha do humano. A assimetria está presente em ambos os lados (não é artefato de
  harness só), mede ~10% em simulação de massa, e o teste prova que as três formas
  de ordinais simétricos a reduzem mas não eliminam. Qual é a decisão?

## ESCALA

nada.

A decisão D41 é do humano; nenhuma dúvida técnica a bloqueia. O trabalho de
investigação foi completo, o diagnóstico está verificado, e a resposta à pergunta é
design puro.

## VEREDITO

ESPERA-O-HUMANO.

A investigação foi bem feita, os números saem da simulação e a cadeia de código está
descrita com precisão. Não há achados que impeçam publicar o diagnóstico. A rodada 05
depende da decisão sobre D41: se houver correção, ela vira parte do commit de D41; se
houver aceitação, as referências que ficam pendentes viram referência histórica. Ambos
os caminhos estão documentados. Não há parada técnica.
