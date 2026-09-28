# Revisão da rodada Reforma da Centelha, Briga e preparação da migração 40

Despacho: `docs/simulacao/caixa/reforma-centelha-briga-revisao-despacho.md` (`29083520`). Relato
julgado: `docs/simulacao/caixa/reforma-centelha-briga-executora.md` (nas duas versões, a inicial e
a corrigida). Árvore julgada: `069d745e` (o commit da rodada anterior mais este relatório).
Reancorada seguindo o §0 do meu contrato, com `git merge-base --is-ancestor` confirmando que o
veredito anterior já estava em `main`.

**Só leitura, testes e relato**, como o pedido exige: nada foi corrigido, nenhuma conexão com o
Supabase.

## Resumo dos vereditos

| item | veredito |
|---|---|
| A (regra, todos os lugares) | **PROCEDE**, com uma nota de cobertura (não de correção) |
| B (fixture) | **PROCEDE** |
| C (bestiário) | **PROCEDE** |
| D (bancada) | **PROCEDE** (já julgado em veredito próprio) |
| E (fichas de referência) | **PROCEDE**, verificado por amostra |
| F (números) | **PROCEDE**, amostra própria dentro do esperado |
| G (livro) | **PROCEDE** |
| H (pendências) | **PROCEDE** |
| I (migração 40) | ver seção própria, no fim, pronta para virar pedido |

`npm run validate`, `npx tsc --noEmit`, `npm run build`, `npm run espelho`: **verdes**, rodados
por mim nesta árvore. CI completo do GitHub: **success** em `069d745e` (o commit deste relatório,
que inclui `29083520`).

## Contexto (CI vermelho, B15, as duas regressões)

Conferido como o Arquiteto pediu:

- **Os quatro commits com CI vermelho** (`adfbb5d7` a `914ad390`): a causa (`periciasDe()` com
  fórmula linear antiga, `BestaCard.astro` duplicando a mesma inversão) está corrigida em
  `82da902d`; `56a15544` fechou o padrão de Integridade ausente. Não é regra, é bug de inversão,
  como o relato diz.
- **B15**: a primeira versão do item C.1 ("309/309 sem `pericias`") estava errada por pular
  `paraStat()` antes de `stat()`. Rodei os DOIS caminhos eu mesma (abaixo, seção C) e confirmo que
  a correção está certa, não é só a palavra da Executora-3.
- **As duas regressões achadas no meio da rodada**: o piso do item 2c nunca valia no caminho real
  de dano (só na prévia), e a divergência card×modal de Defesa Mental do editor. Cobri as duas
  dentro do item A (a primeira com controle negativo próprio, abaixo) e da seção de contexto (a
  segunda, via a correção do CI).

## A. Regra aplicada em todos os lugares · PROCEDE, com nota de cobertura

**A.1/A.2, a varredura e o double-counting.** `git grep -n -i centelha` no repositório inteiro
(`src/`, `scripts/`, `supabase/`) e classifiquei cada ocorrência aritmética: `centelhaNaJogada`
(a fórmula nova, `calc.ts:138`), `centelhaMult` residual (só em `energia`/`mana`, que o Arquiteto
já tinha confirmado como fora de escopo, e nos dois arquivos já registrados como K35:
`lib-tempo.mjs`, `cost-examples.mjs`), ou exibição pura. Não achei nenhuma leitura de
`centelhaMult` fora dessas duas famílias já conhecidas: as quatro entradas de `regras.json`
(`defesa`/`defesaMental`/`defesaSocial`/`ataque`) trazem `centelhaNota: "DESATUALIZADO..."` e
`calc.ts` não lê `.centelhaMult` em nenhuma das quatro funções (`defesa`, `defesaMental`,
`defesaSocial`, `ataqueCentelha`), só em `energia`/`mana`. Sem duplicação.

