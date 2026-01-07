"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import RichTextEditor from "../ui/editor/RichTextEditor";
import { render } from "@react-email/render";
import { InterviewInvitation } from "../../../emails/InterviewInvitation";
import { hrService } from "@/services/hr.service";
import { applicationService, Application } from "@/services/application.service";
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";
import Portal from "../common/Portal";

// --- Interfaces ---
interface InterviewApplication {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string; // Added field
  appliedAt: string;
  status: string;
}

// --- Default Template ---
const defaultTemplate = `Kính gửi {{candidateName}},

Chúng tôi rất ấn tượng với hồ sơ ứng tuyển vị trí {{jobTitle}} của bạn.
Chúng tôi trân trọng mời bạn tham gia buổi phỏng vấn để trao đổi thêm về cơ hội nghề nghiệp tại công ty.

Thông tin chi tiết:
- Thời gian: [Vui lòng nhập thời gian]
- Địa điểm: [Vui lòng nhập địa điểm hoặc link online]
- Hình thức: [Trực tiếp / Online]

Vui lòng phản hồi email này để xác nhận sự tham gia của bạn.

Trân trọng,
Bộ phận Tuyển dụng`;

import { PAGINATION } from "@/lib/constants";

// --- Components ---

// --- Interface for Grouping ---
interface JobGroup {
  jobId: string;
  jobTitle: string;
  candidates: InterviewApplication[];
}

