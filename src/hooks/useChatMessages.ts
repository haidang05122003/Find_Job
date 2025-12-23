import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/services/chat.service';
import { webSocketService } from '@/services/websocket.service';
import type { Message } from '@/types/chat';

export const useChatMessages = (conversationId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Helper to normalize message data
    const normalizeMessage = (msg: Message) => ({
        ...msg,
        conversationId: msg.conversationId || String(msg.roomId) || conversationId,
        status: msg.status || 'sent',
        type: msg.type || 'text',
    });

    // Initial load
    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversationId) return;
            setMessagesLoading(true);
            try {
                const res = await chatService.getMessages(conversationId);
                if (res.success && res.data) {
                    const normalized = res.data.content.map(normalizeMessage);
                    setMessages(normalized);
                    setNextCursor(res.data.nextCursor || null);
                    setHasMore(res.data.hasMore);
                }
            } catch (e) {
                console.error("Error fetching messages", e);
            } finally {
                setMessagesLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId]);

    // WebSocket subscription
    useEffect(() => {
        if (!conversationId) return;

        const setupWebSocket = async () => {
            await webSocketService.connect();
            setIsConnected(true);

            webSocketService.subscribe(`/topic/chat/${conversationId}`, (rawMessage: Message) => {
                const newMessage = normalizeMessage(rawMessage);
                setMessages((prev) => {
                    if (prev.some(m => String(m.id) === String(newMessage.id))) return prev;
                    return [...prev, newMessage];
                });
            });
        };

        setupWebSocket();

        return () => {
            webSocketService.unsubscribe(`/topic/chat/${conversationId}`);
        };
    }, [conversationId]);

    // Load older messages
    const loadOlderMessages = useCallback(async () => {
        if (!hasMore || isLoadingMore || !nextCursor) return;

        setIsLoadingMore(true);
        try {
            const res = await chatService.getMessages(conversationId, nextCursor, 20, 'before');
            if (res.success && res.data) {
                const normalized = res.data.content.map(normalizeMessage);
                setMessages(prev => [...normalized, ...prev]);
                setNextCursor(res.data.nextCursor || null);
                setHasMore(res.data.hasMore);
            }
        } catch (e) {
            console.error("Error loading older messages", e);
        } finally {
            setIsLoadingMore(false);
        }
    }, [conversationId, hasMore, isLoadingMore, nextCursor]);

    // Send message
    const sendMessage = async (content: string, attachment?: { url: string; type: 'IMAGE' | 'FILE'; fileName: string }) => {
        try {
            const payload: any = { content };
            if (attachment) {
                payload.attachmentUrl = attachment.url;
                payload.attachmentType = attachment.type;
                payload.fileName = attachment.fileName;
            }

            const res = await chatService.sendMessage(conversationId, payload);
            if (res.success && res.data) {
                const newMsg = normalizeMessage(res.data);
                setMessages((prev) => {
                    if (prev.some(m => String(m.id) === String(newMsg.id))) return prev;
                    return [...prev, newMsg];
                });
                return true;
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            return false;
        }
        return false;
    };

    return {
        messages,
        messagesLoading,
        hasMore,
        isLoadingMore,
        isConnected,
        loadOlderMessages,
        sendMessage
    };
};
