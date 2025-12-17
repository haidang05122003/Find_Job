# Danh sách Routes đã được tạo

## Authentication Routes
- `/signin` - Trang đăng nhập
- `/signup` - Trang đăng ký
- `/forgot-password` - Trang quên mật khẩu
- `/reset-password` - Trang đặt lại mật khẩu
- `/verify-email` - Trang xác thực email

## Main Routes (với AuthedHeader)
- `/` - Trang chủ (với Header thông thường)
- `/jobs` - Danh sách việc làm
- `/jobs/[jobId]` - Chi tiết công việc (ví dụ: `/jobs/1`)
- `/employers` - Danh sách nhà tuyển dụng
- `/employers/[employerId]` - Chi tiết nhà tuyển dụng (ví dụ: `/employers/twitter`)
- `/candidates` - Danh sách ứng viên

## Dashboard Routes (với Sidebar)
- `/dashboard` - Tổng quan dashboard
- `/dashboard/applied` - Việc đã ứng tuyển
- `/dashboard/favorite` - Việc yêu thích
- `/dashboard/alerts` - Thông báo việc làm
- `/dashboard/settings` - Cài đặt

## Cách sử dụng
1. Từ trang chủ (`/`), click vào các links trong header để điều hướng
2. Từ trang chủ, click vào các job cards để xem chi tiết
3. Từ dashboard, sử dụng sidebar để điều hướng giữa các trang
4. Tất cả các links đã được tích hợp và hoạt động


