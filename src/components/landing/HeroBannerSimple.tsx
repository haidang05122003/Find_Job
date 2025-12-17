'use client';

import React from 'react';

interface HeroBannerSimpleProps {
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
}

export default function HeroBannerSimple({
  overlay = true,
  overlayOpacity = 0.7,
  className = '',
}: HeroBannerSimpleProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-blue-light-600 to-purple-600">
        {/* Animated Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%),
                                   radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
                                   radial-gradient(circle at 40% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
               }} 
          />
        </div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Gradient Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-transparent"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}
