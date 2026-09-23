# Rodada 91 · Executora · o grupo 4 da rodada 90, com as decisões

Despacho: `docs/simulacao/caixa/91-despacho.md` (`26f0d59`). Decisões: `leitura-de-novato-decisoes.md`
§16, bloco "Quatro decisões a mais" (`a8ce2bc`). Progresso com as horas lidas da máquina em
`progresso-91.md`.

Tudo entrou num commit só, `8b16b56`. Este relato vai no commit seguinte.

## Arquivos tocados

| arquivo | o que mudou nele |
|---|---|
| `src/lib/artes-grid.ts` | `Desvio.difParado` (metade da `difMetade`, para cima) e a função nova `opcoesDeFicarParado` (a Virtude sozinha) |
| `src/lib/artes-grid-mesa.ts` | `paresDeCoragem` chama `opcoesDeFicarParado`; o "Ficar parado" rola e mostra a Dificuldade `d.difParado` |
| `scripts/test-artes-grid.mjs` | três asserções novas sobre o ficar parado |
| `src/data/regras.json` | o texto `ficarParado` diz a Dificuldade nova e "a Virtude sozinha e sem Atributo" |
| `src/content/chapters/aparencia-virtudes-vontade.md` | uma frase: quando a Virtude vai sozinha e quando não |
| `src/content/chapters/racas.md` | um parágrafo: a fúria racial e as Técnicas do Sangue Fervente |
| `src/data/racas.json` | descrição do meio-orc: sai o "não é raça jogável", 60 vira "pouco mais de 70 anos" |
| `Auditoria_Tecnica.md`, `docs/pendencias/L-simulacao-simultaneo.md` | 13 citações de linha reapontadas pelo `reapontar.mjs` (as duas estavam limpas antes de rodar) |
| `docs/simulacao/caixa/progresso-91.md`, `91-executora.md` | progresso e relato |

Portões em `8b16b56`: `npx tsc --noEmit` sem erro, `npm run validate` exit 0, `npm run build`
exit 0. No `dist/`, o texto novo sai em `/artes/regras` e em `/mesa/referencia` (as duas páginas
leem `regras.json`), e os links novos do capítulo III (`/artes/regras`,
`vida-ferimentos-cura#sangramento-e-estabilização`) e do VI (`/caminhos`) apontam para destinos
que existem.

## Grupo 1 · o ficar parado, e a prova

**Nenhum teste exercitava esse caminho.** Busca em `scripts/` e `src/` por `paresDeCoragem`,
`oferecerSaida`, `parado:` e `difMetade`: só o próprio código e a tabela da linha em
`test-artes-grid.mjs`, que não toca no ficar parado.

**O que decide saiu da caixa de diálogo**, como pede a regra "ações recebem objeto": a
`opcoesDeFicarParado` em `artes-grid.ts` recebe `{ virtudes }` e devolve as duas opções, e a
Dificuldade virou um campo do `Desvio`. A `oferecerSaida` só coleta e rola.

**Os dois controles negativos, e o primeiro é o que prova alguma coisa:**

1. **A semântica antiga, extraída.** Escrevi primeiro a função com o comportamento de antes (Virtude
   + Vigor ou + Raciocínio, contra a `difMetade`) e as asserções já na versão nova. **Falharam 3 de
   3**: veio `10 · 15 · 20` (esperado `5 · 8 · 10`), veio `Bravura + Vigor 7` (esperado `Bravura 4`,
   com a ficha passando Vigor 3 e Raciocínio 2), e as chances vieram `8 50 0 0` (esperado
   `72 95 28 50`).
2. **O stash do despacho.** `git stash push -- src/lib/artes-grid.ts src/lib/artes-grid-mesa.ts`,
   teste novo mantido: exit 1, `M.opcoesDeFicarParado is not a function`. `stash pop` limpo,
   `git stash list` vazio depois. Este controle só prova que o teste roda sobre a função nova: como
   a função não existia antes, ele falha por ausência, e não pela regra.

Com a semântica nova, `test-artes-grid` exit 0. As chances de referência do despacho batem pela
conversão de sempre: borda 10 → 5, Bravura 4 72% e Bravura 6 95%; meio 15 → 8, Bravura 4 28%; fundo
20 → 10, Bravura 6 50%.

A criatura continua lendo as Virtudes de `MON[...].virtudes`, com a chave `valor` para a Bravura,
como antes.

## Grupo 2 · uma correção ao que o despacho descreve

O despacho e a §16 chamam de "resistências do corpo" os dois pares, `Vigor + Convicção` e
`Vontade + Convicção`. **O segundo não é do corpo.** Os dois Efeitos que o usam são **Banir**
(`efeitos.json`, "o espírito rola para ficar") e **Círculo** ("para a criatura forçar a linha").
Escrevi "corpo" só para o `Vigor + Convicção` (as Artes que invadem o corpo, e o Estabilizar) e citei
o `Vontade + Convicção` à parte, pelos dois exemplos, como "continuam como estão". Nenhum dado foi
tocado. Se a frase tiver de dizer outra coisa, é só ela.

## Grupos 3 e 4

**3.** Parágrafo em `racas.md`, logo depois de "Entrar não custa nada além do teste": as quatro
Técnicas que pedem "em fúria" (Ignorar Ferimentos, Fúria Redobrada, Sede de Sangue, Não Sentir Dor)
só valem na fúria da Técnica Fúria, e a Técnica Frenesi é outra coisa com o mesmo nome. O
`tecnicas.json` não foi tocado.

**4.** Os "60 anos" que sobram em `src/` são do Orc puro (`racas.md:121`, `racas.json:130`) e batem
entre si. O campo `longevidade` do meio-orc é categoria (`"curta"`), sem número, e não mudou.
Nenhum outro lugar de `src/` diz que o orc não é jogável.

## Em aberto

Nada desta rodada. O ficar parado só oferece Bravura e Temperança; o texto do `regras.json` sempre
disse "ou outra Virtude, com Firula", e o código nunca ofereceu outra. Isso é de antes e ficou como
estava.
