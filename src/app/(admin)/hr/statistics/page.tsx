import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RecruitmentStatistics from "@/components/hr/RecruitmentStatistics";

export const metadata: Metadata = {
    title: "Thống kê tuyển dụng | Khối HR",
    description: "Phân tích KPI tuyển dụng và hiệu quả các nguồn ứng viên.",
};

export default function HRStatisticsPage() {
    return (
        <>
            <PageBreadcrumb pageTitle="Thống kê tuyển dụng" />
            <RecruitmentStatistics />
        </>
    );
}
