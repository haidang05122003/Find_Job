/**
 * Service layer type definitions
 * These types are used across all service files for consistent API interactions
 */

import { AxiosRequestConfig } from 'axios';

/**
 * Extended request configuration for service methods
 */
export interface RequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean;
    customHeaders?: Record<string, string>;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

/**
 * Common filter parameters
 */
export interface FilterParams {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: string | number | boolean | string[] | undefined;
}

/**
 * Combined query parameters for list endpoints
 */
export interface QueryParams extends PaginationParams, FilterParams { }

/**
 * Sort configuration
 */
export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}
