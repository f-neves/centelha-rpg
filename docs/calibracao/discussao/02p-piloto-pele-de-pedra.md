# 02p · Piloto revisto do Caminho Pele de Pedra

**PROPOSTA**, nove de nove ids atuais, pelo M1 revisado. Nenhum catálogo alterado. Esta versão substitui o piloto anterior, inclusive sua Pele Curtida numérica e a frequência de Fortaleza Viva.

**Recomendação:** transformar Pele Curtida em permissão pequena N1 e conservar os demais ids com recortes/níveis abaixo. Motivo: a entrada já demonstra Centelha sem acumular um bônus gratuito; pró: testa os três tipos na mesma árvore; contra: muda a função da raiz e reduz algumas proteções atuais.

## 1. Árvore inteira e resultado proposto

“N calculado atual” significa texto atual após normalização explícita dos termos vagos neste documento. Não é alegação de valor definido no catálogo.

| id / nome | N atual | Tipo e família | N calculado atual → final | Veredito | Proposta final completa |
|---|---:|---|---|---|---|
| `pele-curtida` · Pele Curtida | 1 | Numérica atual → permissão | 2 → 1 | Substituir efeito para oferecer entrada sobrenatural | Por um gesto, a ponta de um dedo torna-se pedra e grava um sinal de até 1 cm em pedra, inclusive granito, sem ferramenta; só em si, uma vez/cena, 0 Energia. Não causa dano, perfura proteção, quebra estrutura nem concede Absorção. Acompanha ação comum, não dá ação extra. |
| `aguentar-o-tranco` · Aguentar o Tranco | 1 | Numérica, mitigação | 2 → 2 | Subir e delimitar | Ignora −2 fixos de Machucado em ações físicas e Defesa Física por 6 Ticks; não restaura dados de Grave/Crítico. 2 Energia, suplementar, até 3/cena. |
| `tensionar` · Tensionar | 1 | Numérica, Absorção reflexiva | 1 → 1 | Manter | +2 Absorção naquele golpe, 1 Energia, zero Ticks, uma reflexiva por gatilho; declarar após acerto e antes da aplicação do dano. |
| `couro-endurecido` · Couro Endurecido | 2 | Numérica, Absorção passiva | 4 → 2 | Recortar cobertura | +2 Absorção de Corte, passiva/pessoal, 0 recurso; nenhum bônus de Impacto. Não somar com outra Proeza passiva do mesmo tipo. |
| `pele-de-pedra` · Pele de Pedra | 3 | Composta, Absorção + mitigação | 4 → 4 | Subir e fixar janela | +4 Absorção I/C/P e redução de 1 ponto de penalidade fixa de ferimento por 12 Ticks, sem restaurar dados; 4 Energia, independente 6 Ticks, até 3/cena. |
| `inquebrantavel` · Inquebrantável | 4 | Permissão, exceção de sobrevivência | 7 → 4 | Manter nível, restringir | Uma vez/cena, um golpe de Impacto não agravado que levaria abaixo de 0 deixa em 0 PV, Incapacitado; 4 Energia reflexiva, uma por gatilho. Não cura nem protege do golpe seguinte. |
| `carne-de-granito` · Carne de Granito | 4 | Permissão, imunidade estreita | 4 → 4 | Fixar “leve” | Por 6 Ticks, ignora Corte não mágico e não agravado cujo dano bruto≤4, de fonte C≤usuário; 4 Energia, independente 6 Ticks, uma vez/cena. Nos demais casos, proteção normal. |
| `fortaleza-viva` · Fortaleza Viva | 5 | Permissão, imunidade ampla | 5 → 5 | Manter com fronteiras | Por 6 Ticks, imune a dano não mágico e não agravado de fonte C≤usuário; 5 Energia+1 FV, independente 7 Ticks, uma vez/cena. Fonte superior aplica proteção normal. |
| `pele-adamantina` · Pele Adamantina | 6 | Composta atual → numérica de redução | 7 → 6 | Retirar extra excessivo | Por 6 Ticks, após Absorção, reduz pela metade dano não agravado, arredondando para cima; 6 Energia+2 FV, independente 7 Ticks, uma vez/cena. Sem imunidade ambiental. |

Nas independentes, duração começa quando a ativação se conclui. O uso por cena é contado por família; recuperar Energia não repõe contador. Essas proteções não recebem 3N nem jogada extra de ativação. A queda para zero e a imunidade respondem ao golpe adversário, não a um teste D10 do defensor.

## 2. Eixos, largura e composição: contas auditáveis

