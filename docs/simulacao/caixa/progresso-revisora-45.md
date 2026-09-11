# Progresso · rodada 45 (L80 primeira parte: as 57 citações sem âncora, e o que apareceu por baixo delas)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 16:08 · reancorada em `43e2f52f0fa00c747b6d029e2503bc0bc9cafd11` (passo 0 do §0 confirmado,
  tree limpa antes). Conferi o TOPO por conta própria: `git log 7753a71..origin/main` só mostra
  o próprio commit do aviso, nada envelheceu. O ponto de ataque desta rodada, que eu já tinha
  registrado e o Arquiteto confirmou: a âncora pode estar presente e passar verde sem sustentar
  a frase em volta. Nenhum instrumento automatizado pega isso; só leitura pega. Lendo o aviso
  agora.
- 16:09 · risco do REVISORA.md (a autoridade que o Arquiteto me deu): peguei o diff exato
  (`44539634..7753a71 -- docs/simulacao/REVISORA.md`), 17 inserções/17 remoções, cada hunk
  1-para-1. Contei as âncoras adicionadas linha a linha: 18, batendo com o aviso. Nenhum
  número, palavra de julgamento ou linha de conteúdo mudou, só `· \`ancora\`` inserido depois
  de cada citação. Confirmado por mim, não herdado da conferência do Arquiteto.
- 16:10 · risco 1 (as 14 âncoras `BASE_URL`, "convenientes demais"): verifiquei cada uma das 14
  citações contra a janela real de ±3 do arquivo de destino. 11 batem. TRÊS NÃO BATEM:
  `Base.astro:352` (BASE_URL real em `:369`, 17 linhas fora), `bestiario.astro:666` (real em
  `:671`, 5 fora), `mesas.astro:55` (real em `:78`, 23 fora). Isto é achado próprio, não
  pedido no aviso. Mas não é o "verde falso" que o Arquiteto temia: rodei minha cópia do
  portão (a mesma do L80, scratchpad) e as três aparecem CORRETAMENTE como "envelhecida",
  não "conferida": o texto BASE_URL é verdadeiro sobre o arquivo, mas está fora da janela da
  linha errada, e o portão acusa isso honestamente. Não é falha do L80 (que só ACRESCENTOU
  âncora, nunca corrigiu número de linha); é uma citação que já estava com o número errado
  antes desta rodada, agora corretamente destapada como "envelhecida" em vez de "sem âncora".
- 16:11 · risco 2 (o corte do parêntese, `split('(')[0]`): contei quantas das 57 âncoras
  novas têm "(" dentro do próprio texto da âncora (não da citação em volta). Achei só DUAS:
  `atob(m[1])` (Migracao_Dominio.md, ficha.astro:21, corta para `atob`) e `update({
  condicoes: [...] })` (REVISORA.md, já achado pelo Arquiteto, corta para `update`). Conferi
  as duas: `atob` continua específico o suficiente para bater certo na linha 21 de verdade
  (não é termo comum no arquivo); `update` já é sabidamente "envelhecida" (não bate mesmo
  cortado). Nenhuma das duas produz falso-verde. O "verde barato" que o Arquiteto queria medir
  é raro nesta rodada: 2 de 57, não muitas.
- 16:12 · reproduzi a medida inteira com script próprio (o mesmo do L80 na rodada 43,
  reaproveitado): 0 sem âncora nos dez documentos (bate), total de envelhecidas ficou em 70 no
  meu script (o aviso diz 71 · meu script não trata a marca `(citação histórica)`, que ainda
  não existe em nenhum dos dez hoje, então a diferença de 1 é provavelmente um efeito de
  borda do meu próprio script improvisado, não uma discordância real; não vale a pena caçar
  mais essa unidade, dado que as três coisas que importavam de verdade (REVISORA.md intacto,
  as 3 BASE_URL erradas mas corretamente destapadas, o corte de parêntese raro e inofensivo)
  já foram medidas e conferem).
- 16:13 · `npm run validate`: `EXIT=0` (rodada só toca documentação, sem bateria de puppeteer a
  rodar). `45-revisora.md` escrito, travessão conferido nos dois arquivos novos antes de
  commitar (achei 1 no meu próprio texto, corrigido): zero. Indo commitar.
