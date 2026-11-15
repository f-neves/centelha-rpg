# Levantamento T2 · Técnicas de nível maior que repetem o bônus de uma de nível menor

Gerado em 15/11/2026 por `C:/Users/Neves/ClaudeCode/centelha/tmp/revisao-textos/ferramentas/levantamento-t2.mjs`, a partir de `src/data/tecnicas.json` (461 Técnicas, 50 Caminhos) do `rpg-system` em `main` (`ba40601f`). Só leitura: nada no repositório foi mexido.

## Critério

Decisão T2 do autor (15/11/2026): "Proeza é o Caminho (a árvore); Técnica é cada compra dentro dela, de nível 1 a 6. Quando uma Técnica de nível maior dá o mesmo bônus de uma de nível menor, o texto dela diz se aumenta ou substitui. Se não substitui, valem as duas. Se substitui, vale a de nível maior."

Entra na lista o par (Técnica de nível maior, Técnica de nível menor) que cumpre as três condições:

1. as duas são do mesmo Caminho (campo `caminho`);
2. a de nível maior bonifica a MESMA coisa que a de nível menor (mesma Habilidade, Defesa, dano, rolagem, recurso ou efeito);
3. o texto da de nível maior não diz se soma ou substitui ("substitui", "no lugar de", "soma com", "acumula", "além de", "cumulativo", "aumenta para", "mais um" e equivalentes).

**O nível** é o campo `nivel` de cada Técnica, o mesmo que `src/lib/ficha-engine.ts` lê no mapa `TECNIV`. O `src/data/caminhos.json` não tem nível nem ordem por Técnica (só id, nome, trilha, atributo, Habilidade-âncora, descrição e uma `nota` em dois Caminhos), então não há o que conferir contra ele além das notas, tratadas abaixo.

**Regra de contagem:** cada par conta um. Quando uma Técnica repete o bônus de duas de nível menor, são dois casos (a regra vale igual em todos os Caminhos: Atlas, Pele de Pedra, Aura, Sussurro e os outros). O total de textos a editar é o número de Técnicas de nível maior distintas, dado no fim.

**Regras de classificação:**

- Cada caso leva um tipo: *bônus numérico na mesma coisa*; *mesmo efeito, com alcance ou intensidade diferente*; ou *efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado*. O terceiro tipo é texto repetido (quase sempre uma Técnica de nível 2 que reescreve outra do mesmo Caminho), e a pergunta "soma ou substitui" ali é formal; ele entra porque a T2 cobre efeito, e o autor decide se resolve com uma frase ou reescrevendo a Técnica.
- **Não conta** quando a de nível maior dá algo absoluto e sem escopo que torna a de nível menor sem objeto ("não pode ser pego de surpresa" contra "difícil de surpreender", "nenhuma mentira ou disfarce o engana" contra perceber mentiras). Somar a nada não é pergunta.
- **Absoluto com escopo vai para duvidoso** (imune a veneno "mundano" contra +3 a venenos; "qualquer fechadura mundana"; "qualquer altura mundana"): fora do escopo a de nível menor ainda vale, e a pergunta de somar volta.
- **Regra escrita só na `nota` do Caminho** (em `caminhos.json`) e não no texto da Técnica vai para duvidoso: a T2 pede a frase no texto da Técnica.
- **Não conta** a progressão de capacidade sem número em que a de nível maior só amplia a de nível menor (quase invisível, invisível, indetectável; comandar um grupo, uma multidão, um exército). Não há o que somar.
- **Bônus a coisas diferentes não conta** (ex.: +3 ao ataque à distância e +1d6 de dano; Defesa do próprio personagem e Defesa dos aliados).
- Sobreposição vaga de capacidade, ou bônus contra remoção de penalidade, vai para "Casos duvidosos".

## Como foi feito

1. O script agrupa as Técnicas por Caminho e gera todos os pares de nível maior e menor dentro de cada um: **1703 pares**. Marca como candidato o par que divide ao menos duas palavras de conteúdo (radical de 6 letras, sem acento) ou o mesmo `efeito` numérico (`bonus`, `dano`, `soak`, `penetracao`, `carga`...): **185 candidatos**.
2. Li à mão os 461 textos, Caminho por Caminho em ordem de nível, e não só os candidatos: o filtro automático perde par com palavras diferentes para a mesma coisa ("escapa de amarras" e "escapar de amarras" casam, "baixa a guarda" e "prende a atenção" não). Dos casos confirmados, 24 não estavam entre os candidatos automáticos e vieram só da leitura.
3. Os pares confirmados e os duvidosos ficam em `t2-confirmados.json`, ao lado do script. O script confere que cada id existe, que o par é do mesmo Caminho, que o "maior" tem nível maior e que o texto dele não tem palavra de soma ou substituição, e copia os trechos direto do JSON (texto inteiro da Técnica, sem retoque, só com o `**` de negrito mantido).
4. Busca por palavra de soma ou substituição nos 461 textos: 3 acerto(s) com a regex final (`marcha-forcada`, `misturar-se`, `furia-redobrada`), e só o de `furia-redobrada` ("ignora mais um nível") fala de somar; `misturar-se` ("mais um da multidão") e `marcha-forcada` ("não acumula exaustão") são falsos positivos. Com a lista do pedido ao pé da letra houve outros falsos positivos que não dizem nada sobre somar: "muito além do humano" (`levantamento-poderoso`), "bem além do que derrubaria outro" (`folego-de-sobra`), "não acumula exaustão" (`marcha-forcada`), "além da técnica de sua era" (`engenho-sobre-humano`) e "em vez de freio" (`furia-redobrada`). Nenhum par foi excluído por eles.

Para refazer: `node "C:/Users/Neves/ClaudeCode/centelha/tmp/revisao-textos/ferramentas/levantamento-t2.mjs" "C:/Users/Neves/ClaudeCode/centelha/rpg-system" "<saída.md>"`.

## Excluídos porque a regra já está escrita

- **Sangue Fervente:** `furia-redobrada` (nível 2) contra `ignorar-ferimentos` (nível 1). O texto diz "ignora **mais um** nível de penalidade de ferimento", que é soma.
- **Absolutos que esvaziam a de nível menor** (regra acima), anotados para conferência: `sempre-alerta` (2) e `nunca-desprevenido` (3) contra `vigilancia` (1, "difícil de surpreender"); `olho-que-nao-erra` (5) contra `ler-pessoas` (1, +3 para perceber mentiras) e `farejar-mentira` (1).

**Atenção à Pele de Pedra:** a `nota` do Caminho termina com "Cada Técnica continua dando o que já dá" ("A partir do nível 2, a pele conta como **arma natural** para bloquear golpes com o corpo (Cap. XIII, Luta desarmada); o nível 1 não bloqueia. Cada Técnica continua dando o que já dá."). A frase vem logo depois da regra de arma natural e pode ser lida só como "o bloqueio não tira o resto"; por isso os cinco pares de Absorção desse Caminho entram como caso, marcados. Se o autor ler a nota como "as Absorções somam", eles saem da conta.

## Casos, por Caminho

### Punho de Ferro (`punho-de-ferro`) · 4 caso(s)

1. **Maior:** `pancada-atordoante` · Pancada Atordoante · nível 2. **Menor:** `golpe-pesado` · Golpe Pesado · nível 1.
   - Bônus em comum: dano do golpe corpo a corpo (+1d6 sobre +1d6). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Concentra o golpe num só ponto: +1d6 de dano e o alvo cambaleia, agindo com −2 na ação seguinte."
   - Texto da menor: "Seus ataques de Força em corpo-a-corpo somam **+1d6 de dano**."
2. **Maior:** `golpe-do-tita` · Golpe do Titã · nível 4. **Menor:** `golpe-pesado` · Golpe Pesado · nível 1.
   - Bônus em comum: dano do golpe corpo a corpo (+3d6 sobre +1d6). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "**+3d6** de dano num único golpe colossal."
   - Texto da menor: "Seus ataques de Força em corpo-a-corpo somam **+1d6 de dano**."
3. **Maior:** `golpe-do-tita` · Golpe do Titã · nível 4. **Menor:** `pancada-atordoante` · Pancada Atordoante · nível 2.
   - Bônus em comum: dano de um golpe (+3d6 sobre +1d6); as duas são ativas de um golpe só. Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "**+3d6** de dano num único golpe colossal."
   - Texto da menor: "Concentra o golpe num só ponto: +1d6 de dano e o alvo cambaleia, agindo com −2 na ação seguinte."
