# 01 · Régua das Proezas após decisões do autor

26/09/2026 · A1–A5 incorporadas. **G15 permanece proposta do autor, pendente.** Régua entregue para revisão, sem lotes, sem mudança de preço ou poder do site.

Esta versão substitui integralmente a anterior. A1a/A1b, perfis por Centelha, moeda editorial P, conversão de capacidades qualitativas em pontos e antigas medianas deixam de ser critérios vigentes. `calculos.md`, `inventario.md`, `distribuicao.md`, `auditoria.json` e `calcular.py` preservam análises anteriores, mas não validam esta régua nem devem reaplicar suas hipóteses. A reprodução desta versão está no apêndice.

**DECISÃO** é a instrução aprovada do autor; **FATO**, conteúdo da fonte; **INFERÊNCIA**, conta ou diagnóstico condicional; **PROPOSTA PENDENTE** não pode ser implementada como regra fechada.

## 1. Referência e unidade

**DECISÃO A1:** usar `regras.dificuldade`, sem perfil por Centelha. Perfis de teste: somas **6, 9 e 12**, Competente, Perito e Mestre. Atributo e Habilidade param em 6 nesta revisão; Herói e Semideus são patamares de tarefa alcançados por Proeza, não aumentos do pool básico acima de soma 12. Implementar esse limite no restante do sistema está fora desta entrega.

**FATO:** a fonte liga D5/10/15/20/25/30 às somas 3/6/9/12/15/18, incluindo `"12 · Mestre"` e `"18 · Semideus"` ([src/data/regras.json:661](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:661)). Rolagem: piso(S/2)d6, mais +2 quando S é ímpar; empate falha ([docs/export/proezas/centelha-dossie.md:29](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/centelha-dossie.md:29)).

**INFERÊNCIA · Conferência da associação publicada:**

| Soma de referência | Proficiência | D própria | Rolagem | Chance |
|---:|---|---:|---|---:|
| 3 | Iniciante | 5 | 1d6+2 | 50,0000% |
| 6 | Competente | 10 | 3d6 | 50,0000% |
| 9 | Perito | 15 | 4d6+2 | 55,6327% |
| 12 | Mestre | 20 | 6d6 | 54,6425% |
| 15 | Herói | 25 | 7d6+2 | 58,5795% |
| 18 | Semideus | 30 | 9d6 | 57,6148% |

Somas 15/18 entram somente para conferir a tabela histórica, **não como perfis jogáveis desta régua**. Estar à altura da tarefa significa cerca de 50% a 59% de sucesso, não certeza.

**DECISÃO:** **+5 de bônus = um degrau de Dificuldade**. É equivalência exata de limiar, não de dados, custo ou utilidade total:

`P(X+B>D) = P(X+B+5>D+5)`.

Mestre: 6d6>D20, 6d6+5>D25 e 6d6+10>D30 dão **54,6425%**. O último caso mantém a chance de enfrentar uma tarefa dois degraus acima.

Fórmula: `n=piso(S/2)`, `fixo=2×(S mod 2)`, sucesso se `soma(nd6)+fixo+B>D`. Média sem bônus: `3,5n+fixo`, ou 10,5/16/21 nos três perfis. As contas abaixo enumeram resultados equiprováveis; não usam média como resultado garantido.

## 2. Escala total e substituição

**DECISÕES A2/A3, atualização do autor:** `B(N)=3N`: **3/6/9/12/15/18**. Substitui a aprovação anterior de 3/5/8/10/13/15. Motivo: progressão numérica em todos os níveis, sem platôs ímpares. N é o nível comprado da Técnica, limitado pela Centelha; subir Centelha não concede upgrades automaticamente.

| N | Total | Ganho sobre anterior | Degraus de D, B/5 |
|---|---:|---:|---:|
| 1 | +3 | +3 | 0,60 |
| 2 | +6 | +3 | 1,20 |
| 3 | +9 | +3 | 1,80 |
| 4 | +12 | +3 | 2,40 |
| 5 | +15 | +3 | 3,00 |
| 6 | +18 | +3 | 3,60 |

São **totais**, não parcelas acumuladas. Vale o maior bônus por **família e escopo**, preservando capacidades qualitativas diferentes. Família precisa de marcação: não é sinônimo automático de Caminho nem de pré-requisito.

