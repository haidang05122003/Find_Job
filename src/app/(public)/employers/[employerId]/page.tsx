"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Company } from '@/types/company';
import { Job } from '@/types/job';
import { companyService } from '@/services/company.service';
import { jobService } from '@/services/job.service';
import CompanyJobCard from '@/components/company/CompanyJobCard';

export default function EmployerDetailPage() {
  const params = useParams();
  const router = useRouter();
  // Support both id param names just in case
  const id = (params.employerId || params.id) as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // 1. Fetch Company Info
        const companyRes = await companyService.getCompanyDetail(id);
        if (companyRes.success && companyRes.data) {
          setCompany(companyRes.data);
        } else {
          setError('Không tìm thấy thông tin công ty');
          return;
        }

        // 2. Fetch Jobs by Company
        const jobsRes = await jobService.searchJobs({ companyId: id, size: 20 });
        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data.content);
        }
      } catch (err) {
        console.error(err);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  const handleSearch = async () => {
    try {
      const jobsRes = await jobService.searchJobs({
        companyId: id,
        title: searchKeyword,
        location: locationFilter
      });
      if (jobsRes.success && jobsRes.data) {
        setJobs(jobsRes.data.content);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Không tìm thấy công ty</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{error || 'Vui lòng kiểm tra lại đường dẫn'}</p>
        <Link href="/jobs" className="mt-4 inline-block text-brand-500 hover:underline">Quay lại danh sách việc làm</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 1. Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex text-sm font-medium" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="text-gray-500 hover:text-gray-700">Trang chủ</Link></li>
              <li><span className="text-gray-300">/</span></li>
              <li><Link href="/companies" className="text-gray-500 hover:text-gray-700">Công ty</Link></li>
              <li><span className="text-gray-300">/</span></li>
              <li className="text-brand-600 truncate max-w-[200px]">{company.name}</li>
            </ol>
          </nav>
        </div>

        {/* 2. Header Section */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 mb-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden shadow-sm">
          {/* Banner Area */}
          <div className="h-48 md:h-64 relative bg-gray-200">
            {company.coverImage ? (
              <Image
                src={company.coverImage}
                alt="Cover"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
          </div>

          {/* Content on Banner */}
          <div className="relative z-10 px-6 pb-6 -mt-20 flex flex-col md:flex-row gap-6 items-end">
            {/* Logo Box */}
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-xl border-4 border-white dark:border-gray-800 bg-white shadow-lg overflow-hidden flex-shrink-0">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={`${company.name} Logo`}
                  width={160}
                  height={160}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400 text-4xl">🏢</div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1 pb-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{company.name}</h1>

              <div className="flex flex-wrap gap-3 text-sm font-medium">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-1.5 rounded-full text-gray-700 dark:text-gray-300 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                )}

                <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-1.5 rounded-full text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  {company.companySize || 'Quy mô: N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Left Column (Content) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Intro Section - Redesigned Green Header Style */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-brand-600 to-brand-700 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">Giới thiệu công ty</h2>
              </div>
              <div className="p-6">
                <div className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? '' : 'max-h-[200px]'}`}>
                  <div
                    className="prose prose-gray max-w-none dark:prose-invert text-gray-800 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: company.description || 'Chưa có thông tin giới thiệu.' }}
                  />
                  {!isExpanded && (
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-gray-900 pointer-events-none" />
                  )}
                </div>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold mt-4 text-sm hover:underline transition-colors"
                >
                  {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Jobs Section */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-brand-600 to-brand-700 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">Tuyển dụng</h2>
                <span className="text-xs font-bold text-brand-700 bg-white px-3 py-1 rounded-full shadow-sm">{jobs.length} vị trí</span>
              </div>
              <div className="p-6">
                {/* Search & Filter */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      placeholder="Tìm việc làm..."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all text-sm"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <select
                    className="md:w-56 pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all text-sm appearance-none cursor-pointer"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="">Tất cả địa điểm</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">TP.HCM</option>
                  </select>
                  <button
                    onClick={handleSearch}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    Tìm kiếm
                  </button>
                </div>

                {/* Job List */}
                <div className="space-y-4">
                  {jobs.length > 0 ? (
                    jobs.map(job => (
                      <div key={job.id} className="border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-brand-200 bg-white dark:bg-gray-800 group">
                        <CompanyJobCard job={job} />
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy công việc nào</h3>
                      <p className="text-gray-500 max-w-sm mx-auto">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Contact Info Box */}
              <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-brand-600 to-brand-700 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Thông tin liên hệ</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Địa chỉ trụ sở</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{company.address || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* General Info */}
              <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-brand-600 to-brand-700 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Thông tin chung</h3>
                </div>
                <div className="p-6 space-y-0 text-sm">
                  <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800 first:pt-0">
                    <span className="text-gray-500">Quy mô công ty</span>
                    <span className="font-medium text-gray-900 dark:text-white bg-gray-50 px-3 py-1 rounded-full">{company.companySize || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 transition-colors -mx-2 px-2 rounded-lg cursor-pointer">
                    <span className="text-gray-500">Website</span>
                    <a href={company.website || '#'} target="_blank" className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700 truncate max-w-[150px]">
                      {company.website ? company.website.replace(/^https?:\/\//, '') : 'N/A'}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
