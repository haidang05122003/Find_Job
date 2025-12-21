"use client";

import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function PendingMemberPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg border bg-white shadow-sm text-center">
                <div className="flex flex-col space-y-1.5 p-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                        <svg
                            className="h-6 w-6 text-yellow-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="font-semibold leading-none tracking-tight text-xl text-brand-900">Chờ phê duyệt</h3>
                    <p className="text-sm text-gray-500">
                        Tài khoản của bạn đang chờ người quản lý công ty phê duyệt.
                    </p>
                </div>
                <div className="p-6 pt-0 space-y-4">
                    <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
                        <p>Xin chào <strong>{user?.fullName}</strong>,</p>
                        <p className="mt-2">
                            Bạn đã yêu cầu tham gia vào công ty. Vui lòng liên hệ với người quản lý (Owner) để được chấp thuận.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/')}
                        >
                            Về trang chủ
                        </Button>
                        <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            onClick={logout}
                        >
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
