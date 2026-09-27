# 06 · Especificação da padronização dos dados

26/09/2026 · Frente B · Para a equipe do projeto, **sem implementação**.

**Decisão do autor:** `nao_se_aplica`, `ainda_nao_definido` e `usa_regra_padrao` são valores distintos no dado. Quantidades vagas ficam indefinidas agora e recebem números depois da régua. Arbitragem narrativa exige intenção expressa do autor. Padronizar não autoriza mudar poderes.

FATO indica fonte verificável; INFERÊNCIA indica consequência interpretada; PROPOSTA indica contrato a implementar após revisão. Linhas são uma fotografia desta leitura e devem ser reconferidas antes de editar. Esta entrega escreve somente na pasta `docs/export/proezas/chatgpt/`. A ocultação de Fôlego pertence à equipe normal do projeto.

## B1. Contrato de dados proposto

### FATO · Estado atual

Leitura dos JSONs nesta data: 461 Técnicas, 24 Artes, 140 Efeitos. São contagens desta fotografia, não constantes novas para componentes.

Técnicas têm identidade, nível, tipo, custo e referências, mas `efeito` é categoria de escala; a mecânica particular fica em `texto`. Faltam campos próprios de alcance, duração, resistência e partes de um efeito composto. Fonte: [src/content.config.ts:79](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content.config.ts:79).

Artes têm `niveis[]`, `efeito: string`, Mana opcional e exemplos em strings; o schema aceita cinco ou seis entradas ([src/content.config.ts:98](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content.config.ts:98)). A página esclarece:

> Os seis níveis de cada Arte são <em>exemplos de alocação típica</em> daquele patamar, não a regra

Fonte: [src/pages/artes/catalogo.astro:14](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/catalogo.astro:14). Não transformar automaticamente exemplo em feitiço normativo nem Mana ilustrativo em custo universal da Arte.

Efeitos já têm parâmetros `padrao/substitui/fixo`, mas escalas/valores são strings e `regua` distingue breve/longa ([src/content.config.ts:121](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content.config.ts:121)). Esses três tipos indicam origem/comportamento do parâmetro; **não equivalem** aos três estados adotados pelo autor.

### PROPOSTA · Parâmetro com estados explícitos

```typescript
type Parametro<T> =
  | { estado: 'definido'; valor: T; fonte: Fonte }
  | { estado: 'nao_se_aplica'; motivo: string; fonte: Fonte }
  | { estado: 'ainda_nao_definido'; pendenciaId: string;
      motivo: string; textoOriginal: string; fonte: Fonte }
  | { estado: 'usa_regra_padrao'; regraId: string; versao: string;
      argumentos: Record<string, ValorTipado>; fonte: Fonte };
```

Quatro variantes: as **três situações exigidas** e uma para valor conhecido. `null`, string vazia, chave ausente e zero não substituem estado. Bônus zero definido difere de não aplicável. Gratuito é custo zero definido, não custo desconhecido. Campo obrigatório ausente reprova o schema; ausência legada passa por triagem, nunca recebe padrão automático.

`Fonte`: `arquivo:string`, `localizador:string` estável (id/caminho do campo), `linha:inteiro positivo`, `hashConteudo:string`, `trecho:string`. Decisões acrescentam `decisaoId` e data. Linha sozinha envelhece; o localizador permite reencontrar a fonte.

Invariantes do resolvedor:

- `definido` exige valor e proíbe regra concorrente; `usa_regra_padrao` exige referência e proíbe cópia local do valor.
- Padrão deve existir, ter versão e aceitar argumentos/unidade. Referência quebrada ou circular é erro. Se a regra referida estiver pendente, o resultado também fica pendente, conservando a referência.
- `ainda_nao_definido` impede calcular aquele resultado. Não vira zero, infinito, uso ilimitado ou decisão narrativa automática; partes conhecidas continuam consultáveis.
- `nao_se_aplica` exige motivo e não recebe fallback.
- O site e os testes contam estados por entidade/campo, incluindo herança, pendência e exceção. Um Efeito exibido em várias Artes conta uma vez por id.

