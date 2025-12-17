"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import Pagination from "@/components/shared/Pagination";
import CandidateCard from "@/components/shared/CandidateCard";
import PageBanner from "@/components/shared/PageBanner";
import { candidateService, PublicCandidateResponse } from "@/services/candidate.service";
import { PAGINATION } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";

export default function CandidatesPage() {
  const { error: toastError } = useToast();

  // API State
  const [candidates, setCandidates] = useState<PublicCandidateResponse[]>([]);
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
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const fetchCandidates = useCallback(async (pageIndex = 0) => {
    setLoading(true);
    try {
      const params = {
        page: pageIndex,
        size: PAGINATION.DEFAULT_PAGE_SIZE,
        keyword: searchKeyword || undefined,
        location: selectedLocation || undefined,
      };

      const response = await candidateService.searchCandidates(params);
      if (response.success && response.data) {
        setCandidates(response.data.content);
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        });
      }
    } catch (err) {
      toastError("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, selectedLocation, toastError]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handlePageChange = (page: number) => {
    fetchCandidates(page - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner */}
        <PageBanner
          title="Tìm ứng viên tài năng"
          subtitle="Khám phá hàng nghìn ứng viên chất lượng cao với kỹ năng chuyên môn xuất sắc"
          gradient="green"
          icon={
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        {/* Search Bar */}
        <div className="mb-8">
          <SearchFilterBar
            onSearch={setSearchKeyword}
            placeholder="Tìm kiếm ứng viên theo tên, kỹ năng..."
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

        <main className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? (
                "Đang tải..."
              ) : (
                <>
                  Hiển thị <span className="font-semibold">{candidates.length}</span> / {pagination.totalElements} ứng viên
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
          ) : candidates.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Không tìm thấy ứng viên</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Chưa có ứng viên nào phù hợp với tìm kiếm của bạn.
              </p>
            </div>
          ) : (
            <>
              <div className={`overflow-visible relative ${layout === 'grid'
                ? 'grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'flex flex-col gap-4'
                }`}>
                {candidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate as any} />
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


