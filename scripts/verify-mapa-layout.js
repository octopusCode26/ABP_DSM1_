const { spawn } = require("child_process");
const fs = require("fs");
const { chromium } = require("playwright");

const PORT = 3137;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const viewports = [
  { name: "desktop", width: 1366, height: 768 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];

const mockModulos = [
  {
    id_modulo: 1,
    historia_liberada: true,
    historia_concluida: true,
    desafio_atual: false,
    desafio_concluido: true,
    certificado_liberado: false,
  },
  {
    id_modulo: 2,
    historia_liberada: true,
    historia_concluida: true,
    desafio_atual: true,
    desafio_concluido: false,
    certificado_liberado: false,
  },
  {
    id_modulo: 3,
    historia_liberada: true,
    historia_concluida: false,
    desafio_atual: false,
    desafio_concluido: false,
    certificado_liberado: false,
  },
  {
    id_modulo: 4,
    historia_liberada: false,
    historia_concluida: false,
    desafio_atual: false,
    desafio_concluido: false,
    certificado_liberado: false,
  },
  {
    id_modulo: 5,
    historia_liberada: false,
    historia_concluida: false,
    desafio_atual: false,
    desafio_concluido: false,
    certificado_liberado: false,
  },
];

function startServer() {
  const child = spawn(process.execPath, ["./src/server"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(PORT),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  return {
    child,
    output: () => output,
  };
}

async function waitForServer() {
  const deadline = Date.now() + 8000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/mapa`);
      if (response.ok) return;
    } catch (_error) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  throw new Error(`Server did not respond at ${BASE_URL}/mapa`);
}

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

async function assertShellSectionsDoNotOverlap(page, viewportName) {
  const failures = await page.evaluate(() => {
    const checks = [];
    const tolerance = 2;
    const pairs = [
      [".mapa-hud", ".mapa-stage", "HUD overlaps stage"],
      [".mapa-hud__copy", ".mapa-hud__status", "HUD copy overlaps status"],
      [".mapa-side--left", ".mapa-side--right", "Shortcut panels overlap each other"],
      [".mapa-side--left", "#mapaModulos", "Progress shortcut overlaps doors"],
      [".mapa-side--right", "#mapaModulos", "Artifacts shortcut overlaps doors"],
    ];

    for (const [aSelector, bSelector, label] of pairs) {
      const a = document.querySelector(aSelector);
      const b = document.querySelector(bSelector);
      if (!a || !b) continue;

      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      if (!aRect.width || !aRect.height || !bRect.width || !bRect.height) continue;

      if (
        aRect.left < bRect.right &&
        aRect.right > bRect.left &&
        aRect.top < bRect.bottom &&
        aRect.bottom > bRect.top
      ) {
        checks.push(label);
      }
    }

    const contained = [
      [".mapa-hud", ".mapa-hud h1", "HUD title escapes its container"],
      [".mapa-hud", ".mapa-hud p", "HUD copy escapes its container"],
      [".mapa-hud", ".mapa-hud__status", "HUD status escapes its container"],
      [".mapa-stage", ".mapa-side--left", "Progress shortcut escapes stage"],
      [".mapa-stage", ".mapa-side--right", "Artifacts shortcut escapes stage"],
      [".mapa-stage", "#mapaModulos", "Door map escapes stage"],
      [".mapa-stage", ".mapa-certificado", "Certificate escapes stage"],
    ];

    for (const [parentSelector, childSelector, label] of contained) {
      const parent = document.querySelector(parentSelector);
      const child = document.querySelector(childSelector);
      if (!parent || !child) continue;

      const parentRect = parent.getBoundingClientRect();
      const childRect = child.getBoundingClientRect();
      if (!parentRect.width || !parentRect.height || !childRect.width || !childRect.height) continue;

      if (
        childRect.left < parentRect.left - tolerance ||
        childRect.right > parentRect.right + tolerance ||
        childRect.top < parentRect.top - tolerance ||
        childRect.bottom > parentRect.bottom + tolerance
      ) {
        checks.push(label);
      }
    }

    return checks;
  });

  if (failures.length) {
    throw new Error(`${viewportName}: ${failures.join("; ")}`);
  }
}

async function assertNoVisibleOverlaps(page, viewportName) {
  const failures = await page.evaluate(() => {
    const selected = document.querySelector(".porta-card.selecionada");
    if (!selected) return ["No selected card after clicking a door"];

    const info =
      document.querySelector(".mapa-detalhe-porta:not([hidden])") ||
      selected.querySelector(".porta-info");

    if (!info) return ["Selected card has no visible detail panel"];

    const infoStyle = getComputedStyle(info);
    if (infoStyle.visibility === "hidden" || infoStyle.opacity === "0") {
      return ["Selected detail panel is not visible"];
    }

    const infoRect = info.getBoundingClientRect();
    const failures = [];

    if (infoRect.width < 240) {
      failures.push(`Detail panel is too narrow: ${Math.round(infoRect.width)}px`);
    }

    if (info.scrollHeight > info.clientHeight + 2) {
      failures.push("Detail panel content is clipped");
    }

    const candidates = [
      ...document.querySelectorAll(".porta-card:not(.selecionada) .porta-botao"),
      ...document.querySelectorAll(".atalho-mapa"),
      ...document.querySelectorAll(".mapa-certificado"),
    ];

    return failures.concat(
      candidates
        .map((element) => ({
          label:
            element.getAttribute("aria-label") ||
            element.className ||
            element.tagName,
          rect: element.getBoundingClientRect(),
        }))
        .filter(({ rect }) => rect.width > 0 && rect.height > 0)
        .filter(({ rect }) => {
          return (
            infoRect.left < rect.right &&
            infoRect.right > rect.left &&
            infoRect.top < rect.bottom &&
            infoRect.bottom > rect.top
          );
        })
        .map(({ label }) => `Info panel overlaps ${label}`),
    );
  });

  if (failures.length) {
    throw new Error(`${viewportName}: ${failures.join("; ")}`);
  }
}

async function verifyViewport(browser, viewport) {
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

  await page.goto(`${BASE_URL}/mapa`, { waitUntil: "networkidle" });
  await assertShellSectionsDoNotOverlap(page, viewport.name);
  await page.locator(".porta-card.liberado .porta-botao").first().click();
  await page.waitForTimeout(350);
  await assertShellSectionsDoNotOverlap(page, viewport.name);
  await assertNoVisibleOverlaps(page, viewport.name);

  const screenshotPath = `output/playwright/mapa-${viewport.name}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await page.close();
}

async function main() {
  fs.mkdirSync("output/playwright", { recursive: true });

  const server = startServer();

  try {
    await waitForServer();

    const browser = await chromium.launch();
    try {
      for (const viewport of viewports) {
        await verifyViewport(browser, viewport);
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
