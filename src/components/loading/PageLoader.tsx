import React from 'react';
import { motion } from 'framer-motion';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Đang tải...',
  size = 'md',
  fullScreen = true
}) => {
  const sizeClasses = {
    sm: 32,
    md: 48,
    lg: 64
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          <motion.div
            style={{ width: sizeClasses[size], height: sizeClasses[size] }}
            className="rounded-full border-4 border-gray-200 dark:border-gray-700"
          />
          <motion.div
            style={{ width: sizeClasses[size], height: sizeClasses[size] }}
            className="absolute rounded-full border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
