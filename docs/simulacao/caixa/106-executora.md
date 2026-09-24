# Rodada 106 · Executora · o que a condução herda, o que é obra, e as três regras de ajuda

- **Despacho:** `docs/simulacao/caixa/106-despacho.md` (`5407b38`).
- **Árvore:** branch `executora`, posta em `5407b38` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-106.md`, com as horas lidas da máquina.

## As quatro contas (seção 2 do despacho), feitas antes de qualquer texto novo

Lidas do livro em `5407b38`.

### 1 · A tabela de Oficina e Material

`acoes-oficio-e-mundo.md:108-111`, cabeçalho `| | −4 | −2 | +0 | +2 | +4 |`:

| | −4 | −2 | +0 | +2 | +4 |
|---|---|---|---|---|---|
| Oficina | de mestre, completa | bem equipada | oficina comum | ferramenta de campo | improviso, sem bancada |
| Material | excepcional, raro | selecionado | corrente | de segunda, remendado | sucata |

O capítulo não diz ali sobre qual número o sinal age (só "São os ±2 e ±4 de circunstância", `:106`);
o documento de regra diz: o cabeçalho é `| | −4 na Dificuldade | −2 | +0 | +2 | +4 |`
(`Acoes_Sistema.md:1172`, antes do texto novo). Então oficina e material **somam à Dificuldade**:
a oficina de mestre a baixa 4, o improviso a sobe 4, e o mesmo com o material. Os dois eixos se
somam entre si.

### 2 · O braçal contra a espada

Média 7 (`acoes-oficio-e-mundo.md:121` em `5407b38`: "O braçal tem média 7"), sem o ofício: +4
pessoal (`:47`, "Sem o ofício específico, a Dificuldade sobe +4"). Espada Comum, Dificuldade 7
(`:93`). Com material corrente:

| Oficina | Dificuldade para ele | Média 7 soma? |
|---|:--:|:--:|
| de mestre | 7 − 4 + 4 = 7 | não (0) |
| bem equipada | 7 − 2 + 4 = 9 | não |
| comum | 7 + 4 = 11 | não |
| de campo | 13 | não |
| improviso | 15 | não |

**Pela oficina, bate com o autor: não soma em nenhuma.** Mas o material também entra, e com ele a
conta muda:

| Oficina + material | Dificuldade para ele | Soma |
|---|:--:|:--:|
| de mestre + excepcional | 7 − 4 − 4 + 4 = 3 | **4** |
| de mestre + selecionado | 7 − 4 − 2 + 4 = 5 | **2** |
| bem equipada + excepcional | 7 − 2 − 4 + 4 = 5 | **2** |
| bem equipada + selecionado | 7 | não |
| comum + excepcional | 7 | não |

**Divergência, vai para PRECISA DE MIM:** com material selecionado ou excepcional numa oficina boa, o
braçal soma. Escrevi a frase do autor como ele decidiu ("em nenhuma oficina", com a conta da
oficina de mestre), e não "nunca".

### 3 · O aprendiz, Habilidade 1 e 2, com a Destreza comum da 105

Destreza 2 ("Comum. A média das pessoas", `atributos.md:23`). Tem o ofício (Ferreiro 1 ou 2),
então não leva o +4. Média pela régua de `acoes-e-sistema.md:94-105`: soma 3 dá 5,5; soma 4 dá 7.
Material corrente:

| Oficina | Dificuldade | Hab 1 (média 5,5) | Hab 2 (média 7) |
|---|:--:|:--:|:--:|
| de mestre | 3 | soma 2,5 | soma 4 |
| bem equipada | 5 | soma 0,5 | soma 2 |
| comum | 7 | não | não (0) |
| de campo | 9 | não | não |
| improviso | 11 | não | não |

**Bate com o autor:** os dois somam na bem equipada e na de mestre, e nenhum soma na comum. O
aprendiz de Habilidade 1 na bem equipada soma meio ponto por dia, o que é pouco mas passa.

### 4 · As escalas de semanas e de estações pelo critério novo

Critério do autor: obra é construção fixa no lugar (casa, celeiro, forja, moinho, muralha, ponte,
catedral) ou peça da escala de estações; todo o resto é fabricação; não depende do ofício da linha.

| Linha (`acoes-oficio-e-mundo.md`, em `5407b38`) | Lado | Por quê |
|---|---|---|
| `:165` Casa de madeira, celeiro | obra | construção fixa, nomeada pelo autor |
| `:166` Cota de malha | fabricação | peça |
| `:167` Brigandina | fabricação | peça |
| `:168` Lamelar | fabricação | peça |
| `:169` Carroça, barco de pesca | fabricação | o autor diz as duas |
| `:170` Forja, moinho, oficina montada | obra | forja e moinho nomeados; a oficina montada é o mesmo edifício da mesma linha |
| `:171` Placa de munição | fabricação | peça |
| `:172` Placa completa sob medida | fabricação | peça |
| `:178` Casa de pedra, torre pequena | obra | escala de estações |
| `:179` Muralha, ponte de pedra | obra | escala de estações, e nomeadas |
| `:180` Navio de guerra, catedral | obra | escala de estações; o autor diz o navio |

Nenhuma das onze fica em dúvida. **Uma fora das duas escalas fica:** `:150`, "Porta, banco, mesa
tosca, cerca de 20 m", na escala de dias, junta peças (banco, mesa) e uma cerca, que pelo critério
novo ("construção fixa no lugar") pode ser obra. Não mexi: vai para PRECISA DE MIM.

## ENTROU

- **Publicado:** o texto em `b396c83` (fast-forward de `5407b38`); o fechamento da G18 e da G29,
  este relato e o progresso no commit seguinte, cujo sha vai na mensagem ao Arquiteto.

### 1 · Capítulo de ofício, `src/content/chapters/acoes-oficio-e-mundo.md` (`b396c83`)

- `:8`, o topo: em vez de "as regras de ajuda estão em A Régua Comum", diz que lá está "o apoio numa
  jogada única", e que "O trabalho dividido do ofício tem regra própria: a condução e a direção de
  obra, em Oficina, material e ajuda" (link para a âncora `#oficina-material-e-ajuda`, conferida no
  `dist/`).
