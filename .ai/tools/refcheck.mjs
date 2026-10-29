// Cross-reference check over spec/, pitch/, README.md, CLAUDE.md.
//   node refcheck.mjs                 -> print every problem (one per line, no line numbers)
//   node refcheck.mjs --diff FILE     -> print only problems that are not in the baseline FILE
// Problems: a rule ID cited somewhere but missing from its home file;
//           a "`NN` Mục X.Y" / "`NN` §X.Y" / bare "Mục X.Y" reference to a numbered heading that does not exist.
import { readFileSync } from "node:fs";
import { docFiles, read, specFileByCode, HOME, ID_RE } from "./common.mjs";

const files = docFiles();
const text = Object.fromEntries(files.map((f) => [f, read(f)]));
const headingNums = (f) => new Set(text[f].split("\n")
  .map((l) => l.match(/^#{2,4}\s+(\d+(?:\.\d+)*)\.?\s/)?.[1]).filter(Boolean));
const headings = Object.fromEntries(files.map((f) => [f, headingNums(f)]));

const problems = new Set();
for (const f of files) {
  const t = text[f];
  for (const m of t.matchAll(ID_RE)) {
    const id = `${m[1]}-${m[2]}`, home = specFileByCode(HOME[m[1]]);
    if (!new RegExp(`\\b${id}\\b`).test(text[home])) problems.add(`${f} | mã không còn trong ${home} | ${id}`);
  }
  const SEC = /(?:`(\d{2})`\s*)?(?:Mục|§)\s*(\d+(?:\.\d+)?)/g;
  for (const m of t.matchAll(SEC)) {
    const target = m[1] ? specFileByCode(m[1]) : (f.startsWith("spec/") ? f : null);
    if (!target) continue;
    if (!headings[target].has(m[2])) problems.add(`${f} | mục không tồn tại | ${m[1] ? "`" + m[1] + "` " : ""}Mục ${m[2]} → ${target}`);
  }
}
let out = [...problems].sort();
const i = process.argv.indexOf("--diff");
if (i > 0) {
  const base = new Set(readFileSync(process.argv[i + 1], "utf8").split("\n").filter(Boolean));
  out = out.filter((p) => !base.has(p));
  console.log(out.length ? out.join("\n") : "Không có lỗi tham chiếu mới so với baseline.");
} else console.log(out.join("\n"));
