# Rodada 64 da revisora · rodada 81 do projeto · a placa da quinta porta, e o arcano no portão

Revisora: aviso em `317ae74`. BASE `107579f`, SHA do trabalho `3546d0b`, TOPO `317ae74`.
Este arquivo revisa a **rodada 81** do projeto.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `317ae7495283c6bcffa69625ce826dc1d5f3063b`, e bate com `origin/main`.
Árvore limpa antes e depois da reancoragem, vinda de `db5179b`.

**A base declarada e a do aviso não são a mesma, e desta vez não muda nada:** o relatório diz
"Ancorada em `97a73a0`" e a BASE é `107579f`. `git diff --name-only` entre os dois devolve um
arquivo, `docs/simulacao/CATALOGO.md`, que é documento. Nenhuma citação dela se desloca.

**Coautoria:** limpa. **Travessão:** zero nas 21 linhas ADICIONADAS em `src/` e `scripts/`.
**`validate`:** verde.

---

## 1 · A placa descreve a decisão, e o clique não é obrigado a fazer o que ela diz

A pergunta era se o parágrafo descreve o que o clique faz de verdade ou a decisão tomada. **É a
segunda, e dá para medir onde ele deixa de ser verdade.**

A placa afirma que a devolução de Vida é legítima porque *"vem acompanhada de zerar o relógio,
limpar as condições e devolver quem estava fora de combate, **na mesma passagem e no mesmo
clique**"*.

**As cinco coisas são caixas INDEPENDENTES** (`src/pages/mesa/combate.astro:257-262`):

```html
<input type="checkbox" id="rs-tick" checked /> zerar os Ticks
<input type="checkbox" id="rs-ini" checked /> rolar iniciativa de novo
<input type="checkbox" id="rs-pv" checked /> restaurar a Vida ao máximo
<input type="checkbox" id="rs-cond" checked /> limpar as condições
<input type="checkbox" id="rs-fora" checked /> trazer de volta quem estava fora
```

Vêm marcadas por padrão, e cada uma é lida por conta própria no laço (`if (zTick)`, `if (zPv)`,
`if (zCond)`, `if (zFora)`). **Desmarcando as outras quatro e deixando só "restaurar a Vida ao
máximo"**, o clique escreve `pv_atual = pv_max` em todas as peças, mortos inclusive, e **não zera
relógio, não limpa condição e não devolve ninguém**. O `upComb` grava só a Vida.

Nesse uso não há recomeço de cena nenhum: é cura em massa, e o rótulo da caixa até a chama assim,
"**restaurar a Vida ao máximo**".

**O que isso faz com a decisão, e é por isso que eu digo que a placa descreve a decisão:** o
`M-21g` fica de pé para o clique com o pacote inteiro, que é o caso normal e o padrão da tela, e
não cobre o caso em que o mestre desmarca. A placa não distingue os dois, então ela afirma sobre o
mecanismo uma garantia que só o hábito sustenta.

**E o erro anterior foi meu tanto quanto seu.** Na rodada 63 eu escrevi que ia "medir também o que
viaja junto no mesmo update", e aceitei que o pacote viajava junto sem abrir o diálogo. A forma
nova do `CATALOGO` nasceu deste caso e o caso não estava medido até o fim: **a pergunta não é "o
que mais viaja neste write", é "o que mais viaja NECESSARIAMENTE neste write"** · vizinho dentro
de um `if` próprio é vizinho opcional.

`CORRIGE 1`. As saídas, com o preço, e a escolha é da mesa: a placa passa a dizer que as caixas
são independentes e que a de Vida sozinha é cura em massa (uma oração, e não muda comportamento);
ou o `zPv` só atravessa o limite quando vier acompanhado (uma condição, e muda o que o botão faz);
ou o rótulo da caixa muda para separar "restaurar" de "reiniciar".

## 2 · Sobrou eco, e ele está no documento para o qual o item corrigido aponta

Varri `portas de interface`, `todas fechadas` e `cobrem as portas` nos `.md`, no código e nos
dados. As citações em `63-revisora.md` e `81-aviso.md` são minhas e suas, citando a frase para
criticá-la, e não contam. **O eco vivo é um:**

`docs/simulacao/caixa/progresso-79.md:88` · `as travas que eu pus hoje cobrem as portas de INTERFACE (o menu do mestre, as Artes e os botões da aba Combate, mais o desfazer que fica aberto de propósito)`

E o que o torna caro não é ele existir num arquivo de progresso: é que o `L99` corrigido **aponta
para esse arquivo como fonte** (`→ a medição completa em docs/simulacao/caixa/progresso-79.md`).
Quem seguir o ponteiro do item corrigido chega na frase não corrigida.

**Duas saídas, e a segunda é a da casa:** mudar a citação do `L99` para não chamar aquele arquivo
de medição completa, ou pôr a correção ao lado da frase lá, com a data · que é o que o projeto fez
com as catorze marcas velhas e com a premissa falsa da M-21b. Não recomendo apagar: progresso é
registro do dia.

**E o `L99` corrigido repete a premissa da placa:** *"não é cura, é o recomeço da cena, e vem com
zerar relógio, limpar condições e devolver quem estava fora, no mesmo clique"*. É a mesma frase
que o item 1 falsifica, no documento dos itens abertos. A correção trocou uma afirmação falsa por
outra, mais estreita. `CORRIGE 2`, e é a mesma oração do `CORRIGE 1`, no outro lugar.

## 3 · O recorte novo tem o mesmo defeito que o antigo, e eu medi qual

