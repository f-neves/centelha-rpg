# Rodada de pendências do autor · despacho

Liberado pelo autor em 03/10/2026, para a Executora. **Um commit por bloco (A a K), `git pull --rebase` antes
de cada, CI conferido (Validar e Deploy, pelo código de saída), depois a Revisora.** Relato único em
`docs/simulacao/caixa/rodada-pendencias-relato.md`, um bloco por item, com antes e depois, sha e CI.

Registro: as decisões estão em `docs/decisoes-partes/decisoes.md` (D-014, D-015, D-006, P-01 a P-10). Antes de
aplicar qualquer mudança de regra, confira o registro (CLAUDE.md, seção "Decisões de regra do autor"). Se algo
contradisser uma decisão registrada, **pare e avise**. Nada fora desta lista sem o autor. Sem travessão.
"Habilidade", nunca "Perícia". Commit com pathspec; não toque nos arquivos sem dono (`.agents/`, `AGENTS.md`,
`.claude/commands/comerciante.md`, `docs/calibracao/discussao/inventario-limites.md`).

## Bloco A · Resistir: ESCALA 2 e ponto 7 (um commit pequeno)

Decisão do autor, verbatim:
> ESCALA 2: opção B. Tire o tetoCusto (e a tetoCustoNota) do bloco social.modoDevagar.resistencia: o teto 4 vale para o Combate Social e para o efeito mental, e o cortejo fica como estava até o autor decidir o cortejo.
> D-014: se o efeito já está no menor grau da sua régua de Duração, pagar 1 ponto anula o efeito. Com Margem 1 ou mais, pagar 1 faz o efeito mental durar um grau a menos na régua do próprio efeito (Arte Breve/Longa ou Proeza); no menor grau, anula.

1. `regras.json`: tire `tetoCusto` e `tetoCustoNota` de `social.modoDevagar.resistencia`. Se o teto 4 do Combate
   Social precisa de um lugar no JSON, crie um bloco próprio do Combate Social (nome combinando com as chaves
   vizinhas) com `tetoCusto: 4` e a nota; **nada do cortejo muda**.
2. `relacoes-sociais.md`: confira que o teto 4 aparece só na parte do Combate Social (e na Folha), e que o
   cortejo (`:242`, `:246`, `:276` ou onde estiver) NÃO traz o teto. Se o relato 125 deixou "(teto 4)" no cortejo, tire.
   **Não corrija a frase "o intervalo não é uma ação"**: o cortejo está em discussão.
3. Efeito mental (ponto 7): em `defesas.md:105` ("Ataques e influências mentais") e onde o livro tratar de
   resistir a efeito mental, escreva: resistir custa 1 + Margem (teto 4) e recusa o efeito; com Margem 1 ou mais
   o alvo pode pagar só 1, o efeito pega mas dura um grau a menos **na régua de Duração do próprio efeito**
   (a da Arte, Breve ou Longa, em `arcano.improviso.graus`, ou a da Proeza, `escalasProeza.parametros.duracao`);
   **no menor grau da régua, pagar 1 anula o efeito**. Não invente nomes de grau: aponte para a régua de cada um.
4. Relato: diga se algum código lê a Duração do efeito mental (relato anterior: nenhum lê).

## Bloco B · Margem na Acumulada (item 1)
> Margem dentro da Acumulada: "o Mestre decide". Os dois efeitos de hoje (congelar um intervalo no Esgueirar, subir a qualidade no Ofício) ficam no livro como EXEMPLOS do que o Mestre pode fazer.

Reescreva o trecho da Acumulada (acoes-e-sistema.md e onde a Margem da Acumulada for regra) para "o Mestre decide
o que a Margem compra", com os dois efeitos como exemplos. Fecha a pendência G75: marque-a no `Pendencias.md`.
Confira `regras.json` se há campo que trate os dois efeitos como regra fechada; se houver, ajuste a nota.

## Bloco C · Fôlego: remover (item 2)
> Fôlego: remover direto. Remover do livro e do código (a reserva inteira), e a ficha IGNORA o campo velho ao carregar, para nenhuma ficha salva quebrar. Avise no commit.

Remova o Fôlego do livro, de `regras.json`/derivados, da ficha, do Grid/mesa e da calculadora (varra `folego`,
"Fôlego", `fôlego`). **A ficha ao carregar IGNORA o campo velho** (sem erro, sem migrar valor), e a persistência
não pode quebrar: teste carregando uma ficha salva COM o campo antigo. Se o Fôlego era entrada de outra fórmula
(Energia, Tabela de combate, Pressão), pare e me avise antes de remover essa parte. A mensagem do commit traz a
linha "para quem joga hoje" (fichas salvas com Fôlego abrem normalmente e o campo some) e diz se depende de migração.
Registre em `RENOMES`/equivalente só se a ficha precisar; o pedido é ignorar, não renomear.

## Bloco D · Teto de Arte + F2 (item 4, com a D-006)
> Nível máximo da Arte é Centelha + 2, para todos, no momento (provisório). Tabela: Centelha 0 → 2; 1 → 3; 2 → 4; 3 → 5; 4, 5 e 6 → 6. O teto de PROEZA continua Centelha (portão "nível N exige Centelha ≥ N"); não há conflito.
> Junto, o commit F2: mortal tem Mana e pode usá-la (ficha-engine.ts:176, grid.astro:3329, combate.astro:1693; rótulo em FichaSkeleton.astro:117). Criaturas e fichas que hoje passam do teto: LISTAR e trazer ao autor, sem alterar nenhuma.

