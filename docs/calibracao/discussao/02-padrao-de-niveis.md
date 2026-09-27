# 02 · Padrão proposto dos níveis de Proeza

26/09/2026 · **PROPOSTA para aprovação**, salvo a escala de bônus e decisões anteriores já aprovadas. Exige Centelha ≥ N. Não altera dados do site; o único ensaio completo desta etapa está em `02p-piloto-pele-de-pedra.md`.

**Recomendação geral:** adotar a tabela por família com cobrança explícita de efeitos compostos, conforme método M1 revisado do 03; as seções 9 e 10 abaixo substituem o tratamento anterior de largura, permissões e composição. Motivo: preserva a escala decidida sem permitir comprar todos os máximos juntos; pró: leitura e auditoria simples; contra: algumas capacidades exigem julgamento editorial de escopo.

## 1. Contrato de leitura

Cada coluna é um teto para **um efeito principal**, não um pacote que inclui os doze itens. Alcance, área, alvos e duração usam graus das Artes, mas ocupam espaço no nível pelo método M1. Dano/cura são totais da ativação, não uma nova parcela a cada Tick. Bônus e Absorção da mesma família/escopo substituem-se.

Passiva gratuita é inferior à Arte equivalente em dano/cura por janela: dano fixo menor que um dado do mesmo nível; cura sem pulso de combate, com limite diário. Bônus de jogada mantém 3N no escopo E1 proposto na seção 9, inclusive passivo; ele não vira um dado extra de dano gratuito.

**Recomendação:** separar potência, cobertura e frequência. Motivo: dez ataques ou dez alvos multiplicam um efeito pequeno; pró: impede que duração esconda o benefício real; contra: exige declarar gatilho e término na ficha da Técnica.

## 2. Famílias numéricas: tetos por ativação

| Família | N1 | N2 | N3 | N4 | N5 | N6 |
|---|---|---|---|---|---|---|
| 1. Bônus em jogada, aprovado | +3 | +6 | +9 | +12 | +15 | +18 |
| 2. Dano extra ativo, um acerto | +1d6 | +1d6+2 | +2d6 | +3d6 | +4d6 | +5d6 |
| Dano passivo gratuito, escopo de ataque fixo | +1 ponto | +1 ponto | +2 pontos | +2 pontos | +3 pontos | +3 pontos |
| 3. Absorção ativa/reflexiva, um golpe | +2 | +3 | +4 | +6 | +8 | +10 |
| Absorção passiva, um tipo de dano escolhido | +1 | +2 | +3 | +4 | +5 | +6 |
| 4. Defesa reflexiva, um ataque | +3 | +4 | +5 | +6 | +6 | +6 |
| Defesa passiva, uma situação nomeada | +1 | +1 | +2 | +2 | +3 | +3 |
| 5. Cura ativa, pessoal/toque, total da ativação | 2 PV | 1d6 PV | 1d6+2 PV | 2d6 PV | 2d6+2 PV | 3d6 PV |
| Cura passiva adicional, por dia, fora de combate | +1 PV | +2 PV | +3 PV | +4 PV | +5 PV | +6 PV |

Defesa reflexiva compartilha o teto **situacional total ±6**, não recebe outro teto próprio; passiva situacional também conta nesse total nesta proposta. N5/N6 compram novas situações protegidas ou proteção de aliado pelo método, não +8/+10 de Defesa acima do teto. Absorção passiva de tipos distintos preserva o maior valor por tipo; ativa ampla e mitigação adicional são avaliadas como pacote.

**Cura:** recomendo limitar a duas ativações curativas de Proeza recebidas por alvo por dia, independentemente de quem cura; cada ativação pode ter pulsos, mas todos juntos respeitam o total. Cicatrização natural e Arte de Cura não consomem essa quota.

| Família | Recomendação e motivo | Prós | Contras |
|---|---|---|---|
| Bônus | Repetir 3/6/9/12/15/18, total substitutivo: decisão já aprovada. | Garante +3 em cada nível, sem platôs. | Escopo amplo continua valendo mais. |
| Dano | Adotar linha ativa ligeiramente abaixo de Nd6 da Arte e linha passiva em pontos. | Golpe ainda usa arma; passiva não entrega um feitiço inteiro em cada ataque. | Enfraquece passivas atuais de +1d6. |
| Absorção | Adotar linhas separadas e um tipo para a passiva. | Evita defesa gratuita contra tudo; sobe junto do golpe. | Exige marcar categoria e duração. |
| Defesa | Saturar em +6 e ampliar escopo nos níveis altos, cobrando parâmetros. | Respeita a regra publicada e conserva opções táticas. | N5/N6 não recebem número maior que N4. |
| Cura | Igualar a quantidade da Arte, mas restringir frequência/alvos/tipos de dano; usar quota diária. | Energia por cena não cria cura infinita entre cenas. | Exige registrar uma quota por paciente. |

