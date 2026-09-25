# Rodada 108 · Executora · a "Compostura" volta ao Atributo, e o "alvo" deixa de ser Dificuldade

- **Despacho:** `docs/simulacao/caixa/108-despacho.md` (`626cc4e`).
- **Árvore:** branch `executora`, posta em `626cc4e` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-108.md`, com as horas lidas da máquina (as duas primeiras linhas saíram
  com a hora escrita de cabeça e foram corrigidas pela máquina antes de qualquer commit).
- **Publicado:** `a26fda1` (a Compostura), `050ba5f` (o "alvo"), e este relato num terceiro commit.
- **Parada:** fiquei ociosa de 14:10 a 15:47 esperando o aviso de uma tarefa em segundo plano que não
  chegou. O Arquiteto cobrou; daqui para frente a medição longa roda dentro do turno.

## ENTROU

### 1 · A Compostura (`a26fda1`)

`src/data/glossario.json`: o verbete `integridade` passa de `aliases: ["compostura"]` a `aliases: []`.

**O livro lido antes de tirar.** Nenhum capítulo usa "Compostura" no sentido da Integridade. O único
lugar que põe as duas lado a lado as separa: `src/content/chapters/habilidades.md:41`, "Esconder o que
sente é assunto de Compostura; Integridade é não ceder". A palavra minúscula, no sentido comum, aparece
5 vezes nos dados, e nenhuma mudou de texto:

- `src/data/glossario.json`, a definição da própria Integridade ("firmeza moral e compostura");
- `src/data/virtudes.json:118`, a conduta da Temperança ("Mantém a compostura...");
- três técnicas em `src/data/tecnicas.json`: Pesadelo Acordado (Sussurro, "quebra a compostura
  dele"), Calma Absoluta (Máscara Impassível, Atributo Compostura, "mantém compostura perfeita sob
  tortura") e Centrar-se (Mente Serena, "recupera a compostura após um susto").

**A prova: o link VOLTA para o Atributo.** Os 43 links de antes, por página, e para onde vai a
"Compostura" depois (antes é o código de `626cc4e`, depois é `050ba5f`):

| página | antes → `integridade` | antes → Atributo | depois → `integridade` | depois → Atributo |
|---|---|---|---|---|
| arvore | 1 | 1 | 0 | 1 |
| bestiario | 1 | 1 | 0 | 1 |
| caminhos/aura | 1 | 0 | 0 | 1 |
| caminhos/beleza-cativante | 1 | 0 | 0 | 1 |
| caminhos/camaleao | 1 | 0 | 0 | 1 |
| caminhos/mascara | 1 | 0 | 0 | 1 |
| caminhos/mascara-impassivel | 2 | 0 | 0 | 2 |
| caminhos/mente-serena | 1 | 0 | 0 | 1 |
| caminhos/porte-inabalavel | 3 | 0 | 0 | 3 |
| caminhos/semblante | 1 | 0 | 0 | 1 |
| caminhos/sussurro | 1 | 0 | 0 | 1 |
| ficha | 1 | 1 | 0 | 1 |
| regras/acoes-sentidos-e-engano | 2 | 0 | 0 | 2 |
| regras/aparencia-virtudes-vontade | 1 | 2 | 0 | 2 |
| regras/atributos | 3 | 0 | 0 | 3 |
| regras/centelha | 1 | 0 | 0 | 1 |
| regras/combate | 1 | 0 | 0 | 1 |
| regras/coracao-do-sistema | 1 | 0 | 0 | 1 |
| regras/criacao-de-personagem | 6 | 0 | 0 | 6 |
| regras/defesas | 2 | 1 | 0 | 3 |
| regras/habilidades | 2 | 1 | 0 | 3 |
| regras/habilidades-secundarias | 1 | 0 | 0 | 1 |
| regras/racas | 4 | 0 | 0 | 4 |
| regras/relacoes-sociais | 3 | 0 | 0 | 3 |
| tecnicas | 1 | 1 | 0 | 1 |
| **total** | **43** | **8** | **0** | **46** |

**Dos 43, 38 viraram link novo do Atributo** na mesma página e palavra (a foto casa a saída com a
entrada). **Nos outros 5** (arvore, bestiario, ficha, aparencia-virtudes-vontade, tecnicas) o escopo
já tinha UM link do Atributo, numa "Compostura" mais adiante. O autolink dá um link por verbete por
bloco (`src/components/Referencias.astro`, o `used` por bloco), e antes a Integridade, que entra antes
no índice, ficava com a primeira ocorrência e o Atributo com a segunda. Agora o Atributo fica com a
primeira, que é a que era da Integridade (a ordem do documento, lida na medição, mostra isso), e a
segunda fica sem link. Então, contando por ocorrência, **as 43 que eram da Integridade vão hoje para
o Atributo**; o Atributo tem 38 links a mais no site, e não 43, porque 5 palavras seguintes perderam
o link que tinham. Duas dessas 5 eram o substantivo comum ("quebra a compostura dele" na ficha,
"recupera a compostura após um susto" nas técnicas).

**Onde o link leva:** o Atributo entra no `ref-index` com url `regras/atributos`, sem `#` (todo
Atributo é assim em `src/pages/ref-index.json.ts`). O link abre a página dos Atributos, e o hovercard
resolve pelo `data-ref="compostura"`. Não mexi no `ref-index`.

### 2 · O "alvo" (`050ba5f`)

