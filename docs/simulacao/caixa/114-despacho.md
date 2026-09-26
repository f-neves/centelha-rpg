# Rodada 114 · despacho · tudo em pc, Recursos 0-6, imprevistos, Livre na tabela de serviços, divisão da página de custos, e registro de sugestões do Comerciante

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 26/09/2026

Liberado pelo humano em 26/09/2026, repassando uma proposta do Comerciante (outra frente, sessão
separada). Cinco tarefas independentes; a ordem abaixo é a de execução (1 é só registro, sem
implementar nada; 2-4 mexem em número; 5 mexe em arquivo). Pino: `8e383ee`.

## 0 · Onde

Mesma árvore/branch. `git status --short` vazio, `git fetch origin`, `git merge-base
--is-ancestor executora origin/main`, `git switch -C executora origin/main`. Saída temporária em
`../tmp/executora/`.

## Regras gerais desta rodada

1. **Os JSONs de economia são gerados por `lore/economia/v2/gerar.py` (e `modelo.py`).** Toda
   mudança de número vai na fonte (Python) e depois `python3 gerar.py` + `node
   scripts/copiar-economia.mjs`. **Não edite JSON de `src/data/` à mão.** O `--check` do
   `copiar-economia.mjs` (no `npm run validate`) acusa se sair de sincronia.
2. Sem travessão (—) em nenhum texto novo.
3. **Não mexa em `lore/economia/estado-revisao.md`.** Só o Comerciante (ou o autor) commita esse
   arquivo; é o documento de outra frente.
4. No fim: `npm run validate` e `npm run build` verdes; relate o antes/depois de cada tabela
   alterada (célula lida no `dist/`, não só "mudei"); a Revisora confere; a Leitora-novata lê a
   página nova de Renda e a de Serviços e diz, com as próprias palavras, o que o personagem
   recebe quando trabalha uma semana.

## 1 · Registrar sugestões nas pendências (NÃO IMPLEMENTAR NADA DISTO)

**O texto de cada bloco (1a a 1f) está no Apêndice, ao final deste despacho.** Copie o texto de
lá para o endereço indicado abaixo; não escreva a sugestão com suas próprias palavras, e não
resuma: é para entrar como o Comerciante escreveu. Cada bloco é uma sugestão dele, "não
aprovada". **Antes de criar pendência nova, verifiquei onde cada uma já tem endereço** (pesquisa
feita agora, na árvore em `8e383ee`); confirme os números de linha na sua árvore (podem ter
andado) e siga esta lista, não crie duplicata:

