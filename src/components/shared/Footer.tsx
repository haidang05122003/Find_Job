"use client";

import React from "react";
import { BriefcaseIcon, FacebookIcon, GoogleIcon } from "./icons";

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-400">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Column 1: Logo & Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-brand-500 p-2 rounded-lg">
              <BriefcaseIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">MyJob</span>
          </div>

          <p className="mb-4">
            Nền tảng tuyển dụng hàng đầu, kết nối ứng viên với nhà tuyển dụng một cách hiệu quả và nhanh chóng.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 bg-gray-700 hover:bg-brand-500 rounded-full flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="text-white w-5 h-5" />
            </a>

            <a
              href="#"
              className="w-10 h-10 bg-gray-700 hover:bg-brand-500 rounded-full flex items-center justify-center transition-colors"
              aria-label="Google"
            >
              <GoogleIcon className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Column 2: About */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Về chúng tôi</h5>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Công ty
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Resource */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Tài nguyên</h5>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Trung tâm trợ giúp
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Điều khoản & Điều kiện
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Links */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-4">Liên kết</h5>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Tìm việc
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Ứng viên
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Công ty
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
        <p>© 2024 MyJob. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

