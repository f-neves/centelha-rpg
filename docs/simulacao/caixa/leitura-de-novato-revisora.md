# Auditoria da Revisora · decisões da "leitura de novato"

**NÃO COMMITADO, por instrução do Arquiteto.** Arquivo escrito na worktree da Revisora
(`C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`), para ele absorver ou commitar como
quiser. Worktree reancorada em `85a97fe` **a pedido explícito dele**, conferido por
`git rev-parse HEAD` e `git rev-parse --show-toplevel`, com `git status --short` limpo antes de
começar.

Auditado: `docs/simulacao/caixa/leitura-de-novato-decisoes.md` (249 linhas), contra o repositório
em `85a97fe`. Não rodei `validate` nem testei código, porque não há código.

**O escopo da auditoria, dito junto do resultado:** li o arquivo de decisões inteiro e conferi
**toda** citação de `arquivo:linha` que ele faz, mais as premissas de dado que ele não cita mas
usa (os JSONs de arma/armadura/escudo/preço/condição/habilidade, os schemas Zod do
`content.config.ts`, e os consumidores em `src/` e `scripts/`). **Não** li os três arquivos de
apoio (`leitura-de-novato-capitulos.md`, `-correcoes-baldeA.md`, `-investigacao-baldeC.md`), então
nada aqui julga o balde A nem o material bruto da leitora.

---

## As citações: todas conferem

Boa notícia primeiro, porque é o item 1 do pedido e a resposta é limpa.

| citação | o que o arquivo afirma | no repositório |
|---|---|---|
| `racas.md:115` | "−1 Antipatia" | ✓ literal: "os demais povos recebem o meio-orc em **−1 (Antipatia)**" |
| `acoes-oficio-e-mundo.md:47` | "Ofícios Gerais vale metade ao conferir o Requisito" | ✓ literal, dentro de `<p class="formula">` |
| `relacoes-sociais.md:134` | a iniciativa social e a frase "a mesma regra de defasagem do físico" | ✓ literal |
| `acoes-e-sistema.md:18-25` | a régua 5/10/15/20/25/30, "Difícil" = **15** | ✓ a tabela é exatamente essa |
| `acoes-resistir.md:43-50` | os seis venenos | ✓ os seis, nessas linhas |
| `folego.md` fixa 24 para Haste | item 8 do 4a | ✓ `folego.md:31`, `\| Haste \| 24 \|` |
| `armas.json` tem 32 só na Alabarda | idem | ✓ Alabarda `folego: 32`, Lança `folego: 24`, as duas `classe: "haste"` |
| `armaduras.json` diz "pesada" na Placa completa | §5 | ✓ `classe: "pesada"` |
| `habilidades.json` tem `atributos`, secundárias não | §4 | ✓ **24/24** primárias têm (Briga = `["forca","destreza"]`, como citado); **0/66** secundárias têm. As chaves de uma secundária são `id, nome, grupo, descricao, niveis` |
| `precos.json` tem `pacotes` | §1 | ✓ 7 pacotes, e o arquivo só tem `_nota`, `moeda`, `equipamento` (38) e `pacotes` |
| os nomes antigos (Espada Média, Espada Grande, Machado G, Martelo Grande, Faca, Madeira P/G, Metal P/G, de Corpo) | §3, §6 | ✓ todos existem em `custo-de-servico-e-itens.md:135-199` |

**Nenhuma citação está deslocada, e nenhuma premissa citada mudou debaixo da decisão.** O que
segue não é citação errada: é premissa **não citada** que o repositório contradiz, e consequência
não medida.

---

## BLOQUEIA

### A Iniciativa Social não fica "igual ao físico" mexendo só na âncora, e do jeito escrito ela piora

A decisão (§4, último item): *"Tick 1, igual ao físico. Uniformiza os dois sistemas;
`relacoes-sociais.md:134` se corrige para não ter deslocamento nenhum em relação à Iniciativa
física, e a frase 'a mesma regra de defasagem do físico' passa a ser literalmente verdade (hoje
não era, porque a âncora inicial diferia em 1 Tick)."

**O diagnóstico está certo e é metade do defeito.** O físico (`combate.md:29`, `:33-38`):

