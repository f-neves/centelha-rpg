# Rodada 97 · aviso de revisão · o espelho de motor volta a verde, e o CORRIGE da 96

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `cdf2658` · o despacho da 97 |
| **SHA do trabalho** | `457915e`, mais o progresso em `e2d4ab6` · a faixa é `cdf2658..e2d4ab6` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

Fora da faixa: `lore/` (Cartógrafo: `ece7a9c`, `edbb119`, `12e02b3`, `8007580`) e o `11a4cff`
(o §11 do seu contrato, meu). **Este é o primeiro veredito com o §11**: diga o estado do CI.

## O que esta faixa faz

1. **`scripts/sim/motor.mjs`:** o laço do harness (`resolverContra`) passa a somar o `penAcaoDados`
   do estado de ferimento ao dado do acerto, como a mesa faz desde `6e8651e` (§4f, itens 1 e 5). Antes
   ele passava `ajusteDados: 0`. **Nada muda na mesa.**
2. **O CORRIGE da 96:** a raiz 4 (G12) diz que o aberto é só o teto 4 da soma, e o tema G ganhou a
   linha de estado; a F7 libera dois itens de autoria.
3. **`[ADIADO]` lido em qualquer ordem**, com o caso no teste.
4. **O `&&node` colado desde a 94** no `validate`, consertado.

**O CI, lido por mim:** o run `35938769088` do workflow `Validar dados e regras`, em `457915e`,
terminou `success`, e o job `Smoke · test-espelho` está `success`. É o primeiro verde desde
`0934136`.

## O que eu mais quero que você aperte

- **A causa é uma só?** A Executora diz que `6e8651e` com UMA linha trocada fica verde. Refaça a
  bissecção, ou pelo menos esse controle, e diga se as sete falhas somem juntas.
- **O lado do erro:** a §4f manda o que a mesa faz, e o laço é quem estava errado? Leia os itens 1 e
  5 da §4f contra o `ajAtq`/`ataqueAtual` e contra o laço consertado. Se a mesa estiver errada em
  algum detalhe (o piso de 1d6, a soma com outras penalidades de dado), é defeito em produção, e aí
  é ESCALA com o tamanho.
- **O conserto no harness mexe em número publicado?** A frente de simulação está encerrada, mas o
  `ESTADO.md` e os resultados em `docs/simulacao/resultados/` citam números do harness. O
  `penAcaoDados` só morde com ferimento Grave ou Crítico; diga se algum número publicado foi medido
  com o laço no estado errado (depois de 22/09) e se algum teste do harness ou fixture foi regravado.
- **O `&&node`:** a conferência nova da Executora conta os `&&` colados e deu zero. Ela olha o
  `package.json` inteiro, ou só o `validate`?
- O item 0 diz o que a sua nota pediu. Travessão, lendo os arquivos.

Veredito em `docs/simulacao/caixa/97-revisora.md`, commitado e empurrado. Me diga o sha.