**FATO · Exceção publicada:**

> **Absorção de Proeza** não soma entre passivas: vale a **maior** de cada tipo de dano (Impacto, Corte, Perfuração).

Fonte: [src/content/chapters/combate.md:457](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/combate.md:457). Preservar também a distinção de bônus reflexivos/de cena do mesmo parágrafo, uma reflexiva por gatilho (437), até C posturas (451), teto situacional ±6 para Defesa reflexiva (458) e uma ação extra a cada 6 Ticks (459).

**Limite:** escala de bônus para jogadas não substitui automaticamente dano, Absorção, carga, velocidade, alcance ou duração. Não concede +15 de Defesa reflexiva acima do teto nem +15 de Absorção por ser N6. Aplicações passivas seguem a regra específica pertinente; não converter toda grandeza para esta escala. Longas são tratadas separadamente em G15.

## 3. Chances: atual versus aprovada em uma única tabela

**INFERÊNCIA:** cada célula mostra **atual → aprovada**, em porcentagem. N0 é controle sem Proeza. Atual: 3/4/6/9/12/15, consultada em [src/data/regras.json:119](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:119), ainda sem alteração nesta entrega.

São testes genéricos: sem Centelha, Firula, equipamento, especialidade, ferimento ou outro poder. Não são chances prontas de combate, que exige modificadores e Defesa reais. N é o nível da Técnica aplicável, sem vincular S a Centelha; permanece o gate N≤Centelha.

| Perfil / soma | N | Bônus atual → aprovado | D10 | D15 | D20 | D25 | D30 |
|---|---:|---|---|---|---|---|---|
| Competente / 6 | 0 | +0 → +0 | 50,00% → 50,00% | 4,63% → 4,63% | 0,00% → 0,00% | 0,00% → 0,00% | 0,00% → 0,00% |
| Competente / 6 | 1 | +3 → +3 | 83,80% → 83,80% | 25,93% → 25,93% | 0,46% → 0,46% | 0,00% → 0,00% | 0,00% → 0,00% |
| Competente / 6 | 2 | +4 → +6 | 90,74% → 98,15% | 37,50% → 62,50% | 1,85% → 9,26% | 0,00% → 0,00% | 0,00% → 0,00% |
| Competente / 6 | 3 | +6 → +9 | 98,15% → 100,00% | 62,50% → 90,74% | 9,26% → 37,50% | 0,00% → 1,85% | 0,00% → 0,00% |
| Competente / 6 | 4 | +9 → +12 | 100,00% → 100,00% | 90,74% → 99,54% | 37,50% → 74,07% | 1,85% → 16,20% | 0,00% → 0,00% |
| Competente / 6 | 5 | +12 → +15 | 100,00% → 100,00% | 99,54% → 100,00% | 74,07% → 95,37% | 16,20% → 50,00% | 0,00% → 4,63% |
| Competente / 6 | 6 | +15 → +18 | 100,00% → 100,00% | 100,00% → 100,00% | 95,37% → 100,00% | 50,00% → 83,80% | 4,63% → 25,93% |
| Perito / 9 | 0 | +0 → +0 | 94,60% → 94,60% | 55,63% → 55,63% | 9,72% → 9,72% | 0,08% → 0,08% | 0,00% → 0,00% |
| Perito / 9 | 1 | +3 → +3 | 99,61% → 99,61% | 84,10% → 84,10% | 33,56% → 33,56% | 2,70% → 2,70% | 0,00% → 0,00% |
| Perito / 9 | 2 | +4 → +6 | 99,92% → 100,00% | 90,28% → 97,30% | 44,37% → 66,44% | 5,40% → 15,90% | 0,00% → 0,39% |
| Perito / 9 | 3 | +6 → +9 | 100,00% → 100,00% | 97,30% → 99,92% | 66,44% → 90,28% | 15,90% → 44,37% | 0,39% → 5,40% |
| Perito / 9 | 4 | +9 → +12 | 100,00% → 100,00% | 99,92% → 100,00% | 90,28% → 98,84% | 44,37% → 76,08% | 5,40% → 23,92% |
| Perito / 9 | 5 | +12 → +15 | 100,00% → 100,00% | 100,00% → 100,00% | 98,84% → 100,00% | 76,08% → 94,60% | 23,92% → 55,63% |
| Perito / 9 | 6 | +15 → +18 | 100,00% → 100,00% | 100,00% → 100,00% | 100,00% → 100,00% | 94,60% → 99,61% | 55,63% → 84,10% |
| Mestre / 12 | 0 | +0 → +0 | 99,55% → 99,55% | 90,35% → 90,35% | 54,64% → 54,64% | 14,46% → 14,46% | 0,99% → 0,99% |
| Mestre / 12 | 1 | +3 → +3 | 99,98% → 99,98% | 98,03% → 98,03% | 79,42% → 79,42% | 36,31% → 36,31% | 6,08% → 6,08% |
| Mestre / 12 | 2 | +4 → +6 | 100,00% → 100,00% | 99,01% → 99,82% | 85,54% → 93,92% | 45,36% → 63,69% | 9,65% → 20,58% |
| Mestre / 12 | 3 | +6 → +9 | 100,00% → 100,00% | 99,82% → 100,00% | 93,92% → 99,01% | 63,69% → 85,54% | 20,58% → 45,36% |
| Mestre / 12 | 4 | +9 → +12 | 100,00% → 100,00% | 100,00% → 100,00% | 99,01% → 99,94% | 85,54% → 96,41% | 45,36% → 72,06% |
| Mestre / 12 | 5 | +12 → +15 | 100,00% → 100,00% | 100,00% → 100,00% | 99,94% → 100,00% | 96,41% → 99,55% | 72,06% → 90,35% |
| Mestre / 12 | 6 | +15 → +18 | 100,00% → 100,00% | 100,00% → 100,00% | 100,00% → 100,00% | 99,55% → 99,98% | 90,35% → 98,03% |

