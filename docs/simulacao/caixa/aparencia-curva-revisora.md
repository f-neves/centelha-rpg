# Revisão: curva de Aparência linear −6 a +6

Reancoragem: `d44b9ea` (autorizado pelo Arquiteto, worktree movido por mim). Confirmado por
`git rev-parse HEAD` e `git rev-parse --show-toplevel`.

Base: `a61ee9c` (meu veredito anterior). Trabalho: `d44b9ea` (um commit).

## `regras.json → aparencia.curva` e `escalaAparencia`

Os 13 valores de `curva` (nível 0 a 12) formam uma progressão linear exata de −6 a +6, um ponto
por nível, sem platô. Os 13 `rotulo`/`texto` de `escalaAparencia` batem número a número com
`curva` (conferido lendo o JSON inteiro): "Sem graça (−1)" no nível 5 e "Atraente (+2)" no nível 8
são os dois rótulos novos que o platô escondia, exatamente como o aviso descreveu. `min`, `max`,
`piso`, `custoMult` intocados.

## `aparencia-virtudes-vontade.md`

Tabela reescrita com os 13 níveis distintos, mesmos rótulos e modificadores de `regras.json`. A
nota de bônus situacional do antigo platô (nível 7) saiu, coerente com não existir mais platô
nenhum. Nenhum resíduo de "platô", "5 a 7" ou "entre 5" sobrou no capítulo (varri o arquivo
inteiro).

## `calc.ts:157`

Comentário de `aparenciaMod` atualizado para "−6..+6, sem platô". Confirmado que `aparenciaMod` só
é chamado onde já era chamado antes (não entra em `pv`, `defesa`, `defesaMental`, `defesaSocial`,
`energia` nem `mana`), então nenhum Derivado muda, como o aviso disse.

## `criacao-de-personagem.md`

Recalculei os quatro personagens (Kael, Sora, Veil e Bram): todos mantêm o **nível** comprado e o
XP pago (a fórmula é `novo×2` acumulado, que não mudou), só o modificador/rótulo entre parênteses
muda pela curva nova. Nível 4 (Kael/Veil/Bram): rótulo "Feio" continua, modificador −1→−2. Nível 5
(Sora): rótulo muda de "Comum" para "Sem graça", modificador 0→−1. A legenda da seção e o passo 7
do roteiro de criação também foram ajustados ("a régua de −6 a +6", "normal no nível 6").

## Achado: uma nota interna ficou desatualizada

**`regras.json → xp.aparencia.nota`** (linha 613) continua dizendo *"Mesma trilha da Vontade. Piso
0, régua 0–12, modificador −5 a +5"* — a régua velha, não tocada por este commit. É um campo
`nota`, nunca lido por código (`xpSpec()` em `calc.ts` só usa `base`/`mult`/`piso`/`tipo`; varri
`src/` inteiro por `xp.aparencia`, zero consumidor de `.nota`), então não é bug visível ao
jogador. Mas é a mesma classe de problema que este próprio commit já caçou e consertou em
`calc.ts:157` (comentário desatualizado sobre a mesma curva, achado e corrigido nesta rodada) —
só que este outro, no mesmo arquivo e sobre o mesmo assunto, ficou de fora da varredura. Varri
`src/` inteiro por "−5 a +5"/"-5 a +5": essa é a única ocorrência restante.

**CORRIGE, pequeno:** trocar "−5 a +5" por "−6 a +6" em `regras.json:613`. Uma palavra, sem efeito
de jogo, mas é texto sobre o exato assunto desta rodada que ficou errado dentro do próprio arquivo
que a rodada editou.

## Verificação

`npm run validate` rodado aqui: verde.

## Veredito

**CORRIGE.** A curva nova está correta e consistente em todos os lugares que o aviso descreveu
(regras.json, o capítulo, o comentário de `calc.ts`, os quatro personagens). O único problema é a
nota interna de `xp.aparencia` em `regras.json:613`, que ainda cita a régua antiga (−5 a +5) — não
lida por código, não visível ao jogador, mas errada sobre o mesmo traço que a rodada mudou.

## Conferência do CORRIGE · reancorada em `609e3e4`

`git diff 459b266..609e3e4` mostra só a linha esperada: `xp.aparencia.nota` trocou "−5 a +5" por
"−6 a +6". Nada mais no commit. `npm run validate` rodado aqui: verde.

**VEREDITO FINAL: PROCEDE.** A curva de Aparência (regras.json, o capítulo, `calc.ts`, os quatro
personagens) e o conserto da nota interna estão corretos.