- **1a (desgaste e manutenção)** pertence à **G67**
  (`docs/pendencias/G-acoes-sistema.md:145`, "Reparo e desgaste... **Falta:** o desgaste opcional
  por marcas, em `armas-e-armaduras.md`"). **Acrescente o bloco 1a inteiro como um sub-item da
  G67**, rotulado "Sugestão do Comerciante, não aprovada", sem mudar o veredito da G67 nem seu
  "Falta".
- **1b (Cura sem número fora do combate)**: não achei pendência com esse endereço exato (a G15 e
  a A25 tocam Artes, mas não a Cura mundana). **Crie uma pendência NOVA em
  `docs/pendencias/A-arcano-artes.md`** (próxima letra livre da família A), com o bloco 1b,
  citando `artes.json:744-826` (Cura) e o achado da rodada D6 do Revisor externo
  (`lore/economia/estado-revisao.md`, "Artes/Magia", já commitado, só leitura, não cite como se
  fosse decisão).
- **1c** pertence à **G15** (`docs/pendencias/G-acoes-sistema.md:147`, "Como o bônus fixo de
  Proeza entra na Longa"). **Acrescente o bloco 1c como sub-item da G15**, mesma etiqueta.
- **1d** tem duas partes:
  - a parte de Mana em ação Longa toca a **A4** (`docs/pendencias/A-arcano-artes.md:23`,
    Rituais). Acrescente como sub-item, sem fechar a A4.
  - a parte de preço de serviço/item mágico e raridade por lugar não tem endereço hoje. **Crie
    pendência NOVA em `docs/pendencias/A-arcano-artes.md`** (outra letra nova, diferente da 1b),
    citando a ausência que a D6 já mediu (`custo-de-servico-e-itens.md` não cita "mágic",
    "encant" nem "Artefato" com preço nenhum).
- **1e (Empréstimo de XP)**: **já existe design quase igual, decidido em parte.** A **G44**
  (`docs/pendencias/G-acoes-sistema.md:340`) tem o desenho geral aprovado pelo autor (um ponto por
  vez, professor 1+ acima, preço = tempo × salário do professor); a **G68**
  (`docs/pendencias/G-acoes-sistema.md:446`, "[DECIDIDO, APLICAR DEPOIS]") é quem fecha o
  detalhe fino e "completa a G44". **Não crie pendência nova para 1e.** Acrescente o bloco 1e
  como sub-item da **G68**, rotulado "Sugestão do Comerciante, não aprovada", **marcando
  claramente o que é NOVO em relação ao que a G44 já tem decidido** (a fórmula de tempo em
  jornadas, a aula em grupo até 4 alunos por 1,5×, o mentor que ensina de graça mas mantém a
  dívida). Se algum ponto contradisser o que a G44 já decidiu (ela não fala de grupo nem de
  mentor grátis), registre como proposta nova, não como se já fosse a decisão do autor.
- **1f (Comércio e modificador regional)**: não achei nada com esse endereço.
  **Crie pendência NOVA em `docs/pendencias/G-acoes-sistema.md`** (próximo G livre depois do
  G70), citando que hoje não há pechincha, revenda nem variação regional de preço no site (o
  próprio capítulo de custo diz isso: "a diferença de preço entre regiões... fica para depois").

Depois de editar `docs/pendencias/*.md`, rode `node scripts/gen-pendencias.mjs` (o
`Pendencias.md` da raiz é gerado, não se edita).

## 2 · Tudo em pc

1. Toda tabela de preço, renda, custo e salário do site (as que já existem, geradas por
   `gen-cap-economia.mjs` e `gen-cap-itens.mjs`) passa a mostrar só `pc`, com ponto de milhar
   (ex.: "10.000 pc"). **A conversão de moeda ao lado do número, que hoje o gerador escreve
   (`po`/`pp`/`pc` misturados), some das tabelas.**
2. A tabela de conversão continua como está, em `custo-de-servico-e-itens.md:12-31` ("Moedas &
   Conversão"): 1 po = 10 pp = 100 pc. Não mexa nela.
3. **Procure no texto corrido** (fora de tabela gerada) todo número em po/pp que hoje aparece
   solto nas regras (ex.: `Acoes_Sistema.md` cita preços em po em alguns parágrafos de exemplo).
   Converta para pc e **liste cada ocorrência no relato** (arquivo:linha, antes e depois).
4. Arredondamento na fonte (em `gerar.py`/`modelo.py`, não no gerador de capítulo):
   a) Taxas (renda por perfil, diária, hora, salário e custo de criado, Livre): pc inteiro, meio
      para cima (`arred` de meio-para-cima, confira se já existe essa função no modelo ou se
      precisa de uma nova ao lado do `arred` atual).
   b) Preços de loja (mercadorias, montarias, veículos): mantêm a regra `arred` atual, sem mudar.
   c) Serviços que derivam da tabela de perfil (ex.: artesão avulso) usam o valor **inteiro** já
      arredondado da tabela de perfil, não recalculam com o `arred` de preço de loja.
5. Conferência pedida: nenhuma célula das tabelas de economia deve sobrar com vírgula decimal.
   Rode uma varredura no `dist/` das páginas de economia procurando por vírgula dentro de `pc`
   (`grep` no HTML gerado) e relate quantas ocorrências restaram (tem que ser zero).

## 3 · Recursos 0 a 6, e a tabela de Renda