**Recomputei à mão, sem rodar o teste**, os três números do Kael que o relato da Fase 2 cita
(`scripts/fixtures/kael.json`: Destreza 4, Esquiva 3, Integridade 0, Raciocínio 3, Vontade 7,
Compostura 2, sem Sociabilidade, Centelha 3):
- Esquiva = (4+3)×2 + 2×min(3,3) = 14 + 6 = **20**.
- Defesa Mental = 0×1 + 3 + 7 + 2×min(3,0) = 10 + 0 = **10**.
- Defesa Social = (2+0)×2 + 2×min(3,0) = 4 + 0 = **4**.

As três batem exatamente com `node scripts/test-kael.mjs` (Defesa 20, Def. Mental 10) e com o
que a Fase 2 relata (Defesa Social 7→4). Não é circular: recomputei pela fórmula do despacho, não
li o número esperado do teste.

**A.3 (Habilidade certa em cada Defesa/jogada)**: confirmado nas assinaturas de `calc.ts`
(Esquiva/Bloqueio usa a Habilidade recebida por parâmetro; Defesa Mental usa Integridade;
Defesa Social usa Sociabilidade, com o fallback de feras já existente).

**A.4 (fonte única do raspão)**: `quaseAcertoDoEncontro` migrou para `quase-acerto.ts` (achado do
Arquiteto na conferência prévia, corrigido nesta rodada: `quaseAcerto()`, a função dos cards sem
combate, também virou fonte única, decisão registrada como pendência que a própria rodada
resolveu ao fazer `lance.ts` reexportar). Não achei um sétimo lugar reimplementando o raspão além
dos já catalogados nas rodadas anteriores.

**A, o achado que fiz por conta própria: o controle negativo da Fase 1 (o piso, item 2c) tem uma
lacuna de cobertura que o relato não menciona.** `aplicarDano` (`grid.astro`) tem dois
call-sites que passam `piso: res.piso` (a resolução normal e o caminho do interpositor). Revertidos
separadamente (não juntos, e não a mesma forma que a Executora-3 testou: ela reverteu o `Math.max`
central):
- Reverter só o **primeiro** call-site (linha ~8683, o caminho comum) para `piso: undefined`: o
  `npm run espelho` continuou **verde**, incluindo `1v1-unissono` (a cena que a Executora-3 cita
  como a que pegou o bug original), nas duas sementes.
- Reverter só o **segundo** call-site (linha ~9045, o caminho do interpositor) para
  `piso: undefined`: `1v1-unissono` **fica vermelho** nas duas sementes, com a mesma assinatura
  que a Executora-3 relatou (`pv: mesa 37 · laço 36`).

Isso quer dizer que `1v1-unissono` (uma cena sem interposição nenhuma) exercita o SEGUNDO
call-site, não o primeiro, e por isso um defeito isolado só no primeiro call-site não teria
divergência nenhuma no espelho hoje. Revertido de volta nos dois casos (`git diff` vazio depois),
confirmei que o conserto central (`Math.max(opts.piso || 0, ...)`) está certo e é o que sustenta a
correção: revertê-lo por inteiro reproduz a falha exata que a Executora-3 descreveu, nas duas
sementes. **Não é CORRIGE**: o código está certo. É uma nota de cobertura, no mesmo espírito do
que já registrei para o item 3 da rodada anterior: se um dia só o primeiro call-site regredir, o
espelho de hoje não vai notar.

**Rule 3/4 (resistência a Arte, dano contínuo)**: confirmado, como a própria Fase 1 relata, que
não existe caminho de código para a jogada de resistência a efeito tipo Afogar/Maremoto (é conta
de mestre à mão); registrado, não implementado, coerente com "pare e relate". O dano de Sangramento
(pulso contínuo) passa por `aplicarDano`/`baixarVida` como qualquer outro dano nesta rodada (não é
uma terceira via): não achei um pulso de dano contínuo fora de Artes (`morder`) que ficasse sem o
termo de Centelha.

## B. Fixture de lances · PROCEDE

`git log -- scripts/fixtures/lances.jsonl`: o último commit a tocar o arquivo é `1b933b55` (a
rodada ANTERIOR, bancada/consertos), não nenhum dos commits da Reforma. `node scripts/test-lance.mjs`:
**0 divergências, 58 asserções** (56 + as 2 novas da Reforma), rodado por mim. A contagem "0" é
estrutural (a fixture congela `entrada.atacante.ataque` e `entrada.danoQA`, que não se recalculam
no replay), exatamente como a rodada anterior já tinha identificado para os itens 2a/2b: não é
zero por acidente.

