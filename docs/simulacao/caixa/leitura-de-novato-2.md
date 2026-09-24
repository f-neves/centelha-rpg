# Leitura de novata · Centelha (livro + dados)

Etiquetas: **[rolagem]** muda o resultado ou a parada de uma jogada · **[ficha]** muda número de ficha, custo ou derivado · **[texto]** não muda número. Caminhos relativos a `src/content/chapters/` e `src/data/`.

## (a) ERROS OBJETIVOS

1. **[rolagem] A conta do pool está errada no capítulo que apresenta o pool.** `atributos.md:10`: "Um lenhador de Força 5 e Armas 0 [...] Força 2 e Armas 5 [...] Os dois rolam cinco dados". Pela tabela de `coracao-do-sistema.md:25`, soma 5 = "2d6 + 2". Ninguém rola cinco dados com soma 5.

2. **[rolagem] Medo e intimidação resolvem em quatro lugares diferentes.**
   - `aparencia-virtudes-vontade.md:45`: Bravura "Resiste… ao medo e à intimidação" (teste de Virtude, sem Atributo).
   - `aparencia-virtudes-vontade.md:125`: "A **Defesa Mental** é o muro passivo que convencimentos, intimidações e poderes mentais precisam superar". Quatro linhas depois (`:129`), a Defesa Social é a que "protege contra quem tenta te *convencer*". O mesmo capítulo põe "convencer" nas duas defesas.
   - `acoes-resistir.md:190`: "**Medo, dominação e imposição** são [Defesa Mental]".
   - `defesas.md:37-39` e `qual-sistema.md:57`: intimidação = Defesa Social, medo mágico = Mental, medo da cena = Bravura.
   - `defesas.md:56` põe "privação de sono" em Defesa Mental, e `acoes-resistir.md:168` trata o Sono como "**Modo** · Passiva. Não se rola nada".

3. **[rolagem] Contra o que se rola um interrogatório.** `acoes-resistir.md:188`: "Quem interroga rola contra a [Defesa Mental]". `acoes-sentidos-e-engano.md:107`: "**Interrogar.** [...] Influência + Manha ou Oratória contra Integridade" (a Habilidade, não a Defesa). `defesas.md:15` diz que coagir é Social. São três alvos possíveis.

4. **[rolagem] O Atributo do arremesso e do tiro.**
   - `combate.md:127`: "Para **arremessos**, sempre Destreza; para **atirar** (arco ou besta), sempre Percepção."
   - Contra isso: `habilidades.md:29` Arremesso "*(Destreza · Força)*" ("quem tem braço joga mais longe"); `habilidades.md:30` Atirador "*(Percepção · Destreza)*"; `coracao-do-sistema.md:40` "**A descrição da ação determina o Atributo e a Habilidade.**"; e `racas.md:145` "o machado arremessado é força bruta".
   - Nos dados, `armas.json:749` (machado-de-arremesso) e `armas.json:965` (pilum) têm `"atrib": "forca"`.

5. **[rolagem] O ataque social fixa Influência.** `relacoes-sociais.md:138`: "Ataque = [ (Influência + Habilidade) ÷ 2 ] d6". `coracao-do-sistema.md:52` dá para ameaçar "**Força** ou **Influência** + Intimidação".

6. **[rolagem] A Especialidade é e não é parcela somada.**
   - `combate.md:123`: "**A Especialidade não é parcela somada numa rolagem.**" Duas linhas depois, `combate.md:125`: "Ataque = [(Atributo + Habilidade) ÷ 2]d6 (+2 se a soma for ímpar) + Especialidade + Arma + Centelha".
   - No Valor Passivo, `coracao-do-sistema.md:86` escreve "(Atributo + Habilidade) × 2 + Especialidade + Centelha". `acoes-e-sistema.md:121-123` escreve "(Atributo + Habilidade) × 2 + Centelha" e diz que "A **Especialidade não entra aqui**".

7. **[rolagem] Quanto dura o −2 da Pressão.** `combate.md:172`: brigar com as duas mãos derruba a guarda "o **dobro** de um golpe só, pelos próximos 6 Ticks". `combate.md:406`: "o efeito **acumula até a sua próxima ação**: quando você age, a guarda se refaz e o acúmulo zera".

8. **[rolagem] Antecedente soma ou não soma na jogada.** `antecedentes.md:63`: "Um Antecedente **não soma a jogada nenhuma**", e `:76`: "**não** turbinam [...] uma Habilidade solta". O mesmo capítulo diz o contrário em outros quatro lugares:
   - `:183` Posição dá "bônus a Etiqueta, Intimidação e comando em contexto";
   - `:200` Reputação: "uma temível ajuda a coagir";
   - `:230` Refúgio: ações estendidas "ganham bônus", sem valor;
   - `:320` "**Reputação** dá modificador social direcional".

