# Inventário dos limites do sistema (para pensar Proezas)

Levantamento pedido pelo autor em 28/09/2026, encadeado à rodada "reforma da Centelha, Briga,
consertos e fichas de referência" (`docs/simulacao/caixa/reforma-centelha-briga-despacho.md`).
Feito pelo Arquiteto, só leitura, sem envolver Executora nem Revisora. Objetivo: inventariar os
LIMITES do sistema, isto é, as regras que uma Proeza poderia melhorar, dobrar (exceção com custo
ou condição) ou quebrar (ignorar). Não propõe nenhuma Proeza nem mudança de regra.

Levantado em paralelo por três buscas independentes (combate+recursos, ficha+fora de combate,
Artes+Proezas), todas rodando sobre o repositório no estado em que a Fase 1 da rodada "reforma
da Centelha" ainda estava em andamento. Onde isso importa (a fórmula de resistência das Artes,
por exemplo), está marcado abaixo.

## a. Combate

| Limite | Livro (arquivo) | Código (arquivo:linha) | Valor/enunciado | Simulado no motor? |
|---|---|---|---|---|
| Iniciativa e ordem | combate.md | regras.json:848-861 (`derivados.iniciativa`) | 1d6 + Raciocínio + Prontidão; maior entra no Tick 1; atraso = arredonda-para-cima(gap ÷ 6), com contrapé −1d6/degrau que decai 1d6/Tick | Sim |
| Ticks: preparo | combate.md | regras.json:2505-2532 (`combate.pgr.preparo`) | leve 0, média 1, haste/pesada 2, distância Velocidade−1, arremesso Velocidade−2, arte Velocidade−1 | Sim |
| Ticks: ciclo/recuperação | combate.md | regras.json:2533-2539 (Arte), calibrar.mjs:172-195 (`ajustarAnatomia`, `cicloDaPeca`) | Arte: preparo 2+nível, ciclo nível+3; ciclo geral = P+G+R | Sim (objeto do conserto de Fase 4 item 1: `forcaTick` não usava o ciclo ajustado) |
| Ações e golpes por Tick (Rajada/Dupla) | combate.md | regras.json:2552-2569 (`combate.rajada`), :2570-2582 (`combate.dupla`) | Rajada: N golpes na mesma ação, −1d6 acumulado por golpe extra, teto 3 (leve/média) ou 2 (haste/pesada). Dupla: 1 Tick de Golpe por mão, −1d6 cada | **Não**: zero ocorrência de "rajada"/"dupla" em motor.mjs. O motor resolve um golpe por ciclo |
| Defesas por Tick / contra quantos atacantes (Pressão) | combate.md | regras.json:2541-2551 (`combate.escada`) | Escada de Pressão: −2 por ataque sofrido na mesma janela, sem teto no livro (`pressaoTeto: null`); a variante de teto (−4/−6) só existe na bancada (Fase 4 item 3), não em regras.json | Sim, via `L.defesaPerdida` (lance.ts), motor.mjs:376-401 |
| Alvos por golpe | (sem capítulo dedicado) | regras.json:1158-1204 (`horda`) | Golpe comum: 1 alvo. Área só existe para Artes e ataque de esquadrão contra PV do esquadrão | Não (motor resolve golpe-a-golpe, sem AoE nem esquadrão) |
| Alcance e movimento | combate.md | regras.json:2457-2472 (`combate.alcance`), :862-901 (`derivados.deslocamento`) | 1 hex corpo a corpo, 2 na haste; faixas além do alcance livre custam −3 por quarto de distância até o máximo | Parcial: distância/deslocamento por Tick simulados (motor.mjs:96-137); a penalidade por faixa (`penPorParte`) **não** é simulada (mesma lacuna da pendência H7, generalizada: não é só Arremesso×Atirador) |
| Pressão | combate.md | regras.json:2541-2551 | −2 por golpe recebido na mesma janela, sem teto no livro | Sim (mesmo `defesaPerdida`/`dv.total`) |
| Quase-acerto e raspão | quase-acerto.md | regras.json:1112-1156 (`quaseAcerto`), lance.ts:236-244 (`quaseAcertoDoEncontro`) | Margem = Bônus QA arma + armadura; Raspão = Dano QA − Redução, mínimo 0 | Sim, com ressalva: `quaseAcerto()` em quase-acerto.ts:187-199 reimplementa a conta à parte (achado já registrado na rodada em andamento, correção pendente de fechamento) |
| Redução e Absorção | armas-e-armaduras.md | regras.json:904-990 (`dano`, `dano.empilhamento`) | Absorção = maior peça por categoria + natural; Redução (QA) por classe de armadura | Sim (motor.mjs:402, `soak: alvo.soak[c.tipoDano]`) |
| Impacto contra Vigor | armas-e-armaduras.md | regras.json:932-937 (`soakNatural.impacto: "vigor"`, `centelhaNoSoak: 1`) | Absorção natural de Impacto = Vigor (+ Centelha em todos os modos) | Sim |
| Agarrar | acoes-corpo-e-movimento.md:271 (remete a "Combate") | nenhuma | O capítulo de Ações remete a Combate para Agarrar/imobilizar/derrubar, mas `combate.md` não tem essa seção e regras.json não tem chave alguma | **Não**, e é uma lacuna livro→livro, não só livro→código: o capítulo remetido não existe |
| Desarme | sem regra base | só como Proeza (`desarme`, `desarme-rapido`, inventario.md:135,220) | Não existe regra base de desarmar; só duas Proezas dão a capacidade | Não (nem base nem Proeza está no motor) |
| Limite da morte (M-21) | vida-ferimentos-cura.md | regras.json:735-750 (`morte`), calc.ts:69-79 (`limiteDaMorte`) | −(PV máx ÷ 2), arredonda para baixo sem Centelha / para cima com Centelha (M-21c) | Sim no cliente (motor.mjs:450-452); no banco (Supabase), migração 40 aplica o limite mas sempre com Centelha "desconhecida" (arredonda para cima genérico), não o M-21c exato por peça |
| Recuperação de Vida | vida-ferimentos-cura.md | sem chave central identificada; cura espalhada em artes.json/tecnicas.json | Fora do escopo deste levantamento por falta de fonte única | Não: motor.mjs não tem "cura"/"recupera" (a bancada mede combates de desfecho único, sem ciclo de recuperação) |

