# Rodada 60 da revisora · rodada 76 do projeto · a Centelha no arredondamento, e os três furos do portão

Revisora: aviso em `810fd07`. BASE `6d26844`, SHA do trabalho `9827fba`, TOPO `810fd07`.
Este arquivo revisa a **rodada 76** do projeto; o contador da revisora é o 60.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `810fd07b40e527f7f91faaf68447b939f1ee467f`, e ele bate com
`git rev-parse origin/main`. Árvore limpa antes e depois da reancoragem, vinda de `f9d7ad9`.

A faixa `6d26844..9827fba` são dois commits e sete arquivos. Um deles, `b341f63`
(`ARQUITETO.md`, a regra §5.2.2), é do Arquiteto e não do trabalho.

**Coautoria:** limpa nos dois commits, procurando `co-authored`, `anthropic` e `claude-session`
na mensagem inteira pelo proxy.

**Travessão:** zero. O escopo junto do número: 132 linhas ADICIONADAS em `src/` e `scripts/`,
mais as 19 do `ARQUITETO.md`, contadas nas linhas adicionadas do diff lido pelo proxy.

**Os três furos da rodada 59 estão fechados, e eu refiz a prova de cada um:** a flag `i` está no
`VELHO`, `referencia.astro` é a quinta entrada de `ondeNaoPodeVoltar`, a palavra saiu de
`referencia.astro:170`, e a minha falsificação do `−99` no callout do Bram agora sai **vermelha**
(dois erros, um por lado, porque o exemplo é par e sem rótulo). O `CORRIGE 4` também fechou: a
`limiteNota` perdeu os pares, e o portão passou a vigiar o próprio bloco (`noDado`).

---

## 1 · A forma nova tem UM furo novo, e ele é falso VERDE

**O que eu medi antes de procurar furo, porque o extrator mudou de forma inteira:**

| o que | medida |
|---|---|
| "morre em" publicados no capítulo | 4 |
| pares emparelhados | 4, todos com o `PV N` certo |
| maior distância entre o `PV N` e o seu `morre em` | **167** caracteres, no callout do Bram |
| janela escolhida | 400, ou seja, margem de 2,4 vezes hoje |
| "morre em" sem par | vira ERRO, e não silêncio (medido: plantei um `morre em −50` solto e saiu `EXIT=1` nomeando a frase) |

**A trava de contagem é a melhor peça desta rodada:** ela é o que impede a forma nova de repetir
o defeito da antiga, porque um exemplo que o extrator não entenda aparece em vez de sumir.

**E a janela de 400 erra na direção segura**, com uma ressalva que vale escrita: um `PV N` longe
demais vira `semPar`, que é vermelho. O que ela não protege é o caso de haver, dentro dos 400, um
`PV N` que não seja exemplo de morte: aí o `.pop()` pega o mais próximo e emparelha errado. Hoje
não acontece, e eu medi em vez de supor: **todos os quatro `PV <número>` do capítulo são exemplos
de morte**. É o custo da janela, não um defeito dela.

### O furo está no rótulo, não no pareamento

`ladoDe` recebe `janela`, que é o texto **do `PV N` até o `morre em`**. Quando dois exemplos
compartilham o mesmo `PV N`, a janela do segundo contém o rótulo do primeiro, e como a negativa é
testada primeiro (decisão certa, e por um bom motivo escrito no comentário), o segundo exemplo
herda `semCentelha`.

**Medido, não deduzido.** Acrescentei ao capítulo, depois dos exemplos que existem:

```
Um **PV 41** sem Centelha morre em **−20**, e com Centelha morre em **−20**.
```

O segundo número está errado: com Centelha, `PV 41` morre em **−21**. O portão saiu **VERDE**,
`EXIT=0`. Restaurei do arquivo guardado antes e conferi `diff` vazio.

**Por que ele não dispara hoje, e esta é a parte que importa:** o capítulo repete o `PV 37` em
cada metade (`Um PV 37 sem Centelha morre em −18; o mesmo PV 37 de quem tem Centelha morre em
−19`), então cada janela começa depois do rótulo anterior. **É a redação do capítulo que segura o
portão, e não o contrário.** A forma de escrever mais natural para publicar os dois lados, com o
`PV N` dito uma vez só, é exatamente a que abre o buraco.

