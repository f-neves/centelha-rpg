# Regra do Quase-Acerto + conserto do Simultâneo + bancada · relato da Executora

Despacho: `docs/simulacao/caixa/regra-quase-acerto-bancada-despacho.md` (commit `a4a6f33`).

## Progresso

- **Item 1 (pasta) · FEITO.** `docs/export/proezas/chatgpt/centelha/` → `docs/calibracao/`
  (raiz: 09/10/14/15; `discussao/`: 00-07, 02p, 12, decisoes-entendimento.md e os 10 arquivos
  sem número classificados pelo autor). `matriz-habilidades.json` na raiz de `docs/calibracao/`
  (decisão do autor: não é discussão do ChatGPT, é a matriz de Habilidades fechada nesta rodada).
  Caminho de saída do `calibrar.mjs` e a citação em `docs/pendencias/D-proezas-tecnicas.md:42`
  atualizados. `.gitignore:84-90` simplificado (a exceção pontual não faz mais sentido; o que
  virou histórico já mudou de casa, fora do ignore). Commits `ba01ce6`, `826aa64`, `f0155b5`,
  push feito (`a4a6f33..f0155b5`).
- Achado antes de mexer no item 2, reportado ao Arquiteto e já decidido: a "fonte única" do
  raspão da conferência prévia do despacho não era única (`grid.astro:10198` e
  `motor.mjs:407` reimplementavam a conta em vez de chamar `quaseAcertoDoEncontro`). Decisão do
  autor: refatorar os dois call-sites para chamar a função de verdade, fechando a divisão de
  `CATALOGO.md`.
- **Item 2 (regra do Quase-Acerto) · código pronto, NÃO COMMITADO ainda** (trava no item 2e,
  abaixo). Mudanças feitas, em memória de trabalho:
  - `src/lib/lance.ts`: `EntradaLance.alvo` ganhou o campo `centelha`;
    `quaseAcertoDoEncontro` agora desconta `alvo.centelha` do raspão (2a) e aceita um tipo mais
    estreito (`Pick`) em vez do `EntradaLance` inteiro, para os dois call-sites não precisarem
    montar um objeto fake; `resolverGolpe` ganhou o piso do item 2c
    (`liquido = Math.max(entrada.danoQA, bruto - soak, 0)` no ramo `acerto`).
  - `src/data/regras.json:1145`: `quaseAcerto.porClasseArmadura.leve.reducao` 0 → 1 (2b).
  - `src/pages/mesa/grid.astro`: `raspaoBase`/`margemBase` (linha ~10198) e o `alvo` de
    `entradaDoLance` (linha ~10351) agora chamam `quaseAcertoDoEncontro` de verdade, lendo a
    Centelha do alvo de `PERFIL[alvo.id]?.centelha`.
  - `scripts/sim/motor.mjs`: a entrada do golpe (linha ~394) também chama
    `L.quaseAcertoDoEncontro` (exportada agora em `lib-ponte.mjs`) em vez de reimplementar a
    conta; `alvo.centelha` lido da peça.
  - `scripts/sim/elenco.mjs` e `scripts/sim/calibrar.mjs`: as peças da bancada não carregavam
    Centelha nenhuma até agora (achado à parte, não estava no despacho: a simulação nunca
    modelou Centelha do alvo no raspão porque a fórmula antiga não usava). Acrescentei
    `centelha: ficha.centelha || 0` em `montarArquetipo` e `centelha: opts.centelha` em
    `perfilDe`.
  - `npx tsc --noEmit`: limpo.

## Item 2e · a trava do gancho, com a contagem pedida

`test-lance.mjs` roda dentro do `pre-commit` (via `npm run validate`) e compara
`resolverGolpe` contra `scripts/fixtures/lances.jsonl` campo a campo, incluindo `danoLiquido`
e `pvDepois`. Rodei `node scripts/test-lance.mjs` isolado (sem commitar, sem tocar a fixture)
para medir o efeito:

```
✗ resolverGolpe OK · 1315 lances no despejo · 1315 conferidos com a fonte fixa e 1315 com a rolada
  · 390 divergiram · 45 asserções
  · ZERO divergências com a fonte fixa (390, em danoLiquido 390, pvDepois 390)
```

