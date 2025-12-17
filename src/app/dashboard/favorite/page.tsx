"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/shared/PageTransition";
import Button from "@/components/ui/button/Button";
import { BookmarkIcon } from "@/components/shared/icons";
import Pagination from "@/components/shared/Pagination";
import { fadeInVariants } from "@/lib/animations";
import { favoriteService } from "@/services/favorite.service";
import { useToast } from "@/context/ToastContext";
import type { Job } from "@/types/job";


export default function DashboardFavoriteJobsPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  const fetchFavorites = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await favoriteService.getFavorites({ page: page - 1, size: 10 });
      if (res.success && res.data) {
        setFavoriteJobs(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(currentPage);
  }, [currentPage]);

  const removeFavorite = async (jobId: string) => {
    try {
      await favoriteService.removeFavorite(jobId);
      success("Đã bỏ yêu thích công việc");
      // Refresh list
      fetchFavorites(currentPage);
    } catch (err) {
      console.error("Failed to remove favorite", err);
      error("Có lỗi xảy ra");
    }
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
          Việc làm đã lưu ({favoriteJobs.length})
        </motion.h2>

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
                    Hạn nộp
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hành động
                  </th>
                  <th className="p-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Yêu thích
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">Đang tải...</td>
                    </tr>
                  ) : favoriteJobs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">Bạn chưa lưu công việc nào.</td>
                    </tr>
                  ) : (
                    favoriteJobs.map((job, index) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img
                                src={job.company.logo || "https://placehold.co/64x64/EEE/31343C?text=JD"}
                                alt={`${job.company.name} Logo`}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/EEE/31343C?text=JD';
                                }}
                              />
                            </motion.div>
                            <div>
                              <Link href={`/jobs/${job.id}`} className="font-medium text-gray-900 dark:text-white/90 mb-1 hover:text-brand-600 dark:hover:text-brand-400">
                                {job.title}
                              </Link>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {job.company.name} • {job.location}
                              </p>
                              <p className="text-sm text-brand-500 font-medium">
                                {job.salary && job.salary.min != null && job.salary.max != null ? `${BigInt(job.salary.min).toLocaleString()} - ${BigInt(job.salary.max).toLocaleString()} VND` : "Thỏa thuận"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">

                          <span className="text-gray-600 dark:text-gray-400">
                            {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString("vi-VN") : "N/A"}
                          </span>

                        </td>
                        <td className="p-4">
                          <Link href={`/jobs/${job.id}`}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button className="text-sm py-2 px-4">
                                Apply Now
                              </Button>
                            </motion.div>
                          </Link>
                        </td>
                        <td className="p-4 text-right">
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFavorite(job.id)}
                            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 p-2 transition-colors duration-200"
                          >
                            <motion.div
                              initial={{ scale: 1 }}
                              animate={{ scale: 1 }}
                            >
                              <BookmarkIcon
                                fill="currentColor"
                                className="w-5 h-5"
                              />
                            </motion.div>
                          </motion.button>
                        </td>
                      </motion.tr>
                    )))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </motion.div>
    </PageTransition>
  );
}