## C. Bestiário · PROCEDE, os dois caminhos conferidos por mim

Rodei os dois caminhos eu mesma, sem depender da palavra da Executora-3:

```
Caminho errado (o que produziu "309/309"): stat(ficha.skills direto)
Caminho real: lerCriaturas() → paraStat() → stat()
```

Pelo caminho real: **0 das 309 fichas** sem `skills.esquiva` ou `skills.integridade`; **309 de
309 sem `skills.sociabilidade`**, confirmado por um script próprio (não o dela, apagado). Também
confirmei o fallback: `periciasDe()`/`stat()` usa `pe.sociabilidade ?? Math.max(0, oratoria,
manha, persuasao, ...)` antes de zerar, então a lacuna de Sociabilidade não muda nenhuma Defesa
Social publicada hoje. "Nenhum valor de Habilidade foi inventado" é verdade pelo caminho real: a
lista de campos faltando é a de Sociabilidade nas 309, já registrada em B15.

## D. Consertos da bancada · PROCEDE

Já julgado em veredito próprio (`docs/simulacao/caixa/bancada-tres-consertos-revisora.md`,
commit `069d745e`), com controle negativo independente nos três itens. `15-linha-de-base.md` (o
relatório de referência, soma-based) não foi regenerado depois da Reforma, e não precisa: os
critérios de aceite (a razão 6/5, o teto de Pressão) são estruturais, não dependem do valor
absoluto da fórmula de Centelha.

## E. Fichas de referência · PROCEDE, por amostra

Conferi a Típica espada C0 (5/4/2/3/1) e C3 (6/6/4/4/3) contra `docs/calibracao/
16-linha-de-base-centelha.md`: os atributos das fichas batem com o despacho, valor por valor,
nas duas amostras. `--n 1000` confirmado no relatório (marcado RASCUNHO, como pedido), com IC
presente em toda linha que reporta vitória.

## F. Números · PROCEDE, amostra própria

Rodei uma amostra própria (semente diferente da Executora-3, `--n 300`) de uma célula da Típica
espada C3 vs C3 (duração entre iguais) e outra do degrau C3 vs C2: os dois caíram dentro do IC do
relatório publicado. **Item g (erudito)**: confirmei que a censura das duas linhas é 0,0% (o
0,0% de vitória não é um zero por ausência de luta resolvida, é resultado real). Direção bate com
o esperado nos dois casos (perde sem treino, resiste com treino).

## G. Livro · PROCEDE

Conferido `quase-acerto.md`: a tabela de Redução já mostra 3/5 (média/pesada), e o exemplo do
capítulo usa a fórmula completa (raspão com o termo de Centelha dos dois lados). Busquei termos
antigos ("+1 por ponto", `centelhaMult`) em `armas-e-armaduras.md`, `artes/regras.astro` e
`quase-acerto.md`: nenhum achado. A escada de Dificuldade (35/40/45+) está em `regras.json` e
confirmada no `dist/` (`coracao-do-sistema`, `/mestre`).

## H. Pendências · PROCEDE

D7 fechada por substituição (não por escolha entre +1/+2), como a conferência prévia do Arquiteto
pedia. As pendências novas (D12-D14, K34-K35, A31, B15) estão nos arquivos de tema certos.

## I. Migração 40 (preparação, sem aplicar): pronto para virar pedido à Executora-3

**Ponto que o pedido original não previa**: `migracao-40.sql` **já rodou em produção**
(`caafa029`, fora desta rodada), com `-ceil(pv_max/2)` para toda peça (Centelha desconhecida). O
número **40 já está ocupado e carimbado**; a coluna `centelha` em `combatentes` (caminho (a)) tem
de ser uma migração NOVA. **O próximo número livre é `supabase/migracao-41.sql`** (conferido:
`migracao-40.sql` é o maior número existente).

