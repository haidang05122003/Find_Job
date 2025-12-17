"use client";

import React from "react";
import ComponentCard from "../common/ComponentCard";

import {
  ApplicationStatusEnum,
  applications,
} from "@/data/mockRecruitment";

const totalApplications = applications.length || 1;

const pipelineStages: {
  id: ApplicationStatusEnum;
  stage: string;
  status: ApplicationStatusEnum;
  highlight?: boolean;
}[] = [
  { id: ApplicationStatusEnum.APPLIED, stage: "Ứng tuyển", status: ApplicationStatusEnum.APPLIED },
  { id: ApplicationStatusEnum.REVIEWING, stage: "Sàng lọc", status: ApplicationStatusEnum.REVIEWING },
  { id: ApplicationStatusEnum.INTERVIEW, stage: "Phỏng vấn", status: ApplicationStatusEnum.INTERVIEW, highlight: true },
  { id: ApplicationStatusEnum.HIRED, stage: "Đề nghị", status: ApplicationStatusEnum.HIRED },
  { id: ApplicationStatusEnum.REJECTED, stage: "Loại", status: ApplicationStatusEnum.REJECTED },
];

const calculatePercentage = (status: ApplicationStatusEnum) => {
  const count = applications.filter(
    (application) => application.status === status
  ).length;
  return Math.round((count / totalApplications) * 100);
};

type RecruitmentPipelineProps = {
  onStageClick?: (status: ApplicationStatusEnum) => void;
};

const RecruitmentPipeline: React.FC<RecruitmentPipelineProps> = ({ onStageClick }) => {
  return (
    <ComponentCard
      title="Pipeline tuyển dụng"
      desc="Tỷ lệ ứng viên ở từng giai đoạn theo dữ liệu hiện tại."
    >
      <div className="space-y-5">
        {pipelineStages.map(({ id, stage, status, highlight }) => {
          const percentage = calculatePercentage(status);
          const count = applications.filter(
            (application) => application.status === status
          ).length;

          return (
            <button
              key={stage}
              className="w-full space-y-2 rounded-xl border border-transparent p-3 text-left transition hover:border-brand-200 hover:bg-brand-50/60 dark:hover:border-brand-500/20 dark:hover:bg-brand-500/10"
              onClick={() => onStageClick?.(id)}
            >
              <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                <span>{stage}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {count} ứng viên · {percentage}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full rounded-full ${
                    highlight ? "bg-brand-500" : "bg-gray-400 dark:bg-gray-600"
                  } transition-all duration-500`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </ComponentCard>
  );
};

export default RecruitmentPipeline;


