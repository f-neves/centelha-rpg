# Catálogo de alavancas das Proezas

Levantamento só leitura, 27/09/2026. Uma "alavanca" é uma regra do sistema que uma Proeza pode
melhorar, na ideia registrada pelo autor: toda Proeza mexe nalguma alavanca, além de permitir
(ou não) um feito sobre-humano qualitativo. O objetivo aqui é catalogar as alavancas e medir o
que já se sabe sobre cada uma, para depois decidir em que nível de Centelha ela cabe, inclusive
acima de 6.

Fonte de contagem das Técnicas: `src/data/tecnicas.json`, 461 registros, varrido por um script
Node (campo `efeito` e busca por palavra-chave no campo `texto`; não foi lido um a um). Uma
Técnica pode aparecer em mais de uma alavanca, se o texto dela mexe em mais de uma regra ao mesmo
tempo (ex.: um golpe que soma dano E ignora Absorção).

A trilha 3N (3/4/6/9/12/15, chamada aqui de "Bônus") é a régua mais citada no arquivo
`regras.json`, mas ela cobre várias alavancas de tipos diferentes com a MESMA escala de números;
por isso cada tipo de jogada ganhou sua própria seção abaixo, todas remetendo à mesma fonte de
valor base. O pedido do autor é claro nesse ponto: ataque, Defesa e quantidade têm réguas de
poder PRÓPRIAS, ainda não medidas; este documento só descreve a alavanca e o número que ela usa
hoje, sem propor onde ela deveria caber.

Nunca uso travessão neste documento; no lugar, vírgula, dois-pontos, parênteses, ponto ou
ponto-médio (·). Onde a leitura da regra permite mais de uma interpretação, registro as duas sem
escolher.

## 1. Bônus a jogada contra Dificuldade (genérico) · `bonus-dificuldade`

1. Unidade: pontos somados à rolagem (Atributo + Habilidade) antes de comparar com a Dificuldade.
2. Valor base e fonte: trilha "Bônus" por nível de Proeza, +3/+4/+6/+9/+12/+15 [`src/data/regras.json:119-126`]. Uso declarado: "Habilidade, ataque, defesa, resistir, disputa, penalidade ao alvo, Iniciativa, redução de Ticks" [`regras.json:127`]. Exemplo real: Mãos Hábeis dá "+3 em Ofícios" no nível 1 [`src/data/tecnicas.json:6084`, id `maos-habeis`], o mesmo valor da trilha.
3. Tipo: jogada contra Dificuldade (Habilidade/perícia, fora de ataque e das três Defesas, que ganharam seção própria abaixo).
4. Tetos e travas: nenhum teto publicado especificamente para este subtipo. O teto de ±6 dos modificadores situacionais [`regras.json:994`, `combateTatico.modificadorCap`] é para Defesa, não para jogada de Habilidade.
5. Técnicas que mexem nisso: da varredura de `efeito: "bonus"` (61 Técnicas no total), a maioria (43) cai neste balde genérico de perícia/ofício/percepção, e não em ataque, Defesa, Iniciativa ou Ticks. Exemplos: `maos-habeis` (+3 Ofícios, nível 1), `inspirar` (+3 nas ações dos aliados que o ouvem, por 6 Ticks) [`tecnicas.json`, busca por `inspirar`], `mira-firme` (+3 ao ataque à distância, gastando uma ação para mirar) [seção 12 abaixo cobre esta como Mira].

## 2. Ataque · `ataque-bonus`

1. Unidade: pontos somados à jogada de acerto.
2. Valor base e fonte: mesma trilha "Bônus" [`regras.json:119-127`], mais o bônus fixo de Centelha ao ataque, +1 por ponto [`regras.json:821-823`, `derivados.ataque.centelhaMult: 1`; e `src/content/chapters/centelha.md:44`]. NOTA: `regras.json:114` (a nota de `escalasProeza`) ainda diz "+2/ponto de Centelha", divergindo do motor e do capítulo; é a pendência D7, aberta [`docs/pendencias/D-proezas-tecnicas.md:33-36`]. Status desta base: EM REVISÃO.
3. Tipo: ataque.
4. Tetos e travas: nenhum teto publicado específico para bônus de Proeza ao ataque (diferente da Defesa reflexiva, que tem teto, seção 4).
5. Técnicas: 3 usam a palavra "ataque"/"acerto" dentro de um efeito de bônus fixo (a busca ampla por "ataque" no texto de qualquer Técnica dá 19, mas a maioria descreve o próprio golpe, não um bônus à rolagem de acerto). Exemplo direto: nenhuma Técnica do catálogo tem `efeito: "bonus"` com uso explícito "+N ao ataque" isolado (o padrão comum é bônus à Defesa, ao dano ou a uma perícia); ver lista (a) ao final.

## 3. Defesa física (passiva) · `defesa-fisica-passiva`

