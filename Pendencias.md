# Pendências do Centelha · mapa geral

> Foto de **2026-08-09**. Índice único de tudo que está aberto, em todas as frentes.
> Cada item diz **o que falta**, **onde mora o detalhe** e **o que ele trava**. Quando um item
> fecha, marque a caixa e registre a decisão no doc da frente, que é a fonte de verdade.
>
> **Código:** cada item tem uma sigla estável (A1, B2, …) para chamar pelo nome na conversa.
> **[DECIDIR]** = precisa da sua palavra, não dá para adivinhar.
> **[FAZER]** = já decidido, é trabalho de execução.
> **[AUTOR]** = frente de escrita sua, não minha.

**Placar:** 41 itens abertos · 19 [DECIDIR] · 18 [FAZER] · 4 [AUTOR]

---

## A. Arcano · As Artes

Detalhe em `Arcano_revisao.md` §10. O que já está fechado está no site (`/artes/regras`,
`/artes/efeitos`, `/artes/catalogo`) e em `regras.json → arcano`.

- [ ] **A1 · [DECIDIR] Guardar um feitiço: os limites.** A regra base está no site (paga o Mana na
  hora, Raciocínio conta um nível abaixo e −1d6 nas rolagens enquanto carrega). Falta: a penalidade
  **acumula** por feitiço guardado? Há **teto** de quantos dá para carregar? O feitiço guardado
  **vence** com o tempo?
- [ ] **A2 · [DECIDIR] Focos das Artes não elementais.** As sete rascunhadas estão no site. Falta
  dizer quais outras Artes ganham foco e, principalmente, **como se mede a abundância** de um foco
  que não é elemento (um baralho de tarô não tem volume como um rio tem).
- [ ] **A3 · [DECIDIR] O desconto da fonte pode passar de +1?** Hoje é fixo. Fica registrado que
  lugar sagrado do elemento, estação do ano ou um pacto poderiam aumentá-lo.
- [ ] **A4 · [DECIDIR] Rituais.** Ritual já é o modo lento de conjurar (troca Mana por tempo e
  Vontade). Falta: a regra antiga de "metade do Mana no Ritual" **morre de vez**? Existe **algum
  Efeito que só funciona no modo lento** (o círculo de invocação, por exemplo)?
- [ ] **A5 · [DECIDIR] Clarão Cegante.** Ficou **sem Dificuldade** por ora: quem está na área e
  olhando sofre a Penalidade, sem rolagem. Confirmar assim ou dar uma resistência.
- [ ] **A6 · [DECIDIR] O campo `escalonavel`.** Órfão desde que os níveis dos Efeitos viraram
  fixos. Ou vira `sucede` (comprar a Fenda por cima do Terremoto pagando a diferença), ou some do
  schema.
- [ ] **A7 · [AUTOR] Treze Efeitos elementais ainda sem número**, e **Fogo, Raio e Luz não têm nada
  de nível 1**. Sua frente de revisão dos elementais.
- [ ] **A8 · [FAZER] Revisar em mesa a primeira leva** dos Efeitos das Artes não elementais: os
  números e os limites saíram no papel e não passaram por jogo.
- [ ] **A9 · [FAZER] O Efeito Especial no bestiário.** Na ficha ele já tem lugar; falta decidir
  como uma criatura carrega Efeitos no stat block.
- [ ] **A10 · [FAZER] Abertura do capítulo para iniciante.** As seções 2 a 4 do `Arcano_revisao.md`
  (o que a feitiçaria é) ainda não viraram prosa no site.
- [ ] **A11 · [FAZER] Revisar as seções 3 e 4 do `Arcano_revisao.md`** quando a rolagem por Tradição
  fechar (C1): hoje elas ainda dizem "Ocultismo + Atributo".
- [ ] **A12 · [ENGAVETADO] Arte Metal.** Desenho pronto e guardado (afia, enferruja, aquece a
  armadura no corpo, arranca a arma da mão, reduz Absorção). É só retomar quando quiser.

## B. Bestiário

- [ ] **B1 · [FAZER] Preencher `fraquezas` e `resistencias` nas 308 criaturas.** Destravado: a regra
  fechou (metade do dano arredondando para cima, **depois** da armadura e **antes** da Absorção
  natural). O grosso sai por regra (Morto-vivo e Corruptor recebem luz e sagrado, Planta recebe
  fogo, Elemental e Construto saem pelo material) e depois se curam as exceções à mão. São 32
  Corruptores e 15 Mortos-vivos. **É o maior item pronto para executar da lista inteira.**
- [ ] **B2 · [FAZER] Modificadores de Defesa por porte.** Criatura não média não tem ajuste de
  Defesa hoje; o porte já mexe em PV e Absorção, falta a esquiva.
- [ ] **B3 · [FAZER] Rebalancear os brutos grandes.** O pool de ataque deles está acima da régua da
  Centelha (registrado em `Proezas_revisao.md` e `REVISAR.md`).