Mestre N6 contra D30: **98,0324%**; Perito N6: **84,1049%**. O patamar é mais forte que o antigo +15 (90,3528% e 55,6327%, respectivamente). A referência textual a +15 em `centelha.md:65` permanece na fonte, mas não define mais o teto decidido nesta revisão.

**Diretriz do autor:** calibrar o aumento em conjunto com itens, magias/Artes, artefatos e demais bônus. Comparar com 0/5/5/10/10/15: o acréscimo é +3/+1/+4/+2/+5/+3. Não pressupor compensação já feita nem elevar automaticamente todas as Dificuldades; medir combinações, disponibilidade e regras de acumulação antes de propor ajustes. Nenhuma mudança nesses sistemas é implementada nesta frente.

100,00% pode incluir arredondamento; o apêndice conserva frações exatas. Sucesso é realmente garantido quando o mínimo já supera D. Mesmo com acerto saturado, bônus pode aumentar Margens: não concluir ganho de dano nulo.

**Margens:** cada seis pontos completos acima do alvo dão uma Margem (dossiê, linha 38). Degrau de D tem cinco pontos, Margem tem seis. +5 não equivale a uma Margem; +15 não dá três Margens garantidas. Dano exige calcular acerto e Margens juntos.

**Combate:** Centelha igual dos dois lados, com mesma incidência em ataque/Defesa, cancela-se na diferença; bônus iguais de Técnica também podem se cancelar. Esta tabela só aplica bônus de um lado. Manter +1 por Centelha vigente enquanto D7 não for revisto pelo projeto; a decisão de escala não decide D7.

## 4. Eficiência de XP contra Habilidade

### Referência e paridade

**DECISÃO A4:** diferença só nas evoluções marcadas; capacidade independente paga inteira. Preços base preservados.

**FATO:** Habilidade primária: `base:4`, `mult:2`; o ponto 3→4 custa `4+2×4=12 XP`. Técnica: `base:5`, `mult:5`, portanto `P(N)=5+5N`. Fontes: [src/data/regras.json:570](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:570) e [src/data/regras.json:634](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:634).

**INFERÊNCIA crítica:** ganho de um ponto de Habilidade é **+2 na média** se soma par vira ímpar, ou **+1,5** se ímpar vira par. Para essa compra, são 6 ou 8 XP por +1 de média. O comparador médio adotado é **12/1,75=48/7=6,8571 XP/+1**, aproximadamente 7, não uma identidade de toda ficha. Mesma média não garante mesma distribuição de sucesso entre dado e bônus fixo.

