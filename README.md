# Thiệp Cưới Kỹ Thuật Số Cao Cấp

Website thiệp cưới kỹ thuật số cao cấp sử dụng Next.js 15, Framer Motion và Google Apps Script làm backend.

---

## Stack Công Nghệ

- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- **Hoạt ảnh**: Framer Motion
- **Dark Mode**: next-themes
- **Backend**: Google Apps Script
- **Cơ sở dữ liệu**: Google Spreadsheet
- **Hosting**: Vercel

---

## Cài Đặt Cục Bộ

### 1. Clone và Cài Dependency

```bash
git clone https://github.com/andikaputradev/wedding-invitation
cd wedding-invitation
npm install
```

### 2. Cấu Hình Biến Môi Trường

```bash
cp .env.example .env.local
```

Điền vào `.env.local`:

```
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

---

## Cài Đặt Google Spreadsheet & Apps Script

### Bước 1 — Tạo Google Spreadsheet

1. Mở [Google Sheets](https://sheets.google.com)
2. Tạo spreadsheet mới, đặt tên: **Wedding Invitation DB**
3. Ghi lại **Spreadsheet ID** từ URL:
   `https://docs.google.com/spreadsheets/d/**SPREADSHEET_ID**/edit`

> Sheet RSVP và Guestbook sẽ được Apps Script tạo tự động khi dữ liệu được gửi lần đầu.

### Bước 2 — Tạo Google Apps Script

1. Mở [script.google.com](https://script.google.com)
2. Nhấn **New Project**
3. Xóa code mặc định
4. Copy toàn bộ nội dung file `apps-script/Code.gs` và paste vào editor
5. Lưu project (Ctrl+S), đặt tên: **Wedding Invitation API**

### Bước 3 — Cấu Hình Script Properties

1. Trong Apps Script, nhấn icon ⚙️ **Project Settings** (góc dưới trái)
2. Cuộn đến phần **Script Properties**
3. Nhấn **Add script property**
4. Điền:
   - Property: `SPREADSHEET_ID`
   - Value: ID spreadsheet từ Bước 1
5. Nhấn **Save script properties**

### Bước 4 — Deploy dưới dạng Web App

1. Trong Apps Script, nhấn **Deploy** → **New deployment**
2. Nhấn icon ⚙️ bên cạnh **Select type**, chọn **Web app**
3. Cấu hình:
   - **Description**: `Wedding Invitation API v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Nhấn **Deploy**
5. **Authorize** quyền truy cập nếu được yêu cầu (chọn tài khoản Google của bạn)
6. Copy **Web App URL** được cấp

> Định dạng URL: `https://script.google.com/macros/s/DEPLOYMENT_ID/exec`

### Bước 5 — Điền Biến Môi Trường

Dán Web App URL vào `.env.local`:

```
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

---

## Kiểm Thử Cục Bộ

### Test RSVP (curl)

```bash
curl -X POST "https://script.google.com/macros/s/DEPLOYMENT_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"rsvp","name":"Budi Santoso","attendance":"attending","guestCount":2,"message":"Selamat ya!","userAgent":"test"}'
```

### Test Gửi Guestbook

```bash
curl -X POST "https://script.google.com/macros/s/DEPLOYMENT_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"guestbook","name":"Sari Dewi","message":"Semoga langgeng dan bahagia!","userAgent":"test"}'
```

### Test Lấy Guestbook

```bash
curl "https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=get_guestbook"
```

---

## Deploy lên Vercel

### Bước 1 — Kiểm Tra Build Cục Bộ

```bash
npm run build
```

Đảm bảo không có lỗi.

### Bước 2 — Push lên GitHub

```bash
git add .
git commit -m "feat: wedding invitation production build"
git push origin main
```

### Bước 3 — Import vào Vercel

1. Mở [vercel.com](https://vercel.com)
2. Nhấn **Add New Project**
3. Import repository GitHub của bạn
4. Framework preset: **Next.js** (tự động phát hiện)

### Bước 4 — Đặt Environment Variables trên Vercel

Trong trang project Vercel → **Settings** → **Environment Variables**:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_APPS_SCRIPT_URL` | `https://script.google.com/macros/s/ID/exec` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production |

### Bước 5 — Deploy

Nhấn **Deploy**. Vercel sẽ build và deploy tự động.

---

## Tùy Biến

### Thay Đổi Dữ Liệu Thiệp

Sửa file `data/invitation.ts` để thay đổi:
- Tên cặp đôi
- Ngày và địa điểm tổ chức
- Thông tin tài khoản mừng cưới
- Timeline câu chuyện
- Ảnh gallery

### Thay Đổi Ảnh Gallery

Thay URL trong `data/invitation.ts` ở field `gallery` bằng URL ảnh thật.
Với ảnh cục bộ, đặt vào `public/images/` và dùng path `/images/ten-anh.jpg`.

### Thêm Nhạc Nền

Đặt file audio vào `public/audio/wedding-music.mp3`.

### Đặt Tên Khách qua URL

Thiệp cá nhân hóa có thể gửi kèm tham số URL:

```
https://your-domain.vercel.app?to=Ten%20Khach
```

---

## Cấu Trúc Deploy Apps Script

Mỗi thay đổi trên `Code.gs` cần một **New Deployment** mới:

1. Nhấn **Deploy** → **Manage deployments**
2. Nhấn icon ✏️ ở deployment đang hoạt động
3. Đổi version sang **New version**
4. Nhấn **Deploy**
5. URL không thay đổi nếu dùng cùng deployment

---

## Debug Lỗi Thường Gặp

### RSVP/Guestbook Không Được Lưu

- Kiểm tra `NEXT_PUBLIC_APPS_SCRIPT_URL` đã đúng chưa
- Đảm bảo Apps Script được deploy với quyền **Anyone**
- Mở Apps Script → **Executions** để xem log lỗi
- Xác nhận `SPREADSHEET_ID` trong Script Properties đã đúng

### Hydration Mismatch

- Đã xử lý bằng `suppressHydrationWarning` ở root HTML
- ThemeToggle chỉ render sau khi `mounted = true`

### Lỗi Build TypeScript

```bash
npm run type-check
```

### Vấn Đề CORS

Google Apps Script không hỗ trợ CORS preflight. Cách xử lý:
- Đảm bảo POST request dùng `Content-Type: application/json`
- Apps Script tự động trả về header CORS cho GET/POST

### Ảnh Không Hiển Thị

- Thêm domain ảnh vào `remotePatterns` trong `next.config.ts`
- Đảm bảo URL ảnh truy cập công khai được

---

## Lệnh Hữu Ích

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check không build
```
