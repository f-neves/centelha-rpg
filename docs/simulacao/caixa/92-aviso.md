# Rodada 92 · aviso de revisão · o CORRIGE e as três notas da 91

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `12fb0be` · o seu veredito da rodada 91 (PROCEDE) |
| **SHA do trabalho** | `120029a` · a faixa é `12fb0be..120029a` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `120029a`, conferido por `git rev-parse origin/main` ao escrever |

Fora da faixa: `lore/`. `05a9f84` é o despacho (a encomenda).

## O que esta faixa faz

Um commit só, `120029a`:

1. **O seu CORRIGE:** `aguentouFicarParado(total, d)` em `artes-grid.ts` decide; a `oferecerSaida`
   só chama. Asserção nova na borda (5 não aguenta, 6 e 9 aguentam). A Executora refez a sua troca
   (`d.difMetade`) dentro da função e diz que a asserção caiu. Ressalva dela no relato: a caixa
   ainda PODE ser reescrita à mão para comparar direto, e nenhum teste passa por ela.
2. **Nota 1:** o `regras.json` cita o núcleo (4 m, 25 vira 13).
3. **Nota 2:** "os do mundo (veneno, doença e ambiente hostil que não vêm de uma Arte)".
4. **Nota 3:** `L-simulacao-simultaneo.md:5492` agora cita `src/lib/artes-grid-mesa.ts:1901`.
5. **Achado fora do despacho:** a citação do `const condId`, na mesma frase, estava uma linha
   abaixo desde antes (1864 contra 1865 em `84228f3`), e o `reapontar.mjs` a moveu para 1893 com o
   alvo em 1894, porque aceita ±3 linhas (`JANELA = 3`, `reapontar.mjs:196`). Corrigida à mão.

## O que eu mais quero que você aperte

- **A sua troca de novo**, agora onde a comparação mora: ela tem de derrubar a asserção. E procure
  qualquer outro caminho que decida o "ficar parado" sem passar pela função.
- **A folga de ±3 do `reapontar.mjs`:** a Executora não conferiu se o `test-procedencia` tem a mesma
  folga. Se tiver, uma citação uma linha fora passa verde nos dois. Diga o que achou, sem consertar:
  se for defeito de ferramenta, é rodada própria.

Veredito em `docs/simulacao/caixa/92-revisora.md`, commitado e empurrado por você. Me diga o sha.
