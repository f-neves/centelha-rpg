# Rodada 39 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  93b6be74dcb949acdaf990befa58dd492a0d9e0a
SHA   7ad7da79bd5151a088c6cabe2cd8bdb0b77fcd90
TOPO  7ad7da79bd5151a088c6cabe2cd8bdb0b77fcd90
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada; aqui é só o inventário.

| arquivo | o que mudou nele |
|---|---|
| `.github/workflows/validate.yml` | `test-l67-corpoacorpo-mesa` entra na matriz do smoke do CI |
| `Pendencias.md` | L67 marcado resolvido (Executora); L75 medido e fechado sem obra (Arquiteto, fora desta rodada) |
| `docs/simulacao/CATALOGO.md` | entrada nova do Arquiteto sobre commit perdido em `HEAD` destacado (fora desta rodada) |
| `docs/simulacao/ESTADO.md` | reaponte do Arquiteto: linhas de grid.astro deslocadas pelos meus edits |
| `docs/simulacao/VOZ.md` | reaponte do Arquiteto: linhas de grid.astro deslocadas pelos meus edits |
| `package.json` | `corpoacorpo-mesa` novo, e `test-l67-corpoacorpo-mesa` entra no `smoke` |
| `scripts/mesa-mock.mjs` | cena nova `?cena=corpoacorpo`: um Aboleth parado e duas peças (perseguição e deslocamento puro) |
| `scripts/test-combate-tempo.mjs` | testes puros do terceiro parâmetro (`raioAlvoHex`) de `alcancaNoCorpoACorpo` |
| `scripts/test-grid.mjs` | `cenaVozPrazo`: prova ao vivo do prazo do L71 contra um modelo presente e corrompido |
| `scripts/test-l67-corpoacorpo-mesa.mjs` | novo: prova as duas metades do critério de aceitação do L67 |
| `src/lib/alcance.ts` | `alcancaNoCorpoACorpo` ganha o terceiro parâmetro `raioAlvoHex`, com o clamp de não encurtar |
| `src/pages/mesa/grid.astro` | `?vozprazo=` (L71); `raioExtraHex` novo e os oito lugares de alcance somando o raio do alvo (L67); `window.__ESPELHO.posDe`/`distHex` |

## O ACHADO DO INDEXEDDB POR ORIGEM (item 1, L71)

Provar o prazo do L71 (`scripts/test-grid.mjs`, `cenaVozPrazo`) exigia servir um `model.tar.gz`
PRESENTE e CORROMPIDO via `page.setRequestInterception`, sem tocar no arquivo real versionado.
Isolado, o teste passava limpo. Rodando a BATERIA INTEIRA (`npm run smoke`), ele passava também,
só que com o modelo BOM, sem provar nada sobre o prazo, e isso quase foi para produção.

**A causa é uma família de falso-verde que não tem nada a ver com voz.** O `vosk-browser` extrai o
modelo para um sistema de arquivos que persiste em IndexedDB **por origem**, não por página: uma
cena anterior da mesma bateria (`cenaVozConsentimento`/`cenaVozMagia`) já tinha carregado o modelo
de verdade, e uma página nova comum do Puppeteer acha o modelo já extraído no IndexedDB daquela
origem e nunca torna a pedir o `.tar.gz`. Qualquer cena que dependa de estado por origem
(IndexedDB, `localStorage`, Cache Storage, service worker) herda o que a cena anterior deixou, e o
Grid guarda várias coisas em `localStorage`, e isto não é peculiaridade da voz.

**O instinto normal de depuração leva para o lado errado.** Tentei `page.setCacheEnabled(false)` e
o `Network.clearBrowserCache` do CDP, que é o que qualquer um tentaria primeiro; nenhum dos dois
resolve, porque não é cache HTTP.

**E o resultado é contraintuitivo: isolar a cena TERIA ESCONDIDO o defeito, e rodar a bateria
inteira foi o que REVELOU.** Isolar costuma ser a boa prática de teste; aqui era o isolamento que
mascarava o problema, porque só a bateria inteira reproduz a ordem em que as cenas de voz se
acumulam na mesma origem.

