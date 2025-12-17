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
                    // Admin or other roles: no sidebar data needed or different logic
                    setItems([]);
                }
            } catch (error: any) {
                console.error('Error fetching sidebar data:', error?.response?.data || error.message || error);

                // Optional: set empty items on error to avoid loading spinner forever if logical error
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
            // Try to create room (or get existing)
            const res = await chatService.createRoom({ participantId });
            if (res.success && res.data) {
                router.push(`/messages/${res.data.id}`);
            } else {
                showError('Không thể tạo cuộc trò chuyện');
            }
        } catch (error) {
            console.error('Start chat error:', error);
            showError('Có lỗi xảy ra khi bắt đầu chat');
        }
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
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="group rounded-lg border border-gray-100 p-3 hover:border-brand-200 hover:shadow-sm dark:border-gray-800 dark:hover:border-brand-900 bg-white dark:bg-gray-900 transition-all">
                            {user.activeRole === 'HR' ? (
                                // HR View: Show Candidate Name and Job Title
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                                            {item.candidateName?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{item.candidateName}</h4>
                                            <p className="text-xs text-gray-500 truncate">Vị trí: {item.jobTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <Link href={`/candidates/${item.candidateId}`} target="_blank" className="text-xs text-gray-500 hover:text-brand-600 underline">
                                            Hồ sơ
                                        </Link>
                                        <button
                                            onClick={() => handleStartChat(item.candidateId)}
                                            className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded hover:bg-brand-100 font-medium transition-colors"
                                        >
                                            Nhắn tin
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Candidate View: Show Job Title and Company
                                <>
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
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