`src/data/glossario.json`: o verbete `dificuldade` passa de `aliases: ["dif", "alvo"]` a
`aliases: ["dif"]`.

**O caso foi o segundo: a palavra só sai.** Procurei no livro (`src/content/**`, `src/data/*.json`
fora do bestiário, páginas e componentes) uma expressão de dono único: não há "número-alvo" nem
"valor-alvo". O sentido de Dificuldade escrito com "alvo" aparece só em "acima do alvo" (a definição
de Margem no glossário, e `acoes-e-sistema`: "A cada 6 pontos acima do alvo, uma Margem"), que não
nomeia a Dificuldade sozinho, e na definição da própria Dificuldade. Nada entrou como apelido.

**Antes 278 links "alvo" para `glossario#dificuldade` em 43 páginas; depois zero.**

### 3 · A foto por (verbete, página, palavra)

A chave é `ref | href | página | palavra`, contada como multiconjunto; o script casa cada saída com
uma entrada na mesma página e palavra (reencaminhado) e lista o que sobra dos dois lados.
**`antes` contra `depois2`, sem o bestiário** (ver seção 4):

- **reencaminhados: 38**, todos `integridade (glossario#integridade)` para `compostura (regras/atributos)`;
- **saídos sem par: 281** = 277 "alvo" de `dificuldade` (o 278º está no bestiário) + 4 "Compostura"
  de `integridade` (os 5 da seção 1 menos o do bestiário);
- **entrados sem par: 4**, todos no sentido certo e explicados pela vaga de um link por bloco:
  - "Dif" para `dificuldade` em `mestre`, no bloco "a Dif vira a Defesa Social do alvo";
  - "Dificuldade" em `regras/acoes-e-sistema`, no bloco "A cada 6 pontos acima do alvo, uma Margem.
    Ela não escolhe a Dificuldade...";
  - "Dificuldade" em `regras/coracao-do-sistema`, no bloco "o total supera o alvo: a Defesa de um
    inimigo ou a Dificuldade de uma tarefa";
  - "Integridade" para `glossario#integridade` na `ficha` (no primeiro conserto; a vaga da Integridade
    no escopo era gasta pela "Compostura"). O mesmo aconteceu no bestiário, que fica fora da conta.
- **Nenhum outro verbete ganhou ou perdeu link.**

### 4 · O instrumento, e o controle negativo

- **Medidor:** `../tmp/executora/medir-108.mjs`, feito do `medir-autolink-rev.mjs` da Revisora na 104
  (copiado para `../tmp/executora/` com o `medir-autolink.mjs`, que não usei). As duas defesas dela
  ficam: por página, só lê depois de o `ref-index.json` ter sido pedido E a contagem de `a.ref` parar
  por três leituras seguidas, e grava por página se pediu o índice e se estabilizou. A diferença: lê
  TODOS os `a.ref`, com `ref`, `href` e palavra. A foto é o `foto-108.mjs`, no mesmo lugar.
- **Build limpo antes de cada medição**: `.astro/` e `dist/` apagados, só da minha árvore. Quatro
  medições (antes, depois1, depois2, controle), todas com 107 páginas, 0 erro e as mesmas 6 páginas
  sem índice e sem estabilizar (`mesa/arquivos`, `combate`, `diario`, `grid`, `grupo`, `mapas`, que
  não carregam o autolink); essas ficam fora da comparação.
- **O bestiário é ruído do instrumento.** Na medição do "alvo" entraram 131 links sem par, todos no
  `bestiario` (defesa, absorção, iniciativa, porte, velocidade, magia). Medi a página 4 vezes seguidas
  no MESMO `dist/`: **493, 882, 747 e 493 links**, a última esperando 20 leituras paradas em vez de 3. O
  autolink roda uma vez, e pega os cartões que existirem naquele instante; esperar mais não resolve.
  Nas medições antes e depois1 ele deu 617 as duas vezes, por acaso. Por isso a foto final é sem ele.
- **Controle negativo:** num comando só, o glossário novo guardado, o `glossario-antes.json`
  (md5 `86b0ea5b...`, o de `626cc4e`) posto de volta, build limpo, medição, e o glossário novo
  restaurado (md5 `68e0631e...`, igual ao de `050ba5f` pelo `git show`). **Reproduziu 43 links
  "Compostura" para `integridade` em 25 páginas e 278 "alvo" para `dificuldade` em 43 páginas.** A foto
  do controle contra a medição antes deu **zero diferença fora do bestiário** (131 a mais nele, o
  ruído do item acima). Depois, build limpo final do código commitado.

### 5 · Os portões

- `npm run validate` e `npm run build` verdes, no build final do código de `050ba5f`; o gancho de
  `pre-commit` verde nos dois commits (os logs em `../tmp/executora/commit1.log` e `commit2.log`).
- As mensagens dos dois commits abrem com a linha para quem joga ("Compostura" passa a levar ao
  Atributo; "alvo" deixa de levar à Dificuldade; sem migração).

## PRECISA DE MIM

1. **O bestiário não mede.** Qualquer foto de autolink que inclua o `bestiario` vai acusar centenas de
   links que não mudaram. O medidor precisaria esperar o bestiário terminar de montar os cartões (ou o
   bestiário chamar o autolink de novo quando termina); é outro assunto, e não mexi.
2. **5 "Compostura" seguintes perderam o link do Atributo** (seção 1). É a regra de um link por
   verbete por bloco funcionando, e não defeito deste conserto; digo porque o número de links do
   Atributo cresce 38, e não 43.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