9. **[rolagem] O Golpe do arremesso não cai no último Tick.** `combate.md:83` dá Preparo de Arremesso = "Velocidade − 2". Com Golpe de 1 Tick (`:69`), sobra 1 Tick de Recuperação. Mas `combate.md:86` diz: "Nas armas de Distância e Arremesso o Golpe cai no **último Tick do ciclo**". Isso só fecha para Distância (Velocidade − 1).

10. **[rolagem] Com que Centelha se apara um Enorme.** `combate.md:256` diz que um Médio segura um atacante 1 categoria maior. `:259` diz que "cada ponto de Centelha do defensor **sobe o teto de porte em uma categoria** (com Centelha 2 já se apara um Enorme". Médio +1 categoria já é Grande, e com +1 de Centelha chega a Enorme: basta Centelha **1**. `regras.json:1077-1078` (`bloqueioLimite.porteMaxDiferenca: 1`, `centelhaSobePorte: 1`) dá o mesmo resultado, Centelha 1.

11. **[rolagem] Fera tem ou não tem Defesa Social.** `defesas.md:77`: "Em **feras** (bichos de instinto, Inteligência 1) troca-se **Sociabilidade por Sobrevivência**". Na tabela do mesmo capítulo, `defesas.md:115`, Int 1 aparece como `"-" (sem trato social)`. `regras.json:802` (`derivados.defesaSocial.nota`) diz que feras "trocariam [...] mas no bestiário Social vale só p/ Int 2+".

12. **[rolagem] Alcance do Mestre dos Ofícios do Anão.** `racas.md:55`: "**+1d6** em testes de **Ofícios Gerais**". `racas.json:28` e `:34`: "+1d6 em qualquer Ofício em que já tenha pontos". Pelo JSON o bônus vale também para Ferreiro, Alvenaria etc.

13. **[rolagem] Relações do Humano.** `racas.md:24` diz que o Humano olha o Elfo/Meio-Elfo com "+1 (Simpatia)" e o Orc com "−1 (Antipatia)", "Duas exceções". `racas.json:11` diz: "Sem inimizades naturais: partem do Neutro com todos os povos". E `racas.md:115` acrescenta uma terceira exceção que `:24` não lista: "os demais povos recebem o meio-orc em **−1 (Antipatia)**".

14. **[rolagem] A fórmula do Bloqueio.** `defesas.md:69`: "**Bloqueio** = ( Destreza + Bloqueio ) × 2 + ...". `qual-sistema.md:87`: "Bloqueio = (Destreza + Habilidade que você escolher) x2".

15. **[ficha] Tabela de custos de XP contraditória.** `antecedentes.md:37-40` dá "Habilidade secundária (×2)", "primária (×5)", "Atributo (×10)" e "Centelha (×15)". Já `criacao-de-personagem.md:45-52` e `regras.json:554-625` (`xp`) dão Atributo "5 + (novo × 5)", primária "4 + (novo × 2)", secundária "2 + (novo × 1)" e Centelha "**grátis**" (`regras.json:619`, `"tipo": "gratis"`). Nenhum dos quatro multiplicadores de Antecedentes confere.

16. **[ficha] Subir uma Proeza de nível.** `criacao-de-personagem.md:57`: "subir uma Proeza do nível 2 para o 3 custa os 20 do nível 3 inteiro, não a diferença entre os dois". `regras.json:630` (`xp.tecnica.nota`): "Subir uma Proeza de nível paga só a diferença."

17. **[ficha] Quais níveis cobram Vontade no combo.** `combate.md:448`: "Bandas 4–5 ainda cobram Vontade (+1 e +2)". `regras.json:1228-1229` (`economiaPoderes.vontade`): `"nivel5": 1`, `"nivel6": 2`. O capítulo aponta os níveis 4 e 5, o JSON aponta os níveis 5 e 6. O termo "Bandas" não aparece em outro lugar do livro nem no `glossario.json`.

18. **[ficha] As contas do Bram não fecham.**
   - `criacao-de-personagem.md:157` cobra 496 XP por "Inteligência 6 (pico) · Influência, Percepção 4 · Raciocínio, Vigor, Destreza, Perspicácia 3 · Força, Compostura 2". Pela tabela de `:45` (acumulado 15·35·60·90·125): 125 + 2×60 + 4×35 + 2×15 = **415**.
   - `:161` cobra 63 XP por "Convicção 4 · Temperança 3 · Compaixão 3 · Bravura 2". Pela tabela (8·18·30): 30 + 18 + 18 + 8 = **74**.
   - O total 1868 é a soma dos valores impressos. Refeitas as duas linhas, o total dá 1798.
   - Kael, Sora e Veil conferem linha a linha.

19. **[ficha] Centelha 0 já tem Energia e Mana.** `centelha.md:19`: a Centelha 1 "ganha Energia e Mana". Pela fórmula de `centelha.md:45`, "Energia = (Vigor + Compostura + Raciocínio + Vontade) ÷ 2 + Centelha × 2" e "Mana = Centelha × 2 + Vontade". Um mortal com Vigor 2, Compostura 2, Raciocínio 2 e Vontade 2 tem Energia 4 e Mana 2.

