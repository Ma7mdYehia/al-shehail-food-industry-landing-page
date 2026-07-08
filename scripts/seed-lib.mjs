// Shared helpers for the Phase 1 static seed export/validate scripts.
// Plain Node.js + the `typescript` package (already a devDependency of this
// project — no new dependency is added by these scripts).
//
// This registers a `require()` hook that transpiles `.ts` files on the fly
// (via ts.transpileModule, single-file transpilation, no type-checking) so
// the existing lib/*.ts content modules can be read directly as the single
// source of truth, instead of hand-copying their data into a seed script.
// This never runs as part of `next build` or `next dev` — it only runs when
// scripts/export-phase-1-seed.mjs is invoked directly.

import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import ts from "typescript";

const requireForHooks = createRequire(import.meta.url);
const Module = requireForHooks("module");

export const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

let hooksInstalled = false;

/**
 * Installs a process-wide `require()` hook so `.ts` files under this repo
 * can be `require()`d directly (transpiled in memory, never written to
 * disk), and so the `@/...` path alias used throughout lib/ resolves the
 * same way it does for the Next.js build. Safe to call more than once.
 */
export function installTsRequireHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;

  const origResolve = Module._resolveFilename;
  Module._resolveFilename = function resolveWithAlias(request, parent, isMain, options) {
    if (request.startsWith("@/")) {
      request = path.join(repoRoot, request.slice(2));
    }
    return origResolve.call(this, request, parent, isMain, options);
  };

  Module._extensions[".ts"] = function loadTypeScript(module, filename) {
    const source = fs.readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2019,
        esModuleInterop: true,
      },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}

/** A `require()` bound to this module, for loading repo `.ts` files by path. */
export const requireTs = requireForHooks;

/** `arabic-bread` -> `arabic_bread` */
export function slugToSnake(slug) {
  return slug.replace(/-/g, "_");
}

/** `arabicBread` -> `arabic_bread` */
export function camelToSnake(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

/** Deterministic, human-readable, slug-derived ID — never a random UUID. */
export function idFor(prefix, slug) {
  return `${prefix}_${slugToSnake(slug)}`;
}

/** Writes JSON deterministically: stable 2-space indent, trailing newline. */
export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
