'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hrService, HRDashboardStats } from '@/services/hr.service';

interface RecentJob {
  id: number;
  title: string;
  applicantsCount: number;
  status: string;
  createdAt: string;
}

interface DashboardData {
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalApplications: number;
  pendingApplications: number;
  interviewScheduled: number;
  hiredCount: number;
  recentJobs: RecentJob[];
}

import CompanyGuard from '@/components/auth/CompanyGuard';

export default function HRDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await hrService.getDashboardStats();
        if (response.success && response.data) {
          setData(response.data as unknown as DashboardData);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      label: 'Tin tuyển dụng',
      value: data?.totalJobs ?? '-',
      subtext: `${data?.activeJobs ?? 0} đang hoạt động`,
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      label: 'Ứng viên',
      value: data?.totalApplications ?? '-',
      subtext: `${data?.pendingApplications ?? 0} chờ xử lý`,
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'green'
    },
    {
      label: 'Phỏng vấn',
      value: data?.interviewScheduled ?? '-',
      subtext: 'lịch phỏng vấn',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple'
    },
    {
      label: 'Đã tuyển',
      value: data?.hiredCount ?? '-',
      subtext: 'ứng viên thành công',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'emerald'
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  };

  const statusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'Đang tuyển';
      case 'PENDING': return 'Chờ duyệt';
      case 'CLOSED': return 'Đã đóng';
      case 'REJECTED': return 'Bị từ chối';
      default: return status;
    }
  };

  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'CLOSED': return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400';
      case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <CompanyGuard>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard HR
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Quản lý tuyển dụng và ứng viên
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    {stat.subtext}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${colorClasses[stat.color]}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Link
            href="/hr/job-postings/create"
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-brand-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 inline-flex rounded-lg bg-brand-100 p-3 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Đăng tin tuyển dụng
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tạo tin tuyển dụng mới để tìm kiếm ứng viên
            </p>
          </Link>

          <Link
            href="/hr/candidates"
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-brand-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-500/20 dark:text-green-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Xem ứng viên
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Quản lý và đánh giá hồ sơ ứng viên
            </p>
          </Link>

          <Link
            href="/hr/interview-invitations"
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-brand-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lịch phỏng vấn
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Quản lý lịch phỏng vấn và gửi thư mời
            </p>
          </Link>
        </div>

        {/* Recent Jobs */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tin tuyển dụng gần đây
            </h2>
            <Link
              href="/hr/job-postings"
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Xem tất cả →
            </Link>
          </div>

          {data?.recentJobs && data.recentJobs.length > 0 ? (
            <div className="space-y-4">
              {data.recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {job.applicantsCount} ứng viên • {job.createdAt}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(job.status)}`}
                  >
                    {statusLabel(job.status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Chưa có tin tuyển dụng nào</p>
              <Link href="/hr/job-postings/create" className="mt-4 inline-block text-brand-500 hover:text-brand-600">
                Tạo tin đầu tiên →
              </Link>
            </div>
          )}
        </div>
      </div>
    </CompanyGuard>
  );
}
