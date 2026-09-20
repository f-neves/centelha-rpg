# Rodada 86 · despacho · as correções da 85, mais o item 9 no `regras.json`

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 20/09/2026
>
> A rodada 85 fechou com **PROCEDE COM CORREÇÕES** (`b22129f`, conferido ancestral do `main`).
> O veredito é `docs/simulacao/caixa/85-revisora.md` e a lista de CORRIGE dele é a tarefa desta
> rodada, na ordem abaixo.
>
> Progresso em `docs/simulacao/caixa/progresso-86.md`, relato em `86-executora.md`.

## Antes de tudo: a ordem não é arbitrária

Os itens **1 e 2** publicam em produção uma regra que foi revogada ontem, numa página que o Mestre
abre em sessão. **Commite os dois sozinhos, primeiro, e empurre**, antes de abrir qualquer outro.
Não junte com o resto: o resto pode esperar um ciclo de deploy, eles não.

Depois disso, a ordem dos demais é sua.

## Grupo A · o que publica a regra revogada, e vai primeiro

**1 · `src/content/chapters/qual-sistema.md`, linhas `:73`, `:74` e `:110`.**
As duas caixas do fluxograma do roteador social dizem hoje "Jogada única: Ataque Social vs Defesa
Social **move a Régua** (+1 passo a cada 6 de folga)" e "Cede e a **Régua anda** os passos da
Margem". As duas eram verdadeiras em `18ee12e` e o lote da 85 as tornou falsas. O `:110` diz "dia a
dia = Régua (jogada única)".

A regra que vale hoje, e é aplicação de texto já escrito, não decisão: **a cena com dados não move
a régua.** A jogada única rende **alcance do pedido**, +1 nível acima da relação a cada 6 de folga,
só naquela cena. O Combate Social, quando o alvo não paga a Vontade, **cede o ponto** e o pedido
chega **Margem** níveis acima, também só naquela cena. Quem move a régua são os atos e o cortejo.

**2 · `src/pages/mestre.astro:207`**, "a Dif vira a Defesa Social do alvo e **o resultado move a
régua**". Mesma correção, mesma regra.

## Grupo B · o capítulo `relacoes-sociais.md`

**3 · `:250`, a linha da Sora na tabela da Vontade.** `Sora (9, 7)` vira `Sora (9, 8)`, e as quatro
células daquela linha passam de 7 para 8. A Vontade publicada dela é **8**
(`criacao-de-personagem.md:118`). O erro já vinha da especificação (`ritmo-da-regua.md:175`), e
continua sendo conserto desta rodada porque a promessa quebrada é a da 85.
**Confira, não suponha:** que a frase do `:258` continua verdadeira depois do conserto, e se o
número entra em mais algum lugar do capítulo.

**4 · `:215`, "cada degrau da escada multiplica entre 8 e 24 vezes".** Falso no salto
`minuto → hora`, que é 60. Restrinja a afirmação aos degraus que o argumento de fato usa, ou tire a
cláusula: a conclusão não depende dela. **Esta mesma frase está na sua proposta do item 9**
(`85-executora.md:129`), e não pode entrar no `regras.json` do jeito que está. Ver o grupo C.

**5 · `:106`, a palavra "lábia"** na lista do que acumula até o teto de vidro. É a quarta
contradição de borda, sobrevivente do modelo em que conversa movia a régua, duas linhas abaixo de
"Conversa nenhuma tira alguém do Neutro". **Ela também está na sua proposta do item 9**, em
`social.regua.tetoDeVidroNota`. Ver o grupo C.

**6 · `:262`, o verbo "furar"**, que já não tem mecanismo no modelo novo.

**7 · `:271`, "atos (saltos fixos, de ±2 a −5)"** na Folha de referência. A tabela de atos tem
**+3**, e o +3 é o número de que o capítulo mais depende (dois "salvar a vida" atravessam um
Nêmesis até o Neutro, que é a válvula citada em duas seções).

**8 · A tensão de redação, e ela é minha decisão de incluir, com o motivo escrito.**
`:140` chama a Defesa Social de "o número passivo da ficha" e `:145` (e `:274`, na Folha) diz que
"essa Defesa já carrega o peso da história entre vocês". O termo da régua é por relação, contra
quem se fala, e por decisão da rodada 84 não está na ficha. A Revisora classificou **ESCALA**, e
com razão: o texto é idêntico em `18ee12e` e nenhuma promessa da 85 o cobre.

Eu incluo mesmo assim, e o motivo é este: é uma linha, no arquivo que esta rodada já vai abrir, e
a alternativa é uma pendência que sobrevive ao momento em que o conserto é mais barato. É a forma
que o `CATALOGO` chama de fechar a frente sem fechar o documento. **É defeito de verbo e não de
mecânica:** a Defesa Social da ficha é um número, e o termo da régua é um modificador situacional
que a mesa aplica em cima. Diga isso, sem mudar mecânica nenhuma.

