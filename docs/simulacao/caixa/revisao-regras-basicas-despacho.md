# Revisão das regras básicas e da economia · despacho

Liberado pelo autor em 02/10/2026. **Só leitura e relato; nada se altera nesta rodada.** Commit
congelado para as três leituras: **`2dcae19e`** (origin/main na abertura, fim do item 5b do
fechamento da economia).

## O pedido, verbatim

> Escopo, em ordem de uso na mesa: coracao-do-sistema.md (jogada, soma, Dificuldade,
> Especialidade, Valor Passivo), acoes-e-sistema.md (modos: Direta, Acumulada, Longa, Reflexiva,
> Passiva), criação de personagem (Atributos, Habilidades, Centelha inicial), defesas.md,
> combate.md até Dano e Armadura (ataque, Margem, Defesa, Tick e Velocidade, Guarda sob pressão),
> quase-acerto.md, centelha.md (o bônus pela Reforma e a jogada só de Atributo),
> aparencia-virtudes-vontade.md (Força de Vontade), cura e descanso, as perícias mais comuns
> (Prontidão, Furtividade, Atletismo, Sociabilidade) e custo-servicos.md (Serviços, Trabalhos e
> recompensas).
>
> Três leituras separadas:
> 1. Leitora-novata: lê como quem nunca jogou o sistema, na ordem do site, sem ler código nem
>    JSON. Para cada trecho, diz: o que não entendeu na primeira leitura; onde precisou de uma
>    regra que ainda não tinha sido explicada; onde um exemplo faltou ou confundiu. Termina
>    tentando resolver 6 situações comuns só com o texto, e relata onde travou: subir um muro;
>    convencer um guarda; um ataque de espada contra alguém de couro; esconder-se de uma patrulha;
>    curar-se depois da luta; pôr preço num trabalho de seguir alguém em segredo.
> 2. Revisora, regras básicas: incongruência e contradição. Dois capítulos dizendo coisas
>    diferentes sobre a mesma regra; capítulo contra src/data/*.json (o JSON vence); fórmula do
>    texto contra src/lib/calc.ts; termo usado com dois sentidos; regra citada que não existe.
> 3. Revisora, economia (a rodada que ficou pendente): todos os commits do despacho
>    fechamento-economia-reforma, do item 1 ao 5b. Foco: Valor Passivo com uma fórmula só nos dois
>    capítulos; nenhuma sobra de "+1 por ponto" de Centelha fora da jogada só de Atributo;
>    capítulo, calculadora /recompensa, recompensas.json e test-recompensa.mjs dizendo a mesma
>    coisa; os 8 exemplos conferidos à mão.
>
> Formato do relato, por achado: arquivo:linha, tipo (CLAREZA / INCONGRUÊNCIA / CONTRADIÇÃO), o
> que está escrito, por que é problema e a correção sugerida. Ordene por frequência de uso na
> mesa, e não por capítulo. Nada de decidir regra: onde houver duas leituras possíveis, liste as
> duas para o autor. Relate em blocos (Leitora, Revisora básicas, Revisora economia), e não tudo
> no fim.

## O escopo, em arquivo (conferido pelo Arquiteto em `2dcae19e`)

Todos em `src/content/chapters/`, na ordem de uso:

1. `coracao-do-sistema.md` (inteiro)
2. `acoes-e-sistema.md` (os cinco modos; a seção "De onde sai a Dificuldade" está em `:14`)
3. `criacao-de-personagem.md` (Atributos, Habilidades, Centelha inicial; `atributos.md` e
   `habilidades.md` só no que a criação remete)
4. `defesas.md`
5. `combate.md`: de `:1` até antes de "Dano e Armadura" (`:175`), mais "Esquivar ou Bloquear"
   (`:231`) e "Pressão: muitos contra um" (`:401`), onde mora a **Guarda sob pressão**, que o
   pedido nomeia mas fica depois de Dano no arquivo. "Dano e Armadura" (`:175-226`) entra só para
   a situação da espada contra o couro.
6. `quase-acerto.md`
7. `centelha.md` (o bônus pela Reforma, item 1 em `:44`, e a jogada só de Atributo)
8. `aparencia-virtudes-vontade.md` (Força de Vontade)
9. `vida-ferimentos-cura.md` (cura e descanso)
10. Perícias comuns: Prontidão, Furtividade, Atletismo, Sociabilidade, em `habilidades.md` e onde
    as ações delas moram (`acoes-corpo-e-movimento.md`, `acoes-sentidos-e-engano.md`,
    `relacoes-sociais.md`), só no trecho de cada uma.
11. `custo-servicos.md` (Serviços; Trabalhos e recompensas)

## 1 · Leitora-novata

- Lê o estado publicado em `2dcae19e` (`git show 2dcae19e:<caminho>`), na ordem acima, que é a
  ordem do site. **Não lê código, JSON, `docs/simulacao/` (fora o modelo de formato),
  `Pendencias.md` nem `docs/pendencias/`.**
- Formato: o de `docs/simulacao/caixa/leitura-de-novato-2.md`, com o campo de tipo do pedido
  (quase sempre CLAREZA).
- Termina com as **6 situações** do pedido, cada uma resolvida só com o texto, dizendo onde travou
  e qual trecho faltou.
- Relatório: `docs/simulacao/caixa/leitura-de-novato-3.md`. Ela não commita; quem commita é o
  Arquiteto.

## 2 · Revisora, regras básicas (rodada 119)

- Congela em `2dcae19e`. O mesmo escopo, mais `src/data/*.json` e `src/lib/calc.ts` para o
  cruzamento.
- Tipos: INCONGRUÊNCIA e CONTRADIÇÃO (CLAREZA só se cair no caminho). O JSON vence o capítulo.
- Veredito em `docs/simulacao/caixa/119-revisora.md`, commitado por ela.

## 3 · Revisora, economia (rodada 120)

- Congela em `2dcae19e`. Faixa: todos os commits do despacho
  `docs/simulacao/caixa/fechamento-economia-reforma-despacho.md`, do item 1 ao 5b:
  `8d1cbb79`, `ed3ebadd`, `5d068c65`, `2ea408a0`, `87494847`, `c09261ce`, `d8d2fd27`,
  `601e1ce8`, `ed289426`, `38008870`, `d2237ae2`, `03149413`, `2dcae19e`.
- O relato da Executora é `docs/simulacao/caixa/fechamento-economia-reforma-relato.md`.
- Foco do pedido (4 pontos). Os 8 exemplos finais estão em `custo-servicos.md` (seção "Trabalhos
  e recompensas"); conferir à mão cada um, com a régua.
- Veredito em `docs/simulacao/caixa/120-revisora.md`, commitado por ela.

## Regras desta rodada

- **Nada se altera**: nenhuma edição em capítulo, JSON ou código. Só os relatórios.
- Ordem por frequência de uso na mesa, e não por capítulo.
- Duas leituras possíveis: listar as duas, sem decidir.
- Relato em blocos: cada leitura manda ao Arquiteto o seu bloco quando fechar, sem esperar as
  outras.
- Sem travessão.
