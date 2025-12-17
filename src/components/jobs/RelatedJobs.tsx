'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { getTimeAgo, formatSalary, getLocationTypeColor, getLocationTypeLabel } from '@/lib/utils/jobHelpers';
import type { Job } from '@/types/job';

interface RelatedJobsProps {
  jobs: Job[];
  currentJobId: string;
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
}

const RelatedJobs: React.FC<RelatedJobsProps> = ({
  jobs,
  currentJobId,
  onBookmark,
  onApply,
}) => {
  const router = useRouter();

  // Filter out current job
  const relatedJobs = jobs.filter(job => job.id !== currentJobId).slice(0, 3);

  if (relatedJobs.length === 0) {
    return null;
  }

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Công việc liên quan
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Tất cả công việc tương tự có thể phù hợp với bạn
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/jobs')}
        >
          Xem tất cả
        </Button>
      </div>

      <div className="space-y-4">
        {relatedJobs.map((job, index) => (
          <div
            key={job.id}
            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-500 hover:shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500 animate-fade-in-stagger"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleJobClick(job.id)}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {/* Left side - Job info */}
              <div className="flex flex-1 gap-4">
                {/* Company logo */}
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

                {/* Job details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-brand-500 dark:text-white dark:group-hover:text-brand-400">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {job.company.name}
                  </p>

                  {/* Location and time */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {getTimeAgo(job.postedAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatSalary(job.salary)}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant={getLocationTypeColor(job.locationType)} size="sm">
                      {getLocationTypeLabel(job.locationType)}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {job.jobType}
                    </Badge>
                    <Badge variant="info" size="sm">
                      {job.experienceLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-2 sm:flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark?.(job.id);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 transition hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
                  aria-label="Lưu công việc"
                >
                  <svg
                    className={`h-5 w-5 ${job.isBookmarked ? 'fill-brand-500 text-brand-500' : 'text-gray-600 dark:text-gray-400'}`}
                    fill={job.isBookmarked ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply?.(job.id);
                  }}
                >
                  Ứng tuyển
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedJobs;
