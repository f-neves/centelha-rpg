# Correção da Reforma da Centelha (a regra do maior) · despacho

Liberado pelo autor em 02/10/2026, para a Executora. Parte de `1a65063f` (origin/main na abertura,
fim da Revisora 120). **Um commit por item, CI verde em cada um.** Se o orçamento acabar, pare no
último item fechado e registre o resto como pendência. A revisão é da Revisora, rodada 121, ao fim.

De onde vem: a Revisão 119 (`docs/simulacao/caixa/119-revisora.md`, achados 1 a 5, 9 e 10), a
Revisão 120 (`120-revisora.md`, foco 2 e o CORRIGE do item 1d) e a Leitura de novato 3
(`leitura-de-novato-3.md:31-35`). A Reforma (28/09/2026) ficou meio aplicada, e o autor decidiu
agora as três perguntas que travavam o conserto.

## As decisões do autor, verbatim

> **1. Defesa parada.** opção 1 (A). Defesa parada = (Compostura + Sociabilidade) × multDefesa + 2 ×
> menor(Centelha, Sociabilidade) + termo da régua. Motivo: o ataque social leva 2 × mín(C, Habilidade)
> pela Reforma, e entre Centelhas iguais o bônus tem de se cancelar (centelha.md); a Defesa Mental já
> usa 2 × mín sobre uma soma simples. O capítulo passa a seguir o JSON: relacoes-sociais.md:138 (o
> ataque social, também com 2 × mín), :182 (a Defesa parada), :196-197 e :274-276 (Kael e Sora
> recalculados). Restaure em regras.json:2683 a frase do Tempo do passo que o 8d1cbb79 apagou.
> Registre no relato: a troca do 8d1cbb79 foi decisão de regra tomada sem o autor, sob o nome de
> "comentário desatualizado"; o resultado ficou certo, mas o caminho foi errado, e regra se pergunta.
>
> **2. Jogada só de Atributo.** o bônus de Centelha numa jogada é o MAIOR entre +1 por ponto de
> Centelha e 2 × mín(Centelha, Habilidade). Habilidade 0 conta como jogada só de Atributo, e quem
> treinou nunca recebe menos que quem não treinou. Aplicar em centelha.md:44 e em calc.ts
> (centelhaNaJogada usa a regra do maior; centelhaSoAtributo deixa de ficar sem chamada).
>
> **2b. Alcance da regra do maior.** Opção 3: tudo. A regra do maior (o maior entre +1 por ponto de
> Centelha e 2 × mín(Centelha, Habilidade)) vale para a jogada rolada, o Valor Passivo, as três
> Defesas e a Defesa parada. Motivo: entre Centelhas iguais o bônus tem de se cancelar; se só a jogada
> usasse o maior, quem ataca com pouco treino ganharia mais do que quem se defende com o mesmo treino.
> E a Defesa com Esquiva 0 é a jogada só de Atributo que o autor já decidiu (+1 por ponto).
> Aplicar em centelhaNaJogada (calc.ts:140), que já serve a todos; lib-bestiario.mjs:62; regenerar as
> 189 criaturas; refazer o test-kael (Kael 20/13/7), defesas.md:85 e os exemplos. Registre no relato da
> B14 que a bancada da Fase 5b mediu com a regra antiga (o filhote vai de Defesa 4 para 8, e as Defesas
> Sociais das criaturas sobem) e que as âncoras precisam ser medidas de novo na próxima rodada da B14.
> No relato, informe quantas criaturas mudaram em cada Defesa e os 5 maiores saltos.
>
> **3. Passivos do grupo na mesa.** opção 1. O painel mostra o Valor Passivo do livro. Commit
> próprio, com a linha do que muda para quem joga hoje (Kael passa de 16 para 24).

**Como as decisões se juntam.** A 2b vem depois da 1 e alcança a Defesa parada. Então o "2 × menor"
da decisão 1 passa a ser o termo da regra do maior, como em toda Defesa:

- **Bônus de Centelha** (jogada, Valor Passivo, as três Defesas, Defesa parada) = **maior(Centelha,
  2 × mín(Centelha, Habilidade))**. Com Habilidade 0 dá a Centelha inteira; com Habilidade ≥ metade da
  Centelha dá o mesmo que hoje.
- **Defesa parada** = (Compostura + Sociabilidade) × multDefesa + maior(Centelha, 2 × mín(Centelha,
  Sociabilidade)) + termo da régua.
