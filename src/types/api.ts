/**
 * Base API response structure with generic data type
 * @template T - The type of data returned in the response
 */
export interface BaseResponse<T = unknown> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}

/**
 * API Error structure for error responses
 */
export interface ApiError {
    success: false;
    code: number;
    message: string;
    errors?: Record<string, string[]>;
    timestamp?: string;
    data?: unknown;
}

/**
 * Paginated response structure
 * @template T - The type of items in the content array
 */
export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

/**
 * Type alias for API result that can be either success or error
 */
export type ApiResult<T> = BaseResponse<T> | ApiError;

/**
 * Type alias for paginated API responses
 */
export type PagedApiResult<T> = BaseResponse<PageResponse<T>>;
