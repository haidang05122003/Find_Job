"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added
import PageTransition from "@/components/shared/PageTransition";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/shared/Pagination";
import { fadeInVariants } from "@/lib/animations";
import { applicationService, Application } from "@/services/application.service";
import { chatService } from "@/services/chat.service"; // Added
import { PAGINATION } from "@/lib/constants";
import { useToast } from "@/context/ToastContext"; // Added

// ... keep helper functions like statusIcon if needed, but we might not use them all ...
const statusLabel = (status: string) => {
  const s = status?.toUpperCase();
  switch (s) {
    case "PENDING": return "Chờ xem xét";
    case "APPROVED": return "Đã duyệt hồ sơ";
    case "INTERVIEW": return "Đang phỏng vấn";
    case "OFFERED": return "Đề nghị tuyển dụng";
    case "HIRED": return "Đã trúng tuyển";
    case "REJECTED": return "Bị từ chối";
    case "WITHDRAWN": return "Đã rút hồ sơ";
    default: return status;
  }
};

export default function DashboardAppliedJobsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<{
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  }>({
    page: 0,
    size: PAGINATION.DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
  });

  const { error: toastError } = useToast(); // Added
  const router = useRouter(); // Added

  const fetchApplications = useCallback(async (pageIndex = 0) => {
    setLoading(true);
    try {
      const response = await applicationService.getHistory({
        page: pageIndex, // corrected to page (backend likely uses 'page')
        size: PAGINATION.DEFAULT_PAGE_SIZE,
        sort: 'createdAt,desc' // Sort by newest
      });
      if (response.success && response.data) {
        setApplications(response.data.content);
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        });
      }
    } catch (err) {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handlePageChange = (page: number) => {
    fetchApplications(page - 1);
  };

  const handleStartChat = async (application: Application) => {
    if (!application.recruiterId) {
      toastError('Không thể liên hệ với nhà tuyển dụng này (Chưa thiết lập tin nhắn)');
      return;
    }

    try {
      const res = await chatService.createRoom({ participantId: application.recruiterId });
      if (res.success && res.data) {
        router.push(`/messages/${res.data.id}`);
      } else {
        toastError('Không thể tạo cuộc trò chuyện');
      }
    } catch (error) {
      toastError('Lỗi kết nối');
    }
  };


  return (
    <PageTransition>
      <div className="space-y-6">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900 dark:text-white/90 mb-6">
          TIN TUYỂN DỤNG ĐÃ ỨNG TUYỂN
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-800 p-12 text-center"
          >
            {/* ... preserve empty state ... */}
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Chưa có đơn ứng tuyển</h3>
            <Link href="/jobs">
              <Button className="mt-4">
                Tìm việc ngay
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid gap-4">
              {applications.map((app, index) => {
                const isHired = ['HIRED', 'APPROVED', 'OFFERED'].includes(app.status);
                const isInterview = ['INTERVIEW'].includes(app.status);
                const isRejected = ['REJECTED', 'WITHDRAWN'].includes(app.status);

                let statusColor = "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
                if (isHired) statusColor = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
                if (isInterview) statusColor = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
                if (isRejected) statusColor = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800";

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-brand-500/20 dark:hover:border-brand-500/20 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Logo */}
                      <div className="shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-gray-100 dark:border-gray-800 bg-white p-2 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          {app.companyLogo ? (
                            <img
                              src={app.companyLogo.startsWith('http') ? app.companyLogo : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${app.companyLogo.replace(/^\//, '')}`}
                              alt={app.companyName}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerText = '🏢';
                              }}
                            />
                          ) : (
                            <span className="text-3xl">🏢</span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-4" title={app.jobTitle}>
                              {app.jobTitle}
                            </h3>
                            <p className="text-base font-medium text-gray-600 dark:text-gray-400 mt-1">
                              {app.companyName}
                            </p>
                          </div>

                          {/* Status Badge - Desktop Position */}
                          <div className="hidden md:block">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                              {statusLabel(app.status)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                          {/* Status Badge - Mobile Position */}
                          <span className={`md:hidden inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                            {statusLabel(app.status)}
                          </span>

                          <span className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full text-xs">
                            {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("vi-VN") : "N/A"}
                          </span>

                          {app.desiredLocation && (
                            <span className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full text-xs">
                              {app.desiredLocation}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center sm:flex-col sm:justify-center border-t border-gray-100 dark:border-gray-800 sm:border-t-0 sm:border-l sm:pl-5 mt-2 sm:mt-0 pt-3 sm:pt-0">
                        <Button
                          onClick={() => handleStartChat(app)}
                          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white shadow-sm rounded-xl px-5 py-2.5 font-semibold text-sm whitespace-nowrap transition-all flex items-center justify-center"
                        >
                          Nhắn tin
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center pt-6">
                <Pagination
                  currentPage={pagination.page + 1}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
