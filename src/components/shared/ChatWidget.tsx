'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useChat } from '@/context/ChatContext';
import Button from './Button';

const ChatWidget: React.FC = () => {
  const { messages, isOpen, unreadCount, sendMessage, toggleChat, closeChat } = useChat();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const suggestedQuestions = [
    'Tìm việc IT',
    'Mức lương trung bình',
    'Cách ứng tuyển',
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-999 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-theme-xl transition hover:bg-brand-600 hover:scale-110 active:scale-95"
        aria-label="Open chat"
      >
        {/* Unread Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-999 flex h-[500px] w-[380px] flex-col rounded-2xl border border-gray-200 bg-white shadow-theme-xl animate-scale-in dark:border-gray-800 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 overflow-hidden">
                <Image
                  src="/images/logo/logo-icon.png"
                  alt="JobViet"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Hỗ trợ tìm việc
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Trực tuyến
                </p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                    }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`mt-1 text-xs ${message.sender === 'user' ? 'text-brand-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Câu hỏi gợi ý:
                </p>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
              <Button
                type="submit"
                size="md"
                disabled={!inputText.trim()}
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                }
              >
                Gửi
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
