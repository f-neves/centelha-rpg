# Lista única de decisões · 24/09/2026

**O que é:** tudo o que só o humano decide, numa lista só, para ele responder em bloco. Montada pelo
Arquiteto a partir de duas medições (a lista dos `[DECIDIR]` dos temas A a K e o cruzamento dos 82
achados de `leitura-de-novato-2.md`), conferidas por amostra. A ordem é a que o humano pediu:
as cinco raízes, o monte B da leitura de novata, as duas perguntas das rodadas 98 e 99, e o resto.
O monte A (conserto sem escolha) está em `leitura-de-novato-2-cruzamento.md`, seção 2.

Formato de cada linha: o que está em jogo · as opções · o que trava.

## 1 · As cinco raízes (`Pendencias.md` §6; a sexta, promovida e depois rebaixada a conserto em 24/09/2026, está riscada no fim)


1. **RAIZ · F7** · aprovar a §7 do `Lore_Centelha.md` (o panteão), inteira em [PROPOSTA v1]: três famílias de fé, as grandes potências, cada cultura casada com uma mitologia real, os seis papéis religiosos · opções: o tema não propõe alternativa; a pergunta é travar ou não a proposta v1 · trava F5 e F6 (o nome de uma cidade carrega o panteão dela).
2. **RAIZ · F3** · como clérigo, paladino e monge tiram poder divino (Centelha e campo de crença) · opções: o tema não propõe; só fixa que clérigo e paladino são Iniciação, monge é Marcial, e que fecha junto com as Trilhas · trava B4 (47 criaturas com fraqueza a sagrado e 8 a profano sem fonte de dano).
3. **RAIZ · camada de Tradição (C1 e C2)** · C1: a jogada dos casos de fronteira, Mirado (Acerto Arcano + Percepção ou Destreza, já em vigor) contra Moldado (perícia da Tradição, só proposta); C2: a perícia de conjuração de cada Tradição · opções: C1, uma rolagem só nos híbridos (recomendada pelo tema); C2, dar aval à tabela proposta, e criar ou não um traço de Fé/Devoção para a Iniciação · trava a metade Tradição da A11, e por consequência C3 e C4 (portar `trilhas.json`, revisar o mortal-tocado).
4. **RAIZ · G12** · se o teto 4 do Desgaste vale para a soma de Desgaste com ferimento (desde `2b08d7a` os dois já cortam do mesmo pool, com piso comum em 1d6) · opções: o teto 4 vale para a soma; não vale (as outras duas saídas originais, "ferimento vira Desgaste" e "correm em paralelo", foram superadas pela §4b) · trava a prosa do capítulo de Vida & Ferimentos nesse ponto.
5. **RAIZ · E4 com E8** · E4: a jornada "Neutro → +2 Apreço" publicada (4/10/22/34 intervalos) não bate com a fórmula (4/15/27/39), e a faixa negativa "um passo por nível" foi publicada sem decisão; E8: a trava de um gesto por intervalo tem dente (15 pontos saem em 3 intervalos, 14 em 6) · opções: E4, o termo passa a contar passos de distância do Neutro, ou a linha da jornada se corrige para 15/27/39, e ainda termo fotografado no começo ou recalculado a cada passo (só o segundo fecha com os números); E8, aceitar o dente e dizê-lo na prosa, arredondar o Tempo para cima antes da trava, ou trocar a trava por "gestos ≤ Tempo calculado sem gestos" · trava o capítulo publicado de Relações Sociais (a medida 81 → 42 → 25 e a oração da faixa negativa).
~~6. RAIZ · a Corrida que o Grid anda~~ · **SAIU DAS RAÍZES em 24/09/2026 e virou item de conserto, o `K31`** (`docs/pendencias/K-combate-linha-do-tempo.md`), com a direção escrita: o Grid passa a seguir as duas fases publicadas. Motivo, do humano: ela nasceu como decisão porque ele não sabia que a regra estava publicada desde 11/06; as outras opções reescreviam regra publicada para justificar implementação incompleta. O salto correndo continua decisão dele, na seção 2 (a24).


## 2 · O monte B da leitura de novata (cabem duas leituras)

