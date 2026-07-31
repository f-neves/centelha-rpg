# Pendências do Centelha · mapa geral

> Foto de **2026-07-31**. Este é o índice de tudo que está aberto, em todas as frentes.
> Cada item diz **o que falta**, **onde mora o detalhe** e **o que ele trava**. Quando um item
> fecha, ele sai daqui e a decisão fica registrada no doc da frente (que é a fonte de verdade).
>
> **[DECIDIR]** = precisa da sua palavra, não dá para adivinhar.
> **[FAZER]** = já decidido, é trabalho de execução.
> **[AUTOR]** = frente de escrita sua, não minha.

---

## 1. Arcano · As Artes

Detalhe em `Arcano_revisao.md` §10. O que já está fechado está no site (`/artes/regras`,
`/artes/efeitos`, `/artes/catalogo`) e em `regras.json → arcano`.

- **[DECIDIR] Guardar um feitiço: os limites.** A regra base está no site (paga o Mana na hora,
  Raciocínio conta um nível abaixo e −1d6 nas rolagens enquanto carrega). Falta: a penalidade
  **acumula** por feitiço guardado? Há **teto** de quantos dá para carregar? O feitiço guardado
  **vence** com o tempo?
- **[DECIDIR] Focos das Artes não elementais.** As sete rascunhadas estão no site. Falta dizer
  quais outras Artes ganham foco e, principalmente, **como se mede a abundância** de um foco que
  não é elemento (um baralho de tarô não tem volume como um rio tem).
- **[DECIDIR] O desconto da fonte pode passar de +1?** Hoje é fixo. Fica registrado que lugar
  sagrado do elemento, estação do ano ou um pacto poderiam aumentá-lo.
- **[DECIDIR] Rituais.** Ritual já é o modo lento de conjurar (troca Mana por tempo e Vontade).
  Falta: a regra antiga de "metade do Mana no Ritual" **morre de vez**? Existe **algum Efeito que
  só funciona no modo lento** (o círculo de invocação, por exemplo)?
- **[DECIDIR] Clarão Cegante.** Ficou **sem Dificuldade** por ora: quem está na área e olhando
  sofre a Penalidade, sem rolagem. Confirmar assim ou dar uma resistência.
- **[DECIDIR] O campo `escalonavel`.** Órfão desde que os níveis dos Efeitos viraram fixos. Ou
  vira `sucede` (comprar a Fenda por cima do Terremoto pagando a diferença), ou some do schema.
- **[AUTOR] Treze Efeitos elementais ainda sem número**, e **Fogo, Raio e Luz não têm nada de
  nível 1**. É a sua frente de revisão dos elementais.
- **[FAZER] Revisar em mesa a primeira leva** dos Efeitos das Artes não elementais: os números e
  os limites saíram no papel e não passaram por jogo.
- **[FAZER] O Efeito Especial no bestiário.** Na ficha ele já tem lugar; falta decidir como uma
  criatura carrega Efeitos no stat block.
- **[FAZER] Abertura do capítulo para iniciante.** As seções 2 a 4 do `Arcano_revisao.md` (o que
  a feitiçaria é) ainda não viraram prosa no site.
- **[FAZER] Revisar as seções 3 e 4 do `Arcano_revisao.md`** quando a rolagem por Tradição fechar:
  hoje elas ainda dizem "Ocultismo + Atributo".
- **[ENGAVETADO] Arte Metal.** Desenho pronto e guardado (afia, enferruja, aquece a armadura no
  corpo, arranca a arma da mão, reduz Absorção). É só retomar quando quiser.

## 2. Bestiário

- **[FAZER] Preencher `fraquezas` e `resistencias` nas 308 criaturas.** Destravado: a regra da
  resistência fechou (metade do dano arredondando para cima, **depois** da armadura e **antes** da
  Absorção natural). O grosso sai por regra (Morto-vivo e Corruptor recebem luz e sagrado, Planta
  recebe fogo, Elemental e Construto saem pelo material) e depois se curam as exceções à mão. São
  32 Corruptores e 15 Mortos-vivos. **Este é o maior item pronto para executar da lista.**
- **[FAZER] Modificadores de Defesa por porte.** Criatura não média não tem ajuste de Defesa hoje;
  o porte já mexe em PV e Absorção, falta a esquiva.
- **[FAZER] Rebalancear os brutos grandes.** O pool de ataque deles está acima da régua da
  Centelha (registrado em `Proezas_revisao.md` e `REVISAR.md`).

## 3. Trilhas de Feitiçaria

Detalhe em `Trilhas_Feiticaria.md` §6. As seis Tradições já estão descritas no site.

- **[DECIDIR] Jogadas das Artes, casos de fronteira.** O esquema **Mirado** (Acerto Arcano +
  Percepção ou Destreza) contra **Moldado** (perícia da Tradição) está proposto e não batido.
  Falta o martelo nos híbridos (recomendo uma rolagem só). **Trava** a revisão das seções 3 e 4 do
  Arcano.
