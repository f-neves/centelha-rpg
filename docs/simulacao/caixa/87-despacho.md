# Rodada 87 · despacho · o portão que ficou intermitente, os CORRIGE da 86, e o Antecedente

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 20/09/2026
>
> A rodada 86 fechou com **PROCEDE** (`a6e7e41`, conferido ancestral do `main`).
> Progresso em `docs/simulacao/caixa/progresso-87.md`, relato em `87-executora.md`.
>
> **A ordem dos grupos não é sugestão.** O grupo 1 vem primeiro, sozinho, e o motivo está nele.

## Grupo 1 · o `test-grid` ficou intermitente, e ele é o portão

> ### ⛔ A PREMISSA DESTE GRUPO CAIU, e quem a derrubou foi a medida
>
> Escrito abaixo: *"desde as 22:26 de hoje"* e *"as quatro execuções de 19/09 fecharam todas
> verdes"*. As duas são falsas. A Executora mediu primeiro e eu conferi as duas eu mesmo:
>
> - **a mesma falha, palavra por palavra, está no log de 18/09/2026** · run `35324942959`,
>   commit `2054f9c`, 08:34, `conclusion: failure`. Não começou hoje, e naquele dia foram
>   **7 falhas em 12 execuções**;
> - **o verde de 19/09 não rodou a asserção.** No run `35444481487` (`057b339`, 19/09) e no
>   run `35544785956` (`fe09550`, verde desta noite), `há peça para arrastar e casa livre para
>   soltar` aparece **duas vezes** e `a peça saiu do lugar` / `mover custa de 2 a 7 idas ao
>   banco` aparecem **zero**. O `break` mudo do `test-grid.mjs:1089` pula as cinco asserções do
>   movimento quando não acha casa de destino, e a linha de fechamento ainda imprime
>   `Grid OK · desenho, movimento, registro, névoa e card`, **nomeando o que não rodou**.
>
> **O que isso muda na tarefa.** O item 4 ("o que mudou entre 19/09 e hoje") está respondido, e a
> resposta é *nada no repositório*: o que variou foi qual das duas saídas o portão deu. E o
> portão **não é intermitente**: ele é cego metade das vezes, e o vermelho é a metade honesta.
> A contagem "cinco de dez" também envelheceu no mesmo dia em que foi escrita: a Executora
> recontou e deu **8 de 17**.
>
> **Os quatro itens da tarefa continuam válidos como estão escritos**, e este carimbo não os
> substitui: ele diz o que já foi respondido, para ninguém gastar a medida duas vezes.


**Conferido por mim no `gh run list`, não relatado:** desde as 22:26 de hoje, dez execuções do
workflow `Validar dados e regras` fecharam e **cinco falharam**. Todas no mesmo job
(`Smoke · test-grid`) e com a mesma assinatura:

```
✘ Grid FALHOU (1 ou 2):
  • a peça saiu do lugar          (aparece em três das cinco)
  • mover custa de 2 a 7 idas ao banco (foram 0)     (aparece nas cinco)
```

**A falha não acompanha conteúdo.** Falharam commits que só tocam `docs/` (`f85b09e`, `08236a8`,
`0cd062d`) e passaram outros que só tocam `docs/` (`c38f909`, `e7fefd7`, `2215cfc`). As quatro
execuções de 19/09 fecharam **todas verdes**. Achado pela Revisora na rodada 86, que mediu e
**não ofereceu causa**; eu conferi e também não ofereço.

**Por que isto vem antes de tudo.** Um portão que falha metade das vezes deixa de ser portão: ele
ensina a ignorar vermelho. A história deste repositório tem o preço escrito · um `esc(...)` chamado
num arquivo sem `esc` passou por doze commits e ficou **três horas no ar** estourando a ficha, com
o CI vermelho e ninguém lendo. Estamos exatamente no estado que produz isso.

**E `foram 0` é a forma que o `CATALOGO` chama de zero ambíguo:** ou são zero idas medidas, ou a
cena não rodou e ninguém foi contado. As duas leituras dão o mesmo texto.

### A tarefa, e ela é DIAGNÓSTICO PRIMEIRO

**Não conserte antes de medir, e não me traga causa provável.** "Não investigado" é resposta
melhor que explicação errada.

1. **Reproduza.** Rode o `test-grid` localmente em laço, o número de vezes que for preciso para a
   falha aparecer, e diga **em quantas de quantas**. Se não reproduzir localmente em dez voltas,
   diga isso: "não reproduz aqui" é dado, e muda o diagnóstico para diferença de ambiente.
2. **Separe as duas leituras do zero.** A asserção conta idas ao banco. Descubra se o contador
   lê **depois** de as idas acontecerem ou se pode ler antes, e se a cena do `mover` chegou a
   montar. Instrumente se precisar, sem commitar a instrumentação.
3. **Diga se as duas falhas são uma ou duas.** "A peça saiu do lugar" aparece em três das cinco e
   "foram 0" nas cinco. Ou uma causa produz as duas, ou são duas coisas · e a resposta muda o
   conserto.
4. **O que mudou.** As quatro de 19/09 passaram e cinco de dez de hoje falharam. Procure o que
   mudou entre os dois dias **no que o teste toca**, e diga também se não achou nada.

**Só então o conserto**, e ele passa pelo ensaio dos três sentidos: vermelho hoje, verde com o
conserto sem tocar no arquivo do portão, vermelho de novo com a regressão de propósito.

