'use client';

import React from 'react';

export default function ChatIndexPage() {
  return (
    <div className="hidden lg:flex h-full items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="mb-4 inline-flex rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chọn một cuộc trò chuyện
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
        </p>
      </div>
    </div>
  );
}