### PROPOSTA · Valores mecânicos tipados

| Tipo | Representação | Erro evitado |
|---|---|---|
| Quantidade | tipo, valor numérico, unidade por id | Confundir PV, Energia, pontos, metros e multiplicadores. |
| Dados | quantidade inteira, faces=6, modificador fixo | Reinterpretar `2d6+2` em cada tela. |
| Modificador | alvo por id, operação somar/subtrair/multiplicar/substituir, valor e condição | Trocar dado removido por ponto subtraído. |
| Geometria | forma, dimensão comprimento/área/volume, medidas e unidades | Tratar três lados de 0,5 m como volume de 0,5 m³. |
| Tempo | quantidade/unidade tick/ação/cena/hora/dia ou condição de término | Converter cena em quantidade fixa de Ticks sem regra. |
| Escala | id, versão, índice nomeado nível/grau, domínio e unidade | Deslocar grau 0 para 1; supor seis valores em toda escala. |
| Fórmula | árvore de operações permitidas, referências e arredondamento explícito | Avaliar strings arbitrárias ou duplicar fórmulas na apresentação. |
| Capacidade qualitativa | categoria, alvo, condições, limites e parâmetros | Forçar todo estado a virar bônus numérico. |
| Arbitragem narrativa | `tipo:'arbitragem_narrativa'`, escopo, limites, `decisaoAutorId`, dentro de `definido` | Usar narrativa para disfarçar quantidade que falta. |

Unidades, recursos, alvos, condições e escalas são catálogos referenciáveis. Texto de apresentação continua string; **texto não pode ser a fonte operacional de um número**. Números tipados na fonte são necessários. O problema é o número mecânico solto na tabela/componente.

### PROPOSTA · Envelope comum

| Campo | Tipo e responsabilidade |
|---|---|
| `schemaVersao` | inteiro obrigatório |
| `id`, `nome`, `aliases` | slug estável, string, string[]; preservar ids |
| `tipoEntidade` | tecnica/arte/efeito |
| `textoOriginal`, `fontes` | prosa integral e Fonte[]; manter procedência |
| `pendencias` | id, campo, motivo, variantes de fonte e estado da decisão |
| `excecoes` | id, regra substituída, escopo, representação anterior/nova, fonte e decisão quando existir |
| `disponibilidade` | referência à política de módulos; preservar semântica atual de Fôlego |
| `integracoes` | contratos versionados dos consumidores, incluindo Grid; conservar legado até validar migração |

Distinguir exceção **já publicada**, **conflito legado** e **proposta**. Só a regra publicada participa do cálculo vigente. Se fontes discordam, preservar variantes e resultados dos consumidores até uma correção própria. Proposta não se torna regra por entrar em JSON.

### PROPOSTA · Técnicas

| Campo | Tipo / responsabilidade |
|---|---|
| `caminhoId`, `atributoId` | referências obrigatórias |
| `nivel` | inteiro no domínio central atual 1–6 |
| `trilhaId` | categoria hoje chamada `efeito`; renomear por adaptador sem mudar slug |
| `requisitos` | expressão todos/qualquer e referências; `prereq[]` atual vira todos; gate de Centelha preservado |
| `progressao` | parâmetro com família, escopo e eventual evolução; depende de A2/A4, não se deduz de pré-requisito |
| `ativacao.tipo` | passiva/ativa/reflexiva, preservado |
| `ativacao.modo`, `gatilho`, `tempo`, `frequencia` | parâmetros: suplementar/independente/postura somente quando comprovado |
| `custosUso` | mapa recurso → parâmetro, evento de cobrança; recuperação separada |
| `custoCompra` | referência à política central de XP; manter cálculo atual até alteração autorizada |
| `efeitosMecanicos` | lista de operações/capacidades, valores, condições, alvos e fontes |
| `alcance`, `area`, `alvos`, `duracao`, `resistencia`, `acumulacao` | parâmetros obrigatórios por efeito, com estados explícitos |

