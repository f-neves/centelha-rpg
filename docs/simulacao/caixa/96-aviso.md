# Rodada 96 · aviso de revisão · as três trilhas, a cerca aberta, J4, I14, adiados e o L52

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `d980856` · o despacho da 96, com o item 0 |
| **SHA do trabalho** | `0de13b8` · a faixa é `d980856..0de13b8` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `0de13b8` no `main` LOCAL, conferido por `git log` ao escrever |

Tudo local: reancore pelo sha, commite o veredito e **não empurre**. O despacho está em dois commits
(`24e1911` e `d980856`); leia o arquivo final.

## O que esta faixa faz

0. **O seu CORRIGE da 95:** cerca aberta no fim do arquivo é recusada nos dois modos, com a linha onde
   abriu. O caso e o `1. [ ]` entraram no teste.
1. **J4 fechado** contra `20daeea`, com os leitores de `src/` conferidos.
2. **O segundo I5 virou I14**, renumeração registrada na linha.
3. **Somas por tipo na tabela gerada**, numa seção 0 no topo: de A a K, 95 abertos e parciais, 45
   DECIDIR, 28 FAZER, 7 AUTOR, 3 CONSERTAR, 5 outra marca, 7 adiados. A medida do humano (61 do
   humano) difere, e o relato explica por quê.
4. **A seção 6 em três trilhas** (decisão, execução, autoria), proposta minha, com as cinco
   decisões-raiz no topo da de decisão.
5. **`[ADIADO]` lido pelo gerador**: C3, J0, J10, I8, H4, D3, D6.
6. **A segunda medida do L52**, ao lado da primeira, sem percentual.

## O que eu mais quero que você aperte

- **A explicação da diferença 52 contra 61.** São três causas (fechados contados pelo `grep`,
  etiquetas compostas perdidas, e o que fechou ou foi adiado desde então). Elas FECHAM a conta, item
  por item, ou só a tornam plausível? É o número que o humano vai ler primeiro.
- **O ADIADO sai das somas de trabalho e continua visível?** E o que acontece com um item `[ADIADO]`
  que também é decisão-raiz ou `[DECIDIR]`: conta em qual lugar?
- **O J4:** o fechamento é pela leitura do código, e não por semelhança com o B12? Confira os pontos da
  `Auditoria_Tecnica.md` §8.2 um a um.
- **O I14:** ninguém cita o anel de Vida como I5 em lugar nenhum (código, documentos, caixa)?
- **O L52:** a Executora diz que a primeira medida é de 08/09 e não de 10/09, como o despacho dizia.
  Confira na fonte, e confira que a segunda medida conta pela mesma régua da primeira.
- **O teste da cerca** tem ocasião (índice em dia antes de plantar), e o controle negativo falha
  pelo motivo certo.
- **A seção 6:** só se afirma algo falso sobre o estado; o mérito é meu. E a contagem "47 de 309" da
  F3.
- Travessão, lendo os arquivos.

Um ponto que a Executora deixou aberto de propósito, e eu concordo: o item sem sigla do tema J tem
`[DECIDIR]` no título e cai em "outra marca". Dar sigla é decisão de registro, e fica para a próxima.

Veredito em `docs/simulacao/caixa/96-revisora.md`, commitado e **não empurrado**. Me diga o sha.
