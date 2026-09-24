# Rodada 101 · Executora · o lote do monte A

- **Despacho:** `docs/simulacao/caixa/101-despacho.md` (`d4dc84e`).
- **Árvore:** a própria, `centelha-executora`. Comecei em `d4dc84e`, destacada em `origin/main`,
  com `status` vazio.
- **Progresso:** em `progresso-101.md`, com as horas lidas da máquina.
- **Fonte dos itens:** `leitura-de-novato-2-cruzamento.md`, seção 2. Cada item foi conferido no
  dado antes de mexer no texto.

## ENTROU

### 1.1 · As dez contas

| item | arquivo | estava | ficou | o dado que manda |
|---|---|---|---|---|
| a1 | `atributos.md` | "Os dois rolam cinco dados" | "Os dois somam 5 e rolam o mesmo 2d6 + 2" | tabela do pool, `coracao-do-sistema.md` (soma 5 = 2d6+2) |
| a10 | `combate.md` (Centelha rompe o limite) | "com Centelha 2 já se apara um Enorme" | "com Centelha 1" | `bloqueioLimite`: `porteMaxDiferenca` 1, `centelhaSobePorte` 1 |
| a15 | `antecedentes.md` (Custo) | secundária ×2, primária ×5, Atributo ×10, Centelha ×15 | secundária 2 + novo, primária 4 + 2 × novo, Atributo 5 + 5 × novo, e a Centelha nem custa XP | `xp` (`habilidadeSecundaria`, `habilidadePrimaria`, `atributo`, `centelha: gratis`) |
| a17 | `combate.md` (combo) | "Bandas 4–5 ainda cobram Vontade (+1 e +2)" | "Os níveis 5 e 6 ainda cobram Vontade (+1 e +2)" | `economiaPoderes.vontade` = `{nivel5: 1, nivel6: 2}` |
| a25 | `combate.md` (Dado da Arma) | "distância/arremesso 1d6 a 1d6+2" | "arremesso 1d6−2 a 1d6+2, distância 1d6−1 a 1d6+8" | `armas.json` |
| a25 | `armas-e-armaduras.md` (Dano) | arremesso "1d6 a 1d6+2" | "1d6−2 a 1d6+2" | idem |
| a25 | `armas-e-armaduras.md` (linha Distância) | Velocidade "6–7" | "6–15" | idem (arcos 6; bestas 9, 12, 15) |
| a26 | `combate.md` (tabela de Velocidade) | alabarda na linha 7 | alabarda na linha 6 | `alabarda.arma.ticks` = 6 |
| a29 | `regras.json` `quaseAcerto.nota` | "a classe da arma sai do dado (1d6 leve, 2d6 média, 3d6 pesada)" | "sai do DANO MÉDIO dela (ver classePorDanoMedio), e não do número de dados" | `quaseAcerto.classePorDanoMedio` |
| a29 | `quase-acerto.md` | "24 das 26 armas têm um dado só" | "30 das 33" | `armas.json`: 33 armas, 3 com `dado: 2` |
| a38 | `racas.md` (Frenesi) | "orc de 40 PV: 8 de dano" | "orc de 41 PV: 9 de dano" | PV do orc = 25 + 4 × Vigor, e 20% de 41 arredondado para cima dá 9 |
| c6 | `acoes-resistir.md` (Sono) | "cinco noites custa três noites" | "cinco noites (Desgaste 4) custa quatro noites, ou duas de doze horas" | a tabela do próprio Sono |
| c14 | `relacoes-sociais.md` (Resistir) | "0–5 (Margem 0)" | "1–5 (Margem 0)" | a mesma página: empate não supera |

**O a18 (o Bram) não entrou**, por decisão: nenhum número da tabela dele mudou.

### 1.2 · Os demais do monte A