20. **[rolagem] A coluna "Morre a partir de" da queda usa a regra de morte antiga.** `acoes-corpo-e-movimento.md:124`: "Pessoa comum · Vigor 2 | 31 | 2 | **15 m**".
   - Conta: 15 m = 33 de dano (`:112`), menos 2 de Absorção = 31, que é igual ao PV. Isso deixa a Vida em 0, e Vida 0 é "**Incapacitado**: fora da briga, e ainda vivo" (`vida-ferimentos-cura.md:54`).
   - Para morrer são precisos Vida ≤ −15 (`:56`, arredondando para baixo sem Centelha): 46 de dano líquido, 48 bruto. Na tabela isso cai entre 20 m (43) e 25 m (53).
   - As outras três linhas (19 m, 24 m, 26 m) também param em Vida 0.

21. **[rolagem] A tabela de Amortecer não bate com a de dano.** `acoes-corpo-e-movimento.md:133` diz que o sucesso tira 4 m e cada Margem mais 3. A coluna "Sem jogada" confere com a tabela de dano; as colunas reduzidas, não:
   - 10 m com uma Margem → 3 m → 7 (`:107`), mas a tabela (`:138`) dá "6";
   - 20 m com duas Margens → 10 m → 22 (`:110`), mas `:140` dá "20";
   - 50 m com duas Margens → 40 m → 81 (`:106`), mas `:142` dá "75".

22. **[rolagem] "Corrida vai 50 a 67% mais longe" não confere com as fórmulas.** `combate.md:291` e `regras.json:2477`. Com Deslocamento = 2 + (Des + Atl) ÷ 4 (`:276`) e Corrida = 4 + Des × ¾ + Atl ÷ 2 (`:303`), a Corrida vai de 107% a 143% mais longe em todas as fichas de Des 1-6 e Atl 0-6. Exemplo: Des 2, Atl 0 dá Deslocamento 2,5 e Corrida 5,5. Nem o Arranque (13% a 86%) cabe na faixa de 50 a 67%.

23. **[rolagem] O exemplo da Investida é impossível.** `combate.md:317`: "Sora [...] anda 4 m por Tick e corre 6 [...] Investindo, cobre **12**". Andar 4 exige Des + Atl = 8, e com qualquer divisão a Corrida fica em 8,25 ou mais (4 + 0,75×1 + 0,5×7). Investir 2 Ticks (Preparo 2) cobre pelo menos 16,5 m.

24. **[rolagem] Salto horizontal correndo.** `combate.md:352`: "Velocidade atual + (Atletismo ÷ 2) + Centelha". `regras.json:888-891` (`derivados.deslocamento.saltoHorizontalCorrendo`) dá destreza 1,5, atletismo 1,5, centelha 1, sem base. Para Des 2, Atl 0, Centelha 0, o capítulo dá 5,5 m (Corrida 5,5 + 0) e o JSON dá 3 m.

25. **[rolagem] Dano por classe.**
   - `combate.md:180`: "distância/arremesso 1d6 a 1d6+2". `armas-e-armaduras.md:17` repete "arremesso **1d6 a 1d6+2**".
   - Mas `armas-e-armaduras.md:97` dá a Adaga de Arremesso com "1d6−2" (`armas.json:717`, `danoBonus: -2`), e `:89-90` dão as bestas com "1d6+4" e "1d6+8".
   - A tabela de classes, `armas-e-armaduras.md:40`, dá Distância com "Velocidade 6–7", e as bestas têm 9, 12 e 15 (`:88-90`).

26. **[rolagem] Velocidade da Alabarda.** `combate.md:58` lista "7 | Ataque pesado | martelo de guerra, montante, alabarda". `armas-e-armaduras.md:71` e `armas.json:328` dão 6.

27. **[rolagem] A tag Pesada numa arma que não usa Força.** `armas-e-armaduras.md:51`: "**Arremessável · Munição · Pesada**: [...] usar Força total". `:90` dá a Besta Grande como "pesada", e `:17` diz que "**bestas** não usam Força".

28. **[rolagem] Picareta e pilum contra "a placa".** `armas-e-armaduras.md:69`, Picareta (N2): "O bico vence a placa pelo ponto". `:95`, Pilum (N2): "fura placa". Mas `:153` diz "**Placa × Perfurante nível 0–2** (flecha, arco, lança, adaga, qualquer besta, picareta) = **resvala**". Duas placas são N2 (transição e munição, `:120-121`) e só a completa é N3 (`:122`). O texto não diz de qual placa fala.

29. **[rolagem] A regra da classe de Quase-Acerto.** `quase-acerto.md:30` e `regras.json:1111` definem a classe pelo dano médio. A nota geral da mesma seção, `regras.json:1147` (`quaseAcerto.nota`), ainda diz "a classe da arma sai do dado (1d6 leve, 2d6 média, 3d6 pesada)". E `quase-acerto.md:46` diz "hoje 24 das 26 armas têm um dado só", enquanto `armas.json` tem 33 entradas, 30 delas com um dado.

