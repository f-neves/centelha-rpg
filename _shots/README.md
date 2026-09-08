# _shots

Screenshots de inspeção visual, tiradas por Puppeteer contra o dev server ou contra um HTML de
bancada. Gitignorada (`.gitignore`, exceto este README): é descartável por natureza, apagada e
refeita sempre que alguém precisa olhar de novo.

**Apagada por inteiro em 08/09/2026** (449 arquivos acumulados, nenhum com dono). Regenerável:
rode qualquer um dos scripts abaixo, com o `npm run dev` de pé quando o script não sobe o próprio
servidor.

| script | o que fotografa |
|---|---|
| `node scripts/shot.mjs` | páginas soltas do site, tema claro/escuro, por parâmetro |
| `node scripts/shot2.mjs` | o rolador, depois de preencher bônus e alvo e rolar |
| `node scripts/shot3.mjs` | o hovercard de um link de pré-requisito, na página de um Caminho |
| `node scripts/shot-conjurar.mjs [pasta]` | a caixa de conjuração no Grid, banco de mentira da bancada (controles de manifestação, lista de moldes) |
| `node scripts/shot-equip.mjs` | a área de equipamento da ficha com armadura empilhada (conferir Absorção por modo) |
| `node scripts/shot-conv.mjs` | `conversao-monstros.html`, aberto direto do disco (`file://`) |
| `node scripts/test-luas.mjs` | grava aqui como efeito colateral do próprio teste de luas |
| `node scripts/test-editor-bestiario.mjs` | idem, efeito colateral do teste do editor de bestiário |

Nenhum está no `npm run smoke`: são ferramenta de inspeção manual (o olho decide), não portão
automático — a distinção que `provas/README.md` já registra para as bancadas de prova visual.

`_dev.log`/`_deverr.log`, quando aparecem aqui, são log do dev server subido por
`scripts/dev-server.mjs` para os scripts que precisam dele (`shot-conjurar.mjs`,
`shot-equip.mjs`). Descartáveis do mesmo jeito.