**Achado, para orientar (pesquisa feita agora, confirme na sua árvore):**
- `antecedentes.md:92-105` (o verbete de Recursos) **já descreve os 6 níveis**, de "Remediado"
  (1) a "Fortuna de reino" (6). Não precisa mexer no texto do verbete.
- `criacao-de-personagem.md:52` **já tem o custo em XP até Recursos 6** ("5→6 = 18") e o teto de
  criação em 3. **Não achei nenhum texto do livro afirmando "Recursos vai até 5"**; relate se
  achar algo, mas não escreva a checagem como se fosse achado certo antes de ver com os próprios
  olhos.
- **O que precisa mudar é só `renda.json`:** hoje `faixas` mapeia Aristocrata **e** Nobreza para
  `recursos: 5` (o Braçal/Destreinado ficam em 1, Treinado em 2, Especialista/Doutor em 3,
  Abastado/Rico em 4). Isto é o que faz a tabela do capítulo mostrar "●●●●●" nas duas últimas
  linhas. **Mude, na fonte (`gerar.py`/`modelo.py`), só a Nobreza para `recursos: 6`.**

Passos:

1. Na fonte, ajuste o mapa de faixa → Recursos para: Braçal e Destreinado 1; Treinado 2;
   Especialista e Doutor 3; Abastado e Rico 4; Aristocrata 5; **Nobreza 6**. Regere.
2. No capítulo (`custo-de-servico-e-itens.md`, seção Renda), **acrescente uma linha de texto**,
   não uma linha de tabela (Recursos 0 não tem faixa nem renda), logo **acima** da tabela gerada:
   "**Recursos 0.** Sem renda contínua. Vive do que ganha em trabalhos e recompensas." Isto é
   prosa, escrita por você, não gerada.
3. Confira (sem alterar) e relate: o custo em XP de Recursos 6, o teto de nível na criação, e
   qualquer texto do livro que diga "até 5" para Recursos. Relato claro: "achei X em
   arquivo:linha" ou "não achei nada dizendo isso".
4. **Colunas que ficam na tabela gerada:** Recursos, Faixa, Renda/Sem, Custo/Sem, Livre/Sem,
   Livre/Ano. **Saem:** Nível de vida, Renda/Mês, Livre/Mês (mexe em
   `scripts/gen-cap-economia.mjs`, no bloco que monta essa tabela; o texto do capítulo que já
   explica nível de vida, fora da tabela, continua).
5. **Regra de Imprevistos**, texto novo logo abaixo da tabela: "**Imprevistos.** A cada estação
   (12 semanas), o personagem perde o Livre de tantas semanas quanto o seu Recursos. Na conta do
   ano: Livre/Ano = Livre/Sem × (48 − 4 × Recursos). Em jogo, o Mestre pode, no lugar do desconto,
   narrar o imprevisto (doença, multa, telhado, presente obrigatório) e cobrar o valor. Use um ou
   outro, nunca os dois." **Livre/Ano passa a ser calculado por essa fórmula** (não mais
   Livre/Sem × 48 direto); ajuste o gerador ou a fonte, o que for mais correto (decida e diga
   qual escolheu e por quê).
6. **Conferência dos 9 valores de Livre/Ano esperados** (Braçal 308, Destreinado 440, Treinado
   760, Especialista 1.080, Doutor 1.440, Abastado 1.760, Rico 2.720, Aristocrata 3.080, Nobreza
   4.800): bata cada um contra o Livre/Sem × (48 − 4×Recursos) da fonte, e relate os 9 lado a
   lado (esperado vs. calculado). Se algum não bater, pare e diga qual e por quê, não force o
   número.

## 4 · Tabela de serviços por perfil

**Achado, para orientar:** hoje `src/data/servicos.json.tarifas_por_perfil` tem somas 4, 5, 6, 8,
9, 10, 11, 12 (**falta a 7**), e os valores de "semana" das somas 9-12 são o resultado **cru** da
curva (334,3 / 434,6 / 568,3 / 668,6 pc), não os valores **arredondados** que o próprio
`renda.json.curva_por_soma` já usa para soma 9 e 12 (330 e 670). O despacho do autor pede que a
tabela use os valores já publicados no livro, e não a fórmula crua.

