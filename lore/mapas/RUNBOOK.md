# RUNBOOK · o mapa de Uldun do zero, numa máquina nova

Passo a passo, do clone ao mapa final. Cada passo diz o comando, o que precisa existir
antes, quanto tempo e memória ele pede (medido nesta máquina: Windows 10, 16 GB de
RAM, em 2026-09-23), e o que fazer se falhar. Escrito na empreitada da noite de
2026-09-23 (C3). Os tempos são desta máquina; numa mais lenta, conte o dobro.
**Número marcado "medido" foi medido nesta empreitada; os outros são estimativa** (e
estão escritos com "uns" ou "~"), porque rodar de novo alguns passos reescreveria
arquivo do git sem necessidade.

**A regra da memória** (CARTOGRAFO, "Regras invioláveis"): tudo o que lê a máscara de
10240 px é processamento pesado. Feche navegadores e outras sessões do Claude, e
**nunca** rode renderização pesada com o servidor da ferramenta no ar.

## 0. O que o git traz, e o que não traz

| vem no git | NÃO vem no git (copiar à mão ou regerar) |
|---|---|
| `mascaras/costa_10240.png` (a costa oficial, a única coisa indispensável) | `fonte/` (Mapa.psd, SVGs, Mapa Teste.jpg e Mapa Teste1.jpg): **copiar à mão** |
| `dados/*.json` e `*.geojson` commitados (coordenadas, regiões, massas, símbolos, travas, camadas de referência, medições, tamanhos mínimos) | `referencias/` (as 4 imagens do ChatGPT e `ocean_deep_exportado.png`, 400 MB): **copiar à mão** |
| `icons/` (as 9 folhas de símbolos) | `simbolos/` (os 90 símbolos recortados): **regerar** (passo 4) |
| todo o código em `ferramentas/` e os testes | `render/` inteiro (tiles, cache de ilha, prévias, exportações): **regerar** (passos 3, 5, 7, 8) |
| os documentos (`CARTOGRAFO.md`, os dois ESPEC, este RUNBOOK, os relatórios) | `ferramentas/.venv/`: **criar** (passo 2) |
| | os DADOS DE EXEMPLO (áreas, lugares, rios, estradas, rotas, nomes, elementos de exemplo) e `dados/exportacoes.jsonl`: não foram commitados de propósito; ver passo 9 |

## 1. Clone e conferência do git

```sh
git clone <repositório> && cd rpg-system
git config core.hooksPath scripts/hooks
cd lore/mapas/ferramentas
```

A conferência que toda sessão do mapa faz (`scripts/conferir_git.py`) espera
`core.hooksPath = scripts/hooks`. Segundos, memória desprezível.

## 2. O ambiente Python

```sh
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt
```

Python 3.14 nesta máquina. `requirements.txt` é o `pip freeze` (FastAPI, uvicorn,
numpy, Pillow, shapely, pytest). **Nada mais é instalado**: sem scipy, sem Node para a
ferramenta. Uns 2 minutos com internet (estimativa). Fontes: as do Windows (Palatino Linotype, com
Georgia de reserva); em outro sistema, `cartografia/tipografia.py` cai na fonte padrão
do Pillow, que funciona e fica feia.

## 3. Os tiles da costa e do mar (a ferramenta precisa deles para abrir o mapa)

```sh
.venv/Scripts/python.exe scripts/gerar_tiles.py --confirmo
```

Lê `mascaras/costa_10240.png` inteira. **Pesado**: uns 10 s (registrado no CARTOGRAFO,
"Clone novo"), memória não medida (deve ficar abaixo de 1 GB: a máscara tem 100 MB). Sem
`--confirmo` só mostra o que faria. Saída: `render/tiles/costa` e `render/tiles/mar`.

Opcionais (camadas de referência, só se os originais foram copiados):
- rótulos: `scripts/gerar_rotulos.py` (exige `fonte/Mapa Teste.jpg` e `Mapa Teste1.jpg`);
- batimetria: `scripts/extrair_ocean_deep.py` (exige `referencias/ocean_deep_exportado.png`).

## 4. A biblioteca de símbolos

```sh
.venv/Scripts/python.exe scripts/recortar_simbolos.py
```

Recorta as folhas de `icons/` em `simbolos/` (fora do git) e confere com o manifesto
`dados/simbolos.json` (no git). Tempo e memória não medidos nesta empreitada
(estimativa: menos de 1 minuto, menos de 1 GB). **O renderizador não funciona sem
isso** (os PNGs dos símbolos).

Os tamanhos mínimos medidos (`dados/tamanho-minimo-*.json`) já estão no git; para
remedir: `scripts/medir_legibilidade.py` (estimativa: alguns minutos).

## 5. O cache de identidade de ilha

```sh
.venv/Scripts/python.exe scripts/gerar_cache_ilhas.py
```