4. **Maior:** `punho-que-parte-pedra` · Punho que Parte Pedra · nível 4. **Menor:** `esmagar` · Esmagar · nível 3.
   - Bônus em comum: Absorção da armadura ignorada (6 sobre 4). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Suas mãos quebram pedra e metal; ataques ignoram 6 de Absorção de armaduras mundanas (não a Absorção natural do alvo)."
   - Texto da menor: "O golpe ignora 4 de Absorção de Impacto da armadura do alvo."

### Atlas (`atlas`) · 14 caso(s)

5. **Maior:** `erguer-o-enorme` · Erguer o Enorme · nível 2. **Menor:** `forca-de-carga` · Força de Carga · nível 1.
   - Bônus em comum: multiplicador da capacidade de carga (×3 sobre ×2). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Levanta acima da cabeça, por um instante, o que precisaria de duas pessoas; capacidade de carga ×3."
   - Texto da menor: "carrega/ergue o dobro do normal sem penalidade."
6. **Maior:** `levantamento-poderoso` · Levantamento Poderoso · nível 3. **Menor:** `forca-de-carga` · Força de Carga · nível 1.
   - Bônus em comum: multiplicador do que se ergue (~×4 sobre ×2). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "ergue por um instante algo muito além do humano (~×4 o normal; viga, portão, pedra)."
   - Texto da menor: "carrega/ergue o dobro do normal sem penalidade."
