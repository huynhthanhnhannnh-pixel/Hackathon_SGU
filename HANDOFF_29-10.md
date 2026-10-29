# BÀN GIAO — phiên Claude 29/10/2026 (chiều)

> File nháp, chưa track. Người / AI phiên sau đọc file này trước tiên. Xong việc thì xóa.

## 1. Bối cảnh

- Repo tài liệu (tiếng Việt) cho hackathon SGU; đọc `CLAUDE.md`. Nhánh làm việc: **`docs/cau-truc-spec`**. **Spec chốt 30/10/2026**, thi 31/10.
- Cách làm việc: **Claude (Opus) = đầu não** (phân tích, viết task, kiểm, commit) · **Antigravity = thợ** (làm theo file `TASK_xx.md` ở gốc repo). Claude kiểm bằng script, **không đọc lại cả file spec**.
- Luôn trình bày phân tích + đề xuất và **chờ người dùng đồng ý trước khi sửa file repo**. Không push, không merge khi chưa được bảo.
- `spec/01_KIEN_TRUC_VA_LUONG.md` đang có thay đổi của người khác: **không add, không sửa, không restore**.
- Antigravity hay **bỏ bước cuối** (không tạo file DONE), **tự báo số sai** (byte), và **bịa số liệu** dù bị cấm ⇒ luôn tự kiểm lại.

## 2. Đã xong

- **TASK_03** (sắp lại `spec/10, 11, 20, 22, 30` theo khung Đọc nhanh): đã kiểm đạt và commit `723d1f0`, `d44d237`. Đã xóa `TASK_03_cau_truc_spec.md`.

## 3. Đang dở — CHƯA commit

**TASK_04** (kiến trúc triển khai) — Antigravity đã làm xong, Claude đã kiểm sơ bộ:
- Tạo: `spec/04_KIEN_TRUC_TRIEN_KHAI.md` (22 KB, 6 sơ đồ OK), `pitch/KIEN_TRUC_BGK.md` (19,5 KB), `TASK_04_nghien_cuu.md` (sổ nghiên cứu, có URL nguồn R-01..R-12).
- Sửa: `spec/00` (thêm D-27..D-32, Q-10, Q-11 vào Mục 2), `spec/40` Mục 3 + 10, `README.md`.
- **Lỗi đã biết, phải sửa trước khi commit:**
  1. Số bịa: pitch "Gemini 1.2–1.8 s", "ping < 10 ms"; `spec/04` "Tầng 0–2 < 2 giây" (lệch mục tiêu 1,5 s).
  2. Số nằm ngoài bảng CONFIG: `= 4` trong D-31, `QUEUE_TIMEOUT_MS = 10000` trong `spec/04`, `tracesSampleRate ≤ 0.1` trong D-29.
  3. `pitch/KIEN_TRUC_BGK.md` 19,5 KB > giới hạn 15 KB.
- **Phần lớn D-27..D-30 sẽ bị viết lại** theo quyết định mới (Railway → Vercel, bỏ Pino) — xem `CHOT_MUC2_29-10.md`.

## 4. File nháp ở gốc repo (chưa track)

| File | Nội dung | Trạng thái |
| :-- | :-- | :-- |
| `CHOT_MUC2_29-10.md` | Người dùng duyệt từng dòng D-06..D-32 của `spec/00` Mục 2. Mục A = đã chốt; **Mục B = 4 đề xuất của Claude chờ xác nhận** (giữ D-08, giữ ½ D-15, tải trước 1–2 node, "Học lại từ đầu" = phiên mới); Mục C = giải thích cho đồng đội; Mục D = định nghĩa link gốc repo. | Người dùng **chưa đọc** |
| `DE_XUAT_cau_truc_AI.md` | Đề xuất `AGENTS.md` + `.agents/rules/` + `.ai/` + `.gitignore` cho 2 AI. | Chờ nhóm duyệt |
| `TASK_04_kien_truc_trien_khai.md` | Đề bài TASK_04. | Xóa sau khi commit TASK_04 |
| `TASK_04_nghien_cuu.md` | Sổ nghiên cứu TASK_04. | Giữ tới khi commit TASK_04, rồi xóa hoặc chuyển `archive/` |

## 5. Công cụ kiểm (giữ, chưa xóa)

Thư mục `C:/Users/Admin/Desktop/hackathon-2026-tools` (đề xuất chuyển vào `.ai/tools/`). Chạy ở gốc repo:
```
node "C:/Users/Admin/Desktop/hackathon-2026-tools/mmcheck/check.mjs" spec/<file>        # sơ đồ Mermaid
node "C:/Users/Admin/Desktop/hackathon-2026-tools/tools/preserve.mjs" spec/<file>       # khối code / token bị mất (so với HEAD)
node "C:/Users/Admin/Desktop/hackathon-2026-tools/tools/refcheck.mjs" --diff "C:/Users/Admin/Desktop/hackathon-2026-tools/tools/refcheck_baseline.txt"
```
Đo byte theo LF (repo bật `core.autocrlf`): `tr -d '\r' < file | wc -c`. Giới hạn spec ≤ 40 000 byte (riêng `spec/20` ≈ 47 KB).

## 6. Việc tiếp theo (theo thứ tự)

1. Người dùng đọc `CHOT_MUC2_29-10.md` và xác nhận **Mục B**.
2. Claude viết **`TASK_05`** cho Antigravity (MỘT phiên, không chạy song song vì đụng nhiều file): áp dụng `CHOT_MUC2_29-10.md` Mục A + B vào `00, 02, 03, 04, 10, 20, 21, 22, 30, 40`, `pitch/KICH_BAN_DEMO.md` (thay đoạn Fast-Track phút 3:20–3:50), `pitch/KIEN_TRUC_BGK.md`; sửa 3 lỗi TASK_04 ở Mục 3. Trong task: luật nghiên cứu có nguồn, không bịa số, số chỉ ở CONFIG `02`, **bước cuối tạo file `DONE_TASK_05`**.
3. Claude kiểm (mmcheck, preserve, refcheck, byte, `git status`) ⇒ commit TASK_04 + TASK_05 (add từng đường dẫn, không `git add .`, không add `spec/01`).
4. Nếu nhóm duyệt `DE_XUAT_cau_truc_AI.md` ⇒ tạo các file đó.
5. (Tùy) Ghi chú (b): rút gọn `spec/03` (36,5 KB).
6. Trước khi chốt spec 30/10: người dùng xem lại rồi `git checkout main && git merge docs/cau-truc-spec`.

**Việc ngoài repo chưa ai nhận:** áp phích (10% điểm), tạo tài khoản Supabase / Gemini / Vercel + thử gọi Gemini, chia vai 5 người (spec đang viết cho 3 vai), hỏi BTC Q-02b.
