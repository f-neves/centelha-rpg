---
name: mapa-mundo
description: Ferramenta de geração do mapa-mundo de Centelha (Uldun) — pinta regiões, gera rios/símbolos/cidades a partir do que o usuário marcou, e monta o PSD final. Use quando a tarefa envolver lore/mapas, o mapa de Uldun, ou qualquer arquivo em lore/mapas/fonte, mascaras, dados, simbolos, render, photoshop ou ferramentas.
---

# Mapa-mundo (Uldun)

Esta skill ainda está mínima. O corpo dela (comandos, scripts, passo a passo da
ferramenta de pintura) é escrito numa etapa seguinte, conforme a ferramenta descrita em
`lore/mapas/CARTOGRAFO.md` for construída.

## Obrigação, antes de qualquer ação

**Leia `lore/mapas/CARTOGRAFO.md` inteiro antes de fazer qualquer coisa neste
projeto.** Ele é o documento central: tem as decisões já tomadas, o sistema de
coordenadas, a estrutura de pastas e a lista de decisões em aberto. Nada aqui
substitui essa leitura.

## Regras invioláveis (repetidas do CARTOGRAFO.md, valem sempre)

- A costa de terra e mar é definitiva. Nenhuma etapa altera, cria ou apaga terra.
- Originais nunca são modificados ou sobrescritos. `fonte/Mapa.psd` só é aberto para
  leitura por automação COM e fechado sem salvar.
- Nada é instalado sem ok explícito do usuário.
- Nenhum commit sem ok do usuário. Arte pesada nunca vai para o git.
- Antes de processamento pesado (o PSD inteiro, imagens de 10240px ou mais), avisar
  para fechar navegadores e outras sessões do Claude (máquina com 16 GB de RAM).
- Nada de inventar API: o que não estiver documentado ou testado, dizer isso
  explicitamente em vez de supor.