## b. Recursos

| Limite | Livro (arquivo) | Código (arquivo:linha) | Valor/enunciado | Simulado no motor? |
|---|---|---|---|---|
| Energia (fórmula) | sem capítulo dedicado à reserva em si | regras.json:825-834 (`derivados.energia`) | (Vigor+Compostura+Raciocínio+Vontade)/2 [para baixo] + Centelha×2 | Não (motor.mjs não referencia "energia") |
| Energia (custo por ação/técnica) | aparencia-virtudes-vontade.md | regras.json:1206-1239 (`economiaPoderes`) | Sobretaxa por combo: k-ésima Técnica soma +(k−1); posturas simultâneas até Centelha | Não |
| Energia (recuperação) | aparencia-virtudes-vontade.md | regras.json:327 (nota) | Por cena, sem contador de Tick | Não |
| Mana | centelha.md/arcano | regras.json:836-839 (`derivados.mana`, `centelhaMult:2`), :2149 (`recuperacaoMana`) | centelhaMult 2, recuperação por hora | Não |
| Força de Vontade (uso/limite) | aparencia-virtudes-vontade.md | regras.json:331-335 (`gastoVontade`) | +1d6 numa jogada ativa ou +4 numa Defesa passiva, por ponto; teto de 1 ponto por ação, não empilha | Não |
| Força de Vontade (recuperação) | aparencia-virtudes-vontade.md | regras.json:320-329 (`recuperacaoVontade`) | 1/noite de sono; Firula nível 2 devolve 1, nível 3 devolve 3; regra moral devolve 1; sem teto por cena | Não |
| Virtudes | aparencia-virtudes-vontade.md | regras.json:336-339 (`virtudeSomaRegra`) | Virtude nunca soma na mesma parada de Atributo+Habilidade; rola sozinha (teste de Virtude/Frenesi) | Não |
| Canalizar Virtude | aparencia-virtudes-vontade.md | regras.json:338 (`virtudeSomaRegra.excecao`) | Única exceção: bônus voluntário, uma vez por cena por Virtude, valor cheio; teto/contrapartida ainda em aberto (pendência M-18) | Não |

