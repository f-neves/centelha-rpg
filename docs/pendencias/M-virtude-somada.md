# M · Virtude somada a Atributo ou Habilidade (levantamento)

Auditoria só de leitura, encomendada pelo Arquiteto em 26/09/2026, texto do despacho colado
abaixo. **Nada foi corrigido nesta rodada.**

> Auditoria, só leitura. Regra do autor, reafirmada: NÃO EXISTE teste de Virtude somada a
> Atributo ou Habilidade. Virtude se testa sozinha (teste de Virtude, Frenesi). Ele quer a
> lista de TODO lugar que diga o contrário, para corrigir depois (NÃO corrija nada agora, nem
> uma linha). Varredura: repositório inteiro (src/data, src/content, src/pages, src/lib,
> scripts, lore, .md da raiz). 1. Somas escritas (Virtude + Atributo/Habilidade, nas duas
> ordens). 2. Formas por extenso, lendo os capítulos de Virtudes, Resistir, Vida e Cura,
> Defesas, Artes, Relações Sociais e Combate Social inteiros. 3. Código (`src/lib`, `scripts`).
> 4. Bestiário. Entrega: tabela com arquivo, linha, texto exato, o que o teste resolve, e se é
> regra viva ou ata de rodada. Atas de `docs/simulacao/caixa` só contadas.

## O achado mais importante: não é descuido, é decisão do próprio autor

**`Canalizar Virtude` é uma soma deliberada de Atributo + Habilidade + Virtude, fechada e
documentada, não um erro de redação.** Está em três lugares vivos:

- `src/content/chapters/aparencia-virtudes-vontade.md:105` (o capítulo publicado, callout
  "Canalizar Virtude"): "some o valor da Virtude à sua soma base: a rolagem passa a ser
  **Atributo + Habilidade + Virtude**."
- `virtude-jogada.md:118-120` (documento de design, raiz do repo), que lista os "três usos
  mecânicos" da Virtude e descreve o Canalizar como "**já fechado, sem risco**... soma o valor
  cheio da Virtude na rolagem normal (`Atributo+Habilidade+Virtude`). É puro bônus, sem teste,
  sem custo." Este é o MESMO documento que fechou a regra "Virtude sozinha" para o Resistir
  (seção 6), ou seja, o autor tratou as duas coisas como decisões separadas e válidas ao mesmo
  tempo.
- `Pendencias.md:115` e `:621` (M-18/L102): o teto ou contrapartida do Canalizar ainda está
  **em aberto** com o autor, mas a MECÂNICA em si ("Atributo+Habilidade+Virtude") está
  registrada como decidida em 16/09/2026, não como pendência de regra.

Não há implementação em código (`calc.ts`/`ficha-engine.ts` não têm função de Canalizar; ver
seção "Código" abaixo), então hoje ele só existe em texto e é resolvido à mão na mesa. Se a
regra reafirmada ("não existe Virtude somada a Atributo ou Habilidade") vale também para o
Canalizar, é a maior mudança de escopo deste levantamento: não é trocar uma frase, é decidir
se o Canalizar continua existindo, e com que fórmula.

## Tabela, agrupada por "o que o teste resolve"

Legenda da coluna **Onde**: **viva** = regra publicada/consultada hoje (capítulo, `src/data`,
página, código); **doc** = documento de design/planejamento ainda em trabalho, não publicado
como regra do livro; **nota** = comentário/referência que cita a regra, sem ser a própria
regra; **obsoleta** = arquivo desatualizado que contradiz o capítulo atual.

### 1 · Canalizar (bônus voluntário, qualquer teste, uma vez por cena por Virtude)

| Arquivo | Linha | Texto exato | Onde |
|---|---|---|---|
| `src/content/chapters/aparencia-virtudes-vontade.md` | 105 | "a rolagem passa a ser **Atributo + Habilidade + Virtude**" | viva |
| `virtude-jogada.md` | 118-120 | "`Atributo+Habilidade+Virtude`... já fechado, sem risco" | doc (design, mas tratado como decidido) |
| `Pendencias.md` | 115, 621 | "M-18 · Canalizar Virtude com carga binária... decidida em 16/09" / "L102 ... Canalizar Virtude: teto ou contrapartida" | nota (pendência é só o teto, não a fórmula) |
| `legacy/New_RPG_System_D6_Consolidado.md` | 152 | "a rolagem vira **Atributo + Habilidade + Virtude**" | obsoleta (pasta `legacy/`, fora do livro atual) |

