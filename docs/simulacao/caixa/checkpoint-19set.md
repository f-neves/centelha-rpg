# Checkpoint · onde a conversa do Arquiteto com o humano parou, 18-19/09/2026

Registro de continuidade, não ordem de serviço. Serve pra retomar sem reconstruir tudo de memória.

## Fechado nesta sessão, com PROCEDE da Revisora

- Centelha: degrau 4 "Grande herói" → "Campeão" (`4ce6476`), M-42 (orçamentos `orcamentoPadrao/
  Veterano/Heroico` → `iniciante/veterano/especialista`, `2520b5d`).
- C-100/C-101: Especialidades de Sora e Veil apontavam pra nomes que não são Habilidade
  (Liderança→Política, Fogo→Integridade).
- M-30: os dez traços raciais condicionais viram campo (`bonusCondicional`), Vitalidade do
  Orc/Meio-Orc soma PV de verdade. Dois dos três motivos que travavam a recalibração de M-43 e da
  metade de custo do M-46 caíram (a recalibração em si continua esperando decisão de mesa).
- Idades de raça revisadas (Humano ganha idade, Anão/Elfo ganham marco duplo adulta+maturidade,
  Gnomo desce pra 300+, Halfling volta a 18/~200 desfazendo metade da M-46 antiga, Meio-Orc ganha
  vida própria 70+) e Régua de Relação expandida pras oito raças, depois **movida de
  `relacoes-sociais.md` para `racas.md`** (fonte única, por pedido do humano).
- **Aparência recalibrada**: curva linear −6 a +6 (era −5..+5 com platô de 3 níveis em "Comum"),
  mesma fórmula de custo de sempre (`2×nível` acumulado, topo ainda em 156 XP). Nomes novos:
  nível 5 "Sem graça" (−1), nível 8 "Atraente" (+2). Os quatro personagens publicados
  (Kael/Sora/Veil/Bram) corrigidos no rótulo, nível e XP intactos. PROCEDE final em `09e41bb`.

## Em aberto, conversa ainda não fechada com o humano

**Como a Aparência entra no Ataque Social e na Régua de Relação.** Nada disto foi decidido nem
dispachado pra Executora ainda; são propostas do Arquiteto esperando reação do humano.

