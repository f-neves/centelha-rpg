# Rodada 128 · veredito · a rodada 2 do veterana-1d (Cap. III, Cap. IV e o Tratar)

**Aviso:** a mensagem do Arquiteto.
- Commit: `5598adeb`.
- Fonte: `tmp/veterana/veterana-1d.md`, Parte D, Rodada 2.
- IDs: T4a, K9a, T1b, T1a, NOVO-a2-1, NOVO-a2-2, NOVO-a2-3, T1c e ACELERA-10.
- Parados esperando o autor, que não cobrei: o K5a e a condição "Morrendo".
- Registro: D-001 item 2, D-007, D-008, D-009 e D-034.
- Relato: `veterana-1d-relato.md`, seção Rodada 2.

Pino `5598adeb`. Passo 0 pelo §0.1:
- `merge-base --is-ancestor HEAD origin/main` passou (o veredito 127, `03d5c003`, está no `main`);
- depois, `switch -C revisora 5598adeb`;
- toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE. As três escolhas da Executora estão
certas. Fica um ESCALA de uma linha (`condicoes.json:136`).

## CI (§11)

Workflow `Validar dados e regras` no `5598adeb`: run `37186952721`, `completed / success`, tentativa 1.

Rodados por mim no pino, todos verdes:
- `npm run build` (log em `../tmp/revisora/build-128.txt`);
- `gen-cap-pericias --check`;
- `sim_tratar_1d.py` (saída em `../tmp/revisora/sim-tratar-128.txt`).

## (e) palavra por palavra, no gerado

Usei o verificador da 127 (`../tmp/revisora/check-e-127.mjs`, saída em `check-e-128.txt`). Ele procura
cada trecho «…» do (e) no texto de todo HTML do `dist/`.

**Acharam tudo:**
- T4a;
- T1c;
- ACELERA-10;
- A·NOVO-a2-1, que não tem trecho próprio: a conta das faixas está no T1a;
- A·NOVO-a2-2, os quatro trechos;
- A·NOVO-a2-3, os dois.

**O que o verificador não achou, e por quê:**

| ID | o que não achou | por quê |
|---|---|---|
| K9a | 2 trechos | texto velho, que tinha de sumir, e sumiu |
| K9a | 1 trecho | o (e) usa "[...]" no lugar do resto da frase. O começo ("O que pesa no corpo, a dor física inclusive, não é teste de Virtude: a dor do ferro,") está em `aparencia-virtudes-vontade.md:86` |
| T1b | 1 trecho | é a primeira das três escolhas, abaixo |
| T1a | a seção "Tratar" inteira e a linha "Incapacitado" da Recuperação | têm tabela e quebra de linha, e o verificador compara texto corrido |

Comparei o T1a à mão, item a item, com o diff:
- item 1, "desmaiado, fora da briga" (`:44`);
- item 2, o desmaio sem teste e as três Proezas (`:54`);
- item 3, "Raciocínio + Cura vs Dif 10" (`:75`);
- item 4, a seção `## Tratar` (`:79-103`). Bate com o (e) palavra por palavra: a tabela das três faixas,
  "Cura, a Habilidade", "A Arte no Tratar", "Tratar não é Estabilizar", "Cura de PV", "Transporte",
  "Sem tratamento" e o exemplo;
- item 5, a linha "| Incapacitado (0 PV ou menos) | por dia, pelo teste de Tratar, até 1 PV |"
  (`:115`);
- item 6, `combate.md:19`, "desmaia (fica Incapacitado)".

### Os nove termos velhos, contados no `dist/` inteiro

Contei com `../tmp/revisora/termos-128.mjs` (saída em `termos-128.txt`). Dão **0**:
- "à dor, à tortura e ao desânimo";
- "mesmo quando a tabela acima põe a dor na Convicção";
- "por cena/dia";
- "teste de Cura vs Dif 10";
- "Quem chega a 0 de Vida cai.";
- "Tratar é Inteligência + Cura";
- "rola Inteligência + Cura contra a Virulência";
- "conta como superado".

**"metade da Dificuldade"** aparece 2 vezes, as duas fora do Tratar:
- `acoes-e-sistema`: o Ajudante rola "contra metade da Dificuldade";
- `acoes-oficio-e-mundo`.

No Cap. IV dá zero.