1. Unidade: pontos no valor de Defesa parado (o que a ficha imprime).
2. Valor base e fonte: Defesa = (Destreza × 2) + Centelha × `centelhaMult` (1) + Especialidade situacional [`regras.json:793-799`]. Trilha "Bônus" para o incremento de Proeza [`regras.json:119-126`].
3. Tipo: Defesa física, passiva.
4. Tetos e travas: nenhum teto publicado para bônus PASSIVO e permanente à Defesa por Proeza (diferente do reflexivo, seção 4). A Absorção de Proeza tem teto de empilhamento (seção 6); a Defesa passiva, pela leitura feita aqui, não tem um teto equivalente escrito.
5. Técnicas: `reflexos-de-vento` soma "+3 na Defesa" mas é ativado "após ver um ataque que te visa" [`tecnicas.json`, busca `reflexos-de-vento`], o que a põe mais perto de Defesa REFLEXIVA (seção 4) que passiva; a leitura é ambígua e registro as duas. `pele-de-pedra` soma Absorção, não Defesa. Não achei, na varredura, uma Técnica inequivocamente PASSIVA e permanente que só some à Defesa física sem gatilho: ficam mais no "estado" (ganha uma capacidade) do que no "bonus" fixo passivo.

## 4. Defesa física (reflexiva) · `defesa-fisica-reflexiva`

1. Unidade: pontos somados à Defesa só naquele golpe, em reação.
2. Valor base e fonte: trilha "Bônus" [`regras.json:119-126`]. Exemplo: `reflexos-de-vento`, "+3 na Defesa contra ele" (o ataque visto) [`tecnicas.json`, busca `reflexos-de-vento`, nível 1].
3. Tipo: Defesa física, reflexiva.
4. Tetos e travas: bônus reflexivos de Defesa por Proeza (o próprio texto cita "Aparar, Reflexos de Vento, Voz Calma, +3") CONTAM para o teto de ±6 dos modificadores situacionais de Defesa e não empilham além disso com cobertura, flanco, postura etc. [`regras.json:1244`, `empilhamentoProezas.defesaReflexiva`]. Exceção: penalidade IMPOSTA por Proeza de outro personagem (ex.: o −3 de Quebrar Guarda) fica FORA desse teto [`regras.json:1244`].
5. Técnicas: `reflexos-de-vento` (+3, nível 1), `quebrar-guarda` (impõe −3 na Defesa do alvo até a próxima ação dele, é a penalidade que fica fora do teto) [`tecnicas.json`, busca `quebrar-guarda`], `borrao` (−9 a disparos contra o personagem, nível 4) [`tecnicas.json`, busca `borrao`]. `economiaPoderes.reflexivaTicks: 0` e `reflexivaPorGatilho: 1` [`regras.json:1209-1210`] dizem que a ativação reflexiva custa 0 Ticks, mas 1 uso por gatilho.

## 5. Defesa social · `defesa-social-bonus`

1. Unidade: pontos no valor de Defesa Social.
2. Valor base e fonte: (Compostura + Sociabilidade) × 2 + Centelha (fora do ×2) + Especialidade [`regras.json:810-819`]. Feras trocam Sociabilidade por Sobrevivência [`regras.json:811`, B14 fase 2 item C.7].
3. Tipo: Defesa social.
4. Tetos e travas: a Régua de Relação soma/subtrai o nível do vínculo à Defesa Social conforme o ataque social "aquece" ou "esfria" a relação, com teto de ±6 da própria régua [`regras.json:819`]; não é um teto ESPECÍFICO de Proeza, é da régua social em geral.
5. Técnicas: 19 citam "Defesa Social/Sociabilidade/Compostura" no texto, mas a maioria usa esses termos para descrever o QUE A TÉCNICA ATACA (impõe teste de Defesa Social no alvo), não para subir a própria Defesa Social do usuário. Exemplos de ataque à Defesa Social alheia: `encantamento`, `brado-de-guerra` [`tecnicas.json`, buscas pelos ids]. Não encontrei, na varredura, uma Técnica que declare um bônus fixo e numérico à PRÓPRIA Defesa Social (fora do efeito geral "estado" de resistir melhor a manipulação); ver lista (b).

## 6. Defesa mental (passiva e reflexiva) · `defesa-mental-bonus`

