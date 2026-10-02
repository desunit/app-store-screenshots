#!/usr/bin/env node
// Exports device decks without clicking through the editor: opens the running editor in
// headless Chrome, shows it the project with the requested device selected, presses
// "Export bundle" and unzips the PNGs. The project file on disk is never written (the
// editor's autosave is answered in the browser), so this is safe next to an open editor.
//
//   node scripts/export-deck.mjs --device iphone --device android [--url http://localhost:3000] [--out exports]
//
// Needs Playwright: `npm i -D playwright` in this project, or PLAYWRIGHT_MODULE=/path/to/playwright.
// Prints JSON: {"files": [...], "out": "..."}; errors go to stderr with a non-zero exit.
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const devices = args.flatMap((a, i) => (a === "--device" ? [args[i + 1]] : []));
const url = opt("url", "http://localhost:3000");
const out = path.resolve(opt("out", "exports"));
const projectFile = path.resolve(opt("project", "app-store-screenshots.json"));
const timeoutMs = Number(opt("timeout", "600000"));

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright"));
} catch {
  fail("Playwright not found. Run `npm i -D playwright` here, or set PLAYWRIGHT_MODULE to its folder.");
}
const JSZip = require("jszip");

const project = JSON.parse(await fs.readFile(projectFile, "utf8"));
const wanted = devices.length ? devices : [project.device];
for (const d of wanted) {
  if (!project.slidesByDevice?.[d]?.length) fail(`the project has no "${d}" deck. Decks: ${Object.keys(project.slidesByDevice || {}).join(", ")}`);
}

const browser = await chromium.launch({ headless: true }).catch((e) => fail(`Chrome did not start: ${e.message}`));
const files = [];
try {
  for (const device of wanted) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    // Serve the project with this device active; swallow saves so disk stays untouched.
    let state = { ...project, device };
    await page.route("**/api/project", async (route) => {
      if (route.request().method() === "POST") {
        state = route.request().postDataJSON() ?? state;
        await route.fulfill({ json: { ok: true } });
      } else {
        await route.fulfill({ json: { ok: true, state } });
      }
    });
    await page.addInitScript(() => localStorage.clear());
    await page.goto(url, { waitUntil: "networkidle" }).catch((e) => fail(`cannot open ${url}: ${e.message}. Is the editor running (bun dev)?`));
    const button = page.getByRole("button", { name: "Export bundle", exact: true });
    await button.waitFor({ timeout: 60000 });
    const download = page.waitForEvent("download", { timeout: timeoutMs });
    await button.click();
    const zipPath = await (await download).path();
    const zip = await JSZip.loadAsync(await fs.readFile(zipPath));
    for (const entry of Object.values(zip.files)) {
      if (entry.dir || !entry.name.endsWith(".png")) continue;
      const target = path.join(out, entry.name);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, await entry.async("nodebuffer"));
      files.push(target);
    }
    if (errors.length) console.error(`warning: page errors while exporting ${device}: ${errors.slice(0, 3).join(" | ")}`);
    await page.close();
  }
} finally {
  await browser.close();
}
if (!files.length) fail("the export produced no PNGs. Check the editor's export toast in a browser.");
console.log(JSON.stringify({ out, files }, null, 2));
