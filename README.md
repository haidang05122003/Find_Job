# Hệ thống Tìm kiếm Việc làm (Job Search System) - Frontend

Đây là mã nguồn Frontend cho Đồ án Tốt nghiệp: **Hệ thống Tìm kiếm Việc làm & Tuyển dụng trực tuyến**.
Dự án được xây dựng dựa trên **Next.js 15**, **React 19**, và **Tailwind CSS**.

## 🚀 Giới thiệu

Hệ thống kết nối ứng viên tìm việc và nhà tuyển dụng, cung cấp nền tảng trực quan, chuyên nghiệp để đăng tin tuyển dụng, ứng tuyển và quản lý hồ sơ.

### ✨ Các tính năng chính

#### Cho Ứng viên (Candidate)
- **Tìm kiếm việc làm**: Tìm theo từ khóa, địa điểm, mức lương, kinh nghiệm...
- **Quản lý Hồ sơ (CV)**: Tạo và cập nhật CV trực tuyến, tải lên CV đính kèm.
- **Ứng tuyển**: Nộp hồ sơ nhanh chóng vào các vị trí tuyển dụng.
- **Theo dõi**: Xem lịch sử ứng tuyển, việc làm đã lưu.

#### Cho Nhà tuyển dụng (HR/Recruiter)
- **Đăng tin tuyển dụng**: Quản lý tin đăng, cập nhật trạng thái tuyển dụng.
- **Quản lý ứng viên**: Xem danh sách ứng viên nộp hồ sơ, duyệt/từ chối hồ sơ.
- **Hồ sơ Công ty**: Cập nhật thông tin, logo, hình ảnh công ty để thu hút ứng viên.

#### Cho Quản trị viên (Admin)
- **Thống kê (Dashboard)**: Xem tổng quan hệ thống, lượng truy cập, tin đăng.
- **Quản lý người dùng**: Quản lý Candidate và HR.
- **Phê duyệt**: Duyệt tin tuyển dụng và hồ sơ công ty.

## 🛠️ Công nghệ sử dụng

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Hooks & Context API
- **Form Handling**: React Hook Form + Zod Validation
- **Icons**: Lucide React
- **Charts**: ApexCharts

## 📦 Cài đặt & Chạy dự án

### Yêu cầu tiên quyết
- Node.js 18.x trở lên.
- Đã chạy Backend Spring Boot (Project `BE-Tim-kiem-viec-lam`).

### Các bước cài đặt

1. **Clone dự án (nếu chưa có):**
   ```bash
   git clone <repository_url>
   cd Front-end-Tim-Kiem-Viec-Lam
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Cấu hình môi trường (.env):**
   Đổi tên `.env.example` thành `.env.local` và cập nhật API URL nếu cần (mặc định trỏ về `localhost:8080`).

4. **Chạy server phát triển:**
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```

5. **Truy cập:**
   Mở trình duyệt và vào địa chỉ: [http://localhost:3000](http://localhost:3000)

## 📁 Cấu trúc thư mục

```
src/
├── app/              # Next.js App Router (Pages & Layouts)
├── components/       # Reusable React Components
├── context/          # Global State (Auth, Filter...)
├── constants/        # Constants (Job Levels, Types...)
├── hooks/            # Custom Hooks
├── lib/              # Utilities & Helpers
├── services/         # API Service Calls
├── styles/           # Global Styles
└── types/            # TypeScript Interfaces
```

## 🤝 Đóng góp
Dự án được thực hiện bởi **Hoàng Hải Đăng** cho khóa luận tốt nghiệp.

---
© 2025 Job Search System. All rights reserved.
