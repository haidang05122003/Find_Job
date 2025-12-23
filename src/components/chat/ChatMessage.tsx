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
            <img
              src={avatarUrl}
              alt={senderName || 'Avatar'}
              className="w-7 h-7 rounded-full object-cover"
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
        <div className="space-y-2">
          {message.attachmentUrl && message.attachmentType === 'IMAGE' && (
            <div className="mb-2">
              <img
                src={message.attachmentUrl}
                alt="Attachment"
                className="rounded-lg max-w-full h-auto object-cover max-h-[300px]"
                loading="lazy"
              />
            </div>
          )}

          {message.attachmentUrl && message.attachmentType === 'FILE' && (
            <a
              href={message.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-3 rounded-lg border ${isOwn
                ? 'bg-blue-700 border-blue-600 hover:bg-blue-800'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                } transition-colors`}
            >
              <div className={`p-2 rounded-full ${isOwn ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate text-xs">{message.fileName || 'Tệp đính kèm'}</span>
                <span className="text-[10px] opacity-75">Nhấn để tải về</span>
              </div>
            </a>
          )}

          {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
        </div>
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