> Quem tirar o maior entra sozinho no **Tick 1** · os demais entram **um Tick depois por degrau de
> 6 pontos** de atraso

| Atrás da maior | Entra no | Contrapé |
|---|:---:|:---:|
| — (é a maior) | Tick 1 | — |
| 1 a 6 | Tick 2 | −1d6 |
| 7 a 12 | Tick 3 | −2d6 |
| 13 a 18 | Tick 4 | −3d6 |

<small>*(Os dois U+2014 da primeira linha desta tabela são citação literal de `combate.md:35`, onde
o caractere é o marcador de "não se aplica" e não prosa. Contei o arquivo inteiro e são os dois
únicos; não os troquei porque alterar caractere dentro de citação é pior do que a regra que a troca
cumpriria, e é o mesmo caso das seis células semânticas do `regras.json` que estão no `J10`.)*</small>

O social (`relacoes-sociais.md:134`): *"começa no **Tick 0**; os demais no **Tick 1**, com a mesma
regra de defasagem do físico."*

**Os dois diferem em DUAS coisas, e a decisão só nomeia uma.** A âncora, sim (0 contra 1). Mas o
social põe **todos os demais num Tick só e liso**, sem degrau de 6 pontos e **sem contrapé**; o
físico espalha por Tick 2/3/4 com −1d6/−2d6/−3d6. A frase "a mesma regra de defasagem" é falsa
**na defasagem**, que é justamente a palavra que ela usa.

**E a consequência de aplicar só a âncora é pior que o estado de hoje.** Mova o vencedor de Tick 0
para Tick 1 e deixe "os demais no Tick 1": vencedor e perdedores entram **no mesmo Tick**, e a
Iniciativa social deixa de comprar qualquer coisa. Hoje ela compra um Tick.

**As duas saídas são decisões de regra e nenhuma está escrita:**

- **adotar a tabela inteira do físico** · e aí o Combate Social ganha **contrapé** (−1d6 a −3d6),
  que ele não tem hoje, num sistema cujo ataque já é `[(Influência+Habilidade)÷2]d6` e onde −3d6
  pode zerar o pool de quem tem soma baixa. É mudança grande e não foi dita;
- **manter o vencedor sozinho um Tick à frente** · e aí a âncora certa é a de hoje (0 e 1), e o que
  se corrige é a **frase**, não o número.

Chamo `BLOQUEIA` e não `CORRIGE` porque a decisão, executada ao pé da letra, muda o comportamento
do Combate Social no sentido contrário ao que ela diz querer, e a Executora não tem como descobrir
isso lendo o item.

---

## CORRIGE · premissas que o repositório não sustenta

### 1 · "`tipo` vem dos cabeçalhos que já existem" · quatro dos sete não são cabeçalhos

§1 diz que `tipo` sai de: *Armas, Armaduras, Escudos, Comida & Bebida, Roupas,
Montarias/Veículos/Animais, Itens Gerais*.

`custo-de-servico-e-itens.md` tem **doze** cabeçalhos, todos `##`, e **zero** `###` (contei):

```
Moedas & Conversão · Serviços & Renda · Qualidade de Itens · Catálogo de Equipamento ·
Hospedagem & Comida · Montarias, Veículos & Animais · Viagens · Roupas · Itens Gerais ·
Escravos · Equipamento de Aventura · Pacotes de Equipamento
```

- **Armas, Armaduras e Escudos não são cabeçalhos.** São `<p class="cat-cap">` dentro de
  `## Catálogo de Equipamento` (`:135`, `:169`, `:187`).
- **"Comida & Bebida" não existe.** O cabeçalho é `## Hospedagem & Comida`, e a própria §1 manda
  **Hospedagem ficar FORA** do esquema enquanto Comida entra. O cabeçalho não separa as duas: é
  uma seção só, e alguém vai ter de dividir a tabela.
- **Três cabeçalhos que parecem item ficaram de fora da lista:** `## Equipamento de Aventura`,
  `## Escravos` (que é a origem dos Servos da §2) e `## Qualidade de Itens`. E há **dois** de
  equipamento geral (`## Itens Gerais` e `## Equipamento de Aventura`), com a §1 nomeando só um.

