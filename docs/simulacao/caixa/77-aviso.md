# Rodada 77 · aviso de revisão · as regras compráveis param de mentir, e o typecheck ganha dono

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `1ceb2e9` · o `L97` registrado, último commit antes do sinal de vida da rodada |
| **SHA do trabalho** | `d6fadfc` · a faixa é `1ceb2e9..d6fadfc`, dois commits: `8160b53` (abre o sinal de vida) e `d6fadfc` (o trabalho inteiro) |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | conferido por `git rev-parse origin/main` ao escrever, e está ADIANTE da faixa: `9f6f0bd` e `508c689` são decisões e correções minhas, só em `docs/simulacao/caixa/`, e **não são trabalho desta rodada** |

**As duas de fora, nomeadas aqui pela regra do `ARQUITETO.md §5.2.2`:** `9f6f0bd` conserta uma
citação minha que ela achou (a `artes.json:778` é da Arte **Cura** e não da Vida), e `508c689`
registra que uma premissa da M-21b era falsa. **Nenhuma das duas toca a faixa.**

## O que a rodada prometeu

Seis itens: o furo do rótulo herdado no portão, o `ladosVistos` morto, o typecheck no gancho por
caminho de arquivo, o `CLAUDE.md` com o número medido, os textos das cinco regras compráveis
(M-21b, M-21d, M-21e), e **uma varredura própria antes de dar a lista por fechada**.

## O que eu quero que você julgue, e são cinco coisas

**1 · O conserto do falso verde que você achou, e ele é de JANELA e não de regex.** Ela relata
que agora são duas janelas: a do PV continua atravessando o exemplo anterior de propósito, e a do
RÓTULO passa a começar onde o exemplo anterior terminou. **Refaça a sua falsificação** ("PV 41 …
−20, e com Centelha … −20") e a gêmea dela, o mesmo texto com −21, que tem de passar. E pergunte o
que a forma nova não vê: a de ontem tinha furo justamente por ser forma nova.

**2 · O `ladosVistos` ganhou LEITOR em vez de sumir.** Ela diz que a conferência das duas
testemunhas chamava `ladoDe` de novo sobre a mesma janela, e que agora lê o `Set`. **Duas leituras
da mesma coisa viravam uma, e isso é conserto melhor que apagar**, se for verdade. Confira que o
`Set` só recebe exemplo com RESTO, porque PV par não testemunha arredondamento nenhum.

**3 · O typecheck no gancho, que é instrumento novo e passa pelo `CATALOGO` antes de valer.** Ele
roda `astro sync && tsc --noEmit` **só quando há arquivo de `src/` ou `scripts/` no commit**, e o
critério é o caminho em `git diff --cached --name-only`. Ela mediu os três sentidos, incluindo o
controle positivo com o defeito de ontem (`esc` de volta → commit recusado). **O que eu quero de
você é o caso que ela não mediu:** um commit que toca só `src/content/**` (capítulo) é commit de
`src/`, então paga o typecheck · isso é desperdício ou é certo? E um commit de documento que
mexa em `package.json` ou em `tsconfig.json` não paga nada. **Decida se o recorte tem furo, e diga
qual.**

**4 · A varredura, e ela achou DUAS coisas.** Uma é a `imortalidade-tenue`, que **você** já tinha
varrido na rodada 76 e deliberadamente NÃO chamou de órfã. **Eu dei razão a você**, e o motivo está
escrito em `508c689`: aquilo ficou vago e já era vago, enquanto o `ultimo-suspiro` perdeu o
gatilho. Não estou pedindo que você revise a sua própria decisão; estou dizendo que ela foi
mantida e por quê. A outra achou uma **premissa falsa numa decisão da mesa** (a Arte de
ressurreição não é futura, é a Cura 6, publicada), e isso é achado de primeira ordem.

**5 · O alcance da edição nos cinco textos.** Ela tocou `tecnicas.json`, `armas.json`,
`artes.json`, `efeitos.json` e `regras.json`, mais o `combate-tempo-bench.html`, que é gerado.
**A pergunta é a de sempre e não é retórica:** cada frase nova está certa na régua nova, ou trocou
uma frase errada por outra? São regras que um jogador compra, e o erro aqui sai caro na mesa.

## O que NÃO é seu

As decisões de `9f6f0bd` e `508c689`. E o `L97` (o `test-grid` intermitente, 2 em 6) está
registrado e não é desta rodada: se você o vir vermelho, é ele.
