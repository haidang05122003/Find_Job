'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UserDropdown from '../header/UserDropdown';
import NotificationDropdown from '../header/NotificationDropdown';
import { Logo } from '../shared/Logo';

const PublicHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHR = user?.activeRole === 'HR';
  const isCandidate = user?.activeRole === 'CANDIDATE';
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN');

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>

            <nav className="hidden md:flex md:gap-6">
              <Link href="/jobs" className="text-sm font-medium text-gray-700 transition hover:text-brand-500 dark:text-gray-300">
                Tìm việc
              </Link>
              <Link href="/employers" className="text-sm font-medium text-gray-700 transition hover:text-brand-500 dark:text-gray-300">
                Công ty
              </Link>
              <Link href="/candidates" className="text-sm font-medium text-gray-700 transition hover:text-brand-500 dark:text-gray-300">
                Ứng viên
              </Link>
              <Link href="/messages" target="_blank" className="text-sm font-medium text-gray-700 transition hover:text-brand-500 dark:text-gray-300">
                Chat
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* HR: Show "Đăng tuyển ngay" CTA */}
                {isHR && (
                  <Link
                    href="/hr"
                    className="hidden md:flex items-center gap-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-2 transition hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20"
                  >
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50 overflow-hidden">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:8080${user.avatarUrl}`}
                            alt={user.name || 'Avatar'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      {/* Notification badge */}
                      <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        13
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Bạn là nhà tuyển dụng?</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Đăng tuyển ngay <span className="text-orange-500">»</span>
                      </p>
                    </div>
                  </Link>
                )}

                {/* Candidate: Show Dashboard link */}
                {isCandidate && (
                  <Link
                    href="/dashboard"
                    className="hidden text-sm font-medium text-gray-700 transition hover:text-brand-500 dark:text-gray-300 md:block"
                  >
                    Bảng điều khiển
                  </Link>
                )}

                {/* Notifications */}
                <NotificationDropdown />

                {/* Bookmarks - Only for candidates */}
                {isCandidate && (
                  <Link
                    href="/dashboard/favorite"
                    className="hidden rounded-full p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:block"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </Link>
                )}

                {/* User Avatar */}
                <div className="hidden md:block">
                  <UserDropdown />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="hidden text-sm font-medium text-gray-700 transition hover:text-brand-500 dark:text-gray-300 md:block"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
                >
                  Đăng ký
                </Link>
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay & Content */}
        <div
          className={`fixed inset-x-0 top-16 bottom-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible z-40' : 'opacity-0 invisible z-[-1]'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Mobile Menu Container */}
          <div
            className={`border-t border-gray-200 bg-white shadow-xl transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col p-4">
              <Link href="/jobs" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                Tìm việc
              </Link>
              <Link href="/employers" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                Công ty
              </Link>
              <Link href="/candidates" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                Ứng viên
              </Link>
              <Link href="/messages" target="_blank" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                Chat
              </Link>
              <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
              {isAuthenticated ? (
                <>
                  {isHR ? (
                    <>
                      <Link href="/hr" className="rounded-lg px-4 py-3 text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={() => setIsMobileMenuOpen(false)}>
                        HR Dashboard
                      </Link>
                      <Link href="/hr/job-postings" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Tin tuyển dụng
                      </Link>
                      <Link href="/hr/candidates" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Ứng viên
                      </Link>
                      <Link href="/hr/company-profile" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Hồ sơ công ty
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Bảng điều khiển
                      </Link>
                      <Link href="/dashboard/favorite" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Việc đã lưu
                      </Link>
                      <Link href="/profile" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Hồ sơ
                      </Link>
                      <Link href="/dashboard/settings" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Cài đặt
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link href="/signup" className="rounded-lg px-4 py-3 text-sm font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20" onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
