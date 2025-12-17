"use client";

import React from "react";
import ComponentCard from "../common/ComponentCard";

import {
  applications,
  ApplicationStatusEnum,
  candidateProfiles,
  jobPosts,
} from "@/data/mockRecruitment";

const getStageLabel = (status: ApplicationStatusEnum) => {
  switch (status) {
    case ApplicationStatusEnum.REVIEWING:
      return "Đang sàng lọc";
    case ApplicationStatusEnum.INTERVIEW:
      return "Phỏng vấn";
    case ApplicationStatusEnum.HIRED:
      return "Đã nhận offer";
    case ApplicationStatusEnum.REJECTED:
      return "Đã loại";
    default:
      return "Mới ứng tuyển";
  }
};

const statusBadge = (status: ApplicationStatusEnum) => {
  if (status === ApplicationStatusEnum.INTERVIEW) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
  if (status === ApplicationStatusEnum.HIRED) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }
  if (status === ApplicationStatusEnum.REJECTED) {
    return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  }
  return "bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300";
};

const candidatesHighlight = applications
  .filter((application) =>
    [ApplicationStatusEnum.REVIEWING, ApplicationStatusEnum.INTERVIEW].includes(
      application.status
    )
  )
  .slice(0, 4)
  .map((application) => {
    const profile = candidateProfiles.find(
      (candidate) => candidate.userId === application.candidateId
    );
    const job = jobPosts.find((jobPost) => jobPost.id === application.jobId);

    return {
      id: application.id,
      application,
      name: profile?.fullName ?? "Ứng viên chưa xác định",
      position: job?.title ?? "Tin tuyển dụng",
      stage: getStageLabel(application.status),
      status: application.status,
    };
  });

type CandidatesSnapshotProps = {
  onCandidateClick?: (
    application: (typeof applications)[number],
    meta: { name: string; position: string }
  ) => void;
};

const CandidatesSnapshot: React.FC<CandidatesSnapshotProps> = ({ onCandidateClick }) => {
  return (
    <ComponentCard
      title="Ứng viên nổi bật"
      desc="Ưu tiên xử lý các hồ sơ đang ở giai đoạn sàng lọc hoặc phỏng vấn."
    >
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {candidatesHighlight.map((candidate) => (
          <button
            key={candidate.id}
            onClick={() =>
              onCandidateClick?.(candidate.application, {
                name: candidate.name,
                position: candidate.position,
              })
            }
            className="flex w-full items-center justify-between gap-3 py-4 text-left transition hover:bg-gray-50/80 first:rounded-t-2xl first:pt-4 last:rounded-b-2xl last:pb-4 dark:hover:bg-white/5"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {candidate.position} · {candidate.stage}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(candidate.status)}`}
            >
              {getStageLabel(candidate.status)}
            </span>
          </button>
        ))}
        {candidatesHighlight.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Chưa có ứng viên nào cần xử lý ngay.
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default CandidatesSnapshot;


