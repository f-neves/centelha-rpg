# Rodada 112 · Executora · o modelo emite o formato do site

- **Despacho:** `docs/simulacao/caixa/112-despacho.md` (`b95bca6`, atualizado pelo Arquiteto em
  `8da6352` com a decisão do autor sobre `muda` e `parto`).
- **Árvore:** branch `executora`, posta em `b95bca6` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-112.md`, com as horas lidas da máquina.
- **Publicado:** `bc7d3b7` (todo o trabalho, rebaseado sobre `8da6352`). Este relato vai num segundo
  commit.
- **Nenhuma pendência fechou.**

**Arquivos alterados:** `lore/economia/v2/gerar.py`, `scripts/copiar-economia.mjs`,
`scripts/validate-data.mjs`, `scripts/gen-cap-economia.mjs`, `src/data/servicos.json`,
`src/data/viagens.json`, `src/content/chapters/custo-de-servico-e-itens.md`, `.gitignore`,
`lore/economia/README.md`, e `112-executora.md` e `progresso-112.md`.

**Campos de dinheiro que não soube converter: nenhum.** Varri os sete JSONs atrás de número fora
de `{pc}` e sobraram só campos que não são dinheiro:
- o peso das mercadorias;
- a soma, o nível novo, o XP, as jornadas e a soma do professor das aulas;
- as quantidades dos pacotes;
- os recursos, a soma, a média e a faixa de Dificuldade da renda;
- os km por dia das viagens.

## 1 · F4, o que faltava

- **`.gitignore`:** a 111 já tinha `lore/economia/**/out/`. Entraram, pelo nome:
  - `lore/economia/**/*.zip`, `**/__pycache__/` e `**/*.stackdump`;
  - as cópias soltas dos JSONs gerados ao lado do modelo (`lore/economia/*/*.json`), com a exceção
    `!lore/economia/*/*.procedencia.json`, porque a procedência é versionada;
  - os rascunhos (`lore/economia/*proposta*` e `gerar_mercadorias.py`).

  Testei com `git check-ignore --no-index` em 16 caminhos. Ignora os dois zips, o `.pyc`, o
  stackdump, os JSONs gerados de `v2/` e `etapas-abc/`, os três de proposta e o
  `gerar_mercadorias.py`. Versiona as três procedências, o `gerar.py`, o `estado-revisao.md` e o
  `prompt-revisao-economica.md`, que não é rascunho e fica visível para o autor decidir.
- **`README.md`:**
  - **(a)** os JSONs de `src/data` são gerados, e não se edita preço à mão: já estava;
  - **(b)** como gerar: seção nova, `python3 gerar.py` na pasta do modelo, a saída em `out/`, e os
    dois scripts que levam ao site;
  - **(c)** a âncora: seção nova, **1 dia de braçal = 10 pc = 1,5 penny** (Inglaterra 1300 a
    1340, a mesma frase que o `gerar.py` grava na procedência), e onde estão as decisões (v1, v2,
    `estado-revisao.md`).
  - Também a regra do vocabulário (seção 2).

## 2 · O vocabulário de `por`

É a lista do despacho, mais **`ponto`** (o preço de uma aula é pelo ponto ensinado). A tabela diz o
que mudou em relação à 111:

| texto do modelo | 111 | 112 | por quê |
|---|---|---|---|
| `consulta` | `vez` | `consulta` | despacho |
| `atendimento` | `vez` | `atendimento` | despacho |
| `noite` | `vez` | `noite` | despacho |
| `cerimônia` | `vez` | `cerimonia` | despacho |
| `apresentação` | `vez` | `apresentacao` | despacho |
| `carta` | `unidade` | `carta` | despacho |
| `página` | `página` | `pagina` | a lista nova é sem acento |
| `pessoa; 5 com cavalo` | `vez` + nota | `pessoa`, nota "5 com cavalo" | despacho; a base é por pessoa, e o cavalo e a carroça são a variação |
| `pessoa; 3 por animal; 10 por carroça` | `vez` + nota | `pessoa`, nota "3 por animal; 10 por carroça" | idem; não vira `animal`, porque o preço base é da pessoa |
| `tonelada por km` | `km` + nota | `tonelada-km` | despacho |
| `2 toneladas por km` | `km` + nota | `tonelada-km`, nota "2 toneladas" | despacho |
| `muda` | `vez` | `unidade` | **decisão do autor** (`8da6352`) |
| `parto` | `vez` | `atendimento` | **decisão do autor** (`8da6352`) |
| `missa` | `vez` | **`cerimonia`** | **minha**, pela regra do autor de usar o valor que já existe quando couber: missa encomendada é cerimônia. O despacho não a listava |
| `cavalo` (adestrar) | `unidade` | **`animal`** | **minha**: o despacho deixou em `unidade` a menos que merecesse outro, e `animal` está na lista nova e diz exatamente pelo que se paga |
| escravos | `unidade` | **`pessoa`** | **minha**: `pessoa` entrou na lista, e é o que o preço é |

`documento` continua em `unidade`.

**A regra para o futuro** (despacho, `8da6352`) está escrita onde o vocabulário mora: no comentário
do vocabulário em `lore/economia/v2/gerar.py`, com o registro de `muda`, `parto` e `missa`, e no
`lore/economia/README.md`.

Na tabela publicada, o `por` sai como palavra, e não como chave. O `gen-cap-economia.mjs` tem um
mapa só para isso: `pagina` sai "página", `cerimonia` sai "cerimônia", `apresentacao` sai
"apresentação" e `tonelada-km` sai "tonelada por km".

## 3 · O modelo emite o formato

- **`lore/economia/v2/gerar.py`:** a função `formato_site(nome, obj)` escreve todo valor em dinheiro
  como `{"por": ..., "preco": {"pc": N}}`. O `dump` a aplica **numa cópia** do objeto na hora de
  gravar.
  **Por que no `gerar.py`, e não dentro de `modelo.py`/`mercadorias.py`:** o modelo calcula com os
  números soltos, e as tabelas em Markdown do documento (`tab_*.md`, que o mesmo `gerar.py`
  escreve) também leem esses números. Mudar a forma lá dentro obrigaria a reescrever o cálculo e as
  tabelas do documento, sem ganho nenhum para o site. Nada da F2 ficou no JS.
- **`scripts/copiar-economia.mjs` encolheu:** saiu a função de forma inteira (os mapas de unidade e
  a `f2`). Ele só faz a `_nota`, o envelope `{_nota, itens}` dos dois arrays e a separação do
  `_procedencia` das montarias, como antes da F2.
- **A prova de que o porte para o Python é exato:** com o `gerar.py` novo e o vocabulário ainda
  igual ao da 111, o `--check` deu texto **igual** em `custo-de-vida`, `renda` e `pacotes`, que
  são os três onde nenhum `por` mudou, e diferente só em `servicos` e `viagens`.
- **A prova pedida pelo autor, valor a valor:** `../tmp/executora/valores-112.mjs` compara, folha
  por folha, os sete JSONs da 111 (tirados de `HEAD` antes de mexer) com os de agora. O resultado:
  **3.076 folhas; 28 mudaram, todas em `por` ou `nota`; zero em qualquer outro campo.** As 28 são
  as da tabela da seção 2: 13 `por` de serviços, 5 `por` de escravos, e 5 `por` mais 5 `nota` das
  viagens (duas `nota` caíram, as de "por tonelada", porque o `por` novo já diz a coisa).
- O `--check` do `copiar-economia.mjs` (modelo refeito = `src/data` e as procedências) segue no
  `npm run validate`, e está verde.

## 4 · Verificação

1. **Nenhum valor mudou:** a comparação folha a folha acima. E 13 valores lidos no
   `dist/regras/custo-de-servico-e-itens/index.html` depois do build:
   - Nobreza 100 po / 400 po;
   - Perito 334,3 pc;
   - Companhia 108 po;
   - Sustento 14,5 pc;
   - Artista 5 po 7 pp 2 pc;
   - Manter um cavalo 41,6 pc;
   - Cópia simples 2 pc por página;
   - "Professor particular · jornada · ver aulas";
   - e os cinco das células que mudaram, na lista do item 2.
2. **Só a coluna de unidade mudou.** O capítulo difere do da 111 em **16 células, todas na coluna
   de unidade**:
   - Serviços: Lavar uma muda (vez → unidade); Carta (unidade → carta); Curandeiro (vez →
     atendimento); Médico (vez → consulta); Parteira (vez → atendimento); Missa (vez → cerimônia);
     Casamento ou funeral (vez → cerimônia); Músico (vez → noite); Menestrel (vez →
     apresentação); os dois Adestrar cavalo (unidade → animal);
   - Viagens: Frete por terra e por rio ("km (por tonelada)" → "tonelada por km"); Frete por mar
     (→ "tonelada por km (2 toneladas)"); Balsa (→ "pessoa (5 com cavalo)"); Pedágio (→ "pessoa (3
     por animal; 10 por carroça)").
   A tabela de escravos não tem coluna de unidade, e não mudou.
3. **O validador passa**, com a lista nova no `z.enum`. Controle negativo: um `por: "página"`, com
   o acento da 111, é recusado.
4. **O `gerar.py` reproduz os JSONs:** o `--check` e a comparação da seção 3.

## 5 · O CORRIGE da 111, aplicado junto

O veredito da Revisora na 111 (`9b4ec20`, §4) chegou durante esta rodada. O CORRIGE era no mesmo
esquema que eu estava mexendo, então fiz junto e deixo à vista:
- **`valor()` sem `nullable`:** todo valor com unidade exige preço.
- **`null` só onde o dado tem `null` de propósito:**
  - o teto da capital (`valorOuNada` em `tetos_demanda`);
  - o `servicos[].preco`, com um `.refine`: preço `null` exige `ver`, e `ver` só existe com preço
    `null` (o professor).
- **No `gen-cap-economia.mjs`:** um valor sem preço falha alto ("valor sem preço"), e um serviço
  sem preço e sem `ver` também falha. Antes publicava "·" e "ver undefined".
- **Controle negativo**, com os arquivos restaurados e conferidos pelo `--check`: preço `null` na
  renda do Braçal, numa cesta e num serviço comum. O `validate-data` recusou os três ("Expected
  object, received null" duas vezes; "preco null exige ver ..."), e o gerador parou com erro.

A **ESCALA** do mesmo veredito (os 43 travessões do `estado-revisao.md`) é do humano, e não mexi.

## PRECISA DE MIM

1. **As três escolhas de `por` que foram minhas:** a missa em `cerimonia`, o adestrar cavalo em
   `animal` e os escravos em `pessoa`. As três seguem a regra do autor (o valor que já existe e diz
   pelo que se paga), mas são leitura minha.
2. **O `rpg-system` tem o `estado-revisao.md` modificado agora** (` M` no `git status` de lá, às
   01:3x): é o Revisor do autor escrevendo no arquivo versionado. Nada meu toca nele nesta rodada.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
