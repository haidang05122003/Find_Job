'use client';

import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    variant = 'danger',
    isLoading = false,
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100 dark:bg-red-900/30',
                    iconColor: 'text-red-600 dark:text-red-400',
                    buttonBg: 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
                    buttonText: 'text-white',
                };
            case 'warning':
                return {
                    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
                    iconColor: 'text-yellow-600 dark:text-yellow-400',
                    buttonBg: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700',
                    buttonText: 'text-white',
                };
            case 'info':
            default:
                return {
                    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
                    iconColor: 'text-blue-600 dark:text-blue-400',
                    buttonBg: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
                    buttonText: 'text-white',
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
            className="overflow-visible"
        >
            <div className="flex flex-col items-center text-center p-2">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${styles.iconBg}`}>
                    {variant === 'danger' ? (
                        <svg className={`h-8 w-8 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    ) : variant === 'warning' ? (
                        <svg className={`h-8 w-8 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg className={`h-8 w-8 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>

                <div className="flex gap-3 w-full justify-center">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none ${styles.buttonBg} ${styles.buttonText} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