1. Unidade: pontos no valor de Defesa Mental, ou pontos subtraídos da do alvo.
2. Valor base e fonte: Raciocínio + Integridade + Força de Vontade + Centelha + Especialidade, soma simples, sem ×2 [`regras.json:801-809`]. As três camadas de defesa mental (a rolagem, o Fôlego mental, a Defesa Mental em si) estão descritas em `Ataques_Mentais.md:73` e seguintes, mas o detalhe fino de cada camada não foi conferido linha a linha nesta rodada.
3. Tipo: Defesa mental, passiva (o valor parado) e ativa por imposição (algumas Técnicas BAIXAM a Defesa Mental do alvo em vez de a rolagem contra ela).
4. Tetos e travas: nenhum teto publicado específico para bônus de Proeza à Defesa Mental, além do teto genérico de ±6 dos modificadores situacionais [`regras.json:994`], se a leitura da mesa considerar esse bônus "situacional".
5. Técnicas: 15 citam "Defesa Mental/Integridade" no texto. `tom-de-autoridade` é o caso citado pela própria pendência D4 do repositório: BAIXA a Defesa Mental do alvo em 3, em vez de rolar contra ela [`docs/pendencias/D-proezas-tecnicas.md:15-19`, citando `tecnicas.json`]. As 15 Técnicas que citam Defesa Mental estão concentradas nos Caminhos Comando (9) e Marionete (6) [mesma fonte].

## 7. Dano · `dano-bonus`

1. Unidade: dados de dano adicionais (d6).
2. Valor base e fonte: trilha "Dano" por nível de Proeza, +1d6/+1d6/+2d6/+3d6/+4d6/+6d6 [`regras.json:143-153`]. Exemplo real: `golpe-pesado`, "+1d6 de dano" em ataques de Força corpo a corpo, nível 1 [`tecnicas.json`, busca `golpe-pesado`]; `golpe-do-tita`, "+3d6 de dano num único golpe colossal", nível 4 [mesma fonte], que bate com a trilha (nível 4 = +3d6).
3. Tipo: dano.
4. Tetos e travas: nenhum teto de empilhamento publicado especificamente para bônus de dano de Proeza (diferente da Absorção, seção 8, que tem regra de não somar entre passivas). A regra de combo geral [`regras.json:1226-1230`] encarece empilhar várias Técnicas suplementares na MESMA ação (sobretaxa de Energia crescente), o que afeta indiretamente somar vários bônus de dano na mesma ação.
5. Técnicas: `efeito: "dano"` tem 10 registros no catálogo. Exemplos: `golpe-pesado` (+1d6, nível 1), `bote-silencioso` (+2d6 contra alvo desavisado, nível 3), `golpe-do-tita` (+3d6, nível 4).

## 8. Absorção por tipo (Impacto, Corte, Perfuração) · `absorcao-bonus`

1. Unidade: pontos de Absorção, por tipo de dano ou "todos os tipos".
2. Valor base e fonte: trilha "Absorção" por nível, +2/+3/+4/+6/+9/+12 [`regras.json:129-140`]. Exemplo de armadura real para escala: Malha completa dá Absorção Corte 8, Impacto 2, Perfuração 1, penalidade 3 [`src/data/armaduras.json`, entrada `malha-completa`]. Absorção natural: Vigor no Impacto, zero em Corte/Perfuração, mais 1 de Centelha em qualquer tipo [`regras.json:904-905, 932-937`, `centelhaNoSoak: 1`].
3. Tipo: Absorção por tipo de dano.
4. Tetos e travas: Absorção PERMANENTE de Proezas NÃO soma entre passivas, vale a MAIOR de cada tipo; bônus reflexivos ou ativos (ex.: Tensionar) entram por cima, só naquele golpe ou cena; soma normalmente com armadura e com a natural [`regras.json:1243`, `empilhamentoProezas.absorcao`].
5. Técnicas: `efeito: "soak"` tem 4 registros. `pele-curtida` (+2 de Absorção contra Impacto, nível 1), `tensionar` (+2 de Absorção só ao ser atingido, reflexivo), `pele-de-pedra` (+4 de Absorção em todos os tipos e reduz penalidade de ferimento em 1, nível 3).

## 9. Ignorar Absorção por tipo (Penetração) · `penetracao`

1. Unidade: pontos de Absorção ignorados, ou "toda a armadura"/"armadura + Absorção natural".
2. Valor base e fonte: trilha "Penetração" por nível, 2/3/4/6/toda a armadura/armadura + Absorção natural [`regras.json:155-166`]. Exemplo: `esmagar` ignora 4 de Absorção de Impacto da armadura do alvo, nível 3 [`tecnicas.json`, busca `esmagar`], batendo com a trilha (nível 3 = 4).
3. Tipo: ignorar Absorção por tipo.
4. Tetos e travas: "bypassArmadura" (ignorar a Absorção de armadura, ex. Punho que Parte Pedra, Esmagar) afeta só a parte da ARMADURA; a Absorção natural do alvo (Vigor no Impacto, Centelha) continua valendo [`regras.json:1246`].
5. Técnicas: `efeito: "penetracao"` tem 4 registros. `esmagar` (ignora 4 de Impacto, nível 3), `punho-que-parte-pedra` (ignora 6 de armaduras mundanas, nível 4), `tiro-perfurante` (+4 de Penetração e +1d6 de dano num disparo cuidadoso, nível 3).

## 10. Penalidade de armadura · `penalidade-armadura`

