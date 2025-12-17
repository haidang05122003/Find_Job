"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { CheckCircleIcon } from "@/components/shared/icons";

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  dateApplied: string;
  status: "active" | "expired";
}

interface RecentJobCardProps {
  job: Job;
}

export default function RecentJobCard({ job }: RecentJobCardProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
      transition={{ duration: 0.2 }}
      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
    >
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }} className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white flex items-center justify-center">
            {job.logo && (job.logo.startsWith('http') || job.logo.startsWith('/') || job.logo.length > 5) ? (
              <img
                src={job.logo}
                alt={`${job.company} Logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-xs">🏢</span>';
                }}
              />
            ) : (
              <span className="text-xs">🏢</span>
            )}
          </motion.div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white/90">
              {job.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {job.location} • {job.salary}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
        {job.dateApplied}
      </td>
      <td className="p-4 text-sm">
        {job.status === "active" ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center text-success-600 dark:text-success-400"
          >
            <CheckCircleIcon className="w-4 h-4 mr-1" /> Đang hoạt động
          </motion.span>
        ) : (
          <span className="text-error-600 dark:text-error-400">Hết hạn</span>
        )}
      </td>
      <td className="p-4">
        <Link href={`/jobs/${job.id}`}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" className="text-sm py-2 px-4">
              Xem chi tiết
            </Button>
          </motion.div>
        </Link>
      </td>
    </motion.tr>
  );
}
