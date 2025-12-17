import React from 'react';

interface SkeletonCardProps {
  variant?: 'job' | 'company' | 'category';
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = 'job', className = '' }) => {
  if (variant === 'company') {
    return (
      <div className={`animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="h-16 w-16 rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="mt-4 space-y-3">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (variant === 'category') {
    return (
      <div className={`animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  // Job card skeleton
  return (
    <div className={`animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