30. **[rolagem] Exemplo do Verme Púrpura.** `combate.md:220`: "Um **Verme Púrpura** (Imenso) tem Absorção **13** contra lâminas". Pela regra de `:194` ("**só a Centelha** contra o Cortante") mais a Couraça de Imenso +7 (`:216`), e com Centelha 1 (`monsters.json:39938`), a conta dá 8. O 13 está em `monsters.json:39988`, mas não sai de nenhuma regra do livro. O mesmo vale para o Tarrasque: Colossal +10 e Centelha 10 dão 20, não os 27 de `combate.md:220`.

31. **[ficha] Oficina de mestre e as ~15 semanas.** `acoes-oficio-e-mundo.md:96`: Excepcional, "mestre em oficina de mestre, ~15 semanas". `:98` faz a conta sem a oficina: "cinco pontos por semana contra a Dificuldade 16, ou seja quinze semanas". Mas a tabela de `:110` dá "−4" na Dificuldade para oficina "de mestre, completa". Há duas leituras:
   - a oficina é só requisito ("não um bônus à parte somado por cima", `:98`), e aí 74 ÷ 5 ≈ 15 semanas;
   - a oficina aplica o −4 da tabela, e aí 21 − 12 = 9 por semana e 74 ÷ 9 ≈ 8,2 semanas.

32. **[ficha] Requisito 4 e o oficial.** `acoes-oficio-e-mundo.md:140` e `:154` marcam as peças de Requisito 4 como "fechada ao oficial". `:167`, Placa de munição, também tem Requisito 4 e dá "7 semanas" ao oficial.

33. **[ficha] Nomes de ofício que não existem no catálogo.** As tabelas pedem Armaria (`acoes-oficio-e-mundo.md:162-168`), Alfaiataria (`:148`), Curtume (`:150`), Herbalismo (`:138`), Iluminura (`:139`), Serralheria (`:140`, `:155`) e Arcos (`:137`, `:153`).
   - `:51` lista os ofícios como "Ferreiro, Carpintaria, Alvenaria, Couraria, Costura...".
   - `habilidades-secundarias.md:84` diz que Ferreiro cobre "de anel de malha a peça de placa", e `:77` diz que Carpintaria cobre o "arco".
   - Como Requisito é nível no ofício (`acoes-oficio-e-mundo.md:22`), o nome decide se um Ferreiro 4 pode fazer uma cota de malha.

34. **[ficha] Preço por qualidade, três versões.**
   - `custo-de-servico-e-itens.md:68-70`: Boa "a partir de 3×", Ótima "6×", Relíquia "10×".
   - O exemplo de `:125`, com base de 30 pp: "Bom por ao menos **45 pp**; Ótimo [...] **90 pp**; Relíquia [...] **150 pp**" (1,5×, 3×, 5×).
   - `acoes-oficio-e-mundo.md:82`: "Preço **dobra**" por grau.
   - Os efeitos também diferem. `acoes-oficio-e-mundo.md:83-85` dá "**+1** num número da peça" por grau, e `custo-de-servico-e-itens.md:104-114` usa uma compra por pontos em que "+1 de Bloqueio" custa +2. Os nomes dos graus também mudam: Sucata/Tosca/…/Excepcional contra Péssimo/Ruim/…/Relíquia.

35. **[ficha] Renda do ofício contra a tabela de renda.** `acoes-oficio-e-mundo.md:200`: "O oficial tira 65 pc por semana, o perito 120, o mestre 170". `custo-de-servico-e-itens.md:43` dá ao Treinado "27 pp" por semana (270 pc), e `:41` dá ao Braçal "6 pp" (60 pc). O artesão treinado ganha pelo ofício o mesmo que o braçal.

36. **[texto] Meio-Elfo sem Atributo rebaixado.** `racas.md:22` diz que o humano "é o único povo sem um único Atributo rebaixado". Mas a tabela em `:39` deixa vazias (só um traço) as duas colunas raciais do Meio-Elfo, e `:99` confirma: "**Sem deslocamento de tetos**".

37. **[texto] "Maturidade" com dois sentidos em Raças.**
   - Gnomo: "Maturidade aos 18 anos" (`racas.md:72`).
   - Halfling: "Atingem a maturidade por volta dos 18" (`:85`).
   - Meio-Orc: "maturidade por volta dos 14" (`:106`); Orc: "Maturidade por volta dos 14" (`:121`).
   - Na tabela (`:250-255`) esses números estão na coluna "Adulto", e a coluna "Maturidade" dá 75, 45, 30 e 30.

38. **[ficha] Orc de 40 PV não existe.** `racas.md:167` usa "orc de 40 PV: 8 de dano". O orc tem "PV = 25 + Vigor×3 + Vigor" (`:127`), ou seja 25 + 4×Vigor: Vigor 3 dá 37 e Vigor 4 dá 41.

