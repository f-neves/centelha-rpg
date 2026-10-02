# Correção da Reforma da Centelha (a regra do maior) · relato da Executora

Despacho: `docs/simulacao/caixa/correcao-reforma-despacho.md` (`0eecc2c7`). A regra: bônus de
Centelha = maior(Centelha, 2 × mín(Centelha, Habilidade)), na jogada, no Valor Passivo, nas três
Defesas e na Defesa parada. Um bloco por item, com o sha e o CI.

## Item 1 · O motor e o bestiário

**A conta.** `src/lib/calc.ts`: `centelhaNaJogada` = `Math.max(centelhaSoAtributo(c), 2 × mín(c, h))`.
A `centelhaSoAtributo` (+1 por ponto, a jogada só de Atributo da D12) passou a ser chamada por ela,
como o autor pediu, e foi para cima dela no arquivo. Os comentários de `:131-154` foram reescritos
(saiu o "Sem Habilidade, sem bônus"), e os quatro comentários de uma linha das Defesas e do ataque
(`defesa`, `defesaMental`, `defesaSocial`, `ataqueCentelha`) dizem a regra do maior.
`valorPassivo` (`calc.ts:415-417`) já chamava `centelhaNaJogada` e herda a regra sem mudança de
código. `bestia-editor.ts` (o editor do bestiário no navegador) também só chama `calc.ts`.

**Toda reimplementação da mesma conta** (`rtk proxy grep -rn "2 \* Math.min" src scripts`, mais uma
varredura por `min(` com Centelha):

| onde | o que é | o que fiz |
|---|---|---|
| `scripts/lib-bestiario.mjs:62` | a conta do gerador do bestiário | regra do maior, com o comentário |
| `scripts/lib-bestiario.mjs`, `inverteComCentelha` | a inversão Defesa para Esquiva/Integridade/Sociabilidade publicadas | ganhou a terceira faixa (Habilidade abaixo de metade da Centelha, bônus = Centelha). A conta sobe sempre com a Habilidade, então a inversão tem uma resposta só. Prova: as `pericias` publicadas das 309 criaturas não mudaram nenhuma (comparação antes e depois), e o `test-bestiario-integridade` (round-trip) passa |
| `scripts/test-kael.mjs:18` | a cópia do teste | regra do maior; o teste ganhou a Defesa Social, e o esperado é 20/13/7 |
| `scripts/sim/desafio-bancada.mjs:153` e `:208` | a bancada recompõe a Defesa crua para achar a penalidade de armadura (`penFisica`), subtraindo a Defesa que o motor devolve | regra do maior, nas duas. Sem isso, a `penFisica` sairia errada (até negativa) na próxima rodada da bancada, porque o motor já dá a Defesa nova. A bancada **não foi rodada** |
| `scripts/sim/desafio-bancada.mjs:270` | `2 × mín(Centelha, habEf)` com `habEf = máx(Habilidade, Centelha)` | **sem mudança**: com `habEf ≥ Centelha` a conta já dá 2 × Centelha, que é o mesmo que a regra do maior dá nesse caso |
| `src/lib/artes-grid.ts`, `desEsqDaDefesa` | inverte a Defesa da criatura para Destreza + Esquiva (o desvio de área) | só o comentário diz a fórmula nova. **A aproximação ficou** (ela subtrai 2 × Centelha, supondo Esquiva ≥ Centelha), registrada abaixo como achado |
| `scripts/sim-duelo.mjs:45-48`, `scripts/sim-pressao.mjs:37-38`, `scripts/lib-tempo.mjs:89/320`, `scripts/sim-ticks.mjs:39` | simuladores antigos, com o `centelhaMult` flat (×1 ou ×2) | **sem mudança**: são as baterias de antes da Reforma (`K35`), com a regra antiga de propósito |
| `scripts/cost-examples.mjs:205-211` | lê `defesaMental.centelhaMult` e `defesaSocial.centelhaMult` flat | **sem mudança neste item**: é o mesmo caso que a `centelhaNota` de `regras.json` já registra como desatualizado (K35). Vou conferir no item 2 se ele gera algum número dos exemplos de criação |

**`regras.json`.** As notas de `derivados.defesa.centelhaNota`, `defesaMental.nota` e `.centelhaNota`,
`defesaSocial.nota` e `.centelhaNota`, `ataque.nota` e `.centelhaNota`, e a nota das Técnicas
(`:114`, "somam por cima do ...") dizem a regra do maior. A `:2683` (Defesa parada) é do item 3, e a
`:1133` (raspão) é do item 2.

**O bestiário, regenerado pelo gerador** (`gen-bestiario.mjs`, e depois `gen-monsters.mjs`, que faz
o `monsters.json` e o `monsters-mesa.json` a partir do `inimigos.json`). Nada à mão no JSON gerado;
`gen-bestiario.mjs --check` verde.