| item | arquivo | o que mudou | o dado que manda |
|---|---|---|---|
| a2 | `aparencia-virtudes-vontade.md` (Defesa Mental) | "convencimentos, intimidações e poderes mentais" passou a medo imposto, ordem, leitura e poderes mentais, com a remissão à régua do medo | `defesas.md:37-39`, notas de `defesaMental` e `defesaSocial` |
| a2 | `acoes-resistir.md` | "Medo, dominação e imposição são Defesa Mental" virou a régua de três: Social, Mental, Bravura | idem |
| a2 | `defesas.md` (nota da tortura) | uma frase: a privação de sono como arma bate na Defesa Mental, e o cansaço é o Desgaste do Sono | `defesas.md:56` e `acoes-resistir.md` (Sono) |
| a6 | `combate.md` | "+ Especialidade" saiu da fórmula do Ataque | `especialidadeNota` (M-03) |
| a7 | `combate.md` (empunhadura dupla) | "pelos próximos 6 Ticks" virou "até a sua próxima ação" | `combate.escada.zeraEm: "livre"` |
| a8 | `antecedentes.json` (amarras de Posição, Reputação e Refúgio), regerado em `antecedentes.md`, e `antecedentes.md:321` à mão | o Antecedente desconta passos do Neutro e não soma na jogada | `aparencia.nota` (20/09) |
| a9 | `combate.md` (P/G/R) | o Golpe no último Tick ficou só na Distância; o Arremesso tem um Tick de Recuperação | `combate.pgr.preparo.arremesso.daVelocidade` = −2 |
| a12 | `racas.md` (Anão) | "+1d6 em qualquer Ofício em que já tenham pontos" | `racas.json` (`bonusCondicional` do anão) |
| a13 | `racas.md` (Humano) | terceira exceção: o Meio-Orc com −1 (Antipatia) | `racas.json`, traço "Sangue partido" do meio-orc |
| a14 | `qual-sistema.md` (fluxograma) | "(Destreza + Bloqueio)" | `habilidades.json` id `bloqueio` |
| a19 | `centelha.md` | a Centelha 1 faz servir a Energia e a Mana que o mortal já tem | `regras.json` (derivados) |
| a28 | `armas-e-armaduras.md` | Picareta e Pilum: "vence placa de N2" | `armaduras.json`: placa-transição e placa-munição N2, placa-completa N3 |
| a36 | `racas.md` | o meio-elfo também não tem Atributo rebaixado | `racas.json` meio-elfo `atributos: {}` |
| a37 | `racas.md` (4 lugares) | "maturidade" virou "idade adulta" | M-46, coluna Adulto |
| a41 + c12 | `qual-sistema.md` (fluxograma) | "Ação estendida" virou "Acumulada ou Longa"; o cortejo ganhou seta própria para Relações Sociais | `relacoes-sociais.md`, Cortejo com calma |
| c12 | `coracao-do-sistema.md` | título "Ações Estendidas" virou "Ações Acumuladas e Longas", com link | C-65 |
| a42 | `aparencia-virtudes-vontade.md` | na Extrema existem a Virtude 5 (3%) e a 6 (16%) | a tabela da própria página |
| a43 | `custo-de-servico-e-itens.md` | "Cap. XI" virou "Cap. XIII" | frontmatter de `armas-e-armaduras.md` |
| b3 | `vida-ferimentos-cura.md` | o piso de 1d6 é condicional: quem rolava zero dados segue no 2 fixo | §4f item 6 |
| b6 | `aparencia-virtudes-vontade.md` | belo e feio, o mesmo tamanho da curva com sinal trocado | `escalaAparencia` nível 0 |
| b7 | `acoes-resistir.md` e `venenos.json` | Curare: pool "3 (Destreza)" no capítulo, e `pool: 3` no JSON (era `null`) | §4 item 7 ("−3 Destreza por uma cena") |
| b11 | `combate.md` (Horda) | Magnitude 6 = 64–127 na tabela; "a cada 6 Ticks" no Ataque | `horda` (as faixas e `ataquesPorSeisTicks`) |
| b14 | `aparencia-virtudes-vontade.md` | a Mana volta Centelha por hora, o dobro no repouso; a Energia, a cada cena | `arcano.recuperacaoMana`, `recuperacaoVontade.nota` |
| b18 | `criacao-de-personagem.md` (Custos de XP) | linha nova: Antecedente, novo × 3, teto 3 na criação em Recursos e Relíquia | `xp.antecedente` |
| b19 | `armas-e-armaduras.md` (tabela de Absorção) | as cinco armaduras que faltavam | `armaduras.json` |
| b20 | `racas.md` (Halfling) | porte pequeno, Vida 20 + Vigor × 2 | `racas.json` porte `pequeno`, M-29 |
| c1 | `combate.md`, `coracao-do-sistema.md`, `vida-ferimentos-cura.md`, `centelha.md`, `habilidades.md`, `racas.md` | Bandas → Níveis; links de Firula, Tick, raspão e das reservas; "ação reflexa" → "Reflexiva" | C-55 |
| c2 | `acoes-oficio-e-mundo.md` | título "A peça em cinco números, e às vezes um Piso" | G4 |
| c3 | `relacoes-sociais.md` (3 lugares) | "Peso" do bônus virou "Acerto da Abordagem" | baldeA #42 |
| c4 | `combate.md` | saiu o ponteiro a `regras.json → combate.pgr` | C-31 |
| c8 | `acoes-resistir.md` | "penalidade" virou "abatimento"; a coluna Início mostra a via | `venenos.json` `inicio.viaEntrada` |
| c9 | `antecedentes.json` (Séquito), regerado | sem o " \| Magnitude N"; o nível 5 virou "uma guarnição, a tripulação de um navio de guerra" | baldeA #32 |
| c10 | `habilidades-secundarias.json` (Caligrafia), regerado | Escrivania virou Escrivão | id `escrivao` |
| c10 | `custo-de-servico-e-itens.md` | Penetração virou Perfuração | a tabela da própria página |
| c10 | `relacoes-sociais.md` | Desfavorável virou "abaixo do Neutro" | a régua |
| c11 | `habilidades-secundarias.md` (fora do bloco gerado) | link para a tabela de `acoes-e-sistema.md` | a própria tabela |
| c15 | `racas.md` (Gnomo) | Elfo e Halfling, "os dois, recíprocos" | `racas.md` (Elfo): Gnomo +1 |
| c16 | `aparencia-virtudes-vontade.md` | saiu "e compostura" | descrição de `integridade` em `habilidades.json` |

