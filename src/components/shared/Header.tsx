"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import Button from "@/components/ui/button/Button";

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <Logo />
          </Link>

          <ul className="hidden md:flex space-x-6">
            <li>
              <Link
                href="/jobs"
                className="font-medium text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Tìm việc
              </Link>
            </li>
            <li>
              <Link
                href="/candidates"
                className="font-medium text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Ứng viên
              </Link>
            </li>
            <li>
              <Link
                href="/employers"
                className="font-medium text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Công ty
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="font-medium text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/signup"
            className="font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
          >
            Tạo tài khoản
          </Link>

          <Link href="/signin">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

