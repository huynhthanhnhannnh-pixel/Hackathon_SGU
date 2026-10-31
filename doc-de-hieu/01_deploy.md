# Dựng và deploy SimpliFey từng bước

> Viết cho cả nhóm. Làm đúng thứ tự từ trên xuống, xong bước nào đánh dấu bước đó.
> File này chỉ hướng dẫn. Quyết định và con số nằm ở `spec/`. Nếu hai bên khác nhau thì theo `spec/`.
> Bắt buộc đăng nhập GitHub, không có tài khoản khách (D-44). API AI đã chốt theo D-50: Google Gemini model `gemini-3.5-flash-lite`. Web deploy dùng 1 key riêng; mỗi người test local bằng key của mình.

## Đọc xong bạn biết gì

- Hệ thống gồm những phần nào và lấy chúng ở đâu.
- Ai làm việc gì, trước giờ thi và lúc H+0.
- Vì sao chỉ một người được merge vào `main`.
- Gặp lỗi thì sửa ở đâu.

## 1. Hệ thống gồm 4 phần

Hãy tưởng tượng một người dùng mở web, bấm đăng nhập rồi dán link repo:

1. Trình duyệt mở **web trên Vercel**. Vercel chạy cả giao diện lẫn backend, vì Next.js gộp hai thứ trong một repo.
2. Người dùng đăng nhập bằng **GitHub**, thông qua **Supabase Auth**.
3. Backend đọc và ghi điểm kỹ năng vào **Supabase**. Supabase chính là Postgres được host sẵn, kèm phần tài khoản.
4. Backend gọi **API AI** để phân tích, đặt câu hỏi và chấm bài.

Vercel không giữ dữ liệu lâu dài, nên mọi thứ cần giữ phải nằm ở Supabase.

| Phần | Lấy ở đâu | Có tốn tiền không |
| :-- | :-- | :-- |
| Vercel | Đăng ký vercel.com | Gói free |
| Supabase | Đăng ký supabase.com | Gói free |
| GitHub | Repo thi, OAuth App | Miễn phí |
| API AI | Google AI Studio (Gemini) | Gói free (D-50) |

## 2. Ai làm gì

| Việc | Người làm | Khi nào |
| :-- | :-- | :-- |
| Tạo repo thi, thêm thành viên | Vai A | Trước giờ thi |
| Tạo Supabase, OAuth App, cấu hình URL | Vai A | Trước giờ thi |
| Lấy API key AI, kiểm hạn mức | Vai C | Trước giờ thi |
| Tạo tài khoản Vercel | **Vai A (người giữ Vercel)** | Trước giờ thi |
| Import repo vào Vercel, dán biến môi trường | Người giữ Vercel | H+0, sau commit đầu tiên |
| Merge vào `main` | **Chỉ người giữ Vercel** | Suốt giờ thi |
| Chọn repo demo | Cả nhóm | Trước giờ thi |
| Tạo tài khoản GitHub demo | Vai E | Trước giờ thi |
| Mời 4 bạn vào repo `ai-kit` | Chủ repo `ai-kit` | Trước giờ thi |
| Viết `.kb/README.md`, `AGENTS.md`, `CLAUDE.md` rồi gửi cả nhóm | Vai A | Trước giờ thi |
| Cài `ai-kit`, gắn tài liệu vào repo thi | **Mỗi người trên máy mình** | Trước giờ thi |

Vai A giữ Vercel, vì đỡ phải truyền tay khóa bí mật.

## 3. Bước 0 — Việc phải xong trước ngày thi

### 3.1. Repo thi

- [ ] Tạo repo GitHub **public, trống**. Chủ repo nên là người giữ Vercel.
- [ ] Thêm đủ thành viên làm collaborator.
- [ ] Nộp link cho BTC theo yêu cầu.

Repo phải trống vì chỉ commit trong giờ thi mới được tính.

### 3.2. Tạo project Supabase

