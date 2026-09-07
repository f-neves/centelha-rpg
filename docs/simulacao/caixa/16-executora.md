# Rodada 16 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  3ba81c67e8ea1706fdbc8a8b5aaea8addf933c80
SHA   fbe69ce6f4519ba187a3ede14ba56b3f3dd2eed5
TOPO  fbe69ce6f4519ba187a3ede14ba56b3f3dd2eed5
```

`TOPO` igual a `SHA`: nada mais empurrou para `main` entre a `BASE` e este
trabalho (`git status` local: `ahead 1`, sem divergência).

**Nota sobre onde o commit mora agora:** por causa da instabilidade descrita
abaixo, o commit foi empurrado num ramo descartável (`interpor/e2e-golpe-
adiado`) para o CI julgar antes de eu declarar a suíte verde, seguindo a
mesma técnica já registrada em `Pendencias.md:2603-2615` (a falsificação 3 do
L40). O ramo compartilha a história com `main` (é um fast-forward simples,
sem merge), então o commit é o mesmo `SHA` de cima em qualquer um dos dois; a
Revisora pode dar checkout nele direto, e o ramo será apagado depois de o
resultado ser lido.

## O QUE MUDOU

| arquivo | o que mudou nele |
|---|---|
| `scripts/mesa-mock.mjs` | cena nova `?cena=interpor`: três peças (`atk`, `alvo`, `interp`) com o golpe de `atk` já agendado (`aResolver`) e `interp` já em Preparo, Absorções 3 e 9 propositalmente diferentes |
| `scripts/test-interpor-mesa.mjs` | novo: dirige a porta do Preparo ao vivo pela tela (botão direito → Abortar → "Se interpor" → escolhe o golpe → confirma), resolve o golpe adiado por `window.__ESPELHO.abrir`, e confere a Vida em par (alvo original intacto, interpositor desceu pela Absorção DELE) e o consumo da cobertura |
| `package.json` | `test-interpor-mesa` entrou no `smoke`; script de conveniência `interpor-mesa` |
| `.github/workflows/validate.yml` | `test-interpor-mesa` entrou na matriz do CI |

## O QUE ESTE RELATÓRIO AFIRMA

| número | o que é | de onde sai |
|---|---|---|
| Absorção 9 mostrada na prévia (não 3) | prova de que a Absorção aplicada é a do interpositor | `scripts/test-interpor-mesa.mjs`, lido de `#al-dn-conta` no commit avisado |
| líquido descido = bruto rolado − 9, exato | prova de que o dano que desce da Vida bate com a Absorção certa | mesmo teste, comparando `window.__ESPELHO.pvDe` antes/depois com o total lido em `#al-dn-pool` |
| Vida do alvo original inalterada (999 → 999) | prova de que nada vaza para quem não devia levar o golpe | mesmo teste |
| 10 portões de navegador no `smoke` e na matriz do CI, concordando nas duas direções | `test-portoes.mjs`, rodado no commit avisado |

## O QUE EU DECIDI

| # | a decisão | o que ela custa |
|---|---|---|
| D16a | cobrir só a porta do Preparo, não as duas que a Revisora pediu em `15-revisora.md` ("cobrindo pelo menos um caminho de cada porta") | o TechLead simplificou para "uma, à sua escolha" ao repassar a tarefa. A divergência entre o pedido original da Revisora e a instrução que me chegou não foi resolvida por mim: registro aqui para quem revisar decidir se basta ou se abre um lote 3 para a porta da Recuperação |
| D16b | teste em arquivo dedicado (`test-interpor-mesa.mjs`), e não um cenário novo dentro de `test-grid.mjs`, que foi a sugestão literal da Revisora | segue o precedente mais recente (`test-bandeiras-mesa.mjs`, a última vez que um teste precisou de `window.__ESPELHO`/asserção de Vida, também saiu num arquivo próprio); mantém `test-grid.mjs` (já grande) sem crescer, e o teste já está corretamente ligado ao `smoke` e à matriz do CI. Custo: quem procurar "onde estão os testes do Grid" tem mais um arquivo para conhecer |
| D16c | mock com dano em dado de verdade (`3d6+21`) em vez de valor fixo sem dado | achei um bug real em `roladaManual` (`src/lib/rolagem.ts:95`) que dobra o bônus fixo de expressões com "0d6" literal quando roladas via `rolagem=site` e relidas como digitação manual, afetando dados reais (`mon-bat`, `mon-toad`, `pool: "0d6+2"`). Não é desta rodada consertar; contornei usando dado de verdade e lendo o total real da descrição da rolagem (`#al-dn-pool`) em vez do "passa N" da prévia (que tem OUTRO bug relacionado, `parseInt` só lendo a primeira face de uma lista separada por vírgula) |

## O QUE FICOU EM ABERTO

- **A porta da Recuperação continua sem teste e2e.** `custoInterporRecuperacao`
  e a UI (`abrirForaDeHora`) estão prontos e testados por partes (função pura
  + sintaxe + smoke sem crash), mas não há um cenário ponta-a-ponta como o
  que este lote fez para o Preparo. A cena `?cena=interpor` já tem tudo
  pronto para isso (`interp` só precisaria nascer em Recuperação em vez de
  Preparo, e o teste trocaria `abortar`/`ab-*` por `forahora`/`fh-*`):
  estimativa de reuso alto, menor que este lote. Decisão de continuar ou não
  é de quem revisar/decidir a sequência.
- **O bug de `roladaManual` com "0d6" literal (D16c) não foi corrigido**,
  só contornado no teste novo. Achado real, com exemplos reais
  (`mon-bat`, `mon-toad`), registrado aqui e não em `CATALOGO.md` porque
  não decidi sozinha se vale consertar agora ou esperar alguém precisar.
- **A flakiness do `npm run smoke` completo nesta máquina, investigada e
  não é desta rodada.** Rodei a suíte completa três vezes: a primeira
  crashou em `test-grid-simultaneo.mjs` (`cenaFichaDoLance`), a segunda
  crashou no mesmo arquivo mas noutra cena (`cenaTetoForcado`), a terceira
  crashou em `test-golpe-caido.mjs` (`__ESPELHO` indefinido). Testei cada
  arquivo isoladamente, várias vezes, e todos passam limpos sozinhos,
  inclusive `test-grid-simultaneo.mjs` com TODAS as minhas mudanças
  retiradas (`git stash`), o que descarta esta rodada como causa. É
  instabilidade de carga/tempo ao encadear ~10 navegadores Puppeteer em
  sequência nesta máquina específica, não um defeito de lógica: por isso o
  commit foi para o ramo descartável em vez de eu insistir localmente.

## ONDE LER

- `Pendencias.md`, L34 §6 · a régua fechada
- `docs/simulacao/caixa/15-revisora.md` · o pedido original desta prova
- `scripts/test-interpor-mesa.mjs` · o teste inteiro
- `scripts/mesa-mock.mjs` · a cena `?cena=interpor`
- `src/lib/rolagem.ts:95` · o bug de `roladaManual` com "0d6" literal (achado, não consertado)
