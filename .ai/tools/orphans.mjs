// Rule IDs that appear exactly once in all docs (only where they are defined) => safe to delete.
// D-xx, Q-xx and INV-xx are never listed: they are the identity of decisions, questions and invariants.
import { writeFileSync } from "node:fs";
import { docFiles, read, specFileByCode, HOME, ID_RE } from "./common.mjs";

const count = {};
for (const f of docFiles()) for (const m of read(f).matchAll(ID_RE)) {
  const id = `${m[1]}-${m[2]}`; count[id] = (count[id] ?? 0) + 1;
}
const out = {};
for (const [id, n] of Object.entries(count)) {
  const prefix = id.split("-")[0];
  if (n !== 1 || ["D", "Q", "INV"].includes(prefix)) continue;
  (out[specFileByCode(HOME[prefix])] ??= []).push(id);
}
for (const k of Object.keys(out)) out[k].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
for (const [f, ids] of Object.entries(out)) console.log(`${f}: ${ids.length} mã có thể xóa`);
