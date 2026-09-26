# B14 fase 2 · relato da Executora (parcial, em andamento)

Despacho: `docs/simulacao/caixa/b14-fase2-despacho.md` (commit `3352231`). Este relato cobre o
que já está feito e verde no `npm run validate`; a parte B (classificação dos poderes) parou por
ambiguidade genuína, ver seção própria abaixo, e foi levada ao Arquiteto antes de tocar em mais
arquivo de criatura.

## Feito e verificado

**A. Esquema** (`scripts/criatura-schema.mjs`):
- **A.1 dimensões**: `dimensoesSchema` novo, com `comprimento`/`largura`/`altura`/`envergadura`/`forma`
  opcionais; `forma` não escrita (ou `humanoide`) não exige as três medidas, forma não padrão exige.
  Não preenchi as medidas de nenhuma criatura (fora do pedido: o item só cria a régua).
- **A.2 poderes naturais**: `poderNaturalSchema` novo, `.discriminatedUnion('tipo', ...)` com o
  formato antigo de `proeza`/`feiticaria` preservado. Ver "Onde parei" abaixo: NENHUMA ficha
  recebeu poder no formato novo ainda.
- **A.3 desafio**: campo `desafio: {individual?, bando?: {quantidade, desafio}}`, opcional, vazio
  em todas as 309 fichas (como o despacho pede: "vazio até a bancada").
- **A.4 constructo**: `constructo: {semVida: true}` opcional. Apliquei nas 9 criaturas reais de
  categoria Construto (não toquei `mon-exemplo-espantalho`, é fixture de teste):
  `mon-retriever`, `mon-iron-cobra`, `mon-homunculus`, `mon-clay-golem`, `mon-flesh-golem`,
  `mon-ice-golem`, `mon-iron-golem`, `mon-stone-golem`, `mon-animated-object`.
  **Aviso**: só marquei o dado. NENHUM código de combate (`lance.ts`, `calc.ts`) lê essa flag
  ainda para pular teste de Vigor/Resistência/Virtude, bloquear regeneração ou dar imunidade a
  "corpo" — isso é trabalho de mais uma frente, o despacho pediu o esquema e a marca, não a
  aplicação na resolução do golpe.

**C. Correções de regra:**
- **C.7 Defesa Social Int 1**: `lib-bestiario.mjs` (`stat()`), `bestia-editor.ts` (`derivados()`)
  e os comentários em `regras.json`/`content.config.ts` — Int 1 agora usa Sobrevivência no lugar
  de Sociabilidade; só Int 0 continua "-". Achado no caminho: `defesas.md` (a tabela de Inteligência
  × Social/Mental) tinha a linha do Int 1 ERRADA, dizendo "-" quando o texto duas seções acima já
  dizia o contrário — corrigida também.
- **C.8 Centelha 0**: `mon-riding-dog.json`, `mon-giant-frog.json`, `mon-dire-lion-spotted-lion.json`
  — `centelha: 0` e tag `"centelha"` removida das três.
- **C.9 Incorpóreos**: `mon-sombra.json`, `mon-espectro.json`, `mon-assombracao-wraith.json`,
  `mon-ghost.json` — o texto do ataque e da habilidade "Incorpórea/Incorpóreo" não fala mais em
  imunidade a arma comum, e sim em resistência (dano pela metade). `mon-ghost.json` não tinha a
  tag `incorpóreo` (só as outras três tinham): sem ela, `gen-elementos.mjs` não geraria a tripla
  corte/impacto/perfuração pela semente, e as `resistencias` escritas na ficha divergiriam do
  gerado. Acrescentei a tag, e o `elementos-bestiario.json` regerado bate (`validate` verde).
  **Não toquei** a habilidade "Incorpóreo: ignora armaduras físicas..." do `mon-espectro.json`:
  não é sobre ser imune a arma comum, é sobre o ATAQUE dele ignorar a armadura do alvo — outra
  mecânica, fora do escopo do item 9. Achei o erro na primeira passada e revertido.