1. **Renda/Sem pelos valores do livro:** soma 4 → 60, 5 → 100, 6 → 130, **7 → 200** (linha nova),
   8 → 260, 9 → 330, 10 → 430, 11 → 570, 12 → 670. Ajuste a fonte para gerar exatamente esses
   valores (o arredondamento de "meio para cima" da Tarefa 2 deve produzir isso a partir da
   curva; se algum não bater direto, arredonde na tabela do perfil como um valor próprio,
   documentado, e diga qual e por quê no relato).
2. **Diária por contrato = Renda/6; avulsa = Renda/4; hora = avulsa ÷ jornada** (6, 8 ou 10 h,
   conforme o ofício leve/artesão/braçal já decidido na rodada 113). Tudo inteiro, meio para
   cima. **Confira contra os números do despacho:**
   - soma 6: contrato 22, avulso 33, hora leve 5, hora artesão 4, hora braçal 3;
   - soma 9: contrato 55, avulso 83, hora leve 14, hora artesão 10, hora braçal 8;
   - soma 12: contrato 112, avulso 168, hora leve 28, hora artesão 21, hora braçal 17.
   Relate os 15 números (3 somas × 5 colunas) lado a lado com o esperado.
3. **Coluna nova "Livre/Sem"**, fórmula: `Renda × 0,12 × (60/Renda)^0,35`, inteiro. Valores
   esperados para as 9 somas, na ordem 4→12: 7, 10, 12, 16, 19, 22, 26, 31, 35. Confira e
   relate os 9.
4. **Texto acima da tabela** (no capítulo, junto da seção Serviços): "A renda é o que o
   contratante gasta com quem trabalha. Quando o personagem trabalha por semanas, ele recebe o
   Livre/Sem, e não a renda: o custo de vida do nível dele já foi descontado. Por jornada,
   Livre/Sem ÷ 6."
5. **Não escreva nada sobre somar ou não com Recursos** (fica para decisão futura); não invente
   uma regra de interação entre esta tabela e a de Recursos.

## 5 · Dividir "Custo de Serviço & Itens" em subpáginas

