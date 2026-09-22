"""Alinhamento automático das 4 imagens de referência do ChatGPT contra a costa
oficial (item A2 da rodada noturna de 2026-09-22).

Método (sem rotação, por pedido explícito do usuário): classifica cada imagem em
terra/mar por cor, reduz as duas máscaras (a da imagem e a costa oficial) para uma
grade pequena, e busca a escala + posição (independentes em X e Y, mas sem girar)
que MAXIMIZA A INTERSEÇÃO SOBRE UNIÃO (IoU) das áreas de terra — não a cobertura
simples, que premiaria esticar a imagem até ela cobrir o mundo inteiro de qualquer
jeito (achado do controle negativo abaixo).

NÃO é processamento pesado pela regra do CARTOGRAFO.md: as imagens do ChatGPT têm
1254x1254px (confirmado nesta sessão) e a costa oficial (10240px) é reduzida a uma
grade pequena (128x128) uma única vez, igual a qualquer redimensionamento comum —
o que a regra proíbe é abrir/varrer a imagem em resolução nativa, o que este script
não faz com a costa.

Controle negativo do próprio alinhador (antes de tentar as 4 imagens de verdade):
- a costa contra ELA MESMA tem que dar IoU perto de 100%;
- a costa contra uma cópia rotacionada 90° tem que dar IoU baixo (esse valor vira o
  piso documentado para decidir se uma imagem "não serve como guia de posição").

Uso (venv, só Pillow+numpy, sem automação COM):
    .venv/Scripts/python.exe scripts/alinhar_chatgpt_auto.py

Sempre roda (não precisa de --confirmo: não é pesado e não apaga nada por si só),
mas só GRAVA em dados/camadas_referencia.json quando chamado com --gravar; sem essa
flag só imprime o relatório e gera as prévias em render/analise/.
"""

import json
import os
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_COSTA = RAIZ_MAPAS / "mascaras" / "costa_10240.png"
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "camadas_referencia.json"
PASTA_REFERENCIAS = RAIZ_MAPAS / "referencias"
PASTA_ANALISE = RAIZ_MAPAS / "render" / "analise"

RESOLUCAO_MUNDO = 10240
G = 128  # grade de trabalho (mundo) -- pequena de propósito, não é processamento pesado
LIMIAR_SERVE_COMO_GUIA = None  # calculado a partir do controle negativo, ver main()

IMAGENS = [
    "ChatGPT Image 15 de jul. de 2026, 16_21_08.png",
    "ChatGPT Image 15 de jul. de 2026, 16_30_50.png",
    "ChatGPT Image 15 de jul. de 2026, 17_20_46.png",
    "ChatGPT Image 15 de jul. de 2026, 17_56_20.png",
]
ID_POR_ARQUIVO = {
    IMAGENS[0]: "chatgpt-1",
    IMAGENS[1]: "chatgpt-2",
    IMAGENS[2]: "chatgpt-3",
    IMAGENS[3]: "chatgpt-4",
}


def carregar_costa_grid() -> np.ndarray:
    """Reduz mascaras/costa_10240.png (255=terra, 0=mar) para GxG, fração de terra
    por célula (0..1), via filtro BOX (média -- reamostragem comum, não varredura)."""
    with Image.open(CAMINHO_COSTA) as im:
        reduzida = im.resize((G, G), Image.BOX)
        return np.asarray(reduzida, dtype=np.float64) / 255.0


def classificar_terra_mar(im_rgb: np.ndarray) -> np.ndarray:
    """Heurística de cor: mar tende ao azul-acinzentado, terra a tons quentes
    (bege/verde/marrom/branco de neve). `im_rgb` é uint8 (H,W,3). Devolve booleano
    terra=True. Heurística documentada como tal -- não é ground truth, e a nota de
    sobreposição (IoU) é o jeito do script se autoavaliar em cima dela."""
    r = im_rgb[:, :, 0].astype(np.int16)
    g = im_rgb[:, :, 1].astype(np.int16)
    b = im_rgb[:, :, 2].astype(np.int16)
    dominancia_azul = b - (r + g) // 2
    mar = dominancia_azul > 12
    return ~mar


def reduzir_para_grade(mascara_bool: np.ndarray, tamanho: int) -> np.ndarray:
    im = Image.fromarray((mascara_bool.astype(np.uint8)) * 255, mode="L")
    reduzida = im.resize((tamanho, tamanho), Image.BOX)
    return np.asarray(reduzida, dtype=np.float64) / 255.0


