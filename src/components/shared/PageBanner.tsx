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
  gradient = 'blue',
  icon 
}) => {


  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br shadow-2xl mb-8 animate-fade-in" 
         style={{ background: `linear-gradient(135deg, ${gradient === 'blue' ? '#3B82F6, #465FFF, #9333EA' : gradient === 'purple' ? '#9333EA, #EC4899, #EF4444' : gradient === 'green' ? '#059669, #14B8A6, #3B82F6' : '#F97316, #EF4444, #EC4899'})` }}>
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" 
             style={{ animationDelay: '4s' }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute top-10 left-10 w-20 h-20 animate-spin-slow" viewBox="0 0 100 100" fill="white">
          <circle cx="50" cy="50" r="40" strokeWidth="2" stroke="currentColor" fill="none" />
          <circle cx="50" cy="50" r="30" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-10 right-20 w-16 h-16 animate-bounce-slow" viewBox="0 0 100 100" fill="white">
          <polygon points="50,10 90,90 10,90" />
        </svg>
        <svg className="absolute top-1/2 right-10 w-12 h-12 animate-pulse" viewBox="0 0 100 100" fill="white">
          <rect x="25" y="25" width="50" height="50" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-6">
            {icon && (
              <div className="hidden sm:flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white animate-scale-in">
                {icon}
              </div>
            )}
            <div className="flex-1 animate-slide-in-left">
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl drop-shadow-lg">
                {title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-white/90 drop-shadow-md max-w-2xl">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8 sm:h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,80 600,80 900,40 C1050,20 1150,0 1200,0 L1200,120 L0,120 Z" 
                fill="currentColor" 
                className="text-gray-50 dark:text-gray-900" />
        </svg>
      </div>
    </div>
  );
};

export default PageBanner;
