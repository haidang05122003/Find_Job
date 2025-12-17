'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/context/AuthContext';

export default function ChatRoomPage() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const conversationId = params.roomId as string;

    if (!user || !conversationId) return null;

    return (
        <div className="flex h-full flex-col">
            {/* Mobile Header Back Button - visible only on small screens */}
            <div className="lg:hidden flex items-center p-2 border-b border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
                <button onClick={() => router.push('/messages')} className="p-2 text-gray-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="font-semibold ml-2">Quay lại</span>
            </div>

            <ChatInterface
                conversationId={conversationId}
                currentUserId={user.id}
            />
        </div>
    );
}