def iou(costa_grid: np.ndarray, img_grid_amostrada: np.ndarray, mascara_valida: np.ndarray) -> float:
    """IoU só dentro da área onde a imagem tem dado (mascara_valida) -- fora da
    imagem não conta nem como interseção nem como união, porque a imagem
    simplesmente não opina sobre aquele pixel do mundo."""
    c = costa_grid[mascara_valida]
    im = img_grid_amostrada[mascara_valida]
    intersecao = np.minimum(c, im).sum()
    uniao = np.maximum(c, im).sum()
    if uniao < 1e-9:
        return 0.0
    return float(intersecao / uniao)


CELULA_MUNDO = RESOLUCAO_MUNDO / G
_YS, _XS = np.mgrid[0:G, 0:G]
_X_MUNDO = (_XS + 0.5) * CELULA_MUNDO
_Y_MUNDO = (_YS + 0.5) * CELULA_MUNDO

# Cobertura mínima do mundo pela imagem mapeada, em fração da grade (achado desta
# rodada: sem este piso, o otimizador encontra "IoU alto" numa quina minúscula da
# imagem que por acaso cai dentro do mundo -- ex.: bounds com norte=107°N, quando o
# limite real é 68,8°N -- e ignora o resto da imagem inteiramente. Não é a mesma
# armadilha da cobertura simples (que premiava esticar demais); é o oposto: premiar
# encolher demais. As duas se resolvem com a mesma exigência -- uma fração mínima
# do MUNDO tem que estar dentro da imagem mapeada.
COBERTURA_MINIMA_MUNDO = 0.15


def avaliar_candidato(costa_grid, img_grid_img_px, tam_img_grid, ox, oy, sx, sy):
    """ox, oy, sx, sy em pixel de MUNDO (10240px). Devolve (IoU, fração do mundo
    coberta). `img_grid_img_px` é a máscara de terra da imagem já reduzida para
    tam_img_grid x tam_img_grid, célula = 1254/tam_img_grid px de imagem."""
    escala_celula_img = 1254.0 / tam_img_grid

    u = (_X_MUNDO - ox) / sx  # pixel de imagem, eixo x
    v = (_Y_MUNDO - oy) / sy

    dentro = (u >= 0) & (u < 1254) & (v >= 0) & (v < 1254)
    fracao_coberta = dentro.mean()
    if fracao_coberta < COBERTURA_MINIMA_MUNDO:
        return -1.0, fracao_coberta

    ui = np.clip((u / escala_celula_img).astype(np.int64), 0, tam_img_grid - 1)
    vi = np.clip((v / escala_celula_img).astype(np.int64), 0, tam_img_grid - 1)

    amostrado = np.zeros((G, G), dtype=np.float64)
    amostrado[dentro] = img_grid_img_px[vi[dentro], ui[dentro]]

    return iou(costa_grid, amostrado, dentro), fracao_coberta


def buscar_melhor_alinhamento(costa_grid, img_rgb_arr):
    t0 = time.time()
    terra_img = classificar_terra_mar(img_rgb_arr)
    tam_img_grid = 64
    img_grid = reduzir_para_grade(terra_img, tam_img_grid)

    # Busca grossa: escala uniforme (largura mundial da imagem, em px) + offsets.
    larguras_candidatas = np.geomspace(1024, 15360, 15)
    passo_offset_grosso = RESOLUCAO_MUNDO / 12
    offsets_grossos = np.arange(-RESOLUCAO_MUNDO * 0.5, RESOLUCAO_MUNDO * 1.0, passo_offset_grosso)

    melhor = None
    for largura in larguras_candidatas:
        s = largura / 1254.0
        for ox in offsets_grossos:
            for oy in offsets_grossos:
                pontuacao, _ = avaliar_candidato(costa_grid, img_grid, tam_img_grid, ox, oy, s, s)
                if melhor is None or pontuacao > melhor[0]:
                    melhor = (pontuacao, ox, oy, s, s)

    # Refino: em volta do melhor grosso, grade mais fina e escala X/Y independentes.
    _, ox0, oy0, sx0, sy0 = melhor
    for _ in range(2):
        deltas_offset = np.linspace(-passo_offset_grosso, passo_offset_grosso, 7)
        deltas_escala = np.linspace(0.85, 1.15, 5)
        for fsx in deltas_escala:
            for fsy in deltas_escala:
                for dox in deltas_offset:
                    for doy in deltas_offset:
                        pontuacao, _ = avaliar_candidato(
                            costa_grid, img_grid, tam_img_grid,
                            ox0 + dox, oy0 + doy, sx0 * fsx, sy0 * fsy,
                        )
                        if pontuacao > melhor[0]:
                            melhor = (pontuacao, ox0 + dox, oy0 + doy, sx0 * fsx, sy0 * fsy)
        _, ox0, oy0, sx0, sy0 = melhor
        passo_offset_grosso /= 3

    pontuacao, ox, oy, sx, sy = melhor
    _, fracao_coberta = avaliar_candidato(costa_grid, img_grid, tam_img_grid, ox, oy, sx, sy)
    tempo = time.time() - t0
    return {
        "iou": pontuacao,
        "fracao_mundo_coberta": fracao_coberta,
        "ox_px_mundo": ox,
        "oy_px_mundo": oy,
        "sx_px_mundo_por_px_imagem": sx,
        "sy_px_mundo_por_px_imagem": sy,
        "tempo_s": tempo,
    }