Phải làm bước này trước OAuth App, vì OAuth App cần địa chỉ do Supabase cấp.

- [ ] Vào supabase.com, tạo project ở vùng **Singapore**.
- [ ] Lưu mật khẩu database ở nơi riêng tư.
- [ ] Vào **Authentication**, mục **Configuration**, chọn **Sign In / Providers**, mở **GitHub**.
- [ ] Sao chép **Callback URL**, dạng `https://<mã-project>.supabase.co/auth/v1/callback`.
- [ ] Kiểm mục **Anonymous** đang tắt.

Tạo project sát ngày thi, hoặc mở dashboard định kỳ, vì project ít hoạt động trong 7 ngày có thể bị tạm dừng.

### 3.3. Tạo GitHub OAuth App

OAuth App là tờ khai để GitHub biết app nào đang xin đăng nhập và phải trả kết quả về đâu. Không cần xin duyệt.

- [ ] Mở https://github.com/settings/developers, vào **OAuth Apps**, bấm **New OAuth App**.
- [ ] **Application name:** `SimpliFey`.
- [ ] **Homepage URL:** tạm điền link repo thi, có web Vercel thì đổi lại.
- [ ] **Authorization callback URL:** dán Callback URL ở bước 3.2.
- [ ] Không bật **Enable Device Flow**. Bấm **Register application**.
- [ ] Sao chép **Client ID**.
- [ ] Bấm **Generate a new client secret**, sao chép ngay vì secret chỉ hiện đầy đủ một lần.

Quay lại Supabase:

- [ ] Ở mục **GitHub**, bật **GitHub Enabled**, dán Client ID và Client Secret, bấm **Save**.

Chạy local và chạy trên Vercel dùng chung OAuth App này, vì GitHub chỉ nói chuyện với Supabase.

### 3.4. Khai địa chỉ được phép quay về

Sau khi đăng nhập, Supabase chỉ đưa người dùng về các địa chỉ đã khai.

- [ ] Mở **URL Configuration** trong phần Authentication của Supabase.
- [ ] Thêm vào **Redirect URLs**: `http://localhost:3000/**`
- [ ] Giữ **Site URL** là `http://localhost:3000`. Bước 4.5 sẽ đổi sang web thật.

### 3.5. API AI

Theo D-50, model AI đã chốt là Google Gemini `gemini-3.5-flash-lite`.

- [ ] Chuẩn bị 1 key riêng cho web deploy trên Vercel.
- [ ] Mỗi người tự tạo 1 key riêng tại Google AI Studio để test trên máy mình (chạy local).
- [ ] Xem hạn mức thật và gọi thử 1 lần trước ngày thi.

### 3.6. Tài khoản Vercel và tài khoản demo

- [ ] Người giữ Vercel đăng ký Vercel **bằng chính tài khoản GitHub của mình**.
- [ ] Tạo 1 tài khoản GitHub riêng để demo, không dùng tài khoản cá nhân.
- [ ] Mỗi người kiểm email commit: `git config user.email` phải là email đã xác minh trên GitHub của người đó.

### 3.7. Repo demo và câu hỏi còn mở

- [ ] Chọn repo demo theo tiêu chí Q-03 ở `spec/00` Mục 3, đẩy lên GitHub cá nhân.
- [ ] Trả lời các câu hỏi còn mở ở `spec/00` Mục 3 (Q-03, Q-10).

### 3.8. Cài `ai-kit` trên từng máy

`ai-kit` là repo private chứa cấu hình AI của nhóm. Cài xong thì Claude và Antigravity trên máy đó có sẵn luật chung, 3 skill và rào chắn lệnh git nguy hiểm.

- [ ] Chủ repo `ai-kit` mời 4 bạn còn lại, mỗi bạn bấm chấp nhận lời mời.
- [ ] Mỗi người clone `ai-kit` rồi cài theo `README.md` của repo đó.
- [ ] Mỗi người chạy `node cai-dat.mjs --kiem`. Mọi dòng đều `[OK]` là đạt.
- [ ] Mở chat mới. Chat đang mở không tự nhận cấu hình mới.

