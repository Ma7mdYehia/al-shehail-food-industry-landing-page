#!/usr/bin/env node
// =============================================================================
// P05 confirmation dialog — real Chromium accessibility test.
// =============================================================================
// The team-management UI guards risky role/state changes behind a native
// <dialog> opened with showModal() — exactly the pattern in
// components/dashboard/TeamManager.tsx. This drives that same pattern in real
// Chromium and asserts the accessibility guarantees a confirmation must have:
// focus moves into the dialog, the background is inert while it is open, Escape
// closes it, focus returns to the trigger, and Confirm/Cancel work. Playwright
// is a normal devDependency; CI installs Chromium via `playwright install`.
//   node scripts/test-confirm-dialog-a11y.mjs   (npm run test:confirm-dialog-a11y)
// =============================================================================

import { createServer } from "node:http";
import { chromium } from "playwright";

let failures = 0;
function assert(name, cond, detail = "") {
  const okv = !!cond;
  if (!okv) failures++;
  console.log(`  ${okv ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

const HTML = `<!doctype html><html><head><meta charset="utf-8"></head><body>
  <button id="outside">Outside</button>
  <form id="form">
    <button id="save" type="button">Save</button>
    <dialog id="dlg" aria-labelledby="dtitle">
      <h2 id="dtitle">Confirm change</h2>
      <p>Apply this change?</p>
      <button id="cancel" type="button">Cancel</button>
      <button id="confirm" type="button">Confirm</button>
    </dialog>
  </form>
  <output id="result"></output>
  <script>
    const dlg = document.getElementById('dlg');
    document.getElementById('save').addEventListener('click', () => dlg.showModal());
    document.getElementById('cancel').addEventListener('click', () => dlg.close());
    document.getElementById('confirm').addEventListener('click', () => {
      document.getElementById('result').textContent = 'confirmed';
      dlg.close();
    });
  </script>
</body></html>`;

const server = createServer((_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(HTML);
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(base, { waitUntil: "networkidle" });

  const isOpen = () => page.evaluate(() => document.getElementById("dlg").open);
  const activeId = () => page.evaluate(() => document.activeElement && document.activeElement.id);
  const activeInDialog = () =>
    page.evaluate(() => document.getElementById("dlg").contains(document.activeElement));

  console.log("Confirmation dialog (real browser):");
  assert("dialog is closed initially", !(await isOpen()));

  // Open via the Save trigger.
  await page.focus("#save");
  await page.click("#save");
  assert("dialog opens (modal)", await isOpen());
  assert("focus moves into the dialog", await activeInDialog());

  // The background is inert while a modal dialog is open: a click/focus on an
  // outside control must not move focus out of the dialog.
  await page.evaluate(() => document.getElementById("outside").focus());
  assert("background is inert while open (focus stays in dialog)", await activeInDialog());

  // Escape closes and returns focus to the trigger (native dialog behavior).
  await page.keyboard.press("Escape");
  assert("Escape closes the dialog", !(await isOpen()));
  assert("focus returns to the trigger after Escape", (await activeId()) === "save");

  // Reopen and Cancel.
  await page.click("#save");
  assert("reopen works", await isOpen());
  await page.click("#cancel");
  assert("Cancel closes the dialog", !(await isOpen()));
  assert("focus returns to the trigger after Cancel", (await activeId()) === "save");

  // Reopen and Confirm.
  await page.click("#save");
  await page.click("#confirm");
  assert("Confirm closes the dialog", !(await isOpen()));
  assert("Confirm performs the action", (await page.textContent("#result")) === "confirmed");
} finally {
  await browser.close();
  server.close();
}

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} confirmation dialog test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All confirmation dialog accessibility tests passed (real browser).");