Isto importa porque a §1 apresenta a lista de `tipo` como **derivada** de algo que já existe, e ela
é, de fato, uma lista nova. Nada contra ser nova; contra é dizer que é derivada, porque quem
implementar vai procurar os cabeçalhos.

### 2 · "Os scripts `precos.mjs` e `gen-lista-equip.mjs` precisam de ajuste" · são pelo menos dez consumidores

Varri `src/` e `scripts/` por quem lê os três JSONs. Nomeados, não contados:

| consumidor | como toca |
|---|---|
| `src/content.config.ts:157-200` | **schemas Zod** das três coleções, registrados em `:259-261` |
| `src/lib/equip.ts:9-15, 81, 104-109, 151-160` | importa os três e lê `soak`, `penalidade`, `dado`, `danoBonus`, `ticks`, `acerto`, `defesaArma` |
| `src/lib/ficha-engine.ts:783, 793, 809, 1385` | lê `bloqCaC`, `penalidade`, `habilProjetil` |
| `src/lib/bestia-editor.ts:7, 108-109` | `arm.soak?.[m]`, `arm.penalidade` |
| `src/pages/bestiario.astro:8` | importa `armas.json` |
| `src/components/BestiaEditor.astro:331` | idem |
| `scripts/gen-lista-equip.mjs:16-18` | os três |
| `scripts/gen-bench-tempo.mjs:30-31` | armas e armaduras |
| `scripts/gen-bestiario.mjs:10`, `scripts/gen-monsters.mjs:71` | armaduras / armas |
| `scripts/dano-por-tipo.mjs:26`, `scripts/add-folego.mjs:9` | armas |

Dizer "dois scripts, e é trabalho de implementação" subdimensiona por cinco vezes, e dois dos
consumidores não são script: são o **motor da ficha** e o **schema que o build valida**.

### 3 · O envelope aninha o que todo consumidor lê no topo, e o modo de falhar é silencioso

Esta é a resposta ao item 2 do pedido, e é o achado de arquitetura.

O envelope proposto põe `"arma": null, "armadura": null, "escudo": null` como **blocos**. Hoje os
campos moram no **topo** de cada entrada:

```
armaduras.json  →  { id, nome, classe, soak:{...}, resistPerf, penalidade, peso, acesso, notas }
escudos.json    →  { id, nome, bloqCaC, habilProjetil, penalidade, peso, acesso, notas }
armas.json      →  { id, nome, classe, atrib, pericia, dado, acerto, defesaArma, maos, ticks,
                     folego, tipoDano, peso, pen, modos, tags, notas, danoBonus }
```

E é assim que todo mundo lê. Dois pontos específicos:

- **`src/lib/bestia-editor.ts:108-109`** faz `nz(arm.soak?.[m])`. Com `soak` mudando para
  `armadura.soak`, o `?.` devolve `undefined`, o `nz` transforma em **0**, e a absorção de armadura
  do bestiário vira zero **sem lançar nada**. É a forma **B12** do `CATALOGO` (o acesso tolerante
  que nunca lança) com o dano do lado da mesa.
- **`src/lib/equip.ts`** é o arquivo que o `CLAUDE.md` nomeia como *contrato silencioso* entre a
  ficha e o rastreador de combate da mesa: *"mudar a forma do objeto não gera conflito no git e
  quebra o combate sem aviso"*. É exatamente esta mudança.

**O que salva parcialmente, e vale saber:** as três coleções têm schema Zod
(`content.config.ts:157-200`), e `armas` ainda usa `atrib: reference('atributos')` e
`pericia: reference('habilidades')`. Aninhar quebra o schema **alto**, no build. Então o caminho da
coleção grita; o caminho do `import` direto (que é o do `equip.ts` e o do `bestia-editor.ts`) cala.
**Os dois caminhos leem o mesmo arquivo e falham de jeitos diferentes**, e é isso que faz o
conserto precisar de cuidado em vez de só de trabalho.

### 4 · `preco` e `peso` não estão nos schemas, e o Zod despe o que não declara

`content.config.ts` **não tem nenhum `.strict()`** (contei: zero). Objeto Zod sem `.strict()`
**remove** chave não declarada em vez de recusar. E `peso` **já existe nos dados** de
`armas.json`, `armaduras.json` e `escudos.json` e **não está em nenhum dos três schemas**.

