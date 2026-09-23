"""Gera o cache de identidade de ilha (`backend/ilhas.py`) em `render/cache-ilhas/`.
PROCESSAMENTO PESADO (varre a máscara inteira de 10240 px): rodar com o servidor
parado e sem outra renderização no ar. Mede a memória livre antes e o pico do
processo depois, e recusa começar com menos de `MINIMO_LIVRE_MB` livres.

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/gerar_cache_ilhas.py
"""

import ctypes
import json
import sys
import time
from ctypes import wintypes
from pathlib import Path

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from backend import ilhas  # noqa: E402

MINIMO_LIVRE_MB = 1200


class _Status(ctypes.Structure):
    _fields_ = [("dwLength", wintypes.DWORD), ("dwMemoryLoad", wintypes.DWORD),
                ("ullTotalPhys", ctypes.c_ulonglong), ("ullAvailPhys", ctypes.c_ulonglong),
                ("ullTotalPageFile", ctypes.c_ulonglong), ("ullAvailPageFile", ctypes.c_ulonglong),
                ("ullTotalVirtual", ctypes.c_ulonglong), ("ullAvailVirtual", ctypes.c_ulonglong),
                ("ullAvailExtendedVirtual", ctypes.c_ulonglong)]


class _Contadores(ctypes.Structure):
    _fields_ = [("cb", wintypes.DWORD), ("PageFaultCount", wintypes.DWORD),
                ("PeakWorkingSetSize", ctypes.c_size_t), ("WorkingSetSize", ctypes.c_size_t),
                ("QuotaPeakPagedPoolUsage", ctypes.c_size_t), ("QuotaPagedPoolUsage", ctypes.c_size_t),
                ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t), ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
                ("PagefileUsage", ctypes.c_size_t), ("PeakPagefileUsage", ctypes.c_size_t)]


def memoria_livre_mb() -> int:
    s = _Status()
    s.dwLength = ctypes.sizeof(s)
    ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(s))
    return s.ullAvailPhys // 2**20


def pico_do_processo_mb() -> int:
    c = _Contadores()
    c.cb = ctypes.sizeof(c)
    # Tipos explícitos: sem eles o ctypes corta o identificador do processo (64 bits)
    # e a chamada falha em silêncio, devolvendo pico zero.
    k32, psapi = ctypes.windll.kernel32, ctypes.windll.psapi
    k32.GetCurrentProcess.restype = wintypes.HANDLE
    psapi.GetProcessMemoryInfo.argtypes = [wintypes.HANDLE, ctypes.POINTER(_Contadores), wintypes.DWORD]
    if not psapi.GetProcessMemoryInfo(k32.GetCurrentProcess(), ctypes.byref(c), c.cb):
        raise OSError("GetProcessMemoryInfo falhou")
    return c.PeakWorkingSetSize // 2**20


def main() -> int:
    livre = memoria_livre_mb()
    print(f"memória livre antes: {livre} MB")
    if livre < MINIMO_LIVRE_MB:
        print(f"menos de {MINIMO_LIVRE_MB} MB livres: não começo")
        return 2
    t = time.perf_counter()
    r = ilhas.gerar()
    medida = {"quando": time.strftime("%Y-%m-%d %H:%M"), "componentes": r["n"], "zonas": r["zonas"],
              "segundos": round(time.perf_counter() - t, 1), "livre_antes_mb": livre,
              "pico_do_processo_mb": pico_do_processo_mb()}
    (ilhas.PASTA_CACHE / "medida.json").write_text(json.dumps(medida, ensure_ascii=False, indent=2) + "\n",
                                                   encoding="utf-8")
    print(json.dumps(medida, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
