"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import Pagination from "@/components/shared/Pagination";
import CompanyCard from "@/components/shared/CompanyCard";
import PageBanner from "@/components/shared/PageBanner";
import type { Company } from "@/types/company";
import { companyService } from "@/services/company.service";
import { PAGINATION } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";

export default function BrowseEmployersPage() {
  const { error: toastError } = useToast();

  // API State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<{
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  }>({
    page: 0,
    size: PAGINATION.DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
  });

  // UI State
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Filter State
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const fetchCompanies = useCallback(async (pageIndex = 0) => {
    setLoading(true);
    try {
      const params = {
        page: pageIndex,
        size: PAGINATION.DEFAULT_PAGE_SIZE,
        keyword: searchKeyword || undefined,
        industry: selectedIndustry || undefined,
        location: selectedLocation || undefined,
      };

      const response = await companyService.searchCompanies(params);
      if (response.success && response.data) {
        setCompanies(response.data.content);
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        });
      }
    } catch (err) {
      toastError("Không thể tải danh sách công ty");
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, selectedIndustry, selectedLocation, toastError]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handlePageChange = (page: number) => {
    // Pagination component uses 1-indexed, API uses 0-indexed
    fetchCompanies(page - 1);
  };

  const handleFilterChange = (type: 'industry' | 'location', value: string) => {
    if (type === 'industry') {
      setSelectedIndustry(prev => prev === value ? "" : value);
    } else {
      setSelectedLocation(prev => prev === value ? "" : value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner */}
        <PageBanner
          title="Khám phá các công ty hàng đầu"
          subtitle="Tìm kiếm cơ hội việc làm từ các nhà tuyển dụng uy tín và đáng tin cậy nhất"
          gradient="purple"
          icon={
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />

        {/* Search Bar */}
        <div className="mb-8">
          <SearchFilterBar
            onSearch={setSearchKeyword}
            placeholder="Tìm kiếm theo tên công ty..."
            locationValue={selectedLocation}
            onLocationChange={setSelectedLocation}
            locations={[
              "Hà Nội", "Hồ Chí Minh", "Đà Nẵng",
              "Hải Phòng", "Cần Thơ", "Bình Dương",
              "Đồng Nai", "Bắc Ninh", "Hưng Yên",
              "Vĩnh Phúc", "Khánh Hòa", "Quảng Ninh"
            ]}
          />
        </div>

        {/* Main Content */}
        <main className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? (
                "Đang tải..."
              ) : (
                <>
                  Hiển thị <span className="font-semibold">{companies.length}</span> / {pagination.totalElements} công ty
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLayout('list')}
                className={`rounded-lg border p-2 transition ${layout === 'list'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                aria-label="List view"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setLayout('grid')}
                className={`rounded-lg border p-2 transition ${layout === 'grid'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                aria-label="Grid view"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải...</span>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Không tìm thấy công ty</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Chưa có công ty nào được đăng ký hoặc không có kết quả phù hợp.
              </p>
            </div>
          ) : (
            <>
              <div className={`overflow-visible relative ${layout === 'grid'
                ? 'grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'flex flex-col gap-4'
                }`}>
                {companies.map((emp) => (
                  <CompanyCard key={emp.id} company={emp} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.page + 1}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={pagination.size}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
