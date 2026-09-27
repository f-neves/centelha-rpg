# Decisões do autor sobre o entendimento

## Decisões vigentes · 05 revisto após segunda opinião

26/09/2026. Esta seção prevalece sobre o histórico abaixo em caso de conflito. **A1–A5 decididas pelo autor; G15 proposta pendente.** A nova `01-regua.md` incorpora as decisões e é entregue para revisão, sem iniciar lotes. A1a/A1b, acumulação geral e +18 deixaram de ser opções abertas.

Permanece a escrita somente em `docs/export/proezas/chatgpt/`. A implementação/ocultação de Fôlego está sob responsabilidade da equipe normal; esta frente não volta a alterar seus arquivos.

### A1 · Referência publicada, sem perfis por Centelha

**DECISÃO:** usar `regras.dificuldade`: D5/10/15/20/25/30 associados às somas 3/6/9/12/15/18. Não usar A1a nem A1b. Perfis: soma 6 (Competente), 9 (Perito), 12 (Mestre). Atributo e Habilidade param em 6 para a régua; tarefas Herói/Semideus são alcançadas por Proeza. Nenhum teto do código foi alterado nesta entrega.

Unidade: +5 de bônus desloca um degrau de D. Conferência: 6d6>D20, 6d6+5>D25 e 6d6+10>D30 dão 54,6425%. As associações publicadas ficam entre 50% e 59%. Fonte: [src/data/regras.json:661](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:661). Somas 15/18 aparecem apenas para conferir a referência, não como fichas de teste permitidas.

### A2 · Substituir por família e escopo

**DECISÃO:** maior bônus por família/escopo, preservando exceções publicadas de Absorção, reflexivas por gatilho, teto situacional e ações extras. Capacidades qualitativas distintas não desaparecem. Família não se deduz automaticamente de Caminho ou pré-requisito. Fonte das exceções: [src/content/chapters/combate.md:437](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/combate.md:437) e linhas 451–459.

### A3 · Escala total aprovada

**DECISÃO:** `5N/2`, metades arredondadas para cima: **3,5,8,10,13,15**. Totais substitutivos, um degrau de D a cada dois níveis. Mestre N6 contra D30: 90,3528%. Escala para jogadas; Longas tratadas em G15. Não transplantar automaticamente para Absorção/dano/parâmetros.

A nova régua reúne a comparação com a escala atual em uma tabela, para somas 6/9/12 contra D10 a D30. A fonte viva não foi modificada.

### A4 · Diferença somente em evolução marcada

**DECISÃO:** evolução marcada paga diferença; capacidade independente paga inteira. Preservar preços base 10/15/20/25/30/35. Comparar com Habilidade primária 3→4, 12 XP ([src/data/regras.json:570](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:570)).

**CONFERÊNCIA:** o ganho de média por ponto é +2 ou +1,5 conforme a paridade; +1,75 é comparador médio. `12/1,75=6,8571`, aproximadamente 7 XP/+1. A régua separa eficiência marginal/total, escopo e compras independentes. N3/N5 da evolução são maiores alertas de preço baixo; escopo raro ou compra inteira sem evolução podem torná-la cara. Diagnósticos condicionais, sem alterar preço nem marcar evoluções no catálogo.

### A5 · Quatro personagens, conferido

**DECISÃO:** grupo de referência de quatro. O documento do bestiário diz “grupo de 4 personagens” ([docs/pendencias/B-bestiario.md:118](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/pendencias/B-bestiario.md:118)). Modelo econômico: `grupo=4` ([lore/economia/v2/modelo.py:468](C:/Users/Neves/ClaudeCode/centelha/rpg-system/lore/economia/v2/modelo.py:468)); recompensa: `"grupo": 4` ([src/data/recompensas.json:96](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/recompensas.json:96)); calculadora começa em quatro ([src/components/CalculadoraRecompensa.astro:24](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/components/CalculadoraRecompensa.astro:24)).

Não há divergência entre essas referências atuais; a parada condicional deste item não foi acionada. Isso confirma a referência, não certifica recalibração concluída de todas as criaturas. Nenhuma alteração de bestiário/caça nesta frente.

### G15 · Proposta do autor, ainda pendente

**PROPOSTA PENDENTE:** Proeza aplicável soma seu nível, +1 a +6, à Longa, não a escala inteira. Motivo: Mestre contra D20 avançaria de 1 a 16 com +15, multiplicando produção por 16.

