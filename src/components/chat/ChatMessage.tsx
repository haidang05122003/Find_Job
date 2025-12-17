import React from 'react';
import { Message } from '@/types/chat';
import { formatTime } from '@/lib/utils';

import Image from 'next/image';
import { getInitials } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  avatarUrl?: string; // URL of the other person's avatar
  senderName?: string; // Name of the other person
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn, avatarUrl, senderName }) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />
          </svg>
        );
      case 'read':
        return (
          <svg className="h-3 w-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-end gap-2 mb-4 ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {!isOwn && (
        <div className="flex-shrink-0 mb-1">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={senderName || 'Avatar'}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
              {getInitials(senderName || 'User')}
            </div>
          )}
        </div>
      )}

      <div
        className={`relative max-w-[70%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${isOwn
          ? 'bg-blue-600 text-white rounded-br-sm'
          : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700'
          }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
