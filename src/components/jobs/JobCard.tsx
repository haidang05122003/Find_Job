'use client';

import React, { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import type { Job } from '@/types/job';
import { getTimeAgo, formatSalary, getJobTypeLabel } from '@/lib/utils/jobHelpers';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface JobCardProps {
  job: Job;
  layout?: 'grid' | 'list';
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  isFeatured?: boolean;
}

const JobCard: React.FC<JobCardProps> = memo(({
  job,
  layout = 'grid',
  onBookmark,
  onApply,
}) => {
  const { isAuthenticated } = useAuth();
  const { info, error: showError } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked);

  // Mock featured status based on ID for demo purposes
  const isFeatured = job.isFeatured || (job.id.charCodeAt(0) % 3 === 0);

  const handleBookmark = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để lưu công việc này');
      return;
    }

    try {
      if (isBookmarked) {
        await import('@/services/job.service').then(({ jobService }) => jobService.unbookmarkJob(job.id));
      } else {
        await import('@/services/job.service').then(({ jobService }) => jobService.bookmarkJob(job.id));
      }
      setIsBookmarked(prev => !prev);
      onBookmark?.(job.id);
    } catch (error) {
      console.error('Failed to update bookmark status', error);
      showError('Lỗi', 'Không thể cập nhật trạng thái lưu');
    }
  }, [job.id, onBookmark, isBookmarked, isAuthenticated, info, showError]);

  const handleApply = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onApply?.(job.id);
  }, [job.id, onApply]);


  if (layout === 'list') {
    return (
      <Link
        href={`/jobs/${job.id}`}
        className="group relative block"
      >
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700">
              {job.company.logo && (job.company.logo.startsWith('http') || job.company.logo.startsWith('/')) ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-2xl">🏢</span>';
                  }}
                />
              ) : (
                <span className="text-2xl">🏢</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 px-4">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-xl text-gray-900 truncate dark:text-white group-hover:text-brand-600 transition-colors">
                  {job.title}
                </h3>
                {isFeatured && (
                  <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold dark:bg-amber-900/30 dark:text-amber-400">
                    Nổi bật
                  </span>
                )}
              </div>

              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {job.company.name}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{job.location}</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300 flex-shrink-0"></span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getTimeAgo(job.postedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-right">
              <div className="font-bold text-lg text-brand-600 dark:text-brand-400">{formatSalary(job.salary)}</div>
              <div className="text-sm text-gray-500 capitalize">{getJobTypeLabel(job.jobType)}</div>
            </div>

            <button
              onClick={handleApply}
              className="px-6 py-2.5 bg-brand-50 text-brand-600 font-bold rounded-xl hover:bg-brand-600 hover:text-white transition-all whitespace-nowrap dark:bg-brand-500/20 dark:text-brand-400 dark:hover:bg-brand-500 dark:hover:text-white"
            >
              Ứng tuyển
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Grid Layout - Redesigned to match CompanyCard
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block h-full"
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900">
        {/* Header: Logo, Company, Location */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700">
              {job.company.logo && (job.company.logo.startsWith('http') || job.company.logo.startsWith('/')) ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-2xl">🏢</span>';
                  }}
                />
              ) : (
                <span className="text-2xl">🏢</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 line-clamp-1 hover:text-brand-600 transition-colors">
                {job.company.name}
              </h4>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{job.location?.split(',')[0]}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBookmark}
            className={`flex-shrink-0 rounded-full p-2 transition-colors ${isBookmarked
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
          >
            <svg
              className="h-5 w-5"
              fill={isBookmarked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Body: Title & Meta */}
        <div className="mt-4 flex-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-brand-600 transition-colors dark:text-white">
            {job.title}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
              {getJobTypeLabel(job.jobType)}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center rounded bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                Nổi bật
              </span>
            )}
          </div>
        </div>

        {/* Footer: Salary & Apply */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
              {formatSalary(job.salary)}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              {getTimeAgo(job.postedAt)}
            </span>
          </div>

          <span className="text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400">
            Ứng tuyển →
          </span>
        </div>
      </div>
    </Link>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;

