# Plano de rodadas: reescrita dos textos de armas de arremesso, distância, Defesa e porte

Montado em 09/10/2026 pelo Arquiteto, a partir da seção 14 do `veterana-2f-distancia-e-precisao.md` e das
decisões D-072 a D-080. **Estado: aguardando autorização do autor. Nada foi reescrito.** Os números dos itens
(§14.N) são os da seção 14 do 2f; as linhas citadas lá (`armas l.68-87` etc.) são do site de 06/10/2026 e
envelhecem, então a Executora relocaliza cada trecho por busca de texto antes de editar.

## Regras que valem em todas as rodadas

- **D-054, o Grid continua congelado.** `armas.json` é lido pela mesa (`equip.ts`, `armaDoSlot`), e
  `monsters-mesa.json`, `inimigos.json` e `condicoes.json` também são dados que o Grid lê. Mudança neles que
  mexa no que o Grid faz não se aplica: vira item novo em `docs/pendencias/N-grid-pendencias.md`. A passada
  única do Grid (que religa o `test-grid`, D-071) confere o que quebrou.
- **Ordem em cada rodada:** a Executora entrega, a Revisora dá o veredito contra o commit congelado, o CI
  fecha, e só então o Arquiteto atualiza o Estado da entrada em `decisoes.md`. Todo commit que toca `src/`
  traz a linha do que muda para quem joga hoje e se depende de migração (nenhuma está prevista).
- **Arquivos gerados:** a lista de Habilidades vem de `habilidades.json` + `node scripts/gen-cap-pericias.mjs`;
  o bestiário vem da fonte + `gen-bestiario.mjs --check` (corrigir por cima do gerado morre no regen); o
  glossário e as tabelas de equipamento têm geradores próprios (a Executora lista antes de editar).
- **Renomear id quebra ficha salva** (persistência por slug, `RENOMES` em `ficha-engine.ts`). Dardos sai e
  Plumbata entra: a Executora propõe na rodada 1 se o id `dardos` fica como alias ou ganha entrada em
  `RENOMES`, e a Revisora confere que ficha, mesa e Grid não quebram.
- **Os ±6 de `relacoes-sociais.md` e `regras.json` (`reguaNota`) são o teto SOCIAL**, fora de escopo. Só o teto
  de Defesa cai.
- **Sem travessão** em nada que for escrito; "Habilidade", nunca "Perícia".

## Pendências do autor que travam rodadas

| Pendência | Trava |
| --- | --- |
| Agarrado, Imobilizado e a origem do Preso pelo agarrão (conflito com a D-019, item 23) | rodada 7 inteira, e as linhas de Agarrado e Imobilizado das rodadas 5 |
| Preparo mínimo (reforma das armas corpo a corpo do 2b: 1/1/3, 2/1/3, 3/1/3; `Combate_Tempo.md` §14.11) | §14.18 (os textos da reforma de P/G/R) na parte corpo a corpo |
| Teto de ±6 nos bônus de Defesa (`defesaReflexiva`) | a frase de `regras.json` e a de `combate.md` sobre o teto, na rodada 5 |
| "Sem equilíbrio" × Caído (adendo, item 12) | só a linha de Sem equilíbrio da tabela de restrição fica sem a soma |
| Rajada, empunhadura dupla, Ambidestria, D-068 (em espera) | as seções correspondentes de `combate.md` não são tocadas por nenhuma rodada abaixo |
| Rodada 14 das armas sem veredito da Revisora (e462681a, 0fab8b13) | qualquer rodada que edite `combate.md` (rodadas 4, 5, 6) espera esse veredito |

## Rodadas

**Rodada 1 · Dados do catálogo de Arremesso e Atirador** (§14.1 na parte de dados, §14.7 nos dados)
- Arquivos prováveis: `armas.json` (Plumbata no lugar dos Dardos, Shuriken, Kunai, Mini-faca, Boleadeira, dois
  bumerangues, Rede, Funda, Efetiva no lugar da Distância, Peso, atlatl como item extra, classes P/G/R de
  Arremesso, arcos e bestas), `regras.json` (tabela de Máxima por Força dos arcos, Máxima das bestas, Força
  máxima do Curto), `municao.json`, `glossario.json`, `src/lib/alcance.ts` e a ficha, se lerem a distância do
  catálogo. `ficha-engine.ts` e `equip.ts` só mudam se o formato da arma mudar (contrato silencioso com a mesa).
- Registra no N-grid-pendencias.md o que o Grid lê e não acompanha.
- Revisão: `npm run validate`, `test-kael`, o contrato da arma, ficha salva com `dardos`, `git diff` dos dados
  gerados.

