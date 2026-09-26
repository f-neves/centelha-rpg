# A ficha de criatura

Desde o B14 (fase 1, 26/09/2026), cada criatura do bestiário mora num arquivo só:
`src/data/bestiario/<id>.json`. O nome do arquivo é o `id`. O formato está escrito em
`scripts/criatura-schema.mjs` (zod, `.strict()`: chave desconhecida para o build) e é conferido
pelo `npm run validate`, dentro do `scripts/validate-data.mjs`.

Antes, a mesma criatura morava em onze lugares:

- os builds inline do `gen-bestiario.mjs`;
- o `DATA` e o `PODERES` do `conversao-monstros.html`;
- o `conversao-extra.json`;
- oito satélites por id: habilidades, dimensões, lore, imagens, ecologia, elementos, deslocamento e
  categoria-extra;
- o `inimigos-custom.json`.

A migração que juntou tudo é o `scripts/migrar-bestiario.mjs`, que lê as fontes antigas no git
(commit `d884b4a`) e prova sozinho que o stat block de cada ficha nova é o de antes.

## O caminho do dado

```
src/data/bestiario/<id>.json ──► gen-bestiario.mjs ──► src/data/inimigos.json (stat block)
         │                                                    │
         └──────────────────────► gen-monsters.mjs ◄──────────┘
                                         │
                                         ├──► src/data/monsters.json      (o card, o /bestiario)
                                         └──► src/data/monsters-mesa.json (o recorte da mesa)
```

A conta (PV, Defesa, Absorção, Iniciativa, paradas de ataque, as perícias do `inimigos.json`) mora em
`scripts/lib-bestiario.mjs`. Os três JSON gerados ficam commitados; o `gen-bestiario.mjs --check`
roda no `validate` e no `build`.

**Nada na conta lê o desafio.** O papel, as perícias, a Vontade, a Aparência e as Virtudes, que antes
saíam do `ameaca`, estão escritos em cada ficha com o valor que tinham. Recalibrar o desafio passa
a ser mudar o `ameacaLegada` (e depois trocá-lo pela escala nova), sem mexer em mais nada da criatura.

## Os campos com o nome da ficha do jogador

Mesmo nome e mesmo formato do que a ficha do personagem grava (`scripts/ficha-schema.mjs`).

| campo | o que é | o que alimenta |
|---|---|---|
| `attrs` | os nove Atributos, todos escritos | toda a conta do stat block; `atributos` no card |
| `skills` | as Habilidades primárias, `{id: valor}` | Defesa (Esquiva), Iniciativa (Prontidão), Defesa Mental (Integridade), Defesa Social (Sociabilidade, ou a melhor social), a parada de cada ataque (a perícia que ele cita) |
| `skills2` | as secundárias, no mesmo formato | a parada de um ataque que cite uma delas (`acerto-arcano`) |
| `spec` | bônus fixo de especialidade, `{esquiva, social}` | soma na Defesa e na Defesa Social. Nenhuma criatura usa hoje |
| `virtues` | Compaixão, Convicção, Temperança e Valor | `virtudes` no card e na mesa |
| `willpower` | a Vontade de base | Defesa Mental; `vontade` na saída (mais o `bonus.vontade`) |
| `aparencia` | a Aparência (criatura pode passar de 10 ou ficar abaixo de 0) | `aparencia` no card e na mesa |
| `centelha` | a Centelha | Defesa, Defesa Mental, Absorção pela régua; `centelha` na saída |
| `arte` | `{id da Arte: nível}` | `artes` na saída |
| `tech` | `{id da Técnica: true}` | `tecnicas` na saída, e o card resolve nome e Caminho |
| `equip` | só `armaduras` (a primeira conta), para o NPC de armadura | Absorção, Resistência à Perfuração e a penalidade na Defesa |
| `conjuntos` | as mãos, no formato da ficha. Nenhuma criatura usa hoje; o ataque de arma do NPC continua em `ataques` | nada ainda |