### Evolução marcada: eficiência marginal e total

Bancada de seis nós de evolução do mesmo bônus, sem capacidades paralelas: primeiro paga inteiro, seguintes pagam diferença. Não afirma que toda árvore real tem seis nós em linha. A soma de diferenças dá P(N) investido até N.

| N | B total | ΔB | Preço inteiro | ΔXP evolução | XP/+1 marginal | XP total/+1 total |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 3 | 3 | 10 | 10 | 3,33 | 3,33 |
| 2 | 6 | 3 | 15 | 5 | 1,67 | 2,50 |
| 3 | 9 | 3 | 20 | 5 | 1,67 | 2,22 |
| 4 | 12 | 3 | 25 | 5 | 1,67 | 2,08 |
| 5 | 15 | 3 | 30 | 5 | 1,67 | 2,00 |
| 6 | 18 | 3 | 35 | 5 | 1,67 | 1,94 |

**INFERÊNCIA:** entrada custa 3,33 XP/+1; toda evolução seguinte custa 1,67 XP/+1, contra 6,8571 na referência média de Habilidade. Salto marcado N1→N3: 10 XP por +6, também 1,67 XP/+1. São preços mais baratos no comparador bruto, sem prova automática de desequilíbrio: a Proeza tem escopo e disponibilidade próprios.

Definir `f` como fração dos usos relevantes da Habilidade nos quais a Técnica se aplica e está disponível. Triagem: custo comparável `(XP/ΔB)/f`. Empate com Habilidade ocorre em f=48,61% na entrada e 24,31% nas evoluções N2–N6. Acima dessas frequências, Proeza fica mais barata na triagem; abaixo, mais cara. Com f=25%, entrada custa 13,33 e evolução 6,67 XP por unidade comparável; com f=50%, 6,67 e 3,33. A aproximação não captura distribuição, Margens ou efeitos qualitativos.

**Compra independente:** se abre outro escopo, usar preço inteiro dividido pelo bônus total da tabela. Se substitui o bônus de N−1 no mesmo escopo sem evolução marcada, o ganho é apenas +3: N2–N6 custam respectivamente 5,00/6,67/8,33/10,00/11,67 XP por +1 líquido. N4–N6 já superam a referência média antes da restrição de escopo; N3 fica próximo; N2 abaixo. Não deduzir pré-requisitos como crédito sem marcação de evolução.

**Recomendação de calibração:** conferir preços e escopos junto aos demais bônus, pois agora todos os upgrades marcados têm a eficiência antes restrita a N3/N5. Pró: progressão uniforme; contra: comprar bônus recorrentes pode superar amplamente investir em Habilidade. Preços base permanecem intactos nesta decisão.

## 5. G15: proposta de +nível, corrigida pela curva de renda

**PROPOSTA PENDENTE DO AUTOR:** somar o nível da Proeza, +1 a +6, à média da Longa; a escala 3/6/9/12/15/18 continua nas jogadas.

**FATO:** `modelo.py:70–75` chama `renda_ficha`, importada de `base.py:65–75`. Ela escolhe o maior `(média+bônus−Dif)×valor` entre faixas acessíveis à Habilidade: D4 a 20 pc; D7 a 260/7≈37,14 pc; D11 a 468/7≈66,86 pc. Requisitos de Habilidade: 0/2/4. Fontes: [lore/economia/v2/modelo.py:70](C:/Users/Neves/ClaudeCode/centelha/rpg-system/lore/economia/v2/modelo.py:70) e [lore/economia/v2/base.py:60](C:/Users/Neves/ClaudeCode/centelha/rpg-system/lore/economia/v2/base.py:60).

**INFERÊNCIA calculada:** soma 9 usa Habilidade 4 e média 16; soma 12 usa Habilidade 6 e média 21. Ambas podem trabalhar em D11. Valores antes de arredondamento editorial de renda; não aplicar o arredondamento de preços de loja.

