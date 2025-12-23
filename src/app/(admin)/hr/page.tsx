'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hrService, HRDashboardStats } from '@/services/hr.service';
import CompanyGuard from '@/components/auth/CompanyGuard';
import ComponentCard from "@/components/common/ComponentCard";
import RecruitmentStatistics from "@/components/hr/RecruitmentStatistics";
import { useAuth } from "@/context/AuthContext";

export default function HRDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<HRDashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await hrService.getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
      </div>
    );
  }

  const statCards = [
    {
      label: "Tin tuyển dụng",
      value: stats?.totalJobs || 0,
      subtext: `${stats?.activeJobs || 0} đang hoạt động`,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      bgIcon: "bg-blue-50"
    },
    {
      label: "Ứng viên",
      value: stats?.totalApplications || 0,
      subtext: `${stats?.pendingApplications || 0} chờ xử lý`,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      bgIcon: "bg-green-50"
    },
    {
      label: "Phỏng vấn",
      value: stats?.interviewScheduled || 0,
      subtext: `${stats?.interviewScheduled || 0} lịch phỏng vấn`,
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      bgIcon: "bg-purple-50"
    }
  ];

  const actions = [
    {
      title: "Đăng tin tuyển dụng",
      desc: "Tạo tin tuyển dụng mới để tìm kiếm ứng viên",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      bg: "bg-blue-50",
      link: "/hr/job-postings/create"
    },
    {
      title: "Xem ứng viên",
      desc: "Quản lý và đánh giá hồ sơ ứng viên",
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: "bg-green-50",
      link: "/hr/candidates"
    },
    {
      title: "Lịch phỏng vấn",
      desc: "Quản lý lịch phỏng vấn và gửi thư mời",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bg: "bg-purple-50",
      link: "/hr/interview-invitations"
    }
  ];

  return (
    <CompanyGuard>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Tổng quan và quản trị</h1>
          <p className="text-gray-600">Tổng quan và thống kê tuyển dụng</p>
        </div>

        {/* 1. Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 flex items-start justify-between hover:shadow-sm transition-shadow">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgIcon}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* 2. Detailed Recruitment Analytics (Funnel & Metrics) */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Hiệu quả tuyển dụng</h2>
          <RecruitmentStatistics data={stats} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((action, idx) => (
            <Link key={idx} href={action.link} className="block group">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 h-full transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700">
                <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">{action.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Jobs */}
        <ComponentCard
          title="Tin tuyển dụng gần đây"
          action={
            <Link href="/hr/job-postings" className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
              Xem tất cả <span>→</span>
            </Link>
          }
        >
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {stats?.recentJobs?.length === 0 ? (
              <div className="py-8 text-center text-gray-500">Chưa có tin tuyển dụng nào</div>
            ) : (
              stats?.recentJobs?.map((job: any) => (
                <div key={job.id} className="py-4 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-white/5 -mx-4 px-4 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{job.applicantsCount || 0} ứng viên</span>
                      <span>•</span>
                      <span>{job.createdAt || 'N/A'}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${job.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    job.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                    {job.status === 'APPROVED' ? 'Đang tuyển' :
                      job.status === 'PENDING' ? 'Chờ duyệt' : job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </ComponentCard>
      </div>
    </CompanyGuard>
  );
}
