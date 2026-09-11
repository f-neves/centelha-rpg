# Rodada 43 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  b8b78ae2a389583abbcaa4f5eaa4a1aaae274994
SHA   b8ab3ea00ddaf1247c327de079ecac3984eaccd5
TOPO  b8ab3ea00ddaf1247c327de079ecac3984eaccd5
```

**Entrou um commit do Arquiteto entre o `SHA` e o `TOPO`**: `git log cb20d8e..5c99550`
mostra `5c99550`, "As duas decisões do humano de 11/09/2026: o portão da
procedência vê os dez...", só em `Pendencias.md` (60 inserções, 11 remoções,
conferido por `git diff --stat`). Não toca código nenhum: é a decisão do L79
e do L80 (abertos e decididos, ambos citados abaixo, nenhum desta rodada).

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
| `.github/workflows/validate.yml` | `test-l77-alcancecentro-mesa` entra na matriz do CI |
| `Pendencias.md` | Arquiteto fecha o L77/L76 com as decisões do humano, reaponta 37 citações que meu código deslocou, e registra o L79 e o L80 (abertos, decididos, não desta rodada) |
| `docs/simulacao/CATALOGO.md` | nova forma na tabela ("o rótulo de escopo do `git diff`") |
| `docs/simulacao/ESTADO.md` | Arquiteto reaponta 8 citações deslocadas |
| `docs/simulacao/VOZ.md` | Arquiteto reaponta 11 citações deslocadas |
| `package.json` | `test-l77-alcancecentro-mesa.mjs` entra no `smoke` e ganha script próprio |
| `scripts/mesa-mock.mjs` | cena `?cena=corpoacorpo` ganha `en` atacando `md` (L77, o lado do atacante) |
| `scripts/test-combate-tempo.mjs` | testes puros do L77 (`alcancaNoCorpoACorpo`) e do L76 (`alcanceInterpor`), com a invariante Médio-contra-Médio explícita |
| `scripts/test-l77-alcancecentro-mesa.mjs` | novo: prova o L77 na mesa real, com o Aboleth atacando |
| `src/lib/alcance.ts` | `alcancaNoCorpoACorpo` ganha o raio do atacante (L77); `alcanceInterpor` ganha os dois lados equivalentes (L76) |
| `src/pages/mesa/grid.astro` | nova `alcanceCentroExtraHex`, e os seis pontos que somavam só o raio do alvo agora somam os dois lados |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 4 m | alcance corpo a corpo, Aboleth (Enorme) atacando um Médio: `alcanceDoCentro(Enorme) 3,5 + raio(Médio) 0,5` | Pendencias.md, tabela do L77; reproduzido em hexágonos (escala 1 m) por `scripts/test-l77-alcancecentro-mesa.mjs` (a asserção do "4 hex"/"alcança 4") |
| 2,5 m | alcance corpo a corpo, um Médio atacando o Aboleth: `alcanceDoCentro(Médio) 0,5 + raio(Enorme) 2` | Pendencias.md, tabela do L77; a mesa arredonda para 3 hex por causa do `Math.ceil` que já existia no L67, não é um número novo desta rodada |
| 1 m | a invariante: Médio contra Médio não muda | `scripts/test-combate-tempo.mjs`, as duas asserções que chamam `alcancaNoCorpoACorpo(1/2, false, 0, 0)` |
| 6 | pontos em `grid.astro` que somavam só `raioExtraHex(alvo)` cru, achados por constante (`HEX_CORPO_A_CORPO`/`HEX_HASTE`), não por nome de função | `src/pages/mesa/grid.astro`: `alcanceDaPeca`, `declararGolpe` (2×), `folhaDaAcao` (2×), `valoresDoLance`, mais `candidatosParaInterpor` para o L76 |
| 2 | controles positivos quebrados e revertidos de propósito, um por nível | `src/lib/alcance.ts:98-99` (nível puro) e `src/pages/mesa/grid.astro` (o `alc` de `valoresDoLance`, nível mesa); os dois com o registro em `docs/simulacao/caixa/progresso-43-l76-l77.md` (13:25) |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D43a | O termo do atacante (`alcanceCentroExtraHex`) e o termo do alvo (`raioExtraHex`) ficam FUNÇÕES SEPARADAS em `grid.astro`, em vez de uma função só recebendo os dois lados | duas chamadas em cada um dos 6 pontos em vez de uma; ganhei clareza (cada termo cita seu próprio comentário/procedência) e mantive o formato que `alcancaNoCorpoACorpo` já tinha antes do L77 (raio do alvo como parâmetro posicional) |
| D43b | Provar o L77 na mesa com um `dados` escrito à mão no Aboleth (`classe: 'leve'`), em vez de depender do ataque natural real dele no bestiário | o teste não garante que o ataque NATURAL do Aboleth também passa pela mesma régua (não testei a costura entre bestiário e `RESUMO`); ganhei um teste que não quebra se o bestiário mudar o ataque natural dele, e testa exatamente o que o L77 mudou, não a leitura do bestiário |
| D43c | Escrever `test-l77-alcancecentro-mesa.mjs` como arquivo NOVO, em vez de crescer `test-l67-corpoacorpo-mesa.mjs` | dois arquivos em vez de um mais longo; segui o padrão já estabelecido (um arquivo por item do Pendencias), e a cena mock (`?cena=corpoacorpo`) continua compartilhada, só ganhou peças novas |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **`L79` (Pendencias.md) · DECIDIDO PELO HUMANO, NÃO DESTA RODADA.** A regra do
  travessão não tem portão, e a dívida velha nos três documentos da frente
  (`Pendencias.md`/`ESTADO.md`/`VOZ.md`) é de 146 ocorrências. Decisão: varrer as
  146 num commit próprio, fora de rodada, e só então ligar o portão sobre o
  arquivo inteiro (não sobre as linhas novas). Os 139 travessões em comentário de
  código dos 8 arquivos desta rodada (114 no `grid.astro`) ficam FORA desta
  decisão, por escopo dito. Nada a fazer aqui: só sinalizando para não ser achado
  de novo por engano.
- **`L80` (Pendencias.md) · DECIDIDO PELO HUMANO, NÃO DESTA RODADA.** O portão da
  procedência confere hoje só `ESTADO.md` e `Pendencias.md`. Rodada a mesma lógica
  contra os outros dez documentos com citação de código: 71 conferidas, 43
  envelhecidas, 57 sem âncora. Decisão: ampliar o `ALVOS` do portão para os dez,
  na ordem obrigatória (as 57 âncoras primeiro, os 21 ponteiros vivos reapontados
  à mão pelo método do L72 depois, as 22 marcas `(citação histórica)` do
  `REVISORA.md` depois, o `ALVOS` ampliado por último). Nada a fazer aqui.
- **O achado do próprio Arquiteto, para a Revisora não achar sozinha e
  desconfiar do resto:** ao reescrever o reapontador nesta rodada, ele trocou a
  conferência própria do script pela regra "rode o portão depois" (regra dele
  mesmo), mas o portão não lê `VOZ.md`. As 11 citações que reapontou lá ficaram
  reescritas por script e conferidas por ninguém por um tempo. Ele conferiu
  depois à mão, com uma cópia da lógica do portão, e as 11 passaram. O achado é
  erro dele, e ele pediu para constar aqui e não só no `Pendencias.md`: a
  Revisora confere afirmação contra fonte, e esconder dela um erro do Arquiteto
  seria pedir para ela achar sozinha e desconfiar do resto.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `Pendencias.md` · L77 (a fórmula do humano e a tabela de conferência), L76
  (a resolução pela mesma fórmula), L79 e L80 (abertos, decididos, não desta
  rodada)
- `docs/simulacao/caixa/progresso-43-l76-l77.md` · o sinal de vida inteiro,
  com a álgebra conferida contra a arma antes de escrever, os dois controles
  positivos, e o achado sobre a autoria do hunk de `mesa-mock.mjs`
- `src/lib/alcance.ts:95-150` · `alcancaNoCorpoACorpo` e `alcanceInterpor`, os
  dois com o parâmetro novo
- `scripts/test-l77-alcancecentro-mesa.mjs` · a prova na mesa real
