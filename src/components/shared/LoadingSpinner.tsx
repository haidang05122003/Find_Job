import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
} as const;

/**
 * Optimized loading spinner component
 */
export const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md',
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-brand-500 border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        {spinner}
      </div>
    );
  }

  return spinner;
});

/**
 * Loading overlay for sections
 */
export const LoadingOverlay = memo(function LoadingOverlay({
  size = 'lg',
  className,
}: Omit<LoadingSpinnerProps, 'fullScreen'>) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <LoadingSpinner size={size} className={className} />
    </div>
  );
});

/**
 * Loading dots animation
 */
export const LoadingDots = memo(function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-brand-500" />
    </div>
  );
});

/**
 * Loading bar (for top of page)
 */
export const LoadingBar = memo(function LoadingBar() {
  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
      <div className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] bg-brand-500" />
    </div>
  );
});

export default LoadingSpinner;