### 2 · Resistência do corpo (dor, tortura física, veneno/doença de Arte, Estabilizar)

Em todos estes casos o texto vivo já EXPLICA por que soma Atributo: a posição oficial hoje é
que só a "pressão da alma" é teste de Virtude sozinha, e a dor do corpo continua sendo
Atributo + Virtude. É a mesma regra citada oito vezes por arquivos diferentes.

| Arquivo | Linha | Texto exato | Resolve | Onde |
|---|---|---|---|---|
| `src/content/chapters/aparencia-virtudes-vontade.md` | 47 | "aguentar a dor do ferro é corpo, e rola Vigor + Convicção" | tortura (metade do corpo) | viva |
| `src/content/chapters/aparencia-virtudes-vontade.md` | 67 | "a dor do corpo continua somando Vigor" | idem | viva |
| `src/content/chapters/aparencia-virtudes-vontade.md` | 86 | "a Convicção continua somada ao Vigor. É **Vigor + Convicção** contra os efeitos das Artes... e para estancar o próprio sangramento (Estabilizar)... **Vontade + Convicção** (Banir, Círculo) continuam como estão" | Artes que invadem o corpo, Estabilizar, Banir/Círculo | viva |
| `src/content/chapters/acoes-resistir.md` | 188 | "Aguentar a **dor do ferro** é corpo: Direta, **Vigor + Convicção**, como o Estabilizar" | tortura (metade do corpo) | viva |
| `src/content/chapters/vida-ferimentos-cura.md` | 75 | "Sozinho, cerrando os dentes, role **Vigor + Convicção vs Dif 10**" | Estabilizar (sangramento) | viva |
| `src/pages/artes/regras.astro` | 74 | "**Corpo e veneno** \| **Vigor + Convicção** (fortitude)" | resistência das Artes que invadem o corpo | viva |
| `src/data/regras.json` | 1100 | `"alternativa": "Vigor + Convicção (em si mesmo)"` | Estabilizar | viva |
| `src/data/regras.json` | 1265 | `"resiste": "Vigor + Convicção (resistência de fortitude)"` | resistência das Artes (tabela "Corpo e veneno") | viva |
| `src/data/condicoes.json` | 136 | `"Estabilizar: Cura contra Dif 10, ou Vigor + Convicção em si mesmo"` | Estabilizar (condição Sangramento) | viva |
| `src/data/efeitos.json` | 2008 | `"valor": "Vigor + Convicção"` (Efeito da Arte de **Vida**, nota: "só quando o alvo não quer o enxerto") | resistência de Efeito de Arte | viva |
| `src/data/efeitos.json` | 2114 | `"valor": "Vigor + Convicção"` (Arte de **Morte**) | idem | viva |
| `src/data/efeitos.json` | 3164 | `"valor": "Vigor + Convicção"` (Arte de **Forças**) | idem | viva |
| `src/data/efeitos.json` | 3395 | `"valor": "Vigor + Convicção"` (Arte do **Tempo**) | idem | viva |
| `src/data/efeitos.json` | 5481 | `"valor": "Vigor + Convicção"` (Arte do **Gelo**) | idem | viva |
| `src/data/efeitos.json` | 5589 | `"valor": "Vigor + Convicção"` (Arte da **Água**) | idem | viva |
| `src/data/efeitos.json` | 6095 | `"valor": "Vigor + Convicção"` (Arte da **Morte**) | idem | viva |
| `src/data/efeitos.json` | 6151 | `"valor": "Vigor + Convicção"` (Arte da **Morte**) | idem | viva |
| `src/data/efeitos.json` | 6211 | `"valor": "Vigor + Convicção"` (Arte da **Morte**) | idem | viva |
| `Trilhas_Feiticaria.md` | 132 | "Resistência conforme a natureza (Vigor+Convicção, Defesa Mental)" | resistência de Arte moldada, documento de trilhas de feitiçaria | doc (proposta, não portada ao site) |
| `Pendencias.md` | 99 | "a dor do ferro é Vigor + Convicção; aguentar sem falar..." | nota da própria decisão da tortura (§17) | nota |
| `REVISAR.md` | 41 | "o veneno da Aranha segue a resolução de 'efeito de Corpo: Vigor + Convicção'" | stat block do bestiário (NPC Aranha, `inimigos.json`) | nota |

