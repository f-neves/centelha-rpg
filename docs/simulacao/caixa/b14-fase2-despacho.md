# B14 fase 2 · despacho · decisões do autor para as fichas, mais a bolsa (grupo 3 → 4)

Liberado pelo humano em 26/09/2026, depois do veredito PROCEDE da fase 1 (`b14-revisora.md`,
commit `3e29b03`). Pino: `3e29b03`. Texto do autor, colado sem edição:

## O pedido, verbatim

> Arquiteto: B14, fase 2. Decisões do autor para aplicar nas fichas de src/data/bestiario/, mais a
> bolsa. Leia antes: docs/pendencias/B-bestiario.md (B14) e o arquivo
> ../tmp/arquiteto/poderes-sugestao.md (abra a pasta ../tmp/arquiteto; é a tabela dos 226 poderes
> com classificação e usos).
>
> A. Esquema (scripts/criatura-schema.mjs e docs/bestiario/ficha-criatura.md):
> 1. dimensoes: {comprimento, largura, altura} em metros, mais envergadura (quem voa) e forma
>    (humanoide, quadrupede, serpentiforme, alado, amorfo, radial). Forma comum dá padrão; as três
>    medidas são obrigatórias só em forma não padrão. O porte continua pela massa (M-29b).
> 2. poderes naturais: {id, nome, tipo: "natural", base: {arte, nivel} (Efeito Especial de
>    referência, só parâmetro), resiste: "esquiva"|"corpo"|"mente"|"nenhum", area, efeito, usos:
>    {quantidade, periodo: "ticks"|"cena"|"hora"|"dia"|"avontade"|"passivo"|"golpe", recarga}}.
>    Poder natural NÃO passa pelo portão de Centelha e NÃO usa Mana. `resiste` é categoria, sem
>    fórmula: a fórmula de "corpo" está em auditoria (não escreva Vigor + Convicção em lugar
>    nenhum novo).
> 3. desafio: {individual, bando: {quantidade, desafio}} como saída (vazio até a bancada), com
>    nota: a recompensa usa só o individual.
> 4. constructo: flag `semVida: true`. Mantém Vigor (PV e Absorção pela fórmula), mas não faz
>    teste de Vigor, Resistência nem Virtude, não cura nem regenera sozinho (conserto por Ofício),
>    e fica imune a tudo que se resiste por "corpo". Golem de material herda a fraqueza do
>    material (lib-materiais.mjs), escrita na ficha.
>
> B. Poderes (a partir da tabela):
> 5. Aplicar a classificação: Arte vira `arte` na ficha (id e nível ≤ Centelha); natural vira
>    poder natural com os usos da tabela; "traço social" vira texto em habilidades; "passivo" de
>    voo vai para locomocao, de defesa vira Absorção/resistência/imunidade; as 4 "alternativa
>    mágica" saem.
> 6. Onde a Arte sugerida passa da Centelha da criatura, NÃO suba a Centelha: liste para o autor.
>
> C. Correções de regra já decididas:
> 7. Defesa Social: Int 1 passa a ter Defesa Social, com Sobrevivência no lugar de Sociabilidade
>    (regras.json já prevê isso); "-" só para Int 0. Vale em gen-bestiario, bestia-editor.ts e
>    onde mais calcular.
> 8. Nenhum animal comum com Centelha: Cão de Montaria, Rã Gigante e Leão Atroz vão a 0.
> 9. Incorpóreos (Sombra, Assombração, Espectro, Fantasma): sai a imunidade "só Arcano, Proteção
>    ou arma encantada"; entram resistências a corte, perfuração e impacto (regra de resistência
>    do regras.json). Fraquezas a luz e sagrado continuam.
> 10. Voo: as criaturas que voam na fonte ganham locomocao.voo; a velocidade em terra passa a ser
>     a da fonte (hoje há casos com a velocidade de voo lida como terra, ex.: mon-roc). Liste as
>     55 e o valor de cada uma.
> 11. Orc (mon-orc): Força 5, Destreza 3, Vigor 5, Influência 2, Perspicácia 2, Compostura 1,
>     Percepção 3, Inteligência 2, Raciocínio 2; ganha Vitalidade (+Vigor de PV) e Frenesi como
>     poderes naturais, iguais aos da raça (racas.json).
> 12. Vontade em combate, em regras.json: 1 ponto dá +1d6 na jogada ou +4 numa Defesa, no máximo 1
>     ponto por ação ou jogada (inclusive cada golpe que se defende). Ajuste o texto de
>     aparencia-virtudes-vontade.md, que hoje diz "turbinar" sem número.
> 13. Horda: texto sugerindo ao Mestre tratar como Horda a partir de 2 criaturas por personagem,
>     deixando explícito que é decisão dele.
>
> D. Grupo de referência 3 → 4 (relato do Comerciante):
> 14. lore/economia/v2/modelo.py:445 (comentário) e :466 grupo=4; src/data/recompensas.json _nota
>     e "grupo": 4 (regerar pelo gerador, não à mão); custo-servicos.md:40 (× 4) e :42 ("grupo de
>     4"); CalculadoraRecompensa.astro:24, o value="3" do "Tamanho real do grupo" vira "4" (senão
>     a Parte por caçador padrão sobe); docs/pendencias/B-bestiario.md:118, a definição do desafio
>     passa a "grupo de 4 personagens". As atas de rodada (docs/simulacao/caixa) ficam como estão.
>
> Fora do escopo: ataques genéricos por categoria, Int dos semibestiais, variantes, bancada de
> desafio, Fôlego (fica para depois, não mexa). Commit com pathspec. No fim: arquivos tocados, a
> lista do item 6, a lista do item 10, e qualquer poder da tabela que não coube no esquema.

