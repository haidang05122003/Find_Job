"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { adminService, DashboardStats } from "@/services/admin.service";

const AdminQuickStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        if (res.data) setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const defaultStats: DashboardStats = {
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
    activeUsers: 0,
    pendingCompanies: 0,
    pendingJobs: 0,
    approvedJobs: 0,
    pendingReports: 0
  };

  const displayStats = stats || defaultStats;

  const overviewStats = [
    {
      label: "Người dùng",
      value: displayStats.totalUsers.toLocaleString('vi-VN'),
      detail: `${displayStats.activeUsers.toLocaleString('vi-VN')} đang hoạt động`,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10"
    },
    {
      label: "Công ty",
      value: displayStats.totalCompanies.toLocaleString('vi-VN'),
      detail: `${displayStats.pendingCompanies.toLocaleString('vi-VN')} chờ duyệt`,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-500/10"
    },
    {
      label: "Tin tuyển dụng",
      value: displayStats.totalJobs.toLocaleString('vi-VN'),
      detail: `${displayStats.pendingJobs.toLocaleString('vi-VN')} chờ duyệt`,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
      label: "Báo cáo nội dung",
      value: displayStats.pendingReports.toLocaleString('vi-VN'),
      detail: "Cần xử lý ngay",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10"
    },
  ];

  const approvalRate = displayStats.totalJobs > 0
    ? Math.round((displayStats.approvedJobs / displayStats.totalJobs) * 100)
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <ComponentCard title="Tổng quan hệ thống" desc="Đang tải dữ liệu...">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Tổng quan hệ thống"
        desc="Các chỉ số quan trọng về người dùng, doanh nghiệp và tin tuyển dụng."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewStats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border border-gray-100 p-4 transition hover:shadow-sm dark:border-gray-800 ${stat.bg}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ComponentCard title="Hiệu suất xử lý" desc="Tỉ lệ duyệt tin tuyển dụng.">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 flex-shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-brand-500"
                  strokeDasharray={`${approvalRate}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400">
                {approvalRate}%
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Tỉ lệ duyệt tin</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {displayStats.approvedJobs.toLocaleString()} tin đã duyệt trên tổng số {displayStats.totalJobs.toLocaleString()} tin.
              </p>
            </div>
          </div>
        </ComponentCard>

        {/* Placeholder for future chart or other stats */}
        <ComponentCard title="Hoạt động gần đây" desc="Tóm tắt trạng thái xử lý yêu cầu.">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tin chờ duyệt</span>
              <span className="font-semibold">{displayStats.pendingJobs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Công ty chờ duyệt</span>
              <span className="font-semibold">{displayStats.pendingCompanies}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Báo cáo chưa xử lý</span>
              <span className="font-semibold">{displayStats.pendingReports}</span>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default AdminQuickStats;



