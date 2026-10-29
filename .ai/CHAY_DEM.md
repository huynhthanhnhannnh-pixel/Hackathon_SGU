# HƯỚNG DẪN NGƯỜI CHẠY ĐÊM (30/10) — dùng Claude Code

Làm đúng 5 bước. Không cần hiểu nội dung spec.

**1. Lấy code mới** (mở PowerShell trong thư mục repo):
```
git checkout docs/cau-truc-spec
git pull
```

**2. Cài công cụ kiểm (chỉ lần đầu):**
```
cd .ai/tools/mmcheck
npm install
cd ../../..
```

**3. Kiểm tra có lệnh `claude`:** gõ `claude --version`. Báo lỗi "not recognized" ⇒ cài: `npm install -g @anthropic-ai/claude-code`, rồi gõ `claude` một lần để đăng nhập, xong gõ `/exit`.

**4. Chạy (một lệnh, để máy chạy qua đêm, đừng tắt cửa sổ, tắt chế độ ngủ của máy):**
```
powershell -ExecutionPolicy Bypass -File .ai\chay_dem.ps1
```
Script chạy lần lượt TASK_05A → 05B → 05C, mỗi task một phiên Claude mới, tự commit. Nếu dừng giữa chừng (hết lượt dùng Claude, lỗi mạng): chạy lại đúng lệnh trên — task đã có file DONE sẽ được bỏ qua.

> Không dùng được script? Mở Claude Code trong VS Code, bật chế độ tự chấp nhận sửa file, dán:
> `Đọc AGENTS.md. Bạn là THỢ. Làm lần lượt .ai/tasks/TASK_05A.md, TASK_05B.md, TASK_05C.md, kể cả phần Kết thúc của từng task (tạo DONE, git add/commit đúng lệnh). Bỏ qua task đã có file DONE. Không push.`

**5. Sáng mai:**
```
git push
```
rồi nhắn nhóm: "đã push TASK_05, có DONE: …" (kể tên các file `.ai/tasks/DONE_05*`).
