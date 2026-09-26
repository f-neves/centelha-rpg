# Rodada 110 · Executora · a economia mundana no site

- **Despacho:** `docs/simulacao/caixa/110-despacho.md` (`1860d7b`).
- **Árvore:** branch `executora`, posta em `63d92bd` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-110.md`, com as horas lidas da máquina.
- **Publicado:** `a58e6f4` (B8 e Artefato), `f9709bc` (texto dos Ofícios, `Acoes_Sistema.md`, Cura),
  `3ee18df` (dados, scripts e o capítulo de custo). Este relato, as pendências e o progresso saem num
  quarto commit.
- **A fonte não está no git.** `lore/economia/` só existe como pasta não versionada no `rpg-system`
  (a sujeira da D10, decisão 3). Li de lá sem mexer e anotei o md5 dos 8 JSONs da v2 antes e depois
  da cópia; não mudaram durante a rodada.

## 0 · As duas conferências

**0.1 · B8.** `src/data/armaduras.json:200-205`: `placa-completa` de 2600 para **3600 pc**. O
catálogo do capítulo (`gen-cap-itens.mjs`) e o `combate-tempo-bench.html` foram regerados. Prova no
gerado: `dist/regras/custo-de-servico-e-itens/index.html` traz "Placa completa · Pesada · 36 po".

**0.2 · Relíquia → Artefato, e a ficha salva.** A ficha guarda o Artefato em `S.anteNom`, porque ele
é Nomeado (uma lista de `{u, n, v}` por id), e os Únicos em `S.ante`. O laço que normaliza os
Nomeados só lê os ids de hoje, então uma chave `reliquia` ficaria órfã: sem linha e sem XP.
- `src/lib/ficha-engine.ts:348-356`: `RENOMES_ANTE = [['reliquia', 'artefato']]` move `S.ante` e
  `S.anteNom` antes desse laço, como o `RENOMES` de Habilidade faz.
- `src/data/antecedentes.json`: id, nome e os textos do verbete, com o gênero acertado ("gente mata
  por ele", "pode ser roubado ou quebrado"). O capítulo foi regerado, e à mão ficaram as 5 menções
  de `antecedentes.md` (`:5`, `:9`, `:53`, `:315`, `:322`), `criacao-de-personagem.md:52` e o
  comentário de `ficha-engine.ts`.
- **Quem mais lê o id:** ninguém. Não há leitura de antecedente por id em `src/lib/mesa-*.ts`,
  `src/pages/mesa/` nem `personagem.astro`; a `/personagem` usa o mesmo `ficha-engine.ts`.
- **O teste** (`../tmp/executora/t-artefato.mjs`, no navegador, sobre o `dist/`): pego a ficha que a
  própria página salva, enxerto `anteNom.reliquia = [{n: "Espada de Teste", v: 2}]`, recarrego e leio.
  O resultado foi a linha "Artefato" com "Espada de Teste", e o que se grava depois é `artefato`, sem
  `reliquia`, com zero erro de página.
  **Controle negativo:** `git stash push -- src/lib/ficha-engine.ts`, `astro build`, mesmo teste. O
  Artefato veio vazio e a ficha salva continuou com `reliquia` órfã. Depois, `stash pop`, com o md5
  do arquivo igual ao de antes.
- As 9 linhas novas da migração deslocaram 3 citações de `ficha-engine.ts` nas pendências K e L;
  `reapontar.mjs` as moveu, e os dois arquivos estavam limpos antes.

## 1 · Os JSONs novos

Copiados por `../tmp/executora/copiar-economia.mjs`, que aplica só as transformações declaradas e tem
um `--check` que refaz a cópia a partir da fonte e exige o mesmo texto:

| arquivo em `src/data` | o que mudou em relação à v2 |
|---|---|
| `mercadorias.json` (193) | envelope `{_nota, itens}`; `_nota` nova |
| `montarias-veiculos.json` (44) | envelope; `_nota` nova; o `_procedencia` de cada item saiu (F4) |
| `servicos.json` | `_nota` nova |
| `pacotes-equipamento.json` | `_nota` nova |
| `renda.json` | `_nota` nova, com a curva D da F6, palavra por palavra |
| `custo-de-vida.json` | `_nota` nova |
| `viagens.json` | `_nota` nova |

- **F5, o envelope.** `mercadorias` e `montarias-veiculos` são arrays na v2, e um array não tem onde
  levar `_nota`. Perguntei ao Arquiteto e segui com o envelope `{_nota, itens}`, que o usuário prefere.
  Sem resposta até o fim da rodada. Toda `_nota` diz: "Saída do modelo em lore/economia/v2/gerar.py:
  não edite preço à mão aqui; mude o modelo e gere de novo."
- **F6, conferida antes de escrever.** Os `livre_semana` do `renda.json` seguem mesmo a curva D
  (12% × (60/R)^0,35, arredondado) nas 9 faixas: 7,2 → 7, 10,0 → 10 ... 200,2 → 200. Pela curva velha
  seriam 12, 18 ... 719.
- **F1, os esquemas** (`scripts/validate-data.mjs`, bloco "A ECONOMIA MUNDANA"): um `.strict()` por
  arquivo, preço sempre `{pc}`, peso nulo aceito (o `oficina-armeiro` de mercadorias) e ausente nos
  animais. Depois vem a conta dos pacotes: todo id existe em `mercadorias.json`, e `total_pc` é a
  soma dos itens (os 7 batem).
  **Controle negativo:** enxertei um `_procedencia`, um id de pacote falso e um total errado. Deu
  "Unrecognized key(s) in object: '_procedencia'", "pacote Artista cita "mochila-x"" e "diz total_pc
  999, a soma dos itens dá 472". Arquivos restaurados e conferidos pelo `--check`.
- **F4, a procedência: NÃO commitada, esperando a resposta do Arquiteto** (ver PRECISA DE MIM 1).
  `mercadorias.procedencia.json` (cópia da v2) e `montarias.procedencia.json` (os 44 `_procedencia`
  tirados, com o id) estão em `../tmp/executora/procedencia/`. A `_nota` das montarias não cita
  caminho ("fica fora do site, com o modelo") até isso se decidir.
- **Item 9:** conferi antes de apagar o `precos.json`. Só `scripts/precos.mjs` e
  `scripts/gen-lista-equip.mjs` o liam; procurei em `src`, `scripts`, `.github`, `package.json` e
  `astro.config.mjs`, e o `content.config.ts` não tem coleção sobre ele. A menção do capítulo
  (`:357` antigo) saiu com a seção.
- **Item 11:** nenhuma mudança de preço em armas e armaduras além do B8.

## 2 · Os scripts, e o `precos.json` aposentado

- `scripts/precos.mjs` e `scripts/gen-lista-equip.mjs` passaram a ler `mercadorias.json` e
  `pacotes-equipamento.json`, e os dois rodam: os 7 totais saem da soma, iguais aos da v2 §7. O
  segundo escreve em `D&D/armas&armaduras/lista-itens.md`, que o `.gitignore:48` cobre.
- O `npm run build` montou o site antes de o `precos.json` sair, e só então ele foi apagado (`3ee18df`).
- De passagem: o `precos.mjs` imprimia um travessão no total do pacote; virou ponto-médio.

## 3 · O gerador

`scripts/gen-cap-economia.mjs` (novo) reescreve 12 blocos entre marcadores `<!-- gen:economia-* -->`
em `custo-de-servico-e-itens.md`: renda, custo-de-vida, pacote-familia, tarifas, servicos, aulas,
criados, escravos, mercadorias, montarias, viagens, pacotes. O `--check` entrou no `npm run validate`,
logo depois do `gen-cap-itens.mjs`. Moeda: a maior moeda exata, e acima de 1 po sem moeda exata a
forma mista ("13 po 4 pp 5 pc"); fração de cobre com vírgula (as tarifas por hora).

## 4 · O texto dos capítulos

**a) Excepcional → Excelente, só no grau** (`f9709bc`): `acoes-oficio-e-mundo.md:74, 85, 96, 98,
113`; `Acoes_Sistema.md:1126, 1130, 1147, 1152, 1174`; `acoes-e-sistema.md:46`. Conferi cada linha
antes de trocar. Intactos, por serem o degrau 25: `acoes-e-sistema.md:24`,
`coracao-do-sistema.md:71`, `virtude-jogada.md:40`, `Acoes_Sistema.md:68, 529, 545`. A
custo-de-servico-e-itens.md:63-74 não tinha "Excepcional": era outra régua (Péssimo, Ruim, ...,
Relíquia), e foi reescrita inteira (item d).

**b) Reparo** (`acoes-oficio-e-mundo.md:193`): "A Montagem se paga igual" saiu. Entrou a regra da v2
§8: leve sem Montagem e um quarto da Peça, no campo; pesado com metade da Montagem e metade da Peça,
em oficina; arruinada inteira. Por encomenda: ~1/10, 1/3 e 2/3 mais o material que faltar.

**c) Carroça** (`acoes-oficio-e-mundo.md:162`, na escala de dias: Carpintaria, Req 3, Dif 7, Mont 4,
Peça 20, 6,3 dias). O barco de pesca ficou sozinho na escala de semanas (`:174`). Os preços da
calibração (267 avulso, 238 em lote de três, 300 no catálogo, 1,12×; barco ~1.600) estão num
parágrafo logo abaixo da tabela de semanas (`:179`), porque as tabelas de ofício não têm coluna de
preço.

**d) Qualidade** (`custo-de-servico-e-itens.md:324-396`):
- a tabela Sucata ⅙×, Tosca ⅓×, Comum, Boa 5×, Ótima 30×, Excelente 70×, com a coluna Pontos de −2 a
  +3, que é o "+1 num número da peça por grau" de `acoes-oficio-e-mundo.md:83`;
- a Relíquia como rótulo, com piso de 100×;
- o Requisito máximo 6;
- o exemplo do Machado.
O degrau "a cada dois graus" (`acoes-oficio-e-mundo.md:81`) não mudou.
**E mudei o que contradizia a régua nova:**
- `acoes-oficio-e-mundo.md:82` dizia "Preço **dobra** / cai pela metade". Agora diz o preço fixo
  por grau, com link para a tabela.
- `:78` ganhou o Requisito máximo 6.
Sem isso, o livro teria duas regras de preço de qualidade. A v2 §9.3 lista as duas linhas
(`acoes-oficio-e-mundo.md:78-83`).
**O Machado seguiu a v2, e não o `estado-revisao.md:993`.** O estado-revisao dá "Boa 6 po, Ótima 15
po, Excelente 36 po pela base 3 po". A v2 §1, leitura 5, dá 15, 90 e 210 po, e 300 para a Relíquia.
Com os multiplicadores que as duas fontes aceitam (5×, 30×, 70×, 100×) sobre 3 po, a conta dá a v2,
e o despacho 4d aponta para ela. Avisei o Arquiteto na hora.

**e) "rendem o mesmo":** a frase não existe no livro (procurei em `src/content` e no
`Acoes_Sistema.md`). Nada escrito sobre fabricar contra alugar.

**As seções novas, e onde entraram** (todas em `custo-de-servico-e-itens.md`, que já era a página do
dinheiro):
- depois de Moedas: **Renda** (`:33`), com **Dias de trabalho** (`:61`, v2 §4) e **Semanas de
  aventura** (`:65`, v2 §10);
- **Custo de Vida** (`:74`), com o custo da casa por faixa;
- **Serviços** (`:120`), com o soldo por dia corrido e a nota da cura barata (v2 §6) e **Aulas**
  (`:259`);
- **Servos & Escravos** (`:283`), com o aviso de Cenário que já existia;
- na Qualidade, **Revenda** (v2 §2);
- depois do Catálogo de Equipamento: **Mercadorias** (`:499`), **Montarias, Veículos & Animais**
  (`:808`), **Viagens** (`:896`) e **Pacotes de Equipamento** (`:941`);
- na abertura (`:8`), uma frase do escopo mundano (v2 §0, nova 3).
Saíram as tabelas à mão de Hospedagem & Comida, Roupas, Itens Gerais e Equipamento de Aventura.

**Cura acelerada** (`vida-ferimentos-cura.md:90`, onde o livro já dizia "a perícia Cura e a magia
aceleram a recuperação"): "cada nível de Cura de quem cuida a acelera em 10%, e os 50% exigem Cura
5". A mecânica de `acelerar-a-cura` no Grid é da Arte, e não da Habilidade, então não conflita.

**Itens do livro velho sem par nos JSONs novos** (saíram com as tabelas à mão, e nenhum foi
reprecificado por mim):
- prata e ouro por 100 g (metais preciosos são a G48, aberta);
- drogas por dose (barata e cara);
- a estalagem por noite e a refeição por nível (a estalagem agora é por semana, por nível de vida);
- a "cerveja ótima";
- a viagem "Municipal (por milha)", que a G56 tirou.

**Prova no gerado** (`npm run build` verde, `dist/` das 22:11). Em
`dist/regras/custo-de-servico-e-itens/index.html`:
- "Nobreza" na Renda, "Trigo", "Artista (5 po 7 pp 2 pc)", "Excelente · 70×", "Relíquia não é grau",
  "Revenda", "Semanas de aventura", "Galera de guerra", "Mensageiro com troca de cavalos",
  "Companhia (concubina)";
- zero "precos.json" e zero "Hospedagem".
Nos outros capítulos: "6,3 dias" três vezes em `acoes-oficio-e-mundo`, a Cura acelerada em
`vida-ferimentos-cura` e "Excelente" em `acoes-e-sistema`.

**Travessão**, contado por arquivo com Python, antes e depois: nenhum a mais em arquivo nenhum
(`precos.mjs` foi de 1 para 0).

## 5 · Pendências (`docs/pendencias/G-acoes-sistema.md`, `Pendencias.md` regerado: 230 → 221 abertos)

- **Fechadas, com arquivo:linha e sha:** G52 (Renda), G54 (B8), G55 (Montarias), G56 (Viagens), G57
  (Servos), G58 (Qualidade, pela v2 §1; o registro dizia que o degrau saía, e ele FICA, como a v2 e
  o despacho dizem), G59 (Rações), G62 (Mercadorias), G65 (Custo de vida).
- **Anotadas "em parte", abertas, com o que falta:**
  - G47: as linhas de fabricação do sapato e do cadeado;
  - G53: o mapa de faixas no Recursos de `antecedentes.md`;
  - G60: o salto entre degraus, a G46;
  - G63: `acoes-oficio-e-mundo.md:206` e a jornada por ofício;
  - G66: o Séquito sem custo;
  - G67: o desgaste por marcas.
- **Abertas, sem toque:** G48 a G51 (moeda e metais; ×20, curva e tetos em
  `acoes-oficio-e-mundo.md:206`), G61 (munição: não há Flechas rústicas em `municao.json`), G64 (B7,
  como o despacho manda), G68 (o empréstimo de XP; a seção Aulas diz que a regra ainda não está no
  livro), G69 (o pacote inicial) e G70 (os arquivos: só fecha com a F4).
- **As quatro "novas" do despacho** (Artefato, revenda, escopo mundano, semanas de aventura) **não
  estão registradas** em nenhum `docs/pendencias/*.md`: não havia o que marcar. As quatro foram
  aplicadas: `a58e6f4`; `custo-de-servico-e-itens.md:345`; `:8`; `:65`.
- Ficaram abertas, como o despacho pede: a frase "fabricar e alugar rendem o mesmo" (não entrou em
  lugar nenhum), o modificador regional, o impacto do Livre baixo e o B7.

## PRECISA DE MIM

1. **F4: onde moram as duas procedências.** Estão em `../tmp/executora/procedencia/`. Commitá-las em
   `lore/economia/` versiona parte da pasta que a D10 deixou para decidir depois. Perguntei com três
   saídas (commitar lá, deixar fora, ou esperar a pasta inteira entrar no git). A G70 fecha junto.
2. **F5: o envelope `{_nota, itens}`** entrou sem resposta sua. Se a decisão for outra, a troca é
   pequena: o `copiar-economia.mjs`, o esquema e três leitores (`gen-cap-economia.mjs`, `precos.mjs`,
   `gen-lista-equip.mjs`).
3. **Duas frases que a v2 pede ao livro e que não estão na lista final:** "fabricar para si vale
   muito" (v2 §1, leitura 4) e "a Placa Ótima só existe como obra de Centelha" (leitura 3). Não
   escrevi.
4. **A regra do pacote inicial** (v2 §7: um pacote de graça, e o Diplomata exige Recursos 3, mais 4
   semanas de Livre) está só na `_nota` de `pacotes-equipamento.json`, e não no livro (G69).

## QUEBROU

Nada.

## BLOQUEADO

A F4 (item 1 acima), e com ela a G70.
