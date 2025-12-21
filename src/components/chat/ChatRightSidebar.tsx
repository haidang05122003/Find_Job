'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { applicationService, Application } from '@/services/application.service';
import { chatService } from '@/services/chat.service';
import { useToast } from '@/context/ToastContext';

export default function ChatRightSidebar() {
    const { user } = useAuth();
    const { error: showError } = useToast();
    const router = useRouter();
    const [items, setItems] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (user?.activeRole === 'HR') {
                    const res = await applicationService.getAllApplications({ page: 0, size: 20 });
                    if (res.success && res.data) {
                        setItems(res.data.content);
                    }
                } else if (user?.activeRole === 'CANDIDATE') {
                    const res = await applicationService.getHistory({ page: 0, size: 20 });
                    if (res.success && res.data) {
                        setItems(res.data.content);
                    }
                } else {
                    setItems([]);
                }
            } catch (error: any) {
                console.error('Error fetching sidebar data:', error?.response?.data || error.message || error);
                setItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleStartChat = async (participantId: string) => {
        if (!participantId) return;
        try {
            const res = await chatService.createRoom({ participantId });
            if (res.success && res.data) {
                if (user?.activeRole === 'HR') {
                    router.push(`/hr/chat/${res.data.id}`);
                } else {
                    router.push(`/messages/${res.data.id}`);
                }
            } else {
                showError('Không thể tạo cuộc trò chuyện');
            }
        } catch (error) {
            console.error('Start chat error:', error);
            showError('Có lỗi xảy ra khi bắt đầu chat');
        }
    };

    const toggleJob = (jobTitle: string) => {
        setExpandedJobs(prev => ({
            ...prev,
            [jobTitle]: !prev[jobTitle]
        }));
    };

    if (!user) return null;

    return (
        <div className="hidden xl:flex w-80 flex-col border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 h-full">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white uppercase text-xs tracking-wider">
                    {user.activeRole === 'HR' ? 'Ứng viên gần đây' : 'Tin tuyển dụng đã ứng tuyển'}
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="text-center text-gray-400 text-sm">Đang tải...</div>
                ) : items.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm">Chưa có dữ liệu</div>
                ) : user.activeRole === 'HR' ? (
                    // HR View: Grouped by Job Title (Accordion)
                    Object.entries(
                        items.reduce((acc, item) => {
                            const jobTitle = item.jobTitle || 'Công việc khác';
                            if (!acc[jobTitle]) acc[jobTitle] = [];
                            acc[jobTitle].push(item);
                            return acc;
                        }, {} as Record<string, typeof items>)
                    ).map(([jobTitle, groupItems]) => (
                        <div key={jobTitle} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-2">
                            <button
                                onClick={() => toggleJob(jobTitle)}
                                className="flex items-center w-full py-3 group/header hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 transition-colors"
                            >
                                <span className={`mr-2 transition-transform duration-200 ${expandedJobs[jobTitle] ? 'rotate-90' : ''}`}>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                                <div className="flex-1 text-left">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 group-hover/header:text-brand-600 transition-colors line-clamp-1">
                                        {jobTitle}
                                    </h4>
                                </div>
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                                    {groupItems.length}
                                </span>
                            </button>

                            <div className={`space-y-1 pl-2 transition-all duration-300 ease-in-out overflow-hidden ${expandedJobs[jobTitle] ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                {groupItems.map((item) => (
                                    <div key={item.id} className="group flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50">
                                        <div className="relative shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm">
                                                {item.candidateName?.charAt(0) || 'U'}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-[15px] text-gray-900 dark:text-gray-100 truncate" title={item.candidateName}>
                                                {item.candidateName}
                                            </h4>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                                {new Date(item.appliedAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/candidates/${item.candidateId}`}
                                                target="_blank"
                                                className="p-1 text-gray-400 hover:text-brand-600 hover:bg-white rounded shadow-sm transition-all"
                                                title="Xem hồ sơ"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleStartChat(item.candidateId)}
                                                className="p-1 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded shadow-sm transition-all"
                                                title="Nhắn tin"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    // Candidate View: Show Job Title and Company
                    items.map((item) => (
                        <div key={item.id} className="group rounded-lg border border-gray-100 p-3 hover:border-brand-200 hover:shadow-sm dark:border-gray-800 dark:hover:border-brand-900 bg-white dark:bg-gray-900 transition-all">
                            <div className="mb-2">
                                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2">{item.jobTitle}</h4>
                                <p className="text-xs text-gray-500 mt-1">{item.companyName}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        item.status === 'offered' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {item.status}
                                </span>
                                <button
                                    onClick={() => item.recruiterId ? handleStartChat(item.recruiterId) : showError('Không tìm thấy thông tin nhà tuyển dụng')}
                                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-medium transition-colors"
                                >
                                    Liên hệ
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