- **C.12 Vontade em combate**: `regras.json` ganhou `gastoVontade` (novo, ao lado de
  `recuperacaoVontade`: +1d6 numa jogada ou +4 numa Defesa, 1 ponto por ação/jogada, inclusive
  cada golpe defendido). `aparencia-virtudes-vontade.md` ("turbinar uma ação importante") ganhou
  o número.
- **C.13 Horda como sugestão**: `combate.md`, um parágrafo depois do exemplo da Regra de Horda,
  deixando explícito que 2 capangas por personagem é sugestão de quando considerar, e a decisão é
  do Mestre.
- **C.11 (parcial) Orc**: `mon-orc.json` com os novos Atributos (Força 5, Destreza 3, Vigor 5,
  Influência 2, Perspicácia 2, Compostura 1, Percepção 3, Inteligência 2, Raciocínio 2). Os
  poderes Vitalidade e Frenesi como poder natural ficaram para depois de resolver a ambiguidade
  de vocabulário (ver "Onde parei").

**D. Grupo 3 → 4:**
- `lore/economia/v2/modelo.py:445` (comentário) e `:467` (era `:466` antes do comentário crescer),
  `grupo=4`.
- `custo-servicos.md:40/42`: fórmula e prosa em "grupo de 4".
- `CalculadoraRecompensa.astro:24`: `value="4"`.
- `docs/pendencias/B-bestiario.md:118`: a citação verbatim do autor, "grupo de 4 personagens".
- Regenerei com `node scripts/copiar-economia.mjs` (recompensas.json confere `"grupo": 4`).
- `test-recompensa.mjs`: os 5 casos e o bloco da rodada 118 tinham bolsa/parte/sobra calculados
  para `P.grupo = 3`; refiz os números a partir da saída real do script (não inventei, rodei e
  copiei) — 17 asserções, todas verdes.

## Verificação

`npm run validate` roda 100% verde, EXCETO a parte de poderes (ver abaixo), que já estava
quebrada nas 16 fichas parciais antes de eu tocar em qualquer coisa: o schema novo (A.2) tornou
o formato antigo delas inválido, de propósito (é o `.discriminatedUnion` exigindo `id`/`nome`/
`resiste`/`usos` no tipo `natural`). Nenhum outro portão (inimigos.json, elementos-bestiario.json,
deslocamento-bestiario.json, economia, Pendencias.md, os ~60 test-*.mjs) quebrou.

## Onde parei: ambiguidade genuína na parte B (poderes)

Achei três problemas concretos, e prefiro perguntar a adivinhar em 80 arquivos:

