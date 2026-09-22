# Rodada 89 · veredito

Reancorada em `5638730` (faixa `7b25211..f7ff757`).

**Veredito geral: PROCEDE, com um CORRIGE menor (prosa, não bloqueia) e duas notas registradas.**

## Parte A · schema e dados (`a492010`, `cd4bef2`) contra os 12 CORRIGE

**Todos os 12 CORRIGE da auditoria original (`leitura-de-novato-revisora.md`) estão RESOLVIDOS,
nenhum parcial:**

1. Lista de `tipo` corrigida em prosa para "nova", não derivada de cabeçalho.
2. Fora desta parte (migração de consumidores, ver Parte B).
3. Envelope aninhado (`envelopeItem`, `content.config.ts:157-221`) com os 4 blocos `.nullable()`
   aplicado às quatro coleções; dados de armaduras/escudos/munição conferidos por inteiro, sem
   perda de campo.
4. `preco`/`peso` nos schemas (`content.config.ts:212-213`).
5. `vsProjetilRapido` como `{ bloqueia: boolean, bonus: number.nonnegative }`, não mais booleano;
   dados de `escudos.json` batem exatamente com a coluna do capítulo (Broquel/Targe false, Hoplon/
   Heater/Kite/Scutum bloqueia sem bônus, Pavês bloqueia+3).
6. `porSeisTicks`: confirmado que ninguém mexeu nesta faixa, decisão já estava certa antes.
7. Esquema antigo de veneno: sem resíduo, veneno foi redesenhado em rodada anterior.
8. Preços migrados exatos: Machadinha 80pc, Arco Longo 150pc, Besta P/M/G 300/550/950pc; Flechas
   e Virotes em `municao.json`, `tipo: "municao"`.
9. Bastão/Martelo/Sabre/Maça Estrela e as 5 armaduras órfãs conferidos contra `precos.json`
   (pc:1, pp:10, po:100): todos batem exatamente.
10. Penalidade de armadura como módulo positivo, `min(0)`, dados conferidos (Placa completa 3,
    não −3).
11. "Super-pesada" fora do enum de `classe` no schema (saída da prosa gerada é Parte C).
12. As 10 armas + 4 armaduras adiadas sem campo `preco` (ausência real, não "a definir" fantasma).

**Munição**: `municao.json` novo, `tipo: "municao"`, bloco `municao.aceita` amarrando Flechas com
3 arcos e Virotes com 3 bestas por id.

**Nota, fora dos 12 originais, sem bloqueio:** `blocoEscudo.penalidade` ficou `z.number().int()`
sem `.min(0)` (só a de armadura tem o piso). Os dados de escudo hoje são todos positivos (0-4),
então não fura agora; registrado para não confundir com o item 10 se alguém citar "penalidade
positiva" como regra de schema geral.

## Parte B · migração dos consumidores (`0c04e9f`)

**PROCEDE.** `equip.ts:20-26` (`achata()`) espalha o bloco certo por `tipo` sobre a raiz; todos os
campos que a auditoria listava (soak, penalidade, dado, danoBonus, ticks, acerto, defesaArma) vêm
do bloco aninhado, conferido em três JSONs (adaga, gambeson, broquel). Os 6 pontos de
`vsProjetilRapido` confirmados (`content.config.ts:201`, `ficha-engine.ts:783,793,809,1385,1629`),
zero ocorrências de `habilProjetil` restando em `src/`.

Controle negativo do bestiário confirmado ao vivo (`gen-bestiario.mjs`, diff vazio). Caminho da
FICHA (o que o aviso pediu explicitamente para não ficar só no bestiário):
`scripts/test-contrato.mjs` exercita equipar espada longa + broquel em Kael e compara pool de
acerto/Defesa/Absorção contra valores fixos. Falsificado: quebrando `achata()` para espalhar só o
bloco `arma`, os 5 números denunciam alto (nada caiu em zero silencioso); restaurado, verde de
novo. É exatamente o defeito B12 que a auditoria original temia, fechado com prova, não só
contornado.

Catorze scripts via `scripts/lib-equip.mjs`: amostrados 7 (`gen-lista-equip.mjs`,
`gen-bench-tempo.mjs`, `gen-bestiario.mjs`, `gen-monsters.mjs`, `dano-por-tipo.mjs`,
`test-contrato.mjs`, mais dois `sim-*.mjs`), todos usam `achataCatalogo`. `add-folego.mjs` é o
único que lê o JSON cru sem achatar, e é correto assim: é *escritor* (grava direto em
`w.arma.folego`, comentário explícito no arquivo), não leitor.

`bestia-editor.ts:11` importa `ARMADURAS` de `./equip`, não mais `armaduras.json` direto; o ponto
exato do B12 que a auditoria apontou (`nz(arm.soak?.[m])`) hoje lê o objeto já achatado.

## Parte C · sete armas novas (`7c6ff2d`) e tabela gerada (`484c33f`)

**PROCEDE, um CORRIGE menor.** As sete armas batem número por número com
`leitura-de-novato-decisoes.md §13` (classe, atributo, dado, danoBonus, acerto, defesaArma, mãos,
ticks, folego, tipo de dano, pen, preço, todos idênticos), envelope aninhado correto nas sete.

**CORRIGE (baixa gravidade, sem consequência de jogo):** o peso do Bastão (0,6 kg) contradiz a
própria justificativa escrita em `leitura-de-novato-decisoes.md:819` ("mais leve que a Adaga").
A Adaga pesa 0,3 kg (`armas.json:9`); 0,6 kg é o DOBRO, não mais leve. Os outros seis comparativos
de peso conferem exatos contra as referências reais citadas (Machado 1,2, Montante 2,8/Martelo de
Guerra 2,5, Maça 1,3 cópia exata, Lança 2,0/Alabarda 2,7, Espada Curta 0,9). Como peso é
estimativa sem gabarito, não bloqueia; a frase que o justifica está factualmente errada e merece
ajuste (trocar "mais leve" pela razão real, ou revisar o número para ficar de fato mais leve que
0,3 kg).

`gen-cap-itens.mjs`: mesma estrutura de `gen-cap-pericias.mjs`; item sem `preco` some da tabela
sem "a definir" fantasma (confirmado por grep, zero ocorrências); `--check` entra no
`npm run validate`; `test-portoes.mjs` conta os geradores dinamicamente (10 de 15), não por lista
hardcoded. Machado (300pc/30pp), Lança (50pc/5pp) e Alabarda (280pc/28pp) confirmados com `preco`
aplicado exatamente neste commit (estavam ausentes desde `cd4bef2`, apesar de já confirmados como
"não órfãos" na auditoria).

## Falsificação e limpeza

Falsificação de `achata()` (Parte B) desfeita antes do fechamento. `git status --short` limpo (só
`progresso-revisora-89.md`, novo, não rastreado) e HEAD em `5638730`, conferido depois de todo o
trabalho.