| Soma / Habilidade | Bônus na Longa | Melhor D | Renda pc/semana | Razão sobre sem Proeza |
|---|---:|---|---:|---:|
| 9 / 4 | +0 | 7 ou 11 | 334,29 | 1,000× |
| 9 / 4 | +1 | 11 | 401,14 | 1,200× |
| 9 / 4 | +2 | 11 | 468,00 | 1,400× |
| 9 / 4 | +3 | 11 | 534,86 | 1,600× |
| 9 / 4 | +4 | 11 | 601,71 | 1,800× |
| 9 / 4 | +5 | 11 | 668,57 | 2,000× |
| 9 / 4 | +6 | 11 | 735,43 | 2,200× |
| 9 / 4 | +15 | 11 | 1337,14 | 4,000× |
| 9 / 4 | +18 | 11 | 1537,71 | 4,600× |
| 12 / 6 | +0 | 11 | 668,57 | 1,000× |
| 12 / 6 | +1 | 11 | 735,43 | 1,100× |
| 12 / 6 | +2 | 11 | 802,29 | 1,200× |
| 12 / 6 | +3 | 11 | 869,14 | 1,300× |
| 12 / 6 | +4 | 11 | 936,00 | 1,400× |
| 12 / 6 | +5 | 11 | 1002,86 | 1,500× |
| 12 / 6 | +6 | 11 | 1069,71 | 1,600× |
| 12 / 6 | +15 | 11 | 1671,43 | 2,500× |
| 12 / 6 | +18 | 11 | 1872,00 | 2,800× |

A soma 9 sem bônus empata entre D7 e D11; com bônus positivo, D11 vence. O Mestre passa de 668,57 para 1.069,71 com +6 (×1,6), ou 1.671,43 com +15 (×2,5). O Perito passa de 334,29 para 735,43 (×2,2) ou 1.337,14 (×4). As frações completas evitam desvios causados por usar 37,14/66,86 já arredondados.

O comparador +15 foi preservado como histórico; a nova escala em jogadas chega a +18. Se fosse aplicada integralmente à Longa, produziria 1.537,71 no Perito (×4,6) e 1.872,00 no Mestre (×2,8). Isso é cenário de comparação, não regra aprovada.

**Conclusão substitutiva, PROPOSTA:** recomendo aprovar +N na Longa. Motivo: premia especialização com crescimento de renda moderado no Mestre e preserva maior espaço para ofício/qualidade; pró: ×1,6 em vez de ×2,8 ao comparar com o novo teto +18; contra: o Perito ainda ganha ×2,2, portanto a progressão favorece proporcionalmente quem parte de renda menor.

A antiga conta ×16/×7 era o excedente local contra D20, não a renda otimizada do trabalhador, e não fundamenta mais a conclusão econômica. A proposta permanece pendente, sem alterar economia ou conferir bônus a uma Técnica inaplicável ao ofício.

Reprodução: `m=3,5×piso(S/2)+2×(S mod 2)`; `r=max((m+b−d)×v)` para `(d,v,req)=(4,20,0),(7,260/7,2),(11,468/7,4)`, incluindo só `H≥req` e `m+b>d`. A curva não presume que toda localidade compre produção ilimitada.

## 6. Quatro personagens: conferência do bestiário

**DECISÃO A5:** quatro personagens.

**FATO:**

> Definição do autor: nível de desafio X é feito para um grupo de 4 personagens de Centelha X, com

Fonte: [docs/pendencias/B-bestiario.md:118](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/pendencias/B-bestiario.md:118). Também confirmado no comentário econômico, linha 445, e `grupo=4`, linha 468 ([lore/economia/v2/modelo.py:445](C:/Users/Neves/ClaudeCode/centelha/rpg-system/lore/economia/v2/modelo.py:445)); no `"grupo": 4` de [src/data/recompensas.json:96](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/recompensas.json:96); e no valor inicial 4 da calculadora ([src/components/CalculadoraRecompensa.astro:24](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/components/CalculadoraRecompensa.astro:24)).

**Resultado:** definição do bestiário e parâmetro de recompensa concordam com quatro; nenhuma divergência nesses pontos atuais. Isso confirma referência de calibração, **não que todas as criaturas já foram rebalanceadas**. Não executar recalibração nesta frente. Atas antigas com três não substituem fontes atuais.

