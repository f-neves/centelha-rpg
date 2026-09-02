# Diagnóstico 2 · carga de trabalho, interrupção e canonicidade

Sobre o commit `5cfc8eb`. Alvo: o sistema **Simultâneo**. Métrica de interesse: quantas vezes o
combate para e pede um humano, com foco no mestre.

Comandos rodados nesta sessão, todos citados de novo onde os números aparecem:

```
node scripts/test-combate-tempo.mjs · test-simultaneo · test-quase-acerto · test-contrato · test-golpe · test-deslocamento · test-artes-grid · test-kael
node scripts/test-grid-simultaneo.mjs
node scripts/sim-ticks.mjs --so B --n 2000     e    --so B --n 8000
node --input-type=module -e "<importa scripts/lib-tempo.mjs e cronometra bateria/refrega>"   (texto integral na §D1)
```

---

## A. Verificação dos três achados

### A1. A Margem de dano nunca entra no dano da mesa

Caminho completo, do acerto até a Vida gravada. Tudo em `src/pages/mesa/grid.astro` salvo onde
dito.

| # | Linha | O que acontece | O que carrega |
|---|---|---|---|
| 1 | 7959-7963 | `rolarAcerto()`: `rolarExpr(ra?.ataque, ajAtq.dados + pn, ajAtq.flat)` por golpe | pool, penalidade de manobra, ferimento e condições do atacante |
| 2 | 7962 | `totalInp.value = String(linhas[0].total)` | o total do **primeiro** golpe, num `<input>` |
| 3 | 7646-7647 | `pintarVeredito()`: `t = parseInt(totalInp.value)`, `m = parseInt(modInp.value)` | o total relido do campo, mais o ajuste avulso |
| 4 | 7658 | `const soma = t + m` | |
| 5 | 7662-7663 | `errouPor(soma, def)` e `saidaDoAtaque(soma, def, margemQA())` | `quase-acerto.ts:208-219`. **`saidaDoAtaque` devolve `'acerto' \| 'raspao' \| 'erro'` e mais nada**: a diferença `soma − def` é descartada aqui |
| 6 | 7664-7668 | o veredito vira texto na tela | `soma` e `def` não saem deste escopo |
| 7 | 7967-7971 | `rolarDano()`: `rolarExpr(ra?.dano \|\| '0d6')`, **sem argumento de dados extra** | só a expressão da arma; não recebe `soma`, `def` nem margem |
| 8 | 7997 | `fim()`: `dano: raspou ? danoQA() : parseInt(dnInp.value)` | o número do campo de dano |
| 9 | 6885 / 7108 | `aplicarDano(atacante, alvo, res.dano, res.tipo, …)` | |
| 10 | 8082-8083 | `s = soakDe(alvo, tipo)`; `liquido = Math.max(0, bruto − s)` | Absorção, não margem |
| 11 | 8045-8052 | `baixarVida`: `pv = Math.max(0, antes − quanto)` → `gravarPeca(c.id, { pv_atual: pv })` | grava |

Confirmação por varredura: a única divisão por 6 em `grid.astro` é `Math.floor(tick / 6)`, que é o
número da rodada (L4312, L4536). Não há `(total − defesa) / 6` em lugar nenhum de `src/`. O
comparativo: `scripts/lib-tempo.mjs:322` faz `margem = Math.floor((total − efDef) / 6)` e a usa em
L332, `for (let i = 0; i < A.arma.dado + margem; i++)`.

**Estava certo no relatório anterior.** Acrescento uma precisão que faltava: a Margem também não
existe no motor das Artes. `danoNoAlvo` (`src/lib/artes-grid.ts:1302-1337`) recebe `bruto` e não
tem parâmetro de margem; o `bruto` vem de `rolar(ef.dano_dados)` (`artes-grid-mesa.ts:1379`), e
`dano_dados` sai do parâmetro Dano comprado (`artes-grid.ts:207-217`), nunca de uma diferença
contra a Defesa.

**Um teste pegaria?** Não.
- `test-quase-acerto.mjs` cobre `saidaDoAtaque`, classes de QA e o exemplo do capítulo XII: nada
  sobre dano de acerto normal.
- `test-combate-tempo.mjs` e `test-simultaneo.mjs` cobrem tempo, escada e agenda: não rolam dano.
- `test-contrato.mjs:174` trava a **expressão** do dano (`dano 1d6 +3`), não o dano aplicado.
- `test-grid.mjs` tem `cenaQuaseAcerto` (L2195), que confere os três vereditos e que o raspão
  aplica dano fixo sem Absorção. Nenhuma cena confere o **valor** do dano de um acerto normal.
Nenhum teste falharia se a Margem fosse acrescentada nem se fosse removida da bancada.

### A2. Na resolução só entra a Esquiva. E o escudo só tira

O número que a folha compara com o total é `def`, e ele nasce assim:

| # | Linha | O que acontece |
|---|---|---|
| 1 | 7432 | `const r = clonar(RESUMO[alvo.id])` |
| 2 | 7469-7470 | `defDe() = r.defesa + fer + cd.defesaCaC + dvDe().total` |
| 3 | 7474 | `def = defDe()` |
| 4 | 7658-7663 | `soma > def` decide o veredito |

De onde vem `r.defesa`, por tipo de peça:

- **PC:** `RESUMO` ← `resumoDe` (`mesa-bestiario.ts:127-160`) ← `baseResumo` (L94-99) ←
  `resumoCombatePC` (`combate-resumo.ts:42`). Ali, L86-87:
  `defesa({ destreza, habilidade: skills.esquiva, centelha }) − penFisica`. É a **Esquiva**, e só
  ela: `skills.bloqueio` não é lido em `combate-resumo.ts` (varredura: a palavra não aparece no
  arquivo).
- **Criatura:** `baseResumo` L106, `defesa: cb.defesa`, o campo único `combate.defesa` de
  `monsters-mesa.json`. **Correção ao relatório anterior:** eu escrevi "a resolução usa só a
  Esquiva"; para a criatura isso é impreciso, porque o bestiário não guarda Esquiva nem Bloqueio,
  guarda **uma Defesa só**, sem dizer qual das duas rotas ela representa. O certo é: para PC entra
  a Esquiva; para criatura entra um número que a régua não classifica.

O Bloqueio existe calculado e não é lido por ninguém que resolva:
- `mesa-ficha.ts:84`: `defBloqueio = defesa({ destreza, habilidade: skills.bloqueio, centelha }) − armPen`, **sem** a Defesa da arma e **sem** o escudo, ao contrário de `defesas.md:67`.
- Único leitor em toda a mesa: `grid.astro:2908`, dentro de `perfilDe`, que monta o card de exibição (`defesas: { esquiva, bloqueio, social, mental }`). Nenhum caminho de ataque o consulta.

E o escudo, hoje, **só penaliza**: em `combate-resumo.ts:53`, `escPen = refPen(cj.habil) + refPen(inabil)` soma apenas a `penalidade`; o `bloqCaC` nunca é lido (varredura de `bloqCaC` em `src/lib/combate-resumo.ts`, `src/lib/mesa-bestiario.ts`, `src/pages/mesa/grid.astro` e `combate.astro`: zero ocorrências). Esse `escPen` entra em `penFisica` (L61), que é subtraído da Defesa em L87. Resultado por peça: broquel e targe (penalidade 0) são neutros; hoplon −1, heater −2, kite −2, scutum −3, pavês −4 **baixam a Defesa de quem os carrega e não devolvem nada**.

