# Rodada 87 · Executora · progresso

> **Correção deste arquivo, feita às 20:53 do dia 20/09/2026.** As primeiras linhas traziam
> horas que eu NÃO li do relógio: escrevi várias etapas num `write` só e carimbei horários
> aproximados, alguns adiante do relógio da máquina. O Arquiteto mediu o `mtime` e pegou.
> Reescrevi: ficou com hora só a etapa cuja hora eu tenho medida (leitura de `date`, ou o
> carimbo de início/fim que o próprio run gravou no log), e as outras ficaram **sem hora**.
> Etapa sem hora é honesta; hora inventada não é.

- **20:29** · rodada aberta. `git pull --rebase` ok (já em `fe09550`). Árvore com o mesmo
  não rastreado de outra frente (`caixa/jogador-novo-bestiario.md`), não encostei. Despacho lido:
  grupo 1 é DIAGNÓSTICO do `test-grid` intermitente, sozinho e antes de tudo.
- *(sem hora medida)* · levantei o histórico real no `gh run list` antes de teorizar: das **17**
  execuções do workflow que fecharam hoje, **8 falharam** (`b22129f`, `099d50b`, `fd4497d`,
  `6509801`, `f85b09e`, `08236a8`, `0cd062d`, `4e56aa8`). O despacho fala em 5 de 10 e a conta só
  cresceu desde que ele foi escrito.
- *(sem hora medida)* · baixei o log do `4e56aa8`: a cena do `mover` RODA DUAS VEZES (blocos nas
  linhas 106-113 e 209-216 do log) e nos dois a asserção vizinha **"o movimento escreveu no
  registro" PASSOU** (43 → 48 e 57 → 60 linhas). No primeiro bloco `a peça saiu do lugar` falhou e
  no segundo passou, com `foram 0` nos dois.
- **20:32:47** · disparei o `test-grid` local pela primeira vez (carimbo do próprio log).
- **20:36:46** · ele terminou: **exit 1**, 3m59s, falhando em `mover custa de 2 a 7 idas ao banco
  (foram 0)`. **Reproduz aqui, 1 de 1**, numa máquina só, sem nenhuma execução concorrente.
- *(sem hora medida)* · baixei o log do job de um run VERDE de hoje (`2215cfc`) e de um VERDE de
  19/09 (`057b339`), pelo `rtk proxy gh run view --job <id> --log`, porque o `gh run view --job`
  puro é interceptado pelo hook. **Nos dois, as asserções do `mover` NÃO APARECEM**: só "há peça
  para arrastar" e "escreveu no registro". O verde de 19/09 não é prova de que a medida passava, é
  prova de que ela não rodou. O bloco tem um `break` mudo (`if (!q?.para) break`) que pula TODAS as
  asserções quando `pontos()` não acha casa de destino na segunda volta.
- *(sem hora medida)* · conferido o que mudou no repositório entre 19/09 e hoje, no que o teste
  toca: nada. O último commit em `src/pages/mesa/`, `scripts/mesa-mock.mjs` ou
  `scripts/test-grid.mjs` é de 17/09 (`03aebf2`, reaponte de citação), e `.github/`,
  `package.json`, `package-lock.json`, `astro.bancada.mjs` e os três helpers de teste não mudam
  desde antes de 15/09.
- **20:38:13** · sonda de diagnóstico (scratchpad, não vai para o repositório) rodada três vezes,
  repetindo só o bloco do `mover` com instrumentação. Resultado idêntico nas três.
  **O zero NÃO é janela curta:** medi o log do mock em 100, 200, 400, 700, 1500 e 3000 ms e ele
  fica em 0 nos seis, com o registro parado no mesmo número. Nenhuma escrita acontece, nunca.
  **E a medida é por VOLTA**, que é o que o teste não faz: o `registro 43 → 47` que passa no teste
  é da volta de AQUECIMENTO; na volta de medir o registro não anda.
- **20:38:48** · sonda 2, imprimindo o diálogo: depois do arrasto há um `dialog.mesa-dlg` ABERTO
  dizendo **"Criatura 9: não é a vez dele"** · e a peça que o teste achava que estava arrastando é
  a "Herói 1", que tem a classe `vez`. O diálogo cobre **312 dos 384 hexágonos**, e é por isso que
  a volta seguinte não acha casa de destino e cai no `break`.
- **20:39:39** · sonda 3, a medida que fecha o caso: `document.elementFromPoint` no ponto exato do
  clique devolve **"Criatura 9"**, e os retângulos de DUAS peças cobrem aquele ponto
  (`[Herói 1, Criatura 9]`). O `pontos()` escolhe a peça pela ORDEM NO DOM e o mouse pega a que
  está POR CIMA. Na cena de 30 o mesmo: o teste mira "Criatura 19" e o ponteiro pega "Criatura 6".
  **O aplicativo está certo em tudo**: arrastar peça fora da vez abre a pergunta do L68, que não
  grava nada. O defeito é do instrumento.
