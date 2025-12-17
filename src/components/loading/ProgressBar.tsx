'use client';

import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress?: number;
  isLoading?: boolean;
  height?: number;
  color?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isLoading = false,
  height = 4,
  color = 'bg-brand-500',
  showPercentage = false
}) => {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (progress !== undefined) {
      setInternalProgress(progress);
      return;
    }

    if (isLoading) {
      // Simulate progress when no explicit progress is provided
      const interval = setInterval(() => {
        setInternalProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      // Complete the progress bar
      setInternalProgress(100);
      const timeout = setTimeout(() => {
        setInternalProgress(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, isLoading]);

  if (!isLoading && progress === undefined) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full transition-all duration-300 ease-out ${color}`}
          style={{
            width: `${Math.min(internalProgress, 100)}%`,
            transition: 'width 0.3s ease-out'
          }}
        >
          {/* Shimmer effect */}
          <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>

      {showPercentage && (
        <div className="mt-2 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
          {Math.round(internalProgress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
