# Progresso · rodada 35 (VOZ.md §10: ditado livre + tela da "outra coisa"; e o gancho commit-msg)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 00:30 — reancorada em `082e1899a39a45b21830222731dbc6155a79868f` (passo 0 do §0 confirmado). Lendo o aviso e os três commits agora.
- 00:32 — gancho `commit-msg` testado de verdade (repositório descartável, `sh scripts/hooks/
  commit-msg msg.txt`), 10 casos: baseline, indentado, espaço extra, meio de frase (seguro,
  não mutila), trailer + parágrafo legítimo depois (preservado), bloco completo realista (os
  três padrões saem juntos, limpo). Achados: `co-authored-by:` TODO MINÚSCULO e
  `CO-AUTHORED-BY:` TODO MAIÚSCULO passam direto, sem ser pegos — só "Co-" com a primeira
  letra maiúscula é reconhecido. E um "Co-Authored-By: Claude Silva <...>" (nome humano que
  contém "Claude") é apagado por engano — falso positivo de verdade, o "pior que a doença"
  que o Arquiteto pediu para caçar. Seguindo para os pontos 2-6 do VOZ.md §10.
- 00:35 — ponto 2 (nota da decisão 4) confirmado: `grid.astro:8575` tem mesmo o comentário
  citado, e não achei nenhum estado de seleção por clique em lugar nenhum do arquivo. Pontos
  4/5 conferidos no código: `prepararReconhecedor` só é chamado num lugar
  (`grid.astro:8963`), `undefined` só quando `ditado` é truthy, que só vem de
  `elementoDeDitadoLivre()` contra os três ids fixos; `campoVisivel` lê `style.display`, a
  MESMA propriedade que `abrirOutra` já escreve para esconder `ou-quando` — nunca diverge.
  **Ponto 3, achado real:** `vozStatus('ouvindo…')` é igual nos dois modos (comando e
  ditado) — não há nenhum sinal visual/textual dizendo qual reconhecedor está ativo enquanto
  a tecla está segurada. É exatamente o estado que o Arquiteto pré-classificou como CORRIGE.
  Rodando `test-grid.mjs` completo em segundo plano para conferir a cena nova ao vivo.
- 00:41 — o processo TINHA terminado (exit 0, lido do arquivo de saída, não do aviso do
  Arquiteto nem por presunção): a linha final do `Grid OK` já cita "o caminho quente da voz
  abrindo o cartão vencido sem clique... o ditado livre seguindo o foco e 'outra coisa'
  abrindo por voz" — `cenaVozDitadoEOutra` rodou e passou dentro do smoke inteiro, conferido
  por mim, não só pelo relato do aviso. `npm run validate` ainda falta rodar. Escrevendo o
  veredito agora, com o gancho como CORRIGE endereçado ao Arquiteto (os dois achados já são
  dele, direção de conserto já proposta por ele — minha parte é criticar essa direção).
- 00:42 — `npm run validate`: exit 0, rodado por mim. Veredito escrito (`35-revisora.md`):
  SEGUE, com dois CORRIGE (o gancho, endereçado ao Arquiteto; e `vozStatus` não distinguir
  modo comando de ditado livre). Todos os outros pontos (2/4/5/6) confirmados limpos.
  Commitando os dois arquivos juntos e empurrando agora. Terminado.
