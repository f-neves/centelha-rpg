# Rodada 116 · Executora · uma regra só para o Livre

- **Despacho:** `docs/simulacao/caixa/116-despacho.md` (`47ac4ac`).
- **Árvore:** branch `executora`, em `47ac4ac`. A rodada 115 estava aberta na mesma árvore, e o
  despacho manda aplicar esta antes. Para não misturar as duas no mesmo commit, guardei os arquivos
  da 115 em `../tmp/executora/bak115/` e `untr115/`, voltei os rastreados ao `HEAD` e apliquei só
  a 116. A 115 volta por cima depois deste commit.
- **Publicado:** neste commit, com o relato.

## O que mudou

`lore/economia/v2/modelo.py:200`: `livre = arred(renda * f)` passou a `livre = inteiro(renda * f)`,
igual à linha da tabela de perfis (`:331`). Os JSONs foram regerados pelo fluxo normal (`gerar.py`
e `copiar-economia.mjs`), e `renda.json` e `custo-de-vida.json` mudaram só por ele. Hoje o
`modelo.py` tem **uma chamada de arredondamento sobre o Livre em cada tabela, e as duas são
`inteiro`** (`:200` e `:331`). Não sobrou `arred` sobre o Livre.

## Os 9 valores, lidos no `dist/regras/custo-de-servico-e-itens/index.html`

| faixa | Livre/Sem antes → depois | Livre/Ano antes → depois | esperado |
|---|:---:|:---:|:---:|
| Braçal | 7 → 7 | 308 → 308 | 7 / 308 |
| Destreinado | 10 → 10 | 440 → 440 | 10 / 440 |
| Treinado | 19 → 19 | 760 → 760 | 19 / 760 |
| Especialista | 30 → 30 | 1.080 → 1.080 | 30 / 1.080 |
| **Doutor** | 40 → **39** | 1.440 → **1.404** | 39 / 1.404 |
| **Abastado** | 55 → **56** | 1.760 → **1.792** | 56 / 1.792 |
| Rico | 85 → 85 | 2.720 → 2.720 | 85 / 2.720 |
| **Aristocrata** | 110 → **114** | 3.080 → **3.192** | 114 / 3.192 |
| Nobreza | 200 → 200 | 4.800 → 4.800 | 200 / 4.800 |

## O que muda junto, e por quê

No modelo, **Custo = Renda − Livre** (`modelo.py:201`). Mudar o Livre muda o Custo nas mesmas três
faixas, e com ele o "estilo de vida" do pacote familiar (custo − pacote básico). O Arquiteto
confirmou que o Custo continua derivado. Lido no `dist/`:

| faixa | Custo/Sem (Renda) | Custo/Sem ("O custo da casa") | Estilo de vida |
|---|:---:|:---:|:---:|
| Doutor | 780 → 781 | 780 → 781 | 243 → 244 |
| Abastado | 1.345 → 1.344 | 1.345 → 1.344 | 326 → 325 |
| Aristocrata | 4.090 → 4.086 | 4.090 → 4.086 | 1.041 → 1.037 |

Renda/Sem, Recursos, Faixa e o pacote básico não mudaram. As outras seis faixas não mudaram em
nada.

## O item 1.4

**Nenhuma ocorrência.** Procurei 40, 55, 110, 1.440, 1.760, 3.080, 4.090 e 1.345 no texto corrido
dos capítulos (fora dos blocos gerados) e no `Acoes_Sistema.md`: nada. O
`lore/economia/estado-revisao.md` também não tem os Livre/Ano antigos (não mexi nele).

## A 115

O `recompensas.json` da 115 ainda não foi commitado. Quando a 115 voltar, ele e a tabela de
capacidade dela saem do Livre/Ano novo, porque a árvore de trabalho da 115 já foi regerada com esta
mudança.

## Verificação

`npm run build` verde (com a 115 fora da árvore), e o gancho no commit. Travessão: zero nas linhas
novas.
