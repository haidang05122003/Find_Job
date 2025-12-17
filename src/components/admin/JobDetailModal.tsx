"use client";

import React from "react";
import type { Job } from "@/types/job";

interface JobDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    showActions?: boolean;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
    isOpen,
    onClose,
    job,
    onApprove,
    onReject,
    showActions = true,
}) => {
    if (!isOpen || !job) return null;

    const formatSalary = (min?: number, max?: number) => {
        if (!min && !max) return "Thỏa thuận";
        if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`;
        if (min) return `Từ ${min.toLocaleString()} VNĐ`;
        return `Đến ${max?.toLocaleString()} VNĐ`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex gap-4">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl dark:bg-gray-800 overflow-hidden">
                            {job.company?.logo && job.company.logo.length > 5 ? (
                                <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-contain" />
                            ) : (
                                <span>🏢</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {job.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {job.company?.name || job.companyName}
                            </p>
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

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium">Mức lương</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {formatSalary(job.salary?.min, job.salary?.max)}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <span className="text-xs font-medium">Địa điểm</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                {job.location || "Chưa xác định"}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs font-medium">Loại công việc</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {job.jobType || "Toàn thời gian"}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <span className="text-xs font-medium">Kinh nghiệm</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {job.experience || "Không yêu cầu"}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Mô tả công việc
                        </h4>
                        {job.description ? (
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400"
                                dangerouslySetInnerHTML={{ __html: job.description }}
                            />
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500 italic">Chưa có thông tin</p>
                        )}
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Yêu cầu
                            </h4>
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400"
                                dangerouslySetInnerHTML={{ __html: Array.isArray(job.requirements) ? job.requirements.join('<br/>') : job.requirements }}
                            />
                        </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                                Quyền lợi
                            </h4>
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-400"
                                dangerouslySetInnerHTML={{ __html: Array.isArray(job.benefits) ? job.benefits.join('<br/>') : job.benefits }}
                            />
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <span>Hạn nộp: {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString("vi-VN") : "Không giới hạn"}</span>
                        <span>·</span>
                        <span>Đăng ngày: {job.postedAt ? new Date(job.postedAt).toLocaleDateString("vi-VN") : "N/A"}</span>
                        {job.category && (
                            <>
                                <span>·</span>
                                <span>Danh mục: {job.category}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                {showActions && (
                    <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Đóng
                        </button>
                        {onReject && (
                            <button
                                onClick={() => onReject(job.id)}
                                className="flex-1 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Từ chối
                            </button>
                        )}
                        {onApprove && (
                            <button
                                onClick={() => onApprove(job.id)}
                                className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
                            >
                                Phê duyệt
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetailModal;
