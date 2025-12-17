"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import Image from "next/image";
import { Logo } from "./Logo";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {
  SearchIcon,
  MapPinIcon,
  BookmarkIcon,
} from "./icons";

export const AuthedHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-all duration-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Phần bên trái: Logo + Nav */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="transition-transform duration-200 hover:scale-105">
            <Logo />
          </Link>
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link
                href="/"
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/jobs"
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Tìm việc
              </Link>
            </li>
            <li>
              <Link
                href="/employers"
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Công ty
              </Link>
            </li>
            <li>
              <Link
                href="/candidates"
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Ứng viên
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href="/messages"
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Chat
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
              >
                Bảng điều khiển
              </Link>
            </li>
          </ul>
        </div>

        {/* Phần bên phải: Icons + User */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200 relative">
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Link
            href="/dashboard/favorite"
            className="text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
          >
            <BookmarkIcon className="w-6 h-6" />
          </Link>
          <Link href="/jobs/create" className="hidden sm:flex">
            <Button variant="primary">
              Đăng tin tuyển dụng
            </Button>
          </Link>

          {/* User Menu */}
          {/* User Menu */}
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 transition-all duration-200 hover:opacity-80"
              aria-label="User menu"
            >
              <Image
                src={user?.avatarUrl && user.avatarUrl.startsWith('http') ? user.avatarUrl : (user?.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : "https://placehold.co/40x40/EBF4FF/3B82F6?text=U")}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
              />
              <span className="hidden lg:inline font-semibold text-gray-700 dark:text-gray-300">
                {(user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN')) ? "Administrator" : (user?.fullName || user?.name || "User")}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""
                  }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 animate-slide-in-right">
                <Link
                  href={(user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN')) ? "/admin" : "/dashboard"}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {(user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN')) ? "Trang quản trị" : "Thống kê"}
                </Link>
                <Link
                  href={(user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN')) ? "/profile" : "/dashboard/settings"}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Cài đặt
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Thanh Search */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full">
            <Input
              id="job-title"
              placeholder="Tên công việc, từ khóa hoặc công ty"
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="relative w-full">
            <Input
              id="location"
              placeholder="Địa điểm"
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="text-gray-400 w-5 h-5" />
            </div>
          </div>
          <Button className="w-full sm:w-auto flex-shrink-0">
            Tìm kiếm
          </Button>
        </div>
      </div>
    </header>
  );
};