## C. Trilhas de Feitiçaria

Detalhe em `Trilhas_Feiticaria.md` §6. As seis Tradições já estão descritas no site.

- [ ] **C1 · [DECIDIR] Jogadas das Artes, casos de fronteira.** O esquema **Mirado** (Acerto Arcano
  + Percepção ou Destreza) contra **Moldado** (perícia da Tradição) está proposto e não batido.
  Falta o martelo nos híbridos (recomendo uma rolagem só). **Trava A11.**
- [ ] **C2 · [DECIDIR] A perícia de conjuração de cada Tradição.** A tabela está proposta e precisa
  de aval. A **Iniciação** provavelmente pede um traço de **Fé/Devoção** que não existe: criar?
- [ ] **C3 · [FAZER] O mapa Arte × Trilha.** Só existe um exemplo (Terra). O catálogo das 24 Artes
  é frente própria, do tamanho do bestiário, com os números de treino junto.
- [ ] **C4 · [FAZER] Portar `trilhas.json`** quando a mecânica fechar, e revisar o mortal-tocado
  (Bram é Erudição).

## D. Proezas e Técnicas

Detalhe em `Proezas_revisao.md`.

- [ ] **D1 · [FAZER] Fase 3 da migração.** Matar a **banda** de vez (Velocidade independente por nível,
  apagar o campo `banda` e tirar do schema) e **surfar o modificador da trilha na UI**, mostrando o
  valor ao lado da Técnica.
- [ ] **D2 · [DECIDIR] Números por Técnica contra a régua.** O texto de cada Técnica ainda traz o
  número antigo ("+2 em Furtividade") enquanto a régua diz nível×3. Reconciliar o texto, ou surfar a
  trilha e deixar o texto como sabor.
- [ ] **D3 · [DECIDIR] Densidade dos funis.** Caminhos reaproveitados têm ~3 Técnicas no nível 1
  (funil 3·2·1·1·1), mais enxuto que o padrão de Força. Alargar ou aceitar.
- [ ] **D4 · [FAZER] Retag de `tecnicas.json` pelo roteamento Social x Mental.** A auditoria do
  `Ataques_Mentais.md` §4 diz que só **Comando** e **Marionete** deveriam citar Defesa Mental; no
  dado vivo **15 Técnicas** ainda citam (Aterrorizar, Quebrar o Espírito, Palavra de Lei, Fios
  Invisíveis, Titereiro e companhia). **O doc está à frente do dado.**
- [ ] **D5 · [FAZER] Reorg de conteúdo.** As árvores novas do doc (Atlas reorganizado, Força de
  Guerra, Presença Aterradora, Arremesso, Salto, Vigarista/Confessor, as novas de Perspicácia) ainda
  não entraram na data viva.
- [ ] **D6 · [DECIDIR] Custo de Técnica e de Arte em ×10.** Ficou de fora da recalibração de XP de
  propósito (largura segue sendo o gasto caro). Confirmar que fica.

## E. Social, Mental e Antecedentes

- [ ] **E1 · [FAZER] Portar `Antecedentes.md` ao site.** 14 Antecedentes escritos, escala 1 a 6,
  XP ×3, Únicos e Nomeados, tetos de criação. Falta capítulo, `antecedentes.json` e lugar na ficha.
  Nada disso existe no site hoje.
- [ ] **E2 · [FAZER] Portar `Ataques_Mentais.md` ao site.** A Defesa Mental já está no motor e no
  bestiário; o capítulo (as três camadas, a duração dos efeitos, a inimizade ao despertar) não.
- [ ] **E3 · [DECIDIR] Banda neutra da Régua de Relação: 5 ou 3?** Hoje é 5 (rompe o Neutro em 3
  passos). A de 3 faz a régua andar mais rápido. Junto vai a alternativa do decaimento: rumo à
  baseline do par, como está, ou rumo ao neutro mais próximo.

## F. Lore

Detalhe em `lore/Lore_Centelha.md` §7 e §8. Nada de lore foi ao site ainda.

- [ ] **F1 · [DECIDIR] Como os deuses romperam a Lei** na Grande Guerra (avatares? campeões? uma
  brecha?) e por que romper foi em si destrutivo. E se **alguém hoje sabe ou suspeita** que a Lei
  existe.
- [ ] **F2 · [DECIDIR] Quem impôs a Lei.** A proposta é o próprio cosmos, a Primeira Luz reagindo ao
  ser agarrada, sem entidade legisladora. Confirmar.
- [ ] **F3 · [DECIDIR] Mecânica de clérigo, paladino e monge** (poder divino via Centelha e campo de
  crença). Fecha junto com as Trilhas: clérigo e paladino são **Iniciação**, monge é **Marcial**.
