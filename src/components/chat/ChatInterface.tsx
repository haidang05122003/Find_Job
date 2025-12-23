'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getInitials } from '@/lib/utils';
import { getRecipient } from '@/lib/chat.utils';
import { chatService } from '@/services/chat.service';
import type { Conversation } from '@/types/chat';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatScroll } from '@/hooks/useChatScroll';

interface ChatInterfaceProps {
  conversationId: string;
  currentUserId: string;
  conversation?: Conversation;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId, currentUserId, conversation: propConversation }) => {
  const [localConversation, setLocalConversation] = useState<Conversation | null>(null);

  // Custom hooks
  const {
    messages,
    messagesLoading,
    hasMore,
    isLoadingMore,
    isConnected,
    loadOlderMessages,
    sendMessage
  } = useChatMessages(conversationId);

  const {
    messagesContainerRef,
    messagesEndRef,
    handleScroll
  } = useChatScroll(messages.length, isLoadingMore);

  const conversation = propConversation || localConversation;

  // Fetch conversation metadata (keep existing logic)
  useEffect(() => {
    const fetchConv = async () => {
      if (!propConversation && conversationId) {
        try {
          const listRes = await chatService.getRooms();
          if (listRes.success && listRes.data && listRes.data.content) {
            const found = listRes.data.content.find((c: Conversation) => String(c.id) === String(conversationId));
            if (found) {
              setLocalConversation(found);
            } else {
              const res = await chatService.getRoom(conversationId);
              if (res.success && res.data) setLocalConversation(res.data);
            }
          }
        } catch (e) {
          console.error("Error fetching conversation", e);
        }
      }
    };
    fetchConv();
  }, [conversationId, propConversation]);

  // UI Helpers
  const recipient = conversation && currentUserId ? getRecipient(conversation, currentUserId) : undefined;

  // Handle loading initial conversation metadata
  if (!conversation && !localConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading conversation...</p>
      </div>
    );
  }

  if (!recipient) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Cuộc trò chuyện không hợp lệ</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="relative">
          {recipient.avatar ? (
            /* Use standard img tag to avoid Next.js Image Optimization issues with external Google URLs */
            <img
              src={recipient.avatar}
              alt={recipient.name}
              className="h-10 w-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
              {getInitials(recipient.name)}
            </div>
          )}
          {recipient.status === 'online' && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">{recipient.name}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {recipient.status === 'online' ? 'Đang hoạt động' : 'Không hoạt động'}
          </p>
        </div>
        {!isConnected && (
          <div className="h-2 w-2 rounded-full bg-yellow-500" title="Connecting..." />
        )}
      </div>

      {/* Messages Area with Infinite Scroll */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50/50 p-6 dark:bg-gray-950"
        onScroll={() => handleScroll()}
      >
        {/* Loading indicator for older messages */}
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        )}

        {/* Load more button (alternative to scroll detection) */}
        {hasMore && !isLoadingMore && (
          <div className="flex justify-center py-2">
            <button
              onClick={loadOlderMessages}
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Tải thêm tin nhắn cũ hơn
            </button>
          </div>
        )}

        {messages.length === 0 && !messagesLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có tin nhắn nào
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = String(message.senderId) === String(currentUserId);
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  avatarUrl={recipient?.avatar}
                  senderName={recipient?.name}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={(text, attach) => sendMessage(text, attach)} onTyping={() => { }} disabled={!isConnected && false} />
    </div>
  );
};

export default ChatInterface;