Não copiar a trilha para todo número da Técnica. Uma entrada pode dar Absorção e reduzir penalidade de ferimento: são operações distintas. Preservar dado/ponto, passivo/temporário e geral/condicional.

### PROPOSTA · Artes

| Campo | Tipo / responsabilidade |
|---|---|
| `categoria`, `atributoConjuracaoId` | categoria e referência preservadas |
| `niveis` | níveis únicos/ordenados; ausência vira pendência, não conteúdo inventado |
| `niveis[].nome`, `descricaoOriginal` | apresentação preservada |
| `niveis[].exemplos` | id, texto, `natureza:'exemplo'`; alocação/custo só quando demonstráveis |
| `regrasConjuracao`, `custoCompra`, `custoUso`, `tempo`, `resistencia` | parâmetros com referências centrais e exceções |
| `parametrosPermitidos` | ids e restrições; não impor geometria elemental às outras Artes |
| `efeitosDisponiveis` | derivado dos vínculos dos Efeitos, sem segunda lista concorrente |
| `tradicao` | referência ou pendência, sem resolver C1/C2 pela tipagem |
| `integracoes.grid` | contrato preservado; conferir leitura direta versus collection |

Mana ilustrativo de um nível e custo de conjuração por parâmetros são conceitos separados. Podem manter `legado.custo` até a natureza do valor estar comprovada, sem substituir a fórmula real.

### PROPOSTA · Efeitos Especiais

| Campo | Tipo / responsabilidade |
|---|---|
| `nivel`, `artes` | nível de compra e vínculos arteId+sabor, sem duplicar compra por Arte |
| `escalonavel` | preservar booleano; sucessão por diferença é pendência, não dedução |
| `parametros` | mapa por ids, `Parametro<T>` e modo herda/sobrescreve/fixo |
| `substituiParametroId` | referência explícita ao parâmetro substituído |
| `operacoes`, `condicoes`, `resistencia`, `termino` | estruturas tipadas, estados e fontes |
| `acaoLivre`, `tempo`, `custos` | semântica vigente, inclusive ausência legada; padrão só com fonte |
| `integracoes.grid` | forma, alvo, persistência, gatilho, dano/cura etc., sem descarte |

`regua:'breve'` vira referência versionada à escala breve com domínio explícito. Escala local legítima continua como exceção tipada, sem arredondamento para caber na central.

### PROPOSTA · Marcação dos indefinidos nesta especificação

Os seguintes registros marcam agora os casos citados, **sem editar o catálogo**. São amostra rastreável do registro, não alegação de tipagem integral. Cada linha herda a fonte indicada abaixo; a equipe deverá preencher o envelope Fonte no dado migrado.

```json
[
  {"entidadeId":"segundo-folego","campo":"cura.quantidade","estado":"ainda_nao_definido","pendenciaId":"pv-segundo-folego","textoOriginal":"Recupera um punhado de PV de Impacto numa ação."},
  {"entidadeId":"estancar","campo":"cura.quantidade","estado":"ainda_nao_definido","pendenciaId":"pv-estancar","textoOriginal":"Fecha um sangramento e recupera um punhado de PV numa ação; a carne já responde depressa."},
  {"entidadeId":"campo-emocional","campo":"area","estado":"ainda_nao_definido","pendenciaId":"area-campo-emocional","textoOriginal":"impõe uma emoção a todos numa área por um tempo."},
  {"entidadeId":"campo-emocional","campo":"duracao","estado":"ainda_nao_definido","pendenciaId":"duracao-campo-emocional","textoOriginal":"impõe uma emoção a todos numa área por um tempo."}
]
```

Fontes: [docs/export/proezas/proezas-completas.md:1246](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:1246), [docs/export/proezas/proezas-completas.md:1259](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:1259), [docs/export/proezas/proezas-completas.md:546](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:546). Segundo Fôlego cura PV; seu nome não o torna parte do módulo Fôlego.