**Rodada 2 · Capítulo Armas e Armaduras e equipamento** (§14.1 em texto, §14.2, §14.4, §14.5, §14.6, §14.7)
- Duas tabelas (Arremesso com coluna Peso; Atirador com a tabela de Força), parágrafo introdutório do tiro
  extremo, célula "Arcos somam Força", tabela de Classes, descrições (Funda, dois bumerangues, Boleadeira,
  atlatl, arcos, Força mínima, nota de preço), Dardos em `equipamentos`, `custo-qualidade-e-equipamento`
  (preço da Plumbata espera o modelo de economia: não inventar número), `habilidades` (via
  `habilidades.json` e `gen-cap-pericias`) e a lista de armas do índice do bestiário (pela fonte do bestiário).
  "Dardo flamejante" (Arte) não muda.
- Depende da rodada 1.

**Rodada 3 · Capítulo Corpo e Movimento: FAA e Rede** (§14.3 e a linha da Rede de §14.15)
- O parágrafo do FAA ("a coluna Distância é o teto do objeto") passa a Efetiva por arma e Máxima por FAA e
  peso (Funda e atlatl ×2). A linha da Rede em `acoes-corpo-e-movimento` entra aqui só no que for da Rede e
  da Boleadeira (Preso pela Rede, escapar por Força + Atletismo); o Preso do agarrão fica na rodada 7.
- Depende da rodada 1. Pode andar junto com a 2.

**Rodada 4 · Combate: tempo de voo e P/G/R do tiro** (§14.8 e §14.18 só nas armas de distância)
- Regra de tempo de voo perto de "Nas armas de Distância o Golpe cai no último Tick do ciclo", Recarga, exemplo
  do Bram, menção no Normal ("o tiro continua rolado na declaração") e o recebido da Guarda sob pressão na
  chegada. Tabela de Velocidades do Arremesso e dos arcos. `combate l.54, 219, 275` (Dardos).
- Espera o veredito da rodada 14 e não toca Rajada, empunhadura dupla nem D-068. A parte corpo a corpo da
  reforma de P/G/R (§14.18) NÃO entra aqui: espera o Preparo mínimo.

**Rodada 5 · Defesa: fim do teto, piso 0, restrição, cego** (§14.9, §14.10, §14.11, §14.13, §14.14, §14.16)
- Fim do teto de ±6 nas penalidades (`combate`, tag Alcance e porte em `armas-e-armaduras`, `defesas`),
  tabela de situações dividida (surpreso Defesa 0; cego Esquiva −4 e Bloqueio −8), tabela de restrição de
  corpo e de lugar, parágrafo "A Defesa é um valor fixo e passivo" (alvo sem Defesa), linha do Correndo
  (deixa de citar o −4 igual ao de surpreso e imobilizado), escudo "apto" com Pouco espaço, e em Ações
  (Sentidos e Engano) o teste de Furtividade contra a Percepção Passiva para "sabe que vai ser atacado".
  Dados: `regras.json` (`defesaReflexiva` e a nota do teto, quando o autor responder sobre os bônus).
- As linhas de Agarrado e Imobilizado da tabela de restrição esperam a rodada 7.
- Espera o veredito da rodada 14.

**Rodada 6 · Porte** (§14.17)
- `combate` (porte sem teto; corpo a corpo só o menor ganha; à distância relativo nos dois sentidos; tamanho
  que o alvo apresenta nos dois papéis, enxame incluso; nota ao Mestre sobre criaturas maiores que Médio entre
  si; a frase de Manobras que remete ao porte; exclusão de Sociais e Mentais e de Artes de área sem rolagem de
  ataque) e `regras.json` `porte` (hoje com teto de 4 categorias e simétrico).
- Não recalcula desafios nem mexe em fichas de criaturas (D-077). Espera o veredito da rodada 14.

**Rodada 7 · Preso, Agarrado e Imobilizado** (§14.12 e §14.15, o que sobrar)
- Parágrafo "O agarrado", item Imobilizado, definição de Preso em Manobras com os dois perfis, tag Prende
  ("deixa o alvo Preso"). **Só abre depois da resposta do autor** sobre a D-019, item 23 (e a origem do Preso).
- Divergências com `condicoes.json` e o Grid vão para o N-grid-pendencias.md (D-064).

**Rodada 8 · Fechamento**
- Varredura de texto em `src/` e nos dados por "Dardos", "±6" (só o de Defesa), "Distância" no sentido antigo
  e "teto de ±12"; passada da Leitora-novata nos capítulos tocados (lê `origin/main`, sem `docs/simulacao/`);
  Estado das D-072 a D-080 em `decisoes.md`; atualização de `fase-de-testes.md` se a escrita revelar algo a
  medir; resumo final em forma de prompt para o autor.

## Ordem sugerida e custo

1 → (2 e 3) → 4 → 5 → 6 → 7 → 8, com a 7 solta até o autor responder. Cada rodada é pequena e revisável; as
rodadas 4 a 6 mexem no mesmo `combate.md` e por isso andam em fila, não em paralelo. A ordem entre 4, 5 e 6
pode mudar se o autor quiser a Defesa antes do tempo de voo.
