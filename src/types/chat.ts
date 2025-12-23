import { UserRole } from './user';

export type MessageStatus = 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'file' | 'system';
export type UserStatus = 'online' | 'offline' | 'away';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    company?: string;
    lastSeen?: Date;
}

export interface Message {
    id: string;
    conversationId?: string;
    roomId?: string | number; // Backend compatibility
    senderId: string | number;
    senderName?: string;
    content: string;
    timestamp: Date | string;
    status?: MessageStatus;
    type?: MessageType;
    readBy?: string[];
    attachmentUrl?: string;
    attachmentType?: 'IMAGE' | 'FILE';
    fileName?: string;
}

export interface Conversation {
    id: string;
    participants?: User[];
    name?: string; // Backend DTO might return pre-resolved name
    avatar?: string; // Backend DTO might return pre-resolved avatar
    otherUserId?: number;
    lastMessage?: Message | string; // Backend might return string content directly
    lastMessageAt?: Date | string; // Backend specific field
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
    jobContext?: {
        jobId: string;
        jobTitle: string;
    };
}

export interface TypingIndicator {
    conversationId: string;
    userId: string;
    userName: string;
    isTyping: boolean;
}

export interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Record<string, Message[]>;
    typingIndicators: Record<string, TypingIndicator>;
    isConnected: boolean;
    unreadTotal: number;
}