- `:115`, Ajuda: o exemplo velho dos aprendizes sai do fim do parágrafo.
- `:117`, novo: a ajuda da Régua Comum (metade, +1 a cada 6) é para apoio numa jogada única, e o
  trabalho divisível, uma Longa com Acúmulo, tem condução (fabricação) e direção (obra).
- `:119`, a fórmula da condução, igual.
- `:121`, novo: a condução herda os modificadores (oficina e material valem para todos; o +4 de quem
  não tem o ofício é pessoal); até dez ajudantes por artesão; os aprendizes dispensam o Requisito 3 e
  somam o que passar da Dificuldade que a oficina deixou.
- `:123`, novo: o braçal não soma na espada em nenhuma oficina (7 − 4 + 4 = 7 na de mestre); os
  aprendizes de Habilidade 1 ou 2 somam numa bem equipada ou de mestre; e o exemplo do autor, "numa
  oficina bem equipada ou de mestre, dez aprendizes aceleram uma espada Comum e não fazem uma Ótima".
- `:125`, Direção de obra: a lista velha ("alvenaria, engenharia, ..., as obras das escalas de
  semanas e de estações") dá lugar ao critério do autor, com a carroça e o barco na fabricação e o
  navio na obra.
- `:129`, o fecho da Direção: "Na forja, na bancada e no tear, a Dificuldade 4 não vale" virou "Na
  fabricação, a Dificuldade 4 não vale: quem ajuda trabalha sob condução". Motivo: pelo critério
  novo, construir uma forja é obra, e "na forja" ficaria ambíguo.

### 2 · Régua Comum, `src/content/chapters/acoes-e-sistema.md` (`b396c83`)

- `:172`, Ajudante: "numa tarefa que outra pessoa realiza, em apoio numa jogada única, numa ação que
  não se divide". **O exemplo "forjar" saiu** e entrou "abrir uma fechadura" (o exemplo de ação
  indivisível do próprio `Acoes_Sistema.md` §3.5): forjar é trabalho divisível, e deixá-lo ali
  contradiria a decisão.
- `:174`, novo: o trabalho divisível não usa esta regra; condução e direção, com link para Ofício e
  Mundo.
