'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import JobCard from '../jobs/JobCard';
import Pagination from '../shared/Pagination';
import { Job } from '@/types/job';
import { useFilters } from '@/context/FilterContext';
import { featuredJobs } from '@/data/jobs';
import { sortJobs, filterJobsBySearch } from '@/lib/utils/jobHelpers';

interface JobGridProps {
  initialJobs?: Job[];
  layout?: 'grid' | 'list';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  sortBy?: string;
  onSortChange?: (sortBy: string) => void;
  onBookmark?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  disablePagination?: boolean; // When true, show all jobs without internal pagination
  totalCount?: number; // Optional: total count from API for display
}

const JobGrid: React.FC<JobGridProps> = ({
  initialJobs = featuredJobs,
  layout = 'grid',
  onLayoutChange,
  sortBy = 'latest',
  onSortChange,
  onBookmark,
  onApply,
  disablePagination = false,
  totalCount,
}) => {
  const { filters } = useFilters();
  const [isLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // When disablePagination=true (API handles pagination), just use initialJobs directly
  // When disablePagination=false (client-side pagination), apply filters and sorting
  const processedJobs = useMemo(() => {
    // If using API pagination, return jobs as-is from API
    if (disablePagination) {
      return initialJobs;
    }

    // Client-side filtering and sorting
    let result = [...initialJobs];
    if (filters.searchQuery) {
      result = filterJobsBySearch(result, filters.searchQuery);
    }
    result = sortJobs(result, sortBy);
    return result;
  }, [initialJobs, filters.searchQuery, sortBy, disablePagination]);

  // For display purposes
  const displayJobs = disablePagination
    ? initialJobs  // Use raw jobs from API
    : processedJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalJobs = totalCount ?? (disablePagination ? initialJobs.length : processedJobs.length);
  const totalPages = disablePagination ? 1 : Math.ceil(processedJobs.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (processedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Không tìm thấy công việc
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hiển thị <span className="font-semibold">{displayJobs.length}</span> trong tổng số{' '}
          <span className="font-semibold">{totalJobs}</span> công việc
        </p>

        <div className="flex items-center gap-3">
          {onSortChange && (
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="latest">Mới nhất</option>
              <option value="salary-high">Lương cao nhất</option>
              <option value="salary-low">Lương thấp nhất</option>
            </select>
          )}

          {onLayoutChange && (
            <div className="flex gap-1 rounded-lg border border-gray-300 p-1 dark:border-gray-700">
              <button
                onClick={() => onLayoutChange('grid')}
                className={`rounded p-2 transition ${layout === 'grid'
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                aria-label="Grid view"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => onLayoutChange('list')}
                className={`rounded p-2 transition ${layout === 'list'
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                aria-label="List view"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Grid/List */}
      <div className={layout === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>
        {displayJobs.map((job: Job) => (
          <JobCard
            key={job.id}
            job={job}
            layout={layout}
            onBookmark={onBookmark}
            onApply={onApply}
          />
        ))}
      </div>

      {/* Pagination - only show internal pagination when not disabled */}
      {!disablePagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage
        />
      )}
    </div>
  );
};

export default JobGrid;
