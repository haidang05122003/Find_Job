'use client';

import React from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import ChatRightSidebar from '@/components/chat/ChatRightSidebar';
import { Logo } from '@/components/shared/Logo';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">
                    Vui lòng đăng nhập để sử dụng chat
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-gray-950">
            {/* Minimal Header similar to TopCV */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Logo size="sm" />
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm font-medium text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">
                        Về trang chủ
                    </Link>
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        {/* Fallback avatar if user image is missing */}
                        <img
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar />
                <div className="flex-1 w-full lg:w-auto h-full relative">
                    {children}
                </div>
                <ChatRightSidebar />
            </div>
        </div>
    );
}
