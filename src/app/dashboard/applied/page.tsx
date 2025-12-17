"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/shared/PageTransition";
import Button from "@/components/ui/button/Button";
import { CheckCircleIcon } from "@/components/shared/icons";
import Pagination from "@/components/shared/Pagination";
import { fadeInVariants } from "@/lib/animations";
import { applicationService, Application } from "@/services/application.service";
import { PAGINATION } from "@/lib/constants";

const statusIcon = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "offered" || s === "hired") {
    return <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />;
  }
  if (s === "interview" || s === "shortlisted") {
    return <CheckCircleIcon className="w-4 h-4 mr-1 text-amber-500" />;
  }
  if (s === "rejected") {
    return (
      <svg className="w-4 h-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  if (s === "withdrawn") {
    return (
      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    );
  }
  return <CheckCircleIcon className="w-4 h-4 mr-1 text-blue-500" />;
};

const statusLabel = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "pending": return "Chờ xem xét";
    case "reviewing": return "Đang xem xét";
    case "shortlisted": return "Lọt vào danh sách";
    case "interview": return "Đang phỏng vấn";
    case "offered": return "Nhận Offer";
    case "rejected": return "Bị từ chối";
    case "withdrawn": return "Đã rút";
    case "hired": return "Được tuyển";
    default: return status;
  }
};

const statusColor = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "offered" || s === "hired") return "text-green-600 dark:text-green-400";
  if (s === "interview" || s === "shortlisted") return "text-amber-600 dark:text-amber-400";
  if (s === "rejected") return "text-red-600 dark:text-red-400";
  if (s === "withdrawn") return "text-gray-500 dark:text-gray-400";
  return "text-blue-600 dark:text-blue-400";
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

  const fetchApplications = useCallback(async (pageIndex = 0) => {
    setLoading(true);
    try {
      const response = await applicationService.getHistory({
        page: pageIndex,
        size: PAGINATION.DEFAULT_PAGE_SIZE,
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
    // Pagination component uses 1-indexed, API uses 0-indexed
    fetchApplications(page - 1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PageTransition>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="space-y-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xl font-semibold text-gray-900 dark:text-white/90 mb-6"
        >
          Việc đã ứng tuyển {pagination.totalElements > 0 && `(${pagination.totalElements})`}
        </motion.h2>

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
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Chưa có đơn ứng tuyển</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Bạn chưa ứng tuyển vào công việc nào. Hãy bắt đầu tìm kiếm việc làm phù hợp!
            </p>
            <Link href="/jobs">
              <Button className="mt-4">
                Tìm việc ngay
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-theme-md transition-shadow duration-300"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Công việc
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ngày ứng tuyển
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {applications.map((app, index) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm"
                            >
                              {app.companyName?.charAt(0)?.toUpperCase() || "C"}
                            </motion.div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white/90">
                                {app.jobTitle}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {app.companyName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(app.appliedAt)}
                        </td>
                        <td className="p-4 text-sm">
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className={`flex items-center ${statusColor(app.status)}`}
                          >
                            {statusIcon(app.status)}
                            {statusLabel(app.status)}
                          </motion.span>
                        </td>
                        <td className="p-4">
                          <Link href={`/jobs/${app.jobId}`}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button variant="outline" className="text-sm py-2 px-4">
                                Xem chi tiết
                              </Button>
                            </motion.div>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Pagination
                  currentPage={pagination.page + 1}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </PageTransition>
  );
}