Os achados a22, a23 e a24 (Corrida "50 a 67%", a Investida da Sora, o salto correndo) foram pedidos no monte A como contas, e o cruzamento os moveu para cá; **desde 24/09/2026 são a RAIZ 6, na seção 1**. O texto de então, mantido como registro (a premissa das velocidades fixas foi corrigida na raiz 6): o 50 a 67% sai das velocidades fixas do Grid (`MODOS_MOV`, `src/lib/combate-tempo.ts`), e as fórmulas da ficha dão 107% a 143%. São dois modelos de movimento, e consertar o número de um lado quebra o outro motor.


- a3 · alvo do interrogatório sem tortura · (1) Defesa Mental, estendendo a §17; (2) Defesa Social, porque é coagir (`defesas.md:15`); (3) Integridade passiva, como em `acoes-sentidos-e-engano.md:107` · trava o Interrogar e a ficha de NPC interrogado.
- a4 · Atributo do arremesso · (1) Destreza ou Força à escolha (`habilidades.json` arremesso `["destreza","forca"]`); (2) fixo por arma pelo `atrib` de `armas.json` (machado e pilum Força, adaga Destreza); (3) sempre Destreza e o JSON se corrige · trava o acerto de toda arma arremessada na ficha e no Grid (o tiro com Percepção não está em disputa).
- a5 · Atributo do ataque social · (1) Influência fixa, como exceção nomeada à M-14; (2) Atributo pela descrição (M-14), mudando `relacoes-sociais.md:138` e `regras.json:2649` · trava a Intimidação por Força no Combate Social e no cortejo.
- a11 · fera (Int 1) tem Defesa Social · (1) não tem, e dizer se "-" é imune ou indefeso (baldeA #6 propõe imune); (2) tem, via Sobrevivência, e o bestiário regenera as 164 criaturas de Int 1 · trava acalmar, domar e intimidar animal.
- a13 (Elfo/Orc) · o Humano parte do Neutro com todos · (1) vence `racas.json:11` e saem as exceções de `racas.md:24`; (2) vence o capítulo (precedente do item 2) e o JSON ganha +1 Elfo/Meio-Elfo, −1 Orc · trava a Régua inicial humano-elfo e humano-orc.
- a16 · preço de subir Proeza · (1) preço cheio (C-11), e a ficha precisa guardar histórico; (2) só a diferença (`regras.json:630`, `calc.ts:343`), e `criacao-de-personagem.md:57` volta · trava o gasto de XP entre sessões.
- a20 · coluna "Morre a partir de" da queda · (1) recalcular pela morte atual (comum morre entre 20 e 25 m); (2) recalibrar o dano para manter 15 m letal · trava a letalidade de queda e o G11.
- a21 · Amortecer · (1) reduz a ALTURA e lê a tabela de dano (`:133` ao pé da letra: 7, 22, 81); (2) tira DANO fixo, como as colunas impressas fazem de modo consistente (≈ metros × 2,2: 6, 20, 75), e o `:133` se reescreve · trava a tabela de queda (mesmo G11 do a20; nenhum JSON responde).
- a22 + a23 · viraram o `K31` (conserto, 24/09/2026; ver a nota da raiz 6 na seção 1). **a24 · o salto correndo, e continua decisão do humano:** (a) vence o JSON `saltoHorizontalCorrendo` (`regras.json:888-891`, D 1,5, A 1,5, C 1, sem base: 3 m para Des 2), ou (b) vence o capítulo e o rótulo da ficha (Corrida + Atl ÷ 2 + Centelha: 5,5 m) e o JSON se reescreve · trava o salto correndo na ficha e no Grid.
- a27 · tag Pesada · (1) legenda só descritiva, como a Ágil no C-78; (2) implementar o −1 e tirar a tag das bestas; (3) separar "pesada (Força)" de "pesada (volume)" · trava a legenda de tags e a Besta Grande.
- a30 · Absorção do bestiário contra a regra da Couraça · (1) o exemplo declara Absorção própria do bestiário; (2) recalcular o bestiário pela regra (Verme 8, Tarrasque 20); (3) trocar o bicho do exemplo · trava o exemplo que ensina a Couraça e a confiança em `absorcao` do bestiário.
- a31 · oficina de mestre · (1) só requisito, 15 semanas, nota na tabela; (2) aplica o −4, ~8 semanas, reabrindo §4 item 15; (3) −4 só abaixo do Excepcional · trava o prazo das peças finas.
- a33 · nomes de ofício · seis mapeiam sem escolha (Armaria→Ferreiro, Alfaiataria→Costura, Curtume→Couraria, Herbalismo→Herbologia, Iluminura→Caligrafia, Arcos→Carpintaria); Serralheria: (1) Ferreiro; (2) Engenharia; (3) secundária nova · trava o Requisito de `:140,:155,:168`.
- a34 · preço e efeito por grau de qualidade · (1) régua do ofício manda; (2) régua do catálogo manda; (3) tabela nova fundindo as duas · trava o preço de peça melhorada e o G13.
- a35 · renda do artesão · (1) a fórmula do ofício manda e a tabela ajusta; (2) a tabela manda e a fórmula ganha multiplicador; (3) medem coisas diferentes (líquido x bruto) e o texto diz · trava a economia do tempo morto.
- a40 · Meditar e Fé contra os três caminhos · (1) Meditar é o caminho do sono, sem rolagem; (2) Meditar vira quarto caminho com Margem; (3) a Fé vira gancho sem número · trava o relógio da Vontade (M-11b).
- b1 · quanto a Vontade compra fora do social · (1) 1 Vontade = +1d6 (moeda do Frenesi); (2) anula uma penalidade ou degrau; (3) custo por efeito · trava o uso de Vontade e a blindagem de `defesas.md:106`.
- b2 · Centelha fora de ataque e Defesa · (1) +1 sempre (`coracao-do-sistema.md:88`); (2) só ataque e Defesa (`centelha.md:44`); (3) só em disputa, nunca contra Dificuldade fixa · trava todo teste de quem tem Centelha.
- b4 · porcentagem fracionária e recuperação abaixo de 0 · (1) ratificar o motor (arredonda para baixo, `mesa-core.ts:101`); (2) arredondar para cima; Vida ≤ 0: linha própria ou Crítico após estabilizar · trava o estado na fronteira e a cura de quem caiu.
- b5 (pico 7) · o +1 racial leva o pico de criação a 7 · (1) sim; (2) não, 7 só na evolução · trava a criação de Elfo, Orc, Anão.
- b6 (Dificuldade de mascarar) · (1) Defesa passiva de quem observa; (2) Dificuldade fixa por multidão; (3) sem teste · trava a M-20 na mesa.
- b6 (Orc com Aparência 0) · (1) piso −6; (2) estender a curva a −7 · trava o Orc no piso (`calc.ts:166` devolve 0 para chave ausente).
- b7 (Tratar) · (1) tabela 0/1/2/3 como pontos a menos; (2) 1 ponto por Margem; (3) um pulso a menos por Margem · trava Tratar.
- b7 (Contágio falhado) · (1) Incubação; (2) Instalada · trava doença contagiosa.
- b8 · Margem da Longa · (1) (média − Dificuldade) ÷ 6 no fim; (2) por intervalo; (3) Longa não gera Margem · trava `acoes-e-sistema.md:53` e a M-23 fora do dado.
- b9 · Margem por cima do progresso em Escalar/Nadar · (1) não, a frase só descreve; (2) sim, +3 m (+5 m) por Margem · trava o exemplo do 17.
- b10 · armadura na Furtividade e natação · (1) M-07: tira dado (quantos?) e substitui dobra e +4; (2) as duas somam; (3) só a Circunstância +4 · trava Furtividade com armadura; `regras.json:977` contradiz a M-07.
- b15 (pares Meio-Elfo, Orc→Humano) · (1) Neutro com os não listados; (2) reciprocidade automática · trava a Régua inicial desses pares.
- b16 · o gesto é Firula · (1) é, e devolve reserva; (2) é outra régua, e a Firula comum vale à parte no social · trava a economia de reserva no social.
- b17 (semana de trabalho de 6) · (1) 6 úteis em 8; (2) alinhar a 8 · trava a renda semanal.
- b18 (teto 4) · vale para secundárias · (1) sim; (2) só primárias · trava a validação da ficha.
- b20 (Aliado) · (1) tabela por nível e regra de quem escolhe Aliança/Devoção; (2) o Mestre decide · trava o Aliado.
- b20 (correlatas do Halfling) · (1) lista fechada; (2) o Mestre decide · trava o bônus (secundária não tem primária-mãe).
- b21 · Vontade como parcela · (1) Rezar/Exorcizar trocam Vontade por Atributo; (2) Vontade sozinha (M-06), definindo máximo ou atual · trava Rezar, Exorcizar e as resistências das Artes.
- c5 · número do exemplo do Coletivo · (1) −5; (2) −3; (3) −9 com a dobra da armadura · trava se a dobra entra no Coletivo (liga-se a b10).
- c7 · Venerável · (1) −2 no total; (2) −3 somado · trava a ficha de idoso (`racas.json` sem campo).
- c10 (Escapismo) · (1) tirar a menção; (2) apontar para secundária existente; (3) criar Escapismo · trava Escapar de amarras.
- c13 · teto +6 dos Antecedentes · (1) tirar; (2) desconto acima de 3 continua subindo na Simpatia; (3) manter e explicar · trava Antecedente de nível 4 a 6 na Régua.


## 3 · As duas perguntas das rodadas 98 e 99

- **A Arte mirada ferida** (PERGUNTA da Revisora, rodada 98) · o livro diz que o ataque à distância é a única rolagem de Percepção que a dor alcança, "porque o arco e a besta pedem o corpo firme", e não diz se a Arte mirada (Percepção + Acerto Arcano) conta · opções: não sofre (recomendada: o motivo escrito é o corpo firme) / sofre como arco e besta / sofre só a Arte que lança projétil · trava a frase de `vida-ferimentos-cura.md`. **Hoje não muda nada na mesa: nenhum código rola a Arte mirada.**
- **O contrapé na iniciativa social** (PERGUNTA da Revisora, rodada 99) · `relacoes-sociais.md` manda a iniciativa social "pela mesma regra da iniciativa física", e a seção linkada traz o contrapé na segunda linha · opções: vale no social / não vale, e o texto diz que não · trava a frase do C-22. Nada muda no Grid.

## 4 · O resto dos `[DECIDIR]` dos temas A a K

## A · Arcano · As Artes

Nenhum item de A diz travar outro; o A19 encosta no A9 e vai primeiro.

- **A19** · o que a matéria manifestada faz em número (62 m³ de chama a quem está dentro, quanto aguenta uma fatia de Terra, o peso ao desabar) · opções: o tema não propõe · encosta no A9 (Efeito Especial no bestiário) e no capítulo de Vida & Ferimentos.
- **A1** · os limites de guardar um feitiço · opções: o tema não propõe; as perguntas são se a penalidade acumula por feitiço, se há teto de quantos carregar, e se o guardado vence com o tempo · nada.
- **A2** · quais Artes não elementais ganham foco, e como medir a abundância de um foco que não é elemento · opções: o tema não propõe · nada.
- **A3** · o desconto da fonte fica fixo em +1 · opções: manter fixo; deixar subir por lugar sagrado do elemento, estação do ano ou pacto · nada.
- **A4** · Rituais · opções: o tema não propõe; as perguntas são se a regra antiga de "metade do Mana no Ritual" morre de vez, e se existe Efeito que só funciona no modo lento (o círculo de invocação) · nada.
- **A5** · Clarão Cegante hoje sem Dificuldade (quem olha sofre a Penalidade, sem rolar) · opções: confirmar assim; dar uma resistência · nada.
- **A6** · o campo `escalonavel`, órfão desde que os níveis dos Efeitos ficaram fixos · opções: vira `sucede` (comprar a Fenda por cima do Terremoto pagando a diferença); some do schema · nada.
- **A25** · a geometria das Artes que não põem elemento no mundo (Cura, Fascinação, Adivinhação, Conjuração, Metamorfose) · opções: o tema não propõe; hoje o improviso delas vira Dardo, e a §5 promete parâmetros próprios (Gravidade, Plateia, Porte) sem forma no chão · nada declarado.
- **A26** · o improviso pode nascer num ponto escolhido · opções: voltar à §5.4 (nasce no feiticeiro, nunca é colocado); manter o afrouxamento provisório do tabuleiro (começa onde se clica, com Alcance conferido), que muda a fronteira entre improviso e Efeito Especial; o tema manda decidir depois de jogar · nada; o tabuleiro roda no provisório.
- **A16** · escadas de abundância para os materiais que faltam (Areia, Som) · opções: o tema não propõe; as perguntas são quais materiais ganham escada própria e se Som é escola de Ar ou outra coisa · nada.

## B · Bestiário

- **B4** · nenhuma fonte de dano `sagrado` nem `profano` · opções: o tema não propõe, espera a mecânica de clérigo e paladino · travado pela F3 (raiz 2); enquanto isso metade das fraquezas é decorativa.
- **B5** · `prata` não existe como dado de arma · opções: campo `material` em `armas.json`; etiqueta narrativa que o Mestre aplica · fraqueza de vampiro e lobisomem sem gatilho.
- **B6** · `sol` é ambiente, e só o vampiro tem · opções: mover para a ficha de Ambiente (`Acoes_Sistema.md` §8.5), sugerido com "talvez"; manter na régua de dano · nada.
- **B9** · onde a criatura editada mora · opções: o tema não propõe; aponta duas pontas: editar criatura do livro não tem destino (o `inimigos.json` é gerado, e a correção voltaria à `conversao-monstros.html`), e o `ehAdmin()` é portão de interface, que deixa de bastar se a edição escrever no Supabase · nada hoje; trava a edição de criatura do livro e qualquer gravação dela no banco.

## E · Social, Mental e Antecedentes

- **E6** · o preço de um gesto em moeda, que cresce por nível · opções: o tema não propõe (o capítulo deixou com o Mestre, marcado ⚑) · a medida publicada 81 → 42 → 25 depende dele.
- **E3** · a banda neutra da Régua de Relação, e o decaimento · opções: banda 5 (hoje, rompe o Neutro em 3 passos); banda 3 (a régua anda mais rápido); decaimento rumo à baseline do par (hoje) ou rumo ao neutro mais próximo · nada declarado; o §5 do Pendencias.md registra que a M-36 decidiu "a banda é 3" numa unidade que talvez não seja a do E3.
- **E5** · o que a leitura revela no modo devagar ("um intervalo do que ainda falta" é redação da Executora, não decisão) · opções: confirmar a redação da rodada 85; o tema não propõe outra · o capítulo publicado segue marcado ⚑.

## F · Lore

- **F1** · como os deuses romperam a Lei na Grande Guerra, por que romper foi destrutivo, e se alguém hoje sabe ou suspeita · opções: avatares, campeões ou uma brecha, sem recomendação · nada.
- **F2** · quem impôs a Lei · opções: a proposta (o próprio cosmos, a Primeira Luz reagindo ao ser agarrada, sem legislador), confirmar ou não · nada.
- **F4** · os planetas: quais importam, habitados, alcançáveis, o que sobrou da fase interplanetária · opções: o tema não propõe · nada.
- **F10** · a moeda mecânica das datas afinadas (já decidido que é leve) · opções: +1d6 por grau; um degrau de Dificuldade a menos; recurso (Centelha e Energia rendendo mais); nada além de ficção e frequência de encontros · nada.

## G · Ações & Sistema

- **G6** · o Valor Passivo de Prontidão (2 × Percepção + Prontidão) como "notar sem procurar" · opções: confirmar a calibragem (servo 6, sentinela 10, elite 16, mestre de espiões 20); o tema não propõe alternativa · o resto da família de Sentidos herda a resposta.
- **G2** · a Especialidade rende ~2,5× menos por XP que a secundária · opções: baratear a Especialidade; deixar dito que ela serve para o que não tem secundária pronta · não trava as fichas; mexe na economia de XP.

## H · Arremesso

- **H3** · quatro assuntos da proposta (§7): funda e ferramentas que estendem o braço, a energia que chega, o limite de pegada, as duas mãos · opções: só a funda tem proposta (×1,5, ao lado do fator de forma); os outros três o tema mede e não propõe · a funda existe como arma sem número próprio.

## I · Mesa virtual · tempo real

- **I11** · entrou em 24/09/2026 (tinha a pergunta sem a marca) · **uma decisão, com duas partes: quando trava a FORMA da Arte (a figura) e quando trava a MIRA (onde ela cai)** · o que cada fonte diz: a `§5.5` do `Arcano_revisao.md` manda as duas no último Tick ("na declaração se compra o tamanho, no último Tick se dá a forma e a mira"); o código trava as duas na declaração (`conjurar` posiciona a figura antes de montar); a régua nova (`docs/simulacao/CONJURACAO.md`) não diz quando nenhuma das duas trava (tem uma frase só: que a forma não precisa estar decidida na declaração) · opções, para cada parte: trava na declaração, e quem se move durante o Preparo ESCAPA; trava no fim do Preparo, e quem se move NÃO escapa; as duas partes podem ter respostas diferentes · os dois documentos agora apontam um para o outro · trava a implementação da régua da conjuração, e a chance de escapar de toda Arte de área.
- **I12** · entrou em 24/09/2026 com `[DECIDIR]`, depois de o humano discordar do `[FAZER]` e o Arquiteto conferir · o alcance da arma de arremesso no Grid · **por que não é só transporte, lido no código:** (a) o catálogo dá um `distMax` FIXO às 8 armas de arremesso de `armas.json`, e a regra publicada (`Arremesso.md`) diz que o máximo sai da Força de Arremesso de QUEM joga: duas fontes para o mesmo número; (b) as frações do alcance livre das armas arremessadas estão numa tabela do `Arremesso.md`, e nenhuma das 8 tem `alcanceLivreFrac`; (c) o "a folha cala para o arremesso" do item pode estar velho: `alcanceDaArma` (`src/lib/alcance.ts`) só devolve nada quando a arma não tem `distMax`, e essas 8 têm, então a folha mostraria faixas do catálogo com o livre em zero (leitura de código, não exercitada na tela) · opções: (1) vale o `distMax` do catálogo, e o `Arremesso.md` se corrige; (2) vale a Força de Arremesso de quem joga: o `RESUMO` passa a carregá-la (a ficha já a calcula e `alcanceArremesso` já existe), e o catálogo troca o `distMax` dessas armas pelas frações; (3) até decidir, a folha cala de verdade para o arremesso · o `Arremesso_Regra.md` (proposta aberta do tema H) pode mudar a fórmula · trava a faixa de distância de toda arma arremessada no Grid.

- **I9** · o caderno `Grid_melhorias.md` (~25 ideias com custo) · opções: o tema não propõe; aponta três ideias que pedem decisão de regra antes do código: terreno por hexágono, altura e face da peça · trava o código dessas três.

## J · Infraestrutura

- **J2** · qual hospedeiro · opções: Cloudflare Pages com a zona na Cloudflare (a sugerida); Netlify com a zona no Registro.br; Vercel só se o Centelha nunca gerar receita · trava J3 (sair do GitHub Pages, e só então o Astro 7).
- **(sem sigla) A linha de fechamento do `test-grid` é texto fixo** · a frase final nomeia o que o teste deveria cobrir, não o que rodou · opções: a barata (imprimir quantas asserções rodaram e falhar abaixo de um piso, ~10 linhas, com o piso vindo de catraca versionada); a fiel (cada bloco se registra e o fechamento lista o que rodou, ~40 sítios, passa pelo `CATALOGO` antes) · nada; a frase segue podendo mentir.

## K · Combate · a linha do tempo

Os que travam outro item vêm primeiro.

- **K28** · entrou em 24/09/2026 (tinha a pergunta sem a marca) · o deslocamento não tem zona de controle nem ataque de oportunidade · opções: é escolha de design, e o capítulo diz que não há; é lacuna, e a regra se escreve · trava o fechamento do K28, e quanto custa passar ao lado de um inimigo.
- **K14** · o motor da bancada só mede o canto "todo mundo esquiva" (ignora a `defesaArma`, que entra no Bloqueio) · opções: o tema não propõe; a pergunta é como o motor escolhe entre Esquiva e Bloqueio (o roteamento pelo "como") · trava K11 (nenhum ajuste de catálogo com base no motor), a comparação justa do K21, e pesa no K24.
- **K17** · o arqueiro a 63,9% a 100 m contra 35,8% de hoje, porque com `R = 0` nunca fica exposto · opções: o tema não propõe (conversa com o K4; o bloqueio pelo K13 que ele cita já caiu) · trava a fase 4 do K5 (o capítulo IX).
- **K27** · o que falta do golpe tardio: o custo de o atacante acompanhar o alvo que se moveu (§10 do `Golpe_Tardio.md`) · opções: o tema não propõe número; o K28 registra "o atacante acompanha com o próprio passo", e o §5 do Pendencias.md o dá como suspeito de fechado, com a fatia 2 e a prova de mesa faltando · trava o K30 (a mesma caixa reaberta, generalizada) e sustenta o K6.
- **K4** · o Preparo de distância e arremesso · opções: P=1 (se o custo medido for caro demais); P=2 (se for o freio que faltava) · destravado desde que o K13 caiu; conversa com o K17.
- **K11** · Alabarda a 87-96%, Maça a 0,7-13%, e a arma de Impacto de uma mão sem nicho · opções: `forcaMult` da Alabarda cai para 1 (como a Lança); o dado da Alabarda cai; para a Maça o tema não propõe · travado pelo K14; agrupado com K24 e K21.
- **K24** · montante e martelo com acerto 0 e Defesa −2, e o dano não compensa · opções medidas: +2 de dano fixo (classe pesada a 64,4%, amplitude 26,5); +1 dado (68,7% e 31,8); a conclusão do tema é conserto por arma e não por classe · agrupado com K11, K21 e K14.
- **K21 (marcado FAZER/DECIDIR)** · o preço da forma de duas mãos da arma versátil (hoje upgrade grátis: 72,9% contra a de uma mão) · opções: Força ×1,5; dado sem Margem; Velocidade +1 (cobrar P2 foi medido e devolve pouco) · depende do K14; a parte FAZER (espada longa para duas mãos) mexe no contrato `equip.ts`.
- **K8** · cinco bordas ainda abertas: duas áreas na mesma janela, reação e Reflexiva no mesmo gatilho, abortar (Firme × Solta), a dívida na virada da cena, e se o golpe normal interrompe · opções: o tema não propõe · nada declarado.
- **K9** · o teto da carga voluntária (1 Tick de Preparo vale ~+2) · opções: teto de 3 Ticks (a proposta) · o Mirar de hoje segue caro demais (cobra uma ação, entrega um Tick).
- **K6** · a leitura do sinal (§8) · opções: um desenho só (Percepção + Prontidão no golpe físico, leitura grátis com mesma arma e perícia, finta a 1 Tick de Preparo), marcado "fica por último" · nada; depende do golpe tardio (K27).
- **K20** · o que cabe no Preparo e na Recuperação · opções: o tema não propõe além dos pontos: o número do Deslocamento na Recuperação (proposta de 2 Ticks por metro, que o K28 já baixou para 1), o −1d6 dos testes na Recuperação, escrever que o proibido é o ataque "normal", e listar as ações livres · nada; o §5 do Pendencias.md o dá como suspeito de fechado.
- **K18** · a Técnica Ambidestria ficou sem função · opções: ganha outro benefício; a paridade da dupla fica atrás dela (e a dupla sem treino segue armadilha, 22,9% contra 54,0%) · nada.
- **K25** · a Defesa da arma e a do escudo somam (`ficha-engine.ts:1531`), contra o singular da `defesas.md` · opções: (a) vale a melhor das duas (a mais barata, e o texto já sugere); (b) rever o `bloqCaC` dos escudos grandes; (c) manter e assumir · nada.

## Adiados com DECIDIR

- **D3** · Densidade dos funis.
- **D6** · Custo de Técnica e de Arte em ×10.
- **H4** · O degrau de baixo do fator de forma: ÷2 ou ÷3?
- **I8** · Ponteiro ao vivo.
- **J10** · Os 23 travessões do `regras.json`, e seis deles NÃO são travessão.

## A conta

Listados: **47 não adiados** (os 5 blocos-raiz cobrem 7 siglas: F7, F3, C1, C2, G12, E4, E8; mais 40 nos grupos) e **5 adiados**, 52 no total.

A coluna DECIDIR da seção 0 soma **45**. A diferença de 2 é de regra do gerador, não de item perdido:

- **K21** tem marca `FAZER/DECIDIR`, e o gerador conta pela primeira palavra, então ele cai na coluna FAZER.
- **O item sem sigla do tema J** traz `[DECIDIR]` no fim do título e não na casa da marcação, então o gerador o conta em "Outra marca".

Os 5 adiados ficam fora das duas contas (a coluna Adiados da seção 0 soma 7, e os outros dois, C3 e J0, não são DECIDIR).

Fora da lista, por não terem a marca: quatro itens parciais sem marcação carregavam pergunta aberta no texto (A11, a metade Tradição, que é a raiz 3; I11, se a mira e a forma travam na declaração ou no fim do preparo; I12, o arremesso no alcance do Grid; K28, se a ausência de zona de controle é escolha ou lacuna).

**Marcados em 24/09/2026, a pedido do humano:** A11 `[DECIDIR]` (é a raiz 3, e não entra de novo na seção 4); I11 `[DECIDIR]`, na seção I acima; K28 `[DECIDIR]`, no grupo K; I12 recebeu primeiro `[FAZER]`, o humano discordou, e a conferência no código deu `[DECIDIR]` (na seção I, com o porquê). As contas desta seção são de antes das marcas e não foram refeitas.