**Chaves de perícia antigas.** `armas-uma-mao`, `armas-duas-maos`, `escudos` e `tatica` vêm dos NPCs
escritos antes da Reestrutura de Perícias e ficaram como estavam. O esquema as aceita, e só elas,
pela lista `PERICIAS_LEGADAS` do `criatura-schema.mjs`, que diz para onde cada uma provavelmente vai.

## Os campos da criatura

| campo | o que é | o que alimenta |
|---|---|---|
| `ordem` | a posição no `inimigos.json` | só a ordem do arquivo gerado. Ficha sem `ordem` vai para o fim, por id |
| `id` | o slug, igual ao nome do arquivo | tudo, e a imagem e a mesa se prendem a ele. Não se renomeia |
| `nome` | o nome em português | `nome` (o card ordena por ele) |
| `nomeIngles` | o nome no material de origem, ou `null` | `nomeIngles` no card |
| `categoria` | o tipo no molde do Bestiary 1 (Animal, Construto, Corruptor...) | `categoria` no card e na mesa |
| `categoriaLegada` | a categoria que o `inimigos.json` sempre trouxe, quando é outra | `categoria` do `inimigos.json` e a Furtividade pela categoria (ver abaixo) |
| `papel` | capanga, soldado, elite, fera ou chefe | `tipo` no card, no `inimigos.json` e na mesa. Antes saía do desafio; agora é escrito |
| `conceito` | uma linha: quem é | `conceito` |
| `descricao` | a descrição do card | `descricao` no card |
| `descricaoLegada` | a descrição que o `inimigos.json` sempre trouxe, quando é outra | `descricao` do `inimigos.json` |
| `tags` | marcas livres (`centelha`, `incorpóreo`, `mágico`...) | busca e editor; a Furtividade soma pela tag |
| `imagem` | o caminho da arte em `public/`, ou `null` | `imagem` e `semImagem` no card |
| `porte` | o rótulo: Miúdo, Pequeno, Médio, Grande, Enorme, Imenso, Colossal | PV por porte, couraça de porte, Furtividade; `porte` no card |
| `dimensoes` | `{medida, peso}`, em texto | o card |
| `material` | de que a criatura é feita (lista em `scripts/lib-materiais.mjs`) | fraquezas e resistências, quando a ficha não as escreve |
| `locomocao` | metros por Tick, por modo: `terra`, `voo`, `natacao`, `escalada`, `escavacao` | o `deslocamento` da mesa (ver abaixo) |
| `ataques` | os ataques naturais, no formato compacto (`atrib`, `pericia`, `dado`, `mao`, `tipo`, `acerto`, `perf`, `ticks`, `distancia`, `notas`) | a parada, o dano, o nível de perfuração e a Velocidade de cada ataque |
| `bonus` | soma por cima da conta: `pv`, `defesa`, `defesaSocial`, `defesaMental`, `vontade`, `resistPerf`, `iniciativa`, `absorcao` e `absorcao_<modo>` | os derivados. É visível de propósito: a criatura continua na régua e a diferença aparece |
| `couraca` | `{couraca, resistPerf}` que substitui a couraça de porte | Absorção dos letais e Resistência à Perfuração. Só o roc usa (pássaro imenso sem couraça) |
| `poderes` | `{efeito, tipo, alvo, arte?, caminho?}`, com `tipo` natural, proeza ou feitiçaria | `poderes` no card |
| `fraquezas`, `resistencias` | palavras do vocabulário fechado (`elementos-vocab.json`) | `combate.fraquezas` e `combate.resistencias` |
| `habilidades` | `{nome, descricao}`: os dons em prosa | o card |
| `lore` | `{titulo, texto}` | o card |
| `ecologia` | `{tipo, terreno, clima}`, no vocabulário do PF | o card, o filtro do /bestiario e a mesa |
| `notas` | caderno do mestre | `notas` (não desce para a mesa) |
| `pendente` | marca de trabalho: a conversão ainda não foi revista à mão | `pendente` no card |
| `fonte` | a origem: `livro`, `nome`, `cr`, `tipo`, `tamanho`, `valores` (os seis valores de habilidade crus), `pericias`, `nota`, `exemplo`, e `deslocamento` (`ft`, `origem`, `nota` da semeadura) | nada na conta. É o rastro, para recalibrar sem voltar ao PDF |
| `variantes` | `{id, nome, delta}`, vazio por enquanto | nada ainda |
| `ameacaLegada` | o desafio de hoje, de 1 a 6 | só `ameaca` na saída, para exibir até a calibração nova |

