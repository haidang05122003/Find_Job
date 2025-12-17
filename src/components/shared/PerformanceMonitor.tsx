'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/app/web-vitals';

/**
 * Performance monitoring component
 * Initializes web vitals tracking and performance observers
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize web vitals
    initWebVitals();

    // Monitor long tasks (only in development)
    if (process.env.NODE_ENV === 'development' && 'PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn('[Performance] Long task detected:', {
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime),
            });
          }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });

        return () => {
          longTaskObserver.disconnect();
        };
      } catch {
        // PerformanceObserver not supported or error occurred
      }
    }
  }, []);

  return null;
}

export default PerformanceMonitor;
