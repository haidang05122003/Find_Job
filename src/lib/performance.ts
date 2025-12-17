/**
 * Performance monitoring and optimization utilities
 */

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: never[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: never[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Measure component render time
 */
export function measureRender(componentName: string, callback: () => void) {
    if (typeof window === 'undefined' || !window.performance) return callback();

    const start = performance.now();
    callback();
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
    }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function createIntersectionObserver(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
): IntersectionObserver | null {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        return null;
    }

    return new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.01,
        ...options,
    });
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
}

/**
 * Prefetch next page
 */
export function prefetchPage(href: string) {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
}

/**
 * Report Web Vitals
 */
export function reportWebVitals(metric: { name: string; value: number; rating?: string }) {
    if (process.env.NODE_ENV === 'development') {
        console.log('[Web Vitals]', metric);
    }

    // Send to analytics in production
    // Example: sendToAnalytics(metric);
}

/**
 * Optimize images by calculating optimal sizes
 */
export function getOptimalImageSize(): string {
    const breakpoints = [640, 750, 828, 1080, 1200, 1920];
    const sizes = breakpoints
        .map((bp, i) => {
            if (i === breakpoints.length - 1) {
                return `${bp}px`;
            }
            return `(max-width: ${bp}px) ${bp}px`;
        })
        .join(', ');

    return sizes;
}

/**
 * Check if device has slow connection
 */
export function isSlowConnection(): boolean {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
        return false;
    }

    const connection = (navigator as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    return connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '2g' ||
        connection?.saveData === true;
}

/**
 * Adaptive loading based on network conditions
 */
export function shouldLoadHeavyContent(): boolean {
    if (isSlowConnection()) return false;
    if (prefersReducedMotion()) return false;
    return true;
}
