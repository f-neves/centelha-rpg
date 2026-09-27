# 03 · Método de nivelamento revisto

**PROPOSTA recomendada:** adotar M1 revisado, com três rotas (numérica, permissão, composta). A regra anterior `max(r,graus)+(k−1)+e` fica substituída: não cobrar +1 por família além de N−2, nem cobrar duração duas vezes em permissões. A3=3N continua decisão do autor; largura, eixos, custos e resultados individuais abaixo são propostas.

Motivo: traduzir a nova arquitetura em decisões reproduzíveis; pró: cada nível tem causa explícita; contra: intensidade qualitativa e cobertura precisam de exemplos por família.

## 1. M1 em três passos

1. **Descrever e classificar.** Registrar texto literal, número/condição propostos quando faltar dado, tipo (numérica, permissão, composta), ação, custo, duração, alvo, largura e resistência. Narrativa não cria automaticamente um segundo benefício. Fixar o pacote antes de calcular o nível.
2. **Calcular cada componente.** Bônus de jogada: E1 usa 3r, E2 2r, E3 r; escolher o menor r que alcance o bônus pretendido, arredondando para cima; E4 precisa ser dividido. Outros números usam a família do 02. Permissão: `r=1+d+a+i+f`, com intensidade expressa em exemplo de família. Composta: principal r e único extra e, nível `L=max(r,e+2)`. Extra não pode superar L−2. Cobertura de uma mesma família não vira artificialmente um extra.
3. **Conferir teto e fechar.** Exigir L≤6 e Centelha≥L; conferir custos/limites e parâmetros do componente. Acima de 6, reduzir ou separar, nunca comprimir. No nível final, não aumentar automaticamente a potência que sobrou abaixo do teto. Identificar pré-requisito versus evolução que recebe crédito de XP. Recomendar uma versão concreta, com motivo, pró e contra.

### Parâmetros de componentes numéricos

Para preservar cobrança de alcance/área/alvos/duração fora das permissões: achar r pela família; seja h a quantidade desses parâmetros cujo grau supera piso(r/2), excluindo próprio corpo e alvo básico; rank final do componente `max(r,graus)+max(0,h−1)`. Duração instantânea é g0. Absorção passiva em mais de um tipo acrescenta +1 ao rank obtido pela maior parcela, porque amplia a cobertura gratuita; ativa tem os tipos da família publicados na ficha e paga sua duração. Bônus permanente em E1 não é magia de duração infinita.

Em permissões, usar exclusivamente os eixos do 02 para preço e disponibilidade, sem somar graus de Artes outra vez. Não substituir uma imunidade por “+muito” e não reclassificar dano como pequena impossibilidade para conseguir N1.

**Recomendação:** aplicar essa separação antes da composição. Motivo: N−2 só tem sentido se o rank do extra já incluir seu alcance e duração; pró: não esconde benefício de grupo como extra pequeno; contra: exige decomposição por componente.

## 2. Seis testes anteriores, recalculados

| Técnica real | Normalização proposta | Conta M1 revisada | Escolha recomendada |
|---|---|---|---|
| Mãos Hábeis N1 | Atual +3 em todo Ofícios é E3; proposta +3 só ao consertar mecanismo de fechadura danificado com ferramentas, E1 | Texto amplo r3; versão recortada r1 | Manter N1 com recorte E1; consertar livremente não recebe outra permissão implícita |
| Golpe do Titã N4 | +3d6 extra em um acerto, suplementar | Família dano r4, parâmetros g0 | Manter N4, 4 Energia, até 3/cena; escopo de dano não recebe a fórmula 3N |
| Segundo Fôlego N1 | Recupera 2 PV de Impacto em si, uma ativação; quota de cura do 02 | Cura r1 | Manter N1, 3 Energia, ação independente 5 Ticks |
| Ordem Curta N1 | Uma ordem segura por uma ação, até 6 Ticks e 1 m; resistência mental do 02 | Controle r3, alcance g1/duração g1, sem extensão | Subir para N3, 3 Energia; não chamar de permissão mínima, pois interfere na ação alheia |
| Corrida Vertical N4 | Um deslocamento normal em parede/teto/água, máximo 6 Ticks, chegada em apoio seguro | Permissão (0,0,2,0), r3 | Propor N3, 3 Energia, uma ativação/cena, sem bônus de movimento/ataque |
| Pele de Pedra N3 | +4 Absorção I/C/P por 12 Ticks + mitigar 1 ponto fixo de ferimento no mesmo período | Principal r3 (g2); extra r2 (g2); max(3,2+2)=4 | Propor N4, 4 Energia, até 3/cena, independente 6 Ticks |