39. **[rolagem] Tick de entrada no Combate Social.** `relacoes-sociais.md:134`: quem lê melhor "começa no Tick 0; os demais no Tick 1". `combate.md:29`: o primeiro "entra sozinho no **Tick 1**" e os demais "um Tick depois por degrau de 6 pontos".

40. **[ficha] "Três caminhos" de recuperação de Vontade.** `aparencia-virtudes-vontade.md:115`: "**Ela volta por três caminhos.**" Mais duas fontes aparecem em outros capítulos: `antecedentes.md:275` (Fé, "recuperação de Vontade em terreno sagrado") e `acoes-sentidos-e-engano.md:122` ("**Meditar.** Recolher-se e recuperar Vontade. Longa").

41. **[texto] O cortejo não é Dificuldade + Acúmulo.** `qual-sistema.md:25` manda "cortejar sem pressa" para "Ação estendida: Dificuldade + Intervalo + Acúmulo". `relacoes-sociais.md:184` resolve o cortejo por "Tempo do passo = máx(1, Defesa parada − Ataque parado − gestos)", sem Dificuldade nem Acúmulo.

42. **[texto] Virtude 5 também passa na Extrema.** `aparencia-virtudes-vontade.md:101`: "A **Virtude 6** é a única que existe na Extrema". A tabela de `:97` dá 3% à V5. Recalculei as duas tabelas de probabilidade (Virtude `:92-97` e Frenesi `racas.md:184-191`) e todos os demais valores conferem.

43. **[texto] Número de capítulo errado.** `custo-de-servico-e-itens.md:10` cita "Armas & Armaduras (Cap. XI)", mas `armas-e-armaduras.md:3` tem `numeral: "XIII"`.

## (b) LACUNAS

1. **[rolagem] Gastar Força de Vontade fora do social não tem número.** `aparencia-virtudes-vontade.md:113`: "Você gasta Vontade para **turbinar uma ação importante**, **resistir** a medo e manipulação, **ignorar penalidades**". Não há quanto nem quanto custa. O único número está no Frenesi (`racas.md:162`, "+1d6"). A blindagem mental (`defesas.md:106`, "você se blinda por um tempo (uma cena ou um dia") também não tem custo.

2. **[rolagem] Onde a Centelha entra fora de ataque e Defesa.** Três versões:
   - `coracao-do-sistema.md:88`: "soma **+1 por ponto** dos dois lados de qualquer disputa";
   - `centelha.md:44`: "+1 ao ataque e +1 às três Defesas";
   - `acoes-e-sistema.md:107`: "**A Centelha não entra na Longa.**"

   Nenhum capítulo diz se ela entra numa Direta ou Acumulada contra Dificuldade fixa, nem no lado ativo de uma disputa (a Furtividade de quem se esgueira contra um Valor Passivo que já traz Centelha).

3. **[rolagem] O piso de 1d6 com soma 0 ou 1.** `vida-ferimentos-cura.md:48`: "**O pool nunca desce abaixo de 1d6**". Quem tem soma 1 rola "nenhum dado, total fixo **2**" (`coracao-do-sistema.md:21`). Não se diz se esse personagem, ferido em Grave, passa a rolar 1d6 (e melhora) ou continua no 2 fixo.

4. **[rolagem] Faixas de ferimento com porcentagem fracionária.** `vida-ferimentos-cura.md:40-43` usa faixas inteiras (61–100, 31–60...). PV 43 (Vigor 6) com 26 restantes dá 60,47%, e com 13 restantes dá 30,23%. Nenhuma faixa contém esses valores e não há regra de arredondamento. A tabela de Recuperação (`:83-88`) também não tem linha para Vida ≤ 0.

5. **[rolagem] Atributo acima de 6.** `centelha.md:46`: "*(A tabela exata de quanto cada nível libera ainda está em calibração.)*". Também não se diz se, na criação, o `+1` racial deixa o pico chegar a 7 (`criacao-de-personagem.md:19`: "Teto **5** na criação, com **um único** atributo em **6** [...] respeitados os tetos que a sua raça moveu").

6. **[rolagem] Aparência sem números.**
   - Mascarar: `aparencia-virtudes-vontade.md:18` manda rolar "**Compostura + Furtividade**" sem Dificuldade.
   - `:16`: "o belo tem **−** ao intimidar, o feio tem **+**" sem valor.
   - Orc com Aparência 0: `racas.md:126` "vale **1 a menos** que o nível pago", e a tabela para em 0.

7. **[rolagem] Veneno.**
   - Curare: `acoes-resistir.md:52` não diz qual Atributo drena nem quanto (a coluna Pool total fica só com um traço). `venenos.json:54` diz destreza.
   - Tratar: "reduz o pool restante pela mesma régua de Margem" (`:60`), sem dizer quanto sai por degrau.
   - Contágio: `:108` não diz o que acontece quando a jogada falha.

