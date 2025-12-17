# Hướng Dẫn Cấu Hình Unsplash Banner

## Tổng Quan

Hero banner của trang chủ hiện đã được tích hợp với Unsplash API để hiển thị ảnh chuyên nghiệp về công việc, văn phòng và teamwork. Hệ thống tự động cache ảnh trong 24 giờ và có fallback images khi API không khả dụng.

## Cách Lấy API Key (Miễn Phí)

### Bước 1: Tạo Tài Khoản Unsplash

1. Truy cập [Unsplash.com](https://unsplash.com)
2. Đăng ký tài khoản miễn phí (hoặc đăng nhập nếu đã có)

### Bước 2: Tạo Application

1. Truy cập [Unsplash Developers](https://unsplash.com/oauth/applications)
2. Click "New Application"
3. Đọc và đồng ý với Terms & Conditions
4. Điền thông tin:
   - **Application name**: JobPortal (hoặc tên bạn muốn)
   - **Description**: Job search website hero banner
5. Click "Create Application"

### Bước 3: Lấy Access Key

1. Sau khi tạo xong, bạn sẽ thấy trang chi tiết application
2. Copy **Access Key** (không phải Secret Key)
3. Lưu lại Access Key này

### Bước 4: Cấu Hình Trong Project

1. Tạo file `.env.local` trong thư mục root của project:

```bash
# Copy từ .env.example
cp .env.example .env.local
```

2. Mở file `.env.local` và paste Access Key:

```env
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key_here
```

3. Restart development server:

```bash
npm run dev
```

## Giới Hạn API (Free Tier)

- **50 requests/hour** - Đủ cho development và production nhỏ
- Với caching 24h, mỗi user chỉ tạo 1 request/ngày
- Nếu vượt giới hạn, hệ thống tự động dùng fallback images

## Tùy Chỉnh

### Thay Đổi Search Query

Mở file `src/lib/unsplash-config.ts`:

```typescript
defaultQueries: [
  'office workspace professional',
  'business team meeting',
  'modern office interior',
  // Thêm queries của bạn ở đây
],
```

### Thay Đổi Thời Gian Cache

```typescript
cacheDuration: 24 * 60 * 60 * 1000, // 24 giờ (đổi số này)
```

### Thay Đổi Overlay Opacity

Trong `src/components/landing/HeroSection.tsx`:

```typescript
<HeroBanner 
  query="office workspace professional teamwork"
  overlay={true}
  overlayOpacity={0.75} // Đổi từ 0.0 đến 1.0
  className="absolute inset-0"
/>
```

## Fallback Images

Nếu không muốn dùng Unsplash API, bạn có thể:

1. Không cấu hình API key → Hệ thống tự động dùng fallback
2. Thay thế fallback images trong `public/images/hero/`:
   - `fallback-1.jpg`
   - `fallback-2.jpg`
   - `fallback-3.jpg`

## Troubleshooting

### Ảnh Không Hiển Thị

1. **Kiểm tra API key**: Đảm bảo đã copy đúng Access Key
2. **Kiểm tra console**: Mở DevTools → Console để xem lỗi
3. **Kiểm tra network**: Mở DevTools → Network → Filter "unsplash"
4. **Clear cache**: Xóa localStorage và refresh trang

### Lỗi CORS

- Unsplash API hỗ trợ CORS, không cần cấu hình thêm
- Nếu vẫn lỗi, kiểm tra next.config.ts đã có domain `images.unsplash.com`

### Ảnh Load Chậm

- Ảnh được cache 24h, lần đầu sẽ chậm hơn
- Sử dụng Next.js Image optimization tự động
- Có blur placeholder trong khi load

## Performance

- **LCP**: < 2.5s với priority loading
- **Cache**: 24h trong localStorage
- **Format**: WebP/AVIF tự động
- **Responsive**: Tự động resize theo viewport

## Credits

Theo yêu cầu của Unsplash API, credit link sẽ tự động hiển thị ở góc dưới phải của banner:

```
Photo by [Photographer Name] on Unsplash
```

Link này là bắt buộc khi sử dụng Unsplash API miễn phí.

## Support

Nếu cần hỗ trợ:
- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Unsplash API Guidelines](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines)
