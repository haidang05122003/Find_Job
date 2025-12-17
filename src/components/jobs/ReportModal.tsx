'use client';

import React, { useState } from 'react';
import { reportService, ReportReason } from '@/services/report.service';
import { useToast } from '@/context/ToastContext';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: 'job_posting' | 'company' | 'user';
    targetId: string;
    targetName?: string;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
    { value: 'spam', label: 'Tin tuyển dụng spam' },
    { value: 'misleading', label: 'Thông tin sai lệch / gây hiểu nhầm' },
    { value: 'fraud', label: 'Lừa đảo / Thu phí ứng viên' },
    { value: 'inappropriate', label: 'Nội dung không phù hợp' },
    { value: 'harassment', label: 'Quấy rối' },
    { value: 'other', label: 'Lý do khác' },
];

const ReportModal: React.FC<ReportModalProps> = ({
    isOpen,
    onClose,
    targetType,
    targetId,
    targetName,
}) => {
    const { success, error: toastError } = useToast();
    const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedReason) {
            toastError('Vui lòng chọn lý do báo cáo');
            return;
        }

        setIsSubmitting(true);
        try {
            await reportService.createReport({
                type: targetType,
                targetId,
                reason: selectedReason,
                description: description.trim() || undefined,
            });

            success('Báo cáo của bạn đã được gửi thành công. Chúng tôi sẽ xem xét trong thời gian sớm nhất.');
            onClose();
            setSelectedReason('');
            setDescription('');
        } catch (err: any) {
            toastError(err.message || 'Không thể gửi báo cáo. Vui lòng thử lại sau.');
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
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Báo cáo tin tuyển dụng
                            </h3>
                            {targetName && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                    {targetName}
                                </p>
                            )}
                        </div>
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

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Reason Selection */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Lý do báo cáo <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {REPORT_REASONS.map((reason) => (
                                <label
                                    key={reason.value}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedReason === reason.value
                                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={reason.value}
                                        checked={selectedReason === reason.value}
                                        onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                                        className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {reason.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mô tả chi tiết (không bắt buộc)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Cung cấp thêm thông tin chi tiết về vấn đề bạn gặp phải..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedReason}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