**A saída é reaproveitável para qualquer cena futura nesta família:** `br.createBrowserContext()`
(`cenaVozPrazo`, `scripts/test-grid.mjs`) dá armazenamento isolado de verdade, sem herdar nada das
cenas anteriores: técnica de bateria, não desta cena específica.

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 7 | lugares do levantamento original do L67 que mediam alcance do centro (bateu com o número do Arquiteto) | `Pendencias.md:4002` |
| 8 | lugares de verdade, contando o achado ao vivo (`declararGolpe` reimplementava a conta inline) | `src/pages/mesa/grid.astro:8179` |
| 3 | a distância (hexágonos) em que a perseguição contra um alvo Enorme para, na cena de teste | `scripts/test-l67-corpoacorpo-mesa.mjs:61` |
| `Math.ceil(...)` | o arredondamento de `raioExtraHex`, para cima e não para o chão | `src/pages/mesa/grid.astro:3346` |
| 3º parâmetro | `raioAlvoHex` novo em `alcancaNoCorpoACorpo`, com o clamp de alvo pequeno na própria função | `src/lib/alcance.ts:88-93` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D39a | Corrigir o oitavo lugar (`declararGolpe`, a prévia de Ticks em `viagemAtual`) achado testando ao vivo, em vez de tratar como fora de escopo por não estar no levantamento estático | risco de o "sete" do Arquiteto parecer contestado; registrei com todas as letras que o levantamento contou certo os lugares que chamam a régua por NOME, e este era a mesma régua copiada à mão · sem o conserto a caixa de declaração mentia o Tick do golpe (achado com `test-grid-simultaneo.mjs` quebrando, não com inspeção) |
| D39b | Trocar `Math.floor` (implícito na comparação `<=`) por `Math.ceil` em `raioExtraHex`, em vez de manter a conta "ingênua" (metros/escala sem arredondar) | um Tick a mais de viagem para todo alvo maior que Médio (a perseguição chega mais devagar do que a conta ingênua prometeria) · sem isto os círculos do atacante e do alvo continuavam se sobrepondo na parada, o próprio defeito que o L67 existe para fechar, só que um hexágono mais perto |
| D39c | Não estender a régua nova a `scripts/sim/motor.mjs` (o motor da bateria de simulação, que tem seu próprio "CERCADO NÃO É PRESO" comentado, mas é um espelho separado do código) | a bateria de 1000 batalhas segue medindo perseguição centro a centro; fora do escopo do L67 (que lista só `grid.astro`/`alcance.ts`), registro aqui para não ficar silencioso |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **L70 não foi tocado**, por decisão explícita do Arquiteto ("saiu deste item de propósito"): a
  gravação de `avancarTickSimultaneo` continua sem passar pela checagem de ocupação. O caminho do
  L67 passou perto dele (a mesma função, as mesmas linhas de `caminharHex`) e não desviou.
- `scripts/sim/motor.mjs` não ganhou o raio do alvo (D39c, acima): a bateria de 1000 batalhas
  segue centro a centro. Não é item novo, é o registro de que ficou de fora.
- A voz (item 1, L71) segue sem cobertura de duas coisas que o próprio aviso da rodada 38 já
  registrava em aberto: só 3 das ~9 telas dinâmicas exercitadas ao vivo, e nenhuma prova com fala
  de verdade (áudio), só com o roteador de texto que simula o reconhecimento.
- **Nada aqui precisa do humano.** As duas decisões de arredondamento (D39b) e de escopo (D39c)
  são de engenharia, dentro do que o L67 já decidiu.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-l71-l67.md` · as linhas de 04:20 e 05:22 (os dois achados de teste,
  com a conta geométrica do arredondamento)
- `Pendencias.md` · L67 (a regra decidida) e L71 (o prazo)
- `scripts/test-l67-corpoacorpo-mesa.mjs` · as duas asserções do critério de aceitação
- `scripts/test-grid.mjs` · `cenaVozPrazo`, com o comentário sobre o achado do IndexedDB por origem
