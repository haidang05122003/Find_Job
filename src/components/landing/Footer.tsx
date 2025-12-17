import React from 'react';
import Link from 'next/link';
import { Logo } from '../shared/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Nền tảng tìm việc làm hàng đầu, kết nối nhà tuyển dụng và ứng viên.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Người tìm việc</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/jobs" className="text-sm text-gray-600 transition hover:text-brand-500 dark:text-gray-400">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link href="/employers" className="text-sm text-gray-600 transition hover:text-brand-500 dark:text-gray-400">
                  Công ty
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 transition hover:text-brand-500 dark:text-gray-400">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Nhà tuyển dụng</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/candidates" className="text-sm text-gray-600 transition hover:text-brand-500 dark:text-gray-400">
                  Tìm ứng viên
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-gray-600 transition hover:text-brand-500 dark:text-gray-400">
                  Đăng tin tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Hỗ trợ</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 transition hover:text-brand-500 dark:text-gray-400">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 transition hover:text-brand-500 dark:text-gray-400">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 transition hover:text-brand-500 dark:text-gray-400">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Kết Nối Việc Làm. Cơ hội trong tầm tay.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
