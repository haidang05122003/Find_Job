import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

/**
 * Axios client instance with interceptors for authentication and error handling
 */
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
});

/**
 * Request interceptor - Adds authentication token to requests
 */
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handles responses and errors globally
 */
axiosClient.interceptors.response.use(
    <T>(response: AxiosResponse<T>): T => {
        return response.data;
    },
    (error: AxiosError<ApiError>): Promise<ApiError> => {
        // Handle network errors
        if (!error.response) {
            const networkError: ApiError = {
                success: false,
                code: 0,
                message: 'Network error. Please check your connection.',
                timestamp: new Date().toISOString(),
            };
            return Promise.reject(networkError);
        }

        // Handle 401 Unauthorized
        if (error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                // Optional: Redirect to login page
                // window.location.href = '/signin';
            }
        }

        // Return structured error
        const responseData = error.response.data as any;
        const apiError: ApiError = {
            success: responseData?.success || false,
            code: responseData?.code || error.response.status,
            message: responseData?.message || error.message || 'An error occurred',
            timestamp: responseData?.timestamp || new Date().toISOString(),
            data: responseData?.data
        };

        return Promise.reject(apiError);
    }
);

export default axiosClient;