Ou seja: já existe hoje um campo que o `import` direto enxerga e o `getCollection` não. Pôr `preco`
nos arquivos sem pôr no schema herda essa divergência, e o sintoma é um preço que existe na ficha e
some na página gerada pela coleção. Não é motivo para não fazer; é uma linha a acrescentar na
decisão.

### 5 · `vsProjetilRapido`: a premissa está certíssima, o custo é que não é de dado

**A premissa confere, e eu fui ver.** `armas-e-armaduras.md:136-144` publica a coluna "vs Projétil
rápido" com **três** estados literais: `não` (Broquel, Targe), `bloqueia` (Hoplon, Heater, Kite,
Scutum) e `bloqueia (+3)` (Pavês). E `escudos.json` guarda o +3 só na prosa do `notas`
(*"+3 na Defesa contra projéteis"*). O booleano de hoje **perde** informação que o capítulo
publica. A decisão é boa e o nome do campo é o da coluna.

**O que não confere é a classificação como mudança de dado.** `habilProjetil` tem cinco sítios em
código, e um deles desenha:

- `src/content.config.ts:198` · `habilProjetil: z.boolean()` · **um objeto aqui falha o build**;
- `src/lib/ficha-engine.ts:783` · o `ESCUDO_LIVRE` (escudo personalizado) tem o campo no default;
- `:793` e `:809` · `habilProjetil: !!s.habilProjetil` nas duas rotas de escudo;
- `:1385` · `${s.habilProjetil ? '<span class="eq-n"><b>Projétil</b>hábil</span>' : ''}` · é o
  **selo que o jogador vê na ficha**.

Com três estados, `:1385` precisa decidir o que mostrar no caso `bloqueia (+3)`, e isso é escolha
de tela, não de esquema.

### 6 · "`porSeisTicks` cai" · ele é de cinco condições e o Grid soma ele

§4, no item do Envenenado: *"o relógio genérico `porSeisTicks` de `condicoes.json` **cai**."*

Medido:

- `condicoes.json` usa `porSeisTicks` em **cinco** entradas (`:135`, `:141`, `:173`, `:178`,
  `:188`), não só no Envenenado;
- `src/lib/mesa-core.ts:179` declara o campo, `:213` o inicializa no acumulador e **`:221` soma**:
  `t.porSeisTicks += c.porSeisTicks ?? c.porRodada ?? 0`. O comentário do `:177` diz que a forma
  nova usa **só** `porSeisTicks`;
- `src/lib/mesa-condicoes.ts:132` **escreve** o campo pela tela do mestre.

Se "cai" quer dizer *o Envenenado deixa de usar o relógio genérico*, está certo e é uma entrada.
Se quer dizer *o campo sai de `condicoes.json`*, quebra quatro outras condições e o rastreador.
A frase, como está, lê-se do segundo jeito. Uma palavra resolve, e é a palavra que a Executora vai
implementar.

### 7 · O esquema de veneno não expressa dois dos seis venenos que ele diz migrar

Os seis de `acoes-resistir.md:43-50` **já estão em tabela estruturada**, com exatamente as colunas
que o esquema quer (Veneno, Potência, Início, Doses, Efeito por dose). Isso é melhor do que a
decisão diz · ela chama os seis de *"hoje só em prosa"*, e eles não estão em prosa; a migração é
mais mecânica do que o texto promete. Mas o esquema proposto não cobre dois deles:

| veneno | efeito publicado | o esquema tem campo? |
|---|---|---|
| Curare | `−3 Destreza **por uma cena**` | **não** · nenhuma duração no efeito |
| Peçonha de víbora | `8 PV` | **não** · `efeitoPorDose.tipo` só mostra `"atributo"` |
| Hálito de basilisco | `12 PV` | idem |
| Bebida forte | `Desgaste 1` | idem (nem `"atributo"` nem PV) |

Quatro dos seis, então, e não dois: só Cicuta e a metade de Destreza da aranha cabem no formato
como está escrito. O texto diz que `efeitoPorDose` vira array quando há mais de um efeito, o que
resolve a **aranha**, e não resolve o **tipo** nem a **duração**.

