import { BaseService } from './base.service';
import type { LoginCredentials, RegisterData, UserProfile } from '@/types/user';
import type { BaseResponse } from '@/types/api';

/**
 * Authentication response with user data and token
 */
export interface AuthResponse {
    token: string;
    refreshToken: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
}

/**
 * Social login request data
 */
export interface SocialLoginData {
    provider: 'google' | 'facebook' | 'github';
    token: string;
}

/**
 * Password reset request data
 */
export interface ResetPasswordData {
    email: string;
    otp: string;
    newPassword: string;
}

/**
 * Authentication Service
 * Handles user authentication, registration, and password management
 */
class AuthService extends BaseService {
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<BaseResponse<AuthResponse>> {
        return this.post<AuthResponse, LoginCredentials>('/auth/login', credentials);
    }

    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<BaseResponse<AuthResponse>> {
        return this.post<AuthResponse, RegisterData>('/auth/register', data);
    }

    /**
     * Logout current user
     */
    async logout(): Promise<BaseResponse<string>> {
        return this.post<string>('/auth/logout');
    }

    /**
     * Social login with provider token
     */
    async socialLogin(data: SocialLoginData): Promise<BaseResponse<AuthResponse>> {
        return this.post<AuthResponse, SocialLoginData>('/auth/social-login', data);
    }

    /**
     * Request password reset email
     */
    async forgotPassword(email: string): Promise<BaseResponse<string>> {
        return this.post<string, { email: string }>('/auth/forgot-password', { email });
    }

    /**
     * Verify OTP
     */
    async verifyOtp(email: string, otp: string): Promise<BaseResponse<string>> {
        return this.post<string, { email: string; otp: string }>('/auth/verify-otp', { email, otp });
    }

    /**
     * Verify authentication token
     */
    async verifyToken(): Promise<BaseResponse<UserProfile>> {
        return this.get<UserProfile>('/auth/verify');
    }

    /**
     * Refresh authentication token
     */
    async refreshToken(refreshToken: string): Promise<BaseResponse<AuthResponse>> {
        return this.post<AuthResponse, { refreshToken: string }>(
            '/auth/refresh',
            { refreshToken }
        );
    }

    /**
     * Change user password
     */
    async changePassword(data: { oldPassword: string; newPassword: string }): Promise<BaseResponse<string>> {
        return this.post<string, { oldPassword: string; newPassword: string }>('/auth/change-password', data);
    }

    /**
     * Reset password with OTP
     */
    async resetPassword(data: { email: string; otp: string; newPassword: string }): Promise<BaseResponse<string>> {
        return this.post<string, { email: string; otp: string; newPassword: string }>('/auth/reset-password', data);
    }
}

export const authService = new AuthService();
