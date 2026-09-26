# B14 fase 3 · relato da Executora

Despacho: `docs/simulacao/caixa/b14-fase3-despacho.md` (commit `e25826c`), com material de apoio
em `../tmp/arquiteto/` (`decisoes-fase3.md`, `artes-criaturas.md`, `loc-fonte.md`).

## CORRIGE da fase 2 (commit próprio, `caf5f49`)

1. `recompensas.json._nota` já estava corrigido em `513f5a1` (fora da faixa da Revisora):
   confirmado, dizia "× 4" antes de eu tocar em qualquer coisa.
2. `combate.md:426`: trocado `**...**` por `<strong>...</strong>` dentro do bloco HTML cru da
   Horda. Provado no `dist/regras/combate/index.html`: o texto sai com a tag certa, sem asterisco
   literal.

## Seção 1: `resiste` por efeito (substitui o padrão da fase 2)

Reli os poderes `tipo: "natural"` já gravados contra a tabela nova (medo/encanto/domínio/
ilusão/canto/presença → mente; transformar/petrificar/paralisar/doença/veneno/dreno/morte
instantânea → corpo; dano de área evitável → esquiva; dano de ambiente contínuo → nenhum).

**Achei um padrão de erro sistemático nas auras**, não pontual: meu critério da fase 2 tentava
distinguir aura de medo (mente) de aura ambiental (corpo) comparando a Arte de base contra uma
lista com acento (`'proteção'`, `'fascinação'`), mas o texto extraído da coluna Base da tabela
tinha outro tratamento de acento, e a comparação nunca batia. Resultado: **todas as 13 auras
saíram como `corpo`**, inclusive as de medo e as de fogo/frio puras. Corrigido por revisão manual
de cada uma (não deu para confiar em nenhum critério automático de novo):

- **Viram `nenhum`** (dano de ambiente contínuo): `mon-balor` (aura-de-fogo), `mon-diabo-de-gelo`
  (aura-de-frio), `mon-dragao-vermelho-adulto` (aura-de-fogo), `mon-efreeti` (corpo-em-chamas),
  `mon-salamandra` (calor-corporal).
- **Viram `mente`** (medo/pavor/reverência): `mon-archon-cao` (aura-de-menaca), `mon-diabo-do-fosso-pit-fiend`
  (aura-de-medo), `mon-lich` (aura-de-medo), `mon-mumia` (aura-de-desespero), `mon-planetar`
  (aura-sagrada).
- **Ficaram `corpo`**, já corretas (fedor): `mon-ghast` (paralisia-e-fedor), `mon-hezrou`
  (fedor-nauseante).

Também achei e corrigi dois `olhar`/gaze de encantamento que a mesma classe de bug (acento)
tinha deixado em `corpo` quando deviam ser `mente` (encanto): `mon-naga-espirita`
(olhar-encantador) e `mon-ninfa` (beleza-cegante).

**Conferi por amostragem, não linha a linha, o resto dos ~100 poderes formais** (toque, veneno,
domínio, sopro, teia, explosão, presença, canto, regeneração, forma, travessia, invisível,
convocar): os exemplos que o despacho citou como "o padrão antigo errava" (Bodak, os 5 drenos, o
fedor) **já estavam certos** na fase 2 (o bug de acento só afetava a comparação usada em
`aura`/`olhar`; os outros subtipos tinham regra fixa por subtipo, sem essa comparação). Não posso
garantir 100% sem reler as ~100 uma a uma, e não tive tempo nesta rodada; se quiser essa
conferência exaustiva, foi o que ficou de fora.

## Seção 2: os dois gigantes

