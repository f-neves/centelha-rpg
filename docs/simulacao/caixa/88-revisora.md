# Rodada 88 · veredito

Reancorada em `f417f93` (um commit à frente do aviso `5572be9`/faixa `a6e7e41..4450055`, conforme
explicado pelo Arquiteto: preserva achado próprio da leitura de novato, fora deste escopo).

**Veredito geral: PROCEDE nas três partes, com uma PERGUNTA (não bloqueia).**

## Parte 1 · rodada 87 (`fe09550..7d263e3` + `6cf5449`)

**PROCEDE.**

- **Grupo 1** (`e94cdb6` + emenda `6cf5449`): o `break` mudo virou falha alta nomeada; a escolha
  de peça passou de "primeira do DOM" para "quem o ponteiro pega, priorizando quem está na vez"; a
  medição do deslocamento segue a peça certa por `data-c`. `node scripts/test-grid.mjs` rodado três
  vezes nesta sessão, `exit 0` e `Grid OK` nas três, com as asserções de movimento aparecendo de
  fato no log (`a peça saiu do lugar`, `soltar a peça moveu, não abriu pergunta`) — o portão agora
  mede o que anuncia. `6cf5449` é auto-descoberta do próprio CI (peça fora da vez no aquecimento),
  corrigida sem esconder sintoma. Fora de escopo: um `TypeError` isolado num teste de diálogo de
  conjurar apareceu em uma das três rodadas e não reproduziu nas outras duas; não é código tocado
  aqui, registro como possível instabilidade de ambiente a acompanhar.
- **Grupo 2** (CORRIGE da rodada 86, `3dd2ac6`): os quatro itens (5, 6, 7, 8) do despacho conferem
  contra `86-revisora.md` linha a linha: o parêntese do cortejo nomeia o eixo com o porquê, o
  `glossario.json` parou de contradizer `regras.json`, as duas contagens do `86-executora.md`
  foram corrigidas para o medido de fato. "Com dado, sem o termo" é aplicação direta de
  `reguaNota`, não decisão nova.
- **Grupo 3** (Antecedente, `b903a26`): `antecedentes.json`, `antecedentes.md` (gerado,
  `gen-cap-antecedentes.mjs --check` em dia) e `regras.json → aparencia.nota` consistentes.
  Varredura por `jogadas? que (movem|move) a Régua` e "situacional de Antecedente" em `src/`
  inteiro: zero ocorrências. A amarra da Posição não foi tocada.

## Parte 2 · leitura de novato (`85a97fe..d31ab72`)

**PROCEDE nos quatro itens, uma PERGUNTA no item 2.**

- **Veneno** (`034d002`): `venenos.json` bate número por número com a tabela do capítulo e com a
  decisão (6 venenos, Potência/Início/Intervalo/Pool/Tipo/Penalidade mínima); `condicoes.json`
  aponta pro veneno como relógio real; as 4 vias de entrada e a penalidade de toque (−4)
  documentadas nos dois lugares.
- **Balde B** (`89bdddf`): Meio-Orc e espada Excepcional batem com §4a. **PERGUNTA:** o parágrafo
  logo abaixo da tabela em `acoes-oficio-e-mundo.md`, não tocado pelo commit, continua afirmando
  que a oficina de mestre, o bônus do ofício geral e a Especialidade são o que torna viável, mas
  §4a diz que os três não têm valor definido e que ~15 semanas é o número que a conta já produz
  sem eles. A correção da tabela deixou esse parágrafo contraditório com ela mesma. Fôlego da
  Alabarda conferido: `MODULOS.folego = false`, registro sem código correto.
- **Limiares de Ferimento** (`2b08d7a`/`9d0c54a`/`0934136`+`6e8651e`), o item apertado a pedido:
  `regras.json → ferimentos` bate exatamente com §4f (Machucado −2/0/−2, Grave 0/−1/−4, Crítico
  0/−2/−8, Incapacitado null). `mesa-core.ts`: `penAcaoDados` novo, `penTexto` com `sinal()`,
  sentinela `penAcao == null` preservado. `ajAtq`/`ataqueAtual` somam `penAcaoDados` na MESMA
  variável (`ajAtq.dados`) que alimenta tanto a exibição quanto a rolagem real — sem segundo ponto
  de decisão divergente. `penDefesa` continua flat nos dois lugares (decisão §4f item 2). Frenesi
  bate com §4c. `vida-ferimentos-cura.md:52` ainda diz "Caído" (capítulo fora do commit por
  decisão, já registrado como pendência pela Executora) — não bloqueia.
- **Nadar/Escalar** (`73c4874`/`c494958`/`d31ab72`): fórmula e curva de carga batem com §4e; as
  três águas bravas (Dif 11/14/18) confirmadas SEM a curva nova, nota explícita no capítulo contra
  duplicar calibração.

## Parte 3 · P0 (`888a196`) + item 6 (`4450055`)

**PROCEDE.**

- **P0**: a guarda de `roladaManual` agora usa `dadosAjustados(baseDadosDeExpr(expr),
  extraDados)`, a MESMA função que `rolarExpr` usa — fonte única, não terceira leitura divergente.
  Confirmado que `contaDoLance`/`rolarAcerto` somam pela mesma variável (`ajAtq.dados`). As 3
  asserções novas em `test-rolada-manual.mjs` cobrem o caso do bug (`"0d6 +N"`) e a borda saudável
  (pool com 1+ dado). Falsificado: revertendo a guarda para o texto antigo, os testes do caso
  `"0d6"` falham exatamente com o sintoma (total dobrado); restaurado, 18/18 verde.
- **Item 6**: piso condicional de `rolarExpr` reutiliza o mesmo `dadosAjustados`. A exclusão
  `gateResvalou` em `test-lance.mjs` é cirúrgica: medido direto na fixture, 741 lances batem
  `gate && perfurante && (acerto|raspao)`, só 243 têm `danoBruto === 0` e são de fato excluídos.
  Removendo a exclusão, exatamente 240 desses 243 divergem só em campos de dano/PV, nenhuma
  divergência fora do conjunto marcado — não esconde outro defeito por trás.

## Falsificação e limpeza

Todas as reversões de falsificação (Parte 1 grupo 1, Parte 3 P0 e item 6) foram desfeitas antes do
fechamento. `git status --short` limpo (só `progresso-revisora-88.md`, novo, não rastreado) e HEAD
em `f417f93`, conferido depois de todo o trabalho.
