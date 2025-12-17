'use client';

import React, { useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import type { Job } from '@/types/job';
import { getTimeAgo, formatSalary, getLocationTypeColor, getLocationTypeLabel } from '@/lib/utils/jobHelpers';

interface JobCardProps {
  job: Job;
  layout?: 'grid' | 'list';
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = memo(({
  job,
  layout = 'grid',
  onBookmark,
  onApply,
}) => {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked);

  const handleBookmark = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(prev => !prev);
    onBookmark?.(job.id);
  }, [job.id, onBookmark]);

  const handleApply = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  }, [job.id, onApply]);

  const handleCardClick = useCallback(() => {
    router.push(`/jobs/${job.id}`);
  }, [router, job.id]);

  if (layout === 'list') {
    return (
      <Card
        hover
        padding="md"
        onClick={handleCardClick}
        className="group cursor-pointer"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-blue-light-50 text-3xl dark:from-brand-500/10 dark:to-blue-light-500/10 overflow-hidden border border-gray-100 dark:border-gray-800">
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
              <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-brand-500 dark:text-white dark:group-hover:text-brand-400">
                {job.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {job.company.name}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getTimeAgo(job.postedAt)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={getLocationTypeColor(job.locationType)} size="sm">
                  {getLocationTypeLabel(job.locationType)}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {job.jobType}
                </Badge>
                <Badge variant="info" size="sm">
                  {job.experience}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 sm:flex-shrink-0">
            <div className="text-right">
              <div className="text-lg font-bold text-brand-500">
                {formatSalary(job.salary)}
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {job.applicantsCount} ứng viên
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleBookmark}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 transition hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
                aria-label="Bookmark job"
              >
                <svg
                  className={`h-5 w-5 ${isBookmarked ? 'fill-brand-500 text-brand-500' : 'text-gray-600 dark:text-gray-400'}`}
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <Button size="sm" onClick={handleApply}>
                Ứng tuyển
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      hover
      padding="md"
      onClick={handleCardClick}
      className="group flex h-full cursor-pointer flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-blue-light-50 text-2xl dark:from-brand-500/10 dark:to-blue-light-500/10 overflow-hidden border border-gray-100 dark:border-gray-800">
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

        <button
          onClick={handleBookmark}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Bookmark job"
        >
          <svg
            className={`h-5 w-5 ${isBookmarked ? 'fill-brand-500 text-brand-500' : 'text-gray-400'}`}
            fill={isBookmarked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="font-semibold text-gray-900 transition line-clamp-2 group-hover:text-brand-500 dark:text-white dark:group-hover:text-brand-400">
          {job.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {job.company.name}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="truncate">{job.location}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant={getLocationTypeColor(job.locationType)} size="sm">
            {getLocationTypeLabel(job.locationType)}
          </Badge>
          <Badge variant="neutral" size="sm">
            {job.jobType}
          </Badge>
          <Badge variant="info" size="sm">
            {job.experience}
          </Badge>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
        <div>
          <div className="font-bold text-brand-500">
            {formatSalary(job.salary)}
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {getTimeAgo(job.postedAt)}
          </div>
        </div>
        <Button size="sm" onClick={handleApply}>
          Ứng tuyển
        </Button>
      </div>
    </Card>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
