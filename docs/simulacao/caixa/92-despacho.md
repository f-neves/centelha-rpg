# Rodada 92 · despacho · o CORRIGE e as três notas da 91

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 23/09/2026
>
> A rodada 91 fechou com **PROCEDE** (`12fb0be`, veredito em `91-revisora.md`). Progresso em
> `progresso-92.md`, relato em `92-executora.md`. Leia o veredito inteiro antes de começar.

**1 · CORRIGE · o chamador do Grid não tem cobertura.** A Revisora trocou em `artes-grid-mesa.ts`
a comparação `r.total > d.difParado` de volta para `d.difMetade`, e o `test-artes-grid` passou
verde. O relato dizia que a `oferecerSaida` "só coleta e rola"; ela também compara. Leve a
comparação (sucesso ou não de ficar parado) para uma função que decide, em `artes-grid.ts`, com
asserção própria, e prove com o controle negativo: a mesma troca que a Revisora fez tem de derrubar
uma asserção.

**2 · Nota 1:** o texto do `regras.json` sobre o "ficar parado" não cita o núcleo da área (4 m,
Dificuldade 25 que vira 13). Acrescente.

**3 · Nota 2:** na fronteira do Resistir, falta "os do mundo" (ou equivalente) antes de veneno e
doença: a tabela das Artes põe a doença mágica em Vigor + Convicção, e a frase de hoje parece dizer
que toda doença é Vigor + Resistência.

**4 · Nota 3:** `docs/pendencias/L-simulacao-simultaneo.md:5492` cita `:1787` sem nome de arquivo,
e o alvo hoje é `:1901`. Conserte, pondo o nome do arquivo na citação para o `reapontar.mjs`
passar a vê-la.

Commits com pathspec, gancho verde, build se tocar `src/`. Pode empurrar levando commit do
Cartógrafo. `lore/` não se toca.
