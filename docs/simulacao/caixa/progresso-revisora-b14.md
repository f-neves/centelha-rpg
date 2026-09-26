# Progresso · revisão B14 fase 1

- Reancorada em `5215d59` (branch `revisora`), 2026-09-26.
- Reader search (git grep nos dois shas) confirma os 7 satélites apagados sem leitor.
- Mutação de `arqueiro.json` (destreza, descrição) propaga para `inimigos.json`/`monsters.json`: a pasta é fonte de verdade, não passthrough.
- Controle negativo do `5acefb0`: revertido o hunk, urso de teste caiu no passo do soldado (3·5·7); restaurado, caiu no passo da semente (4·6·9); test-deslocamento confirma nos dois sentidos.
- Citações reescritas à mão (lib-bestiario.mjs:44-45, :68, :44) conferidas, batem com o conteúdo.
- Travessão: recontado com Node (não grep) em src/data/bestiario/, 2 ocorrências, ambas em fonte.nota, confirmadas verbatim em conversao-monstros.html do d884b4a.
- Contagens categoriaLegada (161), descricaoLegada (49), espantalho furtividade declarada vs derivada, locomocao por modo (0 divergências em 309), equip.armaduras (11) e conjuntos vazio, ordem sem repetição (309) — todas batem com o relato.
- Negative control do schema (.strict()): chave "willpowr" acusada e revertida.
- Aguardando o run "Validar dados e regras" do sha 5215d59 terminar (só falta o job test-grid, ~10min de praxe).
