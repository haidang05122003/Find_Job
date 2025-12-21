'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/context/AuthContext';

export default function ChatRoomPage() {
    const { user } = useAuth();
    const params = useParams();
    const conversationId = params.roomId as string;

    if (!user || !conversationId) return null;

    return (
        <div className="flex h-full flex-col">
            <ChatInterface
                conversationId={conversationId}
                currentUserId={user.id}
            />
        </div>
    );
}
