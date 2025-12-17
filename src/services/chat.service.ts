import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { Message, Conversation } from '@/types/chat';
import type { QueryParams } from '@/types/service';


export interface CursorPageResponse<T> {
    content: T[];
    nextCursor?: string;
    prevCursor?: string;
    hasMore: boolean;
    limit: number;
    totalCount?: number;
}

export interface SendMessageRequest {
    content: string;
    attachments?: string[];
}

export interface CreateConversationRequest {
    participantId: string;
    initialMessage?: string;
}

class ChatService extends BaseService {
    async getRooms(params?: QueryParams): Promise<BaseResponse<PageResponse<Conversation>>> {
        return this.getPaged<Conversation>('/chat/rooms', params);
    }

    async getRoom(id: string): Promise<BaseResponse<Conversation>> {
        return this.get<Conversation>(`/chat/rooms/${id}`);
    }

    async createRoom(data: CreateConversationRequest): Promise<BaseResponse<Conversation>> {
        return this.post<Conversation, CreateConversationRequest>('/chat/rooms', data);
    }

    /**
     * Get messages with cursor-based pagination (Messenger/Telegram style)
     * 
     * @param roomId - Chat room ID
     * @param cursor - ISO timestamp cursor (undefined for initial load)
     * @param limit - Number of messages to fetch (default 20)
     * @param direction - "before" for older messages, "after" for newer
     */
    async getMessages(
        roomId: string,
        cursor?: string,
        limit: number = 20,
        direction: 'before' | 'after' = 'before'
    ): Promise<BaseResponse<CursorPageResponse<Message>>> {
        const params = new URLSearchParams({
            limit: String(limit),
            direction
        });
        if (cursor) {
            params.append('cursor', cursor);
        }
        return this.get<CursorPageResponse<Message>>(
            `/chat/rooms/${roomId}/messages?${params.toString()}`
        );
    }

    async getMessagesLegacy(
        roomId: string,
        params?: QueryParams
    ): Promise<BaseResponse<PageResponse<Message>>> {
        return this.getPaged<Message>(`/chat/rooms/${roomId}/history`, params);
    }

    async sendMessage(
        roomId: string,
        data: SendMessageRequest
    ): Promise<BaseResponse<Message>> {
        return this.post<Message, SendMessageRequest>(
            `/chat/rooms/${roomId}/messages`,
            data
        );
    }

    async markAsRead(roomId: string): Promise<BaseResponse<string>> {
        return this.post<string>(`/chat/rooms/${roomId}/read`);
    }

    async deleteRoom(id: string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/chat/rooms/${id}`);
    }


    async getUnreadCount(): Promise<BaseResponse<{ count: number }>> {
        return this.get<{ count: number }>('/chat/unread-count');
    }
}

export const chatService = new ChatService();
