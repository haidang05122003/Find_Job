'use client';

import React from 'react';
import { Job } from '@/types/job';

import { formatSalary } from '@/lib/utils/jobHelpers';
import Button from '@/components/shared/Button';

interface JobDetailHeaderProps {
  job: Job;
  onApply: () => void;
  onSave: () => void;
  isSaved: boolean;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({
  job,
  onApply,
  onSave,
  isSaved,
}) => {
  const handleSave = () => {
    onSave();
  };

  const daysLeft = Math.ceil((new Date(job.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
        {job.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Salary */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Mức lương</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">
              {formatSalary(job.salary)}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Địa điểm</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg truncate max-w-[200px]" title={job.location}>
              {job.location}
            </p>
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Kinh nghiệm</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">
              {job.experience}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">
            Hạn nộp hồ sơ: <span className="font-medium">{new Date(job.expiresAt).toLocaleDateString('vi-VN')}</span>
          </span>
          {daysLeft > 0 && (
            <span className="text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
              Còn {daysLeft} ngày
            </span>
          )}
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <Button
            onClick={onApply}
            className="flex-1 md:flex-none px-8 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded"
          >
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Ứng tuyển ngay
          </Button>
          <button
            onClick={handleSave}
            className={`px-4 py-2.5 rounded border font-medium transition-colors flex items-center gap-2 ${isSaved
              ? 'border-brand-500 text-brand-500 bg-brand-50'
              : 'border-brand-500 text-brand-500 hover:bg-brand-50 bg-white'
              }`}
          >
            <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isSaved ? 'Đã lưu' : 'Lưu tin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailHeader;
