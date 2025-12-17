"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import RichTextEditor from "../ui/editor/RichTextEditor";
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

// --- Components ---

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

const InterviewInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<InterviewApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { error: toastError, success: toastSuccess } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<InterviewApplication | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sending, setSending] = useState(false);

  // Fetch applications
  useEffect(() => {
    const fetchInterviewApplications = async () => {
      setLoading(true);
      try {
        const jobsRes = await hrService.getMyJobs({ page: 0, size: 100 });
        if (jobsRes.success && jobsRes.data?.content) {
          const allApplications: InterviewApplication[] = [];
          for (const job of jobsRes.data.content) {
            try {
              const appsRes = await applicationService.getJobApplications(String(job.id), {
                status: "APPROVED",
                page: 0,
                size: 50
              });
              if (appsRes.success && appsRes.data?.content) {
                appsRes.data.content.forEach((app: Application) => {
                  allApplications.push({
                    id: app.id,
                    candidateName: app.candidateName,
                    candidateEmail: app.candidateEmail || "N/A",
                    jobTitle: app.jobTitle,
                    appliedAt: app.appliedAt,
                    status: "Chưa gửi",
                  });
                });
              }
            } catch (e) { console.error(e); }
          }
          setInvitations(allApplications);
        }
      } catch (err) {
        console.error(err);
        toastError("Không thể tải danh sách");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewApplications();
  }, []);

  // Auto-open modal if applicationId is in query params
  const searchParams = useSearchParams();
  const autoOpenId = searchParams.get("applicationId");

  useEffect(() => {
    if (autoOpenId && invitations.length > 0 && !isModalOpen) {
      const targetInvite = invitations.find(inv => inv.id === autoOpenId);
      if (targetInvite && targetInvite.status !== "Đã gửi") {
        handleCompose(targetInvite);
        // Optional: Clean up URL
        // router.replace("/hr/interview-invitations"); 
      }
    }
  }, [invitations, autoOpenId]);

  // Handle opening modal
  const handleCompose = (invite: InterviewApplication) => {
    setSelectedInvite(invite);
    setEmailSubject(`Thư mời phỏng vấn - ${invite.jobTitle}`);

    // Pre-fill template
    let content = defaultTemplate;
    content = content.replace("{{candidateName}}", invite.candidateName);
    content = content.replace("{{jobTitle}}", invite.jobTitle);
    setEmailContent(content.replace(/\n/g, '<br/>'));

    setIsModalOpen(true);
  };

  const handleSend = async () => {
    if (!selectedInvite) return;
    setSending(true);
    try {
      const response = await applicationService.inviteInterview(selectedInvite.id, {
        subject: emailSubject,
        customEmailContent: emailContent,
        body: { // Fallback/Dummy body to satisfy type
          interview_details: { time: "", location: "", format: "onsite" }
        }
      }, true); // sendEmail = true

      if (response.success) {
        toastSuccess(`Đã gửi thư mời cho ${selectedInvite.candidateName}`);
        setInvitations(prev => prev.filter(inv => inv.id !== selectedInvite.id));
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
        title="Quản lý Phỏng vấn"
        desc="Danh sách ứng viên đã vào vòng phỏng vấn. Hãy soạn và gửi thư mời cho họ."
      >
        {loading ? (
          <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Chưa có ứng viên nào cần phỏng vấn.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-white/5 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ứng viên</th>
                  <th className="px-4 py-3 font-semibold">Vị trí</th>
                  <th className="px-4 py-3 font-semibold">Ngày ứng tuyển</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-semibold">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {invitations.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{invite.candidateName}</div>
                      <div className="text-xs text-gray-500">{invite.candidateEmail}</div>
                    </td>
                    <td className="px-4 py-3">{invite.jobTitle}</td>
                    <td className="px-4 py-3">{formatDate(invite.appliedAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={invite.status} /></td>
                    <td className="px-4 py-3 text-right">
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