1. Unidade: pontos de penalidade reduzidos ou anulados.
2. Valor base e fonte: penalidade única por armadura, leve −1, média −2, pesada −3 (pode variar por peça); incide em qualquer ação física, dobra em Furtividade [`regras.json:981-987`]. No Deslocamento e Saltos usa-se metade da penalidade [`regras.json:987`].
3. Tipo: penalidade de armadura.
4. Tetos e travas: nenhum teto publicado, porque NÃO existe hoje nenhuma Técnica que mexa nesta alavanca (ver lista a).
5. Técnicas: 0. Nenhum resultado na varredura por "Penalidade de Armadura" ou variações no texto de `tecnicas.json`.

## 11. Ticks de preparação e de recuperação · `ticks-preparo-recuperacao`

1. Unidade: Ticks (≈ 1 segundo cada) ganhos ou reduzidos.
2. Valor base e fonte: o sistema Preparo/Golpe/Recuperação e a redução por dado de Iniciativa estão descritos em `Combate_Tempo.md` (ex. "Preparo −2, cada Tick de Golpe −4, Recuperação −2", linha 1096), mas a leitura fina desse documento não foi refeita nesta rodada; cito o achado por busca, sem conferir cada número. Exemplo de Proeza: `passo-veloz`, "o 1º deslocamento da cena, ou sacar/empunhar uma arma, custa −2 Ticks (mín. 1)" [`tecnicas.json`, busca `passo-veloz`, nível 1]; `tiro-rapido`, "saca e dispara num só gesto (reduz os Ticks do disparo)" [mesma fonte, nível 1, sem número explícito, efeito "estado"].
3. Tipo: Ticks de preparação e Ticks de recuperação.
4. Tetos e travas: nenhum teto publicado especificamente para redução de Ticks por Proeza.
5. Técnicas: 21 citam "Tick" no texto (contagem ampla, inclui duração e não só redução de Ticks de ação). Exemplos de redução direta: `passo-veloz` (−2 Ticks, mín. 1), `borrao` ("cruza um campo de batalha num único Tick", nível 4). Vários dos 21 são efeitos de DURAÇÃO ("por 6 Ticks"), não de redução de Ticks de ação; ver seção 20 (Duração).

## 12. Mira · `mira`

1. Unidade: pontos ao ataque, ou concessões de acerto (ignora cobertura, distância).
2. Valor base e fonte: modificador situacional "Mirar", −2 à Defesa do alvo (mais fácil de acertar), gastando uma ação para preparar o golpe [`regras.json:1027-1031`]. Exemplo de Proeza: `mira-firme`, "gastando uma ação para mirar, +3 ao ataque à distância" [`tecnicas.json`, busca `mira-firme`, efeito `bonus`, nível 1].
3. Tipo: mira (um subtipo do ataque à distância).
4. Tetos e travas: nenhum teto publicado específico para Mira de Proeza, além do teto genérico de ±6 se a mesa tratar como modificador situacional [`regras.json:994`].
5. Técnicas: `mira-firme` (+3 ao ataque, nível 1), `tiro-impossivel` ("acerta a distâncias extremas, contorna cobertura parcial", efeito estado), `tiro-certeiro` (mira num ponto fraco, +1d6 de dano e +1 de Penetração). As duas últimas são "estado" (qualitativo), não bônus numérico fixo à Mira em si.

## 13. Iniciativa e reação · `iniciativa-reacao`

1. Unidade: pontos somados à rolagem de Iniciativa (1d6 + Raciocínio + Prontidão), ou Ticks de adiantamento na entrada.
2. Valor base e fonte: fórmula de Iniciativa e a régua de atraso por degrau [`regras.json:848-860`].
3. Tipo: iniciativa e reação.
4. Tetos e travas: nenhum teto publicado específico para bônus de Proeza à Iniciativa.
5. Técnicas: 3 citam Iniciativa/Prontidão diretamente: `reflexos-premonitorios`, `vigilancia`, `mente-rapida` [`tecnicas.json`, buscas pelos ids]. Não confirmei se algum desses é um bônus FIXO à rolagem de Iniciativa ou uma capacidade qualitativa (agir antes em certas condições); a leitura ficou ambígua e registro as duas possibilidades.

## 14. Ação extra · `acao-extra`

1. Unidade: uma ação ou ataque adicional na linha de Ticks.
2. Valor base e fonte: `ataque-relampago`, "1× a cada 6 Ticks, faça um ataque extra a custo de Ticks reduzido", nível 5 [`tecnicas.json`, busca `ataque-relampago`]; `velocidade-divina`, "aja uma vez extra na linha de Ticks neste intervalo", nível 6 [mesma fonte].
3. Tipo: ação extra.
4. Tetos e travas: efeitos que concedem ação ou ataque EXTRA não acumulam: no máximo UMA ação extra a cada 6 Ticks, qualquer que seja a fonte (Proeza ou Arte); combos de "aja de novo" não se somam [`regras.json:1245`, `empilhamentoProezas.acaoExtra`].
5. Técnicas: 1 achado direto na busca ampla por "ação extra/ataque extra/age novo" (`ataque-relampago`); `velocidade-divina` usa "aja uma vez extra" (variação de texto que a busca por "age novo" não pegou, mas é a mesma alavanca).

