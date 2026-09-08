# legacy/raiz

Arquivos que moraram na raiz do repositório e saíram por terem zero citação em
qualquer lugar do projeto (levantado por `grep` contra o repositório inteiro em
08/09/2026, registrado em `Pendencias.md`). Propósito cumprido, régua nenhuma
depende deles hoje. Diferente do resto de `legacy/` (o material-fonte de antes do
`src/data/*.json`), estes nasceram já durante o projeto atual, como rascunho ou
estudo isolado.

Movidos, não apagados: `git mv`, histórico preservado. Se algo aqui voltar a ser
citado por nome em algum documento ou script, é sinal de que voltou a ser
trabalho, e o lugar dele é a raiz de novo.

- **`Combate_Prolongado.md`** · exploração de um modelo de combate prolongado.
  Decisão já registrada em memória de sessão: não é regra, o que valia guardar
  eram as medições, não o modelo. Zero citação em qualquer arquivo do repositório.
- **`Defesas.md`** · rascunho anterior das três Defesas (corpo/postura/mente).
  Superado por `Defesas_revisao.md` (que ficou na raiz, ainda citado), cujo
  conteúdo já está implementado em `src/data/regras.json` e no capítulo
  publicado. Zero citação.
- **`Miniaturas_3D.md`** · estudo de viabilidade fechado (agosto/2026): miniaturas
  3D com base hexagonal no tabuleiro. Protótipo em `_shots/` (pasta descartável).
  Zero citação.
- **`Paleta_Centelha.html`** · bancada de paleta de cores. Zero citação em
  qualquer lugar do repositório.
- **`armaduras_escudos_centelha.txt`** · módulo de referência com tabelas
  comparativas de armaduras e escudos, pensado para ser lido por um agente e
  convertido em mecânica. A conversão já aconteceu (as 9 armaduras batem número a
  número com o capítulo publicado, conforme `docs/simulacao/CONTEXTO.md`). Zero
  citação.
