# Mapa Custom 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a disposable `/mapa-custom-2` route that keeps the common map behavior and makes Burning Down, Artefatos, and Certificado visible in a right-side action panel.

**Architecture:** Add a separate EJS view and CSS file so the experiment can be removed cleanly. Reuse `public/js/mapa.js` by preserving the IDs/classes it expects, and add a focused Playwright verification script for layout and state behavior.

**Tech Stack:** Express 5, EJS, CSS, browser JavaScript, Playwright via Node script.

---

### Task 1: Route And Layout Verification Test

**Files:**
- Create: `scripts/verify-mapa-custom-2-layout.js`

- [ ] **Step 1: Write the failing verification script**

Create `scripts/verify-mapa-custom-2-layout.js` with this complete script:

```javascript
const { spawn } = require("child_process");
const fs = require("fs");
const { chromium } = require("playwright");

const PORT = 3142;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const viewports = [
  { name: "desktop", width: 1366, height: 768 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];

const mockModulos = [
  { id_modulo: 1, historia_liberada: true, historia_concluida: true, desafio_atual: false, desafio_concluido: true, certificado_liberado: false },
  { id_modulo: 2, historia_liberada: true, historia_concluida: true, desafio_atual: true, desafio_concluido: false, certificado_liberado: false },
  { id_modulo: 3, historia_liberada: true, historia_concluida: false, desafio_atual: false, desafio_concluido: false, certificado_liberado: false },
  { id_modulo: 4, historia_liberada: false, historia_concluida: false, desafio_atual: false, desafio_concluido: false, certificado_liberado: false },
  { id_modulo: 5, historia_liberada: false, historia_concluida: false, desafio_atual: false, desafio_concluido: false, certificado_liberado: false },
];

function startServer() {
  const child = spawn(process.execPath, ["./src/server"], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk.toString(); });
  child.stderr.on("data", (chunk) => { output += chunk.toString(); });

  return { child, output: () => output };
}

async function waitForRoute() {
  const deadline = Date.now() + 8000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/mapa-custom-2`);
      if (response.ok) return;
    } catch (_error) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  throw new Error(`Server did not respond at ${BASE_URL}/mapa-custom-2`);
}

async function assertViewport(page, viewportName) {
  await page.goto(`${BASE_URL}/mapa-custom-2`, { waitUntil: "networkidle" });

  const failures = await page.evaluate(() => {
    const result = [];
    const required = [
      [".mapa-custom-2-page", "page root missing"],
      [".mapa-actions-panel", "actions panel missing"],
      [".atalho-progresso", "Burning Down action missing"],
      [".atalho-artefatos", "Artefatos action missing"],
      [".mapa-certificado", "certificate action missing"],
      ["#mapaModulos .porta-card", "doors missing"],
    ];

    for (const [selector, label] of required) {
      if (!document.querySelector(selector)) result.push(label);
    }

    const visibleActions = [...document.querySelectorAll(".mapa-actions-panel .atalho-mapa, .mapa-actions-panel .certificado-botao")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      });

    if (visibleActions.length < 3) {
      result.push(`expected 3 visible actions, found ${visibleActions.length}`);
    }

    const stage = document.querySelector(".mapa-stage");
    const panel = document.querySelector(".mapa-actions-panel");

    if (stage && panel) {
      const stageRect = stage.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const overlap = stageRect.left < panelRect.right && stageRect.right > panelRect.left && stageRect.top < panelRect.bottom && stageRect.bottom > panelRect.top;
      if (overlap && window.innerWidth > 1100) {
        result.push("actions panel overlaps stage on desktop");
      }
    }

    return result;
  });

  if (failures.length) {
    throw new Error(`${viewportName}: ${failures.join("; ")}`);
  }

  await page.locator(".porta-card.liberado .porta-botao").first().click();
  await page.waitForTimeout(250);

  const detailFailures = await page.evaluate(() => {
    const selected = document.querySelector(".porta-card.selecionada");
    if (!selected) return ["selected door missing after click"];

    const info = selected.querySelector(".porta-info");
    if (!info) return ["selected door info missing"];

    const style = getComputedStyle(info);
    if (style.visibility === "hidden" || style.opacity === "0") {
      return ["selected door info not visible"];
    }

    const infoRect = info.getBoundingClientRect();
    if (infoRect.width < 220) {
      return [`selected door info too narrow: ${Math.round(infoRect.width)}px`];
    }

    return [];
  });

  if (detailFailures.length) {
    throw new Error(`${viewportName}: ${detailFailures.join("; ")}`);
  }

  const screenshotPath = `output/playwright/mapa-custom-2-${viewportName}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
}

async function main() {
  fs.mkdirSync("output/playwright", { recursive: true });
  const server = startServer();

  try {
    await waitForRoute();
    const browser = await chromium.launch();
    try {
      for (const viewport of viewports) {
        const page = await browser.newPage({ viewport });
        await page.route("**/api/progresso/mapa", async (route) => {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ modulos: mockModulos }),
          });
        });
        await page.addInitScript(() => {
          localStorage.setItem("token", "layout-test-token");
        });
        await assertViewport(page, viewport.name);
        await page.close();
      }
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error(error.message);
    console.error(server.output());
    process.exitCode = 1;
  } finally {
    server.child.kill();
  }
}

main();
```

