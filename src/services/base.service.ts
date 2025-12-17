/**
 * Base Service Class
 * Provides common HTTP methods with proper TypeScript generics
 * All service classes should extend this base class
 */

import axiosClient from './axios-client';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { RequestConfig, QueryParams } from '@/types/service';

export class BaseService {
    /**
     * GET request
     * @template T - Response data type
     */
    protected async get<T>(
        url: string,
        config?: RequestConfig
    ): Promise<BaseResponse<T>> {
        return axiosClient.get<never, BaseResponse<T>>(url, config);
    }

    /**
     * POST request
     * @template T - Response data type
     * @template D - Request body data type
     */
    protected async post<T, D = unknown>(
        url: string,
        data?: D,
        config?: RequestConfig
    ): Promise<BaseResponse<T>> {
        return axiosClient.post<D, BaseResponse<T>>(url, data, config);
    }

    /**
     * PUT request
     * @template T - Response data type
     * @template D - Request body data type
     */
    protected async put<T, D = unknown>(
        url: string,
        data?: D,
        config?: RequestConfig
    ): Promise<BaseResponse<T>> {
        return axiosClient.put<D, BaseResponse<T>>(url, data, config);
    }

    /**
     * PATCH request
     * @template T - Response data type
     * @template D - Request body data type
     */
    protected async patch<T, D = unknown>(
        url: string,
        data?: D,
        config?: RequestConfig
    ): Promise<BaseResponse<T>> {
        return axiosClient.patch<D, BaseResponse<T>>(url, data, config);
    }

    /**
     * DELETE request
     * @template T - Response data type
     */
    protected async delete<T>(
        url: string,
        config?: RequestConfig
    ): Promise<BaseResponse<T>> {
        return axiosClient.delete<never, BaseResponse<T>>(url, config);
    }

    /**
     * GET request for paginated data
     * @template T - Item type in the page
     */
    protected async getPaged<T>(
        url: string,
        params?: QueryParams,
        config?: RequestConfig
    ): Promise<BaseResponse<PageResponse<T>>> {
        const queryString = this.buildQueryString(params);
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        return axiosClient.get<never, BaseResponse<PageResponse<T>>>(fullUrl, config);
    }

    /**
     * Build query string from parameters
     */
    protected buildQueryString(params?: QueryParams): string {
        if (!params) return '';

        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });

        return searchParams.toString();
    }

    /**
     * Build URL with path parameters
     */
    protected buildUrl(template: string, params: Record<string, string | number>): string {
        let url = template;
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, String(value));
        });
        return url;
    }
}