### 3.9. Cho AI đọc tài liệu trong repo thi

Repo thi không được chứa `spec/`, nên mỗi máy giữ một bản chép trong thư mục `.kb/`, git bỏ qua thư mục này. Bước này không đi theo khi clone, nên **mỗi người phải làm trên máy mình, trước khi tạo task**. Máy nào chưa làm thì `git add .` sẽ lấy cả `.kb`.

- [ ] Clone repo thi, rồi chạy trong thư mục `ai-kit`:

```powershell
node gan-du-an.mjs "<repo thi>" "<repo tài liệu>\spec"
node gan-du-an.mjs "<repo thi>" "<repo tài liệu>\doc-de-hieu"
```

Mỗi lệnh chép 1 thư mục, nên phải chạy 2 lần. Tài liệu gốc đổi thì chạy lại, vì `.kb` chỉ là bản chép. Những file bạn tự tạo trong `.kb` vẫn được giữ.

AI không tự đọc `.kb`, nên phải chỉ đường cho nó. Vai A viết 3 file dưới đây rồi gửi cả nhóm, vì `.kb` không chia sẻ qua git.

- [ ] Viết `.kb/README.md`, mục lục để AI không phải mở hết tài liệu:

```markdown
| Cần biết | Đọc |
| :-- | :-- |
| Quyết định | spec/00_QUYET_DINH.md |
| Kiểu dữ liệu, CONFIG, mã lỗi | spec/02_CONTRACTS.md |
| Endpoint, bảng dữ liệu | spec/03_API_VA_LUU_TRU.md |
| Cây thư mục, phiên bản thư viện | spec/04_KIEN_TRUC_TRIEN_KHAI.md Mục 15, 16 |
| Engine | spec/10_ENGINE_INGEST.md, spec/11_ENGINE_DO_THI.md |
| AI, cổng gác, BKT | spec/20_AI_GOI_VA_PROMPT.md, spec/21_AI_KIEM_VA_DUYET.md, spec/22_BKT_VA_KE_HOACH_CAU_HOI.md |
| Giao diện | spec/30_UI.md |
| Test, Definition of Done | spec/50_TEST_VA_FIXTURE.md |
| Lịch 21 giờ | doc-de-hieu/07_ke_hoach_21h.md |
```

- [ ] Tạo `AGENTS.md` ở gốc repo thi, chỉ cần 1 dòng: `Trước khi làm việc, đọc .kb/README.md.`
- [ ] Tạo `CLAUDE.md` ở gốc repo thi, chỉ cần 1 dòng: `@AGENTS.md`

Hai file này là cấu hình AI nên không commit vào repo thi. Mỗi người chạy trong thư mục repo thi:

```powershell
Add-Content .git\info\exclude "AGENTS.md"
Add-Content .git\info\exclude "CLAUDE.md"
```

- [ ] Chạy `git status`. Thấy `.kb`, `.env`, `AGENTS.md` hoặc `CLAUDE.md` hiện ra thì dừng lại kiểm tra, chưa commit.

## 4. Việc lúc H+0

### 4.1. Tạo khung code

- [ ] Một người tạo project Next.js theo `spec/04` Mục 15, 16 và push commit đầu.
- [ ] Trong `.gitignore` phải có 2 dòng:

```
.env*
!.env.example
```

- [ ] Tạo `.env.example` chỉ có tên biến, **không có giá trị**.

### 4.2. Tạo `.env.local`

Mỗi người tạo file `.env.local` trên máy mình, lấy giá trị từ bảng ở Mục 6. Gửi khóa cho nhau qua tin nhắn riêng, không dán vào repo, không dán vào nhóm đông người.

### 4.3. Tạo bảng trong database