8. **[rolagem] Margem numa Longa, que não rola.** `acoes-e-sistema.md:53`: "Decifrar uma página antiga é Hora (Longa). Duas Margens de sobra". O capítulo não diz como a Longa gera Margem. É a média menos a Dificuldade, uma vez por intervalo, no fim?

9. **[rolagem] Escalar: a Margem conta duas vezes?** `acoes-corpo-e-movimento.md:31-33`: "o Acúmulo é a **altura em metros**" e "Cada Margem sobe **mais 3 metros**". Pela Acumulada, o progresso já é "resultado − Dificuldade" (`acoes-e-sistema.md:75`). No exemplo de `acoes-e-sistema.md:77`, "Quem tira 17 sobe de primeira, porque 17 menos 7 são os dez metros": esse 17 tem uma Margem. Se ela soma +3 m, sobe 13 m.

10. **[rolagem] Armadura na Furtividade e na natação.** A Penalidade "para **Furtividade e atividades delicadas, dobra**" (`armas-e-armaduras.md:126`). As fichas também põem armadura como Circunstância na Dificuldade: `acoes-sentidos-e-engano.md:81` "armadura pesada **+4**" e `acoes-corpo-e-movimento.md:76` "armadura pesada **+4**". Não se diz se as duas se somam.

11. **[rolagem] Frequência de ataque da Horda.** `combate.md:422` não diz a cada quanto a horda ataca. O JSON diz "a cada 6 Ticks" (`regras.json:1181`). A tabela de Magnitude (`combate.md:416-418`) vai até 5, mas o Séquito 6 é "Magnitude 6" (`antecedentes.md:149`, e `regras.json:1175` "64–127").

12. **[rolagem] Em que Tick sai o golpe no sistema padrão.** `combate.md:103-104`: no Normal "a ação resolve inteira no Tick da declaração, com a Defesa em −2 durante o Preparo". Se tudo se resolve no Tick da declaração, o texto não diz quando existe esse "durante o Preparo". Os exemplos fazem o golpe sair depois: "o virote sai no Tick 11" (`:340`) e "o golpe dela também cairia no 4" (`:383`). O próprio texto deixa em aberto a besta que se move durante a recarga (`:342`).

13. **[rolagem] Fôlego menor que o custo do golpe.** `folego.md:45` diz que um herói de ~50 dá "~2" golpes pesados de 38. Depois do primeiro sobram 12. O texto só proíbe atacar com Fôlego 0 (`:57`), e não diz se dá para golpear com menos Fôlego do que o custo.

14. **[ficha] Como Energia e Mana voltam.** Nenhum capítulo diz. `aparencia-virtudes-vontade.md:115` remete a "o mesmo repouso que a Mana pede", sem que o livro diga qual é. O JSON tem essas regras (`regras.json:327`: "a Mana por hora [...] e a Energia por cena").

15. **[rolagem] Pontos da Régua sem regra.**
   - O que o Meio-Elfo sente pelos outros povos (`racas.md:102` só diz como os outros o tratam), e o Orc em relação ao Humano (`:130`).
   - Se descer do Neutro a −1 custa um passo ou três: `relacoes-sociais.md:102` fala nos três passos "do centro até a primeira Simpatia", `:264` diz "o meio largo de três passos é da subida", e `:108` diz que a Antipatia vem de "um punhado de desfeitas acumuladas".
   - `qual-sistema.md:43`: "Ao sair de um controle percebido, nasce inimizade (salto no Desfavor da Régua)". Isso não aparece em nenhum outro capítulo, nem com número.

16. **[rolagem] O gesto é Firula ou não?** `relacoes-sociais.md:219`: "É a mesma Firula do [capítulo de Habilidades]". Mas o gesto soma +0/+1/+2/+4, e a Firula soma +2/+1d6/+2d6 e devolve reserva (`habilidades.md:104-108`). Não se diz se o gesto devolve Energia ou Vontade, nem se a Firula comum vale numa jogada de Combate Social.

17. **[ficha] O livro não define o calendário.** `relacoes-sociais.md:202` chama o intervalo de 8 dias de "O intervalo é uma semana". `custo-de-servico-e-itens.md:53` diz que "Uma **semana de trabalho** vale 6 dias". As contas de `relacoes-sociais.md:264` ("quase dois anos", "quase sete") e de `:213` ("mais de uma estação") pressupõem um ano e uma estação que nenhum capítulo define. A tabela de renda mensal (`custo-de-servico-e-itens.md:41-49`) também supõe um mês sem duração.

18. **[ficha] Antecedentes na criação.** `antecedentes.md:40-41`: "Na criação, sai do mesmo orçamento de XP". Mas o passo a passo (`criacao-de-personagem.md:16-25`) e a tabela de custos (`:43-55`) não mencionam Antecedentes. O capítulo também não diz se o "Teto **4**" de Habilidade na criação (`:20`) vale para as secundárias.