## 3. Alcance, área, alvos e duração: graus compartilhados

**FATO:** `regras.arcano.improviso.graus` fornece graus 0–6. Área abaixo é **diâmetro**, não raio; a fonte avisa que a migração para moldes ainda está em andamento. Fonte: [src/data/regras.json:1307](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:1307).

| N | Grau máximo de um parâmetro | Alcance | Área: diâmetro | Alvos escolhidos | Duração breve máxima | Longa de utilidade máxima |
|---|---:|---|---|---:|---|---|
| 1 | 1 | 1 m | 1 m | 1 | 6 Ticks | 10 min |
| 2 | 2 | 2 m | 1,5 m | 2 | 12 Ticks | 1 h |
| 3 | 3 | 4 m | 2 m | 3 | 24 Ticks | 6 h |
| 4 | 4 | 10 m | 2,5 m | 4 | 60 Ticks | 1 dia |
| 5 | 5 | 20 m | 3 m | 6 | 120 Ticks | 1 semana |
| 6 | 6 | 50 m | 4 m | 10 | 300 Ticks | 1 mês |

Grau 0: próprio corpo/toque e instantâneo, no máximo 1 Tick na régua breve. Golpe suplementar acompanha alcance normal da arma sem transformar uma espada em ataque a distância. Área e alvos são alternativas de cobertura: se selecionar vítimas dentro da área, pagar ambos no método. Cura comum não usa área e divide o total entre os alvos.

**6. Recomendação:** teto g=N por parâmetro, com no máximo um parâmetro acima de metade do grau principal sem sobretaxa de nível. Motivo: usar o mesmo vocabulário das Artes sem dar geometria grátis; pró: contas compartilhadas; contra: distâncias são menores que a antiga tabela própria das Proezas.

**7. Recomendação:** breve para combate, longa só para informação/utilidade sem pulsos de dano/cura/controle hostil; duração de cena permanece uma categoria expressa para posturas publicadas, avaliada como grau 4 no método. Motivo: uma cena não tem duração fixa em Ticks; pró: preserva o texto existente sem equivalência falsa; contra: uma postura muito barata pode subir de nível.

## 4. Ação, controle, informação e exceções

| Família | N1 | N2 | N3 | N4 | N5 | N6 |
|---|---|---|---|---|---|---|
| 8. Ritmo da ação | Uma vez/cena: −1 Tick em sacar ou mover, mínimo 1 | Uma vez/cena: −2 Ticks na mesma classe, mínimo 1 | Reação de movimento até 2 m, sem ataque, 1/6 Ticks | −1 Tick em uma ação declarada, até 3/cena, mínimo 1 | Uma ação extra de movimento/interação, 1/cena | Uma ação extra inclusive ataque, 1/cena |
| 9. Controle, um alvo | −1 na próxima jogada, sem negar ação | −2 na próxima jogada ou deslocar 1 m | Uma ordem simples segura por até uma ação/6 Ticks | Prender/impedir uma categoria de ação por até 6 Ticks | Conduzir comportamento por 12 Ticks, teste a cada 6 | Controle por 24 Ticks, teste a cada 6; sem autodestruição |
| 10. Informação/percepção | Um sentido mais preciso em condição mundana | Ver em penumbra sem penalidade, até 2 m | Detectar presença oculta de uma categoria, até 4 m | Ver invisível ou através de barreira fina definida, até 10 m | Observar local conhecido remotamente até 1 km por 6 Ticks | Uma pergunta factual sobre sistema conhecido, com evidência, após 1 h |
| 11. Permissão sobrenatural | Impossibilidade pequena, vetor (0,0,0,0) | Um avanço de eixo | Dois avanços | Três avanços | Quatro avanços | Cinco avanços |

**8. Recomendação:** separar deslocamento/tempo de ataque extra; preservar teto publicado de **uma ação extra por 6 Ticks**, sem encadeamento. Motivo: uma ação extra carrega a ficha inteira; pró: evita multiplicar combos; contra: Ataque Relâmpago atual precisa reduzir frequência ou subir de patamar.

**9. Recomendação de resistência:** imposição mental usa Influência + Persuasão contra Defesa Mental; só somar bônus de outra Técnica numérica quando seu escopo se aplicar, sem B(N) embutido gratuitamente no controle; corpo usa Vigor + Resistência do alvo contra D=5N; agarrão exige acerto contra Esquiva e escapar depois com Força + Atletismo contra D=5N. A imposição mental exige superar a Defesa; empate impede a imposição. Na resistência corporal, o alvo evita o efeito se superar D=5N; empate não resiste. Na fuga, superar D liberta; empate não liberta. Durante controle N4–N6, o alvo recebe tentativa gratuita a cada 6 Ticks usando Vigor + Resistência para corpo ou Raciocínio + Integridade para mente, contra D=5N e com seu maior bônus pertinente; dano recebido encerra comando mental N3–N4. Motivo: dar resistência operacional, não cobrar FV obrigatória; pró: elimina domínio inevitável; contra: acrescenta testes periódicos.