**Um teste pegaria?** Não, e há um teste que **congela o estado atual**: `test-contrato.mjs:136`
trava `R.defesa = 16` (a Esquiva de Kael com broquel) e L149 trava `F.defBloqueio = 10`. Os dois
números seguem verdes com o Bloqueio inútil; se alguém ligasse o Bloqueio na resolução, nenhuma
asserção mudaria, porque nenhuma delas olha para o que a folha compara.

### A3. `combate-tempo.ts` não tem dependência de interface

Imports do arquivo, na íntegra (varredura de `^import` no arquivo, 2 resultados):

```
21: import regras from '../data/regras.json';
22: import { ARMA } from './equip';
```

`./equip` importa três JSON e nada mais (`equip.ts:9-11`: `armas.json`, `armaduras.json`,
`escudos.json`).

Globais de navegador: varredura de `document.`, `window.`, `localStorage`, `fetch(`,
`performance.`, `setTimeout`, `requestAnimationFrame`, `new Date`, `Math.random`, `navigator.` no
arquivo: **zero ocorrências**. O que ele usa do runtime é `Math` (`max`, `min`, `round`, `ceil`,
`floor`), `Array`, `Number`, `String` e `Object`.

**Estava certo.** E há prova executável: `scripts/test-simultaneo.mjs:21-33` e
`test-combate-tempo.mjs` empacotam o arquivo com `esbuild` (`platform: 'node'`) e o importam num
processo Node sem DOM. Rodei os dois nesta sessão: passam. Qualquer referência a `document`
quebraria ali na hora, então **este é um teste que pega a regressão** (é o único dos três achados
que tem rede).

---

## B. As 14 paradas sem resposta humana

`i` = decisão de jogador · `ii` = julgamento narrativo do mestre · `iii` = aritmética que o motor
já poderia fazer, com a função pura que faria a conta.

| # | Parada | Se o humano nunca responder | Se a página fechar no meio | Tipo |
|---|---|---|---|---|
| 1 | Declarar ataque (`decl-dlg`, L6916-7023) | A caixa fica aberta; `await` de L7013 nunca assenta; nada é gravado. O ⏭ continua clicável (a caixa é modal na tela, não trava o relógio no banco) | **Consistente.** Nada foi escrito antes do OK (`gravarRelogio` só em L7176/L5222) | **i** (manobra, modo de andar, m/Tick) |
| 2 | A folha da ação (`alvo-dlg`, L7420-8021) | Caixa aberta. No ataque na hora: nada gravado. **No golpe adiado: o golpe continua no ar** (L7077), e como `instanteDeGolpe()` é verdadeiro o **⏭ fica desligado** (L4324-4326): a cena não anda mais | **Inconsistente.** O `aResolver` e o `tick = livre` já foram gravados na declaração; fica um golpe devido no banco para sempre. E `gravarFixos` roda no `close` (L8016): fechar a caixa grava `combatentes.dados`; fechar a **página** não grava, então a mesma sessão pode terminar com o número corrigido na tela e não no banco | **iii** para o veredito e o dano (`saidaDoAtaque`, `quase-acerto.ts:215`; `rolarExpr`, `rolagem.ts:34`; `defesaPerdida`, `combate-tempo.ts:620`; `soakDe`→`empilharArmaduras`, `calc.ts:111`). **ii** só para o ajuste avulso com motivo (L7610-7611) |
| 3 | Escolher o alvo (mira, L6709-6807) | Nada acontece; `MIRA` fica aceso até `cancelarMira` (L6720) | **Consistente** (`MIRA` é memória) | **i** |
| 4 | Soltar peça em casa vazia (`mov-dlg`, L5114-5175) | Caixa aberta; `await` de L5152 não assenta; a peça não sai do lugar | **Consistente.** Nada gravado antes de L5171 | **i** |
| 5 | Abortar o gesto (`abrirAbortar`, `mesa-tempo-ui.ts:272`) | O painel fica aberto; é callback, não `await`, então nada mais espera por ele. O gesto segue como estava | **Consistente** | **i** |
| 6 | "Outra coisa" (L7276-7374) | Caixa aberta; nada gravado | **Consistente** | **ii** |
| 7 | Efeito pegando alguém (`verificarEfeitos`, `artes-grid-mesa.ts:1482-1496`) | Caixa aberta. Fechada sem escolher: `repintarSoEfeitos(); return` (L1495) **sem marcar `mordidos`**, então a mesma pergunta reaparece no avanço seguinte, e no seguinte | **Consistente, e reincidente**: o efeito continua no banco sem a marca da rodada | **iii** (quem está pego: `dentroDoEfeito`, `artes-grid.ts:1211`; já mordeu: `jaMordido`, L1409; o dano: `danoNoAlvo`, L1302 + `rolar`, L1340) |
| 8 | Sair da área (`oferecerSaida`, L1268-1332) | Caixa aberta. **Fechar tem default declarado**: `if (!escolha \|\| escolha === 'inteiro') return 1` (L1298), dano inteiro | **Inconsistente numa janela real**: escolhendo "sair", `pagarTicks` grava o Tick (L1317) **antes** de `morder` gravar a Vida (L1339). Cair entre os dois deixa o alvo pagando o desvio sem sofrer o dano | **i** para a escolha (sair / ficar parado / comer); **iii** para a conta (`desvioDaArea`, `artes-grid.ts:1558`; `rolarPool`, `artes-grid-mesa.ts:1243`) |
| 9 | Conjurar (`conjurar`, L703-744) | Caixa aberta; `if (!plano) return` (L711) acontece **antes** do `try`, então nem Mana nem Tick são cobrados | **Inconsistente numa janela real**: `gravarEfeito` escreve o efeito dentro do `try`, e Mana e tempo só saem no `finally` (L737-743). Cair entre os dois deixa o efeito no tabuleiro de graça | **i** |
| 10 | Rolar iniciativa (L4743-4752) | `uiConfirmar` aberto; ninguém rola; todos ficam no Tick que tinham | **Inconsistente**: o laço L4778-4788 grava **peça por peça**, um `update` por combatente. Cair no meio deixa metade da cena com iniciativa nova e metade com a velha | **iii** (`rolarIniciativaPC`, `mesa-ficha.ts:132`; `iniDeMonstro`, `mesa-bestiario.ts:55`; `ticksDeEntrada`, `combate-tempo.ts:355`) |
| 11 | Avançar o Tick (⏭, L8968-8971) | **O relógio congela.** É o único motor do Simultâneo | **Inconsistente**: `avancarTickSimultaneo` grava `tick_atual` primeiro (L4908) e só depois anda peça por peça (L4912-5013), cada uma com o seu `gravarToken` e o seu `update`. Cair no meio deixa o relógio adiantado, parte das peças sem ter andado e parte das agendas sem re-projetar | não é decisão; **iii** por construção (o corpo inteiro do avanço já é automático) |
| 12 | Resolver um golpe da faixa (L4383-4393) | O cartão fica vencido para sempre e o ⏭ desligado junto. Mesmo travamento do #2 | **Inconsistente** pelo mesmo motivo do #2 | **iii** para a ordem (a faixa já ordena por Tick, `mesa-tempo-ui.ts:194`), **ii** para escolher fora de ordem |
| 13 | Curar / tirar Vida / Mana / editar ordem (L8102, L8134, L8166, L4800) | `uiFormulario` aberto; `if (!v) return` quando fecha; nada gravado | **Consistente** | **ii** (curar, ordem) e **i** (tirar Vida é de quem rolou) |
| 14 | Ação na aba Combate (`combate.astro:1974-2010`) | Caixa aberta; `acao-cancelar` fecha sem gravar | **Consistente** | **ii** |

