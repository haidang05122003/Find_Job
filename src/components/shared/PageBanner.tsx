'use client';

import React from 'react';

interface PageBannerProps {
  title: string;
  subtitle: string;
  gradient?: 'blue' | 'purple' | 'green' | 'orange';
  icon?: React.ReactNode;
}

const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  gradient = 'blue', /* kept for prop compatibility but unused styles */
  icon
}) => {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-brand-600 to-brand-400 p-8 md:p-10 mb-8 shadow-lg">
      <div className="relative z-10 flex items-center gap-6">
        {icon && (
          <div className="hidden md:flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-sm border border-white/20 text-white">
            {icon}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold font-lexend text-white mb-2 tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="text-white/90 text-sm md:text-base font-medium max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageBanner;
