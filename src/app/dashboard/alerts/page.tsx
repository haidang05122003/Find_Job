"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/shared/PageTransition";
import Button from "@/components/ui/button/Button";
import { fadeInVariants } from "@/lib/animations";
import { jobAlertService } from "@/services/job-alert.service";
import { Job } from "@/types/job";
import { formatCurrency } from "@/lib/utils";

export default function DashboardAlertsPage() {
  const [jobAlerts, setJobAlerts] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await jobAlertService.getAlertJobs();
      if (response.success && response.data) {
        setJobAlerts(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch job alerts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysRemaining = (deadline: string | undefined) => {
    if (!deadline) return "No deadline";
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = Math.abs(deadlineDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days Remaining`;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      "full-time": "bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400",
      "part-time": "bg-warning-50 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400",
      "remote": "bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400",
      "internship": "bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
      "contract": "bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/20 dark:text-blue-light-400",
    };
    return colors[type] || colors["full-time"];
  };

  const createSampleAlert = async () => {
    // Temporary helper to allow user to test since we don't have UI for it yet
    try {
      await jobAlertService.createAlert({
        keyword: "Java",
        location: "Hồ Chí Minh",
        minSalary: 500
      });
      fetchAlerts(); // Refresh
      alert("Đã tạo mẫu thông báo việc làm (Java, HCM). Reload để xem kết quả.");
    } catch (e) {
      alert("Lỗi tạo alert mẫu");
    }
  }

  return (
    <PageTransition>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="space-y-6"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xl font-semibold text-gray-900 dark:text-white/90"
          >
            Việc làm gợi ý <span className="text-brand-500">({jobAlerts.length} tin mới)</span>
          </motion.h2>
          <motion.button
            onClick={createSampleAlert}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-brand-500 hover:text-brand-600 text-sm font-medium transition-colors"
          >
            + Tạo gợi ý mẫu
          </motion.button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Đang tải...</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="grid grid-cols-1 gap-4"
          >
            {jobAlerts.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                Chưa có việc làm nào phù hợp với gợi ý của bạn. Hãy tạo gợi ý mới!
              </div>
            )}
            {jobAlerts.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-theme-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={job.company?.logo || "/images/user/owner.jpg"}
                        alt={`${job.company?.name} Logo`}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white/90 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {job.company?.name}
                          </p>
                        </div>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getTypeBadgeColor(job.jobType)}`}
                        >
                          {job.jobType}
                        </motion.span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>📍 {job.location}</span>
                        <span>💰 {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)}</span>
                        <span>⏰ {getDaysRemaining(job.expiresAt ? job.expiresAt.toString() : undefined)}</span>
                      </div>
                      <Link href={`/jobs/${job.id}`}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-block"
                        >
                          <Button className="text-sm py-2 px-4">
                            Xem chi tiết →
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </PageTransition>
  );
}