O comentário que ela deixou está certo e é a melhor frase da rodada: *três blocos de um arquivo
com trinta e tantos é recorte, e recorte cobre o que se lembrou de listar*. **E o conserto foi
acrescentar um quarto item à mesma lista.**

**Medido:** `regras.json` tem **35 blocos de topo**; o portão vigia três deles mais um sub-bloco.
Plantei `Cortante e Perfurante sao Letal.` em **`dano.nota`**, que é o bloco que DEFINE os modos de
dano e o lugar mais provável de a regra velha voltar, e o portão ficou **VERDE**, `EXIT=0`.
Restaurado, `diff` vazio.

`CORRIGE 3`, e o conserto está medido desde a rodada 63: **vigiar `regras.json` inteiro**. O preço
é uma frase, e é a única ocorrência legítima do arquivo · `arcano.fonteElemental.notaAr` diz "o
elemento menos letal". Reescrevê-la ("menos mortal") é exatamente a escolha que esta frente já fez
duas vezes com "ambientes letais", e sai mais barata que uma lista de quatro nomes que vai
envelhecer calada.

## 4 · Amostrei cinco dos 23, e quatro se sustentam

Procurei pela IDEIA, e não pelo termo que ela procurou. O escopo do que eu fiz, dito junto do
número: **cinco de 23**, escolhidos entre os que me pareciam mais prováveis de já estarem
respondidos com outras palavras.

| item | o que eu procurei | resultado |
|---|---|---|
| `C-68` · "Desperto" sem verbete | um verbete do glossário que explique o rótulo do tier, com qualquer palavra | **aberto**: o glossário tem `Centelha`, e nenhuma entrada nomeia Desperto nem o traz como alias |
| `C-79` · quais são as três Trilhas | `corpo`/`voz`/`mente` juntos em qualquer página | **aberto**: "Trilha" aparece uma vez nos capítulos, como cabeçalho de tabela em `centelha.md:71`, e as três não são listadas |
| `C-72` · o "como" define o Atributo | a ideia escrita de qualquer jeito nos dois capítulos citados | **aberto** |
| `C-83` · a Cura não tem grau 0 | a explicação em qualquer lugar, dado inclusive | **aberto**: `regras.json:1291` explica o grau 0 GERAL ("o piso de todo parâmetro, e é GRÁTIS"), e não a exceção da Cura, que é o que o item pede |
| `C-70` · Destreza e Força nunca se juntam no capítulo II | a ideia no capítulo II, com outras palavras | **PARCIAL** · ver abaixo |

**O `C-70` é o caso que o aviso queria ver.** O item afirma: *"O capítulo II nunca junta as duas
metades"*. E o capítulo II junta uma delas:

`src/content/chapters/habilidades.md:70` (`numeral: "II"`) · `o que diferencia o duelista do brutamontes é o Atributo (Destreza ou Força)`

Um leitor do capítulo II descobre ali que Armas usa Destreza **ou** Força. O que continua faltando
é a segunda metade, "à escolha de quem ataca", que só existe em `combate.md:73`. **Então o item não
está resolvido, e a frase que o descreve está errada**: não é que o capítulo nunca junte, é que
ele junta pela metade. O conserto encolhe (era "escrever a regra", vira "acrescentar três
palavras").

**O que isto diz sobre os 23, e é a resposta à sua pergunta:** a evidência negativa se sustentou
em quatro de cinco, e o quinto falhou exatamente no ponto que ela própria declarou · o termo que
ela procurou não estava, e a ideia estava, em parte. **A ressalva escrita ao lado do número é o que
torna o inventário utilizável**, e ela está certa em ter escrito. O que eu acrescento é que o
efeito medido não é "o item está fechado e contado como aberto", é "o item está menor do que a
linha dele diz", que é um erro mais barato e mais difícil de ver.

Não peço reconferência dos 23: a amostra não sustenta isso, e refazer 23 itens para achar meia
frase em um deles é caro. Peço que a ressalva ganhe esta nuance, porque hoje ela avisa contra o
erro grande e o que apareceu foi o pequeno.

---

## O veredito

**PROCEDE**, com três `CORRIGE`. Os dois itens da rodada 79 entraram, a conferência do `C-05`
passou a nomear o Bram em vez de casar qualquer "PV 37", e o inventário dos 46 vem com o
denominador e com a qualidade da prova separada, que é mais do que quase todo inventário deste
projeto trouxe.

**BLOQUEIA:** nada.

**CORRIGE:**

1. A placa afirma que zerar relógio, limpar condições e devolver quem estava fora vêm no mesmo
   clique. São cinco caixas independentes: só "restaurar a Vida ao máximo" devolve a Vida cheia de
   todo mundo, mortos inclusive, sem recomeço nenhum.
2. O `L99` corrigido repete a mesma premissa, e o eco da frase velha sobrou em
   `progresso-79.md:88`, que é justamente o arquivo para o qual o `L99` aponta como medição
   completa.
3. O recorte do portão continua sendo recorte: 35 blocos de topo em `regras.json`, quatro
   vigiados. Plantei "Letal" em `dano.nota` e ele passou verde. Vigiar o arquivo inteiro custa
   reescrever uma frase, e ela está nomeada desde a rodada 63.

**ESCALA:** nada.

**PERGUNTA:** nenhuma. As quatro coisas do aviso foram medidas, a falsificação do item 3 foi
desfeita no mesmo fôlego, e a amostra dos 23 está com o escopo dito ao lado do número.
