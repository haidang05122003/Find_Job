"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/context/ToastContext";
import { FilterProvider } from "@/context/FilterContext";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import PublicHeader from "@/components/landing/PublicHeader";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import {
  GridIcon,
  BookmarkIcon,
  SettingsIcon,
  BriefcaseIcon,
  BellIcon,
} from "@/components/shared/icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const commonLink =
    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm";
  const activeLink =
    "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold";
  const inactiveLink =
    "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-300";

  const isActive = (path: string) => pathname === path;

  return (
    <AuthProvider>
      <ToastProvider>
        <ChatProvider>
          <FilterProvider>
            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
              {/* Header */}
              <PublicHeader />

              {/* Main Content with Sidebar */}
              <div className="flex-1">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-800 p-4 sticky top-24">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-4">
                          Bảng điều khiển ứng viên
                        </h3>
                        <nav className="space-y-1">
                          <Link
                            href="/dashboard"
                            className={`${commonLink} ${
                              isActive("/dashboard") ? activeLink : inactiveLink
                            }`}
                          >
                            <GridIcon className="w-5 h-5" />
                            <span>Tổng quan</span>
                          </Link>
                          <Link
                            href="/dashboard/applied"
                            className={`${commonLink} ${
                              isActive("/dashboard/applied") ? activeLink : inactiveLink
                            }`}
                          >
                            <BriefcaseIcon className="w-5 h-5" />
                            <span>Việc đã ứng tuyển</span>
                          </Link>
                          <Link
                            href="/dashboard/favorite"
                            className={`${commonLink} ${
                              isActive("/dashboard/favorite") ? activeLink : inactiveLink
                            }`}
                          >
                            <BookmarkIcon className="w-5 h-5" />
                            <span>Việc yêu thích</span>
                          </Link>
                          <Link
                            href="/dashboard/alerts"
                            className={`${commonLink} ${
                              isActive("/dashboard/alerts") ? activeLink : inactiveLink
                            }`}
                          >
                            <BellIcon className="w-5 h-5" />
                            <span>Thông báo việc làm</span>
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            className={`${commonLink} ${
                              pathname.startsWith("/dashboard/settings") ? activeLink : inactiveLink
                            }`}
                          >
                            <SettingsIcon className="w-5 h-5" />
                            <span>Cài đặt</span>
                          </Link>
                        </nav>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                          <Link
                            href="/signin"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition-all duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Đăng xuất</span>
                          </Link>
                        </div>
                      </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                      {children}
                    </main>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <Footer />
              <ChatWidget />
            </div>
          </FilterProvider>
        </ChatProvider>
      </ToastProvider>
    </AuthProvider>
  );
}