## 15. Movimento (deslocamento e velocidade) · `movimento-velocidade`

1. Unidade: metros por Tick (deslocamento), ou multiplicador sobre o deslocamento normal.
2. Valor base e fonte: deslocamento normal = 2 + (Destreza + Atletismo) ÷ 4 m/Tick [`regras.json:863`]. Trilha "Velocidade" por nível de Proeza, ×1,5/×1,75/×2/×3/×5/×10 [`regras.json:210-220`]. Exemplo: `escalada-veloz`, "sobe superfícies difíceis em velocidade de corrida (×1,5)", nível 1, batendo com a trilha [`tecnicas.json`, busca `escalada-veloz`].
3. Tipo: movimento.
4. Tetos e travas: nenhum teto publicado específico de empilhamento para Velocidade de Proeza.
5. Técnicas: `efeito: "velocidade"` tem 2 registros (`mil-passos`, ×3, nível 4; `escalada-veloz`, ×1,5, nível 1). A busca ampla por "desloca/velocidade/correr/corrida" no texto dá 9 Técnicas, incluindo `passo-veloz` (redução de Ticks, seção 11) e `corrida-vertical` (correr por paredes, efeito qualitativo).

## 16. Salto · `salto`

1. Unidade: multiplicador sobre distância/altura de salto.
2. Valor base e fonte: trilha "Salto" por nível, ×2/×3/×4/×8/×20/×50 [`regras.json:189-199`]. Exemplo: `salto-do-grilo`, "quadruplica distância/altura de um salto" (×4), nível 3, batendo com a trilha [`tecnicas.json`, busca `salto-do-grilo`].
3. Tipo: salto.
4. Tetos e travas: nenhum teto publicado específico.
5. Técnicas: `efeito: "salto"` tem 2 registros. `salto-do-grilo` (×4, nível 3, também ignora terreno difícil e aterrissa de pé, efeitos qualitativos somados ao multiplicador); `queda-de-gato` (reduz dano de quedas ×2, nível 1, é salto/queda e não exatamente a distância de salto, leitura ambígua entre esta seção e uma futura "queda").

## 17. Carga (erguer, carregar, arremessar peso) · `carga`

1. Unidade: multiplicador sobre a capacidade normal de erguer/carregar/arremessar.
2. Valor base e fonte: trilha "Carga" por nível, ×2/×3/×4/×10/×30/×100 [`regras.json:168-187`], com âncoras concretas (uma pessoa/porta no nível 1, torre/navio no nível 6). Tabela real de levantamento por Força em `regras.json:454-493` (`forca.levantamento`). Exemplo: `forca-de-carga`, "carrega/ergue o dobro do normal sem penalidade" (×2), nível 1, batendo com a trilha [`tecnicas.json`, busca `forca-de-carga`].
3. Tipo: carga.
4. Tetos e travas: nenhum teto publicado específico de empilhamento para Carga de Proeza.
5. Técnicas: `efeito: "carga"` tem 7 registros. `forca-de-carga` (×2, nível 1), `arremesso` (~×2, nível 1), `levantamento-poderoso` (~×4, nível 3), `carregar-o-mundo` (nível 3, mesma casa de valor que Levantamento Poderoso mas com texto próprio).

## 18. Tamanho (porte que consegue afetar) · `tamanho-porte`

1. Unidade: categorias de porte a mais que o próprio, para agarrar/bloquear/dominar.
2. Valor base e fonte: trilha "Tamanho", seu porte/seu porte/+1 categoria/+2/+3/qualquer porte [`regras.json:231-242`]. Exemplo: `abraco-do-tita`, "agarra e esmaga criaturas de qualquer porte", nível 6, batendo com o topo da trilha [`tecnicas.json`, busca `abraco-do-tita`].
3. Tipo: tamanho (uma alavanca própria, distinta de ataque/Defesa/dano).
4. Tetos e travas: nenhum teto publicado além do próprio topo da trilha ("qualquer porte").
5. Técnicas: `efeito: "tamanho"` tem 1 registro só (`abraco-do-tita`). A busca ampla por "porte/categoria de tamanho" no texto dá 2 (`presenca-imponente` também aparece, mas é efeito social, leitura ambígua se conta como esta alavanca).

## 19. Reservas: PV, Fôlego, Energia, Mana, Força de Vontade · `reservas-recuperacao`

