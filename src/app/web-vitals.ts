'use client';

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Web Vitals reporting for performance monitoring
 * Logs metrics in development, can be extended to send to analytics in production
 */
export function reportWebVitals(metric: Metric) {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[Web Vitals]', {
            name: metric.name,
            value: Math.round(metric.value),
            rating: metric.rating,
            delta: Math.round(metric.delta),
        });
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
        // Example: Send to Google Analytics
        // window.gtag?.('event', metric.name, {
        //   value: Math.round(metric.value),
        //   metric_id: metric.id,
        //   metric_value: metric.value,
        //   metric_delta: metric.delta,
        // });

        // Example: Send to custom analytics endpoint
        // fetch('/api/analytics', {
        //   method: 'POST',
        //   body: JSON.stringify(metric),
        //   headers: { 'Content-Type': 'application/json' },
        // });
    }
}

/**
 * Initialize web vitals monitoring
 * Note: onINP (Interaction to Next Paint) replaces onFID (First Input Delay) in web-vitals v5
 */
export function initWebVitals() {
    onCLS(reportWebVitals);
    onINP(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
}