**E um campo sem fonte:** o exemplo traz `"ignoraAbsorcao": true` na Cicuta. A tabela do capítulo
não tem essa coluna e eu não achei a regra em `acoes-resistir.md`. Se veneno ignora absorção, isso
é regra nova entrando pelo exemplo de um esquema; se não ignora, é um campo inventado. Nos dois
casos precisa de linha própria.

### 8 · A migração de preço: duas linhas da fonte somem e uma volta a "a definir"

Reconstruí a tabela antiga inteira (`custo-de-servico-e-itens.md:139-199`) e cruzei com a §3.

**O que a §3 deixa na mesa:**

- **Machadinha** é "criar como arma nova, **(preço a definir)**" · mas a tabela antiga tem
  `Machadinha \| 8 pp` (`:145`), sob o mesmo nome. É a única linha da §3 que ignora um preço
  existente sob nome idêntico;
- **Arco Longo** ganha "preço novo, sugerido e aceito, 15 pp" · e a tabela antiga tem
  `Arco \| 14 pp` (`:156`). "Arco" é exatamente o nome genérico que a §6 diz resolver por
  mapeamento *"por consistência"*, do mesmo jeito que `Espada → Espada Longa` e `Faca → Adaga`. Ele
  não é mapeado, e o 14 pp não é mencionado;
- **Besta Pequena/Média/Grande** ganham 30/55/95 como "preço novo" · e a tabela antiga tem
  `Besta \| 35 pp` (`:160`), outro genérico da mesma família, também sem menção;
- **`Flechas (10) 1 pp`** (`:159`) e **`Virotes (10) 1 pp`** (`:161`) não aparecem em lugar nenhum
  da decisão, e **munição não tem `tipo`** na lista de nove. Acabaram de ser precificados três
  arcos e três bestas.

**O que está certo e vale dito:** Lança, Machado e Alabarda têm linha na tabela antiga e nome
idêntico no catálogo jogável, então **não são órfãos** e a ausência deles na §3 está correta.
Conferi antes de acusar.

### 9 · "Criar novo" esconde quais números são herdados

Quatro armas marcadas **"criar como arma nova"** já estão na tabela antiga, com **exatamente** o
preço que a §3 lhes dá: Bastão `4 pp` (`:142`), Martelo `25 pp` (`:153`), Sabre `30 pp` (`:151`),
Maça Estrela `32 pp` (`:155`).

E **as cinco armaduras da §5 inteiras** estão lá, com os mesmos preços:

| §5 | linha da tabela antiga | preço lá | preço na §5 |
|---|---|---|---|
| Peitoral | `:177` | 28 pp | 28 pp |
| Camisa de malha | `:176` | 20 pp | 20 pp |
| Peitoral reforçado | `:180` | 9 po | 9 po |
| Placa articulada | `:181` | 14 po | 14 po |
| Malha completa | `:182` | 18 po | 18 po |

A §5 se intitula *"Armaduras órfãs, resolvidas (**criar novo**...)"* e fecha dizendo
*"**números de simulação**, sujeitos ao balanceamento final"*. **Os preços não são de simulação:
são a tabela antiga, célula por célula.** O que é de simulação são soak, penalidade e peso.

Elas são órfãs **no `armaduras.json`** (conferido: o catálogo jogável tem nove entradas, e nenhuma
das cinco está lá), não na tabela de preço. A direção está invertida no texto, e a consequência é
que o balanceamento futuro pode remexer preços que na verdade já estavam decididos.

### 10 · Os sinais da penalidade vão bater no schema

A §5 escreve `Penalidade` como **−1, −2, −3**. O `armaduras.json` guarda **módulo**
(`Placa completa: penalidade: 3`), e o schema é
`penalidade: z.number().int().min(0)` (`content.config.ts:190`). Copiar a tabela da §5 para o JSON
como está **falha a validação**. Falha alto, o que é bom, mas é uma hora perdida que uma frase
evita.

### 11 · A tabela descartada é a fonte dos preços que ficaram

A §5 diz: *"Não existe classe 'Super-pesada'; a tabela antiga que a citava foi a fonte errada,
descartada."* A resolução está certa e o schema a confirma: `armaduras` aceita
`z.enum(['nenhuma','leve','media','pesada'])` (`:188`), então "Super-pesada" nunca foi classe
válida.

