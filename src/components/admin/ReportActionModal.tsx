"use client";

import React, { useState } from "react";
import { Report } from "@/services/report.service";

interface ReportActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report;
    onSubmit: (reportId: string, status: 'RESOLVED' | 'DISMISSED', action: string) => Promise<void>;
}

// Actions based on target type
const getActionsForTargetType = (targetType: string) => {
    const normalizedType = targetType?.toUpperCase() || '';

    if (normalizedType === 'JOB' || normalizedType === 'JOB_POSTING') {
        return [
            { value: 'HIDE_JOB', label: 'Ẩn tin tuyển dụng', description: 'Chuyển trạng thái tin sang đã đóng' },
            { value: 'DELETE_JOB', label: 'Xóa tin tuyển dụng', description: 'Xóa vĩnh viễn tin tuyển dụng này', danger: true },
            { value: 'NONE', label: 'Không thực hiện hành động', description: 'Chỉ đánh dấu đã xử lý' },
        ];
    }

    if (normalizedType === 'COMPANY') {
        return [
            { value: 'LOCK_COMPANY', label: 'Khóa công ty', description: 'Khóa tài khoản công ty này', danger: true },
            { value: 'NONE', label: 'Không thực hiện hành động', description: 'Chỉ đánh dấu đã xử lý' },
        ];
    }

    if (normalizedType === 'USER') {
        return [
            { value: 'LOCK_USER', label: 'Khóa tài khoản', description: 'Khóa tài khoản người dùng này', danger: true },
            { value: 'NONE', label: 'Không thực hiện hành động', description: 'Chỉ đánh dấu đã xử lý' },
        ];
    }

    return [
        { value: 'NONE', label: 'Không thực hiện hành động', description: 'Chỉ đánh dấu đã xử lý' },
    ];
};

const ReportActionModal: React.FC<ReportActionModalProps> = ({
    isOpen,
    onClose,
    report,
    onSubmit,
}) => {
    const [selectedAction, setSelectedAction] = useState('NONE');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const actions = getActionsForTargetType(report.targetType || '');

    const handleSubmit = async (status: 'RESOLVED' | 'DISMISSED') => {
        setIsSubmitting(true);
        try {
            await onSubmit(report.id, status, status === 'DISMISSED' ? 'NONE' : selectedAction);
            onClose();
        } catch (error) {
            console.error('Failed to resolve report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Xử lý báo cáo
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Chọn hành động xử lý cho báo cáo này
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Report Info */}
                <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">Người báo cáo:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{report.reporterName || report.reporterId}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">Đối tượng:</span>
                            <p className="font-medium text-gray-900 dark:text-white truncate">{(report as any).targetName || `#${report.targetId}`}</p>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Lý do:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{report.reason}</p>
                        </div>
                    </div>
                </div>

                {/* Action Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Hành động xử lý
                    </label>
                    <div className="space-y-2">
                        {actions.map((action) => (
                            <label
                                key={action.value}
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedAction === action.value
                                        ? action.danger
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                            : 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="action"
                                    value={action.value}
                                    checked={selectedAction === action.value}
                                    onChange={(e) => setSelectedAction(e.target.value)}
                                    className="mt-1 h-4 w-4 text-brand-500 focus:ring-brand-500"
                                />
                                <div>
                                    <span className={`text-sm font-medium ${action.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                        {action.label}
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {action.description}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => handleSubmit('DISMISSED')}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Bỏ qua báo cáo
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit('RESOLVED')}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận xử lý'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportActionModal;
