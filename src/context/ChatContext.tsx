'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatContextValue {
  messages: Message[];
  isOpen: boolean;
  unreadCount: number;
  sessionId: string;
  sendMessage: (text: string) => void;
  toggleChat: () => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

// Bot response logic extracted for better performance
const getBotResponse = (userText: string): string => {
  const lowerText = userText.toLowerCase();

  if (lowerText.includes('xin chào') || lowerText.includes('hello') || lowerText.includes('hi')) {
    return 'Xin chào! Tôi có thể giúp bạn tìm việc làm phù hợp. Bạn đang tìm kiếm công việc gì?';
  }

  if (lowerText.includes('tìm việc') || lowerText.includes('job')) {
    return 'Tuyệt vời! Bạn có thể sử dụng thanh tìm kiếm ở trang chủ hoặc trang Jobs để tìm công việc phù hợp. Bạn quan tâm đến lĩnh vực nào?';
  }

  if (lowerText.includes('lương') || lowerText.includes('salary')) {
    return 'Mức lương phụ thuộc vào vị trí và kinh nghiệm. Bạn có thể lọc theo mức lương mong muốn trong trang tìm việc.';
  }

  if (lowerText.includes('ứng tuyển') || lowerText.includes('apply')) {
    return 'Để ứng tuyển, bạn chỉ cần click vào nút "Ứng tuyển" trên trang chi tiết công việc. Chúc bạn may mắn!';
  }

  return 'Cảm ơn bạn đã liên hệ! Tôi đang học hỏi để phục vụ bạn tốt hơn. Bạn có thể xem thêm các công việc trên trang Jobs của chúng tôi.';
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const { info } = useToast();

  // Initialize session ID and load chat history
  useEffect(() => {
    let storedSessionId = localStorage.getItem('chatSessionId');

    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatSessionId', storedSessionId);
    }

    setSessionId(storedSessionId);

    // Load chat history
    const storedMessages = localStorage.getItem(`chatHistory_${storedSessionId}`);
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages) as Array<Omit<Message, 'timestamp'> & { timestamp: string }>;
        setMessages(parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch {
        // If parsing fails, start with welcome message
        setMessages([{
          id: '1',
          text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
          sender: 'bot',
          timestamp: new Date(),
        }]);
      }
    } else {
      setMessages([{
        id: '1',
        text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  }, []);

  // Save messages to localStorage (debounced)
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`chatHistory_${sessionId}`, JSON.stringify(messages));
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, sessionId]);

  const sendMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: `msg_${Date.now()}_bot`,
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);

      // If chat is closed, increment unread count and show toast
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
        info('Bạn có tin nhắn mới từ hỗ trợ viên');
      }
    }, 1000);
  }, [isOpen, info]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setUnreadCount(0); // Reset when opening
      return !prev;
    });
  }, []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({
    messages,
    isOpen,
    unreadCount,
    sessionId,
    sendMessage,
    toggleChat,
    closeChat,
  }), [messages, isOpen, unreadCount, sessionId, sendMessage, toggleChat, closeChat]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
