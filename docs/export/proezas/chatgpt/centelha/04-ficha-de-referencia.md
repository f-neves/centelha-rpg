# 04 · Ficha de referência por Centelha

26/09/2026 · **PROPOSTA de bancada**, não teto de criação nem recompensa automática de XP.

**Recomendação:** adotar os perfis completos abaixo como referência inicial de nivelamento e repetir encontros com quatro funções diferentes. Motivo: custos e derivados ficam auditáveis; pró: permite reproduzir o teste; contra: representa um combatente humano generalista, não toda construção possível.

## 1. Relação com o livro e com A1

**FATO:** criação sugere orçamentos de 1.500/2.000/2.600 XP e Centelha inicial até 3, normalmente 1; Centelha vem de marco, não se compra. Fontes: [src/content/chapters/criacao-de-personagem.md:17](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/criacao-de-personagem.md:17), [src/content/chapters/criacao-de-personagem.md:23](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/criacao-de-personagem.md:23), [src/content/chapters/centelha.md:84](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/centelha.md:84).

**PROPOSTA:** os números abaixo são **XP efetivamente gastos na ficha descrita**, não os orçamentos do livro. Não inflar gastos ou atribuir pontos invisíveis para atingir 1.500: C1 gasta 884 e teria 616 não gastos se recebesse aquele orçamento. Recomendo usar o gasto efetivo desta bancada e testar também personagens que gastem o orçamento inteiro antes de fechar o bestiário; pró: separa investimento de poder; contra: esta referência C1 é menos equipada em traços que um herói que investiu todos os 1.500.

A1 permanece intacta: dificuldades pertencem à tarefa, não a C. Somas 6/9/12 continuam controles da régua; valores intermediários abaixo são fichas propostas, nunca uma nova tabela de Dificuldade. Teto de Atributo/Habilidade nesta revisão: 6. Centelha pode subir com marco mesmo sem atingir exatamente estes gastos.

## 2. Compras que definem cada ficha

Humano Médio, raça 0 XP; nove Atributos. Principais: Força, Destreza, Percepção; os outros seis têm o valor da coluna comum. Habilidades principais: Armas, Esquiva, Atletismo; as outras 21 entradas de `habilidades.json` têm o valor comum. Seis secundárias nomeadas: Natação, Escalada, Equilíbrio, Liderança, Etiqueta, Intimidação, todas no valor da coluna comum de Habilidades. As demais secundárias ficam em zero.

Quatro Virtudes têm o mesmo nível indicado. Aparência 3 em todos os perfis. Três Antecedentes: Recursos, Contatos, Aliados, nos níveis 1/2/2/3/3/4/4 por C. Sem Especialidades, Artes ou Efeitos comprados nesta ficha-base. Nenhum outro custo é omitido no total.

| C | Três atributos principais | Demais seis | Três H principais | Outras 21 H | Soma principal | Virtudes, cada | FV |
|---|---:|---:|---:|---:|---:|---:|---:|
| 0 | 2 | 2 | 2 | 1 | 4 | 2 | 3 |
| 1 | 3 | 3 | 3 | 2 | 6 | 3 | 4 |
| 2 | 4 | 3 | 3 | 2 | 7 | 3 | 5 |
| 3 | 5 | 3 | 4 | 3 | 9 | 4 | 5 |
| 4 | 5 | 4 | 5 | 3 | 10 | 4 | 6 |
| 5 | 6 | 4 | 5 | 4 | 11 | 5 | 6 |
| 6 | 6 | 5 | 6 | 4 | 12 | 5 | 7 |

Custos acumulados desde os pisos: Atributo `Σ(5+5i)`, i=2…nível; primária `Σ(4+2i)`, i=1…nível; secundária `Σ(2+i)`; Virtude `Σ(4+2i)`, i=2…nível; FV/Aparência `Σ2i`; Antecedente `Σ3i`. Fonte: [src/data/regras.json:561](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:561).