### 3 · Espírito/proteção mental de Arte (não é resistência de corpo, é à parte)

| Arquivo | Linha | Texto exato | Resolve | Onde |
|---|---|---|---|---|
| `src/data/efeitos.json` | 3708 | `"valor": "Vontade + Convicção"` (Arte do **Espírito**, "o espírito que rola para não ser banido") | Efeito Banir | viva |
| `src/data/efeitos.json` | 3814 | `"valor": "Vontade + Convicção"` (Arte da **Proteção**, "a criatura que força a linha de um Círculo") | Efeito Círculo | viva |

Nota: **Vontade** aqui é o traço Força de Vontade (0-12), não um Atributo primário. A regra
reafirmada fala em "Atributo ou Habilidade"; se ela também cobre Vontade, estes dois entram na
lista; se não, ficam de fora e a tabela cai para 20 instâncias vivas.

### 4 · Treino/requisito para aprender uma Arte (não é teste, é pré-requisito de ficha)

`Trilhas_Feiticaria.md` usa "+" para listar **perícias/Virtudes exigidas para aprender**, não
para somar um pool de dados. Ainda assim usa a mesma notação e pode confundir leitura futura:

| Arquivo | Linha | Texto exato | Resolve | Onde |
|---|---|---|---|---|
| `Trilhas_Feiticaria.md` | 172 | "Treino: **Briga + Integridade + Temperança** (autocontrole)" | requisito de treino da Trilha "Disciplina do Monge" | doc (proposta) |
| `Trilhas_Feiticaria.md` | 201 (tabela) | "Briga ⌈N/2⌉ · Integridade ⌈N/2⌉ · Temperança ⌈N/3⌉" | idem, versão em tabela | doc (proposta) |
| `Trilhas_Feiticaria.md` | 237 | "cobertas por Integridade+Temperança e Conhecimentos Gerais" | perícia "Meditação/Ciências" não vira perícia própria | doc (proposta) |

`Trilhas_Feiticaria.md` inteiro está marcado com `[PROPOSTA]`/`[TRAVADO]`/`[EM ABERTO]`: é
documento de trabalho, não o capítulo publicado (o capítulo vivo das Artes está em
`src/pages/artes/regras.astro` e não usa essa notação de treino).

## Código (`src/lib`, `scripts`)

**Não achei função nenhuma que some Virtude com Atributo ou Habilidade.** `calc.ts:17`
(`pool(atributo, habilidade)`) só aceita os dois parâmetros de sempre; o teste de Virtude
sozinha está implementado certo em `artes-grid.ts:1879` (`opcoesDeFicarParado`, comentário na
linha 1874: "a Virtude SOZINHA, sem Atributo") e testado em
`scripts/test-artes-grid.mjs:785-811`. O `Canalizar` (seção 1 acima) **não tem implementação**:
nem `calc.ts` nem `ficha-engine.ts` têm função para ele (confirmado também em
`docs/simulacao/caixa/jogador-novo-consertos.md:1127`, achado independente de uma rodada
anterior). O `Estabilizar`/`Vigor + Convicção` também não é calculado pelo motor: aparece só
como texto de referência (`regras.json`, `condicoes.json`, páginas) para o jogador rolar à mão.

## Bestiário (`src/data/bestiario/*.json`)

**Nenhuma ocorrência.** As 309 fichas não têm nota nem habilidade que some Virtude com
Atributo ou Habilidade (varredura por regex nas duas ordens, zero arquivos).

## Falso positivo descartado