- **O que NÃO muda:** o dano, a Absorção natural, o raspão (`quase-acerto.ts:201`), Energia, Mana e
  os saltos somam a Centelha inteira por regra própria (`120-revisora.md:105-109`). A Longa continua
  sem Centelha (`acoes-e-sistema.md:107`).

## Medição prévia do Arquiteto (no `1a65063f`)

Script em `../tmp/arquiteto/medir-maior.mjs`, lendo `src/data/bestiario/*.json` (`skills` +
`skills2`) com a mesma regra de `lib-bestiario.mjs:62-85`. É estimativa para dimensionar, e não
prova: a prova é o `gen-bestiario` regenerado.

- 309 criaturas, 194 com Centelha. **189 mudam** em alguma Defesa: Esquiva em 121, Mental em 3,
  Social em 177. Ataques: 3 criaturas.
- Kael: Esquiva 3 (igual), Integridade 0 e Sociabilidade 0 (Centelha inteira): **20/10/4 vira
  20/13/7**.

## Os itens, em ordem de commit

### 1 · O motor e o bestiário

- `calc.ts:140` `centelhaNaJogada` = `Math.max(centelhaSoAtributo(c), 2 × mín(c, h))`. Assim a
  `centelhaSoAtributo` ganha chamador, como o autor pediu. Reescreva os comentários de `:131-154`
  (o "Sem Habilidade, sem bônus" morre).
- Toda reimplementação da mesma conta: `scripts/lib-bestiario.mjs:62`, `scripts/test-kael.mjs:18` e
  o que mais aparecer em `rtk proxy grep -rn "2 \* Math.min" src scripts`. Liste no relato cada
  uma que achou e o que fez.
- `valorPassivo` (`calc.ts:415-417`) já usa `centelhaNaJogada`: confira que herda a regra.
- Regenerar o bestiário pelo gerador (nunca à mão no JSON gerado; memória B10: correção por cima de
  arquivo gerado morre no regen). `gen-bestiario.mjs --check` verde no fim.
- `test-kael.mjs:35` passa a 20/13/7. Qualquer outro teste que fixe Defesa de criatura ou de
  personagem: atualize e diga qual e por quê.
- `regras.json`: as notas de `derivados.defesa*`, a do ataque e as que descrevem a Centelha na
  jogada passam a dizer a regra do maior.
- **Produção:** a linha do commit diz que as Defesas de quem tem Habilidade menor que metade da
  Centelha sobem na ficha e no bestiário (Kael 20/10/4 para 20/13/7). Sem migração.
- **No relato:** quantas criaturas mudaram em cada Defesa (Esquiva, Bloqueio se houver, Mental,
  Social) e os 5 maiores saltos, com nome, Defesa, antes e depois.

### 2 · Os capítulos, o glossário e os textos da ficha

Toda fórmula que diz "+ Centelha" (a de antes da Reforma) ou "2 × mín(Centelha, Habilidade)" passa à
regra do maior. Lista conhecida (119 e 120); varra por mais:

- `centelha.md:44`: o item 1 inteiro. A frase "nunca mais do que a Habilidade" (119 achado 1, parte
  1) vira a regra do maior, dita em uma linha, com o caso da Habilidade 0 nomeado. A exceção "só
  Atributo" deixa de ser exceção: é o mesmo maior. `:65` ("por cima dos 2 pontos por ponto...")
  também.
- `coracao-do-sistema.md:89`, `:91`, `:93`; `acoes-e-sistema.md:65`, `:121`, `:123`.
- `defesas.md:68-81`, `:85` (Kael), `:122-125`.
- `combate.md:124`, `:131`; o exemplo de `:21` (Sora, Armas 5, Centelha 3: o pool certo é **5d6 + 9**,
  119 achado 5).
- `coracao-do-sistema.md:79`: o muro de Kael **só na conta da Centelha** (3d6 + 6, e a frase da
  Margem refeita). A Dificuldade 10 contra a tabela de Escalar (119 achado 7, primeira parte) **não é
  deste despacho**: não mexa.
- `criacao-de-personagem.md:73-75` (as três fórmulas) e os derivados dos quatro exemplos (`:106`,
  `:124`, `:145`, `:172`), recalculados pela regra do maior. Veil: a ficha não nomeia a
  Sociabilidade; não invente, registre a conta com a Sociabilidade que o número de hoje implica e
  marque como pendente.