- `:180`, a fórmula: "Ajudante, em apoio numa jogada única: ...".

### 3 · Documento de regra, `Acoes_Sistema.md` (`b396c83`)

- §3.5, `:262-264`: "Somar Acúmulo" ganha a frase de que, no ofício, o divisível tem condução e
  direção (§7.6).
- §3.5, `:267-274`, "Apoiar o principal": a tabela (mesma Dificuldade, +2, +1d6 por Margem) e o
  parágrafo das Firulas saem; entra a regra publicada (metade da Dificuldade, arredondada para cima,
  +1 a cada 6 acima), com a data da decisão e o que valia antes.
- **Duas referências à tabela que saiu:** `:284` (teste coletivo, "pela tabela de apoio acima") e
  `:642` (escalar, "pela tabela da §3.5") passam a "regra". Só a palavra.
- §7.6, `:1186-1222`: o mesmo do capítulo (a separação apoio e divisível, a herança, o +4 pessoal,
  a trava de dez, as consequências, o exemplo novo, o critério de obra, o fecho).
- §7.3, `:1076-1079`, não mudou: as duas exceções da 105 continuam certas com o texto novo.

### 4 · Citações de linha deslocadas (`b396c83`)

Mapeei as citações do `G-acoes-sistema.md` pelos hunks do `git diff -U0` (script no scratchpad) e
conferi por conteúdo as de destino. Nos itens abertos, só o número mudou: G14 (`:331-334` para
`:328-331`), G16 (`acoes-e-sistema.md:193` para `:195`; `Acoes_Sistema.md:593` para `:590`), G17
(`1043-1045` para `1040-1042`; `:172` para `:176`), G21, G22, G23, G24, G25, G26, G27 e G28 (27
trocas em 18 linhas). As da G18 e da G29, que fecham, ficam como estavam, marcadas como de
`5407b38`. Fora de `docs/simulacao/caixa/`, nenhum outro arquivo cita linha dos três documentos.

### 5 · G18 e G29 fechadas (commit seguinte)

Caixa `[x]` nas duas, com a frase do autor, a data e `b396c83`. `Pendencias.md` regenerado.

### 6 · A prova

- `npm run validate` e `npm run build` verdes (código 0) antes do `b396c83`; o gancho de
  `pre-commit` passou nele (Portões OK), com `astro sync` e `tsc`.
- Travessão, lendo os arquivos: 0 linhas antes e 0 depois em cada um dos seis arquivos tocados.
  Mensagem do commit: 0. Nenhuma linha de coautoria.

## PRECISA DE MIM

1. **O material também herda, e com ele o braçal soma.** Conta 2: oficina de mestre com material
   excepcional deixa a espada em 3 para ele (soma 4 por dia); de mestre com selecionado, ou bem
   equipada com excepcional, em 5 (soma 2). O texto diz o que o autor decidiu, "não soma na espada
   em nenhuma oficina", que é verdade com material corrente. Saídas: o texto dizer "com material
   corrente"; o material não herdar para quem não tem o ofício; ou aceitar que material bom abre a
   porta ao braçal.
2. **A cerca da escala de dias.** "Porta, banco, mesa tosca, cerca de 20 m" (`acoes-oficio-e-mundo.md:154`)
   junta peças e uma cerca, que é construção fixa no lugar. Pelo critério novo, a cerca seria obra.
   Não mexi.
3. **O curandeiro ainda apoia pelos números velhos.** `Acoes_Sistema.md:1493`: "apoia pela §3.5
   (+2 passando, +1d6 por Margem)", contra a Virulência. A §3.5 agora é metade da Dificuldade e +1 a
   cada 6. Não mexi, porque é regra de doença (rola contra a Virulência, não contra metade), e
   alinhar mudaria a ficha; decidir se ela segue a §3.5 nova ou fica como exceção escrita.
4. **O teste coletivo do documento e o do capítulo continuam diferentes.** No `Acoes_Sistema.md`
   (`:284`), os outros ajudam "pela regra de apoio acima", que agora dá +1 a cada 6; no capítulo
   (`acoes-e-sistema.md:178`), um líder dá +1d6 a cada 6 acima. Já eram diferentes antes desta
   rodada; a mudança da §3.5 mexe no valor do lado do documento.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