Esquiva Impossível continua pendente; Brecha Emocional conserva alternativas contraditórias; Reflexos Premonitórios conserva a ambiguidade de refazer Defesa passiva. Nada recebe um poder substituto para satisfazer o schema.

## B2. Inventário de tabelas e componentes

**FATO:** inspecionados os três arquivos de `src/pages/artes/`, página de Caminho, `TecnicaItem`, `ArvoreTecnicas`, `FormasPop`, `artes-fmt`, consumidores correspondentes em `ficha-engine`, `data`, `calc`, schemas e capítulos abaixo. É inventário da frente Proezas/Artes e referências comuns; não certifica auditoria de todo o sistema. CSS e coordenadas SVG são apresentação, não números mecânicos.

### FATO · Valores ou regras manuais confirmados

| ID | Arquivo e linha | Conteúdo manual | Destino proposto |
|---|---|---|---|
| M01 | [src/content/chapters/centelha.md:52](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/centelha.md:52) | Tabela níveis, nomes e acesso por C. | Escala/gate centrais. |
| M02 | [src/content/chapters/centelha.md:71](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/centelha.md:71) | Oito trilhas com seis valores escritos em Markdown. | Gerar de `regras.escalasProeza`. |
| M03 | [src/lib/data.ts:6](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/lib/data.ts:6); [src/components/ArvoreTecnicas.astro:57](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/components/ArvoreTecnicas.astro:57) | Nomes Tocado…Semideus duplicados; árvore itera até 6 na linha 61. | Domínio/rótulos centrais. |
| M04 | [src/pages/caminhos/\[id\].astro:17](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/caminhos/[id].astro:17) | Lista construída com `length: 5`, apesar dos seis níveis. | Derivar níveis; corrigir cobertura em mudança separada. |
| M05 | [src/lib/artes-fmt.ts:38](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/lib/artes-fmt.ts:38) | Cura `2 · 1d6 · 1d6+2 · 2d6 · 2d6+2 · 3d6 (2 de Mana por nível)`; linha 39 fixa `1d6 por nível` no dano. | Escalas/custos centrais, referidos por id, não por prefixo do nome. |
| M06 | [src/pages/artes/regras.astro:25](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:25); linhas 266, 367, 412, 439 | Colunas de graus/níveis e distâncias de exemplo fixadas na tela. | Domínio da escala ou cenário estruturado. |
| M07 | [src/pages/artes/regras.astro:36](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:36) | `EX_CONTA`: frases, contas e totais 0/1/5/7 manuais; linhas 393–394 fazem desconto C2/C4 localmente. | Entradas de exemplo + cálculo comum; resultado derivado. |
| M08 | [src/pages/artes/regras.astro:59](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:59) | Tempos 5/6/7 e faixas de nível em callout. | Política de tempo central. |
| M09 | [src/pages/artes/regras.astro:73](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:73) | Cinco linhas manuais de resistência, incluindo Vigor + Resistência e Força/Atletismo versus nível. | Política tipada; preservar ambiguidades sem decidir. |
| M10 | [src/pages/artes/regras.astro:81](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:81) | Saída de área; linha 82 fixa Margem de 6 e Absorção por natureza. | Referências e exceções centrais. |
| M11 | [src/pages/artes/regras.astro:85](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:85); [src/pages/artes/regras.astro:382](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:382) | Custo por grau, grau zero grátis, teto e desconto em prosa local. | Política central de custo/acesso. |
| M12 | [src/pages/artes/regras.astro:448](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:448) | Cura 4 + Alcance 1 = 10 Mana escrito diretamente. | Exemplo estruturado e calculado. |
| M13 | [src/pages/artes/regras.astro:467](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:467) | 6/10/16 pontos e Velocidade 5/10/15; linha 469 repete Ticks. | Cenário + fórmula de esticar/tempo. |
| M14 | [src/pages/artes/regras.astro:474](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:474) | Sobretaxa de conjuração composta; linha 475 traz 3+1+1=5. | Fórmula central; não confundir sobretaxa de cada acréscimo com total. |
| M15 | [src/pages/artes/regras.astro:483](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:483) e linha 487 | Desconto de Ritual e 1 FV por grau em texto local. | Política de Ritual com pendências preservadas. |
| M16 | [src/pages/artes/regras.astro:506](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:506) | Feitiço guardado: −1 Raciocínio passivo e −1d6 ativo. | Duas operações tipadas e condição de término. |
| M17 | [src/pages/artes/regras.astro:513](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:513) | Fraqueza ignora Absorção, agrava dano e fere quem apara; linha 534 fixa 308 criaturas. | Regras qualitativas centrais e contagem gerada. |
| M18 | [src/pages/artes/efeitos.astro:31](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/efeitos.astro:31); [src/pages/artes/efeitos.astro:61](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/efeitos.astro:61) | Prosa cobra 4×nível; tooltip usa `e.nivel * 2`. | Consumidor de XP comum; conflito registrado antes da correção. |
| M19 | [src/components/FormasPop.astro:9](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/components/FormasPop.astro:9) e linha 16 | Notas fixam quadrado/cubo como referência de medida. | Convenção geométrica central; SVG continua apresentação. |
| M20 | [src/content/chapters/coracao-do-sistema.md:18](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/coracao-do-sistema.md:18) | Tabela soma → dados; tabela de Dificuldades na linha 65. | Gerar de fórmula e `regras.dificuldade`. |
| M21 | [src/content/chapters/vida-ferimentos-cura.md:38](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/vida-ferimentos-cura.md:38) | Tabela de limiares/penalidades escrita no capítulo. | Gerar de `regras.ferimentos`, sem corrigir Técnica divergente. |
| M22 | [src/content/chapters/combate.md:434](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/combate.md:434); linhas 443, 451, 457 | Tipos/tempo, combo, posturas e acumulação em tabela/prosa. | Regras referenciáveis, conservando exceções. |

