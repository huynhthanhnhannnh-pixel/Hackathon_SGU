# BÀN GIAO — phiên Claude 29/10/2026 (chiều)

> File nháp, chưa track. Người / AI phiên sau đọc file này trước tiên. Xong việc thì xóa.

## 1. Bối cảnh

- Repo tài liệu (tiếng Việt) cho hackathon SGU; đọc `CLAUDE.md`. Nhánh làm việc: **`docs/cau-truc-spec`**. **Spec chốt 30/10/2026**, thi 31/10.
- Cách làm việc: **Claude (Opus) = đầu não** (phân tích, viết task, kiểm, commit) · **Antigravity = thợ** (làm theo file `TASK_xx.md` ở gốc repo). Claude kiểm bằng script, **không đọc lại cả file spec**.
- Luôn trình bày phân tích + đề xuất và **chờ người dùng đồng ý trước khi sửa file repo**. Không push, không merge khi chưa được bảo.
- `spec/01_KIEN_TRUC_VA_LUONG.md` đang có thay đổi của người khác: **không add, không sửa, không restore**.
- Antigravity hay **bỏ bước cuối** (không tạo file DONE), **tự báo số sai** (byte), và **bịa số liệu** dù bị cấm ⇒ luôn tự kiểm lại. Không có cách gửi prompt vào Antigravity bằng script (`antigravity-ide chat` không tới agent; computer use không có trong phiên VS Code và IDE chỉ được quyền "click") ⇒ người dùng tự dán prompt.
- **Định hướng sản phẩm (người dùng chốt sơ bộ 29/10):** mã nguồn mở cho cộng đồng (tự clone + điền key của mình, như GitDiagram / Aider) + nghiên cứu học thuật (AI ảo giác, AI chấm bài, BKT) + CV. **Không** thương mại hóa, **không** bán cho trường. BYOK chỉ ghi roadmap. Host nghiêng về **Vercel free**.

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
- **Phần lớn D-27..D-30 sẽ bị viết lại** theo quyết định mới (Railway → Vercel, bỏ Pino) — xem `HOP_CHOT_29-10.md` Mục 1.
- `spec/20` (TASK_03) cũng đã commit: `d44d237`.

## 4. File nháp ở gốc repo (chưa track)

| File | Nội dung | Trạng thái |
| :-- | :-- | :-- |
| **`HOP_CHOT_29-10.md`** | **File họp — NGUỒN CHÍNH.** 34 mục (định hướng, host, D-06..D-32, cắt tính năng, pitch, ngoài repo), mỗi mục có đề xuất + cột **Chốt** để nhóm điền. Thay cho Mục A/B của `CHOT_MUC2`. | Nhóm đang họp điền |
| `CHOT_MUC2_29-10.md` | Bản trước của file họp. Còn dùng: **Mục C** (giải thích D-09, D-14, D-16, D-17/18, D-24, semaphore, chống gọi trùng) và **Mục D** (định nghĩa link gốc repo). Mục A/B đã được gộp vào `HOP_CHOT`. | Tham khảo |
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

1. Nhóm họp, điền cột **Chốt** trong `HOP_CHOT_29-10.md` (ưu tiên 6 mục 🔴: 1.1, 1.2, 3.2+3.3, 3.4, 3.6, 5.6).
2. Claude đọc cột Chốt, viết **`TASK_05`** cho Antigravity (MỘT phiên, không chạy song song vì đụng nhiều file): áp dụng mọi dòng đã chốt vào `00, 02, 03, 04, 10, 20, 21, 22, 30, 40` + pitch theo `HOP_CHOT` Mục 5.2 (`KICH_BAN_DEMO`, `PHAN_BIEN_BGK` dòng 58 + 76, `ROADMAP`, `KIEN_TRUC_BGK`); sửa 3 lỗi TASK_04 ở Mục 3. Trong task: luật nghiên cứu có nguồn, không bịa số, số chỉ ở CONFIG `02`, **bước cuối tạo file `DONE_TASK_05`**. Đưa người dùng prompt 1 dòng để dán.
3. Claude kiểm (mmcheck, preserve, refcheck, byte, `git status`) ⇒ commit TASK_04 + TASK_05 (add từng đường dẫn, không `git add .`, không add `spec/01`).
4. Nếu nhóm duyệt `DE_XUAT_cau_truc_AI.md` ⇒ tạo các file đó.
5. (Tùy) Ghi chú (b): rút gọn `spec/03` (36,5 KB).
6. Trước khi chốt spec 30/10: người dùng xem lại rồi `git checkout main && git merge docs/cau-truc-spec`.

**Việc ngoài repo chưa ai nhận:** xem `HOP_CHOT_29-10.md` Mục 6 (áp phích, tài khoản + gọi thử Gemini, chia vai 5 người, hỏi BTC Q-02b).

## 7. Cập nhật 30/10 (rạng sáng)

Đã họp chốt (kết quả: `HOP_CHOT_29-10.md` Mục 0). Quy trình mới: người soát chốt lại `.ai/CHOT_CUOI.md` ⇒ người chạy làm theo `.ai/CHAY_DEM.md` (Antigravity chạy `.ai/tasks/TASK_05A/B/C.md` qua đêm, mỗi task tự commit) ⇒ sáng Claude kiểm bằng `.ai/tools/` (refcheck bắt chỗ còn trỏ tên đã bỏ), sửa lặt vặt, rồi gộp `main`. Đã tạo `AGENTS.md`, `.agents/rules/00_chung.md`, `.gitignore`, công cụ kiểm trong `.ai/tools/` (đường dẫn tương đối, chạy được trên mọi máy sau `npm install`).
