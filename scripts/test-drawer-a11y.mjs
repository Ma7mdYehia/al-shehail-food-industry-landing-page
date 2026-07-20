#!/usr/bin/env node
// =============================================================================
// Real-browser DOM test for the dashboard mobile drawer.
// =============================================================================
// Drives lib/auth/drawer-controller.ts (the same code the React shell uses) in a
// REAL Chromium page via Playwright, asserting genuine focus/inert/keyboard
// behavior — not regex/static assertions. Playwright is a normal devDependency
// and CI installs the browser via `npx playwright install --with-deps chromium`,
// so this runs unchanged in GitHub Actions or on any dev machine:
//   node scripts/test-drawer-a11y.mjs      (or: npm run test:drawer-a11y)
// =============================================================================

import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import ts from "typescript";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
let failures = 0;
function assert(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

// Transpile the real controller to ESM.
const controllerJs = ts.transpileModule(readFileSync(join(ROOT, "lib/auth/drawer-controller.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;

const dir = mkdtempSync(join(tmpdir(), "drawer-"));
writeFileSync(join(dir, "controller.mjs"), controllerJs);
writeFileSync(
  join(dir, "index.html"),
  `<!doctype html><html><head><meta charset="utf-8"><style>
    [inert]{opacity:.5} .drawer{position:fixed;left:0;top:0}
  </style></head><body>
  <div class="shell">
    <button id="scrim" tabindex="-1" aria-hidden="true">scrim</button>
    <aside id="dashboard-nav" class="drawer" aria-label="nav">
      <button id="close" aria-label="Close navigation">x</button>
      <a id="link1" href="#a">Overview</a>
      <a id="link2" href="#b">Products</a>
    </aside>
    <header id="header"><button id="toggle" aria-controls="dashboard-nav" aria-label="Open navigation">menu</button></header>
    <main id="main"><a id="content" href="#c">content link</a></main>
  </div>
  <script type="module">
    import { createDrawerController } from "./controller.mjs";
    const ctrl = createDrawerController({
      drawer: document.getElementById("dashboard-nav"),
      toggle: document.getElementById("toggle"),
      closeButton: document.getElementById("close"),
      background: [document.getElementById("header"), document.getElementById("main")],
    }, { isMobile: true });
    window.__ctrl = ctrl;
  </script></body></html>`
);

const server = createServer((req, res) => {
  const name = req.url === "/" ? "index.html" : req.url.slice(1);
  try {
    const body = readFileSync(join(dir, name));
    res.setHeader("Content-Type", name.endsWith(".mjs") ? "text/javascript" : "text/html");
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}/`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(base, { waitUntil: "networkidle" });

  const inert = (id) => page.evaluate((i) => document.getElementById(i).hasAttribute("inert"), id);
  const expanded = () => page.evaluate(() => document.getElementById("toggle").getAttribute("aria-expanded"));
  const activeId = () => page.evaluate(() => document.activeElement && document.activeElement.id);
  const activeInDrawer = () => page.evaluate(() => document.getElementById("dashboard-nav").contains(document.activeElement));

  console.log("Mobile drawer (real browser):");
  // initial closed state
  assert("closed drawer is inert", await inert("dashboard-nav"));
  assert("toggle aria-expanded=false initially", (await expanded()) === "false");

  // open from toggle
  await page.click("#toggle");
  assert("open: drawer not inert", !(await inert("dashboard-nav")));
  assert("open: header inert (focus containment)", await inert("header"));
  assert("open: main inert (focus containment)", await inert("main"));
  assert("open: aria-expanded=true", (await expanded()) === "true");
  assert("open: focus moved inside drawer", await activeInDrawer());

  // close from the in-drawer close button
  await page.click("#close");
  assert("close(button): drawer inert again", await inert("dashboard-nav"));
  assert("close(button): header not inert", !(await inert("header")));
  assert("close(button): focus restored to toggle", (await activeId()) === "toggle");
  assert("close(button): aria-expanded=false", (await expanded()) === "false");

  // open then close with Escape
  await page.click("#toggle");
  assert("reopen: aria-expanded=true", (await expanded()) === "true");
  await page.keyboard.press("Escape");
  assert("Escape closes the drawer", (await expanded()) === "false");
  assert("Escape: focus restored to toggle", (await activeId()) === "toggle");
  assert("Escape: drawer inert", await inert("dashboard-nav"));

  // desktop: never inert
  await page.evaluate(() => window.__ctrl.setMobile(false));
  assert("desktop: drawer NOT inert", !(await inert("dashboard-nav")));
  assert("desktop: header NOT inert", !(await inert("header")));
} finally {
  await browser.close();
  server.close();
}

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} drawer a11y test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All mobile drawer accessibility tests passed (real browser).");
