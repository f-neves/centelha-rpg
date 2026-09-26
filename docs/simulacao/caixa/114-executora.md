# Rodada 114 · Executora · tudo em pc, Recursos 0 a 6, imprevistos, Livre nos serviços, cinco páginas, e as sugestões do Comerciante

- **Despacho:** `docs/simulacao/caixa/114-despacho.md` (`54510af`). O texto dos blocos 1a a 1f
  faltava, eu perguntei, e o Arquiteto acrescentou em `61c1a84`.
- **Árvore:** branch `executora`, posta em `54510af` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-114.md`, com as horas lidas da máquina.
- **Publicado:** `c1ce3ee` (tarefas 2 a 5) e `90ad9f0` (tarefa 1). Este relato vai num terceiro
  commit.
- **Não toquei `lore/economia/estado-revisao.md`.** Li duas seções dele (as de Artes/Magia e de
  Item encantado), só para citar nas pendências novas, como o despacho pede.

## Tarefa 1 · as sugestões do Comerciante, só registradas

O texto de cada bloco foi **copiado do Apêndice do despacho por script, sem alteração**
(`../tmp/executora/pend114.py`, que lê o despacho e cola as linhas `>`). O rótulo em cada um é:
"Sugestão do Comerciante, não aprovada (registrada na rodada 114, texto dele sem alteração)".

| bloco | onde entrou | como |
|---|---|---|
| 1a · desgaste e manutenção | **G67** (`docs/pendencias/G-acoes-sistema.md`) | sub-item; o veredito e o "Falta" da G67 não mudaram |
| 1b · Cura sem número fora do combate | **A28, nova** (`docs/pendencias/A-arcano-artes.md`) | cita `src/data/artes.json:744-826` (a Cura, conferido) e a D6, "3. Artes/Magia", como leitura |
| 1c · Proeza na Longa | **G15** | sub-item |
| 1d · primeira frase ("Serviço mágico = ...") | **A4** (Rituais) | sub-item, como o Apêndice manda |
| 1d · segunda frase ("Raridade por lugar ...") | **A29, nova** | cita a ausência de "mágic", "encant" e "Artefato" com preço nas páginas de custo (conferi: zero nas cinco), e a D6, "5. Item encantado e Artefato" |
| 1e · empréstimo de XP | **G68** | sub-item, com o que é **novo em relação à G44** (abaixo) |
| 1f · comércio e modificador regional | **G71, nova** | cita a frase da abertura do capítulo (`custo-de-servico-e-itens.md:8`) e a Revenda |

- **1e contra a G44.** A G44 já decidiu: um ponto por vez, professor com um ponto acima, o Mestre
  julga, o preço é o tempo vezes o salário do professor, e metade do XP vai para a dívida. **Novo
  no bloco:**
  - o tempo da aula, custo em XP ÷ 2, em jornadas, que responde ao "quanto tempo" que a G44 deixa
    aberto;
  - o preço pela diária **avulsa**;
  - a dívida que some no fim da campanha;
  - o mentor que ensina de graça e mantém a dívida;
  - a aula em grupo (até 4, por 1,5×).
  O mentor e o grupo **não aparecem na G44**, e ficaram registrados como proposta nova. O documento
  §E3, que a G68 cita, já trazia os mesmos pontos, e isso está escrito no sub-item.
- **Um detalhe do 1d:** o corpo do despacho dizia "Mana → A4, preço de item mágico e raridade →
  nova", e o Apêndice dizia "primeira frase → A4, segunda → nova". Segui o Apêndice. A primeira
  frase (serviço mágico pela tabela × tempo, mais Mana) foi para a A4, e a A29 recebeu só a da
  raridade. O título da A29 cobre os dois assuntos.
- `Pendencias.md` regerado: 220 → **223** abertos (A28, A29, G71). As 7 anomalias do gerador já
  existiam.

## Tarefa 2 · tudo em pc

- **As tabelas:** o `gen-cap-economia.mjs` e o `gen-cap-itens.mjs` escrevem **só pc, com ponto de
  milhar** ("10.000 pc"); a forma mista (po/pp/pc) saiu. A tabela de Moedas & Conversão ficou como
  estava. Os totais dos pacotes também: "Artista (572 pc)".
- **A ordenação das tabelas** (`src/pages/regras/[slug].astro`) lia "3.600 pc" como 3,6. Agora ela
  entende o ponto entre grupos de três dígitos como milhar.
- **Texto corrido em po/pp** (procurei nos capítulos, no `Acoes_Sistema.md`, nos JSONs de
  `src/data`, nas páginas `.astro` e nos `.md` da raiz; o `Acoes_Sistema.md` não tinha nenhum):

| onde (antes) | antes | depois |
|---|---|---|
| `custo-de-servico-e-itens.md:258` (hoje em `custo-servicos.md`, o soldo) | "o arqueiro a 2 pp por dia recebe 16 pp ... contra 13 pp do artesão oficial" | "20 pc ... 160 pc ... 130 pc" |
| `custo-de-servico-e-itens.md:397` (hoje em `custo-qualidade-e-equipamento.md:84`, o Machado) | "base 3 po ... Tosco até 1 po; Bom 15 po; Ótimo 90 po; Excelente 210 po; Relíquia a partir de 300 po" | "base 300 pc ... 100 pc; 1.500 pc; 9.000 pc; 21.000 pc; 30.000 pc" |
| `custo-de-servico-e-itens.md:401` (o catálogo) | "a conversão entre moedas é respeitada (2 po &gt; 15 pp)" | a frase saiu: "Clique no cabeçalho Preço para ordenar." |

- **O arredondamento, na fonte** (`lore/economia/v2`): `inteiro()` novo em `base.py`, meio para
  cima, ao lado do `arred` de degraus, que ficou só para preço de loja.
  - É inteiro: a tabela de perfis (semana, contrato, avulsa, horas, Livre), os criados (salário e
    custo), a manutenção do cavalo (41,6 → 42), o sustento do escravo (14,5 → 15), as aulas e os
    **serviços que saem da tabela de perfis**.
  - **O Livre das faixas de Recursos ficou no `arred`.** O despacho lista "Livre" entre as taxas
    inteiras, mas os 9 Livre/Ano esperados na 3.6 só batem com o Livre de hoje. O Doutor tem 39,4 de
    Livre: pelo `arred` dá 40, e 40 × 36 = 1.440, o esperado; inteiro daria 39, e 39 × 36 = 1.404. O
    Aristocrata tem 113,9: dá 110 pelo `arred` e 3.080, contra 114 inteiro e 3.192. Li o "Livre" da
    2.4a como o Livre da tabela de perfis (a coluna nova da 4.3), que é inteiro. **Com isso as duas
    listas do despacho batem.**
- **Os serviços que mudaram de valor** (pela regra 2.4c; nenhum outro mudou):
  - artesão avulso 35 → 33; perito 85 → 83; mestre 170 → 168;
  - guia local 35 → 33; guia de expedição 45 → 43;
  - parteira 35 → 33; menestrel de taverna 35 → 33; menestrel de corte 110 → 108;
  - adestrar cavalo para sela 1.000 → **1.056**; adestrar cavalo de guerra 8.000 → **7.920**.
  Também as aulas, que são jornadas × diária avulsa: 130 → 132, 330 → 325, 500 → 498, 990 → 1.001,
  160 → 163, 1.000 → 1.038, 2.100 → 2.145, 500 → 498 (o Atributo 3 ficou em 650).
  **O adestrar e as aulas mudam por consequência da regra, e não por pedido direto.** Se o autor
  preferir o `arred` nesses, é uma linha no `gerar.py`. A página iluminada (2 h de oficial,
  calculada à mão no `gerar.py`) não usa a tabela de perfis, e ficou no `arred`.
- **Nenhuma vírgula em pc:** varri o `dist/` das cinco páginas do capítulo e do Ofício e Mundo
  atrás de "número,número pc". **Zero** em todas.

## Tarefa 3 · Recursos 0 a 6, e a tabela de Renda

- **Fonte:** `modelo.py`, só a Nobreza passou de 5 para **6**. O resto do mapa já era o pedido.
- **Recursos 0:** a frase do despacho está acima da tabela (`custo-de-servico-e-itens.md:35`), como
  prosa.
- **Conferido, sem alterar:**
  - custo de Recursos 6 em XP: `criacao-de-personagem.md:52`, "novo × 3 · ... 5→6 = 18";
  - teto na criação: o mesmo `:52` ("teto **3** na criação em Recursos e Artefato") e
    `antecedentes.md:315`;
  - o verbete de Recursos (`antecedentes.md:92-105`) já tem os seis níveis;
  - a ficha desenha os Únicos com 6 bolinhas (`ficha-engine.ts:2410`, `dotsHTML('ante', ..., 6)`).
  **Não achei nenhum texto dizendo que Recursos vai só até 5.**
- **Colunas:** ficaram Recursos, Faixa, Renda/Sem, Custo/Sem, Livre/Sem e Livre/Ano. Saíram Nível de
  vida, Renda/Mês e Livre/Mês.
- **Imprevistos:** o texto do despacho está logo abaixo da tabela. **O Livre/Ano é calculado na
  fonte** (`modelo.py`, `livre_ano = livre × (48 − 4 × Recursos)`), e não no gerador. O motivo: o
  número é dado do `renda.json`, e quem ler o JSON sem o capítulo tem de receber o valor certo.
  O Livre/Mês continua no JSON como Livre × 4, sem o desconto, porque o imprevisto é por estação;
  ele não aparece mais na tabela.
- **Os 9 Livre/Ano, esperado contra calculado** (o calculado é Livre/Sem × (48 − 4 × Recursos), lido
  no `dist/`):

| faixa | Recursos | Livre/Sem | esperado | calculado |
|---|:---:|:---:|:---:|:---:|
| Braçal | 1 | 7 | 308 | 308 |
| Destreinado | 1 | 10 | 440 | 440 |
| Treinado | 2 | 19 | 760 | 760 |
| Especialista | 3 | 30 | 1.080 | 1.080 |
| Doutor | 3 | 40 | 1.440 | 1.440 |
| Abastado | 4 | 55 | 1.760 | 1.760 |
| Rico | 4 | 85 | 2.720 | 2.720 |
| Aristocrata | 5 | 110 | 3.080 | 3.080 |
| Nobreza | 6 | 200 | 4.800 | 4.800 |

**A tabela de Renda, antes e depois** (antes: o bloco gerado em `54510af`; depois: lida no
`dist/regras/custo-de-servico-e-itens/index.html`):

| faixa | antes (Renda/Sem · Livre/Sem · Livre/Ano · Custo/Sem) | depois (Renda/Sem · Custo/Sem · Livre/Sem · Livre/Ano) |
|---|---|---|
| Braçal ● | 6 pp · 7 pc · 3 po 3 pp 6 pc · 53 pc | 60 pc · 53 pc · 7 pc · 308 pc |
| Destreinado ● | 1 po · 1 pp · 4 po 8 pp · 9 pp | 100 pc · 90 pc · 10 pc · 440 pc |
| Treinado ●● | 2 po 7 pp · 19 pc · 9 po 1 pp 2 pc · 2 po 5 pp 1 pc | 270 pc · 251 pc · 19 pc · 760 pc |
| Especialista ●●● | 5 po 5 pp · 3 pp · 14 po 4 pp · 5 po 2 pp | 550 pc · 520 pc · 30 pc · 1.080 pc |
| Doutor ●●● | 8 po 2 pp · 4 pp · 19 po 2 pp · 7 po 8 pp | 820 pc · 780 pc · 40 pc · 1.440 pc |
| Abastado ●●●● | 14 po · 55 pc · 26 po 4 pp · 13 po 4 pp 5 pc | 1.400 pc · 1.345 pc · 55 pc · 1.760 pc |
| Rico ●●●● | 27 po · 85 pc · 40 po 8 pp · 26 po 1 pp 5 pc | 2.700 pc · 2.615 pc · 85 pc · 2.720 pc |
| Aristocrata ●●●●● | 42 po · 1 po 1 pp · 52 po 8 pp · 40 po 9 pp | 4.200 pc · 4.090 pc · 110 pc · 3.080 pc |
| Nobreza ●●●●● → **●●●●●●** | 100 po · 2 po · 96 po · 98 po | 10.000 pc · 9.800 pc · 200 pc · 4.800 pc |

## Tarefa 4 · a tabela de serviços por perfil (hoje em `custo-servicos.md`)

- **A semana pelo valor do livro:** `arred(renda_ficha(soma))`, a mesma curva arredondada do
  `renda.json` (`curva_por_soma`). Deu direto 60, 100, 130, **200**, 260, 330, 430, 570 e 670, sem
  valor próprio documentado.
  **A soma 7 é linha nova. O nome é meu: "Oficial experiente (soma 7)".** A lista de perfis não
  tinha nome para ela, e "Oficial" e "Profissional" já nomeiam a 6 e a 8.
- **Contrato = semana ÷ 6, avulsa = semana ÷ 4, hora = avulsa ÷ jornada**, tudo inteiro meio para
  cima. **A hora sai da avulsa exata, e não da arredondada.** O Oficial mostra por quê: avulsa 32,5 ÷
  6 = 5,4, que dá 5, o esperado. Partindo do 33 arredondado, daria 5,5 e sairia 6. Os 15 do
  despacho:

| soma | coluna | esperado | calculado |
|:---:|---|:---:|:---:|
| 6 | contrato · avulso · hora leve · artesão · braçal | 22 · 33 · 5 · 4 · 3 | 22 · 33 · 5 · 4 · 3 |
| 9 | idem | 55 · 83 · 14 · 10 · 8 | 55 · 83 · 14 · 10 · 8 |
| 12 | idem | 112 · 168 · 28 · 21 · 17 | 112 · 168 · 28 · 21 · 17 |

- **Livre/Sem**, a coluna nova: `semana × 0,12 × (60 ÷ semana)^k`, inteiro, com o `livre_frac` do
  modelo (k = 0,3502, a curva D que vai de 12% a 2%; com 0,35 cravado dá os mesmos inteiros). Os 9,
  esperado contra calculado, das somas 4 a 12: 7/7, 10/10, 12/12, 16/16, 19/19, 22/22, 26/26,
  31/31, 35/35.
- **O texto do despacho** está acima da tabela. Não escrevi nada sobre somar com Recursos.

**A tabela de perfis, antes e depois** (depois lido no `dist/regras/custo-servicos/index.html`):

| perfil | antes (Renda · contrato · avulsa · h leve · h artesão · h braçal) | depois (Renda · **Livre** · contrato · avulsa · h leve · h artesão · h braçal) |
|---|---|---|
| Braçal 4 | 6 pp · 1 pp · 15 · 2,5 · 1,9 · 1,5 | 60 · 7 · 10 · 15 · 3 · 2 · 2 |
| Destreinado 5 | 1 po · 16,7 · 25 · 4,2 · 3,1 · 2,5 | 100 · 10 · 17 · 25 · 4 · 3 · 3 |
| Oficial 6 | 1 po 3 pp · 21,7 · 32,5 · 5,4 · 4,1 · 3,2 | 130 · 12 · 22 · 33 · 5 · 4 · 3 |
| **Oficial experiente 7** | (não havia) | 200 · 16 · 33 · 50 · 8 · 6 · 5 |
| Profissional 8 | 2 po 6 pp · 43,3 · 65 · 10,8 · 8,1 · 6,5 | 260 · 19 · 43 · 65 · 11 · 8 · 7 |
| Perito 9 | 334,3 · 55,7 · 83,6 · 13,9 · 10,4 · 8,4 | 330 · 22 · 55 · 83 · 14 · 10 · 8 |
| Especialista 10 | 434,6 · 72,4 · 108,6 · 18,1 · 13,6 · 10,9 | 430 · 26 · 72 · 108 · 18 · 13 · 11 |
| Especialista 11 | 568,3 · 94,7 · 142,1 · 23,7 · 17,8 · 14,2 | 570 · 31 · 95 · 143 · 24 · 18 · 14 |
| Mestre 12 | 668,6 · 111,4 · 167,1 · 27,9 · 20,9 · 16,7 | 670 · 35 · 112 · 168 · 28 · 21 · 17 |

(Os números sem unidade são pc; na página, cada célula sai "N pc".)

## Tarefa 5 · o capítulo XIV em cinco páginas

**O mapa, seção → página** (`src/content/chapters/`, todas com `numeral: "XIV"`):

| página (ordem) | título | seções |
|---|---|---|
| `custo-de-servico-e-itens.md` (20) | Moeda, Renda e Custo de Vida | Moedas & Conversão; Renda (com Dias de trabalho e Semanas de aventura); Custo de Vida (com O custo da casa) |
| `custo-servicos.md` (21) | Serviços e Contratação | Serviços (com Aulas); Servos & Escravos |
| `custo-mercadorias.md` (22) | Mercadorias | Mercadorias; **Pacotes de Equipamento** |
| `custo-qualidade-e-equipamento.md` (23) | Qualidade e Equipamento | Qualidade de Itens; **Catálogo de Equipamento** |
| `custo-montarias-e-viagens.md` (24) | Montarias, Veículos e Viagens | Montarias, Veículos & Animais; Viagens |

- **As duas sem casa óbvia:**
  - **Pacotes → Mercadorias**, porque o pacote é a soma de itens de `mercadorias.json`, e o texto
    dele diz "(em Mercadorias, acima)".
  - **Catálogo → Qualidade e Equipamento**, porque a qualidade multiplica o preço base do catálogo
    (o exemplo do Machado parte da peça Comum do catálogo). A página 4 por isso **não se chama só
    "Qualidade e Reparo"**. O reparo mora em Ofício e Mundo, e a página só aponta para ele, na
    abertura.
  - O aviso "Provisório" (nomes e preços de armaduras) foi junto com o catálogo, para a página 4.
- **O padrão do VIII:**
  - a primeira página é a entrada, mantém o slug antigo e abre o parágrafo que apresenta as cinco;
  - as outras quatro abrem com `<p class="muted">Parte do capítulo <strong>Custo de Serviço &amp;
    Itens</strong>...`, apontando para a primeira;
  - o `src/lib/site.ts` tem o `sub` com as cinco (`:48-59`).
  - O `ordem` é inteiro e único, e 21 a 23 estavam livres, mas o 24 não. Por isso
    `criacao-de-personagem`, `qual-sistema` e `folego` andaram uma ordem (25, 26 e 27).
- **O arquivo antigo** é a primeira página, com o mesmo slug, como o `acoes-e-sistema` no VIII.
  Todo link antigo cai na entrada do capítulo.
- **Os geradores:**
  - `gen-cap-economia.mjs` tem um mapa `ONDE` (bloco → página), e falha se um bloco ficar sem
    página;
  - `gen-cap-itens.mjs` escreve na página 4.
- **Âncoras e links:**
  - `acoes-oficio-e-mundo.md:254` (#semanas-de-aventura) continua certo, porque a seção ficou na
    primeira página, e a âncora resolve;
  - `acoes-oficio-e-mundo.md:82` (Qualidade de Itens) passou a apontar para
    `custo-qualidade-e-equipamento`;
  - `acoes-oficio-e-mundo.md:273` ("Preços e disponibilidade") segue na entrada;
  - nenhum outro link por âncora em `src`, `scripts` e `src/data`.
- **Citações `arquivo:linha`:** o `reapontar.mjs` não moveu nenhuma, e era esperado: o conteúdo
  mudou de arquivo. **Reapontei à mão, achando o conteúdo por script (`../tmp/executora/cita114.py`),
  as 13 citações das NOTAS DE APLICAÇÃO da 110** em `docs/pendencias/G-acoes-sistema.md` (G47, G52,
  G53, G55, G56, G57, G58, G59, G62, G63, G65, G66). Elas dizem onde o conteúdo está hoje, e agora
  apontam para a página nova e para a linha de agora.
  **As citações de "Registro original" e dos itens anteriores à 110 ficaram** (G22 a G46, e as
  partes "Afeta ..."). Elas descrevem a página como era quando foram escritas, e o conteúdo delas
  não existe mais em lugar nenhum; trocar o nome do arquivo apontaria para uma linha que nunca teve
  aquilo.
- **Busca:** o `pagefind` tem **111 páginas** (eram 107). Descompactei os fragmentos do índice, e
  as cinco estão lá: `/regras/custo-de-servico-e-itens/`, `custo-servicos`, `custo-mercadorias`,
  `custo-qualidade-e-equipamento` e `custo-montarias-e-viagens`, cada uma com o seu título.
- **No `dist/`:**
  - as cinco páginas existem;
  - as quatro que não são a primeira têm o "Parte do capítulo" (a primeira não tem);
  - a barra lateral de cada uma lista as cinco (5 links `custo-*` distintos em cada página).

## Verificação

- `npm run validate` e `npm run build` verdes, e o gancho nos dois commits.
- O `copiar-economia.mjs --check` (no `validate`) confirma que os JSONs de `src/data` são os que o
  modelo gera. Nenhum JSON foi editado à mão: `servicos.json`, `renda.json` e `custo-de-vida.json`
  mudaram só pelo `gerar.py`.
- Travessão: zero nas linhas novas, contado por arquivo com Python, antes e depois.

## Para a Leitora-novata

Depois deste relato, peço a ela que leia a página de Renda (`/regras/custo-de-servico-e-itens`) e a
de Serviços (`/regras/custo-servicos`) e diga, com as próprias palavras, o que um personagem recebe
quando trabalha uma semana.

## PRECISA DE MIM

1. **O nome "Oficial experiente (soma 7)"** é meu.
2. **O "Livre" da 2.4a lido como o Livre dos perfis**, e não o das faixas, para as duas listas de
   conferência do despacho baterem (Tarefa 2).
3. **O adestrar cavalo e as aulas mudaram por consequência da regra 2.4c**, e não por pedido direto
   (1.000 → 1.056, 8.000 → 7.920, e as aulas). Se o autor quiser o `arred` nesses, é uma linha no
   `gerar.py`.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