**Também zero:** "igual ou acima" (termo da Parte D) e "Gastando 1". "Morrendo" só aparece na
referência da mesa, que é a condição parada.

**Acelerar 10% abaixo de 0:** `vida-ferimentos-cura.md:117` diz que "o encurtamento não vale na linha
'por dia' [...] nem para quem está em 0 PV ou menos".

## As decisões da rodada

- **Decisão 14 (D-007), o Tratar:**
  - X é o PV negativo, e as Dificuldades são metade e um quarto de X, para cima;
  - "supera" a metade recupera o Vigor, até 1 PV;
  - "supera" o quarto segura;
  - "igual ou abaixo" do quarto piora 1d6;
  - as faixas se chamam recupera, segura e piora;
  - o Estabilizar é só do Sangramento ("Tratar não é Estabilizar").
- **Decisão 15 (D-008), identificar e tratar:**
  - identificar é Inteligência + Cura, e o Mestre decide se rola;
  - a mão é Raciocínio + Cura;
  - o remédio para beber não pede teste.

  Isso está no Cap. IV, no Resistir (Veneno `:62`, Doença `:108`) e em Sentidos (`:34`).
- **Decisão 16 (D-009), a Arte no Tratar:**
  - +3 por nível de Cura ou +1 por nível de Vida, vale o maior, sem somar;
  - Mana do nível, 2 por nível, menos a Centelha.

  Está no Cap. IV e em `artes/regras.astro:453`. O link `#tratar` existe, porque o título é `## Tratar`.
- **Decisão 2 (D-001 item 2), o limite de 1 ponto:**
  - `aparencia-virtudes-vontade.md:115` deixa o limite só para o +1d6 e o +4;
  - o ponto se declara antes;
  - o +4 vale contra leitura;
  - o que não existe contra leitura é a recusa de depois.

## O exemplo do Tratar, contra `sim_tratar_1d.py`

O exemplo é Sora (PV 37, Vigor 4, Centelha 3) cuidada por Kael, com Raciocínio 3 + Cura 1 = 4, ou 2d6,
mais 2 × mín(3, 1) = 2, que dá 2d6 + 2.

**As Dificuldades e os dias:**
- **Morre:** em −19. O script dá "Kael/Sora/Veil PV 37 morre em -19".
- **Dia 1:** X = 16, Dificuldades 8 e 4 (o script também dá "X=16 Dif 8/4"). Tira 6, e segura.
- **Dia 2:** tira 10 e recupera 4, para −12.
- **Dia 3:** X = 12, Dificuldades 6 e 3. Tira 9 e vai a −8.
- **Dia 4:** X = 8, Dificuldades 4 e 2. Tira 8 e vai a −4.
- **Dia 5:** X = 4, Dificuldades 2 e 1. Tira 7 e vai a 0.
- **Dia 6:** X = 0, e qualquer total supera. Ela recupera até 1 PV e acorda em Crítico.

Todas as rolagens do exemplo cabem em 2d6 + 2, que vai de 4 a 14.

**O companheiro sem Cura** (Raciocínio 3, 1d6 + 2):
- o máximo é 8, e não supera 8: "nunca recuperaria", como o texto diz;
- o total é 4 ou menos com 1 ou 2 no dado, o que piora 1 dia em 3. O script dá "X=16 [...] sem Cura
  (1d6+2) 0.0 / 66.7 / 33.3".

**Com a Arte de Cura nível 1** (+3, total 1d6 + 5):
- a Mana é 2 menos a Centelha 2, ou seja, 0;
- recupera com 4 ou mais no dado, que é metade dos dias;
- o mínimo é 6, e nunca fica em 4 ou menos.

Confere.

## As três escolhas da Executora

1. **A oração do T1b fora do lugar exato de (e): certa.**
   - O (e) troca "e o próprio sangramento (Estabilizar) são Vigor + Resistência" por uma frase que
     termina em "; quem estanca o de outro rola Raciocínio + Cura (Cap. IV)".
   - Logo depois, a frase de `aparencia-virtudes-vontade.md:86` continua com uma aposição: ", a mesma
     Habilidade que já resolve veneno, doença e ambiente hostil no capítulo Resistir".
   - No ponto exato do (e), essa aposição passaria a se ler como falando de Raciocínio + Cura, e diria
     uma coisa falsa: a Cura não resolve veneno, doença e ambiente pela resistência.
   - A Executora pôs o "; quem estanca o de outro [...]" depois da aposição. As palavras do (e) estão
     todas lá, e a frase continua dizendo a regra.