19. **[ficha] Itens sem preço ou sem estatística.**
   - As armaduras de `armas-e-armaduras.md:115-122` (Gambeson, Couro endurecido, Cota de malha, Brigandina, Lamelar, as três placas) não têm preço em `custo-de-servico-e-itens.md:177-183`.
   - As cinco que têm preço ali (Camisa de malha, Peitoral, Malha completa, Peitoral reforçado, Placa articulada) não têm Absorção em lugar nenhum do livro.
   - O callout de `:10` reconhece que as listas "não batem por completo".
   - Armas de arremesso, Maça, Picareta e Espada Serrilhada também não têm preço.

20. **[ficha] Aliados e Halfling.**
   - Aliado: "tem ficha própria (some Centelha e Habilidade conforme o nível)" (`antecedentes.md:119`), sem número, e sem dizer quem escolhe entre "Aliança (+3) ou Devoção (+4)".
   - Halfling: `racas.md:37` e `:89` falam de "porte pequeno", mas só o Gnomo é dito "de porte **pequeno**" para PV (`:74`). `racas.json:82` dá ao Halfling `"porte": "pequeno"`, que pela tabela de `vida-ferimentos-cura.md:23` muda o PV para 20 + Vigor × 2.
   - "+1d6 em **Atletismo** e nas Habilidades secundárias correlatas" (`racas.md:91`) não diz quais.

21. **[rolagem] Vontade como parcela de pool.** `acoes-sentidos-e-engano.md:118` ("Vontade + Religião"), `:120` e `aparencia-virtudes-vontade.md:86` ("Vontade + Convicção") usam a Força de Vontade (0 a 12) no lugar de Atributo. Não se diz se é o valor máximo ou o atual, e se a soma entra na conversão normal.

22. **[ficha] XP da Firula de nível 3.** O livro declara em aberto: `habilidades.md:121`, "Quanto XP o nível 3 devolve **ainda não foi decidido**".

## (c) TRAVOU A LEITURA

1. **[rolagem] Termo usado antes de ser definido.**
   - Firula: `coracao-do-sistema.md:36`, definida em `habilidades.md:99`.
   - Tick: `vida-ferimentos-cura.md:66`, definido em `combate.md:8`.
   - "raspão": `centelha.md:69`, definido em `quase-acerto.md`.
   - "ação reflexa": `racas.md:147`, o modo chama "Reflexiva" em `acoes-e-sistema.md:113`.
   - "Bandas": `combate.md:448`, nunca definido.
   - Energia e Mana: `habilidades.md:106`, definidas em `centelha.md:45`.
   - O `glossario.json` não tem Desgaste, Preparo, Acúmulo, raspão nem Bandas.

2. **[texto] Quantos números tem a peça de ofício.** `acoes-oficio-e-mundo.md:12` fala em três números. O título de `:18` diz "A peça em cinco números" e a tabela logo abaixo (`:20-27`) tem seis linhas. `:68` volta a "os cinco números".

3. **[rolagem] "Peso" com dois sentidos no Combate Social.** `relacoes-sociais.md:134`: "três pesos [...] **leve 5** [...] **pesada 7** (um discurso". `:140`: o "**Peso** é um bônus de **+0 a +3** [...] um discurso longo pesa mais e soma menos". A mesma palavra nomeia a Velocidade e o bônus, e eles andam em sentidos opostos.

4. **[texto] O capítulo manda o jogador ao JSON.** `combate.md:116`: "A régua completa de P/G/R e da escada de Defesa vive em `regras.json → combate.pgr`".

5. **[texto] Exemplo do Teste Coletivo não fecha.** `acoes-e-sistema.md:176`: "um dançarino com −1 físico e dois furtivos com −2 de armadura somam −4". A soma dá −5 (−1 − 2 − 2). Se a Penalidade de armadura dobra na Furtividade (`armas-e-armaduras.md:126`), dá −9.

6. **[texto] Sono, "cinco noites custa três noites".** `acoes-resistir.md:182`. Pela tabela (`:176`), cinco noites dão Desgaste 4, que se paga em 4 noites (ou 2 de doze horas). Só com o deslocamento de linha de `:178` ("Vigor + Resistência 8 ou mais") cinco noites viram Desgaste 3, que custa três noites. O texto não diz que supõe esse caso.

7. **[texto] Envelhecimento cumulativo.** `racas.md:242`: "cumulativa com a história, não com a anterior". Junto com `:259` ("Velho: −1 · Venerável: −2"), dá para ler Venerável como −2 no total ou −3.

8. **[texto] Veneno.**
   - `acoes-resistir.md:56` chama de "penalidade" o abatimento de 4 que *favorece* o alvo ("a penalidade não se aplica").
   - "a coluna Início já reflete isso" é falso para 5 dos 6 venenos: a coluna (`:49-54`) só traz o tempo.

9. **[texto] Tabela do Séquito quebrada.** `antecedentes.md:144-149` tem cabeçalho de 2 colunas e linhas de 3 ("| Magnitude 1 |"). Os níveis 5 e 6 se chamam os dois "pequena hoste".

