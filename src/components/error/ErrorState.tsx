import React from 'react';
import Button from '@/components/shared/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: 'error' | 'empty' | '404';
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  type = 'error',
}) => {
  const getIcon = () => {
    if (type === '404') {
      return (
        <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    if (type === 'empty') {
      return (
        <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      );
    }

    return (
      <svg className="h-16 w-16 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getDefaultTitle = () => {
    if (type === '404') return 'Không tìm thấy trang';
    if (type === 'empty') return 'Không có dữ liệu';
    return 'Đã xảy ra lỗi';
  };

  const getDefaultMessage = () => {
    if (type === '404') return 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.';
    if (type === 'empty') return 'Không có dữ liệu để hiển thị.';
    return 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.';
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        {getIcon()}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {title || getDefaultTitle()}
      </h3>
      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
        {message || getDefaultMessage()}
      </p>
      {onRetry && (
        <Button onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