**NÃO SEI** em dois pontos, e o experimento que resolve cada um:

1. Se, com a caixa aberta, a **campainha de tempo real** (`mesa-tempo-real.ts`) entrega uma
   mudança de outra sessão e a repintura de fundo corrompe o estado que a caixa está lendo (as
   cópias mutáveis de L7431-7433 são clones do `RESUMO` do instante em que ela abriu). Experimento:
   abrir a folha na bancada com `?papel=mestre`, escrever no mesmo combatente por uma segunda aba,
   e conferir se o que `gravarFixos` grava sobrescreve a mudança da outra aba.
2. Se `test-grid-simultaneo.mjs` já cobre o travamento do #2. Ele **espera** o ⏭ desligado como
   comportamento correto (`ok(!fim.ligado && /golpe caindo/i.test(fim.dica))`, cena 1), mas nunca
   fecha a folha sem resolver. Experimento: uma cena que abre o cartão, fecha no Escape, e afirma
   que o ⏭ segue desligado e o cartão segue vencido.

Contagem: **2 paradas travam a cena inteira** (#2 e #12, pelo mesmo mecanismo, mais o #11 que é o
próprio relógio), **4 deixam estado inconsistente** se a página cair (#2, #8, #9, #10, #11),
**1 tem default declarado** (#8), e **6 das 14 são (iii)**, aritmética que já existe em função
pura.

---

## C. Carga do mestre, contada estaticamente

### C1. Os 21 campos editáveis da folha

`CAMPOS_ATQ` (L7718-7730) e `CAMPOS_ALVO` (L7731-7745). Todos nascem **preenchidos**; nenhum abre
em branco. A origem do valor é `leCaminho(objDe(quem, fonte), chave)` (L7803), com dois fallbacks:
`pgrDaRegua` (L7797-7800) e `passoDaPeca` (L7805-7807).

| # | Campo | Vem de | Estado |
|---|---|---|---|
| 1 | Arma | `RESUMO.arma` (ficha ou bestiário) | calculado |
| 2 | Classe de tempo | `RESUMO.classe`, ou `classeDeTempo` pela Velocidade | calculado |
| 3 | Velocidade (Ticks) | `RESUMO.velocidade` / `armas.json.ticks` | calculado |
| 4 | Preparo | `anat().preparo` (L7798) | calculado pela régua |
| 5 | Golpe | `anat().golpes` | calculado |
| 6 | Recuperação | `anat().recuperacao` | calculado |
| 7 | Bolo de acerto | `RESUMO.ataque` (`combate-resumo.ts:72`) | calculado |
| 8 | Dano | `RESUMO.dano` (L84) | calculado |
| 9-11 | Passo · batalha / arranque / corrida (atacante) | `passoDaPeca` | calculado |
| 12 | Defesa (base) do alvo | `RESUMO.defesa` | calculado |
| 13 | Defesa Mental | `RESUMO.defesaMental` | calculado |
| 14-16 | Absorção · impacto / corte / perfuração | `RESUMO.soak` | calculado |
| 17 | Resist. perfuração | `RESUMO.resistPerf` | calculado |
| 18-20 | Passo · batalha / arranque / corrida (alvo) | `passoDaPeca` | calculado |
| 21 | Pressão sofrida | `acao.pressao`, ou 0 (L7810) | calculado |

Fora desses 21, a folha tem **quatro campos que abrem vazios** e são a digitação real do mestre:
`al-total` (o total do acerto), `al-mod` (ajuste), `al-motivo` e `al-dn` (dano) (L7614), mais o
seletor `al-dn-tipo`, que abre no modo lido da arma (L7618), e o par do Quase-Acerto
(`al-qa-margem`, `al-qa-dano`), que abre calculado (L7588-7589).

A terceira coluna, "O lance" (L7774-7791), são 8 valores **só de leitura**: distância, alcance da
arma, ciclo total, Tick do golpe, fase do alvo, guarda perdida, Defesa efetiva e quem alcança quem.

### C2. O que o Grid calcula, exibe e não aplica

Confirmação item a item, e onde o mestre teria de digitar o ajuste.

| O que | Exibe? | Aplica? | Evidência | Onde o mestre digita |
|---|---|---|---|---|
| Contrapé da iniciativa | sim, com a frase "para somar à mão" | não | L7632-7641 | `al-mod` |
| Faixa de distância (tiro e arremesso) | sim, "para somar à mão" | não | L7550-7563; `alcance.ts:61-73` | `al-mod` |
| Alcance no corpo a corpo | sim, como aviso | não impede | L7565-7567 | nada a digitar: é aviso |
| Gate de Perfuração | sim, "gate N*x*" ao lado da Absorção | não | L7504; `calc.ts:131-135` existe e não é chamada na resolução | `al-dn` (zerar à mão) |
| Corrida, Defesa −4 | sim, na caixa de deslocamento | não | L5148 escreve a frase; a condição `correndo` existe em `condicoes.json` e ninguém a põe | condição na peça, ou `alf-alvo-defesa` |
| Penalidade de manobra (rajada, dupla) | sim, no bolo | **só quando o site rola** | L7637-7640 mostra; L7961 aplica dentro de `rolarExpr` | `al-total`, se a mesa rolar na mão |
| Ferimento e condições do atacante | não separadamente | **sim** | `ajAtq`, L7620-7624, entra em `rolarAcerto` | |
| Ferimento e condições do alvo | sim, na conta da Defesa | **sim** | L7469-7470, L7496-7498 | |
| Escada P/G/R e Pressão | sim, na conta da Defesa | **sim** | `defesaPerdida`, L7465-7468 | |
| Margem de dano | **não exibe** | não | §A1 | `al-dn` |
| Porte no acerto | **não exibe** | não | `regras.json:933` lido só por `mesa/referencia.astro:38` | `al-mod` |
| Couraça de Porte | **não exibe** | não | varredura de `coura[cç]a` em `src/lib`, `src/pages/mesa` e `gen-monsters.mjs`: zero | `alf-alvo-soak-*` |
| Teto ±6 dos modificadores | **não exibe** | não | `combateTatico.modificadorCap` lido só por `mesa.astro:130` | nada: teria de conferir de cabeça |
| Investida (+1d6 dano, −2 Defesa) | **não exibe** | não | `regras.json` `combate.movimento.investida`; nenhum leitor no Grid | `al-dn` e condição |
| Bloqueio, Defesa da arma, escudo | **não exibe** na folha | não | §A2 | `alf-alvo-defesa` |
| Modo secundário de dano (−2 acerto, −1d6) | o seletor troca o tipo | não cobra nada | L7613, L7618 | `al-mod` e `al-dn` |
| Sangramento por rodada | não, no Grid | não, no Grid | `porRodada` só é lido em `combate.astro:1439` | `tirarVida` à mão |
| Projétil rápido (só Esquiva ou escudo hábil) | não | não | `habilProjetil` lido só por `ficha-engine.ts` | nada |

### C3. Cliques de "quero atacar aquele ali" até "a Vida do alvo baixou"

No Simultâneo, com o alvo já em cena. "Gesto" = arrasto ou clique.

**Caminho mais curto** (alvo dentro do alcance, arma leve com Preparo 0, mesa com
`rolagem: 'site'`):

| Passo | Gesto | Quem | Caixa |
|---|---|---|---|
| 1 | arrastar o atacante sobre o alvo (L5479-5489 → `resolverAtaque` L6818 → `declararGolpe` L6916) | dono da peça | abre `decl-dlg` |
| 2 | clicar "Declarar" (`dc-ok`, L7015) | dono da peça | fecha |
| 3 | clicar ⏭ (L8968) | **mestre** | golpe vence em T+1 |
| 4 | clicar no cartão da faixa (L4384) | mestre, ou o dono da peça (L4390) | abre `alvo-dlg` já rolada (L7985) |
| 5 | clicar "acertou" (`al-sim`, L8004) | quem abriu | fecha, aplica dano |

**5 gestos, 2 caixas.** Se o atacante é PC de um jogador: 4 do jogador, 1 do mestre. Se o mestre
joga os dois lados: 5 dele. Com arma média (Preparo 1) o golpe cai em T+2: **6 gestos**.

**Caminho mais longo** (fora do alcance, `V` Ticks de viagem, rajada de 3, mesa rolando na mão,
com uma Arte no chão):

| Passo | Gestos | Quem |
|---|---|---|
| arrasto | 1 | dono |
| `decl-dlg`: manobra, nº de golpes, modo de deslocamento, m/Tick, trajetória, OK | até 6 | dono |
| ⏭, `1 + max(P, V)` vezes | 1+max(P,V) | **mestre** |
| caixa de efeito a cada avanço em que alguém está numa zona (#7) | 1 por avanço afetado | **mestre** |
| caixa de saída da área, por alvo pego (#8) | 1 a 2 por mordida | mestre |
| cartão da faixa | 1 | mestre ou dono |
| folha: total, ajuste, motivo, dano, tipo, veredito | 6 | mestre |
| se corrigir a ficha do lance | 1 por campo, mais a caixinha "fixa" | mestre |

Com `V = 4`, sem Arte no chão e sem correções: **1 + 6 + 5 + 1 + 6 = 19 gestos**, dos quais **12
são do mestre**. A rajada de 3 multiplica os passos "cartão + folha" por 3 (os golpes caem em Ticks
seguidos, `anatomia` L284), somando mais 14: **33 gestos, 26 do mestre**.

### C4. As 55 condições

Contado com `node -e` sobre `src/data/condicoes.json` e cruzado com quem lê cada campo.

| Campo mecânico | Condições que o trazem | Lido no Grid? | Onde |
|---|---:|---|---|
| `defesa` (e as variantes `defesaCaC` / `defesaDist`) | 16 (+1 / +2) | **sim**, só a CaC | L7434, L7497 |
| `acao` | 12 | **sim** | `ajAtq`, L7622-7623 |
| `dados` | 9 | **sim** | `ajAtq`, L7623 |
| `ataque` | 4 | **sim** | `ajAtq`, L7623 |
| `soak` | 1 (`protegido`) | **sim** | `soakDe`, L8031 |
| `foraDeCombate` | 4 | **sim** | `noChao`, L5824-5826 |
| `defesaDist` | 2 | **não** | nenhum leitor no Grid |
| `velocidade` | 4 (`fora-do-tempo`, `acelerado`, `retardado`, `terreno-dificil`) | **não** | só `combate.astro:1423` |
| `porRodada` | 5 (`sangrando`, `envenenado`, `sufocando`, `em-chamas`, `morrendo`) | **não** | só `combate.astro:1439-1443` |

**49 das 55** têm ao menos um campo mecânico; **6 são só texto** (`escondido`, `surdo`,
`dominado`, `voando`, `preparado`, `marcado`).

Pôr e tirar: quem põe sozinho é só a Arte (`porCondicao`, `artes-grid-mesa.ts:1167-1175`, que
carimba `ate = tick + turnos × 6`), e quem tira sozinho é só o fim do efeito que a pôs
(`encerrarEfeito` → `tirarCondicao`, L1512-1516). **O campo `ate` é escrito e nunca lido**: não há
comparação de `ate` com o Tick em lugar nenhum de `src/` (varredura). Consequência: toda condição
posta à mão pelo mestre (que é a via de `correndo`, `investindo`, `flanqueado`, `mirando`,
`postura-agressiva`, `terreno-alto`, os quatro de cobertura e os cinco de `porRodada`) **depende
de ele lembrar de pôr e de tirar**, e as 5 de dano por rodada não são cobradas no Grid nem quando
estão postas.

---

## D. Medição

### D1. Tempo por batalha

Comando, na raiz do repositório:

```
node --input-type=module -e "
import { REGRAS_PGR, montarArma, montarArmadura, bateria, refrega } from './scripts/lib-tempo.mjs';
import fs from 'node:fs';
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const CAT = { armas: Object.fromEntries(J('src/data/armas.json').map((w) => [w.id, montarArma(w)])),
  armaduras: Object.fromEntries(J('src/data/armaduras.json').map((a) => [a.id, montarArmadura(a)])) };
const R = REGRAS_PGR;
const t = (rot, fn, n, pecas) => { fn();
  const a = process.hrtime.bigint(); const r = fn(); const ms = Number(process.hrtime.bigint()-a)/1e6;
  ... imprime ms, us/batalha, Ticks medios, us/Tick e us/Tick/peca ... };
t('duelo 1v1', () => bateria({arma:'espada-longa'}, {arma:'espada-longa'}, R, CAT, {n:2000}), 2000, 2);
t('refrega 3x3', () => refrega('espada-longa','machado', R, CAT, {lado:3, n:2000}), 2000, 6);
... 5x5, 10x10, 25x25, 50x50 ...
"
```

| Configuração | Batalhas | Tempo | Por batalha | Ticks médios | µs/Tick | µs/Tick/peça |
|---|---:|---:|---:|---:|---:|---:|
| Duelo 1v1 (espada × espada) | 2000 | 109,2 ms | **54,6 µs** | 37,0 | 1,47 | 0,737 |
| Refrega 3×3 | 2000 | 187,1 ms | **93,5 µs** | 46,7 | 2,00 | 0,334 |
| Refrega 5×5 | 1000 | 157,4 ms | 157,4 µs | 56,3 | 2,79 | 0,279 |
| Refrega 10×10 | 300 | 99,5 ms | 331,8 µs | 65,2 | 5,09 | 0,254 |
| Refrega 25×25 | 60 | 62,6 ms | 1043,8 µs | 76,2 | 13,70 | 0,274 |
| Refrega 50×50 | 20 | 53,0 ms | 2647,8 µs | 81,7 | 32,41 | 0,324 |

**A maior configuração que a bancada aceita hoje**: não há teto no código. `cena`
(`lib-tempo.mjs:382`) recebe dois arrays de qualquer tamanho e o único limite é `tetoTicks = 4000`
(L382, L507). Rodei até 50×50 (100 peças) sem erro; acima disso é só tempo.

Script existente, cronometrado por fora com o relógio do shell:

```
node scripts/sim-ticks.mjs --so B --n 2000   →  13.381 ms
node scripts/sim-ticks.mjs --so B --n 8000   →  48.799 ms
```

(A bateria B é o round-robin de armas: 8000 duelos por par, dezenas de pares. O tempo dela é
dominado pelo número de pares, não pelo custo unitário.)

### D2. Mil batalhas 3×3

**93,5 ms**, num processo só, sem paralelismo. Pela tabela: mil duelos 1v1 são 55 ms; mil refregas
10×10 são 332 ms; mil de 50×50 são 2,6 s. Um milhão de duelos 1v1 são 55 s.

### D3. O gargalo

A vazão é **10.700 a 18.300 batalhas por segundo** conforme o tamanho da cena. O gargalo é o
**laço por Tick sobre todas as peças**, e não o dado:

- O custo por Tick por peça é **plano** (0,254 a 0,334 µs de 6 a 100 peças). Se o dado mandasse, o
  custo seguiria o número de ATAQUES, e uma peça ataca uma vez a cada ~6 Ticks (`declsPorLado` 4,1
  em 37 Ticks): as peças passam a maior parte dos Ticks sem rolar nada e ainda assim pagam.
- O que roda para toda peça em todo Tick: `noGolpe` e `emJanela` varrem `pend.offs`
  (L265-266), `todos.filter` monta `prontos` (L457), o embaralhamento de Fisher-Yates (L458-460),
  e para cada peça que declara, `inimigosDe` aloca um array novo (L386, L399) e um `reduce` escolhe
  o alvo (L401).
- O componente quadrático existe e é pequeno nesta faixa: de 20 para 100 peças, o custo por
  peça por Tick sobe 28% (0,254 → 0,324 µs), consistente com `inimigosDe` varrer o time inteiro
  dentro do laço das peças.
- **Dado:** com pool 5 (`dadosPool`, L271, com `ah = 10`) mais o dado do dano, um duelo rola da
  ordem de 50 a 60 d6. Se o `criarRng` (xorshift, L50-61) fosse o custo, 54,6 µs por duelo daria
  ~1 µs por rolagem, três ordens de grandeza acima do que um xorshift custa.
- **Caminho no hex:** custo **zero** na bancada, porque ela não tem mapa (`lib-tempo.mjs` não
  importa `hex`; `cena` nunca calcula posição). **NÃO MEDIDO** para o Simultâneo, e o experimento
  que resolveria: cronometrar `caminharHex` (`src/lib/hex.ts:131-152`) empacotado por `esbuild`,
  com os `passos` típicos do Grid, e somar `peças × Ticks` chamadas por batalha.
- **Agenda:** `reprojetarAgenda` é O(golpes no ar), com listas de 1 a 3 elementos
  (`combate-tempo.ts:833-851`). Irrelevante no total.

---

## E. Cobertura das Artes (capítulos XVI e XVII)

Os dois capítulos são páginas, não `.md` de `src/content/chapters`: **XVI · O Arcano** é
`src/pages/arcano.astro` (`site.ts:50`) e **XVII · As Artes** é `src/pages/artes/regras.astro`
(`site.ts:54`), com os números vindo de `regras.json → arcano`.

| Regra publicada | Onde | Estado no motor |
|---|---|---|
| **Custo de Mana** = soma dos pontos − Centelha | regras.astro §custo | **presente**: `custoDe`, `artes-grid.ts:247-266`, `mana = Math.max(0, total − centelha)` (L264); cobrada por `ctx.gastarMana` no `finally` de `conjurar` (`artes-grid-mesa.ts:741`) |
| Cada nível de parâmetro da **Cura** custa 2 | §cura | **presente**: `artes-grid.ts:257` |
| Cura **sem área** e **dividida entre os alvos** | §cura | **ausente**: nada impede comprar forma de área numa Arte de cura, e nada divide o valor. Varredura de `divide` e `semArea` em `src/lib`: zero |
| **Esticar**: parâmetro N níveis acima custa `nível × (N+1)` | §limite | **presente**: `artes-grid.ts:258-259` |
| **Esticar**: a Velocidade "soma outra vez" (5 → 10 → 15) | `regras.json` `arcano.esticar.speed` | **divergente**: `ticksDe` (L274-281) faz `4 + nível + graus esticados`, uma soma linear. Um Efeito de nível 3 esticado dois graus dá 9 Ticks no motor; a régua escrita dá 15 |
| **Decisão tardia** (soltar no fim de cada Velocidade ou segurar e subir) | `arcano.esticar.decisaoTardia` | **ausente**: a caixa decide tudo antes (`abrirConjuracao`), e o efeito é gravado de uma vez |
| **Alcance** comprado limita onde a Arte cai | §parâmetros | **parcial**: `dentroDoAlcance` (`artes-grid-mesa.ts:759-766`) mede e **pergunta** ("Conjurar assim mesmo?"), não impede |
| **Resistência**: Defesa para o que voa, Vigor + Convicção para corpo, Defesa Mental para a mente, Força/Atletismo para escapar | §conjurar e resistir; `arcano.resistencia.tipos` | **ausente inteira**. Não há rolagem de acerto de Arte, nem teste de fortitude, nem comparação com Defesa Mental em nenhum caminho de `artes-grid-mesa.ts`. O único teste que o motor faz é o de **sair da área**, que é a exceção da tabela. O próprio capítulo declara a regra em aberto: "Como as Artes rolam de vez (o acerto pela perícia Acerto Arcano e a conjuração por Tradição)" está na lista *Em revisão* de `regras.astro`. É lacuna de **regra**, não só de código |
| **Margem** nas Artes (+1d6 a cada 6 acima da resistência) | §conjurar e resistir | **ausente**: sem rolagem não há diferença de onde tirar a Margem; `danoNoAlvo` não tem o parâmetro (§A1) |
| **Armadura só protege dano com matéria** | §conjurar e resistir | **presente**: `danoNoAlvo`, `artes-grid.ts:1327`, `const armadura = materia ? opts.soakArmadura : 0` |
| **Fraqueza**: ignora toda Absorção e agrava | §fraqueza | **parcial**: `artes-grid.ts:1320-1325` devolve `absorcao: 0` e `agravado: true`, mas "agravado" só vira texto na nota; não há trilha de dano agravado (o banco tem um `pv_atual` só). "Aparar de mãos nuas fere" é **ausente** |
| **Resistência**: corta pela metade; as duas juntas se anulam | §fraqueza | **presente**: L1318, L1330-1332 |
| **Duração** em turnos | §parâmetros | **presente**: `ate_tick`, `TICKS_POR_TURNO = 6` (`artes-grid.ts:81`), `venceu` (L1392), varrido em `verificarEfeitos` (L1449) |
| **Uma mordida por criatura por turno** | §parâmetros | **presente**: `jaMordido` e `mordidos` (L1409; `artes-grid-mesa.ts:1396-1398`) |
| **A Arte sai no último Tick** | §tempo | **presente**: `montando` (L1405), `declararTempo` (`grid.astro:8216-8239`), a mancha tracejada até chegar |
| **Dissipação** por nível investido | §tempo / `arcano` | **presente**: `dissipar`, `artes-grid-mesa.ts:897-927`, compara `e.nivel <= plano.custo.total` |
| **Área**: não se esquiva, se abandona, escada de metros e as duas Dificuldades | §tempo | **presente**: `desvioDaArea` (`artes-grid.ts:1558-1568`) e `oferecerSaida` (`artes-grid-mesa.ts:1268-1332`), com ficar parado por coragem e o retorno |
| **Identificar o sinal** (+2 / +4 por ler o gesto) | §tempo | **parcial**: os bônus são opções na caixa de saída (L1282-1283); o teste de Ocultismo que os concede não é rolado em lugar nenhum |
| **Dano por nível** da Arte | `arte.grid.dadoPorNivel` | **presente**: `dadosDeDano` (`artes-grid.ts:207-217`), com a Terra dobrando e o Efeito de escala própria mandando mais |
| **Fonte do elemento** (+1 no desconto) | §fonte | **ausente**: `regras.json` `arcano.fonteElemental` é lido **só** por `regras.astro:31`. O `fonte` que aparece em `artes-grid-mesa.ts:693-708` é outra coisa: a origem da lista de Artes da peça |
| **Conjuração composta** (soma dos Manas + sobretaxa `k−1`) | §composta | **ausente**: a palavra aparece uma vez, num comentário sobre gating (`artes-grid-mesa.ts:1117`) |
| **Rituais** (escada de tempo, mais barato ou mais alto) | §rituais | **ausente**: `arcano.ritual` não tem leitor em `src/lib`; a única menção é um comentário em `artes-grid.ts:443` |
| **Guardar um feitiço** (Raciocínio penalizado enquanto guardado) | §guardar | **ausente**: `arcano.guardar` sem leitor; o `guardar` de `artes-grid-mesa.ts:126` é `localStorage` dos ajustes visuais |
| **Recuperação de Mana** (horas, descanso) | §mana | **ausente** no combate, e é fora de cena por natureza |
| `grid.fere`, `grid.cura`, `grid.teste` | `efeitos.json`, 140 blocos | **declarados e nunca lidos**: estão na interface (`artes-grid.ts:57`) e não há um leitor em `src/`. Quem decide se um efeito fere é `plano.danoDados > 0`, não a bandeira |

**Quantas das 24 Artes têm comportamento mecânico completo no motor: nenhuma.** O que cada Arte
carrega de legível por máquina é o bloco `grid` com quatro campos (`elemento`, `cor`,
`dadoPorNivel`, `danoBruto`) e os 6 níveis em **prosa**: dos 144 níveis, 18 citam um `Nd6` dentro
do texto de `efeito` e nenhum tem campo numérico. O comportamento mecânico mora nos **140
Efeitos** (todos com bloco `grid`), e mesmo lá **37 têm `forma: 'nenhuma'`**, ou seja, não têm o
que projetar no tabuleiro. As 24 Artes dependem do texto do nível para tudo o que não seja
elemento, cor e dado por nível.

---

## F. Conflito de canonicidade

Ordenado pelo tamanho do efeito no resultado de uma batalha.

| # | Conflito | Capítulo publicado | `regras.json` | Motor da mesa | O que muda no resultado por versão |
|---|---|---|---|---|---|
| 1 | **Margem de dano** | `combate.md:17, 74, 96`: +1d6 a cada 6 acima da Defesa | não tem campo; a régua está só na prosa do capítulo | **não existe** (§A1); a bancada aplica (`lib-tempo.mjs:322, 332`) | Capítulo/bancada: um acerto médio com folga de 6 a 11 leva +1d6 (+3,5 num dano base de ~7,5 do Kael de `test-contrato.mjs:174`, ou **+47%**), e a folga cresce contra alvo de guarda baixa, então **a Margem é o que converte vantagem de acerto em velocidade de morte**. Motor: o dano é constante, o combate se alonga e a diferença entre acertar raspando e acertar com folga desaparece. **Não medido** o efeito no tempo de combate: exigiria uma bancada com a Margem desligável, que hoje não existe |
| 2 | **Bloqueio, Defesa da arma e escudo** | `defesas.md:66-67`: duas rotas, e o Bloqueio soma a defesa da arma/escudo | não há campo de rota; `armas.json.defesaArma` e `escudos.json.bloqCaC` existem | só a Esquiva; o escudo **só penaliza** (§A2) | Capítulo: o escudeiro de heater ganha +3 e o duelista de espada +1, e o K25 do `Pendencias.md` mediu o acerto contra guarda cheia caindo a 6% com espada e 3% com montante. Motor: o mesmo escudeiro está **−2 pior** que sem escudo. A diferença entre as duas versões é da ordem de **5 pontos de Defesa**, que na régua de ±6 é a maior alavanca de todo o sistema |
| 3 | **Empunhadura dupla** | `combate.md:84`: hábil −1d6, inábil **−2d6**; Ambidestria apaga o dado extra | `combate.dupla.penDados: −1`, `penDadosAmbasAsMaos: true` | segue o JSON (`anatomia`, `combate-tempo.ts:291-299`) | Capítulo: a mão fraca perde 2 dados (de 5 para 3, num pool típico), e a Ambidestria tem função. JSON/motor: as duas mãos a −1d6, a dupla fica mais forte e a Técnica Ambidestria fica **sem efeito nenhum** (K18) |
| 4 | **Guarda sob pressão** | `combate.md:301`: −2 por ataque **feito ou recebido** | `combate.escada` cobra o ataque pela fase (Preparo −2, Golpe −4, Recuperação −2 por golpe) e `pressaoPorAtaque: −2` só para o recebido | segue o JSON (`defesaPerdida`, L628; a Pressão só é somada em quem apanha, `grid.astro:7201`) | Capítulo: quem ataca paga duas vezes (a fase e o próprio ataque), e brigar com duas mãos derruba a guarda em dobro. JSON/motor: paga uma vez. Diferença de **2 a 4 pontos de Defesa** em quem está atacando muito |
| 5 | **Gate de Perfuração** | `combate.md:111-118`: abaixo do Nível, o golpe resvala, dano 0 | `dano.gatePerfuracao` com a regra escrita | `calc.ts:131-135` existe e **não é chamada**; a folha só escreve "gate N*x*" | Capítulo/JSON: flecha, lança e besta **não ferem** placa completa (N3), o que é a espinha do "como derrotar cada armadura". Motor: ferem normalmente, descontando só a Absorção de Perfuração (4). Muda o resultado de toda cena com alvo de placa |
| 6 | **Couraça de Porte** | `combate.md:120-136`: +2 a +10 de Absorção contra corte e perfuração, e Perfuração natural 1 a 3 | não tem bloco | ausente, e o bestiário não a embute (`gen-monsters.mjs` não a calcula) | Capítulo: um Imenso tem 13 de Absorção contra lâmina e a flecha resvala. Motor: vale só a `absorcao` escrita no bloco. Nas 46 criaturas de porte Enorme ou acima, a diferença é de **4 a 10 pontos de dano por golpe** |
| 7 | **Porte no acerto** | `combate.md:282-295`: +3 por categoria, teto ±12, fora do teto de ±6 | `porteAcerto` com a tabela | ausente | Capítulo: acertar um Colossal é +12; ele acerta um humano a −12. Motor: 0 dos dois lados. É a maior diferença isolada de acerto do sistema, e some inteira |
| 8 | **Modo secundário de dano** | `combate.md:140` e `armas-e-armaduras.md:21`: −2 acerto e −1d6 dano | os `modos` com `principal: true/false` estão no catálogo | o seletor troca o tipo sem cobrar nada (L7613) | Capítulo: trocar para o modo que o alvo absorve menos custa caro. Motor: é de graça, então **a jogada certa é sempre atacar pelo modo de menor Absorção**, o que apaga a pedra-papel-tesoura de arma × armadura |
| 9 | **Velocidade do esticar (Artes)** | `regras.astro` §limite: 5 → 10 → 15 | `arcano.esticar.speed`, a mesma régua | `ticksDe` soma 1 Tick por grau (`artes-grid.ts:274-281`) | Capítulo/JSON: esticar dois graus **triplica** o tempo da conjuração e é decisão de momento decisivo. Motor: custa 2 Ticks a mais. A Arte esticada fica muito mais barata em tempo do que a régua quer |
| 10 | **Teto de ±6 nos modificadores** | `combate.md:270` | `combateTatico.modificadorCap: 6` | `somarCondicoes` soma sem teto (`mesa-core.ts:164-181`) | Capítulo/JSON: três condições ruins param em −6. Motor: cego (−4) + flanqueado (−2) + surpreso (−4) dão −10. Muda os casos extremos, não o comum |
| 11 | **Quase-Acerto: a classe da arma** | `quase-acerto.md:30`: pelo **dano médio** | `quaseAcerto.classePorDanoMedio` | mesa segue o JSON (`quase-acerto.ts:93-99`); **a bancada usa a classe de tempo** (`lib-tempo.mjs:316`) e `sim-duelo.mjs:12` usa o nº de dados | Só entre motores: a bancada dá à haste e ao arco os números de "média" pela classe de tempo, e a mesa os classifica pelo dano médio. Muda a frequência de raspão em lança, alabarda e bestas |
| 12 | **Quase-Acerto: o limiar do raspão** | `quase-acerto.md:16-18`: raspa se `errou por ≤ Margem`, com `errou por = (Defesa+1) − total` | idem | mesa: `saidaDoAtaque` (`quase-acerto.ts:215`); **bancada: `total >= efDef − qaMargem`** (`lib-tempo.mjs:337`), um ponto mais generoso | Um ponto de margem a mais na bancada. Pequeno por golpe, sistemático ao longo de 1000 batalhas |
| 13 | **Iniciativa: o Tick do primeiro** | `combate.md:29`: o maior entra no **Tick 1** | `derivados.iniciativa.tickDoPrimeiro: 1` | `ticksDeEntrada` usa o JSON (L360), mas a tela escreve "entra no Tick 0" (`grid.astro:4751`) | Só texto: o motor está certo e a frase da caixa mente. Não muda resultado |
| 14 | **Sangramento** | `vida-ferimentos-cura.md:54-63` | `sangramento` com gatilho e teto | condição manual; `porRodada` não é lido no Grid (§C4) | Capítulo: cair a Grave por dano letal abre Sangramento 1, e ele cobra por rodada. Motor no Grid: nada acontece. Numa batalha longa some uma fonte de dano contínuo |

---

## G. O que o motor consegue emitir

### G1. Eventos em formato de dado

| O que | Forma | Onde |
|---|---|---|
| Linha de registro | `{ id, ts, txt, pub, ...extra }` | `logar`, `grid.astro:8321-8322`. `txt` e `pub` são **prosa**; `id` e `ts` são dados |
| O `extra` do registro | quase sempre `{ acao: null }` (marcador de "não é ação") | 35 chamadas em `grid.astro` |
| O inverso do dano, para desfazer | `{ acao: 'vida', cid, de, para }` ou `{ acao: 'vida-menos', cid, quanto }` | `baixarVida`, L8054, L8064 |
| A ação declarada | `{ golpes: [Ticks], livre, desde, tipo, arma, alvo, divida, pressao, aResolver, mov }` | `combatentes.acao`, jsonb (migração 27) |
| Posição | `{ q, r, em }` por peça | `arena_tokens` |
| Relógio da cena | `encontros.tick_atual` | inteiro |
| Efeito ativo | `EfeitoAtivo` inteiro, 25 campos | `arena_efeitos` (`artes-grid.ts:1348-1384`) |
| Condições da peça | `[{ id, ate?, porArte? }]` | `combatentes.condicoes` |

**Estado é dado; evento é prosa.** Não existe um registro estruturado de "aconteceu X" com campos:
o que sobrevive de um golpe é a frase (`"Fulano acertou Beltrano: 7 de dano (Corte) [12 − 5 abs]"`,
L8094-8099) mais o inverso do dano. Total rolado, Defesa comparada, veredito, margem de erro,
manobra e Tick do golpe **só existem dentro da frase**.

### G2. O que existe em memória no instante da parada

**Existe** (todos vivos no escopo de `folhaDaAcao` ou acessíveis de `grid.astro`):

- quem ataca e quem apanha (`atacante`, `alvo`), com os blocos clonados (L7431-7433);
- o Tick do golpe (`tGolpe`, L7473) e o Tick da cena (`tickSim()`, L4093);
- a Defesa efetiva `def` e a sua decomposição `dv` (fase, ação, pressão) (L7474);
- a anatomia da ação (`anat()`, L7537) e a manobra;
- a distância em hexágonos e em metros (`hexes`, `dist`, L7478-7479);
- a faixa de distância (`fx`, L7550) e a Margem de QA (L7586);
- **os golpes pendentes**: `golpesEmCena(...)` (`mesa-tempo-ui.ts:226-240`) e, no cabeçalho da
  faixa, a contagem `vencidos` (L204);
- quantos campos a folha tem: é derivável de `CAMPOS_ATQ.length + campoAlvo.length` (L7841);
- quem está no chão, quem está livre, quem tem trajeto pendente (`naFila`, `grupoDaVez`).

**Não existe em lugar nenhum**:

- que **tipo** de parada é esta (não há um identificador: cada caixa é um `<dialog>` com um id de
  HTML, e ninguém o registra);
- **quantas vezes** o mestre foi consultado na cena, nem por quê (não há contador; o `LOG` só
  cresce quando alguém **responde**);
- **quanto tempo** a caixa ficou aberta (nenhum carimbo na abertura; `ts` só existe na linha de
  registro, que é escrita depois da resposta);
- quem respondeu (mestre ou jogador): `logar` grava a peça, não o autor;
- quantas caixas estavam abertas ou pendentes ao mesmo tempo;
- o histórico de quantos golpes venceram em cada Tick (a faixa é recalculada a cada repintura e
  nada guarda a série).

### G3. Um ponto único por onde toda parada passa

**Não existe.** São três famílias, e nenhuma cobre as outras:

1. `<dialog>.showModal()` chamado direto em `grid.astro`: paradas #1 (L7022), #2 (L8019), #4
   (L5158), #6 (L7372), e a #14 em `combate.astro`.
2. `src/lib/ui-dialog.ts` (`uiEscolher`, `uiConfirmar`, `uiFormulario`, `uiPainel`): paradas #5,
   #7, #8, #9 (em parte), #10, #13.
3. **Sem caixa nenhuma**: #3 (mira), #11 (o botão ⏭) e #12 (o cartão da faixa) são cliques em
   elementos comuns. Um gancho no nível de diálogo **nunca** veria essas três, e a #11 e a #12 são
   justamente as que travam a cena.

A conjuração ainda tem uma quarta porta própria, `abrirConjuracao` em `artes-grid-ui.ts`, com o
seu `<dialog>` (L390 em diante).

### G4. O contador de golpes pendentes num Tick

Sim, é derivável do estado atual, sem estrutura nova:
`acao.aResolver` por combatente (`combate-tempo.ts:143`) → `golpesNoAr(acao)` (L550-551) →
`golpesEmCena(pecas, nomeDoAlvo)` (`mesa-tempo-ui.ts:226-240`), que devolve **uma entrada por
golpe pendente** com `{ id, nome, grupo, tick, alvo, arma }`. Os que já venceram no Tick T são os
de `tick <= T`, contados em `faixaDeGolpesHTML` (L204) como `vencidos`.

---

## H. A fila, analiticamente

### H1. O que determina quantos golpes vencem no mesmo Tick

Tem forma fechada, e ela sai de duas funções. Uma peça que decide no Tick `D`, com anatomia
`(P, G, R)` e `V` Ticks de viagem, golpeia em

```
T_golpe = D + 1 + max(P, V)          agendaSimultanea, combate-tempo.ts:794-806
T_livre = D + 1 + ciclo + max(0, V − P)
```

e o `ciclo` é a Velocidade da arma (`anatomia`, L303-306). Declarando de novo assim que fica
livre, os golpes daquela peça caem em `T_golpe + k · ciclo`. O número de golpes simultâneos no
Tick T é

```
N(T) = #{ i : (T − D_i − 1 − max(P_i, V_i)) ≡ 0  (mod ciclo_i) }
```

ou seja, é **emergente por congruência**: duas peças com o mesmo ciclo e o mesmo Tick de entrada
colidem **sempre**, e peças de ciclos diferentes colidem no mínimo múltiplo comum. Com as
Velocidades do catálogo (4, 5, 6, 7), o m.m.c. de 5 e 6 é 30 e o de 6 e 7 é 42: dentro de um
combate de 37 a 47 Ticks (medido na §D1), pares de ciclos diferentes colidem uma ou duas vezes, e
pares de ciclo igual colidem **em todos os golpes**.

### H2. A re-projeção empilha ou espalha

**Empilha, entre peças.** `reprojetarAgenda` (`combate-tempo.ts:833-851`) calcula

```
cedoQuePode = tick + max(0, viagemRestante) + 1        (L842)
```

O novo Tick depende **só** do Tick corrente e da viagem que falta: não depende de quando a peça
declarou, nem do ciclo dela, nem de quanto ela já atrasou. Duas peças perseguindo o mesmo alvo,
com o mesmo passo e à mesma distância, recebem **o mesmo** `cedoQuePode` mesmo tendo declarado em
Ticks diferentes. E como a chamada acontece a cada avanço (`grid.astro:5000`, dentro do laço de
todas as peças em trajeto), a convergência se mantém enquanto a perseguição durar.

Dentro de **uma** peça o efeito é o contrário: os golpes dela deslizam juntos (`desloca` aplica o
mesmo `atraso` a todos, L847-849), então a rajada não se espalha, ela anda inteira.

### H3. O que sincroniza os combatentes num mesmo Tick

| Fonte | Evidência | Efeito |
|---|---|---|
| Decidir em T vale em T+1, para todos | `decideEmValeDepois: 1`, `regras.json:2249` | quem decide junto começa junto |
| `grupoDaVez` devolve **todos** os livres no Tick, não um | `grid.astro:4123` | o gesto natural do mestre é declarar todo mundo no mesmo Tick |
| Ciclos iguais por classe de arma | `anatomia` L303-306; 13 das 26 armas têm `ticks: 6` | mesma arma, mesmo período, colisão permanente |
| O bestiário tem uma classe por criatura e uma só | `monsters-mesa.json`: 309 criaturas, 1 ataque cada; 159 leves, 97 médias, 48 pesadas | uma horda do mesmo bicho golpeia em uníssono para sempre |
| Entrada por iniciativa em degraus de 6, com teto | `ticksDeEntrada`, `combate-tempo.ts:355-369`; `gapPorPenalidade: 6` | a cena inteira estreia dentro dos Ticks 1 a 4 |
| A fuga do robô tem ciclo fixo | `grid.astro:5049`, `livre: T + 6` | todo robô que foge volta a decidir 6 Ticks depois |
| O turno dos efeitos é fixo | `TICKS_POR_TURNO = 6`, `artes-grid.ts:81` | as mordidas caem em múltiplos de 6 |
| Levantar custa 5 fixos | `DELAY_AO_LEVANTAR = 5`, `grid.astro:4189` | quem levanta junto age junto |
| A re-projeção (§H2) | `combate-tempo.ts:842` | perseguidores convergem para o mesmo Tick |

### H4. Pior caso teórico com 10 peças

**10 golpes num Tick**, e por consequência 10 aberturas da folha da ação naquele instante.

Uma peça não pode ter dois golpes no mesmo Tick: `offs` é sempre uma lista de Ticks **distintos e
consecutivos**, tanto na rajada (`Array.from({length: n}, (_, i) => preparo + i)`, `combate-tempo.ts:284`)
quanto na dupla (`[preparo, preparo + 1]`, L294). O teto por peça por Tick é 1, logo o teto da cena
é o número de peças.

Somam-se a isso, no mesmo Tick: uma caixa de efeito por par efeito×alvo pego
(`verificarEfeitos`, `artes-grid-mesa.ts:1459-1475`, sem teto), e uma caixa de saída por mordida de
efeito de chão (L1335-1339). Numa cena de 10 peças com duas zonas ativas pegando 4 peças cada, o
pior caso de um único Tick é **10 folhas + 8 caixas de efeito + até 8 caixas de saída**, todas do
mestre, todas em sequência, com o ⏭ desligado até a última.

---

## I. Perguntas

1. **A simulação mede o mestre humano ou o mestre ideal?** Se o alvo é "quantas vezes ele foi
   consultado", as paradas (iii) da §B contam como carga; se o alvo é "quantas decisões o jogo
   exige", elas não contam, porque uma delas é aritmética. Muda o número em 6 das 14 paradas.
2. **O que conta como uma interrupção: a caixa que abre, ou o gesto dentro dela?** O caminho longo
   da §C3 tem 2 caixas e 19 gestos. As duas contagens medem coisas diferentes e dão respostas
   opostas sobre onde está o atrito.
3. **A batalha simulada pode acabar sem que ninguém morra?** Hoje o Grid não tem fim de batalha
   (§8 do relatório anterior) e a bancada corta em 4000 Ticks. Sem uma condição de término, 1000
   batalhas com um alvo que foge não terminam.
4. **Quem decide pelos PCs?** O robô da §6 só existe para criatura, só no Simultâneo, e ataca o
   mais próximo. Sem uma política para o lado dos jogadores, metade da cena não tem quem declare, e
   a carga do mestre medida vai ser a de um mestre jogando os dois lados.
5. **A simulação usa as regras que faltam (§F) ou o motor como está?** Adotar a Margem e o gate
   muda o tempo de combate, e o tempo de combate é o multiplicador de toda a carga: uma batalha
   duas vezes mais longa dobra as paradas.
6. **Uma horda de 20 goblins iguais é um caso a medir ou a evitar?** Pela §H3 ela é o pior caso de
   sincronia possível (mesmo ciclo, mesma entrada), e é também a cena mais comum de mesa. Se ela
   entrar, ela domina a estatística.
7. **O que é "muitas opções para o jogador"?** Hoje o repertório declarável no Grid é: atacar
   (simples, dupla, segura, rajada), mover (3 modos), conjurar, abortar, esperar 1 Tick e "outra
   coisa". As 461 Técnicas não são declaráveis. A simulação mede o repertório que existe, ou um
   inventado?
8. **Fuga e rendição contam como resultado?** O robô foge abaixo de 25% de Vida
   (`regras.json:2268`) e a perseguição sem teto (§H2) nunca fecha se o alvo for mais rápido. Sem
   decidir isso, uma fatia das batalhas termina por esgotamento do teto de Ticks.
9. **Que tamanho de cena é o alvo?** A carga do mestre cresce com o número de peças (§H4), e a
   §D1 mostra que o custo de simular também. 3×3, 4×8 e 5×20 são jogos diferentes.
10. **A medição vale para o mestre que usa `rolagem: 'site'` ou `'mesa'`?** É a única chave que já
    tira digitação do mestre hoje (§C2), e ela muda a contagem de gestos da folha de 6 para 1.