7. **Maior:** `levantamento-poderoso` · Levantamento Poderoso · nível 3. **Menor:** `erguer-o-enorme` · Erguer o Enorme · nível 2.
   - Bônus em comum: multiplicador do que se ergue por um instante (~×4 sobre ×3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "ergue por um instante algo muito além do humano (~×4 o normal; viga, portão, pedra)."
   - Texto da menor: "Levanta acima da cabeça, por um instante, o que precisaria de duas pessoas; capacidade de carga ×3."
8. **Maior:** `carregar-o-mundo` · Carregar o Mundo · nível 3. **Menor:** `forca-de-carga` · Força de Carga · nível 1.
   - Bônus em comum: multiplicador do que se carrega/sustenta (~×4 sobre ×2). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "sustenta pesos imensos por longos períodos (~×4 o normal)."
   - Texto da menor: "carrega/ergue o dobro do normal sem penalidade."
9. **Maior:** `carregar-o-mundo` · Carregar o Mundo · nível 3. **Menor:** `erguer-o-enorme` · Erguer o Enorme · nível 2.
   - Bônus em comum: multiplicador da capacidade de carga (~×4 sobre ×3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "sustenta pesos imensos por longos períodos (~×4 o normal)."
   - Texto da menor: "Levanta acima da cabeça, por um instante, o que precisaria de duas pessoas; capacidade de carga ×3."
10. **Maior:** `forca-titanica` · Força Titânica · nível 5. **Menor:** `forca-de-carga` · Força de Carga · nível 1.
   - Bônus em comum: multiplicador do que se ergue (~×30 sobre ×2). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "ergue carroças, estátuas e pedras de tonelada (~×30 o normal)."
   - Texto da menor: "carrega/ergue o dobro do normal sem penalidade."
11. **Maior:** `forca-titanica` · Força Titânica · nível 5. **Menor:** `erguer-o-enorme` · Erguer o Enorme · nível 2.
   - Bônus em comum: multiplicador do que se ergue (~×30 sobre ×3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "ergue carroças, estátuas e pedras de tonelada (~×30 o normal)."
   - Texto da menor: "Levanta acima da cabeça, por um instante, o que precisaria de duas pessoas; capacidade de carga ×3."
12. **Maior:** `forca-titanica` · Força Titânica · nível 5. **Menor:** `levantamento-poderoso` · Levantamento Poderoso · nível 3.
   - Bônus em comum: multiplicador do que se ergue (~×30 sobre ~×4). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "ergue carroças, estátuas e pedras de tonelada (~×30 o normal)."
   - Texto da menor: "ergue por um instante algo muito além do humano (~×4 o normal; viga, portão, pedra)."
13. **Maior:** `atlas` · Atlas · nível 6. **Menor:** `forca-de-carga` · Força de Carga · nível 1.
   - Bônus em comum: multiplicador do que se sustenta (~×100 sobre ×2). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "sustenta ou arremessa coisas de escala absurda (~×100 o normal; uma muralha, um barco)."
   - Texto da menor: "carrega/ergue o dobro do normal sem penalidade."
14. **Maior:** `atlas` · Atlas · nível 6. **Menor:** `erguer-o-enorme` · Erguer o Enorme · nível 2.
   - Bônus em comum: multiplicador da capacidade de carga (~×100 sobre ×3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "sustenta ou arremessa coisas de escala absurda (~×100 o normal; uma muralha, um barco)."
   - Texto da menor: "Levanta acima da cabeça, por um instante, o que precisaria de duas pessoas; capacidade de carga ×3."
15. **Maior:** `atlas` · Atlas · nível 6. **Menor:** `levantamento-poderoso` · Levantamento Poderoso · nível 3.
   - Bônus em comum: multiplicador do peso movido (~×100 sobre ~×4). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "sustenta ou arremessa coisas de escala absurda (~×100 o normal; uma muralha, um barco)."
   - Texto da menor: "ergue por um instante algo muito além do humano (~×4 o normal; viga, portão, pedra)."
16. **Maior:** `atlas` · Atlas · nível 6. **Menor:** `carregar-o-mundo` · Carregar o Mundo · nível 3.
   - Bônus em comum: multiplicador do que se sustenta (~×100 sobre ~×4). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "sustenta ou arremessa coisas de escala absurda (~×100 o normal; uma muralha, um barco)."
   - Texto da menor: "sustenta pesos imensos por longos períodos (~×4 o normal)."
17. **Maior:** `atlas` · Atlas · nível 6. **Menor:** `forca-titanica` · Força Titânica · nível 5.
   - Bônus em comum: multiplicador do peso movido (~×100 sobre ~×30). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "sustenta ou arremessa coisas de escala absurda (~×100 o normal; uma muralha, um barco)."
   - Texto da menor: "ergue carroças, estátuas e pedras de tonelada (~×30 o normal)."
18. **Maior:** `atlas` · Atlas · nível 6. **Menor:** `arremesso` · Arremesso · nível 1.
   - Bônus em comum: multiplicador do que se arremessa (~×100 sobre ~×2). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "sustenta ou arremessa coisas de escala absurda (~×100 o normal; uma muralha, um barco)."
   - Texto da menor: "atira objetos pesados ou pessoas como arma (~×2 o normal)."

### Agarrão do Urso (`agarrao-do-urso`) · 1 caso(s)

19. **Maior:** `esmagar-nos-bracos` · Esmagar nos Braços · nível 3. **Menor:** `prensa-crescente` · Prensa Crescente · nível 2.
   - Bônus em comum: dano contínuo a quem está agarrado. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "dano contínuo a quem está agarrado."
   - Texto da menor: "Enquanto segura o alvo, começa a comprimir: dano leve a cada 6 Ticks e o preso age com −1 até se soltar."

### Sangue Fervente (`sangue-fervente`) · 1 caso(s)

20. **Maior:** `investida-furiosa` · Investida Furiosa · nível 3. **Menor:** `furia` · Fúria · nível 1.
   - Bônus em comum: dano corpo a corpo (+2d6 sobre +1d6). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Avança e ataca com +2d6 de dano por empurrão."
   - Texto da menor: "Entra em fúria: +1d6 de dano corpo-a-corpo, −1 na Defesa enquanto durar."

### Vento (`vento`) · 3 caso(s)

21. **Maior:** `esquiva-de-vento` · Esquiva de Vento · nível 2. **Menor:** `reflexos-de-vento` · Reflexos de Vento · nível 1.
   - Bônus em comum: Defesa contra um ataque visto que te visa (+4 sobre +3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Ao ver um ataque que te visa, +4 na Defesa contra ele: um passo lateral que confunde a mira."
   - Texto da menor: "Após ver um ataque que te visa, **+3 na Defesa** contra ele."
22. **Maior:** `esquiva-impossivel` · Esquiva Impossível · nível 3. **Menor:** `reflexos-de-vento` · Reflexos de Vento · nível 1.
   - Bônus em comum: Defesa contra um ataque visto que te visa (+6 sobre +3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Ao ver um ataque que te visa, +6 na Defesa contra ele: o corpo já saiu do caminho quando o golpe chega."
   - Texto da menor: "Após ver um ataque que te visa, **+3 na Defesa** contra ele."
23. **Maior:** `esquiva-impossivel` · Esquiva Impossível · nível 3. **Menor:** `esquiva-de-vento` · Esquiva de Vento · nível 2.
   - Bônus em comum: Defesa contra um ataque visto que te visa (+6 sobre +4). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Ao ver um ataque que te visa, +6 na Defesa contra ele: o corpo já saiu do caminho quando o golpe chega."
   - Texto da menor: "Ao ver um ataque que te visa, +4 na Defesa contra ele: um passo lateral que confunde a mira."

### Gato (`gato`) · 1 caso(s)

24. **Maior:** `contorcao` · Contorção · nível 3. **Menor:** `corpo-de-gato` · Corpo de Gato · nível 2.
   - Bônus em comum: passar por aberturas mínimas e escapar de amarras. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "passa por aberturas mínimas, escapa de amarras e grades."
   - Texto da menor: "Passa por vãos mínimos, escapa de amarras e cai de pé de qualquer altura mundana, sem se ferir."

### Mão Veloz (`mao-veloz`) · 2 caso(s)

25. **Maior:** `maos-rapidas-demais` · Mãos Rápidas Demais · nível 2. **Menor:** `truque-de-mao` · Truque de Mão · nível 1.
   - Bônus em comum: furtar ou plantar objetos pequenos sem ser visto. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Manipula vários objetos pequenos num átimo: furta, planta ou troca algo sem que o olho acompanhe."
   - Texto da menor: "some/planta/rouba objetos pequenos sem ser visto."
26. **Maior:** `maos-borradas` · Mãos Borradas · nível 3. **Menor:** `maos-rapidas-demais` · Mãos Rápidas Demais · nível 2.
   - Bônus em comum: manipular vários objetos rápido demais para acompanhar. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "manipula vários objetos rápido demais para acompanhar."
   - Texto da menor: "Manipula vários objetos pequenos num átimo: furta, planta ou troca algo sem que o olho acompanhe."

### Olho de Águia (`olho-de-aguia`) · 2 caso(s)

27. **Maior:** `tiro-perfurante` · Tiro Perfurante · nível 3. **Menor:** `tiro-certeiro` · Tiro Certeiro · nível 2.
   - Bônus em comum: dano (+1d6 sobre +1d6) e Penetração (+4 sobre +1) do disparo. Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "+4 de Penetração e +1d6 de dano num disparo cuidadoso."
   - Texto da menor: "Mira num ponto fraco antes de soltar: +1d6 de dano e +1 de Penetração no disparo."
28. **Maior:** `flecha-que-persegue` · Flecha que Persegue · nível 5. **Menor:** `tiro-impossivel` · Tiro Impossível · nível 4.
   - Bônus em comum: ignorar a cobertura do alvo. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "O disparo curva e persegue o alvo, ignorando cobertura."
   - Texto da menor: "Acerta a distâncias extremas, contorna cobertura parcial e mira pontos vitais (ignora a penalidade de cobertura do alvo)."

### Dança da Lâmina (`danca-da-lamina`) · 1 caso(s)

29. **Maior:** `riposte` · Riposte · nível 3. **Menor:** `aparar-e-responder` · Aparar e Responder · nível 2.
   - Bônus em comum: contra-ataque imediato ao aparar com sucesso. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "Ao aparar com sucesso, contra-ataca imediatamente."
   - Texto da menor: "Ao aparar um golpe com sucesso, devolve na hora uma estocada rápida (contra-ataque leve)."

### Sombra (`sombra`) · 1 caso(s)

30. **Maior:** `bote-silencioso` · Bote Silencioso · nível 3. **Menor:** `bote-da-sombra` · Bote da Sombra · nível 2.
   - Bônus em comum: dano contra alvo desavisado (+2d6 sobre +1d6). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Ataque furtivo contra alvo desavisado: +2d6 de dano (o alvo desavisado já sofre a penalidade de Defesa por surpresa)."
   - Texto da menor: "Contra um alvo desavisado, o primeiro golpe some da guarda dele e soma +1d6."

### Pele de Pedra (`pele-de-pedra`) · 5 caso(s)

31. **Maior:** `couro-endurecido` · Couro Endurecido · nível 2. **Menor:** `pele-curtida` · Pele Curtida · nível 1.
   - Bônus em comum: Absorção contra Impacto (+3 sobre +2). Tipo: bônus numérico na mesma coisa. Ver a nota da Pele de Pedra acima.
   - Texto da maior: "A pele curte-se: +3 de Absorção contra Impacto e +2 contra Corte, sem pesar no movimento."
   - Texto da menor: "+2 de Absorção contra Impacto."
32. **Maior:** `couro-endurecido` · Couro Endurecido · nível 2. **Menor:** `tensionar` · Tensionar · nível 1.
   - Bônus em comum: Absorção contra Impacto (+3 sobre +2). Tipo: bônus numérico na mesma coisa. Ver a nota da Pele de Pedra acima.
   - Texto da maior: "A pele curte-se: +3 de Absorção contra Impacto e +2 contra Corte, sem pesar no movimento."
   - Texto da menor: "Ao ser atingido, +2 de Absorção contra aquele golpe."
33. **Maior:** `pele-de-pedra` · Pele de Pedra · nível 3. **Menor:** `pele-curtida` · Pele Curtida · nível 1.
   - Bônus em comum: Absorção contra Impacto (+4 sobre +2). Tipo: bônus numérico na mesma coisa. Ver a nota da Pele de Pedra acima.
   - Texto da maior: "+4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1."
   - Texto da menor: "+2 de Absorção contra Impacto."
34. **Maior:** `pele-de-pedra` · Pele de Pedra · nível 3. **Menor:** `tensionar` · Tensionar · nível 1.
   - Bônus em comum: Absorção contra Impacto (+4 sobre +2). Tipo: bônus numérico na mesma coisa. Ver a nota da Pele de Pedra acima.
   - Texto da maior: "+4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1."
   - Texto da menor: "Ao ser atingido, +2 de Absorção contra aquele golpe."
35. **Maior:** `pele-de-pedra` · Pele de Pedra · nível 3. **Menor:** `couro-endurecido` · Couro Endurecido · nível 2.
   - Bônus em comum: Absorção contra Impacto e Corte (+4 sobre +3 e +2). Tipo: bônus numérico na mesma coisa. Ver a nota da Pele de Pedra acima.
   - Texto da maior: "+4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1."
   - Texto da menor: "A pele curte-se: +3 de Absorção contra Impacto e +2 contra Corte, sem pesar no movimento."

### Coração Incansável (`coracao-incansavel`) · 1 caso(s)

36. **Maior:** `incansavel` · Incansável · nível 3. **Menor:** `folego-de-sobra` · Fôlego de Sobra · nível 2.
   - Bônus em comum: ignorar a penalidade de cansaço. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "Ignora a penalidade de **−1d6** do cansaço: age sem perda mesmo abaixo de 25% do Fôlego."
   - Texto da menor: "Ignora a penalidade de cansaço: corre, marcha e luta bem além do que derrubaria outro."

### Sangue Imune (`sangue-imune`) · 1 caso(s)

37. **Maior:** `sangue-limpo` · Sangue Limpo · nível 3. **Menor:** `purgar-o-veneno` · Purgar o Veneno · nível 2.
   - Bônus em comum: neutralizar um veneno já no corpo. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "neutraliza um veneno já no corpo; expele toxinas."
   - Texto da menor: "Neutraliza um veneno ou toxina já no corpo e aguenta um ambiente hostil (frio, calor, ar rarefeito) por um tempo."

### Cerne Vital (`cerne-vital`) · 3 caso(s)

38. **Maior:** `estancar` · Estancar · nível 2. **Menor:** `segundo-folego` · Segundo Fôlego · nível 1.
   - Bônus em comum: recuperar um punhado de PV numa ação. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Fecha um sangramento e recupera um punhado de PV numa ação; a carne já responde depressa."
   - Texto da menor: "Recupera um punhado de PV de Impacto numa ação."
39. **Maior:** `fechar-feridas` · Fechar Feridas · nível 3. **Menor:** `estancar` · Estancar · nível 2.
   - Bônus em comum: estancar sangramento e recuperar PV. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Estanca sangramentos e cura dano leve em minutos."
   - Texto da menor: "Fecha um sangramento e recupera um punhado de PV numa ação; a carne já responde depressa."
40. **Maior:** `fechar-feridas` · Fechar Feridas · nível 3. **Menor:** `segundo-folego` · Segundo Fôlego · nível 1.
   - Bônus em comum: recuperar PV (dano leve). Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Estanca sangramentos e cura dano leve em minutos."
   - Texto da menor: "Recupera um punhado de PV de Impacto numa ação."

### Voz de Mel (`voz-de-mel`) · 3 caso(s)

41. **Maior:** `palavra-que-acalma` · Palavra que Acalma · nível 2. **Menor:** `palavra-calmante` · Palavra Calmante · nível 1.
   - Bônus em comum: baixar a hostilidade de alguém (ou grupo) ainda não violento. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Baixa a hostilidade de uma pessoa ou grupo ainda não violento; suspende o conflito do momento."
   - Texto da menor: "Baixa um grau a hostilidade de alguém (ou grupo) ainda não violento."
42. **Maior:** `desarmar` · Desarmar · nível 3. **Menor:** `palavra-que-acalma` · Palavra que Acalma · nível 2.
   - Bônus em comum: suspender a hostilidade do momento. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "Convence alguém a baixar a guarda ou a arma; suspende a hostilidade do momento."
   - Texto da menor: "Baixa a hostilidade de uma pessoa ou grupo ainda não violento; suspende o conflito do momento."
43. **Maior:** `desarmar` · Desarmar · nível 3. **Menor:** `palavra-calmante` · Palavra Calmante · nível 1.
   - Bônus em comum: baixar a hostilidade do alvo. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Convence alguém a baixar a guarda ou a arma; suspende a hostilidade do momento."
   - Texto da menor: "Baixa um grau a hostilidade de alguém (ou grupo) ainda não violento."

### Lenda Viva (`lenda-viva`) · 1 caso(s)

44. **Maior:** `estandarte-vivo` · Estandarte Vivo · nível 3. **Menor:** `farol-de-coragem` · Farol de Coragem · nível 2.
   - Bônus em comum: aliados resistem melhor a medo e desânimo enquanto você está visível. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "Enquanto visível, aliados resistem melhor a medo e desânimo."
   - Texto da menor: "Enquanto visível, aliados próximos resistem melhor ao medo e ao desânimo; sua presença sustenta a linha."

### Estandarte (`estandarte`) · 1 caso(s)

45. **Maior:** `formacao` · Formação · nível 3. **Menor:** `formar-fileira` · Formar Fileira · nível 2.
   - Bônus em comum: Defesa dos aliados em formação (+6 sobre +2). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "aliados coordenados ganham +6 de Defesa e de ataque juntos."
   - Texto da menor: "Aliados que o seguem fecham formação: +2 de Defesa e coordenação enquanto o ouvem e o veem."

### Musa (`musa`) · 1 caso(s)

46. **Maior:** `encantar-a-multidao` · Encantar a Multidão · nível 3. **Menor:** `prender-a-plateia` · Prender a Plateia · nível 2.
   - Bônus em comum: a plateia fica absorta enquanto você se apresenta. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "a plateia fica absorta enquanto você se apresenta."
   - Texto da menor: "A apresentação absorve a atenção de todos: ninguém desvia o olhar enquanto você se apresenta."

### Comando (`comando`) · 1 caso(s)

47. **Maior:** `ordem-que-pesa` · Ordem que Pesa · nível 2. **Menor:** `ordem-curta` · Ordem Curta · nível 1.
   - Bônus em comum: o alvo obedece uma ordem curta (vs Defesa Mental). Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Uma ordem curta que o alvo obedece por reflexo (vs Defesa Mental); resistir custa Força de Vontade."
   - Texto da menor: "Manip+Intimidação vs Defesa Mental: o alvo obedece uma ordem simples e não-autodestrutiva por uma ação ("pare", "largue", "ajoelhe")."

### Teia (`teia`) · 1 caso(s)

48. **Maior:** `chantagem` · Chantagem · nível 3. **Menor:** `alavanca` · Alavanca · nível 2.
   - Bônus em comum: usar uma fraqueza social para dobrar a vontade de alguém. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "usa uma alavanca para dobrar a vontade de alguém."
   - Texto da menor: "Descobre e usa uma fraqueza social para dobrar a vontade de alguém (uma chantagem branda)."

### Serpente das Palavras (`serpente-das-palavras`) · 1 caso(s)

49. **Maior:** `contrato-capcioso` · Contrato Capcioso · nível 3. **Menor:** `torcer-o-acordo` · Torcer o Acordo · nível 2.
   - Bônus em comum: fechar um trato com armadilha que o alvo não percebe. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "fecha acordos com armadilhas que o alvo não percebe."
   - Texto da menor: "Fecha um trato com uma armadilha na letra que o alvo não percebe na hora."

### Sussurro (`sussurro`) · 3 caso(s)

50. **Maior:** `semear-suspeita` · Semear Suspeita · nível 2. **Menor:** `semear-duvida` · Semear Dúvida · nível 1.
   - Bônus em comum: o alvo passa a desconfiar de quem confiava. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Uma insinuação bem posta deixa o alvo desconfiado de alguém em quem confiava (vs Defesa Social)."
   - Texto da menor: "faz o alvo duvidar de quem confiava."
51. **Maior:** `paranoia` · Paranoia · nível 3. **Menor:** `semear-suspeita` · Semear Suspeita · nível 2.
   - Bônus em comum: instalar suspeita no alvo (vs Defesa Social). Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "instala suspeita corrosiva (vs Defesa Social)."
   - Texto da menor: "Uma insinuação bem posta deixa o alvo desconfiado de alguém em quem confiava (vs Defesa Social)."
52. **Maior:** `paranoia` · Paranoia · nível 3. **Menor:** `semear-duvida` · Semear Dúvida · nível 1.
   - Bônus em comum: instalar suspeita/dúvida no alvo. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "instala suspeita corrosiva (vs Defesa Social)."
   - Texto da menor: "faz o alvo duvidar de quem confiava."

### Marionete (`marionete`) · 1 caso(s)

53. **Maior:** `compulsao` · Compulsão · nível 3. **Menor:** `impulso-plantado` · Impulso Plantado · nível 2.
   - Bônus em comum: desejo passageiro que o alvo racionaliza como seu (vs Defesa Mental). Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "impõe um desejo passageiro que o alvo racionaliza como seu (vs Defesa Mental)."
   - Texto da menor: "Implanta um desejo passageiro que o alvo racionaliza como seu (vs Defesa Mental)."

### Máscara (`mascara`) · 1 caso(s)

54. **Maior:** `mentira-perfeita` · Mentira Perfeita · nível 3. **Menor:** `mentira-solida` · Mentira Sólida · nível 2.
   - Bônus em comum: mentira que resiste a escrutínio (vs Defesa Social). Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "Uma mentira que resiste a escrutínio (vs Defesa Social / Olho da Verdade)."
   - Texto da menor: "Sustenta uma mentira que resiste a um escrutínio comum (vs Defesa Social / leitura)."

### Beleza Cativante (`beleza-cativante`) · 2 caso(s)

55. **Maior:** `olhar-que-prende` · Olhar que Prende · nível 2. **Menor:** `desarmar-com-charme` · Desarmar com Charme · nível 1.
   - Bônus em comum: baixar a guarda do alvo pela beleza. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Cativa um alvo receptivo: baixa a guarda dele e prende a atenção nele em você (vs Defesa Social)."
   - Texto da menor: "a beleza baixa a guarda do alvo."
56. **Maior:** `olhar-cativante` · Olhar Cativante · nível 3. **Menor:** `olhar-que-prende` · Olhar que Prende · nível 2.
   - Bônus em comum: prender o alvo em fascínio. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "prende o alvo num momento de fascínio."
   - Texto da menor: "Cativa um alvo receptivo: baixa a guarda dele e prende a atenção nele em você (vs Defesa Social)."

### Semblante (`semblante`) · 1 caso(s)

57. **Maior:** `olhar-que-cala` · Olhar que Cala · nível 2. **Menor:** `olhar-severo` · Olhar Severo · nível 1.
   - Bônus em comum: um olhar faz o alvo hesitar ou recuar. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "Um olhar que faz o alvo hesitar ou recuar e impõe silêncio numa roda barulhenta."
   - Texto da menor: "um olhar faz um alvo hesitar ou recuar."

### Camaleão (`camaleao`) · 2 caso(s)

58. **Maior:** `sumir-na-multidao` · Sumir na Multidão · nível 2. **Menor:** `mudar-de-cara` · Mudar de Cara · nível 1.
   - Bônus em comum: mudar postura e voz para parecer outra pessoa. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Muda postura, voz e trejeitos a ponto de passar por gente comum daquele meio, sem levantar suspeita."
   - Texto da menor: "altera postura, expressão e voz para parecer outra pessoa."
59. **Maior:** `sumir-na-multidao` · Sumir na Multidão · nível 2. **Menor:** `misturar-se` · Misturar-se · nível 1.
   - Bônus em comum: passar por gente comum da multidão. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Muda postura, voz e trejeitos a ponto de passar por gente comum daquele meio, sem levantar suspeita."
   - Texto da menor: "passa por "mais um da multidão"."

### Aura (`aura`) · 5 caso(s)

60. **Maior:** `irradiar-emocao` · Irradiar Emoção · nível 2. **Menor:** `irradiar-calma` · Irradiar Calma · nível 1.
   - Bônus em comum: projetar calma sobre quem está perto. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Projeta uma emoção escolhida (calma ou temor) sobre quem está por perto, por uma cena."
   - Texto da menor: "acalma pessoas e animais ao redor."
61. **Maior:** `irradiar-emocao` · Irradiar Emoção · nível 2. **Menor:** `irradiar-temor` · Irradiar Temor · nível 1.
   - Bônus em comum: projetar temor sobre quem está perto. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Projeta uma emoção escolhida (calma ou temor) sobre quem está por perto, por uma cena."
   - Texto da menor: "incute medo leve nos próximos."
62. **Maior:** `campo-emocional` · Campo Emocional · nível 3. **Menor:** `irradiar-emocao` · Irradiar Emoção · nível 2.
   - Bônus em comum: impor uma emoção a quem está na área. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "impõe uma emoção a todos numa área por um tempo."
   - Texto da menor: "Projeta uma emoção escolhida (calma ou temor) sobre quem está por perto, por uma cena."
63. **Maior:** `campo-emocional` · Campo Emocional · nível 3. **Menor:** `irradiar-calma` · Irradiar Calma · nível 1.
   - Bônus em comum: impor uma emoção (calma) a quem está ao redor. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "impõe uma emoção a todos numa área por um tempo."
   - Texto da menor: "acalma pessoas e animais ao redor."
64. **Maior:** `campo-emocional` · Campo Emocional · nível 3. **Menor:** `irradiar-temor` · Irradiar Temor · nível 1.
   - Bônus em comum: impor uma emoção (temor) a quem está ao redor. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "impõe uma emoção a todos numa área por um tempo."
   - Texto da menor: "incute medo leve nos próximos."

### Máscara Impassível (`mascara-impassivel`) · 3 caso(s)

65. **Maior:** `rosto-de-pedra` · Rosto de Pedra · nível 2. **Menor:** `face-neutra` · Face Neutra · nível 1.
   - Bônus em comum: suas emoções não vazam para quem tenta ler. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Nada do que sente vaza: leituras da sua emoção ou intenção falham por padrão contra você."
   - Texto da menor: "suas emoções nunca transparecem; +3 em blefe."
66. **Maior:** `inescrutavel` · Inescrutável · nível 3. **Menor:** `rosto-de-pedra` · Rosto de Pedra · nível 2.
   - Bônus em comum: leitura das suas intenções falha. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "ninguém lê suas intenções; imune a leitura corporal mundana."
   - Texto da menor: "Nada do que sente vaza: leituras da sua emoção ou intenção falham por padrão contra você."
67. **Maior:** `inescrutavel` · Inescrutável · nível 3. **Menor:** `face-neutra` · Face Neutra · nível 1.
   - Bônus em comum: ninguém lê o que você sente ou pretende. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "ninguém lê suas intenções; imune a leitura corporal mundana."
   - Texto da menor: "suas emoções nunca transparecem; +3 em blefe."

### Olho Aguçado (`olho-agucado`) · 1 caso(s)

68. **Maior:** `percepcao-agucada` · Percepção Aguçada · nível 2. **Menor:** `sentidos-apurados` · Sentidos Apurados · nível 1.
   - Bônus em comum: Percepção (+4 sobre +3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "+4 em Percepção: capta o quase-imperceptível, um som fraco, um cheiro, um detalhe fora do lugar."
   - Texto da menor: "+3 em testes de Percepção e na Percepção Passiva; nunca é pego totalmente de surpresa."

### Sentinela (`sentinela`) · 1 caso(s)

69. **Maior:** `nunca-desprevenido` · Nunca Desprevenido · nível 3. **Menor:** `sempre-alerta` · Sempre Alerta · nível 2.
   - Bônus em comum: não pode ser pego de surpresa. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "age normalmente em emboscadas; não pode ser pego de surpresa."
   - Texto da menor: "Não é pego de surpresa: sente o perigo antes de vê-lo e reage a tempo de não ser flanqueado."

### Caçador (`cacador`) · 1 caso(s)

70. **Maior:** `trilha-certa` · Trilha Certa · nível 2. **Menor:** `rastreador` · Rastreador · nível 1.
   - Bônus em comum: rastrear (+4 sobre +3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "+4 para rastrear e seguir; lê num relance a idade de um rastro e a pressa de quem o deixou."
   - Texto da menor: "+3 para rastrear e ler sinais."

### Olho da Verdade (`olho-da-verdade`) · 2 caso(s)

71. **Maior:** `farejar-a-farsa` · Farejar a Farsa · nível 2. **Menor:** `farejar-mentira` · Farejar Mentira · nível 1.
   - Bônus em comum: sentir quando alguém mente. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "Sente quando alguém mente ou disfarça, e para onde a atenção dele foge (vs Defesa Social)."
   - Texto da menor: "sente quando alguém mente."
72. **Maior:** `farejar-a-farsa` · Farejar a Farsa · nível 2. **Menor:** `ver-atraves` · Ver Através · nível 1.
   - Bônus em comum: perceber disfarce e fingimento. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Sente quando alguém mente ou disfarça, e para onde a atenção dele foge (vs Defesa Social)."
   - Texto da menor: "nota disfarces e fingimentos malfeitos."

### Comunhão (`comunhao`) · 4 caso(s)

73. **Maior:** `tocar-o-veu` · Tocar o Véu · nível 2. **Menor:** `ver-auras` · Ver Auras · nível 1.
   - Bônus em comum: perceber auras. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Percebe espíritos, auras e resíduos de magia à volta, e sente o humor de um lugar."
   - Texto da menor: "percebe o estado/natureza de alguém como cores."
74. **Maior:** `tocar-o-veu` · Tocar o Véu · nível 2. **Menor:** `sensivel` · Sensível · nível 1.
   - Bônus em comum: perceber espíritos e magia por perto. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Percebe espíritos, auras e resíduos de magia à volta, e sente o humor de um lugar."
   - Texto da menor: "pressente o sobrenatural próximo (magia, espíritos, lugares de poder)."
75. **Maior:** `olho-espiritual` · Olho Espiritual · nível 3. **Menor:** `tocar-o-veu` · Tocar o Véu · nível 2.
   - Bônus em comum: ver espíritos e marcas de magia. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "vê espíritos, encantamentos ativos e marcas mágicas."
   - Texto da menor: "Percebe espíritos, auras e resíduos de magia à volta, e sente o humor de um lugar."
76. **Maior:** `olho-espiritual` · Olho Espiritual · nível 3. **Menor:** `sensivel` · Sensível · nível 1.
   - Bônus em comum: perceber espíritos e magia. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "vê espíritos, encantamentos ativos e marcas mágicas."
   - Texto da menor: "pressente o sobrenatural próximo (magia, espíritos, lugares de poder)."

### Vínculo Animal (`vinculo-animal`) · 1 caso(s)

77. **Maior:** `domar-o-instinto` · Domar o Instinto · nível 2. **Menor:** `acalmar-fera` · Acalmar Fera · nível 1.
   - Bônus em comum: tranquilizar um animal hostil. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Tranquiliza ou afasta um animal hostil e ganha a confiança de um bicho comum em pouco tempo."
   - Texto da menor: "Tranquiliza um animal hostil ou assustado."

### Erudito (`erudito`) · 1 caso(s)

78. **Maior:** `saber-a-fundo` · Saber a Fundo · nível 2. **Menor:** `lembrar` · Lembrar · nível 1.
   - Bônus em comum: recordar um fato relevante que estudou. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Recorda ou deduz um dado preciso sobre história, povos, criaturas ou lugares."
   - Texto da menor: "recorda um fato relevante que estudou."

### Artesão (`artesao`) · 1 caso(s)

79. **Maior:** `obra-bem-feita` · Obra Bem-Feita · nível 2. **Menor:** `maos-habeis` · Mãos Hábeis · nível 1.
   - Bônus em comum: Ofícios e reparo (+4 sobre +3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "+4 em qualquer ofício ou reparo; enxerga a solução técnica que trava os outros."
   - Texto da menor: "+3 em Ofícios; conserta e improvisa com facilidade."

### Estrategista (`estrategista`) · 1 caso(s)

80. **Maior:** `ler-a-manobra` · Ler a Manobra · nível 2. **Menor:** `antecipar` · Antecipar · nível 1.
   - Bônus em comum: prever o próximo movimento do oponente (a de nível 2 ainda dá +4 para reagir). Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Antevê o próximo movimento do inimigo: +4 para reagir ou reposicionar um aliado a tempo."
   - Texto da menor: "prevê o próximo movimento de um oponente."

### Investigador (`investigador`) · 1 caso(s)

81. **Maior:** `reconstituir` · Reconstituir · nível 3. **Menor:** `reconstituir-a-cena` · Reconstituir a Cena · nível 2.
   - Bônus em comum: remontar o que aconteceu num local pelos vestígios. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "reconstrói o que houve num local pelos vestígios."
   - Texto da menor: "A partir das pistas, remonta com boa precisão o que aconteceu ali e em que ordem."

### Reflexo Mental (`reflexo-mental`) · 1 caso(s)

82. **Maior:** `pensar-e-agir` · Pensar e Agir · nível 3. **Menor:** `duplo-tempo` · Duplo Tempo · nível 2.
   - Bônus em comum: uma ação mental e uma física quase simultâneas. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "realiza uma ação mental e uma física quase simultâneas."
   - Texto da menor: "Resolve uma tarefa mental e uma física quase ao mesmo tempo, sem perder o momento de nenhuma."

### Improviso (`improviso`) · 1 caso(s)

83. **Maior:** `reviravolta` · Reviravolta · nível 2. **Menor:** `usar-o-cenario` · Usar o Cenário · nível 1.
   - Bônus em comum: transformar um elemento do ambiente em vantagem. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "Usa o cenário a favor num átimo: transforma o que está à mão numa vantagem tática inesperada."
   - Texto da menor: "transforma um elemento do ambiente em vantagem."

### Presságio (`pressagio`) · 1 caso(s)

84. **Maior:** `caminho-do-destino` · Proeza do Destino · nível 5. **Menor:** `reflexos-premonitorios` · Reflexos Premonitórios · nível 3.
   - Bônus em comum: refazer uma rolagem 1×/cena (qualquer rolagem cobre a de Defesa); não diz se são dois usos por cena ou um. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "1×/cena, **refaça qualquer rolagem** (sua ou que o afete), declarando "eu previ isto"."
   - Texto da menor: "**+6 na Iniciativa**; 1×/cena, refaça uma rolagem de Defesa."

### Leitura Fria (`leitura-fria`) · 1 caso(s)

85. **Maior:** `perfil` · Perfil · nível 3. **Menor:** `tracar-o-perfil` · Traçar o Perfil · nível 2.
   - Bônus em comum: montar o perfil do alvo após breve contato. Tipo: efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado.
   - Texto da maior: "monta um perfil preciso após breve contato."
   - Texto da menor: "Numa breve conversa, deduz origem, humor e ponto fraco do alvo."

### Mente Serena (`mente-serena`) · 2 caso(s)

86. **Maior:** `quietude` · Quietude · nível 2. **Menor:** `foco` · Foco · nível 1.
   - Bônus em comum: afastar medo, dor e distração (por uma ação / por uma cena). Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Afasta medo, dor e distração por uma cena; a cabeça fica limpa mesmo no caos."
   - Texto da menor: "concentra-se totalmente, ignorando ruído, dor e medo por uma ação."
87. **Maior:** `mente-imperturbavel` · Mente Imperturbável · nível 3. **Menor:** `calma` · Calma · nível 1.
   - Bônus em comum: resistir a efeitos mentais: a provocação da de nível 1 é manipulação na de nível 3 (+6 sobre +3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "+6 para resistir a manipulação, medo e efeitos mentais."
   - Texto da menor: "+3 para manter o foco e resistir a distração e provocação."

### Leitor de Almas (`leitor-de-almas`) · 1 caso(s)

88. **Maior:** `ler-a-sala` · Ler a Sala · nível 3. **Menor:** `tomar-o-pulso` · Tomar o Pulso · nível 2.
   - Bônus em comum: uma ação para mapear tensões, alianças e humor de um ambiente/grupo. Tipo: mesmo efeito, com alcance ou intensidade diferente.
   - Texto da maior: "Uma ação para mapear tensões, alianças e o humor de um **grupo inteiro**; ganha **+6** nas jogadas sociais que explorem o que captou."
   - Texto da menor: "Uma ação para sentir as tensões, alianças e o humor dominante de um ambiente social."

### Porte Inabalável (`porte-inabalavel`) · 1 caso(s)

89. **Maior:** `fundo-calmo` · Fundo Calmo · nível 2. **Menor:** `voz-calma` · Voz Calma · nível 1.
   - Bônus em comum: Defesa Social contra intimidação e provocação (+4 sobre +3). Tipo: bônus numérico na mesma coisa.
   - Texto da maior: "Contra intimidação ou provocação, +4 na Defesa Social e você não demonstra o menor abalo."
   - Texto da menor: "Ao ser alvo de intimidação ou provocação, **+3 na Defesa Social** contra o efeito e não demonstra qualquer abalo."

## Casos duvidosos

1. **Quebra-Muralhas** (`quebra-muralhas`): `abrir-brecha` (3), `esmaga-pedra` (4), `quebra-muralhas` (6), `pancada-destrutiva` (1), `demolidor` (1).
   - Por que fica em dúvida: As três ativas de nível maior (+6, +9, +15 ao Romper) repetem o bônus da Pancada Destrutiva (+3 ao Romper) e umas das outras, e todas somam no mesmo pool que o +1d6 do Demolidor. A regra existe, mas na `nota` do Caminho em caminhos.json e não no texto de nenhuma Técnica: "Cada Técnica ativa abaixo soma um bônus ao Romper de um golpe, e só uma entra por jogada; a passiva Demolidor soma por cima." Pela letra da T2 ("o texto dela diz") falta a frase nas Técnicas. Se contar, são 9 pares: 6 entre as quatro ativas (abrir-brecha/pancada-destrutiva, esmaga-pedra/pancada-destrutiva, esmaga-pedra/abrir-brecha, quebra-muralhas/pancada-destrutiva, quebra-muralhas/abrir-brecha, quebra-muralhas/esmaga-pedra) e 3 das ativas de nível maior contra o Demolidor; 3 textos a editar.
   - `abrir-brecha` · Abrir Brecha · nível 3: "Um golpe de Romper com +6 (trilha de Bônus, nível 3) contra parede: derruba uma parede fraca (taipa, adobe ou tábuas) num golpe."
   - `esmaga-pedra` · Esmaga-Pedra · nível 4: "Um golpe de Romper com +9 (trilha de Bônus, nível 4) contra pedra e portão reforçado."
   - `quebra-muralhas` · Quebra-Muralhas · nível 6: "Um golpe de Romper com +15 (trilha de Bônus, nível 6) contra muralha ou torre."
   - `pancada-destrutiva` · Pancada Destrutiva · nível 1: "Um golpe de Romper com +3 (trilha de Bônus, nível 1) contra porta, fechadura ou corrente."
   - `demolidor` · Demolidor · nível 1: "+1d6 no pool de Romper (Força + Atletismo): você acha o ponto fraco do que quer quebrar."
2. **Sangue Fervente** (`sangue-fervente`): `avatar-da-carnificina` (6), `furia` (1).
   - Por que fica em dúvida: "Dano massivo" é dano corpo a corpo como o +1d6 da Fúria, mas sem número.
   - `avatar-da-carnificina` · Avatar da Carnificina · nível 6: "Uma tempestade de violência: dano massivo, imune a medo, quase imparável."
   - `furia` · Fúria · nível 1: "Entra em fúria: +1d6 de dano corpo-a-corpo, −1 na Defesa enquanto durar."
3. **Vento** (`vento`): `borrao` (4), `reflexos-de-vento` (1), `esquiva-de-vento` (2), `esquiva-impossivel` (3).
   - Por que fica em dúvida: O Borrão dá −9 aos disparos contra você; as outras dão + na Defesa contra um ataque. O efeito final é o mesmo (fica mais difícil te acertar), mas uma é penalidade ao atacante e a outra é bônus à Defesa, e o Borrão só vale contra disparos. Não decidi se é a mesma coisa bonificada.
   - `borrao` · Borrão · nível 4: "Vira um borrão: **−9** a disparos contra você; pode cruzar um campo de batalha num único Tick."
   - `reflexos-de-vento` · Reflexos de Vento · nível 1: "Após ver um ataque que te visa, **+3 na Defesa** contra ele."
   - `esquiva-de-vento` · Esquiva de Vento · nível 2: "Ao ver um ataque que te visa, +4 na Defesa contra ele: um passo lateral que confunde a mira."
   - `esquiva-impossivel` · Esquiva Impossível · nível 3: "Ao ver um ataque que te visa, +6 na Defesa contra ele: o corpo já saiu do caminho quando o golpe chega."
4. **Gato** (`gato`): `corpo-de-gato` (2), `queda-de-gato` (1).
   - Por que fica em dúvida: Absoluto com escopo: "cai de pé de qualquer altura mundana, sem se ferir" (nível 2) esvazia o "reduz muito o dano de quedas (×2)" (nível 1) nas quedas mundanas, mas não fora delas, onde a redução da de nível 1 ainda pode valer.
   - `corpo-de-gato` · Corpo de Gato · nível 2: "Passa por vãos mínimos, escapa de amarras e cai de pé de qualquer altura mundana, sem se ferir."
   - `queda-de-gato` · Queda de Gato · nível 1: "reduz muito o dano de quedas (×2); cai de pé."
5. **Mão Veloz** (`mao-veloz`): `toque-preciso` (3), `dedos-ageis` (1), `mil-dedos` (4), `maos-borradas` (3).
   - Por que fica em dúvida: "Abre qualquer fechadura mundana num instante" (nível 3) torna o +3 em fechaduras (nível 1) quase inútil, mas não absoluto contra fechadura não mundana. E "várias ações manuais finas numa única ação" (nível 4) se sobrepõe a "manipula vários objetos rápido demais" (nível 3).
   - `toque-preciso` · Toque Preciso · nível 3: "desarma armadilhas e abre qualquer fechadura mundana num instante."
   - `dedos-ageis` · Dedos Ágeis · nível 1: "+3 em prestidigitação, fechaduras e furto."
   - `mil-dedos` · Mil Dedos · nível 4: "várias ações manuais finas numa única ação."
   - `maos-borradas` · Mãos Borradas · nível 3: "manipula vários objetos rápido demais para acompanhar."
6. **Olho de Águia** (`olho-de-aguia`): `tiro-impossivel` (4), `olho-de-alcance` (1).
   - Por que fica em dúvida: "Acerta a distâncias extremas" pode ser um alcance maior que o dobro da de nível 1, ou só a anulação da penalidade de alcance; sem número, não decidi.
   - `tiro-impossivel` · Tiro Impossível · nível 4: "Acerta a distâncias extremas, contorna cobertura parcial e mira pontos vitais (ignora a penalidade de cobertura do alvo)."
   - `olho-de-alcance` · Olho de Alcance · nível 1: "Dobra o alcance efetivo sem penalidade."
7. **Pele de Pedra** (`pele-de-pedra`): `pele-de-pedra` (3), `aguentar-o-tranco` (1).
   - Por que fica em dúvida: A de nível 3 reduz as penalidades de ferimento em 1; a de nível 1 ignora a do Machucado (−1). No Machucado as duas zeram a mesma penalidade; nos estados piores só a de nível 3 age. Fica a dúvida se a de nível 1 ainda soma por cima.
   - `pele-de-pedra` · Pele de Pedra · nível 3: "+4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1."
   - `aguentar-o-tranco` · Aguentar o Tranco · nível 1: "Ignora a penalidade do estado Machucado (−1)."
8. **Pele de Pedra** (`pele-de-pedra`): `pele-adamantina` (6), `pele-de-pedra` (3), `couro-endurecido` (2), `pele-curtida` (1).
   - Por que fica em dúvida: "Reduz drasticamente todo dano" é redução de dano recebido, o mesmo que a Absorção das de nível menor, mas não tem número; não dá para dizer se o texto quer somar.
   - `pele-adamantina` · Pele Adamantina · nível 6: "Quase indestrutível: reduz drasticamente todo dano e ignora ambientes mortais."
   - `pele-de-pedra` · Pele de Pedra · nível 3: "+4 de Absorção (todos os tipos) e reduz as penalidades de ferimento em 1."
   - `couro-endurecido` · Couro Endurecido · nível 2: "A pele curte-se: +3 de Absorção contra Impacto e +2 contra Corte, sem pesar no movimento."
   - `pele-curtida` · Pele Curtida · nível 1: "+2 de Absorção contra Impacto."
9. **Coração Incansável** (`coracao-incansavel`): `vigor-inesgotavel` (5), `folego-profundo` (1).
   - Por que fica em dúvida: As duas mexem na recuperação de Fôlego por Tick: a de nível 1 dobra (+2× Vigor), a de nível 5 deixa recuperar Vigor mesmo atacando. Não diz se o dobro da de nível 1 vale durante o ataque.
   - `vigor-inesgotavel` · Vigor Inesgotável · nível 5: "Sua reserva **nunca para de se renovar**: você recupera Vigor de Fôlego por Tick **mesmo enquanto ataca ou corre**. Na prática, golpes leves passam a se pagar sozinhos e só os pesados e o Esforço ainda drenam. Dispensa sono e comida por longos períodos."
   - `folego-profundo` · Fôlego Profundo · nível 1: "Recupera **+2× Vigor** de Fôlego por Tick, o dobro da recuperação normal."
10. **Sangue Imune** (`sangue-imune`): `imunidade` (4), `estomago-de-ferro` (1), `resistir-doenca` (1).
   - Por que fica em dúvida: Absoluto com escopo: "imune a venenos e doenças mundanos" (nível 4) esvazia o +3 contra venenos e o "raramente adoece" (nível 1) contra o que é mundano, mas não contra veneno ou doença sobrenatural, onde o +3 ainda pode valer.
   - `imunidade` · Imunidade · nível 4: "imune a venenos e doenças mundanos."
   - `estomago-de-ferro` · Estômago de Ferro · nível 1: "+3 contra venenos e comida estragada."
   - `resistir-doenca` · Resistir Doença · nível 1: "raramente adoece."
11. **Sangue Imune** (`sangue-imune`): `purgar-o-veneno` (2), `aclimatacao` (1), `pele-resiliente` (3).
   - Por que fica em dúvida: "Aguenta um ambiente hostil (frio, calor, ar rarefeito)" na de nível 2 e "suporta temperaturas que matariam" na de nível 3 cobrem a adaptação a calor, frio e altitude da de nível 1, mas em graus diferentes e sem número.
   - `purgar-o-veneno` · Purgar o Veneno · nível 2: "Neutraliza um veneno ou toxina já no corpo e aguenta um ambiente hostil (frio, calor, ar rarefeito) por um tempo."
   - `aclimatacao` · Aclimatação · nível 1: "adapta-se rápido a calor, frio e altitude."
   - `pele-resiliente` · Pele Resiliente · nível 3: "suporta temperaturas e ambientes que matariam outros."
12. **Carne Teimosa** (`carne-teimosa`): `teimosia` (3), `aguentar-firme` (1), `nao-vou-cair` (3), `segurar-o-baque` (2).
   - Por que fica em dúvida: Mesmo padrão da Pele de Pedra: a de nível 3 reduz as penalidades de ferimento em 1 e a de nível 1 ignora a do Machucado. E "ao chegar a 0 PV, fica de pé por mais 6 Ticks" (nível 3) é parecido com "quando cairia a um estado pior, resiste por 6 Ticks" (nível 2), sem ser o mesmo gatilho.
   - `teimosia` · Teimosia · nível 3: "reduz todas as penalidades de ferimento em 1."
   - `aguentar-firme` · Aguentar Firme · nível 1: "ignora a penalidade do estado Machucado."
   - `nao-vou-cair` · Não Vou Cair · nível 3: "ao chegar a 0 PV, fica de pé por mais 6 Ticks."
   - `segurar-o-baque` · Segurar o Baque · nível 2: "Quando cairia a um estado de ferimento pior, resiste por 6 Ticks e segue de pé como se não fosse."
13. **Cerne Vital** (`cerne-vital`): `regeneracao` (4), `recuperacao-acelerada` (1), `segundo-folego` (1), `fechar-feridas` (3).
   - Por que fica em dúvida: Todas recuperam PV, mas de modos diferentes (cura dobrada, ação, minutos, a cada 6 Ticks). A dúvida real é se o "cura o dobro" da de nível 1 dobra também a Regeneração, e o texto não diz.
   - `regeneracao` · Regeneração · nível 4: "Recupera PV igual ao seu Vigor a cada 6 Ticks."
   - `recuperacao-acelerada` · Recuperação Acelerada · nível 1: "Cura o dobro do normal e estabiliza sozinho ao cair."
   - `segundo-folego` · Segundo Fôlego · nível 1: "Recupera um punhado de PV de Impacto numa ação."
   - `fechar-feridas` · Fechar Feridas · nível 3: "Estanca sangramentos e cura dano leve em minutos."
14. **Brasa** (`brasa`): `atear-o-animo` (2), `incitar` (1), `inflamar` (1).
   - Por que fica em dúvida: "Inflama um pequeno grupo a agir por impulso" mistura o empurrar à ação da Incitar com o acender o ânimo da Inflamar; parece o mesmo efeito em escala de grupo, mas não é cópia de nenhuma das duas.
   - `atear-o-animo` · Atear o Ânimo · nível 2: "Inflama um pequeno grupo a agir por impulso; a plateia esquenta e se move na direção que você acende."
   - `incitar` · Incitar · nível 1: "provoca raiva/paixão, empurrando à ação."
   - `inflamar` · Inflamar · nível 1: "acende o ânimo de aliados (fervor temporário)."
15. **Olho Aguçado** (`olho-agucado`): `visao-verdadeira` (4), `visao-na-penumbra` (1).
   - Por que fica em dúvida: As duas falam de enxergar no escuro ("na escuridão percebe formas" e "a escuridão perfeita não o cega"), mas a de nível 4 é sobretudo ver o invisível; a sobreposição é parcial.
   - `visao-verdadeira` · Visão Verdadeira · nível 4: "Vê o invisível, ilusões e disfarces; a escuridão perfeita não o cega."
   - `visao-na-penumbra` · Visão na Penumbra · nível 1: "Enxerga em luz fraca como de dia; na escuridão percebe formas, calor e movimento."
16. **Olho da Verdade** (`olho-da-verdade`): `desmascarar` (3), `farejar-a-farsa` (2), `ver-atraves` (1).
   - Por que fica em dúvida: Revelar um disfarce ou mentira (nível 3) contra sentir a mentira ou o disfarce (nível 2) e notar disfarces malfeitos (nível 1). Pode ser só o passo seguinte (revelar em vez de sentir), ou o mesmo efeito.
   - `desmascarar` · Desmascarar · nível 3: "revela um disfarce ou mentira mundana (vs Camaleão/Máscara)."
   - `farejar-a-farsa` · Farejar a Farsa · nível 2: "Sente quando alguém mente ou disfarça, e para onde a atenção dele foge (vs Defesa Social)."
   - `ver-atraves` · Ver Através · nível 1: "nota disfarces e fingimentos malfeitos."
17. **Comunhão** (`comunhao`): `sentir-o-veu` (1), `tocar-o-veu` (2), `olho-espiritual` (3).
   - Por que fica em dúvida: "Nota presenças invisíveis" (nível 1) é perto de "percebe espíritos" (nível 2) e "vê espíritos" (nível 3); a Sentir o Véu é sobretudo sobre ecos do passado num lugar.
   - `sentir-o-veu` · Sentir o Véu · nível 1: "nota presenças invisíveis e ecos do passado num lugar."
   - `tocar-o-veu` · Tocar o Véu · nível 2: "Percebe espíritos, auras e resíduos de magia à volta, e sente o humor de um lugar."
   - `olho-espiritual` · Olho Espiritual · nível 3: "vê espíritos, encantamentos ativos e marcas mágicas."
18. **Mente Afiada** (`mente-afiada`): `calculo-relampago` (2), `calculo-veloz` (1), `memoria-eidetica` (1).
   - Por que fica em dúvida: A de nível 2 dá +4 em contas e memória; as de nível 1 já resolvem contas num instante e lembram de tudo. Bônus numérico contra efeito absoluto, sobre a mesma coisa; não decidi se cabe a pergunta de somar.
   - `calculo-relampago` · Cálculo Relâmpago · nível 2: "+4 em deduções, contas e memória sob pressão; conecta fatos soltos num instante."
   - `calculo-veloz` · Cálculo Veloz · nível 1: "Resolve cálculos, estimativas e lógica num instante."
   - `memoria-eidetica` · Memória Eidética · nível 1: "Lembra perfeitamente de tudo que viu ou ouviu."
19. **Reflexo Mental** (`reflexo-mental`): `reflexos-de-raio` (3), `mente-rapida` (1).
   - Por que fica em dúvida: "Age sempre entre os primeiros" é Iniciativa, como o +3 de Iniciativa da de nível 1, mas não tem número; não diz se o +3 ainda conta.
   - `reflexos-de-raio` · Reflexos de Raio · nível 3: "age sempre entre os primeiros."
   - `mente-rapida` · Mente Rápida · nível 1: "+3 de Iniciativa; pensa veloz sob pressão."
20. **Presságio** (`pressagio`): `pressentir-o-golpe` (3), `faro-do-perigo` (2).
   - Por que fica em dúvida: As duas tratam do ataque que você não teria como ver: a de nível 2 dá +4 na Defesa, a de nível 3 tira a desvantagem (defende normalmente). Bônus e remoção de penalidade na mesma situação; não é claro se são a mesma coisa.
   - `pressentir-o-golpe` · Pressentir o Golpe · nível 3: "Defende-se normalmente contra um ataque que não poderia ver (pelas costas, oculto)."
   - `faro-do-perigo` · Faro do Perigo · nível 2: "Um lampejo do perigo iminente: +4 na Defesa contra um ataque que você não teria como ver."
21. **Presságio** (`pressagio`): `olho-do-oraculo` (6), `caminho-do-destino` (5).
   - Por que fica em dúvida: "Reescreva um resultado uma vez" fica perto do "refaça qualquer rolagem" da de nível 5, mas reescrever não é refazer.
   - `olho-do-oraculo` · Olho do Oráculo · nível 6: "Verdadeira precognição: faça ao Mestre uma pergunta significativa sobre o futuro e receba uma resposta enigmática, porém verdadeira, ou reescreva um resultado uma vez."
   - `caminho-do-destino` · Proeza do Destino · nível 5: "1×/cena, **refaça qualquer rolagem** (sua ou que o afete), declarando "eu previ isto"."
22. **Leitor de Almas** (`leitor-de-almas`): `coracao-aberto` (4), `farejar-a-mentira` (1).
   - Por que fica em dúvida: "Nenhuma mentira passa sem que você role para perceber" pode querer dizer que você rola sempre (e aí a rolagem é a da de nível 1) ou que percebe sem rolar; a relação entre as duas depende dessa leitura.
   - `coracao-aberto` · Coração Aberto · nível 4: "Por uma cena, lê intenções como livro aberto: nenhuma mentira ou disfarce social passa sem que você role para perceber, e sente as **motivações reais** de quem o encara."
   - `farejar-a-mentira` · Farejar a Mentira · nível 1: "Quando alguém lhe mente, role **Perspicácia + Empatia** vs a Defesa Social do alvo; o sucesso revela <em>que houve</em> mentira (não o conteúdo)."
23. **Porte Inabalável** (`porte-inabalavel`): `aguas-profundas` (3), `semblante-fechado` (1), `enigma-vivo` (4).
   - Por que fica em dúvida: As três tornam você difícil de ler: leitura casual falha (nível 1), quem tenta lê-lo sofre −6 (nível 3), leitura falha salvo Margem alta (nível 4). Mesma coisa em formas diferentes (falha automática, penalidade, limiar), e não decidi se o −6 se soma ao limiar da de nível 4.
   - `aguas-profundas` · Águas Profundas · nível 3: "Suas mentiras não disparam tells e suas intenções seguem opacas sob pressão: quem tenta lê-lo sofre **−6**."
   - `semblante-fechado` · Semblante Fechado · nível 1: "Sua face nada entrega: leituras sociais **casuais** falham automaticamente; ler você exige uma ação dedicada (vs sua Defesa Social)."
   - `enigma-vivo` · Enigma Vivo · nível 4: "Você é fundamentalmente ilegível: leitura social e adivinhação mundana sobre suas intenções falham salvo Margem alta, e mantém quantas personas quiser sem esforço."

## Total

- **Casos: 89 pares**, em 46 Caminhos, com **64 Técnicas de nível maior distintas** (o número de textos a editar).
  - bônus numérico na mesma coisa: 35;
  - mesmo efeito, com alcance ou intensidade diferente: 34;
  - efeito idêntico: somar ou substituir não muda o resultado, o texto é duplicado: 20.
- **Casos duvidosos: 23** entradas (cada uma pode reunir mais de um par).
