# Rodada 113 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto, que nomeia:

- `8d0b281` (despacho);
- `effc917` (trabalho);
- `cd27068` (relato);
- `ffed1d5` (o CORRIGE de citação dele no `Acoes_Sistema.md` §7.10), que entra nesta revisão.

Pino: `ffed1d5`. Passo 0 pelo §0.1 (`merge-base --is-ancestor HEAD origin/main` passou), e depois
`switch -C revisora ffed1d5`. Toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE, com um CORRIGE pequeno.**

- **O que o Arquiteto pediu confere:** a malha capítulo × `Acoes_Sistema.md` nos quatro pontos, e os
  números do exemplo contra o `renda.json`.
- **A conta da regra nova refaz o dado inteiro**, e não só os três exemplos (§1).
- **O CORRIGE** é o teto `null` que eu tinha deixado anotado na 112 e que esta rodada tornou visível
  (§4).

## CI (§11)

Workflow `Validar dados e regras`, todos `completed / success`:

| commit | run |
|---|---|
| `8d0b281` | `36218863724` |
| `effc917` | `36219148133` |
| `cd27068` | `36219230076` |
| `ffed1d5` | `36219332968` |

## 1 · A fórmula B2 contra o `renda.json`

**A regra do capítulo refaz a `curva_por_soma` inteira**, e não só as somas 6, 9 e 12. Para cada uma
das 9 somas (de 4 a 12), calculei o melhor `(média − Dif) × valor da faixa` nas três faixas, com os
valores do `valor_por_ponto` (20, 37,14 e 66,86), e arredondei pelo `arred()` do modelo. **As 9 dão o
valor gravado e a faixa gravada.**

**Um detalhe que o relato não viu:** na soma 9 (o perito), a faixa 7 e a faixa 11 **empatam** em
334,3: (16 − 7) × 37,14 e (16 − 11) × 66,86. O dado escolhe a faixa 7, e o capítulo mostra "Perito ·
9 · 16 · 7 · 330 pc". O valor é o mesmo pelas duas. O relato compara o perito só com a faixa 4 (240).
Não muda nada no livro; pode interessar a quem for explicar o exemplo.

**Os três valores por ponto foram lidos direto do dado, sem conta:** o `valor_por_ponto` guarda `dif4`,
`dif7` e `dif11`. O capítulo os mostra arredondados: 20, 37 e 67 pc.

**Prova no `dist/regras/acoes-oficio-e-mundo/index.html`** do pino (build verde), lido célula por
célula:

- "Oficial | 6 | 10,5 | 4 | 130 pc", "Perito | 9 | 16 | 7 | 330 pc" e "Mestre | 12 | 21 | 11 | 670
  pc";
- "Aldeia | 100 pc", "Vila | 300 pc", "Cidade | 1.000 pc" e "Capital | sem teto";
- "Serviço simples | 4 | 20 pc", "Ofício | 7 | 37 pc" e "Arte rara | 11 | 67 pc";
- "O teto limita o ganho" uma vez, e **zero** "× 10";
- o link de "Semanas de aventura" aponta para `custo-de-servico-e-itens#semanas-de-aventura`, e o
  `<h3 id="semanas-de-aventura">` existe na página de destino.

## 2 · A malha capítulo × `Acoes_Sistema.md`

Comparei por script: achei a linha de cada ponto nos dois arquivos, tirei os links e confrontei o
texto.

| ponto | capítulo | `Acoes_Sistema.md` | resultado |
|---|---|---|---|
| **reparo** | `:195` | `:1300` | **igual** |
| **carroça** | `:164` | `:1265` | **igual** |
| **barco de pesca** | `:176` | `:1277` | **igual** |
| **nota da carroça** | `:181` | `:1282` | **igual** |
| **fórmula da renda** | `:211` e `:229` | `:1325` e `:1333` | **igual** |
| **jornada do ofício** | `:137` | `:1238` | **igual** |
| **as tabelas do bloco gerado** | 13 linhas | as 13 presentes | **igual** |
| **régua de preço e Requisito máximo 6** | `:78` e `:82` | `:1115` e `:1119` | o mesmo conteúdo, com diferença de forma |
| **teto** | `:252` | `:1353` | o mesmo conteúdo, com diferença de forma |
| **bônus e Firula** | `:250` | `:1350-1351` | o mesmo conteúdo, com diferença de forma |
| **Apressar** | `:131` | `:1229` | o mesmo conteúdo, com diferença de forma |

**As diferenças de forma, lidas uma a uma:** negrito a mais no "**6**" e no "**1**"; o link para
Qualidade de Itens, que o documento solto não tem; e a quebra de linha do documento, que tem 100
colunas. **Nenhuma muda o que se diz.**

**"Preço dobra" e "A Montagem se paga igual"** não existem mais em nenhum dos dois.

**O salto entre degraus:** `Acoes_Sistema.md:216` diz "de oito a sessenta vezes", e o
`relacoes-sociais.md:215` continua com "8 a 24".

## 3 · O `ffed1d5`

É uma troca de nome de arquivo na §7.10 (`precos.json` → `mercadorias.json`), com a ressalva intacta:
"não cobre armas, armaduras nem obra". Está certo: o `mercadorias.json` não tem arma nem armadura, que
moram em `armas.json` e `armaduras.json`. **Não precisa de revisão própria.**

## 4 · CORRIGE · o teto `null` agora vai para a tela

**Na 112 eu deixei anotado** (`112-revisora.md` §3, o delta) que o `valorOuNada` aceita `null` em
**qualquer** teto de demanda, e não só no da capital. A origem é o meu CORRIGE da 111, que disse "nos
tetos". Até a 112 nenhum teto aparecia no capítulo. **Esta rodada passou a publicar os tetos**
(`gen-cap-economia.mjs`, com `v.preco ? ... : 'sem teto'`).

**Medido:** `preco: null` no teto da aldeia deixa o `validate-data` **verde**, e o gerador escreve
"| Aldeia | sem teto |" no capítulo. Restaurado por `git checkout --`.

Um buraco no dado sai como regra ("a aldeia não tem teto"), que é o zero ambíguo com o sinal trocado.
É CORRIGE e não ESCALA porque o bloco que publica é desta rodada, e o despacho diz que "capital sem
teto" é o `null` da capital. **O conserto, de uma linha:** no esquema, o `null` só vale para a chave
`capital` (ou o gerador falha em `null` fora dela).

## 5 · Travessão

Zero nas linhas acrescentadas de `effc917`, `cd27068` e `ffed1d5`.

## Limpeza

O enxerto do teto foi restaurado no mesmo comando, junto com os dois capítulos que o gerador tinha
reescrito. O `dist/` é o do build do pino, anterior ao enxerto. Não mexi em arquivo versionado além dos
meus dois da caixa. Fora da árvore, só `../tmp/revisora/r113-build.log`.