1. **Proposta dos três baldes**, pra substituir a frase solta atual ("ajuda quando alinhado,
   atrapalha quando contra"): toda Habilidade usada como abordagem no Ataque Social cai num de
   três grupos.
   - **Charme** (Sedução, Lábia, Etiqueta, Atuação): Aparência entra normal (+ pro bonito).
   - **Medo** (Intimidação, Interrogatório sob pressão): Aparência entra **invertida** (+ pro
     feio, − pro bonito).
   - **Neutro** (Persuasão, Negociação, Manha, Liderança, Sociabilidade genérica): Aparência não
     entra.
   - `Disfarce` fica fora dos três baldes, já tem regra própria (marcante demais atrapalha, pros
     dois lados).

2. **Buraco achado**: `defesaSocial()` (`calc.ts:144`) não tem termo nenhum de Régua de Relação.
   Hoje, seduzir um Nêmesis (−6) custa o mesmo Ataque que seduzir um estranho Neutro, contanto que
   os traços sejam iguais. A única fricção que já existe é "sair do Neutro" (3 passos pra cruzar o
   meio), e ela não se aplica a alvos já hostis.
   - **FECHADO em 18/09/2026, rodada 84, PROCEDE em `1c6fab9`.** Não é o `+2 × |nível|` só-negativo da
     proposta original: virou **um termo só, com sinal**, multiplicador **×1**. A Defesa Social
     ganha o nível da régua quando o Ataque rema CONTRA o que a pessoa sente (`+nível` pra esfriar)
     e perde quando rema A FAVOR (`−nível` pra aquecer). Uma regra em vez de duas, e fecha um
     buraco que a versão só-negativa deixava: virar um amigo devotado contra você (nível +6,
     ataque pra esfriar, Defesa 18 → 24, melhor cortesão do jogo cai pra 30,5%).
   - **Por que ×1 e não ×2**, com a conta (convolução exata, alvo Vesna base 18, subir de −6 a 0
     só com conversa): cortesão Aparência +6 faz em 9 trocas no ×1 e 50 no ×2; cortesão Aparência
     0 leva 72 trocas no ×1 e trava no ×2; mediano trava nos dois. O ×2 fecha a porta até pro
     especialista. **Um número circulou errado nesta conversa**: "×1 dá 9 trocas" era só do
     cortesão com Aparência +6, não do caso típico.
   - O travamento é conjunto (hostilidade profunda MAIS alvo composto), não do termo sozinho: o
     mesmo mediano subindo de −6 leva 9 trocas contra base 7, 99 contra base 12, e trava de 15 pra
     cima. E os **atos** (passo fixo, sem rolagem) furam o travamento: dois "salvar a vida" (+3)
     atravessam de −6 a 0 sem rolar nada, que é o que o capítulo já promete.
   - **Não vira código.** O nível é por relação, não está na ficha, e combate social não existe no
     Grid. Texto de capítulo mais uma `reguaNota` em `regras.json → derivados.defesaSocial`,
     seguindo o precedente do `especialidadeNota` ali ao lado.

3. **Centelha no Ataque Social: CONFIRMADA como está** (pergunta do humano em 18/09, respondida
   com conta e encerrada). Tirar a Centelha do ataque e manter na defesa equivale a `−Centelha do
   atacante` em todo Ataque Social. Hoje ela cancela entre iguais (`ataque.centelhaMult: 1` e
   `defesaSocial.centelhaMult: 1`, e a nota do `ataque` em `regras.json:811` **já declara** que a
   simetria é intencional). Removê-la do ataque troca "cancela entre iguais" por deriva defensiva
   crescente: dois personagens idênticos que só diferem na Centelha acertam 90,2% em qualquer
   patamar hoje, e passariam a 90,2% / 69,5% / 40,0% nas Centelhas 0 / 3 / 6. Ou seja, a mesa
   inteira ficaria socialmente mais inerte conforme a campanha avança, que é uma inversão de escala
   num sistema cuja progressão é a Centelha. Resolveria a saturação do topo, mas isso tem conserto
   mais barato (o termo de régua acima, mais publicar um defensor social de verdade: Defesa 27 já
   derruba o cortesão máximo pra 60%).

Ainda não abordado da lista original de quatro frentes que o humano pediu ("como mover a régua,
quais jogadas fazer pra pedir favores, o que leva alguém a ser inimigo, qual a diferença pro duelo
social"): o **ritmo de mover a régua** (passos, custo de favor, esfriar) e **onde termina o dia a
dia e começa o Combate Social** ainda não tiveram nenhuma proposta discutida; só a peça da
Aparência dentro deles foi tocada até aqui.

### Modo devagar · decidido com o humano em 18/09/2026, ainda não despachado

Desenho fechado até aqui (conversa em andamento, faltam itens 2 e 3 e a regra de resistência):

- **Dois modos.** RÁPIDO (na cena, com dados): Ataque Social como está, régua entra como
  dificuldade e **não se move**; a Margem compra **alcance do pedido** (quantos níveis acima da
  relação atual, só desta vez), reaproveitando a tabela de "Pedir as coisas". DEVAGAR (sem dados):
  único lugar onde a régua anda. Isso colapsa em um só os **três** lugares que hoje movem a régua
  (`:75`, `:153`, `:189`).
- **Escala estática**: `Defesa estática = Compostura + Sociabilidade + Centelha + termo de régua`.
  O `×2` cai porque ele existia para casar com a média de um pool (`soma × 1,75`); ataque estático
  vale `soma × 1,0`, então a defesa que casa é `×1`. Não é número escolhido, é a mesma calibragem.
  Vesna 18 → 11, vendedor 8 → 4. Ataque estático = Influência + Habilidade (0 a 12).
- **O tempo é a moeda, não há teto de bônus** (decisão do humano, contra a minha proposta de teto):

      Tempo do passo = máx(1, Defesa estática − (Influência + Habilidade) − Σ bônus dos gestos)
      no máximo UM gesto por intervalo

  O limite **emerge** (gesto que leve o tempo abaixo de 1 intervalo não compra nada) em vez de ser
  decretado. A trava de um gesto por intervalo é o que impede quatro gestos +1 dominarem um +4.
- **Ação e Firula são a mesma coisa** (achado: `:163` já chama de Firula "um presente certeiro, um
  favor lembrado, uma visita na hora certa"). A ação diz o que foi feito, o nível da Firula diz
  quão bem caiu. Não há lista separada nem bônus de ação separado.
- **Dinheiro exponencial por nível** compra pressa, e a medida mostra que o trade é real: bruto
  reconquistando um Nêmesis gasta 81 intervalos só com carisma, 42 com gestos +1 (1 moeda por
  intervalo poupado), 25 com gestos +4 (4 moedas por intervalo poupado).
- **Base de tempo = Defesa Social estática** (escolha do humano entre ela, Vontade e a mistura).
  Ganha por carregar o termo da régua de graça e por não disputar emprego com a Vontade, que já é a
  munição da resistência ativa.
- **Resistir** (ainda não fechado, proposta medida): 1 Vontade por período, **travada até o cortejo
  acabar**. Custo fixo simples não funciona (a recuperação passa por cima em qualquer duração);
  escalante funciona mas muda de comportamento conforme o período, e o período aqui escala com
  longevidade de raça. O travado dá "você resiste por tantos períodos quanto tem de Vontade",
  independente da duração.

**C-item nascido daqui, anterior a esta conversa, não misturar com o lote:** a escala de Firula
deste capítulo (0/+1/+2/+4, teto +7) diverge da canônica em `habilidades.md:104-113`
(+2 / +1d6 / +2d6, e "**não há teto por cena**"). O +7 é auto-referente (1+2+4) e não deriva de
nada fora dali.

**Buraco já localizado na frente do ritmo, conferido em 18/09/2026 e ainda sem proposta:** o
capítulo não diz **com que frequência** se pode tentar mover a régua por conversa. Grep por
"por cena / uma vez / por dia / por semana / período" em `relacoes-sociais.md` devolve só o teto de
Firulas da Influência Estendida (`:200`, "+7/período") e a frase de magnitude do `:97` ("uma
conversa só raramente tira alguém do Neutro"), que fala de quanto e não de quantas vezes. Os atos
têm passo fixo, o esfriar tem cadência (1 passo por estação), o favor tem custo (−1 passo), e a
conversa não tem freio nenhum: o único custo é a Vontade do **defensor**, que é recurso dele e se
recupera. Nada impede encadear tentativas até passar.

## Outras pendências da sessão, sem relação com Aparência

- **Varredura do bestiário**: outra instância (peer session, fora do arranjo) está escrevendo
  `docs/simulacao/caixa/jogador-novo-bestiario.md` (siglas a partir de C-102). Ainda não voltou;
  não commitado; não é meu, não mexi.
- **`docs/simulacao/caixa/analise-aparencia.md`**: a análise numérica que embasou a decisão da
  curva nova (ainda não commitada; pode ser absorvida ou descartada, já cumpriu o papel).
- **A lista do que incomodou numa batalha real jogada pelo humano** (prometida ainda na abertura
  desta sessão, pra decidir entre Fase 2.5 e Fase 4 do `PLANO.md §8`): pedida, nunca entregue. O
  humano mudou de assunto pra Centelha/raças/Aparência antes de trazer a lista. Continua em
  aberto, sem novidade.
