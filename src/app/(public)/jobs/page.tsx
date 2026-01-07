'use client';

import React, { useState, useEffect, useMemo } from 'react';
import JobGrid from '@/components/landing/JobGrid';
import JobSearchBar, { SearchQuery } from '@/components/jobs/JobSearchBar';
import PageBanner from '@/components/shared/PageBanner';
import { FilterState } from '@/components/jobs/AdvanceFilter';
import { useFilters } from '@/context/FilterContext';
import { useToast } from '@/context/ToastContext';
import { jobService } from '@/services/job.service';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import JobSearchSkeleton from '@/components/jobs/JobSearchSkeleton';

export default function JobsPage() {
  const { filters: contextFilters, updateFilter, resetFilters, setFilters } = useFilters();
  const { error: toastError } = useToast();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await jobService.getLocations();
        if (response.success && response.data) {
          setAvailableLocations(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch locations");
      }
    };
    fetchLocations();
  }, []);

  // ... (rest of code)


  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  const [localFilters, setLocalFilters] = useState<FilterState>({
    jobTypes: [],
    experienceLevels: [],
    jobLevels: [],
    salaryRange: { min: 0, max: 0 },
    datePosted: 'all',
    locationType: [],
  });

  // Calculate active tags for display
  const activeTags = useMemo(() => {
    const tags: { label: string; type: string; value: any }[] = [];

    if (contextFilters.searchQuery) tags.push({ label: `Tìm: ${contextFilters.searchQuery}`, type: 'searchQuery', value: contextFilters.searchQuery });
    if (contextFilters.locations && contextFilters.locations.length > 0) tags.push({ label: contextFilters.locations[0], type: 'location', value: contextFilters.locations[0] });
    if (contextFilters.categories && contextFilters.categories.length > 0) tags.push({ label: contextFilters.categories[0], type: 'category', value: contextFilters.categories[0] });

    localFilters.jobTypes.forEach(type => {
      // Map value to label if possible, here using simple mapping or value
      const labelMap: Record<string, string> = {
        'FULL_TIME': 'Toàn thời gian',
        'PART_TIME': 'Bán thời gian',
        'CONTRACT': 'Hợp đồng',
        'INTERNSHIP': 'Thực tập',
        'REMOTE': 'Làm từ xa',
        'TEMPORARY': 'Tạm thời'
      };
      tags.push({ label: labelMap[type] || type, type: 'jobTypes', value: type });
    });

    localFilters.experienceLevels.forEach(exp => {
      const labelMap: Record<string, string> = {
        'Không yêu cầu': 'Mới tốt nghiệp / Thực tập',
        'Dưới 1 năm': '1 - 2 Năm',
        '1 năm': '2 - 4 Năm',
        '3 năm': '4 - 6 Năm',
        '5 năm': '6 - 8 Năm',
        'Trên 5 năm': '10 - 15 Năm',
        'Expert': 'Trên 15 Năm'
      }
      tags.push({ label: labelMap[exp] || exp, type: 'experienceLevels', value: exp });
    });

    localFilters.jobLevels.forEach(level => {
      const labelMap: Record<string, string> = {
        'INTERN': 'Thực tập sinh',
        'STAFF': 'Nhân viên',
        'TEAM_LEADER': 'Trưởng nhóm',
        'MANAGER': 'Trưởng phòng',
        'DIRECTOR': 'Giám đốc',
        'VICE_PRESIDENT': 'Phó chủ tịch'
      }
      tags.push({ label: labelMap[level] || level, type: 'jobLevels', value: level });
    });

    if (localFilters.salaryRange.min > 0 || (localFilters.salaryRange.max > 0 && localFilters.salaryRange.max < 100000000)) {
      const min = localFilters.salaryRange.min > 0 ? `${(localFilters.salaryRange.min / 1000000).toLocaleString('vi-VN')}Tr` : '0';
      const max = localFilters.salaryRange.max > 0 && localFilters.salaryRange.max < 100000000 ? `${(localFilters.salaryRange.max / 1000000).toLocaleString('vi-VN')}Tr` : '∞';
      tags.push({ label: `${min} - ${max} VND`, type: 'salaryRange', value: 'salary' });
    }

    return tags;
  }, [contextFilters, localFilters]);


  const fetchJobs = async (pageIndex: number) => {
    setLoading(true);
    try {
      let daysAgo;
      switch (localFilters.datePosted) {
        case '24h': daysAgo = 1; break;
        case '7d': daysAgo = 7; break;
        case '30d': daysAgo = 30; break;
        default: daysAgo = undefined;
      }

      const params: any = {
        page: pageIndex,
        size: pageSize,
        keyword: contextFilters.searchQuery || undefined,
        location: contextFilters.locations?.[0] || undefined,
        category: contextFilters.categories?.[0] || undefined,
        minSalary: localFilters.salaryRange.min > 0 ? localFilters.salaryRange.min : undefined,
        maxSalary: localFilters.salaryRange.max > 0 ? localFilters.salaryRange.max : undefined,
        employmentType: localFilters.jobTypes.length > 0 ? localFilters.jobTypes[0] : undefined,
        workMethod: localFilters.locationType.length > 0 ? localFilters.locationType[0] : undefined,
        experience: localFilters.experienceLevels.length > 0 ? localFilters.experienceLevels[0] : undefined,
        level: localFilters.jobLevels.length > 0 ? localFilters.jobLevels[0] : undefined,
        daysAgo: daysAgo,
        sort: sortBy === 'latest' ? 'createdAt,desc' : 'createdAt,asc'
      };

      // console.log('Fetching Jobs with params:', params);

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

  useEffect(() => {
    fetchJobs(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextFilters.searchQuery, contextFilters.locations, contextFilters.categories,
  localFilters.jobTypes, localFilters.experienceLevels, localFilters.jobLevels, localFilters.salaryRange,
  localFilters.datePosted, localFilters.locationType, pageSize, sortBy]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchJobs(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (query: SearchQuery) => {
    const newFilters = { ...contextFilters };
    if (query.keyword !== undefined) newFilters.searchQuery = query.keyword;
    if (query.location !== undefined) newFilters.locations = query.location ? [query.location] : [];
    if (query.category !== undefined) newFilters.categories = query.category ? [query.category] : [];
    setFilters(newFilters);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setLocalFilters(newFilters);
  };

  const handleResetFilters = () => {
    setLocalFilters({
      jobTypes: [],
      experienceLevels: [],
      jobLevels: [],
      salaryRange: { min: 0, max: 0 },
      datePosted: 'all',
      locationType: [],
    });
    resetFilters();
  };

  const handleRemoveTag = (tag: { label: string; type: string; value: any }) => {
    switch (tag.type) {
      case 'searchQuery': updateFilter('searchQuery', ''); break;
      case 'location': setFilters({ ...contextFilters, locations: [] }); break;
      case 'category': setFilters({ ...contextFilters, categories: [] }); break;
      case 'jobTypes':
        setLocalFilters(prev => ({
          ...prev,
          jobTypes: prev.jobTypes.filter(t => t !== tag.value)
        }));
        break;
      case 'experienceLevels':
        setLocalFilters(prev => ({
          ...prev,
          experienceLevels: prev.experienceLevels.filter(t => t !== tag.value)
        }));
        break;
      case 'jobLevels':
        setLocalFilters(prev => ({
          ...prev,
          jobLevels: prev.jobLevels.filter(t => t !== tag.value)
        }));
        break;
      case 'salaryRange':
        setLocalFilters(prev => ({
          ...prev,
          salaryRange: { min: 0, max: 0 }
        }));
        break;
    }
  };


  // Sync local filters from context (URL)
  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      jobTypes: contextFilters.jobTypes || [],
      experienceLevels: contextFilters.experienceLevels || [],
      jobLevels: contextFilters.jobLevels || [],
      salaryRange: contextFilters.salaryRange || { min: 0, max: 0 },
      datePosted: contextFilters.postedWithin || 'all' as any,
    }));
  }, [contextFilters]);

  if (loading) {
    return <JobSearchSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner */}
        <PageBanner
          title="Tìm việc làm"
          subtitle="Khám phá hàng nghìn cơ hội việc làm phù hợp với bạn từ các công ty hàng đầu"
          icon={
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* Search Bar - Clean Layout like Employers Page */}
        <div className="mb-8">
          <JobSearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            filters={localFilters}
            onResetFilters={handleResetFilters}
            locations={availableLocations}
            initialValues={{
              keyword: contextFilters.searchQuery,
              location: contextFilters.locations?.[0], // Map array to singular
              category: contextFilters.categories?.[0]
            }}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="w-full">
            {/* Toolbar: Filters (Left) & Sort (Right) */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-8">

              {/* Dynamic Active Filter Tags */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Tìm thấy <span className="text-brand-600 font-bold">{loading ? '...' : totalElements}</span> việc làm
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {activeTags.length > 0 ? (
                    activeTags.map((tag, idx) => (
                      <button
                        key={`${tag.type}-${idx}`}
                        onClick={() => handleRemoveTag(tag)}
                        className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-colors shadow-sm whitespace-nowrap"
                      >
                        {tag.label}
                        <span className="p-0.5 rounded-full hover:bg-gray-100 group-hover:bg-brand-50 group-hover:text-brand-600 text-gray-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">Chưa có bộ lọc nào được chọn</p>
                  )}
                  {activeTags.length > 0 && (
                    <button onClick={handleResetFilters} className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium ml-2">
                      Xóa tất cả
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-4 flex-shrink-0 ml-auto md:ml-0">
                <div className="relative dropdown-toggle">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center justify-between gap-3 h-[40px] pl-4 pr-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm min-w-[140px]"
                  >
                    <span>{sortBy === 'latest' ? 'Mới nhất' : 'Cũ nhất'}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <Dropdown
                    isOpen={isSortOpen}
                    onClose={() => setIsSortOpen(false)}
                    className="w-full mt-1 overflow-hidden p-1 min-w-[140px]"
                  >
                    <button
                      onClick={() => { setSortBy('latest'); setIsSortOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'latest'
                        ? 'bg-brand-50 text-brand-600 font-medium dark:bg-brand-500/10 dark:text-brand-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                    >
                      Mới nhất
                      {sortBy === 'latest' && (
                        <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => { setSortBy('oldest'); setIsSortOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === 'oldest'
                        ? 'bg-brand-50 text-brand-600 font-medium dark:bg-brand-500/10 dark:text-brand-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                    >
                      Cũ nhất
                      {sortBy === 'oldest' && (
                        <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </Dropdown>
                </div>

                <div className="relative dropdown-toggle">
                  <button
                    onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                    className="flex items-center justify-between gap-3 h-[40px] pl-4 pr-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm min-w-[140px]"
                  >
                    <span>{pageSize} tin / trang</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isPageSizeOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <Dropdown
                    isOpen={isPageSizeOpen}
                    onClose={() => setIsPageSizeOpen(false)}
                    className="w-full mt-1 overflow-hidden p-1 min-w-[140px]"
                  >
                    {[12, 24, 48].map((size) => (
                      <button
                        key={size}
                        onClick={() => { setPageSize(size); setIsPageSizeOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${pageSize === size
                          ? 'bg-brand-50 text-brand-600 font-medium dark:bg-brand-500/10 dark:text-brand-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                      >
                        {size} tin / trang
                        {pageSize === size && (
                          <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </Dropdown>
                </div>

                <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 h-[40px] items-center">
                  <button
                    onClick={() => setLayout('grid')}
                    className={`p-1.5 rounded ${layout === 'grid' ? 'bg-gray-100 dark:bg-gray-700 text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setLayout('list')}
                    className={`p-1.5 rounded ${layout === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>


          </div>

          {/* Job Grid */}
          <main>
            {loading ? (
              <JobSearchSkeleton />
            ) : (
              <>
                <JobGrid
                  initialJobs={jobs}
                  layout={layout}
                  onLayoutChange={setLayout}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  disablePagination={true}
                  totalCount={totalElements}
                  hideHeader={true}
                />

                {/* Custom Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i;
                      else if (currentPage < 3) pageNum = i;
                      else if (currentPage > totalPages - 4) pageNum = totalPages - 5 + i;
                      else pageNum = currentPage - 2 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${pageNum === currentPage
                            ? 'bg-brand-600 text-white shadow-lg scale-110'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                            }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
