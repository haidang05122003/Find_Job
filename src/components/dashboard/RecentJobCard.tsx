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
  status: string;
}

interface RecentJobCardProps {
  job: Job;
}

import { memo } from "react";

function RecentJobCard({ job }: RecentJobCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group flex items-center gap-4 p-4 mb-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-500/20 hover:shadow-md transition-all duration-200"
    >
      {/* Logo */}
      <div className="shrink-0">
        <div className="w-12 h-12 rounded-lg border border-gray-100 dark:border-gray-800 bg-white p-1 flex items-center justify-center overflow-hidden">
          {(() => {
            const getImageUrl = (path: string | undefined | null) => {
              if (!path) return null;
              if (path.startsWith('http') || path.startsWith('data:')) return path;
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
              const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
              return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
            };
            const logoSrc = getImageUrl(job.logo);
            const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=128`;
            return (
              <img
                src={logoSrc || fallbackSrc}
                alt={`${job.company} Logo`}
                className="w-full h-full object-contain rounded-md"
                onError={(e) => { e.currentTarget.src = fallbackSrc; }}
                loading="lazy"
              />
            );
          })()}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <Link href={`/jobs/${job.id}`} className="font-bold text-gray-900 dark:text-white truncate hover:text-brand-600 transition-colors">
            {job.title}
          </Link>
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
            {(() => {
              if (!job.dateApplied) return "";
              try {
                const d = new Date(job.dateApplied);
                // Check if date is valid
                if (isNaN(d.getTime())) return job.dateApplied;
                return d.toLocaleDateString("vi-VN");
              } catch (e) {
                return "";
              }
            })()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate pr-2">
            {job.company}
          </p>

          {/* Status Badge */}
          {(() => {
            const s = job.status?.toLowerCase();
            let badgeClass = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
            let label = "Hết hạn";

            if (s === 'pending') {
              badgeClass = "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
              label = "Chờ duyệt";
            } else if (s === 'approved') {
              badgeClass = "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
              label = "Đã duyệt";
            } else if (s === 'interview') {
              badgeClass = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
              label = "Phỏng vấn";
            } else if (['active', 'hired', 'offered'].includes(s)) {
              badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
              label = s === 'hired' ? 'Đã trúng tuyển' : s === 'offered' ? 'Offer' : 'Đang tuyển';
            } else if (s === 'rejected') {
              badgeClass = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800";
              label = "Đã từ chối";
            }

            return (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-transparent ${badgeClass}`}>
                {label}
              </span>
            );
          })()}
        </div>
      </div>
    </motion.div >
  );
}

export default memo(RecentJobCard);