Apoio incluindo usuário pode beneficiar quatro; só aliados, três, se todos forem elegíveis. Contar alvos e aplicações reais, não multiplicar todo efeito por quatro. Grupo não determina pool individual. Recompensa usa grupo de referência na bolsa e grupo real na divisão: variáveis diferentes.

## 7. Aplicação da régua, sem antecipar lotes

Bônus puro: comparar B(N), chances nos três perfis, Margens, escopo, frequência e XP. Composto: separar parcelas conhecidas e conservar incerteza das demais. Capacidade qualitativa não vale automaticamente B(N). A conversão universal em P foi retirada.

Dano, Absorção, cura, ação extra, informação, controle e imunidade exigem resultados/limites próprios. Sem alcance, alvo, duração ou resistência, usar diagnóstico condicional ou “não determinável”, não zero nem nota inventada. Não preencher parâmetro para forçar encaixe no nível.

Passiva, reflexiva, ativa e postura têm oportunidades e custos diferentes. Firula altera chance e recupera reserva: declarar cenários, sem decretar frequência típica não fornecida pelo autor. Nenhuma nova frequência ou trava de uso é aprovada neste documento.

Continuam adiadas Esquiva Impossível, Brecha Emocional, Reflexos Premonitórios, divergência de Machucado e quantificação dos textos vagos. Fôlego segue fora; não reabrir a implementação nem confundir Segundo Fôlego, cura de PV, com o módulo.

## 8. Dados: direção aprovada, primeira etapa mínima

**DECISÃO sobre 06:** aprovada a direção. Primeira etapa limitada a nível; custo (compra/uso preservados); família e escopo; evolução marcada; bônus numérico tipado; e três estados distintos em **alcance, área e duração**: `nao_se_aplica`, `ainda_nao_definido`, `usa_regra_padrao`. Valor conhecido usa `definido`. Não converter ausente em zero nem narrativa vaga em regra padrão.

Árvore completa de operações e demais campos entram **lote por lote, depois**. Não exigir antecipadamente o contrato amplo do 06 para a etapa mínima. Procedência e equivalência mecânica permanecem exigidas.

Padronização não muda poder; aplicar a nova escala ao catálogo será rebalanceamento separado e autorizado. E01/E03/E04/E06 já foram encaminhados à equipe do projeto: esta frente não os corrige nem alega que foram resolvidos.

## 9. Ponto de parada

A1–A5 incorporadas; G15 calculada e mantida pendente. Sem mudança de preços, schema, site ou avaliações individuais. Régua entregue para aprovação; **nenhum lote iniciado**.

## 10. Consequências de 3N: extensão proposta e saturação

Esta seção distingue **FATO**, **INFERÊNCIA calculada** e **PROPOSTA**. A3=3N continua aprovada; nomes de novos degraus, convivência e arquitetura aguardam aprovação.

### 10.1. Acima de Semideus

**FATO:** a tabela publicada liga soma 18 a Semideus/D30; sua chance é 57,6148%. Essa soma é referência histórica, não autorização para Atributo/Habilidade acima de 6. Fonte: [regras.json:661](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:661).

**PROPOSTA recomendada:** acrescentar D35 **Mítico**, tarefa além do patamar de Semideus, que exige alta especialização sobrenatural; e D40 **Transcendente**, extremo destinado a feitos culminantes ou circunstâncias excepcionais. São nomes da tarefa, não novas Centelhas nem pisos obrigatórios de encontro. Motivo: nomear espaço que 3N já alcança; pró: mantém resolução em degraus de cinco; contra: amplia o teto descritivo do livro e exige atualizar sua redação se aprovado.

| Perfil | Técnica | Bônus | D30, controle | D35, Mítico | D40, Transcendente |
|---|---:|---:|---:|---:|---:|
| Soma 9 | N5 | +15 | 55,6327% | 9,7222% | 0,0772% |
| Soma 9 | N6 | +18 | 84,1049% | 33,5648% | 2,7006% |
| Soma 12 | N5 | +15 | 90,3528% | 54,6425% | 14,4633% |
| Soma 12 | N6 | +18 | 98,0324% | 79,4153% | 36,3104% |

**Recomendação:** usar D35/D40 apenas quando a tarefa justificar, sem deslocar D10–D30 para neutralizar personagens. Motivo: avanço deve continuar perceptível; pró: preserva as conquistas; contra: D30 permanece muito confiável no topo.