- [ ] Viết `supabase/migrations/0001_init.sql` theo `spec/03` Mục 3.
- [ ] Mở **SQL Editor** trong Supabase, dán nội dung file, bấm **Run**.
- [ ] Vào **Table Editor**, kiểm đủ bảng.

Cách này không cần cài Supabase CLI hay Docker. Đổi bảng về sau thì thêm file SQL mới, không sửa file cũ.

### 4.4. Thử đăng nhập ở máy

Đăng nhập cần 2 mảnh code:

```ts
// Nút đăng nhập
await supabase.auth.signInWithOAuth({
  provider: "github",
  options: { redirectTo: `${location.origin}/auth/callback` },
});
```

Mảnh thứ hai là file `src/app/auth/callback/route.ts`, nhận `code` trên URL rồi gọi `exchangeCodeForSession(code)`. Làm theo mục "PKCE, Next.js" trong tài liệu Supabase ở Mục 9, dùng `@supabase/ssr`.

- [ ] Chạy `npm run dev`, bấm đăng nhập, quay về app và thấy tên GitHub là đạt.

### 4.5. Đưa lên Vercel

Chỉ người giữ Vercel làm:

- [ ] Vào Vercel, **Add New Project**, import repo thi.
- [ ] Thêm đủ biến ở Mục 6 trước khi bấm **Deploy**.
- [ ] Sau khi có web, vào **Settings**, chọn **Functions**, mở **Function Regions**, chọn Singapore (`sin1`). Mặc định của Vercel là Mỹ, để vậy sẽ chậm vì xa Supabase.
- [ ] Bấm **Redeploy** để áp dụng.

Rồi quay lại Supabase, mục **URL Configuration**:

- [ ] Đổi **Site URL** thành địa chỉ web thật, ví dụ `https://simplifey.vercel.app`.
- [ ] Thêm vào **Redirect URLs**: `https://<web-của-nhóm>.vercel.app/auth/callback`
- [ ] Đổi **Homepage URL** trong OAuth App thành địa chỉ web thật.
- [ ] Mở web thật, đăng nhập thử.

## 5. Luật Git trong giờ thi

**Đây là phần dễ gây rối nhất.** Tài liệu Vercel ghi rõ: ở gói Hobby, chỉ chủ tài khoản được kích hoạt deploy, người khác không deploy được. Cả 5 người push vào `main` thì nhiều bản sẽ bị chặn.

Quy trình:

1. Mỗi người làm trên nhánh riêng, ví dụ `nhan/ui-ban-do`.
2. Push nhánh và mở Pull Request. Ai cũng phải có commit của mình, đúng thể lệ cuộc thi.
3. GitHub Actions chạy typecheck, lint, test cho mọi người.
4. Chỉ người giữ Vercel bấm merge, chọn **Create a merge commit** trên web GitHub. Không dùng Squash, vì commit gộp có thể vẫn đứng tên người viết.
5. Vercel deploy từ commit merge đó.

Commit merge không thêm dòng `Co-Authored-By` của AI, vì đã có báo cáo trên diễn đàn Vercel rằng dòng này làm bản deploy bị chặn.

**Phải thử ngay lúc H+0.5, khi code còn ít:**

- [ ] Một thành viên khác mở PR nhỏ.
- [ ] Người giữ Vercel merge bằng merge commit.
- [ ] Kiểm Vercel có deploy không.

Cách merge này chưa được kiểm thực tế. Nếu vẫn bị chặn thì báo ngay, nhóm sẽ quyết phương án khác trước khi code nhiều. Không sửa tác giả commit để né giới hạn: làm vậy vi phạm quy định của Vercel, và làm sai thông tin ai đã commit.

## 6. Biến môi trường

Tên biến giữ đúng như `spec/03` Mục 8.