**10. Recomendação:** separar detectar de identificar e reservar informação remota/estratégica aos níveis altos. O alcance de 1 km em N5 é exceção exclusiva de observação, sem projetar ataque/controle. N6 responde uma pergunta verificável, não verdade absoluta ou futuro garantido. Motivo: informação pode resolver aventuras; pró: cada degrau abre uma ferramenta clara; contra: exige preparação de pistas pelo mestre.

**11. Recomendação:** usar a escada da tabela; N4 pode ignorar dano de cortes não mágicos cujo dano bruto seja ≤4 por 6 Ticks, N5 pode ignorar dano não mágico por 6 Ticks, N6 pode reduzir pela metade dano recebido por 6 Ticks, arredondando para cima após Absorção. Nos dois casos de imunidade, só fontes com Centelha ≤ usuário; dano agravado nunca é coberto. Permissões de movimento usam os vetores da seção 10, que substituem os exemplos anteriores de voo/duração; regeneração exige a família própria de Cura, sem equivalência automática a movimento. Motivo: lendário não significa ilimitado; pró: há exemplos executáveis; contra: impõe limites novos a textos absolutos.

## 5. Custos propostos por nível

| N | Ativa/reflexiva comum | Cura ativa | FV adicional, ambas | Tempo da ativa independente | Limite de uso por cena |
|---|---:|---:|---:|---:|---|
| 1 | 1 Energia | 3 Energia | 0 | 5 Ticks | reserva disponível |
| 2 | 2 Energia | 4 Energia | 0 | 5 Ticks | reserva disponível |
| 3 | 3 Energia | 5 Energia | 0 | 5 Ticks | reserva disponível |
| 4 | 4 Energia | 6 Energia | 0 | 6 Ticks | 3 ativações |
| 5 | 5 Energia | 7 Energia | 1 | 7 Ticks | 2 ativações |
| 6 | 6 Energia | 8 Energia | 2 | 7 Ticks | 1 ativação |

**12. Recomendação:** manter Energia como combustível, **Mana=0 em toda Proeza**, e FV nos feitos de topo; passiva custa zero e usa a linha reduzida. Reflexiva custa zero Ticks, uma por gatilho; suplementar acompanha a ação; independente usa o tempo da tabela; ação extra/controle podem ter limite mais restrito. Motivo: preservar a divisão de recursos sem transformar preço alto em licença para qualquer poder; pró: custo fácil de lembrar; contra: reserva pequena torna o topo uma escolha rara.

Para permissões, os limites próprios da seção 10 substituem a coluna genérica de usos/tempo; nas demais famílias, limite por cena conta por família, evitando comprar clones para multiplicar usos; a quota curativa diária é por alvo. Postura publicada paga uma vez pela cena e ocupa vaga de postura; não recebe nova ativação gratuita ao trocar de nome.

## 6. Âncora quantitativa nas Artes

**FATO:** Cura da Arte = 2, 1d6, 1d6+2, 2d6, 2d6+2, 3d6; dano elemental padrão = Nd6. Cura cobra 2 Mana por grau de parâmetro; os demais, 1; Centelha desconta do total. Fontes: [src/lib/artes-fmt.ts:38](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/lib/artes-fmt.ts:38), [src/data/regras.json:2302](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:2302), [src/data/regras.json:1307](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:1307). Terra dobra dados e Ar/Sombra não têm dano; usar a Arte padrão como comparador, não essas exceções.

| N | Dano Arte | Dano extra Proeza ativa | Média Proeza / média Arte | Cura em ambas | Mana: dano grau N + alcance N, com C=N | Mana: cura N + toque grau 1, com C=N |
|---|---|---|---:|---|---:|---:|
| 1 | 1d6 | 1d6 | 100% | 2 | 1 | 3 |
| 2 | 2d6 | 1d6+2 | 78,6% | 1d6 | 2 | 4 |
| 3 | 3d6 | 2d6 | 66,7% | 1d6+2 | 3 | 5 |
| 4 | 4d6 | 3d6 | 75% | 2d6 | 4 | 6 |
| 5 | 5d6 | 4d6 | 80% | 2d6+2 | 5 | 7 |
| 6 | 6d6 | 5d6 | 83,3% | 3d6 | 6 | 8 |

