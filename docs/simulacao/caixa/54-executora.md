# Rodada 54 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  fcf778ef51c1fe5a122f5f97d95fe75d57e1d2eb
SHA   8c6369859483e2a643dddd980da22d51dcdb3a2e
TOPO  8c6369859483e2a643dddd980da22d51dcdb3a2e
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

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada; aqui é só o inventário.

| arquivo | o que mudou nele |
|---|---|
| `src/lib/forca-empurrao.ts` | novo: `pesoMaximoErguido(fah, F)` e `alcanceArremesso(faa, peso, maxKg, F)`, extraídos de `ficha-engine.ts` |
| `src/lib/ficha-engine.ts` | `renderForca()` chama as duas funções de `forca-empurrao.ts`, sem cópia local da fórmula |
| `src/lib/artes-grid-mesa.ts` | `deslocar()` troca `escolhas['Força']`/`escolhas['Alcance']` por FAH/FAA de verdade (`plano.nivelArte`); nova `resultadoDoEmpurrao(faa, peso, maxKg, F)`, exportada; `pesoDoPorte` exportado; linha morta `?.pesoKg` trocada por `pesoDoPorte(alvo)` |
| `src/data/efeitos.json` | parâmetro `FAA` do `empurrao-elemental` vira `"(nível da Arte) × 4"` |
| `scripts/test-l85-forca-empurrao.mjs` | novo: 27 asserções, Node puro |
| `package.json` | `validate` ganha `node scripts/test-l85-forca-empurrao.mjs` |
| `Pendencias.md` | L85 fechado; L94 (passar pelo espaço de outra criatura) e L95 (peso de verdade do bestiário) abertos pelo Arquiteto |
| `docs/simulacao/CATALOGO.md` | formas novas registradas pelo Arquiteto |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 27 | asserções verdes em `test-l85-forca-empurrao.mjs` | saída do próprio arquivo, `npm run validate` |
| `nivelArte × 7 − 2` | FAH, entra na tabela de levantamento (teto de erguer) | `artes-grid-mesa.ts:1261` |
| `nivelArte × 4` | FAA, entra na tabela de arremesso (teto de arremesso, ¼ do erguido) | `artes-grid-mesa.ts:1262` |
| 3 a 40 | domínio de FAH que a tabela `levantamento` cobre sem buraco | `regras.json` (`forca.levantamento`), conferido por `node -e` no levantamento da rodada |
| 2 a 24 | domínio de FAA (nível 1 a 6, × 4) | mesmo princípio do FAH, `ficha-engine.ts` (`Math.max(2, Math.min(24, ...))`) |
| 25,7 m | Miúdo (3 kg) arremessado por uma Arte nível 3, contra os ~200 m da fórmula antiga | `test-l85-forca-empurrao.mjs`, saída do próprio teste |
| 360 kg | teto de erguer de uma Arte nível 3 (o mesmo número do despacho) | `test-l85-forca-empurrao.mjs`, asserção "teto de erguer" |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | Extraí a conta de arremesso para `forca-empurrao.ts` com a assinatura `(fah/maxKg, faa, peso)`, e não `(faa, peso)` como eu tinha medido na primeira passada | um segundo conselho (advisor), antes de escrever qualquer linha, pegou que `dist(w)` fecha sobre `tetoKg`/`apice`/`qIni`, que vêm de `maxKg`; a assinatura errada teria nascido junto com os dois chamadores, e o conserto seria depois |
| D02 | Primeira versão do FAA somava Acerto Arcano por analogia com a ficha, sem conferir contra `regras.json` se a analogia valia; o Arquiteto achou que não valia (o Empurrão nunca foi um efeito mirado) e eu corrigi em quatro lugares antes de qualquer commit (`efeitos.json`, `artes-grid-mesa.ts`, o comentário de `deslocar()`, o cabeçalho de `forca-empurrao.ts`) | nenhum commit chegou a carregar a versão errada; o custo foi todo em mensagens trocadas, não em código revertido |
| D03 | `resultadoDoEmpurrao(faa, peso, maxKg, F)` exportada como decisão pura (`{metros, pesaDemais}`), em vez de deixar os dois tetos inline em `deslocar()` | mais uma função exportada no módulo, pelo mesmo motivo de `condicoesDoEmpurrao` (L70/L84): testar sem abrir as duas caixas de `deslocar` |
| D04 | Exportei `pesoDoPorte` (antes privada) para o teste usar criaturas reais do bestiário em vez de números soltos | superfície pública um pouco maior; troca por um teste que compara contra IDs reais (`mon-raven`, `mon-aboleth`, ...), não só contra a tabela de porte copiada à mão |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **Peso de verdade do bestiário (L95, aberto pelo Arquiteto).** `deslocar()`
  continua usando `pesoDoPorte(alvo) || 70` (estimativa por porte), porque a
  leitura antiga (`?.pesoKg`) nunca funcionava: o campo real é
  `dimensoes.peso`, uma string solta ("70 kg", "2,7 t"). 266 de 309 criaturas
  batem um padrão limpo de parsing; 43 têm texto livre com pergunta de
  regra embutida ("sem peso, forma incorpórea" não é número faltando). Fora
  disso, PC empurrado não tem peso nenhum hoje (nem `MON` nem `pesoDoPorte`
  alcançam um PC; `racas.json` não declara peso). Precisa do humano: decidir
  o parsing dos 43 casos de texto livre, e de onde vem o peso de um PC.
- **`npm run smoke` não rodou nesta máquina.** `astro dev` trava com
  `UnknownCompilerError` ao compilar `grid.astro` (o defeito de máquina já
  catalogado, "Astro trava no Windows"). Confirmado por controle (`git
  stash` só dos meus arquivos) que o mesmo erro acontece com o código de
  ANTES da rodada: não é regressão minha. `npm run validate` (não usa o
  compilador Astro) está verde. A Revisora precisa conferir a bateria de
  navegador pelo CI, não por esta máquina.
- **L94 (passar pelo espaço de outra criatura) e a disputa de Empurrão do
  L83** seguem abertos, registrados pelo Arquiteto; nenhum dos dois é desta
  rodada.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-54-l85.md` · sinal de vida completo da
  rodada, com o levantamento antes do código, a correção do Acerto Arcano
  (com a troca de mensagens) e o controle negativo do `smoke`
- `Pendencias.md` · L85 (o item desta rodada), L94 e L95 (abertos pelo
  Arquiteto a partir de achados desta rodada)