## c. Ficha e progressão

| Limite | Livro (arquivo) | Código (arquivo:linha) | Valor/enunciado | Simulado no motor? |
|---|---|---|---|---|
| Máximo de Atributo | atributos.md (régua 0-6) | regras.json:563-568 (`xp.atributo`) | 0 a 6; custo acumulado 15·20·25·30·35 (níveis 2-6) | Não (motor não impõe teto, só lê o valor da ficha) |
| Máximo de Habilidade | habilidades.md:8 | regras.json:570-582 (`xp.habilidadePrimaria`/`Secundaria`) | Primárias e secundárias 0-6; secundária custa metade | Não |
| Especialidade: quantos níveis | habilidades.md:80-89 | regras.json:591-598 (`xp.especialidadePrimaria.limite`) | Cada 2 níveis de Habilidade abrem 1 nível de Especialidade | Não |
| Especialidade: até onde chega | habilidades.md:93 | mesma citação | Bônus só vale no escopo nomeado (julgamento do Mestre); em pool +1d6-descarta-o-menor/nível, em valor fixo +1/nível | Não |
| Custo de XP por trilha | tabelas espalhadas pelos capítulos | regras.json:561-680 (`xp.*`) | Modelo (base + mult × nível), tipo acum/flat/gratis por trilha; Centelha não custa XP | Não (XP é progressão fora de cena) |
| Pré-requisito de Proeza/Técnica | regras.json:639 (nota) | tecnicas.json (`prereq`, `nivel`) | "nível N exige Centelha ≥ N"; Proeza pode exigir Proeza(s) anterior(es) | Não (motor não verifica pré-requisito) |
| Teto de Antecedente na criação | regras.json:589 (nota) | mesma | Teto 3 na criação em Recursos e Artefato (regra de mesa, não travada em código) | Não, e o próprio JSON já registra isso |
| Pré-requisito de Arte | não localizado nos capítulos | regras.json:641-646 (`xp.arte`, só custo) | Sem trava de nível por Ocultismo (removida); Arte só exige Centelha > 0 | Não |

## d. Fora de combate

