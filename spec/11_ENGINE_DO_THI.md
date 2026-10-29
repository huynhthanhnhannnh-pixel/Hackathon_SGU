# 11 — ENGINE TẦNG 1–2: CÚ PHÁP, ĐỒ THỊ GỌI HÀM, LÁT CẮT, NODE

> **Mục đích:** dựng bản đồ 6–8 node tất định, 0 token: symbol, đồ thị gọi hàm, lát cắt từ entry (D-06), cạnh (D-07), Display Budget, tên, tọa độ.
> **Input:** `IngestOutput` (nội bộ, `10` Mục 0). **Output:** `StaticEngineResult`; `toClientResult()` ⇒ `ClientStaticEngineResult`.
> **Trong repo thi:** `src/server/engine/index.ts` (`runEngine`, `buildGraph`, `toClientResult`) · `src/server/engine/graph/{registry,parser,symbols,callgraph,tarjan,pagerank,complexity,slicing,unclebob,nodes,naming,layout,whitelist,degraded}.ts` · `graph/resolvers/{ts_js,python,java,go,dart,universal}.ts` · `queries/<lang>.scm` · `public/grammars/*.wasm`.
> **Kiểu:** `02_CONTRACTS.md` · **Hằng số:** `CONFIG.*` · Mã luật `ENG-xx`.

---

## 0. Giai đoạn, kiểu nội bộ, luật chung

Giai đoạn (một danh sách, dùng cho log/warning): **G1 `PARSE`** (Mục 1) → **G2 `SYMBOLS`** (2) → **G3 `CALLGRAPH`** (3) → **G4 `ENTRIES`** (4) → **G5 `MODE`** (5) → **G6 `RANK`** (6) → **G7 `COMPLEXITY`** (7) → **G8 `CANDIDATES`** (8–10) → **G9 `ASSEMBLE`** (11) → **G10 `UNCLE_BOB`** (12) → **G11 `NAMING`** (13, khử trùng) → **G12 `LAYOUT`** (14) → **G13 `OUTPUT`** (15).

```typescript
// nội bộ — graph/* (FunctionInfo = SymbolDefinition + params, locals, complexity)
interface ExternalCall { caller: string; line: number; receiver_chain: string[]; method: string; import_source: string | null }
interface RouteBinding { file_path: string; line_start: number; line_end: number; kind: "HTTP" | "PAGE" | "SCREEN" | "COMMAND";
  method: string | null; path: string | null; handler: string; middlewares: string[]; display_name: string } // "router.post('/checkout')"
interface EntryPoint { key: string; binding: RouteBinding | null; source: "REGISTERED" | "GENERIC" | "PROGRAM" }
interface Candidate extends Pick<HybridArchitecturalNode, "id" | "node_type" | "entry_symbol" | "trace_steps" | "dto_snippet" |
  "cognitive_complexity" | "rank_score" | "title_source" | "title_evidence"> {
  kind: "SLICE" | "ALGO" | "VNODE" | "VROOT"; order_key: string; functions: string[]; binding: RouteBinding | null; base_title: string }
export async function runEngine(src: IngestSource): Promise<StaticEngineResult>;   // runIngest (10) + buildGraph
export function buildGraph(input: IngestOutput): StaticEngineResult;
```

- **ENG-01 Tất định (INV-10).** Duyệt khóa đã sort (mã UTF-16), kể cả danh sách kề và Map; parse song song được nhưng ghép theo path; không `Math.random`, không dùng đồng hồ để quyết định; cộng số thực theo thứ tự cố định; tọa độ làm tròn.
- **ENG-02** `CONFIG.ENGINE_BUDGET_MS` chỉ sinh warning, không cắt file (D-10).
- **ENG-03** Đổi luật làm đổi node/cạnh/id ⇒ tăng `CONFIG.ENGINE_VERSION`.
- **ENG-04** Symbol và cạnh chỉ lấy từ cây Tree-sitter: không regex trên văn bản thô, không LLM (INV-09).
- **ENG-05 Scope.** Entry, VIP, hàm của chế độ suy biến chỉ lấy từ file trong `root_dir_offset` (`10` ING-84); lát cắt được đi ra ngoài scope.

---

## 1. Language Registry & parser — `registry.ts`, `parser.ts`

**Mục đích:** đuôi ⇒ adapter, nạp grammar, parse. **Input:** RAMCodeStore. **Output:** `ParsedFile[]` (nội bộ `{ path, language, tier, tree, source }`).

```typescript
export const LANGUAGE_REGISTRY: LanguageAdapter[];            // có import_resolver ⇒ RESOLVED, không ⇒ STRUCTURAL
export const KNOWN_NO_GRAMMAR: Record<string, LanguageId>;   // tier UNSUPPORTED (10 ING-77)
export async function initParsers(): Promise<void>;           // 1 lần khi server khởi động
export async function parseAll(code: Map<string, string>, langs: Map<string, LanguageId>, report: IngestionReport): Promise<ParsedFile[]>;
```

- **RESOLVED:** `TYPESCRIPT` `.ts .mts .cts` · `TSX` `.tsx` · `JAVASCRIPT` `.js .jsx .mjs .cjs` (resolver `TS_JS`) · `PYTHON` `.py` · `JAVA` `.java` · `GO` `.go` · `DART` `.dart` (resolver cùng tên).
- **STRUCTURAL** (Universal): `CSHARP` `.cs` · `PHP` `.php` · `KOTLIN` `.kt .kts` · `C` `.c .h` · `CPP` `.cpp .cc .cxx .hpp .hh` · `RUST` `.rs` · `RUBY` `.rb` · `SWIFT` `.swift` · `SCALA` `.scala`.
- **`KNOWN_NO_GRAMMAR`** (UNSUPPORTED): `.sol` SOLIDITY · `.vhd .vhdl` VHDL · `.pas` PASCAL · `.f90 .f95` FORTRAN · `.cob .cbl` COBOL · `.asm` ASSEMBLY · `.abap` ABAP.

1. **ENG-10** Thêm ngôn ngữ `STRUCTURAL` = 1 dòng registry + `public/grammars/<lang>.wasm` + `queries/<lang>.scm`, không thêm code thuật toán. Chỉ TS/JS và Python được kiểm chứng (INV-09).
2. **ENG-11** `web-tree-sitter`; grammar `RESOLVED` nạp ở `initParsers()`, `STRUCTURAL` nạp theo nhu cầu từ bundle; không tải từ mạng; thời gian nạp lần đầu không tính vào `engine_ms`.
3. **ENG-12 Lỗi cú pháp.** $\rho$ = byte trong các node `ERROR` ngoài cùng / byte file. $\rho >$ `CONFIG.PARSE_ERROR_RATIO_MAX` ⇒ bỏ file khỏi mọi bước sau, `skipped.parse_error++`, warning "File {path} có cú pháp không phân tích được"; ngược lại dùng khai báo ngoài vùng `ERROR`.
4. **ENG-13** Capture `.scm`: `@def.function|method|class|interface|type|var`, `@name`, `@call`, `@import`; `STRUCTURAL` dùng `tags.scm` của grammar (`@definition.*`, `@reference.call`).

---

## 2. Bảng symbol — `symbols.ts`, `resolvers/*`

