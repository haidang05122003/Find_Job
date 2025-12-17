'use client';

import React, { useEffect } from 'react';
import Button from '@/components/shared/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/10">
          <svg
            className="h-10 w-10 text-error-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Đã xảy ra lỗi
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>
            Thử lại
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
