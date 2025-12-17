/**
 * Optimized lazy loading utilities for components
 * Provides better code splitting and loading states
 */

import React, { lazy, ComponentType } from 'react';

interface LazyOptions {
    /**
     * Minimum delay before showing the component (prevents flash of loading state)
     */
    minDelay?: number;
}

/**
 * Enhanced lazy loading with minimum delay to prevent loading flashes
 */
export function lazyWithDelay<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
    options: LazyOptions = {}
): React.LazyExoticComponent<T> {
    const { minDelay = 0 } = options;

    return lazy(() => {
        const componentPromise = factory();

        if (minDelay === 0) {
            return componentPromise;
        }

        const delayPromise = new Promise<void>(resolve =>
            setTimeout(resolve, minDelay)
        );

        return Promise.all([componentPromise, delayPromise])
            .then(([component]) => component);
    });
}

/**
 * Preload a lazy component
 */
export function preloadComponent<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
): void {
    factory();
}

/**
 * Create a lazy component with preload capability
 */
export function lazyWithPreload<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
) {
    const Component = lazy(factory);
    return {
        Component,
        preload: () => preloadComponent(factory),
    };
}