**INFERÊNCIA:** mover valores para JSON sem trocar os consumidores não resolve a duplicação. Componentes devem pedir e formatar resultados; exemplos devem declarar que são exemplos e de quais entradas saem seus números.

### FATO · O que já vem dos dados

| Apresentação | Origem já existente | Trabalho restante |
|---|---|---|
| [src/pages/artes/regras.astro:15](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/regras.astro:15), tabela na linha 93 | `G` vem de `regras.arcano.improviso.graus`. | Tipar valores/unidades; não criar tabela concorrente. |
| Mesmo arquivo: linhas 117, 142, 169, 182, 202, 218, 248, 268, 288 | Estados, canais, manifestação e moldes vêm de `regras`. | Validar domínios e strings mecânicas. |
| Mesmo arquivo: linhas 316, 345, 354, 369, 414, 441, 461 | Tempo, desvio, fonte, Cura, esticar usam dados centrais. | Tipar e derivar cabeçalhos; não reescrever valores. |
| [src/pages/artes/catalogo.astro:44](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/catalogo.astro:44) | Níveis/exemplos de `artes.json`. | Separar ilustração de regra e verificar alocações. |
| [src/pages/artes/efeitos.astro:57](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/artes/efeitos.astro:57) | Efeitos/parâmetros de `efeitos.json`. | Retirar XP local e escalas do formatador. |
| [src/components/TecnicaItem.astro:8](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/components/TecnicaItem.astro:8) | `modProeza` e `custoTecnica`. | Conferir badge versus texto específico; ler escala não prova equivalência. |
| [src/components/ArvoreTecnicas.astro:47](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/components/ArvoreTecnicas.astro:47) | Badge lê escala central. | Unificar consumidor e exceções. |
| [src/lib/ficha-engine.ts:19](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/lib/ficha-engine.ts:19), chamada na linha 676 | Importa `valorPar`. | A ficha é consumidor da mudança no formatador, precisa de teste. |

