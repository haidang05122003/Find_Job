'use client';

import React, { useState, useEffect } from 'react';
import JobGrid from '@/components/landing/JobGrid';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobFilters, { FilterState } from '@/components/jobs/JobFilters';
import Badge from '@/components/shared/Badge';
import PageBanner from '@/components/shared/PageBanner';
import { useFilters } from '@/context/FilterContext';
import { useToast } from '@/context/ToastContext';
import { jobService } from '@/services/job.service';
import { favoriteService } from '@/services/favorite.service';
import type { SearchQuery } from '@/components/jobs/JobSearchBar';

export default function JobsPage() {
  const { filters: contextFilters, updateFilter, resetFilters, activeFilterCount } = useFilters();
  const { success, info, error: toastError } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');

  // API State
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [localFilters, setLocalFilters] = useState<FilterState>({
    jobTypes: [],
    experienceLevels: [],
    salaryRange: { min: 0, max: 200000 },
    datePosted: 'all',
    locationType: [],
  });

  // Track if we need to reset page
  const [shouldResetPage, setShouldResetPage] = useState(false);

  const fetchJobs = async (pageIndex: number) => {
    setLoading(true);
    try {
      // Convert datePosted to daysAgo
      let daysAgo;
      switch (localFilters.datePosted) {
        case '24h': daysAgo = 1; break;
        case '7d': daysAgo = 7; break;
        case '30d': daysAgo = 30; break;
        default: daysAgo = undefined;
      }

      // Map filters to API params - always use size 12
      const params: any = {
        page: pageIndex,
        size: 12,
        keyword: contextFilters.searchQuery || undefined,
        location: contextFilters.location || undefined,
        category: contextFilters.category || undefined,
        minSalary: localFilters.salaryRange.min > 0 ? localFilters.salaryRange.min : undefined,
        maxSalary: localFilters.salaryRange.max > 0 && localFilters.salaryRange.max < 200000 ? localFilters.salaryRange.max : undefined,
        employmentType: localFilters.jobTypes.length > 0 ? localFilters.jobTypes[0] : undefined,
        workMethod: localFilters.locationType.length > 0 ? localFilters.locationType[0] : undefined,
        experience: localFilters.experienceLevels.length > 0 ? localFilters.experienceLevels[0] : undefined,
        daysAgo: daysAgo
      };

      console.log('Filter params:', params); // Debug log

      const response = await jobService.searchJobs(params);
      if (response.success && response.data) {
        setJobs(response.data.content);
        setCurrentPage(response.data.number);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      }
    } catch (err) {
      toastError("Không thể tải danh sách việc làm");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change - reset to page 0
  useEffect(() => {
    fetchJobs(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextFilters.searchQuery, contextFilters.location, contextFilters.category,
  localFilters.jobTypes, localFilters.experienceLevels, localFilters.salaryRange,
  localFilters.datePosted, localFilters.locationType]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchJobs(newPage);
      // Scroll to top of job list
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleSearch = (query: SearchQuery) => {
    if (query.keyword) updateFilter('searchQuery', query.keyword);
    if (query.location) updateFilter('location', query.location);
    if (query.category) updateFilter('category', query.category);
    // fetchJobs will trigger by useEffect
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setLocalFilters(newFilters);
    Object.entries(newFilters).forEach(([key, value]) => {
      updateFilter(key as keyof FilterState, value);
    });
  };

  const handleResetFilters = () => {
    setLocalFilters({
      jobTypes: [],
      experienceLevels: [],
      salaryRange: { min: 0, max: 200000 },
      datePosted: 'all',
      locationType: [],
    });
    resetFilters();
    success('Đã xóa tất cả bộ lọc');
  };



  const handleBookmark = async (jobId: string) => {
    // Find job to check status
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Optimistically update UI
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isBookmarked: !j.isBookmarked } : j));

    try {
      if (job.isBookmarked) {
        await favoriteService.removeFavorite(jobId);
        success('Đã bỏ lưu công việc');
      } else {
        await favoriteService.addFavorite(jobId);
        success('Đã lưu công việc');
      }
    } catch (error) {
      // Revert on error
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isBookmarked: job.isBookmarked } : j));
      toastError('Có lỗi xảy ra');
    }
  };

  const handleApply = () => {
    info('Chức năng ứng tuyển đang được phát triển');
  };

  const getActiveFilters = () => {
    const active: { label: string; onRemove: () => void }[] = [];

    if (contextFilters.searchQuery) {
      active.push({
        label: `Từ khóa: ${contextFilters.searchQuery}`,
        onRemove: () => updateFilter('searchQuery', ''),
      });
    }

    if (contextFilters.location) {
      active.push({
        label: `Địa điểm: ${contextFilters.location}`,
        onRemove: () => updateFilter('location', ''),
      });
    }

    if (contextFilters.category) {
      active.push({
        label: `Danh mục: ${contextFilters.category}`,
        onRemove: () => updateFilter('category', ''),
      });
    }

    // ... (rest same)
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner */}
        <PageBanner
          title="Tìm việc làm"
          subtitle="Khám phá hàng nghìn cơ hội việc làm phù hợp với bạn từ các công ty hàng đầu"
          gradient="blue"
          icon={
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* Search Bar */}
        <div className="mb-8">
          <JobSearchBar onSearch={handleSearch} />
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bộ lọc đang áp dụng:
            </span>
            {activeFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="info"
                className="flex items-center gap-2"
              >
                {filter.label}
                <button
                  onClick={filter.onRemove}
                  className="hover:text-error-500"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden w-80 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <JobFilters
                filters={localFilters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Job Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center p-12">Đang tải...</div>
            ) : (
              <>
                <JobGrid
                  initialJobs={jobs}
                  layout={layout}
                  onLayoutChange={setLayout}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onBookmark={handleBookmark}
                  onApply={handleApply}
                  disablePagination={true}
                  totalCount={totalElements}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Trước
                    </button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i;
                        } else if (currentPage < 3) {
                          pageNum = i;
                        } else if (currentPage > totalPages - 4) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pageNum === currentPage
                              ? 'bg-brand-500 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                              }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(true)}
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-theme-xl transition hover:bg-brand-600 hover:scale-110 lg:hidden"
          aria-label="Open filters"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-999999 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-theme-xl animate-slide-up dark:bg-gray-900">
            <JobFilters
              filters={localFilters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              isMobile
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
