# Rodada 90 · Executora · o teste de Virtude e o Frenesi no livro

Despacho: `docs/simulacao/caixa/90-despacho.md` (`aa329d3`). Progresso com as horas lidas da
máquina em `progresso-90.md`. Fontes: `FRENESI.md` (`b268c23`) e
`leitura-de-novato-decisoes.md` §16.

Os grupos 1 a 3 entraram em `c5dd390`. O grupo 4 achou código, e a decisão foi para o humano: o
Arquiteto mandou não tocar (opção c). O ajuste do texto do Resistir pedido na resposta dele e este
relato vão num segundo commit.

## Arquivos tocados

| arquivo | o que mudou nele |
|---|---|
| `src/content/chapters/aparencia-virtudes-vontade.md` | item Resistir sem Atributo; subseção nova "O teste de Virtude" (conversão, régua própria com a tabela de chance, calibração, Firula com a negativa) |
| `src/content/chapters/racas.md` | seção nova `## Frenesi` antes de Envelhecimento, cobrindo §4 a §10; bullets do Orc e do Meio-Orc curtos, apontando para `#frenesi` |
| `src/data/racas.json` | `tracos` do orc e do meio-orc reescritos; `bonusCondicional` `+2d6` de Intimidar acrescentado ao meio-orc |
| `src/content/chapters/vida-ferimentos-cura.md` | nota sob a tabela de estados (degrau da ressaca abaixo de Crítico) e a exceção do piso de 1d6 no teste de Frenesi |
| `docs/simulacao/caixa/progresso-90.md` | progresso |
| `docs/simulacao/caixa/90-executora.md` | este relato |

Portões: `npm run validate` exit 0 e `npm run build` exit 0 em `c5dd390`. No `dist/` conferi
`id="frenesi"`, `id="frenesi-contido"`, `id="o-teste-de-virtude"`, e os links para
`/centelha-rpg/regras/racas#frenesi` saindo do capítulo IV e do próprio capítulo VI.

## Grupo 1 · o que ficou de fora do §3, e por quê

Três frases do `FRENESI.md` §3 não batem com a tabela do §2, e eu não as copiei. **Não mudei
número nenhum**; a tabela do §2 entrou inteira e está certa.

- "Com Firula 2 a banda Dura abre para Virtude 4 e acima": a Virtude 4 **sem** Firula já passa na
  Dura (2d6 > 9) 17% das vezes, pelo próprio §2.
- "A Extrema só existe com Firula 3": o §2 dá 16% para a Virtude 6 sem Firula, e 3% para a 5.
- "Virtude 1 com Firula 2 passa metade na Tensa, e nada além": na Séria ela passa 17% (1d6+2 > 7).

A tabela do §2 foi reconferida por script (convolução de d6, sucesso = total > Dificuldade): bate
célula por célula, com o .5 arredondado para baixo (Virtude 6 em 9 dá 62,5; em 11, 37,5).

**O Resistir foi escrito como teste de alma** (medo, provocação, tentação, desânimo), como o
Arquiteto confirmou, sem afirmar que toda resistência que cita uma Virtude virou Virtude sozinha.
A primeira versão, em `c5dd390`, dizia "a dor que pede para desistir"; troquei por "o desânimo",
para o texto não parecer cobrir o `Vigor + Convicção` do Estabilizar e das Artes, que ficam como
estão.

## Grupo 2 · a leitura que é minha