Os valores são versões propostas para teste, não transcrição dos poderes. Corrida Vertical deixa de usar o piso qualitativo antigo N4 e passa a seguir os eixos; a redução para N3 vem acompanhada de uso ocasional e chegada segura, não preserva frequência ilimitada.

| Escolha | Motivo | Pró | Contra |
|---|---|---|---|
| Mãos Hábeis E1/N1 | Não conceder todo Ofícios a preço de tarefa estreita | Mantém entrada +3 | Perde abrangência do texto |
| Titã N4 | Dano adicional inclui arma e Margens fora dos dados extras | Mantém âncora conhecida | Não representa Arte isolada de mesmo grau |
| Segundo Fôlego N1 | Cura pequena definida é melhor que “punhado” | Custo e quantidade contáveis | Custo proposto maior que o atual |
| Ordem N3 | Retirar uma ação exige família de controle | Preserva resistência | Muda acesso no Caminho |
| Corrida N3 | Dois avanços de intensidade geram a capacidade | Nível reproduzível pelo vetor | Janela/frequência mais restritas |
| Pele N4 | Extra r2 exige pelo menos N4 | Preserva ambos os benefícios | Passa a exigir C4 |

**Recomendação:** usar essas fichas normalizadas no ensaio, preservando o texto original abaixo. Motivo: números propostos não são descobertas na fonte; pró: divergência auditável; contra: resultado depende da aprovação dos recortes.

## 3. Regra N−2 em três compostas reais

### Pancada Atordoante, N2 atual

> Concentra o golpe num só ponto: +1d6 de dano e o alvo cambaleia, agindo com −2 na ação seguinte.

Fonte: [tecnicas.json:7326](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:7326).

**PROPOSTA recomendada:** N3, +1d6 num acerto e −2 na próxima ação se o alvo falhar Vigor+Resistência contra D10; 3 Energia, suplementar, um alvo, efeito expira após a próxima ação ou 6 Ticks. Principal é controle r2, extra dano r1: `max(2,1+2)=3`; em N3 o extra permitido é r1. Em composta, a resistência usa o rank r do controle, D=5r, não o nível final do pacote; aqui r2 dá D10. Não aumentar a condição para a linha N3 de comando.

Motivo: dois benefícios não cabem em N2 sob N−2; pró: conserva a identidade de golpe atordoante; contra: acesso e resistência mudam. Não elevar dano para 2d6 por estar em N3, pois deixaria de ser extra r1.

### Pele de Pedra, N3 atual

> +4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1.

Fonte: [tecnicas.json:874](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:874).

**PROPOSTA recomendada:** N4, +4 I/C/P e redução de 1 ponto de penalidade fixa por 12 Ticks; 4 Energia, independente 6 Ticks, até 3/cena. Principal Absorção r3; extra mitigação r2 (incluindo duração g2); L=4, extra≤2. Duração comum não é um terceiro benefício.

Motivo: manter o pacote com extra abaixo do principal; pró: N−2 reproduz o resultado do piloto; contra: a proteção não alcança o teto +6 da família N4, pois o nível final foi puxado pelo extra.

### Pele Adamantina, N6 atual

> Quase indestrutível: reduz drasticamente todo dano e ignora ambientes mortais.

Fonte: [tecnicas.json:945](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:945).