## Grupo C · o item 9, o `regras.json`

As duas sub-decisões estavam neste arquivo e continuam valendo, sem mudança:

- **o bloco `regua` MORA NO DADO.** A regra da casa diz que `src/data/*.json` é a fonte da verdade
  das regras e que os capítulos descrevem, e foi a ausência disso que deixou o `longevidadeFirula`
  morto vencendo o capítulo vivo. **O contra comprado, e ele não está resolvido:** zero consumidores
  em código, então dado e capítulo são duas listas que precisam concordar sem detector, e a regra da
  casa faz a lista ERRADA vencer quando divergirem. O detector é rodada própria, porque instrumento
  novo passa pelo `CATALOGO` antes. Fica como dívida conhecida.
- **o par `dias` + `multiplicador` vira fonte única: o `dias` sai.** Fica `multiplicador` e
  `intervaloBaseDias`. O `exemplo` fica.

**E duas emendas à sua proposta, que vieram do veredito e são a razão de o grupo C vir depois do B:**

- a frase dos "8 a 24 vezes" (`85-executora.md:129`) entra no `regras.json` **já corrigida**, do
  mesmo jeito que o item 4 acima manda corrigir no capítulo. Os dois lados dizem a mesma coisa ou
  não entra;
- a palavra "lábia" sai da `social.regua.tetoDeVidroNota` pelo mesmo motivo do item 5.

**Isso importa mais aqui do que no capítulo.** Um erro no capítulo é um erro; o mesmo erro no
`regras.json` é a fonte da verdade afirmando-o, e a regra da casa manda o capítulo se corrigir por
ele. Não leve defeito conhecido para dentro do dado.

A tarefa, na ordem:

**9 ·** o bloco `social` no topo do `regras.json`, irmão de `dificuldade` e de `combateTatico`, na
forma proposta, com o `regua` incluído e as duas emendas aplicadas. Não entra em `derivados`, pelo
motivo que você escreveu: `derivados` é o que a ficha calcula para um personagem parado, e o Tempo
do passo depende de quem é o alvo.

**10 ·** `acoes.longevidadeFirula` ganha `intervaloBaseDias` e `porFaixa` com `multiplicador` e
`exemplo`, sem `dias`, e a `nota` nova dizendo que isto SUBSTITUI o deslocamento de degrau da M-09
de 17/09/2026, com o motivo em uma linha.

**11 ·** `acoes.escalaIntervalo`: sai da `nota` a oração que cita o cortejo social como consumidor
da escada. A escada continua valendo para os modos Acumulada e Longa do capítulo VIII.

**12 · A conferência que eu quero escrita, por NOME e não por contagem:** que as quatro chaves de
faixa existem em `racas.json → longevidade`, quais povos caem em cada uma, uma a uma, e se alguma
raça fica fora de todas. Você mesma marcou que os quatro nomes da proposta vieram da proposta e não
de uma conferência; esta é a conferência.

**13 ·** conferir, nos dois sentidos, que nenhum número novo do `regras.json` contradiz o capítulo
publicado, e que nenhum deles é um dos que a 85 deixou de fora por não se reconstruir pela fórmula.

## Grupo D · as referências penduradas

**14 · `acoes-sentidos-e-engano.md:100`**, que mapeia "influência estendida" e "cortejo com calma"
como dois modos diferentes depois de o lote tê-los fundido num só, e cita a Acumulada, que saiu do
capítulo social.

**15 · `acoes-e-sistema.md:144`** ("o cortejo longo" como exemplo do degrau Estação) e **`:152`**,
que manda procurar a palavra "período" no capítulo social, e a Revisora contou **zero** ocorrências
dela no destino depois do lote.

## O que NÃO é desta rodada, e não é esquecimento

- **`antecedentes.md:72-74`, `:195` e `:311`** · o bônus situacional de Antecedente só entra "nas
  jogadas que movem a Régua de Relação", e depois do lote esse conjunto é vazio. **É regra de jogo,
  e vai ao humano.** Não escreva uma linha ali.
- **`E4` a `E8`** · abertos pela 85, e os que são regra vão ao humano em lista única.
- **a escala de Firula deste capítulo (0/+1/+2/+4) contra a canônica do `habilidades.md`** ·
  C-item anterior a esta conversa.

## Portões

O grupo A e o grupo B tocam `src/content/**`, então pagam o `validate` mais o typecheck, e passam
pelo `test-travessao-capitulos.mjs`. O grupo C toca `src/data/`. O grupo D toca `src/content/**`.

Os documentos desta rodada (`86-executora.md`, `progresso-86.md`) **não** são cobertos pelo portão
de travessão: confira à mão, lendo o arquivo, nunca por `git diff`.