**390 de 1315 lances (29,7%) mudam de `danoLiquido`/`pvDepois`, e os 390 são 100% efeito do
item 2c** (o piso "o acerto nunca dói menos que o raspão daquele golpe"). Conferido à parte: os
itens 2a/2b (Centelha do alvo, Redução da leve) NÃO aparecem nesta contagem porque o replay da
fixture usa o `entrada.danoQA` GRAVADO (valor da mesa antiga, um número congelado no arquivo) e
nunca reconstrói esse número a partir de `quaseAcertoDoEncontro` — só os dois call-sites vivos
(`grid.astro`, `motor.mjs`) fazem essa conta agora, e nenhum dos dois participa do replay da
fixture. Ou seja: a fixture, do jeito que está, só pode testemunhar 2c; 2a e 2b ficam sem
oráculo automatizado até uma fixture nova ser colhida com a regra vigente.

Dois efeitos colaterais no PRÓPRIO `test-lance.mjs`, fora do replay (não é fixture, é o arquivo
de teste): as duas asserções unitárias de `quaseAcertoDoEncontro` no fim do arquivo (linhas
463-469) chamam a função com um `entrada`/objeto literal sem `alvo.centelha`, e viram `NaN` com
o campo novo obrigatório. **Não toquei no arquivo** (o despacho proíbe nesta rodada); registro
aqui para quem decidir a fixture decidir isto junto, porque as duas ficam vermelhas do jeito
que estão até `test-lance.mjs` ganhar `centelha` nesses dois literais.

**Proposta de versionamento (três opções, para decisão do autor antes de eu commitar):**

1. **Recoletar de verdade** (`node scripts/coletar-lances.mjs` contra a mesa já com a regra
   nova) depois que o item 2 estiver na mesa publicada. Fixture nova testemunha as três
   mudanças (2a/2b/2c) de uma vez, com Centelha e armadura variando de verdade. Custo: perde a
   fixture atual como evidência do comportamento ANTERIOR (a menos que eu arquive a atual à
   parte, ver opção 3), e fica um período (até a próxima coleta) em que `test-lance.mjs` não
   tem oráculo nenhum rodando no CI a não ser que se aplique a opção 2 como ponte.
2. **Re-derivar só os campos de dano, sem recolocar a mesa.** Um script descartável recalcula
   `danoLiquido`/`pvDepois`/`absorcao` de cada lance com o `resolverGolpe` novo, a partir do
   `entrada`/`sorteio` já gravados (que continuam sendo evidência real da mesa: Defesa, dados
   rolados, veredito, tudo isso não muda). Só os campos DERIVADOS da regra do dano são
   atualizados. `test-lance.mjs` volta a ficar verde sem precisar de uma coleta nova, mas o
   oráculo desses três campos passa a valer "a fórmula que eu implementei", que é exatamente a
   ressalva que o cabeçalho do arquivo pede para nunca acontecer por reflexo — por isso a
   proposta é registrar no `lances.meta.json` (`regra: "quase-acerto-27-09-2026"` ou
   equivalente) que esses campos foram re-derivados, não recolhidos, e por quê.
3. **Congelar a fixture atual como referência histórica** (`lances.pre-quase-acerto.jsonl`,
   fora do `validate`) e deixar as asserções de dano de `test-lance.mjs` com uma tolerância
   datada e documentada (o padrão que `test-portoes.mjs` já usa: "6 tolerância(s) com condição
   escrita") até a opção 1 ou 2 se resolver. É a que menos mexe agora, mas deixa o portão
   sabendo MENOS sobre o dano por mais tempo.

Recomendo a opção 2 como ponte imediata (mantém o resto da fixture como evidência de verdade,
sem esperar uma sessão de mesa) seguida da opção 1 quando a mesa rodar de novo com a regra nova
— mas não apliquei nenhuma das três: aguardando decisão antes de commitar `lance.ts`,
`regras.json`, `grid.astro`, `motor.mjs`, `elenco.mjs`, `calibrar.mjs` e `lib-ponte.mjs` (as
sete mudanças do item 2 ficam juntas, porque a regra só faz sentido como conjunto).

