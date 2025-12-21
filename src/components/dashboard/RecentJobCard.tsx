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
      <td className="p-4 align-middle">
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white p-1">
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
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = fallbackSrc;
                  }}
                />
              );
            })()}
          </motion.div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
              {job.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {job.company} • <span className="text-brand-500/80">{job.salary}</span>
            </p>
          </div>
        </div>
      </td>
      <td className="p-4 align-middle text-sm text-gray-600 dark:text-gray-400 font-medium">
        {job.dateApplied}
      </td>
      <td className="p-4 align-middle">
        {job.status === "active" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
            Đang tuyển
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            Hết hạn
          </span>
        )}
      </td>
      <td className="p-4 align-middle text-right">
        <Link href={`/jobs/${job.id}`}>
          <Button variant="ghost" size="sm" className="text-xs hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20">
            Chi tiết
          </Button>
        </Link>
      </td>
    </motion.tr>
  );
}
