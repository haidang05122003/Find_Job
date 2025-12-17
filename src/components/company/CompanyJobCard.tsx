import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import { Job } from '@/types/job';
import { formatSalary, getTimeAgo } from '@/lib/utils/jobHelpers';

interface CompanyJobCardProps {
    job: Job;
    onApply?: (jobId: string) => void;
    onBookmark?: (jobId: string) => void;
}

const CompanyJobCard: React.FC<CompanyJobCardProps> = ({ job, onApply, onBookmark }) => {
    return (
        <div className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-gray-100 dark:border-gray-600 bg-white p-2 flex items-center justify-center overflow-hidden">
                    {job.company.logo && (job.company.logo.startsWith('http') || job.company.logo.startsWith('/') || job.company.logo.length > 5) ? (
                        <img
                            src={job.company.logo}
                            alt={job.company.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-2xl">🏢</span>';
                            }}
                        />
                    ) : (
                        <span className="text-2xl">🏢</span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <Link href={`/jobs/${job.id}`} className="block group-hover:text-brand-600 transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                                {job.title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Thoả thuận
                            </span>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                            <span className="text-brand-600 dark:text-brand-400 font-medium">{job.company.name}</span>
                        </p>
                    </div>

                    <div className="text-right hidden sm:block">
                        <span className="text-brand-600 dark:text-brand-400 font-bold block">{formatSalary(job.salary)}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs">
                        {job.location}
                    </span>
                    <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs hidden sm:inline-block">
                        Còn {Math.max(0, Math.ceil((new Date(job.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} ngày để ứng tuyển
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 sm:items-end mt-2 sm:mt-0 flex-shrink-0">
                <span className="text-brand-600 dark:text-brand-400 font-bold sm:hidden">{formatSalary(job.salary)}</span>

                <Button
                    className="flex-1 sm:flex-none bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-2 rounded"
                    onClick={() => onApply?.(job.id)}
                >
                    Ứng tuyển
                </Button>
                <button
                    className="p-2 border border-brand-200 rounded text-brand-600 hover:bg-brand-50 transition-colors"
                    onClick={() => onBookmark?.(job.id)}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CompanyJobCard;