// Email Variables
const EMAIL_VARIABLES = [
  { label: "Tên ứng viên", value: "{{candidateName}}" },
  { label: "Vị trí ứng tuyển", value: "{{jobTitle}}" },
  { label: "Tên công ty", value: "{{companyName}}" },
];

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${status === "Đã gửi"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
      : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"
      }`}
  >
    {status}
  </span>
);

// Helper to construct full image URL
// Helper to construct full image URL
const getLogoUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;

  // Clean path
  let cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Ensure uploads/ prefix if not present (heuristic for this project)
  // This handles keys like "uuid.png" stored without directory
  if (!cleanPath.startsWith("uploads/")) {
    cleanPath = `uploads/${cleanPath}`;
  }

  // Get base URL (fallback to localhost:8080 for dev)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

  return `${baseUrl}/${cleanPath}`;
};

const InterviewInvitations: React.FC = () => {
  const [jobGroups, setJobGroups] = useState<JobGroup[]>([]);
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
  const { error: toastError, success: toastSuccess } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<InterviewApplication | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sending, setSending] = useState(false);

  // Fetch applications
  const fetchInterviewApplications = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const jobsRes = await hrService.getMyJobs({ page: pageIndex, size: PAGINATION.DEFAULT_PAGE_SIZE });
      if (jobsRes.success && jobsRes.data) {
        setPagination({
          page: jobsRes.data.number,
          size: jobsRes.data.size,
          totalPages: jobsRes.data.totalPages,
          totalElements: jobsRes.data.totalElements,
        });

        const groups: JobGroup[] = [];

        for (const job of jobsRes.data.content) {
          const currentCandidates: InterviewApplication[] = [];

          // Fetch APPROVED (Chưa gửi)
          try {
            const pendingRes = await applicationService.getJobApplications(String(job.id), {
              status: "APPROVED",
              page: 0,
              size: 50
            });
            if (pendingRes.success && pendingRes.data?.content) {
              pendingRes.data.content.forEach((app: Application) => {
                currentCandidates.push({
                  id: app.id,
                  candidateName: app.candidateName,
                  candidateEmail: app.candidateEmail || "N/A",
                  jobTitle: app.jobTitle,
                  companyName: app.companyName || "Your Company",
                  companyLogo: getLogoUrl(app.companyLogo),
                  appliedAt: app.appliedAt,
                  status: "Chưa gửi",
                });
              });
            }
          } catch (e) { console.error(e); }

          // Fetch INTERVIEW (Đã gửi)
          try {
            const sentRes = await applicationService.getJobApplications(String(job.id), {
              status: "INTERVIEW",
              page: 0,
              size: 50
            });
            if (sentRes.success && sentRes.data?.content) {
              sentRes.data.content.forEach((app: Application) => {
                currentCandidates.push({
                  id: app.id,
                  candidateName: app.candidateName,
                  candidateEmail: app.candidateEmail || "N/A",
                  jobTitle: app.jobTitle,
                  companyName: app.companyName || "Your Company",
                  companyLogo: getLogoUrl(app.companyLogo),
                  appliedAt: app.appliedAt,
                  status: "Đã gửi",
                });
              });
            }
          } catch (e) { console.error(e); }

          // Only add group if it has candidates
          if (currentCandidates.length > 0) {
            groups.push({
              jobId: String(job.id),
              jobTitle: job.title,
              candidates: currentCandidates
            });
          }
        }
        setJobGroups(groups);
      }
    } catch (err) {
      console.error(err);
      toastError("Không thể tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewApplications(0);
  }, []);

  // Auto-open modal if applicationId is in query params
  const searchParams = useSearchParams();
  const autoOpenId = searchParams.get("applicationId");

  useEffect(() => {
    if (autoOpenId && jobGroups.length > 0 && !isModalOpen) {
      let targetHelper: InterviewApplication | undefined;
      for (const group of jobGroups) {
        targetHelper = group.candidates.find(c => c.id === autoOpenId);
        if (targetHelper) break;
      }

      if (targetHelper && targetHelper.status !== "Đã gửi") {
        handleCompose(targetHelper);
        // Optional: Clean up URL
        // router.replace("/hr/interview-invitations"); 
      }
    }
  }, [jobGroups, autoOpenId]);

  // Handle opening modal
  const handleCompose = (invite: InterviewApplication) => {
    setSelectedInvite(invite);
    setEmailSubject(`Thư mời phỏng vấn - ${invite.jobTitle}`);

    // Pre-fill template
    let content = defaultTemplate;
    // We keep placeholders in the editor content, they will be replaced on send
    setEmailContent(content.replace(/\n/g, '<br/>'));

    setIsModalOpen(true);
  };

  const handleSend = async () => {
    if (!selectedInvite) return;
    setSending(true);
    try {
      let processedHmtl = emailContent;
      processedHmtl = processedHmtl.replace(/{{candidateName}}/g, selectedInvite.candidateName);
      processedHmtl = processedHmtl.replace(/{{jobTitle}}/g, selectedInvite.jobTitle);
      processedHmtl = processedHmtl.replace(/{{companyName}}/g, selectedInvite.companyName);

      const emailHtml = await render(
        <InterviewInvitation
          companyName={selectedInvite.companyName}
          companyLogo={selectedInvite.companyLogo}
          hrMessage={processedHmtl}
        />
      );

      const response = await applicationService.inviteInterview(selectedInvite.id, {
        subject: emailSubject,
        customEmailContent: emailHtml,
        body: { // Fallback/Dummy body to satisfy type
          interview_details: { time: "", location: "", format: "onsite" }
        }
      }, true); // sendEmail = true

      if (response.success) {
        toastSuccess(`Đã gửi thư mời cho ${selectedInvite.candidateName}`);

        // Update status locally in the nested structure
        setJobGroups(prevGroups => prevGroups.map(group => ({
          ...group,
          candidates: group.candidates.map(c =>
            c.id === selectedInvite.id ? { ...c, status: "Đã gửi" } : c
          )
        })));

        setIsModalOpen(false);
      }
    } catch (err) {
      toastError("Gửi thư thất bại");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Thư mời phỏng vấn"
        desc="Danh sách ứng viên đã vào vòng phỏng vấn."
      >
        {loading ? (
          <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>
        ) : jobGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Chưa có ứng viên nào cần phỏng vấn trong trang này.</div>
        ) : (
          <div className="space-y-8">
            {jobGroups.map(group => (
              <div key={group.jobId} className="border rounded-xl border-gray-100 overflow-hidden dark:border-gray-800">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 dark:bg-gray-800/50 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    {group.jobTitle}
                    <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                      {group.candidates.length} ứng viên
                    </span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="text-xs uppercase text-gray-500 bg-white dark:bg-gray-900/50 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Ứng viên</th>
                        <th className="px-6 py-3 font-semibold">Ngày ứng tuyển</th>
                        <th className="px-6 py-3 font-semibold">Trạng thái</th>
                        <th className="px-6 py-3 text-right font-semibold">Tác vụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {group.candidates.map((invite) => (
                        <tr key={invite.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                          <td className="px-6 py-3">
                            <div className="font-medium text-gray-900 dark:text-white">{invite.candidateName}</div>
                            <div className="text-xs text-gray-500">{invite.candidateEmail}</div>
                          </td>
                          <td className="px-6 py-3">{formatDate(invite.appliedAt)}</td>
                          <td className="px-6 py-3"><StatusBadge status={invite.status} /></td>
                          <td className="px-6 py-3 text-right">
                            <button
                              onClick={() => handleCompose(invite)}
                              disabled={invite.status === "Đã gửi"}
                              className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {invite.status === "Đã gửi" ? "Đã gửi" : "Gửi thư mời"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị tin tuyển dụng trang {pagination.page + 1} / {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchInterviewApplications(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                    {pagination.page + 1}
                  </span>
                  <button
                    onClick={() => fetchInterviewApplications(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </ComponentCard>

      {/* --- Portal-based Modal --- */}
      {isModalOpen && selectedInvite && (
        <Portal>
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl dark:bg-gray-900 max-h-[90vh] animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Soạn thư mời phỏng vấn
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {/* To Info */}
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-20 shrink-0 font-medium">Gửi đến:</div>
                    <div className="font-medium text-gray-900 dark:text-white">{selectedInvite.candidateName} &lt;{selectedInvite.candidateEmail}&gt;</div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Tiêu đề email</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Nội dung</label>
                    <RichTextEditor
                      content={emailContent}
                      onChange={setEmailContent}
                      placeholder="Nội dung thư mời..."
                      className="min-h-[300px]"
                      variables={EMAIL_VARIABLES}
                    />
                    <div className="text-xs text-gray-500">Mẹo: Hãy thay thế [thời gian] và [địa điểm] bằng thông tin thực tế.</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-70"
                >
                  {sending ? "Đang gửi..." : "Gửi thư mời"}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default InterviewInvitations;