| C | Atributos | H primárias | H secundárias | Virtudes/FV/Aparência | Proezas | Antecedentes | XP gasto acumulado |
|---|---:|---:|---:|---:|---:|---:|---:|
| 0 | 135 | 168 | 18 | 56 | 0 | 9 | 386 |
| 1 | 315 | 366 | 42 | 104 | 30 | 27 | 884 |
| 2 | 390 | 366 | 42 | 114 | 65 | 27 | 1004 |
| 3 | 480 | 612 | 72 | 162 | 80 | 54 | 1460 |
| 4 | 630 | 654 | 72 | 174 | 95 | 54 | 1679 |
| 5 | 735 | 906 | 108 | 230 | 110 | 90 | 2179 |
| 6 | 915 | 954 | 108 | 244 | 125 | 90 | 2436 |

**Recomendação:** usar a sequência como marcos de investimento, não exigir XP para conceder C. Motivo: o portão é narrativo; pró: não contradiz o livro; contra: dois personagens da mesma C podem estar acima/abaixo da bancada.

## 3. Portfólio proposto de Proezas

Três linhas de evolução explicitamente marcadas, de N1 até N=C: **Precisão com Espada** (bônus aprovado), **Golpe concentrado** (dano extra ativo do 02) e **Pele contra Corte** (Absorção passiva específica do 02). São arquétipos de teste, não alegação de que essas cadeias completas já existem no catálogo. Mantêm-se os ids históricos na ficha, mas só o patamar maior de cada família vale numericamente.

| C | Registros comprados por nível | Total de registros | Patamares efetivos | XP de Proezas |
|---|---|---:|---|---:|
| 0 | nenhum | 0 | nenhum | 0 |
| 1 | 3 de N1 | 3 | 3 linhas em N1 | 30 |
| 2 | 5 de N1; 3 de N2 | 8 | 3 linhas em N2 + 2 independentes N1 | 65 |
| 3 | 5 de N1; 3 de N2/N3 | 11 | 3 linhas em N3 + 2 independentes N1 | 80 |
| 4 | 5 de N1; 3 de N2/N3/N4 | 14 | 3 linhas em N4 + 2 independentes N1 | 95 |
| 5 | 5 de N1; 3 de N2/N3/N4/N5 | 17 | 3 linhas em N5 + 2 independentes N1 | 110 |
| 6 | 5 de N1; 3 de N2/N3/N4/N5/N6 | 20 | 3 linhas em N6 + 2 independentes N1 | 125 |

Independentes desde C2: uma conveniência de ofício e uma de leitura de trilhas, sem bônus de combate; 10 XP cada. Fórmula de investimento: `3×(5+5C)+20` desde C2; C1=30. Não somar preço cheio de todos os antecessores numa evolução marcada.

**Recomendação:** três linhas principais e duas utilidades. Motivo: produz especialização sem supor todas as famílias máximas; pró: repertório manejável; contra: outras árvores podem cobrar capacidades independentes que elevam o custo.

## 4. Reservas e defesas

PV=25+3Vigor. Energia=piso((Vigor+Compostura+Raciocínio+FV)/2)+2C. Mana=2C+FV. Física=2(Destreza+Esquiva)+C; Social=2(Compostura+Sociabilidade)+C; Mental=Raciocínio+Integridade+FV+C. Fonte: [src/data/regras.json:753](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:753).

| C | PV | Energia | Mana nominal | FV | Defesa Física | Defesa Social | Defesa Mental | Absorção I/C/P |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 0 | 31 | 4 | 3 | 3 | 8 | 6 | 6 | 2/0/0 |
| 1 | 34 | 8 | 6 | 4 | 13 | 11 | 10 | 4/2/1 |
| 2 | 34 | 11 | 9 | 5 | 16 | 12 | 12 | 5/4/2 |
| 3 | 34 | 13 | 11 | 5 | 21 | 15 | 14 | 6/6/3 |
| 4 | 37 | 17 | 14 | 6 | 24 | 18 | 17 | 8/8/4 |
| 5 | 37 | 19 | 16 | 6 | 27 | 21 | 19 | 9/10/5 |
| 6 | 40 | 23 | 19 | 7 | 30 | 24 | 22 | 11/12/6 |

Mana em C0 é valor nominal da fórmula, **sem acesso a Artes**. FV é o traço de Força de Vontade, não um décimo Atributo. Absorção I/C/P inclui natural e a passiva específica de Corte; sem armadura ou escudo. As defesas não incluem especialidade, cobertura, reação ou gasto de FV.

