'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Job } from '@/types/job';
import { formatSalary, formatRelativeTime } from '@/lib/utils';
import { getJobTypeLabel } from '@/lib/utils/jobHelpers';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { t } from '@/lib/i18n';

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSave, isSaved = false }) => {
  const { success, info } = useToast();
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(isSaved);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để lưu công việc này');
      return;
    }

    setSaved(!saved);
    onSave?.(job.id);
    success(saved ? t('jobs.jobUnsaved') : t('jobs.jobSaved'));
  };

  return (
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <div className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900">

        <div className="flex items-start gap-4 mb-3">
          {/* Logo */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white p-1 dark:border-gray-700 shadow-sm mt-1">
            {job.company.logo && (job.company.logo.startsWith('http') || job.company.logo.startsWith('/')) ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="h-full w-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-2xl">🏢</span>';
                }}
              />
            ) : (
              <span className="text-2xl">🏢</span>
            )}
          </div>

          <div className="flex flex-1 flex-col min-w-0">
            {/* Title - Fixed Height 2 Lines */}
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors dark:text-white mb-1 min-h-[3rem]" title={job.title}>
              {job.title}
            </h3>

            {/* Company Name */}
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-3">
              {job.company.name}
            </h4>
          </div>

          {/* Save Icon */}
          <button
            onClick={handleSave}
            className={`flex-shrink-0 transition-colors ${saved ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
              }`}
            aria-label={saved ? t('jobs.unsaveJob') : t('jobs.saveJob')}
          >
            <svg
              className="h-5 w-5"
              fill={saved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Tags Section - Fixed Min Height for Alignment (approx 2 rows) */}
        <div className="mb-4 flex flex-wrap items-start gap-2 min-h-[60px] content-start">
          {/* Location Tag */}
          <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <svg className="mr-1 h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location?.split(',')[0]}
          </span>

          {/* Salary Tag */}
          <span className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <svg className="mr-1 h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatSalary(job.salary, { short: true, upTo: true })}
          </span>

          {/* Job Type Tag */}
          {getJobTypeLabel(job.jobType) && (
            <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <svg className="mr-1 h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {getJobTypeLabel(job.jobType)}
            </span>
          )}
        </div>

        {/* Footer: Time & Apply Button */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatRelativeTime(job.postedAt)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {job.applicantsCount || 0} {t('home.stats.candidates').toLowerCase()}
            </span>
          </div>

          <button
            className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-600 hover:text-white dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500 dark:hover:text-white"
          >
            Ứng tuyển
          </button>
        </div>
      </div>
    </Link>
  );
};
export default JobCard;