**I.1 (fórmula)**: já confirmada nas rodadas anteriores e de novo agora, `-ceil(pv_max/2)` bate
com `limiteDaMorte(pvMax, null)` para os PV testados. Ponto que falta cobrir na 41: quando a
coluna `centelha` existir e tiver um valor conhecido (não nulo), a conta muda de `ceil` para
`floor` quando `centelha == 0` (hoje a 40 sempre usa `ceil`, porque a Centelha é sempre
"desconhecida" para o banco). A 41 precisa dos dois ramos.

**I.2 (RPCs que dependem de Centelha)**: varri as `create function` de todas as migrações 2-40.
Só **`jogador_dano`** calcula algo que depende de Centelha (o limite de morte). Conferi
`jogador_conjura` (a versão final, `migracao-39.sql`): insere `dano_dados`/`dano_bonus` que
chegam PRONTOS do cliente, sem calcular nada. Nenhuma outra RPC (`jogador_mover`,
`jogador_muda_peca`, `jogador_invoca`, `jogador_registra`, `jogador_declara`) toca dano, raspão
ou Absorção. **O servidor só aplica valores que chegam prontos do cliente**, com a única exceção
sendo o próprio limite de morte.

**I.3 (quem escreve a coluna)**: não decidido pela rodada (correto, é a próxima). Aponto para a
Executora-3: a Centelha de uma peça já é conhecida no CLIENTE no momento em que ela entra no
tabuleiro (`PERFIL[cid]?.centelha`, `grid.astro`), então o candidato natural é escrever a coluna
no mesmo INSERT que já cria a linha em `combatentes` (não uma segunda chamada). Peças existentes:
`NULL` por padrão preserva o comportamento de hoje (Centelha desconhecida, ramo generoso); não há
como popular retroativamente por SQL puro (a Centelha mora em JSON estático de ficha/bestiário,
fora do banco).

**I.4 (RLS)**: achado relevante. A tabela `combatentes` já tem `SELECT` restrito ao Mestre
(`comb_select`, `migracao-14.sql`); o jogador lê pela view `combate_visao`, que já tem um padrão
de ocultar coluna por coluna conforme quem está olhando (`energia_atual`/`mana_atual` só aparecem
se `m1.meu` ou `v.en_colega`/`v.stats`). **Uma coluna `centelha` crua na view, sem essa mesma
lógica condicional, vazaria a Centelha do alvo para quem ataca**, o problema de privacidade que a
opção (b) do `migracao-40.sql` já tinha identificado para o PARÂMETRO, e ele se aplica igual à
COLUNA se a view não filtrar. A migração 41 precisa incluir a mudança na view, não só na tabela.

**I.5 (idempotência/reversão)**: `alter table ... add column if not exists` é idempotente. Reversão:
como o corpo de `jogador_dano` (se atualizado para ler a coluna) passaria a depender dela,
restaurar o corpo da função (a versão da migração 40, sem o `join`/leitura da coluna) TEM de vir
ANTES de derrubar a coluna (`drop column`), porque PL/pgSQL não impede compilar uma função contra
uma coluna que já sumiu até ela rodar, mas falharia em tempo de execução.

**I.6 (lista para a 41, ordem de aplicação)**: (1) `alter table combatentes add column if not
exists centelha smallint;` (2) escrever a coluna nos pontos de inserção de peça (jogador/mestre
criam a peça) e quando a Centelha da ficha muda; (3) atualizar `combate_visao` com a mesma lógica
condicional de `energia`/`mana`; (4) reescrever `jogador_dano` para ler `centelha` da linha
(`floor` quando 0, `ceil` quando >0 ou nulo, preservando o comportamento de hoje para linhas
antigas sem valor); (5) o carimbo (`gen-carimbo-migracoes.mjs`). Não escrevi o SQL final, como
pedido.

## É seguro dar `/clear`

Sim. O veredito está commitado e publicado, `validate`/`tsc`/`build`/`espelho` verdes nesta
árvore, CI completo do GitHub verde em `069d745e`. A seção I está pronta para virar pedido à
Executora-3 sem mais trabalho meu.
