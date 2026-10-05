# 139 · Revisora · a correção do CORRIGE 138 (`76e9510e`)

Pino: `76e9510e` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 138 é ancestral de
origin/main).

**CI:** Deploy de `76e9510e` `success`; o Validar estava `in_progress` quando escrevi (conferido por `gh run list`).

**Resultado: PROCEDE. A rodada 12 fecha.**

## O que conferi

1. **Passo 8** (`criacao-de-personagem.md`:23): saiu "Teto **3** na criação."; o resto ficou igual, inclusive "de
   **1 a 3** numa campanha heroica (3 é o Herói…)". No gerado (build próprio, verde): "Teto 3 na criação" 0; "de 1 a 3
   numa campanha heroica" 2 (Criação e Centelha, os dois como orientação ao Mestre).
2. **Varredura do capítulo inteiro, qualquer caixa e sem negrito** (script que tira `**` e tags e procura "teto",
   "máxim", "limite", "no máximo" e "até N"): o que sobra é o `+1 de teto` racial (:18, :19), o máximo normal da ficha
   (:19, :20, :64), o teto de Arte Centelha + 2 (:58, :64, :149), o teto de Proeza igual à Centelha (:58), a Vontade
   máxima nas fórmulas (:78) e "nenhum teto movido" nas linhas de Raça das fichas. **O único teto de criação que resta é
   a Exceção declarada de Veil (:128)**, que é da ficha (D-053) e está na D17.
3. **A última frase de Limites.** Antes: "O ponto seguinte e os tiers maiores vêm com o jogo." Depois: "Os tiers
   maiores da Centelha vêm com o jogo." **É coerente, e não foi além do necessário.** A frase velha vinha logo depois
   de "Centelha máxima **3**", e "o ponto seguinte" era o 4. Sem o teto, ela ficou sem referente: logo antes dela agora
   está "O nível de cada Arte respeita o teto da Centelha (Centelha + 2)", e "o ponto seguinte" passaria a ler como o
   próximo nível de Arte, que é outra regra. A frase nova só diz que a Centelha sobe em jogo, que é o Portão da Centelha
   (`centelha.md`:89, "sobe só com permissão do Mestre, num marco de história") e não estabelece teto nenhum na
   criação, então não contradiz a D-055. Não toca o teto de Arte (D-006), que segue na frase anterior.
4. **Cadeias** (`decisoes.md`, "Cadeias a conhecer"): "Dificuldade da Arte" (C-025 substituída pela D-060, no ar
   desde `bd041499`, com o Grid na conta antiga até a passada da N) e "Desarmado" (C-029 substituída pela D-057 no
   desarmado, a Proeza continua a implementar; D-057 a implementar). Os commits citados existem: `adfbb5d7` é a origem
   da C-025 na entrada dela, e `7bbe593d` a da C-029 (`git cat-file -t`: commit).
5. **N6 e N7** (`N-grid-pendencias.md`): as duas ganharam a nota de que o diálogo de conjurar mostra o texto dos
   parâmetros fixos (`artes-grid-ui.ts`:807) e por isso já exibe o texto do livro enquanto cura pela conta antiga. A
   N7 acrescenta que o Grid não calcula Dificuldade de Efeito por fórmula; isso bate com o que vi na 138 (os leitores
   de `valor` em `artes-grid.ts` só tiram dado de Dano, bônus "+N" e medidas de Alcance e Área, e nada da linha
   Dificuldade).
6. **D17:** ganhou a nota da TOLERÂNCIA de `ficha-engine.ts`:174-175 e do "provisório" de :177, sem mexer no código.
7. **Travessão e vocabulário:** contagem por arquivo igual antes e depois; nenhuma linha acrescentada com travessão nem
   com o nome antigo de Habilidade.

## CLAREZA

Nada a acrescentar.
