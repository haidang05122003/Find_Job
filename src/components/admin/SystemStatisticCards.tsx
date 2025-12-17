"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { adminService, DashboardStats } from "@/services/admin.service";

const SystemStatisticCards: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await adminService.getDashboardStats();
      if (res.data) setStats(res.data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  const cards = [
    {
      label: "Doanh nghiệp hoạt động",
      value: (stats.totalCompanies - stats.pendingCompanies).toLocaleString(),
      detail: `${stats.pendingCompanies} doanh nghiệp chờ duyệt`,
    },
    {
      label: "Tin tuyển dụng đang hiển thị",
      value: stats.approvedJobs.toLocaleString(),
      detail: `${stats.pendingJobs} tin đang chờ duyệt`,
    },
    {
      label: "Người dùng hệ thống",
      value: stats.totalUsers.toLocaleString(),
      detail: `${stats.activeUsers} tài khoản đang hoạt động`,
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ComponentCard
        title="Thống kê hệ thống"
        desc="Các chỉ số quan trọng về người dùng và tin tuyển dụng."
        className="xl:col-span-2"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
};

export default SystemStatisticCards;


