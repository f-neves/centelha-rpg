# Rodada 99 · aviso de revisão · os consertos C que continuavam abertos

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `118402b` · o despacho da 99 |
| **SHA do trabalho** | `bed1e91` (os consertos) e `64559c1` (o relato, as marcas e o `Pendencias.md` §2) · a faixa é `118402b..64559c1` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

Fora da faixa, e dentro do intervalo: `8244e9e` (o seu veredito da 98) e `c67c320` (a leitura de
novata 2, um arquivo de registro meu). O `bed1e91` nasceu `ef4271c` e foi reaplicado por cima do
`8244e9e`; o relato diz que o conteúdo é o mesmo.

**O §6 e o §7 do seu contrato valem nesta rodada:** progresso em `progresso-revisora-99.md` a cada
etapa, com o sha da reancoragem na primeira linha; e o push do veredito (`push origin HEAD:main`)
faz parte do fechamento, com aviso em vez de força se não for fast-forward.

## O que esta faixa faz

Sete consertos de texto e de página: C-22 (a iniciativa social sem "Tick 0"), C-39 (`[object
Object]` em `/artes/regras`), C-61 ("Esp." com legenda), C-23 (o Valor Passivo ganha a Centelha no
capítulo), C-102 (a contagem do bestiário sai do dado no build), C-103 (o resumo da Horda) e C-104
(um comentário no `conversao-monstros.html`). C-12, C-47 e C-85 só medidos.

**O CI, lido por mim, run inteiro:** `bed1e91`, run `35947739019`, `success`; `64559c1`, run
`35947870508`, `success`. O deploy do `bed1e91` foi `cancelled` (substituído pelo do `64559c1`,
que é `success`).

## O que eu mais quero que você aperte

- **C-23, "o dado e o motor concordam":** confira `valorPassivo` em `calc.ts` e o glossário contra
  as duas frases novas. E a tabela de `acoes-sentidos-e-engano.md` que "não mudou porque os vigias
  são gente sem Centelha": isso está escrito na tabela, ou é suposição dela?
- **C-102, 101 e não 100:** a contagem nova conta o mesmo que a frase afirma (criaturas com fraqueza
  ou resistência preenchida), ou conta outra coisa que só por acaso dá perto?
- **C-22:** o texto novo não cita o contrapé no social, e a Executora diz que citá-lo seria regra
  nova. Concorda? Uma segunda leitura do mesmo trecho é PERGUNTA para mim, não CORRIGE.
- **As marcas:** cada C fechado tem o sha ao lado, e o `Pendencias.md` §2 ficou coerente com o
  tema? O §6 (a trilha de EXECUÇÃO, que é minha) ficou citando os C já fechados; isso é meu e
  não entra no veredito.
- Travessão, lendo os arquivos.

Veredito em `docs/simulacao/caixa/99-revisora.md`, commitado e empurrado. Me diga o sha.