A Arte de dano por toque pode custar zero quando grau≤C: não afirmar que toda Arte custa N Mana. A linha de alcance fornece comparação explícita de mesma ordem de preço nominal; uma Proeza de golpe acrescenta dano à arma, enquanto a Arte pode atacar a distância. Cura de Proeza recebe restrição de tipos/uso; Cura de Arte mantém versatilidade e regeneração por Ritual.

**Recomendação:** adotar esses valores, sem converter 1 Energia em 1 Mana como igualdade econômica. Motivo: quantidades ficam próximas, mas Energia volta por cena e Mana por tempo; pró: mantém a Arte curativa relevante; contra: exige os limites de frequência propostos para Proeza.

## 7. Arma, armadura e PV como controles

**FATO:** Espada Longa (`espada-longa`) dá 1d6, bônus de dano 0, soma Força com uma mão, Acerto +1 e 6 Ticks. Gambeson absorve Impacto/Corte/Perfuração 3/4/1; malha, 1/6/1, sem somar peças. Fontes: [src/data/armas.json:84](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/armas.json:84), [src/data/armaduras.json:25](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/armaduras.json:25), [src/data/armaduras.json:75](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/armaduras.json:75). PV Médio=25+3×Vigor ([src/data/regras.json:753](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:753)).

**PROPOSTA de denominador:** Espada Longa de uma mão, acerto sem Margem, antes de Absorção; atributos do 04. Golpe típico de referência = arma+Força+dano extra ativo daquele N. Não é dano por tentativa nem pressupõe que o inimigo falhou na Defesa.

| N | PV | Arma sem Técnica, média | Extra / arma | Golpe com Técnica, média | Absorção ativa / golpe |
|---|---:|---:|---:|---:|---:|
| 1 | 34 | 6.5 | 53.8% | 10 | +2 / 20.0% |
| 2 | 34 | 7.5 | 73.3% | 13 | +3 / 23.1% |
| 3 | 34 | 8.5 | 82.4% | 15.5 | +4 / 25.8% |
| 4 | 37 | 8.5 | 123.5% | 19 | +6 / 31.6% |
| 5 | 37 | 9.5 | 147.4% | 23.5 | +8 / 34.0% |
| 6 | 40 | 9.5 | 184.2% | 27 | +10 / 37.0% |

A Absorção ativa protege só um golpe nessa comparação; se cobrir vários, duração entra no método. Em Corte, ainda se somam Centelha e eventual armadura: +10 de Proeza não significa só 37% de redução final quando outras proteções já existem.

**Recomendação:** usar esse golpe e também testar espada sem Proeza e golpe com uma Margem (+1d6). Motivo: prevenir imunidade prática contra equipamento comum; pró: denominador transparente; contra: não representa arma de duas mãos ou perfuração especial.

## 8. Exemplos reais por família e nível

A matriz indica **recorte já correto para o parâmetro citado**, não aprovação antecipada de todo o pacote; “nenhuma” significa que não seleciono âncora correta existente para aquele padrão.

| Família / recorte | N1 | N2 | N3 | N4 | N5 | N6 |
|---|---|---|---|---|---|---|
| Bônus | Nenhuma selecionada após o critério de largura. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. |
| Dano | Nenhuma selecionada. | Nenhuma selecionada. | [Bote Silencioso (`bote-silencioso`, N3)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:1595) | [Golpe do Titã (`golpe-do-tita`, N4)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:339) | Nenhuma selecionada. | Nenhuma selecionada. |
| Absorção | [Tensionar (`tensionar`, N1)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:856) | Nenhuma selecionada. | [Pele de Pedra (`pele-de-pedra`, N3)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:874) | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. |
| Defesa | [Reflexos de Vento (`reflexos-de-vento`, N1)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:35) | [Esquiva de Vento (`esquiva-de-vento`, N2)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:7572) | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. |
| Cura | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. |
| Alcance/área/alvos | Nenhuma selecionada. | Nenhuma selecionada. | [Disparo Múltiplo (`disparo-multiplo`, N3)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:1030) | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. |
| Duração | [Ignorar a Dor (`ignorar-a-dor`, N1)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:1401) | [Segurar o Baque (`segurar-o-baque`, N2)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:7378) | [Não Vou Cair (`nao-vou-cair`, N3)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:3584) | [Corrida Vertical (`corrida-vertical`, N4)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:53) | [Fortaleza Viva (`fortaleza-viva`, N5)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:926) | Nenhuma selecionada. |
| Ação/reação/velocidade | [Tensionar (`tensionar`, N1)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:856) | [Esquiva de Vento (`esquiva-de-vento`, N2)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:7572) | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | [Velocidade Divina (`velocidade-divina`, N6)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:216) |
| Controle | Nenhuma selecionada. | [Pancada Atordoante (`pancada-atordoante`, N2)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:7326) | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. |
| Informação | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. | Nenhuma selecionada. |
| Qualitativa | [Centrar-se (`centrar-se`, N1)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:6972) | Nenhuma selecionada. | Nenhuma selecionada. | [Corrida Vertical (`corrida-vertical`, N4)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:53) | Nenhuma selecionada. | Nenhuma selecionada. |
| Custo por uso | [Tensionar (`tensionar`, N1)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:856) | [Esquiva de Vento (`esquiva-de-vento`, N2)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:7572) | [Bote Silencioso (`bote-silencioso`, N3)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:1595) | [Golpe do Titã (`golpe-do-tita`, N4)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:339) | [Fortaleza Viva (`fortaleza-viva`, N5)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:926) | [Pele Adamantina (`pele-adamantina`, N6)](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:945) |

