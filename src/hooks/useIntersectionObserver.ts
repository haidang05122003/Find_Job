import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
    freezeOnceVisible?: boolean;
}

/**
 * Optimized Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
    options: UseIntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement | null>, boolean] {
    const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // If already visible and freeze is enabled, don't observe
        if (freezeOnceVisible && isVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isIntersecting = entry.isIntersecting;
                setIsVisible(isIntersecting);

                // Unobserve if freeze is enabled and element is visible
                if (freezeOnceVisible && isIntersecting) {
                    observer.unobserve(element);
                }
            },
            { threshold, root, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, root, rootMargin, freezeOnceVisible, isVisible]);

    return [elementRef, isVisible];
}

/**
 * Simple lazy load hook
 */
export function useLazyLoad(rootMargin: string = '200px'): [React.RefObject<HTMLDivElement | null>, boolean] {
    return useIntersectionObserver({
        rootMargin,
        freezeOnceVisible: true,
    });
}
