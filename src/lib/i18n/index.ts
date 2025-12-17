/**
 * i18n Helper Functions
 * Provides translation utilities for the application
 */

import { vi } from './vi';

type TranslationKey = string;
type TranslationValue = string | Record<string, unknown>;

/**
 * Get translation by key
 * Supports nested keys with dot notation (e.g., 'auth.signIn')
 * 
 * @param key - Translation key (e.g., 'common.search', 'auth.signIn')
 * @param params - Optional parameters for string interpolation
 * @returns Translated string or key if not found
 * 
 * @example
 * t('common.search') // => 'Tìm kiếm'
 * t('errors.minLength', { min: 8 }) // => 'Tối thiểu 8 ký tự'
 */
export const t = (key: TranslationKey, params?: Record<string, unknown>): string => {
    const keys = key.split('.');
    let value: TranslationValue = vi;

    // Navigate through nested object
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, TranslationValue>)[k];
        } else {
            // Key not found, return the key itself
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    // If value is not a string, return the key
    if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${key}`);
        return key;
    }

    // Replace parameters if provided
    if (params) {
        return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
            return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
        }, value);
    }

    return value;
};

/**
 * Check if a translation key exists
 * 
 * @param key - Translation key to check
 * @returns True if key exists, false otherwise
 */
export const hasTranslation = (key: TranslationKey): boolean => {
    const keys = key.split('.');
    let value: TranslationValue = vi;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, TranslationValue>)[k];
        } else {
            return false;
        }
    }

    return typeof value === 'string';
};

/**
 * Get all translations for a namespace
 * 
 * @param namespace - Namespace key (e.g., 'auth', 'jobs')
 * @returns Object containing all translations in that namespace
 */
export const getNamespace = (namespace: string): Record<string, unknown> => {
    const keys = namespace.split('.');
    let value: TranslationValue = vi;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, TranslationValue>)[k];
        } else {
            return {};
        }
    }

    return typeof value === 'object' ? value : {};
};

/**
 * Format date relative to now (e.g., "2 days ago")
 * 
 * @param date - Date to format
 * @returns Formatted relative date string in Vietnamese
 */
export const formatRelativeDate = (date: Date | string): string => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        return t('date.today');
    } else if (diffInDays === 1) {
        return t('date.yesterday');
    } else if (diffInDays < 7) {
        return t('date.daysAgo', { days: diffInDays });
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return t('date.weeksAgo', { weeks });
    } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return t('date.monthsAgo', { months });
    } else {
        const years = Math.floor(diffInDays / 365);
        return t('date.yearsAgo', { years });
    }
};

/**
 * Format salary range
 * 
 * @param min - Minimum salary
 * @param max - Maximum salary
 * @param currency - Currency symbol (default: 'VNĐ')
 * @returns Formatted salary range string
 */
export const formatSalaryRange = (
    min: number,
    max: number,
    currency: string = 'VNĐ'
): string => {
    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(0)} triệu`;
        }
        return num.toLocaleString('vi-VN');
    };

    if (min === 0 && max === 0) {
        return 'Thỏa thuận';
    }

    if (min === max) {
        return `${formatNumber(min)} ${currency}`;
    }

    return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
};

/**
 * Pluralize Vietnamese text
 * Note: Vietnamese doesn't have complex pluralization rules like English
 * 
 * @param count - Number of items
 * @param singular - Singular form
 * @returns Formatted string with count
 */
export const pluralize = (count: number, singular: string): string => {
    return `${count} ${singular}`;
};

// Export translations for direct access if needed
export { vi };

// Export types
export type { TranslationKeys } from './vi';