Catálogos gerados de outras frentes, como perícias, não são edições manuais só porque a saída é Markdown. Alterar gerador/fonte pertinente, mantendo procedência.

### FATO e INFERÊNCIA · Divergências separadas da migração

| ID | Evidência | Tratamento |
|---|---|---|
| E01 | [src/components/ArvoreTecnicas.astro:46](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/components/ArvoreTecnicas.astro:46) lê `xp.tecnica.valor`, ausente em [src/data/regras.json:634](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:634); linha 120 multiplica por ele. | **INFERÊNCIA:** cadeia não vazia resulta em NaN. Confirmar no consumidor; corrigir separadamente, sem inventar preço legado válido. |
| E02 | Texto paga diferença; ficha soma cada id ([src/lib/ficha-engine.ts:2139](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/lib/ficha-engine.ts:2139)). | A4 decide política. Tipagem conserva cálculo atual; não concede desconto. |
| E03 | Tooltip XP ×2, prosa ×4, dado `mult:4` ([src/data/regras.json:648](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:648)). | Capturar resultados por consumidor; correção de tooltip separada. |
| E04 | Lista de Caminho termina em N5 ([src/pages/caminhos/\[id\].astro:17](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/pages/caminhos/[id].astro:17)). | Teste deve acusar cobertura; conserto de publicação separado. |
| E05 | Fogo N3: `jato de fogo em linha (2d6)` na linha 39; `jato de fogo em linha, 3d6` na 44 de [src/data/artes.json:39](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/artes.json:39). | Preservar ambos como exemplos; alocação não comprovada fica indefinida; não eleger dano universal. |
| E06 | `grid` existe em [src/data/artes.json:91](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/artes.json:91) e [src/data/efeitos.json:53](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/efeitos.json:53), ausente dos respectivos schemas em [src/content.config.ts:98](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content.config.ts:98). | **INFERÊNCIA:** risco de descarte no parsing. Testar JSON direto/collection; não alegar perda em produção sem prova. |
| E07 | Neblina: unidade m³ com `0,5x0,5x0,5` ([src/data/efeitos.json:36](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/efeitos.json:36)). | Conservar literal; distinguir lados de volume antes de converter. |
| E08 | Aguentar o Tranco cita −1 ([docs/export/proezas/proezas-completas.md:4163](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:4163)); central tem −2 ação/Defesa ([src/data/regras.json:702](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:702)). | Preservar divergência; correção de benefício após régua. |
| E09 | Esquiva Impossível vazia; Brecha Emocional ambígua; Reflexos Premonitórios refaz Defesa. Fonte: catálogo por ids, registrados no 00. | Pendências/variantes, sem poderes substitutos. |
| E10 | Nota da escala fala +2 por C e “4 defesas” ([src/data/regras.json:114](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:114)); fórmulas/dossiê usam +1 e três muralhas. | Conservar fórmula vigente e D7 pendente. |

Registro inicial, **não lista de mudanças permitidas**. Cada novo conflito recebe entrada antes da migração do lote. Exceção nunca é autorização genérica para diferença mecânica.

## B3. Teste de equivalência: a padronização não muda nenhum poder

**PROPOSTA para a equipe implementar:**