Em particular, Mãos Hábeis contém +3, mas seu escopo atual de todo Ofícios é E3 e não é âncora correta de 3N/E1; Golpe do Titã ancora +3d6 em N4; Pancada Atordoante ancora apenas o valor de perturbação N2, não o nível do pacote composto. Cura vaga não ancora quantidade, Ouvido Absoluto não fixa distância e imunidade sem limite de fonte não ancora imunidade restrita.

**Recomendação:** usar as âncoras positivas para conferir a redação e escrever exemplos novos onde a matriz diz nenhuma. Motivo: não fingir que o catálogo já contém o padrão proposto; pró: separa referência de reforma; contra: alguns níveis começam sem modelo pronto.

## 9. Largura das Técnicas numéricas

**FATO:** uma evolução marcada custa +5 XP por +3 de bônus (1,67 XP/+1), contra 48/7≈6,86 XP/+1 no comparador de Habilidade; isso não prova equilíbrio apenas por chamar o escopo de estreito. Fonte e contas: `01-regua.md`, seção 4. A mesma tarefa pode dominar uma campanha.

### 9.1. Quatro larguras propostas

| Grau | Definição operacional | Exemplo | Bônus de jogada recomendado em N |
|---|---|---|---:|
| E1 · tarefa e condição | Um verbo, um objeto e uma condição que exclua usos relevantes do mesmo verbo | Consertar mecanismo de fechadura danificado, com ferramentas; acertar uma estocada contra alvo que acabou de errar você | 3N |
| E2 · uso nomeado | Uma modalidade relevante dentro da Habilidade, sem condição adicional | Combater com espada longa; arrombar fechaduras em geral | 2N |
| E3 · Habilidade inteira | Todos os usos de uma primária ou secundária | Todo Ofícios; todo Atletismo | N |
| E4 · transversal | Duas ou mais Habilidades, ou tudo associado a um Atributo | Toda ação de Destreza | Não admitir em uma única Técnica de bônus; separar escopos |

**PROPOSTA recomendada:** 3N cheio só em E1; reduzir para 2N/E2 e N/E3, e dividir E4. Motivo: dar preço mecânico à frequência de aplicação; pró: três fórmulas simples sem aumentar o teto N6; contra: descrições amplas do catálogo perdem bônus se mantiverem a abrangência. A3 permanece a escala cheia; a redução por largura é proposta nova, não aprovação já concedida.

Não aceitar condição decorativa: “com minha arma”, “enquanto consciente” e “quando tento acertar” não estreitam um ataque. Um golpe corpo a corpo não fica E1 só por excluir tiro. Uma profissão inteira dentro de Ofícios tende a E2, não E1. Recomendo registrar três situações em que o bônus funciona e três em que não funciona; pró: escopo verificável; contra: mais trabalho editorial. Se o E1 cobrir quase todas as ações reais da personagem, reclassificar pela cobertura observada, sem fingir que o nome assegura equilíbrio.

Não recomendo liberar 3N amplo apenas cobrando Energia: Firula pode repor reservas sem teto por cena. Nem subir um nível resolve cobertura ilimitada. Essa escolha é sobre largura solicitada, não compensação geral da saturação da seção 10 do 01.

### 9.2. Especialidade: convivência recomendada

**FATOS:** “Cada Especialidade aponta para **um recorte único e estreito** da Habilidade-mãe, e precisa ser **nomeada**.” E “para cada nível com aquele nome role **+1d6 e descarte o menor** dado do pool.” Fonte: [habilidades.md:78](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/habilidades.md:78) e [habilidades.md:93](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/habilidades.md:93). O sentido editorial de “estreito” no livro inclui E2 desta proposta, como espada longa; não renomeia a Especialidade para E1 automaticamente.

