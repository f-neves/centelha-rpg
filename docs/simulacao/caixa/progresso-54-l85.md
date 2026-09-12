# Progresso · rodada 54 · L85

Sinal de vida da Executora. Uma linha por etapa pequena, hora real (`date +%H:%M`).

- 11:27 · Rodada aberta (`npm run rodada`). Tarefa: a régua do empurrão
  elemental, hoje governada por `escolhas['Força']` (inexistente nos doze
  efeitos de movimento, cai no Alcance escolhido). A regra completa: FAH =
  nível×7 − 2 (tabela de levantamento, o que a Arte ERGUE); FAA =
  (nível+Acerto Arcano)×2 (tabela de arremesso, `alcance = 7×FAA^0,7÷peso^0,4`,
  saturação abaixo do ápice); teto de arremesso = 1/4 do que se ergue. Acima do
  teto de arremesso: não voa, é derrubado (distância 0 + `caido`). Acima do
  teto de erguer: nada acontece. Levantamento antes do código, três perguntas:
  a tabela de arremesso (`ficha-engine.ts`) sai limpa para um lugar
  compartilhado ou está enredada no desenho da ficha; o Grid conhece o Acerto
  Arcano de quem conjura; `forca.levantamento[fah]` é alcançável do Grid. Prova
  exigida: teste comparando a distância contra a tabela em 3+ portes,
  incluindo um acima de cada teto, com asserção própria para cada um. Fora de
  escopo: L86 (cura), L94 (só o caso do aliado hoje), a disputa do L83
  (precisa de peça nova). Commitar cada eixo ao fechar, antes de abrir o
  próximo.
- 11:30 · Levantamento antes do código, as três perguntas medidas direto no
  código, não por memória. (1) A conta de arremesso (`dist(w)` em
  `ficha-engine.ts:1585-1589`, usando sete constantes de `regras.json.forca` +
  a tabela `levantamento`) é uma função PURA de `(faa, peso)`: não toca DOM
  nem estado da ficha (`S`/`el`/`A`/`SK`). Só a chamadora (`renderForca`) é
  que deriva `fah`/`faa` das perícias do personagem, e essa parte NÃO serve
  ao Grid (a Arte já tem sua própria fórmula de FAH/FAA, diferente). Sai
  limpa para um lugar compartilhado. (2) `forca.levantamento[fah]` é
  trivialmente alcançável: `regras.json` é JSON puro importado direto (não é
  content collection), do jeito que `ficha-engine.ts` já faz. (3) Acerto
  Arcano: PC tem (`FICHAS[personagem_id]?.skills2?.['acerto-arcano']`,
  confirmado pelo padrão `S.skills2[slug(nome)]` em `ficha-engine.ts`), mas
  **CRIATURA NÃO TEM NENHUM CAMPO PARA ISSO**: conferido nas 309 entradas de
  `monsters-mesa.json`, o `pericias` de bestiário só cobre
  prontidao/esquiva/integridade/sociabilidade/furtividade, `acerto-arcano` em
  zero delas. 77 criaturas têm `artes` (podem conjurar Empurrão), e nenhuma
  tem de onde tirar o FAA. `CONJURACAO.md` confirma o gatilho já é conhecido
  (item 9 da régua: "o teste de Vontade + Acerto Arcano rodando de verdade...
  é o primeiro", ainda não implementado para NENHUM caminho). Bloqueio real,
  reportando ao Arquiteto antes de escrever qualquer linha, como pedido.
- 11:42 · Destravada: AA segue com 0 (estrutural, não exceção), peso fica
  fora (L95, item novo), duas asserções extras pedidas (peso 0 finito, uma
  implementação só). Eixo 1 fechado: `src/lib/forca-empurrao.ts` novo, com
  `pesoMaximoErguido(fah, F)` (o teto de erguer) e `alcanceArremesso(faa,
  peso, maxKg, F)` (o teto de arremesso embutido, devolve 0 acima dele e
  também para peso <= 0, guarda ANTES da divisão por peso). `ficha-engine.ts`
  chama as duas agora; conferido por grep que `cabeca`/`qIni`/as sete
  constantes de `arremesso*` sumiram de lá (uma implementação só). `npx tsc
  --noEmit` e `npm run validate` verdes (o `test-kael.mjs` dentro do
  validate prova que a extração não mudou nenhum número da ficha).
- 11:35 · Duas correções depois de um segundo conselho (advisor) antes de
  escrever qualquer código: (1) a caracterização do achado 1 estava errada no
  progresso acima: `dist(w)` NÃO é pura só de `(faa, peso)`, ela fecha sobre
  `tetoKg`/`apice`/`qIni`, que vêm de `maxKg = F.levantamento[fah]`. A
  assinatura certa da função compartilhada precisa de `fah` (ou `maxKg`) E
  `faa`, não só `faa`. (2) Acerto Arcano não é bloqueio: a fórmula fecha com
  `0` (FAA = nível×2 quando Acerto Arcano é 0), só fica mais fraca para
  criatura do que para PC. Vou propor prosseguir com esse padrão salvo veto.
  Conferido também: domínio de FAH. Nível 1 a 6 (o teto da trilha de Artes)
  dá FAH 5/12/19/26/33/40, TODOS presentes na tabela `levantamento`
  (3 a 40, sem buraco nenhum), batendo exatamente com os pesos que o próprio
  humano citou no despacho (60/195/360/550/775/1000 kg). Vou espelhar o
  mesmo grampo defensivo que `ficha-engine.ts` já usa (`Math.max(3,
  Math.min(40, fah))`) mesmo assim, por segurança.
- 11:40 · Achado NOVO, fora das três perguntas do levantamento mas
  diretamente ligado ao peso que os dois tetos usam: `MON[...].dimensoes
  ?.pesoKg`, lido em `artes-grid-mesa.ts:1224`, **não existe**. O campo real
  do bestiário é `dimensoes.peso`, uma STRING solta ("70 kg", "2,7 t"), não
  um número em `pesoKg`. Resultado: a leitura de peso real SEMPRE falha
  (`Number(undefined)` = `NaN`), e o código já cai sempre no
  `pesoDoPorte(alvo)` (estimativa por porte), silenciosamente, para as 309
  criaturas, mesmo quando o peso de verdade está escrito na ficha. Medido o
  formato: 266 de 309 batem um padrão limpo (`número[,número] unidade`,
  kg/t/g); 43 têm texto livre (faixas "de 9 a 23 kg", qualificadores "14 t
  (...)", "sem peso, forma incorpórea", "insignificante por indivíduo").
  Reportando ao Arquiteto antes de decidir se entra no escopo desta rodada
  (a régua nova lê peso duas vezes, nos dois tetos, então um peso errado
  afeta os dois).