| Técnica | Conta de nível | Cobertura e decisão |
|---|---|---|
| Pele Curtida atual | +2 passivo de um tipo é r2 | E2, acima da linha N1; a proposta abandona esse número |
| Pele Curtida proposta | Permissão `(0,0,0,0)`, N=1 | Pequena transformação utilitária, impossível para humano, sem benefício defensivo |
| Aguentar | Mitigação de estado r2; duração g1 | E2, estado delimitado; 3N não se aplica à remoção de penalidade |
| Tensionar | Absorção ativa r1, golpe único g0 | E1 por evento pago; cabe N1 |
| Couro atual → proposto | Maior passiva +3 dá r3; dois tipos +1 de largura → r4; final +2 só Corte → r2 | E3 → E2; cobertura gratuita em dois tipos era excessiva para N2 |
| Pele de Pedra | Absorção r3 com g2; mitigação r2 com g2; `max(3,2+2)=4` | E3 ativa, dois componentes; extra cabe em N4−2 |
| Inquebrantável | `(0,0,3,0)`, N4 | i3: exceção de combate estreita por um evento; não é efeito passivo sempre ligado |
| Carne de Granito | `(0,0,3,0)`, N4 | i3: imunidade estreita por uma janela de ação, pessoal, uma vez/cena |
| Fortaleza Viva | `(0,0,4,0)`, N5 | Um avanço de intensidade desde Carne, mantendo duração, alvo e frequência |
| Pele Adamantina atual → final | Redução r6 + ambiente r5 → `max(6,5+2)=7`; retirar ambiente → r6 | Numérica de família própria, não “permissão contínua” disfarçada |

Para normalizar o texto atual de Pele de Pedra, proponho 12 Ticks; para Pele Adamantina, metade por 6 Ticks e ambiente i4 pessoal por uma ação. Para o antigo Inquebrantável passivo repetível, a forma irrestrita não cabe no vetor N4: o rank 4 da tabela refere-se expressamente à versão limitada por evento/uma vez por cena, não valida sua disponibilidade atual. Se preservasse disponibilidade repetível e proteção contínua, precisaria cobrar d3 além de i3, chegando a N7 (f0 basta para manter um único efeito contínuo; não cobrar repetição de gatilhos como nova ativação); recomendo a versão delimitada N4.

**Recomendação de largura:** corrigir Pele Curtida e Couro, subir Pele de Pedra pela composição e recortar Adamantina. Motivo: a cobertura é poder; pró: cada redução tem motivo mecânico; contra: nenhum dos nove ids testa bônus de jogada 3N, portanto não prova equilíbrio ofensivo dessa escala.

## 3. Motivo, prós e contras por escolha

| Técnica | Recomendação e motivo | Pró | Contra |
|---|---|---|---|
| Pele Curtida | Adotar transformação localizada sem Absorção; garante permissão N1 | Identidade sobrenatural visível e uso utilitário real | Perde proteção inicial; exige avaliar aceitação temática do autor |
| Aguentar | Usar penalidade central −2 e custo, sem recuperar dados | Evita converter ponto em dado | Perde gratuidade e passa a C2 |
| Tensionar | Preservar +2 pago por golpe | Âncora N1 do catálogo | Compete pela reflexiva |
| Couro | Preservar só +2 Corte em N2 | Compra simples dentro da família | Perde Impacto e não o recupera pela raiz |
| Pele de Pedra | N4 pela regra N−2, mantendo dois efeitos | Não apaga mitigação para caber | Acesso mais tardio e duração definida |
| Inquebrantável | Limitar ao golpe decisivo, uma vez/cena | Mantém sobrevivência dramática | Sem Energia, pode morrer normalmente |
| Carne | Dano bruto≤4 antes de Absorção e uma ativação/cena | Imunidade objetiva, não combo com armadura | Útil contra ameaça pequena, fraca contra golpe forte |
| Fortaleza | i4, conservando f0 e custos | Evolução de um único eixo | Agora uma vez/cena, não duas como no piloto anterior |
| Adamantina | Manter metade, retirar ambiente | Preserva função contra dano mágico e comum | Não garante sobrevivência ambiental |

## 4. Pré-requisitos, evolução e XP

Preservar as arestas atuais: Pele Curtida abre Aguentar, Tensionar, Couro e Pele de Pedra; Aguentar abre Inquebrantável; Pele de Pedra abre Carne; Carne abre Fortaleza; Fortaleza abre Adamantina. Todos os pais ficam em nível≤filho. Dependência temática não é evolução de eixo: raiz e Tensionar são compras distintas. A exigência de avanço único vale nas evoluções declaradas da mesma permissão, não em todo pré-requisito entre poderes distintos.

**PROPOSTA recomendada:** crédito somente em Carne → Fortaleza, pois muda i3 para i4, mantendo `(d,a,f)=(0,0,0)`, fonte, duração e unidade de proteção. As demais são capacidades independentes. Motivo: preservar A4 sem descontar toda árvore; pró: conta verificável; contra: raiz utilitária continua sendo investimento para chegar à proteção.

| Compra | Preço cheio | Crédito | XP pago |
|---|---:|---:|---:|
| Pele Curtida N1 | 10 | 0 | 10 |
| Aguentar N2 | 15 | 0 | 15 |
| Tensionar N1 | 10 | 0 | 10 |
| Couro N2 | 15 | 0 | 15 |
| Pele de Pedra N4 | 25 | 0 | 25 |
| Inquebrantável N4 | 25 | 0 | 25 |
| Carne N4 | 25 | 0 | 25 |
| Fortaleza N5 | 30 | 25 | 5 |
| Adamantina N6 | 35 | 0 | 35 |
| **Total** | **190** | **25** | **165** |

