/**
 * Image preloading utilities for better performance
 */

interface PreloadOptions {
    priority?: 'high' | 'low';
    as?: 'image' | 'fetch';
}

/**
 * Preload a single image
 */
export function preloadImage(src: string, options: PreloadOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = options.as || 'image';
        link.href = src;

        if (options.priority) {
            link.setAttribute('fetchpriority', options.priority);
        }

        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to preload image: ${src}`));

        document.head.appendChild(link);
    });
}

/**
 * Preload multiple images
 */
export async function preloadImages(
    sources: string[],
    options: PreloadOptions = {}
): Promise<void[]> {
    return Promise.all(sources.map(src => preloadImage(src, options)));
}

/**
 * Preload images in viewport
 */
export function preloadImagesInViewport(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        return;
    }

    const images = document.querySelectorAll('img[data-preload]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    const src = img.dataset.src;

                    if (src) {
                        preloadImage(src, { priority: 'high' });
                        observer.unobserve(img);
                    }
                }
            });
        },
        {
            rootMargin: '50px',
        }
    );

    images.forEach((img) => observer.observe(img));
}

/**
 * Create optimized image srcset
 */
export function generateSrcSet(
    baseUrl: string,
    widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
    return widths
        .map((width) => `${baseUrl}?w=${width} ${width}w`)
        .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { [key: string]: string }): string {
    return Object.entries(breakpoints)
        .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
        .join(', ');
}

/**
 * Check if image is cached
 */
export function isImageCached(src: string): boolean {
    if (typeof window === 'undefined') return false;

    const img = new Image();
    img.src = src;
    return img.complete;
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages(selector: string = 'img[data-lazy]'): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        return;
    }

    const images = document.querySelectorAll(selector);

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    const src = img.dataset.src;
                    const srcset = img.dataset.srcset;

                    if (src) {
                        img.src = src;
                    }
                    if (srcset) {
                        img.srcset = srcset;
                    }

                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        },
        {
            rootMargin: '50px',
            threshold: 0.01,
        }
    );

    images.forEach((img) => observer.observe(img));
}