A nova régua mostra somas 9/12 contra D15/D20, N0–N6. Com +6, Mestre contra D20 avança 7, ainda ×7: consequência explicitada, sem aprovar proposta nem reformar economia. Não dar +N oculto a toda Técnica qualitativa.

### 06 · Direção aprovada; primeira etapa mínima

**DECISÃO:** aprovada como direção. Primeira etapa: nível, custo, família/escopo, evolução marcada, bônus numérico tipado e os três estados em alcance/área/duração: `nao_se_aplica`, `ainda_nao_definido`, `usa_regra_padrao`. Valor conhecido usa `definido`. Texto vago permanece indefinido; arbitragem narrativa exige intenção do autor.

Árvore completa de operações entra lote por lote depois. Esta decisão restringe o plano amplo de B4 no 06; não exigir toda a estrutura na etapa mínima. Padronização continua sem mudar poder. Bugs E01/E03/E04/E06 já foram encaminhados à equipe do projeto; não foram corrigidos nem declarados resolvidos aqui.

### Entrega e parada

Atualizados somente `decisoes-entendimento.md` e `01-regua.md`. Régua entregue para revisão; nenhum lote iniciado, nenhum novo preço, nenhuma alteração do site. Registros abaixo ficam como histórico, inclusive afirmações antigas de “ainda aberto” superadas por esta seção.

## Histórico anterior às decisões A1–A5


## Item 1 · Opção B aprovada

O autor escolheu corrigir a descrição estrutural do dossiê e manter as contagens numa tabela gerada automaticamente a partir do catálogo. A decisão não altera os pré-requisitos nem os custos das Técnicas.

### Texto preparado para substituir os trechos inexatos do §6

**Requisitos:** o nível N exige Centelha ≥ N. Cada Técnica carrega um Atributo associado ao Caminho e pode exigir outras Técnicas, indicadas no campo `prereq`. A tabela gerada apresenta quantas entradas possuem esse requisito. O campo registra a exigência; sua aplicação pelo motor deve ser verificada separadamente.

**Custos por uso:** cada Técnica possui um tipo e um campo `custo`, que registra os recursos cobrados por uso. A tabela gerada separa Técnicas com e sem custo de recurso e discrimina essa distribuição por tipo. Ausência de custo de recurso não significa ausência de ação ou de investimento em XP.

### Execução e limite de alcance

`gerar-contagens.py` lê o JSON vivo e produz `contagens-dossie.md`, ambos nesta pasta. Executar o gerador a cada nova exportação. O script não fixa as contagens atuais como valores esperados e admite mudanças na distribuição por tipo.

O dossiê original e o processo de exportação externo a esta pasta não foram alterados: permanece a autorização de escrever apenas em `docs/export/proezas/chatgpt/`. A incorporação do texto e da chamada ao gerador no processo original está pendente. Portanto, a decisão está registrada e a geração está pronta, mas ainda não está integrada automaticamente à exportação original.

O item 2 foi adiado conforme registrado abaixo; o item 3 tem decisão parcial; os itens 4 a 7 continuam sem decisão. A aprovação de B não aprova a régua da Fase 1.

## Item 2 · Decisão adiada: definir o método antes dos valores

**Orientação mais recente do autor:** ao comparar +15 com o total hipotético +49, reconsiderou a interpretação cumulativa. Considera +15 plausível para alto nível e +49 inadequado. Sugeriu como hipótese uma progressão de +3 por nível até +18, mas determinou expressamente que não se decida isso agora. Primeiro será definido como escolher a progressão; depois ela será aplicada ao catálogo. Acumulação, substituição, escala final e pagamento de XP permanecem abertos. Nenhuma das opções A/B foi aprovada neste item. Seguir para o item 3.

### Histórico da interpretação anterior, não vigente como decisão

O autor considera provável que os bônus das Técnicas adquiridas se somem, salvo substituição explícita. Suas palavras: “Provavelmente todos os níveis somam, talvez nenhum substitua o bônus (a não ser que esteja explicito)”. Registrado como interpretação provisória, sem transformar a hipótese em decisão fechada.

