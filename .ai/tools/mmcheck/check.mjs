// Parse every ```mermaid block in the given Markdown files with the real Mermaid parser.
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.DOMParser = dom.window.DOMParser;
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });

const mermaid = (await import("mermaid")).default;
mermaid.initialize({ startOnLoad: false });

let failed = 0, total = 0;
for (const file of process.argv.slice(2)) {
  const text = readFileSync(file, "utf8");
  const re = /```mermaid\r?\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text))) {
    total++;
    const line = text.slice(0, m.index).split("\n").length;
    try {
      await mermaid.parse(m[1]);
      console.log(`OK    ${file}:${line}`);
    } catch (e) {
      failed++;
      console.log(`FAIL  ${file}:${line}\n      ${String(e.message || e).split("\n").slice(0, 4).join("\n      ")}`);
    }
  }
}
console.log(`\n${total - failed}/${total} diagrams parsed`);
process.exit(failed ? 1 : 0);
