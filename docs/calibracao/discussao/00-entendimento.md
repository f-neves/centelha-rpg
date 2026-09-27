# Fase 0 · Entendimento

26/09/2026. Escopo: leitura integral dos dois exports; nenhuma alteração das regras. **FATO** indica texto ou contagem verificável; **INFERÊNCIA** indica cálculo ou interpretação; **PROPOSTA** indica decisão de design ainda não aprovada. As referências abreviadas dos capítulos são as fornecidas pelo dossiê. Duas consultas suplementares ao livro estão identificadas abaixo. Texto dimensionado para cerca de duas páginas, sem paginação fixa em Markdown.

## Matemática central

**FATO.** Some Atributo e Habilidade: `n = piso(soma/2)` dados de seis faces; soma ímpar acrescenta +2 ao total. Somam-se os dados, não se contam sucessos individuais. O total precisa **superar** a Dificuldade: empate falha. A régua de dificuldades é 5, 10, 15, 20, 25, 30. Cada seis pontos completos acima do alvo geram uma Margem; em combate, cada Margem acrescenta 1d6 ao dano. Não existe crítico separado por face natural. [Dossiê §2; coracao-do-sistema.md:14-16,65-80]

**INFERÊNCIA.** Para total `T` e alvo `D`: sucesso quando `T>D`; Margens `max(0,piso((T-D)/6))`. Sobras 1 a 5 dão sucesso sem Margem; sobra 6 dá uma. Um bônus fixo move o total e pode tanto converter falha em sucesso quanto atravessar um limiar de Margem. Um dado adicional muda também a dispersão e o teto: não equivale universalmente a +3,5 fixos.

**FATO.** Firula 1 dá +2 e recupera 1 Energia; Firula 2 dá +1d6 e recupera 2 Energia ou 1 Mana ou 1 Força de Vontade; Firula 3 dá +2d6 e recupera 5 Energia ou 3 Mana ou 3 Força de Vontade. Recupera uma reserva por Firula, sem teto por cena. Somente o XP da Firula 3 está marcado como indefinido. [Dossiê §2; habilidades.md:99-122]

**FATO.** Ação Longa não rola: média `3,5n + 2 se ímpar`. Centelha não entra. A consulta suplementar à fonte explicita o que o resumo omitiu: progresso por intervalo é `max(0,média-Dificuldade)`, até alcançar o Acúmulo; média insuficiente não avança. A entrada das Proezas continua pendente em G15. [Dossiê §2,§6; consulta direta: src/content/chapters/acoes-e-sistema.md:92-109]

**FATO.** Cada Centelha atualmente dá +1 no ataque e nas três Defesas, +2 na Energia e +2 na Mana; também aumenta Absorção natural e a recuperação horária de Mana segundo as fórmulas do dossiê. Abre Técnicas até seu nível, com teto de jogador 6. Atributos acima de 6 são autorizados, mas o teto por Centelha está em calibração. D7 discute trocar o bônus de ataque/Defesas para +2; isso não está decidido. [Dossiê §3-6; centelha.md:44-46; combate.md:191-192]

## Leitura e contagem

**FATO verificado por código.** Li os 461 textos, inclusive o campo vazio, seus tipos, custos e requisitos. Há 50 Caminhos e seis níveis: **146 / 51 / 107 / 56 / 52 / 49** Técnicas. São 88 passivas, 347 ativas e 26 reflexivas. As trilhas contêm 370 estados e 91 entradas de outras categorias. A contagem vem dos cabeçalhos e campos do export, não de sua tabela introdutória. [proezas-completas.md; calcular.py; distribuicao.md]

## Contradições e lacunas que afetam a avaliação

1. **FATO:** o dossiê §6 informa 90 Técnicas com pré-requisito; o export contém **411**, confirmado no JSON. Só 50 não têm. O §6 também diz que a maioria não custa recurso: o catálogo contém **373 com custo**, contra 88 gratuitas. **DECISÃO DO AUTOR: opção B aprovada**, descrição estrutural e contagens geradas a partir do catálogo. Ver [decisão e texto preparado](decisoes-entendimento.md) e [tabela gerada](contagens-dossie.md). A integração ao dossiê original está pendente; não houve alteração das regras.
2. **FATO:** D7, D8 e G15 continuam abertos. Compra por Técnica e “subir paga a diferença” não esclarecem se bônus de Técnicas encadeadas substituem ou acumulam. Não há teto de quantidade. [Dossiê §4,§6]
3. **FATO:** Esquiva Impossível (`esquiva-impossivel`, N3) tem efeito vazio. Brecha Emocional (`brecha-emocional`, N3) equipara +3 Margens a +6 na soma; **INFERÊNCIA:** +6 acrescenta uma Margem a um sucesso existente, não três, além de poder alterar o acerto. Reflexos Premonitórios (`reflexos-premonitorios`, N3) manda refazer Defesa, enquanto o dossiê descreve Defesas passivas. [Export, respectivos ids; dossiê §2-3]
4. **FATO:** Fôlego, Esforço, posturas, desgaste por ataques e tempos básicos aparecem nas Técnicas, mas não são definidos no dossiê. “Punhado de PV”, “por um tempo”, dano contínuo e várias imunidades carecem de quantidades. **INFERÊNCIA:** não existe uma mediana física exata de poder líquido recuperável desses textos.
5. **FATO suplementar:** Aguentar o Tranco (`aguentar-o-tranco`, N1) cita Machucado como −1, mas a tabela consultada do capítulo usa −2 na ação e na Defesa; Grave e Crítico retiram dados. Há divergência adicional entre export e capítulo. [Export, id citado; src/content/chapters/vida-ferimentos-cura.md:39-48]
6. **FATO:** não há ficha típica publicada, frequência de encontros/Firulas ou regra geral completa de duração, resistência e acumulação. A frase “sem geometria” das Proezas convive com parâmetros de alcance/alvos e efeitos regionais. **INFERÊNCIA:** significa ausência da geometria das Artes, não ausência de área. [Dossiê §3,§6-8]
7. **FATO:** o dossiê cita grupo de quatro; o pedido mantém três ou quatro em revisão. Esta análise preserva os dois cenários e não pressupõe a recalibração das criaturas.

**PROPOSTA de método:** a Fase 1 entrega probabilidades exatas condicionadas a perfis explícitos, uma ponte editorial para efeitos qualitativos e a distribuição **condicional** de 460 Técnicas; a entrada vazia fica sem valor. Não tratar a ponte editorial como matemática já existente no livro.
