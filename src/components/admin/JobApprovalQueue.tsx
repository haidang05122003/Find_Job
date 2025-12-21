"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { adminService } from "@/services/admin.service";
import JobDetailModal from "./JobDetailModal";
import type { Job } from "@/types/job";
import Pagination from "@/components/shared/Pagination";
import { useToast } from "@/context/ToastContext";

const JobApprovalQueue: React.FC = () => {
  const { success, error } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Pass undefined for ALL to get all statuses
      const statusParam = activeTab === 'ALL' ? undefined : activeTab;
      const res = await adminService.getAllJobs({ page: page, limit: 10, status: statusParam });
      if (res.data) {
        setJobs(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err: any) {
      console.error("Failed to fetch jobs", err);
      error("Không thể tải danh sách tin tuyển dụng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 on tab change
  }, [activeTab]);

  useEffect(() => {
    fetchJobs();
  }, [activeTab, page]);

  const handleApprove = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await adminService.approveJob(id, { action });
      success(
        action === 'APPROVE' ? 'Đã duyệt tin đăng' :
          (action === 'REJECT' ? 'Đã từ chối tin đăng' : 'Đã cập nhật trạng thái')
      );
      setShowModal(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (err: any) {
      error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const openDetailModal = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const tabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'PENDING', label: 'Chờ duyệt' },
    { id: 'APPROVED', label: 'Đã duyệt' },
    { id: 'REJECTED', label: 'Đã từ chối' },
  ];

  return (
    <>
      <ComponentCard
        title="Quản lý tin tuyển dụng"
        desc="Danh sách tất cả tin tuyển dụng trong hệ thống."
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-100 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                <th className="py-4 px-4 w-[40%]">Tin tuyển dụng / Công ty</th>
                <th className="py-4 px-4 w-[25%]">Thông tin chung</th>
                <th className="py-4 px-4 w-[15%] text-center">Trạng thái</th>
                <th className="py-4 px-4 w-[20%] text-right pr-6">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="flex gap-3"><div className="h-10 w-10 bg-gray-100 rounded" /><div className="space-y-2 flex-1"><div className="h-4 w-3/4 bg-gray-100 rounded" /><div className="h-3 w-1/2 bg-gray-100 rounded" /></div></div></td>
                    <td className="p-4"><div className="space-y-2"><div className="h-3 w-24 bg-gray-100 rounded" /><div className="h-3 w-32 bg-gray-100 rounded" /></div></td>
                    <td className="p-4"><div className="h-6 w-16 bg-gray-100 rounded mx-auto" /></td>
                    <td className="p-4"><div className="h-8 w-24 bg-gray-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden text-lg">
                          {job.companyLogo || (job.company?.logo && job.company.logo.length > 5) ? (
                            <img
                              src={job.companyLogo || job.company?.logo}
                              alt=""
                              className="h-full w-full object-contain p-0.5"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || job.company?.name || 'C')}&background=random&color=fff&size=128`;
                              }}
                            />
                          ) : (
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || job.company?.name || 'C')}&background=random&color=fff&size=128`}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          )}
                        </div>
                        <div>
                          <h4
                            className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-brand-600 transition-colors"
                            onClick={() => openDetailModal(job)}
                            title={job.title}
                          >
                            {job.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium hover:text-gray-700 dark:hover:text-gray-300">
                            {job.companyName || job.company?.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[10px] text-gray-400">
                              {new Date(job.createdAt || job.postedAt || Date.now()).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="truncate max-w-[150px]" title={job.location}>{job.location || "Chưa xác định"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {(() => {
                              const min = job.salaryMin || job.salary?.min;
                              const max = job.salaryMax || job.salary?.max;
                              if (min && max) return `${(min / 1000000).toLocaleString()} - ${(max / 1000000).toLocaleString()} triệu`;
                              if (min) return `Từ ${(min / 1000000).toLocaleString()} triệu`;
                              if (max) return `Đến ${(max / 1000000).toLocaleString()} triệu`;
                              return "Thỏa thuận";
                            })()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top text-center pt-5">
                      {job.status === 'PENDING' && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30">
                          PENDING
                        </span>
                      )}
                      {job.status === 'APPROVED' && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30">
                          APPROVED
                        </span>
                      )}
                      {job.status === 'REJECTED' && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
                          REJECTED
                        </span>
                      )}
                      {job.status === 'CLOSED' && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                          CLOSED
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-top text-right pt-5">
                      <div className="flex items-center justify-end gap-2 pr-2">
                        <button
                          onClick={() => openDetailModal(job)}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:bg-gray-800 dark:hover:border-gray-700"
                          title="Xem chi tiết"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {job.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(job.id, 'APPROVE')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:border-emerald-900/30"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleApprove(job.id, 'REJECT')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-900/30"
                            >
                              Từ chối
                            </button>
                          </>
                        )}

                        {job.status === 'APPROVED' && (
                          <button
                            onClick={() => handleApprove(job.id, 'REJECT')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-900/30"
                          >
                            Gỡ tin
                          </button>
                        )}

                        {job.status === 'REJECTED' && (
                          <button
                            onClick={() => handleApprove(job.id, 'APPROVE')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:border-emerald-900/30"
                          >
                            Duyệt lại
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                        <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p>Không tìm thấy dữ liệu phù hợp.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </ComponentCard>

      {/* Detail Modal */}
      <JobDetailModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onApprove={(id) => handleApprove(id, 'APPROVE')}
        onReject={(id) => handleApprove(id, 'REJECT')}
      />
    </>
  );
};

export default JobApprovalQueue;
