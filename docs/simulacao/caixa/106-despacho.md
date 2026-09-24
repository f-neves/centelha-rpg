# Rodada 106 · despacho · o que a condução herda, o que é obra, e as três regras de ajuda

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> Decisões do autor (o humano, 24/09/2026) sobre a G29 e a G18, que a Revisora escalou no veredito
> da 105 (`f8e3e1e`). Progresso em `progresso-106.md`, relato em `106-executora.md`. A Revisora fecha.

## 0 · Onde

Na sua árvore, `C:/Users/Neves/ClaudeCode/centelha-executora`, branch `executora`. Ao começar:
`git status --short` vazio, `git fetch origin`, `git merge-base --is-ancestor executora origin/main`
e `git switch -C executora origin/main`. Publicação como sempre, sem força e sem `npm install`.

## 1 · As decisões, com as palavras do autor

**G29, pergunta 1.**

> A regra de condução HERDA os modificadores. Oficina e material (±2/±4 na Dificuldade) são
> circunstâncias da tarefa e valem para todos que trabalham nela. O +4 de quem não tem o ofício
> específico é pessoal e pesa sobre quem não o tem. Consequências a deixar explícitas no texto: o
> braçal (sem ofício) não soma na espada em nenhuma oficina (7 − 4 + 4 = 7 na oficina de mestre);
> aprendizes (Habilidade 1 ou 2) somam numa oficina bem equipada ou de mestre.
> Trava nova: a condução admite até DEZ ajudantes, como a direção de obra.
> Trocar o exemplo por: "numa oficina bem equipada ou de mestre, dez aprendizes aceleram uma espada
> Comum e não fazem uma Ótima".

**G29, pergunta 2.**

> obra = construção fixa no lugar (casa, celeiro, forja, moinho, muralha, ponte, catedral) ou peça
> da escala de estações. Todo o resto é fabricação. Carroça e barco de pesca são fabricação; navio de
> guerra é obra (escala de estações). O critério não depende do ofício da linha.

**G18.**

> As duas regras convivem com alcances diferentes. A regra da metade (ajudante contra metade da
> Dificuldade; +1 a cada 6 acima) vale para APOIO numa jogada única, ação indivisível. Condução
> (fabricação) e direção (obra) valem para trabalho DIVISÍVEL, ação Longa com Acúmulo. Deixar isso
> escrito na Régua Comum e no capítulo de ofício; acoes-oficio-e-mundo.md:8 passa a apontar para a
> condução. O modo "Apoiar" do Acoes_Sistema.md (mesma Dificuldade, +2) se alinha à regra publicada.

## 2 · Onde mexer

- `src/content/chapters/acoes-oficio-e-mundo.md`: o topo (`:8`, que hoje manda para "as regras de
  ajuda" da Régua Comum), a regra de condução e o exemplo (a herança, o +4 pessoal, a trava de dez,
  o exemplo novo), e a **Direção de obra**, cuja lista de hoje ("as obras das escalas de semanas e de
  estações") dá lugar ao critério novo de obra;
- `src/content/chapters/acoes-e-sistema.md`: a Régua Comum (a regra da metade, cerca de `:172`), que
  passa a dizer que ela é para apoio numa jogada única, e que o trabalho divisível tem condução e
  direção;
- `Acoes_Sistema.md`: o §3.5 (o modo "Apoiar" se alinha à regra publicada da metade: metade da
  Dificuldade, +1 a cada 6 acima, e não mais mesma Dificuldade e +2) e os espelhos do §7.3 e do §7.6.

Ache por texto, não por linha.

**Antes de escrever, as contas vão no relato**, lidas do livro e não de memória:

1. a tabela de Oficina e Material (`acoes-oficio-e-mundo.md`, cerca de `:110-111`): quanto cada
   grau muda a Dificuldade, e em que sentido;
2. a conta do braçal em cada oficina (média 7, sem o ofício, então +4 pessoal) contra a espada
   (Dificuldade 7): ele não soma em nenhuma, como diz o autor?
3. a conta do aprendiz com Habilidade 1 e com Habilidade 2 (com a Destreza comum que você usou na
   105) em cada oficina: soma na bem equipada e na de mestre, e não na comum? Se alguma conta não
   bater com a frase do autor, escreva o que ele decidiu e traga a divergência no PRECISA DE MIM,
   sem mudar a regra;
4. as linhas das escalas de semanas e de estações, uma a uma: qual vira obra e qual vira fabricação
   pelo critério novo. Liste no relato. Se alguma linha não couber claramente nos dois, pergunte.

**Fora:** G21 a G28, e qualquer outro texto.

## 3 · Fechar G29 e G18

Caixa `[x]` nas duas, com a decisão citada no item (a frase do autor, a data e o sha). Depois
`node scripts/gen-pendencias.mjs`, e o `Pendencias.md` entra no mesmo commit. **As citações de linha
do tema G que o texto novo deslocar são conferidas à mão**: o portão de procedência não as lê
(provado pela Revisora na 105).

## 4 · A prova

- `npm run validate` e `npm run build` verdes; o gancho roda o resto.
- Travessão lendo os arquivos, zero linha nova com travessão.
- O commit que toca `src/` abre com a linha do que muda para quem joga (quem ajuda a fabricar herda a
  oficina e o material; o braçal nunca soma numa espada; até dez ajudantes; obra é construção fixa ou
  escala de estações; a regra da metade é só para apoio numa jogada; sem migração).

## 5 · O relato

`106-executora.md`, as quatro seções, com o que mudou em cada arquivo, os shas publicados e as quatro
contas da seção 2.