Catálogo atual: 180 XP por compra inteira dos nove ids. Proposta: 165 XP após o crédito marcado, sem alterar preço base. Fecho obrigatório de Adamantina: 10+25+25+5+35=100 XP. O preço igual ao piloto anterior não significa poderes iguais; Pele Curtida e frequência de imunidades mudaram.

## 5. Casos de conferência do piloto

| Caso | Resultado esperado |
|---|---|
| Raiz N1, gesto tranquilo | Dedo vira pedra e grava sinal; sem teste e sem Absorção |
| Raiz usada para ferir ou abrir cofre | Não concede dano/perfuração estrutural; ação fora do efeito não se torna válida por vencer D10 |
| Gravar sinal preciso sob risco real | Destreza+Ofícios contra D10 padrão; tarefa excepcional pode justificar D15 ou mais; uma rolagem |
| Pele Curtida + Couro | Bônus de Proeza: Impacto 0, Corte +2, Perfuração 0; natural/armadura continuam à parte |
| Pele de Pedra + Couro | +4 por tipo da Proeza temporária, não +6 em Corte |
| Tensionar sobre Pele de Pedra | +6 naquele golpe pela exceção reflexiva publicada; 1 Energia adicional |
| Aguentar e Pele de Pedra | Maior mitigação pertinente, limitada a zerar penalidade; não remove dados de Grave/Crítico |
| Carne contra Corte bruto 5, líquido 1 | Sem imunidade: bruto supera 4 |
| Fortaleza contra fonte C maior | Sem imunidade, proteção normal |
| Segunda ativação de Fortaleza na cena | Não permitida, mesmo se Firula recuperou Energia/FV |
| Adamantina contra 9 líquidos | Sofre 5; se agravado, sofre 9 |
| Extra de Adamantina r5 em N6 | Reprovado por 5>6−2; precisa ser retirado ou separado |
| Energia zerada | Couro continua; Tensionar e proteções pagas não ativam |

**Recomendação:** usar estes casos como critérios de aceitação de uma futura implementação, sem implementá-la agora. Motivo: traduz prosa em resultados observáveis; pró: protege contra benefícios implícitos; contra: não substitui simulação de encontros.

## 5. Fontes literais dos nove registros

### Pele Curtida (`pele-curtida`)

> +2 de Absorção contra Impacto.

[tecnicas.json:826](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:826) · N1 · passiva · custo original: `{}`.

### Aguentar o Tranco (`aguentar-o-tranco`)

> Ignora a penalidade do estado Machucado (−1).

[tecnicas.json:840](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:840) · N1 · passiva · custo original: `{}`.

### Tensionar (`tensionar`)

> Ao ser atingido, +2 de Absorção contra aquele golpe.

[tecnicas.json:856](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:856) · N1 · reflexiva · custo original: `{"energia": 1}`.

### Couro Endurecido (`couro-endurecido`)

> A pele curte-se: +3 de Absorção contra Impacto e +2 contra Corte, sem pesar no movimento.

[tecnicas.json:7431](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:7431) · N2 · passiva · custo original: `{}`.

### Pele de Pedra (`pele-de-pedra`)

> +4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1.

[tecnicas.json:874](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:874) · N3 · ativa · custo original: `{"energia": 3}`.

### Inquebrantável (`inquebrantavel`)

> Golpe de Impacto te derruba e PARA em 0: só dano de outro tipo te leva abaixo do zero, na direção do limite.

[tecnicas.json:892](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:892) · N4 · passiva · custo original: `{}`.

### Carne de Granito (`carne-de-granito`)

> A pele apara golpes mundanos que não a penetram; imune a cortes leves.

[tecnicas.json:908](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:908) · N4 · ativa · custo original: `{"energia": 4}`.

### Fortaleza Viva (`fortaleza-viva`)

> Imune a dano não-mágico por 6 Ticks.

[tecnicas.json:926](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:926) · N5 · ativa · custo original: `{"energia": 5, "vontade": 1}`.

### Pele Adamantina (`pele-adamantina`)

> Quase indestrutível: reduz drasticamente todo dano e ignora ambientes mortais.

[tecnicas.json:945](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:945) · N6 · ativa · custo original: `{"energia": 6, "vontade": 2}`.


## 7. Veredito

**PROPOSTA recomendada:** adotar o M1 revisado e esta versão do piloto como objeto de aprovação. A raiz satisfaz permissão N1; o eixo de intensidade explica Carne→Fortaleza; a regra N−2 mantém Pele de Pedra N4 e rejeita ambiente junto de Adamantina N6. Pró: cada resultado tem conta e limite; contra: a árvore perde resistência gratuita inicial e precisa de avaliação de jogo antes dos lotes.

Nenhum dado do site foi alterado. Esta entrega termina no piloto, sem extensão para outros Caminhos.
