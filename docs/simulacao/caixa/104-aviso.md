# Rodada 104 · aviso de revisão · o link de "Perfuração" volta a ter um sentido só

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `52c7fa1` · o despacho da 104 |
| **SHA do trabalho** | `66da997` · a faixa é `52c7fa1..66da997` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

O §0.1, o §0.2, o §6 e o §7 do seu contrato valem. **Esta é a primeira rodada com o §0.1 corrigido
pelo seu CORRIGE da 102** (`c416a2c`) e com o §0.2 novo (`0a4b610`): leia os dois inteiros no passo 0,
e se algum estiver ambíguo ou errado, é o primeiro achado. **A faixa tem quatro commits, e só dois são
da rodada:** `0a4b610` (o `decisoes.md` e o §0.2) e `6ba50a2` (a PASSAGEM) são do Arquiteto, só
documento, e não entram na revisão; o trabalho é `f5d563c` e `66da997`.

## O que esta faixa faz

É o seu CORRIGE da 102, que o humano subiu na fila. Um arquivo de dado mudou: no `glossario.json`, o
verbete `perfuracao` passou a termo **"Nível de Perfuração"**, e o apelido "nível de perfuração" saiu
(virou o termo). O id não mudou. O relato (`104-executora.md`) traz a medição no navegador, com build
limpo: **antes 50 links para o gate, 24 no sentido do modo de dano; depois 20, zero no sentido
errado**, e a Penetração com os mesmos 6.

**O CI:** diga o estado pelo run inteiro.

## O que eu mais quero que você aperte

- **O zero.** Meça pelo seu medidor, com build limpo, e confira o antes (50 e 24, que é a sua
  medição da 102) e o depois. É o zero que fecha o CORRIGE: ele é RESULTADO ou ausência de medida (a
  forma "o zero ambíguo")? Por exemplo: o medidor espera o autolink terminar em todas as páginas, ou
  alguma pode ter sido lida antes?
- **Os 3 links novos** que o relato diz que entraram ("Resistência à Perfuração" em duas páginas e "o
  gate abre"): estão no sentido do gate? E o "Gate natural de Perfuração" da `mesa/referencia`, que
  segue link pela palavra "Gate": o autolink ainda casa "gate" em algum lugar onde a palavra não é o
  gate da Perfuração?
- **A promessa da 102, pelo outro lado.** O despacho da 102 prometia "quem procurar a palavra acha a
  regra certa". Com o termo "Nível de Perfuração", quem digita "perfuração" na consulta do glossário
  (a caixa de busca do `Referencias.astro`, e a busca do site) ainda acha o verbete do gate? E o
  verbete do modo de dano (`perfurante`)? Se a busca perdeu o gate, é achado.
- **Os 9 acertos do gate que deixaram de ser link** (seção 4 do relato): a lista está completa, e os
  dois caminhos que a Executora propõe para recuperar parte deles fazem sentido? É para o humano.
- **A lista de outros verbetes com a mesma forma** (seção 5: "alvo", "compostura", "poder",
  "esquiva", "manobra", "velocidade", "passiva", "Margem", "Nível"): ela não mediu quantos links
  errados cada um produz. Não precisa medir todos; diga se algum salta aos olhos como pior que a
  Perfuração era, porque isso decide a prioridade do que vem depois.
- **A resposta do J11** (seção 6): não existe portão que confira link automático, e o que ela descreve
  (instantâneo dos links por verbete e página, 376 s com navegador) é o desenho certo? O argumento
  contra a versão sem navegador (uma segunda cópia da regra de casamento, que diverge calada) se
  sustenta?
- Travessão, lendo os arquivos. O relato teve um na primeira versão, dentro da frase que falava de
  travessão, e o `66da997` o tirou.

Veredito em `docs/simulacao/caixa/104-revisora.md`, commitado e empurrado pela branch `revisora`. Me
diga o sha.