2. **A linha "Gastar Vontade" do `qual-sistema.md:119`: certa.**
   - O T4a (e) item 2 manda "/regras/qual-sistema, folha de bolso: o mesmo conteúdo, na redação de
     A·T4d".
   - A linha nova traz o +4 de antes (também contra leitura), o limite de 1 por ação, o 1 + Margem (teto
     4) fora do limite e o grau a menos no efeito mental.
   - O nó do diagrama (`:43`) é do T4d, da rodada 6, e ficou com o texto da correção da 126, que não
     contradiz a folha. A folha remete ao Cap. XI para o "no menor grau, anula", em vez de repetir.
3. **`validate-data.mjs:422-423` (`ladoDe`): não afrouxa o portão.**
   - **O mecanismo.** O teste confere, em cada exemplo "PV N [...] morre em −X" do Cap. IV, que o número
     segue a régua pelo lado da Centelha. Em PV ímpar, um exemplo sem lado dito FALHA
     (`validate-data.mjs:433-440`).
   - **Antes da mudança,** o lado "com" só se reconhecia por "(com|tem) Centelha", "Centelha 1" ou
     "Tocado". O exemplo novo diz "Centelha 3" com PV 37, que é ímpar, então cairia como "sem lado" e o
     portão ficaria vermelho, mesmo com o número certo.
   - **Com "Centelha [1-9]",** o exemplo passa a ser conferido pelo lado "com": −ceil(37 ÷ 2) = −19, que
     é o publicado.
   - **Isso é mais estrito, e não mais frouxo.** Um exemplo que antes caía em "sem lado" (com PV par, sem
     conferência de lado nenhum) agora é conferido contra um lado, e um número errado continua vermelho.
   - **A ordem protege o caso perigoso.** A negativa ("sem/não tem/nenhuma Centelha", "Centelha 0")
     continua sendo testada antes, então um mortal não vira "com" por engano. "Centelha 1" estava contido
     no padrão de antes e continua.

## O campo `pericia`

- **`regras.json:1118`** (`sangramento.estabilizar.pericia`) passou de "Cura" para "Raciocínio + Cura".
  Quem lê o campo é só `mesa/referencia.astro:175`, que o imprime. Procurei `estabilizar` e `.pericia` em
  `src/lib`, `src/pages`, `src/components` e `scripts`, e ninguém usa o campo como chave de Habilidade.
  Não quebra nada.
- **Em `habilidades.json`** a mudança não é num campo `pericia`: é a `descricao` da Resistência (`:431`,
  T1c), com "não desmaiar por outras causas que não o 0 PV". O capítulo de Habilidades é gerado dela, e
  o `gen-cap-pericias --check` está verde.

## ESCALA · `condicoes.json:136` ainda diz "Cura contra Dif 10"

- A condição "Sangrando" do Escudo do Mestre tem esta nota: "Estabilizar: Cura contra Dif 10, ou Vigor
  + Resistência em si mesmo".
- O Cap. IV (`:75`) e o `regras.json` passaram a dizer **Raciocínio + Cura** (decisão 15).
- O arquivo não está no (e) nem no despacho. Por isso é ESCALA, e não CORRIGE.
- É uma linha: "Estabilizar: Raciocínio + Cura contra Dif 10 [...]".

Procurei "Cura vs", "Cura contra", "teste de Cura" e "Inteligência + Cura contra" em `src`. O resto já
diz Raciocínio + Cura: `acoes-resistir.md:164`, o Reanimar, e o Cap. IV.

## Travessão

Contei o caractere no arquivo inteiro, antes (`5598adeb~1`) e no pino, nos treze arquivos do commit (fora
o `diagramas.json`). Os números ficaram iguais em todos, e não há travessão novo.

## Não conferido

- O K5a e a condição "Morrendo", parados como você pediu.
- A prova da Executora em `../tmp/executora/prova-v2.py`, que não rodei: fiz a minha.

## Limpeza

O build ficou no `dist/` da minha árvore. Os scripts e as saídas estão em `../tmp/revisora/`. Nenhum
arquivo versionado tocado além deste e do `progresso-revisora-128.md`.