### 10.2. Saturação acima de 95%, sem compensação proposta

**FATOS:** Firula 1 dá +2, Firula 2 +1d6, Firula 3 +2d6; são alternativas no lance, não parcelas somadas. Especialidade rola um dado adicional e descarta um menor por nível aplicável. Primária H4 permite duas Especialidades concentradas, H6 três. Espada Longa tem Acerto +1, Adaga +2. Fontes: [habilidades.md:82](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/habilidades.md:82), [habilidades.md:93](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/habilidades.md:93), [habilidades.md:104](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/habilidades.md:104), [armas.json:84](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/armas.json:84), [armas.json:3](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/armas.json:3).

**Hipóteses da bancada:** N6=+18 em todos os perfis; soma 6=A3/H3, soma 9=A5/H4, soma 12=A6/H6, respectivamente k=1/2/3 Especialidades concentradas e aplicáveis. Soma sozinha não determina k. Equipamento E=+1 de Acerto de Espada Longa só vale em ataque compatível; em outra tarefa use E=0, não conceda bônus de arma. Não acrescento +Centelha de combate, FV, ferimentos ou artefatos desconhecidos: o efeito de qualquer fixo adicional c é deslocar todos os limiares abaixo em +c.

**INFERÊNCIA condicional:** a tabela usa rolagem conjunta: rolar `floor(S/2)+f+k` dados e descartar os k menores; somar paridade, +18, E e o +2 de Firula 1. f=0/1/2. Isso é a convenção recomendada de resolução, não uma ordem explicitada nas fontes consultadas; a sensibilidade à resolução separada aparece abaixo.

D95 é a **maior D inteira** com P(resultado>D)>95%; toda D menor também satura. A coluna seguinte prova a fronteira em D95+1. O degrau publicado/proposto é o maior múltiplo de cinco que ainda satura. Não confundir >95% com sucesso garantido.

| Soma | Combinação além de +18 | D95 | P em D95 | P em D95+1 | Maior degrau de 5 saturado |
|---|---|---:|---:|---:|---:|
| 6 | nenhuma | 23 | 95,3704% | 90,7407% | D20 |
| 6 | Especialidade + equipamento | 25 | 97,2222% | 94,2901% | D25 |
| 6 | Especialidade + equipamento + Firula 1 | 27 | 97,2222% | 94,2901% | D25 |
| 6 | Especialidade + equipamento + Firula 2 | 28 | 96,6950% | 93,9300% | D25 |
| 6 | Especialidade + equipamento + Firula 3 | 31 | 96,3670% | 93,8036% | D30 |
| 9 | nenhuma | 27 | 97,2994% | 94,5988% | D25 |
| 9 | Especialidade + equipamento | 32 | 95,7969% | 92,6055% | D30 |
| 9 | Especialidade + equipamento + Firula 1 | 34 | 95,7969% | 92,6055% | D30 |
| 9 | Especialidade + equipamento + Firula 2 | 35 | 95,7933% | 93,0198% | D35 |
| 9 | Especialidade + equipamento + Firula 3 | 38 | 95,8300% | 93,3659% | D35 |
| 12 | nenhuma | 31 | 96,4120% | 93,9236% | D30 |
| 12 | Especialidade + equipamento | 37 | 96,9517% | 94,9977% | D35 |
| 12 | Especialidade + equipamento + Firula 1 | 39 | 96,9517% | 94,9977% | D35 |
| 12 | Especialidade + equipamento + Firula 2 | 41 | 95,3397% | 92,8891% | D40 |
| 12 | Especialidade + equipamento + Firula 3 | 44 | 95,6204% | 93,4635% | D40 |

Para Adaga E=+2, todos os D95 sobem exatamente 1 frente à espada; para E=0, caem 1 nas linhas equipadas. Isso não presume acesso universal a qualquer bônus de artefato.

**Sensibilidade:** se os dados de Firula forem somados depois de descartar os dados da Especialidade, o D95 fica:

| Soma | Firula 2, conjunto / separado | Firula 3, conjunto / separado |
|---|---:|---:|
| 6 | 28 / 28 | 31 / 31 |
| 9 | 35 / 35 | 38 / 38 |
| 12 | 41 / 40 | 44 / 43 |

