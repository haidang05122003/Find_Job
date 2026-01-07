'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import { getRecipient } from '@/lib/chat.utils';
import { chatService } from '@/services/chat.service';
import type { Conversation } from '@/types/chat';
import { usePathname } from 'next/navigation';


export default function ChatSidebar({ basePath = '/messages' }: { basePath?: string }) {
    const { user } = useAuth();
    const { notifications } = useNotifications();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    const fetchRooms = async () => {
        try {
            const res = await chatService.getRooms();
            if (res.success && res.data) {
                setConversations(res.data.content || []);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRooms();
        }
    }, [user]);

    // Subscribe to real-time chat updates
    useEffect(() => {
        if (!user) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        // Need to import SockJS and Client or similar if not available globally. 
        // For now, check if we can reuse NotificationContext socket or create new one.
        // Creating new one for Sidebar is safer isolated.

        const socket = new (require('sockjs-client'))(`${API_URL.replace('/api/v1', '')}/ws`);
        const { Client } = require('@stomp/stompjs'); // Dynamic import to avoid SSR issues if any

        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: () => { }, // Quiet debug
        });

        stompClient.onConnect = () => {
            stompClient.subscribe(`/topic/user/${user.id}/chat`, () => {
                fetchRooms(); // Refresh list on any new message
            });
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [user]);

    // Refresh rooms when a new chat notification arrives (Fallback)
    useEffect(() => {
        if (notifications.length > 0) {
            const latest = notifications[0];
            if (latest.title === 'Tin nhắn mới') {
                fetchRooms();
            }
        }
    }, [notifications]);

    // Determine active ID from pathname (e.g. /messages/123)
    const activeConversationId = pathname?.split('/').pop();
    const isMessageDetail = pathname?.includes(basePath + '/') && activeConversationId && activeConversationId !== 'chat' && activeConversationId !== 'messages';

    if (!user) return null;

    return (
        <div
            className={`
        ${isMessageDetail ? 'hidden lg:flex' : 'flex'} 
        w-full flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-80 h-full
      `}
        >
            <div className="flex flex-col gap-4 p-5 pb-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Tin nhắn
                    </h2>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tin nhắn..."
                        className="w-full rounded-full border-none bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <svg className="absolute left-3.5 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="overflow-y-auto flex-1">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Chưa có cuộc trò chuyện nào
                        </p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        const recipient = getRecipient(conversation, user.id);

                        if (!recipient) {
                            return null;
                        }

                        const lastMessageContent = typeof conversation.lastMessage === 'string'
                            ? conversation.lastMessage
                            : conversation.lastMessage?.content;

                        const lastMessageTime = conversation.lastMessageAt
                            ? new Date(conversation.lastMessageAt)
                            : (typeof conversation.lastMessage === 'object' ? conversation.lastMessage?.timestamp : undefined);

                        const isOwnMessage = typeof conversation.lastMessage === 'object' && conversation.lastMessage?.senderId === user.id;

                        return (
                            <div className="px-2 py-1" key={conversation.id}>
                                <Link
                                    href={`${basePath}/${conversation.id}`}
                                    className={`group block w-full rounded-xl p-3 text-left transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${activeConversationId === conversation.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20'
                                        : ''
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <div className="relative flex-shrink-0">
                                            {recipient.avatar ? (
                                                <img
                                                    src={recipient.avatar}
                                                    alt={recipient.name}
                                                    width={56}
                                                    height={56}
                                                    className="h-14 w-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-lg font-bold text-brand-600 dark:from-brand-900 dark:to-brand-800 dark:text-brand-300">
                                                    {getInitials(recipient.name)}
                                                </div>
                                            )}
                                            {recipient.status === 'online' && (
                                                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-green-500 dark:border-gray-900" />
                                            )}

                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`truncate font-semibold ${conversation.unreadCount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                                                    {recipient.name}
                                                </h3>
                                                {lastMessageTime && (
                                                    <span className={`ml-2 flex-shrink-0 whitespace-nowrap text-[11px] ${conversation.unreadCount > 0 ? 'font-semibold text-brand-600' : 'text-gray-400'}`}>
                                                        {formatRelativeTime(lastMessageTime)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className={`truncate text-sm ${conversation.unreadCount > 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                                    {lastMessageContent ? (
                                                        <>
                                                            {isOwnMessage && 'Bạn: '}
                                                            {lastMessageContent}
                                                        </>
                                                    ) : (
                                                        <span className="italic opacity-80">Bắt đầu cuộc trò chuyện</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
