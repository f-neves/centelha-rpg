# Rodada 19 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  8dd27d4e61f8459c00b51d0c3e33600d9e974925
SHA   4058b4cfc0368e12b6e9f8b2b51fc61ddcdd1f7d
TOPO  268b56060eb3dd0b6fc5be8c93adca19ec4d447b
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

**Nota sobre `docs/simulacao/CONTRATO-REVISORA.md` não estar na tabela abaixo:**
o modelo pré-encheu esse arquivo na lista porque ele muda entre `BASE` e `SHA`,
mas não é trabalho meu: `git diff --stat 268b560..4058b4c` (só os MEUS dois
commits, em cima do último que o TechLead empurrou) não o inclui. O que separa
os dois: entre a `BASE` (8dd27d4, o pin real do worktree da Revisora, conferido
em `centelha-techlead-revisora`) e o commit `268b560` que abriu esta frente para
mim, entraram 5 commits que não são desta rodada: o fecho da rodada 18
(veredito SEGUE do Interpor, já revisado e aprovado) e o reancoramento do
CONTRATO-REVISORA, todos ANTES de eu começar a trabalhar, em sequência normal
na `main`, sem nenhuma frente concorrente entrando durante a MINHA janela de
edição. `git merge-base --is-ancestor 268b560 4058b4c` confirma que `268b560`
é ancestral do meu `SHA`, e `git log 4058b4c..268b560` é vazio: nada ficou de
fora do commit avisado.

| arquivo | o que mudou nele |
|---|---|
| `Pendencias.md` | reancora as 4 citações de código do L39 para as linhas novas (`artes-grid-mesa.ts:458`/`:1836`, `artes-grid.ts:1677`, `artes-grid-ui.ts:47`, `gen-grid-artes.mjs:410`/`:423`) e a de `artes-grid-mesa.ts:1960→1964`, que tinha envelhecido por deslocamento de linha; marca os quatro blocos CLASSIFICA/EXIBE, o RELATÓRIO e o VALIDADOR como fechados |
| `scripts/gen-grid-artes.mjs` | `CONDICAO_APARENTE` (novo conjunto com os 9 ids) move o valor de `condicao` para `condicaoAparente` em `gridDoEfeito`; o relatório do `--check` ganha a contagem "evocam condição sem aplicar"; o `--lista` mostra `condicaoAparente` entre parênteses |
| `scripts/rodada.mjs` | corrige o caminho hardcoded do worktree da Revisora (`centelha-revisora` → `centelha-techlead-revisora`), achado ao abrir esta rodada |
| `scripts/test-arte-na-mesa.mjs` | dois cenários novos: `grid.condicaoAparente` sozinho não aciona `porCondicao`, e o par com `grid.condicao` aciona normalmente |
| `scripts/validate-data.mjs` | valida `grid.condicaoAparente` contra `COND_IDS`, barra a coexistência com `grid.condicao`, e checa o invariante `(forma==='nenhuma') === (alvo==='nenhum')` nos 140 Efeitos |
| `src/data/efeitos.json` | os 9 Efeitos do L39 trocam `condicao` por `condicaoAparente` (mesmo valor); todos os outros 131 ganham `condicaoAparente: null` (regenerado pelo `gen-grid-artes.mjs`, não editado à mão) |
| `src/lib/artes-grid-mesa.ts` | os dois blocos CLASSIFICA/EXIBE (linhas 458 e 1836) passam a ler `ef.condicao \|\| ef.condicaoAparente` |
| `src/lib/artes-grid-ui.ts` | o mesmo fallback no cartão de escolha de Efeito (`marcasDe`, linha 47) |
| `src/lib/artes-grid.ts` | o mesmo fallback em `rotuloDoEfeito` (linha 1677); `GridEfeito` e `EfeitoAtivo` ganham o campo `condicaoAparente?: string \| null` |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 9 Efeitos afetados pelo split | `sugestao-plantada`, `esquecer`, `aviso`, `momento-certo`, `instante`, `rosto-esquecivel`, `esconder-a-carga`, `reescrever`, `lapso` | `src/data/efeitos.json`, cada um com `condicaoAparente` no lugar de `condicao` |
| 140 Efeitos, 37 com `forma:"nenhuma"`, 37 com `alvo:"nenhum"`, mesmos 37 nos dois conjuntos | o invariante que o teste novo prende | `node scripts/validate-data.mjs` (roda limpo); a checagem em si em `scripts/validate-data.mjs:176`-`177` |
| 33 asserções, 0 falhas | `scripts/test-arte-na-mesa.mjs`, incluindo o par novo de `condicaoAparente` | `node scripts/test-arte-na-mesa.mjs`, rodado no commit avisado |
| "deixam condição: 57 · evocam condição sem aplicar: 9" | a contagem pós-split, contra os 66 (57+9) que existiam juntos antes | `node scripts/gen-grid-artes.mjs`, saída do commit avisado |
| `npm run validate`: exit 0 | suíte inteira (dados, os Node-only, procedência, portões) | rodado no commit avisado |
| `npx tsc --noEmit -p .`: "TypeScript: No errors found" | não faz parte de `npm run validate`; rodei à parte por causa do campo novo `condicaoAparente?` nos tipos `GridEfeito`/`EfeitoAtivo` | rodado no commit avisado |

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D19a | o teste (b) do L39 vira rede de CAMPO (o valor do campo `grid.condicao` decide se `porCondicao` roda), não de DESPACHO ("ATIVOS não cresce"), depois de achar que a segunda é inverificável em Node por construção (`gravarEfeito` não tem gate de `forma`, só `conjurar`, DOM-only, tem). Escalei antes de codificar; o TechLead confirmou e corrigiu a pendência (`268b560`), crédito ao achado | a proteção PRINCIPAL dos 9 Efeitos (o despacho nunca deixar `forma==='nenhuma'` chegar em `gravarEfeito`) continua sem teste nenhum, antes e depois desta rodada: provar exigiria harness de navegador para `conjurar`, outra frente |
| D19b | estendi `gen-grid-artes.mjs` (`CONDICAO_APARENTE`) em vez de deixar como estava, porque o `--check` do `npm run validate` travava sem isso: o gerador é quem escreve `grid.condicao` para os 9, e sem saber do split ele desfazia a mão toda vez que alguém rodasse `node scripts/gen-grid-artes.mjs` sem `--check` | mais um lugar com a lista dos 9 ids hardcoded (junto de `CONDICAO`, que já listava os mesmos ids misturados com Efeitos de verdade); se um décimo Efeito "nenhuma"/"nenhum" ganhar condição no texto no futuro, alguém precisa lembrar de adicionar o id nos dois lugares |
| D19c | corrigi `scripts/rodada.mjs` (caminho do worktree da Revisora) no meio desta rodada, num commit separado, em vez de só contornar à mão o BASE errado que ele calculou | um commit a mais na história desta rodada (`4058b4c`), fora do L39; não toquei `scripts/duo.mjs`, que tem o mesmo hardcode, registrado para o TechLead decidir. Não é chamada minha mexer em ferramenta de orquestração fora do que bloqueava meu próprio envio |
| D19d | não regenerei `condicaoAparente` na tabela `condicoes.json` nem toquei nenhuma coluna do banco: o campo é só do `grid` (catálogo `efeitos.json`), nunca sai para `arena_efeitos`. `linha.condicao` em `gravarEfeito` continua lendo só `g?.condicao`, sem `|| g?.condicaoAparente` | os dois blocos CLASSIFICA/EXIBE em `artes-grid-mesa.ts` (linhas de `EfeitoAtivo`) leem um `ef.condicaoAparente` que nunca vem preenchido em produção (o campo existe só no tipo, para o fallback compilar); hoje isso é um no-op honesto, documentado no comentário do tipo (`artes-grid.ts:1402`) |