1. Unidade: pontos recuperados por Tick, por cena, ou de uma vez.
2. Valor base e fonte, por reserva:
   - PV: base 25 + Vigor × 3 para porte Médio, variando por porte [`regras.json:753-786`]. Recuperação de PV não tem regra geral fora de cura; `regeneracao` (Técnica) cria uma: "recupera PV igual ao seu Vigor a cada 6 Ticks", nível 4.
   - Fôlego: base 10 + Vigor × 5 + Resistência × 4 + Vontade × 2; recupera +Vigor por Tick fora de ação que gaste Fôlego [`regras.json:840-846`].
   - Energia: (Vigor + Compostura + Raciocínio + Vontade) ÷ 2 + Centelha × 2 [`regras.json:825-834`]; recupera por cena (não há relógio próprio escrito aqui).
   - Mana: Centelha × 2 [`regras.json:836-838`]; recupera por hora, dobrado em sono/meditação (fonte fora deste arquivo: `aparencia-virtudes-vontade.md`, não reconferida linha a linha nesta rodada).
   - Força de Vontade: recupera 1 ponto por noite de sono/meditação/descanso, e por Firula quando o jogador escolhe essa reserva [`regras.json:320-329`; tabela completa de Firula em `src/content/chapters/habilidades.md:104-108`, nível 1 = +2 fixo/1 Energia; nível 2 = +1d6/2 Energia OU 1 Mana OU 1 Vontade; nível 3 = +2d6/5 Energia OU 3 Mana OU 3 Vontade + XP].
3. Tipo: reservas e recuperação (separadas por PV, Fôlego, Energia, Mana, Força de Vontade).
4. Tetos e travas: gasto de Vontade para turbinar uma ação, +1d6 numa jogada ativa ou +4 numa Defesa passiva, teto de 1 ponto por ação ou jogada [`regras.json:331-334`]. Não há teto por cena de Firula, em nenhuma das três reservas que ela devolve [`regras.json:328`, `habilidades.md:113-114`]. Postura sustentada paga Energia uma vez e dura a cena, até Centelha posturas simultâneas [`regras.json:1232-1234`].
5. Técnicas: PV, 13 citam "PV/Vida máxima/ferimento" (`pele-de-rocha`, `ignorar-a-dor`, `segundo-folego`, entre outras; algumas são Absorção ou penalidade de ferimento, não PV puro). Fôlego, 3 (`folego-profundo`, `segundo-vento`, `marcha-forcada`). Energia, 1 na busca estrita (`sede-de-sangue`), mas o custo em Energia de Técnicas ATIVAS é o normal (campo `custo.energia`) e não uma alavanca de Proeza sobre a própria reserva. Mana, 0 encontradas (nenhuma Técnica do catálogo mexe na reserva de Mana; é território de Arte). Força de Vontade, 6 (`submissao`, `comando-irresistivel`, `palavra-de-lei`, entre outras), majoritariamente Técnicas que EXIGEM que o ALVO gaste Vontade para resistir, não que aumentam a reserva do usuário.

## 20. Ferimentos e penalidades · `ferimentos-penalidades`

1. Unidade: níveis de penalidade de ferimento ignorados ou reduzidos.
2. Valor base e fonte: tabela de ferimentos por faixa de PV, com `penAcao`, `penAcaoDados` e `penDefesa` por estado (Saudável a Incapacitado) [`regras.json:693-733`].
3. Tipo: ferimentos e penalidades.
4. Tetos e travas: nenhum teto publicado especificamente sobre quanto uma Proeza pode reduzir a penalidade de ferimento; `pele-de-pedra` (seção 8) reduz em 1 nível como efeito somado à Absorção.
5. Técnicas: `ignorar-a-dor` (ignora a penalidade de um ferimento por 6 Ticks, nível 1), `ignorar-ferimentos` ("em fúria, ignora um nível de penalidade de ferimento"), `cerrar-os-dentes` (ignora a penalidade de ferimento por uma ação crucial). Todas de efeito "estado" (não têm um número de pontos, ignoram um NÍVEL inteiro).

## 21. Estados e condições (impor ou resistir) · `estados-condicoes`

1. Unidade: nenhuma, é uma capacidade booleana (imunidade, controle, cura de condição).
2. Valor base e fonte: não há uma régua numérica central para esta alavanca; cada condição (atordoado, cego, imobilizado etc.) é definida caso a caso no que existe do sistema de condições. Não localizei, nesta rodada, um `condicoes.json` com a régua completa para citar linha a linha; a nota de `regras.json:750` cita a existência de uma condição "morto" em `condicoes.json`, mas não confere o restante.
3. Tipo: estados e condições.
4. Tetos e travas: nenhum teto publicado.
5. Técnicas: a maior categoria qualitativa do catálogo. 23 citam impor ou resistir a condições (atordoar, derrubar, imobilizar, cegar, paralisar, amedrontar, invisibilidade, imunidade). Exemplos: `encontrao-relampago`, `soco-trovejante`, `investida-devastadora`.