- *(sem hora medida)* · conserto escrito em `scripts/test-grid.mjs`, três mudanças, uma por
  defeito medido: o `pontos()` passa a exigir que o ponteiro pegue aquela mesma peça e prefere a
  que está NA VEZ; o `break` mudo virou `ok(false, ...)` dizendo quantos hexágonos estão cobertos e
  qual diálogo está aberto; e o `andou` passa a medir a peça arrastada pelo `data-c`, não o
  primeiro `.gr-token` do documento. Mais uma asserção nova: soltar a peça moveu, não abriu
  pergunta.
- **20:45:52** · primeiro run com o conserto: **exit 1, duas falhas**, e o recado novo já pagou por
  si. Nas duas cenas a volta de aquecimento move de verdade (registro 43 → 47) e a de medir para,
  dizendo `o movimento não foi medido`. O portão parou de fechar verde sem medir.
- **20:46:43** · sonda 4, com o diagnóstico impresso de dentro da página: na cena de 12, das 12
  peças **7 estão no palco e 4 são pegáveis**, e **nenhuma das pegáveis está na vez** · a
  "Herói 1", que é a da vez, tem a "Criatura 9" em cima do centro dela. Era isso que fazia o
  conserto parar: eu exigia que o ponteiro pegasse a peça NO CENTRO, e o centro da peça certa está
  tapado.
- *(sem hora medida)* · **a premissa do despacho envelheceu, e eu medi em vez de repetir:** a mesma
  falha, palavra por palavra (`a peça saiu do lugar` + `mover custa ... (foram 0)`), está no log do
  job de **18/09/2026** (run `35324942959`, commit `2054f9c`, 08:34). Naquele dia foram **7 falhas
  em 12 execuções**. Não começou às 22:26 de hoje: começou pelo menos dois dias antes.
- **20:51:49** · segundo run com o conserto: as duas cenas dizem `o movimento não foi medido` com o
  motivo à vista · `384 de 384 hexágonos cobertos, diálogo aberto: mesa-dlg`, e **0 peças na vez
  dentro do palco**. Quem abre o diálogo é a volta de AQUECIMENTO. Preferir a peça da vez não
  basta: pode não haver nenhuma naquele instante.
- **20:52:21** · conserto ajustado de novo com o que a medida mostrou: o `pontos()` procura um
  PONTO LIVRE da peça (centro e mais oito em volta), separa `de` (onde pegar) de `centro` (de onde
  ela saiu), e o enquadramento no palco deixou de valer para a peça de origem (vale para a casa de
  destino). O recado passou a dizer quantas peças na vez existem no tabuleiro inteiro. Terceiro run
  disparado; ainda não sei o resultado.
- **20:55:47** · (carimbo do log) terceiro run: **exit 0, VERDE, e com as asserções do movimento
  APARECENDO nas duas cenas**, cada uma com `mover custa de 2 a 7 idas ao banco (foram 4)`. Não
  precisou montar ocasião nem mover o bloco: havia peça na vez, ela só não era pegável no centro
  nem cabia inteira no enquadramento do palco.
- **20:58:24** · a hora, conferida nas duas fontes desta máquina, e a saída crua vai aqui porque o
  Arquiteto pediu: `date` (Git Bash) devolveu `Sun Sep 20 20:58:24 2026` e `date "+%H:%M:%S %z"`
  devolveu `20:58:24 -0300`; o PowerShell, no mesmo comando, devolveu `20:58:24 -03:00`. As duas
  batem entre si e batem com o relógio que ele leu. **A fonte de hora não está torta**: o desvio
  que ele mediu era das linhas que eu escrevi sem ler o relógio, e essas saíram do arquivo.
- *(sem hora medida)* · controle negativo montado: plantei `if (1) return;` antes do
  `porNoMapa(...)` no `grid.astro` (arquivo limpo antes, conferido), para o soltar não mover nada.
  Com o conserto de pé, o teste ficou **vermelho nas duas asserções que importam**
  (`✘ a peça saiu do lugar` e `✘ mover custa de 2 a 7 idas ao banco (foram 0)`), enquanto
  `soltar a peça moveu, não abriu pergunta` continuou verde, que é o esperado: não houve diálogo,
  houve movimento nenhum. O terceiro sentido fecha.
- **21:09:35** · (carimbo do log) run final, já com a linha que diz quem foi arrastado:
  **exit 0**, e ela responde com número a pergunta que decidiria o desenho do conserto ·
  `arrastei "Criatura 9", na vez · 2 peça(s) na vez no tabuleiro, 10 pegável(is) de 12` e
  `arrastei "Criatura 18", na vez · 1 peça(s) na vez no tabuleiro, 21 pegável(is) de 30`.
  **Não é zero**: havia peça na vez nas duas cenas, e as duas foram arrastadas na vez delas.