- [ ] **F4 · [DECIDIR] Os planetas.** Quais importam, quais são habitados, quais são alcançáveis, e
  o que sobrou da fase interplanetária.
- [ ] **F5 · [AUTOR] Nomes próprios.** Faltam: as massas de terra sem rótulo, as cidades de Calin e
  as escondidas de Mére, o resto de Uldun, o reino feérico élfico, os planos (incluindo o da Fenda),
  as eras, os primeiros deuses e as ortodoxias rivais com seu cisma.
- [ ] **F6 · [AUTOR] Deuses locais e espíritos de lugar** por cidade e região, casando com as
  cidades que você está escrevendo.

## G. Ações & Sistema

Frente aberta em **2026-08-09**. Dois documentos: `Acoes_Sistema.md` é o **rascunho do capítulo**
(régua comum, jogada sugerida, fichas prontas) e `Acoes_Catalogo.md` é a **bancada** (o que cada
ação é, sem número, com as referências de Exalted, D&D 3.5/5e, Pathfinder 1/2, Cyberpunk RED,
Chronicles of Darkness, GURPS, Blades in the Dark, Burning Wheel e Ars Magica). Modelo do
capítulo: **Drama and Systems** do Exalted 2ª edição. Nada disso existe no site: hoje o sistema
só tem número para o que acontece **dentro** do combate, e toda ação fora dele é improviso.

- [ ] **G1 · [FAZER] O capítulo de Ações & Sistema.** Catálogo montado em oito famílias
  (movimento e corpo, resistir, percepção e mente, furtividade e subterfúgio, sociais, construção
  e ofício, mundo e viagem, fé e sobrenatural), com descrição e referências em `Acoes_Catalogo.md`
  e jogada sugerida em `Acoes_Sistema.md` §4. **Arremesso** já está preenchido (§5.1).
- [ ] **G2 · [DECIDIR] As decisões estruturais** (`Acoes_Catalogo.md` §1). **Quatro das sete já
  fecharam em 2026-08-09** e estão escritas em `Acoes_Sistema.md` §3: os **cinco modos de ação**
  (Direta, Acumulada, Longa, Reflexiva, Passiva), a **origem da Dificuldade** (tabela de âncoras,
  a tarefa e não o pool de quem tenta), o papel da **Margem** (níveis de expertise excedente, não
  escolha de Dificuldade) e a **circunstância** (±2/±4, que já era lei). Faltam três: o **piso da
  jogada**, **ajuda e ação em grupo**, e **o que acontece na falha** fora da Acumulada.
  **Trava G1 e G3.**
- [ ] **G3 · [FAZER] Construção e ofício** (`Acoes_Catalogo.md` §7). Não é uma ficha, é um
  subsistema pequeno, com oito perguntas próprias listadas no doc. É o maior vazio do sistema:
  um jogador com Ferraria 5 não sabe quanto tempo leva para fazer uma espada nem o que sai dela.
  Destrava também o **ajuste de peça** que a ficha já oferece (uma Espada Longa Ótima) sem dizer
  como se chega a ela.
- [ ] **G4 · [FAZER] As cinco físicas de toda sessão:** Escalar, Nadar, Cair, Feito de força e
  Esgueirar-se. Feito de força está meio pronto: o FAH já dá o peso máximo, falta a tabela de
  "com esse FAH você arromba o quê", nos moldes da tabela de proezas do Exalted.
- [ ] **G5 · [DECIDIR] Uma escada de exaustão única?** Vale para veneno, doença, ambiente,
  sufocamento e privação de sono de uma vez, e é por isso que a família **Resistir** se decide em
  bloco e não ficha a ficha. O modelo mais limpo é o de níveis de exaustão do D&D 5e.
- [ ] **G6 · [DECIDIR] Percepção passiva ou rolada?** Pré-requisito de Esgueirar-se, Disfarce,
  Roubo e Emboscada. Rolar na mesa entrega a resposta pelo próprio ato de rolar.
- [ ] **G7 · [DECIDIR] Capítulo único ou distribuído?** A alternativa é jogar cada família no
  capítulo que já existe (movimento em Combate, resistir em Vida & Ferimentos, social em
  Relações). A aposta atual é capítulo único, porque a régua comum precisa de um lugar só.

---

## Ordem sugerida

1. **B1**, fraquezas e resistências do bestiário: único item grande 100% destravado, execução pura.
2. **E1**, Antecedentes ao site: o doc está fechado, o trabalho é portar.
3. **C1**, as jogadas das Artes: é a decisão que destrava mais coisa depois dela (A11, C2, C3, F3).
4. **D4**, o retag das Técnicas: conserta uma divergência entre doc e dado vivo que já existe hoje.
5. **G2 → G3**, as decisões estruturais das ações e depois a construção: é a única frente que
   cobre um vazio em vez de corrigir algo existente, e a construção é o maior vazio isolado do
   sistema.