## Onde está o material

- `docs/pendencias/B-bestiario.md` (B14), no repositório principal.
- `../tmp/arquiteto/poderes-sugestao.md` (a partir de qualquer uma das quatro árvores em
  `C:/Users/Neves/ClaudeCode/centelha/`): a tabela dos 226 poderes, colada por mim em
  `C:/Users/Neves/ClaudeCode/centelha/tmp/arquiteto/poderes-sugestao.md`. Não é do repositório;
  não commite este arquivo.

## Conferência prévia (Arquiteto, antes de despachar)

Toda citação do item D bateu, linha por linha, contra a árvore em `3e29b03`:

| citação do pedido | conteúdo real na linha |
|---|---|
| `modelo.py:445` | `# Bolsa = Valor do degrau × Semanas × Tarefa × Risco × 3 (o grupo de referência)...` |
| `modelo.py:466` | `fracas_contam=0.5, fracas_abaixo=2, dias_semana=DIAS_SEMANA, grupo=3,` |
| `custo-servicos.md:40` | `<p class="formula">Bolsa = Valor do degrau × Semanas × Tarefa × Risco × 3</p>` |
| `custo-servicos.md:42` | `A bolsa paga um grupo de 3, que é o grupo para o qual o nível de desafio é...` |

`scripts/lib-materiais.mjs` existe. `src/data/bestiario/mon-roc.json` existe (o exemplo do item
10). `docs/pendencias/B-bestiario.md:118` traz a definição do desafio por "grupo de 3 personagens"
(a que o item 14 pede para virar 4). Não conferi ainda o texto de `regras.json` sobre Defesa Social
(item 7) nem `aparencia-virtudes-vontade.md` (item 12): a Executora confere ao implementar, e relata
se o "já prevê isso" do autor não bater.

## Atenção especial da Executora, por causa da B14 fase 1

- **Item 2 pede explicitamente para NÃO escrever "Vigor + Convicção" em lugar nenhum novo.** Isso
  cruza com a auditoria de Virtude somada que está rodando em paralelo (mensagem separada,
  "auditoria de Virtude somada"): se a auditoria achar mais ocorrências no bestiário antes de você
  terminar esta fase, elas contam para os dois levantamentos, mas você não corrige nenhuma aqui,
  só evita criar novas.
- **Item 14 toca arquivo gerado por `scripts/copiar-economia.mjs`** (`recompensas.json`): mude
  `lore/economia/v2/modelo.py:466` e regere pelo fluxo, não edite o JSON à mão.
- **Item 6 e item 10 pedem listas de saída**, não decisão sua: registre no relato e não resolva
  sozinha (não suba Centelha, não escolha o valor de voo por conta própria além do que a fonte
  já diz).

## Verificação

- `npm run validate` e `npm run build` verdes.
- Prova no `dist/`: a bolsa e a calculadora de recompensa com grupo 4 (o `test-recompensa.mjs`
  precisa de atualização dos valores esperados, já que o grupo de referência muda).
- Travessão: zero nas linhas novas.
- Os três caminhos sujos conhecidos (`lore/mapas/dados/camadas_referencia.json`,
  `lore/mapas/registro-git.jsonl`, `lore/economia/prompt-revisao-economica.md`) continuam
  intactos.

## O relato

`docs/simulacao/caixa/b14-fase2-executora.md`, no formato de sempre. Ao fim: arquivos tocados, a
lista do item 6 (Arte que passaria a Centelha), a lista do item 10 (as 55 criaturas de voo e o
valor de cada uma), e qualquer poder da tabela que não coube no esquema.