`CORRIGE 1`. O conserto é dela, e as duas saídas que eu enxergo custam o mesmo: cortar a janela no
`morre em` anterior (o rótulo não pode vir de antes de outro exemplo), ou exigir que o rótulo
esteja entre o `morre em` anterior e este. A primeira é uma linha no `slice`.

## 2 · A ressalva do `fail` que acumula FECHOU, refeita

Campo de volta a escalar (`"limiteArredonda": "baixo"`):

```
✘ Validação de dados FALHOU (1 erro(s)):
  • regras.json · morte.limiteArredonda precisa das duas direções (`M-21c`), cada uma
    "baixo" ou "alto": veio "baixo"
```

**Um erro só, e nenhuma conferência de exemplo depois dele.** Era isso que eu tinha medido em
aberto na rodada 59 (o bloco seguia com `Math.floor` de reserva no mesmo `EXIT=1`), e o
`arredondaOk` fecha.

**E fecha na medida certa, que é o detalhe que eu fui conferir:** o `if (arredondaOk)` envolve só
o que depende da régua. O `noDado` (o bloco não escreve exemplos) e o `VELHO` continuam rodando
fora dele, então uma régua quebrada não desliga as outras duas conferências. Parar demais teria
sido o conserto que fica verde por deixar de olhar, e não é o caso.

## 3 · O rótulo cobrado só no ímpar está CERTO, e não é o próximo furo

A pergunta do aviso é se um exemplo par com rótulo errado passar verde é aceitável. **É**, e não
por tolerância: em PV par as duas direções dão o mesmo número, então as duas afirmações são
verdadeiras. Não existe "rótulo errado" ali para a régua medir, e cobrar seria cobrar o que não se
mede, que é o defeito que o próprio controle de ocasião existe para evitar.

**E a trava dos dois lados não afrouxa por causa disso**, que era o risco real: ela conta só
exemplos que sobram resto (`sobraResto(p.pvMax) && ladoDe(...) === l`), então um capítulo que
perca o exemplo ímpar de um lado acusa mesmo que tenha um exemplo par rotulado no lugar.

**Uma coisa morta no meio disso, e é pequena:** `ladosVistos` é criado (`scripts/validate-data.mjs:352`)
e alimentado (`:361`), e **nunca é lido**. A trava final recomputa tudo com `pares.some(...)`. Não
muda comportamento nenhum; é a forma do mecanismo que nada executa, e o conserto é apagar as duas
linhas ou usá-lo na trava. `CORRIGE 2`, e é de higiene.

## 4 · Existe uma QUINTA regra órfã

**O escopo da minha varredura, dito em voz alta:** duas passadas sobre os doze JSONs de coisa que
um jogador compra (`tecnicas`, `artes`, `efeitos`, `caminhos`, `habilidades`,
`habilidades-secundarias`, `antecedentes`, `racas`, `virtudes`, `armas`, `armaduras`, `escudos`),
a primeira pelo vocabulário da trilha (`letal`, `nocaut`, `limiar de morte`, `não mata`, `desmaia`,
`inconsci`) e a segunda pelo vocabulário da morte (`morte`, `morrer`, `matar`, `ressuscit`,
`agonia`, `abaixo de zero`, `PV negativ`). O bestiário e os monstros ficaram de fora de propósito:
não são compráveis.

**A quinta é `ultimo-suspiro`** (`src/data/tecnicas.json` · Último Suspiro, caminho Carne Teimosa,
nível 5): *"no limiar da morte, realiza uma última ação heroica plena."*

**O argumento é o mesmo que pôs o `inquebrantavel` na lista, e a diferença importa:** "limiar de
morte" é literalmente a metade que a M-21 apagou da outra Técnica (`+1 ao limiar de morte`). Lá o
termo era um número a modificar, e por isso a decisão da mesa teve de mexer nele. Aqui ele é a
**condição de disparo**, e a M-21 mudou o que o limiar é e onde ele fica: hoje "no limiar da
morte" pode querer dizer Caído (Vida ≤ 0) ou perto de `−(PV ÷ 2)`, e são coisas diferentes numa
Técnica de nível 5. Não digo qual, e a decisão é da mesa.

