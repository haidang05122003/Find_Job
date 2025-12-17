'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import JobCard from '@/components/landing/JobCard';
import Button from '@/components/shared/Button';
import type { Job } from '@/types/job';

interface FeaturedJobsProps {
  jobs: Job[];
  title?: string;
  subtitle?: string;
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
}

const FeaturedJobs: React.FC<FeaturedJobsProps> = ({
  jobs,
  title = 'Việc làm nổi bật',
  subtitle = 'Khám phá các cơ hội việc làm tốt nhất từ các công ty hàng đầu',
  onBookmark,
  onApply,
}) => {
  const router = useRouter();

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900 sm:py-20 overflow-visible">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-visible">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/jobs')}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            }
            iconPosition="right"
          >
            Xem tất cả
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className="animate-fade-in-stagger"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <JobCard
                job={job}
                onSave={onBookmark}
                onApply={onApply}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