- `aparencia-virtudes-vontade.md:129`, `:131`.
- `acoes-sentidos-e-engano.md:16` (Percepção Passiva).
- `qual-sistema.md:87-88` e o SVG gerado dele em `diagramas.json` (pelo gerador, se houver).
- `glossario.json:93`, `:101`, `:109`, `:223`.
- `ficha-engine.ts:1570-1573`: a frase que explica as Defesas (o número já sai certo; a conta escrita
  não fecha). **Produção:** muda só o texto da explicação.
- `quase-acerto.md:28` (Sora com Centelha 3: raspão 2 e 6) e a string de `regras.json:1133`, que
  ganha os dois termos de Centelha (119 achado 9).
- Comentário `combate-resumo.ts:80`; `scripts/test-sentidos.mjs:66` (a fórmula da passiva; e diga no
  relato que a asserção de `:74` compara a função com ela mesma); `Regua_Relacao.md:120`.

### 3 · Relações sociais e a Defesa parada

- `relacoes-sociais.md:138` e `:274` (ataque social): `+ maior(Centelha, 2 × mín(Centelha,
  Habilidade))`.
- `:182` e `:276` (Defesa parada): a fórmula da seção "Como as decisões se juntam".
- `:188`, que explica por que a Centelha entra "só de um lado": releia contra a fórmula nova e ajuste
  só o necessário; se a explicação deixar de fazer sentido, pare e registre, sem reescrever o
  argumento.
- A tabela `:192-198`: Kael e Sora recalculados nas duas colunas. Guarda, vendedor e Vesna não têm
  ficha no texto: não invente, registre.
- `regras.json:2683`: a nota passa à regra do maior, e **a frase do Tempo do passo volta**, na
  redação de antes do `8d1cbb79` ("Tempo do passo, em intervalos = máx(pisoTempoDoPasso, defesa
  parada − ataque parado − soma dos gestos).").
- **No relato, o registro que o autor pediu**, verbatim: a troca do 8d1cbb79 foi decisão de regra
  tomada sem o autor, sob o nome de "comentário desatualizado"; o resultado ficou certo, mas o caminho
  foi errado, e regra se pergunta.

### 4 · Os Passivos do grupo na mesa (commit próprio)

- `mesa-ficha.ts:41-78` e `src/pages/mesa/grupo.astro:22-28`: o painel mostra o Valor Passivo do
  livro, pela `valorPassivo` de `calc.ts` (sem a Especialidade, como a função já faz). A frase da
  página que diz que a média "serve de valor passivo" sai.
- **Produção**, a linha do autor: a Prontidão passiva de Kael no painel passa de 16 para 24. Sem
  migração.
- Smoke da mesa verde (o `test-l84`/`test-l88` intermitente: rerun, e registre se cair).

### 5 · A pendência da B14

Em `docs/pendencias/B-bestiario.md`, na entrada da B14: a bancada da Fase 5b mediu com a regra antiga
(o filhote vai de Defesa 4 para 8, e as Defesas Sociais das criaturas sobem), e as âncoras precisam ser
medidas de novo na próxima rodada da B14. Com os números do item 1 (quantas mudaram e os 5 maiores
saltos). **Não rode a bancada.**

## Fora deste despacho (não mexa)

Os outros achados da 119 e da Leitora (Especialidade no singular, Longa que "rola", rótulos das
réguas, preço de subir Proeza, onde a Centelha começa, Virtude e Centelha, haste +2, Convicção e dor,
Energia do mortal, Desperto, Absorção na lista da Centelha) e as três ressalvas de texto da 120 na
economia. Vão para a próxima rodada, depois do autor. Se um deles cair no mesmo parágrafo que você
está reescrevendo, não o conserte de carona: registre.

## Regras desta rodada

- Commit com pathspec, mensagem longa por `../tmp/executora/msg.txt`. Sem coautoria.
- Antes de commitar arquivo que um script reescreveu, `git diff --stat` (CLAUDE.md).
- Build: prova no gerado (o HTML da página ou o `dist/` que muda), nunca remoção de pasta.
- Sem travessão. Habilidade, nunca Perícia, no texto novo.
- Relato em `docs/simulacao/caixa/correcao-reforma-relato.md`, um bloco por item, com o sha e o CI.