**O padrão já existe no site**, e está documentado em `src/lib/site.ts:30-42` (comentário: "Como
os capítulos II e XVII, o VIII são cinco páginas"): um capítulo em várias páginas-irmãs é uma
lista de arquivos com o **mesmo `numeral`** e `ordem` sequencial, cada uma com seu próprio
`titulo`; a primeira é o "índice" que abre pelo link do capítulo, e as outras abrem um parágrafo
`<p class="muted">Parte do capítulo <strong>Nome</strong>...</p>` apontando de volta pra ela.
Siga exatamente esse padrão (veja `acoes-e-sistema.md`, `acoes-corpo-e-movimento.md` etc. como
molde), com `numeral: "XIV"` nas cinco.

**O mapa de seções hoje** (`custo-de-servico-e-itens.md`, linhas de título, confira na sua
árvore): Moedas & Conversão (`:12`), Renda (`:33`, com Dias de trabalho `:61` e Semanas de
aventura `:65`), Custo de Vida (`:74`, com O custo da casa `:96`), Serviços (`:120`, com Aulas
`:259`), Servos & Escravos (`:283`), Qualidade de Itens (`:324`), Catálogo de Equipamento
(`:398`), Mercadorias (`:499`), Montarias, Veículos & Animais (`:808`), Viagens (`:896`), Pacotes
de Equipamento (`:941`).

**A proposta do despacho tem 5 páginas, mas o capítulo tem 11 seções**; duas não têm casa óbvia
(Catálogo de Equipamento e Pacotes de Equipamento). Decida você, e relate a decisão com o motivo:

1. **Moeda, Renda e Custo de Vida:** Moedas & Conversão, Renda (+ Dias de trabalho, Semanas de
   aventura), Custo de Vida (+ O custo da casa).
2. **Serviços e Contratação:** Serviços (+ Aulas), Servos & Escravos. (**Cura mundana** mora em
   `vida-ferimentos-cura.md`, não neste capítulo; não mova nada de lá, só linke se fizer
   sentido.)
3. **Mercadorias:** a seção Mercadorias. Avalie se o Catálogo de Equipamento (armas/armaduras)
   cabe melhor aqui ou na página 4.
4. **Qualidade e Reparo:** Qualidade de Itens, e o reparo (que hoje mora em
   `acoes-oficio-e-mundo.md`, não aqui; não duplique, só linke). Avalie o Catálogo de Equipamento
   e os Pacotes de Equipamento para esta página ou a 3.
5. **Montarias, Veículos e Viagens:** Montarias/Veículos/Animais, Viagens.

**Depois da divisão:**

- Registre as cinco em `src/lib/site.ts`, no formato do array `sub` (como `acoes-e-sistema`),
  substituindo a entrada única de hoje (`:48`).
- **Âncoras e links internos:** só achei uma citação por âncora no código
  (`acoes-oficio-e-mundo.md:254`, o link para `custo-de-servico-e-itens#semanas-de-aventura`);
  confira se ainda é só essa na sua árvore e aponte para a nova página onde "Semanas de aventura"
  for morar. Rode `node scripts/reapontar.mjs` para as citações `arquivo:linha` (em
  `docs/pendencias/*.md` e no `Pendencias.md` gerado) que citam `custo-de-servico-e-itens.md`
  por número de linha: como o conteúdo muda de ARQUIVO, o reapontar não resolve sozinho (ele
  segue diff dentro do mesmo arquivo); depois de rodá-lo, confira à mão as citações que
  restarem apontando para o arquivo velho e corrija o nome do arquivo também.
- **Busca:** confira que o `pagefind` (busca do site) indexa as cinco páginas novas depois do
  build (`npm run build` gera o índice); não é preciso configuração extra, mas prove no
  `dist/pagefind` ou testando uma busca por um termo de cada subpágina.
- Delete/redirecione o arquivo antigo conforme o padrão do site (confira como o XVII e o II
  trataram o arquivo original: se viraram uma das cinco, ou se sobrou um único ponto de entrada).

## Verificação

- `npm run validate` e `npm run build` verdes.
- Prova no `dist/`: cada tabela alterada (Renda, Serviços, Recursos) lida célula a célula,
  antes e depois, para as três tarefas de número (2, 3, 4).
- Nenhuma vírgula decimal nas tabelas de economia (Tarefa 2, item 5).
- As cinco subpáginas existem em `dist/regras/`, com o parágrafo "Parte do capítulo" nas quatro
  que não são a primeira, e a barra lateral mostrando as cinco dentro do capítulo.
- `git grep` (ou equivalente) confirmando que não sobrou `src/data/*.json` de economia editado à
  mão fora do `gerar.py` (mesma disciplina das rodadas 110-113: o `--check` do
  `copiar-economia.mjs` cobre isso).

## O relato

`114-executora.md`: por tarefa (1 a 5), o que foi feito, onde (arquivo:linha), e a lista de
antes/depois pedida em cada uma (Tarefa 2 item 3; Tarefa 3 item 3 e item 6; Tarefa 4 itens 2 e 3;
Tarefa 5 o mapa seção→subpágina). `progresso-114.md` desde a primeira etapa.

Depois do relato: peça à **Leitora-novata** para ler a subpágina de Renda e a de Serviços e dizer,
com as próprias palavras, o que um personagem recebe quando trabalha uma semana (é a checagem
final pedida pelo autor, não é revisão técnica).

## Apêndice · texto dos blocos 1a a 1f (do Comerciante, copiado sem alteração)

**1a. NOVA pendência "Desgaste e manutenção (regra opcional)" (registre como sub-item da G67):**

> Fim de cada combate: 1 marca em cada arma usada, em cada armadura que absorveu dano e em cada
> escudo que bloqueou. O Mestre pode dar mais uma em combate longo, contra armadura pesada,
> criatura grande ou falha crítica.
> Estágios: dano leve (-1 num número da peça: dano, absorção ou bloqueio), dano pesado (-2),
> arruinada (inútil até reparo).
> Marcas por estágio, pelo grau: Sucata 1, Tosca 2, Comum 3, Boa 3, Ótima 4, Excelente 6
> (Excelente 6/12/18 marcas para leve/pesado/arruinada). É o "Excelente dura mais".
> Manutenção: 1 hora com o kit apaga 1 marca, sem jogada, com Ofícios Gerais 1 ou o ofício, com
> tempo e abrigo. Só age antes do dano; depois, só o reparo.
> Kit de manutenção ~20 pc (pedra de amolar, óleo, trapos, areia); óleo 10 pc a cada 4 semanas de
> uso. Manutenção paga: ~2 pc por marca.
> Referência: limpadores de cota da Torre de Londres, 4 a 6 d por dia (1344-51).
> Fora da regra: roupa e ferramenta (já no custo de vida), cavalo (ferragem na manutenção
> semanal), munição (regra de recuperar metade).
> Reparo (se ainda não estiver no livro): leve sem Montagem, 1/4 da Peça, cerca de 1/10 do preço,
> Ofícios Gerais faz no campo; pesado 1/2 Montagem + 1/2 Peça, cerca de 1/3; arruinada com
> material, trabalho inteiro, cerca de 2/3 mais material.

**1b. Pendência da Cura (Artes, Cura sem número fora do combate) (registre como pendência nova em
`A-arcano-artes.md`):**

> Curandeiro mortal acelera a recuperação em cerca de 10%, só um pouco melhor que descansar.
> Preços mundanos baratos já no livro (atendimento 3, consulta 15, tratamento 10 por dia).
> Cura com Proeza ou Magia encarece: preço pela tabela de serviços do perfil do curador, mais o
> custo de Mana quando existir regra de Mana em ação Longa.

**1c. G15 (Proezas em ação Longa) (registre como sub-item da G15):**

> Na renda de ofício, a segunda Habilidade entra como bônus fixo, só uma. Firula não conta.
> Proeza conta como bônus na média. Número a definir junto com D8.

**1d. Pendências de Mana em ação Longa e de item mágico (registre a primeira frase como sub-item
da A4; a segunda como pendência nova em `A-arcano-artes.md`):**

> Serviço mágico = tabela de serviços pelo perfil do conjurador × tempo, mais Mana e material
> quando houver regra. Raridade por lugar: usar os tetos de aldeia, vila, cidade e capital como
> base.

**1e. NOVA pendência "Empréstimo de XP" (desenho pronto, aguarda o autor) (registre como sub-item
da G68, marcando o que é novo em relação à G44):**

> Um ponto por vez, quitado antes do próximo; professor com pelo menos 1 ponto acima; vale para
> Atributo, Habilidade e Especialidade; o Mestre julga.
> Tempo de aula = custo em XP do ponto / 2, em jornadas (Habilidade 3 para 4: 6 jornadas;
> Atributo 3 para 4: 12,5). O aluno não trabalha nesses dias.
> Preço = jornadas × diária avulsa do professor.
> Dívida: metade de todo XP ganho vai para a dívida até quitar; some no fim da campanha.
> Mentor ensina sem cobrar dinheiro; a dívida de XP é a mesma. Aula em grupo: até 4 alunos, preço
> total × 1,5 dividido.

**1f. NOVA pendência "Comércio e modificador regional" (registre como pendência nova em
`G-acoes-sistema.md`):**

> Pechincha com teto de 20%; venda direta ao consumidor 70% a 100% do preço de tabela;
> arbitragem entre regiões; números do modificador regional.