### O deslocamento

A peça do Grid anda pelo `locomocao.terra`. Sem ele, anda pelo maior dos outros modos (o falcão voa,
o tubarão nada). As três velocidades da mesa saem desse passo pela régua humana do
`gen-deslocamento.mjs`: arranque ≈ passo × 1,6, corrida ≈ passo × 2,3, sem deixar a ordem inverter.
Ficha sem `locomocao` nenhuma anda como o soldado.

Na migração, cada ficha recebeu **um** modo: o que a semeadura usava para a peça (o `voo` ou a
`natacao` quando a nota da semeadura dizia, a `terra` no resto). Os outros modos do material de
origem estavam só em comentário e em nota, e não foram migrados.

### A caixa de entrada

O botão "copiar JSON" do editor do /bestiario ainda entrega o formato antigo, para colar em
`src/data/inimigos-custom.json`. A caixa continua valendo: o `lib-bestiario.mjs` converte cada
objeto dela numa ficha na leitura (`deCustom`). Para virar ficha de verdade, o objeto sai da caixa
e vira `src/data/bestiario/<id>.json`. Id repetido entre a pasta e a caixa para o gerador.

A criatura da caixa ainda não tem `locomocao`. Se ela não declarar `deslocamento`, o passo vem da
semente do `gen-deslocamento.mjs` (tabela por tipo e porte), como antes do B14, e a ordem para
regerar é a de sempre: `gen-bestiario`, `gen-monsters`, `gen-deslocamento`, `gen-monsters` de novo.

## O que é padrão por categoria, e onde mora

Nas 309 fichas da migração estes valores estão escritos. O padrão só vale para criatura nova, e é
o ponto de partida, não uma regra que se aplica por cima.

| o quê | por onde | onde mora |
|---|---|---|
| PV | porte (base e multiplicador do Vigor) | `regras.json` · `derivados.pv.porte` |
| couraça de porte | porte (Absorção nos letais e Resistência à Perfuração) | `regras.json` · `dano.couracaPorte` |
| Furtividade do `inimigos.json` | porte, mais a categoria (`categoriaLegada` quando houver), mais as tags; exceção por id | `regras.json` · `furtividadeCriatura` |
| fraquezas e resistências | categoria (Morto-vivo, Corruptor, Celestial, Planta, Limo, Construto), a tag `incorpóreo`, e o material, que vence a categoria | `scripts/gen-elementos.mjs` (a semente) e `scripts/lib-materiais.mjs` |
| deslocamento | `ecologia.tipo` e porte, em pés do PF, ÷ 10 | `scripts/gen-deslocamento.mjs` (a semente) |
| Aparência | `ecologia.tipo` | `AP_BASE` em `scripts/lib-bestiario.mjs` |
| Virtudes | `ecologia.tipo` | `V_BASE` em `scripts/lib-bestiario.mjs` |

**As duas sementes continuam no `validate`.** O `gen-elementos.mjs` e o `gen-deslocamento.mjs` ainda
geram `elementos-bestiario.json` e `deslocamento-bestiario.json`, e o que está escrito na ficha tem de
concordar com eles: o `validate-data.mjs` compara as fraquezas e o `test-deslocamento.mjs` compara o
deslocamento. Mudar um lado sem o outro para o build. Aposentar as sementes (e a ficha passar a ser a
única fonte desses dois campos) fica para decidir.
