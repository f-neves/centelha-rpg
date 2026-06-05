---
name: run-centelha-rpg
description: Build, run, screenshot, and drive the Centelha RPG site (Astro static site with an interactive character sheet). Use when asked to run, start, serve, build, test, smoke-test, or screenshot the centelha-rpg app or its /ficha character sheet.
---

# Run Centelha RPG

Centelha is a **static Astro 5 site** (homebrew tabletop RPG rules + an
interactive, JS-driven character sheet at `/ficha`). It deploys to GitHub
Pages under the base path **`/centelha-rpg/`** — every URL needs that prefix.

The agent path is **`driver.mjs`** (puppeteer-core + Edge headless). It
spawns `npm run dev`, auto-detects the port, drives the live app, runs an
interactivity smoke on `/ficha`, and writes screenshots to `_shots/`.

> Paths below are relative to the repo root (the unit). The driver lives at
> `.claude/skills/run-centelha-rpg/driver.mjs`.

## Prerequisites

- **Node** (tested on v24) and **npm**.
- A **Chromium-based browser**. Default is Edge at
  `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. Override
  with `EDGE=<path to msedge.exe or chrome>` if elsewhere.
- `puppeteer-core` is already a dependency (no separate browser download).

```bash
npm install
```

## Build / validate

`npm run build` runs the data validator + a character-math regression
(`test-kael.mjs`) **before** `astro build`, then Pagefind. The build
**aborts with a clear message** on any orphan reference, duplicate id, or
broken character formula — so a green build is a real gate.

```bash
npm run validate   # fast gate: data integrity + Kael regression, no full build
npm run build      # full: validate + astro build + pagefind → dist/
```

## Run (agent path) — the driver

Drives the running app and asserts the interactive bits. Spawns and tears
down its own dev server; exits non-zero if any check fails.

```bash
node .claude/skills/run-centelha-rpg/driver.mjs
```

Expected output (all green):

```
• server up at http://localhost:4343/centelha-rpg
  ✓ home has an <h1>
  ✓ chapter /regras/combate loads
  ✓ Caminhos render in 3 columns (got 3)
  ✓ Artes render in 3 columns (got 3)
  ✓ expanded Caminho shows technique descriptions (got 11)
  ✓ ref-modal opens on trait click
  ✓ ref-modal is position:fixed (got fixed)
  ✓ opening the modal does not scroll the page (359→359)
Screenshots in _shots/  ·  ✓ all checks passed
```

Screenshot any single route (full page) without the smoke:

```bash
node .claude/skills/run-centelha-rpg/driver.mjs shot /ficha ficha.png
node .claude/skills/run-centelha-rpg/driver.mjs shot /caminhos/punho-de-ferro caminho.png
```

Screenshots land in `_shots/` (gitignored). Routes are written **without**
the `/centelha-rpg` prefix — the driver adds it.

## Run (human path)

```bash
npm run dev      # Astro dev server; open the printed http://localhost:<port>/centelha-rpg/
npm run preview  # serve the built dist/ instead (run `npm run build` first)
```

Useless headless — there's no window to look at; use the driver for that.

## Gotchas

- **Base path is mandatory.** Hitting `http://localhost:PORT/ficha` 404s;
  it must be `…/centelha-rpg/ficha`. The driver handles this for you.
- **Dev port auto-increments.** If 4321 is busy, Astro picks 4343, etc. The
  driver parses the actual URL from stdout — never hard-code the port.
- **The character sheet renders client-side.** `/ficha` builds its dots,
  Caminhos, and Artes via JS after load — wait for `#tecnicas > div` (the
  driver does) before asserting on it.
- **Scoped styles don't reach JS-built DOM.** Components that create styled
  elements at runtime (`ficha.astro`, `Referencias.astro`, `ArvoreTecnicas`,
  `RoladorDados`, `NestaPagina`, `marcadores`) MUST use `<style is:global>`;
  a scoped `<style>` silently fails to style them. If new dynamic UI looks
  unstyled, this is why.
- **The ref-modal must stay `position:fixed`.** It's a `<dialog>`; with
  `position:relative` the native `showModal()` scrolls the page to the
  dialog. The open helper (`openNoScroll` in `Referencias.astro`) also
  restores scroll across a few frames — the driver asserts this stays fixed.
- **`src/data/regras.json` is NOT a content collection** — it's imported
  directly by `src/lib/calc.ts` and components, so adding keys is free and
  not zod-validated. Everything else in `src/data/` IS validated.

## Troubleshooting

- **`✘ Browser not found at …msedge.exe`** → install Edge/Chrome or set
  `EDGE=<path>` before running the driver.
- **`dev server did not start in 45s`** → run `npm install` first; check the
  appended stdout in the error for the real cause (usually a missing dep).
- **Build fails with "prereq órfão / id duplicado / ref inexistente"** →
  a `src/data/*.json` edit broke referential integrity; the message names
  the offending id. Fix the data, not the validator.
- **Kael regression fails** → a formula in `regras.json` changed; either the
  change is wrong, or update the expected values in `scripts/test-kael.mjs`.