1. Livro: o teto de Arte pela tabela, no capítulo das Artes e onde o nível for limitado; `regras.json` com a tabela.
2. Código (**commit separado do texto**, com a linha "o que muda para quem joga hoje"): destrave o mortal nos
   quatro pontos acima. **Só destrave** o que o livro já diz; a reserva própria de Mana do mortal (D-002) e a
   Meditação (D-003) NÃO entram, estão registradas como "a implementar" e esperam o documento da Veterana.
3. Pequena CLAREZA de `combate.md:300` ("(5,5, arredondado)") pode ir neste commit.
4. Lista no relato: toda criatura e ficha (fixtures, exemplos do livro) com Arte acima do teto da sua Centelha. Sem alterar.
5. Aponte no relato qualquer outra regra escrita que conflite com o teto novo.

## Bloco E · Recompensa: matilha de worgs (item 5)
> O exemplo da matilha de worgs passa a DESAFIO 1, decisão do autor. Recalcule o valor do exemplo pela regra e atualize livro, calculadora e test-recompensa.mjs. Troque a referência antiga ("worg 0, dupla 2, matilha 3") pela nova.

Mostre a conta no relato. `npm run validate` verde, e o `test-recompensa.mjs` com o número novo.

## Bloco F · Ataque Total não existe (item 7)
> Não existe Ataque Total no sistema. Cada ataque é separado. Tirar a variante da bancada (opts.ataqueTotal) e dos documentos onde aparece como decisão pendente.

Remova `opts.ataqueTotal` da bancada e as menções como decisão pendente (`Pendencias.md`, documentos de
simulação). Documento histórico de rodada que cita o termo como fato passado fica; liste no relato o que deixou.

## Bloco G · lore/economia fora do git (item 13, opção A)
> Opção A. Tire do git só o que o build não lê; ficam a v2/ e o .procedencia.json.

Aceite o que o build, os testes e as calculadoras leem: `scripts/copiar-economia.mjs`, `gen-cap-economia.mjs`,
`validate-data.mjs:922` leem `lore/economia/v2/` e os `*.procedencia.json`. Faça `git rm --cached` (NÃO apague do
disco, NÃO reescreva a história) do resto de `lore/economia/` (README, anexo-auditoria, catalogo-unificado,
estado-revisao, etapas-abc, proposta-*, prompt-revisao-economica, gerar_mercadorias.py...), e acrescente ao
`.gitignore`. **Antes**, prove por `grep` em `scripts/`, `src/`, `.github/` e testes que nada do que sai é lido; se
algo for, pare e avise. Depois do commit, `npm run validate` e build com prova no gerado. Atenção: `.gitignore` já
tem linhas para `lore/economia/*/*.json` e `!...procedencia.json`; ajuste sem desproteger a v2/.
`lore/economia/prompt-revisao-economica.md` está sem dono e não rastreado: só ignorar, não commitar.

## Bloco H · Pequenas pendências técnicas (item 15), uma linha por item no relato
`gen-monsters` sem `--check` (acrescente, ligado como o `gen-bestiario.mjs --check`); comentário velho em
`desEsqDaDefesa`; Percepção do Kael na fixture `kael.json` (3 contra 6: confira qual é a certa pela ficha e
corrija a fixture ou o teste, dizendo qual); o "16" da Sora em `combate.md:21`.

## Bloco I · Itens mágicos (item 16)
Commite `docs/itens-magicos/itens-magicos-pesquisa.md` (leia inteiro antes) e registre no `Pendencias.md` a
pendência do tema: poções, pergaminhos, itens mágicos, armas e armaduras encantadas, artefatos. Nada de desenho.

## Bloco J · Economia, resumo (item 17)
Só o resumo curto, no relato, das duas ressalvas da rodada 120: o "tempo gasto", e se o padrão de Pessoas
(4 no confronto, 1 na perícia) chegou de fato à calculadora (confira no código e cite arquivo:linha).

## Bloco K · Só registrar (`Pendencias.md`)
- **Guarda sob pressão**: adiada até fechar as regras de combate ("com grandes chances de no final manter como está"). Registre a lacuna: o livro não diz como a guarda se renova para quem não age (esperando a vez, atordoado, preso), nem o que conta como "agir".
- **K37**: o Grid passa a cobrar a pressão pelo ataque feito e pelo recebido; junto com as regras de combate.
- **B16**: vocabulário de resistências, depois.
- **Topo da tabela de recompensa (desafio 4+)**: sem pressa.
- **Dragões (Filhote, Jovem, Adulto)**: "deixar do jeito que estão, sem mexer". Nenhuma alteração de ficha.
- **Cortejo**: em discussão pelo autor; frase "o intervalo não é uma ação" e `vontadePresa` ficam.

## Parte 2 · Bancada e criaturas (itens 3 e 9 a 12): depois dos blocos A a K, em rodada própria

Ainda não detalhada neste arquivo: o Arquiteto manda o texto completo depois que a Revisora fechar A a K. **Não
comece.** O item 3 (corrigir os ataques das 38 criaturas) depende de a lista levantada ser localizada.

Para quem joga hoje: os blocos C (Fôlego) e D (mortal conjura) mexem em `src/` e trazem a linha própria; o resto
é texto, `regras.json`, documento e `.gitignore`.
