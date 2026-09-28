# Reforma da Centelha, Briga, consertos e fichas de referência · despacho de revisão

Liberado pelo autor em 28/09/2026, para a Revisora, depois de fechada a rodada inteira da
Executora-3 (cinco fases mais a correção de um CI vermelho real, ver seção "O que aconteceu"
abaixo). Só leitura, testes e relato: não corrigir nada, não se conectar ao banco.

## O pedido, verbatim

> Revisora, conferência da rodada "reforma da Centelha" da executora, mais a preparação da
> migração 40. Só leia, rode testes e relate. Não corrija nada e não se conecte ao banco. Para
> cada item, dê o veredito PROCEDE ou NÃO PROCEDE, com a evidência (arquivo e linha, ou o comando
> e a saída).
>
> DECISÕES DO AUTOR QUE A RODADA TINHA DE CUMPRIR
> 1. Toda jogada e toda Defesa recebem 2 × o menor entre Centelha e a Habilidade daquela jogada.
>    Sem Habilidade, sem bônus. Jogadas só de Atributo recebem +1 × Centelha.
> 2. Cada Defesa usa a própria Habilidade: Esquiva, Bloqueio, mental e social.
> 3. Resistência a Arte: Dificuldade = nível da Arte × 5 + 2 × o menor entre a Centelha do
>    conjurador e o nível da Arte. O alvo soma 2 × o menor entre a Centelha dele e a Habilidade.
> 4. Dano +1 × Centelha e Absorção +1 × Centelha, sem limite, em armas, Artes e em cada pulso de
>    dano contínuo. O dano contínuo passa pela Absorção a cada pulso.
> 5. Raspão = dano de raspão da arma − Redução + Centelha do atacante − Centelha do alvo, com
>    mínimo 0. O acerto nunca causa menos que o raspão.
> 6. Redução por classe de armadura: 0/1/3/5.
> 7. Desarmado: acerto +1 e Defesa da arma +1. O resto não muda.
>
> O QUE CONFERIR
>
> A. Regra
>    1. Os itens 1 a 7 estão aplicados em todos os lugares: calc.ts, lance.ts, grid.astro,
>       motor.mjs, artes-grid-mesa.ts e qualquer outro que a executora não tenha listado. Procure
>       você mesma por "centelha" no repositório.
>    2. A regra antiga do +1 por ponto (centelhaMult) saiu mesmo, sem somar duas vezes com a
>       nova.
>    3. O mínimo usa a Habilidade certa em cada Defesa e em cada tipo de jogada.
>    4. O raspão continua saindo de uma fonte única.
> B. Fixture de lances
>    1. A contagem de lances afetados bate com a separação por causa.
>    2. A versão anterior foi preservada.
>    3. Nenhum veredito mudou por um motivo que não seja a regra nova.
> C. Bestiário
>    1. Nenhum valor de Habilidade foi inventado. A lista de fichas com campos faltando está
>       completa.
> D. Consertos da bancada
>    1. Com preparo-1, a espada dá força por Tick de cerca de força por tentativa × 6/5.
>    2. A alavanca +1 Destreza voltou.
>    3. A variante de teto da Pressão (−4 e −6) difere de "sem teto", ou há prova de que o teto
>       nunca é atingido.
> E. Fichas de referência
>    1. As quatro fichas batem com o pedido, valor por valor, de C0 a C6, nas três armaduras.
>    2. O n=1000 foi usado na versão final. O IC aparece.
> F. Números
>    1. Rode de novo por conta própria, com semente própria, uma amostra de cada medição (a até
>       g). Os resultados devem ficar dentro do IC do relatório.
>    2. Aponte qualquer número que contrarie o esperado: a duração entre iguais deveria ser
>       aproximadamente estável entre Centelhas, e o degrau X+1 contra X deveria ser positivo em
>       todos os níveis.
>    3. Na conferência de sanidade do erudito, relate o resultado e o mecanismo (quanto do dano
>       do típico de C0 a Absorção +6 anula).
> G. Livro
>    1. Os textos da Centelha, a escada 35/40/45+, o Quase-Acerto, as Artes e as armaduras estão
>       coerentes com as regras 1 a 7.
>    2. Nenhuma tabela antiga ficou para trás.
> H. Pendências
>    1. As cinco pendências pedidas foram registradas.
>    2. A D7 foi marcada como resolvida.
>
> I. MIGRAÇÃO 40 (preparação, sem aplicar)
> Contexto: supabase/migracao-40.sql troca o piso de Vida zero em jogador_dano pelo limite M-21
> (limiteDaMorte em calc.ts). O banco não tem a Centelha das peças, e o autor escolheu o caminho
> (a): criar uma coluna centelha em combatentes. Quem vai aplicar é a executora, numa rodada
> futura, com acesso ao Supabase. Sua tarefa é deixar o pedido dela pronto.
>    1. Confira se a conta em PL/pgSQL da migração 40 bate com limiteDaMorte, caso a caso,
>       incluindo o arredondamento por Centelha.
>    2. Depois da reforma, liste todas as RPCs e funções do servidor (migrações 2 a 40) que
>       calculam algo que agora depende da Centelha: dano, raspão, Absorção, limite da morte ou
>       outro. Diga se o servidor só aplica valores que chegam prontos do cliente ou se calcula
>       algo.
>    3. Defina quem escreve a coluna e quando: na criação da peça, quando a ficha muda de
>       Centelha, e nas criaturas do bestiário. Diga o que acontece com as peças que já existem
>       (valor padrão, preenchimento retroativo).
>    4. Aponte o que a política de acesso (RLS) precisa garantir: o jogador que causa dano não
>       pode ler a Centelha do alvo, e só o dono ou o Mestre pode alterá-la.
>    5. Diga se a migração é idempotente (se pode rodar duas vezes sem estragar nada) e qual é o
>       plano de reversão.
>    6. Entregue a lista do que a migração 40 precisa ter, na ordem de aplicação. Não escreva o
>       SQL final.
>
> Portão verde completo, com o espelho incluído. Relatório em
> docs/calibracao/discussao/revisao-reforma-centelha.md, com o resumo dos vereditos no topo e a
> seção I separada, pronta para virar pedido à executora. Diga se é seguro dar /clear.

