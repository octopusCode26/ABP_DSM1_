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
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

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

    const visibleActions = [
      ...document.querySelectorAll(
        ".mapa-actions-panel .atalho-mapa, .mapa-actions-panel .certificado-botao",
      ),
    ].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== "hidden" &&
        style.display !== "none"
      );
    });

    if (visibleActions.length < 3) {
      result.push(`expected 3 visible actions, found ${visibleActions.length}`);
    }

    for (let index = 1; index <= 5; index += 1) {
      const card = document.querySelector(`.porta-card.porta-${index}`);
      if (!card) {
        result.push(`porta-${index} missing`);
        continue;
      }

      const button = card.querySelector(".porta-botao");
      const label = button
        ? getComputedStyle(button, "::after").content.replaceAll('"', "")
        : "";

      if (label !== `Capítulo ${index}`) {
        result.push(`porta-${index} label missing, found ${label}`);
      }
    }

    const stage = document.querySelector(".mapa-stage");
    const panel = document.querySelector(".mapa-actions-panel");

    if (stage && panel) {
      const stageRect = stage.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const overlap =
        stageRect.left < panelRect.right &&
        stageRect.right > panelRect.left &&
        stageRect.top < panelRect.bottom &&
        stageRect.bottom > panelRect.top;

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

    const failures = [];
    const otherCards = [...document.querySelectorAll(".porta-card:not(.selecionada)")];

    for (const card of otherCards) {
      const rect = card.getBoundingClientRect();
      const overlaps =
        infoRect.left < rect.right &&
        infoRect.right > rect.left &&
        infoRect.top < rect.bottom &&
        infoRect.bottom > rect.top;

      if (overlaps) {
        failures.push(`selected door info overlaps ${card.className}`);
      }
    }

    return failures;
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
