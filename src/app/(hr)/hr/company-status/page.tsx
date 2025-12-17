"use client";

import { useAuth } from "@/context/AuthContext";
import { hrService } from "@/services/hr.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";

interface CompanyProfile {
    companyName: string;
    status: string;
    description: string;
}

export default function CompanyStatusPage() {
    const { user, logout } = useAuth();
    const [company, setCompany] = useState<CompanyProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await hrService.getMyCompany();
                if (res.data) {
                    setCompany(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch company status", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="w-8 h-8 border-4 rounded-full border-brand-500 animate-spin border-t-transparent"></div>
            </div>
        );
    }

    const status = company?.status || 'UNKNOWN';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-lg p-8 space-y-6 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="flex justify-center">
                    {status === 'PENDING' && (
                        <div className="p-4 bg-yellow-100 rounded-full dark:bg-yellow-900/30">
                            <svg className="w-12 h-12 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}
                    {status === 'REJECTED' && (
                        <div className="p-4 bg-red-100 rounded-full dark:bg-red-900/30">
                            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                    {status === 'APPROVED' && (
                        <div className="p-4 bg-green-100 rounded-full dark:bg-green-900/30">
                            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    {status === 'UNKNOWN' && (
                        <div className="p-4 bg-gray-100 rounded-full dark:bg-gray-700">
                            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {status === 'PENDING' && "Hồ sơ đang chờ duyệt"}
                        {status === 'REJECTED' && "Hồ sơ bị từ chối"}
                        {status === 'APPROVED' && "Hồ sơ đã được duyệt"}
                        {status === 'UNKNOWN' && "Chưa có thông tin công ty"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {status === 'PENDING' && "Cảm ơn bạn đã đăng ký. Hồ sơ công ty của bạn đang được Admin xem xét. Vui lòng quay lại sau hoặc nhận thông báo qua email."}
                        {status === 'REJECTED' && "Rất tiếc, hồ sơ công ty của bạn chưa đạt yêu cầu. Vui lòng liên hệ Admin để biết thêm chi tiết."}
                        {status === 'APPROVED' && "Chúc mừng! Hồ sơ của bạn đã được duyệt. Bạn có thể truy cập dashboard ngay bây giờ."}
                        {status === 'UNKNOWN' && "Tài khoản của bạn chưa liên kết với công ty nào. Vui lòng cập nhật thông tin."}
                    </p>
                </div>

                {/* Company Info Preview */}
                {company && (
                    <div className="p-4 text-left border rounded-lg bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Công ty: <span className="font-normal">{company.companyName}</span></p>
                    </div>
                )}

                <div className="flex flex-col gap-3 pt-4">
                    {status === 'APPROVED' ? (
                        <Link href="/hr/dashboard" className="w-full">
                            <Button className="w-full">Truy cập Dashboard</Button>
                        </Link>
                    ) : (
                        <Button onClick={logout} variant="outline" className="w-full">
                            Đăng xuất
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