| Biến | Lấy ở đâu | Bí mật không |
| :-- | :-- | :-- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase, **Settings > API Keys** hoặc nút **Connect** | Không |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase, publishable key `sb_publishable_…` | Không |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase, secret key `sb_secret_…` | **Có** |
| `GEMINI_API_KEY` | Google AI Studio (`gemini-3.5-flash-lite`, D-50) | **Có** |
| `DEMO_MODE` | Tự đặt: `true` ở máy demo, `false` trên web thật | Không |
| `NEXT_PUBLIC_DEMO_MODE` | Đặt giống `DEMO_MODE` | Không |

Lưu ý:

- Supabase đang thay khóa kiểu cũ (`anon`, `service_role`, chuỗi bắt đầu bằng `eyJ`) bằng khóa mới, và sẽ ngừng khóa cũ vào cuối 2026. Tên biến giữ nguyên, chỉ dán khóa mới vào. Project chưa có khóa mới thì tạo ở **Settings > API Keys**.
- Biến có `NEXT_PUBLIC_` sẽ lộ xuống trình duyệt. **Không bao giờ** đặt khóa bí mật vào biến có tiền tố này.
- Trên Vercel, đổi biến xong phải **Redeploy** mới có tác dụng.

## 7. Lỗi hay gặp

| Bạn thấy | Nguyên nhân thường gặp | Sửa ở đâu |
| :-- | :-- | :-- |
| Vercel báo commit author không có quyền | Commit không phải của chủ tài khoản | Làm theo Mục 5 |
| Đăng nhập xong bị đưa về `localhost` | Site URL chưa đổi | Bước 4.5 |
| GitHub báo `redirect_uri` sai | Callback URL trong OAuth App sai | Bước 3.3 |
| Đăng nhập xong không quay về app | Chưa khai Redirect URLs hoặc thiếu file callback | Bước 3.4, 4.4 |
| App chạy ở máy nhưng lỗi trên Vercel | Thiếu biến trên Vercel, hoặc chưa Redeploy | Mục 6 |
| Đọc bảng ra 0 dòng | RLS đang chặn đúng luật, mọi lệnh ghi phải qua server | `spec/03` Mục 3 |
| Web rất chậm khi gọi database | Function chưa đổi sang `sin1` | Bước 4.5 |
| Lỡ đưa khóa bí mật lên repo | Khóa đã lộ, xóa file không đủ | Tạo khóa mới ngay, thay ở Vercel và `.env.local` |
| AI báo hết lượt | Hết hạn mức | Dùng Offline `Ctrl+Shift+D` khi demo |

## 8. Trước demo và sau thi

Trước demo:

- [ ] Đăng nhập sẵn tài khoản GitHub demo, không gõ mật khẩu trên sân khấu.
- [ ] Muốn tiến độ trống thì bấm "Xóa tài khoản" rồi đăng nhập lại.
- [ ] Mở thử chế độ Offline.

Giữ project hoạt động sau thi (D-47):

- [ ] Vài ngày một lần, mở web và bấm thử, mở cả dashboard Supabase để tránh bị tạm dừng.
- [ ] Kiểm lại web trước vòng thi tiếp theo. Nếu bị dừng thì vào dashboard khôi phục, dữ liệu vẫn còn.

## 9. Tra chi tiết

- Biến môi trường: `spec/03` Mục 8. Bảng và RLS: `spec/03` Mục 3. Mốc giờ: [`07_ke_hoach_21h.md`](07_ke_hoach_21h.md).
- [Đăng nhập GitHub với Supabase](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Redirect URLs của Supabase](https://supabase.com/docs/guides/auth/redirect-urls)
- [Khóa API của Supabase](https://supabase.com/docs/guides/api/api-keys)
- [Vì sao commit không deploy trên Vercel](https://vercel.com/kb/guide/why-aren-t-commits-triggering-deployments-on-vercel)
- [Chọn vùng cho Vercel Functions](https://vercel.com/docs/functions/configuring-functions/region)
