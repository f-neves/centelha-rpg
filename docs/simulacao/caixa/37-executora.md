# Rodada 37 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  22b97a17caae7495ff943296a7279fed93f3a617
SHA   4ab1a58fcf0653ce833a9308b6bcfb3d85ed6642
TOPO  4ab1a58fcf0653ce833a9308b6bcfb3d85ed6642
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

**Quatro commits nesta rodada, autores diferentes**: `85b69a3` e `dc7f965` são da Executora (o
código, o teste e o progresso da pergunta de consentimento); `9b35c78` e `4ab1a58` são do
Arquiteto (o reaponte, e o modelo versionado, fechando o `D33b` só DEPOIS do commit da
Executora — é a ordem que esta rodada existe para garantir, ver "O QUE EU DECIDI").

**`4ab1a58` traz um binário de 31 MB** (`public/voz-modelo/model.tar.gz`) — **é o maior commit
da história deste repositório**. A Revisora precisa saber disso antes de abrir o diff: não é
código para ler linha a linha, é o modelo do Vosk sendo versionado de propósito (decisão 14 do
`VOZ.md` §10.2).

| arquivo | quem | o que mudou nele |
|---|---|---|
| `.gitignore` | Arquiteto | tira `public/voz-modelo/` do ignorado; registra a regra "um modelo versionado por vez" |
| `Pendencias.md` | Arquiteto | reaponta as citações a `grid.astro` deslocadas pelo `85b69a3` |
| `docs/simulacao/CATALOGO.md` | Arquiteto, fora desta rodada (commit `3750118`, já em `main` antes de eu começar) | registra o achado L74 (costura de teste que recalcula em vez de observar) |
| `docs/simulacao/ESTADO.md` | Arquiteto | mesma reaponte |
| `docs/simulacao/VOZ.md` | Arquiteto | mesma reaponte, e as decisões **14** (o modelo versionado) e **15** (a porta do consentimento) no §10.2, com os contras aceitos escritos; o §9.8 deixa de listar o peso em produção como pergunta aberta |
| `docs/simulacao/caixa/progresso-voz-consentimento.md` | Executora | o levantamento, os dois achados de teste e a medição, com os horários |
| `public/voz-modelo/model.tar.gz` | Arquiteto | **novo, 31 MB**: o modelo do Vosk, versionado (decisão 14) |
| `scripts/test-grid.mjs` | Executora | ganha a cena `cenaVozConsentimento` (no `smoke`) |
| `src/pages/mesa/grid.astro` | Executora | **o item desta rodada**: `VOZ_CONSENTE_KEY`/`lerConsentimentoVoz`/`gravarConsentimentoVoz`/`perguntarConsentimentoVoz`, encaixados em `segurarVoz` antes de `carregarVoz` |
| `voz-bench-README.md` | Arquiteto | nota: a bancada (`voz-bench.html`) continua com cópia própria fora do versionamento; só o Grid ganhou o modelo versionado |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 13 asserções, 0 falhas | a pergunta antes de baixar, testada ao vivo contra a bancada | `scripts/test-grid.mjs:2800` (`cenaVozConsentimento`), rodado nesta sessão; entra em `npm run smoke` |
| 1549 ms | o custo real de esperar o carregamento terminar (com o modelo presente de verdade) antes do próximo passo do cenário | medido nesta sessão, ao vivo, no commit avisado, segurando `#gr-voz` e cronometrando do clique em "Baixar" até o status virar "modelo carregado" |
| 31 MB / ~32.452.448 bytes | o tamanho do modelo versionado em `4ab1a58` | `git show --stat 4ab1a58` (`public/voz-modelo/model.tar.gz \| Bin 0 -> 32452448 bytes`) |
| 75 citações de código conferidas, 0 quebradas | `npm run validate`/`test-procedencia.mjs` no commit avisado, depois da reaponte do Arquiteto | rodado nesta sessão, neste commit; `node scripts/test-procedencia.mjs` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D37a | **A ORDEM ENTRE A PORTA E O MODELO NÃO É DETALHE, É O PONTO DA RODADA, e foi respeitada dos dois lados.** Eu commitei a pergunta de consentimento (`85b69a3`) sem versionar o modelo (que continuava fora do `.gitignore`, gitignorado). O Arquiteto só versionou o modelo (`4ab1a58`) DEPOIS de ver meu commit na árvore. Se a ordem fosse invertida — modelo versionado primeiro, pergunta depois — qualquer site publicado nesse intervalo (ou qualquer aparelho que buscasse `main` nesse meio-tempo) baixaria 31 MB no primeiro toque do microfone, inclusive celular, sem nunca ter sido perguntado — exatamente o que a decisão 15 existe para impedir | custo: nenhum de código; o custo é de disciplina de sequência entre duas frentes, e a prova de que ela foi seguida é a ordem dos shas neste próprio aviso (85b69a3 antes de 4ab1a58) |
| D37b | **MANTIVE A ESPERA DO CARREGAMENTO DE VERDADE NO PASSO 5 DO TESTE, EM VEZ DE CORTAR ASSIM QUE "GUARDOU"/"FECHOU" PASSAREM** (o Arquiteto perguntou se valia o custo, antes do reaponte). Medido: 1549 ms com o modelo presente (tabela de números acima). É pequeno, e há uma razão além do custo: esperar o carregamento de verdade terminar é a ÚNICA passagem de `npm run smoke` pelo caminho real de `carregarVoz` com um modelo de verdade presente — cortar cedo trocaria essa cobertura por nada, já que "guardou" e "a pergunta fechou" (as duas asserções que aconteceriam de qualquer jeito) não provam que o carregamento em si continua funcionando depois da porta | custo: ~1,5s a mais em toda rodada de `npm run smoke`, que passa a acontecer sempre agora que o modelo é sempre-presente em todo clone (antes, era condicional a alguém ter baixado à mão) |
| D37c | **UM FALSO POSITIVO DO `test-portoes.mjs` FOI CONSERTADO REESCREVENDO A FRASE, NÃO ACRESCENTANDO ISENÇÃO.** Meu comentário "SOLTAR não trava nada" em `test-grid.mjs` batia no gatilho de tolerância (`/não trava/i`, pensado para achar coisas como "checagem desativada, não trava o build") por acidente de vocabulário — o mesmo tipo de caso que `test-grid-simultaneo.mjs` já tem registrado em `NAO_E_TOLERANCIA` (`test-portoes.mjs`) para frases como "o relógio não trava"/"o clique NÃO trava". Eu tive as duas saídas disponíveis: reescrever a frase, ou acrescentar uma entrada nova em `NAO_E_TOLERANCIA` isentando esta ocorrência. Escolhi reescrever porque é o arquivo do Arquiteto, e porque acrescentar isenção sem necessidade real (o comentário não precisava exatamente daquelas palavras) enfraquece o portão para o próximo caso genuíno — a lista de isenções existe para quando reescrever não é possível ou perderia sentido, não como primeira saída | custo: nenhum — a frase nova ("soltar o botão depois é inofensivo") diz a mesma coisa, sem o vocabulário que colide |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **O MICROFONE NÃO FOI TESTADO, e isto é por desenho, não descuido.** `cenaVozConsentimento`
  prova a porta (a pergunta, o guardar, o status, o bloqueio de armazenamento) inteiramente por
  clique real em botões reais de diálogos reais — nenhuma linha simula reconhecimento de fala. O
  passo que espera o carregamento de verdade terminar (D37b) prova que `carregarVoz` continua
  funcionando depois da porta, mas isso é WASM/modelo carregando, não voz sendo OUVIDA — a taxa de
  reconhecimento continua sendo bancada do humano, como em toda rodada anterior desta frente.
- Nada mais precisa do humano nesta rodada; o resto é revisão de código.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/VOZ.md` · §10.2 decisões 14 (modelo versionado) e 15 (a porta do
  consentimento), com os contras aceitos; §9.8 (o peso em produção deixou de ser pergunta aberta)
- `src/pages/mesa/grid.astro` · `VOZ_CONSENTE_KEY`/`lerConsentimentoVoz`/`gravarConsentimentoVoz`/
  `perguntarConsentimentoVoz`, e o encaixe em `segurarVoz` (D37a)
- `scripts/test-grid.mjs:2800` (`cenaVozConsentimento`) · a prova; o comentário reescrito perto
  da linha 2832 (D37c)
- `.gitignore` · a regra "um modelo versionado por vez"
- `docs/simulacao/caixa/progresso-voz-consentimento.md` · o levantamento completo, os dois
  achados de teste e a medição, com os horários
