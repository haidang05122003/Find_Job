import { BaseService } from './base.service';
import type { BaseResponse } from '@/types/api';
import type { UserProfile } from '@/types/user';

/**
 * User profile update data
 */
export interface UserProfileUpdate {
    name?: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    location?: {
        city: string;
        country: string;
    };
}

/**
 * User Service
 * Handles user profile and account management
 */
class UserService extends BaseService {
    /**
     * Get current authenticated user profile
     */
    async getCurrentUser(): Promise<BaseResponse<UserProfile>> {
        const response = await this.get<any>('/users/me');

        if (response.success && response.data) {
            // Transform backend response to UserProfile
            const backendUser = response.data;
            const userProfile: UserProfile = {
                id: backendUser.id.toString(),
                email: backendUser.email,
                name: backendUser.fullName || backendUser.username,
                fullName: backendUser.fullName,
                username: backendUser.username,
                avatarUrl: backendUser.avatarUrl,
                roles: backendUser.roles || (backendUser.role ? [backendUser.role] : []),
                activeRole: (backendUser.roles && backendUser.roles.length > 0) ? backendUser.roles[0] : backendUser.role,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return { ...response, data: userProfile };
        }

        return response;
    }

    /**
     * Update user profile
     */
    async updateProfile(data: UserProfileUpdate): Promise<BaseResponse<UserProfile>> {
        return this.put<UserProfile, UserProfileUpdate>('/users/me', data);
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<BaseResponse<UserProfile>> {
        return this.get<UserProfile>(`/users/${id}`);
    }

    /**
     * Upload user avatar
     */
    async uploadAvatar(file: File): Promise<BaseResponse<{ url: string }>> {
        const formData = new FormData();
        formData.append('avatar', file);
        return this.post<{ url: string }, FormData>('/users/me/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    /**
     * Delete user account
     */
    async deleteAccount(): Promise<BaseResponse<string>> {
        return this.delete<string>('/users/me');
    }
}

export const userService = new UserService();
