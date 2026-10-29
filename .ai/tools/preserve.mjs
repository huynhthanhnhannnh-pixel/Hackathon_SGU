// Content-preservation check: compares each given file with its version in git HEAD.
//   node preserve.mjs spec/21_AI_KIEM_VA_DUYET.md [more files]
// Reports: non-Mermaid code blocks that changed or disappeared; tokens (`...`, CONFIG.X, ERR_X, rule IDs)
// that disappeared — except rule IDs listed in orphans.json and tokens now found in the archive folder.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, read, lf, archiveText, ID_RE } from "./common.mjs";

const orphans = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "orphans.json"), "utf8"));
const archived = archiveText();
const blocks = (t) => [...t.matchAll(/```(\w*)\r?\n([\s\S]*?)```/g)].filter((m) => m[1] !== "mermaid").map((m) => m[2].trimEnd());
const tokens = (t) => new Set([
  ...[...t.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]),
  ...(t.match(/\bCONFIG\.[A-Z0-9_]+/g) ?? []),
  ...(t.match(/\bERR_[A-Z0-9_]+\b/g) ?? []),
  ...[...t.matchAll(ID_RE)].map((m) => `${m[1]}-${m[2]}`),
]);

let bad = 0;
for (const f of process.argv.slice(2)) {
  const before = lf(execFileSync("git", ["show", `HEAD:${f}`], { cwd: ROOT, encoding: "utf8" }));
  const after = read(f);
  const okIds = new Set(orphans[f] ?? []);
  const nowBlocks = blocks(after);
  const lostBlocks = blocks(before).filter((b) => !nowBlocks.includes(b) && !archived.includes(b));
  const nowTokens = tokens(after);
  const lost = [...tokens(before)].filter((k) => !nowTokens.has(k) && !okIds.has(k));
  const lostReal = lost.filter((k) => !archived.includes(k));
  const lostToArchive = lost.length - lostReal.length;
  const kb = (s) => Buffer.byteLength(s, "utf8");
  console.log(`\n== ${f}: ${kb(before)} → ${kb(after)} byte`);
  console.log(`   khối code bị đổi/mất: ${lostBlocks.length}`);
  for (const b of lostBlocks) console.log(`     - "${b.split("\n")[0].slice(0, 90)}" (${b.split("\n").length} dòng)`);
  console.log(`   token mất: ${lostReal.length}  (chuyển sang archive: ${lostToArchive}; mã orphan được phép xóa không tính)`);
  for (const k of lostReal.slice(0, 80)) console.log(`     - ${k.slice(0, 100)}`);
  if (lostBlocks.length || lostReal.length || kb(after) > 40000) bad++;
}
process.exit(bad ? 1 : 0);