**b17 (o calendário):**

- `relacoes-sociais.md` já está no calendário de Uldun. Conferi as contas:
  - o intervalo é de 8 dias;
  - o elfo (×4) leva 128 dias, e isso é mais de uma estação (96 dias);
  - o bruto leva 81 × 8 = 648 dias, 1,7 ano: "quase dois";
  - o elfo leva 81 × 32 = 2592 dias, 6,75 anos: "quase sete".
- A tabela de `custo-de-servico-e-itens.md` virou PERGUNTA, abaixo.

**Três avisos de terreno que se cumpriram:**

- **O a8 caiu num bloco GERADO.** As três amarras vivem em `antecedentes.json` e foram consertadas lá.
  O `gen-cap-antecedentes.mjs --check` passou verde contra o capítulo.
- **O a14 e o a41 estão dentro do fluxograma mermaid.** Redesenhei com `node scripts/gen-mermaid.mjs`,
  que grava `src/data/diagramas.json`, e o `--check` ficou verde. O gerador avisou "cores ainda
  gravadas", e não investiguei se esse aviso já existia antes.
- **O c10 da Caligrafia está no bloco gerado de `habilidades-secundarias.md`.** Consertei no JSON e
  regerei.

### 1.3 · A dívida escrita da M-02

- **`criacao-de-personagem.md`, logo abaixo da tabela do Bram:** "O total deste exemplo ainda não se
  confere, e o dos outros três também não: a linha de Técnicas de Kael, Sora, Veil e Bram dá a
  contagem e as Proezas, e não a lista, então o preço delas não sai do catálogo."
- **`jogador-novo-decisoes.md`, M-02:** o porquê, com as três suposições do conferidor. Ele carrega
  as Técnicas sem conferir, supõe os níveis das Secundárias e supõe as Especialidades primárias
  todas de nível 1. E fica escrito que isso vale antes de qualquer reabertura.

A saída do `node scripts/cost-examples.mjs` para o Bram, nesta árvore:

```
Bram, o Erudito-tocado · orçamento 2000
  ✗ Atributos        415  (o capítulo publica 496)
  ✗ Habilidades      222  (o capítulo publica 220)
  ✗ Secundárias       56  (o capítulo publica 66)  [níveis supostos: o capítulo dá só a contagem]
  ✗ Especialidades    72  (o capítulo publica 48)  [supõe todas primárias de nível 1]
  ✗ Virtudes          74  (o capítulo publica 63)
  ✓ Vontade           90
  ✓ Aparência         20
  · Centelha           0  (grátis por regra, e a régua concorda)
  ✓ Artes            745
  ? Técnicas         120  NÃO CONFERÍVEL: a lista de Técnicas deste exemplo não existe no dado
  TOTAL conferível  1694  +  Técnicas 120  =  1814   (1868 publicado, dos quais 120 são Técnicas)
```

