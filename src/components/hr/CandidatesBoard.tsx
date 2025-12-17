"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ComponentCard from "../common/ComponentCard";
import { applicationService, Application } from "@/services/application.service";
import { hrService } from "@/services/hr.service";
import { useToast } from "@/context/ToastContext";
import CVPreviewModal from "../common/CVPreviewModal";
import CandidateProfileModal from "../common/CandidateProfileModal"; // Imported Modal
import { PAGINATION } from "@/lib/constants";

const statusColor = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "interview" || s === "reviewing") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
  if (s === "rejected" || s === "withdrawn") {
    return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  }
  if (s === "offered" || s === "hired") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  if (s === "shortlisted") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
  }
  if (s === "approved") {
    return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300";
  }
  return "bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300";
};

const statusLabel = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "applied": return "Chờ duyệt";
    case "pending": return "Chờ duyệt";
    case "reviewing": return "Đang xem xét";
    case "shortlisted": return "Lọt vào danh sách";
    case "approved": return "Đã duyệt";
    case "interview": return "Đang phỏng vấn";
    case "offered": return "Đã gửi offer";
    case "rejected": return "Đã từ chối";
    case "withdrawn": return "Đã rút";
    case "hired": return "Đã tuyển";
    default: return status;
  }
};

interface Job {
  id: string;
  title: string;
}

const CandidatesBoard: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobIdFromUrl = searchParams.get("jobId");
  const { error: toastError, success: toastSuccess } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobIdFromUrl || "");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loadingCV, setLoadingCV] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{ page: number; size: number; totalPages: number; totalElements: number }>({
    page: 0,
    size: PAGINATION.DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
  });

  // State for Profile Modal
  const [selectedProfileApp, setSelectedProfileApp] = useState<Application | null>(null);

  // Fetch jobs list
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await hrService.getMyJobs({ page: 0, size: 100 });
        if (response.success && response.data) {
          setJobs(response.data.content.map(j => ({ id: j.id.toString(), title: j.title })));
          if (!selectedJobId && response.data.content.length > 0) {
            setSelectedJobId(response.data.content[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, []);

  const fetchApplications = useCallback(async (pageIndex = 0) => {
    if (!selectedJobId) return;

    setLoading(true);
    try {
      const params: any = {
        page: pageIndex,
        size: PAGINATION.DEFAULT_PAGE_SIZE,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await applicationService.getJobApplications(selectedJobId, params);
      if (response.success && response.data) {
        setApplications(response.data.content);
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
  }, [selectedJobId, statusFilter, toastError]);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplications();
    }
  }, [selectedJobId, statusFilter, fetchApplications]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const response = await applicationService.updateStatus(applicationId, newStatus);
      if (response.success) {
        toastSuccess("Cập nhật trạng thái thành công");
        fetchApplications(pagination.page);
      }
    } catch (err) {
      toastError("Không thể cập nhật trạng thái");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // --- CV Preview Logic ---
  const [cvPreview, setCvPreview] = useState<{ url: string | null; name: string; originalUrl?: string }>({ url: null, name: "" });

  const handleViewCV = async (cvUrl: string, candidateName: string) => {
    // Case 1: External URL - just open
    if (cvUrl.startsWith("http") && !cvUrl.includes("localhost")) {
      setCvPreview({ url: cvUrl, name: candidateName, originalUrl: cvUrl });
      return;
    }

    // Case 2: Internal/Protected URL - fetch blob
    setLoadingCV(candidateName);
    try {
      const fullUrl = cvUrl.startsWith("http") ? cvUrl : `http://localhost:8080${cvUrl}`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(fullUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error("Failed to load CV");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setCvPreview({ url: blobUrl, name: candidateName, originalUrl: cvUrl }); // Pass original URL for extension check
    } catch (err) {
      toastError("Không thể tải CV. Vui lòng thử lại.");
    } finally {
      setLoadingCV(null);
    }
  };

  return (
    <ComponentCard
      title="Ứng viên"
      desc="Danh sách ứng viên, trạng thái và quản lý quy trình tuyển dụng."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">-- Chọn tin tuyển dụng --</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            {[
              { value: "all", label: "Tất cả" },
              { value: "APPLIED", label: "Chờ duyệt" },
              { value: "APPROVED", label: "Đã duyệt" },
              { value: "INTERVIEW", label: "Phỏng vấn" },
              { value: "OFFERED", label: "Offer" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${statusFilter === opt.value
                  ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => fetchApplications(0)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
        >
          <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {!selectedJobId ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Chọn tin tuyển dụng</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Vui lòng chọn một tin tuyển dụng để xem danh sách ứng viên.
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Chưa có ứng viên</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Chưa có ứng viên nào ứng tuyển vào tin này.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="pb-3 font-semibold">Ứng viên</th>
                  <th className="pb-3 font-semibold">Tin ứng tuyển</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold">Ngày ứng tuyển</th>
                  <th className="pb-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5">
                    <td className="py-3">
                      <div>
                        <button
                          onClick={() => setSelectedProfileApp(app)}
                          className="font-medium text-gray-900 hover:text-brand-600 hover:underline dark:text-white dark:hover:text-brand-400 text-left"
                        >
                          {app.candidateName}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {app.candidateEmail}
                        </p>
                      </div>
                    </td>
                    <td className="py-3">{app.jobTitle}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(app.status)}`}
                      >
                        {statusLabel(app.status)}
                      </span>
                    </td>
                    <td className="py-3">{formatDate(app.appliedAt)}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedProfileApp(app)}
                          className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                        >
                          Xem hồ sơ
                        </button>

                        {app.cvUrl && (
                          <button
                            onClick={() => handleViewCV(app.cvUrl!, app.candidateName)}
                            disabled={loadingCV === app.candidateName}
                            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-brand-500 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300 disabled:opacity-50"
                          >
                            {loadingCV === app.candidateName ? "..." : "Xem CV"}
                          </button>
                        )}

                        {app.status.toLowerCase() === "applied" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app.id, "APPROVED")}
                              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700"
                            >
                              Duyệt hồ sơ
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, "REJECTED")}
                              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-500 hover:bg-red-50 dark:border-gray-700"
                            >
                              Từ chối
                            </button>
                          </>
                        )}

                        {/* 
                          REMOVED Invite and Offer buttons as per user request. 
                          The workflow is now simplified to Applied -> Approved/Rejected.
                          Subsequent actions (Interviews, etc.) are handled in dedicated pages.
                        */}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {applications.length} / {pagination.totalElements} ứng viên
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchApplications(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300"
                >
                  Trước
                </button>
                <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                  {pagination.page + 1} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchApplications(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300"
                >
                  Sau
                </button>
              </div>
            </div>
          )}

          <CVPreviewModal
            isOpen={!!cvPreview.url}
            onClose={() => setCvPreview({ url: null, name: "" })}
            cvUrl={cvPreview.url}
            candidateName={cvPreview.name}
            originalUrl={cvPreview.originalUrl}
          />

          <CandidateProfileModal
            isOpen={!!selectedProfileApp}
            onClose={() => setSelectedProfileApp(null)}
            candidateId={selectedProfileApp?.candidateId || ""}
            applicationData={selectedProfileApp ? { email: selectedProfileApp.candidateEmail, name: selectedProfileApp.candidateName } : undefined}
          />
        </>
      )}

    </ComponentCard>
  );
};

export default CandidatesBoard;
