"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { adminService } from "@/services/admin.service";
import JobDetailModal from "./JobDetailModal";
import type { Job } from "@/types/job";

const JobApprovalQueue: React.FC = () => {
  const [queuedJobs, setQueuedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await adminService.getPendingJobs({ page: 0, size: 10 });
      if (res.data) setQueuedJobs(res.data.content);
    } catch (error) {
      console.error("Failed to fetch pending jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApprove = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await adminService.approveJob(id, { action });
      setShowModal(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (error) {
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const openDetailModal = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  if (loading) {
    return (
      <ComponentCard title="Duyệt tin tuyển dụng" desc="Đang tải dữ liệu...">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </ComponentCard>
    );
  }

  return (
    <>
      <ComponentCard
        title="Duyệt tin tuyển dụng"
        desc="Kiểm duyệt tin mới của doanh nghiệp trước khi hiển thị công khai."
      >
        <div className="space-y-4">
          {queuedJobs.length > 0 ? (
            queuedJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-gray-100 p-5 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl dark:bg-gray-800 overflow-hidden">
                    {job.company?.logo && job.company.logo.length > 5 ? (
                      <img src={job.company.logo} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <span>🏢</span>
                    )}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {job.company?.name || job.companyName}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                        {new Date(job.createdAt || job.postedAt || Date.now()).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    {/* Quick Info Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location || "Chưa xác định"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.salary?.min && job.salary?.max
                          ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                          : "Thỏa thuận"}
                      </span>
                      {job.experience && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                          {job.experience}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => openDetailModal(job)}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Xem chi tiết
                        </span>
                      </button>
                      <button
                        onClick={() => handleApprove(job.id, 'APPROVE')}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                      >
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => handleApprove(job.id, 'REJECT')}
                        className="rounded-xl border border-red-200 dark:border-red-800 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Không có tin nào chờ duyệt.</p>
            </div>
          )}
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
