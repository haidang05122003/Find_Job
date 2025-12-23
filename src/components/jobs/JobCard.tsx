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
        info('Đã bỏ lưu', 'Đã xóa công việc khỏi danh sách yêu thích');
      } else {
        await import('@/services/job.service').then(({ jobService }) => jobService.bookmarkJob(job.id));
        info('Đã lưu công việc', 'Công việc đã được thêm vào danh sách yêu thích');
      }
      setIsBookmarked(prev => !prev);
      onBookmark?.(job.id);
    } catch (error: any) {
      console.error('Failed to update bookmark status:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      showError('Lỗi', error.message || 'Không thể cập nhật trạng thái lưu');
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
              {getJobTypeLabel(job.jobType) && (
                <div className="text-sm text-gray-500 capitalize">{getJobTypeLabel(job.jobType)}</div>
              )}
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

  // Grid Layout - Final "Even" Style with Apply Button
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block h-full"
    >
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

          {/* Heart Icon */}
          <button
            onClick={handleBookmark}
            className={`flex-shrink-0 transition-colors ${isBookmarked ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
              }`}
          >
            <svg className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
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
              {getTimeAgo(job.postedAt)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {job.applicantsCount || 0}
            </span>
          </div>

          <button
            onClick={handleApply}
            className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-600 hover:text-white dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500 dark:hover:text-white"
          >
            Ứng tuyển
          </button>
        </div>

      </div>
    </Link>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;