| Limite | Livro (arquivo) | Código (arquivo:linha) | Valor/enunciado | Simulado no motor? |
|---|---|---|---|---|
| Escada de Dificuldade (fora de combate) | acoes-e-sistema.md:14-27 | reaproveita regras.json.dificuldade (661-692, a mesma tabela de combate) | 5 a 30 (Fácil a Sobre-humano), soma-alvo de 3 em 3; teto mortal Atributo+Habilidade 12 | Não (motor de combate não usa este texto fora de combate) |
| Margem | acoes-e-sistema.md:31-53 | não implementado em scripts/sim/* | 6 pontos acima do alvo = 1 Margem; compra Tempo, Qualidade ou Duração | Não |
| Os 5 modos de ação (Direta/Acumulada/Longa/Reflexiva/Passiva) | acoes-e-sistema.md:55-131 | zero ocorrência em motor.mjs (confirmado por grep) | Direta rola; Longa usa a média do pool (3,5×dados +2 se ímpar); Passiva = (Atributo+Habilidade)×2 + Centelha | **Não**, nenhum dos 5 modos existe no motor |
| Escada de Intervalo | acoes-e-sistema.md:133-150 | sem equivalente no motor | Tick → Minuto → Hora → Dia → Semana → Estação | Não |
| Ajuda (Ajudante / Teste Coletivo) | acoes-e-sistema.md:162-180 | sem equivalente | Ajudante rola contra Dificuldade÷2 (arredonda pra cima), +1 por 6 acima; Teste Coletivo soma +2 Dificuldade/participante | Não |
| Primária x Secundária na mesma ação | acoes-e-sistema.md:182-195 | sem equivalente | A maior entra no pool, a menor vira bônus fixo | Não |
| Ofícios: Requisito/Dificuldade/Montagem/Peça/Piso | acoes-oficio-e-mundo.md:18-66 | não localizado em regras.json como bloco estruturado | Requisito = porta de entrada; Dificuldade = ritmo; Montagem paga 1×/lote; Peça paga por unidade; Piso = mínimo de intervalos | Não |
| Ofícios: alcance x especialista | acoes-oficio-e-mundo.md:37-49 | sem equivalente | Cobre peça até o nível da própria Habilidade; fora do território, Dificuldade +4 e Requisito conta só metade | Não |
| Qualidade da peça (Sucata..Excelente) | acoes-oficio-e-mundo.md:68-80 | sem equivalente | Cada grau acima de Comum: Requisito +1 (máx 6, cada ponto +3 Dificuldade), Dificuldade +3, Montagem/Peça ×1,5; abaixo é o espelho | Não |
| Recuperação de Vida em descanso | vida-ferimentos-cura.md:79-90 | bloco `recuperacao` não localizado nesta varredura | Recupera Vigor em PV por intervalo, mais lento por Estado; Cura de quem cuida acelera 10% (50% com Cura 5) | Parcial: motor simula só combate curto, não recuperação de intervalo longo |
| Estabilizar Sangramento | vida-ferimentos-cura.md:75 | não localizado | Cura vs Dif 10 (dedicada) ou Vigor+Resistência vs Dif 10 (sozinho) | Não |
| Limite de repetição de jogada | não localizado nos capítulos varridos | não localizado | Sem regra escrita achada nesta varredura (grep vazio) | N/A, ver lacuna 2 abaixo |
| Jogadas sociais (limites específicos) | relacoes-sociais.md (não investigado a fundo) | derivados.defesaSocial, regras.json:811 (só a Defesa, não o ataque social) | Defesa Social = (Compostura+Sociabilidade)×2 + Centelha + Especialidade | Não investigado a fundo; recomenda revisão dedicada se o inventário virar base de Proeza social |

## e. Artes

| Limite | Livro (arquivo) | Código (arquivo:linha) | Valor/enunciado | Simulado no motor? |
|---|---|---|---|---|
| Rolagem de conjuração | centelha.md (sem capítulo próprio de Arcano) | regras.json:1249,1265 | Sem rolagem geral; só Percepção+Acerto Arcano nos efeitos MIRADOS; resto por Dificuldade fixa, Defesa passiva ou tabela | Não |
| Preparo/ciclo da Arte | sem capítulo dedicado | regras.json:2538 | "A Arte sai no ÚLTIMO Tick": Preparo = 2+nível, ciclo = nível+3 | Não |
| Ticks totais por nível | sem capítulo dedicado | regras.json:1250-1263 (`feiticoTicks`) | nível 1-3: 5 Ticks; nível 4: 6; nível 5-6: 7 | Não |
| Custo em XP | sem capítulo dedicado | regras.json:641-647 (`xp.arte`, `xp.efeito`) | Arte: acum, 15·20·25·30·35·40 (até 165 acumulado); Efeito Especial: flat, 4×nível | Não |
| Custo em Mana (improviso) | regras.json:1296-1305 | mesma | 1 ponto de parâmetro = 1 Mana; Centelha desconta; se total ≤ Centelha, grátis e ilimitado | Não |
| Teto por parâmetro | regras.json:1305 | mesma | Nível da Arte (Efeitos Especiais podem passar disso) | Não |
| Alcance (grau 0-6) | regras.json:1310-1318 | mesma | toque, 1m, 2m, 4m, 10m, 20m, 50m | Não |
| Área (grau 0-6) | regras.json:1319-1327,1365 | mesma | diâmetro 0,1m a 4m; nota: régua "de saída", 46 Efeitos ainda usam essa régua em vez do molde por forma | Não |
| Manifestação em leque/setor | sem capítulo dedicado | src/lib/artes-grid.ts:541 (`ANGULOS`) | **[45, 60, 90, 120, 180]** graus (a memória do projeto cita "60/90/120°"; o código tem 5 opções, não 3: ver lacuna 4) | Sim, só no Grid visual (artes-grid.ts/artes-grid-mesa.ts), não no motor headless |
| Duração breve/longa (grau 0-6) | regras.json:1346-1363 | mesma | breve: instantâneo a 300 Ticks; longa: instantâneo a 1 mês | Não |
| Resistência por tipo de efeito | sem capítulo dedicado | regras.json:1264-1294 | 5 categorias (dano/corpo/mente/aprisionamento/automático), cada uma resiste por via diferente | Não |
| Dificuldade de resistência (item 2 da Fase 1, em curso) | sem capítulo dedicado | **não localizado em nenhum arquivo** nesta varredura | Pedido novo: Dificuldade = nível×5 + 2×min(Centelha do conjurador, nível); alvo soma 2×min(Centelha do alvo, Habilidade). A fórmula ANTIGA ainda documentada é nível×4 ou ×5, sem termo de Centelha (regras.json:1265) | Não. Ver lacuna 1: item da Fase 1 em curso ainda não encontrado aplicado no momento desta varredura, pode ser que a Executora ainda não tenha chegado lá |
| Armadura vs. dano de Arte | sem capítulo dedicado | regras.json:1293 | Só protege contra dano físico/matéria; fenômeno puro é absorvido só pela Centelha | Não |

## f. Proezas (chamadas "Técnicas" no código, organizadas por "Caminho")

| Limite | Livro (arquivo) | Código (arquivo:linha) | Valor/enunciado | Simulado no motor? |
|---|---|---|---|---|
| Catálogo | centelha.md:48-82 ("Os seis níveis das Proezas") | src/data/tecnicas.json | 461 Técnicas em 52 Caminhos, níveis 1-6 | Não |
| Gate por Centelha | centelha.md:50 | regras.json:639 (nota de `xp.tecnica`) | "o nível N exige Centelha ≥ N" | Não |
| Custo em XP | sem capítulo dedicado | regras.json:634-639 | flat, por Proeza, sem acumular: 10·15·20·25·30·35 (subir paga só a diferença) | Não |
| Pré-requisito entre Técnicas | sem capítulo dedicado | tecnicas.json (`prereq`, array de ids) | por Técnica, individual (ex.: `salto-do-grilo` exige `passo-veloz`) | Não |
| Custo em jogo (energia) | sem capítulo dedicado | tecnicas.json (`custo`) | por Técnica ativa (ex. `{"energia": 2}`); muitas custam `{}` (passivas/estado) | Não |
| Escalas por nível (Bônus/Absorção/etc.) | regras.json:113-114 (nota) | regras.json:115-260 (`escalasProeza.trilhas`) | 6 trilhas, valores por nível 1-6 | Não |
| D7 (bônus de Centelha: +1 ou +2) | docs/pendencias/D-proezas-tecnicas.md:33-36 | citando centelha.md:44/:65 (+1) vs regras.json:114 (+2) | Ainda `[DECIDIR]` no arquivo de pendências no momento desta varredura; o despacho atual pede fechar como RESOLVIDA POR SUBSTITUIÇÃO; provável que a Executora ainda não tenha chegado nesse passo do relato | n/a |
| D11, Proeza de Quase-acerto | docs/pendencias/D-proezas-tecnicas.md:54-58 | não implementada | Duas alavancas possíveis (dano do raspão / Margem), preço por decidir | Não |
| "Punho como arma média" (Fase 3 do despacho atual) | ainda não registrada no momento desta varredura | não implementada | Pendência nova a criar na Fase 3; ainda não commitada quando este levantamento rodou | Não |
| D9, Esquiva Impossível | docs/pendencias/D-proezas-tecnicas.md:41-46 | tecnicas.json (`esquiva-impossivel`) | Sem efeito determinável; deve virar `pendente:true` só depois de D6 fechar | Não |

## Contradições e lacunas achadas

1. **Item 2 da Fase 1 em curso (Dificuldade de resistência das Artes) não foi encontrado aplicado em nenhum arquivo** no momento desta varredura. Pode ser que a Executora-3 ainda não tenha chegado nesse item dentro da Fase 1; não é necessariamente um defeito, mas precisa ser reconferido depois que ela reportar a Fase 1 como fechada.
2. **Nenhum dos 5 modos de ação, Margem, Ajuda ou Ofício está no motor da bancada.** Não é discordância entre livro e código (o motor simula só combate Tick a Tick por desenho), mas significa que todo o grupo (d) é hoje território sem verificação automatizada: uma Proeza que mexesse nesses limites não teria como ser calibrada pela bancada existente.
3. **Nenhum recurso do grupo (b) é simulado pelo motor.** Energia, Mana, Vontade, Virtudes: zero ocorrências em motor.mjs. Mesma natureza do item 2: metade do sistema de recursos não tem como ser calibrada por bancada hoje.
4. **"Limite de repetição de jogada" não tem regra escrita localizada** nos capítulos varridos. Pode ser lacuna de design real ou estar num documento de trabalho fora de `src/content/chapters/` (`Acoes_Sistema.md`/`Acoes_Catalogo.md`/`Acoes_Texto.md` na raiz não foram vasculhados nesta passada); vale conferir antes de tratar como buraco definitivo.
5. **Agarrar é uma lacuna livro→livro**, não só livro→código: `acoes-corpo-e-movimento.md:271` remete a uma seção de Combate que não existe (`combate.md` não tem Agarrar/imobilizar/derrubar), e `regras.json` não tem chave nenhuma para isso.
6. **Desarme não tem regra base**, só existe como efeito de duas Proezas (`desarme`, `desarme-rapido`). Contraria a expectativa de "Proeza dobra/quebra um limite existente": aqui a Proeza cria a capacidade do zero, não há limite base para dobrar.
7. **`regras.json:750` (nota do bloco `morte`) parece desatualizada**: diz "o Grid ainda não implementa nenhum dos dois [limite da morte / condição morto]", mas a Fase 1 da rodada "Regra do Quase-Acerto" já aplicou o limite da morte em grid.astro/motor.mjs/artes-grid-mesa.ts. Só leitura, não editado.
8. **`regras.json:114` (nota de `escalasProeza`) ainda descreve a fórmula antiga "+2/ponto de Centelha"** (o outro lado do D7). Se `calc.ts` já mudou para a regra nova (2×min(Centelha,Habilidade)) e essa nota não foi atualizada, é uma inconsistência de documentação interna que vale corrigir quando D7 for fechada.
9. **Migração 40 só cobre o limite da morte parcialmente no banco**: o cliente já faz o arredondamento exato M-21c por Centelha; a RPC `jogador_dano` usa sempre o lado genérico "Centelha desconhecida" (arredonda para cima), porque `combatentes` não tem coluna de Centelha. **Atualização, confirmada em 28/09/2026**: a migração 40 já rodou em produção (registrado no commit `caafa029`), com `-ceil(pv_max/2)` aplicado a TODAS as peças, sem a coluna `centelha`. O caminho (a) do comentário da migração (coluna `centelha` em `combatentes`, arredondamento exato por peça) segue como pendência aberta, agora sobre uma base já em produção, não mais hipotética.
10. **`ANGULOS` no código das Artes tem 5 valores (45/60/90/120/180)**, não os "60/90/120°" citados numa memória do projeto. Não é contradição livro×código (não foi encontrado o número documentado em nenhum capítulo), só uma imprecisão de memória a corrigir.
11. **Não existe capítulo dedicado de Artes/Arcano nem de Proezas em `src/content/chapters/`.** O que existe está espalhado em `centelha.md` (visão geral) e em `src/pages/artes/regras.astro` (página da UI, não capítulo de livro). Pode ser intencional, mas é uma lacuna estrutural que vale confirmar com o autor.
12. **A "fonte única" do raspão** (`quaseAcertoDoEncontro` em lance.ts) tem uma reimplementação paralela em `quase-acerto.ts:187-199`, já registrada como pendência na rodada em andamento (Fase 1 item 5/7), não fechada no momento desta varredura.

Nada foi proposto, corrigido ou alterado além deste arquivo.