Duas coisas a dizer, porém:

- **descartada só na coluna Classe.** A mesma tabela é a fonte dos preços da §5 e de metade da §3.
  "Descartada" sem qualificar contradiz o uso que os dois parágrafos vizinhos fazem dela;
- **o capítulo continua publicando "Super-pesada"**, em `custo-de-servico-e-itens.md:182` e `:183`
  (Malha completa e Placa completa). A decisão resolve a contradição e não diz que essas duas
  linhas se corrigem. Como a tabela do capítulo passa a ser **gerada** (§1), elas saem sozinhas no
  regen · mas só se o gerador for a fonte, e isso é justamente o trabalho ainda não feito.

### 12 · O adiamento dos preços-base descreve um conjunto que inclui o que acabou de ser decidido

§3, "Ainda não decidido": *"Preço-base de todas as armas/armaduras/escudos que já existem no
catálogo jogável e **nunca tiveram preço nenhum**."*

Medido: **zero de 26 armas** em `armas.json` tem campo `preco`, e o `precos.json` não tem uma
categoria de arma sequer (só `_nota`, `moeda`, `equipamento` com 38 itens gerais, e `pacotes`).
Lido ao pé da letra, o adiamento cobre **as 26**, incluindo as catorze que a tabela logo acima
acabou de precificar.

A leitura que fecha é *"as que não têm linha na tabela antiga do capítulo"*, e ela é nomeável em
uma linha. **Nomeando, em vez de descrevendo** (é a régua da casa, e quem me ensinou foi o próprio
Arquiteto):

- **armas adiadas (10):** Espada Serrilhada, Picareta de Guerra, Adaga de Arremesso, Machado de
  Arremesso, Azagaia, Funda, Dardos, Bumerangue, Rede, Pilum. (A **Maça** a §3 já marca como
  pendente à parte, e o **Desarmado / Briga** não é comprável.)
- **armaduras adiadas (4):** Gambeson (acolchoado), Brigandina / coat of plates, Placa de
  transição, Placa de munição. E **Couro endurecido**, que tem `Couro \| 12 pp` na tabela antiga
  sob nome parecido mas não idêntico · essa é mapeamento ou adiamento, e ninguém disse.
- **escudos adiados:** nenhum. A §6 cobre os sete.

---

## PERGUNTA

1. **Munição tem `tipo`?** `Flechas (10)` e `Virotes (10)` estão na tabela antiga a 1 pp, e a lista
   de nove `tipo` não tem onde pô-los. `geral` serve, mas munição amarra com arma (a besta e o arco
   que acabaram de ser precificados), e isso é decisão.
2. **"5 nomes órfãos para 6 escudos, sobrando um"** (§6) · a tabela antiga tem **seis** nomes
   (Broquel, Madeira P, Madeira G, Metal P, Metal G, de Corpo) e o catálogo tem **sete** escudos
   reais mais a entrada `Nenhum`. O mapeamento da tabela está certo; a prosa que o explica erra a
   contagem em um, nos dois lados.
3. **Os nomes dos escudos no JSON não são os da §6.** Lá estão `Broquel (buckler)`,
   `Scutum romano` e `Pavês (pavise)`; a §6 escreve as formas curtas. Se a implementação casar por
   `nome`, três não casam. Casar por `id` (`broquel`, `scutum`, `paves`) resolve, e vale dizer no
   documento.
4. **`ignoraAbsorcao` da Cicuta** · de onde vem? Ver o `CORRIGE 7`.

---

## Sobre os itens do 4a e os adiados (item 4 do pedido)

**Concordo com os três do `4a`**, e conferi os três contra o disco:

- **Item 2 (Meio-Orc):** `racas.md:115` diz "−1 (Antipatia)" ✓, e é prosa dos dois lados. É decisão
  de regra, correto ficar aberto.
- **Item 8 (Alabarda):** `folego.md:31` fixa Haste em 24 ✓; `armas.json` tem Alabarda `32` e Lança
  `24`, as duas `classe: "haste"` ✓. Erro de digitação e exceção proposital são indistinguíveis
  daqui, e é exatamente por isso que é pergunta ao humano e não conserto. Correto ficar aberto.
