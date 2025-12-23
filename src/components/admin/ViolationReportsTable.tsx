"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { adminService } from "@/services/admin.service";
import { Report } from "@/services/report.service";
import ReportActionModal from "./ReportActionModal";
import Pagination from "../shared/Pagination";

const statusBadge = (status: string) => {
  if (status === "RESOLVED") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  if (status === "PENDING") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
  return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
};

const statusLabels: Record<string, string> = {
  PENDING: "Chờ xử lý",
  RESOLVED: "Đã xử lý",
  DISMISSED: "Đã bỏ qua",
};

const REPORT_REASONS: Record<string, string> = {
  spam: 'Tin tuyển dụng spam',
  misleading: 'Thông tin sai lệch',
  fraud: 'Lừa đảo',
  inappropriate: 'Nội dung không phù hợp',
  harassment: 'Quấy rối',
  other: 'Lý do khác'
};

const ViolationReportsTable: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  // Modal state
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const fetchReports = async (page: number) => {
    setLoading(true);
    try {
      const params: any = { page: page - 1, size: 10 };
      if (status) params.status = status;
      if (type) params.type = type;

      const res = await adminService.getReports(params);
      if (res.data) {
        setReports(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, status, type]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openActionModal = (report: Report) => {
    setSelectedReport(report);
    setShowActionModal(true);
  };

  const handleResolve = async (id: string, status: 'RESOLVED' | 'DISMISSED', action: string) => {
    try {
      await adminService.resolveReport(id, { status, action });
      setShowActionModal(false);
      setSelectedReport(null);
      fetchReports(currentPage);
    } catch (error) {
      console.error("Failed to resolve report:", error);
      alert("Không thể xử lý báo cáo. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <ComponentCard
        title="Báo cáo vi phạm"
        desc="Theo dõi báo cáo từ ứng viên và nhà tuyển dụng, xử lý theo SLA."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
              className="rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300"
            >
              <option value="">Trạng thái</option>
              <option value="PENDING">Đang xử lý</option>
              <option value="RESOLVED">Đã xử lý</option>
              <option value="DISMISSED">Đã bỏ qua</option>
            </select>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setCurrentPage(1); }}
              className="rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs text-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:text-gray-300"
            >
              <option value="">Loại báo cáo</option>
              <option value="JOB">Tin tuyển dụng</option>
              <option value="COMPANY">Công ty</option>
              <option value="USER">Người dùng</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="mt-6 w-full min-w-[720px] text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <tr>
                <th className="pb-3 font-semibold">Người báo cáo</th>
                <th className="pb-3 font-semibold">Đối tượng</th>
                <th className="pb-3 font-semibold">Lý do</th>
                <th className="pb-3 font-semibold">Thời gian</th>
                <th className="pb-3 font-semibold">Trạng thái</th>
                <th className="pb-3 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Đang tải...</td></tr>
              ) : reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">
                      {report.reporterName || report.reporterId}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {report.targetType === 'JOB' || report.targetType === 'JOB_POSTING' ? 'Tin tuyển dụng' :
                            report.targetType === 'COMPANY' ? 'Công ty' :
                              report.targetType === 'USER' ? 'Người dùng' : report.targetType}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={(report as any).targetName || `#${report.targetId}`}>
                          {(report as any).targetName || `#${report.targetId}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 max-w-[150px] truncate" title={report.reason}>
                      {REPORT_REASONS[report.reason] || report.reason}
                    </td>
                    <td className="py-3">{new Date(report.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(report.status)}`}
                      >
                        {statusLabels[report.status] || report.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {report.status === 'PENDING' ? (
                        <button
                          onClick={() => openActionModal(report)}
                          className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors"
                        >
                          Xử lý
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="text-center py-4">Không có báo cáo nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </ComponentCard>

      {/* Action Modal */}
      {selectedReport && (
        <ReportActionModal
          isOpen={showActionModal}
          onClose={() => {
            setShowActionModal(false);
            setSelectedReport(null);
          }}
          report={selectedReport}
          onSubmit={handleResolve}
        />
      )}
    </>
  );
};

export default ViolationReportsTable;