def controle_negativo(costa_grid) -> dict:
    """A costa contra ela mesma (identidade) tem que dar IoU alto; contra uma
    cópia girada 90° tem que dar IoU baixo -- vira o piso documentado."""
    identidade = iou(costa_grid, costa_grid, np.ones_like(costa_grid, dtype=bool))
    girada = np.rot90(costa_grid)
    rotacionada = iou(costa_grid, girada, np.ones_like(costa_grid, dtype=bool))
    return {"iou_identidade": identidade, "iou_rotacionada_90": rotacionada}


def px_mundo_para_bounds(ox, oy, sx, sy) -> dict:
    """Converte (ox, oy em px de mundo, canto superior-esquerdo da imagem; sx, sy
    em px-mundo por px-imagem) para bounds em lat/lon, usando dados/coordenadas.json
    -- mesma fórmula do backend, sem duplicar número."""
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from backend.coordenadas import carregar_coordenadas  # noqa: E402

    dados = carregar_coordenadas()
    projecao = dados["projecao"]
    referencia = dados["referencia"]
    px_por_grau = projecao["px_por_grau"]
    x0 = referencia["x_meridiano_zero_px"]
    y0 = referencia["y_equador_px"]

    def lon_de(x_px):
        return (x_px - x0) / px_por_grau

    def lat_de(y_px):
        return (y0 - y_px) / px_por_grau

    x_esq = ox
    x_dir = ox + sx * 1254
    y_topo = oy
    y_base = oy + sy * 1254

    lon_esq, lon_dir = lon_de(x_esq), lon_de(x_dir)
    lat_topo, lat_base = lat_de(y_topo), lat_de(y_base)

    return {
        "oeste": min(lon_esq, lon_dir),
        "leste": max(lon_esq, lon_dir),
        "sul": min(lat_topo, lat_base),
        "norte": max(lat_topo, lat_base),
    }


def gerar_previa(caminho_img, costa_grid, resultado, destino):
    """Sobrepõe a imagem alinhada (semi-transparente, vermelho) à costa oficial
    reduzida (cinza), em render/analise/. Prévia pequena (G=128), não pesado."""
    fundo = Image.fromarray((costa_grid * 255).astype(np.uint8), mode="L").convert("RGB")
    fundo = fundo.resize((512, 512), Image.NEAREST)

    with Image.open(caminho_img) as im:
        im_rgb = np.asarray(im.convert("RGB"))
    terra_img = classificar_terra_mar(im_rgb)
    overlay_img = Image.fromarray((terra_img.astype(np.uint8)) * 255, mode="L")

    sx = resultado["sx_px_mundo_por_px_imagem"]
    sy = resultado["sy_px_mundo_por_px_imagem"]
    ox = resultado["ox_px_mundo"]
    oy = resultado["oy_px_mundo"]
    escala_tela = 512 / RESOLUCAO_MUNDO
    largura_tela = max(1, round(sx * 1254 * escala_tela))
    altura_tela = max(1, round(sy * 1254 * escala_tela))
    overlay_redim = overlay_img.resize((largura_tela, altura_tela), Image.NEAREST)

    camada = Image.new("RGBA", fundo.size, (0, 0, 0, 0))
    vermelho = Image.new("RGBA", overlay_redim.size, (220, 30, 30, 130))
    camada.paste(vermelho, (round(ox * escala_tela), round(oy * escala_tela)), overlay_redim)

    composto = Image.alpha_composite(fundo.convert("RGBA"), camada)
    destino.parent.mkdir(parents=True, exist_ok=True)
    composto.save(destino)