**Recomendação:** manter PV e defesa calculados, sem bônus oculto por orçamento. Motivo: preservar o sistema; pró: qualquer pessoa reproduz os derivados; contra: os PV crescem pouco e tornam o topo perigoso.

## 5. Ataque e dano típicos

Espada Longa de uma mão: 1d6+Força, Acerto +1, 6 Ticks. O personagem usa Precisão com Espada e, no golpe ativo, a linha de dano extra do 02. A simulação compara com o mesmo perfil sem proteção situacional, aplica Margens de seis e Absorção de Corte, com piso zero. Fonte da arma: [src/data/armas.json:84](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/armas.json:84).

| C | Ataque completo no escopo | Acerto contra igual | Arma sem Margem | Golpe com Proeza sem Margem | PV por tentativa, incluindo Margens/falhas/Absorção |
|---|---|---:|---:|---:|---:|
| 0 | 2d6+1 | 41.67% | 5.5 | 5.5 | 2.292 |
| 1 | 3d6+5 | 74.07% | 6.5 | 10 | 6.493 |
| 2 | 3d6+10 | 90.74% | 7.5 | 13 | 9.495 |
| 3 | 4d6+14 | 97.30% | 8.5 | 15.5 | 11.909 |
| 4 | 5d6+15 | 98.38% | 8.5 | 19 | 14.347 |
| 5 | 5d6+21 | 99.92% | 9.5 | 23.5 | 18.740 |
| 6 | 6d6+22 | 99.94% | 9.5 | 27 | 21.117 |

“Golpe” é um acerto sem Margem antes de Absorção. Última coluna é valor esperado **por tentativa**, incluindo falhas e Margens; não é o denominador usado na fração de Absorção do 02. A probabilidade elevada no topo é consequência explícita de bônus de ataque crescente e defesas limitadas, não uma garantia de equilíbrio.

**Recomendação:** medir também rodada de quatro ataques em 24 Ticks: dano extra pode ser usado até 4/4/4/3/2/1 vezes em C1…C6, sujeito às reservas; os restantes usam só arma e Margens. Motivo: distinguir explosão de sustentação; pró: respeita limites de N4–N6; contra: encontros muito curtos favorecem pico.

Energia/FV não são descontadas da chance acima porque os valores representam a primeira ativação com reservas cheias. Em uma segunda cena, repor Energia pela regra vigente e conservar o gasto de FV; no controle sem Firula não se inventa recuperação adicional.

## 6. Grupo de quatro para o bestiário

**FATO:** grupo de quatro na definição do bestiário e no parâmetro de caça, [docs/pendencias/B-bestiario.md:118](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/pendencias/B-bestiario.md:118) e [src/data/recompensas.json:96](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/recompensas.json:96).

**PROPOSTA de grupo-base:** um atacante com as três linhas acima; um protetor troca Precisão por Defesa reflexiva; um curador troca Golpe por Cura e usa o custo especial de cura; um explorador troca Golpe por informação. Todos mantêm o mesmo número de linhas e custo de aquisição por patamar. Não dar ao curador o dano do atacante nem quatro doses de cura quando só um membro as conhece.

**Recomendação:** calibrar para uma luta exigente que consuma recursos, mas deixe pelo menos três integrantes capazes de agir ao final, e repetir com cinco encontros independentes antes de ajustar criaturas; pró: critério observável de grupo; contra: cinco ensaios são triagem, não estimativa precisa de probabilidade.

A referência não é teto nem definição de D por Centelha; recomendo aprová-la como cenário reproduzível e usar seu resultado para ajustar o cenário, não presumir que já calibrou o bestiário.

## 7. Reprodução numérica

Para cada C, usar os vetores de atributos/Habilidades da seção 2. Custos são somas inteiras das tabelas de XP. Na última coluna de dano: enumerar `floor(S/2)d6`; somar paridade, Acerto 1, C e B(C); falha se total≤Defesa; Margem=`floor((total−Defesa)/6)` no sucesso; somar dados da arma, extra e Margem, Força e fixo do extra, subtrair Absorção de Corte; truncar cada resultado em zero antes de calcular a média. Não truncar apenas a média.