1. **O vocabulário novo (`resiste`/`usos`/`periodo`) não cobre todos os subtipos da tabela.**
   A tabela classifica linhas como `natural · manobra`, `natural · agarrao` ("sem limite, é
   manobra"/"depende do agarrão") e `natural · disparo` (nota: "vira um ataque à distância da
   ficha"). Essas não são bem "poder com resiste/área/usos" — manobra e agarrão parecem mais
   prosa em `habilidades` (como o `mon-orc.json` já faz com "Fúria de combate"), e disparo parece
   dever virar uma entrada em `ataques` (a ficha já tem um campo `distancia: true` para isso), não
   um poder duplicado. `natural · sentido` passiva (Visão aguçada, Telepatia, Faro) também podia
   ser só prosa em `habilidades`, como já é hoje para a maioria das 309. Não sei qual das três
   rotas o autor quer para cada subtipo.
2. **Contradição com dado já existente.** `mon-aguia-gigante.json` já tem "Visão aguçada" como
   `tipo: "proeza"`, `caminho: "olho-agucado"` (aponta pro Caminho Olho Aguçado, uma Proeza de
   verdade). A tabela classifica a mesma coisa como `natural · sentido`. Reclassificar por cima
   do que já está lá apaga a referência ao Caminho — não sei se é isso que o autor quer, ou se a
   tabela nova generalizou demais um caso que já tinha resposta melhor.
3. **Confiança da correspondência nome→id.** A tabela usa nomes em português ("Filhote de Dragão
   Vermelho" vs "Dragão Vermelho Jovem" vs "Dragão Vermelho Adulto" vs "Dragão Vermelho Ancião",
   quatro fichas parecidas) contra 309 arquivos com `id` em inglês. Erro de casamento aqui é
   silencioso: o `validate` não acusa poder posto na criatura errada.

Mensagem separada para o Arquiteto com essas três perguntas, mais o que consegui levantar dos
itens 6 e 10 sem inventar número (abaixo).

## Item 10: a lista de voo (pedida como saída, sem editar arquivo nenhum)

**28 criaturas já com `locomocao.voo` certo**, com nota de fonte batendo terra e voo separados
(não toquei nenhuma):

`mon-aguia-gigante` (8), `mon-assombracao-wraith` (6), `mon-bat-swarm` (4), `mon-bat` (4),
`mon-cloaker` (4), `mon-cocatriz` (6), `mon-couatl` (6), `mon-diabrete-imp` (5), `mon-dire-bat`
(4), `mon-espectro` (8), `mon-fogo-fatuo` (5), `mon-giant-wasp` (6), `mon-harpia` (8), `mon-hawk`
(6), `mon-homunculus` (5), `mon-lantern-archon` (6), `mon-pixie` (6), `mon-pseudodragon` (6),
`mon-pteranodon` (5), `mon-quasit` (5), `mon-raven` (4), `mon-roc` (8), `mon-small-air-elemental`
(10), `mon-sombra` (4), `mon-stirge` (4), `mon-vargouille` (3), `mon-wasp-swarm` (4), `mon-wyvern`
(6).

**6 criaturas citadas como voadoras na tabela de poderes, mas com `locomocao` só em `terra`, sem
separação de voo na `fonte`** (o `fonte.deslocamento` delas tem um `ft` só, sem nota dizendo
"voo X; em terra Y" como as 28 acima têm — não tenho de onde tirar o número de voo sem inventar):

| id | nome | locomocao hoje | fonte.deslocamento.ft |
|---|---|---|---|
| mon-djinn | Djinn | terra: 2 | 20 |
| mon-dragao-vermelho-anciao | Dragão Vermelho Ancião | terra: 4 | 40 |
| mon-erinia | Erínia | terra: 3 | 30 |
| mon-manticora | Mantícora | terra: 3 | 30 |
| mon-pegaso | Pégaso | terra: 6 | 60 |
| mon-quimera | Quimera | terra: 3 | 30 |

Essas 6 são as únicas que consegui cruzar com confiança (vêm da tabela de poderes, que já tem o
nome certo por criatura). **Não sei se são as "55" do despacho**: rodei uma varredura pelas 309
fichas procurando indício de voo fora da tabela (`fonte.deslocamento.nota` mencionando "voo" sem
`locomocao.voo`) e não achei nenhuma além das 28 já certas — o número 55 provavelmente vem de um
levantamento que o Arquiteto já tem (talvez contra o PDF de origem) e que eu não tenho aqui. Se
houver uma lista de 55 nomes em algum lugar (`../tmp/arquiteto/` ou outro documento), aponte que
eu cruzo contra o bestiário.

## Item 11 (poderes de Vitalidade/Frenesi): junto da pergunta de vocabulário acima

Não escrevi ainda. `racas.json` já tem o texto exato ("Vitalidade: +Vigor de PV extra" e o
parágrafo inteiro do Frenesi). Vitalidade cabe limpo no esquema novo (`periodo: "passivo"`); o
Frenesi não cabe em nenhum `periodo` do enum (não é ticks/cena/hora/dia/à vontade/passivo/golpe,
é "ativa quando falha um teste de Temperança e dura até sair da fúria") — mesma dúvida do item 1
acima, por isso não escrevi nada ainda em vez de forçar um valor que não descreve a regra direito.