| Aspecto | Especialidade | Técnica numérica proposta |
|---|---|---|
| Efeito na jogada | Rola k dados extras, descarta k menores | Fixo 3N, 2N ou N conforme largura |
| Máximo do resultado | Não aumenta o máximo dos dados retidos | Aumenta máximo e mínimo |
| Escopo | Nomeado, dentro de uma Habilidade | E1/E2/E3 declarado; E4 dividido |
| Gate | Habilidade≥2k; k total≤piso(H/2) | Centelha≥N e compra da Técnica |
| XP na primária | Incrementos 12/16/20; totais 12/28/48 | Totais 10/15/20/25/30/35; diferença só em evolução marcada |
| XP na secundária | Incrementos 6/8/10; totais 6/14/24 | Mesmo preço de Técnica; não aplicar desconto de secundária |
| Valores fixos | +1 por nível de Especialidade aplicável | Não transplantar 3N para Defesa; respeitar família e teto publicados |

Custos: [regras.json:591](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:591), [regras.json:599](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:599), [regras.json:634](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:634).

Em 4d6, uma Especialidade acrescenta 1,9309 à média e duas 3,3445 no total; em 6d6, uma acrescenta 2,1541 e três 5,2748. A comparação é de média, não equivalência de distribuição ou escopo. Esses valores resultam de enumerar dados e descartar os menores.

**PROPOSTA recomendada:** somar os mecanismos quando ambos os escopos se aplicarem, sem exigir Especialidade como pré-requisito universal. Motivo: treino seleciona dados e Centelha acrescenta capacidade; pró: investimento mundano não perde função ao comprar Proeza; contra: o conjunto satura mais cedo, como calculado no 01. Duas Técnicas numéricas do mesmo escopo continuam substitutivas; Especialidade não é uma segunda Técnica dessa família. Não conceder Especialidade gratuitamente junto da Proeza.

### 9.3. Auditoria da largura no Caminho Pele de Pedra

**FATO:** o Caminho não tem Técnica de bônus 3N em jogada. Aplicar 3N à Absorção seria inventar uma regra. A classificação abaixo usa largura por analogia de cobertura para os benefícios numéricos; seus valores continuam na tabela própria de Absorção/mitigação.

| Técnica atual | Benefício numérico / cobertura | Largura | Diagnóstico e recomendação |
|---|---|---|---|
| Pele Curtida N1 | +2 Impacto sempre | E2: um tipo, todos os golpes | Acima da linha passiva N1=1; substituir no piloto pela permissão inicial, não por 3N |
| Tensionar N1 | +2 naquele golpe, qualquer tipo aplicável | E1: evento único pago | Cabe no teto reflexivo N1; manter |
| Couro Endurecido N2 | +3 Impacto e +2 Corte sempre | E3: vários tipos permanentes | Largo demais para a linha passiva de um tipo; recortar para +2 Corte |
| Pele de Pedra N3 | +4 todos os tipos e mitigação 1 | E3: proteção ampla; extra E2 | Amplitude ativa cabe mediante janela/custo, mas composição exige N4; fixar 12 Ticks |
| Aguentar o Tranco N1 | Remove penalidade de um estado | E2: estado específico em vários testes | Precisa normalizar a unidade; propor N2, −2 fixos físicos por 6 Ticks, sem recuperar dados |
| Pele Adamantina N6 | Redução geral sem quantidade | E3: todos os tipos | Fixar metade de dano não agravado por 6 Ticks; separar imunidade ambiental, extra acima de N−2 |

Inquebrantável, Carne de Granito e Fortaleza Viva são permissões de proteção, não bônus aditivos de jogada. Entram nos eixos e no piloto completo.

**Recomendação:** preservar essa separação de unidades. Motivo: a largura de ataque não fornece conversão para Absorção; pró: evita +18 de proteção acidental; contra: o piloto testa cobertura defensiva, mas não contém exemplo real de 3N ofensivo.

## 10. Arquitetura proposta: competência, permissão e composta

Esta seção e o M1 revisado prevalecem sobre interpretações anteriores de “conveniência” e da sobretaxa automática de +1 por família.

### 10.1. Três tipos e entrada sobrenatural

- **Numérica:** modifica uma grandeza já resolvida pelas regras, inclusive dano, Absorção e mitigação; usa a família própria, não necessariamente 3N.
- **Permissão:** autoriza uma interação impossível ao humano de referência; sozinha não dá bônus numérico à execução.
- **Composta:** contém dois benefícios mecânicos independentes, mesmo que a descrição os apresente como um só feito.

**PROPOSTA recomendada:** cada Caminho deve oferecer pelo menos uma permissão N1 comprável sem pré-requisito acima de N1. Motivo: a Centelha aparece antes da maximização mundana; pró: identidade sobrenatural desde a entrada; contra: algumas entradas atuais precisam ser substituídas ou uma alternativa criada. Isso não obriga o jogador a comprar toda a árvore nem dá a permissão de graça junto de uma numérica.