## 22. Alcance · `alcance`

1. Unidade: metros.
2. Valor base e fonte: a régua de alcance de Proeza (`parametros.alcance`), 3/5/8/20/50/150 m [`regras.json:261-268`], explicitamente descrita como "na mesma lógica do improviso do Arcano", mas com escala PRÓPRIA e diferente da do Arcano [`regras.json:260`].
3. Tipo: alcance.
4. Tetos e travas: nenhum teto publicado específico.
5. Técnicas: 5 citam alcance/metros/distância de forma que pareça esta alavanca: `olho-de-alcance`, `olho-que-tudo-ve`, `mao-do-prestidigitador-divino`, entre outras. Não conferi se algum desses valores bate exatamente com a régua 3/5/8/20/50/150 m, porque a maioria descreve visão/percepção a distância e não um alcance de efeito ofensivo.

## 23. Área e duração · `area-duracao`

1. Unidade: metros (área/diâmetro) e Ticks/cenas/horas/dias (duração).
2. Valor base e fonte: `parametros.duracao` de Proeza, 1 ação/6 Ticks/1 cena/várias cenas/horas/1 dia ou mais [`regras.json:277-284`]. Não há uma régua de ÁREA equivalente e nomeada dentro de `escalasProeza`; a régua de área encontrada em `regras.json` (graus 0 a 6, "0,1 m de diâmetro" até "4 m de diâmetro") pertence ao IMPROVISO do Arcano [`regras.json:1319-1326`], não às Proezas, e citar essa régua para Proeza seria confundir as duas escalas que o autor pediu para manter separadas.
3. Tipo: área e duração.
4. Tetos e travas: nenhum teto publicado específico para Proeza.
5. Técnicas: Duração, 21 citam "por cena/6 Ticks/dura" (a mesma lista ampla da seção 11, muitas vezes o mesmo texto que fixa Ticks de duração de um efeito, não de redução de ação). Área, 7 citam "área/raio de": `onda-de-choque`, `punho-do-cataclismo`, `chuva-de-mil-flechas`.
   NÃO EXISTE régua de Área própria das Proezas, distinta da do Arcano, no que foi lido nesta rodada.

## 24. Ação Longa · `acao-longa`

1. Unidade: nenhuma régua numérica fechada; o efeito é "levantar a média" do pool numa ação Longa.
2. Valor base e fonte: `Acoes_Sistema.md:107-109` diz que Proezas e Artes "quebram a parede" da Longa e levantam a média, mas NÃO diz a forma exata (é a própria pendência G15) [`docs/pendencias/G-acoes-sistema.md:147-150`]. A ação Longa em si usa a MÉDIA do pool por intervalo, e não uma jogada direta [`Acoes_Sistema.md:100-104`].
3. Tipo: ação Longa.
4. Tetos e travas: NÃO EXISTE regra fechada. G15 está aberta, com uma sugestão não aprovada do Comerciante registrada ("Proeza conta como bônus na média. Número a definir junto com D8.") [`docs/pendencias/G-acoes-sistema.md:151-152`]. G14, prima desta pendência, mostra o mesmo tipo de furo para a Firula na Longa (documento de regra e capítulo publicado discordam) [`docs/pendencias/G-acoes-sistema.md:142-146`].
5. Técnicas: nenhuma Técnica do catálogo declara, no próprio texto, "some à média da Longa" ou equivalente; o efeito, quando existe, é sempre descrito em termos de combate (Ticks, ataque, Defesa). Ligação com D8: `maos-habeis` (+3 em Ofícios) é o exemplo que a própria G15 usa para perguntar como esse bônus entraria numa Longa de ofício.

## 25. Firula · `firula`

1. Unidade: bônus na jogada (fixo ou em dados) + pontos devolvidos numa reserva.
2. Valor base e fonte: nível 1, +2 fixo/1 Energia; nível 2, +1d6/2 Energia OU 1 Mana OU 1 Vontade; nível 3, +2d6/5 Energia OU 3 Mana OU 3 Vontade + XP [`src/content/chapters/habilidades.md:104-108`]. Sem teto por cena [`habilidades.md:113-114`; `regras.json:328`].
3. Tipo: Firula (não é, ela mesma, uma alavanca de Proeza; é o mecanismo que devolve reserva e sobe jogada por boa descrição, listado aqui porque o pedido do autor citou Firula entre os alvos possíveis de melhora).
4. Tetos e travas: sem teto de pontos ou de quantas Firulas por cena. O nível é decisão do Mestre, não do jogador.
5. Técnicas: 0 Técnicas do catálogo mexem diretamente na régua da Firula (nenhuma sobe o nível dela nem muda o que ela devolve). NÃO EXISTE Proeza que altere esta alavanca hoje.

## 26. Especialidade · `especialidade`

