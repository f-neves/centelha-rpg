# Plano de rodadas: reescrita dos textos de armas de arremesso, distância, Defesa e porte

Montado em 09/10/2026 pelo Arquiteto, a partir da seção 14 do `veterana-2f-distancia-e-precisao.md` e das
decisões D-072 a D-087. **Estado: autorizado inteiro pelo autor em 10/10/2026, com travas (abaixo).** Ordem:
**1, 2 e 3, 4a, 4b, 4d, 4c, 5, 6, 7, 8** (a 4d passou à frente da 4c por ordem do usuário em 10/10/2026: ela corrige
o que está errado no ar e não depende da Arte). Os números dos itens (§14.N) são os da seção 14 do 2f; as linhas citadas lá
(`armas l.68-87` etc.) são do site de 06/10/2026 e envelhecem, então a Executora relocaliza cada trecho por busca
de texto antes de editar.

## Regras que valem em todas as rodadas

- **D-054, o Grid continua congelado.** `armas.json` é lido pela mesa (`equip.ts`, `armaDoSlot`), e
  `monsters-mesa.json`, `inimigos.json` e `condicoes.json` também são dados que o Grid lê. Mudança neles que
  mexa no que o Grid faz não se aplica: vira item novo em `docs/pendencias/N-grid-pendencias.md`. A passada
  única do Grid (que religa o `test-grid`, D-071) confere o que quebrou.
- **Ordem em cada rodada:** a Executora entrega, a Revisora dá o veredito contra o commit congelado, o CI
  fecha, e só então o Arquiteto atualiza o Estado da entrada em `decisoes.md`. Todo commit que toca `src/`
  traz a linha do que muda para quem joga hoje e se depende de migração (nenhuma está prevista).
- **Princípio do Mestre (D-087, `CLAUDE.md`).** Caso de borda que o bom senso do Mestre resolve não vira regra
  nova nem pergunta ao autor; quando muito, uma frase no livro que deixa o caso ao critério do Mestre, com um
  exemplo. Antes de perguntar ao autor: (1) o registro de decisões, (2) os documentos da Veterana (1b a 1e, 2, 2b
  a 2f), (3) o bom senso do Mestre. Só passa a pergunta que atravessar os três.
- **Arquivos gerados:** a lista de Habilidades vem de `habilidades.json` + `node scripts/gen-cap-pericias.mjs`;
  o bestiário vem da fonte + `gen-bestiario.mjs --check` (corrigir por cima do gerado morre no regen); o
  glossário e as tabelas de equipamento têm geradores próprios, e **preço gerado não se edita à mão** (a
  Executora lista antes de editar).
- **Dardos sai sem `RENOMES` e sem alias** (decisão do autor, 10/10/2026: nenhuma ficha usa Dardos). A trava da
  rodada 1 confirma isso antes. Plumbata entra como arma nova.
- **Os ±6 de `relacoes-sociais.md` e `regras.json` (`reguaNota`) são o teto SOCIAL**, fora de escopo. Só o teto
  de PENALIDADE de Defesa cai; **o teto de +6 dos BÔNUS de Defesa fica** (D-078).
- **Sem travessão** em nada que for escrito; "Habilidade", nunca "Perícia".

## O que ficou de fora de todas as rodadas

| Item | Por quê |
| --- | --- |
| Ambidestria (K18) | sem decisão do autor |
| D-068 (nada dá ataque extra sem dizer) | **entrou na 4b** (liberada pelo autor em 10/10/2026) |
| Dois Punhos como par de leves | **entrou na 4b** (cláusula da D-083) |
| Bestiário (inclui a redação da Constrição) | as fichas de criatura serão refeitas; a divergência vai para a B14 |
| Rodada 14 das armas (e462681a, 0fab8b13) | veredito 150 PROCEDE (10/10/2026): a trava está cumprida |

Pendências do autor que existiam e fecharam: a mecânica do agarrado (a D-081 corrigida diz que não há jogada nem
Tick novo para o agarrado), "Sem equilíbrio" × Caído (D-086, a cargo do Mestre) e o preço da Plumbata (D-085, 35 pc).

## Rodadas

**Rodada 1 · Dados do catálogo de Arremesso e Atirador** (§14.1 na parte de dados, §14.7 nos dados)
- Arquivos prováveis: `armas.json` (Plumbata no lugar dos Dardos, Shuriken, Kunai, Mini-faca, Boleadeira, dois
  bumerangues, Rede, Funda, Efetiva no lugar da Distância, Peso, atlatl como item extra, classes P/G/R de
  Arremesso, arcos e bestas), `regras.json` (tabela de Máxima por Força dos arcos, Máxima das bestas, Força
  máxima do Curto), `municao.json`, `glossario.json`, `src/lib/alcance.ts` e a ficha, se lerem a distância do
  catálogo. `ficha-engine.ts` e `equip.ts` só mudam se o formato da arma mudar (contrato silencioso com a mesa).
- **Trava 1 (antes de editar): procurar o id `dardos` em ficha salva**, direto nos arquivos ou no banco (não
  precisa abrir o Grid). O autor diz que nenhuma ficha usa Dardos. Confirmado, o id sai do catálogo **sem
  `RENOMES` e sem alias**. Se aparecer alguma ficha, **pare e avise**. (O banco está fechado pela RLS para a
  chave anon; a parte do banco repousa na afirmação do autor.)