- **189 criaturas mudaram** em alguma Defesa (o mesmo número da medição prévia do Arquiteto):
  **Defesa (Esquiva) 121, Defesa Mental 3, Defesa Social 177.** O bestiário não tem Bloqueio
  separado (a Defesa da criatura é a de Esquiva).
- **Ataques: 3 criaturas**, as três com Habilidade de ataque 0: Espantalho Desperto (`1d6+2` para
  `1d6+2 +1`, Centelha 1), Pixie (`2d6` para `2d6 +4`, Centelha 4) e Arconte Lanterna (`1d6` para
  `1d6 +2`, Centelha 2).
- **Nenhuma Defesa caiu** (a regra do maior nunca dá menos que a de antes).
- Nenhum outro campo do bestiário mudou (comparado campo a campo).
- **Os maiores saltos** (o 5º lugar empata em +9, então vão os sete com salto de 9 ou mais):

| criatura | Defesa | antes | depois | salto |
|---|---|---|---|---|
| Tarrasque | Esquiva | 4 | 14 | +10 |
| Tarrasque | Social | 8 | 18 | +10 |
| Balor | Social | 16 | 25 | +9 |
| Diabo do Fosso (Pit Fiend) | Social | 18 | 27 | +9 |
| Grande Wyrm Vermelho | Esquiva | 4 | 13 | +9 |
| Grande Wyrm Vermelho | Social | 14 | 23 | +9 |
| Solar | Social | 16 | 25 | +9 |

- O filhote de dragão vermelho (a âncora da Fase 5b) vai de Defesa 4 para **8**, como o despacho diz.

**Testes que fixavam Defesa e mudaram.**
- `scripts/test-kael.mjs`: Kael 20/10/4 vira **20/13/7**. A Defesa Social entrou no teste (antes ele
  só fixava a Mental).
- `scripts/test-contrato.mjs` (o contrato ficha e mesa, o mesmo Kael pelo código da mesa): Defesa
  Mental 10 para **13** (duas asserções: o resumo de combate e a ficha), Bloqueio 7 para **10** e
  Defesa Social 4 para **7**. Os três têm Habilidade 0 (Integridade, Bloqueio, Sociabilidade), e
  agora levam a Centelha inteira (+3). A Defesa de Esquiva (19 com o gambeson) e o pool de ataque
  (`3d6+2 +6`) não mudam, porque Esquiva 3 e Armas 3 alcançam a Centelha.
- `scripts/test-editor-bestiario.mjs` (smoke, card contra modal): ficou vermelho enquanto o
  `monsters.json` estava velho (card 4 e modal 7 no Treant) e verde depois do `gen-monsters.mjs`.

**Achados, registrados sem consertar.**
1. **O `monsters.json` velho não acende nenhum portão.** O `validate` confere o `inimigos.json`
   (`gen-bestiario --check`), mas o `gen-monsters.mjs` não tem `--check` na cadeia: ele só roda
   no `build`. Um commit com o `inimigos.json` novo e o `monsters.json` velho passaria no gancho;
   só o smoke do editor pegaria, no CI. Desta vez os dois vão juntos.
2. **`desEsqDaDefesa` (`artes-grid.ts`) é uma aproximação, e o comentário dela erra o sentido.**
   Ela subtrai 2 × Centelha da Defesa, supondo Esquiva ≥ Centelha. O comentário diz que, quando a
   suposição falha, o valor "sai um pouco ALTO"; na conta, ele sai **baixo**: o bônus real é menor
   que 2 × Centelha. Isso já valia antes. E a conta é invertível, pelo mesmo raciocínio da
   `inverteComCentelha`. Medido contra Destreza + Esquiva publicadas, a estimativa erra em **163 de
   309** criaturas antes e em **148** depois. O erro também vem da penalidade de armadura e da
   Especialidade, que a função não desconta. Consertar mexe no desvio de área do Grid, então fica
   para o Arquiteto decidir.

**Verificação** (sobre `0eecc2c7`): `npm run validate` verde ("Portões OK"); `npx astro sync && npx tsc
--noEmit` sem erro; `npm run espelho` verde ("os dois laços concordam"); `test-editor-bestiario` verde
("editor OK"); `npm run build` verde. No gerado, `dist/bestiario/index.html` traz
`data-defesa="7"` no Treant (era 4), `data-defesa="8"` no filhote de dragão vermelho (era 4) e
`data-defesa="14"` no Tarrasque (era 4).

**Produção:** as Defesas de quem tem Habilidade menor que metade da Centelha sobem na ficha e no
bestiário (Kael 20/10/4 para 20/13/7). Sem migração.
