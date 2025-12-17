"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
// import RecruitmentStatistics from "@/components/hr/RecruitmentStatistics"; // Will enable if found

export default function HRDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">HR Dashboard</h1>
            <p className="text-gray-600 mb-8">Xin chào, {user?.fullName}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-2">Tin tuyển dụng</h3>
                    <p className="text-3xl font-bold text-brand-500">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-2">Hồ sơ ứng tuyển</h3>
                    <p className="text-3xl font-bold text-brand-500">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-2">Lịch phỏng vấn</h3>
                    <p className="text-3xl font-bold text-brand-500">0</p>
                </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                <p>Dashboard đang được xây dựng. Vui lòng quay lại sau.</p>
            </div>
        </div>
    );
}