`Combate_Social.md:371` ("Dano de Brio agora só enfrenta a Absorção natural (Valor +
Centelha)") **não é uma soma de Virtude com Atributo/Habilidade**: soma Virtude com Centelha e
armadura, que não são Atributo nem Habilidade. O documento inteiro é um design de Combate
Social com **4 canais, cada um absorvido por uma Virtude + Centelha + armadura** (linha 141),
mas isso não bate com o capítulo vivo (`relacoes-sociais.md`), que implementa um Combate Social
bem mais simples, sem canais nem absorção por Virtude. `Combate_Social.md` parece ser um design
anterior, não portado; fica registrado aqui porque apareceu na busca inicial, não porque viole
a regra.

## Documento desatualizado que contradiz o capítulo atual

`resumo-regras.txt` (raiz do repo, não é `.md`) tem uma seção inteira, "15. RESISTIR COM
VIRTUDES" (linhas 273-281), que descreve a regra **exatamente como o autor diz que NUNCA
existiu**: "role a Virtude apropriada somada a um Atributo: Medo/intimidação = Bravura + Vigor;
Provocação = Temperança + Raciocínio; Suportar a dor = Convicção + Vigor." O primeiro caso
(Bravura + Vigor para medo) nem corresponde à regra viva de hoje, que é teste de Bravura
sozinho (`defesas.md:39`, `acoes-resistir.md:190`). A fórmula de Defesa Mental do mesmo arquivo
(linha 267, `(Integridade × 2) + Vontade + Centelha`) também não bate com a atual
(`defesas.md:81`, soma simples sem ×2). O arquivo inteiro está desatualizado, não só nesta
regra; sinalizo porque é a única ocorrência do padrão "Virtude + Atributo" escrita como regra
geral do sistema, e não presa a um caso específico como as demais.

## Atas e documentos de histórico (contados, não listados)

- **22 arquivos** em `docs/simulacao/caixa/` citam algum par "Virtude + Atributo" (rodadas
  90-98 e os documentos de leitura de novato/M-19), quase todos discutindo a MESMA decisão
  (dor do corpo = Vigor + Convicção) que está na seção 2 acima, não uma regra diferente.
- **1 arquivo** fora de `caixa/`: `docs/simulacao/01-diagnostico-carga.md`, do mesmo tipo
  histórico (diagnóstico de uma rodada antiga), fora do escopo estrito do despacho
  (`src/data, src/content, src/pages, src/lib, scripts, lore, .md da raiz`), citado aqui por
  transparência.

## Contagem por categoria

| Categoria | Instâncias vivas | Docs/propostas | Notas/atas |
|---|---:|---:|---:|
| Canalizar (bônus voluntário) | 1 (+1 se contar `virtude-jogada.md` como decidido) | 1 | 2 |
| Resistência do corpo (dor/tortura/veneno-doença de Arte/Estabilizar) | 17 | 1 | 2 |
| Espírito/proteção (Vontade + Convicção) | 2 | 0 | 0 |
| Treino de Trilha de Feitiçaria (pré-requisito, não teste) | 0 | 3 | 0 |
| Documento obsoleto (regra geral errada) | 0 | 0 | 1 (`resumo-regras.txt`) |
| Legado (`legacy/`) | 0 | 0 | 2 |
| Atas de `docs/simulacao/caixa` | — | — | 22 |
| Diagnóstico fora de `caixa` | — | — | 1 |
| **Total de linhas de regra viva a decidir** | **20-21** | | |

## Para a decisão do autor, por grupo

1. **Canalizar** (o achado principal, seção 1): manter a soma tripla, trocar a fórmula, ou
   descontinuar o bônus? É a única categoria em que o próprio autor já registrou a soma como
   "fechada" em outro momento (`virtude-jogada.md`, `Pendencias.md` M-18).
2. **Resistência do corpo** (seção 2, 17 instâncias vivas): candidata natural a **Vigor +
   Resistência** (como o resto do capítulo Resistir já faz para veneno/doença/ambiente/sono),
   tirando a Virtude do meio de vez, ou a manter como "Vigor + Convicção" só que decidindo que
   a regra reafirmada não cobre este caso específico.
3. **Espírito/proteção** (seção 3, 2 instâncias): decidir se "Vontade" conta como Atributo para
   efeito da regra; se não contar, este grupo fica fora da correção.
4. **`resumo-regras.txt`**: por estar desatualizado em mais de uma regra (não só Virtude), talvez
   mereça reescrita completa ou remoção, e não um remendo pontual.