- *(sem hora medida)* · pendência nova escrita no `J-infraestrutura.md`, nomeada e não numerada
  (a linha de fechamento do teste, que é texto fixo), e o placar do índice refeito: 248 → 249
  itens, 172 → 173 abertos.
- *(sem hora medida)* · grupo 1 commitado sozinho e empurrado: `e94cdb6`, sete arquivos, com o
  `CATALOGO.md` entrando por autorização expressa do Arquiteto depois de ele corrigir a própria
  linha 40, que era o que segurava o portão vermelho para todo mundo.
- *(sem hora medida)* · grupo 2 feito e empurrado: `3dd2ac6`. O `:260` do capítulo social deixou
  de juntar dois eixos num parêntese: a leitura do cortejo rola contra a Defesa Social com dado e
  **sem** o termo da régua, e o capítulo agora diz por quê (ler não aquece nem esfria, e o termo
  só existe em cima de um ataque que rema contra ou a favor · é o que o
  `derivados.defesaSocial.reguaNota` define). O `glossario.json` parou de somar o termo dentro da
  fórmula. E as duas correções de registro: o meu relato da 86 (oito commits meus, seis com
  mudança na tabela; e a frase do CI reescrita dizendo o recorte que ela media) e o `86-aviso.md`
  (dez → onze commits, sete → oito meus, contados um a um).
- **21:16:53** · `npm run validate` rodado por mim antes de commitar o grupo 3: **exit 0**.
- **21:17:41** · grupo 3 empurrado: `b903a26`. E o achado que muda o alvo do conserto: a amarra da
  Reputação vive em `src/data/antecedentes.json`, e o catálogo do capítulo é **gerado** dela
  (`gen-cap-antecedentes.mjs`, com `--check` no `validate`). Eu tinha escrito à mão dentro do
  bloco gerado; a edição morreria no próximo regen, e o portão teria pegado. Consertado na fonte e
  regerado.
- **21:17:41** · item 13, a varredura, com o recorte dito ao lado: `os.walk('src')` inteiro, 164 a
  170 arquivos conforme o filtro, **incluindo `src/data/`**, de linha em linha e depois de novo por
  PARÁGRAFO (para não perder afirmação quebrada em duas linhas), casando qualquer de
  `antecedent|reputaç|contato|posição` com qualquer de
  `jogada|rolagem|bônus|turbina|buffa|move a régua|situacional`, e lendo cada acerto.
  Único `.json` fora: o `diagramas.json`, que é cache de SVG e não tem prosa.
  **Resultado: nenhum terceiro lugar.** Sobra só a amarra da Posição (`antecedentes.md:183` e a
  fonte dela, `antecedentes.json:213`), que o despacho mandou não tocar e está na mesa do humano.
  As buscas por `jogadas que movem`, `situacional de Antecedente` e `pilha situacional` devolvem
  **zero** em `src/`.

## A emenda do CI, depois de a rodada fechar

- *(sem hora medida)* · o `e94cdb6` fechou **verde** no CI (run `35546855058`), mas o `3dd2ac6`,
  que só toca `relacoes-sociais.md` e `glossario.json`, fechou **vermelho** na asserção NOVA.
  Baixei o log do job (`106174713361`) e li inline, em vez de aceitar a posição do resumo:
  `há peça para arrastar` passou às **00:17:08.606** e a falha veio às **00:17:11.017**, 2,4 s
  depois, que é o tempo de UMA volta de arrasto. O resumo que aparece perto do bloco da lembrança
  é impresso às **00:26:56**, dez minutos depois do evento, e não diz onde ele aconteceu.
  Isso derruba a hipótese de resíduo do bloco anterior: diálogo sobrando teria coberto os 1200
  hexágonos já no `há peça para arrastar`, que passou.
- *(sem hora medida)* · a causa é minha, da primeira versão do conserto: o `pontos()` PREFERE a
  peça na vez, mas tinha um **fallback** para qualquer peça pegável quando nenhuma na vez estava
  desimpedida. No CI da cena de 30 ele caiu nesse fallback, a volta de AQUECIMENTO arrastou peça
  fora da vez, o Grid perguntou (L68) e o diálogo cobriu o tabuleiro para a volta de medir.
  Local, em quatro rodadas, nunca caiu nele.
- **22:09:44** · (carimbo do log) segunda emenda rodada local: **exit 0**, com as duas cenas
  medindo e as linhas novas por volta ·
  `[aquece] vou arrastar "Criatura 9", na vez · 1 na vez no tabuleiro, 9 pegável(is) de 12` e
  `[aquece] vou arrastar "Criatura 21", na vez · 1 na vez no tabuleiro, 21 pegável(is) de 30`.
  As quatro mudanças: o fallback morreu (fora da vez não se arrasta, e a falha diz as
  contagens), a pergunta depois de soltar vale nas DUAS voltas (o diálogo é fechado **depois** de
  anotado, para a volta seguinte ainda medir), higiene na entrada do bloco contra diálogo de
  qualquer bloco anterior, e uma linha de log por volta.