No exemplo discutido, Mãos Hábeis (`maos-habeis`) +3 e Obra Bem-Feita (`obra-bem-feita`) +4 entregariam +7 em uma tarefa de Ofícios coberta pelas duas. O pagamento de XP ainda não foi esclarecido: custo integral de cada Técnica ou apenas diferença.

A soma requer aquisição das Técnicas e aplicabilidade simultânea de seus efeitos. A tabela de escalas não concede automaticamente todos os bônus dos níveis anteriores. Como teste hipotético, seis Técnicas com bônus sobrepostos de +3, +4, +6, +9, +12 e +15 produziriam +49; não foi identificada aqui uma cadeia real que contenha os seis bônus.

Se essa interpretação for confirmada, a recomendação de substituição no documento 01-regua.md deve ser revista. As contas probabilísticas continuam válidas em seus cenários; a adequação das faixas às combinações de Técnicas fica pendente. Nenhuma regra do catálogo foi alterada.

## Item 3a · Esquiva Impossível: opção A aprovada

O autor decidiu marcar Esquiva Impossível (`esquiva-impossivel`) como pendente e adiar a definição do efeito até a régua. Na revisão, a Técnica permanece não determinável e sua ausência de efeito deve acompanhar a análise de dependentes. Não inventar um efeito a partir do nome, do nível ou do custo.

Alteração preparada para futura aplicação à fonte: no registro de id `esquiva-impossivel`, trocar `pendente: false` por `pendente: true`, preservando o texto vazio e as referências existentes. A fonte não foi editada, pois continua fora da pasta autorizada para escrita. A decisão não autoriza excluir a Técnica nem fecha os demais problemas do item 3.

## Item 3b · Brecha Emocional: opção C aprovada

O autor decidiu adiar a escolha do efeito de Brecha Emocional (`brecha-emocional`) até depois da definição dos níveis e da padronização. Manter registradas as leituras de bônus na soma e de Margens adicionais, sem considerá-las equivalentes. Não escolher agora entre +6 na soma, +3 Margens ou outro valor. A conta anterior que usou +6 representa somente um cenário, não uma interpretação aprovada. Nenhum texto ou dado da Técnica foi alterado.

## Item 3c · Reflexos Premonitórios: decisão adiada

O autor decidiu deixar para depois a resolução do trecho de Reflexos Premonitórios (`reflexos-premonitorios`) que manda refazer uma rolagem de Defesa, embora as Defesas normais sejam passivas. Não foi escolhida a substituição por rerrolagem do ataque nem por bônus defensivo. A avaliação completa permanece pendente; a parte indefinida não vale zero. Retomar após a definição dos níveis e da padronização, explicitando jogada afetada, momento de declaração e resultado que prevalece.

Os três problemas do item 3 foram encaminhados para tratamento posterior, sem definição de novos efeitos. Seguir para o item 4.

## Item 4a · Omissão do dossiê e módulo opcional: em análise

**Decisão posterior do autor:** Fôlego não é usado e fica fora da revisão. Em seguida, solicitou explicitamente marcar e ocultar as Proezas relacionadas ao módulo, com cuidado para preservar fôlego no sentido de atividades físicas. Esse pedido autoriza a intervenção pontual no catálogo e na apresentação; não autoriza rebalancear o módulo nem a padronização geral ainda pendente.

Implementação local: nove Técnicas receberam `modulo: "folego"`; sua exibição depende da bandeira existente `MODULOS.folego`, que permanece desligada. São Fôlego Profundo (`folego-profundo`), Segundo Vento (`segundo-vento`), Marcha Forçada (`marcha-forcada`), Fôlego de Sobra (`folego-de-sobra`), Incansável (`incansavel`), Pulmões de Ferro (`pulmoes-de-ferro`), Sem Limites (`sem-limites`), Vigor Inesgotável (`vigor-inesgotavel`) e Coração Eterno (`coracao-eterno`). Todas pertencem a Coração Incansável; nenhum pré-requisito de Técnica externa depende delas.

Fôlego de Sobra pertence à cadeia do módulo e ignora sua penalidade de cansaço; não foi marcada por conter a palavra no nome. Marcha Forçada, Pulmões de Ferro e Vigor Inesgotável misturam benefícios físicos com manipulação explícita da reserva. Ficaram ocultas como entradas inteiras, sem recortar, reescrever ou criar versões alternativas de seus efeitos.