- [ ] **Step 2: Run the script to verify it fails**

Run: `node scripts/verify-mapa-custom-2-layout.js`

Expected: FAIL with `Server did not respond at http://127.0.0.1:3142/mapa-custom-2`, because the route has not been added yet.

### Task 2: Disposable View, Route, And CSS

**Files:**
- Create: `public/pages/mapa-custom-2.ejs`
- Create: `public/assets/css/mapa-custom-2.css`
- Modify: `src/server.js`

- [ ] **Step 1: Add the route**

Add this route after `/mapa-custom` in `src/server.js`:

```javascript
app.get("/mapa-custom-2", function (_req, res) {
  res.render("mapa-custom-2");
});
```

- [ ] **Step 2: Add the EJS view**

Create `public/pages/mapa-custom-2.ejs` with the same script contract as the common map:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mapa Custom 2 | Scrum Dungeon</title>
    <link rel="stylesheet" data-doc-path="/assets/css/main.css" />
    <link rel="stylesheet" data-doc-path="/assets/css/mapa-custom-2.css" />
  </head>
  <body>
    <%- include('./partials/header') %>
    <%- include('./partials/botao_voltar') %>
    <%- include('./partials/alert') %>

    <main class="mapa-custom-2-page">
      <section class="mapa-custom-2-header">
        <h1>Sala dos Desafios</h1>
        <p>Escolha uma porta para continuar a jornada ou use o painel para acompanhar progresso, artefatos e certificado.</p>
      </section>

      <section class="mapa-shell" aria-label="Mapa da aventura">
        <section class="mapa-stage" aria-label="Portas dos capitulos">
          <section id="mapaModulos" class="mapa-modulos">
            <p class="mapa-loading">Carregando mapa...</p>
          </section>
        </section>

        <aside class="mapa-actions-panel" aria-label="Acoes da jornada">
          <button class="atalho-mapa atalho-progresso" onclick="window.location.assign('/burningdown')" type="button">
            <span class="atalho-kicker">Progresso</span>
            <span class="atalho-imagem"></span>
            <span class="atalho-titulo">Burning Down</span>
            <span class="atalho-descricao">Veja seu desempenho e retome a aventura.</span>
          </button>

          <button class="atalho-mapa atalho-artefatos" onclick="window.location.assign('/artefatos')" type="button">
            <span class="atalho-kicker">Colecao</span>
            <span class="atalho-imagem"></span>
            <span class="atalho-titulo">Artefatos</span>
            <span class="atalho-descricao">Acesse registros liberados na jornada.</span>
          </button>

          <section class="mapa-certificado">
            <button id="btnCertificado" class="certificado-botao" disabled type="button">
              <span class="certificado-kicker">Final</span>
              <span class="certificado-imagem"></span>
              <span class="certificado-texto">Certificado</span>
              <span id="certificado-status" class="certificado-status">Conclua a jornada para desbloquear.</span>
            </button>
          </section>
        </aside>
      </section>
    </main>

    <script data-doc-path="/js/main.js"></script>
    <script data-doc-path="/js/mapa.js"></script>

    <%- include('./partials/navegacao_inferior') %>
    <%- include('./partials/footer') %>
  </body>
</html>
```

- [ ] **Step 3: Add the CSS**

Create `public/assets/css/mapa-custom-2.css` with responsive layout, action panel states, door positions, and no hover-only labels.

- [ ] **Step 4: Run the focused script to verify it passes**

Run: `node scripts/verify-mapa-custom-2-layout.js`

Expected: PASS, exit code 0, screenshots written to `output/playwright/mapa-custom-2-desktop.png`, `output/playwright/mapa-custom-2-tablet.png`, and `output/playwright/mapa-custom-2-mobile.png`.

### Task 3: Project-Level Verification

**Files:**
- Read: `scripts/project-test.js`
- No production file changes unless verification identifies a new issue caused by this task.

- [ ] **Step 1: Run project test**

Run: `npm test`

Expected for this workspace: existing empty-file inventory failures may remain from pre-existing artifacts. The new `mapa-custom-2` files must not add empty-file failures, missing asset failures, EJS compile failures, route/view failures, CSS failures, or selector-contract failures.

- [ ] **Step 2: Inspect git diff**

Run: `git -c safe.directory=E:/OctopusCode/ABP_DSM1_ diff -- public/pages/mapa-custom-2.ejs public/assets/css/mapa-custom-2.css src/server.js scripts/verify-mapa-custom-2-layout.js docs/superpowers/plans/2026-05-15-mapa-custom-2-implementation.md`

Expected: only the new disposable route/view/CSS/test script/plan are changed for this task, with no unrelated edits.