- Outras referências ao id `dardos` que NÃO são ficha e precisam acompanhar, ou o portão quebra:
  `src/data/armas.json` (l.869), `scripts/test-combate-tempo.mjs` (l.80, tabela de ciclos), `src/styles/arte-equip.css`
  (l.36, `.arte-dardos`), `scripts/baixar-imagens-equip.mjs` (l.86), `scripts/folhas-ia.json` (l.122) e
  `combate-tempo-bench.html`. Os textos (`armas-e-armaduras.md` l.94, `custo-qualidade-e-equipamento.md` l.129,
  `combate.md` l.55) são das rodadas 2 e 4a.
- **Trava 2 (depois da rodada):** os campos novos (Efetiva, Peso, Máxima) são lidos pelo Grid, que está com os
  testes desligados (D-071). Conferir que o **Grid carrega uma ficha salva qualquer sem erro**; se não carregar,
  registrar em `N-grid-pendencias.md` e avisar.
- Registra no N-grid-pendencias.md o que o Grid lê e não acompanha.
- Revisão: `npm run validate`, `test-kael`, o contrato da arma, `git diff` dos dados gerados.

**Rodada 2 · Capítulo Armas e Armaduras e equipamento** (§14.1 em texto, §14.2, §14.4, §14.5, §14.6, §14.7)
- Duas tabelas (Arremesso com coluna Peso; Atirador com a tabela de Força), parágrafo introdutório do tiro
  extremo, célula "Arcos somam Força", tabela de Classes, descrições (Funda, dois bumerangues, Boleadeira,
  atlatl, arcos, Força mínima, nota de preço), Dardos em `equipamentos`, `custo-qualidade-e-equipamento`,
  `habilidades` (via `habilidades.json` e `gen-cap-pericias`) e a lista de armas do índice do bestiário (pela
  fonte do bestiário). "Dardo flamejante" (Arte) não muda.
- **Preço da Plumbata: 35 pc, definitivo (D-085); a rodada não espera mais o modelo de economia por causa dela.**
  Os preços dos arcos e das outras armas novas continuam com o modelo de economia: não inventar número.
- Depende da rodada 1. Frases sugeridas pela revisão 147 (`docs/simulacao/caixa/147-revisora.md`, "Sugestões"):
  o Composto e a Força (M-32 não é a Força mínima dos reforçados; ver a M-32 no `decisoes.md`), a Rede sem
  depender do 1d6 da coluna Dano ("não causa dano"), e as três leves de arremesso como projétil rápido.

**Rodada 3 · Capítulo Corpo e Movimento: FAA e Rede** (§14.3 e a linha da Rede de §14.15)
- O parágrafo do FAA ("a coluna Distância é o teto do objeto") passa a Efetiva por arma e Máxima por FAA e
  peso (Funda e atlatl ×2). A linha da Rede em `acoes-corpo-e-movimento` entra aqui só no que for da Rede e
  da Boleadeira (Preso pela Rede, escapar por Força + Atletismo); o Preso do agarrão fica na rodada 7.
- Depende da rodada 1. Pode andar junto com a 2.

**Rodada 4a · Combate: tempo de voo e o tiro** (§14.8, D-073; parte tiro de §14.18, D-082)
- Regra de tempo de voo perto de "Nas armas de Distância o Golpe cai no último Tick do ciclo", Recarga, exemplo
  do Bram, menção no Normal ("o tiro continua rolado na declaração") e o recebido da Guarda sob pressão na
  chegada. `combate l.54, 219, 275` (Dardos). Parte da reforma de P/G/R que é de tiro: tabela de Preparo e
  Recuperação do Arremesso, dos arcos, das bestas e da Funda, parágrafo da Distância, tabela de Velocidades,
  "contra 6 e 7 dos arcos". Dados: `armas.json` (P/G/R e Velocidade das armas de tiro) e `regras.json`
  `combate.pgr.preparo`.
- **Entra aqui (decidido em 10/10/2026, revisão 147): "Força acima de 8 conta como 8, no alcance E no dano"**
  (adendo, item 3). O alcance já está em `regras.json` (`forcaAcimaDeContaComo: 8`, que nada lê); o dano precisa
  de uma conta no motor (`calc.ts`) para os arcos, sem pôr `forcaCap` no Longo e no Composto (o
  `test-catalogo-distancia` proíbe, porque o `forcaCap` do Curto é a Força máxima padrão da D-075). Só afeta
  Força 9 ou mais.
- Espera o veredito da rodada 14 e não toca D-068 nem Ambidestria.

**Rodada 4b · Combate: a reforma de P/G/R no corpo a corpo, a Rajada e a dupla** (§14.18, D-082 e D-083)
- Reforma de P/G/R (`veterana-2b-reforma-pgr.md` §4, itens 1 a 6, 8, 9 e 10, o que for de corpo a corpo):
  Preparo = Velocidade − 1 − Recuperação, Golpe sempre 1 Tick; Haste dividida em média e de Guerra (Alabarda na de
  Guerra); Investida para todas as armas (leve sem "carga voluntária", exemplo da Sora a 12 e 21 m); Golpes no
  mesmo instante; catálogo de classes; texto do Normal (pressão em todos os Ticks). **Punhos passam a 1/1/3**
  (D-082): `armas.json` e a ficha; o Grid lê `armas.json`, então a divergência vai para o N-grid-pendencias.md.