**Pesado, com o servidor parado.** Medido: **4,7 s, pico de 271 MB**, 435 componentes.
Recusa começar com menos de 1,2 GB livres. Saída: `render/cache-ilhas/` (200 MB). Sem
ele: "identificar ilha" e massa nova não funcionam, o recorte de exportação por
região cai no retângulo em volta do rótulo, e o nome de região sai sempre reto.

## 6. Os testes

```sh
.venv/Scripts/python.exe -m pytest -q
```

**Medido**: 380 testes em 2 min 15 s (a última rodada completa desta empreitada;
os de composição, exportação e distorção leem a costa de verdade). Memória não medida. Tem de dar tudo verde. Se os testes do mar pularem, falta o passo 3; se os
do renderizador falharem por arquivo, falta o passo 4.

## 7. A ferramenta de pintura

```sh
.venv/Scripts/python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8420
```

Abrir `http://127.0.0.1:8420/` e **recarregar com Ctrl+F5** depois de atualizar o
código (o navegador guarda os `.js` antigos). O servidor em si usa pouca memória
(~250 MB); as exportações pela tela rodam num processo separado e são recusadas acima
de 60 Mpx. **Derrube o servidor antes do passo 8.**

## 8. O mapa final

- **Um recorte para os jogadores** (região ou retângulo, mestre ou jogador, PNG ou
  PDF, com ou sem distorção):

  ```sh
  .venv/Scripts/python.exe scripts/exportar.py --regiao calin
  .venv/Scripts/python.exe scripts/exportar.py --regiao mere --versao jogador --pdf A3 --destinatario Ana
  .venv/Scripts/python.exe scripts/exportar.py --regiao calin --distorcao 2 --mercador "Velho Tobias"
  ```

  **Medido**: Calin a 1.600 px em 13 s; Mére a 2.200 px em 24 s, e a 2.400 px em 28 s
(35 s com distorção). Pico não medido nesses; o do mundo inteiro, que é o maior, foi
1,1 GB. Saída em
  `render/exportacoes/`, registro em `dados/exportacoes.jsonl`.
- **Os cinco níveis de distorção lado a lado**: `scripts/comparar_niveis.py --regiao
  calin` (**medido**: 5 exportações de 8 a 9 s, uns 45 s ao todo).
- **O mundo inteiro** (mapa de teste, com tudo):

  ```sh
  .venv/Scripts/python.exe scripts/mapa_do_mundo.py --fator 4    # medido: 2.738 px, 19 s, pico 437 MB
  .venv/Scripts/python.exe scripts/mapa_do_mundo.py              # oficial, 10.240 px + moldura
  ```

  Oficial, **medido**: 150 s (51 s de planejamento, 81 s de composição), pico de
  **1,1 GB**, saída de 10.956 x 10.956 px (12 MB em PNG) e uma cópia pela metade.

  Em blocos de 1.024 linhas; o script prova que a junção não tem costura (redesenha
  uma faixa que atravessa a junção como bloco único e compara byte a byte) e grava o
  resultado em `render/mundo-<fator>-relatorio.json`. Recusa a resolução oficial com
  menos de 1,8 GB livres.
- **Prévias por região, no renderizador antigo** (o da etapa 11, janela por janela):
  `scripts/renderizar_regiao.py mere --rapido` (~4 s) ou sem `--rapido` (~17 s).

## 9. Os dados de exemplo (se quiser ver o mapa cheio antes de pintar)

Com o servidor no ar:

```sh
.venv/Scripts/python.exe scripts/pintar_exemplos.py --gravar      # 22 áreas irregulares
.venv/Scripts/python.exe scripts/exemplos_parte_b.py              # lugares, rios, vias, rotas, nomes, elementos
```

Tudo marcado como exemplo; `exemplos_parte_b.py --apagar` desfaz o segundo (os ids
ficam em `render/analise/exemplos-parte-b.json`). O primeiro apaga e recria os
`exemplo-*` de área a cada vez. Uns 30 s cada (estimativa). Os elementos de cartografia (rosa,
escala, cartela, monstro) também saem do botão "criar os que faltam" no painel
ELEMENTOS.

## 10. O PSD de montagem

Manual, fora do escopo da automação (não há API oficial da Adobe para objeto
inteligente vinculado). O passo a passo é do usuário; a entrada é o PNG do passo 8.

## Se algo falhar

| sintoma | causa provável | o que fazer |
|---|---|---|
| mapa em branco na ferramenta | faltam os tiles | passo 3 |
| `FileNotFoundError` em `simbolos/...` | falta a biblioteca | passo 4 |
| "o cache de ilha não foi gerado" | falta o cache | passo 5 |
| exportação recusada "grande demais" | mais de 60 Mpx | diminua a largura ou use o script |
| a máquina trava | renderização pesada com outra coisa pesada no ar | derrube o servidor, feche o navegador, rode de novo |
| os `.js` novos não aparecem | cache do navegador | Ctrl+F5 |
| commit recusado pelo gancho | `core.hooksPath` errado | passo 1 |
