import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { QueryParams } from '@/types/service';

/**
 * Notification types
 */
export type NotificationType =
    | 'application_status'
    | 'interview_invite'
    | 'message'
    | 'job_alert'
    | 'system';

/**
 * Notification data
 */
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
}

/**
 * Notification Service
 * Handles user notifications
 */
class NotificationService extends BaseService {
    /**
     * Get user notifications
     */
    async getNotifications(params?: QueryParams): Promise<BaseResponse<PageResponse<Notification>>> {
        return this.getPaged<Notification>('/notifications', params);
    }

    /**
     * Get unread notifications
     */
    async getUnreadNotifications(): Promise<BaseResponse<Notification[]>> {
        return this.get<Notification[]>('/notifications/unread');
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string): Promise<BaseResponse<string>> {
        return this.patch<string>(`/notifications/${id}/read`);
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<BaseResponse<string>> {
        return this.post<string>('/notifications/read-all');
    }

    /**
     * Delete notification
     */
    async deleteNotification(id: string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/notifications/${id}`);
    }

    /**
     * Get unread count
     */
    async getUnreadCount(): Promise<BaseResponse<{ count: number }>> {
        return this.get<{ count: number }>('/notifications/unread-count');
    }
}

export const notificationService = new NotificationService();