10. **[texto] Nomes que não batem.**
    - "Escrivania" (`habilidades-secundarias.md:93`) contra "Escrivão" (`:83`).
    - "secundária Escapismo" (`acoes-corpo-e-movimento.md:270`) não está no catálogo nem em `habilidades-secundarias.json`.
    - "Desfavorável" (`relacoes-sociais.md:98`) não é degrau da régua.
    - "+1 nível de Penetração" (`custo-de-servico-e-itens.md:125`) contra "Perfuração" na tabela de `:109`.
    - Kael é Centelha 3, mas "já com o [Desperto]" (`criacao-de-personagem.md:102`).

11. **[rolagem] Uma regra explicada só no capítulo seguinte.** `habilidades-secundarias.md:15`: "a maior entra no pool e a menor entra como bônus fixo". O valor do bônus só aparece em `acoes-e-sistema.md:184-191`, seis capítulos depois.

12. **[texto] Dois vocabulários para tarefa longa.** `coracao-do-sistema.md:106` ("Ações Estendidas") e `qual-sistema.md:25` ("Ação estendida") usam um termo que o capítulo VIII substitui por Acumulada e Longa. O exemplo de `coracao-do-sistema.md:110` rola a forja toda semana, e `acoes-e-sistema.md:148` diz que semana é "território de Longa, porque ninguém rola trinta vezes por uma espada". Não chega a ser contradição, porque `:154` deixa o modo com o jogador.

13. **[texto] Teto que não pode ser alcançado.** `antecedentes.md:77`: o desconto de Antecedentes "soma[m] entre si até um **teto de +6**", mas só há "três passos" a descontar (`:73`).

14. **[texto] "Supera por 0".** `relacoes-sociais.md:151` tem a linha "0–5 (Margem 0)" sob "Ataque supera a Defesa por". Pela regra de `:142`, empatar não supera.

15. **[texto] Reciprocidade trocada.** `racas.md:81` marca como recíproca só a Simpatia com o Halfling ("este último, recíproco"). Mas o Elfo também devolve +1 ao Gnomo (`:68`).

16. **[texto] Integridade e Compostura.** `aparencia-virtudes-vontade.md:123`: "**Integridade** é a habilidade de firmeza moral e compostura". Isso contraria `habilidades.md:41`: "Esconder o que sente é assunto de Compostura; Integridade é não ceder."

17. **[texto] Numeração dos capítulos.** Três capítulos têm numeral II, cinco têm VIII, e a sequência pula de XIV (`custo-de-servico-e-itens.md:3`) para XVIII (`criacao-de-personagem.md:3`).

## Nota de cobertura

**Lidos inteiros, na ordem do `ordem:`:** os 23 capítulos de `src/content/chapters/`. Na ordem: coracao-do-sistema, atributos, habilidades, habilidades-secundarias, aparencia-virtudes-vontade, vida-ferimentos-cura, centelha, racas, antecedentes, acoes-e-sistema, acoes-corpo-e-movimento, acoes-resistir, acoes-sentidos-e-engano, acoes-oficio-e-mundo, combate, relacoes-sociais, defesas, quase-acerto, armas-e-armaduras, custo-de-servico-e-itens, criacao-de-personagem, qual-sistema, folego. Não existem capítulos de `ordem` 21 a 23.

**Dados:**
- Conferidos por inteiro: `racas.json`, `venenos.json`, `armas.json` (os campos de arma), `armaduras.json`, `escudos.json`.
- Conferidos por chave, não lidos de ponta a ponta:
  - `regras.json`: `xp`, `limitesCriacao`, `pisos`, `derivados`, `ferimentos`, `sangramento`, `morte`, `dano`, `quaseAcerto`, `bloqueioLimite`, `porteAcerto`, `combateTatico`, `economiaPoderes`, `empilhamentoProezas`, `horda`, `forca`, `acoes`, `social`, `recuperacaoVontade`, `aparencia`, `combate.escada/dupla/rajada/movimento/recuperacao`, `arcano.recuperacaoMana`;
  - `antecedentes.json` (estrutura), `habilidades.json` e `habilidades-secundarias.json` (nomes e inclinações);
  - `tecnicas.json` e `caminhos.json`: só a existência dos nomes citados. Todos existem, "Presença Aterradora" apenas em `antecedentes.json` e no bestiário;
  - `monsters.json`: só o Verme Púrpura e o Tarrasque;
  - `glossario.json`: busca de termos.
- Não abertos: os demais JSONs do bestiário, `artes.json`, `efeitos.json`, `diagramas.json` e `precos.json` (os pacotes foram conferidos pela tabela do capítulo e fecham todos).

**Recalculado e correto** (não entra como achado): as tabelas de probabilidade da Virtude e do Frenesi, os 56% e 55% de `acoes-e-sistema.md:27`, a Vel. de Natação, o lote e as tabelas de tempo do ofício (fora os itens 31 e 32), a direção de obra, o cortejo (27/45/63/81, 42, 25 intervalos e a tabela de Vontade), as fichas e os derivados de Kael, Sora e Veil, e os derivados do Bram.