- **A Rajada e a empunhadura dupla no P/G/R (D-083):** a Rajada `P → G → G → … → R` com −1d6 acumulativo e +1
  Tick de Recuperação por golpe, teto 3 (leve e média) e 2 (haste e pesada), só corpo a corpo, interrupção pelo
  espelho; a dupla com um Tick de Golpe por mão, −1d6 nas duas, par de leves no mesmo ciclo e média com ciclo +1.
  O livro já tem a Rajada (com duas linhas de P/G/R) e a dupla no Normal; a rodada confere e acrescenta o que
  falta, sobre a régua nova.
- **Trava (cumprida em 10/10/2026): só começa depois de a D-083 estar registrada**, para o `combate.md` não ser
  reescrito duas vezes. **Solta em 10/10/2026 (resposta do autor, mensagem sobre a D-068 e os dois Punhos):**
  entram na 4b, além do acima:
  - **D-068:** o parágrafo da Executora de e462681a, como estava, em `combate.md`, onde fala de ações de ataque
    ("Nada dá ataque extra sem dizer que dá... Os golpes a mais são os que uma regra dá pelo nome, como a Rajada e
    a empunhadura dupla, abaixo.").
  - **Dois Punhos (cláusula da D-083):** duas armas leves, cada um com as estatísticas de Punhos (1/1/3), valendo
    como par para a empunhadura dupla, a Rajada (teto 3), o Bloqueio (+1 cada) e a Guarda sob pressão (2 ataques);
    só as mãos fazem par (os dois punhos e a mão que conta como arma, D-070); chute, mordida, cauda e patas de animal
    seguem a D-068. Uma frase de Mestre para a dupla mista (ciclo da arma mais lenta, em qualquer mão), com exemplo.
  - **D-088 (Bloqueio desarmado contra arma):** no lugar do parágrafo "Contra lâmina, o corpo não segura"
    (`armas-e-armaduras.md`, Luta desarmada) e na remissão de `combate.md`, Esquivar ou Bloquear: a mão nua bloqueia
    qualquer ataque armado, sem os dados de Margem do ataque, e toma o dano da arma. As leituras a, b e d entram
    como frase; **a leitura c (dupla mista) foi DESCARTADA pelo autor** (10/10/2026: vale a D-065 item 3).
    Sem código novo: a ficha só calcula o valor do Bloqueio.
  - **4b-bis (decisão final do autor, 10/10/2026: "Punhos não bloqueiam o dano de NENHUMA arma, a não ser com
    aprovação do Mestre"):** o texto da 4b já diz que o dano da arma passa (cortante, perfurante ou contundente);
    falta só a frase do Mestre da exceção, em `armas-e-armaduras.md` (Luta desarmada), sem regra nova.
  - **Ficha:** o `armas.json` e o P/G/R dos Punhos passam a 1/1/3 (hoje a ficha lê a régua antiga, 0/1/4, para
    todas as armas); a dupla Punhos/Punhos da ficha continua como está. A ficha cobra hoje −1d6 na hábil e −2d6 na
    inábil: **não mexer**, depende da K18 ("se há penalidade por atacar com a mão inábil").
  - **Criaturas:** nada se edita (B14); a nota das medições infladas está em B-bestiario.md (B14) e no T4.
  Continua fora: a Ambidestria (K18).
- Espera o veredito da rodada 14.

**Rodada 4c · As Artes: a Arte sai no Tick do Golpe** (D-084; 2b §3 e §4 item 7)
- **FEITA em 10/10/2026:** b56d78f5 (`combate.md`, `artes/regras.astro`, `regras.json`, `test-capitulo-armas.mjs`,
  `CONJURACAO.md`), veredito 157 PROCEDE (0 BLOQUEIA, 0 CORRIGE), Validar e Deploy verdes em b56d78f5. Nada
  recalibrado, Grid intocado. A frase do Tick de decisão mora em três lugares (página, `decisaoTardia`,
  `reforma.arte.esticar.nota`): se o autor a vetar, são as três.
- **Escopo fechado (ordem do usuário, 10/10/2026): só o TEMPO das Artes.** Não recalibra nenhuma Arte (ART-34, ART-5,
  ART-38, ART-40 e a A34 seguem na fila), não mexe no Grid (`artes-grid*.ts`, `grid.astro`, `combate.astro` seguem
  no tempo antigo até a passada, N22) e não decide equilíbrio: o efeito da Arte mais cedo no equilíbrio é o **T6** de
  `fase-de-testes.md`.
- **Onde mora o texto da Arte (achado de 10/10/2026, a Executora relocaliza por busca):** `combate.md` l.95 (a linha
  "Arte (conjuração) 5 a 7 | Velocidade − 1 | 1 | 0" da tabela de P/G/R, que está velha frente à D-082: Arte graus 0 a 3
  é 3/1/1, V5; grau 4, 4/1/1, V6; graus 5 e 6, 5/1/1, V7, com a Recuperação cobrando −2) e l.131 (Normal: "a Arte rola e
  produz o efeito no último Tick da Velocidade"); `src/pages/artes/regras.astro` (l.315 "A Arte sai no último Tick";
  l.492, a decisão de esticar nos Ticks 5, 10 e 15 do exemplo de Velocidade 5, que passam a 4, 9 e 14; ver a conta
  abaixo); `src/data/regras.json` (l.1909 a 1924:
  o pilar, "sétimo", "cinco a sete Ticks", a tabela "Último Tick, quando sai"; l.2096 `decisaoTardia`; l.2385
  `feiticoTicksNota`; `combate.pgr.preparo.arte` e `combate.pgr.arte`, que o motor do Grid lê, **congelados**: a
  régua nova da Arte entra em `combate.pgr.reforma`, como a do corpo a corpo e a do tiro).
  `src/lib/combate-tempo.ts` (`reguaDaArte`, l.269 e l.545, comentários "ÚLTIMO Tick") é compartilhado com o Grid:
  a Executora confere quem o lê antes de tocar, e não toca se o Grid o lê.
- **Fonte e conta do tempo da Arte (10/10/2026). Trava: a Executora só escreve depois de a Revisora refazer a
  conta e confirmar.** Fonte: `veterana-2b-reforma-pgr.md` §3 (l.63 a 65: penúltimo Tick, "quatro a seis", "4, 9, 14,
  e não 5, 10, 15") e §4 item 7, **confirmada pelo autor** na resposta "A: sim, no Tick do Golpe" (D-084). A régua da
  Arte é a da D-082 (graus 0 a 3: 3/1/1, V5; grau 4: 4/1/1, V6; graus 5 e 6: 5/1/1, V7; Preparo = Velocidade − 1 −
  Recuperação; Golpe sempre 1 Tick; Recuperação 1). Contando os Ticks de 1 em diante, como o capítulo das Artes conta:
  o Golpe é o Tick (Preparo + 1) = **Velocidade − 1**. V5: Preparo nos Ticks 1 a 3, Golpe no 4, Recuperação no 5.
  V6: Golpe no 5. V7: Golpe no 6 ("uma conjuração de 7 Ticks acontece no sexto"). O sinal se anuncia pelo Preparo
  mais o Golpe: **4 a 6 Ticks** (era 5 a 7). Esticar soma a Velocidade outra vez (`regras.json` `esticar.speed`:
  V5 vira 10 e 15) e só o ciclo final leva Recuperação, então o Golpe de cada ciclo n cai no Tick **n × V − 1**: V5
  decide nos Ticks **4, 9 e 14**; V6 nos 5, 11 e 17; V7 nos 6, 13 e 20. **Os "4, 9, 14" do 2b valem para a
  Velocidade 5; o livro de hoje também só exemplifica a V5 ("tick 5, 10, 15"), e a 4c escreve a regra geral
  (Tick do Golpe de cada Velocidade) mais o exemplo da V5.** Isto é conta minha sobre a fonte, e não está escrito
  no 2b para V6 e V7: por isso a Revisora a refaz antes da escrita.
  **CONFERIDA pela Revisora (veredito 155, `adee7295`):** os números batem (até n = 4, o teto da tabela do esticar:
  V5 4, 9, 14, 19; V6 5, 11, 17, 23; V7 6, 13, 20, 27); V6 e V7 são a D-082 aplicada à Velocidade esticada
  T = n × V (Preparo T − 2, Golpe T − 1, Recuperação T), e "só o ciclo final leva Recuperação" está no 2b §3.
- **O que a 4c escreve além do Tick (veredito 155, itens 3 e 5).**
  - **O Tick em que se decide esticar conta como Preparo (−2 na Defesa), e só o Tick em que a Arte sai é Golpe (−4).**
    Quem segura no Tick 4 da V5 não tem Recuperação no 5: esse Tick já é Preparo do ciclo seguinte. É o que mantém o
    custo em 2 × T + 2, o mesmo 2 × Velocidade + 2 do Normal (V5: 12, 22, 32, 42). O 2b não diz isso com todas as
    letras; passa pelos filtros da D-087 sem pergunta ao autor, porque decorre do custo que já está no livro (com −4 em
    cada Tick de decisão o custo deixaria de ser 2 × T + 2) e porque o Golpe é o Tick em que a Arte sai.
  - O sinal "4 a 6 Ticks" vale para a Arte sem esticar; esticada, o sinal dura T − 1.
  - Lugares que a conta muda e a lista acima não tinha: `artes/regras.astro` l.59 (callout "Os dois modos", "a Arte
    sai no último deles"); `regras.json` l.1929 (`identificar.teste`, "no último é uma bola de fogo pronta") e l.1942
    (`semGabarito`, "só travam no último Tick" e "durante os sete Ticks": o grau 6 tem seis Ticks até o Golpe); a
    chave `ultimoTick`, lida em 5 pontos de `regras.astro` (l.315 a 330): renomear a chave troca a página junto;
    `combate.md` l.60 ("esticar leva a 10, 15, 20", que só vale para a V5: passa à regra geral com o exemplo da V5).
  - Não muda: contas por metro e Dificuldade do desvio, a janela de sustentar de 6 Ticks, a Duração contada depois de
    sair, graus e preços do esticar.
  - Fora da 4c: o Grid (resolve a Arte no último Tick, sem Recuperação) e as três escalas de Velocidade da Arte no
    repositório. Os dois estão no N22 desde 10/10/2026.
- A Arte sai no penúltimo Tick, o sinal se anuncia por quatro a seis Ticks, a decisão de esticar cai no Tick
  do Golpe de cada Velocidade (V5: 4, 9, 14). Texto dos dois modos, "A Arte sai no último Tick", tabela "Último Tick, quando sai",
  "O tempo da Arte" no Normal, e o pilar do capítulo. Vai depois da 4 porque usa as mesmas classes. A recalibração
  das Artes (A34) parte deste tempo.
- **Nota do usuário para o despacho (10/10/2026), vai no texto do despacho.** Na Arte esticada, o livro escreve a regra
  geral (o Golpe do ciclo n cai no Tick n × V − 1; só o ciclo final leva Recuperação) com o exemplo da V5 (4, 9 e 14),
  como o 2b faz. **Sem tabela de V6 e V7**: é conta da regra, e o leitor faz. O Abortar segue a regra geral do livro
  ("No Preparo ainda dá para desistir"), e a 4c não acrescenta nem tira exceção para a Arte.

**Rodada 4d · Ficha: uma régua só (OBRIGATÓRIA, não é sugestão)** (achado de 10/10/2026, veredito 153 da Revisora, N22)
- **FEITA em 10/10/2026:** 8748735d (`src/lib/ficha-pgr.ts`, `anatomiaDaFicha`; `test-capitulo-armas.mjs` com as 40
  armas e controles negativos), veredito 156 PROCEDE (0 BLOQUEIA; o CORRIGE do N22 fechado em 20ec3e89), smoke da ficha
  13 de 13, Validar verde em 8748735d. A ficha mostra a régua do livro em todas as armas; o Grid segue a velha (N22).
- **O problema.** A ficha publicada hoje mostra duas réguas de P/G/R misturadas, por classe de arma
  (`ficha-engine.ts`, `linhaPGR`, l.1633). O corpo a corpo lê a régua nova (`combate.pgr.reforma.corpoACorpo`, entregue
  na 4b); o tiro e o arremesso leem a velha (`combate.pgr.preparo`, via `preparoDe` de `combate-tempo.ts`), embora a
  régua nova do tiro já esteja em `combate.pgr.reforma.tiro` desde a 4a. Medido em 10/10/2026 sobre as 40 armas de
  `armas.json`:
  - **Régua NOVA (19 armas, corpo a corpo):** Adaga, Espada Curta, Machadinha, Bastão, Sabre e Punhos (`desarmado`), 1/1/3;
    Espada Longa, Machado, Espada Serrilhada, Maça, Picareta de Guerra, Martelo, Maça-estrela e Lança, 2/1/3; Alabarda,
    Lança Longa, Montante, Martelo de Guerra e Machado Pesado, 3/1/3.
  - **Régua VELHA, igual à do livro por coincidência (8 armas de tiro):** Shuriken, Mini-faca, Kunai (2/1/1), Adaga de
    Arremesso, Plumbata, Bumerangue e Bumerangue de Retorno Cortante (3/1/1), Funda (4/1/1).
  - **Régua VELHA, DIVERGE do livro (13 armas de tiro):** Arco Curto 5/1/0 (livro 4/1/1); Arco Longo e Composto 6/1/0
    (4/1/2); Besta Pequena 8/1/0 (7/1/1); Besta Média 11/1/0 (9/1/2); Besta Grande 14/1/0 (12/1/2); Machado de
    Arremesso, Azagaia, Pilum, Rede, Boleadeira, Bumerangue de Caça e o Cortante dele 4/1/1 (3/1/2).
  - A Arte não aparece na ficha (nenhuma entrada em `armas.json`), então a 4c não cria divergência nela.
- **É código compartilhado com o Grid?** NÃO no ponto que importa. `linhaPGR` mora só em `ficha-engine.ts`, que não
  está na lista do congelamento (D-054: `artes-grid*.ts`, `mesa-*.ts`, `grid.astro`, `combate.astro`,
  `gen-grid-artes.mjs`, `equip.ts`, `combate-resumo.ts`). O que o Grid compartilha é `combate-tempo.ts` (`preparoDe`,
  que `grid.astro` e `combate.astro` importam) e a chave `combate.pgr.preparo` de `regras.json`: essas **ficam como
  estão**, presas à D-054, e a divergência Grid × livro continua no N22 até a passada do Grid. Ler `reforma.tiro` na
  ficha, como a 4b fez com `corpoACorpo`, não toca o Grid.
- **A rodada (ANTES da 4c, por ordem do usuário de 10/10/2026; a Arte não aparece na ficha):** `linhaPGR` passa a ler `combate.pgr.reforma.tiro` pelo id da arma (com o
  mesmo fallback por Velocidade que o corpo a corpo tem), e a ficha mostra a régua do livro em TODAS as armas. Prova
  exigida: um teste que percorre as 40 armas e compara o que `linhaPGR` mostra com a tabela do capítulo (isto é a
  sugestão 1 da Revisora, feita aqui porque é a mesma conta), com controle negativo. **Não** mexer em
  `combate-tempo.ts`, `equip.ts`, `combate-resumo.ts` nem na mão inábil (K18).
- **Resolução do Grid:** a passada única do Grid (D-054, N22; religa `test-grid`, D-071). Até lá a ficha mostra o
  livro, e o Grid mostra o K15. A nota do N22 passa a listar as 13 armas de tiro divergentes.

**Rodada 5 · Defesa: fim do teto de penalidades, piso 0, restrição, cego** (§14.9, §14.10, §14.11, §14.13, §14.14, §14.16)
- **FEITA em 10/10/2026:** 63817b4f (veredito 158, PROCEDE com um CORRIGE de dado), 5-bis 0a87a64d (veredito 159: o
  CORRIGE fechado; achou a referência da mesa com o teto velho), 5-ter 1efe2ad9 (veredito 160 PROCEDE: `combateTatico`,
  `/mesa` e `/mesa/referencia` espelhando o livro, medidas pela bancada a 390 e 1300 px). Validar e Deploy verdes nos
  três. **Contradições no ar até as rodadas 6 e 7:** o porte ainda cita o teto de ±6 (`combate.md` ~l.514,
  `porteAcerto.nota`, a tabela e a frase do porte na mesa); "O agarrado" diz −2 e o Imobilizado −4 com a remissão
  "(Vantagem tática)" (`combate.md` ~l.240 e 246). O teste lista `porteAcerto.nota` como exceção da varredura do ±6:
  a rodada 6 a tira.
- Fim do teto de ±6 nas **penalidades** (`combate`, tag Alcance e porte em `armas-e-armaduras`, `defesas`),
  tabela de situações dividida (surpreso Defesa 0; cego Esquiva −4 e Bloqueio −8), tabela de restrição de
  corpo e de lugar, parágrafo "A Defesa é um valor fixo e passivo" (alvo sem Defesa), linha do Correndo
  (deixa de citar o −4 igual ao de surpreso e imobilizado), escudo "apto" com Pouco espaço, e em Ações
  (Sentidos e Engano) o teste de Furtividade contra a Percepção Passiva para "sabe que vai ser atacado".
  Dados: `regras.json` (`defesaReflexiva` e a nota do teto: **o teto de +6 fica só para os BÔNUS**, as
  penalidades perdem o teto; a exceção "penalidade imposta por Proeza fica fora do teto" fica sem objeto).
- As linhas de Agarrado e Imobilizado da tabela de restrição entram aqui (D-081: Agarrado Esquiva −8 e Bloqueio
  −4 só contra quem está de fora; Imobilizado com as Defesas zeradas, Esquiva e Bloqueio); o parágrafo do
  agarrado é da rodada 7.
- **"Sem equilíbrio" × Caído (D-086): liberado, a cargo do Mestre.** A tabela de situações ganha **uma frase**
  dizendo que alguns estados se substituem em vez de se somar, com o exemplo de "Sem equilíbrio" e Prono
  (Caído). O trecho que o autor tinha como já existente não está no livro de hoje (`combate.md` l.397-411), e a
  rodada o escreve.
- Espera o veredito da rodada 14.

**Rodada 6 · Porte** (§14.17)
- **FEITA em 10/10/2026:** c0085104 (veredito 161 PROCEDE, 0 CORRIGE; Validar e Deploy verdes). O Grid lê o porte
  (`modificadorPorte` em `calc.ts`, só por `grid.astro`), então a forma velha do dado ficou e a regra nova entrou em
  `regras.json` `porteAcerto.reforma`, com `gridNota` e a linha no N22. O glossário (Porte) também foi corrigido. A
  ficha não calcula porte. A exceção `porteAcerto.nota` saiu da varredura do ±6.
- `combate` (porte sem teto; corpo a corpo só o menor ganha; à distância relativo nos dois sentidos; tamanho
  que o alvo apresenta nos dois papéis, enxame incluso; nota ao Mestre sobre criaturas maiores que Médio entre
  si; a frase de Manobras que remete ao porte; exclusão de Sociais e Mentais e de Artes de área sem rolagem de
  ataque) e `regras.json` `porte` (hoje com teto de 4 categorias e simétrico).
- Não recalcula desafios nem mexe em fichas de criaturas (D-077). Espera o veredito da rodada 14.

**Rodada 7 · Preso, Agarrado e Imobilizado** (§14.12 e §14.15, o que sobrar)
- **FEITA em 10/10/2026:** f4c5f136 (veredito 162 PROCEDE, 0 CORRIGE; Validar e Deploy verdes). "O agarrado" com
  −8/−4 contra os de fora, o Preso com os dois perfis, "o agarrão comum só gera Agarrado", o Imobilizado com Esquiva e
  Bloqueio zerados (não a Defesa de agarrão). O "sem dobro" ganhou um parêntese (a linha *Corpo, grave* é a mesma
  penalidade, contada uma vez); a origem é redação da Veterana (1d l.953, 1e r5), e o parêntese sai se o autor ler
  outra coisa. A etiqueta Prende e a Rede já estavam certas. A Constrição do bestiário bate com a D-081 (só o Kraken
  diz Imobilizado, poder de criatura): nada para a B14. `condicoes.json` no N22 (agarrado −2, imobilizado −4, sem Preso).
- **Trava (cumprida em 10/10/2026): só depois de a correção da D-081 estar registrada.**
- Parágrafo "O agarrado" (já no ar desde 3dc09c71; muda só a Esquiva −8 e o Bloqueio −4 contra os de fora, no lugar
  do −2, e o resto fica: o agarrado não age, não rola, só se solta quando quem controla erra), item Imobilizado
  (Defesas zeradas na Esquiva e no Bloqueio, não na Defesa de agarrão; origem: a Técnica Imobilizar, as parecidas
  e quem está amarrado ou preso no gelo; um agarrão normal não imobiliza), definição de Preso em Manobras com os
  dois perfis (origens: boleadeira, rede e Arte de prender; **o agarrão só gera Agarrado**), tag Prende ("deixa o
  alvo Preso").
- **Constrição:** a redação do bestiário bate com a decisão (a Constrição gera Imobilizado, poder da criatura).
  **O bestiário não se edita agora:** anotar a divergência que houver em B14, porque as fichas de criatura serão
  refeitas.
- Divergências com `condicoes.json` e o Grid vão para o N-grid-pendencias.md (D-064).

**Rodada 8 · Fechamento**
- **Sugestões da Revisora (153 e 154), cada uma com dono; sem veredito (D-087), mas listadas aqui para não se perderem:**
  1. **`linhaPGR` testado por arma, não só por substring.** Dono: Executora-2. Antecipada e entregue na 4d (o teste das
     40 armas); a 8 só confere que continua verde.
  2. **A ficha mostra tiro e arremesso na régua velha.** Dono: Executora-2. Resolvida na 4d (ficha) e no N22 (Grid).
  3. **Pinar no texto "−1d6 acumulando", "só corpo a corpo", "2 ataques para a Guarda" e "Esquiva 8".** Dono: Executora-2,
     em `test-capitulo-armas.mjs`, com controle negativo cada uma. Conferência: Revisora.
  4. **Pinar o começo e o fim da frase do Mestre da Luta desarmada** ("Os punhos não barram o dano de arma nenhuma" e "sem
     ela, o dano passa"; a 154 mutou as duas e o teste não acusou). Dono: Executora-2. Conferência: Revisora.
  5. **A mensagem do 0dcb1e56 diz "todo o corpo a corpo como 1/1/3", e só Leve e Punhos são 1/1/3.** Commit já
     publicado, não se reescreve. Dono: nenhum; a prova que vale é o texto do livro e a tabela da 4d.
  6. **(156) O teste da 4d pina a chamada de `anatomiaDaFicha` por substring** (`anatomiaDaFicha(w, {}) /* anatomiaDaFicha(w,
     regras) */` passaria, com a ficha de volta à régua velha). Casar a linha inteira. Dono: Executora-2. Conferência:
     Revisora.
  7. **(156) O fallback por Velocidade de `ficha-pgr.ts` não é exercitado** (4 de 12 mutações passam, porque as 40 armas
     casam por id; a asserção da "arma inventada" é condicional e o comentário diz "V6" onde o código usa 4). Uma
     asserção por grupo, sem condicional, e o comentário certo. Dono: Executora-2. Conferência: Revisora.
  8. Mutantes equivalentes da 156 ("não troca o ciclo", `c.id !== 'punhos'`): sem ação. **A 6 foi fechada na 4c**
     (b56d78f5, conferida no 157).
  9. **(157) Pinar "9 Ticks quando a ação passa a 10"** no callout do esticar e a frase final do parágrafo da Arte em
     `combate.md`. Dono: Executora-2. Conferência: Revisora.
  10. **(157) Pinar "Esses Ticks são a Velocidade da conjuração"** (callout "Os dois modos"). Dono: Executora-2.
  11. **(157) Renomear `nomeDaChave` para `nota`** em `regras.json` (cosmético; conferir quem lê). Dono: Executora-2.
  12. (157) `ultimoTick.regra` diz o mesmo duas vezes, e a frase do Tick de decisão está em três lugares (ver a 4c):
     sem ação.
  13. **(160) Pinar a tabelinha "Defesa zerada ou cego" de `mesa.astro` e a ordem das colunas Esquiva e Bloqueio** nas
     duas páginas da mesa (removida ou trocada, passa). Dono: Executora-2. Conferência: Revisora.
  14. **(160) `/mesa/referencia` rola na horizontal a 390 px** (494 contra 390): os blocos "Pela arma" e "Pela armadura
     do alvo" do Quase-Acerto (482 px, fora do `tab-wrap`). Defeito de ANTES da 5-ter (reproduzido em fd0058dc), da
     frente da mesa. Dono: Executora-2, como conserto de CSS da página, com a medida pela bancada (`astro dev --config
     astro.bancada.mjs`, `MESA_BANCADA`). Não é do Grid congelado.
  15. (158) A frase da D-086 também na tabela de situações: caso do Mestre (D-087), sem ação.
  16. **(161) Pinar as células da tabela do porte em `/mesa/referencia`** (o sinal de "À distância, alvo menor" trocado
     de − para + passa no teste; a página está certa). Mesmo buraco da 13. Dono: Executora-2. Conferência: Revisora.
  17. **(162) Pinar o parêntese do "sem dobro"** em "O agarrado" (removido ou invertido, passa): é o único texto novo da
     7 sem pino, e o que o autor pode vetar. Dono: Executora-2. Conferência: Revisora.
  18. **(162) Pinar "Quem controla sofre as penalidades da Preparação" e a frase do imobilizado que tenta se soltar
     sozinho** (mutadas, passam). Dono: Executora-2. Conferência: Revisora.
- **A mensagem do 8748735d diz que a mesa não importa a ficha-engine** antes de a Executora conferir; a 156 confirmou
  que é verdade (os imports são `ficha.astro` e `personagem.astro`). Não se reescreve.
- **Pendências guardadas da Missão 2 que o 2b §5 lista e nenhuma rodada cobria:** o "caso 11 forte" (veterana-2, item
  14: a Rajada rende pouco contra o forte blindado, porque a Absorção repete a cada golpe) e a "janela de aborto com
  declaração simultânea" (sem texto-fonte achado nos documentos da Veterana). Dono: **Arquiteto**; só vai ao autor o
  que atravessar os três filtros da D-087. O "caso 11 forte" fica para a abertura da 8. **A janela de aborto foi
  triada em 10/10/2026, antes da 4c, e não muda o tempo da Arte:** (a) o 2b §5 l.87 só a nomeia, copiada da lista
  da Missão 2 (`veterana-2-ataques-multiplos.md`), que não tem "aborto" no texto; o mais perto é o item 5, caso 4
  ("parar" um Preparo) e a Q5, que perguntam se há regra de interromper por dano, e dizem que no Normal o tiro já
  foi rolado na declaração, então só existe no P/G/R (Grid, congelado); (b) o registro de decisões não tem entrada
  sobre aborto; o Abortar existe em `regras.json` `combate.abortar` (só no Preparo, perde o investido, nunca para
  atacar) e o livro já diz "No Preparo ainda dá para desistir" (`combate.md` l.137); estender o Abortar à Preparação
  de Arte é o item 6 da tabela de `docs/simulacao/CONJURACAO.md` e mora no Grid; (c) a 4c só troca em que Tick a
  Arte sai: o Preparo da Arte já encolhe sozinho pela tabela (V5: 3 Ticks em vez de 4) e o livro não escreve número
  nenhum para a janela de interromper, só "quem interromper você no meio leva a conjuração junto". **Resultado: não
  muda texto da 4c; fica na 8 como questão do Grid (N22), e só vira pergunta ao autor se, na passada do Grid, o
  filtro 3 não a resolver (o Mestre já pode permitir o aborto de uma Preparação).**
- Varredura de texto em `src/` e nos dados por "Dardos", "±6" (só o de Defesa), "Distância" no sentido antigo
  e "teto de ±12"; passada da Leitora-novata nos capítulos tocados (lê `origin/main`, sem `docs/simulacao/`);
  Estado das D-072 a D-087 em `decisoes.md`; atualização de `fase-de-testes.md` se a escrita revelar algo a
  medir; resumo final em forma de prompt para o autor.

## Mapa do 2b §4, item por item (conferido no texto de 10/10/2026; nada fica sem rodada)

Fonte: `veterana-2b-reforma-pgr.md` §4, "Textos a reescrever". "Feito" quer dizer que o texto já está no livro de hoje.

| Item do 2b §4 | Estado | Rodada |
| --- | --- | --- |
| 1. Tabela de Preparo (Preparo e Recuperação) | Feito para o corpo a corpo e o tiro (`combate.md` l.77 a 94). A linha da Arte virou as três da D-082 na 4c | 4a, 4b e 4c (feito) |
| 2. Parágrafo do Golpe nas armas de Distância; sai "No Arremesso sobra um Tick" | Feito (`combate.md` l.97) | 4a (feito) |
| 3. Tabela de Velocidades (linhas 6 e 7) | Feito (`combate.md` l.57 e 58) | 4b (feito) |
| 4. Recarga (doze Ticks) e exemplo do Bram | Feito (`combate.md` l.417 a 424) | 4a (feito) |
| 5. "Contra 6 de todos os arcos" | Feito (a frase não existe mais no texto de hoje) | 4a (feito) |
| 6. Golpes no mesmo instante (Tick 3, Tick 4) | Feito (`combate.md` l.466) | 4b (feito) |
| 7. A Arte (os dois modos, "sai no último Tick", "sétimo", tabela, "cinco a sete", esticar nos Ticks 5, 10 e 15, e o Normal) | Feito (`combate.md`, `artes/regras.astro`, `regras.json`; b56d78f5, veredito 157) | 4c (feito) |
| 8. Catálogo de armas (classes; Lança 1d6; Alabarda na Haste de Guerra; Dardos para Plumbata e dados do Arremesso; Rede sem dano) | Feito (`armas-e-armaduras.md` l.40, 78, 98, 105) | 1, 2 e 4b (feito) |
| 9. Distâncias de Arremesso | Feito pelas D-075 e D-076 (Efetiva e Máxima, no lugar da coluna Distância) | 1 e 2 (feito) |
| 10. Investida e Normal | Feito (`combate.md` l.131 e 393 a 401). A frase da Arte no Normal passou ao Tick do Golpe na 4c | 4b e 4c (feito) |

Pendências do 2b §5: o CONFLITO do Normal fechou na D-082 (a pressão vale em todos os Ticks); a Recuperação da Arte
cobrar −2 e a seção 3 (a Arte no Tick do Golpe) fecharam na D-082 e na D-084; as distâncias do Arremesso fecharam nas
D-075 e D-076; Ambidestria é a K18 (em aberto, do autor); dado e teto da mistura e os Punhos nas duas mãos fecharam
na D-083; o "caso 11 forte" e a "janela de aborto" estão na **rodada 8** (triagem do Arquiteto, acima).

## Registro de CI

- **cda8845d: Validar vermelho por infra, 10/10/2026.** `TimeoutError: Timed out after 30000 ms while waiting for the
  WS endpoint URL` ao abrir o Chrome em `test-l70-ocupacao-mesa` (smoke). A mesma árvore de código passou em 85461925 e
  nos commits seguintes. Não é defeito do commit. **Regra: se o `test-l70-ocupacao-mesa` cair de novo por tempo, o
  Arquiteto abre pendência de teste instável** (e não reexecuta em silêncio); uma queda só não abre.
- Conferido por sha em 10/10/2026: 85461925, 32924728, 4450f70c, 2ef4f5b8, 3909629a, 33ab2068 e 8c04d6a6, Validar e
  Deploy verdes. Depois: e5ab6925 verde; **8748735d (4d): Validar verde, Deploy "cancelled"** porque o push seguinte
  (adee7295) o substituiu na fila do Pages (`deploy.yml`: `concurrency: pages`, `cancel-in-progress: true`), o que não é falha; o Deploy de adee7295, que já contém a 4d, ficou verde,
  assim como o de 20ec3e89. **b56d78f5 (4c): Validar e Deploy verdes.** 63817b4f (5), 0a87a64d (5-bis) e 1efe2ad9 (5-ter): Validar e Deploy
  verdes. c0085104 (6) e f4c5f136 (7): Validar e Deploy verdes.

## Ordem e custo

1 → (2 e 3) → 4a → 4b → 4d → 4c → 5 → 6 → 7 → 8. Cada rodada é pequena e revisável; as rodadas 4a a 6 mexem no mesmo
`combate.md` e por isso andam em fila, não em paralelo.
