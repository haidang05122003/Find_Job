"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ComponentCard from "../common/ComponentCard";
import { hrService, HRJobResponse } from "@/services/hr.service";
import { useToast } from "@/context/ToastContext";
import { PAGINATION } from "@/lib/constants";
import ConfirmModal from "@/components/shared/ConfirmModal";

const statusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    case "PENDING":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
    case "REJECTED":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
    case "CLOSED":
    case "EXPIRED":
      return "bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300";
  }
};

const statusLabel = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
    case "ACTIVE":
      return "Đang tuyển";
    case "PENDING":
      return "Chờ duyệt";
    case "REJECTED":
      return "Bị từ chối";
    case "CLOSED":
      return "Đã đóng";
    case "EXPIRED":
      return "Hết hạn";
    default:
      return status;
  }
};

const JobPostingsTable: React.FC = () => {
  const { error: toastError, success: toastSuccess } = useToast();

  const [jobs, setJobs] = useState<HRJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<{ page: number; size: number; totalPages: number; totalElements: number }>({
    page: 0,
    size: PAGINATION.DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
  });

  // Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; jobId: number | null }>({
    isOpen: false,
    jobId: null
  });

  const fetchJobs = useCallback(async (pageIndex = 0) => {
    // ... (fetch logic remains same)
    setLoading(true);
    try {
      const params: any = {
        page: pageIndex,
        size: PAGINATION.DEFAULT_PAGE_SIZE,
      };

      if (searchTerm) {
        params.keyword = searchTerm;
      }

      const response = await hrService.getMyJobs(params);
      if (response.success && response.data) {
        setJobs(response.data.content);
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        });
      }
    } catch (err) {
      toastError("Không thể tải danh sách tin tuyển dụng");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toastError]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleChangeStatus = async (jobId: number, newStatus: string) => {
    try {
      const response = await hrService.changeJobStatus(jobId, newStatus);
      if (response.success) {
        toastSuccess("Cập nhật trạng thái thành công");
        fetchJobs(pagination.page);
      }
    } catch (err) {
      toastError("Không thể cập nhật trạng thái");
    }
  };

  const handleReopen = async (jobId: number) => {
    try {
      const response = await hrService.reopenJob(jobId);
      if (response.success) {
        toastSuccess("Đã mở lại tin tuyển dụng thành công");
        fetchJobs(pagination.page);
      }
    } catch (err) {
      toastError("Không thể mở lại tin tuyển dụng");
    }
  };

  const openDeleteModal = (jobId: number) => {
    setDeleteModal({ isOpen: true, jobId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.jobId) return;

    try {
      const response = await hrService.deleteJob(deleteModal.jobId);
      if (response.success) {
        toastSuccess("Xóa tin tuyển dụng thành công");
        fetchJobs(pagination.page);
      } else {
        toastError("Không thể xóa tin tuyển dụng");
      }
    } catch (err) {
      toastError("Không thể xóa tin tuyển dụng");
    } finally {
      setDeleteModal({ isOpen: false, jobId: null });
    }
  };

  // ... (formatDate remains same)
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <ComponentCard
      title="Tin tuyển dụng"
      desc="Quản lý danh sách tin tuyển dụng, trạng thái và số lượng ứng viên."
    >
      {/* ... (Search bar and New Job button remain same - lines 140-170) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tin tuyển dụng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs(0)}
            className="w-64 rounded-xl border border-gray-200 bg-transparent px-4 py-2 text-sm text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchJobs(0)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
          <Link
            href="/hr/job-postings/create"
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo tin mới
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Chưa có tin tuyển dụng</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Bắt đầu đăng tin tuyển dụng để tìm kiếm ứng viên phù hợp.
          </p>
          <Link
            href="/hr/job-postings/create"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo tin tuyển dụng đầu tiên
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="mt-6 w-full min-w-[720px] text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="pb-3 font-semibold">Vị trí</th>
                  <th className="pb-3 font-semibold">Ngành nghề</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold">Hết hạn</th>
                  <th className="pb-3 font-semibold text-right">Ứng viên</th>
                  <th className="pb-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5">
                    {/* ... (Columns remain same) */}
                    <td className="py-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {job.locations && job.locations.length > 0
                            ? job.locations.join(", ")
                            : job.location}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{job.categoryName}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(job.status)}`}
                      >
                        {statusLabel(job.status)}
                      </span>
                    </td>
                    <td className="py-3">{formatDate(job.deadline)}</td>
                    <td className="py-3 text-right font-medium">
                      {job.applicationsCount || 0}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          href={`/hr/job-postings/${job.id}/edit`}
                          className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300"
                        >
                          Sửa
                        </Link>
                        <Link
                          href={`/hr/candidates?jobId=${job.id}`}
                          className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300"
                        >
                          Xem CV
                        </Link>
                        {job.status === "APPROVED" || job.status === "ACTIVE" ? (
                          <button
                            onClick={() => handleChangeStatus(job.id, "CLOSED")}
                            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-orange-600 hover:border-orange-500 hover:bg-orange-50 dark:border-gray-700 dark:text-orange-400"
                          >
                            Đóng
                          </button>
                        ) : job.status === "CLOSED" ? (
                          <button
                            onClick={() => handleReopen(job.id)}
                            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-green-600 hover:border-green-500 hover:bg-green-50 dark:border-gray-700 dark:text-green-400"
                          >
                            Mở lại
                          </button>
                        ) : null}
                        <button
                          onClick={() => openDeleteModal(job.id)}
                          className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-500 hover:bg-red-50 dark:border-gray-700 dark:text-red-400"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {jobs.length} / {pagination.totalElements} tin
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchJobs(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300"
                >
                  Trước
                </button>
                <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                  {pagination.page + 1} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchJobs(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300"
                >
                  Sau
                </button>
              </div>
            </div>
          )}

          <ConfirmModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, jobId: null })}
            onConfirm={handleConfirmDelete}
            title="Xóa tin tuyển dụng"
            message="Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác."
            confirmText="Xóa vĩnh viễn"
            variant="danger"
          />
        </>
      )}
    </ComponentCard>
  );
};

export default JobPostingsTable;