**PROPOSTA recomendada de procedimento:** juntar os dados e descartar por último. Motivo: uma única parada com número de descartes conhecido; pró: resolução simples; contra: favorece ligeiramente a combinação. Isto fixa uma hipótese operacional, não propõe compensação de saturação. Nenhum bônus, teto ou preço foi reduzido nesta seção.

Reprodução exata: enumerar multisets de faces a, com peso `m! / produto(contagem_face!)`; descartar k menores e somar os demais. O denominador é `6**m`. Somar pesos acima de D para a chance; buscar a maior D com fração estritamente maior que 19/20. Na variante separada, convoluir o pool selecionado com f dados comuns. Mantém-se a comparação estrita, sem arredondar antes de escolher D95.

### 10.3. Aviso ao bestiário

**PROPOSTA recomendada:** criatura de desafio N deve ser testada contra quatro personagens C=N, incluindo +3N em jogadas do escopo comprado e eventual Técnica defensiva sob sua regra própria e teto ±6, sem presumir +3N automático em toda Defesa ou compensá-lo elevando toda ficha da criatura.

Motivo: testar o pacote real do grupo; pró: evita subestimar especialização; contra: exige conferir quais Técnicas realmente se aplicam.

## Apêndice · Reprodução dos cálculos

Python padrão; sem rede e sem escrita de arquivos. Frações preservam chances exatas. A apresentação arredonda a duas casas, a conferência a quatro. Imprimir a fração distingue sucesso garantido de porcentagem arredondada para 100%.

```python
from collections import Counter
from fractions import Fraction
from functools import lru_cache

@lru_cache(None)
def dist(n):
    c = Counter({0: 1})
    for _ in range(n):
        nxt = Counter()
        for total, q in c.items():
            for face in range(1, 7):
                nxt[total + face] += q
        c = nxt
    assert sum(c.values()) == 6**n
    return c

def chance(s, d, b=0):
    n = s//2
    fixo = 2*(s % 2) + b
    return Fraction(sum(q for t, q in dist(n).items()
                        if t+fixo > d), 6**n)

nova = [3*n for n in range(1, 7)]
atual = [3, 4, 6, 9, 12, 15]
for s, d in zip([3, 6, 9, 12, 15, 18], [5, 10, 15, 20, 25, 30]):
    print('Referencia', s, d, chance(s, d), float(100*chance(s, d)))
for s in [6, 9, 12]:
    for n, (a, b) in enumerate(zip([0]+atual, [0]+nova)):
        print('Chances', s, n, [(d, chance(s, d, a), chance(s, d, b))
                               for d in range(10, 31, 5)])
prev_b = prev_p = 0
for n, b in enumerate(nova, 1):
    preco = 5+5*n
    r = Fraction(preco-prev_p, b-prev_b)
    print('XP', n, 'marginal', r, 'total', Fraction(preco, b),
          'f de empate', r/Fraction(48, 7))
    prev_b, prev_p = b, preco
for s in [9, 12]:
    media = Fraction(7, 2)*(s//2) + 2*(s % 2)
    for d in [15, 20]:
        print('Longa pendente', s, d, [max(0, media+n-d) for n in range(7)])
assert nova == [3, 6, 9, 12, 15, 18]
assert chance(2, 6) == 0
assert chance(2, 5) == Fraction(1, 6)
assert chance(12, 20) == chance(12, 25, 5) == chance(12, 30, 10)
assert Fraction(54, 100) < chance(12, 20) < Fraction(55, 100)
assert Fraction(90, 100) < chance(12, 30, 15) < Fraction(91, 100)
```

### Fotografia das fontes

| Fonte | SHA-256 na leitura |
|---|---|
| `src/data/regras.json` | `56d75812acc680a15f926f7453f70861771b46670aa863784577b10c6976dbf3` |
| `src/data/recompensas.json` | `f3764dd24da93978f0e4153981ab48252a8d80d70a4521b0370140d5e5175913` |
| `docs/pendencias/B-bestiario.md` | `a6480966d7e1420b728bfcfb1a5546bc0890e662e00c3dc31a8c91cef05b7a65` |
