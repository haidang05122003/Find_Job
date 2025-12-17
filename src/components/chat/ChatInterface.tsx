'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getInitials } from '@/lib/utils';
import { chatService, CursorPageResponse } from '@/services/chat.service';
import { webSocketService } from '@/services/websocket.service';
import type { Message, Conversation } from '@/types/chat';

interface ChatInterfaceProps {
  conversationId: string;
  currentUserId: string;
  conversation?: Conversation;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId, currentUserId, conversation: propConversation }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [localConversation, setLocalConversation] = React.useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  // Cursor-based pagination state
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const conversation = propConversation || localConversation;

  // Fetch conversation metadata
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

  // Initial message load with cursor-based pagination
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      try {
        // Initial load: get newest 20 messages (cursor = undefined)
        const res = await chatService.getMessages(conversationId);
        if (res.success && res.data) {
          const normalizedMessages = res.data.content.map((msg: Message) => ({
            ...msg,
            conversationId: msg.conversationId || String(msg.roomId) || conversationId,
            status: msg.status || 'sent',
            type: msg.type || 'text',
          }));
          setMessages(normalizedMessages);
          setNextCursor(res.data.nextCursor || null);
          setHasMore(res.data.hasMore);
        }
      } catch (e) {
        console.error("Error fetching messages", e);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Load older messages (scroll up)
  const loadOlderMessages = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;

    setIsLoadingMore(true);
    try {
      const res = await chatService.getMessages(conversationId, nextCursor, 20, 'before');
      if (res.success && res.data) {
        const normalizedMessages = res.data.content.map((msg: Message) => ({
          ...msg,
          conversationId: msg.conversationId || String(msg.roomId) || conversationId,
          status: msg.status || 'sent',
          type: msg.type || 'text',
        }));

        // Prepend older messages
        setMessages(prev => [...normalizedMessages, ...prev]);
        setNextCursor(res.data.nextCursor || null);
        setHasMore(res.data.hasMore);
      }
    } catch (e) {
      console.error("Error loading older messages", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, hasMore, isLoadingMore, nextCursor]);

  // Scroll detection for infinite scroll (load more when at top)
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    // Load more when scrolled to top (within 50px threshold)
    if (container.scrollTop < 50 && hasMore && !isLoadingMore) {
      loadOlderMessages();
    }
  }, [hasMore, isLoadingMore, loadOlderMessages]);

  // WebSocket subscription
  useEffect(() => {
    if (!conversationId) return;

    const setupWebSocket = async () => {
      await webSocketService.connect();
      setIsConnected(true);

      webSocketService.subscribe(`/topic/chat/${conversationId}`, (rawMessage: Message) => {
        const newMessage: Message = {
          ...rawMessage,
          conversationId: rawMessage.conversationId || String(rawMessage.roomId) || conversationId,
          status: rawMessage.status || 'sent',
          type: rawMessage.type || 'text',
        };

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

  // Scroll to bottom on new messages (only for new messages at end)
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = async (content: string) => {
    try {
      const res = await chatService.sendMessage(conversationId, { content });
      if (res.success && res.data) {
        setMessages((prev) => {
          if (prev.some(m => String(m.id) === String(res.data.id))) return prev;
          return [...prev, res.data];
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // UI Helpers
  let recipient = conversation?.participants?.find((p) => p.id !== currentUserId);
  if (!recipient && conversation && conversation.name) {
    recipient = {
      id: conversation.id,
      name: conversation.name,
      avatar: conversation.avatar,
      email: '',
      role: 'CANDIDATE',
      status: 'offline'
    };
  }

  if (!conversation) {
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
            <Image
              src={recipient.avatar}
              alt={recipient.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
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
        onScroll={handleScroll}
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

        {messages.length === 0 ? (
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
      <ChatInput onSend={handleSend} onTyping={() => { }} disabled={!isConnected && false} />
    </div>
  );
};

export default ChatInterface;