- **[DECIDIR] A perícia de conjuração de cada Tradição.** A tabela está proposta e precisa de
  aval. A **Iniciação** provavelmente pede um traço de **Fé/Devoção** que não existe: criar?
- **[FAZER] O mapa Arte × Trilha.** Só existe um exemplo (Terra). O catálogo das 24 Artes é frente
  própria, do tamanho do bestiário, com os números de treino junto.
- **[FAZER] Portar `trilhas.json`** quando a mecânica fechar, e revisar o mortal-tocado (Bram é
  Erudição).

## 4. Proezas e Técnicas

Detalhe em `Proezas_revisao.md`.

- **[FAZER] Fase 3 da migração.** Matar a **banda** de vez (Speed independente por nível, apagar o
  campo `banda` e tirar do schema) e **surfar o modificador da trilha na UI**, mostrando o valor
  ao lado da Técnica.
- **[DECIDIR] Números por Técnica contra a régua.** O texto de cada Técnica ainda traz o número
  antigo ("+2 em Furtividade") enquanto a régua diz nível×3. Reconciliar o texto, ou surfar a
  trilha e deixar o texto como sabor.
- **[DECIDIR] Densidade dos funis.** Caminhos reaproveitados têm ~3 Técnicas no nível 1 (funil
  3·2·1·1·1), mais enxuto que o padrão de Força. Alargar ou aceitar.
- **[FAZER] Retag de `tecnicas.json` pelo roteamento Social x Mental.** A auditoria do
  `Ataques_Mentais.md` §4 diz que só **Comando** e **Marionete** deveriam citar Defesa Mental; no
  dado vivo **15 Técnicas** ainda citam (Aterrorizar, Quebrar o Espírito, Palavra de Lei, Fios
  Invisíveis, Titereiro e companhia). O doc está à frente do dado.
- **[FAZER] Reorg de conteúdo.** As árvores novas do doc (Atlas reorganizado, Força de Guerra,
  Presença Aterradora, Arremesso, Salto, Vigarista/Confessor, as novas de Perspicácia) ainda não
  entraram na data viva.
- **[DECIDIR] Custo de Técnica e de Arte em ×10.** Ficou de fora da recalibração de XP de propósito
  (largura segue sendo o gasto caro). Confirmar que fica.

## 5. Social, Mental e Antecedentes

- **[FAZER] Portar `Antecedentes.md` ao site.** 14 Antecedentes escritos, escala 1 a 6, XP ×3,
  Únicos e Nomeados, tetos de criação. Falta capítulo, `antecedentes.json` e lugar na ficha. Nada
  disso existe no site hoje.
- **[FAZER] Portar `Ataques_Mentais.md` ao site.** A Defesa Mental já está no motor e no bestiário;
  o capítulo (as três camadas, a duração dos efeitos, a inimizade ao despertar) não.
- **[DECIDIR] Banda neutra da Régua de Relação: 5 ou 3?** Hoje é 5 (rompe o Neutro em 3 passos).
  A alternativa de 3 deixa a régua andar mais rápido. Igual para a alternativa do decaimento
  (rumo à baseline do par, como está, ou rumo ao neutro mais próximo).

## 6. Lore

Detalhe em `lore/Lore_Centelha.md` §7 e §8. Nada de lore foi ao site ainda.

- **[DECIDIR] Como os deuses romperam a Lei** na Grande Guerra (avatares? campeões? uma brecha?) e
  por que romper foi em si destrutivo. E se **alguém hoje sabe ou suspeita** que a Lei existe.
- **[DECIDIR] Quem impôs a Lei.** A proposta é o próprio cosmos, a Primeira Luz reagindo ao ser
  agarrada, sem entidade legisladora. Confirmar.
- **[DECIDIR] Mecânica de clérigo, paladino e monge** (poder divino via Centelha e campo de
  crença). Fecha junto com as Trilhas: clérigo e paladino são **Iniciação**, monge é **Marcial**.
- **[DECIDIR] Os planetas.** Quais importam, quais são habitados, quais são alcançáveis, e o que
  sobrou da fase interplanetária.
- **[AUTOR] Nomes próprios.** Faltam: as massas de terra sem rótulo, as cidades de Calin e as
  escondidas de Mére, o resto de Uldun, o reino feérico élfico, os planos (incluindo o da Fenda),
  as eras, os primeiros deuses e as ortodoxias rivais com seu cisma.

---

## O que eu pegaria primeiro

1. **Fraquezas e resistências do bestiário** (item 2.1): é o único item grande que está 100%
   destravado e é execução pura.
2. **Antecedentes ao site** (item 5.1): o doc está fechado, o trabalho é portar.
3. **As jogadas das Artes** (item 3.1): é a decisão que destrava mais coisa depois dela.