**Achei uma contradição entre dois documentos, e escolhi um lado, sinalizando aqui.** O despacho
`b14-fase3-despacho.md`, na "Atenção especial", diz "Tempestade 3→5, Nuvens 1→4". O
`decisoes-fase3.md` (seção 2, com a justificativa de magias e CR) diz **Tempestade Centelha 4,
Nuvens Centelha 2**, e o `artes-criaturas.md` originalmente sustentava 5 e 4 mas foi
explicitamente **substituído** pelo `decisoes-fase3.md` "onde discordarem (os dois gigantes)",
regra que o próprio despacho escreveu. Apliquei os números do **`decisoes-fase3.md`** (4 e 2), por
ser o documento que a hierarquia declarada manda vencer, e porque ele vem com o raciocínio
(círculo de magia, CR relativo) escrito, não só o número.

**Confirmado pelo Arquiteto**: os números que apliquei (Tempestade 4, Nuvens 2) estão certos; o
"3→5, 1→4" da "Atenção especial" do despacho foi engano dele ao copiar do `artes-criaturas.md`
(que o próprio `decisoes-fase3.md` rejeita, com justificativa escrita: "o que resolve é tratar o
inato como poder natural" em vez de subir a Centelha para caber magia de alto círculo). Nada a
mudar aqui.

- **Gigante das Nuvens**: Centelha 1→2. Arte: vento 1→2 (só). Levitar e Névoa viraram poder
  natural (`resiste: nenhum`); "Arremesso de rocha" virou ataque de verdade (ver seção 3). Saíram
  as habilidades duplicadas ("Névoa oculta", "Arremesso de rocha", "Passos no vento").
- **Gigante da Tempestade**: Centelha 3→4. Arte: `{raio: 4, vento: 4, agua: 3}` (era
  `{vento: 3, raio: 3, adivinhacao: 2}`, a Adivinhação saiu: "não existe em nenhuma fonte", como o
  despacho pede). "Comandar o clima" virou poder natural (1/dia, 10 min de conjuração, efeito de
  cena). "Ver e ouvir à distância" foi cortado (as duas ocorrências duplicadas que a ficha tinha).

## Seção 3: os 8 disparos

**6 de 8 viraram `ataques` de verdade.** Erínia (Arco longo, catálogo `arco-longo`), Gigante das
Nuvens e Gigante do Fogo (Arremessar rocha, dado 3/2 pelo porte Enorme/Grande), Mantícora
(Espinhos de cauda, com um poder natural à parte só para o limite de uso, 6 rajadas/dia),
Pixie (Flechas do sono, com um poder natural para o efeito opcional sono/amnésia) e Solar (Arco de
luz, com um poder natural para o efeito "mata").

**Achei que o esquema não tinha como um ataque à distância somar Força** (a fórmula do gerador
zerava Força em qualquer ataque `distancia: true`, certo para arco comum, errado para pedra ou
lança arremessada). Acrescentei um campo novo, `arremesso` (booleano, em `ataqueSchema` e no tipo
`Ataque` do editor), e mudei a conta em **dois lugares** (`lib-bestiario.mjs` e `bestia-editor.ts`,
que duplicam a fórmula): `distancia && !arremesso` zera a Força, em vez de só `distancia`. Usei o
campo nas 4 arremessadas (Erínia, os dois gigantes, Mantícora, Solar); Pixie não, porque a tabela
não menciona Força para a flecha dela.

**2 de 8 ficaram fora**: Fogo-fátuo (Choque, "raio; fenômeno: só a Centelha absorve") e Ghaele
(Raio de luz, "luz; fenômeno"). "Fenômeno" é uma regra que hoje só existe no caminho de dano das
Artes (`artes/regras.astro`): nenhum código de `ataques` de criatura sabe fazer um tipo de dano
pular a Absorção normal e ir só contra a Centelha. Dar `tipo: "raio"`/`"luz"` a um ataque comum
não ativa nada disso sozinho (o `soak` do gerador só conhece impacto/corte/perfuração); seria
escrever um número que a mesa não sabe ler direito. Fica como pendência de esquema, não de dado.

## Seção 4: as 7 defesas

Todas as 7 aplicadas. As que dependiam da semente de `gen-elementos.mjs` precisaram mexer no
gerador, não só na ficha (senão o `validate` acusaria ficha e semente divergindo):

- **Gárgula**: `bonus.absorcao: 3`; saiu do `MATERIAL_DE` (script) e da ficha a resistência de
  "pedra" (corte/fogo/perfuração), que a fonte não dá.
- **Treant**: nova exceção no gerador, resistência a perfuração **e impacto** (era só perfuração);
  corte continua normal.
- **Elemental da Terra (Grande)**: ganhou `material: "pedra"` na própria ficha (autodescrita desde
  então, o gerador não semeia mais por cima) e as resistências que "pedra" dá
  (fogo/corte/perfuração). "Carne de Granito" (a habilidade "Corpo de terra" de antes) virou
  `proezaFutura` de verdade: achei a Técnica no catálogo (`tecnicas.json`), `carne-de-granito`, do
  Caminho `pele-de-pedra`, que a ficha já citava em `proezaFutura`, só faltava a técnica.
- **Gigante do Fogo**: exceção nova no gerador, resistência a fogo e fraqueza a gelo (o
  vocabulário fechado não tem "frio", usei a palavra mais próxima).
- **Montão Tropeçante**: exceção nova, ganhou resistência a raio (além da perfuração que já
  tinha); a habilidade "Absorve raio" ficou mais precisa (a resistência corta a metade do dano, e
  esse valor cortado vira cura em vez de sumir).
- **Rakshasa**: exceção nova, resistência a corte e impacto (perfurante passa); `bonus.defesaMental: 4`. Saiu
  a habilidade "Só arma benta fere" (a fonte não sustenta imunidade total).
- **Tarrasque**: sem campo de esquema para "reflete Arte de linha/cone com 1d6"; documentei a
  regra exata na habilidade "Carapaça reflete magia" (texto, não mecânica automatizada).

## Seção 5: locomoção

38 fichas tocadas com as velocidades de `loc-fonte.md`. `Kraken` seguiu a instrução literal
(`terra: 1, natacao: 4, jato: 28`, sobrepondo o que já existia). `Tigre`, `Urso Cinzento` e
`Urso-pardo` não ganharam natação (a fonte não dá o número, como o despacho manda). `Vampiro` e
`Neothelid` não ganharam voo (condicional: forma de morcego e magia constante, não um modo
próprio). O modo `jato` é novo no esquema (`locomocao.jato`, só o Kraken usa).

**Aproveitei a Nota 1 da Revisora** (não exigida por este despacho, mas barata): `mon-roc` e mais
18 fichas tinham `fonte.deslocamento.nota` com "em terra N" escrito desde a fase 1, mas sem
`locomocao.terra` correspondente (a peça andava no chão na velocidade de voo/nado). Extraí o
número de cada nota e gravei `locomocao.terra`. Lista completa: `mon-roc`, `mon-aboleth`,
`mon-cloaker`, `mon-cocatriz`, `mon-diabrete-imp`, `mon-dire-bat`, `mon-elasmosaurus`,
`mon-giant-wasp`, `mon-harpia`, `mon-hawk`, `mon-homunculus`, `mon-pixie`, `mon-pseudodragon`,
`mon-pteranodon`, `mon-quasit`, `mon-raven`, `mon-sea-serpent`, `mon-stirge`, `mon-wyvern`.
**Não toquei a Nota 2** (herança de material dos construtos): fica pendência, como a Revisora já
tinha registrado.

## Seção 6: Artes das 20 conjuradoras

Apliquei o `artes-criaturas.md` inteiro, substituindo (não somando) o `arte` de cada uma das 20
fichas. Apliquei `mon-naga-espirita` como a tabela trouxe (`fascinacao 5, fogo 4, ofuscacao 3,
cura 1`). Para `mon-kraken`, apliquei de início só a parte com citação de Pathfinder (`vento 6,
fascinacao 5`), deixando de fora o `raio 4` que a tabela credita a "(5e) Lightning Storm" por não
ter como conferir a fonte 5e nesta sessão (sem acesso à internet aqui).

**Atualização**: o Arquiteto conferiu as duas linhas na fonte 5e (D&D Beyond/aidedd). Lightning
Storm é ação lendária real do Kraken 5e (três raios em alvos diferentes, dano de raio): acrescentei
`raio: 4` à Arte do Kraken (`{vento: 6, fascinacao: 5, raio: 4}`). As magias da Naga Espírita
(dominate person, hold person, sleep, lightning bolt, blight, dimension door) também são reais do
Spirit Naga 5e; as que o `artes-criaturas.md` deixou de fora (lightning bolt/blight/dimension door)
foram exclusão deliberada do próprio arquivo, não erro meu: nada a mudar em `mon-naga-espirita`.

## Achado fora do escopo dos 6 itens: `gen-monsters.mjs` apagava poder natural novo, calado

Antes de fechar, testei o dado que a MESA e o SITE realmente leem (`monsters.json`), não só a
ficha. **`gen-monsters.mjs` só copiava o formato antigo de poder** (`efeito`/`tipo`/`alvo`/
`arte`/`caminho`) para a saída; todo poder no formato novo (`id`/`nome`/`resiste`/`usos`/`base`/
`ataque`), que é praticamente **todos os poderes gravados na fase 2 e nesta fase, ~113 no total**,
saía do gerador **sem nome, sem resistência, sem uso e sem ataque associado**: só sobrava
`efeito` (a descrição) e `tipo`. O `/bestiario` e a mesa vinham mostrando "→ " vazio para cada um
desde a fase 2. Corrigido: `gen-monsters.mjs` agora copia o formato certo conforme `p.id` existe
ou não. Também tive que ajustar os DOIS lugares que desenham a lista de poderes na tela
(`BestaCard.astro` e `mesa-bestiario.ts`), que assumiam só o campo `alvo` do formato antigo.
Provado no `dist/`: `mon-aboleth` mostra "Muco que transforma pele → resistência de corpo...
(resiste corpo)" no card do bestiário.

Isso também explica por que ninguém tinha pego o bug antes: `npm run validate` nunca olha
`monsters.json` pelo conteúdo dos poderes, só por contagem/formato, e eu só tinha conferido a
ficha-fonte visualmente, não o gerado.

## Verificação

`npm run validate` e `npm run build` verdes. Achei e consertei, no caminho, uma citação de código
envelhecida que meu próprio commit quebrou (`REVISORA.md:1196` apontava `gen-monsters.mjs:166`
para `CAMPOS_MESA`; minha edição empurrou a linha para 207) e um teto de velocidade baixo demais
para os números novos (`velocidade` no esquema ia até 20; dragões anciãos e o jato do Kraken
passam disso, subi para 30). Travessão: zero nas linhas novas. Os três caminhos sujos conhecidos
continuam intactos.

## Arquivos tocados

`scripts/criatura-schema.mjs` (jato, arremesso, teto de velocidade), `scripts/lib-bestiario.mjs`
(arremesso), `scripts/gen-monsters.mjs` (o conserto do poder natural), `scripts/gen-elementos.mjs`
(exceções novas/removidas), `scripts/gen-deslocamento.mjs` (Kraken + as 19 da Nota 1),
`src/lib/bestia-editor.ts` (arremesso), `src/components/BestaCard.astro`,
`src/lib/mesa-bestiario.ts`, `docs/simulacao/REVISORA.md` (a citação), mais ~86 fichas de
`src/data/bestiario/` (poderes/artes/locomoção/defesas/ataques) e os quatro arquivos gerados
(`inimigos.json`, `monsters.json`, `monsters-mesa.json`, `elementos-bestiario.json`,
`deslocamento-bestiario.json`).