**O meio-orc ganhou o `+2d6` de Intimidar em fúria** no `bonusCondicional`, igual ao do orc. O
`FRENESI.md` §5 ("O que a fúria dá") é escrito para a fúria, sem separar os dois traços, e o §10
lista as diferenças do Frenesi Contido sem tirar esse bônus. A seção do livro diz a mesma coisa ("o
que se segue vale para as duas"). **Custo:** se a leitura estiver errada, são uma linha no JSON e
uma frase na seção.

A chave `"+2d6"` do orc bate com o §5 ("+2 dados") e não foi mudada.

Da tabela do §6 entrou só a de chance de ENTRAR rolando limpo, como o despacho sugeria. As de ceder,
resistir, sair e do aliado ficaram só no `FRENESI.md`.

## Conferência 5 · a Técnica `frenesi`

`tecnicas.json:1896`: **Frenesi**, nível 4 do Caminho **Sangue Fervente**, Força, ativa, 4 de
Energia, pré-requisito Sede de Sangue. Texto: "Ataca repetidamente sem as penalidades de múltiplos
ataques por 6 Ticks."

- **O nome colide**: mesmo nome e mesma palavra do traço racial do Orc.
- **A regra não colide**: a Técnica é sobre ataques múltiplos, e não sobre entrar num estado.
- **Mas o Caminho tem um estado de fúria próprio**, e é aí que as duas coisas se tocam. A Técnica
  **Fúria** (`tecnicas.json:1812`, nível 1, 1 de Energia) diz "Entra em fúria: +1d6 de dano
  corpo-a-corpo, −1 na Defesa enquanto durar", sem teste de entrada, sem ressaca, sem teto. E
  quatro Técnicas exigem "em fúria": **Ignorar Ferimentos** (`:1828`), **Sede de Sangue**
  (`:1862`), **Não Sentir Dor** (`:1914`, que tem a própria Frenesi como pré-requisito) e **Fúria
  Redobrada** (`:7354`). Nada diz se a fúria racial do orc conta como "em fúria" para elas, nem se
  as duas fúrias se somam (−1 da Técnica e −2 do Frenesi na defesa, por exemplo).

Não mexi em nada. Está com o humano.

## Conferência 8 · o motor

Recorte da busca: `src/` inteiro, arquivos `.ts`, `.astro`, `.js`, `.mjs`, pelas palavras
`frenesi`, `fúria`/`furia` e `virtude`, e pelos pares `Bravura`/`Temperança`/`Convicção`/`Compaixão`
com `+`. Também `scripts/` por `frenesi`.

- **Frenesi: nada rola.** Nenhum código cita `frenesi` ou `fúria` fora de prosa (a única
  ocorrência em código é uma frase de `pages/arcano.astro:62`). Por isso `rolagem.ts` não foi
  tocado.
- **Teste de Virtude: UM caminho rola, e com a parada antiga.** `src/lib/artes-grid-mesa.ts:1707-1716`
  (`paresDeCoragem`) monta o "Ficar parado" da caixa de sair da área (`oferecerSaida`, `:1751-1796`)
  com **Bravura + Vigor** e **Temperança + Raciocínio**, pela conversão normal, contra `d.difMetade`,
  a linha "metade" da escada da área, que está na régua de 5 em 5. Trocar só a parada contradiz o
  `FRENESI.md` §2. Ordem de grandeza: Bravura 4 + Vigor 3 é 3d6+2 contra 10, 74%; Bravura 4
  sozinha é 2d6 contra 10, 8% (*corrigido na rodada 91, CORRIGE 2 da Revisora em `90-revisora.md`:
  este relato dizia 17%, que é 2d6 contra 9*). O texto de `regras.json:1995` já fala em "teste de Bravura ou
  Temperança (outra Virtude, com Firula)", sem Atributo, e diverge do código desde antes desta
  rodada. **Não toquei, por ordem do Arquiteto: decisão do humano.**
- **Pares Virtude + Atributo fora do Resistir, que o despacho não cita e ficaram como estão:**
  `Vigor + Convicção` como resistência de 9 Efeitos (`efeitos.json:2008, 2114, 3164, 3395, 5481,
  5589, 6095, 6151, 6211`), `Vontade + Convicção` em 2 (`:3708, 3814`), a tabela
  `pages/artes/regras.astro:74`, e o Estabilizar (`vida-ferimentos-cura.md:73`,
  `condicoes.json:136`, `regras.json:1100` e `:1265`). Decisão do humano.

## Visto de passagem, fora do escopo

`racas.json`, `descricao` do meio-orc: diz que o orc puro "vive na lore como criatura, não como
raça jogável" e dá "cerca de 60 anos" de vida. O capítulo dá o Orc como raça jogável (e o próprio
`racas.json` tem a entrada `orc`) e "pouco mais de 70 anos" para o meio-orc (tabela de
Envelhecimento: venerável aos 70). Não mexi.

## Em aberto, e tudo com o humano

1. O "ficar parado" do Grid: a parada e a régua do teste.
2. Os pares `Vigor + Convicção` / `Vontade + Convicção` das Artes e do Estabilizar.
3. A colisão da Técnica `frenesi` e do estado "em fúria" do Sangue Fervente com o traço racial.
4. O push: o `main` local tinha dois commits do Cartógrafo não empurrados (`e172ce4`, `6b1d9c3`)
   quando fechei, e o meu push os leva junto. Perguntado ao Arquiteto.