Segundo Fôlego (`segundo-folego`, cura de PV), Corpo Inóspito (`corpo-inospito`, sobrevivência sem ar), Aclimatação (`aclimatacao`) e Caça Implacável (`caca-implacavel`, perseguição por dias) permanecem disponíveis. O filtro usa o campo do JSON, não palavras do nome ou da descrição. Registros, ids, pré-requisitos, textos e compras antigas foram preservados. A contagem disponível passa de 461 para 452 Técnicas; o catálogo fonte continua com 461.

Verificação: teste automatizado `scripts/test-proezas-modulos.mjs` incluído em `npm run validate`; checagem de tipos aprovada; `verificar-ocultacao.mjs` conferiu o índice e o site gerado em navegador isolado, inclusive a preservação de uma compra antiga depois de salvar a ficha. A mudança permanece local, sem commit ou publicação.

A geração inicial avisou que a coleção de capítulos estava vazia. A atualização forçada pelo próprio Astro restaurou os 27 capítulos, produzindo 111 páginas; o índice de busca foi regerado e a conferência de ocultação no navegador passou novamente. Nenhuma pasta foi apagada manualmente.

Arquivos tocados nesta implementação: `src/data/tecnicas.json`, `src/content.config.ts`, `src/lib/modulos.ts`, `src/lib/data.ts`, `src/lib/ficha-engine.ts`, `src/components/ArvoreTecnicas.astro`, `src/pages/caminhos/[id].astro`, `src/pages/index.astro`, `src/pages/marcadores.astro`, `scripts/test-proezas-modulos.mjs`, `package.json`, `docs/export/proezas/chatgpt/verificar-ocultacao.mjs` e este registro. Os arquivos de mapas que já estavam alterados não foram tocados.

### Levantamento anterior à decisão

Consulta suplementar ao livro localizou as regras omitidas: `src/content/chapters/combate.md:353` apresenta Fôlego e Esforço como módulo avançado desligado por padrão; `src/content/chapters/folego.md` define reserva, custos, recuperação e Esforço; `src/content/chapters/combate.md:451` define pagamento único, duração de cena e limite de Centelha para posturas sustentadas. Logo, não tratar a omissão no dossiê como inexistência dessas regras no sistema.

Falta escolher como a avaliação tratará Técnicas que dependem do módulo opcional, sem confundir Fôlego com Energia. A leitura também mostra que o capítulo do módulo contém tabelas numéricas escritas em Markdown; verificar suas fontes e geração na frente de padronização antes de concluir que há duplicação manual. Nenhuma solução para o item 4 foi aprovada ainda.

## Escopo adicional · Padronização dos dados e das tabelas

Pedido do autor: padronizar o JSON das Proezas e verificar se as Artes estão padronizadas, evitando tabelas com valores de regra escritos diretamente na apresentação em vez de consultados em uma fonte de dados.

Tratar como frente adicional da mesma revisão, sem antecipar a régua nem alterar regras durante uma migração de formato. Levantar `src/data/tecnicas.json`, `src/data/artes.json`, `src/data/efeitos.json`, as escalas em `src/data/regras.json` e os componentes, capítulos e geradores que os consomem. Verificar tipos, unidades, referências, exceções, pendências e duplicação entre texto, escala e tabela. Conferir Artes e seus efeitos, não só o catálogo de nomes das Artes.

Critério de trabalho proposto, ainda sem schema aprovado: valores mecânicos têm fonte canônica e estrutura verificável; apresentação formata os valores, mas não cria ou duplica regras. Strings e números continuam sendo tipos legítimos no JSON; o problema é a regra escondida em texto livre ou repetida manualmente na tabela. Efeitos específicos não devem ser substituídos automaticamente pela escala genérica só para padronizar o formato.

Achado inicial em leitura: `src/components/ArvoreTecnicas.astro:46` já consulta `regras.escalasProeza.trilhas[efeito].valores[nivel-1]` para obter um modificador apresentado. O texto individual também pode conter números próprios. É necessário conferir a concordância entre essas fontes antes de escolher qual informação deve alimentar a apresentação. Isso não constitui auditoria concluída das Artes.

Entregas futuras: inventário de fontes e consumidores, proposta de estrutura e validações, e plano de migração com comparação antes/depois. Implementação fora de `docs/export/proezas/chatgpt/` permanece pendente de ampliação explícita do escopo de escrita.