### 1.4 · As correções das rodadas 98 e 99

- **CORRIGE da 98:** "menos o tiro" em `racas.md` (o +2 da fúria) e no `FRENESI.md` §5.
- **CORRIGE da 99, C-102:** a marca em `jogador-novo-bestiario.md` dá a causa medida:
  - `monsters.json` tem 101 criaturas com fraqueza ou resistência;
  - o satélite `elementos-bestiario.json` tem 100 chaves;
  - a única que não está nele é `mon-exemplo-espantalho` (Espantalho Desperto).
- **CORRIGE da 99, C-23:** a coluna da tabela de `acoes-sentidos-e-engano.md` passou a "Valor Passivo
  (sem Centelha)". Os números não mudaram.
- **`Pendencias.md` §6, item 2:** passou a citar os C parciais de execução (C-47 e C-85), e diz que
  C-22, C-39, C-61 e os abertos fecharam na 99 (`bed1e91`).

### A prova

- `npm run validate`: exit 0, lido, com os portões verdes.
- `npx astro build`: exit 0, 107 páginas.
- Conferi as âncoras novas no HTML gerado, e as cinco existem:
  - `firulas--recompensa-à-ousadia`;
  - `traços-derivados`;
  - `quando-a-primária-e-a-secundária-cobrem-a-mesma-ação`;
  - `sono`;
  - `a-linha-do-tempo-ticks-velocidade-e-iniciativa`.
- Varri todos os links com âncora de nove capítulos mexidos, e nenhum quebrado.
- **Travessão:** contei "—" em cada arquivo mexido, contra a versão do `HEAD`, lendo os arquivos. Não
  aumentou em nenhum. Em `acoes-resistir.md` caiu de 4 para 3, porque o "—" da célula de pool do
  Curare virou "3 (Destreza)".
- **CI:** vai na mensagem ao Arquiteto, lido pelo run inteiro.

## PRECISA DE MIM

Duas PERGUNTAS, de duas leituras cada. Não decidi nenhuma.

**1. A célula da Bravura (a2).** `aparencia-virtudes-vontade.md:45` e `virtudes.json` (`valor.resiste`)
dizem "ao medo e à intimidação". A régua do medo de `defesas.md:37-39` manda a intimidação numa
conversa para a Defesa Social, e deixa com a Bravura só o medo da cena.

- **Leitura A:** a célula e o JSON passam a "ao medo da cena", ou equivalente, e o JSON muda junto.
- **Leitura B:** a "intimidação" da Virtude é a do teste de Virtude, que é outra coisa que a da
  Defesa Social, e as duas ficam.

O resto do a2 entrou. A célula ficou como estava, igual ao JSON.

**2. A tabela de renda de `custo-de-servico-e-itens.md:41-49` (b17).** As colunas Sem, Mês e Ano não
fecham no calendário de Uldun (semana 8, mês 32, ano 384). O Braçal, por exemplo, tem 6 pp na
semana e 22 pp no mês, uma razão de 3,67 e não de 4. E tem 4 pp livres no mês contra 38 no ano,
9,5 e não 12.

- **Leitura A:** a semana manda, e Mês e Ano se recalculam (× 4 e × 48).
- **Leitura B:** o mês ou o ano mandam, e a semana se recalcula.

As duas mexem em quase todos os números da tabela, e nenhuma diz qual é a fonte.

**Uma nota, sem pergunta:**

- **O c1 registra que o `glossario.json` não tem Desgaste, Preparo, Acúmulo nem raspão.** Não criei
  os verbetes, porque isso é redação nova e a linha só registra a falta. Se é para criar, é outro
  item.
- **A linha 77 do `Pendencias.md`** (a tabela da seção 1) ainda conta "4 abertos, 3 marcados como
  feitos que não estão". Não mexi, porque é a sua direção e o despacho pediu só o item 2 do §6.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