### 10.2. Eixos e contagem de nível

Vetor `(d,a,i,f)`, todos começam em zero. **N mínimo=1+d+a+i+f**. Cada nível adicional compra exatamente um avanço unitário em um eixo; evolução pode saltar níveis apenas pagando e registrando todos os avanços. Capacidade mantida não recebe créditos por impor uma restrição nova em outro eixo.

| Eixo | Grau 0 | Grau 1 | Grau 2 | Grau 3 | Graus adicionais |
|---|---|---|---|---|---|
| Duração d | Um gesto ou deslocamento, até 6 Ticks; efeito termina na ação | Até 24 Ticks; pode manter posição/efeito entre ações | Uma cena | Contínuo, enquanto respeitar as condições | Não há grau 4 |
| Destinatário a | Só em si e equipamento vestido/carregado comum | Si **ou** um aliado por toque, um beneficiário escolhido por ativação | Si e até três aliados, todos a até 4 m na ativação | Não há | Alcance maior é projeto específico; não vem grátis |
| Intensidade i | Pequena impossibilidade, um contato/passo/gesto, sem imunidade de combate | Resolve um obstáculo local por ação | Abrange uma categoria de obstáculos locais | Ignora uma regra física em mobilidade livre ou uma ameaça de combate estreita | i4: proteção de combate ampla ou observação remota de local conhecido até 1 km; i5: feito extremo delimitado |
| Frequência f | Uma ativação por cena | Até três ativações por cena | Sem limite de ativações por cena, pagando cada uma | Não há | Efeitos repetidos usam a própria família |

Momento não significa ganhar ação extra: o gesto acompanha uma ação normal. A janela de até 6 Ticks é um teto, não seis ativações. Escala qualitativa i exige exemplos publicados por família; não se pode chamar imunidade de “pequena” por durar pouco. Cura, dano e controle mantêm seus pisos próprios e não entram por renomeação como permissão.

**PROPOSTA recomendada:** adotar soma de avanços e os exemplos de intensidade como limites. Motivo: impede comprar duração, grupo e potência juntos; pró: cada subida tem justificativa visível; contra: intensidade continua exigindo julgamento editorial. Uma permissão contínua com intensidade mínima pode ser N4; isso não autoriza imunidade contínua N4, que exigiria outros avanços.

**Relação com Artes:** os graus métricos da seção 3 continuam limites máximos para alcance/área de efeitos comuns; esta escada substitui o preço anterior de duração para permissões, não cobra cena=g4 novamente. O alcance fixo do grupo é parte do eixo destinatário. Não somar a tabela de duração das Artes por cima do vetor e não extrapolar suas unidades.

Os exemplos de informação da seção 4 precisam também passar por estes eixos: observar a 1 km por uma ação, em si e uma vez/cena, é i4/N5, sem transportar ataques. Ler o quadro anterior como teto de um parâmetro, não como aprovação de uma permissão passiva sem contabilizar duração/frequência.

### 10.3. Árvore gerada: da água ao ar

Esta árvore é exemplo novo, não renomeação do Caminho do Vento. Adotar para mobilidade: i0=um passo sobre água/neve; i1=um deslocamento inteiro nessas superfícies; i2=inclui paredes/teto; i3=inclui ar. Não aumenta distância nem velocidade do movimento normal. Todo trecho tem de ser fisicamente alcançável nessa distância.

| N | Nome proposto | Vetor | Único avanço | Permissão |
|---|---|---|---|---|
| 1 | Passo sem Apoio | (0,0,0,0) | Entrada | Um passo sobre água; termina em apoio normal |
| 2 | Travessia Leve | (0,0,1,0) | Intensidade | Um deslocamento sobre água/neve; termina em apoio normal |
| 3 | Caminho Vertical | (0,0,2,0) | Intensidade | Um deslocamento também em paredes/teto; termina em apoio normal |
| 4 | Passada no Ar | (0,0,3,0) | Intensidade | Um deslocamento no ar; ainda termina em apoio normal |
| 5 | Apoio Invisível | (1,0,3,0) | Duração | Caminha e pode parar no ar por até 24 Ticks |
| 6 | Chão do Céu | (2,0,3,0) | Duração | Caminha e para no ar durante uma cena |

Ramo real alternativo: Passo sem Apoio N1 → Passos Repetidos N2 `(0,0,0,1)` → Passos Livres N3 `(0,0,0,2)`. Outro: Travessia Leve N2 → Travessia Guiada N3 `(0,1,1,0)` → Travessia do Grupo N4 `(0,2,1,0)`. Cada aresta aumenta um eixo, sem acumular automaticamente os vetores dos ramos; uma futura combinação paga pela soma de avanços e pode exceder N6.

