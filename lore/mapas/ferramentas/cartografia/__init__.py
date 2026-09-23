"""Da biblioteca de símbolos ao mapa desenhado (noite 2, 2026-09-23).

Módulos: `recorte` (folhas de símbolos -> PNGs com transparência + manifesto),
`reducao` (tiras de legibilidade por tamanho), `raster` (área pintada -> máscara com
borda irregular e determinística), `renderizador` (máscara + símbolos -> imagem).
Nenhum deles é importado pelo servidor: são ferramentas de linha de comando, com os
scripts em `scripts/`.
"""
