'use client';

import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '@/services/chat.service';
import { useToast } from '@/context/ToastContext';

// Helper function for message validation
const isValidMessageLength = (message: string): boolean => {
  return message.length >= 1 && message.length <= 1000;
};

interface ChatInputProps {
  onSend: (message: string, attachment?: { url: string; type: 'IMAGE' | 'FILE'; fileName: string }) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
}

interface AttachmentPreview {
  file: File;
  url: string; // Object URL for preview
  type: 'IMAGE' | 'FILE';
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onTyping, disabled = false }) => {
  const { error: showError } = useToast();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<AttachmentPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value to allow selecting same file again
    e.target.value = '';

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showError('File quá lớn (Max 10MB)');
      return;
    }

    const type = file.type.startsWith('image/') ? 'IMAGE' : 'FILE';
    const previewUrl = URL.createObjectURL(file);

    setAttachment({
      file,
      url: previewUrl,
      type
    });
  };

  const removeAttachment = () => {
    if (attachment) {
      URL.revokeObjectURL(attachment.url);
      setAttachment(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if ((trimmedMessage || attachment) && !isUploading) {
      // If there is an attachment, upload it first
      let uploadedAttachmentData = undefined;

      if (attachment) {
        setIsUploading(true);
        try {
          const res = await chatService.uploadChatAttachment(attachment.file);
          if (res.success && res.data) {
            uploadedAttachmentData = {
              url: res.data,
              type: attachment.type,
              fileName: attachment.file.name
            };
          } else {
            showError('Lỗi tải file lên');
            setIsUploading(false);
            return; // Stop sending
          }
        } catch (err) {
          console.error(err);
          showError('Lỗi tải file lên');
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      onSend(trimmedMessage, uploadedAttachmentData);

      setMessage('');
      removeAttachment();

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
      {attachment && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-fit">
          {attachment.type === 'IMAGE' ? (
            <img src={attachment.url} alt="Preview" className="h-12 w-12 object-cover rounded" />
          ) : (
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate max-w-[150px]">{attachment.file.name}</span>
            <span className="text-xs text-gray-500">{(attachment.file.size / 1024).toFixed(1)} KB</span>
          </div>
          <button onClick={removeAttachment} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full ml-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative flex items-center gap-2 rounded-3xl bg-gray-100 p-2 dark:bg-gray-800">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-brand-600 transition-colors"
          title="Đính kèm file/ảnh"
          disabled={disabled || isUploading}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          disabled={disabled || isUploading}
          rows={1}
          className="flex-1 max-h-32 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none disabled:opacity-50 dark:text-white dark:placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={disabled || (!message.trim() && !attachment) || isUploading}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-all hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isUploading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
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