**Três vizinhas que eu NÃO chamo de órfãs**, porque inflar a lista custaria a mesma coisa que
truncá-la: `imortalidade-tenue` (nível 6, "volta de golpes que matariam") e `recusa-a-morte`
(nível 6, "adia a própria morte") dependem do que é morrer mas não citam trilha nem limiar, e
ganham precisão em vez de perder chão; `efeitos.json` traz dois Efeitos que suspendem a morte
("não morre de sangramento enquanto a sua mão estiver nele", "quem está caindo não morre enquanto
durar") e os dois continuam funcionando. `encarar-a-morte` é falso positivo: é semblante e medo.

## 5 · A decisão `8629b83` dá ao portão uma garantia que ele não tem

Fora da faixa, e por isso `ESCALA`. A decisão fecha assim:

> o portão do `CORRIGE 1` da rodada 75 (insensível a caixa, com a tela da mesa dentro) é o que
> impede a quinta de aparecer depois.

**Isso é falso, e é medida.** Plantei `dano Letal não te mata enquanto durar` no texto de uma
Técnica comprável (`tecnicas.json`) e rodei: `EXIT=0`, **verde**. Restaurado, `diff` vazio.

O portão vigia cinco lugares, e nenhum deles é arquivo de regra comprável: os dois capítulos, a
tela da mesa, o `condicoes.json` e três blocos do `regras.json`. O comentário de escopo do próprio
portão diz isso com todas as letras, e está certo ao dizer. É a garantia correta sobre o eixo
errado: ele impede que a palavra volte **onde ele olha**, e a quinta regra órfã apareceu
justamente num arquivo que ele não olha. A prova pelos dois lados caiu no mesmo dia.

**O que eu não digo:** se o portão DEVE passar a olhar os arquivos de regra comprável. Ali a
palavra `Letal` é adjetivo legítimo em regra de outra família, e vigiar por palavra produziria
vermelho em texto certo. É decisão de regra, não conferência, como o comentário já diz. O que
precisa mudar é a frase da decisão, não necessariamente o portão.

**E uma nota de escopo sobre a flag `i`, que é o custo dela e não um defeito:** nos cinco lugares
vigiados a palavra `letal` está agora proibida em QUALQUER forma, inclusive como adjetivo comum
("dose letal", "ambientes letais"). Hoje nenhum dos cinco precisa dela, medido. Se um dia um deles
precisar, o vermelho vai ser verdadeiro sobre a palavra e falso sobre a regra.

---

## O veredito

**PROCEDE**, com dois `CORRIGE` e um `ESCALA`. Os cinco itens foram entregues, os três furos que
eu medi na rodada 59 estão fechados com as provas refeitas por mim, e a ressalva do `fail` fechou
na medida certa. A ordem (portão primeiro) foi seguida, e o primeiro sentido do ensaio saiu de
graça por causa dela.

**BLOQUEIA:** nada.

**CORRIGE:**

1. O `ladoDe` herda o rótulo do exemplo anterior quando dois exemplos compartilham o mesmo `PV N`.
   Medido: `PV 41 sem Centelha morre em −20, e com Centelha morre em −20` passa VERDE com o
   segundo número errado. Hoje só não dispara porque a redação do capítulo repete o `PV 37`.
2. `ladosVistos` (`scripts/validate-data.mjs:352`) é escrito e nunca lido. Higiene.

**ESCALA:**

1. A frase de `8629b83` atribui ao portão a garantia de impedir uma quinta regra órfã. Medido:
   `dano Letal` plantado numa Técnica passa verde. E a quinta existe: `ultimo-suspiro`, Carne
   Teimosa, nível 5, que dispara "no limiar da morte".

**PERGUNTA:** nenhuma. As quatro coisas que o aviso mandou julgar foram medidas, e cada
falsificação foi desfeita no mesmo fôlego, com `diff` vazio conferido.
