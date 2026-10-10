# Plano de rodadas: reescrita dos textos de armas de arremesso, distância, Defesa e porte

Montado em 09/10/2026 pelo Arquiteto, a partir da seção 14 do `veterana-2f-distancia-e-precisao.md` e das
decisões D-072 a D-087. **Estado: autorizado inteiro pelo autor em 10/10/2026, com travas (abaixo).** Ordem:
**1, 2 e 3, 4a, 4b, 4c, 5, 6, 7, 8.** Os números dos itens (§14.N) são os da seção 14 do 2f; as linhas citadas lá
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
| D-068 (nada dá ataque extra sem dizer) | o parágrafo saiu de `combate.md` em 0fab8b13 até o autor decidir |
| Dois Punhos como par de leves | em espera: conflito com a D-068 (ver D-083) |
| Bestiário (inclui a redação da Constrição) | as fichas de criatura serão refeitas; a divergência vai para a B14 |
| Rodada 14 das armas sem veredito da Revisora (e462681a, 0fab8b13) | qualquer rodada que edite `combate.md` (4a, 4b, 4c, 5, 6) espera esse veredito |

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
- Depende da rodada 1.

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
  reescrito duas vezes. Continua fora: a Ambidestria (K18), a D-068 e o par de Punhos.
- Espera o veredito da rodada 14.

**Rodada 4c · As Artes: a Arte sai no Tick do Golpe** (D-084; 2b §3 e §4 item 7)
- A Arte sai no penúltimo Tick, o sinal se anuncia por quatro a seis Ticks, a decisão de esticar cai no Tick
  do Golpe (4, 9, 14). Texto dos dois modos, "A Arte sai no último Tick", tabela "Último Tick, quando sai",
  "O tempo da Arte" no Normal, e o pilar do capítulo. Vai depois da 4 porque usa as mesmas classes. A recalibração
  das Artes (A34) parte deste tempo.

**Rodada 5 · Defesa: fim do teto de penalidades, piso 0, restrição, cego** (§14.9, §14.10, §14.11, §14.13, §14.14, §14.16)
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
- `combate` (porte sem teto; corpo a corpo só o menor ganha; à distância relativo nos dois sentidos; tamanho
  que o alvo apresenta nos dois papéis, enxame incluso; nota ao Mestre sobre criaturas maiores que Médio entre
  si; a frase de Manobras que remete ao porte; exclusão de Sociais e Mentais e de Artes de área sem rolagem de
  ataque) e `regras.json` `porte` (hoje com teto de 4 categorias e simétrico).
- Não recalcula desafios nem mexe em fichas de criaturas (D-077). Espera o veredito da rodada 14.

**Rodada 7 · Preso, Agarrado e Imobilizado** (§14.12 e §14.15, o que sobrar)
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
- Varredura de texto em `src/` e nos dados por "Dardos", "±6" (só o de Defesa), "Distância" no sentido antigo
  e "teto de ±12"; passada da Leitora-novata nos capítulos tocados (lê `origin/main`, sem `docs/simulacao/`);
  Estado das D-072 a D-087 em `decisoes.md`; atualização de `fase-de-testes.md` se a escrita revelar algo a
  medir; resumo final em forma de prompt para o autor.

## Ordem e custo

1 → (2 e 3) → 4a → 4b → 4c → 5 → 6 → 7 → 8. Cada rodada é pequena e revisável; as rodadas 4a a 6 mexem no mesmo
`combate.md` e por isso andam em fila, não em paralelo.
