'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { notificationService, Notification } from '@/services/notification.service';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface NotificationContextValue {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getNotifications({ size: 10 });
            if (res.success && res.data) {
                setNotifications(res.data.content);
            }
            // Fetch separate unread count (accurate total)
            const countRes = await notificationService.getUnreadCount();
            if (countRes.success && countRes.data) {
                setUnreadCount(countRes.data.count);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        fetchNotifications();

        // WebSocket connection
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        const socket = new SockJS(`${API_URL.replace('/api/v1', '')}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                // (str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = () => {
            // ('Connected to WebSocket');
            stompClient.subscribe(`/topic/notifications/${user.id}`, (message) => {
                if (message.body) {
                    const newNotification: Notification = JSON.parse(message.body);
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // Optional: Show toast
                    // toast.info(newNotification.message);
                }
            });
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
