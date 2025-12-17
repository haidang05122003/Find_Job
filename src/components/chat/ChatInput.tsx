'use client';

import React, { useState, useRef, useEffect } from 'react';
// Helper function for message validation
const isValidMessageLength = (message: string): boolean => {
  return message.length >= 1 && message.length <= 1000;
};

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onTyping, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setMessage(value);

      if (!isTyping && value.length > 0) {
        setIsTyping(true);
        onTyping?.(true);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping?.(false);
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (trimmedMessage && isValidMessageLength(trimmedMessage)) {
      onSend(trimmedMessage);
      setMessage('');
      setIsTyping(false);
      onTyping?.(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2 rounded-3xl bg-gray-100 p-2 dark:bg-gray-800">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          disabled={disabled}
          rows={1}
          className="flex-1 max-h-32 resize-none bg-transparent px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none disabled:opacity-50 dark:text-white dark:placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim() || !isValidMessageLength(message.trim())}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-all hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
      <div className="mt-2 flex justify-end px-2 text-xs text-gray-400">
        <span className={message.length > 900 ? 'text-red-500' : ''}>
          {message.length > 0 && `${message.length}/1000`}
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
