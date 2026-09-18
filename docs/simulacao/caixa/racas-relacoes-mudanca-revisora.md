# Revisão: Relações Sociais por raça move de `relacoes-sociais.md` para `racas.md`

Reancoragem: `225b974` (autorizado pelo Arquiteto, worktree movido por mim). Confirmado por
`git rev-parse HEAD` e `git rev-parse --show-toplevel`.

Base: `179e2db` (meu veredito anterior, PROCEDE das idades + Régua de Relação). Trabalho:
`225b974` (um commit).

## Conferência valor a valor

Reconstruí a matriz das oito raças a partir dos bullets novos de `racas.md` e comparei com a
matriz que já tinha montado na rodada anterior (a partir dos parágrafos removidos de
`relacoes-sociais.md`, todos ainda legíveis no diff do commit). Nenhum valor mudou:

- Humano: +1 Elfo/Meio-Elfo, −1 Orc, nenhuma recíproca. Igual.
- Anão: −4 Elfo, +1 Orc, +1 Meio-Elfo, Neutro com Humano/Gnomo/Halfling. Igual.
- Elfo: −1 Humano/Halfling/Meio-Orc, −2 Orc, −2 Meio-Elfo, +1 Gnomo. Igual, e ganhou uma frase a
  mais ("Pelo Anão carregam −3 (Rancor), o mesmo ódio antigo que o Anão devolve em −4") que não
  estava no bullet do Elfo antes (morava só no parágrafo conjunto "Anões e Elfos"). O valor bate
  com o que o próprio bullet do Anão já diz da mesma relação: não é número novo, é a mesma
  informação preenchendo o lado que faltava no bullet do Elfo, coerente com o formato "um bullet
  por raça" que substituiu o formato antigo "um parágrafo por par ou grupo".
- Gnomo: Neutro Humano/Anão/Orc, +1 Elfo, +1 Halfling (recíproco). Igual.
- Halfling: −1 Anão (sem volta), −1 Elfo, +1 Gnomo (recíproco), Neutro Humano/Orc. Igual.
- Meio-Elfo: −2 Elfo, +1 Humano, +1 Anão, Neutro Orc/Gnomo/Halfling. Igual.
- Meio-Orc: parte do Neutro com todos ("Sangue partido", preservado intacto como bullet próprio,
  conferido palavra por palavra contra a versão anterior), recebido em −1 por todos exceto Orc e
  outros Meio-Orcs (agora em bullet "Relações Sociais" separado). Igual.
- Orc: +1 Anão, −2 Elfo, Neutro Gnomo/Halfling. Igual.

## Sem número duplicado

`relacoes-sociais.md`, seção "Onde cada relação começa: os povos", ficou só com a regra geral e o
link para `/regras/racas` (slug confirmado em `src/lib/site.ts:28`, mesmo padrão de link usado no
resto do capítulo). O único número de relação que sobra na seção é o exemplo do Lírio/Vesna
(+1 Simpatia, +2 Apreço), que é ilustração da mecânica geral, não dado de raça — o mesmo exemplo
que já existia antes desta rodada. Nenhuma raça tem valor repetido nos dois capítulos.

## Verificação

`npm run validate` rodado aqui: verde.

## Veredito

**PROCEDE.** A mudança de casa preservou todos os valores, sem duplicação entre os dois capítulos.
A única adição de conteúdo (a frase do Elfo sobre o Anão) repete um valor que já estava correto em
outro lugar do mesmo commit, não introduz número novo.