## O que aconteceu depois deste pedido ser escrito (contexto para a Revisora)

O pedido acima foi escrito assumindo a rodada da Executora-3 fechada. Ela ainda não estava: um
achado de CI real (não um problema de regra, mas uma inversão de fórmula desatualizada em
`scripts/lib-bestiario.mjs`, achada só pelo CI completo do GitHub, não pelos comandos locais)
levou a mais três commits de correção depois do relato inicial dela. A ordem final de commits da
rodada inteira, todos em `main`:

1. `adfbb5d7` · Fase 1 (Regra da Centelha)
2. `9270be6f` · Fase 2 (livro e página do Mestre)
3. `7bbe593d` · Fase 3 (Briga)
4. `914ad390` · correção pós Fase 2/3 (varredura "onde mais a Centelha entra")
5. `de96fa77` · Fase 5 (fichas de referência e medição)
6. `d5f35166` · relato final, primeira versão (antes da correção de CI)
7. `82da902d` · correção do CI vermelho (causa real: `periciasDe()` com fórmula linear antiga) e
   `quaseAcerto()` virando fonte única
8. `56a15544` · padrão único (0) para Integridade ausente, decisão do autor, e correção de um
   achado errado da própria rodada (pendência B15)
9. `fc09d849` · relato final consolidado, com a seção de correção do CI

O CI completo do GitHub está verde em `82da902d`, `56a15544` e `fc09d849` (conferido por mim,
`gh run view`, job a job, depois de quatro commits seguidos vermelhos entre `adfbb5d7` e
`914ad390` por causa do mesmo bug). O relatório da Executora-3 já incorpora essa correção; leia
`docs/simulacao/caixa/reforma-centelha-briga-executora.md` inteiro, não só a primeira metade.

## Conferência prévia (Arquiteto, antes de despachar)

- **Migração 40**: já rodou em produção (commit `caafa029`, fora desta rodada), com
  `-ceil(pv_max/2)` para TODAS as peças (Centelha "desconhecida", o lado genérico), sem a coluna
  `centelha`. A seção I do pedido pede a PREPARAÇÃO do caminho (a) (coluna `centelha`), não a
  aplicação; isso já está declarado no próprio `supabase/migracao-40.sql`, que documenta as duas
  opções (a)/(b) sem aplicar nenhuma. Confirme se o texto dele já responde aos itens I.1-I.6, ou
  se falta algo.
- **B15, atenção**: a Executora-3 registrou e depois CORRIGIU o próprio achado do item C.1 (lista
  de fichas do bestiário com campo faltando). A versão inicial dizia "309/309 sem bloco
  `pericias`"; a versão corrigida, testada pelo caminho de código real
  (`lerCriaturas()`→`paraStat()`→`stat()`), diz que 0 das 309 fichas ficam sem Esquiva ou
  Integridade, e que só Sociabilidade está ausente nas 309, sem efeito prático (`stat()` cai num
  fallback antes de zerar). Vale conferir os DOIS caminhos de código você mesma (o errado que ela
  testou primeiro, e o real), para confirmar que a correção está certa e não é só a palavra dela.
- **Item C do pedido ("nenhum valor de Habilidade foi inventado")**: por causa do achado acima, a
  resposta esperada mudou de "lista de 309 fichas" para "lista vazia, com a prova do porquê".
  Confira se o relatório da Executora-3 deixa isso claro, e não apenas cita o número antigo.
- **Regressão de produção corrigida no meio da rodada**: além do que o pedido original cobre, a
  Executora-3 achou e corrigiu DUAS regressões reais que não estavam na lista original do
  despacho da Executora: (1) o piso do item 2c ("o acerto nunca dói menos que o raspão") nunca
  valia no caminho real de dano do Grid, só na prévia (achado na Fase 1, commit `adfbb5d7`); (2)
  a divergência card×modal de Defesa Mental no editor do bestiário (achada pelo CI, corrigida em
  `82da902d`/`56a15544`). Nenhuma delas estava prevista no pedido de revisão acima, mas são parte
  do que está em `main` agora; a Revisora decide se cobre a prova das duas dentro do item A ou
  como um adendo separado.

## Verificação

- `npm run validate`, `npx tsc --noEmit`, `npm run build`, `npm run espelho` verdes.
- Reprodução independente de pelo menos uma amostra de cada medição (F.1), com semente própria
  da Revisora, não a mesma da Executora.
- Travessão: zero no relatório novo.

## O relato

`docs/calibracao/discussao/revisao-reforma-centelha.md`, com o resumo dos vereditos (PROCEDE/NÃO
PROCEDE por item) no topo, a seção I (migração 40) separada e pronta para virar pedido à
Executora-3, e a seção de contexto (CI vermelho, B15, as duas regressões) coberta em algum ponto
do documento. Ao final, se é seguro dar `/clear`.