**PROPOSTA de normalização para medir:** metade do dano não agravado após Absorção, arredondando para cima, por 6 Ticks, r6; imunidade ambiental ampla por uma ação, pessoal/uma vez por cena, i4 e demais eixos zero, r5. Mesmo na janela mínima, `max(6,5+2)=7`: o extra supera o máximo r4 permitido em N6.

**Recomendação:** manter N6 somente com a redução de dano, 6 Energia+2 FV, uma vez/cena, independente 7 Ticks, retirando imunidade ambiental. Motivo: principal de topo não carrega segundo poder quase de topo; pró: versão executável; contra: perde a cláusula ambiental. Não inventar que “ambientes mortais” cobre toda ameaça sem definir fonte/tipo em uma compra futura.

## 4. Alternativas e escolha do método

| Método | Aplicação em três passos | Prós | Contras | Recomendação |
|---|---|---|---|---|
| M1 revisado | Classificar; calcular rank/eixos e N−2; conferir escopo/custo/teto | Causa do nível é explícita | Intensidade precisa de exemplos | Adotar, pois responde diretamente às decisões de arquitetura |
| Orçamento universal | Converter efeitos em pontos; somar parâmetros; enquadrar no orçamento de nível | Captura densidade do pacote | Taxas entre permissão e dano seriam arbitrárias | Não adotar agora; usar somente como estudo futuro se o piloto revelar falha concreta |
| Arte equivalente | Construir efeito mágico; comparar custo bruto e flexibilidade; conferir nível | Boa referência para dano/cura | Não há equivalente canônico para toda permissão | Manter como conferência externa, não substituir M1 |

As antigas pontuações M2/M3 e a tabela comparativa anterior não são resultados deste M1 revisado. Não fazer média entre métodos para escolher nível.

## 5. Verificação antes de qualquer lote

1. Toda permissão N1 tem vetor zero e feito impossível real, sem bônus de combate escondido.
2. Cada aresta de evolução por eixos aumenta um único índice em um; combinação de ramos paga pela soma.
3. Cada componente numérico traz largura e família; 3N não invade Absorção/Defesa.
4. Composta tem no máximo um extra, rank≤N−2, já incluindo parâmetros; ausência de dado recebe proposta explícita.
5. Requisitos são acessíveis, XP não desconta simples dependência e a versão final traz custo, ação, término e limites.
6. Toda mudança em relação ao catálogo está marcada como PROPOSTA; nenhum JSON é migrado por este documento.

**Recomendação:** aplicar essas seis verificações ao piloto completo antes de aprovar a régua. Motivo: expor falhas do método em uma árvore conectada; pró: evita lotes prematuros; contra: um Caminho não cobre todos os casos do sistema.

## 6. Fontes literais das seis amostras

### Mãos Hábeis (`maos-habeis`), N1 atual

> +3 em Ofícios; conserta e improvisa com facilidade.

Fonte: [tecnicas.json:6084](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:6084).

### Golpe do Titã (`golpe-do-tita`), N4 atual

> **+3d6** de dano num único golpe colossal.

Fonte: [tecnicas.json:339](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:339).

### Segundo Fôlego (`segundo-folego`), N1 atual

> Recupera um punhado de PV de Impacto numa ação.

Fonte: [tecnicas.json:1419](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:1419).

### Ordem Curta (`ordem-curta`), N1 atual

> Manip+Intimidação vs Defesa Mental: o alvo obedece uma ordem simples e não-autodestrutiva por uma ação ("pare", "largue", "ajoelhe").

Fonte: [tecnicas.json:444](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:444).

### Corrida Vertical (`corrida-vertical`), N4 atual

> Enquanto se mover, corre por paredes, tetos e sobre a água por 6 Ticks.

Fonte: [tecnicas.json:53](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:53).

### Pele de Pedra (`pele-de-pedra`), N3 atual

> +4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1.

Fonte: [tecnicas.json:874](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/tecnicas.json:874).