def gravar_resultado(id_camada, bounds, iou_score, bounds_anterior, usar_como_guia):
    dados = json.loads(CAMINHO_DADOS.read_text(encoding="utf-8"))
    for camada in dados["camadas"]:
        if camada["id"] != id_camada:
            continue
        # Duas correções de 2026-09-23 (décima primeira rodada), achadas rodando o
        # script pela segunda vez:
        #
        # 1. `bounds_anterior_a_20260922` era REESCRITO a cada gravação. O nome da
        #    chave tem uma data dentro, então na segunda rodada ela passava a guardar
        #    um valor de outro dia e o nome virava mentira (a primeira execução
        #    perdeu, assim, o retângulo-placeholder original de -10/10). Aquela chave
        #    agora é histórica e INTOCÁVEL; o valor de antes desta gravação vai para
        #    `bounds_antes_do_alinhamento`, com a data em que foi substituído.
        # 2. A data do alinhamento era o literal "2026-09-22", então toda gravação
        #    futura mentiria a data. Passa a ser a data em que o script rodou.
        hoje = time.strftime("%Y-%m-%d")
        camada["bounds_antes_do_alinhamento"] = {
            **bounds_anterior,
            "substituido_em": hoje,
        }
        camada["alinhamento_automatico"] = {
            "iou_terras": round(iou_score, 4),
            "usado_como_posicao": usar_como_guia,
            "data": hoje,
            "metodo": "cor terra/mar, sem rotação, IoU (ver scripts/alinhar_chatgpt_auto.py)",
        }
        if usar_como_guia:
            camada["bounds"] = bounds
            # Campo próprio, nunca sobrescrito por ajuste manual depois (correção
            # de 2026-09-23): é o que o botão "automático" da ferramenta restaura,
            # então o resultado do alinhamento nunca se perde mesmo que o usuário
            # mexa nos campos numéricos ou aperte "reset".
            camada["bounds_automatico"] = dict(bounds)
        break
    else:
        raise KeyError(id_camada)

    tmp = CAMINHO_DADOS.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    os.replace(tmp, CAMINHO_DADOS)


def main():
    gravar = "--gravar" in sys.argv

    print("Reduzindo costa oficial para grade de trabalho (128x128) ...")
    costa_grid = carregar_costa_grid()

    print("Controle negativo do alinhador (identidade vs. rotação 90°) ...")
    cn = controle_negativo(costa_grid)
    print(f"  IoU costa x costa (identidade): {cn['iou_identidade']*100:.1f}% (esperado: alto, perto de 100%)")
    print(f"  IoU costa x costa girada 90°:    {cn['iou_rotacionada_90']*100:.1f}% (esperado: baixo)")
    if cn["iou_identidade"] < 0.9:
        print("  ATENCAO: controle negativo de identidade nao bateu o esperado (<90%).")
        print("  Isto indica bug na função de IoU/amostragem -- PARANDO sem tentar as imagens.")
        sys.exit(1)
    piso = max(cn["iou_rotacionada_90"] * 2, 0.15)
    print(f"  Piso adotado para 'serve como guia de posição': IoU >= {piso*100:.1f}% "
          f"(2x o valor da rotação, com piso mínimo de 15%)")

    resultados = []
    for nome_arquivo in IMAGENS:
        caminho = PASTA_REFERENCIAS / nome_arquivo
        id_camada = ID_POR_ARQUIVO[nome_arquivo]
        print(f"\n--- {id_camada} ({nome_arquivo}) ---")
        with Image.open(caminho) as im:
            im_rgb = np.asarray(im.convert("RGB"))
        resultado = buscar_melhor_alinhamento(costa_grid, im_rgb)
        usar = resultado["iou"] >= piso
        print(f"  IoU: {resultado['iou']*100:.1f}%  (tempo: {resultado['tempo_s']:.1f}s)"
              f"  -> {'usar como guia de posição' if usar else 'NAO usar -- fica cobrindo o mundo inteiro'}")

        bounds = px_mundo_para_bounds(
            resultado["ox_px_mundo"], resultado["oy_px_mundo"],
            resultado["sx_px_mundo_por_px_imagem"], resultado["sy_px_mundo_por_px_imagem"],
        )
        print(f"  bounds propostos: {bounds}")

        destino_previa = PASTA_ANALISE / f"alinhamento_{id_camada}.png"
        gerar_previa(caminho, costa_grid, resultado, destino_previa)
        print(f"  prévia salva em {destino_previa}")

        dados_atuais = json.loads(CAMINHO_DADOS.read_text(encoding="utf-8"))
        bounds_anterior = next(
            c["bounds"] for c in dados_atuais["camadas"] if c["id"] == id_camada
        )

        if gravar:
            gravar_resultado(id_camada, bounds, resultado["iou"], bounds_anterior, usar)
            print("  gravado em dados/camadas_referencia.json")

        resultados.append({
            "id": id_camada, "iou": resultado["iou"], "usado": usar,
            "bounds_anterior": bounds_anterior, "bounds_novo": bounds if usar else bounds_anterior,
        })

    print("\n=== Resumo ===")
    for r in resultados:
        print(f"  {r['id']}: IoU {r['iou']*100:.1f}% -- "
              f"{'usado' if r['usado'] else 'NAO usado (mantido cobrindo o mundo)'}")
    if not gravar:
        print("\n(Rodou em modo relatório -- nada foi gravado. Rode com --gravar para aplicar.)")

    return {"controle_negativo": cn, "piso": piso, "resultados": resultados}


if __name__ == "__main__":
    main()
