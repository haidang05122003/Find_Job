"use client";

import { useState, useEffect } from "react";
import { hrService } from "@/services/hr.service";
import Badge from "@/components/ui/badge/Badge";
import { useToast } from "@/context/ToastContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { UserCircleIcon } from "@/icons";

interface Member {
    id: number;
    fullName: string;
    email: string;
    username: string;
    role: string;
    status: "ACTIVE" | "PENDING" | "INACTIVE";
    avatarUrl?: string;
    phone?: string;
}

export default function MemberManagementPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { success: toastSuccess, error: toastError } = useToast();

    const fetchMembers = async () => {
        try {
            const response = await hrService.getMembers();
            if (response.success && response.data) {
                setMembers(response.data);
            }
        } catch (error: any) {
            console.error("Failed to fetch members details:", {
                message: error?.message,
                status: error?.response?.status,
                data: error?.response?.data
            });
            if (error?.response?.status === 404) {
                toastError("Không tìm thấy đường dẫn (Backend chưa cập nhật?)");
            } else {
                toastError("Không thể tải danh sách thành viên");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            const res = await hrService.approveMember(id);
            if (res.success) {
                toastSuccess("Đã phê duyệt thành viên");
                // Optimistic Update: Set status to ACTIVE
                setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "ACTIVE" } : m));
            } else {
                toastError(res.message || "Lỗi khi duyệt");
            }
        } catch (e) {
            toastError("Lỗi hệ thống");
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm("Bạn có chắc muốn từ chối/xóa thành viên này chưa kích hoạt không?")) return;
        try {
            const res = await hrService.rejectMember(id);
            if (res.success) {
                toastSuccess("Đã từ chối thành viên");
                // Optimistic Update: Remove from list
                setMembers(prev => prev.filter(m => m.id !== id));
            } else {
                toastError(res.message || "Lỗi khi từ chối");
            }
        } catch (e) {
            toastError("Lỗi hệ thống");
        }
    };

    const handleRemove = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa thành viên này khỏi công ty không?")) return;
        try {
            const res = await hrService.removeMember(id);
            if (res.success) {
                toastSuccess("Đã xóa thành viên");
                // Optimistic Update: Remove from list
                setMembers(prev => prev.filter(m => m.id !== id));
            } else {
                toastError(res.message || "Lỗi khi xóa");
            }
        } catch (e) {
            toastError("Lỗi hệ thống");
        }
    };

    const [activeTab, setActiveTab] = useState("ALL");

    const filteredMembers = members.filter(member => {
        if (activeTab === "ALL") return true;
        if (activeTab === "PENDING") return member.status === "PENDING";
        if (activeTab === "ACTIVE") return member.status === "ACTIVE";
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <PageBreadcrumb pageTitle="Thành viên" />
                <button
                    onClick={fetchMembers}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Làm mới
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Thành viên</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Danh sách thành viên, trạng thái và quản lý quyền truy cập công ty.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {[
                            { id: 'ALL', label: 'Tất cả' },
                            { id: 'PENDING', label: 'Chờ duyệt' },
                            { id: 'ACTIVE', label: 'Đã duyệt' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Thành viên
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-500"></div>
                                            <span>Đang tải dữ liệu...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <UserCircleIcon className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-base font-medium text-gray-900 dark:text-white">Chưa có thành viên nào</p>
                                            <p className="text-sm text-gray-400">Không tìm thấy thành viên phù hợp với bộ lọc.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {member.avatarUrl ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                            src={member.avatarUrl.startsWith("http") ? member.avatarUrl : `http://localhost:8080${member.avatarUrl}`}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-600">
                                                            <UserCircleIcon className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {member.fullName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                {member.role}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {member.username}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                variant="light"
                                                color={
                                                    member.status === 'ACTIVE' ? 'success' :
                                                        member.status === 'PENDING' ? 'warning' : 'error'
                                                }
                                            >
                                                {member.status === 'ACTIVE' ? 'Đã duyệt' :
                                                    member.status === 'PENDING' ? 'Chờ duyệt' : 'Ngưng hoạt động'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {member.status === "PENDING" ? (
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleApprove(member.id)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-md border border-green-200 hover:bg-green-100 transition-colors"
                                                    >
                                                        Duyệt hồ sơ
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(member.id)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-md border border-red-200 hover:bg-red-100 transition-colors"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleRemove(member.id)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 hover:text-red-600 hover:border-red-200 transition-all"
                                                >
                                                    Xóa thành viên
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