1. Unidade: níveis de Especialidade (cada nível = +1d6 com descarte do menor numa rolagem, ou +1 num valor fixo como Defesa, só dentro do escopo nomeado).
2. Valor base e fonte: quantidade de níveis por Habilidade, 1 nível (Hab. 2 ou 3), 2 níveis (Hab. 4 ou 5), 3 níveis (Hab. 6) [`habilidades.md:85-87`]. Custo em XP: 8 + (nível × 4) numa primária, metade numa secundária [`habilidades.md:95`; `regras.json:591-604`, `xp.especialidadePrimaria/especialidadeSecundaria`].
3. Tipo: Especialidade.
4. Tetos e travas: o bônus só vale QUANDO o escopo nomeado se aplica (julgamento do Mestre); fora do escopo não faz nada e a ficha não soma automaticamente [`habilidades.md:93`].
5. Técnicas: 0 Técnicas do catálogo concedem ou ampliam Especialidade diretamente (é comprada à parte, por XP, dentro da própria Habilidade). NÃO EXISTE Proeza que mexa nesta alavanca hoje.

## Lista (a): alavancas permitidas pela regra, mas que nenhuma Técnica usa hoje

1. **Penalidade de armadura** [`regras.json:981-987`]: nenhuma Técnica reduz ou anula a penalidade de uma armadura.
2. **Reserva de Mana** [`regras.json:836-838`]: nenhuma Técnica de Proeza soma, recupera ou amplia a reserva de Mana; é território exclusivo de Arte.
3. **Firula** (o nível, o que ela devolve, ou um teto novo) [`habilidades.md:104-114`]: nenhuma Técnica altera a régua da Firula.
4. **Especialidade** (conceder um nível extra, ou ignorar o julgamento de escopo) [`habilidades.md:85-97`]: nenhuma Técnica mexe nisso.
5. **Ação Longa** (subir a média do pool numa fórmula fechada) [`Acoes_Sistema.md:107-109`; pendência G15]: nenhuma Técnica declara um valor fechado para isso, e a própria regra geral está em aberto.
6. **Bônus fixo e permanente à própria Defesa Social** (distinto de atacar a Defesa Social alheia): não encontrado no catálogo (ver seção 5).

## Lista (b): Técnicas cujo efeito não associei a nenhuma alavanca desta lista

Critério: efeito puramente narrativo, social ou de "estado" sem número e sem correspondência clara
a uma das 26 alavancas acima, na leitura feita nesta rodada (outra leitura pode encontrar
correspondência; sinalizo a incerteza).

- `coordenar` (concede reação/reposiciona um aliado; mistura Iniciativa/reação e coordenação de grupo, sem número).
- `esconder-sentir` (oculta uma emoção/reação; efeito social qualitativo puro).
- `disfarce`, `mudar-de-cara`, `misturar-se`, `rosto-comum`, `impostor`, `mil-rostos` (toda a família de disfarce/metamorfose social: muda aparência/identidade, sem alavanca numérica correspondente na lista; é capacidade nova, não incremento de regra existente).
- `magnetismo`, `centelha` (nomes de Técnicas iniciais de trilha, efeito "aura sutil"/presença, qualitativo).
- `predador`, `trilha-certa`, `trilha-fria`, `faro`, `rastreador` (família de rastreamento: percepção/perícia especial sem número fixo de bônus).
- `carne-de-granito`, `fortaleza-viva`, `avatar-da-carnificina` (imunidades amplas "a dano não-mágico" ou "a medo", que são condição/estado, não uma alavanca numérica das 26; têm sobreposição parcial com a seção 21, mas o núcleo do efeito, "imune", é binário e não escalar).

Esta lista é uma amostra dos casos mais claros encontrados na varredura por palavra-chave, não uma
contagem exaustiva dos 370 registros com `efeito: "estado"`: a maioria das Técnicas "estado" TEM
correspondência com alguma alavanca (movimento, Ticks, estados e condições impostas ao alvo), e só
uma parte menor é puramente narrativa/social a ponto de não caber em nenhuma das 26 linhas acima.
Contagem exata da lista (b) não foi fechada nesta rodada; um levantamento à parte, Técnica por
Técnica das 370 de efeito "estado", seria necessário para fechar esse número com confiança.

## Nota lateral: material externo já existente

A pasta `docs/export/proezas/chatgpt/` já contém uma análise externa anterior (enviada pelo autor a
outra ferramenta), incluindo um `inventario.md` que atribui um escore numérico ("P líquido") a cada
Técnica por uma fórmula própria dela (`N`, `Q`, `Num`, custo em Energia/Vontade). É um modelo de
PODER AGREGADO por Técnica, diferente deste catálogo, que é um modelo de ALAVANCAS por REGRA. Os
dois não competem: aquele mede "quanto vale cada Técnica"; este mede "que regras existem para
mexer, e quanto cada uma já mexe hoje". Não usei os números daquele inventário aqui, para não
misturar metodologias sem que o autor peça.