1. **Congelar referência:** hashes dos JSONs/consumidores, ids, versões de regras, estado dos módulos, árvore de requisitos e fichas representativas. Se outra frente alterar a base, registrar nova comparação; não misturar versões.
2. **Duas projeções independentes:** leitor legado e leitor novo produzem registro mecânico canônico: custos, requisitos, operações, unidades, fórmulas, gatilhos, frequência, alcance, alvos, duração, resistência, acumulação e disponibilidade. O leitor legado não pode usar o adaptador novo para “provar” o próprio adaptador.
3. **Comparar todos os campos do lote:** números/frações idênticos; dado continua dado; escalas preservam domínio e ordem; nenhuma condição, negação, imunidade ou limite some. Igualdade de média não prova igualdade entre dado e bônus fixo.
4. **Comparar resultados:** todo domínio finito pertinente de níveis/graus, tipos de dano, estados e modos. Para variáveis abertas, equivalência das expressões normalizadas mais casos-limite declarados. Rolagens comparam distribuição completa e empate. Arbitragem narrativa compara escopo, limites, texto e decisão do autor.
5. **Indefinidos:** exigir estado, texto original e pendência, preservando partes conhecidas. Não se prova igualdade de números quando o primeiro nunca existiu; prova-se que nenhum foi inventado. Pendência não pode virar “não se aplica” para baixar a contagem.
6. **Conflitos:** E01–E10 e novos registros têm campo, variantes e comportamento por consumidor. Bloquear a migração do consumidor conflituoso até solução explícita ou adaptador de compatibilidade. NaN não vira valor mecânico válido nem é corrigido escondido na tipagem.
7. **Consumidores e persistência:** testar ficha, árvore, cartões, tabelas, pesquisa, exports e Grid; conferir artefato gerado além do build. Preservar ids, seleções, XP e compras salvas. Técnicas ocultas continuam ocultas conforme política vigente; nome contendo “fôlego” não é filtro.
8. **Controle negativo:** em cópias isoladas de teste, trocar +3 por +4, remover requisito, converter −1d6 em −1 e substituir indefinido por zero. Cada mutação deve falhar, sem mexer na árvore compartilhada.

**Aceite:** 100% dos ids e campos mecânicos do lote cobertos; zero diferença mecânica introduzida; nenhuma fonte perdida; nenhum indefinido transformado em número; nenhuma exceção sem registro. Relatório separa equivalência comprovada, indefinição preservada e conflito que impede migração. Correção de bug/regra exige alteração própria; não entra numa permissão genérica de padronização.

**Teste de procedência:** cada célula mecânica deve ser rastreável a regra, escala, entidade/campo ou cenário estruturado. Verificação de código sinaliza literais mecânicos em tabelas/formatadores, permitindo apenas rótulos e números visuais explicitamente listados. Procedência e equivalência se complementam.

## B4. Migração em etapas pequenas

Nenhuma etapa é executada nesta entrega. A equipe implementa; decisões A1–A5 e aprovação da régua continuam necessárias para rebalancear.

| Etapa | Mudança | Verificação independente |
|---|---|---|
| 1. Congelar | Inventário, hashes, ids, consumidores e conflitos. | Contagens reproduzíveis; nenhum dado mecânico alterado. |
| 2. Esquema/triagem | Tipos, estados e mapa paralelo por id, conservando prosa. | Todos os campos classificados; estados contáveis; vagos indefinidos. |
| 3. Escalas centrais | Tipar uma escala sem conflito por vez com adaptador legado. | Valores, domínio, unidades e projeção antiga iguais. |
| 4. Piloto de Técnicas | Mãos Hábeis/Obra Bem-Feita; depois caso composto e indefinido. | +3/+4, requisitos, custos e ids iguais; acumulação continua pendente. |
| 5. Por Caminho | Expandir lotes pequenos com relatório de exceções. | Paridade e fichas preservadas; política de Fôlego intacta. |
| 6. Piloto de Arte | Separar exemplos de regras e preservar Grid. | Custos/textos de exemplo e fórmula normativa preservados; geometria não inventada. |
| 7. Piloto de Efeitos | Caso simples e caso com substituição de escala; expandir. | Grau 0/1 correto, compra compartilhada e integrações preservadas. |
| 8. Consumidores | Um por vez: formatador, cartão, árvore, tabela, ficha, Grid, export. | Paridade e prova no gerado; E01/E03/E04 em correções separadas. |
| 9. Retirar duplicações | Remover legado só quando não tiver leitores dependentes. | Referências antigas ausentes; procedência e equivalência aprovadas. |

Cada etapa permite retornar ao leitor anterior conservando dados originais. Schema novo não autoriza mudar nível, custo, escala ou fechar pendências de Artes. Padronização e lotes de rebalanceamento permanecem alterações distintas.
