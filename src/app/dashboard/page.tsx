"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageTransition from "@/components/shared/PageTransition";
import StatsCard from "@/components/dashboard/StatsCard";
import ProfileCompletionBanner from "@/components/dashboard/ProfileCompletionBanner";
import RecentJobCard from "@/components/dashboard/RecentJobCard";
import { BriefcaseIcon, BookmarkIcon, BellIcon } from "@/components/shared/icons";
import { containerVariants, fadeInVariants } from "@/lib/animations";

import { useAuth } from "@/context/AuthContext";

import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>;
  }

  return (
    <PageTransition>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-4"
        >
          Xin chào, {user?.fullName || "Ứng viên"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          Đây là hoạt động hàng ngày và thông báo việc làm của bạn
        </motion.p>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          <StatsCard
            title="Việc đã ứng tuyển"
            value={stats?.totalAppliedJobs || 0}
            icon={<BriefcaseIcon className="w-8 h-8" />}
            color="brand"
            index={0}
          />
          <StatsCard
            title="Việc yêu thích"
            value={stats?.totalFavoriteJobs || 0}
            icon={<BookmarkIcon className="w-8 h-8" />}
            color="brand"
            index={1}
          />

        </motion.div>

        {/* Profile Completion CTA */}
        <div className="mb-6">
          <ProfileCompletionBanner />
        </div>

        {/* Recently Applied */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">
              Đã ứng tuyển gần đây
            </h2>
            <Link
              href="/dashboard/applied"
              className="text-brand-500 hover:text-brand-600 text-sm font-medium transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-theme-md transition-shadow duration-300"
          >
            <div className="overflow-x-auto">
              {stats?.recentApplications && stats.recentApplications.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Công việc
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ngày ứng tuyển
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <motion.tbody
                    className="divide-y divide-gray-50 dark:divide-gray-800"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {stats.recentApplications.map((app) => (
                      <RecentJobCard key={app.id} job={{
                        id: app.id.toString(),
                        title: app.jobTitle,
                        company: app.companyName,
                        logo: app.companyLogo,
                        location: app.location,
                        salary: app.salary,
                        dateApplied: app.appliedAt,
                        status: app.status.toLowerCase() as any
                      }} />
                    ))}
                  </motion.tbody>
                </table>
              ) : (
                <div className="text-center py-6 text-gray-500">Chưa có ứng tuyển nào gần đây</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}


