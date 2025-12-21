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
  onApply?: (jobId: string) => void;
  isSaved?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSave, onApply, isSaved = false }) => {
  const { success, warning, info } = useToast();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
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

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onApply?.(job.id);
  };

  return (
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <div
        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Featured Badge */}
        {job.isFeatured && (
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
              ⭐ {t('jobs.featuredJobs')}
            </span>
          </div>
        )}

        {/* Company Logo & Info */}
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-2xl dark:border-gray-700 overflow-hidden">
            {job.company.logo && (job.company.logo.startsWith('http') || job.company.logo.startsWith('/') || job.company.logo.length > 5) ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span>🏢</span>';
                }}
              />
            ) : (
              <span>🏢</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 dark:text-white">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {job.company.name}
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex-shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
            aria-label={saved ? t('jobs.unsaveJob') : t('jobs.saveJob')}
          >
            <svg
              className="h-5 w-5"
              fill={saved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Job Info Badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/20 dark:text-green-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatSalary(job.salary)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {getJobTypeLabel(job.jobType)}
          </span>
        </div>

        {/* Description Preview - Shows on Hover */}
        <div
          className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}
        >
          <div
            className="text-sm text-gray-600 line-clamp-3 dark:text-gray-400 [&>p]:mb-2 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: job.description || '' }}
          />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatRelativeTime(job.postedAt)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {job.applicantsCount} {t('home.stats.candidates').toLowerCase()}
            </span>
          </div>

          {/* Quick Actions - Fade in on Hover */}
          <div
            className={`flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <button
              onClick={handleApply}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Ứng tuyển
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