Ao fim da janela, a sustentação cessa; se não houver apoio, aplica-se a queda normal. Não há teletransporte ao chão ou imunidade à queda implícita. N6 da linha aérea permanece f0=uma ativação/cena: duração cresceu, frequência não.

**Recomendação:** adotar a linha principal e esses dois ramos como modelo de construção. Motivo: demonstra escolhas de domínio em vez de seis pacotes maiores; pró: N1 já é impossível e N6 abre mobilidade marcante; contra: a rota aérea não melhora aliados ou frequência sem abrir mão de duração/intensidade.

### 10.4. Vantagem tática e cobrança

**PROPOSTA recomendada:** permissão com consequência tática mensurável paga **N Energia por ativação**, declarada antes do uso, e respeita o eixo f. Para a linha de movimento, cobrar sempre, pois atravessar um obstáculo já afeta posicionamento; sem FV adicional nessa linha. Não aumentar N só porque foi usada inteligentemente em combate, nem conceder bônus de ataque, Defesa, dano, velocidade ou ação extra pelo nome do efeito.

Atacar do teto mantém ataques e defesas normais; qualquer benefício de posição vem da regra normal aplicável e deve ser contabilizado no ensaio. Escapar pelo ar não apaga ameaças, alcance de ataques ou custo de movimento. Se a Técnica prometer um bônus novo por estar no teto, passa a composta e paga o componente numérico.

Permissões de imunidade/redução usam os custos especiais da família (incluindo FV N5/N6) e o menor limite entre família e eixo f. Custos são por ativação, sem manutenção a cada Tick; por isso duração e frequência precisam ser compradas. Permissão contínua puramente utilitária custa zero; uma versão contínua tática exige calibração própria e não é liberada por esta tabela. No piloto, nenhuma proteção contínua é aprovada.

Motivo: cobrar posicionamento sem fingir que é apenas descrição; pró: aplicação objetiva antes do lance; contra: Energia pode voltar por Firulas e, sozinha, não garante equilíbrio. Os limites f0/f1 são contadores, não se restauram por recuperar Energia.

### 10.5. Compostas e teto dos extras

**PROPOSTA recomendada:** um principal de rank r e **no máximo um extra independente**, de rank e≤N−2; nível mínimo `max(r,e+2)`, após avaliar cada componente com seus parâmetros. N1/N2 não acomodam um segundo poder de rank mínimo 1. Três benefícios exigem separar uma compra, não declarar extras ilimitados. Mesmo pacote paga uma ativação; componentes têm a janela declarada e não se repetem por Tick.

Em composta, a D de resistência e os demais parâmetros dependentes de nível usam o rank do componente, não o N final do pacote (controle corporal r2: D10). O preço de uso segue o N final.

O principal pode ficar abaixo do teto de N por causa do extra: não aumentar seu poder de graça só para preencher N. Dois tipos de Absorção são cobertura da mesma família, não duas famílias; cobrar largura. As três aplicações reais e as escolhas finais estão no 03: Pancada Atordoante, Pele de Pedra e Pele Adamantina.

Motivo: impedir que extras quase tão fortes quanto o principal entrem baratos; pró: teste N−2 simples; contra: compostas simétricas podem subir dois níveis e precisam ser divididas.

### 10.6. Quando rolar e qual D usar

**PROPOSTA recomendada:** a permissão torna a interação possível; a execução arriscada usa Atributo+Habilidade pertinente contra **D10 como padrão**, quando o texto não especificar outra dificuldade. Na mobilidade: Destreza+Atletismo. Condições claramente mais difíceis usam D15 (instabilidade forte), D20 (manobra excepcional), e degraus superiores só por exigência concreta da tarefa. Não usar D=5N só por a permissão ser de nível alto.

Dispensar teste quando a ação cabe na permissão, é executada em condições tranquilas e não existe incerteza ou consequência relevante de falha; cobrar ativação/limite mesmo sem teste. Sob oposição, usar Defesa/teste resistido já aplicável, não um D10 adicional antes de todo ataque. Uma única rolagem resolve cada manobra arriscada, não cada passo. Bônus numérico só entra se sua própria Técnica e escopo forem aplicáveis.

Falha de mobilidade não produz o deslocamento seguro e pode causar queda conforme posição real; não revoga permanentemente o poder. Nas proteções automáticas do piloto, não se exige teste adicional para a Absorção ou imunidade já concedida: o ataque adversário é o teste pertinente.

Motivo: separar acesso sobrenatural de competência sem penalizar o nível alto; pró: preserva o valor da Habilidade; contra: D10 ainda pode ser arriscada para um personagem pouco treinado em situação hostil.