## O QUE FICOU EM ABERTO

- **A proteção PRINCIPAL dos 9 Efeitos (o despacho de `conjurar`, `forma ===
  'nenhuma'` retorna antes de qualquer `ATIVOS`) continua sem teste, antes e
  depois desta rodada.** O que este split adiciona é uma proteção SECUNDÁRIA,
  de campo (D19a). Provar a principal exigiria harness de navegador para
  `conjurar`: outra frente, não decisão minha nem da Revisora abrir.
- **`scripts/duo.mjs` tem o mesmo caminho hardcoded que eu corrigi em
  `rodada.mjs`** (`centelha-revisora` em vez de `centelha-techlead-revisora`,
  D19c). Não toquei: é ferramenta de orquestração do TechLead, fora do que
  bloqueava meu envio. Fica para o TechLead decidir se corrige.
- **Nada do L39 ficou pendente dentro do escopo que me foi passado.** Os 8
  pontos da ordem (dois testes, split, validador, quatro blocos de exibição,
  gerador) estão feitos; o `--lista` do gerador foi decisão minha (D19b),
  registrada.

## ONDE LER

- `Pendencias.md`, L39 (a seção inteira, com os 16 pontos do mapa e as notas
  que fechei nesta rodada)
- `docs/simulacao/caixa/18-revisora.md` · o veredito SEGUE que fechou o
  Interpor, imediatamente antes desta frente abrir
- `scripts/test-arte-na-mesa.mjs` · o par de cenas novo, no fim do arquivo
- `scripts/gen-grid-artes.mjs` · `CONDICAO_APARENTE`, perto de `CONDICAO`