**Mục đích:** mỗi tên định nghĩa ở đâu. **Input:** `ParsedFile[]`, ManifestStore, `module_info`. **Output:** `SymbolIndex` (nội bộ: `SymbolTable: Map<string, SymbolDefinition>`, `ImportMap`, `FieldTypeMap`, `InterfaceImplMap`, `LocalSymbolIndex`). Hàm: `collectSymbols(files): SymbolIndex`, `resolveImports(files, idx, manifests, module_info): void`.

1. **ENG-20 Khóa.** `file#Name` · `file#Class.method` · `file#<module>` (file có câu lệnh cấp cao ngoài định nghĩa/import) · handler ẩn danh truyền vào lệnh đăng ký route: `file#<METHOD path>` (path tĩnh) hoặc `file#<anon@L{dòng}>` · trùng khóa trong 1 file ⇒ hậu tố `~2`, `~3` theo thứ tự nguồn. `line_start` tính từ decorator đầu tiên.
2. **ENG-21 Thu.** Lớp, interface, abstract class (TS `abstract`, Python `ABC`/`Protocol`, Go `interface`), type alias, hàm, method, biến giữ hàm (`const f = () => {}`), method trong `module.exports = {…}`/`export default {…}`, biến cấp module (`VARIABLE`); `export default X` ⇒ alias `file#default`.
3. **ENG-22 `FieldTypeMap`** (phạm vi lớp/hàm): tham số constructor có modifier, field có kiểu, `@Autowired`, `self.x = T(...)`, type hint, `Depends(T)`, `x = new T()`, biến export có giá trị `new T()`.
4. **ENG-23 `InterfaceImplMap`.** `implements I`, `extends A` (A abstract), lớp Python kế thừa lớp ABC; NestJS `{ provide: TOKEN, useClass: X }` + `@Inject(TOKEN)`.
5. **ENG-24 `LocalSymbolIndex`.** Tham số + biến cục bộ (khai báo, destructuring, biến vòng lặp, tham số catch) của mỗi hàm.
6. **ENG-25 Resolver `RESOLVED`:**
   - `TS_JS`: tương đối thử nguyên văn, `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `/index.ts`, `/index.tsx`, `/index.js`; `./x.js` không có ⇒ `./x.ts|.tsx`. Alias theo `baseUrl` + `paths` của `tsconfig`/`jsconfig` gần nhất phía trên (không theo `extends`), không có ⇒ `@/`, `~/` ⇒ `src/`. Barrel re-export đi tới định nghĩa gốc tối đa `CONFIG.BARREL_MAX_DEPTH` bước (có `visited`). `require()` = import; `import * as ns` = namespace file.
   - `PYTHON`: `a.b.c` ⇒ `a/b/c.py` | `a/b/c/__init__.py` với tiền tố `""`, `src/`, `root_dir_offset`; mỗi dấu `.` đầu đi lên 1 package.
   - `JAVA`: bảng `fqcn ⇒ file` từ `package` + tên lớp; cùng package không cần import; `a.b.*` ⇒ mọi lớp package.
   - `GO`: bỏ tiền tố `go_module_path` ⇒ thư mục; mọi file cùng thư mục là 1 package.
   - `DART`: `package:<dart_package_name>/x` ⇒ `lib/x`.
7. **ENG-26 Universal (`STRUCTURAL`).** Bắt node import/include/use/require/using có chuỗi hoặc tên có `.` `::` `/` `\`; chuẩn hóa thành `/`, bỏ tiền tố tương đối và đuôi; khớp **hậu tố dài nhất** với path; nhiều file ⇒ chọn tiền tố thư mục chung dài nhất với file hiện tại (hòa ⇒ path nhỏ), `ambiguous`. Chỉ sinh cạnh khi **đồng thời** có import trỏ tới file đích **và** lời gọi tới tên file đích định nghĩa. Cạnh `INFERRED`. Macro, import động, reflection có thể sót cạnh; không bịa cạnh.
8. **ENG-27** Import không về được file nội bộ ⇒ ghi `import_source` (tên gói) cho tên cục bộ; không sinh cạnh.

---

## 3. Đồ thị gọi hàm — `callgraph.ts`

**Mục đích:** cạnh cấp hàm cho lát cắt, cạnh cấp file cho xếp hạng. **Input:** `SymbolIndex`. **Output:** `FunctionCallEdge[]`, `ExternalCall[]`, `RouteBinding[]`, đồ thị file. Hàm: `buildCallGraph(files, idx): { edges; external; bindings }`, `fileGraph(edges): Map<file, Map<file, { weight; confidence }>>`.

1. **ENG-30** Tập hàm = kind `FUNCTION`/`METHOD` + `<module>` + handler ẩn danh. Lời gọi trong closure lồng tính cho hàm có tên bao ngoài.
2. **ENG-31 Phân giải call site** (node `@call`, so tên **chính xác**, không substring), thử lần lượt: (1) `f()`/`this.m()`/`self.m()` ⇒ cùng file / cùng lớp hoặc lớp cha — `RESOLVED`; (2) `f` import trực tiếp (kể cả default) — `RESOLVED`; (3) `x.m()`/`this.x.m()` với kiểu `x` trong `FieldTypeMap`, method phải tồn tại trong lớp/lớp cha — `RESOLVED`; (4) `C.m()`/`pkg.F()`/`ns.f()` với lớp/package/namespace đã import — `RESOLVED`; (5) `STRUCTURAL` ⇒ ENG-26 — `INFERRED`; (6) ngôn ngữ `RESOLVED`, receiver không rõ kiểu, `m` được định nghĩa trong các file được import ⇒ cạnh tới mọi ứng viên — `INFERRED`, `ambiguous` nếu > 1; (7) còn lại ⇒ `ExternalCall`.
3. **ENG-32 Interface ⇒ implementation** chỉ khi đích là method của `INTERFACE`/abstract class: 1 implementor có method đó ⇒ chuyển cạnh; > 1 ⇒ cạnh tới từng implementor, `ambiguous`; 0 ⇒ giữ (method không thân ⇒ không thành bước).
4. **ENG-33 Gộp** theo `(caller, callee)`: `call_count` = số call site; `RESOLVED` nếu ≥ 1 site `RESOLVED`; `ambiguous` = OR. Đệ quy giữ ở đồ thị hàm, bỏ ở đồ thị file.
5. **ENG-34 Cạnh đăng ký route:** hàm chứa lệnh đăng ký ⇒ handler và ⇒ từng middleware, `call_count = 1`, confidence theo cách phân giải tham chiếu. Ngoài lời gọi, đây là nguồn cạnh duy nhất.
6. **ENG-35 Đồ thị file:** `fa → fb` (fa ≠ fb) khi có cạnh hàm giữa hai file; `weight` = Σ `call_count`; `RESOLVED` nếu có cạnh hàm `RESOLVED`.

---

## 4. Entry (Ingress) — `callgraph.ts`

**Mục đích:** hàm entry đã đăng ký (D-06); chạy **trước** Mục 5. **Output:** `RouteBinding[]`, `EntryPoint[]` sort theo `key`.

1. **ENG-40 Mẫu đăng ký** (`ingress_patterns`; ✅ = kiểm chứng):
   - **Express / Koa-router / Fastify ✅:** `R.<verb>(path, ...fns)` (verb ∈ get post put patch delete all options head), `R.route(path).<verb>(...)`, `R` khởi tạo từ `express()`, `Router()`, `express.Router()`, `new Router()`, `fastify()`. Hàm cuối = handler, hàm trước = middleware theo thứ tự; `R.use(fn)` = middleware cho route đăng ký **sau** trên `R`; `R.use(prefix, R2)` = tiền tố cho `R2`.
   - **NestJS ✅:** `@Controller(prefix?)` + `@Get/@Post/@Put/@Patch/@Delete/@All(path?)`; `@UseGuards/@UseInterceptors/@UsePipes(X)` (lớp trước, method sau) ⇒ middleware `X.canActivate|intercept|transform`.
   - **Flask ✅:** `@X.route(path, methods=…)`, `@X.get/post/…`; `X = Flask()`/`Blueprint(url_prefix=)`, `register_blueprint(bp, url_prefix=)`; decorator khác (`@login_required`) = middleware.
   - **FastAPI ✅:** `@X.get/post/put/patch/delete(path)`; `X = FastAPI()`/`APIRouter(prefix=)`, `include_router(r, prefix=)`; `Depends(fn)` ⇒ middleware theo thứ tự tham số.
   - **Khác** (chưa kiểm chứng): Next.js `pages/api/**`, `app/**/route.ts` (HTTP), `app/**/page.tsx` (PAGE); React Router `<Route element|component>` (PAGE); React Native `<Stack.Screen component>` (SCREEN); Commander `.command(n).action(fn)` (COMMAND); Django `path(route, view)`; Typer/Click `@*.command()` (COMMAND); Spring `@RestController` + `@*Mapping`; Go `http.HandleFunc`, gin `r.GET(p, mw…, h)`, echo `e.GET(p, h, mw…)` (handler **đầu**); Flutter `GoRoute` ⇒ `build` của widget (SCREEN).
2. **ENG-41 Đối số.** Tham chiếu tên ⇒ ENG-31 (1)–(6). Hàm ẩn danh ⇒ symbol tổng hợp (ENG-20), `display_name` = `<receiver>.<verb>('<path>')` như trong code. Lời gọi bọc 1 hàm (`asyncHandler(ctrl.create)`) ⇒ hàm bên trong; factory (`validate(schema)`) ⇒ middleware = hàm factory. `path` = ghép tiền tố mount (đi theo chuỗi mount, có `visited`); không tĩnh ⇒ `null`; mount nhiều nơi ⇒ path nhỏ nhất theo từ điển. `line_start/line_end` = câu lệnh đăng ký.
3. **ENG-42 Entry chung** (adapter không có `ingress_patterns`): file có segment hoặc token cuối của stem ∈ {controller(s), route(s), router(s), handler(s), api, endpoint(s)} **và** in-degree 0 trong đồ thị file ⇒ mọi hàm/method export là entry, `GENERIC`.
4. **ENG-43 Entry chương trình** (chỉ dùng ở ENG-51.4): Go `main` của `package main`, Java `static void main`, `<module>` của file Python có `if __name__ == "__main__"`, `<module>` của `package_entry_files`; `PROGRAM`.
5. **ENG-44 Ingress file** = file chứa ≥ 1 entry `REGISTERED`/`GENERIC` (ứng viên Hub, D-09).

---

## 5. Chọn chế độ — `degraded.ts`

1. **ENG-50** Chạy sau Mục 4. `n` = số file đã parse trong scope; `|E_x|` = số cạnh đồ thị file.
2. **ENG-51 Bảng quyết định** (dòng đầu khớp; `degraded_mode` áp cho cả repo):
   1. Có entry `REGISTERED`/`GENERIC` ⇒ NORMAL (`null`). Lát cắt có thể nằm trong 1 file khi code không gọi chéo file.
   2. `n ≤ CONFIG.PROCEDURAL_MAX_FILES` ⇒ `PROCEDURAL` (Mục 10.1).
   3. `|E_x| = 0` ⇒ `ALGORITHM_COLLECTION` (Mục 10.2).
   4. Có entry `PROGRAM` ⇒ NORMAL với các entry đó; không ⇒ `ALGORITHM_COLLECTION`.

---

## 6. Tarjan & PageRank — `tarjan.ts`, `pagerank.ts`

**Mục đích:** xếp hạng file, không chọn node. **Input:** đồ thị file. **Output:** `rank_score` theo file. Hàm: `tarjanScc(nodes, adj): string[][]`, `pageRank(dag): Map<string, number>`.

1. **ENG-60 Tarjan** (DFS theo khóa sort, bỏ self-loop) ⇒ SCC; co mỗi SCC thành 1 đỉnh ⇒ DAG co cụm. File nhận điểm của đỉnh SCC chứa nó.
2. **ENG-61 SCC khổng lồ.** SCC lớn nhất `> CONFIG.GIANT_SCC_RATIO × số file` ⇒ bỏ cạnh nội bộ `weight` nhỏ nhất (hòa ⇒ `(source, target)` nhỏ nhất), chạy lại; tối đa `CONFIG.GIANT_SCC_MAX_WEAK_EDGE_REMOVALS` lần; vẫn khổng lồ ⇒ giữ + warning "Phát hiện cụm phụ thuộc vòng lớn ({k} file)". Chỉ áp cho đồ thị xếp hạng; đồ thị hàm, lát cắt, `degraded_mode` không đổi.
3. **ENG-62 PageRank** trên DAG co cụm, `N` đỉnh, $PR_0 = 1/N$, $d$ = `CONFIG.PAGERANK_DAMPING`:
   $$PR_{k+1}(u) = \frac{1-d}{N} + d\Big(\sum_{v \to u} \frac{PR_k(v)}{L(v)} + \frac{1}{N}\sum_{L(w)=0} PR_k(w)\Big)$$
   Tối đa `CONFIG.PAGERANK_MAX_ITER` vòng; dừng khi $\sum|PR_{k+1}-PR_k| <$ `CONFIG.PAGERANK_TOLERANCE`; `N = 1` ⇒ 1.
4. **ENG-63 (D-09)** `rank_score(f) = PR(f) + CONFIG.INGRESS_BONUS · 1[f là Ingress file]`. Hub chỉ là Ingress file (chuỗi Controller → Service → Repository không thưởng hội tụ ≈ 0.184 / 0.341 / 0.474, Repository đứng đầu); PageRank chỉ xếp hạng; không lọc "utility sink".

---

## 7. Cognitive Complexity & VIP — `complexity.ts`

1. **ENG-70** Mỗi hàm/method; `<module>` tính trên câu lệnh cấp cao trừ thân định nghĩa; closure/lambda lồng tính vào hàm chứa.
2. **ENG-71 Điểm** (SonarQube):

| Cấu trúc | Điểm |
| :-- | :-- |
| `if` (không phải else-if), ba ngôi / biểu thức điều kiện Python, `switch`/`match`, `for`/`for-in`/`for-of`/`while`/`do-while`, `catch`/`except` | +1 **+ mức lồng** |
| `else if`/`elif`, `else` | +1, **không** cộng mức lồng |
| Mỗi đoạn toán tử logic cùng loại liền nhau trong danh sách toán tử trái → phải (`&&`, `\|\|`, `and`, `or`) | +1 |
| `goto`, `break`/`continue` có nhãn; hàm tự gọi chính nó (1 lần / hàm) | +1 |

3. **ENG-72 Mức lồng** tăng khi vào thân `if`/`else if`/`else`, `switch`, vòng lặp, `catch`, ba ngôi, hàm/lambda lồng; `try`/`finally` không cộng, không tăng. Theo loại node AST (Python như mọi ngôn ngữ), không đếm ngoặc.
4. **ENG-73 VIP** = `complexity > CONFIG.VIP_COMPLEXITY_MIN`.
5. **ENG-74 Dự phòng** (ENG-90, ENG-103): không có VIP ⇒ tối đa `CONFIG.VIP_FALLBACK_TOP_K` hàm có `complexity ≥ CONFIG.VIP_FALLBACK_MIN_SCORE`; không có ⇒ `CONFIG.VIP_FALLBACK_LAST_RESORT_TOP` hàm cao nhất + warning "Repository có độ phức tạp thấp". Thứ tự: `complexity` giảm, `rank_score` file giảm, khóa tăng.

---

## 8. Lát cắt — `slicing.ts`

**Mục đích:** 1 entry ⇒ 1 `Candidate` `SLICE` (D-06). **Input:** `EntryPoint`, đồ thị hàm, `ExternalCall[]`, AST. **Output:** `Candidate`.

```typescript
export function buildSlice(entry: EntryPoint, ctx: EngineContext): Candidate;
```

1. **ENG-80 Thu hàm (1 step = 1 hàm).** Thứ tự: entry (hop 0) ⇒ từng middleware của `binding` theo thứ tự đăng ký (hop 1) kèm hàm nó gọi ⇒ hàm entry gọi. Mỗi gốc duyệt **DFS tiền thứ tự**, callee xếp theo (dòng, cột) call site rồi khóa; chỉ hàm có thân; mỗi hàm 1 lần; không mở rộng ở hop `CONFIG.SLICE_MAX_HOPS`. Call site `ambiguous` ⇒ 1 đích: file có tiền tố thư mục chung dài nhất với caller, hòa ⇒ khóa nhỏ.
2. **ENG-81 Lọc liên quan.** Callee `G` (không phải entry/middleware) được giữ khi: cây con của `G` có `DATA_SINK`, **hoặc** giá trị trả về ở ≥ 1 call site được dùng (gán, return, đối số, điều kiện), **hoặc** `G` có `throw`/`raise`. Không ⇒ bỏ `G` và hàm chỉ đến được qua `G` (VD `logger.info(x)`).
3. **ENG-82 Layer** (ưu tiên trên xuống): entry ⇒ `ENTRY_POINT`; middleware của binding ⇒ `MIDDLEWARE`; file có segment/token cuối stem ∈ {repository, repositories, repo, repos, dao, daos, model, models, entity, entities} ⇒ `DATA_ACCESS`; hàm có `DATA_SINK` **và** không gọi hàm nào trong lát cắt nằm ở file vai trò trên (tự truy cập dữ liệu, không qua repository trong repo) ⇒ `DATA_ACCESS`; còn lại ⇒ `BUSINESS_LOGIC` (VD service gọi `categoryRepo.findById` của repo ⇒ `BUSINESS_LOGIC`).
4. **ENG-83 Mẫu.** `DATA_SINK` = `ExternalCall` khớp: (a) method ∈ {save, insert\*, update\*, delete\*, remove, find\*, create, upsert, query, execute, exec, aggregate, count, get, add, commit} **và** định danh cuối của receiver khớp `/(repository|repo|model|dao|entity|db|database|prisma|knex|pool|conn|connection|client|session|cursor|collection|datasource|manager|tx|trx|jdbcTemplate)$/i` hoặc receiver bắt đầu `prisma.`; (b) receiver có `import_source` ∈ {pg, mysql, mysql2, mongodb, mongoose, sequelize, typeorm, @prisma/client, sqlite3, better-sqlite3, redis, ioredis, knex, sqlalchemy, psycopg2, pymongo, database/sql, gorm.io/gorm}; (c) receiver viết hoa + method ∈ tập (a) khi `tech_stack` có mongoose/sequelize/typeorm. `OUTPUT` = `res.json|send|status|render|redirect|end|sendStatus`, `reply.send`, `next(…)`, `return jsonify|Response|HttpResponse(…)`, `print`, `fetch`/`axios.*`, `setState`/`set<X>`. `console.*`, `logger.*`, `logging.*` **không** là `OUTPUT`.
5. **ENG-84 Criterion** (không dùng ma trận mức độ): câu lệnh `DATA_SINK` **đầu tiên** theo (thứ tự bước, dòng); không có ⇒ `OUTPUT` cuối của entry; không ⇒ `return` cuối của entry; không ⇒ dòng cuối thân entry.
6. **ENG-85 Dòng giữ trong hàm `F`** (đơn vị = câu lệnh AST; câu lệnh ghép chỉ giữ header + dòng đóng):
   - *Hạt giống:* câu lệnh chứa call site tới callee được giữ, `DATA_SINK`, `OUTPUT`; `return`/`throw`/`raise`/`yield`.
   - *Def-use lùi:* với mỗi câu lệnh giữ và tên `v` nó đọc, giữ mọi định nghĩa `v` trong `F` (khai báo, gán, destructuring, biến vòng lặp, tham số catch, đột biến `v.push(…)`, `v.x = …`) nằm trước nó hoặc trong vòng lặp bao nó; lặp tới bất động. `v` là biến cấp module cùng file ⇒ giữ khai báo đó trong snippet. Không cần ánh xạ đối số ↔ tham số (call site là hạt giống).
   - *Điều khiển:* header + dòng đóng của mọi câu lệnh ghép bao câu lệnh giữ (gồm `else`, `case`, `catch`, `finally`); **guard clause** = `if` đứng trước câu lệnh giữ (cùng khối hoặc khối bao) có thân kết thúc bằng `return`/`throw`/`raise`/`continue`/`break`/`sys.exit`/`res.status(4xx|5xx)`.
   - Luôn giữ chữ ký (từ `line_start` tới dòng mở thân) và dòng đóng. Handler ẩn danh: snippet = cả câu lệnh đăng ký.
7. **ENG-86 Elision & map.** Mỗi đoạn liền nhau ≥ 1 dòng không rỗng bị bỏ ⇒ 1 marker `<thụt lề dòng bỏ đầu><comment_prefix> … (<n> dòng)`, `snippet_line_map` = 0; đoạn chỉ có dòng rỗng bỏ không marker. `line_start`/`line_end` = min/max giá trị ≠ 0 của map. `function_name` = `Class.method` / tên hàm / `display_name` của binding. File ảo ⇒ `origin_note = originNoteFor(…)` (`10` ING-102).
8. **ENG-87 Hard Clamp** khi bước > `CONFIG.STEP_MAX_LINES` dòng: giữ chữ ký `S`, dòng đóng `C`, cửa sổ $W = \min(\texttt{CLAMP\_WINDOW\_LINES}, \texttt{STEP\_MAX\_LINES} - |S| - |C| - 2)$ dòng trên dãy dòng giữ còn lại, chứa **mốc**, căn giữa nếu được. Mốc = dòng criterion nếu thuộc bước; không ⇒ call site đầu tới bước kế được giữ; không ⇒ hạt giống đầu. Ngoài cửa sổ ⇒ ≤ 2 marker. $W < 1$ ⇒ `S` rút còn dòng đầu.
9. **ENG-88 Trần node.** `lines` = Σ dòng snippet (kể cả marker); `tokens` = ⌈Σ ký tự / `CONFIG.CHARS_PER_TOKEN`⌉. Vượt `CONFIG.NODE_MAX_LINES` hoặc `CONFIG.NODE_MAX_CODE_TOKENS` ⇒ (a) lặp bỏ bước **lá** không bảo vệ có hop lớn nhất (hòa ⇒ `step_number` lớn); bảo vệ = entry, middleware, hàm trên đường DFS tới hàm chứa criterion; (b) chỉ còn bước bảo vệ ⇒ lặp giảm `W` của bước dài nhất đi 1 và clamp lại (tối thiểu 1). Đánh số lại `step_number` 1..n.
10. **ENG-89 `dto_snippet`.** Tên kiểu trong dòng giữ (chú thích kiểu, generic, `new T`, `as T`, `@Body() dto: T`) ⇒ `INTERFACE`/`TYPE`, `CLASS` dạng dữ liệu (chỉ field/constructor, tên đuôi Dto/Request/Response/Input/Payload/Schema/Model/Entity, `@dataclass`, kế thừa `BaseModel`) hoặc biến module tên đuôi `Schema`; trừ lớp của các bước. Thứ tự tham chiếu đầu, rồi khóa; ghép nguyên khai báo, tổng ≤ `CONFIG.STEP_MAX_LINES` dòng (không vừa ⇒ phần đầu + marker); không có ⇒ `""`.

---

## 9. Node thuật toán — `nodes.ts`

1. **ENG-90 Khi nào tạo.** (a) VIP trong scope **không** là bước của lát cắt nào (sau ENG-81, ENG-88). (b) NORMAL có `< CONFIG.DISPLAY_MIN_NODES` candidate sau ENG-110 ⇒ thêm hàm chưa phủ có `complexity ≥ CONFIG.VIP_FALLBACK_MIN_SCORE` (thứ tự ENG-74) tới khi đủ. (c) `ALGORITHM_COLLECTION` (ENG-103).
2. **ENG-91 Chia bước** (ngoại lệ "1 step = 1 hàm": các bước cùng `function_name`). *Câu chính* = vòng lặp cấp 1 nhiều dòng nhất (hòa ⇒ đầu tiên); không có ⇒ câu cấp 1 có điểm ENG-71 lớn nhất. `ALGO_SETUP` = chữ ký + câu trước; `ALGO_EXECUTION` = câu chính; `ALGO_TERMINATION` = câu sau + dòng đóng. Không có câu điều khiển ⇒ SETUP = mọi câu trừ câu cuối, TERMINATION = câu cuối. Bỏ bước rỗng; không elision def-use; clamp ENG-87 (mốc: dòng cuối trước câu chính / header / câu đầu); rồi ENG-88, ENG-89.
3. **ENG-92** `entry_symbol` = khóa hàm; `cognitive_complexity = complexity`; `is_vip_algorithm = true`; `functions = [khóa]`.

---

## 10. Chế độ suy biến — `degraded.ts`

**10.1 `PROCEDURAL`**
1. **ENG-100 P1.** Entry giả = mọi hàm (kể cả `<module>`) có ≥ 1 câu lệnh trong file trong scope ⇒ Mục 8 (không binding) ⇒ gộp ENG-110 ⇒ cạnh ENG-112.
2. **ENG-101 P2.** Chạy khi P1 có `< CONFIG.FUNCTION_GRAPH_MIN_NODES` candidate, hoặc 0 cạnh, hoặc hàm dài nhất `> CONFIG.LONG_FUNCTION_LINES` dòng. `M` = hàm nhiều dòng nhất (hòa ⇒ khóa nhỏ). Câu lệnh cấp 1 của `M` nhận nhãn (ưu tiên trên xuống): `DATA` (có `DATA_SINK`) · `VALIDATE` (guard clause, `assert`, `.parse(`/`.validate(`) · `INPUT` (đọc `req.body|params|query`, `request.json|args`, `input(`, `sys.argv`, `process.argv`, `parse_args(`, `Scanner`) · còn lại `COMPUTE_OUTPUT`. Mỗi nhãn có câu lệnh ⇒ 1 node ảo; < 2 nhãn ⇒ bỏ P2. Kết quả = node ảo của `M` + candidate P1 **không** chứa `M`.
3. **ENG-102 Node ảo.** `id = vnode-<hash6(file_path + "#" + NHÃN)>`; 1 bước, layer `INPUT`⇒`ENTRY_POINT`, `VALIDATE`⇒`MIDDLEWARE`, `COMPUTE_OUTPUT`⇒`BUSINESS_LOGIC`, `DATA`⇒`DATA_ACCESS`; snippet = chữ ký + câu lệnh của nhãn (ENG-86, ENG-87 mốc = câu đầu của nhãn); `entry_symbol = null`; `ARCHITECTURAL_DATA_FLOW`; `cognitive_complexity` = tổng điểm ENG-71 các câu của nhãn; `rank_score` = của file. Cạnh: chuỗi theo dòng đầu của mỗi nhãn, `RESOLVED` (ngoại lệ D-07 vì cùng dùng `M`).

**10.2 `ALGORITHM_COLLECTION`**
4. **ENG-103** Ứng viên = hàm trong scope (`<module>` chỉ khi file không có hàm khác); VIP, không có ⇒ ENG-74; lấy tối đa `CONFIG.DEGRADED_TOP_FUNCTIONS` theo thứ tự ENG-74; mỗi hàm ⇒ ENG-91. Sau Display Budget, số thành phần liên thông yếu `≥ CONFIG.VIRTUAL_ROOT_MIN_COMPONENTS` ⇒ thêm node gom nhóm.
5. **ENG-104 Node gom nhóm (D-24).** `id = vroot-algorithms`, `is_group_root = true`, `title = "Algorithm Collection"`, `VIRTUAL`, evidence = số node con, `ALGORITHMIC_CORE`, `entry_symbol = null`, `trace_steps = files = languages = []`, `dto_snippet = ""`, `support_tier` = thấp nhất của node con, `cognitive_complexity = rank_score = 0`, `is_vip_algorithm = is_capstone = false`, Uncle Bob miễn trừ. Chỉ hiển thị: không phân tích, không học, **không** tính vào Display Budget. Cạnh tới mỗi node gốc (`RESOLVED`) chỉ để vẽ, **không** vào `prerequisites` (node con vẫn là gốc). Node `vnode-*` (10.1) có code thật, học như node thường.

---

## 11. Ghép node, id, cạnh, Display Budget, Capstone — `nodes.ts`

1. **ENG-110 Gộp.** Cùng tập `functions` ⇒ giữ `order_key` nhỏ nhất (`order_key` = `entry_symbol`; node ảo = khóa băm). Tập con thực sự không gộp.
2. **ENG-111 Tên gốc & id (D-08).** Thang tên Mục 13 (bậc 1–5) chạy trên **mọi** candidate ⇒ `base_title`, `title_source`, `title_evidence` (vì `id` cần tên trước khi tie-break). `slug(t)`: NFD bỏ dấu, `đ`⇒`d`, viết thường, ngoài `[a-z0-9]` ⇒ `-`, gộp `-`, bỏ `-` hai đầu, cắt `CONFIG.TITLE_MAX_CHARS` ký tự, rỗng ⇒ `node`. `hash6(s)` = 6 hex đầu SHA-1(UTF-8). Lát cắt `slice-<slug(base_title)>-<hash6(entry_symbol)>`; thuật toán `algo-<slug>-<hash6(khóa hàm)>`; node ảo ENG-102; Virtual Root ENG-104.
3. **ENG-112 Cạnh D-07.** Mọi cặp có `functions` giao ≠ ∅: A → B nếu `cognitive_complexity` A nhỏ hơn; hòa ⇒ `rank_score` lớn hơn; hòa ⇒ `id` nhỏ hơn. Thứ tự toàn phần ⇒ `G0` không chu trình (assert bằng `tarjanScc`).
4. **ENG-113** Rút gọn bắc cầu `G0` ⇒ `G0r` (bỏ `u → v` khi còn đường dài ≥ 2).
5. **ENG-114 Display Budget.** `max = CONFIG.DISPLAY_MAX_NODES`, không đếm node `is_group_root`. ≤ `max` ⇒ giữ hết. Ngược lại: (1) đường dài nhất (số node) trên `G0r`, quy hoạch động theo thứ tự tô-pô (Kahn, hòa ⇒ `id` nhỏ), chọn đỉnh trước/đỉnh cuối có độ dài lớn nhất, hòa ⇒ `rank_score` lớn, hòa ⇒ `id` nhỏ; giữ tối đa `CONFIG.CRITICAL_PATH_MAX_NODES` node đầu đường; (2) thêm còn lại theo: `cognitive_complexity > CONFIG.VIP_COMPLEXITY_MIN` trước, `rank_score` giảm, `cognitive_complexity` giảm, `id` tăng — tới `max`. Node bị bỏ không gộp file vào node khác.
6. **ENG-115 Cạnh trên tập giữ `K`** = rút gọn bắc cầu của `{(u,v) ∈ K² : v đến được từ u trong G0}` (giữ khả năng đến qua node bị bỏ, **không** giữ bao đóng đầy đủ). `confidence = RESOLVED` khi: cạnh D-07 có hàm chung `f` mà đường DFS (ENG-80) tới `f` ở cả hai lát cắt toàn cạnh hàm `RESOLVED`; hoặc (cạnh qua node bị bỏ) có đường trong `G0` toàn cạnh `RESOLVED`; hoặc là cạnh node ảo/gom nhóm. Còn lại `INFERRED`. `GraphEdge.id = "${source}->${target}"`; `prerequisites` = nguồn cạnh vào **trừ** node `is_group_root`, sort.
7. **ENG-116 Capstone (D-12).** Trong node cuối trừ node `is_group_root`: `cognitive_complexity` lớn nhất, hòa ⇒ `rank_score` lớn nhất, hòa ⇒ `id` nhỏ nhất; đúng 1.
8. **ENG-117 Trường.** `files` = file các bước theo thứ tự, không trùng; `languages` = `LanguageId` của `files`, sort; `support_tier` = `STRUCTURAL` nếu có file `STRUCTURAL`, ngược lại `RESOLVED`; lát cắt: `cognitive_complexity` = max `complexity` các hàm (D-12), `rank_score = rank_score(files[0])`, `ARCHITECTURAL_DATA_FLOW`, `is_vip_algorithm = false`. `is_group_root = false` trừ ENG-104.
9. **ENG-118** 0 node sau mọi bước ⇒ `ERR_NO_ARCHITECTURAL_SLICE`.

---

## 12. Uncle Bob — `unclebob.ts`

1. **ENG-120** `S` = `files` cuối của node. `Ce` = số file ngoài `S` là đích cạnh đồ thị file từ `S`; `Ca` = số file ngoài `S` có cạnh vào `S`; thư viện ngoài **không** tính. $I = C_e/(C_a+C_e)$.
2. **ENG-121** `Na` = kiểu trừu tượng khai báo trong `S` (`INTERFACE`, abstract class, `TYPE` dạng object, Python `ABC`/`Protocol`, Go `interface`, loại trong `abstraction_kinds`); `Nc` = lớp/struct cụ thể. $A = N_a/(N_a+N_c)$, $D = |A+I-1|$.
3. **ENG-122 Miễn trừ** (`is_exempt`, `I = A = D = 0`, `BALANCED`): node ảo, node gom nhóm; archetype ∈ {WEB_FRONTEND, MOBILE_APP, DESKTOP_APP} và `files[0]` là màn hình UI (`.tsx/.jsx`, file ảo `.vue/.svelte`, `.dart` có import react/vue/svelte/flutter); mọi file của `S` là `JAVASCRIPT` hoặc `STRUCTURAL` thiếu `abstraction_kinds`; `Ca + Ce = 0`; `Na + Nc = 0`.
4. **ENG-123** `D < CONFIG.UNCLE_BOB_BALANCED_MAX_D` ⇒ `BALANCED`; `D ≥ CONFIG.UNCLE_BOB_ZONE_MIN_D` và `A + I < 1` ⇒ `ZONE_OF_PAIN`; `D ≥ CONFIG.UNCLE_BOB_ZONE_MIN_D` và `A + I > 1` ⇒ `ZONE_OF_USELESSNESS`; còn lại `BALANCED`.

---

## 13. Đặt tên tất định — `naming.ts`

**Mục đích:** `title`, `title_source`, `title_evidence` từ code, 0 token, AI không đổi. Bậc đầu cho tên hợp lệ thắng; bậc 5 luôn thành công.

1. **ENG-130 `normalizeTokens`.** (1) Tách camelCase/PascalCase (`HTTPServer` ⇒ http, server), `_`, `-`, `.`, `/`. (2) Bỏ `TECH_TOKENS` = controller ctrl service svc repository repo dao model entity dto schema handler handle impl manager helper util utils router route routes view views api endpoint module index main base abstract interface default async sync, đoạn `v\d+`; bỏ tiền tố `I` khi ký tự 2 viết hoa. (3) Bỏ token toàn số và token dài `< CONFIG.TITLE_MIN_TOKEN_CHARS`, trừ `ACRONYMS` = id ui ai io os qr. (4) Số ít: `-ies`⇒`-y`, `-sses`⇒`-ss`, `-s`⇒`""`; không áp cho token dài ≤ `CONFIG.TITLE_MIN_TOKEN_CHARS` hoặc đuôi `ss|us|is`. (5) Title Case; `ACRONYMS` và từ viết hoa toàn bộ trong code giữ in hoa. (6) Định danh không ASCII chỉ tách token.
2. **ENG-131 Bậc 1 `ROUTE`** (cần binding). Đoạn path chỉ nhận `[A-Za-z0-9_-]`, dài ≤ `CONFIG.ROUTE_SEGMENT_MAX_CHARS`; bỏ đoạn dài ≥ `CONFIG.HIGH_ENTROPY_MIN_CHARS` có entropy > `CONFIG.HIGH_ENTROPY_MIN_BITS` bit/ký tự, `api`, `v\d+`, tham số (`:id`, `{id}`, `<int:id>`, `[id]`, nhớ vị trí) ⇒ đoạn tĩnh `S`. `HTTP`: `|S| ≥ 2` hai đoạn cuối liền ⇒ `Singular(S[-2]) S[-1]`; có tham số xen ⇒ mẫu 1 đoạn cho `S[-1]` + `Singular(S[-2])`; `|S| = 1`: POST Create X, GET có tham số cuối Get X, GET List Xs, PUT/PATCH Update X, DELETE Delete X; `|S| = 0`/path `null` ⇒ bỏ bậc. `PAGE`/`SCREEN`/`COMMAND` ⇒ tên + Page/Screen/Command. Evidence `"<METHOD> <path>"`.
3. **ENG-132 Bậc 2 `ENTRY_SYMBOL`.** `normalizeTokens(tên entry)`, bỏ token đầu `post|put|patch`; còn 1 token ⇒ ghép tài nguyên từ tên lớp chứa. Rỗng hoặc toàn `GENERIC_NAMES` = main run start init handler callback cb fn func process execute exec test tmp temp foo bar `<module>` default anonymous ⇒ bỏ bậc. Evidence = khóa bỏ phần `file#`.
4. **ENG-133 Bậc 3 `DOMAIN_TERMS`.** Token (bỏ `GENERIC_NAMES`) từ tên lớp/hàm/interface/DTO định nghĩa trong `files`; $\text{score}(t) = \text{tf}(t)(\ln\frac{1+N}{1+\text{df}(t)}+1)$, `N` = `|file_index|`, `df` = số file có định danh chứa `t`. Tối đa `CONFIG.DOMAIN_TERMS_MAX` token điểm cao nhất (hòa ⇒ từ điển) có `tf ≥ CONFIG.DOMAIN_TERM_MIN_TF`, nối `" / "`. Evidence `"order×6, inventory×3"`.
5. **ENG-134 Bậc 4 `DIRECTORY`.** Thư mục đầu tiên (đi ngược từ thư mục của `files[0]`) ∉ `GENERIC_DIRS` = src lib app internal pkg cmd main java kotlin com org net controllers services repositories repos routes handlers api modules core common shared utils components pages views features domain infra infrastructure.
6. **ENG-135 Bậc 5 `FILE_BASENAME`.** Basename `files[0]` bỏ đuôi và hậu tố vai trò ⇒ `normalizeTokens`; rỗng ⇒ basename nguyên.
7. **ENG-136 Đặc biệt.** Virtual Root: ENG-104. Node ảo: `"<tên gốc>: <Chặng>"` (tên gốc = bậc 2→5 trên `M`; Chặng = Input / Validation / Compute & Output / Data Access), `VIRTUAL`.
8. **ENG-137 Giới hạn.** Tối đa `CONFIG.TITLE_MAX_TOKENS` token (không tính hậu tố khử trùng); ký tự: chữ, số, khoảng trắng, `/ & : - ( ) #`; không lấy chữ từ comment/string. Engine lưu tên đầy đủ; cắt `CONFIG.TITLE_MAX_CHARS` + `…` là việc **hiển thị** của UI.
9. **ENG-138 Khử trùng (sau Display Budget).** Duyệt node giữ theo `id`; nhóm `base_title` trùng (không phân biệt hoa thường): (1) cùng `ROUTE` khác method ⇒ `" (GET)"`…; (2) còn trùng ⇒ thư mục gần nhất khác nhau của `files[0]` `" (cart)"`; (3) còn trùng ⇒ `" #2"`, `" #3"` theo `id` ⇒ `title`. `id` không đổi.

---

## 14. Bố cục — `layout.ts`

1. **ENG-140** `@dagrejs/dagre`: `rankdir = CONFIG.DAGRE_RANKDIR`, `ranksep = CONFIG.DAGRE_RANKSEP`, `nodesep = CONFIG.DAGRE_NODESEP`; `setNode(id, { width: CONFIG.NODE_BOX_WIDTH, height: CONFIG.NODE_BOX_HEIGHT })` theo `id` tăng; `setEdge` theo `GraphEdge.id` tăng; `dagre.layout(g)`.
2. **ENG-141** `position = { x: round(cx − CONFIG.NODE_BOX_WIDTH/2), y: round(cy − CONFIG.NODE_BOX_HEIGHT/2) }`. Trạng thái node suy ra ở `03` §5.1.

---

## 15. Whitelist, file_index, kết quả — `whitelist.ts`, `index.ts`

```typescript
export function buildSymbolWhitelist(idx: SymbolIndex, finalStepFunctions: string[]): string[];
export function toClientResult(r: StaticEngineResult): ClientStaticEngineResult;
export function mainPath(graph: StaticEngineResult): string[];   // → RepoOverviewView.facts.main_path_node_ids
```

1. **ENG-150 `symbol_whitelist` (D-19, phạm vi repo):** (a) `name` mọi `SymbolDefinition` (hàm, method, lớp, interface, type, biến cấp module) + dạng `Class.method`; (b) tên mọi field/property trong lớp, interface, type object, dataclass/pydantic, struct (toàn repo); (c) tham số + biến cục bộ (ENG-24) của mọi hàm là bước trong node cuối. Bỏ tên tổng hợp chứa `<`; giữ dạng gốc; bỏ trùng; sort mã UTF-16. Chuẩn hóa khi so thuộc `21`. Không chứa `tech_stack`.
2. **ENG-151** `file_index` = path file parse thành công (sau ENG-12), sort; `total_files = ingestion_report.code_file_count`.
3. **ENG-152 Report.** Điền `skipped.parse_error`, `degraded_mode`, `engine_ms` = `performance.now()` cuối G13 − đầu G1 (làm tròn). `engine_ms > CONFIG.ENGINE_BUDGET_MS` ⇒ warning, không đổi hành vi. Warning ghi theo thứ tự giai đoạn.
4. **ENG-153** `engine_version = CONFIG.ENGINE_VERSION`; `repo_name`, `snapshot`, `fingerprint` từ `IngestOutput`; `nodes`, `edges` sort theo `id`.
5. **ENG-154 `toClientResult`** dựng object mới **từng trường** (API-03, không spread): mọi trường trừ `symbol_whitelist`; `ingestion_report` chép từng trường trừ `suspicious_instruction_files`.
6. **ENG-155 `mainPath`** (hàm thuần, chỉ đọc `nodes`, `edges`): bỏ node `is_group_root` và cạnh của nó; đường dài nhất (số node) trên DAG còn lại bằng quy hoạch động như ENG-114 (1) nhưng **không** giới hạn `CONFIG.CRITICAL_PATH_MAX_NODES` và hòa **chỉ** theo `id` nhỏ hơn (thứ tự tô-pô Kahn, đỉnh trước, đỉnh cuối). Trả `id` từ gốc tới cuối; không có node ⇒ `[]`. Dùng cho `RepoOverviewView.facts.main_path_node_ids` (`20`).

---

## Test bắt buộc

| ID | Input | Kỳ vọng |
| :-- | :-- | :-- |
| T-ENG-01 | `findPath`: `if (!graph \|\| !start)` lồng 0 · `for` 0 · `if` 1 · `for` 2 · `if` 3 | 2+1+2+3+4 = **12** |
| T-ENG-02 | `for (x of items) { if … else if … else … }` (TS và Python `elif`) · `a && b \|\| c` | 1+2+1+1 = **5** (else-if không cộng mức lồng; cách cũ ra 6) · +2 |
| T-ENG-05 | PageRank chuỗi C → S → R, d 0.85, ≤ 20 vòng, tol 1e-6 | ≈ 0.1844 / 0.3412 / 0.4744 (±1e-3); C Ingress ⇒ ≈ 0.6844 |
| T-ENG-06 | Tarjan 1 → 2, 2 ⇄ 3 · SCC 5/8 file không tách được | SCC `{1}`, `{2,3}` · warning, lát cắt không đổi |
| T-ENG-08 | `router.post('/checkout', authMiddleware, async (req,res) => {… orderService.checkout(…)})`; `checkout` gọi `productRepo.findOne/save` (repository TypeORM ngoài) | Bước 1 `ENTRY_POINT` `"router.post('/checkout')"`, khóa `…/order.routes.ts#<POST /checkout>`; bước 2 `MIDDLEWARE` `authMiddleware` kèm dòng `const JWT_SECRET` cấp module (`line_start` = dòng đó); bước 3 `OrderService.checkout` `DATA_ACCESS`; criterion = dòng `productRepo.findOne` |
| T-ENG-09 | `const t0 = Date.now()`, `logger.info(x)` (logger nội bộ) | Thành marker; không có bước logger |
| T-ENG-10 | Hàm 80 dòng, criterion dòng 50, chữ ký 1 dòng | Chữ ký + cửa sổ 26 dòng chứa dòng 50 + đóng + 2 marker = 30 |
| T-ENG-11 | 5 bước, 140 dòng, criterion ở bước 3 | Bỏ lá không bảo vệ sâu nhất trước; ≤ 100 dòng, ≤ 1500 token; còn bước 1–3 |
| T-ENG-12 | `this.svc.run()`, `svc: IOrderService` có 1 impl · 2 impl · comment `// orderItemRepo.save()` | Chuyển sang impl · 2 cạnh `ambiguous` · không cạnh |
| T-ENG-14 | A {a,s} cc 3 · B {b,s,t} cc 8 · C {c,t} cc 12 · D {d,s,t} cc 20 | `G0` A→B, B→C, A→D, B→D, C→D ⇒ A→B→C→D |
| T-ENG-15 | `G0r` A→X→C, A→B, B→C, giữ {A,B,C} · chuỗi A→B→C, giữ {A,C} | A→B, B→C (không A→C) · A→C |
| T-ENG-18 | `"Order Checkout"` + `src/routes/order.routes.ts#<POST /checkout>` · `src/algo/dijkstra.ts#findShortestRoute` | `slice-order-checkout-a6ff3b` · `algo-find-shortest-route-acfab3` |
| T-ENG-19 | 12 candidate, đường dài nhất 6 · 2 node cc 20, rank 0.6/0.7 | 4 đầu đường + 4 theo ENG-114 = 8 · Capstone = rank 0.7 |
| T-ENG-21 | TS Na 2, Nc 3, Ce 1, Ca 1 · Na 0, Nc 2, Ce 0, Ca 3 · toàn `.js` | A 0.4, I 0.5, D 0.1 `BALANCED` · D 1 `ZONE_OF_PAIN` · miễn trừ |
| T-ENG-22 | `POST /orders/checkout` · `GET /users/:id/orders` · `POST /orders` · `GET /orders/:id` · `GET /orders` · `DELETE /orders/:id` | Order Checkout · List User Orders · Create Order · Get Order · List Orders · Delete Order |
| T-ENG-23 | `crawler/run.py` `main()`, crawler×4, page×3 · hai "Checkout" ở `cart/`, `payment/` | "Crawler / Page" · "Checkout (cart)", "Checkout (payment)", `id` không đổi |
| T-ENG-25 | 1 file Express 5 route · `main.py` không route, 5 hàm gọi nhau | NORMAL 5 lát cắt · `PROCEDURAL` P1 |
| T-ENG-27 | `main.py` 1 hàm 400 dòng: `input()`, `if … raise`, tính, `cursor.execute` | 4 node ảo Input → Validation → Compute & Output → Data Access; id node đầu `vnode-a7a80f` (`hash6("main.py#INPUT")`) |
| T-ENG-28 | 20 file bài tập, 0 cạnh, 0 entry, 6 hàm > 15 | `ALGORITHM_COLLECTION`: 6 `algo-*` (đều `prerequisites []`) + `vroot-algorithms` (`is_group_root`, `trace_steps []`), 6 cạnh vẽ từ vroot; Capstone là 1 node `algo-*` |
| T-ENG-29 | 3 câu khởi tạo, `while` 20 dòng, `return` | `ALGO_SETUP` / `ALGO_EXECUTION` / `ALGO_TERMINATION` |
| T-ENG-30 | `ALGORITHM_COLLECTION`, không hàm nào ≥ 5 | 3 hàm cao nhất + warning |
| T-ENG-31 | File 40% byte trong `ERROR` · mọi file như vậy | Bỏ file, `parse_error 1`, không trong `file_index` · `ERR_NO_ARCHITECTURAL_SLICE` |
| T-ENG-32 | `OrderService.checkout(userId, items)`, DTO field `qty` | Whitelist ⊇ `OrderService`, `checkout`, `OrderService.checkout`, `userId`, `items`, `qty`; sort; không `<module>` |
| T-ENG-33 | `toClientResult` | Không `symbol_whitelist`, không `suspicious_instruction_files` |
| T-ENG-35 | `mainPath`: cạnh `n-a→n-b→n-d`, `n-a→n-c→n-d`, `vroot-algorithms→n-a` | `["n-a","n-b","n-d"]` (hòa theo `id`; không có vroot) |
| T-ENG-34 | `runEngine` 2 lần cùng zip (X-01) | `nodes`, `edges`, `symbol_whitelist` giống hệt khi `JSON.stringify` |

---

## Chỉ mục edge case (Phần 1 audit cũ → luật)

1.1 → ENG-51, 87–88, 100–102 · 1.4 → ENG-51, 74, 103–104 · 1.5 → ENG-86 (+ `10` ING-100–102) · 1.6 → ENG-60, 112 · 1.22 → ENG-12 · 1.23 → ENG-04, 31, 33 · 1.24 → ENG-22–23, 32 · 1.25 → ENG-25–27 · 1.26 → ENG-34, 40–41, 80, 82 · 1.27 → ENG-20–21 · 1.28 → ENG-60–61 · 1.29 → ENG-62–63 · 1.30 → ENG-40–44 · 1.31 → ENG-51 · 1.32 → ENG-20, 70–74 · 1.33 → ENG-80–89 · 1.34 → ENG-120–123 · 1.35 → ENG-01, 114–118, 141 · 1.36 → ENG-02, 11, 152 · 1.37 → ENG-24, 150 · 1.38 → ENG-111, 130–138. Case 1.2, 1.3, 1.7–1.21: `10_ENGINE_INGEST.md`.