**Se o diagnóstico apontar para regra de jogo ou para produção, pare e me diga.** Se apontar para
o instrumento, é seu.

**Commite o grupo 1 sozinho**, antes de abrir os outros.

## Grupo 2 · os CORRIGE da rodada 86

**5 · `relacoes-sociais.md:260`**, o parêntese *"(a com dado, a da ficha)"* na leitura do cortejo.
A Revisora achou que ele põe dois eixos diferentes como se fossem um, e que o segundo é exatamente
o que o `34e98a2` separou cinco parágrafos antes. **Ela diz no veredito que as duas leituras
possíveis do parêntese são defeituosas**: leia as duas no `86-revisora.md` antes de escrever, e
conserte o eixo, não a frase.

**6 · O `glossario.json`, verbete `defesa-social`, contra o `regras.json`,
`derivados.defesaSocial.reguaNota`.** O primeiro define a Defesa Social **incluindo o termo da
régua, sem nenhuma marca**; o segundo diz em tantas palavras que o termo *"não entra no número
parado que a ficha imprime"*. **São dois arquivos de dado do mesmo repositório discordando sobre o
mesmo número**, e os dois são fonte da verdade. O `regras.json` é o que está certo pela decisão da
rodada 84 (o termo é situacional, por relação, e não vai para a ficha); o glossário se corrige.

**7 · A frase do `86-executora.md` que declara o CI verde.** Ela citou `d56dfa1`, que não é a
última execução que fechou: fecharam cinco depois dele, duas em falha, e o `fd4497d` que falhou é
**anterior** ao que ela citou. O fato do **deploy** continua certo e conferido. Corrija o registro
para dizer o que foi medido e com que recorte · é a mesma régua que você aplicou ao gerador de
mermaid, agora virada para o próprio relato.

**8 · Duas contagens no `86-executora.md`.** A Revisora enumerou em vez de aceitar: a faixa tem
**11** commits e não 10, então **oito** são seus e não sete; e o relato diz "Cinco commits" com
**seis** na tabela logo abaixo. Nenhum achado muda. Corrija os dois números.

## Grupo 3 · o Antecedente, que ficou sem chão

O problema, o texto original e as três decisões do humano de 20/09/2026 estão **inteiros na versão
anterior deste arquivo** (commit `c38f909`, `git show c38f909:docs/simulacao/caixa/87-despacho.md`).
Leia de lá, porque a argumentação e os contras comprados não se resumem sem perder o porquê.

**O curto, para a tarefa:**

- o Antecedente **mexe no ponto de partida da régua** e deixa de ser bônus de jogada;
- o mecanismo é o **desconto nos passos para romper o Neutro**: nível N tira N dos 3; com 3 ou
  mais, rompe de cara em **+1 Simpatia**;
- os **três traços usam o mesmo desconto**, mudando só **quem alcança**: Reputação com quem já
  ouviu falar, Contato com o círculo dele, Posição com quem se importa com o posto.

A tarefa:

**9 · `antecedentes.md:72-74`**, a cláusula do situacional, reescrita: sai "jogadas que movem a
Régua de Relação", entra o desconto com os três escopos nomeados. Fica o teto de +6 e o "somam
entre si".

**10 · `antecedentes.md:195`** (Reputação) e **`:311`** (a Folha) · mesma regra, mesma redação.

**11 · `src/data/regras.json`, bloco `aparencia`, chave `nota`** · a oração *"que só move a Régua
de Relação, teto +6"* afirma a regra morta **no dado**, que é onde ela vence o capítulo. É o `E9`,
que você achou na 86 e a varredura da Revisora não alcançou.

**12 · Não toque** nas amarras de Contato (`:131`), Aliado (`:114`) e Posição (`:178`). Elas
continuam valendo como estão, e a da Posição está na lista do humano.

**13 · A conferência que eu quero escrita, por nome:** varra `src/` **inteiro, incluindo
`src/data/`**, pela afirmação e não pela palavra, e diga quais lugares ainda ligam Antecedente a
"jogada". A Revisora nomeou a própria falha aqui: na rodada 85 ela consertou o recorte de PADRÃO e
manteve um recorte de DIRETÓRIO, rodando em `chapters/`, `pages/` e `lib/` e deixando `src/data/`
de fora. **Diga o recorte ao lado do resultado.**

## O que NÃO é desta rodada

- **A leitura da via dupla do Contato**, que é minha e está no `c38f909`: o `:131` fala do contato
  em si, o desconto fala do círculo dele. Se estiver errada, o sintoma é um contato contando duas
  vezes com a mesma pessoa. Não a reabra, só não a contradiga;
- **a contradição da Posição** e **o repreçamento do Antecedente acima de 3 pontos** · na mesa do
  humano;
- **os 17 travessões de prosa do `regras.json`** (`J10`) · na mesa do humano, com os seis
  semânticos intocados;
- **o `E3`, os três passos do Neutro** · a Revisora mediu que eles estão em **cinco** lugares
  (`relacoes-sociais.md` `:102`, `:120`, `:264`, `:271`, mais o JSON), dois deles callouts cujas
  contas mudariam junto, e **zero detector**. É a fatura da dívida que eu assumi, é informação
  para o humano, e não é trabalho agora;
- **o `M-09`** · fechei eu, em `fb9310c`. Não é mais tarefa.
