# AGENTS.md — luật chung cho mọi AI (Claude, Antigravity, Gemini, Copilot)

Repo **tài liệu** tiếng Việt cho dự án SimpliFey (hackathon SGU 2026). Không có code ở đây. Chi tiết dự án: `CLAUDE.md`.

## Bản đồ
- `spec/` — nguồn quy chuẩn duy nhất. `00` quyết định · `01` kiến trúc & luồng · `02` mọi kiểu + bảng `CONFIG` · `03` API & DB · `04` triển khai · `10`,`11` engine · `20`,`21`,`22` AI & BKT · `30` UI · `40` kế hoạch · `50` test.
- `pitch/` — tài liệu thuyết trình, không dùng để code. `spec/` thắng khi lệch.
- `.ai/` — việc của AI: `tasks/` (đề bài + báo cáo), `tools/` (lệnh kiểm), `CHOT_CUOI.md` (quyết định đang áp dụng).
- **Không đọc** `archive/`, `prototype/` trừ khi task chỉ định.

## Luật cứng
1. Một sự thật một chỗ: kiểu dữ liệu chỉ ở `spec/02`; con số chỉ ở bảng `CONFIG` của `spec/02`. File khác gọi bằng tên (`CONFIG.MAX_CLEAN_FILES`, `D-27`, `BKT-41`).
2. Đổi quyết định: sửa dòng D-xx ở `spec/00` trước, rồi mới sửa file đích.
3. Không phá bất biến INV-01..13 (`spec/01` Mục 2). Không hứa "100%". Không nhận là mình phát minh BKT / PageRank / Tree-sitter.
4. Không bịa số đo (độ trễ, chi phí, số người dùng). Số chưa đo ⇒ ghi "mục tiêu / ước tính, chưa đo".
5. Viết tiếng Việt, sơ đồ Mermaid, đường dẫn tương đối. File spec ≤ 40 000 byte (riêng `spec/20` ≤ 47 433).
6. Không đọc, không in nội dung file `.env*`.

## Lệnh kiểm (chạy ở gốc repo; lần đầu: `cd .ai/tools/mmcheck && npm install`)
```
node .ai/tools/mmcheck/check.mjs spec/<file>.md                        # sơ đồ Mermaid
node .ai/tools/preserve.mjs spec/<file>.md                             # khối code / mã bị mất so với HEAD
node .ai/tools/refcheck.mjs --diff .ai/tools/refcheck_baseline.txt     # tham chiếu hỏng mới
tr -d '\r' < spec/<file>.md | wc -c                                    # byte (đo theo LF)
```

## Cần X ⇒ đọc
| Cần | Đọc |
| :-- | :-- |
| Hằng số, kiểu, mã lỗi | `spec/02` Mục 1, 2–8, 9 |
| Bảng DB, endpoint | `spec/03` Mục 2, 3 |
| Luồng đầu–cuối | `spec/01` Mục 5 |
| Quyết định đang áp dụng / chờ | `spec/00`, `.ai/CHOT_CUOI.md` |

## Quy trình task
Đề bài ở `.ai/tasks/TASK_xx.md`. Chỉ ghi vào đúng các file task cho phép. Chỉ chạy lệnh git mà task ghi sẵn. Xong: ghi báo cáo `.ai/tasks/TASK_xx.report.md` (đo byte bằng lệnh, không tự điền) và tạo file rỗng `.ai/tasks/DONE_xx`.
