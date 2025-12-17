'use client';

import React from 'react';
import Badge from '@/components/shared/Badge';
import type { Job } from '@/types/job';

interface JobDetailProps {
  job: Job;
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return `${Math.floor(days / 30)} tháng trước`;
  };

  const formatSalary = () => {
    const { min, max, period } = job.salary;
    const periodText = period === 'month' ? '/tháng' : period === 'year' ? '/năm' : '/giờ';
    
    if (min === max) {
      return `$${min.toLocaleString()}${periodText}`;
    }
    return `$${min.toLocaleString()} - $${max.toLocaleString()}${periodText}`;
  };

  return (
    <div className="space-y-8">
      {/* Job Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Company Logo */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-blue-light-50 text-4xl dark:from-brand-500/10 dark:to-blue-light-500/10">
            {job.company.logo}
          </div>

          {/* Job Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {job.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {job.company.name}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {getTimeAgo(job.postedAt)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {job.applicantsCount} ứng viên
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="success">{job.locationType}</Badge>
              <Badge variant="neutral">{job.jobType}</Badge>
              <Badge variant="info">{job.experienceLevel}</Badge>
              <Badge variant="warning">{job.category}</Badge>
            </div>

            <div className="mt-6">
              <div className="text-2xl font-bold text-brand-500">
                {formatSalary()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Mô tả công việc
        </h2>
        <p className="mt-4 text-gray-700 leading-relaxed dark:text-gray-300">
          {job.description}
        </p>
      </div>

      {/* Requirements */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Yêu cầu
        </h2>
        <ul className="mt-4 space-y-3">
          {job.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Responsibilities */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Trách nhiệm
        </h2>
        <ul className="mt-4 space-y-3">
          {job.responsibilities.map((resp, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-blue-light-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{resp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Quyền lợi
        </h2>
        <ul className="mt-4 space-y-3">
          {job.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      {job.tags.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Kỹ năng yêu cầu
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <Badge key={index} variant="neutral" size="md">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