- **Item 15 (espada Excepcional):** não conferi a aritmética das 8 contra 15 semanas, porque
  precisaria ler o capítulo inteiro de Ofícios e não estava no pedido. **Digo que não conferi**, em
  vez de deixar passar como conferido.

**Concordo com os adiados** (Sustentar, Orçamentos de XP, Proezas fora da coleção): os três pedem
número novo ou reorganização grande, e nenhum bloqueia a implementação do esquema de item. E o
achado embutido no de Sustentar está certo e é útil: a régua tem seis nomes
(`acoes-e-sistema.md:20-25`) e "quase impossível" **não** é nenhum deles ✓ conferido.

**Uma ressalva num item que NÃO está marcado como adiado:** a decisão da *leitura dentro do duelo
social* (§4) manda usar "**Perspicácia + Empatia vs. Defesa Social**", a mesma fórmula do cortejo.
Ela pousa em cima de um `CORRIGE` meu da **rodada 86 que ainda está aberto**:
`relacoes-sociais.md:260` diz "contra a Defesa Social dele (**a com dado, a da ficha**)", e esse
parêntese confunde dois eixos diferentes · "com dado contra parada" e "da ficha contra da ficha
mais o termo da régua". No cortejo dá para argumentar que a leitura usa o número cru. **Dentro de
um lance de Combate Social não dá**: ali o termo da régua está somado por definição, e a frase
importada não diz contra qual dos dois números se rola. Os dois itens deviam ser decididos juntos,
ou o segundo herda a ambiguidade do primeiro num lugar onde ela morde.

---

## O que está bem resolvido, e digo porque absolver custa a mesma conferência que acusar

- **`tipo` em vez de `classe` no topo: decisão certa, e dá para provar.**
  `content.config.ts:161` declara `classe: z.enum(['leve','media','pesada','haste','distancia','arremesso'])`
  para armas e `:188` declara `classe: z.enum(['nenhuma','leve','media','pesada'])` para armaduras.
  **São dois enums diferentes sob a mesma chave, hoje, no schema.** A colisão que a decisão evita é
  real e está escrita no repositório.
- **Escudo por composição em vez de herança:** fecha. O Hoplon tem `bloqCaC: 2` e nada de ataque
  hoje; dar-lhe um bloco `arma` preenchido não mexe em hierarquia nenhuma e não quebra
  `ficha-engine.ts`, que já trata escudo por `kind: 'escudo'` (`:793`, `:809`).
- **Arquivos separados por categoria:** concordo, e o motivo dado (edição concorrente) é o mesmo
  que produziu as regras de pathspec. Acrescento um argumento que o documento não usa e que é mais
  forte: **os três arquivos já têm schema Zod próprio** (`content.config.ts:157-200`), e um
  `itens.json` único exigiria união discriminada por `tipo` num schema só, o que troca três
  validações estreitas por uma larga.
- **A tabela do capítulo passar a ser gerada:** é o conserto certo para o item 1 do balde B, e pelo
  motivo certo (fonte única por construção, não por disciplina). O precedente citado existe
  (`## Itens Gerais` já sai de `scripts/precos.mjs`).
- **Secundárias ganharem `atributos`:** a causa-raiz está certa e medida (24/24 contra 0/66).
  **Uma consequência não dita:** o capítulo II é **gerado** (`gen-cap-pericias.mjs`, e o
  `CLAUDE.md` manda rodá-lo depois de mexer nos JSONs de habilidade), então as 66 entradas novas
  passam pelo regen e pelo `--check` do `validate`.
- **Ofícios Gerais: `Requisito × 2` em vez de `÷ 2`.** Fecha, e é melhor do que equivalente: a ida
  e volta é a mesma (`g ÷ 2 ≥ R ⟺ g ≥ R × 2`) e o lado direito nunca produz fração. Boa.
- **Placa completa fica "pesada":** confirmado pelo schema, que nem aceitaria outra coisa.
- **Fé fora da lista de pessoas, porte narrativo suavizado, ajudante com o pool do ajudado,
  sufocamento com dano gradual:** nenhuma delas contradiz decisão anterior que eu conheça, e
  nenhuma toca código. Sobre o sufocamento virar **Passiva**: o modo existe e é um dos cinco, então
  a reclassificação cabe sem inventar categoria.
