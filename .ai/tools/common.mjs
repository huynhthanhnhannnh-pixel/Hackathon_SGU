// Shared helpers for the spec restructuring checks.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const ARCHIVE_DIR = "archive/2026-10-29_tach-khoi-spec";
export const ID_RE = /\b(INV|D|Q|ING|ENG|AI|GUARD|BKT|API|UI)-(\d{1,3}[a-z]?)\b/g;
export const HOME = { INV: "01", D: "00", Q: "00", ING: "10", ENG: "11", AI: "20", GUARD: "21", BKT: "22", API: "03", UI: "30" };

export function docFiles() {
  const list = (d) => readdirSync(join(ROOT, d)).filter((f) => f.endsWith(".md")).map((f) => `${d}/${f}`);
  return [...list("spec"), ...list("pitch"), "README.md", "CLAUDE.md"];
}
export const lf = (s) => s.replace(/\r\n/g, "\n");
export const read = (rel) => lf(readFileSync(join(ROOT, rel), "utf8"));
export const specFileByCode = (code) => docFiles().find((f) => f.startsWith(`spec/${code}_`));
export function archiveText() {
  const dir = join(ROOT, ARCHIVE_DIR);
  if (!existsSync(dir)) return "";
  return lf(readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => readFileSync(join(dir, f), "utf8")).join("\n"));
}
