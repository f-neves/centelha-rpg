# Rodada 43 · resposta da revisora (L77: o raio do próprio atacante; L76: alcanceInterpor com os dois lados; os três riscos do Arquiteto medidos)

Revisora: aviso em `3920074`. BASE correta `09b5c05` (o aviso traz `b8b78ae2`, órfão; ver nota
abaixo), SHA/TOPO `b8ab3ea`.

## Recorte, e o órfão de HEAD

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `392007417f1f45d6cb3c014f8f6d2e2e20cb0324`. Batem.

Antes de reancorar, conferi por conta própria que o meu `HEAD` anterior (`b8b78ae2`, o veredito
da rodada 42) estava órfão, como o Arquiteto avisou: `git merge-base --is-ancestor b8b78ae2
origin/main` deu falso; `09b5c05` (o gêmeo que ele diz ter chegado ao `main` por cherry-pick) deu
verdadeiro. Comparei os dois diffs (`git show <sha>^..<sha>`) linha a linha: 151 linhas cada,
idênticas exceto a linha do próprio hash do commit. `3920074` é o próprio commit do aviso desta
rodada, descendente de `09b5c05` e ancestral de `origin/main`. Fiz o checkout recomendado; nada
meu ficou pendente.

O `BASE` do aviso (`b8b78ae2`) está errado pelo mesmo motivo: é o órfão, não o commit que
realmente chegou ao `main`. A correção do Arquiteto (o certo é `09b5c05`) procede: o próprio
aviso não pode ser editado (regra 6 da caixa), então uso a correção por fora, como ele registrou.

## Os três riscos, medidos por conta própria

**Risco 1, a invariante Médio contra Médio.** Confirmei a álgebra do L77 eu mesma antes de ler o
código (`alcanceDoCentro = raio + braço`, `braço = max(0, raio-0,5)`): para Médio dá zero
(fecha a invariante), para Enorme (diâmetro 4) dá 3,5, batendo com os 4 m/2,5 m da tabela do
humano. `alcance.ts:75-153`: os parâmetros novos (`raioAtacanteHex` em `alcancaNoCorpoACorpo`,
`raioAgressorHex` em `alcanceInterpor`) usam `Math.max(0, ...)` independente do lado do alvo,
nunca encurtam. `test-combate-tempo.mjs:563-566,650-653`: a invariante Médio-Médio está escrita
POR EXTENSO (`0, 0`), não por omissão de parâmetro, exatamente o que o Arquiteto pediu para não
aceitar como prova por ausência de caso.

**Controle positivo nos dois níveis, falsificado por mim, não aceito do relato da Executora.**
Nível mesa: removi `alcanceCentroExtraHex(atacante)` do `alc` em `valoresDoLance`
(`grid.astro:10247-10248`) e rodei `test-l77-alcancecentro-mesa.mjs`. Caiu SÓ a asserção do "4
hex" (voltou a "1 hex"); as outras seis, incluindo o `avisoAlcance` (outro caminho de código),
continuaram verdes. Revertido imediatamente, `git status`/`git diff --stat` limpos antes de
qualquer outra coisa (CONTRATO §2). Não falsifiquei o nível puro de novo (já está escrito por
extenso no teste, e a leitura do código confirma o mecanismo é o mesmo `Math.max` do L67).

**Risco 2, as 11 citações de `VOZ.md` reapontadas por script e conferidas por ninguém em tempo
real** (a regressão que o próprio Arquiteto registrou contra si mesmo). Não aceitei a cópia dele
da lógica do portão: verifiquei as 11, uma a uma, contra a janela de ±3 linhas real em
`grid.astro`. Todas batem: `async function desfazer` (11237), `async function ajustarMana`
(10930), o comentário "O CAMPO GUARDA AS FACES..." (10005), `const CAMPOS_ATQ` (10189, citada
duas vezes), `const CAMPOS_ALVO` (10202), `document.querySelector('dialog[open]')` (11877),
`a.tagName === 'INPUT'` (11876), o comentário "A PEÇA SELECIONADA É" (8790), `function
folhaDaAcao` (9602), `const campoAlvo = MESTRE` (10315).

**Risco 3, os números do L80 (43 envelhecidas, 57 sem âncora, em dez documentos).** Escrevi um
script próprio, fora do repositório, com a MESMA heurística do portão (âncora mais próxima em
caracteres, `split('(')[0]`, janela ±3), e rodei contra os dez documentos da tabela. Bateu EXATO,
total e por documento: `REVISORA.md` 22/22/18, `CONJURACAO.md` 12/8/10, `Grid_Mobile.md` 7/6/4,
`VOZ.md` 19/2/1, `Migracao_Dominio.md` 3/1/17, `CONTEXTO.md` 4/1/1, `CATALOGO.md` 2/1/4,
`Auditoria_Tecnica.md` 1/1/1, `Dominio.md` 1/1/0, `Regua_Relacao.md` 0/0/1, total 71/43/57.

## O resto do código

Rodei eu mesma, sem modificação: `test-combate-tempo.mjs` (a régua pura), `test-l67-corpoacorpo-
mesa.mjs` (regressão do L67), `test-interpor-mesa.mjs` (regressão do L76). Os três `EXIT=0`.

## Portões

`npm run validate`: `EXIT=0`. Testes de mesa relevantes rodados por mim, todos `EXIT=0`.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore da rodada (usando o
`BASE` corrigido, `09b5c05 b8ab3ea`), e zero nos meus dois arquivos novos, conferido antes de
commitar.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada no código desta rodada. O `BASE` do aviso está errado (`b8b78ae2` em vez de `09b5c05`), mas
a correção já está registrada pelo Arquiteto fora do aviso congelado, pela regra certa.

## O QUE FICOU EM ABERTO

`L79` e `L80` são decisão do humano, registrados e não desta rodada; nada a fazer da minha parte.

## VEREDITO

O L77 e o L76 estão corretamente construídos e provados: a invariante Médio contra Médio está
escrita por extenso, não por ausência de caso, e o controle positivo de nível mesa caiu
exatamente na asserção certa quando eu mesma o falsifiquei. Os três pontos de desconfiança que o
Arquiteto marcou contra o próprio trabalho (a invariante, a regressão das 11 citações de
`VOZ.md`, os números do L80) foram todos medidos por conta própria, não aceitos de palavra, e
todos procedem exatamente como ele descreveu. O erro de `BASE` no aviso (o commit órfão em vez do
gêmeo real) também procede, e a correção mora fora do aviso, pela mesma razão de atribuição da
regra 6 da caixa. Nada bloqueia, nada corrige no código.
