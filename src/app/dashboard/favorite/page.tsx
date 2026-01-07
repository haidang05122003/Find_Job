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
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
          >
            Việc làm đã lưu <span className="text-lg font-medium text-gray-500 ml-2">({favoriteJobs.length})</span>
          </motion.h2>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 space-y-4"
              >
                <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">Đang tải danh sách...</p>
              </motion.div>
            ) : favoriteJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"
              >
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookmarkIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chưa có công việc nào</h3>
                <p className="text-gray-500 mb-6">Bạn chưa lưu công việc nào vào danh sách yêu thích.</p>
                <Link href="/jobs">
                  <Button>Khám phá việc làm ngay</Button>
                </Link>
              </motion.div>
            ) : (
              favoriteJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-brand-500/20 dark:hover:border-brand-500/20 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Logo */}
                    <Link href={`/jobs/${job.id}`} className="shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-gray-100 dark:border-gray-800 bg-white p-2 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={job.company.logo || "https://placehold.co/80x80/EEE/31343C?text=JD"}
                          alt={job.company.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/EEE/31343C?text=JD';
                          }}
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-lg font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <p className="text-base font-medium text-gray-600 dark:text-gray-400 mt-1 mb-3">
                            {job.company.name}
                          </p>
                        </div>

                        {/* Remove Button for Desktop */}
                        <button
                          onClick={() => removeFavorite(job.id)}
                          className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Bỏ lưu"
                        >
                          <BookmarkIcon className="w-5 h-5 fill-current" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-semibold text-xs border border-brand-100 dark:border-brand-800">
                          {job.salary && job.salary.min != null && job.salary.max != null
                            ? `${BigInt(job.salary.min).toLocaleString()} - ${BigInt(job.salary.max).toLocaleString()} VND`
                            : "Thỏa thuận"}
                        </span>
                        <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium">
                          {job.location}
                        </span>
                        <span className="flex items-center px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs font-medium">
                          Hạn: {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString("vi-VN") : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Actions Mobile/Desktop */}
                    <div className="flex items-center justify-between sm:flex-col sm:justify-center sm:border-l sm:border-gray-100 sm:dark:border-gray-800 sm:pl-5 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 dark:border-gray-800 sm:border-t-0">
                      <button
                        onClick={() => removeFavorite(job.id)}
                        className="sm:hidden flex items-center gap-2 text-sm text-gray-500 hover:text-red-600"
                      >
                        <BookmarkIcon className="w-4 h-4 fill-current" />
                        <span>Bỏ lưu</span>
                      </button>

                      <Link href={`/jobs/${job.id}`} className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto whitespace-nowrap px-6 shadow-brand-500/20 hover:shadow-brand-500/30">
                          Ứng tuyển ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center pt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </motion.div>
    </PageTransition>
  );
}
