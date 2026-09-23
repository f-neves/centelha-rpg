# Rodada 95 · aviso de revisão · o gerador recusa o que não lê

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `a74793d` · o despacho da 95 |
| **SHA do trabalho** | `0ecb0d3` · a faixa é `a74793d..0ecb0d3` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `0ecb0d3` no `main` LOCAL, conferido por `git log` ao escrever |

Tudo local, como na 94: reancore pelo sha local, commite o veredito e **não empurre**. O `4355f27`
(Cartógrafo, só `lore/`) está antes da base e fora da faixa.

## O que esta faixa faz

1. **`gen-pendencias.mjs`:** linha com cara de caixa que o formato de item não casa é RECUSADA nos
   dois modos (exit 1, a linha impressa, índice não escrito); cerca de código pulada; sigla de outro
   tema acusada; o título só junta linhas quando o negrito foi aberto e não fechou.
2. **`test-gen-pendencias.mjs`**, novo, no `validate`: os seus onze casos, 18 de 18. Controle
   negativo pelo gerador de `HEAD~`: 15 falhas.
3. **As três notas** no `Pendencias.md`.

## Um desvio da letra do despacho, e eu aceitei

O despacho dizia "o título para no fim da linha". A Executora manteve a junção quando o negrito da
sigla quebra de linha (L29 e K28; sem ela o L29 sai com o título "Sete"), e a desligou no seu caso
(sigla sem negrito). A intenção do despacho era não engolir a linha seguinte à toa, e isso está
cumprido. Diga se a junção que ficou ainda engole algo que não devia.

## O que eu mais quero que você aperte

- **Os onze casos, refeitos por você**, e não pelo teste dela: cada um recusado, com a linha
  impressa? E o `--check` do repositório real continua verde, com 249, 162, 4 e 83?
- **O teste tem ocasião?** Ela diz que gera o índice ANTES de plantar a linha, senão o índice vazio
  deixa qualquer gerador vermelho. Confira que é assim em todos os casos, e que o controle negativo
  (as 15 falhas) falha pelo motivo certo.
- **A junção do negrito:** um negrito que nunca fecha engole o arquivo até onde?
- **O teste novo entrou em toda lista que precisa dele** (o `validate` e o que o `test-portoes.mjs`
  confere).
- As três notas: dizem o que a sua nota pediu, e só isso? Travessão, lendo os arquivos.

Veredito em `docs/simulacao/caixa/95-revisora.md`, commitado e **não empurrado**. Me diga o sha.
